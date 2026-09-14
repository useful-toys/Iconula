<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0020-0003]: vista de termos de uso e aceite na tela de login

## Status
Pendente

## Objetivo
Criar a vista interna "Termos de uso", alcançável da tela de login e do
rodapé da tela principal, e fazer a frase da tela de login declarar a
concordância com os termos. Hoje não existe texto nem tela de termos.

## Documentos de referência
- `docs/idr/0053-termos-de-uso-e-rodape-com-copyright-e-isencao.md` § Decisão
  — vista, links, frase de aceite e roteiro do conteúdo
- `docs/tdr/0020-privacidade-como-vista-interna.md` § Decisão — estado único
  `vistaInterna`, checado antes dos outros ramos
- `docs/idr/0036-atestacao-passo-explicito-e-falha-de-gravacao.md` § Decisão —
  atestação e `atestadoEm` não mudam
- `docs/requisitos.md` § Acesso (Nota) e § Privacidade — termos de uso
- `src/App.jsx` — `mostrarPolitica` e os ramos de retorno
- `src/components/PoliticaDePrivacidade.jsx`,
  `src/components/PoliticaDePrivacidade.css`,
  `src/components/PoliticaDePrivacidade.test.jsx` — molde da vista e o canal
  de contato
- `src/components/TelaDeLogin.jsx`, `src/components/Rodape.jsx` — links
- `src/App.politica.test.jsx` — padrão dos testes de integração da vista
- `docs/interface.md` § Tela de login, § Demais telas › Política de
  privacidade

## Padrões e convenções aplicáveis
- Sem router; uma vista por vez — TDR 0020
- O conteúdo segue só o roteiro do IDR 0053, sem cláusula nova; contato pelo
  mesmo canal da política — IDR 0053
- Layout de leitura igual ao da política (largura máxima ~640px,
  `--page-gutter`, títulos e corpo) — `docs/interface.md` § Demais telas ›
  Política de privacidade
- Links como botões de texto em `--gold`, operáveis por teclado —
  `docs/interface.md` § Medidas (Links), IDR 0042
- Arquivo novo com o cabeçalho de copyright — `AGENTS.md` § Convenções

## Escopo e instruções de implementação
1. `App.jsx`: `mostrarPolitica` vira `vistaInterna` (`null | 'politica' |
   'termos'`), checado antes dos demais ramos; `TelaDeLogin` e `Rodape`
   recebem `onAbrirTermos` além de `onAbrirPolitica`.
2. Componente novo `TermosDeUso.jsx` (com CSS e teste), no molde de
   `PoliticaDePrivacidade`: "← Voltar" no topo, título "Termos de uso" e
   seções na ordem do roteiro do IDR 0053 — aceite; o que é o serviço;
   uso no estado em que se encontra, sem garantia de disponibilidade nem
   contra perda de dados, com o exportar como proteção; responsabilidade pela
   conta Google; limitação de responsabilidade; marcas; alterações dos
   termos; lei brasileira; contato (o mesmo endereço da política).
3. `TelaDeLogin.jsx`: frase "Ao continuar, você confirma ter 12 anos ou mais,
   ou estar autorizado pelos responsáveis, e concorda com os Termos de uso.",
   com "Termos de uso" acionando a vista; no cartão, "Política de privacidade
   · Termos de uso" na mesma linha.
4. `Rodape.jsx`: a última linha passa a "Política de privacidade · Termos de
   uso".
5. Testes: `TermosDeUso.test.jsx` (títulos das seções do roteiro, contato,
   voltar); `App.termos.test.jsx` (abre da tela de login e do rodapé
   principal, volta à tela de origem; abrir termos com a política aberta não
   é possível); ajustes em `App.politica.test.jsx`, `TelaDeLogin.test.jsx` e
   `Rodape.test.jsx`.
6. `docs/interface.md`, citando o IDR 0053 e o TDR 0020:
   - § Tela de login: desenho e textos exatos com a frase de aceite e os dois
     links;
   - § Demais telas: nova subseção "Termos de uso" (vista interna, duas portas
     de entrada, layout da política, conteúdo pelo roteiro);
   - § Demais telas › Política de privacidade: a vista convive com a de
     termos, uma por vez.
7. `AGENTS.md` § Onde fica cada coisa: linha de `TermosDeUso.jsx`; as de
   `App.jsx`, `TelaDeLogin.jsx` e `Rodape.jsx` citando os termos; o novo
   arquivo de teste de `App`.

**Fora do escopo**: copyright e isenção nos rodapés (Tarefa 0020-0002);
aceite no passo de atestação; URL própria para os termos.

## Decisões já tomadas (não reabrir)
- Vista de termos, links nas duas telas, frase de aceite e roteiro — ver
  `docs/idr/0053-termos-de-uso-e-rodape-com-copyright-e-isencao.md`
- Vistas internas sem router, estado único `vistaInterna` — ver
  `docs/tdr/0020-privacidade-como-vista-interna.md`
- Atestação como passo explícito, sem mudança — ver
  `docs/idr/0036-atestacao-passo-explicito-e-falha-de-gravacao.md`

## Decisões em aberto nesta tarefa
- Redação de cada seção dos termos dentro do roteiro (nível 2) — premissa
  conservadora: frases curtas, sem prometer nada além do que o app faz;
  registrar no log e sinalizar no relatório para a revisão do humano.

## Impedimentos específicos
- O texto dos termos é aprovado pelo humano no PR da fase, antes do merge:
  a verificação fica `pendente` no relatório, com o caminho do componente.

## Arquivos impactados
- `src/components/TermosDeUso.jsx`, `src/components/TermosDeUso.css`,
  `src/components/TermosDeUso.test.jsx` — criar
- `src/App.jsx`, `src/App.politica.test.jsx` — modificar
- `src/App.termos.test.jsx` — criar
- `src/components/TelaDeLogin.jsx`, `src/components/TelaDeLogin.css`,
  `src/components/TelaDeLogin.test.jsx` — modificar
- `src/components/Rodape.jsx`, `src/components/Rodape.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Tela de login, § Demais telas)
- `AGENTS.md` — modificar (§ Onde fica cada coisa)

## Critérios de aceite
- [ ] `vistaInterna` substitui `mostrarPolitica` em `App.jsx` (busca sem
      `mostrarPolitica`)
- [ ] Termos abrem da tela de login e do rodapé principal e "← Voltar"
      devolve à tela de origem (teste)
- [ ] `TermosDeUso` tem as seções do roteiro, na ordem, e o contato da
      política (teste)
- [ ] Frase de aceite exata na tela de login, com o link (teste)
- [ ] Rodapé principal com "Política de privacidade · Termos de uso" (teste)
- [ ] `docs/interface.md` e `AGENTS.md` atualizados, citando IDR 0053 e
      TDR 0020

## Validação adicional
Roteiro visual em `npm run dev` a 375px e 1440px: abrir os termos do login e
do rodapé; voltar; conferir a leitura. Texto dos termos listado como
verificação pendente para o humano no PR.
