// Copyright (c) 2026 Daniel Felix Ferber

import { Figurinha } from './Figurinha.jsx';
import './PaginaDoAlbum.css';

/**
 * Uma página do álbum na disposição "como no álbum": grid de trilhas fixas
 * com posições explícitas de linha/coluna, reproduzindo a página física
 * (IDR 0009, IDR 0023, MDR 0006, interface.md § Disposição "Como no álbum").
 *
 * @param {object} props
 * @param {{linhas: number; colunas: number}} props.pagina - dimensão da página (MDR 0006).
 * @param {Array<{posicao: number; codigo: string; metalizada: boolean; paisagem: boolean}>} props.figurinhas - figurinhas da seção.
 * @param {Array<{posicao: number; linha: number; trilha: number; trilhas: number}>} props.posicoes - posições desta página.
 * @param {Record<string, number>} props.contagens - mapa esparso de contagens.
 * @param {(codigo: string, delta: number) => void} props.onAjustar - callback de ajuste.
 * @param {boolean} [props.comMoldura=false] - página do FWC: casa de 70×70px
 *   e moldura em volta da página (IDR 0023); seleções e Coca-Cola ficam com
 *   a trilha de 60px de sempre, sem moldura.
 */
export function PaginaDoAlbum({ pagina, figurinhas, posicoes, contagens, onAjustar, comMoldura = false }) {
  // Mapa posição (campo da figurinha, não o índice no array — o FWC
  // começa em 00) -> figurinha.
  const figurinhaPorPosicao = new Map();
  for (const figurinha of figurinhas) {
    figurinhaPorPosicao.set(figurinha.posicao, figurinha);
  }

  const larguraTrilha = comMoldura ? 70 : 60;

  return (
    <div
      className={`pagina-album${comMoldura ? ' pagina-album--fwc' : ''}`}
      style={{
        gridTemplateColumns: `repeat(${pagina.colunas}, ${larguraTrilha}px)`,
        gridTemplateRows: `repeat(${pagina.linhas}, 70px)`,
      }}
    >
      {posicoes.map((pos) => {
        const figurinha = figurinhaPorPosicao.get(pos.posicao);
        if (!figurinha) return null;

        // A paisagem do cartão vem da figurinha, não do número de trilhas
        // da posição: no FWC ela cabe numa única trilha de 70px, mas nas
        // seleções a 13 ocupa duas trilhas de 60px (IDR 0047, IDR 0009).
        const isPaisagem = Boolean(figurinha.paisagem);

        return (
          <div
            key={pos.posicao}
            className={`pagina-album__celula${isPaisagem ? ' pagina-album__celula--paisagem' : ''}`}
            style={{
              gridColumn: `${pos.trilha} / span ${pos.trilhas}`,
              gridRow: pos.linha,
            }}
          >
            <Figurinha
              codigo={figurinha.codigo}
              contagem={contagens[figurinha.codigo] ?? 0}
              metalizada={figurinha.metalizada}
              nome={figurinha.nome}
              nomeLinhas={figurinha.nomeLinhas}
              nomeCurto={figurinha.nomeCurto}
              variante="album"
              paisagem={isPaisagem}
              onIncrementar={() => onAjustar(figurinha.codigo, 1)}
              onDecrementar={() => onAjustar(figurinha.codigo, -1)}
            />
          </div>
        );
      })}
    </div>
  );
}
