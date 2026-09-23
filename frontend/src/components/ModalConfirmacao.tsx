import './ModalConfirmacao.css';

interface Props {
  titulo: string;
  mensagem: string;
  textoConfirmar: string;
  aoConfirmar: () => void;
  aoCancelar: () => void;
}

export function ModalConfirmacao({ titulo, mensagem, textoConfirmar, aoConfirmar, aoCancelar }: Props) {
  return (
    <div className="fundo-modal">
      <div className="caixa-modal">
        <h2>{titulo}</h2>
        <p>{mensagem}</p>
        <div className="acoes-modal">
          <button className="botao botao-secundario" onClick={aoCancelar}>Cancelar</button>
          <button className="botao botao-perigo" onClick={aoConfirmar}>{textoConfirmar}</button>
        </div>
      </div>
    </div>
  );
}