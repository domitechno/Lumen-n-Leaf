import express from 'express';
import { db } from '../db.js';

const router = express.Router();

router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const query = `
      SELECT book.*
      FROM collection
      JOIN book ON collection.book_id = book.id
      WHERE collection.user_id = ?
    `;
    const [books] = await db.query(query, [userId]);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/add', async (req, res) => {
  const { user_id, book_id } = req.body;

  if (!user_id || !book_id) {
    return res.status(400).json({ error: 'user_id et book_id sont requis.' });
  }

  try {
   
    const [existing] = await db.query(
      'SELECT * FROM collection WHERE user_id = ? AND book_id = ?',
      [user_id, book_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Livre déjà présent dans la collection.' });
    }

    const [result] = await db.query(
      'INSERT INTO collection (user_id, book_id) VALUES (?, ?)',
      [user_id, book_id]
    );

    res.status(201).json({ message: 'Livre ajouté à la collection.', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/add-random', async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id est requis.' });
  }

  try {
    // Sélectionne un livre aléatoire
    const [randomBooks] = await db.query('SELECT * FROM book ORDER BY RAND() LIMIT 1');
    if (randomBooks.length === 0) return res.status(404).json({ error: 'Aucun livre disponible' });

    const randomBook = randomBooks[0];

    // Vérifie si ce livre est déjà dans la collection de l'utilisateur
    const [existing] = await db.query(
      'SELECT * FROM collection WHERE user_id = ? AND book_id = ?',
      [user_id, randomBook.id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Livre déjà présent dans la collection.' });
    }

    // Insère le livre dans la collection
    await db.query(
      'INSERT INTO collection (user_id, book_id) VALUES (?, ?)',
      [user_id, randomBook.id]
    );

    res.status(201).json(randomBook);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});
  // Suppression d'un livre de la collection d'un user
router.delete('/test', (req, res) => {
  res.json({message: "Test OK"});
});

export default router;

