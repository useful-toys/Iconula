// Copyright (c) 2026 Daniel Felix Ferber

import { figurinhas, secoes } from '../data/catalogo.js';
import { corDoSelo } from '../lib/corDoSelo.js';
import { derivarEstatisticas } from '../lib/estatisticas.js';
import './Estatisticas.css';

/**
 * Cor de identidade de um grupo (IDR 0045): `--group-a` … `--group-l`, e
 * `--group-fwc` / `--group-coc` nos especiais. Tokens de `theme.css`, no
 * `:root`, então resolvem em qualquer lugar da vista.
 */
function corDoGrupo(chave) {
  return `var(--group-${chave.toLowerCase()})`;
}

/** FWC e COC não têm bandeira: a cor da seção é a do grupo especial. */
function ehEspecial(sigla) {
  return sigla === 'FWC' || sigla === 'COC';
}

/** Cor da posição 1 da bandeira da seleção (IDR 0046); FWC/COC usam a do grupo. */
function corDaSecao(sigla) {
  return ehEspecial(sigla) ? corDoGrupo(sigla) : `var(--selection-${sigla.toLowerCase()}-1)`;
}

/**
 * Degradê horizontal com as 2–3 cores da bandeira (IDR 0046). A posição
 * ausente cai na anterior, a mesma convenção de `Secao.css`; FWC/COC são cor
 * única de grupo.
 */
function gradienteDaSecao(sigla) {
  if (ehEspecial(sigla)) return corDoGrupo(sigla);
  const chave = sigla.toLowerCase();
  const primeira = `var(--selection-${chave}-1)`;
  const segunda = `var(--selection-${chave}-2, ${primeira})`;
  const terceira = `var(--selection-${chave}-3, ${segunda})`;
  return `linear-gradient(to right, ${primeira}, ${segunda}, ${terceira})`;
}

/**
 * Vista interna de estatísticas da coleção (IDR 0072), sem router (TDR 0020):
 * substitui o conteúdo da tela e o "← Voltar" devolve para a tela de origem.
 *
 * Somente leitura: não ajusta contagens nem toca o Firestore — deriva os cinco
 * blocos da coleção já carregada, em memória (`derivarEstatisticas`,
 * Tarefa 0037-0001). Os gráficos são desenhados à mão em SVG/CSS, sem
 * biblioteca (TDR 0030); cada um traz o número visível e o nome acessível por
 * extenso, para a cor nunca ser o único sinal (IDR 0018). Uma única página
 * scrollável, sem componente com rolagem própria (IDR 0008).
 *
 * @param {object} props
 * @param {Record<string, number>} [props.contagens={}] - mapa esparso de contagens.
 * @param {() => void} props.onVoltar - callback que devolve à tela de origem.
 */
export default function Estatisticas({ contagens = {}, onVoltar }) {
  const { resumo, progressoPorGrupo, progressoPorSecao, repetidasPorSecao, histograma } =
    derivarEstatisticas(contagens, secoes, figurinhas);

  const total = figurinhas.length;
  const totalRepetidas = repetidasPorSecao.reduce(
    (soma, secao) => soma + secao.codigos.length,
    0,
  );

  const barrasDeGrupo = progressoPorGrupo.map((item) => ({
    chave: item.grupo,
    rotulo: item.grupo,
    cor: corDoGrupo(item.grupo),
    ...item,
  }));
  const barrasDeSecao = progressoPorSecao.map((item) => ({
    chave: item.sigla,
    rotulo: item.sigla,
    cor: gradienteDaSecao(item.sigla),
    ...item,
  }));

  return (
    <div className="estatisticas">
      <div className="estatisticas__corpo">
        <button type="button" className="estatisticas__voltar" onClick={onVoltar}>
          <span aria-hidden="true">←</span> Voltar
        </button>

        <h1 className="estatisticas__titulo">Estatísticas</h1>

        <section className="estatisticas__bloco" aria-labelledby="estatisticas-resumo">
          <h2 id="estatisticas-resumo" className="estatisticas__subtitulo">
            Resumo geral
          </h2>
          <div className="estatisticas__resumo">
            <Donut percentual={resumo.percentual} coladas={resumo.coladas} total={total} />
            <dl className="estatisticas__numeros">
              <Numero estado="colada" rotulo="Coladas" valor={resumo.coladas} />
              <Numero estado="faltante" rotulo="Faltantes" valor={resumo.faltantes} />
              <Numero estado="repetida" rotulo="Repetidas" valor={resumo.repetidas} />
              <Numero estado="progresso" rotulo="Progresso" valor={`${resumo.percentual}%`} />
            </dl>
          </div>
        </section>

        <section className="estatisticas__bloco" aria-labelledby="estatisticas-grupos">
          <h2 id="estatisticas-grupos" className="estatisticas__subtitulo">
            Progresso por grupo
          </h2>
          <Barras itens={barrasDeGrupo} />
        </section>

        <section className="estatisticas__bloco" aria-labelledby="estatisticas-secoes">
          <h2 id="estatisticas-secoes" className="estatisticas__subtitulo">
            Progresso por seção
          </h2>
          <Barras itens={barrasDeSecao} fina />
        </section>

        <section className="estatisticas__bloco" aria-labelledby="estatisticas-repetidas">
          <h2 id="estatisticas-repetidas" className="estatisticas__subtitulo">
            Repetidas por seção
          </h2>
          <p className="estatisticas__nota">
            {totalRepetidas} figurinhas repetidas no total.
          </p>
          <ul className="estatisticas__repetidas">
            {repetidasPorSecao
              .filter((secao) => secao.codigos.length > 0)
              .map((secao) => (
                <li
                  className="estatisticas__repetidas-linha"
                  key={secao.sigla}
                  style={{ '--cor': corDaSecao(secao.sigla) }}
                >
                  <span className="estatisticas__repetidas-secao">{secao.nome}</span>
                  <span className="estatisticas__repetidas-codigos">
                    {secao.codigos.join(', ')}
                  </span>
                </li>
              ))}
          </ul>
        </section>

        <section className="estatisticas__bloco" aria-labelledby="estatisticas-histograma">
          <h2 id="estatisticas-histograma" className="estatisticas__subtitulo">
            Histograma de contagens
          </h2>
          <Histograma faixas={histograma} />
        </section>
      </div>
    </div>
  );
}

/**
 * Um par rótulo/valor do resumo geral (lista de definições). `estado` liga a
 * cor ao cartão da página principal: colada, faltante e repetida.
 */
function Numero({ estado, rotulo, valor }) {
  return (
    <div className={`estatisticas__numero estatisticas__numero--${estado}`}>
      <dt className="estatisticas__numero-rotulo">{rotulo}</dt>
      <dd className="estatisticas__numero-valor font-tabular">{valor}</dd>
    </div>
  );
}

/**
 * Donut do percentual colado, em SVG simples (TDR 0030). O número no centro e
 * o nome acessível por extenso evitam que a cor seja o único sinal (IDR 0018).
 */
function Donut({ percentual, coladas, total }) {
  const raio = 52;
  const circunferencia = 2 * Math.PI * raio;
  const traco = (percentual / 100) * circunferencia;

  return (
    <svg
      className="estatisticas__donut"
      viewBox="0 0 120 120"
      role="img"
      aria-label={`Progresso do álbum: ${percentual} por cento colado, ${coladas} de ${total} figurinhas`}
    >
      <circle className="estatisticas__donut-fundo" cx="60" cy="60" r={raio} />
      <circle
        className="estatisticas__donut-traco"
        cx="60"
        cy="60"
        r={raio}
        strokeDasharray={`${traco} ${circunferencia - traco}`}
        transform="rotate(-90 60 60)"
      />
      <text
        className="estatisticas__donut-texto font-tabular"
        x="60"
        y="60"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {percentual}%
      </text>
    </svg>
  );
}

