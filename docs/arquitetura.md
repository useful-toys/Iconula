<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Arquitetura do Iconula

Visão de conjunto do sistema — serviços, camadas, dados e fluxo — e
índice de onde cada decisão vive. As decisões individuais estão nos
registros (ADR/TDR/IDR/MDR/DDR) e nos docs de referência
([modelo-firebase.md](modelo-firebase.md),
[modelo-intercambio.md](modelo-intercambio.md),
[modelo-memoria.md](modelo-memoria.md),
[interface.md](interface.md), [requisitos.md](requisitos.md),
[devops.md](devops.md)); este
documento monta o quebra-cabeça. A seção "Decisões-chave" abaixo é um
resumo curado por tema — o índice completo e filtrável por tags de cada
registro está em [adr/README.md](adr/README.md), [tdr/README.md](tdr/README.md),
[idr/README.md](idr/README.md), [model-dr/README.md](model-dr/README.md) e
[devops-dr/README.md](devops-dr/README.md).

O produto especificado em [requisitos.md](requisitos.md) — o controle de
figurinhas do álbum da Copa 2026 — está implementado nesta arquitetura; o
"Iconula Button" (o app de um único botão que a precedeu) foi removido do
código, e as menções a ele neste documento são histórico de como o schema
evoluiu, não o estado atual.

## Visão geral

SPA 100% no navegador, **sem backend próprio**: os serviços Firebase
são o servidor, e a segurança que um backend teria é exercida pelas
regras do Firestore, avaliadas no servidor contra o ID token.

```
              GitHub Actions (merge na main → produção;
              PR → preview, required check)
                            │ deploy de dist/
                            ▼
                ┌───────────────────────┐
                │ Firebase Hosting      │
                │ estático · CSP ·      │
                │ domínio próprio       │
                └───────────┬───────────┘
                            │ HTML/JS/CSS
                            ▼
┌─────────────────────────────────────────────────────┐
│ SPA no navegador · React 19 · Vite                  │
│                                                     │
│  src/data/  catálogo embutido (994 figurinhas)      │
│  estado     coleção em memória (contagens)          │
│  src/lib/   SDK sob demanda (firebase/firestore)    │
└───────┬─────────────────────────────┬───────────────┘
        │ OAuth popup (Google)        │ leitura/escrita
        │                             │ com ID token
        ▼                             ▼
┌────────────────┐          ┌──────────────────────┐
│ Firebase Auth  │          │ Cloud Firestore      │
│ só Google      │          │ users/{uid}          │
└────────────────┘          │ + regras no servidor │
                            └──────────────────────┘
```

## Serviços Firebase

- **Hosting**: serve `dist/` (build do Vite) com CSP e headers de
  segurança; produção em merge na `main`, preview por PR — workflow é
  required check ([ADR 0003](adr/0003-firebase-hosting.md), [DDR 0005](devops-dr/0005-protecao-da-branch-main.md))
- **Auth**: único provedor Google, popup, botão próprio, SDK modular
  ([ADR 0004](adr/0004-login-google-sdk-modular.md))
- **Firestore**: banco `(default)`, região `southamerica-east1`, um
  documento por usuário — detalhes, custos e mecanismo de gravação em
  [modelo-firebase.md](modelo-firebase.md)

## Camadas no cliente

| Camada | Conteúdo |
|---|---|
| `src/data/` | Catálogo estático (50 seções, 994 figurinhas — [TDR 0010](tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md)) e suas derivações puras: ordenações/agrupamento ([TDR 0012](tdr/0012-derivacoes-do-catalogo-em-src-data.md)) e layout de página do álbum |
| `src/lib/` | Módulos sem React: estado da coleção em memória, persistência no Firestore (`colecaoRemota.js`, único módulo que toca o SDK), gravação agregada com debounce/flush, histórico de desfazer, preferências de vista no `localStorage`, portabilidade (export/import JSON), textos de troca, fila de avisos, conversão de bandeiras e cálculo de progresso |
| `src/components/` | Telas (login, atestação, política de privacidade) e árvore da tela principal: cabeçalho com placar e faixa de salto, controles (ordenação/disposição/filtro), menu de ações, catálogo (super-grupo → seção → figurinha ou página do álbum) e avisos flutuantes |
| `src/App.jsx` | Único componente com estado: sessão (Firebase Auth), coleção, atestação, vista da política, preferências de vista e histórico de desfazer; decide qual tela mostrar (guarda de login) e concentra toda leitura/escrita da coleção |

Convenção vigente (AGENTS.md): nada de router nem estado global até a
árvore de componentes realmente exigir. Confirmada em uso, não só
proposta: a política de privacidade — a primeira tela endereçável além de
login/catálogo — ficou como vista interna sem router
([TDR 0020](tdr/0020-privacidade-como-vista-interna.md)), e a coleção
consumida por cabeçalho, controles, menu de ações e catálogo segue em
`App.jsx` por prop-drilling, sem Context
([TDR 0014](tdr/0014-estado-da-colecao-sem-context.md)).

