export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  descricao?: string;
  dataPublicacao?: string;
  capaUrl?: string;
  criadoEm: string;
}