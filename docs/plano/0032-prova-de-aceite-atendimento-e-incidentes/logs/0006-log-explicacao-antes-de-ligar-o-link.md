<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0032-0006: explicação antes de ligar o link

## Data
2026-09-18

## Resumo
O ligar do link do catálogo deixa de ser um toque imediato e passa a ser um
consentimento informado: tocar na chave desligada expande, dentro do próprio
popup Compartilhar e sem fechá-lo, um bloco curto com o que acontece — a
coleção fica visível sem login para quem tiver o link, nome e e-mail não
aparecem, desligar revoga o acesso, mas quem já abriu pode ter copiado o que
viu — e os botões "Ligar o link" e "Cancelar". Só "Ligar o link" grava;
"Cancelar" e o simples expandir não gravam nada. Desligar continua num único
toque, sem confirmação (IDR 0055, IDR 0010, IDR 0061). Antes, a chave ligava e
desligava no toque, direto.

A mudança vive em `MenuDeCompartilhar.jsx` (estado `mostrandoExplicacao`, os
handlers de confirmar/cancelar e o bloco) e `MenuDeCompartilhar.css` (o cartão
da explicação e os dois botões). O `App.jsx` não muda de comportamento: o
`handleAlternarLink` continua otimista; só o comentário que dizia "sem
confirmação" foi corrigido, porque agora vale só para desligar.
`docs/interface.md` § Menu de ações › Compartilhar passa a descrever o passo
informativo.

Divergência de planejamento: a tarefa cita `src/App.compartilhar.test.jsx`
como arquivo impactado, mas os testes de integração da chave do link sempre
moraram em `src/App.linkDoCatalogo.test.jsx` (Tarefa 0027-0004), que é onde o
comportamento da chave é exercido. Cobrir a explicação em
`App.compartilhar.test.jsx` duplicaria o assunto e exigiria um mock de
`gravarLinkAtivo` naquele arquivo, cujo tema é a folha de compartilhamento
das listas. Os testes de integração do passo informativo entraram em
`App.linkDoCatalogo.test.jsx`, e os testes que já existiam lá foram
atualizados porque o ligar deixou de gravar no toque.

## Discovery
- Código: `MenuDeCompartilhar.jsx` tem o popup com três blocos; a chave é um
  `role="switch"` que chama `alternarLink()` (com a trava
  `gravandoLinkRef`). `App.jsx` mantém `linkAtivo` e `handleAlternarLink`
  (otimista, `proximo = !anterior`, reverte na falha, avisa sucesso/falha).
  Os testes da chave estão em `App.linkDoCatalogo.test.jsx` (Tarefa
  0027-0004), e não em `App.compartilhar.test.jsx`; por isso o ligar pelo
  toque aparece em vários testes de lá e todos precisam do passo de
  confirmação. `App.copiar.test.jsx` e `CatalogoCompartilhado` não tocam a
  chave. Comportamento atual confere com a tarefa, fora o nome do arquivo de
  integração.
- Documentação: li o IDR 0055 (§ Decisão › Ligar e desligar e § Histórico),
  o IDR 0061 (§ Decisão, base legal do link) e o IDR 0010 (desligar não ganha
  confirmação). As referências bastaram; `docs/interface.md` § Menu de ações
  foi lido para atualizar o trecho.

## Plano da alteração
1. `MenuDeCompartilhar.jsx` — estado `mostrandoExplicacao`; tocar na chave
   ligada desliga na hora (com a trava de reentrância) e tocar na desligada
   só expande o bloco; "Ligar o link" recolhe e chama `onAlternarLink`;
   "Cancelar" recolhe sem chamar. Foco permanece na chave ao expandir; o
   popup não fecha em nenhum passo.
2. `MenuDeCompartilhar.css` — cartão da explicação (`--bg-deep`/`--border`) e
   os botões confirmar (dourado) e cancelar (borda), com foco visível.
3. `MenuDeCompartilhar.test.jsx` — testes do bloco: expande sem gravar,
   confirmar grava, cancelar não grava, desligar segue num toque, trava no
   confirmar; ajuste dos testes que assumiam o ligar no toque.
4. `App.linkDoCatalogo.test.jsx` — testes de integração: ligar passa pela
   explicação (sem gravar no toque), cancelar não grava, desligar segue
   imediato, falha reverte a chave; ajuste dos testes existentes de ligar.
5. `App.jsx` — corrigir o comentário que dizia que ligar/desligar não têm
   confirmação.
6. `docs/interface.md` § Menu de ações › Compartilhar — descrever o passo
   informativo, citando IDR 0055 e IDR 0061.
- Verificação prevista: cada critério → testes de componente e de integração
  citados; `npm run lint && npm run test && npm run build`; leitura do trecho
  de `docs/interface.md`; roteiro visual em `npm run dev` (sem navegador
  aqui, fica `pendente`).
