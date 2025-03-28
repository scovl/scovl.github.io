# Next-level Backends with Rama: Storing and Traversing Graphs in 60 LOC

## Introdução ao Rama

Rama é uma plataforma que permite a criação de backends escaláveis com uma quantidade mínima de código. Sistemas que normalmente exigiriam milhares de linhas de código podem ser implementados em algumas dezenas de linhas, oferecendo:

- Escalabilidade para milhões de leituras/escritas por segundo
- Conformidade ACID
- Alto desempenho
- Tolerância a falhas através de replicação incremental
- Implantação, atualização e escalonamento via simples comandos CLI
- Monitoramento abrangente integrado

## Exemplo: Armazenamento e Travessia de Grafos

Para demonstrar a potência do Rama, vamos analisar a implementação de um backend para armazenamento de grafos e execução de consultas rápidas de travessia. O exemplo específico é uma árvore genealógica, onde cada nó (pessoa) tem dois pais e qualquer número de filhos.

### Definindo o Modelo de Dados

No Rama, os datastores indexados são chamados de [PStates](https://docs.redplanetlabs.com/concepts/pstates.html) ("partitioned state"). Ao contrário de bancos de dados tradicionais com modelos fixos, os PStates permitem infinitos modelos de dados através da composição de estruturas simples:

```clojure
(declare-pstate
  topology
  $$family-tree
  {UUID (fixed-keys-schema
          {:parent1 UUID
           :parent2 UUID
           :name String
           :children #{UUID}})})
```

Na versão Java:

```java
topology.pstate(
  "$$family-tree",
  PState.mapSchema(UUID.class,
                   PState.fixedKeysSchema(
                     "parent1", UUID.class,
                     "parent2", UUID.class,
                     "name", String.class,
                     "children", PState.setSchema(UUID.class)
                     )));
```

Este [PState](https://docs.redplanetlabs.com/concepts/pstates.html) representa uma árvore genealógica onde cada pessoa é identificada por um UUID e possui campos para seus pais, nome e filhos.

### Conceitos do Rama

Um aplicativo Rama é chamado de "módulo" e segue uma arquitetura baseada em eventos:

1. Todos os dados entram através de um log distribuído chamado "depot"
2. Topologias ETL consomem dados desses depots para materializar PStates
3. Clientes interagem com o módulo anexando novos dados ao depot ou consultando PStates

Um módulo é dividido em "tarefas" que rodam em vários processos e nós, permitindo escalonamento horizontal.

### Materializando o PState

Primeiro, definimos o depot que receberá as informações de novas pessoas:

```clojure
(declare-depot setup *people-depot (hash-by :id))
```

Em seguida, implementamos a topologia para consumir dados do depot e materializar o PState:

```clojure
(<<sources topology
  (source> *people-depot :> {:keys [*id *parent1 *parent2] :as *person})
  (local-transform>
    [(keypath *id) (termval (dissoc *person :id))]
    $$family-tree)
  (ops/explode [*parent1 *parent2] :> *parent)
  (|hash *parent)
  (local-transform>
    [(keypath *parent) :children NONE-ELEM (termval *id)]
    $$family-tree))
```

Este código:
1. Cria um novo nó para a pessoa com seus atributos
2. Atualiza cada pai para listar a nova pessoa como filho
3. Utiliza particionamento para garantir eficiência e paralelismo

### Implementando Consultas de Travessia de Grafo

As duas consultas implementadas são:
1. Encontrar todos os ancestrais de uma pessoa dentro de N gerações
2. Contar quantos descendentes diretos uma pessoa tem em cada geração sucessiva

#### Consulta de Ancestrais

A implementação usa um loop que examina iterativamente os pais de um nó:

```clojure
(<<query-topology topologies "ancestors"
  [*start-id *num-generations :> *ancestors]
  (loop<- [*id *start-id
           *generation 0
           :> *ancestor]
    (filter> (<= *generation *num-generations))
    (|hash *id)
    (local-select> [(keypath *id) (multi-path :parent1 :parent2) some?]
      $$family-tree
      :> *parent)
    (:> *parent)
    (continue> *parent (inc *generation)))
  (|origin)
  (aggs/+set-agg *ancestor :> *ancestors))
```

Esta implementação:
1. Inicia com o ID fornecido e geração 0
2. Verifica se ainda está dentro do limite de gerações
3. Recupera os pais do nó atual
4. Continua a travessia com cada pai, incrementando a contagem de gerações
5. Agrega todos os ancestrais encontrados em um conjunto

#### Consulta de Contagem de Descendentes

Similar à consulta anterior, mas percorre os filhos e conta por geração:

```clojure
(<<query-topology topologies "descendants-count"
  [*start-id *num-generations :> *result]
  (loop<- [*id *start-id
           *generation 0 :> *gen *count]
    (filter> (< *generation *num-generations))
    (|hash *id)
    (local-select> [(keypath *id) :children] $$family-tree :> *children)
    (:> *generation (count *children))
    (ops/explode *children :> *c)
    (continue> *c (inc *generation)))
  (|origin)
  (+compound {*gen (aggs/+sum *count)} :> *result))
```

O resultado é um mapa de números de geração para contagens de descendentes.

## Conclusão

Com Rama, é possível construir o equivalente a um banco de dados de grafos personalizado em apenas 60 linhas de código. Não há trabalho adicional necessário para implantação, atualização e escalonamento, pois tudo está integrado.

A arquitetura baseada em eventos do Rama proporciona:
- Log de auditoria de todas as mudanças
- Capacidade de recomputar PStates (útil em caso de bugs que corrompam dados)
- Tolerância a falhas superior a abordagens alternativas

O Rama é gratuito para clusters de produção com até dois nós e pode ser baixado no site da Red Planet Labs. 