import mysql from 'mysql2/promise';

async function testConnection() {
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
    // Test de connexion
    const connection = await pool.getConnection();
    console.log('✅ Connecté à MySQL avec succès !');

    // Vérifier si la base de données existe
    const [databases] = await connection.query('SHOW DATABASES LIKE "Bibliointel"');
    if (databases.length === 0) {
      console.error('❌ La base de données Bibliointel n\'existe pas !');
      return;
    }
    console.log('✅ Base de données Bibliointel trouvée');

    // Vérifier si la table existe
    const [tables] = await connection.query('SHOW TABLES LIKE "books"');
    if (tables.length === 0) {
      console.error('❌ La table books n\'existe pas !');
      return;
    }
    console.log('✅ Table books trouvée');

    // Vérifier la structure de la table
    const [columns] = await connection.query('DESCRIBE books');
    console.log('📋 Structure de la table books:', columns);

    // Afficher quelques données
    const [books] = await connection.query('SELECT * FROM books LIMIT 2');
    console.log('📚 Exemple de livres:', JSON.stringify(books, null, 2));

    connection.release();
  } catch (error) {
    console.error('❌ Erreur lors du test de connexion:', error);
  } finally {
    await pool.end();
  }
}

testConnection(); 