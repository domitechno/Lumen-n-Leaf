import express from 'express';
import { db } from '../db.js'; 

const router = express.Router();

router.get('/', async (req, res) => {
  console.log(">> GET /api/category called !");
  try {
    const [rows] = await db.query('SELECT * FROM category');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération.' });
  }
});


router.post('/', async (req, res) => {
  try {
    const { name, color } = req.body;
    const [result] = await db.query(
      'INSERT INTO category (name, color) VALUES (?, ?)',
      [name, color]
    );
    res.status(201).json({ id: result.insertId, name, color });
  } catch (err) {
    res.status(400).json({ error: 'Erreur lors de la création.' });
  }
});

export default router;