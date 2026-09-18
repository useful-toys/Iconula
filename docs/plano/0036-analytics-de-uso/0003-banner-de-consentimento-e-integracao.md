<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa 0036-0003: Banner de consentimento e integração

## Status
Concluída

## Objetivo
Criar o componente `BannerDeConsentimento.jsx` e montá-lo nas telas de login e
principal, para que o analytics só entre depois do consentimento. "Aceitar"
grava e carrega o gtag; "Recusar" grava e mantém o app sem analytics.

## Documentos de referência
- `docs/idr/0071-banner-de-consentimento-para-analytics.md` § Decisão — banner, gate rígido, comportamento em recusar.
- `docs/model-dr/0007-persistencia-no-armazenamento-local.md` § localStorage — consentimento de analytics.
- `src/lib/analytics.js` — (gerado pela Tarefa 0036-0002) funções de consentimento e carregamento.
- `src/components/Avisos.jsx` e `src/theme.css` — convenções visuais do app (tokens, tipografia).
- `src/App.jsx` e `src/components/TelaDeLogin.jsx` — onde o banner é montado.

## Padrões e convenções aplicáveis
- Componentes em `src/components/` com CSS co-localizado — `docs/adr/0007-estrutura-de-pastas-e-separacao-de-responsabilidades.md`, `docs/adr/0008-css-modular-por-componente.md`.
- Texto visível em PT-BR; nome acessível por extenso; cor nunca é o único sinal — `docs/requisitos.md` § Requisitos Não Funcionais.
- Sem scroll próprio no componente — `docs/idr/0008-uma-unica-pagina-scrollavel.md`.
- Teste co-localizado ao lado do componente — `docs/adr/0009-testes-co-localizados.md`.

## Escopo e instruções de implementação
1. Criar `src/components/BannerDeConsentimento.jsx` (+ `BannerDeConsentimento.css`):
   - Só renderiza enquanto `consentimentoAnalytics()` é `'nao-decidido'` (lido do módulo da Tarefa 0036-0002).
   - Texto curto explicando que o app usa analytics para entender o uso, com link para a política de privacidade.
   - Botões "Aceitar" e "Recusar": "Aceitar" grava `'aceito'` e chama `carregarAnalytics()`; "Recusar" grava `'recusado'` e nada mais. Ambos fazem o banner sumir.
2. Montar o banner em `App.jsx` de forma independente do estado de sessão, cobrindo a tela de login e a principal (aparece antes do conteúdo, sem travar nada).
3. Criar `src/components/BannerDeConsentimento.test.jsx`: banner visível com consentimento não decidido; some após "Aceitar" e chama o carregador; some após "Recusar" sem chamar o carregador; não renderiza quando já decidido.

**Fora do escopo**: a lógica de carregamento do gtag (Tarefa 0036-0002); a política de privacidade e o inventário (Tarefa 0036-0004); `interface.md` (Tarefa 0036-0005).

## Decisões já tomadas (não reabrir)
- Banner com gate rígido, nas duas telas, escolha lembrada — `docs/idr/0071-banner-de-consentimento-para-analytics.md`.
- Chave e valores do consentimento — `docs/model-dr/0007-persistencia-no-armazenamento-local.md`.

## Decisões em aberto nesta tarefa
- Posição exata e tokens visuais do banner — nível 2 (premissa conservadora): faixa discreta fixa junto à borda inferior, reusando tokens do tema; registrar a escolha no log.

## Arquivos impactados
- `src/components/BannerDeConsentimento.jsx` — criar
- `src/components/BannerDeConsentimento.css` — criar
- `src/components/BannerDeConsentimento.test.jsx` — criar
- `src/App.jsx` — modificar (montar o banner)

## Critérios de aceite
- [ ] O banner aparece na tela de login e na principal com consentimento não decidido.
- [ ] "Aceitar" grava `'aceito'` e dispara o carregamento do gtag.
- [ ] "Recusar" grava `'recusado'` e não carrega o gtag; o app segue funcional.
- [ ] Consentimento já decidido não exibe o banner.
- [ ] Testes cobrem os quatro casos e passam em `npm run test`.

## Validação adicional
- Roteiro visual em `npm run dev`: abrir sem consentimento → banner visível nas duas telas; aceitar → banner some; recarregar → não reaparece.
