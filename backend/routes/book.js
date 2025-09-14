import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM book');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
});


router.post('/add', async (req, res) => {
  try {
    const { title, author, description, genre_id, category_id, cover_url, author_id } = req.body;
    if (!title || !author || !genre_id || !category_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const query = 'INSERT INTO book (title, author, description, genre_id, category_id, cover_url) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await db.query(query, [title, author, description, genre_id, category_id, cover_url]);

    // AJOUTE À LA COLLECTION ICI AVANT res.json
    if (author_id) {
      await db.query(
        'INSERT INTO collection (user_id, book_id) VALUES (?, ?)',
        [author_id, result.insertId]
      );
    }

    res.json({
      message: 'Book added',
      id: result.insertId,
      book: { title, author, description, genre_id, category_id, cover_url }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




router.get('/:id', async (req, res) => {
  try {
  const query = `
   SELECT book.*,
          genre.name AS genre_name, genre.image_url AS genre_image,
          category.name AS category_name, category.color AS category_color
    FROM book
    JOIN genre ON book.genre_id = genre.id
    JOIN category ON book.category_id = category.id
    WHERE book.id = ?
  `;
  const [results] = await db.query(query, [req.params.id]);
    if (results.length === 0) return res.status(404).json({ error: 'Book not found' });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
});


router.delete('/:id', async (req, res) => {
  try {
  const [result] = await db.query('DELETE FROM book WHERE id = ?', [req.params.id]);
    res.json({ message: 'Book deleted' });
    } catch (err) {
    res.status(500).json({ error: err.message});
  }
});

export default router;