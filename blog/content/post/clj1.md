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
* [Def e Defn: Entendendo as Diferenças](#def-e-defn-entendendo-as-diferenças)
* [Natureza e Uso de Def e Defn](#natureza-e-uso-de-def-e-defn)
* [100daysofcode](#100daysofcode)


# Introdução
Já pensou em começar a estudar alguma linguagem de programação funcional? Que tal começar agora? Você pode escolher qualquer uma, mas eu optarei pelo Clojure devido à minha afinidade com Java e Lisp, o que torna essa escolha mais conveniente. Mas, antes de começarmos, certifique-se de ter o [Clojure](https://clojure.org/guides/install_clojure) e o [Leiningen](https://leiningen.org/#install) instalados em seu sistema. Siga os links para as instruções de instalação. Este é um exercício simples e divertido de aplicar. Então vamos começar:

# Iniciando um Projeto com Leiningen

### Passo 1: Criando um novo projeto

Para criar um novo projeto com Leiningen, abra seu terminal e digite o seguinte comando:

```bash
lein new app three-little-pigs
```

Esse comando criará uma nova estrutura de projeto chamada `three-little-pigs`. O `lein new app <nome-do-projeto>` é usado para gerar um novo projeto Clojure com uma estrutura básica de diretórios e arquivos necessários para começar a desenvolver.

### Passo 2: Estrutura do Projeto

Navegue até a pasta do projeto que acabamos de criar:

```bash
cd three-little-pigs
```

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

Abra o arquivo `src/three_little_pigs/core.clj` em seu editor de texto preferido e substitua o conteúdo com o seguinte código (não copie, escreva):

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

Aqui está uma explicação detalhada de cada parte do código:

- `(ns three-little-pigs.core)`: Define um novo namespace chamado `three-little-pigs.core`, que agrupa funções relacionadas.

Quando você declara `(ns three-little-pigs.core)` em Clojure, está fazendo o seguinte:

1. **Criando ou Especificando um Espaço**: Você está dizendo ao Clojure "Vou trabalhar dentro de um espaço chamado `three-little-pigs.core`". Tudo o que você definir ou usar dentro deste arquivo será parte deste espaço.
2. **Evitando Conflitos**: Se em outra parte do seu projeto Clojure você tiver outro namespace, como `three-little-pigs.utils`, ele pode ter funções com o mesmo nome que as do `three-little-pigs.core` sem causar confusão ou erros, pois eles estão em "pastas" diferentes.
3. **Organização**: Ajuda a manter seu código organizado e claro. Por exemplo, funções relacionadas à lógica principal da história dos Três Porquinhos ficam no `three-little-pigs.core`, enquanto utilitários ou funções auxiliares podem estar em outro namespace como `three-little-pigs.utils`.

Em suma, ao usar `(ns three-little-pigs.core)`, você está essencialmente preparando o terreno para escrever seu código em um local específico que é isolado e bem organizado, evitando problemas e facilitando a manutenção e a expansão do seu programa. É como se você estivesse etiquetando uma pasta grande para dizer "Aqui dentro está tudo relacionado ao coração da história dos Três Porquinhos!

- `(defn build-house [material] ...)`: Define uma função `build-house` que aceita um material e retorna uma string descrevendo a construção da casa.
- `(defn pig-activity [pig material] ...)`: Define uma função `pig-activity` que aceita o nome de um porquinho e o material para construir a casa, combinando essas informações.
- `(defn wolf-action [house] ...)`: Define uma função `wolf-action` que descreve a ação do lobo ao soprar a casa.
- `(defn story [] ...)`: Define a função `story` que monta toda a história dos três porquinhos, usando as funções anteriores.
- `(defn -main [] ...)`: Define a função `-main` que imprime a história quando o programa é executado.

### Passo 4: Executando o Projeto

Para executar o nosso projeto e ver a história dos Três Porquinhos em ação, volte ao terminal e execute o seguinte comando:

```bash
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

### def e defn

Neste projeto específico, poderíamos usar `def` para definir constantes ou variáveis globais que poderiam ser usadas em todo o código. Por exemplo, se houvesse um elemento recorrente ou um valor que não muda, como o nome do lobo ou tipos de material utilizados na construção das casas, `def` seria apropriado. Exemplo:

  ```clojure
  (def lobo "O lobo")
  (def materiais ["palha" "madeira" "tijolos"])
  ```

  Aqui, `lobo` armazena o nome do personagem constante em toda a história, e `materiais` poderia ser uma lista de materiais usados pelos porquinhos, acessível em qualquer parte do programa.

- **`defn`**: No código `three-little-pigs`, `defn` é usado para definir funções que representam as ações dos personagens ou o fluxo da história. Cada função executa uma tarefa específica, como construir uma casa ou realizar a ação do lobo.

  ```clojure
  (defn build-house [material]
    (str "O porquinho construiu uma casa de " material "."))

  (defn pig-activity [pig material]
    (str pig " decidiu construir uma casa. " (build-house material)))

  (defn wolf-action [house]
    (str "O lobo veio, soprou e derrubou a casa de " house "."))
  ```

 A função `build-house` aceita um material como argumento e retorna uma string descrevendo a construção da casa. `pig-activity` combina a ação de um porquinho escolhendo um material e usando `build-house` para construir a casa. `wolf-action` descreve a ação do lobo em relação às casas construídas.

### Natureza e Uso

- **Natureza**: `def` no código poderia ser usado para dados estáticos que não mudam, proporcionando fácil referência em todo o código. `defn`, por outro lado, encapsula blocos de lógica que são executados repetidamente, como ações de personagens.
- **Visibilidade**: Tanto `def` quanto `defn` criam símbolos globais, mas `defn` facilita a organização ao agrupar lógicas de procedimentos sob um nome de função, que pode ser chamado em qualquer parte do código.
- **Flexibilidade**: `def` proporciona a flexibilidade de armazenar qualquer tipo de dado, enquanto `defn` estrutura as ações que o programa pode executar, essencialmente moldando o comportamento interativo do código.

Agora que você viu como criar um projeto simples em Clojure usando o Leiningen e desenvolver um programa funcional, que tal explorar ainda mais? Experimente adicionar `def` para definir constantes ou variáveis globais que poderiam ser usadas em todo o código, como nomes de personagens ou elementos da história. Isso não só enriquecerá seu projeto, mas também ajudará a entender melhor como organizar e modularizar seu código.

Aqui está uma sugestão para o último tópico do seu documento, incentivando o leitor a subir o projeto no GitHub e a participar do desafio #100DaysOfCode:

---

## 100daysofcode

Depois de concluir seu projeto, uma excelente forma de manter o aprendizado e obter feedback é compartilhá-lo no [GitHub](https://github.com). Além disso, considere aderir ao desafio [#100DaysOfCode](https://www.100daysofcode.com/). Esse desafio incentiva você a codificar todos os dias por 100 dias consecutivos, o que pode significativamente acelerar seu aprendizado em programação, especialmente em novas linguagens e paradigmas.

Para quem está começando com Clojure e deseja uma leitura acessível e informativa, recomendo o livro *Clojure for the Brave and True* de Daniel Higginbotham. Este livro oferece uma introdução clara e divertida ao mundo de Clojure, cobrindo desde os conceitos básicos até técnicas mais avançadas, com exemplos práticos para ajudar você a praticar. Você pode encontrar mais informações sobre o livro e recursos adicionais no [site oficial do livro](http://www.braveclojure.com/).
