const livroService = require('../services/livroService');
const { validarLivro } = require('../utils/validacao');

function montarDados(req) {
  const dados = {
    ...req.body,
    titulo: req.body.titulo?.trim(),
    autor: req.body.autor?.trim(),
  };
  if (req.file) {
    dados.capaUrl = `/uploads/${req.file.filename}`;
  }
  return dados;
}

async function listar(req, res) {
  try {
    const livros = await livroService.listarLivros();
    res.json(livros);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao listar livros' });
  }
}

async function buscarPorId(req, res) {
  try {
    const livro = await livroService.buscarLivroPorId(req.params.id);
    if (!livro) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }
    res.json(livro);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar livro' });
  }
}

async function criar(req, res) {
  try {
    const erroValidacao = validarLivro(req.body);
    if (erroValidacao) {
      return res.status(400).json({ erro: erroValidacao });
    }

    const novoLivro = await livroService.criarLivro(montarDados(req));
    res.status(201).json(novoLivro);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao criar livro' });
  }
}

async function atualizar(req, res) {
  try {
    const livroExistente = await livroService.buscarLivroPorId(req.params.id);
    if (!livroExistente) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    const erroValidacao = validarLivro(req.body);
    if (erroValidacao) {
      return res.status(400).json({ erro: erroValidacao });
    }

    const livro = await livroService.atualizarLivro(req.params.id, montarDados(req));
    res.json(livro);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao atualizar livro' });
  }
}

async function excluir(req, res) {
  try {
    const livroExistente = await livroService.buscarLivroPorId(req.params.id);
    if (!livroExistente) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    await livroService.excluirLivro(req.params.id);
    res.status(204).send();
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao excluir livro' });
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir };