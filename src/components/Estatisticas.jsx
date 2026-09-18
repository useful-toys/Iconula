// Copyright (c) 2026 Daniel Felix Ferber

import { figurinhas, secoes } from '../data/catalogo.js';
import { derivarEstatisticas } from '../lib/estatisticas.js';
import './Estatisticas.css';

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
    ...item,
  }));
  const barrasDeSecao = progressoPorSecao.map((item) => ({
    chave: item.sigla,
    rotulo: item.sigla,
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
              <Numero rotulo="Coladas" valor={resumo.coladas} />
              <Numero rotulo="Faltantes" valor={resumo.faltantes} />
              <Numero rotulo="Repetidas" valor={resumo.repetidas} />
              <Numero rotulo="Progresso" valor={`${resumo.percentual}%`} />
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
                <li className="estatisticas__repetidas-linha" key={secao.sigla}>
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

/** Um par rótulo/valor do resumo geral (lista de definições). */
function Numero({ rotulo, valor }) {
  return (
    <div className="estatisticas__numero">
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
                style={{ width: `${item.percentual}%` }}
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
              className="estatisticas__histograma-barra"
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
