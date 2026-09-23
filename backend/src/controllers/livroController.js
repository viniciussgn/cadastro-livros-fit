const livroService = require('../services/livroService');

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
    const titulo = req.body.titulo?.trim();
    const autor = req.body.autor?.trim();

    if (!titulo || titulo.length < 2) {
      return res.status(400).json({ erro: 'Título deve ter pelo menos 2 caracteres' });
    }
    if (!autor || autor.length < 2) {
      return res.status(400).json({ erro: 'Autor deve ter pelo menos 2 caracteres' });
    }

    const dados = { ...req.body, titulo, autor };
    if (req.file) {
      dados.capaUrl = `/uploads/${req.file.filename}`;
    }

    const novoLivro = await livroService.criarLivro(dados);
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

    const titulo = req.body.titulo?.trim();
    const autor = req.body.autor?.trim();

    if (!titulo || titulo.length < 2) {
      return res.status(400).json({ erro: 'Título deve ter pelo menos 2 caracteres' });
    }
    if (!autor || autor.length < 2) {
      return res.status(400).json({ erro: 'Autor deve ter pelo menos 2 caracteres' });
    }

    const dados = { ...req.body, titulo, autor };
    if (req.file) {
      dados.capaUrl = `/uploads/${req.file.filename}`;
    }

    const livro = await livroService.atualizarLivro(req.params.id, dados);
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