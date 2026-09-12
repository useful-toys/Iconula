// Copyright (c) 2026 Daniel Felix Ferber

import "./PoliticaDePrivacidade.css";

// Política de privacidade (LGPD), exigida por requisitos.md § Privacidade —
// acessível antes de autenticar (link na tela de login) e depois, pelo
// rodapé da tela principal (Tarefa 0008-0004, IDR 0037). Vista interna, sem
// router (TDR 0020): `onVoltar` devolve para a tela de onde o usuário veio,
// sem depender do histórico do navegador.
export default function PoliticaDePrivacidade({ onVoltar }) {
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
          do Google, que já processa o login pelo próprio provedor.
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
