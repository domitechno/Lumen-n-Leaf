import express from 'express';
import { db } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM genre');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des genres.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, image_url } = req.body;
    const [result] = await db.query(
      'INSERT INTO genre (name, image_url) VALUES (?, ?)',
      [name, image_url]
    );
    res.status(201).json({ id: result.insertId, name, image_url });
  } catch (err) {
    res.status(400).json({ error: 'Erreur lors de la création du genre.' });
  }
});

export default router;