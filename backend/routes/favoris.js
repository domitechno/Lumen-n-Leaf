import express from 'express';
import { db } from '../db.js';
const router = express.Router();

// Ajouter un favori
router.post('/add', async (req, res) => {
  const { user_id, book_id } = req.body;
  if (!user_id || !book_id) return res.status(400).json({ error: 'user_id et book_id requis.' });

  try {
    // Empêche les doublons
    const [exist] = await db.query(
      'SELECT * FROM favoris WHERE user_id = ? AND book_id = ?', [user_id, book_id]
    );
    if (exist.length > 0) return res.status(409).json({ message: 'Déjà en favoris.' });

    await db.query('INSERT INTO favoris (user_id, book_id) VALUES (?, ?)', [user_id, book_id]);
    res.json({ message: 'Ajouté aux favoris' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer les favoris d’un user
router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const [results] = await db.query(
      `SELECT book.* FROM favoris JOIN book ON favoris.book_id = book.id WHERE favoris.user_id = ?`, [userId]
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
