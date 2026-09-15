// Copyright (c) 2026 Daniel Felix Ferber

import { Figurinha } from './Figurinha.jsx';
import './PaginaDoAlbum.css';

/**
 * Uma página do álbum na disposição "como no álbum": grid de trilhas fixas
 * com posições explícitas de linha/coluna, reproduzindo a página física
 * (IDR 0009, MDR 0006, interface.md § Disposição "Como no álbum").
 *
 * @param {object} props
 * @param {{linhas: number; colunas: number}} props.pagina - dimensão da página (MDR 0006).
 * @param {Array<{posicao: number; codigo: string; metalizada: boolean}>} props.figurinhas - figurinhas da seção.
 * @param {Array<{posicao: number; linha: number; trilha: number; trilhas: number}>} props.posicoes - posições desta página.
 * @param {Record<string, number>} props.contagens - mapa esparso de contagens.
 * @param {(codigo: string, delta: number) => void} props.onAjustar - callback de ajuste.
 */
export function PaginaDoAlbum({ pagina, figurinhas, posicoes, contagens, onAjustar }) {
  // Mapa posição (campo da figurinha, não o índice no array — o FWC
  // começa em 00) -> figurinha.
  const figurinhaPorPosicao = new Map();
  for (const figurinha of figurinhas) {
    figurinhaPorPosicao.set(figurinha.posicao, figurinha);
  }

  return (
    <div
      className="pagina-album"
      style={{
        gridTemplateColumns: `repeat(${pagina.colunas}, 60px)`,
        gridTemplateRows: `repeat(${pagina.linhas}, 70px)`,
      }}
    >
      {posicoes.map((pos) => {
        const figurinha = figurinhaPorPosicao.get(pos.posicao);
        if (!figurinha) return null;

        const isPaisagem = pos.trilhas === 2;

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
