<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Iconula Button

Single Page Application minimalista com um único botão que exibe o nome
e a bandeira das 48 seleções classificadas para a Copa do Mundo FIFA 2026.
A cada clique, avança em ordem alfabética para o próximo país; ao final,
volta ao primeiro.

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- Bandeiras: emojis Unicode renderizados via [Twemoji](https://github.com/jdecked/twemoji) (consistentes em qualquer SO/navegador)
- Deploy: Firebase Hosting via GitHub Actions

Veja as decisões de arquitetura em [docs/adr](docs/adr) e informações para
desenvolvimento (inclusive orientadas a agentes de IA) em [AGENTS.md](AGENTS.md).

## Desenvolvimento

```bash
npm install
npm run dev
```

## Testes

```bash
npm run test
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

O deploy para produção acontece automaticamente a cada push/merge na
branch `main`, via GitHub Actions + Firebase Hosting. Pull requests
geram um preview deploy temporário, que é um check obrigatório para
poder mesclar o PR.

## Licença

[MIT](LICENSE)

<!-- PR de teste para validar o preview deploy -->
