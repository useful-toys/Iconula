<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# ADR 0001: Aplicação Single Page Application (SPA)

## Status

Aceito.

## Contexto

- O projeto precisa de uma interface web para colecionadores do álbum de figurinhas da Copa do Mundo FIFA 2026.
- A aplicação deve ser responsiva, funcionando em celulares, tablets e navegadores desktop.
- Precisa integrar com serviços de autenticação e persistência de dados.
- O desenvolvimento deve ser ágil, com iterações rápidas e deploy frequente.

## Decisão

Construir a aplicação como uma **Single Page Application (SPA)** — uma única página HTML que carrega JavaScript e CSS, e toda a navegação e renderização acontece no cliente, sem recarregar a página.

## Consequências

- **Build gera arquivos estáticos**: HTML, CSS e JavaScript em `dist/`, compatíveis com qualquer hosting de arquivos estáticos.
- **Sem backend próprio**: toda a lógica de negócio roda no navegador; serviços externos (auth, banco de dados) são acessados via APIs.
- **Primeira carga pode ser mais lenta**: precisa baixar todo o JavaScript antes de renderizar; mitigado por code splitting e lazy loading.
- **Navegação fluida**: sem recarregamentos de página, transições instantâneas entre telas.
- **Estado no cliente**: a aplicação precisa gerenciar estado local (sessão, dados do usuário, preferências) e sincronizar com serviços externos quando necessário.

## Alternativas consideradas

- **Multi-page application (MPA)**: cada tela seria uma página HTML separada, com navegação tradicional. Descartado porque exigiria backend próprio para renderizar HTML, complicaria a integração com serviços externos e tornaria a navegação menos fluida.
- **Server-side rendering (SSR)**: Next.js, Nuxt, etc. Descartado porque adicionaria complexidade de infraestrutura (servidor Node.js) sem benefício claro para este caso de uso — o conteúdo é dinâmico e personalizado por usuário, não há SEO crítico.
- **Static site generation (SSG)**: Gatsby, Astro, etc. Descartado pelo mesmo motivo — o conteúdo é dinâmico e personalizado, não há conteúdo estático que justifique SSG.
