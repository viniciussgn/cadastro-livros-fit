function dataValida(data) {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(data);
  if (!partes) return false;

  const dia = Number(partes[1]);
  const mes = Number(partes[2]);
  const ano = Number(partes[3]);
  const dataCriada = new Date(ano, mes - 1, dia);

  const existe =
    dataCriada.getFullYear() === ano &&
    dataCriada.getMonth() === mes - 1 &&
    dataCriada.getDate() === dia;

  return existe && dataCriada <= new Date();
}

function validarLivro(dados) {
  const titulo = dados.titulo?.trim();
  const autor = dados.autor?.trim();
  const dataPublicacao = dados.dataPublicacao?.trim();

  if (!titulo || titulo.length < 2) {
    return 'Título deve ter pelo menos 2 caracteres';
  }
  if (!autor || autor.length < 2) {
    return 'Autor deve ter pelo menos 2 caracteres';
  }
  if (dataPublicacao && !dataValida(dataPublicacao)) {
    return 'Data de publicação inválida. Use o formato DD/MM/AAAA';
  }
  return null;
}

module.exports = { validarLivro, dataValida };