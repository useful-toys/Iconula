#!/usr/bin/env bash
# Copyright (c) 2026 Daniel Felix Ferber
#
# Mantém os hosts dos canais de preview do Hosting nos authorized domains do
# Firebase Auth, pelo tempo de vida do canal — ver
# docs/devops-dr/0007-ciclo-de-vida-dos-canais-de-preview.md.
#
# Uso:
#   dominios-autorizados-preview.sh adicionar <url-do-canal>
#   dominios-autorizados-preview.sh remover-pr <número-do-pr>
#   dominios-autorizados-preview.sh varrer
#
# Credencial: SA_PATH aponta para a chave JSON da service account (CI), ou
# ACCESS_TOKEN traz um token pronto (teste local com
# `ACCESS_TOKEN=$(gcloud auth print-access-token)`). SIMULAR=1 mostra a lista
# que seria gravada sem gravar.
#
# A API grava a lista inteira, então duas execuções simultâneas podem
# sobrescrever uma à outra: cada alteração lê, grava e relê para confirmar,
# com novas tentativas. A varredura só remove hosts no padrão de preview.

set -euo pipefail

readonly PROJETO="iconula"
readonly SITE="iconula"
readonly API_AUTH="https://identitytoolkit.googleapis.com/admin/v2/projects/${PROJETO}/config"
readonly API_CANAIS="https://firebasehosting.googleapis.com/v1beta1/sites/${SITE}/channels"
readonly PADRAO_PREVIEW='^iconula--[a-z0-9-]+\.web\.app$'
readonly TENTATIVAS=5

falha() {
  echo "::error::$*" >&2
  exit 1
}

# Ativa a service account no shell principal, e não num $(...): o trap e o
# `falha` precisam valer para o script inteiro, não para um subshell.
if [[ -z "${ACCESS_TOKEN:-}" ]]; then
  [[ -n "${SA_PATH:-}" ]] || falha "defina SA_PATH (chave da service account) ou ACCESS_TOKEN"
  gcloud auth activate-service-account --key-file="$SA_PATH" --quiet >/dev/null 2>&1
  trap 'gcloud auth revoke --all --quiet >/dev/null 2>&1 || true' EXIT
  ACCESS_TOKEN="$(gcloud auth print-access-token)"
fi
readonly TOKEN="$ACCESS_TOKEN"

ler_dominios() {
  curl -fsS -H "Authorization: Bearer ${TOKEN}" "$API_AUTH" | jq -c '.authorizedDomains // []'
}

gravar_dominios() {
  if [[ "${SIMULAR:-}" == "1" ]]; then
    echo "SIMULAR: gravaria ${1}"
    return
  fi
  jq -n --argjson d "$1" '{authorizedDomains: $d}' \
    | curl -fsS -X PATCH -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" \
        --data @- "${API_AUTH}?updateMask=authorizedDomains" >/dev/null
}

# Hosts de todos os canais ativos do site, seguindo a paginação. Se a leitura
# falhar, o script para antes de remover qualquer domínio.
listar_hosts_ativos() {
  local hosts="[]" pagina token=""
  while :; do
    pagina="$(curl -fsS -H "Authorization: Bearer ${TOKEN}" \
      "${API_CANAIS}?pageSize=100${token:+&pageToken=${token}}")"
    hosts="$(jq -c --argjson h "$hosts" '$h + [.channels[]?.url | sub("^https://"; "")]' <<<"$pagina")"
    token="$(jq -r '.nextPageToken // empty' <<<"$pagina")"
    [[ -n "$token" ]] || break
  done
  echo "$hosts"
}

espera_aleatoria() {
  sleep $((RANDOM % 5 + 3))
}

# Aplica o filtro jq $1 à lista até que ela não mude mais (o filtro já foi
# aplicado e confirmado por uma releitura).
convergir() {
  local filtro="$1" atuais novos
  shift
  for _ in $(seq 1 "$TENTATIVAS"); do
    atuais="$(ler_dominios)"
    novos="$(jq -c "$@" "$filtro" <<<"$atuais")"
    if [[ "$novos" == "$atuais" ]]; then
      echo "authorized domains: ${atuais}"
      return 0
    fi
    gravar_dominios "$novos"
    [[ "${SIMULAR:-}" == "1" ]] && return 0
    espera_aleatoria
  done
  falha "a lista de authorized domains não estabilizou após ${TENTATIVAS} tentativas"
}

adicionar() {
  local host="${1#https://}"
  host="${host%%/*}"
  [[ "$host" =~ $PADRAO_PREVIEW ]] || falha "host fora do padrão de preview: '${host}'"
  convergir 'if index($h) then . else . + [$h] end' --arg h "$host"
}

remover_pr() {
  [[ "$1" =~ ^[0-9]+$ ]] || falha "número de PR inválido: '${1}'"
  convergir 'map(select(test($p) | not))' --arg p "^iconula--pr${1}-[a-z0-9]+\\.web\\.app$"
}

varrer() {
  local ativos
  ativos="$(listar_hosts_ativos)"
  echo "canais ativos: ${ativos}"
  convergir 'map(. as $d | select((($d | test($p)) and (($a | index($d)) == null)) | not))' \
    --arg p "$PADRAO_PREVIEW" --argjson a "$ativos"
}

case "${1:-}" in
  adicionar) [[ $# -eq 2 ]] || falha "uso: $0 adicionar <url-do-canal>"; adicionar "$2" ;;
  remover-pr) [[ $# -eq 2 ]] || falha "uso: $0 remover-pr <número-do-pr>"; remover_pr "$2" ;;
  varrer) [[ $# -eq 1 ]] || falha "uso: $0 varrer"; varrer ;;
  *) falha "uso: $0 adicionar <url> | remover-pr <n> | varrer" ;;
esac
