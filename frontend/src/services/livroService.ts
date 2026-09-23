import axios from 'axios';
import type { Livro } from '../types/Livro';

const API_URL = 'http://localhost:3000/livros';

export interface DadosLivro {
  titulo: string;
  autor: string;
  descricao?: string;
  dataPublicacao?: string;
  capa?: File | null;
}

function montarFormData(dados: DadosLivro): FormData {
  const formData = new FormData();
  formData.append('titulo', dados.titulo);
  formData.append('autor', dados.autor);
  formData.append('descricao', dados.descricao ?? '');
  formData.append('dataPublicacao', dados.dataPublicacao ?? '');
  if (dados.capa) {
    formData.append('capa', dados.capa);
  }
  return formData;
}

export async function listarLivros(): Promise<Livro[]> {
  const resposta = await axios.get(API_URL);
  return resposta.data;
}

export async function buscarLivroPorId(id: number): Promise<Livro> {
  const resposta = await axios.get(`${API_URL}/${id}`);
  return resposta.data;
}

export async function criarLivro(dados: DadosLivro): Promise<Livro> {
  const resposta = await axios.post(API_URL, montarFormData(dados));
  return resposta.data;
}

export async function atualizarLivro(id: number, dados: DadosLivro): Promise<Livro> {
  const resposta = await axios.put(`${API_URL}/${id}`, montarFormData(dados));
  return resposta.data;
}

export async function excluirLivro(id: number): Promise<void> {
  await axios.delete(`${API_URL}/${id}`);
}

export function urlDaCapa(capaUrl?: string): string | undefined {
  if (!capaUrl) return undefined;
  return `http://localhost:3000${capaUrl}`;
}