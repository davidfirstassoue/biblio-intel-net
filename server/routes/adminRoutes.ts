import express, { Router, Request, Response } from 'express';
import { db } from '../database/db'; // Adjusted path to db.ts

const router: Router = express.Router();

router.post('/admin/login', async (req: Request, res: Response) => {
  const { email, mot_de_passe } = req.body;

  if (!email || !mot_de_passe) {
    return res.status(400).json({ success: false, message: 'Email et mot de passe sont requis' });
  }

  try {
    // Make sure your 'admins' table has columns 'email' and 'mot_de_passe'
    // Consider hashing passwords in a real application instead of storing plain text
    const [rows] = await db.query(
      'SELECT * FROM admins WHERE email = ? AND mot_de_passe = ?', // Ensure 'mot_de_passe' is the correct column name
      [email, mot_de_passe]
    );

    // Type assertion for rows if needed, e.g., const admins = rows as Admin[];
    if (Array.isArray(rows) && rows.length > 0) {
      const admin = rows[0]; // Contains the first matched admin
      // Do not send the password back in the response. Assuming 'id' and 'email' columns exist.
      res.json({ success: true, admin: { id: (admin as any).id, email: (admin as any).email } });
    } else {
      res.status(401).json({ success: false, message: 'Identifiants invalides' });
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion de l'administrateur' });
  }
});

export default router;
