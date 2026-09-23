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
│   └── generated/       # Código gerado automaticamente pelo Prisma (não editar)
├── prisma/
│   └── schema.prisma    # Modelagem das tabelas do banco de dados
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
│   ├── App.tsx             # Configuração das rotas da aplicação
│   └── main.tsx
└── Dockerfile
```

O componente `FormularioLivro` é reutilizado tanto para cadastro quanto edição de livros, evitando duplicação de código.

## Tecnologias utilizadas

| Camada | Tecnologia |
|---|---|
| Front-end | React, TypeScript, Vite, React Router, Axios |
| Back-end | Node.js, Express, Prisma ORM |
| Banco de dados | PostgreSQL |
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
- `backend` — API REST, na porta `3000`
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
| dataPublicacao | Não | Data de publicação (texto livre) |
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
| dataPublicacao | String | Opcional |
| capaUrl | String | Opcional — caminho relativo da imagem de capa enviada |
| criadoEm | DateTime | Preenchido automaticamente na criação |

## Testes automatizados

O back-end conta com testes automatizados (Jest + Supertest) cobrindo validações de entrada e o fluxo completo de CRUD (criar, listar, buscar, atualizar e excluir).

Para rodar os testes, com o banco de dados no ar (`docker-compose up -d banco`):

```bash
cd backend
npm install
npm test
```

> Observação: os testes rodam contra o mesmo banco de desenvolvimento (simplificação consciente dado o prazo do teste técnico). Uma evolução natural seria usar um banco de dados dedicado para testes.

## Design de referência

O design da aplicação segue o protótipo disponibilizado no Figma:
[Link do protótipo](https://www.figma.com/proto/5vCRuFgi19dSYUOmpIYQCt/FIT-SE-Test---Webfull-stack)

## Autor

Vinícius Gonzalez de Freitas
