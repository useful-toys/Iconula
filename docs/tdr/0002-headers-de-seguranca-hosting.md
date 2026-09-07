<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0002: Headers de segurança no Firebase Hosting

## Status

Aceito

## Contexto

Um review de segurança apontou que `firebase.json` não tinha seção
`headers`: a resposta de `https://iconula.web.app` trazia apenas o HSTS
automático do Firebase, sem `Content-Security-Policy`,
`X-Content-Type-Options`, `Referrer-Policy`,
`X-Frame-Options`/`frame-ancestors` nem `Permissions-Policy`.

Isoladamente nenhum desses headers corrige uma vulnerabilidade explorável
hoje neste app minimalista (uma única tela, um único botão). A
justificativa não é o risco atual, e sim:

- o custo de adicionar é baixo (um bloco de JSON, sem build adicional);
- a CSP é o que torna sobrevivível um eventual bug de injeção via
  `dangerouslySetInnerHTML` em `TeamButton.jsx` (ver
  [ADR 0002](../adr/0002-bandeiras-emoji-unicode.md)) — sem CSP, a
  primeira falha de sanitização seria a única linha de defesa;
- headers de segurança costumam ser adicionados só depois que o app
  cresce, quando já é tarde para fazer isso "de graça".

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

Aproveitado o mesmo bloco para corrigir `Cache-Control`: assets com hash
(`/assets/**`) recebem `max-age=31536000, immutable`; `/index.html`
recebe `no-cache`, para que um deploy fique visível imediatamente aos
visitantes (isso não é segurança, é correção de cache — estava faltando
e o custo de fazer junto era zero).

Não foi necessário configurar HSTS: o Firebase Hosting já envia
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
