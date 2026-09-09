<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0024: Ações raras num menu do cabeçalho

## Status

Aceito — preenche a lacuna de interface das ações de compartilhamento e
portabilidade, exigidas por requisitos.md e sem lugar na tela até aqui.

## Contexto

requisitos.md exige quatro saídas para a coleção — texto de faltantes
para o WhatsApp, texto de repetidas, exportar JSON e importar JSON — e
diz que a exportação está "disponível sempre, sem etapas adicionais". A
tela principal especificada em interface.md não tinha porta de entrada
para nenhuma delas: o cabeçalho tem título, a linha de controles tem os
alternadores e o desfazer, e o corpo é o catálogo.

Pôr quatro comandos na linha de controles disputaria o espaço mais caro
da tela, que o [IDR 0018](0018-usuario-especialista-e-minimalismo.md)
reservou ao catálogo — e são ações raras: exporta-se de vez em quando,
importa-se quase nunca, e a lista de troca sai antes da feira.

## Decisão

- Um **botão de ações no cabeçalho** abre um **popup** com cinco
  comandos:
  - copiar lista de **faltantes** para a área de transferência
  - copiar lista de **repetidas** para a área de transferência
  - **exportar** a coleção em JSON
  - **importar** coleção de um arquivo JSON
  - **sair da conta** — volta à tela de login (requisitos.md, Acesso)
- O popup fecha ao escolher um comando, ao tocar fora ou com `Esc`; a
  importação segue pedindo a confirmação explícita exigida por
  requisitos.md
- O popup não tem rolagem própria (cinco itens) — respeita o
  [IDR 0008](0008-uma-unica-pagina-scrollavel.md)

## Consequências

- Os fluxos essenciais — cadastrar e consultar — continuam a um toque;
  as ações raras custam dois, o que é proporcional à frequência
- A linha de controles permanece com os alternadores e o desfazer
- Sair da conta ganha lugar sem gastar espaço no cabeçalho, e fica
  longe do toque acidental durante o cadastro em rajada
- O popup é o lugar natural para a política de privacidade depois de
  autenticado — decisão à parte, ver Pendências de interface
- Copiar para a área de transferência precisa de retorno visível ("lista
  copiada"), que não é evento de persistência — foi um dos motivos de o
  [IDR 0029](0029-avisos-flutuantes-com-tres-severidades.md) trazer de
  volta o aviso de sucesso

## Alternativas consideradas

- **Quatro botões na linha de controles**: um toque para tudo, mas gasta
  a linha mais cara da tela com o que se usa raramente
- **Seção de ações no fim do catálogo**: sem custo no cabeçalho, mas
  exige rolar ~994 figurinhas para exportar
- **Tela separada de ferramentas**: navegação a mais, contra a tela
  única
