<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Iconula — Controle de Figurinhas do Álbum da Copa 2026

## O que é

Iconula é um aplicativo web para colecionadores do álbum de figurinhas
oficial Panini da Copa do Mundo FIFA 2026 registrarem quantas unidades
têm de cada figurinha, acompanharem o progresso do álbum e organizarem
trocas de repetidas. O público é brasileiro e toda a interface é em
português. Substitui o antigo "Iconula Button", removido na
implementação desta especificação.

## Diferenciais

- UX minimalista e direta: os casos de uso essenciais — cadastrar e
  consultar figurinhas — acontecem em segundos, sem modos e sem
  configuração
- Sem lock-in: a coleção pertence ao usuário, que a exporta e importa
  sem impedimentos
- Troca pelo WhatsApp: listas de faltantes e repetidas em texto pronto
  para copiar e colar em grupos de troca

## Conceitos fundamentais

O catálogo espelha o álbum físico: cada figurinha tem um código e
pertence a uma seção — uma seleção ou um especial. A coleção de um
usuário é um contador de unidades por figurinha. Os estados "colada no
álbum" e "sobra para troca" derivam da contagem — nunca são registrados
à parte.

## Conceitos (Glossário)

- **Catálogo**: lista fixa de todas as figurinhas do álbum, embutida no
  código (códigos, nomes, seções e bandeiras — sem imagens dos cromos)
- **Figurinha**: item do catálogo, identificada pelo seu código — três
  letras da seção + dois dígitos da posição dentro da seção (ex.:
  `BRA05`, `FWC12`, `COC03`)
- **Seção**: agrupamento de figurinhas no álbum, identificada pelas três
  letras do código de suas figurinhas; toda seção é uma seleção ou um
  especial
  - **Seleção**: seção das figurinhas de um mesmo time — as 48 seleções
    classificadas, código FIFA de três letras (BRA, ARG, RSA…), com 20
    figurinhas cada
    - **Posições fixas**: 01 é o escudo (cromo brilhante) e 13 é a foto
      da seleção (cromo horizontal); as demais são os 18 jogadores
  - **Especiais**: seções que não são de seleção — "Extras FIFA"
    (código `FWC`; 20 figurinhas, parte da numeração oficial: troféu,
    mascotes, campeãs do passado) e "Coca-Cola" (código `COC`; 14,
    página especial), exibidas como grupos nomeados, iguais a uma
    seleção
- **Coleção**: os contadores de unidades de um usuário, um por figurinha
  do catálogo
- **Contagem**: unidades registradas de uma figurinha (0, 1, 2, …)
- **Faltante**: figurinha com contagem 0
- **Colada**: figurinha com contagem ≥ 1 — presunção de que a primeira
  unidade está no álbum
- **Repetida**: unidade além da primeira de uma figurinha com contagem
  ≥ 2; sobra disponível para troca

## Requisitos Funcionais

*Nota sobre o formato: para manter a descrição compacta, cada item
principal (`-`) é um requisito funcional, enquanto os sub-itens
(`  -`) representam as regras e condições específicas daquele requisito.
Questões recorrentes são marcadas como "Nota".*

### Acesso
- Entrar com conta Google
  - Único provedor: Google, via popup (ver ADR 0006)
  - Visitante deslogado vê apenas a tela de login — catálogo e coleção
    não são acessíveis sem autenticar
  - Falha de login exibe mensagem de erro, exceto quando o usuário fecha
    o popup (desistência, não erro)
  - Nota: a tela de login expõe o link para a política de privacidade
    antes de qualquer autenticação
- Sair da conta
  - Volta à tela de login; a coleção permanece gravada no Firestore e é
    recarregada no próximo login

### Catálogo
- Exibir o catálogo completo: 994 figurinhas
  - 980 da numeração oficial: 48 seleções × 20 figurinhas (960) + 20
    extras FIFA
  - 14 da página especial Coca-Cola
- Navegar o catálogo por seção
  - 48 seleções e os especiais "Extras FIFA" e "Coca-Cola", exibidos
    como grupos nomeados, iguais a uma seleção
  - Nomes em português ("Alemanha", "Estados Unidos")
  - Bandeiras via Twemoji, incluindo Inglaterra e Escócia (ver ADR 0002)
- Apresentar o catálogo com apresentações especiais conforme o tamanho
  da tela (celular, tablet, navegador)
  - Em qualquer tamanho, os fluxos essenciais — cadastrar e consultar —
    permanecem completos
  - Nota: quais apresentações existem em cada faixa de tela ainda não
    está especificado — definir antes de implementar

### Contagem
- Ajustar a contagem de uma figurinha: incrementar, decrementar e zerar
  - A contagem nunca fica negativa (decremento para em 0)
  - Cada ajuste dispara a persistência no Firestore — fire-and-forget,
    sem debounce (política do ADR 0007)
  - Falha de persistência não bloqueia o ajuste: a tela reflete a
    mudança, a falha vira log e o ajuste seguinte regrava o valor completo

### Progresso e listas
- Exibir progresso da coleção
  - Geral: figurinhas coladas de 994 e percentual
  - Por seção: coladas sobre o total da seção
- Exibir lista de faltantes: figurinhas com contagem 0
- Exibir lista de repetidas: figurinhas com contagem ≥ 2, com as
  unidades sobrando (contagem − 1)

