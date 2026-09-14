<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0020-0002]: copyright e isenção de responsabilidade nos rodapés

## Status
Pendente

## Objetivo
Acrescentar o copyright de Daniel Felix Ferber e a linha de isenção de
responsabilidade ao rodapé da tela principal e ao da tela de login, na ordem
do IDR 0053. Hoje os dois rodapés só têm o aviso de independência e marcas.

## Documentos de referência
- `docs/idr/0053-termos-de-uso-e-rodape-com-copyright-e-isencao.md` § Decisão
  (itens "Rodapé das duas telas") — textos e ordem
- `docs/idr/0037-politica-no-rodape-depois-de-autenticado.md` § Decisão — link
  da política no rodapé principal
- `docs/requisitos.md` § Privacidade — aviso de independência, copyright e
  isenção
- `src/components/Rodape.jsx`, `src/components/Rodape.css` — rodapé da tela
  principal
- `src/components/TelaDeLogin.jsx`, `src/components/TelaDeLogin.css` — rodapé
  próprio da tela de login, sem filete
- `docs/interface.md` § Tela de login, § Wireframe da tela principal › Página
  inteira, § Medidas (Rodapé)

## Padrões e convenções aplicáveis
- Textos exatos, em PT-BR — IDR 0053
- O rodapé principal rola com o conteúdo e mantém o filete; o da tela de login
  continua sem filete — `docs/interface.md` § Camadas e § Tela de login
- Mesma tipografia do rodapé atual (11px `--muted`) — `docs/interface.md`
  § Medidas

## Escopo e instruções de implementação
1. Rodapé da tela principal (`Rodape.jsx`), uma linha por item:
   `© 2026 Daniel Felix Ferber`; o aviso de independência atual; "Uso por sua
   conta e risco, sem garantias."; o link "Política de privacidade" como hoje.
2. Rodapé da tela de login (`TelaDeLogin.jsx`), mesmas três primeiras linhas,
   sem links.
3. Estilos em `Rodape.css` e `TelaDeLogin.css` para as linhas empilhadas, sem
   mudar fonte, cor nem filete.
4. Testes em `Rodape.test.jsx` e `TelaDeLogin.test.jsx`: presença e ordem das
   três linhas.
5. `docs/interface.md`, citando o IDR 0053:
   - § Tela de login: o rodapé traz copyright, aviso de marcas e isenção, sem
     filete (desenho e texto);
   - § Wireframe da tela principal › Página inteira: o rodapé com as linhas
     novas;
   - § Medidas (Rodapé): linhas empilhadas na ordem do IDR 0053.

**Fora do escopo**: link e vista "Termos de uso" e a frase de aceite do login
(Tarefa 0020-0003).

## Decisões já tomadas (não reabrir)
- Textos e ordem do rodapé nas duas telas — ver
  `docs/idr/0053-termos-de-uso-e-rodape-com-copyright-e-isencao.md`
- Política de privacidade no rodapé principal — ver
  `docs/idr/0037-politica-no-rodape-depois-de-autenticado.md`

## Arquivos impactados
- `src/components/Rodape.jsx`, `src/components/Rodape.css`,
  `src/components/Rodape.test.jsx` — modificar
- `src/components/TelaDeLogin.jsx`, `src/components/TelaDeLogin.css`,
  `src/components/TelaDeLogin.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Tela de login, § Wireframe da tela
  principal › Página inteira, § Medidas)

## Critérios de aceite
- [ ] Rodapé principal com `© 2026 Daniel Felix Ferber`, aviso de marcas,
      "Uso por sua conta e risco, sem garantias." e o link da política, nessa
      ordem (teste)
- [ ] Rodapé do login com as três primeiras linhas, sem link (teste)
- [ ] `docs/interface.md` nas três seções, citando o IDR 0053

## Validação adicional
Roteiro visual em `npm run dev` a 375px: rodapé da tela de login e da tela
principal sem corte nem quebra estranha.
