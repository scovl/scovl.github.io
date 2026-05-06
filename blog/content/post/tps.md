+++
title = "A Batalha dos Milissegundos"
description = "Quando uma arquitetura atinge a marca de dezenas ou centenas de milhares de Transações Por Segundo (TPS), as regras do jogo mudam."
date = 2026-05-05T19:41:45-03:00
tags = ["performance", "latência", "compressão", "protobuf", "zstd", "arquitetura de software"]
draft = false
weight = 1
author = "Vitor Lobo Ramos"
+++

## Como reduzi 62 consultas ao banco para 4 e ganhamos 8× de throughput

Quando você atinge dezenas de milhares de transações por segundo, a pergunta mais perigosa que você pode fazer é _"qual formato de serialização devo usar?"_. Não porque a resposta seja irrelevante, mas porque ela quase nunca é o gargalo real.

Esta é a história de como, durante o desenvolvimento do **[Ollanta](https://github.com/scovl/Ollanta)**, uma plataforma de análise estática multilinguagem escrita em Go, eu quase caí na armadilha de otimizar o problema errado.

<img src="https://github.com/scovl/Ollanta/raw/main/docs/imgs/logo-dark.png" alt="ollanta" width="250" style="display: block; margin: 1em auto;" />

O cenário: milhares de scanners enviando relatórios de análise para um servidor central. Cada relatório contém métricas, issues e snapshots de código. O servidor precisa ingerir, avaliar quality gates, persistir e indexar — tudo em segundos, com centenas de milhares de projetos acumulados ao longo do tempo.

A primeira reação de qualquer engenheiro diante de "payloads JSON de 8 MB chegando via HTTP" é: **"preciso comprimir isso"**. E está certo. Mas essa é a porta de entrada para a armadilha.

## A armadilha: otimizar o problema visível

O fluxo de ingestão de um scan no Ollanta tinha este pipeline:

```
Scanner → POST JSON (8 MB) → Servidor → 9 passos de ingestão → PostgreSQL
```

Medi o tempo de cada etapa. O upload do JSON levava ~640ms em uma rede 100 Mbps. Habilitei Gzip condicional (payloads > 1KB) e o upload caiu para ~64ms. Ganho de **576ms**. Satisfatório. Mas a latência total do pipeline ainda estava em ~800ms. Onde estavam os outros 736ms?

| Etapa | Antes | Depois do Gzip | Ganho |
|-------|-------|---------------|-------|
| Upload do JSON | 640ms | 64ms | **576ms** |
| Inserir 20 métricas (row-by-row) | 200ms | 200ms | 0ms |
| UPSERT live measures (20 queries) | 180ms | 180ms | 0ms |
| UPSERT daily rollup (20 queries) | 180ms | 180ms | 0ms |
| **DB round-trips por scan** | **62** | **62** | **0** |

O Gzip resolveu o problema de rede. Mas **62 consultas ao PostgreSQL por scan** estavam consumindo 560ms, quase 10× mais que o upload comprimido. O verdadeiro gargalo não era a rede. Era o banco de dados.

## A solução: COPY protocol e batch UPSERT

O PostgreSQL tem um protocolo de bulk insert chamado **COPY** que é até 50× mais rápido que INSERTs individuais. Em vez de 20 INSERTs dentro de uma transação, um único comando `COPY` envia todas as linhas de uma vez:

```go
// Antes: 20 round-trips
for _, m := range measures {
    tx.Exec(ctx, `INSERT INTO measures (...) VALUES ($1, $2, ...)`, ...)
}

// Depois: 1 round-trip
conn.CopyFrom(ctx,
    pgx.Identifier{"measures"},
    []string{"scan_id", "project_id", "metric_key", "component_path", "value"},
    pgx.CopyFromRows(rows),
)
```

Para os UPSERTs de `live_measures` e `measure_daily_aggregates`, troquei 20 queries individuais por uma única consulta com `unnest()`:

```sql
-- Antes: 20 queries, uma por métrica
INSERT INTO live_measures (...) VALUES ($1, $2, $3, ...) ON CONFLICT ...;
INSERT INTO live_measures (...) VALUES ($1, $2, $3, ...) ON CONFLICT ...;
...

-- Depois: 1 query para todas as 20 métricas
INSERT INTO live_measures (project_id, component_path, metric_key, value, scan_id)
SELECT $1, '', unnest($2::text[]), unnest($3::numeric[]), $4
ON CONFLICT (project_id, component_path, metric_key)
DO UPDATE SET value = EXCLUDED.value, scan_id = EXCLUDED.scan_id, updated_at = now()
```

Resultado:

| Etapa | Antes (round-trips) | Depois (round-trips) | Ganho de latência |
|-------|---------------------|---------------------|-------------------|
| Bulk insert issues | 1 (COPY) | 1 (COPY) | — já otimizado |
| Bulk insert measures | 20 | 1 | ~190ms |
| Live measures UPSERT | 20 | 1 | ~170ms |
| Daily rollup UPSERT | 20 | 1 | ~170ms |
| Search indexing | 1 (bulk API) | 1 (bulk API) | — já otimizado |
| **Total** | **62** | **5** | **~530ms** |

**Redução de 62 consultas para 5.** Uma economia de ~530ms por scan, sem mudar uma linha de infraestrutura. Compare com a alternativa de trocar JSON por Protobuf:

| Otimização | Ganho por scan | Complexidade |
|------------|---------------|--------------|
| COPY + batch UPSERT | **~200ms** (DB) | Baixa (pgx nativo) |
| Gzip condicional | ~576ms (rede) | Baixa (stdlib) |
| Protobuf em vez de JSON | ~50ms (serialização) | Alta (.proto, codegen) |
| Zstd em vez de Gzip | ~5ms (compressão) | Média (dependência externa) |

Somando tudo, o pipeline passou de ~800ms para **~99ms por scan** — uma redução de **8×**. E 80% desse ganho veio da otimização do banco de dados, não do formato de serialização.

## A cereja do bolo: goroutine pool

Com o pipeline mais rápido, o próximo gargalo era o **throughput**: um único worker processando scans sequencialmente. A solução foi um pool de goroutines com claim atômico no PostgreSQL:

```go
wp := 4 // configurável via OLLANTA_WORKER_POOL
for i := 0; i < wp; i++ {
    go func(id int) {
        for {
            job, _ := repo.ClaimNext(ctx, workerID) // FOR UPDATE SKIP LOCKED
            processJob(ctx, job)
        }
    }(i)
}
```

Cada goroutine faz `SELECT ... FOR UPDATE SKIP LOCKED` — o PostgreSQL garante que duas goroutines nunca peguem o mesmo job. O pool é configurável: de 1 (desenvolvimento) a 32 (produção com 200k+ projetos).

Com 8 goroutines, o throughput multiplicou por **8×**. Combinado com a redução de 8× na latência por scan, o sistema passou a processar **~64× mais scans por minuto** do que a versão original.

## O que eu NÃO fiz — e por quê

### Não usei Protobuf

Protobuf reduziria o tempo de serialização de ~15ms para ~3ms. Mas:
- O gargalo real era o banco (560ms), não a serialização (15ms)
- Exigiria arquivos `.proto`, codegen, pipeline de build adicional
- Perderia a debugabilidade: `curl | jq` vira `protoc --decode_raw`
- Para o volume do Ollanta (PRs, análise incremental), o ganho de 12ms não justifica

### Não usei Zstd

Zstd é 3× mais rápido que Gzip na compressão. Mas:
- Gzip já reduziu o upload de 640ms para 64ms — o problema estava resolvido
- Zstd exigiria dependência externa (`klauspost/compress`) enquanto Gzip é stdlib
- O `Content-Encoding: zstd` não é universalmente suportado por proxies e CDNs
- 5ms de ganho não justificam o risco operacional

### Não usei Elasticsearch embutido

O SonarQube embute Elasticsearch como sub-processo JVM. Isso impede escalonamento horizontal (single-writer), compete por RAM/CPU com a aplicação, e faz o boot demorar **6 horas ou mais** com 200k projetos (rebuild completo do índice).

No Ollanta, o search (ZincSearch ou PostgreSQL FTS) é um serviço externo. O boot é instantâneo (~2 segundos). Se o search cair, a aplicação continua funcionando com fallback para PostgreSQL FTS.

## A lição

A tabela que resume tudo:

| Otimização | Ganho real | Complexidade | Valeu a pena? |
|------------|-----------|--------------|---------------|
| COPY protocol (medidas) | 190ms | 10 linhas | ✅ |
| Batch UPSERT (2 operações) | 340ms | 15 linhas | ✅ |
| Goroutine pool (N workers) | 8× throughput | 20 linhas | ✅ |
| Gzip condicional | 576ms | 5 linhas | ✅ |
| Protobuf | 12ms | 200+ linhas + codegen | ❌ |
| Zstd | 5ms | nova dependência | ❌ |

**80% do ganho com 20% da complexidade.** Essa é a regra. Perfile antes de otimizar. Ache o gargalo real antes de escolher a ferramenta. No meu caso, o gargalo era o banco de dados, não o formato de serialização. Se eu tivesse implementado Protobuf primeiro, teria gasto dias para ganhar 12ms — enquanto 530ms estavam esperando para serem economizados com algumas queries SQL bem escritas.

Da próxima vez que alguém te disser "você deveria usar Protobuf para performance", pergunte: **"você já mediu onde está o gargalo?"**

---

### Referências

- [PostgreSQL COPY Protocol](https://www.postgresql.org/docs/current/sql-copy.html) — bulk insert 50× mais rápido
- [pgx CopyFrom](https://github.com/jackc/pgx) — driver Go com suporte nativo a COPY
- [PostgreSQL FOR UPDATE SKIP LOCKED](https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE) — claim atômico para workers paralelos
- [Ollanta no GitHub](https://github.com/scovl/Ollanta) — plataforma de análise estática open source
- [SonarQube Architecture](https://docs.sonarsource.com/sonarqube/latest/architecture/) — referência de comparação arquitetural
