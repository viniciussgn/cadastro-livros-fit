import { describe, it, expect } from 'vitest';
import { formatarData, dataValida } from '../src/utils/data';

describe('formatarData', () => {
  it('insere as barras enquanto o usuário digita', () => {
    expect(formatarData('17')).toBe('17');
    expect(formatarData('1708')).toBe('17/08');
    expect(formatarData('17081945')).toBe('17/08/1945');
  });

  it('ignora caracteres que não são números', () => {
    expect(formatarData('17a08b1945')).toBe('17/08/1945');
  });

  it('limita a 8 dígitos', () => {
    expect(formatarData('170819451234')).toBe('17/08/1945');
  });
});

describe('dataValida', () => {
  it('aceita uma data real no passado', () => {
    expect(dataValida('17/08/1945')).toBe(true);
  });

  it('rejeita dia que não existe no mês', () => {
    expect(dataValida('31/02/2020')).toBe(false);
  });

  it('rejeita mês inválido', () => {
    expect(dataValida('12/31/2020')).toBe(false);
  });

  it('rejeita data no futuro', () => {
    expect(dataValida('01/01/2313')).toBe(false);
  });

  it('rejeita formato incompleto', () => {
    expect(dataValida('17/08')).toBe(false);
  });
});