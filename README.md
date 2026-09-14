# API-REST-MongoDB

API RESTful (Node.js + Express + MongoDB/Mongoose) para catalogo de produtos de e-commerce. Colecao unica com esquema dinamico (`especificacoes`).

## Demonstração

https://github.com/user-attachments/assets/76040ad1-3a89-4f64-bcd4-444fdd7cfc80

## Rodar

```bash
cp .env.example .env   # preencha com suas próprias variáveis (no PowerShell: Copy-Item .env.example .env)
npm install
npm run dev
```

## Endpoints

| Metodo | Rota | RF |
|---|---|---|
| GET | `/health` | Status da API (`{ "status": "ok" }`, nao usa o banco) |
| POST | `/api/produtos` | RF01 cadastro (nome, preco, categoria, estoque + `especificacoes` livre) |
| GET | `/api/produtos?categoria=&precoMin=&precoMax=&q=&limit=&skip=&sort=` | RF02 filtros `$eq/$gte/$lte`, RF03 busca texto `$text`, RF04 `limit/skip` + `sort=preco_asc\|preco_desc` |
| GET | `/api/produtos/:id` | Busca por ID (`400` ID invalido, `404` nao encontrado) |
| PATCH | `/api/produtos/:id` | RF05 `$set` + `$inc` via `estoqueDelta` |
| DELETE | `/api/produtos/:id` | RF06 remove por ID (responde `204` sem corpo) |

### Parametros da listagem (`GET /api/produtos`)

| Parametro | Tipo | Padrao | Regras |
|---|---|---|---|
| `categoria` | string | — | Igualdade exata (`$eq`) |
| `precoMin` / `precoMax` | number | — | Faixa inclusiva (`$gte`/`$lte`); valor nao numerico retorna `400` |
| `q` | string | — | Busca textual (`$text/$search`) em `nome` + `descricao` (indice de texto) |
| `limit` | int | `10` | Min `1`, max `100` |
| `skip` | int | `0` | Min `0` |
| `sort` | string | — (sem ordenacao) | `preco_asc` (crescente) ou `preco_desc` (decrescente) |

Resposta da listagem: `{ "total": number, "limit": number, "skip": number, "itens": [] }`
(`total` e a contagem com os filtros aplicados, antes de `limit/skip`).

### Status e validacoes

- Sucesso: `POST` → `201`, `GET/PATCH` → `200`, `DELETE` → `204` (sem corpo).
- Erros: `400` (validacao ou ID invalido), `404` (produto nao encontrado), `500` (falha ao listar).
- Campos obrigatorios: `nome`, `preco`, `categoria`, `estoque`.
- Regras: `preco >= 0`; `estoque` inteiro `>= 0`; `estoqueDelta` (RF05) deve ser inteiro.
- RF05: demais campos do body vao via `$set`; `estoqueDelta` vai via `$inc` atomico.
  Operacao que deixaria `estoque < 0` e revertida e retorna `400`.
  Body sem campos validos retorna `400`.

## Seed (povoamento inicial)

Popula a colecao com 8 produtos cobrindo os RFs (roupas com `tamanho/cor`,
eletrodomesticos com `voltagem/potencia`, 4 categorias, precos de 79.9 a 2499
e termos buscaveis como `air fryer`, `algodao` e `bluetooth`).

```bash
npm run seed   # exige .env com MONGODB_URI valida
```

O script (`src/seed.js`) conecta no banco do `.env`, executa `deleteMany({})`
(limpa a colecao mantendo os indices) e insere via `insertMany()`.
Saida esperada: `MongoDB conectado` → `Colecao limpa` →
`8 produtos inseridos` → `Seed concluido`.

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

Remocao (RF06): `DELETE /api/produtos/:id` → `204` (sem corpo)

## Banco e collection

- **Banco:** o nome apos `.net/` na `MONGODB_URI` (ex.: `/ecommerce`).
  Troque para usar/criar outro banco — o Atlas cria no primeiro insert.
- **Collection:** definida em `src/models/Produto.js` via `COLLECTION_NAME`
  (padrao `produtos`, configuravel com `COLLECTION_NAME=` no `.env`).
