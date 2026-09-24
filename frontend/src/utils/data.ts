export function formatarData(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 8);

  if (digitos.length > 4) {
    return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
  }
  if (digitos.length > 2) {
    return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  }
  return digitos;
}

export function dataValida(data: string): boolean {
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