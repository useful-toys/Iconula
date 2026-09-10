<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Bandeiras e ícones temáticos (Twemoji, vendorizados)

Os arquivos SVG desta pasta são gráficos do
[Twemoji](https://github.com/jdecked/twemoji) (fork mantido do Twemoji
original do Twitter/X), licenciados sob
[CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/).
Copyright dos gráficos: Twitter, Inc e outros contribuidores.

São 48 bandeiras de seleções e 2 ícones temáticos dos especiais
(🏆 Extras FIFA e 🥤 Coca-Cola), todos baixados uma única vez da tag
`v17.0.3` para eliminar a dependência de CDN externo em runtime — ver
[ADR 0002](../../../docs/adr/0002-bandeiras-emoji-unicode.md) e o item de
segurança correspondente em
[docs/tdr/0002](../../../docs/tdr/0002-headers-de-seguranca-hosting.md).

## Nomenclatura

Cada arquivo é nomeado pelo code point Unicode (hexadecimal, separado por
`-`) do emoji de bandeira correspondente, ex.: `1f1e6-1f1f7.svg` para
🇦🇷 (Argentina). É o mesmo esquema usado pelo Twemoji e calculado em
`TeamButton.jsx` via `twemoji.convert.toCodePoint()`.

## Como reproduzir / adicionar uma bandeira nova

```bash
node -e "
import('@twemoji/api').then(m => {
  const twemoji = m.default || m;
  console.log(twemoji.convert.toCodePoint('🇦🇷')); // troque pelo emoji desejado
});
"
# copie o code point impresso e baixe o SVG correspondente:
curl -sf "https://cdn.jsdelivr.net/gh/jdecked/twemoji@17.0.3/assets/svg/<code-point>.svg" \
  -o src/assets/flags/<code-point>.svg
```
