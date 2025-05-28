import express, { Router, Request, Response } from 'express';
import { db } from '../database/db'; // Adjusted path to db.ts

const router: Router = express.Router();

router.get('/books', async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query('SELECT * FROM books');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching books:', error); // Log the actual error
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des livres' });
  }
});

export default router;
