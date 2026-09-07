import mongoose from 'mongoose';

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI nao definida. Copie .env.example para .env e preencha.');
  }
  await mongoose.connect(uri);
  console.log('MongoDB conectado');
}

export default connectDB;
