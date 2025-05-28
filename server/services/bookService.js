import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'Bibliointel',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const saveBooks = async (books) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    for (const book of books) {
      await connection.query(
        `INSERT INTO books (title, author, cover_url, description, publication_year, language, genre, page_count)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         author = VALUES(author),
         cover_url = VALUES(cover_url),
         description = VALUES(description),
         publication_year = VALUES(publication_year),
         language = VALUES(language),
         genre = VALUES(genre),
         page_count = VALUES(page_count)`,
        [book.title, book.author, book.cover_url, book.description, 
         book.publication_year, book.language, book.genre, book.page_count]
      );
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    console.error('Erreur lors de la sauvegarde des livres:', error);
    return false;
  } finally {
    connection.release();
  }
};

export const getBooks = async (genre = null, limit = 40, offset = 0) => {
  try {
    let query = 'SELECT * FROM books';
    const params = [];

    if (genre) {
      query += ' WHERE genre = ?';
      params.push(genre);
    }

    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error('Erreur lors de la récupération des livres:', error);
    return [];
  }
};

export const getRecentBooks = async (limit = 40) => {
  try {
    const currentYear = new Date().getFullYear().toString();
    const [books] = await pool.query(
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
      WHERE YEAR(published_date) = ? 
      ORDER BY published_date DESC 
      LIMIT ?`,
      [currentYear, limit]
    );

    // Formater les catégories qui sont stockées en JSON
    return books.map(book => ({
      ...book,
      categories: book.categories ? JSON.parse(book.categories) : []
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des livres récents:', error);
    return [];
  }
}; 