- Riscos: os testes de integração antigos do ligar quebrarem (mitigado por
  atualizá-los no mesmo passo); foco se perder ao expandir (mantido na chave);
  o bloco reabrir sozinho depois de desligar (recolhido explicitamente).
- Desvios: `App.compartilhar.test.jsx` → `App.linkDoCatalogo.test.jsx` (ver
  Resumo); `App.jsx` incluído só para o comentário.

## Decisões tomadas
- Integração do passo informativo coberta em `App.linkDoCatalogo.test.jsx`,
  não em `App.compartilhar.test.jsx` — nível 1: o arquivo citado na tarefa não
  é o dono dos testes da chave; desvio registrado.
- Ao confirmar, o bloco recolhe de imediato (otimista, como o `linkAtivo` do
  `App.jsx`); na falha, a chave reverte e o bloco fica recolhido, podendo ser
  reaberto no toque — nível 1, detalhe interno dentro da decisão do IDR 0055.
- Foco permanece na chave ao expandir o bloco — nível 1; atende "o foco não se
  perde" do roteiro sem roubá-lo para um botão.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação

`npm run lint`:
```
Found 0 warnings and 0 errors.
Finished in 60ms on 99 files with 105 rules using 4 threads.
```

`npm run test`:
```
 Test Files  48 passed (48)
      Tests  639 passed (639)
```
(Os avisos "An update to Avisos inside a test was not wrapped in act(...)"
são pré-existentes: aparecem em testes não tocados — `App.test.jsx`,
`App.importar.test.jsx`, `App.compartilhar.test.jsx` —, não em decorrência
desta tarefa.)

`npm run build`:
```
✓ 144 modules transformed.
✓ built in 448ms
```
(com o aviso pré-existente de chunk acima de 500 kB).

`npm run test:rules`: não se aplica — `firestore.rules` não foi tocado.

## Critérios de aceite
- [x] Ligar sem passar pela explicação é impossível pela interface — em
  `MenuDeCompartilhar.jsx`, com `linkAtivo` falso, `aoTocarNaChave` só faz
  `setMostrandoExplicacao(true)`; o único caminho para `onAlternarLink` com o
  link desligado é `confirmarLigar`. Testes: "tocar na chave desligada abre a
  explicação sem gravar e mantém o foco nela" (componente) e "tocar na chave
  desligada abre a explicação sem gravar; cancelar também não grava"
  (integração, `App.linkDoCatalogo.test.jsx`).
- [x] Cancelar não emite gravação alguma (verificável por teste) —
  `cancelarLigar` só recolhe o bloco; os dois testes acima e "cancelar recolhe
  a explicação sem gravar" (componente) afirmam `onAlternarLink`/
  `gravarLinkAtivo` não chamados.
- [x] Desligar continua num único toque — `aoTocarNaChave` com `linkAtivo`
  verdadeiro chama `alternarLink` direto, sem abrir o bloco. Testes: "desligar
  continua num toque, sem explicação" (componente) e "desligar grava false num
  único toque, sem explicação" (integração).
- [x] O popup não fecha em nenhum dos passos — `confirmarLigar`,
  `cancelarLigar` e o expandir não chamam `fechar()`; os testes de componente e
  integração afirmam `screen.getByRole("menu")` presente depois de expandir,
  confirmar e cancelar.
- [x] `npm run lint && npm run test && npm run build` verdes — saídas acima.

## Arquivos alterados
- `src/components/MenuDeCompartilhar.jsx` — estado `mostrandoExplicacao`; a
  chave desligada expande o passo informativo em vez de gravar; "Ligar o
  link"/"Cancelar"; `aoTocarNaChave` mantém o desligar imediato.
- `src/components/MenuDeCompartilhar.css` — cartão da explicação e os botões
  confirmar/cancelar, com foco visível.
- `src/components/MenuDeCompartilhar.test.jsx` — testes do passo informativo;
  ajuste dos testes da chave que assumiam o ligar no toque.
- `src/App.linkDoCatalogo.test.jsx` — integração do passo informativo
  (expandir/cancelar/confirmar/desligar/falha); ajuste dos testes de ligar.
- `src/App.jsx` — comentário do `handleAlternarLink` corrigido.
- `docs/interface.md` — § Menu de ações › Compartilhar descreve o passo
  informativo (IDR 0055, IDR 0061).
- `docs/plano/0032-prova-de-aceite-atendimento-e-incidentes/0006-explicacao-antes-de-ligar-o-link.md`
  — status `Em andamento`.
- `docs/plano/README.md` — linha da tarefa `Em andamento`.
- `docs/plano/0032-prova-de-aceite-atendimento-e-incidentes/logs/0006-log-explicacao-antes-de-ligar-o-link.md`
  — este log.
