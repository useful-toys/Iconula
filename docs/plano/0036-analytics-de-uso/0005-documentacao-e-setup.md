<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa 0036-0005: Documentação e setup

## Status
Pendente

## Objetivo
Refletir o analytics de uso nos documentos vivos (`arquitetura.md`,
`devops.md`, `interface.md`) e nos documentos de setup (`setup-firebase.md`,
`setup-gcloud.md`), com lastro nos registros da Fase 0036.

## Documentos de referência
- `docs/adr/0011-analytics-de-uso-com-google-analytics-4.md` — decisão e consequências.
- `docs/devops-dr/0001-csp-headers-e-configuracao-de-hosting.md` — CSP do GA4.
- `docs/idr/0071-banner-de-consentimento-para-analytics.md` — banner.
- `docs/arquitetura.md` § Serviços Firebase, § Camadas no cliente, § Decisões-chave.
- `docs/devops.md` § CSP e headers, § Secrets e variáveis.
- `docs/interface.md` § Tela de login, § Tela principal, § Pendências de interface.
- `docs/setup-firebase.md` e `docs/setup-gcloud.md` — estado atual de cada ambiente.

## Padrões e convenções aplicáveis
- `docs/*.md` descrevem o estado atual e refletem a tarefa no mesmo commit, com lastro em registro — `docs/plano/CLAUDE.md` § Documentação viva.
- `docs/setup-*.md` só com passos de setup — `docs/plano/CLAUDE.md` § Documentação viva.
- `docs/interface.md` é lastreado por IDR; `docs/arquitetura.md` por ADR/TDR; `docs/devops.md` por DDR — `docs/plano/CLAUDE.md` § Documentação viva.

## Escopo e instruções de implementação
1. `docs/arquitetura.md`:
   - § Serviços Firebase: acrescentar Google Analytics (GA4) como serviço de medição, região Brasil, carregado sob consentimento.
   - § Camadas no cliente: citar `src/lib/analytics.js` entre os módulos sem React.
   - § Decisões-chave: linha para o [ADR 0011](adr/0011-analytics-de-uso-com-google-analytics-4.md).
2. `docs/devops.md`:
   - § CSP e headers: citar as origens novas do GA4 (remetendo ao [DDR 0001](devops-dr/0001-csp-headers-e-configuracao-de-hosting.md)).
   - § Secrets e variáveis: acrescentar `VITE_GA_MEASUREMENT_ID` na lista de variáveis.
3. `docs/interface.md`:
   - § Tela de login e § Tela principal: descrever o banner de consentimento (quando aparece, Aceitar/Recusar), com lastro no [IDR 0071](idr/0071-banner-de-consentimento-para-analytics.md).
   - § Pendências de interface: permanece "Nenhuma".
4. `docs/setup-firebase.md`:
   - Nova subseção sobre Google Analytics: habilitar e linkar no console, escolher região Brasil, obter o Measurement ID `G-KQ72XBGSTM`; refletir que já está configurado.
5. `docs/setup-gcloud.md`:
   - Verificar com `gcloud services list --enabled --project iconula` se o link do Analytics habilitou APIs novas (ex.: `analyticsadmin.googleapis.com`) e registrar as que aparecerem na seção "APIs habilitadas"; se nenhuma, anotar que o Analytics não habilitou API nova relevante.

**Fora do escopo**: código e configuração de deploy (Tarefas 0036-0001 a 0036-0004).

## Decisões já tomadas (não reabrir)
- GA4 por gtag, região Brasil, consentimento — `docs/adr/0011-analytics-de-uso-com-google-analytics-4.md`.
- CSP do GA4 — `docs/devops-dr/0001-csp-headers-e-configuracao-de-hosting.md`.
- Banner de consentimento — `docs/idr/0071-banner-de-consentimento-para-analytics.md`.

## Arquivos impactados
- `docs/arquitetura.md` — modificar (§ Serviços Firebase, § Camadas no cliente, § Decisões-chave)
- `docs/devops.md` — modificar (§ CSP e headers, § Secrets e variáveis)
- `docs/interface.md` — modificar (§ Tela de login, § Tela principal)
- `docs/setup-firebase.md` — modificar (nova subseção sobre Analytics)
- `docs/setup-gcloud.md` — modificar (§ APIs habilitadas, se aplicável)

## Critérios de aceite
- [ ] `docs/arquitetura.md` cita o GA4, `src/lib/analytics.js` e o ADR 0011.
- [ ] `docs/devops.md` cita as origens novas da CSP e a variável `VITE_GA_MEASUREMENT_ID`.
- [ ] `docs/interface.md` descreve o banner nas duas telas, lastreado no IDR 0071, e § Pendências de interface segue "Nenhuma".
- [ ] `docs/setup-firebase.md` documenta habilitar/linkar o Analytics, região Brasil e o Measurement ID.
- [ ] `docs/setup-gcloud.md` registra o estado real das APIs de analytics (verificado via `gcloud services list`).

## Validação adicional
- `gcloud services list --enabled --project iconula | grep -i analytics` para lastrear o `setup-gcloud.md`.
