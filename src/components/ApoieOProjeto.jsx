// Copyright (c) 2026 Daniel Felix Ferber

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { chavePix, montarPayloadPix } from '../lib/pix.js';
import { emitirAviso, SEVERIDADE } from '../lib/avisos.js';
import './ApoieOProjeto.css';

// Vista interna "Apoie o projeto" (IDR 0070) — vista interna sem router
// (TDR 0020): `onVoltar` devolve para a tela de origem, sem depender do
// histórico do navegador. Alcançável pelo rodapé da tela de login (linha do
// cartão) e pelo rodapé da tela principal.
//
// Traz a frase de contexto, o QR code Pix gerado em runtime a partir do
// payload da Tarefa 0035-0001 (TDR 0029) e a chave em texto ao lado — a
// chave nunca é só um reforço da imagem, é caminho equivalente (IDR 0070).
// Copiar e, onde o navegador oferecer, compartilhar seguem o padrão do link
// do catálogo (IDR 0055), com o aviso de sucesso do IDR 0029. Sem
// rastreamento: a vista não sabe se ou quanto foi doado (IDR 0070).
export default function ApoieOProjeto({ onVoltar }) {
  // O SVG do QR nasce uma vez, ao montar (o payload é fixo); `null` enquanto
  // a promise resolve. O caminho `toString` só monta a string SVG, sem
  // canvas — ao contrário do `toDataURL`, que depende de uma implementação
  // de canvas que o jsdom não tem. O SVG entra num `<img>` por data URI:
  // sem `dangerouslySetInnerHTML` (`react/no-danger` é erro no oxlint).
  const [qr, setQr] = useState(null);

  // A folha de compartilhamento é do navegador e não muda durante a sessão:
  // basta ler no render (IDR 0024, IDR 0055).
  const podeCompartilhar = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  useEffect(() => {
    let cancelado = false;
    QRCode.toString(montarPayloadPix(), { type: 'svg', margin: 1, width: 200 })
      .then((svg) => {
        if (!cancelado) {
          setQr(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
        }
      })
      .catch(() => {
        // A chave em texto permanece na tela: sem a imagem, a vista não
        // trava e o caminho de doação continua disponível.
      });
    return () => {
      cancelado = true;
    };
  }, []);

  async function copiarChave() {
    try {
      if (!navigator.clipboard) throw new Error('Área de transferência indisponível');
      await navigator.clipboard.writeText(chavePix);
      emitirAviso({ severidade: SEVERIDADE.SUCESSO, mensagem: 'chave copiada', tipo: 'apoie' });
    } catch {
      // A chave já está visível na tela: sem área de transferência, o aviso
      // dourado (não falha) basta — não há texto a perder (IDR 0029).
      emitirAviso({
        severidade: SEVERIDADE.AVISO,
        mensagem: 'Área de transferência indisponível — copie a chave na tela',
        tipo: 'apoie',
      });
    }
  }

  // Entrega só a chave, sem texto acoplado (IDR 0070). Fechar a folha sem
  // escolher (`AbortError`) não avisa; outra rejeição cai na cópia, como no
  // link do catálogo (IDR 0055).
  async function compartilharChave() {
    try {
      await navigator.share({ text: chavePix });
      emitirAviso({
        severidade: SEVERIDADE.SUCESSO,
        mensagem: 'chave compartilhada',
        tipo: 'apoie',
      });
    } catch (erro) {
      if (erro?.name === 'AbortError') return;
      copiarChave();
    }
  }

  return (
    <div className="apoie">
      <div className="apoie__corpo">
        <button type="button" className="apoie__voltar" onClick={onVoltar}>
          <span aria-hidden="true">←</span> Voltar
        </button>

        <h1 className="apoie__titulo">Apoie o projeto</h1>

        <p>
          O Iconula é gratuito, sem anúncios e sem vínculo comercial com Panini
          ou FIFA. Se ele ajuda a organizar o seu álbum, você pode retribuir
          com um Pix de R$ 5,00 — o preço de um pacotinho de figurinhas. A
          doação é opcional e não desbloqueia nenhuma função.
        </p>

        <div className="apoie__pix">
          {qr && (
            <img
              className="apoie__qr"
              src={qr}
              alt="QR code Pix para apoiar o projeto com uma doação"
            />
          )}
          <div className="apoie__dados">
            <p className="apoie__rotulo">Chave Pix</p>
            <p className="apoie__chave">
              <code>{chavePix}</code>
            </p>
            <div className="apoie__acoes">
              <button type="button" className="apoie__botao" onClick={copiarChave}>
                Copiar chave Pix
              </button>
              {podeCompartilhar && (
                <button
                  type="button"
                  className="apoie__botao apoie__botao--secundario"
                  onClick={compartilharChave}
                >
                  Compartilhar chave Pix…
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
