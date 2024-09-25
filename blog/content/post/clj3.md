+++
title = "Clojure Sessions03"
description = "Advanced Three Little Pigs - Calling Functions, Macros, Special Forms, and More"
date = 2024-07-24T19:00:00-00:00
tags = ["OOP", "software", "engineering", "Clojure"]
draft = true
weight = 7
+++

# Table of Contents
* **[Introdução](#introdução)**
* [Avançando com o Projeto](#avançando-com-o-projeto)
   - [Passo 1: Chamadas de Funções](#passo-1-chamadas-de-funções)
   - [Passo 2: Chamadas de Macros](#passo-2-chamadas-de-macros)
   - [Passo 3: Usando Special Forms](#passo-3-usando-special-forms)
   - [Passo 4: Funções Anônimas](#passo-4-funções-anônimas)
   - [Passo 5: Funções Retornando Funções](#passo-5-funções-retornando-funções)
* [Compartilhando Seu Progresso](#compartilhando-seu-progresso)
* [100DaysOfCode](#100daysofcode)

# Introdução

Bem-vindo à terceira sessão de Clojure! Vamos continuar a história dos três porquinhos, introduzindo conceitos como chamadas de funções, chamadas de macros, special forms, funções anônimas, e funções que retornam outras funções. Essas técnicas permitirão criar um código mais expressivo e poderoso.

# Avançando com o Projeto

### Passo 1: Chamadas de Funções

Vamos começar aprimorando nosso projeto com chamadas de funções. Chamadas de funções são fundamentais em Clojure e permitem a reutilização de lógica em várias partes do código. No arquivo `pig.clj`, vamos adicionar uma função que decide a ação de um porquinho com base no material da casa:

```clojure
(ns three-little-pigs.pig)

(defn build-house [material]
  (str "O porquinho construiu uma casa de " material "."))

(defn pig-activity [pig material]
  (str pig " decidiu construir uma casa. " (build-house material)))

(defn reinforce-house [material]
  (str "O porquinho reforçou a casa de " material "."))

(defn pig-dialogue [pig]
  (str pig " disse: 'Não vou deixar o lobo derrubar minha casa!'"))

(defn scared-pig [pig]
  (str pig " está com medo do lobo e correu para a casa do próximo porquinho."))

(defn pig-decision [pig material]
  (if (= material "tijolos")
    (reinforce-house material)
    (scared-pig pig)))
```

### Passo 2: Chamadas de Macros

Macros em Clojure permitem a criação de novos elementos sintáticos e a transformação do código antes da sua avaliação. Vamos criar uma macro para encapsular o comportamento de um porquinho sob ataque. No arquivo `wolf.clj`, adicionamos uma macro:

```clojure
(ns three-little-pigs.wolf)

(defmacro wolf-attack [pig house]
  `(do
     (println (wolf-dialogue))
     (println (wolf-action ~house))
     (println (three-little-pigs.pig/pig-decision ~pig ~house))))

(defn wolf-action [house]
  (str "O lobo veio, soprou e derrubou a casa de " house "."))

(defn wolf-dialogue []
  (str "O lobo disse: 'Vou soprar e sua casa derrubar!'"))

(defn wolf-failed-action [house]
  (str "O lobo tentou soprar e derrubar a casa de " house ", mas não conseguiu."))
```

### Passo 3: Usando Special Forms

Special forms são construções primitivas da linguagem que possuem regras especiais de avaliação. Vamos usar a special form `if` para decidir se o lobo consegue ou não derrubar a casa. No arquivo `core.clj`, integramos o uso da macro e a special form `if`:

```clojure
(ns three-little-pigs.core
  (:gen-class)
  (:require [three-little-pigs.pig :as pig]
            [three-little-pigs.wolf :as wolf]
            [clojure.string :as str]
            [clojure.set :as set]))

(def lobo "O lobo")
(def materiais '("palha" "madeira" "tijolos"))

(def porquinhos '({:nome "Prático" :material "palha"}
                  {:nome "Heitor" :material "madeira"}
                  {:nome "Cícero" :material "tijolos"}))

(defn reinforce? [material]
  (= material "tijolos"))

(defn story []
  (loop [remaining porquinhos
         resultado []]
    (if (empty? remaining)
      (str/join "\n" resultado)
      (let [{:keys [nome material]} (first remaining)
            acao (pig/pig-activity nome material)
            dialogo (pig/pig-dialogue nome)
            acao-lobo (if (reinforce? material)
                        (wolf/wolf-failed-action material)
                        (wolf/wolf-action material))
            novo-resultado (conj resultado acao dialogo acao-lobo)]
        (recur (rest remaining)
               (if (reinforce? material)
                 (conj novo-resultado (pig/reinforce-house material))
                 (conj novo-resultado (pig/scared-pig nome))))))))

(defn -main [& args]
  (println (story))
  (when true
    (println "Fim da história!")))
```

### Passo 4: Funções Anônimas

Funções anônimas são úteis quando você precisa de uma função rápida e descartável. Vamos adicionar uma função anônima para iterar sobre os materiais dos porquinhos. No arquivo `core.clj`, adicionamos:

```clojure
(defn list-materials []
  (map #(str "Material: " %) materiais))

(defn -main [& args]
  (println (story))
  (println (str/join "\n" (list-materials)))
  (when true
    (println "Fim da história!")))
```

### Passo 5: Funções Retornando Funções

Funções que retornam outras funções são poderosas em Clojure para criar comportamentos dinâmicos. Vamos criar uma função que retorna uma função para construir casas. No arquivo `pig.clj`, adicionamos:

```clojure
(defn house-builder [material]
  (fn [pig]
    (str pig " construiu uma casa de " material ".")))

(defn build-all-houses []
  (map (fn [{:keys [nome material]}]
         ((house-builder material) nome))
       porquinhos))
```

No arquivo `core.clj`, integramos:

```clojure
(defn -main [& args]
  (println (story))
  (println (str/join "\n" (list-materials)))
  (println (str/join "\n" (pig/build-all-houses)))
  (when true
    (println "Fim da história!")))
```

### Compartilhando Seu Progresso

Depois de concluir essas etapas, você pode compartilhar seu projeto no [GitHub](https://github.com). Isso permite que outros desenvolvedores colaborem, sugiram melhorias e ajudem no desenvolvimento de suas habilidades.

### 100DaysOfCode

Considere aderir ao desafio **[#100DaysOfCode](https://www.100daysofcode.com/)**, que incentiva a codificação diária por 100 dias consecutivos. Isso pode acelerar seu aprendizado, especialmente em novas linguagens e paradigmas como o Clojure.

Para iniciantes em Clojure, recomendo o livro **[Clojure for the Brave and True](https://www.braveclojure.com/)** de Daniel Higginbotham, que oferece uma introdução clara e divertida ao mundo de Clojure.
