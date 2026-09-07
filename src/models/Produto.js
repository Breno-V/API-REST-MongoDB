import mongoose from 'mongoose';

// RF01: colecao unica com campos obrigatorios + objeto dinamico "especificacoes".
const produtoSchema = new mongoose.Schema(
  {
    nome: { 
      type: String, 
      required: [true, 'nome e obrigatorio'], 
      trim: true 
    },
    descricao: { 
      type: String, 
      default: '' 
    },
    preco: { 
      type: Number, 
      required: [true, 'preco e obrigatorio'], 
      min: [0, 'preco nao pode ser negativo'] 
    },
    categoria: { 
      type: String, 
      required: [true, 'categoria e obrigatoria'], 
      trim: true, 
      index: true 
    },
    estoque: {
      type: Number,
      required: [true, 'estoque e obrigatorio'],
      min: [0, 'estoque nao pode ser negativo'],
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: 'estoque deve ser um numero inteiro',
      },
    },
    especificacoes: { 
      type: Map, 
      of: mongoose.Schema.Types.Mixed, 
      default: {} 
    },
  },
  { timestamps: true }
);

// RF03: busca textual em nome + descricao
produtoSchema.index({ nome: 'text', descricao: 'text' });

// Nome da collection no MongoDB. Troque aqui (ou via COLLECTION_NAME no .env)
// para apontar/criar outra collection. O MongoDB cria automaticamente no 1o insert.
const COLLECTION_NAME = process.env.COLLECTION_NAME || 'produtos';

export default mongoose.model('Produto', produtoSchema, COLLECTION_NAME);
