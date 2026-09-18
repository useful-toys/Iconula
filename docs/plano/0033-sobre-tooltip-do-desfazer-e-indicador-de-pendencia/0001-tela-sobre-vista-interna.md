<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0033-0001]: Tela Sobre, vista interna

## Status
Concluída

## Objetivo
Criar a vista interna "Sobre", com link ao código-fonte no GitHub e a
reportar um problema/sugerir algo (GitHub Issues), acessível pelo rodapé das
duas telas (login e principal) — o quarto (quinto) link de vista interna do
app, no mesmo padrão de Política de privacidade e Termos de uso.

## Documentos de referência
- `docs/idr/0063-tela-sobre-com-link-ao-repositorio-e-issues.md` — conteúdo,
  acesso e posição da tela
- `docs/tdr/0020-privacidade-como-vista-interna.md` — padrão de vista interna
  sem router
- `docs/interface.md` § Demais telas › Política de privacidade e § Termos de
  uso — layout de leitura a reproduzir (largura ~640px, título 22px dourado,
  "← Voltar")
- `src/components/TermosDeUso.jsx` — exemplo mais próximo a seguir (vista
  simples, sem seções de conformidade)
- `src/components/Rodape.jsx` — onde entra o terceiro link

## Padrões e convenções aplicáveis
- Nenhuma regra geral é violada — segue o padrão vigente de vista interna
  (TDR 0020) à risca.

## Escopo e instruções de implementação
1. Criar `src/components/Sobre.jsx` (e `Sobre.css`): mesmo layout de leitura
   de `TermosDeUso.jsx`/`PoliticaDePrivacidade.jsx` — "← Voltar" que chama
   `onVoltar`, título "Sobre" em Poppins 700/22px dourado, corpo ~640px.
   Conteúdo: nome do app e breve descrição (reaproveitar o subtítulo da tela
   de login); link "Código-fonte no GitHub" para
   `https://github.com/useful-toys/Iconula`; link "Reportar um problema ou
   sugerir algo" para as Issues do mesmo repositório
   (`https://github.com/useful-toys/Iconula/issues`). Ambos os links abrem
   numa aba nova (`target="_blank" rel="noopener noreferrer"`, único caso do
   app que sai do domínio).
2. Em `App.jsx`: acrescentar o valor `'sobre'` ao estado `vistaInterna`
   (hoje `null | 'politica' | 'termos'`), com o mesmo bloco de retorno
   antecipado das outras duas vistas — `<Sobre onVoltar={() => setVistaInterna(null)} />`.
3. Em `Rodape.jsx`: terceiro link "Sobre", ao lado de "Política de
   privacidade" e "Termos de uso" (mesmo separador `·`), chamando um novo
   `onAbrirSobre` passado por `App.jsx` como `() => setVistaInterna('sobre')`
   — nas duas telas que usam `Rodape` (login e principal).
4. `docs/interface.md` § Demais telas ganha uma nova subseção "Sobre" no
   mesmo formato de "Política de privacidade"/"Termos de uso", citando o
   IDR 0063; § Tela de login e a descrição do rodapé da tela principal
   passam a citar os três links.

**Fora do escopo**: entrada pelo menu de ações (Tarefa 0033-0002); qualquer
conteúdo de versão/build (descartado no IDR 0063).

## Decisões já tomadas (não reabrir)
- Conteúdo, acesso duplo (rodapé + menu) e posição no menu — ver
  `docs/idr/0063-tela-sobre-com-link-ao-repositorio-e-issues.md`
- Padrão de vista interna sem router — ver
  `docs/tdr/0020-privacidade-como-vista-interna.md`

## Arquivos impactados
- `src/components/Sobre.jsx` — criar
- `src/components/Sobre.css` — criar
- `src/components/Sobre.test.jsx` — criar
- `src/components/Rodape.jsx` — modificar (terceiro link)
- `src/components/Rodape.css` — modificar, se o terceiro link exigir
- `src/components/Rodape.test.jsx` — modificar
- `src/App.jsx` — modificar (`vistaInterna`, `onAbrirSobre` nas duas telas)
- `src/App.test.jsx` — modificar, se cobrir o rodapé
- `docs/interface.md` — modificar (§ Demais telas › nova subseção Sobre;
  § Tela de login e o rodapé da tela principal citando o terceiro link)
- `docs/idr/0063-tela-sobre-com-link-ao-repositorio-e-issues.md` — modificar
  (nada a mudar na decisão; só referência, se necessário)

## Critérios de aceite
- [ ] `Sobre.jsx` renderiza título, descrição, os dois links (com
      `href` exatos) e "← Voltar" funcional — coberto por
      `Sobre.test.jsx`
- [ ] O rodapé das duas telas (login e principal) mostra o link "Sobre" e
      abre a vista ao clicar — coberto por teste
- [ ] `vistaInterna === 'sobre'` substitui a tela por inteiro, como
      `'politica'`/`'termos'` — coberto por teste
- [ ] `docs/interface.md` descreve a tela Sobre, citando o IDR 0063

## Validação adicional
- Roteiro visual em `npm run dev`: abrir "Sobre" pelo rodapé da tela de
  login e pelo rodapé da tela principal; conferir os dois links e o botão
  "← Voltar".
