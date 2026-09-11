<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0037: A política de privacidade reaparece no rodapé, não no menu de ações

## Status

Aceito — fecha a pendência "Política de privacidade depois de autenticado"
de `requisitos.md` § Decisões Pendentes e `interface.md` § Pendências de
interface, na Tarefa 0008-0004.

## Contexto

`requisitos.md` exige a política acessível **antes** de autenticar (a tela
de login já a linka desde a Tarefa 0008-0002) e deixa em aberto se e onde
ela reaparece depois — o usuário já viu o link uma vez, mas pode querer
revisitá-la mais tarde. O [IDR 0024](0024-acoes-raras-em-menu-do-cabecalho.md)
já apontava o popup de ações como "o lugar natural", mas deixou a decisão à
parte.

## Decisão

- A política reaparece no **rodapé da tela principal** (`Rodape.jsx`), ao
  lado do aviso de independência e marcas — não no menu de ações do
  cabeçalho (IDR 0024).
- Motivo: o rodapé já existe nas duas telas (o de `TelaDeLogin.jsx` desde a
  Tarefa 0008-0002, este agora na tela principal) e é exatamente onde o
  link já vive na tela de login — reaproveitar o mesmo lugar, não inventar
  um segundo. O menu de ações (IDR 0024) foi reservado a cinco comandos
  raros e ativos (copiar listas, exportar, importar, sair); a política é
  consulta passiva, sem ação sobre a coleção — não compete por aquele
  espaço, que o IDR 0018 já mantém enxuto.

## Consequências

- O menu de ações continua com cinco itens, sem crescer para seis.
- A política fica **fora do fluxo de rolagem principal** só no sentido de
  exigir rolar até o fim da página — mesmo custo de qualquer rodapé
  (`interface.md` § Camadas: "o rodapé não flutua, rola com o conteúdo").
  Aceito: é consulta rara, não um fluxo essencial (`requisitos.md` § UX).
- Duas portas de entrada (login e rodapé principal) convergem para a mesma
  vista (`PoliticaDePrivacidade.jsx`, TDR 0020) — nenhum conteúdo
  duplicado.

## Alternativas consideradas

- **Sexto comando no menu de ações (IDR 0024)**: cogitado pelo próprio
  IDR 0024 como alternativa se o rodapé não fosse escolhido, mas
  misturaria uma consulta passiva com comandos que alteram a coleção ou a
  sessão — pior agrupamento semântico, sem ganho de alcance (o rodapé já é
  alcançável, só exige rolar).
- **Nenhum acesso pós-login**: o link estaria acessível só antes de
  autenticar. Rejeitado — força logout para reconsultar a política, atrito
  desproporcional para uma consulta que devia ser trivial.
