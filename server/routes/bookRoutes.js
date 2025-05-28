import express from 'express';
import { searchAndCacheBooks, getPopularBooks, getRecentBooks } from '../services/searchService.js';
import { saveBooks, getBooks, getRecentBooks as oldGetRecentBooks } from '../services/bookService.js';
import bookApiService from '../services/bookApis.js';
import mysql from 'mysql2/promise';

const router = express.Router();
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'Bibliointel',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Fonction utilitaire pour sauvegarder un livre en base de données
async function saveBookToDatabase(book) {
  try {
    const [existingBook] = await pool.execute(
      'SELECT * FROM books WHERE id = ?',
      [book.id]
    );

    if (existingBook.length === 0) {
      await pool.execute(
        `INSERT INTO books (
          title, author, description, cover_url, published_date, 
          publisher, language, categories, page_count, isbn, 
          rating, price, currency, availability, source
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          book.title,
          book.author,
          book.description,
          book.cover_url,
          book.published_date,
          book.publisher,
          book.language,
          JSON.stringify(book.categories || []),
          book.page_count || 0,
          book.isbn || '',
          book.rating || 0,
          book.price || 0,
          book.currency || 'XOF',
          book.availability || 'disponible',
          book.source || 'manual'
        ]
      );
    }
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du livre:', error);
    return false;
  }
}

// Route pour récupérer et stocker de nouveaux livres
router.get('/refresh', async (req, res) => {
  try {
    const query = req.query.q || 'bestseller';
    const books = await searchAndCacheBooks(query);
    if (books.length > 0) {
      await saveBooks(books);
    }
    res.json(books);
  } catch (error) {
    console.error('Erreur lors du rafraîchissement des livres:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour obtenir les livres (avec filtre optionnel par catégorie)
router.get('/', async (req, res) => {
  try {
    const { category, limit = 40, offset = 0 } = req.query;
    const books = await getBooks(category, parseInt(limit), parseInt(offset));
    
    if (books.length === 0) {
      // Si aucun livre n'est trouvé, on rafraîchit depuis l'API
      const query = category || 'bestseller';
      const newBooks = await searchAndCacheBooks(query);
      if (newBooks.length > 0) {
        await saveBooks(newBooks);
        return res.json(newBooks);
      }
    }
    
    res.json(books);
  } catch (error) {
    console.error('Erreur lors de la récupération des livres:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour obtenir les ajouts récents
router.get('/recent', async (req, res) => {
  try {
    const { limit = 40 } = req.query;
    const books = await oldGetRecentBooks(parseInt(limit));
    
    if (books.length === 0) {
      // Si aucun livre récent n'est trouvé, on rafraîchit depuis l'API
      const newBooks = await searchAndCacheBooks('new');
      if (newBooks.length > 0) {
        await saveBooks(newBooks);
        return res.json(newBooks);
      }
    }
    
    res.json(books);
  } catch (error) {
    console.error('Erreur lors de la récupération des livres récents:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour la recherche de livres
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Le paramètre de recherche est requis' });
    }
    
    const books = await searchAndCacheBooks(q, parseInt(limit));
    res.json(books);
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche' });
  }
});

// Route pour obtenir les livres populaires
router.get('/populaires', async (req, res) => {
  try {
    console.log('🎯 Recherche de livres populaires...');
    const books = await getPopularBooks(9);
    console.log('📚 Nombre de livres populaires trouvés:', books.length);
    if (books.length > 0) {
      console.log('📖 Premier livre:', JSON.stringify(books[0], null, 2));
    }
    res.json(books);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des livres populaires:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des livres populaires' });
  }
});

// Route pour obtenir les livres récents
router.get('/recents', async (req, res) => {
  try {
    console.log('🎯 Recherche de livres récents...');
    const books = await getRecentBooks(9);
    console.log('📚 Nombre de livres récents trouvés:', books.length);
    if (books.length > 0) {
      console.log('📖 Premier livre récent:', JSON.stringify(books[0], null, 2));
    }
    res.json(books);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des livres récents:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des livres récents' });
  }
});

export default router; 