import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); // This will load variables from the .env file at the project root

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
