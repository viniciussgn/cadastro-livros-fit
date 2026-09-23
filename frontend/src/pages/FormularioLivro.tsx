import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  buscarLivroPorId,
  criarLivro,
  atualizarLivro,
  urlDaCapa,
} from '../services/livroService';
import './FormularioLivro.css';

interface Props {
  livroId?: number;
  aoFechar: () => void;
  aoSalvar: () => void;
}

export function FormularioLivro({ livroId, aoFechar, aoSalvar }: Props) {
  const modoEdicao = Boolean(livroId);

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [dataPublicacao, setDataPublicacao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [capa, setCapa] = useState<File | null>(null);
  const [previewCapa, setPreviewCapa] = useState<string | undefined>(undefined);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (livroId) {
      carregarLivro(livroId);
    }
  }, [livroId]);

  async function carregarLivro(id: number) {
    const livro = await buscarLivroPorId(id);
    setTitulo(livro.titulo);
    setAutor(livro.autor);
    setDataPublicacao(livro.dataPublicacao ?? '');
    setDescricao(livro.descricao ?? '');
    setPreviewCapa(urlDaCapa(livro.capaUrl));
  }

  function handleEscolherImagem(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    setCapa(arquivo);
    setPreviewCapa(URL.createObjectURL(arquivo));
  }

  function handleMudarData(e: React.ChangeEvent<HTMLInputElement>) {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 8) valor = valor.slice(0, 8);

    if (valor.length > 4) {
      valor = `${valor.slice(0, 2)}/${valor.slice(2, 4)}/${valor.slice(4)}`;
    } else if (valor.length > 2) {
      valor = `${valor.slice(0, 2)}/${valor.slice(2)}`;
    }

    setDataPublicacao(valor);
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    setErro('');

    if (!titulo.trim() || !autor.trim()) {
      setErro('Título e autor são obrigatórios.');
      return;
    }

    setSalvando(true);
    try {
      const dados = { titulo, autor, dataPublicacao, descricao, capa };

      if (modoEdicao && livroId) {
        await atualizarLivro(livroId, dados);
      } else {
        await criarLivro(dados);
      }

      aoSalvar();
      aoFechar();
    } catch (erro) {
      if (axios.isAxiosError(erro) && erro.response?.data?.erro) {
        setErro(erro.response.data.erro);
      } else {
        setErro('Não foi possível salvar o livro. Tente novamente.');
      }
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fundo-modal-formulario">
      <div className="caixa-formulario">
        <h1>{modoEdicao ? 'Editar livro' : 'Novo livro'}</h1>

        {erro && <p className="erro-formulario">{erro}</p>}

        <form onSubmit={handleSalvar}>
          <div className="linha-formulario">
            <div className="campos-texto">
              <input
                type="text"
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
              <input
                type="text"
                placeholder="Autor"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
              />
              <input
                type="text"
                placeholder="Data de publicação"
                value={dataPublicacao}
                onChange={handleMudarData}
                maxLength={10}
              />
            </div>

            <label className="area-upload">
              {previewCapa ? (
                <img src={previewCapa} alt="Prévia da capa" />
              ) : (
                <>
                  <span>🖼️</span>
                  <span>Escolher imagem</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleEscolherImagem} />
            </label>
          </div>

          <textarea
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <div className="acoes-formulario">
            <button type="button" className="botao botao-secundario" onClick={aoFechar}>
              Cancelar
            </button>
            <button type="submit" className="botao botao-primario" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}