## Dados e fluxo

Dois mundos, nunca misturados:

- **Catálogo** — estático, embutido no bundle, igual para todos:
  nunca toca o Firestore. Identidade da figurinha é o código
  (`BRA05`), imutável
- **Coleção** — estado do usuário, contagens por código, vive em
  `users/{uid}` (schema decidido — [ADR 0005](adr/0005-persistencia-no-firestore.md),
  detalhes em [modelo-firebase.md](modelo-firebase.md))

Fluxos:

1. **Carga**: login → Auth emite o usuário → leitura de `users/{uid}`
   → estado da coleção → tela; aviso efêmero de "carregado" e o
   `updatedAt` lido no cabeçalho (IDRs 0027/0029)
2. **Ajuste**: toque → estado local muda na hora → o ajuste entra na
   gravação agregada → Firestore → aviso efêmero de "gravado" e relógio
   do cabeçalho avançado; em falha, a tela segue, o aviso vermelho fica
   e a gravação seguinte regrava as chaves alteradas (IDRs
   0002/0003/0029)
3. **Portabilidade**: export JSON lê o estado; import substitui a
   coleção com confirmação e descarta o histórico de desfazer
4. **Preferência de vista**: alternador → `localStorage`, sem tocar o
   Firestore (IDR 0026)

## Build, deploy e qualidade

- Vite 8 gera estáticos em `dist/`; bundle principal enxuto — o SDK do
  Firestore (~555 KB) vira chunk sob demanda, baixado só por quem
  entra ([ADR 0005](adr/0005-persistencia-no-firestore.md))
- Bandeiras Twemoji vendadas em `src/assets/flags/` ([ADR 0006](adr/0006-bandeiras-emoji-unicode.md))
- Lint: oxlint com regras `react/rules-of-hooks` (erro),
  `react/no-danger` (erro) e `react/only-export-components` (aviso) —
  [TDR 0003](tdr/0003-lint-proibe-dangerously-set-inner-html.md)
- Testes: Vitest 5 + React Testing Library (unitários) e regras do
  Firestore no emulador (`npm run test:rules`, JDK 21+), ambos no CI
  ([DDR 0002](devops-dr/0002-workflow-de-ci-separado.md),
  [DDR 0004](devops-dr/0004-deploy-e-teste-das-regras-do-firestore.md));
  actions pinadas por SHA ([DDR 0003](devops-dr/0003-pinning-de-actions-por-sha.md))
- Três workflows: `ci.yml` (lint + testes + build), `firebase-hosting-merge.yml`
  (produção) e `firebase-hosting-pull-request.yml` (preview) —
  [TDR 0023](tdr/0023-deploy-via-github-actions.md),
  [DDR 0005](devops-dr/0005-protecao-da-branch-main.md)
- Configuração dos ambientes: [firebase.md](firebase.md),
  [gcloud.md](gcloud.md), [github.md](github.md),
  [registrobr.md](registrobr.md); panorama DevOps em [devops.md](devops.md)

## Decisões-chave e onde vivem