### Compartilhamento
- Gerar texto pronto para WhatsApp com faltantes e/ou repetidas
  - Texto esparso e legível para grupos de troca — formato exato é
    decisão pendente
  - Entrega por copiar para a área de transferência e/ou abrir o
    WhatsApp com o texto (decisão pendente)
  - Nota: a lista de troca é apenas saída; portabilidade usa JSON

### Portabilidade (sem lock-in)
- Exportar a coleção completa em arquivo JSON
  - Lossless: todas as contagens, suficiente para restaurar a coleção
    exatamente como está
  - Disponível sempre, sem etapas adicionais
- Importar coleção a partir de arquivo JSON
  - A importação substitui a coleção inteira, após confirmação explícita
  - Arquivo inválido ou incompleto é rejeitado sem alterar a coleção atual
  - Formato garantido: o exportado pelo próprio app

### Privacidade
- Exibir política de privacidade (LGPD)
  - Acessível a partir da tela de login, antes de autenticar
  - Declara os dados tratados — identidade da conta Google (nome,
    e-mail, foto) e a coleção —, finalidade, retenção e direitos do titular

## Regras Transversais

### Semântica da contagem
- Contagem 0 = faltante; contagem 1 = colada; contagem n ≥ 2 = colada +
  (n−1) repetidas
- "Colada" é presunção da contagem, não estado registrado à parte — não
  existe "tenho mas ainda não colei"
- A identidade de uma figurinha é o seu código — letras da seção +
  dígitos da posição —, imutável no catálogo; contagens são sempre
  endereçadas por código

### Dados e isolamento
- A coleção vive no Firestore em `users/{uid}`; o isolamento entre
  usuários é garantido pelas `firestore.rules` avaliadas no servidor
  (ADR 0007) — nunca pelo cliente
- Falha de persistência nunca derruba a interface: vira log e a tela
  segue funcional (política do ADR 0007)
- Sem as variáveis `VITE_FIREBASE_*`, o login fica indisponível e o app
  não oferece funcionalidade — coerente com o login obrigatório; modo
  não suportado
- Nota: o campo `teamName` gravado pela versão anterior fica órfão na
  migração — ver Decisões Pendentes
- Nenhum dado além da identidade Google e da coleção é tratado; sem
  analytics no MVP

### Conteúdo
- O app não exibe imagens dos cromos (direitos autorais Panini): só
  códigos, nomes, seções e bandeiras Twemoji
- O catálogo é embutido no código (`src/data/`), não carregado de
  serviço externo

### UX
- Os fluxos essenciais — cadastrar contagens e consultar a coleção —
  são os mais curtos e rápidos da interface; nenhuma feature pode
  atravessá-los
- Minimalismo funcional: sem modos, sem configurações e sem passos
  opcionais nos fluxos essenciais

## Requisitos Não Funcionais

- **Idioma**: interface 100% em português do Brasil; `<html lang="pt-BR">`
  (corrige o `lang="en"` atual)
- **Acessibilidade**: operável por teclado, contraste adequado, semântica
  legível por leitores de tela — preservar a base atual (bandeira
  `aria-hidden`, botões com texto)
- **Performance**: catálogo com ~1000 figurinhas renderiza e filtra sem
  travar; virtualizar listas longas se necessário
- **Responsividade**: o app funciona bem em navegador, celular e tablet;
  a apresentação do catálogo se adapta ao tamanho da tela — preservar a
  base atual (`App.css` responsivo com dark mode)
- **Compartilhamento do site**: `title`, `description` e Open Graph
  básicos em PT-BR
- **Deploy**: Firebase Hosting — produção em merge na `main`, preview por
  PR (já vigentes)
- **Custo**: plano Spark (gratuito); Firestore em `southamerica-east1`
  com faixa gratuita (ADR 0007)

## Requisitos futuros

*Ideias registradas para evolução — nenhuma comprometida; cada uma exige
especificação própria antes de implementar.*

- Modo pacotinho: lançar de uma vez os 7 números de um envelope
- Match entre coleções: comparar com a coleção de outro usuário ("o que
  eu tenho que tu falta")
- Importar lista colada do WhatsApp (se "receber por mensagem" virar
  caso de uso real — hoje coberto por JSON)
- Pacote de atualização: as 120 figurinhas de convocados lançadas em
  junho/2026
- Variantes Extra: figurinhas paralelas roxa/bronze/prata/ouro
- PWA/offline: uso em feiras de troca com sinal ruim
- Analytics anônimo de uso

### Decisões Pendentes
- **Schema Firestore da coleção**: mapa de contagens no documento
  `users/{uid}` vs. subcoleção — impacto em cota de escritas e regras;
  exige ADR novo revisando o 0007
- **Migração do `teamName`**: manter, ignorar ou remover o campo da era
  do botão quando ela for desativada
- **Formato do texto de WhatsApp**: agrupamento por seção, com ou sem
  nomes, faltantes e repetidas juntas ou separadas; copiar vs. abrir o
  WhatsApp
- **Formato do JSON de exportação**: campos e versionamento do arquivo
- **Fonte do checklist**: fonte canônica e verificável das 994
  figurinhas (códigos, nomes PT-BR, seções, posições fixas) para montar
  `src/data/`

## Fora de Escopo

- **Modo local sem login** (dados primários no navegador): excluído
  permanentemente — o produto é centrado na conta Google; sem login não
  há contador
- **Imagens dos cromos**: excluído permanentemente — direitos autorais
  da Panini
- **Outros álbuns**: fora desta versão — o catálogo é o álbum da Copa
  2026
- **O botão de seleções atual** ("Iconula Button"): removido no PR de
  implementação desta especificação; o histórico permanece no git
