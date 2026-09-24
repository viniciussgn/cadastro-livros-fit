const { validarLivro, dataValida } = require('../src/utils/validacao');

describe('dataValida', () => {
  test('aceita uma data real no passado', () => {
    expect(dataValida('17/08/1945')).toBe(true);
  });

  test('rejeita dia que não existe no mês', () => {
    expect(dataValida('31/02/2020')).toBe(false);
  });

  test('rejeita mês inválido', () => {
    expect(dataValida('12/31/2020')).toBe(false);
  });

  test('rejeita data no futuro', () => {
    expect(dataValida('01/01/2313')).toBe(false);
  });

  test('rejeita formato sem barras', () => {
    expect(dataValida('17081945')).toBe(false);
  });
});

describe('validarLivro', () => {
  test('retorna null para um livro válido', () => {
    expect(
      validarLivro({ titulo: 'Dom Casmurro', autor: 'Machado de Assis', dataPublicacao: '01/01/1899' })
    ).toBeNull();
  });

  test('aceita livro sem data de publicação', () => {
    expect(validarLivro({ titulo: 'Dom Casmurro', autor: 'Machado de Assis' })).toBeNull();
  });

  test('rejeita título ausente', () => {
    expect(validarLivro({ autor: 'Machado de Assis' })).toContain('Título');
  });

  test('rejeita título só com espaços', () => {
    expect(validarLivro({ titulo: '   ', autor: 'Machado de Assis' })).toContain('Título');
  });

  test('rejeita autor muito curto', () => {
    expect(validarLivro({ titulo: 'Dom Casmurro', autor: 'M' })).toContain('Autor');
  });

  test('rejeita data de publicação inválida', () => {
    expect(
      validarLivro({ titulo: 'Dom Casmurro', autor: 'Machado de Assis', dataPublicacao: '31/02/2020' })
    ).toContain('Data de publicação');
  });
});