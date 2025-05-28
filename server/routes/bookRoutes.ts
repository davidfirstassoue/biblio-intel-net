import express, { Router, Request, Response } from 'express';
import axios from 'axios';
import { db } from '../database/db'; // Adjusted path to db.ts
import { typesenseClient, bookSchemaName } from '../../lib/typesenseClient'; // Added

const router: Router = express.Router();

router.get('/books', async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query('SELECT * FROM books');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching books:', error); // Log the actual error
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des livres' });
  }
});

router.post('/import', async (req: Request, res: Response) => {
  const { isbn } = req.body;

  if (!isbn) {
    return res.status(400).json({ success: false, message: 'ISBN est requis' });
  }

  try {
    // 1. Fetch data from OpenLibrary
    const openLibRes = await axios.get(`https://openlibrary.org/isbn/${isbn}.json`);
    const bookData = openLibRes.data;

    if (!bookData) {
      return res.status(404).json({ success: false, message: 'Livre non trouvé sur OpenLibrary pour cet ISBN.' });
    }

    // 2. Extract relevant data (adjust field names as per OpenLibrary's response and your DB schema)
    const title = bookData.title || 'Titre inconnu';
    // Authors are often an array of objects with a 'name' property or just an array of names
    const authors = bookData.authors?.map((author: any) => author.name || author).join(', ') || bookData.by_statement || 'Auteur inconnu';
    const publish_date = bookData.publish_date || bookData.publish_date?.[0] || null; // OpenLibrary can have various date formats
    const number_of_pages = bookData.number_of_pages || null;
    const publishers = bookData.publishers?.join(', ') || null;
    // Covers can be tricky, OpenLibrary provides cover IDs
    const cover_id = bookData.covers?.[0];
    const image_url = cover_id ? `https://covers.openlibrary.org/b/id/${cover_id}-L.jpg` : null;
    
    // Description might be an object with 'value' or just a string
    let description = 'Pas de description.';
    if (typeof bookData.description === 'string') {
      description = bookData.description;
    } else if (typeof bookData.description === 'object' && bookData.description?.value) {
      description = bookData.description.value;
    } else if (Array.isArray(bookData.description) && bookData.description.length > 0) {
       description = bookData.description[0]?.value || bookData.description[0];
    }


    // 3. Insert into MySQL database
    // Ensure column names match your 'books' table schema
    const insertQuery = `
      INSERT INTO books (isbn, titre, auteur, description, image_url, date_publication, editeur, nombre_pages, source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        titre = VALUES(titre), 
        auteur = VALUES(auteur), 
        description = VALUES(description), 
        image_url = VALUES(image_url), 
        date_publication = VALUES(date_publication), 
        editeur = VALUES(editeur), 
        nombre_pages = VALUES(nombre_pages),
        source = VALUES(source); 
        // Add other fields as necessary
    `;
    // Using 'OpenLibrary' as source
    const [result] = await db.query(insertQuery, [
      isbn,
      title,
      authors,
      description,
      image_url,
      publish_date,
      publishers,
      number_of_pages,
      'OpenLibrary' 
    ]);
    
    // Using 'OpenLibrary' as source
    const [result] = await db.query(insertQuery, [
      isbn,
      title,
      authors,
      description,
      image_url,
      publish_date,
      publishers,
      number_of_pages,
      'OpenLibrary' 
    ]);
    
    // Fetch the book from DB to get its ID and ensure data consistency for Typesense
    const [selectRows] = await db.query('SELECT * FROM books WHERE isbn = ?', [isbn]);
    const bookFromDb = (selectRows as any[])[0];

    let typesenseMessage = 'Indexation Typesense non tentée.';

    if (!bookFromDb || !bookFromDb.id) {
      console.error('Failed to retrieve book from DB after insert/update for ISBN:', isbn);
      typesenseMessage = 'Erreur récupération livre post-insertion pour indexation.';
      // Not returning to client here, as DB operation might have succeeded. 
      // But Typesense indexing will be skipped. Consider logging this seriously.
    } else {
      const documentForTypesense = {
        id: bookFromDb.id.toString(), // Ensure ID is a string for Typesense
        title: bookFromDb.titre,
        author: bookFromDb.auteur,
        description: bookFromDb.description || '', // Ensure description is not null
        isbn: bookFromDb.isbn,
        published_date: bookFromDb.date_publication || '', // Ensure not null
        editeur: bookFromDb.editeur || '', // Ensure not null
        image_url: bookFromDb.image_url || '', // Ensure not null
        source: bookFromDb.source || 'OpenLibrary', // Ensure not null
        // Add any other fields defined in your bookSchema in typesenseClient.ts
      };

      try {
        await typesenseClient.collections(bookSchemaName).documents().upsert(documentForTypesense);
        console.log(`Book ${bookFromDb.id} upserted to Typesense.`);
        typesenseMessage = 'Indexation Typesense réussie.';
      } catch (typesenseError: any) {
        console.error(`Error upserting book ${bookFromDb.id} to Typesense:`, typesenseError.message, typesenseError.importResults);
        typesenseMessage = `Erreur indexation Typesense: ${typesenseError.message}`;
      }
    }
    
    res.status(201).json({ 
      success: true, 
      message: `Livre importé/mis à jour en DB. ${typesenseMessage}`, 
      data: { isbn, title: bookFromDb?.titre || bookData.title } 
    });

  } catch (error: any) {
    console.error('Error importing book from OpenLibrary or during DB operation:', error.message);
    if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
       return res.status(404).json({ success: false, message: `Livre non trouvé sur OpenLibrary pour l'ISBN ${isbn}.` });
    }
    // Check if it's a DB error or other type
    res.status(500).json({ success: false, message: 'Erreur serveur lors de l\'importation du livre.', details: error.message });
  }
});

export default router;
