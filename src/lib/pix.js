// Copyright (c) 2026 Daniel Felix Ferber

/**
 * Payload BR Code (EMV QRCPS-MPM) do Pix para doação ao projeto
 * (TDR 0029). A chave é aleatória (nunca CPF, e-mail ou telefone), o
 * valor sugerido é R$5,00 (editável no app do banco) e os dados do
 * recebedor vêm do esmiuçamento — tudo em código, porque são dados
 * públicos por natureza, não segredos.
 *
 * Função pura: só monta a string, sem rede e sem estado
 * (`docs/requisitos.md` § Requisitos Não Funcionais). Quem gera a
 * imagem do QR code é a biblioteca `qrcode`, na vista da Tarefa
 * 0035-0002.
 */

const CHAVE_PIX = 'cdbe7681-fb1a-44f5-8d26-9121ea3d0074';
const VALOR = '5.00';
const NOME_RECEBEDOR = 'Daniel Felix Ferber';
const CIDADE_RECEBEDOR = 'Campinas - SP';

const GUI_PIX = 'br.gov.bcb.pix';
const LIMITE_NOME = 25;
const LIMITE_CIDADE = 15;

/**
 * Um campo EMV: identificador de 2 dígitos, tamanho de 2 dígitos e o
 * valor.
 *
 * @param {string} id
 * @param {string} valor
 * @returns {string}
 */
function campo(id, valor) {
  return `${id}${String(valor.length).padStart(2, '0')}${valor}`;
}

/**
 * CRC16-CCITT (polinômio 0x1021, valor inicial 0xFFFF) exigido pelo
 * campo `63` do BR Code, em hexadecimal maiúsculo com 4 dígitos.
 *
 * @param {string} texto
 * @returns {string}
 */
function crc16(texto) {
  let crc = 0xffff;
  for (let i = 0; i < texto.length; i += 1) {
    crc ^= texto.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Monta o payload BR Code do Pix. A ordem dos campos é a do padrão:
 * `00` Payload Format Indicator; `26` Merchant Account Information
 * (GUI `br.gov.bcb.pix` em `00`, chave em `01`); `52` Merchant Category
 * Code; `53` Transaction Currency; `54` Transaction Amount; `58`
 * Country Code; `59` Merchant Name; `60` Merchant City; `62` Additional
 * Data Field Template (txid genérico `***` em `05`); e `63` CRC16,
 * calculado sobre tudo com `"6304"` já anexado.
 *
 * `nome` e `cidade` aceitam override apenas para teste do truncamento;
 * a vista chama sem argumentos, usando os dados fixos do recebedor.
 *
 * @param {object} [opcoes]
 * @param {string} [opcoes.nome] - truncado a 25 caracteres.
 * @param {string} [opcoes.cidade] - truncada a 15 caracteres.
 * @returns {string}
 */
export function montarPayloadPix({ nome = NOME_RECEBEDOR, cidade = CIDADE_RECEBEDOR } = {}) {
  const merchantAccount = campo('00', GUI_PIX) + campo('01', CHAVE_PIX);
  const additionalData = campo('05', '***');

  const semCrc =
    campo('00', '01') +
    campo('26', merchantAccount) +
    campo('52', '0000') +
    campo('53', '986') +
    campo('54', VALOR) +
    campo('58', 'BR') +
    campo('59', nome.slice(0, LIMITE_NOME)) +
    campo('60', cidade.slice(0, LIMITE_CIDADE)) +
    campo('62', additionalData);

  const base = `${semCrc}6304`;
  return `${base}${crc16(base)}`;
}

/**
 * Chave Pix do recebedor, exposta para a vista exibir em texto e para
 * copiar/compartilhar (Tarefa 0035-0002).
 */
export const chavePix = CHAVE_PIX;
