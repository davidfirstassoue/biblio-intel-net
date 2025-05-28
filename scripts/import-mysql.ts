import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const mysqlConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function importBooks() {
  try {
    // Connexion à MySQL
    const connection = await mysql.createConnection(mysqlConfig);
    
    // Récupération des livres de MySQL
    const [rows] = await connection.execute('SELECT * FROM livres');
    
    // Conversion et import vers Supabase
    for (const book of rows as any[]) {
      await supabase.from('books').insert({
        title: book.titre,
        author: book.auteur,
        description: book.description,
        isbn: book.isbn,
        cover_url: book.image_url,
        published_date: book.date_publication,
        publisher: book.editeur,
        page_count: book.nombre_pages,
        language: book.langue,
        source: 'mysql_import'
      });
    }
    
    console.log('Importation terminée avec succès !');
    await connection.end();
    
  } catch (error) {
    console.error('Erreur lors de l\'importation :', error);
  }
}

importBooks(); 