import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/book.js';
import categoryRoutes from './routes/category.js';
import collectionRoutes from './routes/collection.js';
import favorisRoutes from './routes/favoris.js';
import genreRoutes from './routes/genre.js';
import uploadsRoutes from './routes/uploads.js';

const app = express();

app.use(json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/collection', collectionRoutes);
app.use('/api/favoris', favorisRoutes);
app.use('/api/genre', genreRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));

connect('mongodb://localhost:27017/ton_projet', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});