const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config();

const app = express();

// Configuration CORS et middleware
app.use(cors());
app.use(express.json());

// Test de connexion MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',  // Par défaut, XAMPP n'a pas de mot de passe pour root
  database: 'Bibliointel',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Vérification de la connexion
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connecté à MySQL avec succès !');
    console.log('📊 Base de données: Bibliointel');
    console.log('👤 Utilisateur: root');
    console.log('🖥️ Host: localhost');
    
    // Test de la table livres
    const [rows] = await connection.execute('SHOW TABLES LIKE "livres"');
    if (Array.isArray(rows) && rows.length > 0) {
      console.log('✅ Table "livres" trouvée');
      
      // Afficher la structure de la table
      const [columns] = await connection.execute('DESCRIBE livres');
      console.log('📋 Structure de la table livres:', columns);
    } else {
      console.error('❌ Table "livres" non trouvée !');
    }
    
    connection.release();
  } catch (error) {
    console.error('❌ Erreur de connexion à MySQL:', error);
    process.exit(1);
  }
}

// Routes API
app.get('/api/livres', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM livres LIMIT 50');
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des livres:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des livres' });
  }
});

app.get('/api/livres/search', async (req, res) => {
  const { q } = req.query;
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Paramètre de recherche manquant' });
  }
  
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM livres WHERE titre LIKE ? OR auteur LIKE ? LIMIT 50',
      [`%${q}%`, `%${q}%`]
    );
    console.log('🔍 Recherche pour:', q);
    console.log('📚 Résultats trouvés:', rows.length);
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche' });
  }
});

// Route pour obtenir un livre par son ID
app.get('/api/livres/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM livres WHERE id = ?', [req.params.id]);
    if (!rows[0]) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération du livre:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du livre' });
  }
});

// Route pour ajouter un livre
app.post('/api/livres', async (req, res) => {
  try {
    const [result] = await pool.execute(
      'INSERT INTO livres SET ?',
      [req.body]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du livre:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du livre' });
  }
});

// Route pour modifier un livre
app.put('/api/livres/:id', async (req, res) => {
  try {
    await pool.execute(
      'UPDATE livres SET ? WHERE id = ?',
      [req.body, req.params.id]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    console.error('Erreur lors de la modification du livre:', error);
    res.status(500).json({ error: 'Erreur lors de la modification du livre' });
  }
});

// Route pour supprimer un livre
app.delete('/api/livres/:id', async (req, res) => {
  try {
    await pool.execute(
      'DELETE FROM livres WHERE id = ?',
      [req.params.id]
    );
    res.json({ message: 'Livre supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du livre:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du livre' });
  }
});

const PORT = process.env.PORT || 3001;

// Démarrage du serveur
async function startServer() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  });
}

startServer().catch(error => {
  console.error('Erreur au démarrage du serveur:', error);
  process.exit(1);
}); 