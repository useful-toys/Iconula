<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0062: Reaceite dos textos reusa a tela de atestação

## Status

Aceito — implementação na Fase 0032, Tarefa 0032-0003.

## Contexto

- Os textos passam a ter versão gravada por titular
  ([MDR 0009](../model-dr/0009-campos-de-aceite-dos-textos.md)); sem um
  momento de reaceite, a versão gravada congela na primeira e deixa de
  provar qualquer coisa.
- Os Termos já dizem que continuar usando após uma mudança significa
  concordar — o que basta como cláusula, mas não produz registro.
- A tela de atestação ([IDR 0036](0036-atestacao-passo-explicito-e-falha-de-gravacao.md))
  já é exatamente isto: um passo explícito, de um clique, entre o login e
  o catálogo, com tratamento de falha resolvido.
- O [IDR 0018](0018-usuario-especialista-e-minimalismo.md) pede
  minimalismo: uma tela nova para o mesmo gesto seria repetição.

## Decisão

- Versão gravada diferente da publicada reabre `Atestacao.jsx`, agora com
  a prop `motivo`:
  - `'primeiro-acesso'` — o texto de hoje, com a atestação de idade;
  - `'atualizacao'` — "Os termos de uso e a política de privacidade
    mudaram", com links para os dois textos e o botão "Li e concordo",
    **sem** repetir a atestação de idade, já registrada.
- Conta antiga, sem campo de versão, vê o passo uma vez e segue.
- Só **mudança material** sobe a versão; correção de digitação ou de
  estilo não reabre o passo para ninguém.
- Falha ao gravar segue o IDR 0036: o clique é o ato, o app libera o
  catálogo mesmo assim, avisa, e a próxima carga repete o passo.

## Consequências

- Nenhuma tela nova: a mesma vista, com dois textos, no mesmo ponto do
  fluxo.
- O critério de "mudança material" é humano e fica registrado junto das
  constantes de versão — não há como derivá-lo do texto.
- `docs/modelo-memoria.md` § Estado do App.jsx ganha a condição de
  reaceite ao lado de `precisaAtestar`.
- Uma mudança de política interrompe uma vez a entrada de todos os
  usuários ativos — custo aceito, e a razão de a versão não subir por
  correção cosmética.

## Alternativas consideradas

- **Faixa de aviso com link (IDR 0029)**: não interromperia ninguém, mas
  não produz prova de aceite — que é o objetivo inteiro da mudança.
- **Não reabrir nada, só datar os textos**: zero custo, mas a prova
  congela na versão inicial e a cláusula dos Termos fica sozinha.
- **Tela própria de "termos atualizados"**: mesmo gesto, segundo
  componente — repetição que o IDR 0018 rejeita.
- **Bloquear o app até aceitar, sem alternativa**: é o efeito prático
  desta decisão, mas sem a degradação do IDR 0036 em caso de falha de
  gravação; manter a degradação evita trancar quem está sem rede.
