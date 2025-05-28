import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import db from './lib/mysql.js';
dotenv.config();

async function testConnection() {
  try {
    

    const [rows] = await db.query('SELECT * FROM books');


    console.log('✅ Connecté à MySQL avec succès !');
    console.log('📊 Base de données:', 'Bibliointel');
    console.log('👤 Utilisateur: root');
    console.log('🖥️ Host: localhost');

    // Test de la table livres
    const [tables] = await connection.execute('SHOW TABLES LIKE "livres"');
    
    if (tables.length > 0) {
      console.log('✅ Table "livres" trouvée');
      
      // Afficher la structure de la table
      const [columns] = await connection.execute('DESCRIBE livres');
      console.log('📋 Structure de la table livres:', columns);

      // Afficher le contenu de la table
      const [rows] = await connection.execute('SELECT * FROM livres');
      console.log('📚 Contenu de la table livres:', rows);
    } else {
      console.log('❌ Table "livres" non trouvée');
      console.log('Création de la table livres...');
      
      // Créer la table si elle n'existe pas
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS livres (
          id INT AUTO_INCREMENT PRIMARY KEY,
          titre VARCHAR(255) NOT NULL,
          auteur VARCHAR(255) NOT NULL,
          description TEXT,
          isbn VARCHAR(20),
          image_url TEXT,
          date_publication VARCHAR(20),
          editeur VARCHAR(255),
          nombre_pages INT,
          langue VARCHAR(10) DEFAULT 'fr'
        )
      `);
      console.log('✅ Table "livres" créée avec succès !');
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

testConnection(); 