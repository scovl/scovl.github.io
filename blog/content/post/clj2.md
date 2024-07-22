+++
title = "Clojure Sessions02"
description = "Advanced Three Little Pigs"
date = 2024-07-19T19:00:00-00:00
tags = ["OOP","software","engineering", "Clojure"]
draft = false
weight = 6
+++

# Table of Contents
* **[Introdução](#introdução)**
* [Evoluindo o Projeto com Leiningen](#evoluindo-o-projeto-com-leiningen)
   - [Passo 1: Refatorando o Código](#passo-1-refatorando-o-código)
   - [Passo 2: Dividindo em Módulos](#passo-2-dividindo-em-módulos)
   - [Passo 3: Usando `def` para Variáveis Globais](#passo-3-usando-def-para-variáveis-globais)
   - [Passo 4: Adicionando Mais Complexidade](#passo-4-adicionando-mais-complexidade)
   - [Passo 5: Executando o Projeto Refatorado](#passo-5-executando-o-projeto-refatorado)
* [Conclusão](#conclusão)
* [Compartilhando Seu Progresso](#compartilhando-seu-progresso)
* [100daysofcode](#100daysofcode)

# Introdução
Neste segundo artigo, vamos avançar no nosso projeto "Three Little Pigs" utilizando conceitos mais avançados do Clojure. Iremos refatorar nosso código para torná-lo mais modular e introduzir o uso de `def` para variáveis globais. Isso não só melhorará a organização do código, mas também facilitará a manutenção e a escalabilidade do projeto.

# Evoluindo o Projeto com Leiningen

### Passo 1: Refatorando o Código

Vamos começar refatorando nosso código original. Primeiro, continue a partir do projeto anterior em **[Clojure Sessions01](https://scovl.github.io/2024/07/19/clj1/)**.

### Passo 2: Dividindo em Módulos

Dividir o código em módulos ajuda a manter o projeto organizado. Vamos criar dois novos arquivos para separar a lógica dos porquinhos e do lobo. Dentro da pasta `src/three_little_pigs`, crie dois novos arquivos: `pig.clj` e `wolf.clj`.

#### Conteúdo de `pig.clj`

```clojure
(ns three-little-pigs.pig)

(defn build-house [material]
  (str "O porquinho construiu uma casa de " material "."))

(defn pig-activity [pig material]
  (str pig " decidiu construir uma casa. " (build-house material)))
```

#### Conteúdo de `wolf.clj`

```clojure
(ns three-little-pigs.wolf)

(defn wolf-action [house]
  (str "O lobo veio, soprou e derrubou a casa de " house "."))
```

### Passo 3: Usando `def` para Variáveis Globais

Vamos definir algumas variáveis globais que serão usadas em vários lugares do nosso projeto. Abra o arquivo `core.clj` e adicione as seguintes definições:

```clojure
(ns three-little-pigs.core
  (:require [three-little-pigs.pig :as pig]
            [three-little-pigs.wolf :as wolf]))

(def lobo "O lobo")
(def materiais ["palha" "madeira" "tijolos"])

(defn story []
  (let [pig1 (pig/pig-activity "O primeiro porquinho" "palha")
        pig2 (pig/pig-activity "O segundo porquinho" "madeira")
        pig3 (pig/pig-activity "O terceiro porquinho" "tijolos")
        wolf1 (wolf/wolf-action "palha")
        wolf2 (wolf/wolf-action "madeira")
        wolf3 "O lobo não conseguiu derrubar a casa de tijolos."
        conclusion "A casa de tijolos do terceiro porquinho os salvou."]
    (str pig1 "\n" pig2 "\n" pig3 "\n" wolf1 "\n" wolf2 "\n" wolf3 "\n" conclusion)))

(defn -main []
  (println (story)))
```

### Passo 4: Adicionando Mais Complexidade

Para adicionar mais complexidade ao projeto, vamos introduzir novas funções e uma interação mais rica entre os personagens. Por exemplo, podemos adicionar diálogos entre os porquinhos e o lobo, e ações adicionais, como os porquinhos reforçando suas casas.

#### Atualizando `pig.clj`

```clojure
(ns three-little-pigs.pig)

(defn build-house [material]
  (str "O porquinho construiu uma casa de " material "."))

(defn reinforce-house [material]
  (str "O porquinho reforçou a casa de " material "."))

(defn pig-activity [pig material]
  (str pig " decidiu construir uma casa. " (build-house material)))

(defn pig-dialogue [pig]
  (str pig " disse: 'Não vou deixar o lobo derrubar minha casa!'"))
```

#### Atualizando `wolf.clj`

```clojure
(ns three-little-pigs.wolf)

(defn wolf-action [house]
  (str "O lobo veio, soprou e derrubou a casa de " house "."))

(defn wolf-dialogue []
  (str "O lobo disse: 'Vou soprar e sua casa derrubar!'"))
```

#### Atualizando `core.clj`

```clojure
(ns three-little-pigs.core
  (:require [three-little-pigs.pig :as pig]
            [three-little-pigs.wolf :as wolf]))

(def lobo "O lobo")
(def materiais ["palha" "madeira" "tijolos"])

(defn story []
  (let [pig1 (pig/pig-activity "O primeiro porquinho" "palha")
        pig2 (pig/pig-activity "O segundo porquinho" "madeira")
        pig3 (pig/pig-activity "O terceiro porquinho" "tijolos")
        reinforce1 (pig/reinforce-house "tijolos")
        wolf1 (wolf/wolf-action "palha")
        wolf2 (wolf/wolf-action "madeira")
        wolf3 "O lobo não conseguiu derrubar a casa de tijolos."
        dialogue1 (pig/pig-dialogue "O terceiro porquinho")
        dialogue2 (wolf/wolf-dialogue)
        conclusion "A casa de tijolos do terceiro porquinho os salvou."]
    (str pig1 "\n" pig2 "\n" pig3 "\n" reinforce1 "\n" wolf1 "\n" wolf2 "\n" wolf3 "\n" dialogue1 "\n" dialogue2 "\n" conclusion)))

(defn -main []
  (println (story)))
```

### Passo 5: Executando o Projeto Refatorado

Para executar o projeto refatorado, utilize o mesmo comando no terminal:

```bash
lein run
```

Isso compilará e executará o projeto, exibindo a história completa dos Três Porquinhos com mais detalhes e interações no terminal.


# Compartilhando Seu Progresso

Depois de concluir seu projeto, uma excelente forma de manter o aprendizado e obter feedback é compartilhá-lo no [GitHub](https://github.com). Subir seu projeto para o GitHub não apenas protege seu código em um repositório remoto, mas também o expõe a uma comunidade global, onde outros desenvolvedores podem colaborar, sugerir melhorias e ajudar no desenvolvimento de suas habilidades.

# 100daysofcode

Além disso, considere aderir ao desafio [#100DaysOfCode](https://www.100daysofcode.com/). Esse desafio incentiva você a codificar todos os dias por 100 dias consecutivos, o que pode significativamente acelerar seu aprendizado em programação, especialmente em novas linguagens e paradigmas como o Clojure.

Para quem está começando com Clojure e deseja uma leitura acessível e informativa, recomendo o livro *Clojure for the Brave and True* de Daniel Higginbotham. Este livro oferece uma introdução clara e divertida ao mundo de Clojure, cobrindo desde os conceitos básicos até técnicas mais avançadas, com exemplos práticos para ajudar você a praticar. Você pode encontrar mais informações sobre o livro e recursos adicionais no [site oficial do livro](http://www.braveclojure.com/).
