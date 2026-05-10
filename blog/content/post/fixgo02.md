+++
title = "O predicado que ninguém chamou"
description = "Como uma linha de código ausente fez 20 regras de análise estática produzirem centenas de falsos positivos por meses"
date = 2026-05-08T18:40:00-03:00
tags = ["Go", "tree-sitter", "static-analysis", "ollanta", "CGo"]
draft = false
weight = 1
author = "Vitor Lobo Ramos"
+++


O [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) é uma biblioteca que produz árvores sintáticas concretas para dezenas de linguagens. Diferente de um parser tradicional que produz AST, tree-sitter foi projetado para editores de código e ele é incremental, tolerante a erros e capaz de reanalisar um arquivo em milissegundos após uma edição. O [Neovim](https://neovim.io/), [Atom](https://atom.io/) (RIP), [Zed](https://zed.dev/) e o próprio [GitHub](https://github.blog/engineering/user-experience/remodeling-the-github-code-editor/) usam tree-sitter para syntax highlighting, folding e code navigation.

O [Ollanta](https://github.com/scovl/ollanta) usa tree-sitter de uma forma diferente: para **análise estática**. Em vez de realçar sintaxe, ele usa S-expressions para detectar padrões problemáticos no código-fonte:

```scheme
;; Encontra chamadas a eval() em JavaScript
(call_expression
  function: (identifier) @eval
  (#eq? @eval "eval")
) @expr
```

Essa query diz: "encontre toda `call_expression` cuja função seja um identificador de nome `eval`". O `(#eq? @eval "eval")` é um **predicado**. Isto é, uma condição extra que filtra matches estruturais pelo texto do nó capturado. Sem ele, qualquer chamada de função (de `console.log` a `fetch`) seria um match.

> **Importante:** em computação e lógica matemática, **predicado** é a tradução oficial e consagrada para _predicate_. Refere-se especificamente a uma expressão, condição ou função que é avaliada e retorna um valor booleano (verdadeiro ou falso). Na programação funcional, por exemplo, é padrão falarmos em "passar uma função predicado para o `filter`". 

O termo aparece nas S-expressions do tree-sitter com a sintaxe `(#eq? ...)`, `(#match? ...)`, etc.. são predicados que o motor de queries avalia para decidir se um match estrutural deve ser mantido ou descartado.

E foi exatamente isso que aconteceu. O Ollanta estava reportando `eval()` em cada linha de código JavaScript que continha uma chamada de função. Centenas delas. O `configureProjectFlowFeature({ render })`, `bootBrowserApp()`, `renderView()`, tudo era "eval" para o scanner. Este artigo conta a história de como uma única linha de código ausente transformou 20 regras tree-sitter em geradores de ruído e falsos positivos.

<img src="https://tree-sitter.github.io/tree-sitter/assets/images/tree-sitter-small.png" alt="ollanta" width="250" style="display: block; margin: 1em auto; opacity: 1; transition: opacity 0.3s;">

> **Saiba mais:** tree-sitter foi criado por [Max Brunsfeld](https://github.com/maxbrunsfeld) enquanto trabalhava no [Atom Editor](https://atom.io/). A ideia era substituir o sistema de syntax highlighting baseado em regex do TextMate por um parser real que entendesse a estrutura do código. O resultado foi tão bom que o GitHub adotou para o syntax highlighting do próprio site. A versão em Go que o Ollanta usa é o [go-tree-sitter](https://github.com/smacker/go-tree-sitter), um binding CGo que expõe a API em C da tree-sitter para Go.

## A descoberta

Tudo começou com um usuário (eu mesmo, escaneando o próprio frontend do Ollanta) reportando um número absurdo de issues do tipo `js:detect-eval`:

```bash
critical  Vulnerability
eval() executes arbitrary code and must not be used with untrusted input
app/main.js:L13     js:detect-eval
app/main.js:L14     js:detect-eval
app/main.js:L15     js:detect-eval
...mais 150 linhas...
```

Toda chamada de função em cada arquivo `.js` aparecia como `eval()`. A primeira reação foi verificar o código: será que o frontend realmente tem 150 chamadas a `eval()` escondidas?

```javascript
// app/main.js
configureProjectFlowFeature({ render });
configureActivityFeature({ render });
configureCodeFeature({ render });
```

Zero `eval()` em 682 linhas de código. Falso positivo. Mas o scanner sempre retornando os mesmos resultados. A regra `js:detect-eval` usa a seguinte query tree-sitter:

```go
// detect_eval_javascript.go
query := `(call_expression
  function: (identifier) @eval
  (#eq? @eval "eval")
) @expr`
matches, err := ctx.Query.Run(ctx.ParsedFile, query, ctx.Grammar)
```

O predicado `(#eq? @eval "eval")` deveria garantir que só matches com texto literal `"eval"` fossem retornados. Mas o scanner retornava **todas** as `call_expression`. Duas hipóteses:

1. O parser tree-sitter está quebrado e não reconhece a sintaxe do predicado
2. O `go-tree-sitter` não está avaliando o predicado

Hipótese 1 é fácil de descartar: se o parser não reconhecesse `(#eq?)`, a query nem compilaria.

> **Saiba mais:** o ciclo de vida de uma query tree-sitter começa com **compilação** (`ts_query_new`), que valida a sintaxe da S-expression e dos predicados. Se o predicado for inválido (argumentos errados, tipo errado), a compilação falha com um `QueryError`. Depois, a query é **executada** via cursor (`ts_query_cursor_exec` e `ts_query_cursor_next_match`), que retorna matches **estruturais** — isto é, nós que casam com os padrões da S-expression **independentemente dos predicados**. A **avaliação dos predicados** é responsabilidade do binding em linguagem hospedeira (Go, Python, Rust, etc.), não do C da tree-sitter.

## A biblioteca

O `go-tree-sitter` expõe a API tree-sitter através dessas funções principais:

```go
// bindings.go — smacker/go-tree-sitter

func NewQuery(pattern []byte, lang *Language) (*Query, error)  // compila a query
func (qc *QueryCursor) Exec(q *Query, n *Node)                 // executa no nó raiz
func (qc *QueryCursor) NextMatch() (*QueryMatch, bool)          // itera sobre matches
```

Olhando a documentação, encontrei o método que faltava:

```go
func (qc *QueryCursor) FilterPredicates(m *QueryMatch, input []byte) *QueryMatch
```

Ele existe. Foi implementado com suporte completo a `#eq?`, `#not-eq?`, `#match?`, `#not-match?`. Tem testes e funciona. Mas e o problema? **Ninguém o chamava.**

## O ponto cego

O `QueryRunner` do Ollanta em `ollantaparser/query.go`:

```go
func (qr *QueryRunner) Run(f *ParsedFile, query string, lang Language) ([]QueryMatch, error) {
    q, err := sitter.NewQuery([]byte(query), lang.tsLanguage())
    // ...
    cursor.Exec(q, f.RootNode())

    var matches []QueryMatch
    for {
        m, ok := cursor.NextMatch()
        if !ok {
            break
        }
        qm := QueryMatch{Captures: make(map[string]*sitter.Node, len(m.Captures))}
        for _, cap := range m.Captures {
            name := q.CaptureNameForId(cap.Index)
            qm.Captures[name] = cap.Node
        }
        matches = append(matches, qm)
    }
    return matches, nil
}
```

Perceba que o `NextMatch()` retorna matches estruturais. `FilterPredicates()` filtra pelos predicados. O `Run()` chamava o primeiro e ignorava o segundo. Um `for` que devolve **tudo que estruturalmente casa**, sem aplicar o filtro semântico. Isso afetava **20 regras** que usavam `#eq?` ou `#match?`:

```go
// Detectar eval()
(#eq? @eval "eval")

// Detectar WebSocket
(#eq? @ctor "WebSocket")

// Detectar pickle.load
(#eq? @mod "pickle")
(#match? @func "^(load|loads)$")

// Detectar hashlib.md5
(#eq? @mod "hashlib")
(#match? @func "^(md5|sha1)$")
```

Todas retornando falsos positivos em todas as linguagens. As regras Python (pickle, hashlib, subprocess) e JavaScript (eval, WebSocket, child_process) compartilhavam o mesmo destino: qualquer chamada de função que casasse com a S-expression era reportada, porque o predicado `#eq?` ou `#match?` nunca era avaliado. O binding Go expõe `FilterPredicates` desde que o klothoplatform contribuiu com a implementação, mas o `QueryRunner.Run()` do Ollanta nunca foi atualizado para usá-lo.

## Por que demorei para perceber?

O teste existente para `js:detect-eval`:

```go
func TestTreeSitterSensor_JS_DetectEval(t *testing.T) {
    src := []byte("const r = eval(input);\n")
    s := defaultSensor()
    issues, err := s.Analyze("test.js", src, "javascript", nil)
    // ... verifica se encontrou js:detect-eval
}
```

Testa o caso **positivo** — existe um `eval(input)`, ele é detectado. Mas não testa o caso **negativo** — chamadas que **não** são `eval()` não deveriam ser detectadas.

Sem teste negativo, o bug passou despercebido. Os 35 testes da suíte continuavam verdes porque todos só verificavam a presença de issues, nunca a ausência de falsos positivos. O código que retorna tudo sem filtrar ainda passa no teste, porque `eval(input)` é estruturalmente um `call_expression` com `function: (identifier)` — o match está correto, o filtro é que nunca roda.

> **Saiba mais:** esse fenômeno tem nome: **viés de confirmação** em testes. Quando você só testa que "a feature funciona" mas nunca que "a feature não dispara onde não deveria", você está testando a presença do seu código, não a correção dele. Em análise estática, testes negativos são tão importantes quanto positivos — uma regra que só dispara em código suspeito mas nunca em código limpo é o que separa uma ferramenta utilizável de um gerador de ruído.

## O contraste

O que torna esse bug particularmente insidioso é que, à primeira vista, o código parece correto. A query tree-sitter está certa `(#eq? @eval "eval")` é a sintaxe padrão e compila sem erro. O `QueryRunner` também parece correto — ele recebe uma query, executa contra a árvore sintática e retorna matches. Nada grita "estou faltando um filtro".

A verdade é que o design da API tree-sitter separa **matches estruturais** de **predicados semânticos**. O C da tree-sitter retorna matches brutos o binding é que decide se aplica predicados ou não. Em Python, isso é automático. Em Rust, também. Em Go, depende de você chamar `FilterPredicates` explicitamente. Se você não sabe disso, seu código compila, seus testes passam, e seus usuários recebem 150 falsos positivos.

## A correção

O fluxograma abaixo mostra o caminho que o código percorre desde o arquivo fonte até o resultado da análise. A seta tracejada em vermelho representa o **bug** sem `FilterPredicates`, o match estrutural vira falso positivo. A seta cheia em verde representa a **correção** com `FilterPredicates`, o match é testado contra o predicado e só vira issue se passar:

``` mermaid
graph TD
    A["📄 Código Fonte<br>ex: configure({render})"]:::code --> B["🔧 Tree-sitter Parser"]:::parser
    B --> C{"🔍 NextMatch()<br>Match Estrutural"}:::decision
    
    C -->|"✅ é call_expression? Sim"| D["📦 Match Bruto"]:::raw
    C -->|"❌ Não"| Z["🚫 Ignorado"]:::ignore
    
    D -.->|"⚠️ Sem FilterPredicates<br>O BUG"| E(("❌ Falso Positivo<br>js:detect-eval")):::fp
    
    D ==>|"✅ Com FilterPredicates<br>A CORREÇÃO"| F{"🧪 O predicado é válido?<br>#eq? @eval 'eval'"}:::filter
    
    F ==>|"🚫 Não"| G["✅ Match Descartado"]:::pass
    F ==>|"✅ Sim"| H(("🎯 Verdadeiro Positivo")):::tp

    classDef code fill:#e1f5fe,stroke:#0288d1
    classDef parser fill:#f3e5f5,stroke:#7b1fa2
    classDef decision fill:#fff3e0,stroke:#e65100
    classDef raw fill:#f5f5f5,stroke:#9e9e9e
    classDef ignore fill:#eeeeee,stroke:#bdbdbd
    classDef fp fill:#ffebee,stroke:#c62828
    classDef filter fill:#fff8e1,stroke:#f57f17
    classDef pass fill:#e8f5e9,stroke:#2e7d32
    classDef tp fill:#e8f5e9,stroke:#2e7d32
```

Quatro linhas, um `continue`:

```go
for {
    m, ok := cursor.NextMatch()
    if !ok {
        break
    }
    m = cursor.FilterPredicates(m, f.Source)  // ← linha adicionada
    if len(m.Captures) == 0 {                  // ← linha adicionada
        continue                                // ← linha adicionada
    }                                           // ← linha adicionada (chave)
    qm := QueryMatch{...}
    for _, cap := range m.Captures { ... }
    matches = append(matches, qm)
}
```

O `FilterPredicates` recebe o match bruto e os bytes do arquivo fonte. Ele basicamente faz o seguinte:
1. Obtém os predicados definidos para o padrão que gerou aquele match
2. Para cada predicado `#eq?`, compara o texto do nó capturado com o valor esperado
3. Para `#match?`, compila uma regex e testa contra o texto do nó
4. Retorna um novo match **com as capturas que passaram em TODOS os predicados**

Se nenhuma captura passar, `FilterPredicates` retorna um match vazio (`len(Captures) == 0`), e o loop simplesmente pula para o próximo match. Sem a correção, cada regra com predicado devolvia N matches (N = número de nós que casam estruturalmente). Com a correção, devolve apenas os matches que passam nos predicados — exatamente o que a query pede.

## O diff completo

```bash
// ollantaparser/query.go — Run()
  for {
      m, ok := cursor.NextMatch()
      if !ok {
          break
      }
+     m = cursor.FilterPredicates(m, f.Source)
+     if len(m.Captures) == 0 {
+         continue
+     }
      qm := QueryMatch{...}
      for _, cap := range m.Captures {
          name := q.CaptureNameForId(cap.Index)
          qm.Captures[name] = cap.Node
      }
      matches = append(matches, qm)
  }
```

```bash
// ollantarules/languages/treesitter/sensor_test.go
+ func TestTreeSitterSensor_JS_DetectEval_NoFalsePositive(t *testing.T)
+ func TestTreeSitterSensor_JS_DetectEval_NoFalsePositiveOtherCalls(t *testing.T)
+ func TestTreeSitterSensor_PY_DangerousSubprocess_NoFalsePositive(t *testing.T)
```

Três testes negativos que verificam que as regras **não** disparam onde não devem. Isso garante que, se alguém no futuro remover ou quebrar o `FilterPredicates`, os testes vão falhar imediatamente — não mais na mão do usuário.

## Por que isso é um padrão de erro comum?

Esse bug não é um bug específico do Ollanta. É um sintoma de um problema clássico de design conhecido como **[acoplamento temporal](https://medium.com/itautech/hands-on-o-que-%C3%A9-acoplamento-temporal-e-como-solucion%C3%A1-lo-5ef31d37ca0d)** (temporal coupling).

O diagrama de sequência abaixo mostra a conversa entre as três camadas envolvidas. O Ollanta chama o binding, que chama o C. O C devolve um match bruto, e o binding o repassa sem filtrar. O ponto crítico está na nota "Ponto de Falha": depois que `NextMatch()` retorna, a API **permite** que o código prossiga sem chamar `FilterPredicates`. Não há erro, não há exceção, eu simplesmente sigo em frente e trato o match bruto como resultado final. A correção (em verde no diagrama) é o passo esquecido de chamar `FilterPredicates` antes de aceitar o match:

``` mermaid
sequenceDiagram
    participant Dev as 🧑‍💻 Ollanta (Go)
    participant Bind as 🔗 go-tree-sitter
    participant C as ⚙️ Tree-sitter (C)

    Dev->>Bind: Run(query)
    Bind->>C: ts_query_cursor_exec()
    
    loop 🔄 Todo match estrutural
        Dev->>Bind: NextMatch()
        Bind->>C: ts_query_cursor_next_match()
        C-->>Bind: 📦 Match Bruto
        Bind-->>Dev: QueryMatch (Ignora Predicados)

        Note right of Dev: ⚠️ Ponto de Falha:<br/>A API permite que o Dev<br/>prossiga sem filtrar.

        opt ✅ A Correção (Passo Esquecido)
            Dev->>Bind: FilterPredicates(QueryMatch)
            Bind-->>Dev: 🚫 Match Vazio (Filtro Falhou)
        end
    end
```

A operação principal (`NextMatch`) retorna resultados incompletos, e uma operação secundária (`FilterPredicates`) precisa ser chamada na sequência para valida-los mas não há aviso ou erro se você simplesmente esquecer. É uma API que esconde uma armadilha em vez de tornar o código correto a opção mais fácil. Algumas heurísticas que adotei depois dessa descoberta:

**1. Para cada regra, adicione um teste negativo**

Um teste positivo comprova que a regra detecta código ruim. Um teste negativo comprova que ela não incomoda código bom. Ambos são necessários:

```go
// Testa detecção
src := []byte("eval(input)")
// → deve retornar issue

// Testa silêncio
src := []byte("configureFeature({ render })")
// → NÃO deve retornar issue
```

**2. APIs que exigem um passo extra deveriam ser um `must`**

Se `NextMatch()` sempre precisa ser seguido de `FilterPredicates()`, talvez o método correto seja `NextFilteredMatch()` que já aplica os predicados. Ou, no mínimo, uma documentação que grite "VOCÊ PRECISA CHAMAR FILTERPREDICATES DEPOIS DE NEXTMATCH". No Ollanta, a correção ideal seria fazer o `QueryRunner.Run` já retornar matches filtrados — encapsulando o padrão para que ninguém mais esqueça.

**3. Leia o binding, não só a documentação da lib original**

A documentação do tree-sitter C diz "predicates are not evaluated by default". Mas quem lê a documentação do tree-sitter C quando está programando em Go? O binding `go-tree-sitter` tem uma implementação completa de `FilterPredicates`, mas ela só funciona se você souber que ela existe. Quando você usa uma biblioteca via CGo, o contrato da API é o que o binding Go expõe, não o que o C original faz. Leia a fonte do binding.

## O que aprendi com isso

- **`QueryRunner.Run()`** — antes retornava matches estruturais; depois retorna matches **filtrados por predicados**.
- **150 falsos positivos de `detect-eval` por scan** — depois 0 (o código não tem `eval()`).
- **20 regras com `#eq?`/`#match?`** — antes geravam ruído; depois todas silenciosas onde deveriam ser.
- **Testes** — antes só verificavam presença de issues; depois verificam presença **e** ausência.

A linha `m = cursor.FilterPredicates(m, f.Source)` não é complexa. Não envolve algoritmos, estruturas de dados ou padrões de concorrência. É uma chamada de método que faltava e que, por faltar, transformou um analisador estático em um gerador de ruídos.

> Este artigo foi escrito a partir de uma correção real no repositório do [Ollanta](https://github.com/scovl/Ollanta). O diff completo está em [https://github.com/scovl/Ollanta/commit/0a73aa2ec05c1dfa7c7a0b0e750cb05c841cb4f9](https://github.com/scovl/Ollanta/commit/0a73aa2ec05c1dfa7c7a0b0e750cb05c841cb4f9).
