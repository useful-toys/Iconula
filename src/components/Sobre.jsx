// Copyright (c) 2026 Daniel Felix Ferber

import "./Sobre.css";

// Tela Sobre (IDR 0063) — vista interna, sem router (TDR 0020): `onVoltar`
// devolve para a tela de onde o usuário veio, sem depender do histórico do
// navegador. Alcançável pelo rodapé da tela principal e por um link da tela
// de login. Traz os dois links externos do projeto — código-fonte e issues do
// GitHub —, os únicos do app que saem do domínio, por isso abrem em aba nova
// com `rel="noopener noreferrer"`. Copyright e isenção não se repetem: já
// vivem no rodapé.
export default function Sobre({ onVoltar }) {
  return (
    <div className="sobre">
      <div className="sobre__corpo">
        <button type="button" className="sobre__voltar" onClick={onVoltar}>
          <span aria-hidden="true">←</span> Voltar
        </button>

        <h1 className="sobre__titulo">Sobre</h1>

        <p>
          <strong>ICONULA 2026</strong> — Controle suas figurinhas do álbum da
          Copa do Mundo FIFA 2026.
        </p>
        <p>
          O Iconula é um aplicativo gratuito e independente, sem vínculo com
          Panini ou FIFA. O código é aberto e o canal para reportar problemas
          ou sugerir melhorias é o GitHub do projeto.
        </p>

        <p className="sobre__links">
          <a
            className="sobre__link"
            href="https://github.com/useful-toys/Iconula"
            target="_blank"
            rel="noopener noreferrer"
          >
            Código-fonte no GitHub
          </a>
        </p>
        <p className="sobre__links">
          <a
            className="sobre__link"
            href="https://github.com/useful-toys/Iconula/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            Reportar um problema ou sugerir algo
          </a>
        </p>
      </div>
    </div>
  );
}
