<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0063: Tela Sobre, com link ao repositório e a issues

## Status

Aceito.

## Contexto

- Pedido do esmiuçamento: uma tela que referencie o GitHub do projeto —
  transparência de que é código aberto e um canal para reportar
  problemas ou sugerir melhorias, hoje inexistente (nenhuma tela cita o
  GitHub).
- O produto já tem o padrão de vista interna sem router para telas de
  texto ([TDR 0020](../tdr/0020-privacidade-como-vista-interna.md)):
  Política de privacidade e Termos de uso, cada uma com "← Voltar" e
  acessível pelo rodapé.
- O rodapé (`Rodape.jsx`) já tem dois links (política, termos); o menu
  de ações do cabeçalho tem dois blocos — exportar/importar e, isolado,
  sair da conta ([IDR 0024](0024-acoes-raras-em-menu-do-cabecalho.md)).
- Repositório real: `github.com/useful-toys/Iconula`.

## Decisão

- Nova vista interna "Sobre", no mesmo padrão de Política/Termos
  (TDR 0020): título dourado, "← Voltar", layout de leitura de largura
  máxima ~640px.
- Conteúdo: nome do app, breve descrição, link "Código-fonte no GitHub"
  (`github.com/useful-toys/Iconula`) e link "Reportar um problema ou
  sugerir algo" (GitHub Issues do mesmo repositório). Copyright e
  isenção não se repetem — já vivem no rodapé.
- **Acesso duplo**:
  - Rodapé da tela principal e da tela de login, como terceiro link,
    junto de "Política de privacidade" e "Termos de uso".
  - Menu de ações do cabeçalho, em **bloco próprio**, entre o bloco de
    exportar/importar e o item isolado "Sair da conta" — não se mistura
    com a dupla de portabilidade nem com o item vermelho de sair.
- Convive com Política e Termos como uma vista interna a mais: o estado
  único de vista interna (TDR 0020) impede duas abertas ao mesmo tempo.

## Consequências

- Quarta (quinta, contando a compartilhada) vista interna sem router do
  app — mesmo padrão, sem componente novo de navegação.
- Menu de ações passa a ter três blocos separados por filete: portabilidade,
  Sobre, sair da conta.
- `docs/requisitos.md` § Acesso ganha o bullet "Exibir informações sobre
  o app".
- Implementação: Fase 0033, Tarefas 0033-0001 (vista) e 0033-0002 (menu de ações).

## Alternativas consideradas

- **Só um link no rodapé, sem tela própria**: mais simples, mas perde o
  canal de "reportar um problema", que é o valor prático de referenciar
  o GitHub além da transparência.
- **Sem o link de issues, só o repositório**: atende ao pedido ao pé da
  letra, mas descarta o canal de contato técnico direto — a ideia
  entrou no pedido por decisão do humano no esmiuçamento.
- **Versão do build na tela**: útil para diagnosticar bugs relatados,
  mas exige expor essa informação no build; descartada por ora, sem
  necessidade concreta ainda.
- **Só no rodapé, sem entrada pelo menu de ações**: menos redundante,
  mas o humano preferiu as duas portas de entrada.
