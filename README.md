# 📚 Cadastro e Consulta de Livros

Aplicação full stack para cadastro, consulta, edição e exclusão de livros, desenvolvida como avaliação técnica para a empresa FIT (Instituto de Tecnologia).

## Visão Geral (Overview)

A aplicação permite ao usuário cadastrar, buscar, editar e excluir livros de seu interesse, através de duas telas:

- **Página de consulta**: lista os livros cadastrados, permite buscar por título e cadastrar um novo livro.
- **Página de detalhes**: exibe a descrição completa do livro selecionado, com opções de edição e exclusão.

O projeto é dividido em duas aplicações independentes que se comunicam via API REST:

- **Front-end**: React + TypeScript, responsável pela interface do usuário.
- **Back-end**: Node.js + Express, responsável pela regra de negócio e persistência dos dados.
- **Banco de dados**: PostgreSQL, acessado através do ORM Prisma.

Toda a aplicação (front-end, back-end e banco de dados) é conteinerizada com Docker e orquestrada com Docker Compose, permitindo subir o ambiente completo com um único comando.

### Arquitetura do back-end

O back-end segue uma organização em camadas, separando responsabilidades:

```
backend/
├── src/
│   ├── routes/         # Define os endpoints da API e direciona para os controllers
│   ├── controllers/    # Recebe a requisição HTTP, valida entrada e delega ao service
│   ├── services/        # Contém a regra de negócio e o acesso ao banco via Prisma
│   ├── config/           # Configuração do multer (upload de imagens)
│   ├── utils/            # Funções de validação (título, autor, data de publicação)
│   └── generated/       # Código gerado automaticamente pelo Prisma (não editar)
├── prisma/
│   └── schema.prisma    # Modelagem das tabelas do banco de dados
├── tests/                # Testes unitários e de integração (Jest + Supertest)
├── uploads/              # Imagens de capa enviadas pelos usuários (persistido via volume Docker)
├── index.js              # Ponto de entrada da aplicação (configuração do Express)
└── Dockerfile
```

Fluxo de uma requisição: `rota → controller → service → banco de dados`, com a resposta retornando pelo mesmo caminho. Erros inesperados são tratados com `try/catch` em cada controller, retornando status HTTP apropriados (400 para validação, 404 para recurso não encontrado, 500 para erro interno).

### Arquitetura do front-end

```
frontend/
├── src/
│   ├── pages/            # Telas da aplicação (Lista, Detalhes, Formulário de criação/edição)
│   ├── components/        # Componentes reutilizáveis (ex: modal de confirmação de exclusão)
│   ├── services/          # Comunicação com a API do back-end (via axios)
│   ├── types/             # Tipagem TypeScript das entidades (Livro)
│   ├── utils/             # Funções utilitárias (máscara e validação de data)
│   ├── assets/icones/     # Ícones SVG extraídos do design no Figma
│   ├── App.tsx             # Configuração das rotas da aplicação
│   └── main.tsx
├── tests/                  # Testes de componentes e utilitários (Vitest + Testing Library)
└── Dockerfile
```

Cadastro e edição de livros abrem em modais sobre a tela atual, seguindo o protótipo do Figma. O componente `FormularioLivro` é reutilizado nos dois casos, evitando duplicação de código.

## Tecnologias utilizadas

| Camada | Tecnologia |
|---|---|
| Front-end | React, TypeScript, Vite, React Router, Axios |
| Back-end | Node.js, Express, Prisma ORM, Multer |
| Banco de dados | PostgreSQL |
| Testes | Jest, Supertest, Vitest, Testing Library |
| Conteinerização | Docker, Docker Compose |

## Pré-requisitos

Para rodar o projeto é necessário ter instalado:

