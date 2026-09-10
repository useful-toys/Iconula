// Copyright (c) 2026 Daniel Felix Ferber

import { Figurinha } from './Figurinha.jsx';
import './PaginaDoAlbum.css';

/**
 * Uma página do álbum na disposição "como no álbum": grid de trilhas fixas
 * com posições explícitas de linha/coluna, reproduzindo a página física
 * (IDR 0009, interface.md § Disposição "Como no álbum").
 *
 * @param {object} props
 * @param {object} props.secao - objeto da seção (catálogo.js).
 * @param {Array<{codigo: string; metalizada: boolean}>} props.figurinhas - figurinhas da seção.
 * @param {Array<{posicao: number; linha: number; trilha: number; trilhas: number}>} props.posicoes - posições desta página.
 * @param {Record<string, number>} props.contagens - mapa esparso de contagens.
 * @param {(codigo: string, delta: number) => void} props.onAjustar - callback de ajuste.
 */
export function PaginaDoAlbum({ secao, figurinhas, posicoes, contagens, onAjustar }) {
  // Cria um mapa de posição -> figurinha
  const figurinhaPorPosicao = new Map();
  for (let i = 0; i < figurinhas.length; i++) {
    figurinhaPorPosicao.set(i + 1, figurinhas[i]);
  }

  // Determina o número de trilhas (4 para seleções, 3 para COC)
  const numTrilhas = secao.sigla === 'COC' ? 3 : 4;

  return (
    <div
      className="pagina-album"
      style={{ gridTemplateColumns: `repeat(${numTrilhas}, 52px)` }}
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
