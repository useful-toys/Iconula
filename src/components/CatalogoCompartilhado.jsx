// Copyright (c) 2026 Daniel Felix Ferber

import { useEffect, useMemo, useRef, useState } from 'react';
import { figurinhas, secoes } from '../data/catalogo.js';
import {
  ordenarPorSigla,
  ordenarPorPagina,
  extrairSecoes,
} from '../data/catalogoOrdenacoes.js';
import { Cabecalho } from './Cabecalho.jsx';
import { Controles } from './Controles.jsx';
import { Catalogo } from './Catalogo.jsx';
import { Avisos } from './Avisos.jsx';
import { Rodape } from './Rodape.jsx';
import {
  carregarCatalogoCompartilhado,
  formatarCarimbo,
  mensagemDeErro,
} from '../lib/colecaoRemota.js';
import { lerPreferenciasDeVista } from '../lib/preferenciasDeVista.js';
import { calcularPlacar } from '../lib/progresso.js';
import { emitirAviso, SEVERIDADE } from '../lib/avisos.js';
import './CatalogoCompartilhado.css';

const codigosTodasFigurinhas = figurinhas.map((f) => f.codigo);

// Códigos de cada seção para o progresso do tooltip da faixa (IDR 0052) —
// mesmo agrupamento estático de `App.jsx`, fora do componente porque o
// catálogo nunca muda em execução.
const codigosPorSecao = (() => {
  const mapa = new Map();
  for (const figurinha of figurinhas) {
    const lista = mapa.get(figurinha.secao) ?? [];
    lista.push(figurinha.codigo);
    mapa.set(figurinha.secao, lista);
  }
  return mapa;
})();

/**
 * Vista somente leitura do catálogo de outra conta, aberta por
 * `/catalogo/<uid>` sem login (IDR 0055). É a tela principal sem edição:
 * mantém título com placar e relógio, ordenação, disposição, filtro, faixa de
 * bandeiras com tooltip, colapso de seções e super-grupos e rodapé; some com
 * desfazer, compartilhar, avatar, controle de menos e gestos.
 *
 * Não usa a sessão: não lê `user`, não carrega a coleção do visitante, não
 * pede atestação e não grava preferências — a coleção é a leitura única do
 * documento do dono feita por `carregarCatalogoCompartilhado` (IDR 0055,
 * ADR 0005).
 *
 * @param {object} props
 * @param {string|null} props.uid - identificador do dono no link; `null`
 *   (link malformado) cai direto na tela de não compartilhado, sem leitura.
 * @param {() => void} [props.onAbrirPolitica] - abre a política de privacidade.
 * @param {() => void} [props.onAbrirTermos] - abre os termos de uso.
 */
export function CatalogoCompartilhado({ uid, onAbrirPolitica, onAbrirTermos }) {
  // Estado da leitura: sem `uid` válido, já nasce não compartilhado (premissa
  // conservadora para `/catalogo/` e `/catalogo/<uid>/`).
  const [estado, setEstado] = useState(uid ? 'carregando' : 'nao-compartilhado');
  const [contagens, setContagens] = useState({});
  const [atualizadoEm, setAtualizadoEm] = useState(null);

  // Preferências lidas uma vez na abertura (IDR 0026, IDR 0043) e mantidas só
  // em memória: olhar o catálogo de outro não muda as próprias preferências.
  const [inicial] = useState(() => lerPreferenciasDeVista(window.innerWidth));
  const [ordenacao, setOrdenacao] = useState(inicial.ordenacao);
  const [disposicao, setDisposicao] = useState(inicial.disposicao);
  const [filtro, setFiltro] = useState(inicial.filtro);

  const catalogoRef = useRef(null);

  useEffect(() => {
    if (!uid) return;

    let cancelado = false;

    carregarCatalogoCompartilhado(uid, {
      aoEsperar: () => {
        emitirAviso({
          severidade: SEVERIDADE.AVISO,
          mensagem: 'Conexão instável — sincronizando quando possível',
          tipo: 'catalogo-compartilhado',
        });
      },
    }).then((resultado) => {
      if (cancelado) return;

      if (resultado.status === 'compartilhado') {
        setContagens(resultado.contagens);
        setAtualizadoEm(formatarCarimbo(resultado.atualizadoEm));
        setEstado('compartilhado');
        return;
      }

      if (resultado.status !== 'nao-compartilhado') {
        // `erro` ou `indisponivel`: mesma tela de não compartilhado, somada ao
        // aviso de falha; recarregar a página tenta de novo (IDR 0055).
        emitirAviso({
          severidade: SEVERIDADE.FALHA,
          mensagem: 'Falha ao carregar o catálogo — toque para detalhes',
          detalhe: resultado.erro
            ? mensagemDeErro(resultado.erro)
            : 'Firebase não configurado',
          tipo: 'catalogo-compartilhado',
        });
      }
      setEstado('nao-compartilhado');
    });

    return () => {
      cancelado = true;
    };
  }, [uid]);

  const secoesOrdenadas = useMemo(() => {
    const estruturada =
      ordenacao === 'pagina' ? ordenarPorPagina(secoes) : ordenarPorSigla(secoes);
    return extrairSecoes(estruturada);
  }, [ordenacao]);

  const placar = calcularPlacar(contagens, codigosTodasFigurinhas);

  const placarPorSecao = useMemo(() => {
    const mapa = new Map();
    for (const secao of secoes) {
      mapa.set(
        secao.sigla,
        calcularPlacar(contagens, codigosPorSecao.get(secao.sigla) ?? []),
      );
    }
    return mapa;
  }, [contagens]);

  function handleSaltar(sigla) {
    if (catalogoRef.current) {
      catalogoRef.current.saltarPara(sigla);
    }
  }

  // Carregando: tela neutra (IDR 0035), como o intervalo da sessão.
  if (estado === 'carregando') {
    return <div className="app" />;
  }

  if (estado === 'nao-compartilhado') {
    return (
      <div className="app">
        <main className="catalogo-compartilhado__aviso">
          <p className="catalogo-compartilhado__mensagem">
            Este catálogo não está compartilhado.
          </p>
          <a className="catalogo-compartilhado__link" href="/">
            Conhecer o Iconula
          </a>
        </main>
        <Avisos />
        <Rodape onAbrirPolitica={onAbrirPolitica} onAbrirTermos={onAbrirTermos} />
      </div>
    );
  }

  return (
    <div className="app">
      <Cabecalho
        coladas={placar.coladas}
        faltantes={placar.faltantes}
        repetidas={placar.repetidas}
        percentual={placar.percentual}
        atualizadoEm={atualizadoEm}
        secoes={secoesOrdenadas}
        ordenacao={ordenacao}
        onSaltar={handleSaltar}
        placarPorSecao={placarPorSecao}
        somenteLeitura
        tituloComoLink
      >
        <Controles
          ordenacao={ordenacao}
          onTrocarOrdenacao={setOrdenacao}
          disposicao={disposicao}
          onTrocarDisposicao={setDisposicao}
          filtro={filtro}
          onTrocarFiltro={setFiltro}
        />
      </Cabecalho>
      <Catalogo
        ref={catalogoRef}
        secoes={secoes}
        figurinhas={figurinhas}
        contagens={contagens}
        ordenacao={ordenacao}
        disposicao={disposicao}
        filtro={filtro}
        onLimparFiltro={() => setFiltro('todas')}
        gravarColapso={false}
      />
      <Avisos />
      <Rodape onAbrirPolitica={onAbrirPolitica} onAbrirTermos={onAbrirTermos} />
    </div>
  );
}