/**
 * Barras horizontais proporcionais (TDR 0030): div com largura em `%` para os
 * grupos da Copa e as seções. Cada linha traz rótulo, barra e a contagem
 * visível; a barra leva o nome acessível por extenso (IDR 0018).
 */
function Barras({ itens, fina = false }) {
  return (
    <ul className={`estatisticas__barras${fina ? ' estatisticas__barras--fina' : ''}`}>
      {itens.map((item) => {
        const totalItem = item.coladas + item.faltantes;
        const nome = `${item.nome}: ${item.coladas} de ${totalItem} coladas, ${item.faltantes} faltantes, ${item.percentual} por cento`;
        return (
          <li className="estatisticas__barra-linha" key={item.chave}>
            <span className="estatisticas__barra-rotulo">{item.rotulo}</span>
            <div className="estatisticas__barra" role="img" aria-label={nome}>
              <div
                className="estatisticas__barra-preenchimento"
                style={{ width: `${item.percentual}%`, '--cor': item.cor }}
              />
            </div>
            <span className="estatisticas__barra-valor font-tabular">
              {item.coladas}/{totalItem}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** Escreve por extenso a cauda do histograma (`"6+"` → `"6 ou mais"`). */
function faixaPorExtenso(rotulo) {
  return rotulo.endsWith('+') ? `${rotulo.slice(0, -1)} ou mais` : rotulo;
}

/**
 * Cor da coluna pelo estado que a faixa representa na página principal:
 * 0 é faltante e 1 é colada (classes no CSS); de 2 em diante é repetida, na
 * escala laranja→vermelho do selo `×N` (IDR 0066), com contagem − 1 sobrando.
 */
function propsDaColuna(contagem) {
  if (contagem === 0) return { className: 'estatisticas__histograma-barra estatisticas__histograma-barra--faltante' };
  if (contagem === 1) return { className: 'estatisticas__histograma-barra estatisticas__histograma-barra--colada' };
  return { className: 'estatisticas__histograma-barra', style: { fill: corDoSelo(contagem - 1) } };
}

/**
 * Histograma de contagens em SVG simples (TDR 0030): uma coluna por faixa de
 * contagem, com o total visível acima e o rótulo abaixo. O nome acessível
 * escreve por extenso a distribuição inteira (IDR 0018).
 */
function Histograma({ faixas }) {
  const maximo = Math.max(1, ...faixas.map((faixa) => faixa.total));
  const larguraColuna = 44;
  const barraLargura = 30;
  const alturaPlot = 100;
  const topo = 20;
  const largura = faixas.length * larguraColuna;
  const altura = topo + alturaPlot + 24;
  const nome = `Histograma de contagens: ${faixas
    .map((faixa) => `${faixa.total} figurinhas com ${faixaPorExtenso(faixa.rotulo)}`)
    .join(', ')}`;

  return (
    <svg
      className="estatisticas__histograma"
      viewBox={`0 0 ${largura} ${altura}`}
      role="img"
      aria-label={nome}
    >
      {faixas.map((faixa, indice) => {
        const alturaBarra = (faixa.total / maximo) * alturaPlot;
        const x = indice * larguraColuna + (larguraColuna - barraLargura) / 2;
        const centro = indice * larguraColuna + larguraColuna / 2;
        return (
          <g key={faixa.contagem}>
            <rect
              {...propsDaColuna(faixa.contagem)}
              x={x}
              y={topo + (alturaPlot - alturaBarra)}
              width={barraLargura}
              height={alturaBarra}
              rx="3"
            />
            <text
              className="estatisticas__histograma-total font-tabular"
              x={centro}
              y={topo - 6}
              textAnchor="middle"
            >
              {faixa.total}
            </text>
            <text
              className="estatisticas__histograma-rotulo"
              x={centro}
              y={altura - 8}
              textAnchor="middle"
            >
              {faixa.rotulo}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
