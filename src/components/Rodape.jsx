// Copyright (c) 2026 Daniel Felix Ferber

import "./Rodape.css";

// Aviso de independência e marcas, exigido em requisitos.md § Privacidade, e
// o link da política de privacidade — nas duas telas (Tarefa 0008-0004).
// Este é o rodapé da tela principal: rola com o conteúdo, não flutua
// (docs/interface.md § Camadas), com o filete superior que a tela de login
// não tem (`TelaDeLogin.jsx` mantém o seu próprio rodapé, sem filete, desde
// a Tarefa 0008-0002).
export function Rodape({ onAbrirPolitica }) {
  return (
    <footer className="rodape">
      <p className="rodape__texto">
        Projeto independente, sem vínculo com Panini ou FIFA; marcas
        pertencem aos seus titulares (Lei 9.279/96, art. 132).
      </p>
      <button type="button" className="rodape__politica" onClick={onAbrirPolitica}>
        Política de privacidade
      </button>
    </footer>
  );
}
