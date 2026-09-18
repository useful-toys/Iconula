// Copyright (c) 2026 Daniel Felix Ferber

import { useState } from "react";
import "./PoliticaDePrivacidade.css";

// Política de privacidade (LGPD), exigida por requisitos.md § Privacidade —
// acessível antes de autenticar (link na tela de login) e depois, pelo
// rodapé da tela principal (Tarefa 0008-0004, IDR 0037). Vista interna, sem
// router (TDR 0020): `onVoltar` devolve para a tela de onde o usuário veio,
// sem depender do histórico do navegador.
//
// A seção "Direitos do titular" também é onde vive o comando "Apagar meus
// dados" (IDR 0060, Tarefa 0031-0003): um painel de dois passos, com o
// "Exportar minha coleção antes" ao lado do "Apagar definitivamente". O
// bloco só existe com sessão (`podeApagar`); o estado final, porém, continua
// renderizado depois de a sessão acabar — a vista é montada antes da guarda
// de login (TDR 0020) e é ele que fecha o fluxo. `onApagar` devolve
// `{ status: 'sucesso' | 'cancelado' | 'falha' }`: desistência do popup
// volta ao repouso sem aviso; falha mantém o painel para nova tentativa,
// com o aviso já emitido por `App.jsx`.
export default function PoliticaDePrivacidade({
  onVoltar,
  podeApagar = false,
  onApagar,
  onExportar,
}) {
  const [estado, setEstado] = useState("repouso");
  const [emVoo, setEmVoo] = useState(false);

  async function handleApagar() {
    setEmVoo(true);
    const resultado = await onApagar();
    setEmVoo(false);
    if (resultado?.status === "sucesso") {
      setEstado("apagado");
    } else if (resultado?.status === "cancelado") {
      setEstado("repouso");
    }
  }

  const mostrarBloco = podeApagar || estado === "apagado";

  return (
    <div className="politica">
      <div className="politica__corpo">
        <button type="button" className="politica__voltar" onClick={onVoltar}>
          <span aria-hidden="true">←</span> Voltar
        </button>

        <h1 className="politica__titulo">Política de privacidade</h1>

        <h2>Dados tratados</h2>
        <p>
          O Iconula trata dois grupos de dados: a identidade da sua conta
          Google (nome, e-mail e foto de perfil, obtidos no login) e a sua
          coleção de figurinhas (quantas unidades você tem de cada uma,
          identificadas pelo código da figurinha). Também guardamos a data e
          hora da última gravação da coleção e a data em que você atestou a
          idade mínima (ver "Dados de menores" abaixo). Nenhum outro dado é
          tratado — não há coleta de localização, dados de pagamento ou
          uso de analytics.
        </p>

        <h2>Finalidade</h2>
        <p>
          Esses dados servem só para autenticar você, identificar a sua
          conta e guardar sua coleção, para que ela apareça igual da próxima
          vez que você entrar, em qualquer aparelho.
        </p>

        <h2>Onde os dados ficam</h2>
        <p>
          A conta e a coleção ficam no Cloud Firestore, serviço do Google
          Cloud, em servidores na região <code>southamerica-east1</code>{" "}
          (São Paulo). Nenhum outro terceiro tem acesso a esses dados além
          do Google, que já processa o login pelo próprio provedor, e, se
          você ligar o link do catálogo, de quem tiver o link.
        </p>

        <h2>Link do catálogo</h2>
        <p>
          Se você ligar o link do catálogo, a sua coleção (contagens e data
          da última gravação) fica visível, sem login, a qualquer pessoa que
          tenha o link, até você desligá-lo. O link contém um identificador
          interno da sua conta; seu nome, e-mail e foto não aparecem.
        </p>

        <h2>Retenção</h2>
        <p>
          Os dados ficam guardados enquanto a sua conta existir no
          aplicativo. Para pedir a exclusão, use o canal de contato abaixo —
          apagar a coleção e a conta de dentro do próprio app é um recurso
          planejado, ainda não disponível.
        </p>

        <h2>Direitos do titular</h2>
        <p>
          Você pode pedir acesso aos seus dados, correção de algo incorreto
          ou a exclusão completa da sua coleção e da sua conta no app,
          escrevendo para o canal de contato abaixo. A conta Google em si
          não é apagada por nós — ela é do Google, não do Iconula.
        </p>

        {mostrarBloco &&
          (estado === "apagado" ? (
            <div className="politica__apagado">
              <p className="politica__apagado-titulo">
                Seus dados foram apagados
              </p>
              <button
                type="button"
                className="politica__apagar-botao"
                onClick={onVoltar}
              >
                Voltar à tela de login
              </button>
            </div>
          ) : estado === "confirmando" ? (
            <div className="politica__confirmacao">
              <p className="politica__confirmacao-texto">
                Serão apagados a sua coleção de figurinhas e a sua conta de
                login no Iconula — nome, e-mail e foto de perfil. A conta
                Google permanece.
              </p>
              <button
                type="button"
                className="politica__apagar-secundario"
                onClick={onExportar}
                disabled={emVoo}
              >
                Exportar minha coleção antes
              </button>
              <div className="politica__confirmacao-acoes">
                <button
                  type="button"
                  className="politica__apagar-botao"
                  onClick={handleApagar}
                  disabled={emVoo}
                >
                  Apagar definitivamente
                </button>
                <button
                  type="button"
                  className="politica__apagar-secundario"
                  onClick={() => setEstado("repouso")}
                  disabled={emVoo}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="politica__apagar">
              <button
                type="button"
                className="politica__apagar-botao"
                onClick={() => setEstado("confirmando")}
              >
                Apagar meus dados
              </button>
              <p className="politica__apagar-nota">
                Apaga a sua coleção de figurinhas e a sua conta de login no
                Iconula, mas não a conta Google.
              </p>
            </div>
          ))}

        <h2>Dados de menores</h2>
        <p>
          O Iconula é destinado a quem tem 12 anos ou mais, ou está
          autorizado pelos responsáveis (LGPD art. 14) — condição confirmada
          por um clique no primeiro login, registrado uma única vez na
          conta. Se um responsável quiser revisar ou pedir a exclusão dos
          dados de um menor autorizado, o canal de contato abaixo atende
          esse pedido também.
        </p>

        <h2>Contato</h2>
        <p>
          Para exercer qualquer um dos direitos acima, escreva para{" "}
          <a href="mailto:dff4321@gmail.com">dff4321@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
