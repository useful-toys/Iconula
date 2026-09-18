// Copyright (c) 2026 Daniel Felix Ferber

import "./ContaApagada.css";

// Tela final da exclusão de dados (IDR 0060, Tarefa 0031-0003): em branco,
// com o título "Conta apagada", uma linha curta de confirmação e o botão
// "Voltar à tela de login". Vista própria, sem router e sem rolagem própria
// — montada antes da guarda de login (TDR 0020), então sobrevive ao fim da
// sessão que o `deleteUser` provoca. `onVoltar` devolve à tela de login,
// com o botão do Google, sem abrir popup automaticamente.
export default function ContaApagada({ onVoltar }) {
  return (
    <div className="conta-apagada">
      <div className="conta-apagada__corpo">
        <h1 className="conta-apagada__titulo">Conta apagada</h1>
        <p className="conta-apagada__linha">
          Sua conta de login e a sua coleção de figurinhas foram apagadas.
        </p>
        <button
          type="button"
          className="conta-apagada__botao"
          onClick={onVoltar}
        >
          Voltar à tela de login
        </button>
      </div>
    </div>
  );
}
