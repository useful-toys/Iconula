<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0002: Headers de segurança no Firebase Hosting

## Status

Aceito

## Contexto

- Review de segurança: `firebase.json` não tinha seção `headers` — a
  resposta de `https://iconula.web.app` trazia só o HSTS automático do
  Firebase, sem `Content-Security-Policy`, `X-Content-Type-Options`,
  `Referrer-Policy`, `X-Frame-Options`/`frame-ancestors` nem
  `Permissions-Policy`.
- Isoladamente, nenhum desses headers corrige uma vulnerabilidade
  explorável hoje neste app minimalista (uma tela, um botão). A
  justificativa não é o risco atual:
  - custo de adicionar é baixo (um bloco de JSON, sem build adicional);
  - a CSP torna sobrevivível um eventual bug de injeção via
    `dangerouslySetInnerHTML` em `TeamButton.jsx` (ver
    [ADR 0002](../adr/0002-bandeiras-emoji-unicode.md)) — sem CSP, a
    primeira falha de sanitização seria a única defesa;
  - headers de segurança costumam ser adicionados só depois que o app
    cresce, quando já é tarde para fazer "de graça".

## Decisão

Adicionar `hosting.headers` ao `firebase.json`:

- `Content-Security-Policy`: `default-src 'self'`, com concessões
  pontuais — `img-src` inclui `https://cdn.jsdelivr.net` (Twemoji, ver
  ADR 0002) e `data:`; `script-src`/`style-src`/`font-src`/`connect-src`
  restritos a `'self'`; `object-src 'none'`, `base-uri 'none'`,
  `form-action 'none'`, `frame-ancestors 'none'`.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: no-referrer`.
- `X-Frame-Options: DENY` (redundante com `frame-ancestors 'none'`,
  mantido para navegadores que não suportam CSP nível 2).
- `Permissions-Policy` desativando APIs não usadas (geolocalização,
  câmera, microfone, pagamento, USB, `interest-cohort`).
- `Cross-Origin-Opener-Policy: same-origin`.

- `Cache-Control`, no mesmo bloco: assets com hash (`/assets/**`) recebem
  `max-age=31536000, immutable`; `/index.html` e `/` recebem `no-cache`,
  para que um deploy fique visível imediatamente aos visitantes — não é
  segurança, é correção de cache que estava faltando, custo zero de
  fazer junto.
- **Correção (source casa antes do rewrite)**: a primeira versão só tinha
  `source: "/index.html"`. O casamento de `headers.source` no Firebase
  Hosting acontece contra o path **pedido**, antes de qualquer `rewrite`
  — `GET /` (a URL que qualquer visitante realmente usa) nunca batia com
  `/index.html` e continuava com o `max-age=3600` default. Corrigido com
  um segundo bloco idêntico, `source: "/"`.
- HSTS não precisou de configuração: o Firebase Hosting já envia
  `Strict-Transport-Security: max-age=31556926; includeSubDomains; preload`
  por padrão.

## Consequências

- **Atualização**: as bandeiras Twemoji foram vendorizadas em
  `src/assets/flags/` (ver [ADR 0002](../adr/0002-bandeiras-emoji-unicode.md)),
  então `img-src` já foi restrita a `'self' data:'` — a CSP está
  completamente fechada, sem dependência de CDN externo.
- Qualquer novo componente que precise de `style` inline ou de
  script/imagem de outra origem vai quebrar sob esta CSP — a correção é
  ajustar o componente (ex.: mover para CSS externo) ou, se realmente
  necessário, abrir a exceção explicitamente no `firebase.json`, nunca
  usar `'unsafe-inline'`/`'unsafe-eval'` como atalho.
- Verificação após deploy:
  `curl -sI https://iconula.web.app` deve trazer os headers acima.
