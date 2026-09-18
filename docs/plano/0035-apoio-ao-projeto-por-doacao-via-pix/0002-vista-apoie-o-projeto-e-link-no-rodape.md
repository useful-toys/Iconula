<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0035-0002]: Vista "Apoie o projeto" e link no rodapé

## Status
Concluída

## Objetivo
Criar a vista interna "Apoie o projeto" — QR Pix, chave em texto, frase de
contexto, copiar e compartilhar — e abri-la pelo link no rodapé das duas
telas (login e principal), reaproveitando o payload da Tarefa 0035-0001.

## Documentos de referência
- `docs/idr/0070-apoio-ao-projeto-rodape-menu-e-vista-com-qr-pix.md` —
  conteúdo da vista e acesso pelo rodapé
- `docs/tdr/0020-privacidade-como-vista-interna.md` — padrão de vista
  interna sem router
- `docs/interface.md` § Demais telas › Política de privacidade e § Termos
  de uso — layout de leitura a reproduzir (largura ~640px, título 22px
  dourado, "← Voltar")
- `src/components/TermosDeUso.jsx` — exemplo mais próximo de vista
  interna simples a seguir
- `src/components/MenuDeCompartilhar.jsx` — padrão de copiar e, quando o
  navegador oferecer, compartilhar pela folha do sistema (IDR 0055)
- `src/lib/pix.js` (gerado pela Tarefa 0035-0001) — `montarPayloadPix()`
- `src/lib/avisos.js` — fila de avisos flutuantes (IDR 0029)
- `src/components/Rodape.jsx`, `src/components/TelaDeLogin.jsx` — onde
  entra o novo link

## Padrões e convenções aplicáveis
- Nenhuma regra geral é violada — segue o padrão vigente de vista interna
  (TDR 0020) e de copiar/compartilhar (IDR 0055).

## Escopo e instruções de implementação
1. Criar `src/components/ApoieOProjeto.jsx` (e `.css`): mesmo layout de
   leitura de `TermosDeUso.jsx` — "← Voltar" que chama `onVoltar`, título
   "Apoie o projeto" em Poppins 700/22px dourado, corpo ~640px. Conteúdo,
   nesta ordem: frase de contexto ligando a doação ao produto (ex.:
   referência ao preço de um pacotinho de figurinhas); imagem do QR code,
   gerada em runtime com `qrcode` a partir de `montarPayloadPix()`, com
   nome acessível que descreve a ação (não só "QR code"); a chave Pix em
   texto, sempre visível ao lado da imagem, nunca só na imagem; botão
   "Copiar chave Pix" (clipboard, aviso de sucesso "chave copiada");
   botão "Compartilhar chave Pix…" só quando `navigator.share` existir,
   entregando apenas a chave (sem texto acoplado), com aviso "chave
   compartilhada".
2. Em `App.jsx`: acrescentar o valor `'apoie'` ao estado `vistaInterna`,
   com o mesmo bloco de retorno antecipado das outras vistas —
   `<ApoieOProjeto onVoltar={() => setVistaInterna(null)} />`.
3. Em `Rodape.jsx` e `TelaDeLogin.jsx`: novo link "Apoie o projeto", ao
   lado dos já existentes, chamando um novo `onAbrirApoie` passado por
   `App.jsx` como `() => setVistaInterna('apoie')` — nas duas telas.
4. `docs/interface.md` § Demais telas ganha uma nova subseção "Apoie o
   projeto", no mesmo formato das outras vistas, citando o IDR 0070; §
   Tela de login e a descrição do rodapé da tela principal passam a citar
   o novo link.

**Fora do escopo**: entrada pelo menu de ações (Tarefa 0035-0003);
geração do payload Pix (Tarefa 0035-0001, pré-requisito desta).

## Decisões já tomadas (não reabrir)
- Conteúdo, acesso pelo rodapé e posição da vista — ver
  `docs/idr/0070-apoio-ao-projeto-rodape-menu-e-vista-com-qr-pix.md`
- Padrão de vista interna sem router — ver
  `docs/tdr/0020-privacidade-como-vista-interna.md`
- Chave, valor e dados do recebedor — ver
  `docs/tdr/0029-geracao-local-do-qr-code-pix.md`

## Arquivos impactados
- `src/components/ApoieOProjeto.jsx` — criar
- `src/components/ApoieOProjeto.css` — criar
- `src/components/ApoieOProjeto.test.jsx` — criar
- `src/components/Rodape.jsx` — modificar
- `src/components/Rodape.test.jsx` — modificar
- `src/components/TelaDeLogin.jsx` — modificar
- `src/components/TelaDeLogin.test.jsx` — modificar, se cobrir o rodapé
- `src/App.jsx` — modificar (`vistaInterna`, `onAbrirApoie` nas duas
  telas)
- `src/App.test.jsx` — modificar, se cobrir o rodapé
- `docs/interface.md` — modificar (§ Demais telas › nova subseção; §
  Tela de login e o rodapé da tela principal)

## Critérios de aceite
- [ ] `ApoieOProjeto.jsx` renderiza o QR, a chave em texto, a frase de
      contexto e "← Voltar" funcional — coberto por
      `ApoieOProjeto.test.jsx`
- [ ] Botão "Copiar chave Pix" copia a chave e mostra o aviso "chave
      copiada" — coberto por teste
- [ ] Botão "Compartilhar chave Pix…" só aparece quando
      `navigator.share` existir — coberto por teste
- [ ] O rodapé das duas telas (login e principal) mostra o link "Apoie o
      projeto" e abre a vista ao clicar — coberto por teste
- [ ] `docs/interface.md` descreve a vista, citando o IDR 0070

## Validação adicional
- Roteiro visual em `npm run dev`: abrir "Apoie o projeto" pelo rodapé da
  tela de login e da tela principal; conferir o QR, a chave, copiar e,
  onde o navegador suportar, compartilhar.