| Área | Registro |
|---|---|
| Aplicação SPA | [ADR 0001](adr/0001-aplicacao-spa.md) |
| Stack Vite + React | [ADR 0002](adr/0002-stack-vite-react.md) |
| Firebase Hosting | [ADR 0003](adr/0003-firebase-hosting.md) |
| Login Google | [ADR 0004](adr/0004-login-google-sdk-modular.md) |
| Persistência Firestore | [ADR 0005](adr/0005-persistencia-no-firestore.md) + [modelo-firebase.md](modelo-firebase.md) |
| Bandeiras Twemoji vendadas | [ADR 0006](adr/0006-bandeiras-emoji-unicode.md) |
| Estrutura de pastas | [ADR 0007](adr/0007-estrutura-de-pastas-e-separacao-de-responsabilidades.md) |
| CSS modular por componente | [ADR 0008](adr/0008-css-modular-por-componente.md) |
| Testes co-localizados | [ADR 0009](adr/0009-testes-co-localizados.md) |
| CSP, headers e cache no Hosting | [DDR 0001](devops-dr/0001-csp-headers-e-configuracao-de-hosting.md) |
| CI separado (lint, testes, build) | [DDR 0002](devops-dr/0002-workflow-de-ci-separado.md) |
| Pinning de actions por SHA | [DDR 0003](devops-dr/0003-pinning-de-actions-por-sha.md) |
| Regras: deploy e teste | [DDR 0004](devops-dr/0004-deploy-e-teste-das-regras-do-firestore.md) |
| Proteção da branch main | [DDR 0005](devops-dr/0005-protecao-da-branch-main.md) |
| Ferramentas de segurança do repositório | [DDR 0006](devops-dr/0006-ferramentas-de-seguranca-do-repositorio.md) |
| Lint (oxlint) | [TDR 0003](tdr/0003-lint-proibe-dangerously-set-inner-html.md), [TDR 0025](tdr/0025-oxlint-para-lint.md) |
| Regras: o que dá para validar no mapa | [TDR 0009](tdr/0009-validacao-do-mapa-nas-regras.md) |
| Forma do catálogo, checklist incompleto e sem pipeline de geração | [TDR 0010](tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md) |
| Derivações de ordenação/agrupamento em `src/data/` | [TDR 0012](tdr/0012-derivacoes-do-catalogo-em-src-data.md) |
| Tipografia (Poppins) vendorizada | [TDR 0013](tdr/0013-tipografia-vendorizada.md) |
| Estado da coleção sem Context (prop-drilling) | [TDR 0014](tdr/0014-estado-da-colecao-sem-context.md) |
| Carga no login — proteção de corrida e carimbo | [TDR 0016](tdr/0016-carga-no-login-corrida-e-formato-do-carimbo.md) |
| Escrita por `setDoc` com merge e carimbo local | [TDR 0017](tdr/0017-escrita-por-setdoc-merge-e-carimbo-local-pos-gravacao.md) |
| Espera sem rede via corrida com tempo-limite | [TDR 0019](tdr/0019-espera-sem-rede-via-corrida-com-timeout-e-callback.md) |
| Política de privacidade como vista interna, sem router | [TDR 0020](tdr/0020-privacidade-como-vista-interna.md) |
| Desempenho do catálogo (994 figurinhas) | [TDR 0021](tdr/0021-desempenho-do-catalogo.md) |
| Deploy via GitHub Actions (três workflows) | [TDR 0023](tdr/0023-deploy-via-github-actions.md) |
| Branch protection exigindo preview deploy | [DDR 0005](devops-dr/0005-protecao-da-branch-main.md) |
| Interface (disposições, estados, sync, scroll, acessibilidade…) | [IDR 0001–0044](idr/) + [interface.md](interface.md) |
| Aparência (tema, paleta, medidas) | [IDR 0022](idr/0022-tema-escuro-unico-paleta-do-prototipo.md) + [interface.md](interface.md) |
| Acessibilidade: foco visível, área de toque | [IDR 0042](idr/0042-foco-visivel-e-area-de-toque.md) |
| Padrões de primeira abertura por faixa de tela | [IDR 0043](idr/0043-padroes-de-primeira-abertura-por-faixa-de-tela.md) |
| Localização do documento no Firestore | [MDR 0001](model-dr/0001-localizacao-do-documento-no-firestore.md) |
| Schema da coleção (mapa esparso) | [MDR 0002](model-dr/0002-schema-do-documento-da-colecao.md) + [modelo-firebase.md](modelo-firebase.md) |
| Gravação agregada da coleção | [MDR 0003](model-dr/0003-gravacao-agregada-da-colecao.md) |
| Formato de intercâmbio (export/import JSON) | [MDR 0004](model-dr/0004-formato-de-intercambio-da-colecao.md) |
| Representação em memória na SPA | [MDR 0005](model-dr/0005-representacao-em-memoria-na-spa.md) |
| Catálogo estático embutido | [MDR 0006](model-dr/0006-catalogo-estatico-embutido.md) |
| Persistência no armazenamento local | [MDR 0007](model-dr/0007-persistencia-no-armazenamento-local.md) |

## Pontos em aberto (fase de implementação)

- **Aceite dos números do ADR 0005 — parcialmente aberto**: o schema está
  aceito (mapa esparso, três campos, teto de 99 — [MDR 0002](model-dr/0002-schema-do-documento-da-colecao.md))
  e os valores numéricos (debounce ~2s, teto de espera ~10s, timeout ~5s
  sem rede) foram aceitos como ponto de partida na Tarefa 0007-0003 (ver
  [log](plano/0007-persistencia-da-colecao-e-avisos/logs/0003-log-gravacao-agregada-com-flush.md)
  § "Números do ADR 0005"). **Falta**: confirmá-los em uso real — não
  houve deploy de produção com usuários reais disponível durante a
  execução automatizada do plano. Ajustar os números quando isso
  acontecer é mudança de valor, não de forma, e não exige novo ADR.

Os demais três pontos desta seção, mais a virtualização das listas
(fechada na Tarefa 0010-0002), estão todos fechados — ver § Decisões-chave
e onde vivem:

- ~~Router~~: vista interna, sem router — [TDR 0020](tdr/0020-privacidade-como-vista-interna.md)
- ~~Estado global~~: prop-drilling mantido, revisitado e confirmado na
  gravação agregada — [TDR 0014](tdr/0014-estado-da-colecao-sem-context.md)
- ~~Geração do catálogo~~: sem pipeline, arquivo escrito à mão a partir do
  Anexo e validado por testes de invariantes — [TDR 0010](tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md)
