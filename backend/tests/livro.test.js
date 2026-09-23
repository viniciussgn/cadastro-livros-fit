const request = require('supertest');
const app = require('../src/app');

describe('Validações da API de Livros', () => {
  test('não deve criar livro sem título', async () => {
    const resposta = await request(app)
      .post('/livros')
      .send({ autor: 'Autor Teste' });

    expect(resposta.status).toBe(400);
    expect(resposta.body).toHaveProperty('erro');
  });

  test('não deve criar livro sem autor', async () => {
    const resposta = await request(app)
      .post('/livros')
      .send({ titulo: 'Título Teste' });

    expect(resposta.status).toBe(400);
  });

  test('não deve criar livro com título muito curto', async () => {
    const resposta = await request(app)
      .post('/livros')
      .send({ titulo: 'a', autor: 'Autor Válido' });

    expect(resposta.status).toBe(400);
    expect(resposta.body.erro).toContain('Título');
  });

  test('deve retornar 404 ao buscar livro inexistente', async () => {
    const resposta = await request(app).get('/livros/999999');

    expect(resposta.status).toBe(404);
  });

  test('deve retornar 404 ao excluir livro inexistente', async () => {
    const resposta = await request(app).delete('/livros/999999');

    expect(resposta.status).toBe(404);
  });
});

describe('Fluxo completo de CRUD', () => {
  let idCriado;

  test('deve criar um novo livro', async () => {
    const resposta = await request(app)
      .post('/livros')
      .send({
        titulo: 'Livro de Teste Automatizado',
        autor: 'Autor de Teste',
        descricao: 'Descrição criada pelo teste automatizado',
      });

    expect(resposta.status).toBe(201);
    expect(resposta.body).toHaveProperty('id');
    expect(resposta.body.titulo).toBe('Livro de Teste Automatizado');

    idCriado = resposta.body.id;
  });

  test('deve listar livros incluindo o criado', async () => {
    const resposta = await request(app).get('/livros');

    expect(resposta.status).toBe(200);
    expect(Array.isArray(resposta.body)).toBe(true);

    const encontrado = resposta.body.find((livro) => livro.id === idCriado);
    expect(encontrado).toBeDefined();
  });

  test('deve buscar o livro criado pelo id', async () => {
    const resposta = await request(app).get(`/livros/${idCriado}`);

    expect(resposta.status).toBe(200);
    expect(resposta.body.id).toBe(idCriado);
  });

  test('deve atualizar o livro criado', async () => {
    const resposta = await request(app)
      .put(`/livros/${idCriado}`)
      .send({
        titulo: 'Livro de Teste Atualizado',
        autor: 'Autor de Teste',
      });

    expect(resposta.status).toBe(200);
    expect(resposta.body.titulo).toBe('Livro de Teste Atualizado');
  });

  test('deve excluir o livro criado', async () => {
    const resposta = await request(app).delete(`/livros/${idCriado}`);

    expect(resposta.status).toBe(204);
  });

  test('livro excluído não deve mais existir', async () => {
    const resposta = await request(app).get(`/livros/${idCriado}`);

    expect(resposta.status).toBe(404);
  });
});