+++
title = "Clojure Sessions01"
description = "Three Little Pigs"
date = 2024-07-19T19:00:00-00:00
tags = ["OOP","software","engineering", "Clojure"]
draft = false
weight = 5
+++

# Table of Contents
* **[Introdução](#introdução)**
* [Iniciando um Projeto com Leiningen](#iniciando-um-projeto-com-leiningen)
  - [Passo 1: Criando um novo projeto](#passo-1-criando-um-novo-projeto)
  - [Passo 2: Estrutura do Projeto](#passo-2-estrutura-do-projeto)
  - [Passo 3: Escrevendo a História dos Três Porquinhos](#passo-3-escrevendo-a-história-dos-três-porquinhos)
  - [Passo 4: Executando o Projeto](#passo-4-executando-o-projeto)
  - [Passo 5: Gerando um JAR Executável](#passo-5-gerando-um-jar-executável)
  - [Passo 6: Usando o REPL](#passo-6-usando-o-repl)
* [Def e Defn: Entendendo as Diferenças](#def-e-defn-entendendo-as-diferenças)
* [Natureza e Uso de Def e Defn](#natureza-e-uso-de-def-e-defn)
* [100daysofcode](#100daysofcode)

### Introdução

Já pensou em começar a estudar alguma linguagem de programação funcional? Que tal começar agora? Você pode escolher qualquer uma, mas eu optarei pelo Clojure devido à minha afinidade com Java e Lisp, o que torna essa escolha mais conveniente. Mas, antes de começarmos, certifique-se de ter o **[Clojure](https://clojure.org/guides/install_clojure)** e o **[Leiningen](https://leiningen.org/#install)** instalados em seu sistema. Siga os links para as instruções de instalação. Este é um exercício simples e divertido de aplicar. Então vamos começar:

## Iniciando um Projeto com Leiningen

### Passo 1: Criando um novo projeto

Para criar um novo projeto com Leiningen, abra seu terminal e digite o seguinte comando:

```shell
lein new app three-little-pigs
```

Esse comando criará uma nova estrutura de projeto chamada `three-little-pigs`. O `lein new app <nome-do-projeto>` é usado para gerar um novo projeto Clojure com uma estrutura básica de diretórios e arquivos necessários para começar a desenvolver.

### Passo 2: Estrutura do Projeto

Navegue até a pasta do projeto que acabamos de criar:

Uma vez dentro da pasta, você verá a seguinte estrutura de diretórios:

```bash
three-little-pigs/
├── CHANGELOG.md
├── LICENSE
├── README.md
├── doc
│   └── intro.md
├── project.clj
├── resources
├── src
│   └── three_little_pigs
│       └── core.clj
├── target
└── test
    └── three_little_pigs
        └── core_test.clj
```

Nosso código principal será escrito no arquivo `src/three_little_pigs/core.clj`. Esse arquivo é onde colocaremos a lógica do nosso programa.

### Passo 3: Escrevendo a História dos Três Porquinhos

Abra o arquivo `src/three_little_pigs/core.clj` em seu editor de texto preferido e substitua o conteúdo com o seguinte código:

```clojure
(ns three-little-pigs.core)

(defn build-house [material]
  (str "O porquinho construiu uma casa de " material "."))

(defn pig-activity [pig material]
  (str pig " decidiu construir uma casa. " (build-house material)))

(defn wolf-action [house]
  (str "O lobo veio, soprou e derrubou a casa de " house "."))

(defn story []
  (let [pig1 (pig-activity "O primeiro porquinho" "palha")
        pig2 (pig-activity "O segundo porquinho" "madeira")
        pig3 (pig-activity "O terceiro porquinho" "tijolos")
        wolf1 (wolf-action "palha")
        wolf2 (wolf-action "madeira")
        wolf3 "O lobo não conseguiu derrubar a casa de tijolos."
        conclusion "A casa de tijolos do terceiro porquinho os salvou."]
    (str pig1 "\n" pig2 "\n" pig3 "\n" wolf1 "\n" wolf2 "\n" wolf3 "\n" conclusion)))

(defn -main []
  (println (story)))
```

### Passo 4: Executando o Projeto

Para executar o nosso projeto e ver a história dos Três Porquinhos em ação, volte ao terminal e execute o seguinte comando:

```shell
lein run
```

O comando `lein run` compila e executa o projeto, mostrando a saída no terminal. Você verá a história completa dos Três Porquinhos no terminal:

```bash
O primeiro porquinho decidiu construir uma casa. O porquinho construiu uma casa de palha.
O segundo porquinho decidiu construir uma casa. O porquinho construiu uma casa de madeira.
O terceiro porquinho decidiu construir uma casa. O porquinho construiu uma casa de tijolos.
O lobo veio, soprou e derrubou a casa de palha.
O lobo veio, soprou e derrubou a casa de madeira.
O lobo não conseguiu derrubar a casa de tijolos.
A casa de tijolos do terceiro porquinho os salvou.
```

### Passo 5: Gerando um JAR Executável

Usar `lein run` é ótimo para testar seu código, mas e se você quiser compartilhar seu trabalho com pessoas que não têm Leiningen instalado? Para isso, você pode criar um arquivo JAR independente que qualquer pessoa com Java instalado (basicamente todo mundo) pode executar. Para criar o arquivo, execute o seguinte comando:

```shell
lein uberjar
```

Este comando cria o arquivo `target/uberjar/three-little-pigs-0.1.0-SNAPSHOT-standalone.jar`. Você pode executá-lo com Java usando o comando:

```shell
java -jar target/uberjar/three-little-pigs-0.1.0-SNAPSHOT-standalone.jar
```

Agora, você tem um programa Clojure que pode ser distribuído e executado em quase qualquer plataforma.

### Passo 6: Usando o REPL

O REPL (Read-Eval-Print Loop) é uma ferramenta poderosa para experimentar com código. Ele permite que você interaja com um programa em execução e teste rapidamente ideias. Para iniciar um REPL, execute o seguinte comando:

```bash
lein repl
```

A saída deve ser algo assim:

```bash
nREPL server started on port 54015 on host 127.0.0.1 - nrepl://127.0.0.1:54015
REPL-y 0.5.1, nREPL 1.0.0
Clojure 1.11.1
OpenJDK 64-Bit Server VM 22.0.1+8-16
    Docs: (doc function-name-here)
          (find-doc "part-of-name-here")
  Source: (source function-name-here)
 Javadoc: (javadoc java-object-or-class-here)
    Exit: Control+D or (exit) or (quit)
 Results: Stored in vars *1, *2, *3, an exception in *e
```

O prompt `three-little-pigs.core=>` indica que você está no namespace `three-little-pigs.core`. Agora você pode executar funções definidas no seu código:

```clojure
three-little-pigs.core=> (-main)
```

Você verá a saída:

```bash
O primeiro porquinho decidiu construir uma casa. O porquinho construiu uma casa de palha.
O segundo porquinho decidiu construir uma casa. O porquinho construiu uma casa de madeira.
O terceiro porquinho decidiu construir uma casa. O porquinho construiu uma casa de tijolos.
O lobo veio, soprou e derrubou a casa de palha.
O lobo veio, soprou e derrubou a casa de madeira.
O lobo não conseguiu derrubar a casa de tijolos.
A casa de tijolos do terceiro porquinho os salvou.
nil
```

Em Clojure, assim como em muitas outras linguagens de programação, funções sempre retornam algum valor. Quando uma função não tem um retorno explícito especificado, ou quando a última expressão avaliada não retorna um valor significativo para o contexto do programa, `nil` é retornado. nil é usado em Clojure para representar a ausência de um valor. Experimente algumas funções básicas do Clojure:

```clojure
clojure-noob.core=> (+ 1 2 3 4)
10
clojure-noob.core=> (* 1 2 3 4)
24
clojure-noob.core=> (first [1 2 3 4])
1
```

Usar o REPL permite um ciclo de feedback rápido.

### Def e Defn

Neste projeto específico, poderíamos usar `def` para definir constantes ou variáveis globais que poderiam ser usadas em todo o código. Por exemplo, se houvesse um elemento recorrente ou um valor que não muda, como o nome do lobo ou tipos de material utilizados na construção das casas, `def` seria apropriado. Exemplo:

```clojure
(def lobo "O lobo")
(def materiais ["palha" "madeira" "tijolos"])
```

Aqui, `lobo` armazena o nome do personagem constante em toda a história, e `materiais` poderia ser uma lista de materiais usados pelos porquinhos, acessível em qualquer parte do programa.

### Natureza e Uso

- **Natureza:** `def` no código poderia ser usado para dados estáticos que não mudam, proporcionando fácil referência em todo o código. `defn`, por outro lado, encapsula blocos de lógica que são executados repetidamente, como ações de personagens.
- **Visibilidade:** Tanto `def` quanto `defn` criam símbolos globais, mas `defn` facilita a organização ao agrupar lógicas de procedimentos sob um nome de função, que pode ser chamado em qualquer parte do código.
- **Flexibilidade:** `def` proporciona a flexibilidade de armazenar qualquer tipo de dado, enquanto `defn` estrutura as ações que o programa pode executar, essencialmente moldando o comportamento interativo do código.

Agora que você viu como criar um projeto simples em Clojure usando o Leiningen e desenvolver um programa funcional, que tal explorar ainda mais? Experimente adicionar `def` para definir constantes ou variáveis globais que poderiam ser usadas em todo o código, como nomes de personagens ou elementos da história. Isso não só enriquecerá seu projeto, mas também ajudará a entender melhor como organizar e modularizar seu código.

### 100daysofcode

Depois de concluir seu projeto, uma excelente forma de manter o aprendizado e obter feedback é compartilhá-lo no GitHub. Além disso, considere aderir ao desafio #100DaysOfCode. Esse desafio incentiva você a codificar todos os dias por 100 dias consecutivos, o que pode significativamente acelerar seu aprendizado em programação, especialmente em novas linguagens e paradigmas.

Para quem está começando com Clojure e deseja uma leitura acessível e informativa, recomendo o livro *Clojure for the Brave and True* de Daniel Higginbotham. Este livro oferece uma introdução clara e divertida ao mundo de Clojure, cobrindo desde os conceitos básicos até técnicas mais avançadas, com exemplos práticos para ajudar você a praticar. Você pode encontrar mais informações sobre o livro e recursos adicionais no [site oficial do livro](https://www.braveclojure.com/).
