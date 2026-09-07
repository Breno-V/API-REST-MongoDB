import mongoose from 'mongoose';
import Produto from '../models/Produto.js';

function idInvalido(id) {
  return !mongoose.Types.ObjectId.isValid(id);
}

// RF01 - Cadastro com esquema dinamico (especificacoes livre)
export async function criar(req, res) {
  try {
    const produto = await Produto.create(req.body);
    return res.status(201).json(produto);
  } catch (err) {
    return res.status(400).json({ erro: 'Falha ao cadastrar produto', detalhes: err.message });
  }
}

// RF02 + RF03 + RF04 - Filtros compostos + busca textual + paginacao + ordenacao
// GET /api/produtos?categoria=&precoMin=&precoMax=&q=&limit=&skip=&sort=preco_asc|preco_desc
export async function listar(req, res) {
  try {
    const { categoria, precoMin, precoMax, q, limit = '10', skip = '0', sort } = req.query;

    const filtro = {};

    // RF02: $eq (categoria) + $gte/$lte (faixa de preco)
    if (categoria) {
      filtro.categoria = { $eq: categoria };
    }
    if (precoMin !== undefined || precoMax !== undefined) {
      filtro.preco = {};
      if (precoMin !== undefined) {
        const min = Number(precoMin);
        if (Number.isNaN(min)) return res.status(400).json({ erro: 'precoMin deve ser numerico' });
        filtro.preco.$gte = min;
      }
      if (precoMax !== undefined) {
        const max = Number(precoMax);
        if (Number.isNaN(max)) return res.status(400).json({ erro: 'precoMax deve ser numerico' });
        filtro.preco.$lte = max;
      }
    }

    // RF03: indice de texto em nome + descricao
    if (q) {
      filtro.$text = { $search: q };
    }

    // RF04: paginacao (limit/skip) + ordenacao por preco
    const lim = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const skp = Math.max(parseInt(skip, 10) || 0, 0);

    let ordenacao = {};
    if (sort === 'preco_asc') ordenacao = { preco: 1 };
    else if (sort === 'preco_desc') ordenacao = { preco: -1 };

    const [itens, total] = await Promise.all([
      Produto.find(filtro).sort(ordenacao).skip(skp).limit(lim),
      Produto.countDocuments(filtro),
    ]);

    return res.json({ total, limit: lim, skip: skp, itens });
  } catch (err) {
    return res.status(500).json({ erro: 'Falha ao listar produtos', detalhes: err.message });
  }
}

export async function buscarPorId(req, res) {
  if (idInvalido(req.params.id)) return res.status(400).json({ erro: 'ID invalido' });
  const produto = await Produto.findById(req.params.id);
  if (!produto) return res.status(404).json({ erro: 'Produto nao encontrado' });
  return res.json(produto);
}

// RF05 - Atualizacao de dados + incremento/decremento atomico do estoque via $inc.
// Envie { estoqueDelta: 5 } para incrementar ou { estoqueDelta: -3 } para decrementar.
// Demais campos do body sao aplicados via $set.
export async function atualizar(req, res) {
  try {
    if (idInvalido(req.params.id)) return res.status(400).json({ erro: 'ID invalido' });

    const { estoqueDelta, ...dados } = req.body || {};
    const update = {};

    if (dados && Object.keys(dados).length > 0) {
      update.$set = dados;
    }

    if (estoqueDelta !== undefined) {
      if (typeof estoqueDelta !== 'number' || !Number.isInteger(estoqueDelta)) {
        return res.status(400).json({ erro: 'estoqueDelta deve ser um inteiro' });
      }
      update.$inc = { estoque: estoqueDelta };
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ erro: 'Nenhum campo para atualizar' });
    }

    const produto = await Produto.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!produto) return res.status(404).json({ erro: 'Produto nao encontrado' });
    if (produto.estoque < 0) {
      // Reverte caso o $inc tenha deixado o estoque negativo
      await Produto.findByIdAndUpdate(req.params.id, { $inc: { estoque: -estoqueDelta } });
      return res.status(400).json({ erro: 'Operacao deixaria o estoque negativo' });
    }

    return res.json(produto);
  } catch (err) {
    return res.status(400).json({ erro: 'Falha ao atualizar produto', detalhes: err.message });
  }
}

// RF06 - Remocao por ID
export async function remover(req, res) {
  if (idInvalido(req.params.id)) return res.status(400).json({ erro: 'ID invalido' });
  const produto = await Produto.findByIdAndDelete(req.params.id);
  if (!produto) return res.status(404).json({ erro: 'Produto nao encontrado' });
  return res.status(204).send();
}
