// Copyright (c) 2026 Daniel Felix Ferber

import { useState } from "react";
import { LinkDeContato } from "./LinkDeContato";
import "./PoliticaDePrivacidade.css";

// Política de privacidade (LGPD), exigida por requisitos.md § Privacidade —
// acessível antes de autenticar (link na tela de login) e depois, pelo
// rodapé da tela principal (Tarefa 0008-0004, IDR 0037). Vista interna, sem
// router (TDR 0020): `onVoltar` devolve para a tela de onde o usuário veio,
// sem depender do histórico do navegador.
//
// A seção "Direitos do titular" também é onde vive o comando "Apagar meus
// dados" (IDR 0060, Tarefa 0031-0003): um painel de dois passos — repouso e
// confirmando —, com o "Exportar minha coleção antes" ao lado do "Apagar
// definitivamente". O bloco só existe com sessão (`podeApagar`); o sucesso
// troca a vista para a tela dedicada `ContaApagada`, renderizada no `App.jsx`
// antes da guarda de login (TDR 0020). `onApagar` dispara a exclusão e a
// falha é avisada por `App.jsx`, mantendo o painel para nova tentativa.
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
    await onApagar();
    setEmVoo(false);
  }

  const mostrarBloco = podeApagar;

  return (
    <div className="politica">
      <div className="politica__corpo">
        <button type="button" className="politica__voltar" onClick={onVoltar}>
          <span aria-hidden="true">←</span> Voltar
        </button>

        <h1 className="politica__titulo">Política de privacidade</h1>
        <p>
          Última atualização:{" "}
          <time dateTime="2026-09-17">17 de setembro de 2026</time>.
        </p>

        <h2>Controlador e encarregado</h2>
        <p>
          Quem controla os seus dados é Daniel Felix Ferber, pessoa física,
          no Brasil, que também responde como encarregado (LGPD art. 41).
          Para qualquer assunto de privacidade, use o canal de contato
          abaixo.
        </p>

        <h2>Dados tratados</h2>
        <p>
          O Iconula trata dois grupos de dados: a identidade da sua conta
          Google (nome, e-mail e foto de perfil, obtidos no login) e a sua
          coleção de figurinhas (quantas unidades você tem de cada uma,
          identificadas pelo código da figurinha). Também guardamos a data e
          hora da última gravação da coleção e a data em que você atestou a
          idade mínima (ver "Dados de menores" abaixo). Não há coleta de
          localização, dados de pagamento nem uso de analytics.
        </p>

        <h2>Finalidade</h2>
        <p>
          Esses dados servem só para autenticar você, identificar a sua
          conta e guardar sua coleção, para que ela apareça igual da próxima
          vez que você entrar, em qualquer aparelho.
        </p>

        <h2>Base legal</h2>
        <p>
          Cada finalidade tem uma hipótese legal (LGPD art. 9º, I): a conta e
          a coleção são tratadas para executar o contrato firmado nos Termos
          de uso (art. 7º, V); o link do catálogo, quando você o liga, é
          tratado com o seu consentimento, que você revoga ao desligá-lo
          (art. 7º, I); e a atestação de idade se apoia no art. 14.
        </p>

        <h2>Onde os dados ficam</h2>
        <p>
          A conta e a coleção ficam no Cloud Firestore, serviço do Google
          Cloud, em servidores na região <code>southamerica-east1</code>{" "}
          (São Paulo). Nenhum outro terceiro tem acesso a esses dados além
          do Google, que já processa o login pelo próprio provedor, e, se
          você ligar o link do catálogo, de quem tiver o link.
        </p>

        <h2>Operador e transferência internacional</h2>
        <p>
          O Google é operador dos seus dados. A coleção fica em servidores
          brasileiros do Cloud Firestore, mas a identidade da conta é
          tratada globalmente pelo Firebase Auth, fora do Brasil. Essa
          transferência internacional se apoia nas cláusulas-padrão
          contratuais do Google (LGPD arts. 33 e 39).
        </p>

        <h2>Link do catálogo</h2>
        <p>
          Se você ligar o link do catálogo, a sua coleção (contagens e data
          da última gravação) fica visível, sem login, a qualquer pessoa que
          tenha o link, até você desligá-lo. O link contém um identificador
          interno da sua conta; seu nome, e-mail e foto não aparecem.
        </p>

        <h2>Armazenamento local</h2>
        <p>
          No seu aparelho, o app guarda no <code>localStorage</code> as
          preferências de vista (ordenação, disposição e filtro) e o colapso
          manual de seções e super-grupos, e mantém no cache do SDK do
          Firestore (IndexedDB) o espelho da coleção e as gravações
          pendentes. Esses dados são locais, estritamente funcionais e nunca
          são enviados a terceiros; por isso o app não pede consentimento de
          cookies nem exibe banner.
        </p>

        <h2>Retenção</h2>
        <p>
          A coleção e a conta ficam guardadas enquanto você usar o app.
          Ficando 24 meses sem entrar, a conta e a coleção são apagadas. Se
          o Iconula for descontinuado, os dados são apagados em até 90 dias,
          com um aviso na própria tela e tempo para você exportar a coleção
          (LGPD arts. 15 e 16).
        </p>

        <h2>Direitos do titular</h2>
        <p>
          Você pode pedir acesso aos seus dados, correção de algo incorreto
          ou a exclusão completa da sua coleção e da sua conta. A exclusão
          você mesmo faz dentro do app, no painel logo abaixo. A
          portabilidade (LGPD art. 18, V) é atendida pela exportação da
          coleção em JSON, no menu de ações. Para os demais direitos,
          escreva para o canal de contato abaixo. A conta Google em si não é
          apagada por nós — ela é do Google, não do Iconula.
        </p>
        <p>
          Os pedidos são respondidos em até 15 dias (LGPD art. 19, §1º, II).
          Para proteger os seus dados, eles são atendidos quando partem do
          mesmo e-mail da conta Google usada no app; se você escrever de
          outro endereço, pedimos a confirmação nessa conta antes de
          qualquer resposta.
        </p>

        {mostrarBloco &&
          (estado === "confirmando" ? (
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

        <h2>Alterações</h2>
        <p>
          Esta política é versionada pela data de vigência no topo. Só
          mudança material sobe a versão; correção de digitação ou de estilo
          não altera o que você aceitou.
        </p>
        <ul>
          <li>
            <time dateTime="2026-09-17">17 de setembro de 2026</time> — versão
            publicada com o conteúdo de conformidade: controlador e
            encarregado, base legal, transferência internacional, retenção,
            prazo de atendimento e histórico.
          </li>
        </ul>
        <p>
          Mudança material faz o app pedir um novo aceite na entrada, antes
          de liberar o catálogo.
        </p>

        <h2>Contato</h2>
        <p>
          Para exercer qualquer um dos direitos acima, escreva para{" "}
          <LinkDeContato />.
        </p>
      </div>
    </div>
  );
}
