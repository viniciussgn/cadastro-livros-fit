const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function listarLivros() {
  return prisma.livro.findMany();
}

async function buscarLivroPorId(id) {
  return prisma.livro.findUnique({ where: { id: Number(id) } });
}

async function criarLivro(dados) {
  return prisma.livro.create({
    data: {
      titulo: dados.titulo,
      autor: dados.autor,
      descricao: dados.descricao,
      dataPublicacao: dados.dataPublicacao,
      capaUrl: dados.capaUrl,
    },
  });
}

async function atualizarLivro(id, dados) {
  const dadosParaAtualizar = {
    titulo: dados.titulo,
    autor: dados.autor,
    descricao: dados.descricao,
    dataPublicacao: dados.dataPublicacao,
  };

  if (dados.capaUrl) {
    dadosParaAtualizar.capaUrl = dados.capaUrl;
  }

  return prisma.livro.update({
    where: { id: Number(id) },
    data: dadosParaAtualizar,
  });
}

async function excluirLivro(id) {
  return prisma.livro.delete({ where: { id: Number(id) } });
}

module.exports = {
  listarLivros,
  buscarLivroPorId,
  criarLivro,
  atualizarLivro,
  excluirLivro,
};