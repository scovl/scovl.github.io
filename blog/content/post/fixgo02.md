+++
title = "O diabo das duplicações"
description = "Como uma auditoria de SOLID, DRY, KISS e ISP removeu duplicação e melhorou as interfaces do Ollanta sem quebrar nada"
date = 2026-05-07T14:00:00-03:00
tags = ["Go", "design-patterns", "SOLID", "DRY", "static-analysis", "ollanta", "refactoring"]
draft = true
weight = 2
author = "Vitor Lobo Ramos"
+++

Existe uma diferença entre "funcionar" e "estar certo". Todo código que funciona costumar passar nos testes, mas código com duplicação silenciosa corrói a base ao longo do tempo. Isto é, cada nova feature exige editar mais arquivos, cada bug precisa ser corrigido em mais lugares, e cada onboarder demora mais para entender o que está acontecendo.

Este artigo conta a história de uma auditoria de [design patterns](https://en.wikipedia.org/wiki/Software_design_pattern) que fiz no [Ollanta](https://github.com/scovl/Ollanta), um projeto pessoal de análise de código estático multi-linguagem escrito em Go. Fiz uma auditoria que revelou 7 violações de princípios como DRY, KISS e ISP. Implementei 6 delas em cerca de 2 horas, com zero quebras de teste. O resultado: 72 blocos if/else removidos, 3 funções duplicadas centralizadas, 2 sentinelas de erro unificados, e 2 interfaces poluídas segregadas.

> **saiba mais:** [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) (Don't Repeat Yourself) prega que cada pedaço de conhecimento deve ter uma única representação no sistema. [KISS](https://en.wikipedia.org/wiki/KISS_principle) (Keep It Simple, Stupid) diz que simplicidade deve ser priorizada. [ISP](https://en.wikipedia.org/wiki/Interface_segregation_principle) (Interface Segregation Principle, o I do SOLID) estabelece que nenhum cliente deve depender de métodos que não usa.

## O contexto

O Ollanta tem 10 módulos Go numa arquitetura hexagonal (ports & adapters). O núcleo (`domain/`) define interfaces; a camada de aplicação (`application/`) orquestra casos de uso; é os adapters (`ollantaweb/`, `ollantastore/`, `ollantarules/`) implementam as interfaces. Migrei recentemente de uma estrutura monolítica para hexagonal e neste processo, notei que acumulei muitas duplicações pelo caminho. Aqui vou contar apenas o que corrigi, o diff e o impacto.

## Correção 1: Centralizar helper `ParamInt` [DRY]

O Ollanta tem regras de análise estática escritas como closures Go. Regras aceitam parâmetros configuraveis, por exemplo, `max_lines: 40` para a regra que detecta funções muito longas. Para ler esses parâmetros, cada regra precisa de uma função que leia um inteiro de um `map[string]string` com fallback para um valor padrão. **O problema** é que essa função existia em 2 lugares com nomes diferentes é implementação idêntica:

```go
// ollantarules/languages/golang/rules/no_large_functions.go
func paramInt(params map[string]string, key string, defaultVal int) int {
    if v, ok := params[key]; ok {
        if n, err := strconv.Atoi(v); err == nil {
            return n
        }
    }
    return defaultVal
}

// ollantarules/languages/treesitter/no_large_functions_javascript.go
func tsParamInt(params map[string]string, key string, defaultVal int) int {
    if v, ok := params[key]; ok {
        if n, err := strconv.Atoi(v); err == nil {
            return n
        }
    }
    return defaultVal
}
```

Eram 11 chamadas espalhadas entre os dois names. A solução foi trivial:

```go
// ollantarules/params.go --- nova
func ParamInt(params map[string]string, key string, defaultVal int) int {
    if v, ok := params[key]; ok {
        if n, err := strconv.Atoi(v); err == nil {
            return n
        }
    }
    return defaultVal
}
```

E 11 substituições mecânicas: `paramInt(` -> `ollantarules.ParamInt(` é `tsParamInt(` -> `ollantarules.ParamInt(`. Duas funções removidas, uma adicionada, zero mudança de comportamento.

## Correção 2: Centralizar função `Violated` [DRY]

A função `violated(actual, operator, threshold) bool` avalia se um valor numérico viola uma condição de quality gate. Ela existia em **3 lugares** com o mesmo switch-case:

| Arquivo | Operadores suportados |
|---------|----------------------|
| `domain/service/gate_evaluator.go` | gt, lt, eq, gte, lte |
| `ollantaengine/qualitygate/gate.go` | gt, lt, eq, gte, lte |
| `ollantarules/threshold.go` | gt, lt, gte, lte (sem eq) |

As duas primeiras eram idênticas linha por linha --- inclusive duplicando o tipo `Operator` é seus consts `OpGreaterThan`, `OpLessThan`, `OpEqual`, `OpGreaterOrEq`, `OpLessOrEq`. A terceira usava strings puras é não implementava `eq`. A correção criou um único ponto de verdade em `ollantacore/condition.go`:

```go
func Violated(actual float64, relation string, threshold float64) bool {
    switch relation {
    case "gt":  return actual > threshold
    case "lt":  return actual < threshold
    case "eq":  return actual == threshold
    case "gte": return actual >= threshold
    case "lte": return actual <= threshold
    }
    return false
}
```

E os 3 callers passaram a converter seu tipo local para string na chamada:

```go
// domain/service/gate_evaluator.go --- antes
if violated(actual, c.Operator, c.ErrorThreshold) { ... }

// domain/service/gate_evaluator.go --- depois
if ollantacore.Violated(actual, string(c.Operator), c.ErrorThreshold) { ... }
```

Resultado: 3 funções `violated` removidas, 1 função `Violated` adicionada em `ollantacore/`, 5 callers atualizados. Não mexi na duplicação do tipo `Operator` --- isso é debito da migração hexagonal é sera resolvido quando o legacy `ollantaengine` for absorvido por `domain/`.

> **saiba mais:** O tipo `Operator` é um `type Operator string` com consts `OpGreaterThan Operator = "gt"`, etc. A conversão `string(c.Operator)` é gratuita em Go --- não aloca, não copia, é só uma reinterpretação de tipo em tempo de compilação. Por isso a chamada `ollantacore.Violated(actual, string(c.Operator), c.ErrorThreshold)` tem o mesmo custo da chamada original.

## Correção 3: Unificar sentinel `ErrNotFound` [DRY]

Dois sentinelas de erro idênticos em lugares diferentes:

```go
// domain/model/project.go
var ErrNotFound = errors.New("not found")

// ollantastore/postgres/projects.go
var ErrNotFound = errors.New("not found")
```

Mesma string, mesmo propósito, mas são ponteiros diferentes. Isso forcava handlers que podiam receber erros de ambas as camadas a testar os dois:

```go
// antes --- testava dois sentinelas diferentes
if errors.Is(err, postgres.ErrNotFound) || errors.Is(err, model.ErrNotFound) {
    jsonError(w, http.StatusNotFound, "not found")
    return
}
```

A correção foi fazer `postgres.ErrNotFound` apontar para o mesmo sentinel do domínio:

```go
// ollantastore/postgres/projects.go --- depois
var ErrNotFound = model.ErrNotFound
```

Isso eliminou o double-check em `issues.go` é `tags_handler.go`. Os outros 70 lugares que usam `postgres.ErrNotFound` continuam funcionando porque `errors.Is` compara por referência --- se os dois sentinelas são o mesmo ponteiro, `errors.Is(err, postgres.ErrNotFound)` é `errors.Is(err, model.ErrNotFound)` são equivalentes.

> **saiba mais:** [`errors.Is`](https://pkg.go.dev/errors#Is) percorre a cadeia de wrapping é compara cada erro com o target usando `==`. Como `errors.New("not found")` retorna um ponteiro, dois sentinelas criados separadamente com a mesma string são diferentes para `errors.Is`. A solução é fazer ambos apontarem para a mesma instancia.

## Correção 4: Extrair `handleNotFound` [DRY]

Esta foi a correção de maior volume. O padrão abaixo aparecia **72 vezes** em 18 arquivos da camada web:

```go
if errors.Is(err, postgres.ErrNotFound) {
    jsonError(w, http.StatusNotFound, "project not found")
    return
}
```

A tripla (testar erro, status HTTP, mensagem) era idêntica em estrutura, variando apenas a mensagem. A correção foi extrair um helper de 6 linhas:

```go
// ollantaweb/api/helpers.go
func handleNotFound(w http.ResponseWriter, err error, message string) bool {
    if errors.Is(err, postgres.ErrNotFound) {
        jsonError(w, http.StatusNotFound, message)
        return true
    }
    return false
}
```

Cada chamada passou de 4 linhas para 1:

```go
// antes
if errors.Is(err, postgres.ErrNotFound) {
    jsonError(w, http.StatusNotFound, "project not found")
    return
}

// depois
if handleNotFound(w, err, "project not found") {
    return
}
```

O volume de substituições por arquivo da uma ideia da escala da duplicação:

| Arquivo | Ocorrencias |
|---------|------------|
| `project_scope.go` | 11 |
| `issues.go` | 6 |
| `profiles_handler.go` | 5 |
| `scans.go` | 4 |
| `gates_handler.go` | 3 |
| `projects.go` | 3 |
| `custom_rules_handler.go` | 3 |
| Demais 11 arquivos | 4 |
| **Total** | **39** |

Outros 33 casos de `errors.Is(err, postgres.ErrNotFound)` em arquivos não-HTTP (`ingest/`, `webhook/`, `postgres/`) foram mantidos como estavam --- eles não chamam `jsonError` é portanto não se beneficiam do helper.

> **saiba mais:** A decisão de não criar uma abstração mais pesada (como middleware ou error-to-HTTP mapper) foi deliberada. O KISS manda não introduzir complexidade desnecessária. Um helper de 6 linhas que substitui 72 blocos idênticos é o ponto exato onde simplicidade é DRY se encontram.

## Correção 5: Segregar `IProfileRepo` [ISP]

A interface `IProfileRepo` em `domain/port/profile.go` tinha 17 métodos. O problema não era o número --- era que clientes diferentes precisavam de subconjuntos completamente diferentes:

| Responsabilidade | Métodos | Clientes típicos |
|-----------------|---------|-----------------|
| CRUD de perfis | `List`, `GetByID`, `Create`, `Update`, `Delete`, `Copy`, `SetDefault`, `ApplyProfileRules`, `ApplyProfileYAML` | Handlers de perfil, sync de built-in |
| Regras do perfil | `ActivateRule`, `DeactivateRule` | Handlers de regras |
| Associação projeto-perfil | `AssignToProject`, `ByProjectAndLanguage`, `ResolveEffectiveRules`, `ProjectProfiles`, `ProjectEffectiveProfiles` | Ingestão, handlers de projeto |
| Changelog | `ProfileChangelog` | Handler de auditoria |

A correção criou 3 interfaces segregadas **em adição** a interface original (mantida por compatibilidade):

```go
type IProfileRuleRepo interface {
    ActivateRule(ctx context.Context, profileID int64, ruleKey, severity string, params map[string]string) error
    DeactivateRule(ctx context.Context, profileID int64, ruleKey string) error
}

type IProjectProfileRepo interface {
    AssignToProject(ctx context.Context, projectID int64, language string, profileID int64) error
    ByProjectAndLanguage(ctx context.Context, projectID int64, language string) (*model.QualityProfile, error)
    ResolveEffectiveRules(ctx context.Context, profileID int64) ([]*model.EffectiveRule, error)
    ProjectProfiles(ctx context.Context, projectID int64) ([]*model.ProjectQualityProfile, error)
    ProjectEffectiveProfiles(ctx context.Context, projectID int64) ([]*model.EffectiveQualityProfile, error)
}

type IProfileChangelogRepo interface {
    ProfileChangelog(ctx context.Context, profileID int64, limit, offset int) ([]model.ProfileChangelogEntry, int, error)
}
```

A implementação concreta (`postgres.ProfileRepository`) continua a mesma struct --- ela satisfaz todas as 4 interfaces (a original + as 3 novas). As verificações em tempo de compilação foram adicionadas:

```go
var _ port.IProfileRepo         = (*ProfileRepository)(nil)
var _ port.IProfileRuleRepo     = (*ProfileRepository)(nil)
var _ port.IProjectProfileRepo  = (*ProfileRepository)(nil)
var _ port.IProfileChangelogRepo = (*ProfileRepository)(nil)
```

Nenhum código cliente precisou ser alterado. O ganho é para o futuro: quando um handler só precisa ativar/desativar regras, ele pode declarar sua dependência como `IProfileRuleRepo` em vez de `IProfileRepo`. Isso reduz o acoplamento é torna os testes mais focados.

## Correção 6: Segregar `IMeasureRepo` [ISP]

Mesmo princípio, escala menor. `IMeasureRepo` tinha 10 métodos de 3 granularidades:

| Granularidade | Métodos |
|--------------|---------|
| Histórica (por scan) | `BulkInsert`, `GetLatest`, `Trend` |
| Live (projeto) | `UpsertLive`, `UpsertLiveBatch`, `GetLive` |
| Diaria (time-series) | `UpsertDailyAggregate`, `UpsertDailyAggregateBatch`, `GetDailyAggregates` |

As interfaces segregadas:

```go
type ILiveMeasureRepo interface {
    UpsertLive(ctx context.Context, ...) error
    UpsertLiveBatch(ctx context.Context, ...) error
    GetLive(ctx context.Context, ...) (map[string]float64, error)
}

type IDailyAggregateRepo interface {
    UpsertDailyAggregate(ctx context.Context, ...) error
    UpsertDailyAggregateBatch(ctx context.Context, ...) error
    GetDailyAggregates(ctx context.Context, ...) ([]model.TrendPoint, error)
}
```

A ingestão de scans, por exemplo, só insere medidas históricas --- não precisa conhecer `GetDailyAggregates`. Com a interface segregada, essa dependência desnecessária desaparece da assinatura.

## O que aprendi com isso

Auditar código com o olhar de design patterns não é questão de pureza acadêmica --- é questão de atrito. Cada função duplicada é um lugar a mais para corrigir o mesmo bug. Cada interface gorda é um mock maior para escrever no teste. Cada sentinela duplicado é um `||` a mais no handler.

O mais revelador foi a correção 4: 72 blocos idênticos. Nenhum deles estava "errado". Cada um, isoladamente, era perfeitamente razoável --- um handler que verifica se o erro é `NotFound` e retorna 404. Mas quando você lê o arquivo pela vigésima vez e vê o mesmo padrão, algo está errado. Não no código --- na inércia. A inércia de não parar para extrair o padrão porque "são só 4 linhas".

Quatro linhas vezes 72. Quase 300 linhas de código que diziam exatamente a mesma coisa.

A maioria dos guias de clean code fala sobre grandes refatorações arquiteturais --- extrair microsserviços, inverter dependências, introduzir camadas de abstração. Mas as correções que fiz aqui foram o oposto: remover abstração redundante, unificar conhecimento duplicado, segregar interfaces gordas. Não adicionei nenhuma camada nova. Só limpei o que já estava lá.

O resultado é um código que conta a mesma história com menos palavras. E isso, no fim, é o que DRY, KISS e ISP realmente significam.

> Este artigo foi escrito a partir das 6 correções implementadas no repositório do [Ollanta](https://github.com/scovl/Ollanta). O OpenSpec completo está em `openspec/changes/design-patterns-correction.md`. O artigo anterior da série --- sobre um bug silencioso de concorrência --- está em [fixgo01.md](/post/fixgo01/).
