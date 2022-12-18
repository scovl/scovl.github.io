+++
title = "Java#Core - Regex"
description = "Arte magaiveriana do Regex"
date = 2022-12-09T05:31:45-03:00
tags = ["java,desenvolvimento,dev,development"]
draft = true
weight = 4
author = "Vitor Lobo Ramos"
+++

![Java](https://cdn-icons-png.flaticon.com/512/1183/1183618.png#center)

Uma expressão regular ou Regex, é uma `String` que descreve um padrão de pesquisa para corresponder caracteres em outras Strings. Essas expressões são úteis para validar a entrada e garantir que os dados estão em um formato particular. Por exemplo, um CEP deve consistir em cinco dígitos e um sobrenome deve conter somente letras, espaços, apóstrofos e hífens. 

Frequentemente, uma expressão regular grande e complexa é utilizada para validar a sintaxe de um programa. Se o código do programa não localizar expressão regular, o compilador sabe que há um erro de sintaxe dentro do código. A classe `String` fornece vários métodos para realizar operações de expressão regular, das quais a mais simples é a operação de correspondência. O método `String matches` recebe uma `String` que especifica a expressão regular e localiza o conteúdo do objeto String em que ele é chamado na expressão regular. O método retorna um `boolean` indicando se a correspondência foi ou não bem-sucedida. Uma expressão regular consiste em caracteres literais e símbolos especiais. O código abaixo especifica algumas classes de caracteres predefinidos que podem ser utilizadas com expressões regulares. Uma classe de caracteres é uma sequência de escape que representa um grupo de caracteres. 

Cada classe de caracteres localiza um único caractere na String que estamos tentando localizar com a expressão regular. As expressões regulares não estão limitadas a essas classes predefinidas de caractere. As expressões empregam vários operadores e outras formas de notação para localizar padrões complexos. Alguns exemplos:

```java
// Remove espaços em branco entre um caractere de palavra e . ou ,
String pattern = "(\\w)(\\s+)([\\.,])";
System.out.println(EXAMPLE_TEST.replaceAll(pattern, "$1$3"));
```

Este exemplo extrai o texto entre uma tag de título.

```java
// Extrai o texto entre os dois elementos do título
pattern = "(?i)(<title.*?>)(.+?)()";
String updated = EXAMPLE_TEST.replaceAll(pattern, "$2");
```