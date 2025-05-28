import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test de connexion
pool.getConnection()
  .then(connection => {
    console.log('Connecté à MySQL avec succès !');
    connection.release();
  })
  .catch(err => {
    console.error('Erreur de connexion à MySQL:', err);
  });

export async function getLivres() {
  try {
    const [rows] = await pool.execute('SELECT * FROM livres');
    return { data: rows, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getLivreById(id) {
  try {
    const [rows] = await pool.execute('SELECT * FROM livres WHERE id = ?', [id]);
    return { data: rows[0], error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function searchLivres(query) {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM livres WHERE titre LIKE ? OR auteur LIKE ?',
      [`%${query}%`, `%${query}%`]
    );
    return { data: rows, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function ajouterLivre(livre) {
  try {
    const [result] = await pool.execute(
      'INSERT INTO livres SET ?',
      [livre]
    );
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function modifierLivre(id, livre) {
  try {
    const [result] = await pool.execute(
      'UPDATE livres SET ? WHERE id = ?',
      [livre, id]
    );
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function supprimerLivre(id) {
  try {
    const [result] = await pool.execute(
      'DELETE FROM livres WHERE id = ?',
      [id]
    );
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
} 