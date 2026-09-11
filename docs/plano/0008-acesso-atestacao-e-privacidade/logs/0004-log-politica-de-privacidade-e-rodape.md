<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0008-0004: política de privacidade e rodapé de marcas

## Data
2026-09-11

## Resumo
Publicada a política de privacidade exigida pela LGPD (`requisitos.md` §
Privacidade), acessível antes e depois de autenticar, e fechado o rodapé de
marcas nas duas telas.

- `src/components/PoliticaDePrivacidade.jsx` (novo): vista de leitura —
  corpo de ~640px centrado, título dourado Poppins 700/22px, seções com
  texto em `--muted` — cobrindo dados tratados (identidade Google e a
  coleção), finalidade, onde os dados ficam (Cloud Firestore,
  `southamerica-east1`), retenção, direitos do titular e dados de menores
  (ligado à atestação da Tarefa 0008-0003), todos exercidos pelo canal de
  contato declarado no texto. Um botão "← Voltar" no topo chama `onVoltar`.
- `src/components/Rodape.jsx` (novo): o rodapé da tela principal — aviso de
  independência e marcas (texto exato de `requisitos.md` § Privacidade,
  11px `--muted`) e o link "Política de privacidade", com filete superior
  (`border-top`). `TelaDeLogin.jsx` manteve o seu próprio rodapé, já
  existente desde a Tarefa 0008-0002 (sem filete) — não foi tocado, para não
  duplicar trabalho fora do escopo desta tarefa.
- `src/App.jsx`: novo estado `mostrarPolitica`, checado **antes** de
  qualquer outro ramo de retorno (guarda de login, tela de login,
  atestação, tela principal) — fechar a política (`onVoltar`) só desliga o
  estado e deixa os ramos existentes decidirem a tela certa, sem guardar
  "de onde vim" à parte. `TelaDeLogin` (link do rodapé próprio) e `Rodape`
  (tela principal) recebem `onAbrirPolitica={() => setMostrarPolitica(true)}`.

## Decisões tomadas
- **TDR 0020 — Política de privacidade como vista interna, não rota**
  (`docs/tdr/0020-privacidade-como-vista-interna.md`): fecha o ponto em
  aberto de `arquitetura.md`. Vista interna por estado, no mesmo padrão dos
  ramos já existentes em `App.jsx`; nenhum router introduzido. O mecanismo
  de "voltar" reaproveita o próprio estado de autenticação/carga em vez de
  guardar a tela de origem à parte.
- **IDR 0037 — A política reaparece no rodapé, não no menu de ações**
  (`docs/idr/0037-politica-no-rodape-depois-de-autenticado.md`): fecha a
  pendência de `requisitos.md` e `interface.md`. O rodapé já existe nas
  duas telas e é onde o link já vivia na tela de login; o menu de ações
  (IDR 0024) fica reservado a comandos ativos sobre a coleção/sessão, não a
  uma consulta passiva.
- O canal de contato da política é dado público — perguntado ao usuário
  antes de escrever qualquer texto (Impedimento nível 3 previsto na própria
  tarefa). Resposta: `dff4321@gmail.com`.

## Impedimentos
Nível 3 tratado como previsto: parei e perguntei o endereço de contato
antes de escrever o conteúdo (ver acima). Nenhum outro impedimento.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: sem erros.
- `vitest run`: 28 arquivos de teste, 245 testes, todos passando — inclui
  `PoliticaDePrivacidade.test.jsx` (2 casos), `Rodape.test.jsx` (2 casos) e
  o novo `App.politica.test.jsx` (2 casos de integração: alcançável da tela
  de login e do rodapé principal, com volta confirmada nos dois casos —
  consequência direta do item 6 do Escopo, não listado nos arquivos
  impactados).
- `vite build`: build de produção concluído com sucesso (CSS de 11,33 kB
  para 12,34 kB; aviso pré-existente sobre chunk grande, não relacionado a
  esta tarefa).

Verificação visual em `npm run dev`, via Browser pane: da tela de login,
"Política de privacidade" abre a vista com o conteúdo completo; "← Voltar"
devolve exatamente à tela de login (confirmado por `get_page_text`, com o
botão "Entrar com Google" de volta). O caminho a partir do rodapé da tela
principal (logado) é o mesmo mecanismo, coberto pelo teste de integração
acima — não repetido manualmente por exigir login real.

## Arquivos alterados
- `src/components/PoliticaDePrivacidade.jsx` — criado
- `src/components/PoliticaDePrivacidade.css` — criado
- `src/components/PoliticaDePrivacidade.test.jsx` — criado
- `src/components/Rodape.jsx` — criado
- `src/components/Rodape.css` — criado
- `src/components/Rodape.test.jsx` — criado (não listado nos arquivos impactados, consequência direta e necessária)
- `src/App.jsx` — estado `mostrarPolitica`, novo ramo de retorno, `Rodape` na tela principal, `onAbrirPolitica` em `TelaDeLogin`
- `src/App.politica.test.jsx` — criado (consequência direta do item 6 do Escopo, não listado nos arquivos impactados)
- `docs/tdr/0020-privacidade-como-vista-interna.md` — novo TDR
- `docs/idr/0037-politica-no-rodape-depois-de-autenticado.md` — novo IDR
- `docs/interface.md` — § Demais telas passa a descrever a política
- `docs/plano/0008-acesso-atestacao-e-privacidade/0004-politica-de-privacidade-e-rodape.md` — status e critérios atualizados
- `docs/plano/README.md` — status da tarefa 0008-0004 atualizado
- `docs/plano/0008-acesso-atestacao-e-privacidade/logs/0004-log-politica-de-privacidade-e-rodape.md` — este log