- [Docker](https://www.docker.com/products/docker-desktop) e Docker Compose (já incluso no Docker Desktop)

Não é necessário ter Node.js instalado na máquina para rodar via Docker — tudo é resolvido dentro dos containers.

## Como executar o projeto

Na raiz do projeto, execute:

```bash
docker-compose up --build
```

Esse comando sobe 3 containers:

- `banco` — PostgreSQL, na porta `5432`
- `backend` — API REST, na porta `3000` (ao iniciar, aplica automaticamente as migrations do banco com `prisma migrate deploy`, criando as tabelas necessárias)
- `frontend` — interface web, na porta `5173`

Após a inicialização (pode levar um pouco mais de tempo na primeira execução, enquanto as imagens são construídas), acesse:

```
http://localhost:5173
```

Para parar a aplicação:

```bash
docker-compose down
```

## Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/livros` | Lista todos os livros |
| GET | `/livros/:id` | Busca um livro pelo id |
| POST | `/livros` | Cadastra um novo livro |
| PUT | `/livros/:id` | Atualiza um livro existente |
| DELETE | `/livros/:id` | Exclui um livro |
| GET | `/health` | Verifica se a API está no ar |

As rotas `POST` e `PUT` recebem os dados como `multipart/form-data` (permitindo o envio de arquivo de imagem junto com os campos de texto), com os seguintes campos:

| Campo | Obrigatório | Descrição |
|---|---|---|
| titulo | Sim (mín. 2 caracteres) | Título do livro |
| autor | Sim (mín. 2 caracteres) | Autor do livro |
| descricao | Não | Descrição/sinopse |
| dataPublicacao | Não | Data de publicação no formato DD/MM/AAAA (data existente e não futura) |
| capa | Não | Arquivo de imagem da capa |

As imagens enviadas ficam disponíveis em `http://localhost:3000/uploads/<nome-do-arquivo>` e são persistidas através de um volume Docker (`uploads_livros`), sobrevivendo a reinícios dos containers.

## Modelagem do banco de dados

Tabela `Livro`:

| Campo | Tipo | Observação |
|---|---|---|
| id | Int | Chave primária, autoincremento |
| titulo | String | Obrigatório, mínimo 2 caracteres |
| autor | String | Obrigatório, mínimo 2 caracteres |
| descricao | String | Opcional |
| dataPublicacao | String | Opcional, formato DD/MM/AAAA |
| capaUrl | String | Opcional — caminho relativo da imagem de capa enviada |
| criadoEm | DateTime | Preenchido automaticamente na criação |

## Testes automatizados

O projeto possui testes automatizados no back-end e no front-end.

### Back-end (Jest + Supertest)

- **Testes unitários** (`tests/validacao.test.js`): regras de validação de título, autor e data de publicação, sem dependência de banco de dados.
- **Testes de integração** (`tests/livro.test.js`): chamadas HTTP reais à API, cobrindo validações e o fluxo completo de CRUD (criar, listar, buscar, atualizar e excluir). Precisam do banco de dados em execução.

Pré-requisito adicional: [Node.js](https://nodejs.org) (versão LTS).

**1. Suba apenas o banco de dados** (na raiz do projeto):

```bash
docker-compose up -d banco
```

**2. Crie o arquivo `.env` do back-end** a partir do exemplo:

```bash
cd backend

# Linux / macOS
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

**3. Instale as dependências e rode os testes:**

```bash
npm install
npm test
```

O comando `npm test` executa automaticamente, antes dos testes, a geração do Prisma Client (`prisma generate`) e a aplicação das migrations no banco (`prisma migrate deploy`), através do script `pretest`.

> Observação: os testes de integração rodam contra o mesmo banco de desenvolvimento (simplificação consciente dado o prazo do teste técnico). Eles criam e removem os próprios registros, sem deixar dados residuais. Uma evolução natural seria usar um banco de dados dedicado para testes.

### Front-end (Vitest + Testing Library)

- **Testes unitários** (`tests/data.test.ts`): máscara e validação da data de publicação.
- **Testes de componentes** (`tests/ListaLivros.test.tsx` e `tests/FormularioLivro.test.tsx`): exibição da lista, filtro de busca, abertura do modal de cadastro, mensagens de erro de validação e envio do formulário.

A camada de comunicação com a API é simulada (mock), então esses testes não precisam do back-end nem do banco de dados em execução:

```bash
cd frontend
npm install
npm test
```

## Design de referência

O design da aplicação segue o protótipo disponibilizado no Figma:
[Link do protótipo](https://www.figma.com/proto/5vCRuFgi19dSYUOmpIYQCt/FIT-SE-Test---Webfull-stack)

## Autor

Vinícius Gonzalez de Freitas
