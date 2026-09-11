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
// O link da política ainda não tem destino: a vista da política nasce na
// Tarefa 0008-0004, que também decide (TDR) como ela se integra ao
// `App.jsx` sem router. `onAbrirPolitica` é o ponto de extensão já deixado
// pronto — um no-op por padrão — para essa tarefa conectar sem precisar
// mexer neste componente.
export default function TelaDeLogin({ onAbrirPolitica = () => {} }) {
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
            autorizado pelos responsáveis.
          </p>
          <button
            type="button"
            className="tela-de-login__politica"
            onClick={onAbrirPolitica}
          >
            Política de privacidade
          </button>
        </div>
      </div>
      <p className="tela-de-login__rodape">
        Projeto independente, sem vínculo com Panini ou FIFA; marcas
        pertencem aos seus titulares (Lei 9.279/96, art. 132).
      </p>
    </div>
  );
}
