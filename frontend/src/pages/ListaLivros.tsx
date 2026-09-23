import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Livro } from '../types/Livro';
import { listarLivros, urlDaCapa } from '../services/livroService';
import { FormularioLivro } from './FormularioLivro';
import './ListaLivros.css';

export function ListaLivros() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [busca, setBusca] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    carregarLivros();
  }, []);

  async function carregarLivros() {
    const dados = await listarLivros();
    setLivros(dados);
  }

  const livrosFiltrados = livros.filter((livro) =>
    livro.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="pagina-lista">
      <div className="cabecalho-lista">
        <h1>Livros</h1>
        <button className="link-novo" onClick={() => setMostrarFormulario(true)}>
          Novo
        </button>
      </div>

      <div className="campo-busca">
        <input
          type="text"
          placeholder="Buscar"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <span className="icone-busca">🔍</span>
      </div>

      {livrosFiltrados.length === 0 ? (
        <p className="mensagem-vazia">Nenhum livro encontrado.</p>
      ) : (
        <div className="grade-livros">
          {livrosFiltrados.map((livro) => (
            <Link key={livro.id} to={`/livros/${livro.id}`} className="cartao-livro">
              <div className="capa-cartao">
                {livro.capaUrl && <img src={urlDaCapa(livro.capaUrl)} alt={livro.titulo} />}
              </div>
              <div className="conteudo-cartao">
                <h3>{livro.titulo}</h3>
                <p>{livro.descricao}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {mostrarFormulario && (
        <FormularioLivro
          aoFechar={() => setMostrarFormulario(false)}
          aoSalvar={carregarLivros}
        />
      )}
    </div>
  );
}