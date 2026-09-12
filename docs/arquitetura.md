<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Arquitetura do Iconula

Visão de conjunto do sistema — serviços, camadas, dados e fluxo — e
índice de onde cada decisão vive. As decisões individuais estão nos
registros (ADR/TDR/IDR) e nos docs de referência
([persistencia.md](persistencia.md),
[interface.md](interface.md), [requisitos.md](requisitos.md)); este
documento monta o quebra-cabeça.

Hoje o código implementado é o app do botão; a arquitetura descrita
aqui é a mesma em que o controle de figurinhas será construído —
mudam as telas e o schema, não a forma.

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

| Camada | Hoje (botão) | Alvo (figurinhas) |
|---|---|---|
| `src/data/` | `teams.js` (48 times) | catálogo: 50 seções e 994 códigos, com nome, grupo da Copa (A–L), páginas do spread e layout — grupos e páginas já resolvidos (IDR 0019 + Anexo de requisitos.md); do checklist falta só o que degrada |
| `src/lib/` | `firebase.js`, `userPreferences.js` | + persistência da coleção, preferências de vista no `localStorage` (IDR 0026), export/import JSON, texto WhatsApp |
| `src/components/` | `TeamButton`, `AuthStatus`, `LoginButton` | tela de login, cabeçalho/placar, controles, menu de ações (IDR 0024), faixa de salto, super-grupo, grupo, figurinha, avisos |
| `App.jsx` | estado do time + usuário | estado da coleção + usuário; tela de login como guarda |

Convenção vigente (AGENTS.md): nada de router nem estado global até a
árvore de componentes realmente exigir — revisar quando as telas do
produto novo existirem (ver Pontos em aberto).

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
| Interface (disposições, estados, sync, scroll…) | [IDR 0001–0033](idr/) + [interface.md](interface.md) |
| Aparência (tema, paleta, medidas) | [IDR 0022](idr/0022-tema-escuro-unico-paleta-do-prototipo.md) + [interface.md](interface.md) |
| Schema da coleção | [ADR 0008](adr/0008-schema-da-colecao-mapa-esparso.md) + [persistencia.md](persistencia.md) |
| Desempenho do catálogo (994 figurinhas) | [TDR 0021](tdr/0021-desempenho-do-catalogo.md) |

## Pontos em aberto (fase de implementação)

- **Aceite dos números do ADR 0008**: o schema está aceito (mapa esparso,
  três campos, teto de 99 — TDR 0009); restam por aceitar os valores
  numéricos (debounce ~2s, teto de espera ~10s, timeout ~5s sem rede),
  pontos de partida ajustáveis sem novo ADR — aceitos em uso real na
  Fase 7
- **Router**: tela de privacidade como rota ou vista interna — decidir
  quando as telas existirem
- **Estado global**: a coleção consumida por várias telas pode exigir
  Context — só quando o prop-drilling incomodar (convenção do
  AGENTS.md)
- **Geração do catálogo**: da fonte do checklist para `src/data/` —
  pipeline a definir
