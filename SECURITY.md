<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Política de segurança

## Reportar uma vulnerabilidade

Encontrou uma vulnerabilidade de segurança no Iconula? Reporte de forma
privada, sem abrir issue pública:

- **Preferencial**: [Security Advisories](https://github.com/useful-toys/Iconula/security/advisories/new)
  do GitHub, restrito a mantenedores até a correção sair.
- **Alternativa**: e-mail para dff4321@gmail.com.

Inclua passos para reproduzir, impacto esperado e, se possível, uma prova
de conceito.

## O que está em escopo

- O código do app em `src/` e o que ele expõe em produção
  (`https://iconula.web.app`).
- As regras do Cloud Firestore (`firestore.rules`).
- Os workflows de CI/CD em `.github/workflows/`.

## O que esperar

- Confirmação de recebimento em até 5 dias úteis.
- Correção ou mitigação conforme a severidade; sem SLA fixo — projeto
  mantido por uma única pessoa.
- Crédito no changelog/registro da correção, se desejado.

## Vulnerabilidade e incidente com dado pessoal

Não confunda os dois casos:

- **Vulnerabilidade** (esta página): uma falha que ainda não atingiu dado
  de ninguém; o relato é privado, como acima.
- **Incidente com dado pessoal** (LGPD art. 48): uma falha que chegou a
  expor, alterar ou perder dados de titulares. Vale então o plano manual
  do controlador em
  [docs/privacidade.md](docs/privacidade.md#plano-de-resposta-a-incidente),
  com detecção, contenção, avaliação de risco e os prazos de comunicação à
  ANPD e aos titulares.

O mesmo relato pode alimentar os dois: uma vulnerabilidade explorada vira
incidente e entra no plano. Reportada ou não, o prazo de comunicação corre
a partir do momento em que o controlador sabe que dados pessoais foram
afetados ([DDR 0011](docs/devops-dr/0011-procedimentos-manuais-de-privacidade.md)).

## Ferramentas automatizadas já ativas

Secret scanning com push protection, Dependabot alerts/security updates e
CodeQL code scanning — ver [DDR 0006](docs/devops-dr/0006-ferramentas-de-seguranca-do-repositorio.md).
