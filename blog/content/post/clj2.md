+++
title = "Clojure Sessions02"
description = "Advanced Three Little Pigs"
date = 2024-07-21T19:00:00-00:00
tags = ["OOP","software","engineering", "Clojure"]
draft = true
weight = 6
+++

# Table of Contents
* **[Introdução](#introducao)**
* [Evoluindo o Projeto com Leiningen](#evoluindo-o-projeto-com-leiningen)
   - [Passo 1: Refatorando o Código](#passo-1-refatorando-o-código)
   - [Passo 2: Dividindo em Módulos](#passo-2-dividindo-em-módulos)
   - [Passo 3: Usando `def` para Variáveis Globais](#passo-3-usando-def-para-variáveis-globais)
   - [Passo 4: Trabalhando com Lists](#passo-4-trabalhando-com-lists)
   - [Passo 5: Trabalhando com Sets](#passo-5-trabalhando-com-sets)
   - [Passo 6: Gerando um JAR Executável](#passo-6-gerando-um-jar-executável)
* [Compartilhando Seu Progresso](#compartilhando-seu-progresso)
* [100DaysOfCode](#100daysofcode)
* [Glossário](#glossario)

# Introdução

Neste segundo artigo, vamos avançar no nosso projeto "Three Little Pigs" utilizando conceitos mais avançados do [Clojure](https://clojure.org/). Iremos refatorar nosso código para torná-lo mais modular e introduzir o uso de [`def`](https://clojuredocs.org/clojure.core/def) para variáveis globais. Isso não só melhorará a organização do código, mas também facilitará a manutenção e a escalabilidade do projeto.

Os três porquinhos, conhecidos como Prático, Heitor e Cícero, têm características únicas e enfrentam juntos o desafio de construir suas casas para se protegerem do lobo.

# Evoluindo o Projeto com Leiningen

### Passo 1: Refatorando o Código

Vamos começar refatorando nosso código original. Primeiro, continue a partir do projeto anterior em **[Clojure Sessions01](https://scovl.github.io/2024/07/19/clj1/)**.

Depois de fazer as alterações, execute `lein run` para garantir que o código ainda está funcionando corretamente antes de prosseguir para a próxima etapa.

### Passo 2: Dividindo em Módulos

Dividir o código em módulos ajuda a manter o projeto organizado. Vamos criar dois novos arquivos para separar a lógica dos porquinhos e do lobo. Dentro da pasta `src/three_little_pigs`, crie dois novos arquivos: `pig.clj` e `wolf.clj`. Vamos então ao arquivo `pig.clj`:

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
```

A função `scared-pig` representa a ação de um porquinho correndo para a casa do próximo porquinho quando está com medo do lobo, adicionando mais interatividade à história. Agora vamos ao arquivo `wolf.clj`:

```clojure
(ns three-little-pigs.wolf)

(defn wolf-action [house]
  (str "O lobo veio, soprou e derrubou a casa de " house "."))

(defn wolf-dialogue []
  (str "O lobo disse: 'Vou soprar e sua casa derrubar!'"))

(defn wolf-failed-action [house]
  (str "O lobo tentou soprar e derrubar a casa de " house ", mas não conseguiu."))
```

A função `wolf-failed-action` representa a falha do lobo ao tentar derrubar a casa de tijolos, adicionando uma condição de falha ao comportamento do lobo, tornando a história mais divertida.

### Passo 3: Usando `def` para Variáveis Globais

Vamos definir algumas variáveis globais que serão usadas em vários lugares do nosso projeto. Abra o arquivo `core.clj` e adicione as seguintes definições:

```clojure
(ns three-little-pigs.core
  (:gen-class)
  (:require [three-little-pigs.pig :as pig]
            [three-little-pigs.wolf :as wolf]
            [clojure.string :as str]))

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

(defn -main []
  (do
    (println (story))
    (when true
      (println "Fim da história!"))))
```

No contexto de Clojure, que é uma linguagem funcional, o uso de variáveis globais pode ser diferente do que se espera em linguagens imperativas. Aqui,`def` é usado para definir símbolos que estão acessíveis globalmente dentro do namespace onde são declarados. Isso significa que, uma vez definido, o valor pode ser acessado de qualquer parte do código que compartilhe o mesmo namespace, sem a necessidade de passar como argumento nas funções.

O artigo utiliza `def` para criar variáveis globais como `lobo`, `materiais`, e `porquinhos`, que representam componentes da história dos Três Porquinhos que são usados em várias partes do código. Isso facilita a manutenção do código, pois você não precisa passar essas informações através de cada chamada de função; elas estão disponíveis globalmente.

Usamos `def` para definir variáveis globais que representam o lobo, os materiais de construção e os porquinhos. Isso nos permite acessar esses valores em qualquer lugar do projeto sem precisar passar parâmetros repetidamente. A função `reinforce?` verifica se o material é "tijolos", ajudando a decidir se a casa deve ser reforçada ou se o lobo falha ao tentar derrubá-la.

Usamos `loop` e `recur` para iterar sobre os porquinhos e construir a história passo a passo. A função verifica se a casa é feita de tijolos para decidir a ação do lobo e a reação dos porquinhos. A função `-main` é a função principal que executa a história. Usamos `do` para executar múltiplas expressões e `when` para imprimir "Fim da história!" ao final.

Depois de definir as variáveis globais e atualizar a função principal, execute `lein run` novamente para verificar se o código funciona corretamente.

### Passo 4: Trabalhando com Lists

As listas são uma estrutura de dados fundamental em Clojure. Vamos usá-las para armazenar e manipular os dados dos porquinhos e materiais. Vamos editar nosso `core.clj` para usar listas:

```clojure
(ns three-little-pigs.core
  (:require [three-little-pigs.pig :as pig]
            [three-little-pigs.wolf :as wolf]
            [clojure.string :as str]))

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

(defn -main []
  (do
    (println (story))
    (when true


      (println "Fim da história!"))))
```

Lists são estruturas de dados centrais em muitas linguagens de programação, incluindo Clojure. Em Clojure, uma lista é uma coleção ordenada de elementos. O código usa listas para armazenar informações sobre os materiais que os porquinhos usam e as ações que eles executam. Funções como `first` (para obter o primeiro elemento da lista) e `rest` (para obter todos os elementos exceto o primeiro) são usadas para navegar e manipular essas listas.

Manipular listas é fundamental para processar coleções de dados, como ciclar através dos porquinhos e suas ações, o que é um caso comum em programação funcional.

Alteramos a definição de `materiais` e `porquinhos` para usar listas. Isso demonstra como trabalhar com listas em Clojure para armazenar e iterar sobre coleções de dados. Um problema comum ao trabalhar com listas é a manipulação de elementos individuais. Em Clojure, `first`, `rest`, e `conj` são funções essenciais para lidar com listas. Certifique-se de entender bem essas funções para evitar erros de manipulação de dados.

Execute `lein run` novamente para garantir que tudo está funcionando corretamente com as mudanças feitas.

### Passo 5: Trabalhando com Sets

Sets (conjuntos) são coleções de valores únicos. Vamos usar `sets` para garantir que cada material usado pelos porquinhos seja único e para verificar se todos os materiais foram usados em `core.clj`:

```clojure
(ns three-little-pigs.core
  (:require [three-little-pigs.pig :as pig]
            [three-little-pigs.wolf :as wolf]
            [clojure.string :as str]
            [clojure.set :as set]))

(def lobo "O lobo")
(def materiais #{"palha" "madeira" "tijolos"})

(def porquinhos [{:nome "Prático" :material "palha"}
                 {:nome "Heitor" :material "madeira"}
                 {:nome "Cícero" :material "tijolos"}])

(defn reinforce? [material]
  (= material "tijolos"))

(defn story []
  (let [used-materials (atom #{})]
    (loop [remaining porquinhos
           resultado []]
      (if (empty? remaining)
        (do
          (println (str "Materiais usados: " @used-materials))
          (str/join "\n" resultado))
        (let [{:keys [nome material]} (first remaining)
              _ (swap! used-materials conj material)
              acao (pig/pig-activity nome material)
              dialogo (pig/pig-dialogue nome)
              acao-lobo (if (reinforce? material)
                          (wolf/wolf-failed-action material)
                          (wolf/wolf-action material))
              novo-resultado (conj resultado acao dialogo acao-lobo)]
          (recur (rest remaining)
                 (if (reinforce? material)
                   (conj novo-resultado (pig/reinforce-house material))
                   (conj novo-resultado (pig/scared-pig nome)))))))))

(defn -main []
  (do
    (println (story))
    (when true
      (println "Fim da história!"))))
```

Além de garantir unicidade, os sets em Clojure também são úteis para realizar operações matemáticas de conjunto, como união, interseção e diferença, embora esses usos não sejam abordados diretamente neste passo do tutorial.

Alteramos a definição de `materiais` para usar sets, garantindo que cada material seja único. Utilizamos um `atom` para armazenar os materiais usados e a função `swap!` para atualizar esse conjunto durante a execução da história. Execute `lein run` mais uma vez para garantir que tudo está funcionando corretamente após essas mudanças.

### Passo 6: Gerando um JAR Executável

Usar `lein run` é ótimo para testar seu código, mas e se você quiser compartilhar seu trabalho com pessoas que não têm Leiningen instalado? Note que no artigo anterior em **[Clojure Sessions01](https://scovl.github.io/2024/07/19/clj1/)**, o `.jar` até que foi gerado. No entanto, não era possível de ser executado. Isso porque não configuramos o arquivo `project.clj`. Então vamos configura-lo aqui os metadados do `.jar`:

```clojure
(defproject three-little-pigs "0.1.0-SNAPSHOT"
  :description "Advanced Three Little Pigs"
  :url "http://url/da/sua/pagina.com"
  :license {:name "Sua licença"
            :url "http://www.url.da.licença.com"}
  :dependencies [[org.clojure/clojure "1.10.3"]]
  :main three-little-pigs.core
  :target-path "target/%s"
  :profiles {:uberjar {:aot [three-little-pigs.core]}})
```


Além disso, você precisa acrescentar no `core.clj` o cabeçalho ` (:gen-class)` que é crucial para alguns casos de uso específicos, principalmente quando você deseja compilar um projeto Clojure para um arquivo JAR executável que pode ser rodado diretamente pela JVM (Java Virtual Machine). Então o cabeçalho do `core.clj` precisa estar assim:

```clojure
(ns three-little-pigs.core
  (:gen-class)
  (:require [three-little-pigs.pig :as pig]
            [three-little-pigs.wolf :as wolf]
            [clojure.string :as str]
            [clojure.set :as set]))
```

Para criar o arquivo, execute o seguinte comando:

```shell
lein uberjar
```

Isso criará dois arquivos JAR na pasta `target/uberjar`: um arquivo padrão (`three-little-pigs-0.1.0-SNAPSHOT.jar`) e um standalone (`three-little-pigs-0.1.0-SNAPSHOT-standalone.jar`). O arquivo standalone inclui todas as dependências necessárias para executar o projeto. Você pode verificar o conteúdo dos arquivos JAR usando:

```shell
jar tf target/uberjar/three-little-pigs-0.1.0-SNAPSHOT.jar
```

E executar o JAR standalone com o comando:

```shell
java -jar target/uberjar/three-little-pigs-0.1.0-SNAPSHOT-standalone.jar
```

### Explicação sobre os JARs

O arquivo `three-little-pigs-0.1.0-SNAPSHOT.jar` contém apenas o código do seu projeto, enquanto o `three-little-pigs-0.1.0-SNAPSHOT-standalone.jar` inclui todas as dependências, tornando-o autossuficiente para ser executado em qualquer ambiente sem a necessidade de configurar o classpath manualmente.

### Compartilhando Seu Progresso

Depois de concluir seu projeto, uma excelente forma de manter o aprendizado e obter feedback é compartilhá-lo no [GitHub](https://github.com). Subir seu projeto para o GitHub não apenas protege seu código em um repositório remoto, mas também o expõe a uma comunidade global, onde outros desenvolvedores podem colaborar, sugerir melhorias e ajudar no desenvolvimento de suas habilidades.

### 100DaysOfCode

Além disso, considere aderir ao desafio **[#100DaysOfCode](https://www.100daysofcode.com/)**. Esse desafio incentiva você a codificar todos os dias por 100 dias consecutivos, o que pode significativamente acelerar seu aprendizado em programação, especialmente em novas linguagens e paradigmas como o Clojure.

Para quem está começando com Clojure e deseja uma leitura acessível e informativa, recomendo o livro **[Clojure for the Brave and True](https://www.braveclojure.com/)** de Daniel Higginbotham. Este livro oferece uma introdução clara e divertida ao mundo de Clojure, cobrindo desde os conceitos básicos até técnicas mais avançadas, com exemplos práticos para ajudar você a praticar.
