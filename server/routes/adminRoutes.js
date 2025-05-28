import express from 'express';
import adminService from '../services/adminService.js';

const router = express.Router();

// Middleware d'authentification admin
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token non fourni' });
    }

    const decoded = await adminService.verifyToken(token);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Non autorisé' });
  }
};

// Route de connexion admin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await adminService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Route pour vérifier le token admin
router.get('/verify', authenticateAdmin, async (req, res) => {
  try {
    const admin = await adminService.getAdminById(req.admin.id);
    res.json({ success: true, admin });
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
});

// Routes protégées par authentification admin
router.use(authenticateAdmin);

// Statistiques du tableau de bord
router.get('/dashboard/stats', async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Gestion des utilisateurs
router.get('/users', async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/users', async (req, res) => {
  try {
    const user = await adminService.createUser(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const user = await adminService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await adminService.deleteUser(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Gestion des livres
router.get('/books', async (req, res) => {
  try {
    const books = await adminService.getAllBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/books', async (req, res) => {
  try {
    const book = await adminService.createBook(req.body);
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/books/:id', async (req, res) => {
  try {
    const book = await adminService.updateBook(req.params.id, req.body);
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/books/:id', async (req, res) => {
  try {
    await adminService.deleteBook(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Gestion des emprunts
router.get('/loans', async (req, res) => {
  try {
    const loans = await adminService.getAllLoans();
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/loans/:id', async (req, res) => {
  try {
    const loan = await adminService.updateLoan(req.params.id, req.body);
    res.json(loan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Paramètres système
router.get('/settings', async (req, res) => {
  try {
    const settings = await adminService.getSystemSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const settings = await adminService.updateSystemSettings(req.body);
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router; 