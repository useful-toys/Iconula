// Copyright (c) 2026 Daniel Felix Ferber

import "./Rodape.css";

// Rodapé da tela principal, com a ordem e os textos do IDR 0053: copyright,
// aviso de independência e marcas (requisitos.md § Privacidade), isenção de
// responsabilidade e a linha com os dois links — política (IDR 0037) e termos
// (TDR 0020). Rola com o conteúdo, não flutua (docs/interface.md § Camadas),
// com o filete superior que a tela de login não tem (`TelaDeLogin.jsx` mantém
// o seu próprio rodapé, sem filete, desde a Tarefa 0008-0002).
export function Rodape({ onAbrirPolitica, onAbrirTermos }) {
  return (
    <footer className="rodape">
      <p className="rodape__linha">© 2026 Daniel Felix Ferber</p>
      <p className="rodape__linha">
        Projeto independente, sem vínculo com Panini ou FIFA; marcas
        pertencem aos seus titulares (Lei 9.279/96, art. 132).
      </p>
      <p className="rodape__linha">
        Uso por sua conta e risco, sem garantias.
      </p>
      <p className="rodape__linha rodape__links">
        <button type="button" className="rodape__link" onClick={onAbrirPolitica}>
          Política de privacidade
        </button>{" "}
        <span className="rodape__separador" aria-hidden="true">·</span>{" "}
        <button type="button" className="rodape__link" onClick={onAbrirTermos}>
          Termos de uso
        </button>
      </p>
    </footer>
  );
}
