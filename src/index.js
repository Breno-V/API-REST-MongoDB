import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/database.js';
import produtoRoutes from './routes/produtoRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/produtos', produtoRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Falha ao conectar no MongoDB:', err.message);
    process.exit(1);
  });
