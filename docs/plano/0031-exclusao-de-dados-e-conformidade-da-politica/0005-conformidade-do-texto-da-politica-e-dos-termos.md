<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0031-0005]: conformidade do texto da política e dos termos

## Status
Concluída

## Objetivo

Completar os dois textos com o que a LGPD exige e o app hoje omite:
controlador, base legal, operador e transferência internacional, prazo
de retenção, portabilidade, armazenamento local e data de vigência.
Nenhuma lógica nova.

## Documentos de referência

- `docs/idr/0061-conteudo-de-conformidade-da-politica-e-dos-termos.md`
  § Decisão — o conteúdo item a item.
- `docs/requisitos.md` § Privacidade — os requisitos que este texto
  cumpre.
- `docs/model-dr/0007-persistencia-no-armazenamento-local.md` — o que
  exatamente vive no `localStorage` e no cache IndexedDB.
- `docs/idr/0055-catalogo-compartilhado-por-link-somente-leitura.md`
  § Decisão › Política de privacidade — o texto do link, que permanece.
- `docs/interface.md` §§ Política de privacidade, Termos de uso — as
  seções que passam a listar o conteúdo novo.

## Padrões e convenções aplicáveis

- Texto visível em PT-BR, direto, sem juridiquês desnecessário — o
  usuário é especialista em figurinhas, não em lei (IDR 0018).
- O contato usa o componente da Tarefa 0031-0004, nunca uma âncora
  `mailto:` literal.
- A política continua sendo vista interna, sem router (TDR 0020).

## Escopo e instruções de implementação

1. Em `src/components/PoliticaDePrivacidade.jsx`, acrescentar ou
   reescrever as seções conforme o IDR 0061: controlador e encarregado;
   base legal por finalidade; operador e transferência internacional
   (distinguindo a coleção em São Paulo da identidade tratada
   globalmente pelo Auth); retenção com os dois prazos; direitos do
   titular apontando o painel de exclusão e a exportação como
   portabilidade; armazenamento local; data de vigência no topo.
2. Corrigir a afirmação de que nenhum outro dado é tratado, que hoje
   ignora o `localStorage` e o cache do SDK.
3. Em `src/components/TermosDeUso.jsx`, acrescentar o mesmo bloco de
   controlador e a mesma data de vigência.
4. Atualizar os testes das duas vistas para cobrir a presença das
   seções novas.
5. Atualizar `docs/interface.md` §§ Política de privacidade e Termos de
   uso com a lista de seções que cada vista passa a ter.

**Fora do escopo**: histórico de versões, prazo de resposta e
identificação do titular (Tarefa 0032-0004, com o registro do aceite);
o painel de apagar (Tarefa 0031-0003); o runbook e o inventário (Tarefa
0031-0006).

## Decisões já tomadas (não reabrir)

- Todo o conteúdo de conformidade, inclusive a recusa de publicar CPF e
  a escolha da base legal — ver
  `docs/idr/0061-conteudo-de-conformidade-da-politica-e-dos-termos.md`.
- A exclusão dentro do app, citada pela seção de direitos — ver
  `docs/idr/0060-apagar-meus-dados-na-politica-em-dois-passos.md`.

## Arquivos impactados

- `src/components/PoliticaDePrivacidade.jsx` — modificar
- `src/components/PoliticaDePrivacidade.test.jsx` — modificar
- `src/components/TermosDeUso.jsx` — modificar
- `src/components/TermosDeUso.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Política de privacidade, § Termos de
  uso)

## Critérios de aceite

- [ ] A política identifica controlador e encarregado, sem CPF nem
      endereço
- [ ] Cada finalidade declarada tem hipótese legal citada
- [ ] O texto distingue a região do Firestore do tratamento global da
      identidade e declara o Google como operador
- [ ] A retenção traz os dois prazos (24 meses de inatividade; 90 dias
      após o encerramento)
- [ ] A exportação JSON aparece como portabilidade (art. 18, V)
- [ ] O armazenamento local está declarado, com a explicação de por que
      não há banner
- [ ] Os dois textos exibem a mesma data de vigência
- [ ] Nenhuma frase afirma que nenhum outro dado é tratado
- [ ] `npm run lint && npm run test && npm run build` verdes

## Validação adicional

- Roteiro visual em `npm run dev`: abrir as duas vistas pelo rodapé e
  conferir que rolam inteiras, sem rolagem própria de componente.
