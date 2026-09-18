// Copyright (c) 2026 Daniel Felix Ferber

// Canal de contato do controlador, montado em runtime (TDR 0028).
//
// O endereço existe aqui só em partes (`USUARIO` e `DOMINIO`) e é juntado
// quando `enderecoDeContato()` é chamada — nunca como literal contíguo no
// código nem no bundle. Isso derrota o raspador que lê o HTML servido e
// procura padrão de e-mail; **não** derrota quem executa JavaScript, que vê
// o endereço no DOM como em qualquer link `mailto:`.
const USUARIO = "dff4321";
const DOMINIO = "gmail.com";

/**
 * Monta o endereço do canal de contato a partir das partes.
 *
 * @returns {string} o endereço completo, com `@` via `String.fromCharCode`.
 */
export function enderecoDeContato() {
  return `${USUARIO}${String.fromCharCode(64)}${DOMINIO}`;
}
