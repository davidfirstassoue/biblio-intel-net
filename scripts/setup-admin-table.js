import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const SALT_ROUNDS = 10;

async function setupAdminTable() {
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
    // Créer la table admins si elle n'existe pas
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table admins créée ou déjà existante');

    // Vérifier si des admins existent déjà
    const [admins] = await pool.execute('SELECT COUNT(*) as count FROM admins');
    if (admins[0].count === 0) {
      // Hasher les mots de passe
      const adminPasswords = [
        { email: 'davidfirst@admin.com', password: 'yesssaphir', name: 'David Admin' },
        { email: 'Sefora@admin.com', password: 'sefora1999', name: 'Sefora Admin' },
        { email: 'emmanueldlv@admin.com', password: 'kasangoyeye', name: 'Emmanuel Admin' }
      ];

      for (const admin of adminPasswords) {
        const hashedPassword = await bcrypt.hash(admin.password, SALT_ROUNDS);
        await pool.execute(
          'INSERT INTO admins (email, password, name) VALUES (?, ?, ?)',
          [admin.email, hashedPassword, admin.name]
        );
        console.log(`✅ Admin créé : ${admin.email}`);
      }
    } else {
      console.log('✅ Des administrateurs existent déjà dans la base de données');
    }

    console.log('🎉 Configuration de la table admins terminée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la configuration de la table admins:', error);
  } finally {
    await pool.end();
  }
}

setupAdminTable(); 