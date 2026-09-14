<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0053: Termos de uso e rodapé com copyright e isenção

## Status

Aceito.

## Contexto

- Pedido do humano: copyright de Daniel Felix Ferber no rodapé e uma linha
  de isenção de responsabilidade com link para termos e condições de uso.
- Hoje os dois rodapés — `Rodape.jsx` (tela principal) e o de
  `TelaDeLogin.jsx` — trazem só o aviso de independência e marcas
  (`requisitos.md` § Privacidade); o da tela principal também o link da
  política ([IDR 0037](0037-politica-no-rodape-depois-de-autenticado.md)).
- Não existe texto nem tela de termos de uso; `requisitos.md` não os pede.
- Molde disponível: a política de privacidade como vista interna, sem router
  ([TDR 0020](../tdr/0020-privacidade-como-vista-interna.md)), alcançável
  das duas telas.

## Decisão

- **Vista interna "Termos de uso"**, no molde da política (TDR 0020):
  substitui o conteúdo da tela, com "← Voltar" para a tela de origem.
- **Rodapé das duas telas** (principal e login), nesta ordem, uma linha por
  item:
  1. `© 2026 Daniel Felix Ferber`
  2. "Projeto independente, sem vínculo com Panini ou FIFA; marcas pertencem
     aos seus titulares (Lei 9.279/96, art. 132)." (mantido)
  3. "Uso por sua conta e risco, sem garantias."
  4. só na tela principal: "Política de privacidade · Termos de uso"
- **Aceite pela frase da tela de login**: "Ao continuar, você confirma ter 12
  anos ou mais, ou estar autorizado pelos responsáveis, e concorda com os
  Termos de uso." — vale a cada login; "Termos de uso" é link.
  - O passo de atestação ([IDR 0036](0036-atestacao-passo-explicito-e-falha-de-gravacao.md))
    e `atestadoEm` não mudam.
- No cartão da tela de login, os links "Política de privacidade · Termos de
  uso" na mesma linha.
- **Conteúdo dos termos**, nesta ordem: aceite; o que é o serviço (gratuito,
  independente); uso no estado em que se encontra, sem garantia de
  disponibilidade nem contra perda de dados (o exportar como proteção);
  responsabilidade do usuário pela própria conta Google; limitação de
  responsabilidade; marcas; alterações dos termos; lei brasileira; contato
  (o mesmo canal da política).
  - A tarefa redige o texto a partir deste roteiro; o humano o aprova no PR
    da fase, antes do merge.

## Consequências

- Componente novo da vista de termos; `App.jsx` ganha a vista, como a da
  política; `Rodape.jsx` e `TelaDeLogin.jsx` mudam.
- `interface.md` § Tela de login (textos exatos e rodapé), § Demais telas
  (nova vista) e § Medidas (rodapé) mudam.
- Sem custo em leituras ou escritas: conteúdo estático, nenhum dado novo.
- `requisitos.md` não tem requisito de termos de uso — incluí-lo cabe ao
  humano.
- Implementação: a planejar (/planejar).

## Alternativas consideradas

- **Aceite no passo de atestação**: gravado uma única vez por conta — quem
  já atestou nunca veria os termos, ou exigiria re-aceite.
- **Termos sem frase de aceite**: só consultáveis pelo link; a isenção
  ficaria sem concordância declarada.
- **Rodapé novo só na tela principal**: o login, onde o aceite acontece,
  ficaria sem link para os termos.
- **Isenção explícita** ("Fornecido como está, sem garantia de
  disponibilidade nem de preservação dos dados — exporte sua coleção"):
  mais precisa, mas longa para o rodapé; o detalhe fica nos termos.
- **Copyright, isenção e link numa linha só**: mais compacto, menos legível
  no celular.
- **Humano fornece o texto final antes do planejamento**: mais controle,
  mas bloqueia o planejamento até o texto existir; a revisão no PR dá o
  mesmo controle.

## Histórico

- 2026-09-13 — Criado no esmiuçamento de contrair seções, rodapé e
  compartilhar; implementação a planejar.
