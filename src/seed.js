import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Produto from './models/Produto.js';

dotenv.config();

const produtos = [
  {
    nome: 'Camiseta Basica Preta',
    descricao: 'camiseta de algodao preta basica',
    preco: 79.9,
    categoria: 'roupas',
    estoque: 50,
    especificacoes: { tamanho: 'G', cor: 'preta', material: 'algodao' },
  },
  {
    nome: 'Calca Jeans Slim',
    descricao: 'calca jeans slim azul escura',
    preco: 199.9,
    categoria: 'roupas',
    estoque: 30,
    especificacoes: { tamanho: '42', cor: 'azul', material: 'denim' },
  },
  {
    nome: 'Air Fryer Digital 5L',
    descricao: 'fritadeira air fryer digital 5 litros',
    preco: 499.9,
    categoria: 'eletrodomesticos',
    estoque: 20,
    especificacoes: { voltagem: '220V', potencia: '1500W', capacidade: '5L' },
  },
  {
    nome: 'Cafeteira Espresso',
    descricao: 'cafeteira espresso com vaporizador',
    preco: 899.9,
    categoria: 'eletrodomesticos',
    estoque: 12,
    especificacoes: { voltagem: '220V', potencia: '1350W', pressao: '19 bar' },
  },
  {
    nome: 'Liquidificador 3L',
    descricao: 'liquidificador 3 litros 5 velocidades',
    preco: 249.9,
    categoria: 'eletrodomesticos',
    estoque: 25,
    especificacoes: { voltagem: '127V', potencia: '900W', capacidade: '3L' },
  },
  {
    nome: 'Smartphone X 128GB',
    descricao: 'smartphone tela 6.5 128gb camera dupla',
    preco: 2499,
    categoria: 'eletronicos',
    estoque: 15,
    especificacoes: { memoria: '128GB', ram: '8GB', bateria: '5000mAh' },
  },
  {
    nome: 'Fone Bluetooth Pro',
    descricao: 'fone de ouvido bluetooth com cancelamento de ruido',
    preco: 299.9,
    categoria: 'eletronicos',
    estoque: 40,
    especificacoes: { conectividade: 'bluetooth 5.3', bateria: '30h', cor: 'branco' },
  },
  {
    nome: 'Tenis de Corrida',
    descricao: 'tenis de corrida amortecimento responsivo',
    preco: 349.9,
    categoria: 'calcados',
    estoque: 35,
    especificacoes: { tamanho: '42', cor: 'cinza', material: 'tecido' },
  },
];

async function main() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI nao definida. Copie .env.example para .env e preencha.');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB conectado');

    await Produto.deleteMany({});
    console.log('Coleção limpa');

    const inseridos = await Produto.insertMany(produtos);
    console.log(`${inseridos.length} produtos inseridos`);

    await mongoose.disconnect();
    console.log('Seed concluído');
  } catch (err) {
    console.error('Falha no seed:', err.message);
    try { 
      await mongoose.disconnect(); 
    } catch {}
    process.exit(1);
  }
}

main();