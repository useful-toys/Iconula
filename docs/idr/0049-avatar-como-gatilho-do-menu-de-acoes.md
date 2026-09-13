<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0049: Avatar do usuário como gatilho do menu de ações

## Status

Aceito — implementação na Fase 0011 (Tarefa 0011-0005).

## Contexto

- Nada na tela principal diz qual conta Google está autenticada; "sair da
  conta" mora no menu de ações
  ([IDR 0024](0024-acoes-raras-em-menu-do-cabecalho.md)).
- O objeto do Firebase Auth já traz `photoURL` e `displayName`; a CSP já
  libera `https://lh3.googleusercontent.com` em `img-src`
  ([DDR 0001](../devops-dr/0001-csp-headers-e-configuracao-de-hosting.md)).
- Um avatar ao lado do botão do menu gastaria mais um alvo de 30×30px na
  linha mais cara da tela ([IDR 0018](0018-usuario-especialista-e-minimalismo.md)).

## Decisão

- **O avatar substitui o botão do menu de ações**: tocar no avatar abre o
  mesmo popup, com os mesmos cinco comandos
- **Forma**: foto circular de 30×30px, no extremo direito da linha de
  controles (onde o botão do menu está hoje), carregada sem enviar
  referrer
- **Sem foto** (`photoURL` ausente ou a imagem falha ao carregar): inicial
  maiúscula do `displayName` em `--gold` sobre `--panel`, com a borda
  `--gold` do botão atual; sem `displayName`, o glifo atual do menu
- **Nome acessível**: o do botão do menu de hoje, acrescido do nome da
  conta; a imagem é decorativa (texto alternativo vazio) — o nome está no
  botão
- Área de toque ampliada e foco visível iguais aos do botão atual
  ([IDR 0042](0042-foco-visivel-e-area-de-toque.md))
- Nenhum outro dado da conta (e-mail etc.) aparece; `photoURL` não vai ao
  Firestore nem ao export JSON

## Consequências

- A identidade da conta fica visível sem alvo novo nem espaço a mais
- O gatilho do menu muda de aparência por conta — o especialista
  reconhece a própria foto
- A CSP não muda

## Alternativas consideradas

- **Avatar separado, só identidade**: ocupa espaço a mais na linha, sem
  função
- **Sem avatar**: a conta autenticada continua invisível na tela principal
- **Avatar no título** (`h1`): mistura identidade com o placar, que é o
  conteúdo do título

## Histórico

- 2026-09-13 — Criado no planejamento revisado das Fases 11–17.
