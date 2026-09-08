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
| `src/data/` | `teams.js` (48 times) | catálogo: seções, códigos, nomes, páginas, grupos da Copa (A–L), ordem do álbum — gerado do checklist (fonte pendente) |
| `src/lib/` | `firebase.js`, `userPreferences.js` | + persistência da coleção, export/import JSON, texto WhatsApp |
| `src/components/` | `TeamButton`, `AuthStatus`, `LoginButton` | tela de login, cabeçalho/placar, controles, grupo, figurinha, avisos |
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
   → estado da coleção → tela; evento "carregado" notificado
2. **Ajuste**: toque → estado local muda na hora → o ajuste entra na
   gravação agregada → Firestore → "gravado" notificado, `updatedAt`
   atualiza o cabeçalho; em falha, a tela segue e a gravação seguinte
   regrava o valor completo (IDRs 0002/0003)
3. **Portabilidade**: export JSON lê o estado; import substitui a
   coleção com confirmação

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
| Login Google | [ADR 0005](adr/0005-autenticacao-google-firebase-auth.md) → [0006](adr/0006-login-google-sdk-modular.md) |
| Persistência Firestore | [ADR 0007](adr/0007-persistencia-do-time-no-firestore.md) + [persistencia.md](persistencia.md) |
| CSP para Auth/Firestore | [TDR 0005](tdr/0005-csp-firebase-auth-google-oauth.md), [TDR 0007](tdr/0007-csp-para-o-firestore.md) |
| Regras: deploy e teste | [TDR 0008](tdr/0008-deploy-e-teste-das-regras-do-firestore.md) |
| Interface (disposições, estados, sync, scroll…) | [IDR 0001–0020](idr/) + [interface.md](interface.md) |
| Schema da coleção | [ADR 0008](adr/0008-schema-da-colecao-mapa-esparso.md) + [persistencia.md](persistencia.md) |

## Pontos em aberto (fase de implementação)

- **Aceite do ADR 0008**: redigido — revisar os valores numéricos
  (debounce, teto de espera, teto por contagem) antes de implementar
- **Router**: tela de privacidade como rota ou vista interna — decidir
  quando as telas existirem
- **Estado global**: a coleção consumida por várias telas pode exigir
  Context — só quando o prop-drilling incomodar (convenção do
  AGENTS.md)
- **Virtualização das listas**: ~1000 figurinhas sem travar, sem criar
  scroll próprio (RNF + IDR 0008) — escolha de biblioteca na
  implementação
- **Geração do catálogo**: da fonte do checklist para `src/data/` —
  pipeline a definir
