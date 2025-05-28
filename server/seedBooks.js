import mysql from 'mysql2/promise';
import bookApiService from './services/bookApis.js';

async function seedBooks() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Bibliointel',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    console.log('🔍 Recherche de livres populaires...');
    const popularBooks = await bookApiService.getPopularBooks();
    console.log(`📚 ${popularBooks.length} livres populaires trouvés`);

    console.log('🔍 Recherche de livres récents...');
    const recentBooks = await bookApiService.getRecentBooks();
    console.log(`📚 ${recentBooks.length} livres récents trouvés`);

    const allBooks = [...popularBooks, ...recentBooks];
    console.log(`📚 Total: ${allBooks.length} livres à sauvegarder`);

    for (const book of allBooks) {
      try {
        // Vérifier si le livre existe déjà
        const [existing] = await pool.execute(
          'SELECT id FROM livres WHERE source = ? AND source_id = ?',
          [book.source, book.source_id]
        );

        if (existing.length === 0) {
          // Insérer le nouveau livre
          await pool.execute(
            'INSERT INTO livres (isbn, titre, auteur, description, image_url, date_publication, editeur, source, source_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [book.isbn, book.titre, book.auteur, book.description, book.image_url, book.date_publication, book.editeur, book.source, book.source_id]
          );
          console.log(`✅ Livre ajouté: ${book.titre}`);
        } else {
          console.log(`ℹ️ Livre déjà existant: ${book.titre}`);
        }
      } catch (error) {
        console.error(`❌ Erreur lors de la sauvegarde du livre ${book.titre}:`, error);
      }
    }

    console.log('✨ Terminé !');
  } catch (error) {
    console.error('❌ Erreur lors du remplissage de la base de données:', error);
  } finally {
    await pool.end();
  }
}

seedBooks(); 