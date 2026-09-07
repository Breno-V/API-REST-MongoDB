# API-REST-MongoDB

API RESTful (Node.js + Express + MongoDB/Mongoose) para catalogo de produtos de e-commerce. Colecao unica com esquema dinamico (`especificacoes`).

## Rodar

```bash
cp .env.example .env   # preencha com suas próprias variáveis
npm install
npm run dev
```

## Endpoints

| Metodo | Rota | RF |
|---|---|---|
| POST | `/api/produtos` | RF01 cadastro (nome, preco, categoria, estoque + `especificacoes` livre) |
| GET | `/api/produtos?categoria=&precoMin=&precoMax=&q=&limit=&skip=&sort=` | RF02 filtros `$eq/$gte/$lte`, RF03 busca texto `$text`, RF04 `limit/skip` + `sort=preco_asc\|preco_desc` |
| GET | `/api/produtos/:id` | |
| PATCH | `/api/produtos/:id` | RF05 `$set` + `$inc` via `estoqueDelta` |
| DELETE | `/api/produtos/:id` | RF06 |

## Exemplos

Roupa (RF01):
```json
{ "nome": "Camiseta", "descricao": "algodao", "preco": 79.9, "categoria": "roupas", "estoque": 50, "especificacoes": { "tamanho": "G", "cor": "preta" } }
```

Eletrodomestico (RF01):
```json
{ "nome": "Air Fryer", "descricao": "5L digital", "preco": 499.9, "categoria": "eletrodomesticos", "estoque": 20, "especificacoes": { "voltagem": "220V", "potencia": "1500W" } }
```

Filtros (RF02): `GET /api/produtos?categoria=roupas&precoMin=50&precoMax=100`

Busca (RF03): `GET /api/produtos?q=air fryer`

Paginacao (RF04): `GET /api/produtos?limit=10&skip=20&sort=preco_desc`

Estoque (RF05): `PATCH /api/produtos/:id` body `{ "estoqueDelta": -2 }`

## Banco e collection

- **Banco:** o nome apos `.net/` na `MONGODB_URI` (ex.: `/ecommerce`).
  Troque para usar/criar outro banco — o Atlas cria no primeiro insert.
- **Collection:** definida em `src/models/Produto.js` via `COLLECTION_NAME`
  (padrao `produtos`, configuravel com `COLLECTION_NAME=` no `.env`).
