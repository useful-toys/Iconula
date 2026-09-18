// Copyright (c) 2026 Daniel Felix Ferber

import LoginButton from "./LoginButton";
import "./TelaDeLogin.css";

// Tela de login especificada em docs/interface.md § Tela de login: cartão
// centrado sobre o fundo gramado, com o botão do Google (LoginButton — único
// ponto que toca o SDK, ver ADR 0006) e os textos exatos do protótipo.
//
// A atestação aqui é só texto informativo, como no protótipo: o passo
// explícito de atestação (o clique que grava `atestadoEm`) é a Tarefa
// 0008-0003, que decide o fluxo — não implementado aqui.
//
// A frase de aceite e os links da política, dos termos e do Sobre acionam as
// vistas internas sem router (TDR 0020), ligados em `App.jsx` via
// `onAbrirPolitica`, `onAbrirTermos` e `onAbrirSobre` — callbacks no-op por
// padrão (IDR 0053, IDR 0063).
export default function TelaDeLogin({
  onAbrirPolitica = () => {},
  onAbrirTermos = () => {},
  onAbrirSobre = () => {},
}) {
  return (
    <div className="tela-de-login">
      <div className="tela-de-login__bloco">
        <div className="tela-de-login__cartao">
          <h1 className="tela-de-login__titulo">ICONULA 2026</h1>
          <p className="tela-de-login__subtitulo">
            Controle suas figurinhas do álbum da Copa do Mundo FIFA 2026
          </p>
          <LoginButton />
          <p className="tela-de-login__atestacao">
            Ao continuar, você confirma ter 12 anos ou mais, ou estar
            autorizado pelos responsáveis, e concorda com os{" "}
            <button
              type="button"
              className="tela-de-login__link"
              onClick={onAbrirTermos}
            >
              Termos de uso
            </button>
            .
          </p>
          <p className="tela-de-login__links">
            <button
              type="button"
              className="tela-de-login__link"
              onClick={onAbrirPolitica}
            >
              Política de privacidade
            </button>{" "}
            <span className="tela-de-login__separador" aria-hidden="true">
              ·
            </span>{" "}
            <button
              type="button"
              className="tela-de-login__link"
              onClick={onAbrirSobre}
            >
              Sobre
            </button>
          </p>
        </div>
      </div>
      <div className="tela-de-login__rodape">
        <p className="tela-de-login__rodape-linha">© 2026 Daniel Felix Ferber</p>
        <p className="tela-de-login__rodape-linha">
          Projeto independente, sem vínculo com Panini ou FIFA; marcas
          pertencem aos seus titulares (Lei 9.279/96, art. 132).
        </p>
        <p className="tela-de-login__rodape-linha">
          Uso por sua conta e risco, sem garantias.
        </p>
      </div>
    </div>
  );
}
