import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { Livro } from '../types/Livro';
import { buscarLivroPorId, excluirLivro, urlDaCapa } from '../services/livroService';
import { ModalConfirmacao } from '../components/ModalConfirmacao';
import { FormularioLivro } from './FormularioLivro';
import './DetalhesLivro.css';

export function DetalhesLivro() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [livro, setLivro] = useState<Livro | null>(null);
  const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    carregarLivro();
  }, [id]);

  async function carregarLivro() {
    const dados = await buscarLivroPorId(Number(id));
    setLivro(dados);
  }

  async function handleExcluir() {
    await excluirLivro(Number(id));
    navigate('/');
  }

  if (!livro) return <p style={{ padding: '2rem' }}>Carregando...</p>;

  return (
    <div className="pagina-detalhes">
      <div className="cabecalho-detalhes">
        <Link to="/" className="link-voltar">← Voltar</Link>
        <div className="acoes-detalhes">
          <button className="link-editar" onClick={() => setMostrarFormulario(true)}>
            Editar
          </button>
          <button className="botao-link-excluir" onClick={() => setMostrarModalExcluir(true)}>
            Excluir
          </button>
        </div>
      </div>

      <div className="corpo-detalhes">
        <div className="info-detalhes">
          <h1>{livro.titulo}</h1>
          <div className="metadados">
            <span>Por {livro.autor}</span>
            {livro.dataPublicacao && <span>Publicado em {livro.dataPublicacao}</span>}
          </div>
          <p className="descricao">{livro.descricao || 'Sem descrição.'}</p>
        </div>
        <div className="capa-detalhes">
          {livro.capaUrl && <img src={urlDaCapa(livro.capaUrl)} alt={livro.titulo} />}
        </div>
      </div>

      {mostrarModalExcluir && (
        <ModalConfirmacao
          titulo="Tem certeza?"
          mensagem="Ao excluir este livro não será possível recuperá-lo. Realmente deseja excluí-lo?"
          textoConfirmar="Excluir"
          aoConfirmar={handleExcluir}
          aoCancelar={() => setMostrarModalExcluir(false)}
        />
      )}

      {mostrarFormulario && (
        <FormularioLivro
          livroId={livro.id}
          aoFechar={() => setMostrarFormulario(false)}
          aoSalvar={carregarLivro}
        />
      )}
    </div>
  );
}