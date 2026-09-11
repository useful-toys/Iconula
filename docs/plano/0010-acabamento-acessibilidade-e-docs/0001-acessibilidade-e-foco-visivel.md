<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0010-0001]: acessibilidade e foco visível

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/requisitos.md` § Requisitos Não Funcionais — operável por teclado, contraste adequado, semântica legível; a cor nunca é o único sinal; nomes acessíveis escrevem por extenso a notação compacta
- `docs/idr/0018-usuario-especialista-e-minimalismo.md` § Decisão e § Consequências — "minimalismo visual não é minimalismo de acessibilidade"
- `docs/interface.md` § Pendências de interface — estados de foco, hover e pressionado; área de toque ampliada nos alvos de 30×30px
- `docs/idr/0006-estados-visuais-e-interacao-da-figurinha.md` § Consequências — o reforço não-cromático e o pior caso de daltonismo verde/laranja
- `docs/interface.md` § Paleta (tokens CSS, OKLCH) — as cores disponíveis para o realce de foco
- `docs/idr/0022-tema-escuro-unico-paleta-do-prototipo.md` § Consequências — a regra de que cor nunca é o único sinal permanece

## Objetivo
Fechar as duas pendências de acessibilidade que atravessaram todas as fases: o
realce de foco visível, indispensável para navegação por teclado, e a área de
toque dos alvos pequenos. E conferir, num varrimento único, que a promessa de
nomes acessíveis por extenso vale em toda a interface.

## Padrões e convenções aplicáveis
- A cor **nunca** é o único sinal de estado — `docs/requisitos.md` § Requisitos
  Não Funcionais e `docs/idr/0006-*`
- Todo nome acessível escreve por extenso o que a notação compacta abrevia —
  `docs/idr/0018-*` § Decisão
- O app é operável por teclado de ponta a ponta, incluindo cartões, colapsos,
  faixa de salto e menu — `docs/requisitos.md` § Requisitos Não Funcionais
- O realce de foco usa os tokens existentes; nada de cor nova fora da paleta —
  `docs/idr/0022-*`
- Ampliar área de toque **sem** mudar o desenho nem as medidas de
  `docs/interface.md` § Medidas
- Nenhuma solução de acessibilidade pode introduzir rolagem própria —
  `docs/idr/0008-*`

## Escopo e instruções de implementação
1. **Pendência de interface: estados de foco, hover e pressionado** — definir um
   realce de foco visível e consistente, em `--gold`, para todo elemento
   focável, e o retorno imediato de toque no cartão, que hoje só se manifesta
   pela mudança de cor do estado. Registrar como **IDR**.
2. **Pendência de interface: área de toque dos alvos pequenos** — ampliar a
   área acionável de desfazer, menu de ações, ícones da faixa de bandeiras
   (30×30px) e do controle de menos do cartão (18px na lista, 16px no álbum —
   IDR 0032) em tela sensível, mantendo o desenho. Registrar no mesmo IDR ou em
   outro.
3. Varrimento de nomes acessíveis: placar, cabeçalho de seção, cabeçalho de
   super-grupo, cartão, alternadores, faixa de salto, desfazer e itens do menu —
   todos escrevendo os números e os glifos por extenso.
4. Varrimento de teclado: percorrer o app inteiro só com o teclado — entrar,
   atestar, navegar, ajustar contagens, colapsar, saltar, abrir o menu, sair — e
   corrigir o que não for alcançável ou não expuser estado.
5. Conferir contraste dos pares críticos: `--green-card` e `--orange-card` sobre
   `--turf`, `--ink-on-light` sobre os cartões coloridos, `--muted` sobre
   `--panel`, e as faixas de aviso. Registrar as medições no log; se algum par
   reprovar, implemente o valor especificado e sinalize — mudar a paleta é
   decisão do IDR 0022.
6. Conferir o reforço não-cromático de ponta a ponta, inclusive na disposição
   álbum e com o filtro ativo.

**Fora do escopo**: mudar a paleta; mudar as medidas; acrescentar rótulos
explicativos na tela, que o IDR 0018 proíbe — a acessibilidade vive no nome
acessível, não em texto visível novo.

## Decisões já tomadas (não reabrir)
- Minimalismo visual não afrouxa acessibilidade — ver `docs/idr/0018-usuario-especialista-e-minimalismo.md`
- Faltante é cartão esvaziado e colada é preenchido — ver `docs/idr/0006-estados-visuais-e-interacao-da-figurinha.md`
- Tema escuro único, sem tema claro para leitura sob sol — ver `docs/idr/0022-tema-escuro-unico-paleta-do-prototipo.md`
- A bandeira é decorativa e o nome da seção vai em texto — ver `docs/requisitos.md` § Requisitos Não Funcionais

## Decisões em aberto nesta tarefa
- Realce de foco, hover e pressionado — encaminhamento no passo 1; nasce um **IDR**
- Área de toque ampliada nos alvos de 30×30px — encaminhamento no passo 2; nasce
  um **IDR** (pode ser o mesmo)

## Impedimentos
1. Ambiguidade menor, reversível, interna ao código: decida, implemente e
   **registre um TDR ou IDR** conforme o AGENTS.md.
2. Ambiguidade que muda o comportamento visível ao usuário: implemente sob a
   premissa mais conservadora, deixe-a explícita no log e sinalize ao humano.
3. **PARE e pergunte** quando: contradiz `docs/requisitos.md`; exige mudança de
   configuração pública (provedor de login, authorized domains, DNS, branch
   protection, secrets); tem custo em cota/plano; ou é irreversível.
   Ao parar, formule uma pergunta objetiva e apresente 2–3 alternativas com
   prós e contras.
   **Caso concreto previsto aqui**: se o contraste exigir mudar um token da
   paleta, isso contraria o IDR 0022 — sinalize em vez de mudar por conta.

## Arquivos impactados
- `src/theme.css` — modificar
- `src/components/*.jsx` — modificar (os que tiverem nome acessível incompleto)
- `src/components/*.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Pendências de interface encolhe)
- `docs/idr/00NN-foco-visivel-e-area-de-toque.md` — criar (próximo número livre)

## Critérios de aceite
- [ ] Todo elemento focável tem realce de foco visível, consistente e dentro da paleta
- [ ] O cartão dá retorno imediato ao toque, além da mudança de cor do estado
- [ ] Desfazer, menu, ícones da faixa e o controle de menos do cartão têm área
      de toque ampliada sem mudar o desenho
- [ ] O app inteiro é percorrível e operável só por teclado
- [ ] Todo nome acessível escreve por extenso a notação compacta
- [ ] Os três estados do cartão são distinguíveis em escala de cinza
- [ ] As medições de contraste dos pares críticos estão no log
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0010-acabamento-acessibilidade-e-docs/logs/0001-log-acessibilidade-e-foco-visivel.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: percorrer o app inteiro com Tab e Enter, sem
mouse, do login à saída; aplicar um filtro de escala de cinza no navegador e
conferir que os estados continuam legíveis.
