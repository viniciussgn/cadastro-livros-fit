import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ListaLivros } from '../src/pages/ListaLivros';
import { listarLivros } from '../src/services/livroService';

vi.mock('../src/services/livroService', () => ({
  listarLivros: vi.fn(),
  buscarLivroPorId: vi.fn(),
  criarLivro: vi.fn(),
  atualizarLivro: vi.fn(),
  urlDaCapa: vi.fn(),
}));

const livrosDeExemplo = [
  { id: 1, titulo: 'Dom Casmurro', autor: 'Machado de Assis', criadoEm: '2026-01-01' },
  { id: 2, titulo: 'O Senhor dos Anéis', autor: 'J.R.R. Tolkien', criadoEm: '2026-01-01' },
];

function renderizarLista() {
  return render(
    <MemoryRouter>
      <ListaLivros />
    </MemoryRouter>
  );
}

describe('ListaLivros', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exibe os livros retornados pela API', async () => {
    vi.mocked(listarLivros).mockResolvedValue(livrosDeExemplo);
    renderizarLista();

    expect(await screen.findByText('Dom Casmurro')).toBeInTheDocument();
    expect(screen.getByText('O Senhor dos Anéis')).toBeInTheDocument();
  });

  it('exibe mensagem quando não há livros', async () => {
    vi.mocked(listarLivros).mockResolvedValue([]);
    renderizarLista();

    expect(await screen.findByText('Nenhum livro encontrado.')).toBeInTheDocument();
  });

  it('filtra os livros pelo título digitado na busca', async () => {
    const usuario = userEvent.setup();
    vi.mocked(listarLivros).mockResolvedValue(livrosDeExemplo);
    renderizarLista();

    await screen.findByText('Dom Casmurro');
    await usuario.type(screen.getByPlaceholderText('Buscar'), 'senhor');

    expect(screen.getByText('O Senhor dos Anéis')).toBeInTheDocument();
    expect(screen.queryByText('Dom Casmurro')).not.toBeInTheDocument();
  });

  it('abre o modal de cadastro ao clicar em "Novo"', async () => {
    const usuario = userEvent.setup();
    vi.mocked(listarLivros).mockResolvedValue(livrosDeExemplo);
    renderizarLista();

    await usuario.click(screen.getByRole('button', { name: 'Novo' }));

    expect(screen.getByRole('heading', { name: 'Novo livro' })).toBeInTheDocument();
  });
});