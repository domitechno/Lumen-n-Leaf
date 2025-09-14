import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'cover-' + Date.now() + ext);
  }
});
const upload = multer({ storage: storage });

router.post('/', upload.single('cover'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier envoyé" });
  }
  // Retourne l'URL d'accès à l'image
  res.json({ url: `/uploads/${req.file.filename}` });
});

export default router;