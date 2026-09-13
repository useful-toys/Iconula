<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0026: Preferências de vista persistidas no navegador

## Status

Aceito.

## Contexto

- Ordenação (página × sigla), disposição (lista × álbum) e filtro de
  status são escolhas de vista. Nada dizia se sobrevivem a um
  recarregar ou à próxima abertura do app. O
  [IDR 0020](0020-secoes-colapsaveis-em-qualquer-visualizacao.md) já
  decidiu que o estado aberto/fechado das seções **não** persiste
  (volta ao padrão aberto), mas ele é estado de momento, não
  preferência.
- Quem usa o app toda semana na feira de troca abre sempre no mesmo
  modo; reconfigurar a cada abertura é atrito repetido no fluxo
  essencial.
- Gravar no Firestore custaria escrita a cada troca de alternador —
  contra a RNF de economia de requisições — e misturaria preferência de
  dispositivo com a coleção do usuário.

## Decisão

- Ordenação, disposição e filtro são **persistidos localmente no
  navegador** (`localStorage`) e restaurados ao recarregar a página ou
  abrir o app de novo
- Nada disso vai para o Firestore: **zero requisições**, e a preferência
  é do dispositivo — celular na feira e navegador em casa podem abrir em
  modos diferentes
- As seções e os super-grupos **fechados à mão** também são guardados
  no `localStorage` e voltam fechados; o resto abre
  ([IDR 0020](0020-secoes-colapsaveis-em-qualquer-visualizacao.md) —
  implementação na Fase 0012)
- Sem interface de configuração: a preferência é o próprio último uso
  dos alternadores

## Consequências

- Abrir o app cai direto no modo de trabalho da última sessão
- Armazenamento local ausente ou bloqueado (navegação privada, storage
  desabilitado) não pode quebrar o app: falha de leitura/escrita cai nos
  padrões e segue
- Os padrões de primeira abertura por faixa de tela foram decididos
  pelo [IDR 0043](0043-padroes-de-primeira-abertura-por-faixa-de-tela.md)
- Um dado local a mais no cliente, além do cache do SDK — sem dado
  pessoal, sem impacto na política de privacidade

## Alternativas consideradas

- **Não persistir** (padrão a cada abertura): mais simples, repete o
  atrito toda semana
- **Persistir no Firestore junto da coleção**: sincronizaria entre
  dispositivos, mas custa escrita por toque de alternador e trata como
  dado do usuário o que é preferência do aparelho
- **Colapso volátil** (decisão original): evitava restaurar um catálogo
  escondido, mas obrigava a refechar à mão a cada abertura; como só volta
  fechado o que o próprio usuário fechou, o catálogo não abre escondido por
  regra alguma

## Histórico

- 2026-09-13 — Planejamento revisado das Fases 11–17: o colapso manual
  passa a ser persistido junto das preferências de vista. Antes: "o estado
  de colapso de seções e super-grupos continua volátil", com a alternativa
  "persistir também o colapso" recusada.
