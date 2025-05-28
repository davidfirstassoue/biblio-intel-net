import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuration de dotenv
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration CORS pour autoriser explicitement localhost:5174
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Connexion MySQL
const db = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bibliointel'
});

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ API BiblioIntel opérationnelle',
    endpoints: {
      books: '/api/books',
      booksByCategory: '/api/books/category/:category',
      popularBooks: '/api/books/populaires',
      admin: '/api/admin/login'
    }
  });
});

// Route pour récupérer tous les livres
app.get('/api/books', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        id,
        title,
        author,
        publication_year,
        genre,
        COALESCE(cover_url, 'https://via.placeholder.com/200x300?text=Image+non+disponible') as cover_url,
        COALESCE(description, 'Pas de description disponible') as description,
        publisher,
        COALESCE(language, 'fr') as language,
        page_count
      FROM books
      ORDER BY title ASC
    `);

    res.json({ 
      success: true, 
      books: rows 
    });
  } catch (error) {
    console.error('❌ Erreur SQL:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des livres' 
    });
  }
});

// Nouvelle route pour les livres populaires
app.get('/api/books/populaires', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        id,
        title,
        author,
        publication_year,
        genre,
        COALESCE(cover_url, 'https://via.placeholder.com/200x300?text=Image+non+disponible') as cover_url,
        COALESCE(description, 'Pas de description disponible') as description,
        publisher,
        COALESCE(language, 'fr') as language,
        page_count
      FROM books
      ORDER BY RAND()
      LIMIT 5
    `);

    res.json({ 
      success: true, 
      books: rows 
    });
  } catch (error) {
    console.error('❌ Erreur SQL:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des livres populaires' 
    });
  }
});

// Route pour récupérer les livres par catégorie
app.get('/api/books/category/:category', async (req, res) => {
  const category = req.params.category;
  console.log('Catégorie demandée:', category); // Log pour le debug
  
  const categoryMapping = {
    'romans': 'Romans',
    'science-fiction': 'Science Fiction',
    'histoire': 'Histoire',
    'biographies': 'Biographies',
    'sciences': 'Sciences',
    'art': 'Art',
    'tech': 'Technologie',
    'philosophie': 'Philosophie'
  };

  const dbCategory = categoryMapping[category.toLowerCase()];
  console.log('Catégorie mappée:', dbCategory); // Log pour le debug
  
  if (!dbCategory) {
    return res.status(404).json({
      success: false,
      message: `Catégorie "${category}" non trouvée`
    });
  }

  try {
    const [rows] = await db.execute(`
      SELECT 
        id,
        title,
        author,
        publication_year,
        genre,
        COALESCE(cover_url, 'https://via.placeholder.com/200x300?text=Image+non+disponible') as cover_url,
        COALESCE(description, 'Pas de description disponible') as description,
        publisher,
        COALESCE(language, 'fr') as language,
        page_count
      FROM books
      WHERE LOWER(genre) = LOWER(?)
      ORDER BY title ASC
    `, [dbCategory]);

    console.log(`Nombre de livres trouvés pour ${dbCategory}:`, rows.length); // Log pour le debug

    res.json({ 
      success: true, 
      category: dbCategory,
      books: rows 
    });
  } catch (error) {
    console.error('❌ Erreur SQL:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des livres',
      details: error.message 
    });
  }
});

// Route de connexion admin
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM admins WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length > 0) {
      const admin = rows[0];
      res.status(200).json({ 
        success: true, 
        admin: { 
          id: admin.id, 
          email: admin.email 
        } 
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Identifiants incorrects' 
      });
    }
  } catch (error) {
    console.error('❌ Erreur SQL:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur interne du serveur' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Backend lancé sur http://localhost:${PORT}`);
}); 