<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Iconula Button

Single Page Application minimalista com um único botão que exibe o nome
e a bandeira das 48 seleções classificadas para a Copa do Mundo FIFA 2026.
A cada clique, avança em ordem alfabética para o próximo país; ao final,
volta ao primeiro.

Quem entra com a conta Google tem a bandeira visível guardada e
restaurada no próximo login — de qualquer dispositivo. Sem login, o app
funciona igual, só não lembra onde você parou.

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- Bandeiras: emojis Unicode renderizados via [Twemoji](https://github.com/jdecked/twemoji) (consistentes em qualquer SO/navegador)
- Login: Firebase Auth (Google)
- Persistência: Cloud Firestore
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

As regras de segurança do Firestore têm suíte própria, rodando contra o
emulador (precisa de JDK 21+):

```bash
npm run test:rules
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
poder mesclar o PR. Detalhes de como isso foi configurado (e como
reproduzir) em [docs/firebase.md](docs/firebase.md), [docs/gcloud.md](docs/gcloud.md)
e [docs/github.md](docs/github.md).

## Licença

[MIT](LICENSE)
