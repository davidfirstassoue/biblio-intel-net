import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const SALT_ROUNDS = 10;

const adminPasswords = [
  { email: 'davidfirst@admin.com', password: 'yesssaphir' },
  { email: 'Sefora@admin.com', password: 'sefora1999' },
  { email: 'emmanueldlv@admin.com', password: 'kasangoyeye' }
];

async function updatePasswords() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'Bibliointel'
  });

  try {
    for (const admin of adminPasswords) {
      const hashedPassword = await bcrypt.hash(admin.password, SALT_ROUNDS);
      await pool.execute(
        'UPDATE admins SET password = ? WHERE email = ?',
        [hashedPassword, admin.email]
      );
      console.log(`✅ Mot de passe mis à jour pour ${admin.email}`);
    }
    console.log('🎉 Tous les mots de passe ont été mis à jour avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour des mots de passe:', error);
  } finally {
    await pool.end();
  }
}

updatePasswords(); 