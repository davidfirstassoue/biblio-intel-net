import mysql from 'mysql2/promise';
import { searchBooks as searchGoogleBooks } from './googleBooksService.js';
import axios from 'axios';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'Bibliointel',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function searchOpenLibrary(query, limit = 10) {
  try {
    const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}`);
    
    return response.data.docs.map(book => ({
      id: `ol_${book.key.replace('/works/', '')}`,
      title: book.title,
      author: book.author_name?.[0] || 'Auteur inconnu',
      description: book.first_sentence || '',
      categories: book.subject || [],
      cover_url: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : '/images/default-book.png',
      published_date: book.first_publish_year?.toString() || '',
      publisher: book.publisher?.[0] || '',
      page_count: book.number_of_pages_median || 0,
      language: book.language?.[0] || 'fr',
      isbn: book.isbn?.[0] || '',
      rating: 0,
      price: 0,
      currency: 'XOF',
      availability: 'disponible',
      source: 'openlibrary'
    }));
  } catch (error) {
    console.error('Erreur OpenLibrary:', error);
    return [];
  }
}

async function saveBookToDatabase(book) {
  try {
    const [existingBook] = await pool.execute(
      'SELECT * FROM books WHERE id = ?',
      [book.id]
    );

    if (existingBook.length === 0) {
      await pool.execute(
        `INSERT INTO books (
          id, title, author, description, cover_url, published_date, 
          publisher, language, categories, page_count, isbn, 
          rating, price, currency, availability, source
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          book.id,
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
      console.log(`📚 Livre sauvegardé: ${book.title}`);
    }
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du livre:', error);
    return false;
  }
}

export async function searchAndCacheBooks(query, limit = 20) {
  console.log(`🔍 Recherche pour: "${query}"`);
  
  try {
    // 1. Rechercher d'abord dans la base de données locale
    const [localBooks] = await pool.execute(
      'SELECT * FROM books WHERE title LIKE ? OR author LIKE ? LIMIT ?',
      [`%${query}%`, `%${query}%`, limit]
    );
    
    console.log(`📚 Livres trouvés en local: ${localBooks.length}`);
    
    if (localBooks.length > 0) {
      return localBooks;
    }
    
    // 2. Si aucun résultat local, chercher via Google Books
    console.log('🌐 Recherche sur Google Books...');
    const googleBooks = await searchGoogleBooks(query, Math.ceil(limit / 2));
    
    // 3. Chercher aussi sur OpenLibrary
    console.log('🌐 Recherche sur OpenLibrary...');
    const openLibraryBooks = await searchOpenLibrary(query, Math.floor(limit / 2));
    
    // 4. Combiner et dédupliquer les résultats
    const allBooks = [...googleBooks, ...openLibraryBooks];
    
    // 5. Sauvegarder les nouveaux livres dans la base de données
    console.log(`💾 Sauvegarde de ${allBooks.length} livres...`);
    await Promise.all(allBooks.map(book => saveBookToDatabase(book)));
    
    return allBooks;
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return [];
  }
}

export async function getPopularBooks(limit = 9) {
  try {
    const [books] = await pool.execute(
      `SELECT 
        id,
        title,
        author,
        description,
        cover_url,
        published_date,
        publisher,
        language,
        categories,
        page_count,
        isbn,
        rating,
        price,
        currency,
        availability
      FROM books 
      ORDER BY rating DESC, RAND() 
      LIMIT ?`,
      [limit]
    );
    
    // Formater les catégories qui sont stockées en JSON
    const formattedBooks = books.map(book => ({
      ...book,
      categories: book.categories ? JSON.parse(book.categories) : []
    }));
    
    if (formattedBooks.length < limit) {
      const newBooks = await searchGoogleBooks('bestseller', limit - formattedBooks.length);
      await Promise.all(newBooks.map(book => saveBookToDatabase(book)));
      return [...formattedBooks, ...newBooks].slice(0, limit);
    }
    
    return formattedBooks;
  } catch (error) {
    console.error('Erreur lors de la récupération des livres populaires:', error);
    return [];
  }
}

export async function getRecentBooks(limit = 9) {
  try {
    const [books] = await pool.execute(
      'SELECT * FROM books ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
    
    if (books.length < limit) {
      const newBooks = await searchGoogleBooks('new releases', limit - books.length);
      await Promise.all(newBooks.map(book => saveBookToDatabase(book)));
      return [...books, ...newBooks].slice(0, limit);
    }
    
    return books;
  } catch (error) {
    console.error('Erreur lors de la récupération des livres récents:', error);
    return [];
  }
} 