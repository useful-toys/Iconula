<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Modelo de dados — Formato de intercâmbio

Como a aplicação representa a coleção do usuário em arquivos JSON de exportação e importação. As decisões de modelagem estão nos [MDRs](mdr/); este documento mostra o estado atual do formato de intercâmbio.

## Formato do arquivo

```json
{
  "versao": 1,
  "geradoEm": "2026-09-12T15:30:45.123Z",
  "contagens": {
    "BRA05": 3,
    "FWC12": 1,
    "COC03": 2
  }
}
```

### Regras do formato

- **`versao`**: inteiro, começando em 1 — versiona o formato; uma mudança futura troca a versão e o dado antigo é recusado em vez de mal interpretado
- **`geradoEm`**: ISO 8601 — instante local de quem exporta
- **`contagens`**: mapa esparso, mesmo formato do Firestore ([MDR 0002](mdr/0002-schema-do-documento-da-colecao.md)) — chave ausente = contagem 0, zeros nunca aparecem
- **Sem dados pessoais**: nada de uid, e-mail, nome ou foto — lossless para a coleção, sem lock-in

## Exportação

- **Lê o estado em memória**, zero requisição ao Firestore
- **Remove zeros** do mapa antes de serializar (defesa extra — o mapa em memória já nunca guarda zeros)
- **Nome de arquivo previsível e ordenável**: `iconula-AAAA-MM-DD.json`, na data local de quem exporta

```javascript
// Exemplo de exportação
{
  versao: 1,
  geradoEm: "2026-09-12T15:30:45.123Z",
  contagens: {
    "BRA05": 3,
    "FWC12": 1,
    "COC03": 2
  }
}
```

## Importação

- **Valida o arquivo inteiro antes de aplicar** (`validarImportacao` em `portabilidade.js`) — recusa quando:
  - Não é JSON válido
  - Não é um objeto
  - `versao` não é a conhecida
  - `contagens` está ausente ou não é um objeto
  - Algum valor de `contagens` não é um inteiro entre 1 e 99 (valores negativos são recusados; zero é descartado silenciosamente antes da checagem de intervalo)
- **Normalizações não recusam o arquivo**:
  - Valor exatamente `0` some silenciosamente (mapa esparso)
  - Código fora do catálogo atual (`codigosValidos`) some e entra na contagem de `descartadas`, avisada ao usuário
- **Substitui a coleção inteira** — `gravarImportacao` usa `mergeFields: ['contagens', 'updatedAt']` para trocar o mapa `contagens` inteiro de uma vez ([MDR 0003](mdr/0003-gravacao-agregada-da-colecao.md)), sem precisar comparar com o estado anterior e gerar `deleteField()` para cada chave ausente
- **Descarta o histórico de desfazer** — a coleção anterior deixou de existir
- **Descarta pendências da gravação agregada** — `descartarPendencias()` limpa alterações acumuladas antes de aplicar a importação, para não reintroduzir dado já substituído
- **1 escrita no Firestore** (substitui `contagens` + `updatedAt`; `atestadoEm` intocado)

### Fronteira de validação

- `validarImportacao` é a **única** função que valida o conteúdo do arquivo — `gravarImportacao` não valida nada, confia que o mapa já chega normalizado. `App.jsx` conecta as duas: chama `validarImportacao` primeiro e, só se o resultado for `'valido'`, passa o mapa para `gravarImportacao`.

```javascript
// Exemplo de importação válida
{
  versao: 1,
  geradoEm: "2026-09-12T15:30:45.123Z",
  contagens: {
    "BRA05": 3,
    "FWC12": 1,
    "COC03": 2,
    "ARG01": 0  // será descartado silenciosamente (mapa esparso)
  }
}

// Exemplo de importação com código desconhecido
{
  versao: 1,
  geradoEm: "2026-09-12T15:30:45.123Z",
  contagens: {
    "BRA05": 3,
    "XXX99": 1  // será descartado, avisando "1 figurinha(s) do arquivo não existem no catálogo atual e foram descartadas"
  }
}
```

## Validação

```javascript
// Resultado de validarImportacao
{
  status: 'valido',
  contagens: { ... },  // mapa normalizado (sem zeros, sem códigos desconhecidos)
  descartadas: 1       // quantidade de códigos fora do catálogo atual
}

// ou

{
  status: 'invalido',
  motivo: 'o arquivo não é um JSON válido'
}
```

## Comparação com os outros modelos

| Aspecto | Firestore (persistência) | Memória (SPA) | Intercâmbio (JSON) |
|---|---|---|---|
| **Formato** | `contagens`, `updatedAt`, `atestadoEm` | `contagens` (mapa esparso) | `versao`, `geradoEm`, `contagens` |
| **Chave ausente** | Contagem 0 | Contagem 0 | Contagem 0 |
| **Zeros** | Nunca gravados | Nunca guardados | Nunca aparecem (descartados silenciosamente na importação) |
| **Teto** | 99 | 99 | 99 |
| **Carimbo** | `updatedAt` (servidor) | `atualizadoEm` (aproximação local, [TDR 0017](tdr/0017-escrita-por-setdoc-merge-e-carimbo-local-pos-gravacao.md)) | `geradoEm` (ISO 8601) |
| **Atestação** | `atestadoEm` | `precisaAtestar` (booleano) | Não existe |
| **Versão** | Não existe | Não existe | `versao` (inteiro) |
| **Dados pessoais** | Não existe | Não existe | Não existe |
| **Escrita no Firestore** | `merge: true` (ajustes) ou `mergeFields` (importação) | — | `mergeFields` (substitui mapa inteiro) |

Detalhes nos [MDR 0002](mdr/0002-schema-do-documento-da-colecao.md), [MDR 0003](mdr/0003-gravacao-agregada-da-colecao.md) e [MDR 0004](mdr/0004-formato-de-intercambio-da-colecao.md).
