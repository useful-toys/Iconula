<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Arquitetura do Iconula

Visão de conjunto do sistema — serviços, camadas, dados e fluxo — e
índice de onde cada decisão vive. As decisões individuais estão nos
registros (ADR/TDR/IDR) e nos docs de referência
([persistencia.md](persistencia.md),
[interface.md](interface.md), [requisitos.md](requisitos.md)); este
documento monta o quebra-cabeça.

O produto especificado em [requisitos.md](requisitos.md) — o controle de
figurinhas do álbum da Copa 2026 — está implementado nesta arquitetura; o
"Iconula Button" (o app de um único botão que a precedeu) foi removido do
código, e as menções a ele neste documento e em [persistencia.md](persistencia.md)
são histórico de como o schema evoluiu, não o estado atual.

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
  required check (ADR 0003/0004)
- **Auth**: único provedor Google, popup, botão próprio, SDK modular
  (ADR 0005 → 0006)
- **Firestore**: banco `(default)`, região `southamerica-east1`, um
  documento por usuário — detalhes, custos e o que muda com o produto
  novo em [persistencia.md](persistencia.md)

## Camadas no cliente

| Camada | Conteúdo |
|---|---|
| `src/data/` | Catálogo estático (50 seções, 994 figurinhas — [TDR 0010](tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md)) e suas derivações puras: ordenações/agrupamento ([TDR 0012](tdr/0012-derivacoes-do-catalogo-em-src-data.md)) e layout de página do álbum |
| `src/lib/` | Módulos sem React: estado da coleção em memória, persistência no Firestore (`colecaoRemota.js`, único módulo que toca o SDK), gravação agregada com debounce/flush, histórico de desfazer, preferências de vista no `localStorage`, portabilidade (export/import JSON), textos de troca, fila de avisos e conversão de bandeiras |
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
  `users/{uid}` (schema decidido — ADR 0008, ver persistencia.md)

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

- Vite gera estáticos em `dist/`; bundle principal enxuto — o SDK do
  Firestore (~555 KB) vira chunk sob demanda, baixado só por quem
  entra (ADR 0007)
- Bandeiras Twemoji vendadas em `src/assets/flags/` (ADR 0002)
- Testes: Vitest + React Testing Library (unitários) e regras do
  Firestore no emulador (`npm run test:rules`, JDK 21+), ambos no CI
  (TDR 0004/0008); actions pinadas por SHA (TDR 0006)
- Configuração dos ambientes: [firebase.md](firebase.md),
  [gcloud.md](gcloud.md), [github.md](github.md),
  [registrobr.md](registrobr.md)

## Decisões-chave e onde vivem

| Área | Registro |
|---|---|
| Stack Vite + React | [ADR 0001](adr/0001-stack-vite-react.md) |
| Bandeiras Twemoji vendadas | [ADR 0002](adr/0002-bandeiras-emoji-unicode.md) |
| Deploy Hosting + Actions | [ADR 0003](adr/0003-deploy-firebase-hosting-github-actions.md) |
| Preview como required check | [ADR 0004](adr/0004-branch-protection-preview-required.md) |
| Login Google | [ADR 0005](adr/0005-substituido-autenticacao-google-firebase-auth.md) → [0006](adr/0006-login-google-sdk-modular.md) |
| Persistência Firestore | [ADR 0007](adr/0007-persistencia-do-time-no-firestore.md) + [persistencia.md](persistencia.md) |
| CSP para Auth/Firestore | [TDR 0005](tdr/0005-csp-firebase-auth-google-oauth.md), [TDR 0007](tdr/0007-csp-para-o-firestore.md) |
| Regras: deploy e teste | [TDR 0008](tdr/0008-deploy-e-teste-das-regras-do-firestore.md) |
| Regras: o que dá para validar no mapa | [TDR 0009](tdr/0009-validacao-do-mapa-nas-regras.md) |
| Interface (disposições, estados, sync, scroll, acessibilidade…) | [IDR 0001–0043](idr/) + [interface.md](interface.md) |
| Aparência (tema, paleta, medidas) | [IDR 0022](idr/0022-tema-escuro-unico-paleta-do-prototipo.md) + [interface.md](interface.md) |
| Schema da coleção | [ADR 0008](adr/0008-schema-da-colecao-mapa-esparso.md) + [persistencia.md](persistencia.md) |
| Forma do catálogo, checklist incompleto e sem pipeline de geração | [TDR 0010](tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md) |
| Derivações de ordenação/agrupamento em `src/data/` | [TDR 0012](tdr/0012-derivacoes-do-catalogo-em-src-data.md) |
| Tipografia (Poppins) vendorizada | [TDR 0013](tdr/0013-tipografia-vendorizada.md) |
| Estado da coleção sem Context (prop-drilling) | [TDR 0014](tdr/0014-estado-da-colecao-sem-context.md) |
| Política de privacidade como vista interna, sem router | [TDR 0020](tdr/0020-privacidade-como-vista-interna.md) |
| Desempenho do catálogo (994 figurinhas) | [TDR 0021](tdr/0021-desempenho-do-catalogo.md) |
| Login como guarda do app, atestação de menores | Tarefas 0008-0001/0003 + [IDR 0036](idr/0036-atestacao-passo-explicito-e-falha-de-gravacao.md) |
| Desfazer, menu de ações, listas de troca, export/import | Fase 9 + [IDR 0012](idr/0012-desfazer-no-cabecalho-historico-de-10.md), [0024](idr/0024-acoes-raras-em-menu-do-cabecalho.md), [0039](idr/0039-texto-de-troca-ordem-fixa-e-copia-manual-de-reserva.md), [0040](idr/0040-exportar-sem-dialogo-e-nome-de-arquivo-datado.md), [0041](idr/0041-importar-confirmacao-minima-e-descarte-de-chave-desconhecida.md) |
| Acessibilidade: foco visível, área de toque | [IDR 0042](idr/0042-foco-visivel-e-area-de-toque.md) |
| Padrões de primeira abertura por faixa de tela | [IDR 0043](idr/0043-padroes-de-primeira-abertura-por-faixa-de-tela.md) |

## Pontos em aberto (fase de implementação)

- **Aceite dos números do ADR 0008 — parcialmente aberto**: o schema está
  aceito (mapa esparso, três campos, teto de 99 — TDR 0009) e os valores
  numéricos (debounce ~2s, teto de espera ~10s, timeout ~5s sem rede)
  foram aceitos como ponto de partida na Tarefa 0007-0003 (ver
  [log](plano/0007-persistencia-da-colecao-e-avisos/logs/0003-log-gravacao-agregada-com-flush.md)
  § "Números do ADR 0008"). **Falta**: confirmá-los em uso real — não
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
