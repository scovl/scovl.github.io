+++
title = "Math 01"
description = "Capítulo 01"
date = 2024-08-06T17:31:45-03:00
tags = ["mathematics"]
draft = false
weight = 8
author = "Vitor Lobo Ramos"
+++

## Table of Contents

- **[Introdução](#introdução)**
- [Torre de Hanói](#torre-de-hanói)
  - [Provando que Esta Fórmula é Correta](#provando-que-esta-fórmula-é-correta)
  - [Resolvendo a Recorrência](#resolvendo-a-recorrência)
- [O problema dos cortes](#o-problema-dos-cortes)
- [Problema de Josephus](#problema-de-josephus)
  - [Solução para o Caso Par](#solução-para-o-caso-par)
- [Exercícios](#exercícios)
  - [Todos os Cavalos São da Mesma Cor?](#todos-os-cavalos-são-da-mesma-cor)
  - [Movendo Discos na Torre de Hanói](#movendo-discos-na-torre-de-hanói)



O texto que escrevi abaixo é uma adaptação do capítulo 1 do livro **[Concrete Mathematics: A Foundation for Computer Science](https://www.amazon.com.br/Concrete-Mathematics-Foundation-Computer-Science/dp/0201558025)** de Ronald L. Graham, Donald E. Knuth e Oren Patashnik. Este livro foi pensado para ajudar estudantes a resolver problemas matemáticos que aparecem na programação de computadores, combinando ideias práticas e teóricas.

Nos anos 1970, muitas pessoas começaram a questionar a forma como a matemática era ensinada nas escolas e universidades. Um dos autores do livro percebeu que precisava de novas ferramentas matemáticas para entender melhor a programação de computadores. Então, ele decidiu criar um novo curso chamado "Concrete Mathematics" (Matemática Concreta), ensinando as técnicas que ele desejava ter aprendido quando era estudante.

A matemática abstrata se concentra em ideias gerais e conceitos amplos, sendo muito útil em diversas áreas. No entanto, às vezes ela se afasta das aplicações práticas do dia a dia. A matemática concreta, por outro lado, se foca em problemas específicos e técnicas práticas. É como um conjunto de ferramentas que podemos usar para resolver problemas reais. Vamos começar:

## Torre de Hanói

Vamos resolver um quebra-cabeça fascinante chamado "Torre de Hanói". Este quebra-cabeça foi inventado por um matemático francês chamado **[Edouard Lucas](https://pt.wikipedia.org/wiki/%C3%89douard_Lucas)** em 1883. A ideia é simples: temos uma torre de discos de diferentes tamanhos empilhados em ordem decrescente em um dos três pinos. O objetivo é mover toda a torre para um dos outros pinos, seguindo estas regras:

1. Só é possível mover um disco de cada vez.
2. Um disco maior nunca pode ser colocado sobre um disco menor.

![Imagem da Torre de Hanói](https://cs.brynmawr.edu/cs380/Lec12/towers.png)

Em vez 5 ou 64 discos, vamos considerar que temos $n$ discos. Isso nos ajuda a enxergar o problema em partes menores. Vamos dar nomes às coisas para facilitar. Vamos chamar $T_n$ o número mínimo de movimentos necessários para transferir $n$ discos de um pino para outro, seguindo as regras. Por exemplo:

- $T_1$ é claramente 1, porque só precisamos de um movimento para um disco.
- $T_2$ é 3, porque precisamos de três movimentos para dois discos.

Para começar, vamos considerar o caso mais simples de todos: $T_0 = 0$, porque não precisamos de movimentos para transferir zero discos. Para transferir uma torre maior, podemos usar uma estratégia. Se temos três discos, podemos mover os dois menores para o pino do meio, depois mover o maior para o pino final e, em seguida, trazer os dois menores de volta para o pino final. Isso nos dá uma pista de como transferir $n$ discos:

1. Primeiro, transferimos os $n - 1$ discos menores para outro pino (que precisa de $T_{n-1}$ movimentos).
2. Depois, movemos o maior disco (que precisa de um movimento).
3. Finalmente, transferimos os $n - 1$ discos menores de volta para o pino final (outros $T_{n-1}$ movimentos).

Portanto, precisamos de $2T_{n-1} + 1$ movimentos para transferir $n$ discos, ou seja:

$$
T_n \leq 2T_{n-1} + 1
$$

Precisamos provar que essa fórmula é a melhor possível. Em algum momento, temos que mover o maior disco, e para fazer isso, os $n - 1$ discos menores precisam estar em um único pino, o que leva pelo menos $T_{n-1}$ movimentos. Depois de mover o maior disco, temos que trazer os $n - 1$ discos menores de volta para o maior disco, o que leva mais $T_{n-1}$ movimentos. Assim, temos:

$$
T_n \geq 2T_{n-1} + 1
$$

Portanto, a fórmula correta é:

$$
T_n = 2T_{n-1} + 1
$$

Podemos usar a fórmula para calcular $Tn$ para qualquer valor de $n$. Por exemplo:

- $T3 = 2 \times 3 + 1 = 7$
- $T4 = 2 \times 7 + 1 = 15$
- $T5 = 2 \times 15 + 1 = 31$
- $T6 = 2 \times 31 + 1 = 63$

Parece que a fórmula geral é:

$$
T_n = 2^n - 1
$$

Para provar que esta fórmula é correta para todos os $n$, usamos um método chamado indução matemática. Primeiro, provamos a fórmula para o menor valor de $n$, que é $0$. Depois, mostramos que, se a fórmula é verdadeira para $n-1$, então é verdadeira para $n$. Isso nos dá uma maneira de provar que a fórmula funciona para qualquer valor de $n$.

---

## O problema dos cortes

Vamos agora aprender sobre um problema interessante de matemática que envolve linhas e cortes. Imagine que você está cortando uma pizza com uma faca reta. A pergunta é: quantas fatias de pizza você pode obter ao fazer $n$ cortes retos? Vamos explorar essa questão e entender como resolver. Vamos começar com casos pequenos para entender melhor. Se não houver linhas (ou cortes), temos uma única região, que é a pizza inteira. Se fizermos um corte, obtemos duas fatias. Com dois cortes, conseguimos quatro fatias. Matematicamente, podemos representar esses casos assim:

- $L0 = 1$ (sem cortes, uma fatia)
- $L1 = 2$ (um corte, duas fatias)
- $L2 = 4$ (dois cortes, quatro fatias)

No entanto, quando adicionamos mais cortes, a situação fica um pouco mais complicada. Por exemplo, com três cortes, conseguimos dividir a pizza em sete fatias.

![Imagem de pizza com mais cortes](link-para-imagem)

Para entender quantas fatias obtemos com $n$ cortes, precisamos generalizar o problema. Vamos chamar $Ln$ o número máximo de regiões que podemos obter com $n$ linhas. Descobrimos que a fórmula geral é:

$$
L_n = L_{n-1} + n
$$

Isso significa que a quantidade máxima de regiões com $n$ cortes é igual à quantidade de regiões com $n-1$ cortes, mais $n$. Vamos "desdobrar" essa fórmula para entender melhor. Por exemplo, se quisermos calcular $L3$, podemos fazer isso assim:

$$
L_3 = L_2 + 3
$$
$$
L_2 = L_1 + 2
$$
$$
L_1 = L_0 + 1
$$

Substituindo as fórmulas, temos:

$$
L_3 = (L_1 + 2) + 3
$$
$$
L_3 = ((L_0 + 1) + 2) + 3
$$
$$
L_3 = (1 + 1 + 2) + 3
$$
$$
L_3 = 7
$$

Então, com três cortes, obtemos sete fatias de pizza.

![Imagem final de pizza com sete fatias](link-para-im

agem)

Agora, vamos entender a soma dos primeiros números inteiros. A fórmula geral para a soma dos primeiros $n$ números inteiros é:

$$
S_n = 1 + 2 + 3 + \ldots + n
$$

Um matemático chamado **[Gauss](https://pt.wikipedia.org/wiki/Carl_Friedrich_Gauss)** encontrou uma maneira inteligente de calcular essa soma. Ele percebeu que se somarmos a sequência normal com a sequência invertida, podemos simplificar o cálculo:

$$
S_n = 1 + 2 + 3 + \ldots + n
$$
$$
S_n = n + (n-1) + (n-2) + \ldots + 1
$$
$$
2S_n = (n+1) + (n+1) + (n+1) + \ldots + (n+1)
$$

Cada par de números soma $n+1$ e temos $n$ pares. Portanto, a fórmula para a soma dos primeiros $n$ números inteiros é:

$$
S_n = \frac{n(n + 1)}{2}
$$

Usando a soma dos primeiros $n$ números inteiros, podemos encontrar a fórmula final para o número máximo de regiões criadas por $n$ linhas:

$$
L_n = \frac{n(n + 1)}{2} + 1
$$

Isso significa que, se fizermos $n$ cortes em uma pizza, o número máximo de fatias que podemos obter é dado por essa fórmula. Vamos recapitular:

1. Sem cortes, temos uma fatia de pizza.
2. Com um corte, temos duas fatias.
3. Com dois cortes, temos quatro fatias.
4. Com três cortes, temos sete fatias.

Usamos a fórmula geral para calcular o número máximo de regiões (ou fatias) criadas por $n$ cortes:

$$
L_n = \frac{n(n + 1)}{2} + 1
$$

Espero que esta explicação tenha ajudado a entender como funciona o problema dos cortes na pizza e a matemática por trás dele!

---

## Problema de Josephus

Esse problema envolve pessoas dispostas em círculo, onde uma pessoa é eliminada a cada rodada até que reste apenas uma. Vamos descobrir como determinar a posição da pessoa que sobrevive.

Imagine que temos 10 pessoas numeradas de 1 a 10 em um círculo. Começamos eliminando a segunda pessoa, depois a quarta, e assim por diante, até restar apenas uma pessoa. A ordem de eliminação seria: 2, 4, 6, 8, 10, 3, 7, 1, 9. A pessoa que sobrevive é a número 5. Nosso objetivo é encontrar a posição do sobrevivente, que chamamos de $J(n)$, onde $n$ é o número total de pessoas.

Primeiro, tentamos observar um padrão para encontrar uma fórmula. Percebemos que, quando $n$ é 10, $J(10) = 5$. Tentamos adivinhar que $J(n) = n/2$ quando $n$ é par, mas isso não funciona para todos os casos. Vamos então olhar para casos menores:

- $J(1) = 1$
- $J(2) = 1$
- $J(3) = 3$
- $J(4) = 1$
- $J(5) = 3$
- $J(6) = 5$

Parece que $J(n)$ é sempre um número ímpar.

### Solução para o Caso Par

Se temos $2n$ pessoas, após a primeira rodada todas as pessoas com números pares são eliminadas. Ficamos com a sequência: 1, 3, 5, ..., 2n-1. Isso é como começar com $n$ pessoas, mas cada número foi duplicado e subtraído por 1. Portanto, a fórmula é:

$J(2n) = 2J(n) - 1$

Se sabemos que $J(10) = 5$, então para $20$ pessoas:

$J(20) = 2J(10) - 1 = 2 \times 5 - 1 = 9$

Se temos $2n + 1$ pessoas, a pessoa número 1 é eliminada logo após a pessoa número $2n$. Ficamos com a sequência: 3, 5, 7, ..., 2n-1, 2n+1. Isso é como começar com $n$ pessoas, mas cada número foi duplicado e somado com 1. Portanto, a fórmula é:

$J(2n + 1) = 2J(n) + 1$

Combinando essas fórmulas e começando com $J(1) = 1$, temos:

$J(1) = 1$
$J(2n) = 2J(n) - 1$
$J(2n + 1) = 2J(n) + 1$

Podemos construir uma tabela para valores pequenos de $n$ para observar o padrão:

| n  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 |
|----|---|---|---|---|---|---|---|---|---|----|----|----|----|----|----|----|
| J(n)| 1 | 1 | 3 | 1 | 3 | 5 | 7 | 1 | 3 |  5 |  7 |  9 | 11 | 13 | 15 |  1 |

Percebemos que $J(n)$ é sempre 1 no início de cada grupo que é potência de 2, e aumenta de 2 em 2 dentro do grupo. Se escrevermos $n$ na forma $2^m + l$, onde $2^m$ é a maior potência de 2 menor ou igual a $n$ e $l$ é o resto, a solução parece ser:

$J(2^m + l) = 2l + 1$

Para provar essa fórmula, usamos indução matemática. Quando $m = 0$, temos $l = 0$ e a base da indução é $J(1) = 1$, que é verdadeira. Para o passo da indução, assumimos que a fórmula é verdadeira para $m$ e provamos para $m+1$. No Problema de Josephus, a posição do sobrevivente pode ser encontrada usando as fórmulas:

- Para $2n$ pessoas: $J(2n) = 2J(n) - 1$
- Para $2n + 1$ pessoas: $J(2n + 1) = 2J(n) + 1$

Usamos essas fórmulas para construir uma tabela de valores pequenos e observar padrões que nos ajudam a generalizar a solução.

---

## Exercícios

### Todos os Cavalos São da Mesma Cor?

Suponha que você tenha um grupo de cavalos. Prove por indução que todos os cavalos desse grupo têm a mesma cor.

1. **Base da indução:** Mostre que a proposição é verdadeira para um grupo de um cavalo.
2. **Passo da indução:** Suponha que a proposição é verdadeira para um grupo de \(k\) cavalos. Prove que ela também é verdadeira para um grupo de \(k+1\) cavalos.

###  Movendo Discos na Torre de Hanói

Resolva o problema da Torre de Hanói para diferentes valores de \(n\).

1. Calcule $T_n$ para $n = 4, 5, 6, 7$.
2. Verifique se a fórmula $T_n = 2^n - 1$ é válida para os valores calculados.
3. Prove por indução matemática que a fórmula $T_n = 2^n - 1$ é correta para todos os valores de $n$.

###  Problema dos Cortes na Pizza

Determine o número máximo de fatias de pizza que podem ser obtidas com $n$ cortes retos.

1. Calcule $L_n$ para $n = 3, 4, 5, 6$.
2. Verifique se a fórmula $L_n = \frac{n(n + 1)}{2} + 1$ é válida para os valores calculados.
3. Prove por indução matemática que a fórmula $L_n = \frac{n(n + 1)}{2} + 1$ é correta para todos os valores de $n$.

###  Problema de Josephus

Encontre a posição do sobrevivente no Problema de Josephus para diferentes números de pessoas.

1. Calcule $J(n)$ para $n = 5, 10, 15, 20$.
2. Verifique se a fórmula $J(2n) = 2J(n) - 1$ e $J(2n + 1) = 2J(n) + 1$ é válida para os valores calculados.
3. Prove por indução matemática que a fórmula $J(2^m + l) = 2l + 1$ é correta para todos os valores de $n$.

###  Soma dos Primeiros Números Inteiros

Prove a fórmula da soma dos primeiros $n$ números inteiros.

1. Calcule $S_n$ para $n = 4, 5, 6, 7$.
2. Verifique se a fórmula $S_n = \frac{n(n + 1)}{2}$ é válida para os valores calculados.
3. Prove por indução matemática que a fórmula $S_n = \frac{n(n + 1)}{2}$ é correta para todos os valores de $n$.
