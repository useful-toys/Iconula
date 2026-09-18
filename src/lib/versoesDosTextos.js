// Copyright (c) 2026 Daniel Felix Ferber

/**
 * Versões publicadas dos textos de conformidade — o **único** lugar do
 * código onde as datas de vigência vivem (MDR 0009, IDR 0062).
 *
 * A versão é a data de vigência do texto, em ISO (`AAAA-MM-DD`): é o valor
 * gravado em `termosVersao`/`politicaVersao` de `users/{uid}` e o que a
 * carga devolve. Comparar a versão que a conta tem com a publicada aqui é o
 * que decide se o passo de reaceite reabre.
 *
 * **Só mudança material sobe a versão.** Correção de digitação, ajuste de
 * estilo ou qualquer edição que não altere o sentido do que a pessoa aceitou
 * mantém a data — e não reabre o aceite de ninguém. A data só passa a valer
 * outra quando o texto muda de forma material; o critério é humano, não
 * derivável do texto (IDR 0062).
 *
 * A data daqui precisa bater com o `dateTime` exibido em "Última atualização"
 * nos componentes `PoliticaDePrivacidade.jsx` e `TermosDeUso.jsx`.
 */

export const VERSAO_TERMOS = '2026-09-17';
export const VERSAO_POLITICA = '2026-09-17';
