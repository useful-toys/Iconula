// Copyright (c) 2026 Daniel Felix Ferber

import { LinkDeContato } from "./LinkDeContato";
import "./TermosDeUso.css";

// Termos de uso, a quarta tela do app (IDR 0053) — vista interna, sem router
// (TDR 0020): `onVoltar` devolve para a tela de onde o usuário veio, sem
// depender do histórico do navegador. Alcançável da tela de login (frase de
// aceite e linha de links) e do rodapé da tela principal. O conteúdo segue só
// o roteiro do IDR 0053; o humano o aprova no PR da fase.
export default function TermosDeUso({ onVoltar }) {
  return (
    <div className="termos">
      <div className="termos__corpo">
        <button type="button" className="termos__voltar" onClick={onVoltar}>
          <span aria-hidden="true">←</span> Voltar
        </button>

        <h1 className="termos__titulo">Termos de uso</h1>
        <p>
          Última atualização:{" "}
          <time dateTime="2026-09-17">17 de setembro de 2026</time>.
        </p>

        <h2>Aceite</h2>
        <p>
          Ao usar o Iconula, você concorda com estes Termos de uso. Se não
          concordar, não use o aplicativo.
        </p>

        <h2>O que é o serviço</h2>
        <p>
          O Iconula é um aplicativo gratuito e independente para anotar quantas
          figurinhas do álbum da Copa do Mundo FIFA 2026 você tem e acompanhar o
          progresso da sua coleção. Não tem vínculo com Panini ou FIFA e não
          vende nem entrega figurinhas.
        </p>

        <h2>Controlador e encarregado</h2>
        <p>
          Quem controla os seus dados é Daniel Felix Ferber, pessoa física,
          no Brasil, que também responde como encarregado (LGPD art. 41).
          Para qualquer assunto de privacidade, use o canal de contato
          abaixo.
        </p>

        <h2>Uso no estado em que se encontra</h2>
        <p>
          O aplicativo é oferecido no estado em que se encontra, sem garantia de
          disponibilidade contínua nem de que seus dados serão preservados. A
          sincronização depende de conexão e de serviços de terceiros (Google).
          Para não perder sua coleção, use o comando exportar e guarde o
          arquivo: ele permite restaurar as contagens.
        </p>

        <h2>Sua conta Google</h2>
        <p>
          O acesso é feito com a sua conta Google, e você é responsável por ela
          e por manter o acesso protegido. O Iconula não controla a conta Google
          nem responde pelo que acontecer com ela.
        </p>

        <h2>Limitação de responsabilidade</h2>
        <p>
          Na máxima extensão permitida pela lei, o Iconula e seu autor não
          respondem por danos decorrentes do uso ou da impossibilidade de usar o
          aplicativo, inclusive a perda dos dados da coleção.
        </p>

        <h2>Marcas</h2>
        <p>
          Os nomes e marcas citados no aplicativo — inclusive Panini, FIFA e
          Coca-Cola — pertencem aos seus titulares e são usados apenas para
          identificar os produtos. A menção não implica vínculo, patrocínio ou
          aprovação.
        </p>

        <h2>Alterações</h2>
        <p>
          Estes termos podem mudar quando o aplicativo evoluir. A versão
          vigente é a data no topo; só mudança material sobe a versão, e
          correção de digitação ou de estilo não altera o que você aceitou.
        </p>
        <ul>
          <li>
            <time dateTime="2026-09-17">17 de setembro de 2026</time> — versão
            publicada com o conteúdo de conformidade: controlador e
            encarregado, uso no estado em que se encontra e o histórico.
          </li>
        </ul>
        <p>
          Mudança material faz o app pedir um novo aceite na entrada, antes
          de liberar o catálogo; continuar usando depois disso significa
          concordar com a versão nova.
        </p>

        <h2>Lei brasileira</h2>
        <p>
          Estes termos são regidos pelas leis brasileiras. Eventuais conflitos
          serão resolvidos no foro do domicílio do usuário, quando a lei assim o
          exigir.
        </p>

        <h2>Contato</h2>
        <p>
          Para dúvidas sobre estes termos, escreva para{" "}
          <LinkDeContato />.
        </p>
      </div>
    </div>
  );
}
