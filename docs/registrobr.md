<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Configuração do DNS no registro.br

Este documento descreve a configuração de DNS feita no
[registro.br](https://registro.br) para o domínio customizado do projeto
**Iconula Button**, para o caso de ser necessário reproduzir ou revisar a
configuração. Para como o domínio foi registrado do lado do Firebase
(e de onde vêm os valores abaixo), ver [docs/firebase.md](firebase.md#domínio-customizado).

## Domínio

- **Domínio raiz**: `danielferber.com.br` (propriedade do usuário,
  registrado e com DNS gerenciado no registro.br)
- **Subdomínio do app**: `iconula.danielferber.com.br`, apontando para o
  Firebase Hosting do projeto `iconula`

O registro.br é a autoridade de DNS aqui — o Firebase não hospeda DNS,
só valida os registros que apontam para ele. Toda alteração de DNS
precisa ser feita manualmente no painel do registro.br (não há CLI/API
usada nesta sessão para isso — é uma ação que só o usuário pode
executar, por ser uma mudança de conta/domínio de terceiros).

## Registros DNS configurados

| Tipo | Nome/Host | Valor | Finalidade |
|---|---|---|---|
| `CNAME` | `iconula` | `iconula.web.app` | Aponta o subdomínio para o Firebase Hosting |
| `TXT` | `_acme-challenge.iconula` | `cn6LzWmOG94cpT_KSGBRTT0ZJSXElaHErv7fbc_IKdA` | Validação para emissão do certificado TLS gerenciado pelo Firebase (específico desta instância de domínio; pode ser removido depois que o certificado ficar `ACTIVE`) |

Esses valores foram obtidos consultando a Firebase Hosting REST API após
criar o `CustomDomain` (ver [docs/firebase.md](firebase.md#domínio-customizado)
para o comando exato). **Não são valores genéricos** — se o domínio for
recriado no Firebase, uma nova consulta pode retornar um TXT diferente.

## Como verificar

Depois de adicionar os registros no registro.br, a propagação de DNS e a
emissão do certificado podem levar de minutos a ~24h. Conferir:

```bash
TOKEN=$(gcloud auth print-access-token)
curl -X GET "https://firebasehosting.googleapis.com/v1beta1/projects/iconula/sites/iconula/customDomains/iconula.danielferber.com.br" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Goog-User-Project: iconula"
```

Procurar por `hostState: HOST_ACTIVE` e `cert.state: ACTIVE`. Enquanto
isso não acontece, `https://iconula.danielferber.com.br` pode não
carregar ou mostrar aviso de certificado.

## Reproduzindo do zero (resumo)

1. Criar o `CustomDomain` no Firebase (ver [docs/firebase.md](firebase.md#domínio-customizado))
   e obter os registros DNS exigidos (`requiredDnsUpdates` / `cert.verification`)
2. No painel de DNS do registro.br para o domínio raiz, adicionar o
   `CNAME` do subdomínio apontando para `<site>.web.app` e o `TXT` de
   validação do certificado, exatamente como retornados pela API
3. Aguardar propagação e reconsultar a API até `hostState`/`cert.state`
   ficarem ativos
