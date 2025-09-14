// backend/routes/auth.js
import { Router } from 'express';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js'; 
import authorizeRoles from '../middleware/authorizeRoles.js';
import multer from 'multer';
import path from 'path';
import { db } from '../db.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'avatar-' + Date.now() + ext);
  }
});
const upload = multer({ storage: storage });

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, firstName, lastName, password, role } = req.body;
     const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Nom d'utilisateur déjà utilisé" });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }
  const [rows] = await db.query('SELECT id FROM role WHERE name = ?', [role]);    
  if (!rows.length) {
  return res.status(400).json({ error: "Role inconnu" });
}
    const role_id = rows[0].id;
    const hashedPassword = await hash(password, 10);
    const user = new User({
      username,
      email,
      firstName,
      lastName,
      password: hashedPassword,
      role_id
    });
    await user.save();
    res.status(201).json({ message: 'Utilisateur créé !' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé' });

    const isValid = await compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Mot de passe incorrect' });

    const [roles] = await db.query('SELECT name FROM role WHERE id = ?', [user.role_id]);
    const roleName = roles.length ? roles[0].name : null;

    if (!roleName) return res.status(500).json({ error: "Role non trouvé dans la table SQL" });

    const token = jwt.sign(
      { userId: user._id, role: roleName },
      'SECRET_KEY',
      { expiresIn: '1h' }
    );
    res.json({ token,
      role: roleName,
    user: {
    id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar || '', 
    firstName: user.firstName,
    lastName: user.lastName,
    role_id: user.role_id
  }
 });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
   let roleName = null;
    if (user.role_id) {
      const [roles] = await db.query('SELECT name FROM role WHERE id = ?', [user.role_id]);
      roleName = roles.length ? roles[0].name : null;
    }
    res.json({ ...user.toObject(), roleName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/author-content', authorizeRoles(['author']), (_req, res) => {
  res.json({ message: 'Bienvenue auteur !' });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'SECRET_KEY', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

router.post('/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier envoyé" });
    }
    const avatarPath = `/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user.userId, { avatar: avatarPath });
    res.json({ avatar: avatarPath });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'upload de l'avatar" });
  }
});

export default router;