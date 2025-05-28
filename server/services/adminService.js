import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../database/connection.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'admin-secret-key';

class AdminService {
  async login(email, password) {
    try {
      const [admin] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);

      if (!admin || admin.length === 0) {
        throw new Error('Email ou mot de passe incorrect');
      }

      const adminData = admin[0];
      const isPasswordValid = await bcrypt.compare(password, adminData.password);

      if (!isPasswordValid) {
        throw new Error('Email ou mot de passe incorrect');
      }

      const token = jwt.sign(
        { 
          id: adminData.id, 
          email: adminData.email,
          role: 'admin'
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        success: true,
        token,
        admin: {
          id: adminData.id,
          email: adminData.email,
          name: adminData.name
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Token invalide');
    }
  }

  async getAdminById(id) {
    try {
      const [admin] = await db.query('SELECT id, email, name, role FROM admins WHERE id = ?', [id]);
      return admin[0];
    } catch (error) {
      throw error;
    }
  }

  // Statistiques du tableau de bord
  async getDashboardStats() {
    try {
      const [activeUsers] = await db.query('SELECT COUNT(*) as count FROM users WHERE status = "active"');
      const [totalBooks] = await db.query('SELECT COUNT(*) as count FROM books');
      const [activeLoans] = await db.query('SELECT COUNT(*) as count FROM loans WHERE status = "active"');
      const [todayVisits] = await db.query('SELECT COUNT(*) as count FROM visits WHERE DATE(created_at) = CURDATE()');

      return {
        activeUsers: activeUsers[0].count,
        totalBooks: totalBooks[0].count,
        activeLoans: activeLoans[0].count,
        todayVisits: todayVisits[0].count
      };
    } catch (error) {
      throw error;
    }
  }

  // Gestion des utilisateurs
  async getAllUsers() {
    try {
      const [users] = await db.query('SELECT * FROM users ORDER BY created_at DESC');
      return users;
    } catch (error) {
      throw error;
    }
  }

  async createUser(userData) {
    try {
      const { email, password, name } = userData;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [result] = await db.query(
        'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
        [email, hashedPassword, name]
      );

      return { id: result.insertId, email, name };
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      const { email, name, status } = userData;
      
      await db.query(
        'UPDATE users SET email = ?, name = ?, status = ? WHERE id = ?',
        [email, name, status, id]
      );

      return { id, email, name, status };
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      await db.query('DELETE FROM users WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Gestion des livres
  async getAllBooks() {
    try {
      const [books] = await db.query('SELECT * FROM books ORDER BY created_at DESC');
      return books;
    } catch (error) {
      throw error;
    }
  }

  async createBook(bookData) {
    try {
      const { title, author, description, category, isbn } = bookData;
      
      const [result] = await db.query(
        'INSERT INTO books (title, author, description, category, isbn) VALUES (?, ?, ?, ?, ?)',
        [title, author, description, category, isbn]
      );

      return { id: result.insertId, ...bookData };
    } catch (error) {
      throw error;
    }
  }

  async updateBook(id, bookData) {
    try {
      const { title, author, description, category, isbn } = bookData;
      
      await db.query(
        'UPDATE books SET title = ?, author = ?, description = ?, category = ?, isbn = ? WHERE id = ?',
        [title, author, description, category, isbn, id]
      );

      return { id, ...bookData };
    } catch (error) {
      throw error;
    }
  }

  async deleteBook(id) {
    try {
      await db.query('DELETE FROM books WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Gestion des emprunts
  async getAllLoans() {
    try {
      const [loans] = await db.query(`
        SELECT l.*, u.name as user_name, b.title as book_title 
        FROM loans l 
        JOIN users u ON l.user_id = u.id 
        JOIN books b ON l.book_id = b.id 
        ORDER BY l.created_at DESC
      `);
      return loans;
    } catch (error) {
      throw error;
    }
  }

  async updateLoan(id, loanData) {
    try {
      const { status, return_date } = loanData;
      
      await db.query(
        'UPDATE loans SET status = ?, return_date = ? WHERE id = ?',
        [status, return_date, id]
      );

      return { id, status, return_date };
    } catch (error) {
      throw error;
    }
  }

  // Paramètres système
  async getSystemSettings() {
    try {
      const [settings] = await db.query('SELECT * FROM system_settings');
      return settings[0] || {};
    } catch (error) {
      throw error;
    }
  }

  async updateSystemSettings(settings) {
    try {
      const entries = Object.entries(settings);
      
      for (const [key, value] of entries) {
        await db.query(
          'INSERT INTO system_settings (name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
          [key, value, value]
        );
      }

      return settings;
    } catch (error) {
      throw error;
    }
  }
}

export default new AdminService(); 