import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormularioLivro } from '../src/pages/FormularioLivro';
import { criarLivro } from '../src/services/livroService';

vi.mock('../src/services/livroService', () => ({
  buscarLivroPorId: vi.fn(),
  criarLivro: vi.fn(),
  atualizarLivro: vi.fn(),
  urlDaCapa: vi.fn(),
}));

describe('FormularioLivro', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mostra o título "Novo livro" quando não recebe um livro para editar', () => {
    render(<FormularioLivro aoFechar={vi.fn()} aoSalvar={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Novo livro' })).toBeInTheDocument();
  });

  it('formata a data de publicação enquanto o usuário digita', async () => {
    const usuario = userEvent.setup();
    render(<FormularioLivro aoFechar={vi.fn()} aoSalvar={vi.fn()} />);

    const campoData = screen.getByPlaceholderText('Data de publicação');
    await usuario.type(campoData, '17081945');

    expect(campoData).toHaveValue('17/08/1945');
  });

  it('mostra erro e não salva quando título e autor estão vazios', async () => {
    const usuario = userEvent.setup();
    render(<FormularioLivro aoFechar={vi.fn()} aoSalvar={vi.fn()} />);

    await usuario.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(screen.getByText('Título e autor são obrigatórios.')).toBeInTheDocument();
    expect(criarLivro).not.toHaveBeenCalled();
  });

  it('mostra erro e não salva quando a data é inválida', async () => {
    const usuario = userEvent.setup();
    render(<FormularioLivro aoFechar={vi.fn()} aoSalvar={vi.fn()} />);

    await usuario.type(screen.getByPlaceholderText('Título'), 'Livro de Teste');
    await usuario.type(screen.getByPlaceholderText('Autor'), 'Autor de Teste');
    await usuario.type(screen.getByPlaceholderText('Data de publicação'), '31022020');
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(screen.getByText(/Data de publicação inválida/)).toBeInTheDocument();
    expect(criarLivro).not.toHaveBeenCalled();
  });

  it('salva o livro e fecha o modal quando os dados são válidos', async () => {
    const usuario = userEvent.setup();
    const aoFechar = vi.fn();
    const aoSalvar = vi.fn();
    vi.mocked(criarLivro).mockResolvedValue({
      id: 1,
      titulo: 'Dom Casmurro',
      autor: 'Machado de Assis',
      criadoEm: '2026-01-01',
    });

    render(<FormularioLivro aoFechar={aoFechar} aoSalvar={aoSalvar} />);

    await usuario.type(screen.getByPlaceholderText('Título'), 'Dom Casmurro');
    await usuario.type(screen.getByPlaceholderText('Autor'), 'Machado de Assis');
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => {
      expect(criarLivro).toHaveBeenCalledWith(
        expect.objectContaining({ titulo: 'Dom Casmurro', autor: 'Machado de Assis' })
      );
      expect(aoSalvar).toHaveBeenCalled();
      expect(aoFechar).toHaveBeenCalled();
    });
  });
});