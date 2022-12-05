+++
title = "#Java - Collections"
description = "Usando listas e maps"
date = 2020-04-19T17:31:45-03:00
tags = ["java,desenvolvimento,dev,development"]
draft = true
weight = 8
author = "Vitor Lobo Ramos"
+++

A linguagem Java suporta arrays para armazenar diversos objetos. Uma matriz é inicializada com um tamanho predefinido durante a instanciação. Para suportar estruturas de dados mais flexíveis, a biblioteca Java principal fornece a estrutura de coleta. Uma coleção é uma estrutura de dados que contém e processa um conjunto de dados. Os dados armazenados na coleção são encapsulados e o acesso aos dados só é possível por meio de métodos predefinidos. Por exemplo, o desenvolvedor pode adicionar elementos a uma coleção por meio de um método. As coleções usam matrizes internamente para armazenamento, mas ocultam do desenvolvedor a complexidade de gerenciar o tamanho dinâmico. Por exemplo, se seu aplicativo salva dados em um objeto do tipo Pessoas, você pode armazenar vários objetos Pessoas em uma coleção. Coleções típicas são: pilhas, filas, deques, listas e árvores. Java normalmente fornece uma interface, como List e uma ou várias implementações para essa interface, por exemplo, a classe ArrayList e LinkedList são implementações da interface List. Uma classe ou interface cuja declaração tem um ou mais parâmetros de tipo é uma classe ou interface genérica. Por exemplo, List define um parâmetro de tipo List<E>.

As coleções Java devem ser parametrizadas com uma declaração de tipo. Isso permite que o compilador Java verifique se você tentou usar sua coleção com o tipo correto de objetos. Os genéricos permitem que um tipo ou método opere em objetos de vários tipos enquanto fornecem segurança de tipo em tempo de compilação. Antes dos genéricos, você tinha que converter todos os objetos lidos de uma coleção e, se inserisse um objeto do tipo errado em uma coleção, criaria uma exceção de tempo de execução. A biblioteca de coleção oferece suporte a expressões lambdas. As operações em coleções foram amplamente simplificadas com isso. O código a seguir mostra um exemplo de como criar uma Collection do tipo List que é parametrizada com <String> para indicar ao compilador Java que somente Strings são permitidos nesta lista. Is usa uma referência de método e o loop foreach do Java 8.

```java
package collections;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MyArrayList {

    public static void main(String[] args) {

        // create a list using the
        List<String> list = Arrays.asList("Lars", "Simon");

        // alternatively
        List<String> anotherList = new ArrayList<>();
        anotherList.add("Lars");
        anotherList.add("Simon");


        // print each element to the console using method references
        list.forEach(System.out::println);
        anotherList.forEach(System.out::println);

    }
}
```

Se você tentar colocar um objeto nesta lista que não seja uma String, receberá um erro do compilador. A interface List é a interface base para coleções que permite armazenar objetos em um contêiner redimensionável. ArrayList é uma implementação desta interface e permite que elementos sejam adicionados e removidos dinamicamente da lista. Se mais elementos forem adicionados a ArrayList do que seu tamanho inicial, seu tamanho será aumentado dinamicamente. Os elementos em um ArrayList podem ser acessados direta e eficientemente usando os métodos get() e set(), já que ArrayList é implementado com base em um array. ArrayList é normalmente usado em implementações como classe de implementação para a interface List.

LinkedList é implementado como uma lista encadeada dupla. Seu desempenho em add() e remove() é melhor que o desempenho de Arraylist. Os métodos get() e set() têm desempenho pior que o ArrayList, pois o LinkedList não fornece acesso direto aos seus membros. O código a seguir demonstra o uso de List e ArrayList.

```java
package com.vogella.java.collections.list;
import java.util.ArrayList;
import java.util.List;

public class ListExample {
    public static void main(String[] args) {
        // use type inference for ArrayList
        List<Integer> list = Arrays.asList(3,2,1,4,5,6,6);

        // alternative you can declare the list via:
        // List<Integer> list = new ArrayList<>();
        // and use list.add(element); to add elements
        for (Integer integer : list) {
            System.out.println(integer);
        }
    }

}
```

Você pode classificar listas usando sua ordem natural de via lambdas para definir o Comparator.compare(). Normalmente no Java 8 você usa uma expressão lambda ou uma referência de método para a definição do método compare:

```java
package com.vogella.java.collections.list;

import java.util.ArrayList;
import java.util.List;

public class ListSorter {
    public static void main(String[] args) {
        System.out.println("Sorting with natural order");
        List<String> l1 = createList();
        l1.sort(null);
        l1.forEach(System.out::println);

        System.out.println("Sorting with a lamba expression for the comparison");
        List<String> l2 = createList();
        l2.sort((s1, s2) -> s1.compareToIgnoreCase(s2));  // sort ignoring case
        l2.forEach(System.out::println);

        System.out.println("Sorting with a method references");
        List<String> l3 = createList();
        l3.sort(String::compareToIgnoreCase);
        l3.forEach(System.out::println);

    }

    private static List<String>  createList() {
        return Arrays.asList("iPhone", "Ubuntu", "Android", "Mac OS X");
    }

}
```

O método removeIf permite remover itens da lista com base em uma condição.

```java
package com.vogella.java.collections.list;

import java.util.ArrayList;
import java.util.List;

public class RemoveIfList {
    public static void main(String[] args) {
        System.out.println("Demonstration of removeIf");
        List<String> l1 = createList();
        // remove all items which contains an "x"
        l1.removeIf(s-> s.toLowerCase().contains("x"));
        l1.forEach(s->System.out.println(s));
    }

    private static List<String>  createList() {
        List<String> anotherList = new ArrayList<>();
        anotherList.addAll(Arrays.asList("iPhone", "Ubuntu", "Android",
        "Mac OS X"));
        return anotherList;
    }
}
```

A interface Map define um objeto que mapeia chaves para valores. Um mapa não pode conter chaves duplicadas; cada chave pode mapear para no máximo um valor. A classe HashMap é uma implementação eficiente da interface Map. Para ver os trechos de código a seguir em ação, coloque-os neste método principal onde colocar código de teste aqui é indicado.

```java
package com.vogella.java.collections.map;

import java.util.HashMap;
import java.util.Map;

public class MapTester {
    public static void main(String[] args) {
        // put test code here
    }
}
```

O código a seguir demonstra como inicializar um HashMap em Java. No código a seguir, um mapa vazio com chaves e objetos do tipo Strings é inicializado.

```java
Map<String, String> map = Map.of();
```

No exemplo a seguir, um mapa com várias entradas é inicializado. Este método de fábrica suporta um máximo de 10 pares chave-valor e requer pelo menos Java 9.

```java
Map<String, String> map = Map.of("key1","value1", "key2", "value2");

Map<String, String> map = Map.ofEntries(
                    Map.entry("key1","value1"),
                    Map.entry("key2", "value2"),
                    // more
                    Map.entry("key100", "value100")
                );
```

O seguinte cria um mapa por meio do novo operador e adiciona várias entradas a ele por meio do operador put.

```java
Map<String, String> map = new HashMap<>();
map.put("Android", "Mobile");
map.put("Eclipse IDE", "Java");
map.put("Eclipse RCP", "Java");
map.put("Git", "Version control system");
```

Você pode remover uma entrada de um mapa por meio do método remove.

```java
Map<String, String> map = Map.of("Android","Mobile OS", "Flutter", "Development environment");
map.remove("Android");
```
Para processar cada elemento de um mapa, você pode usar o método forEach, que recebe um lambda como parâmetro.

```java
map.forEach((k, v) -> System.out.printf("%s %s%n", k, v));
```

Você pode converter suas chaves ou valores em uma matriz ou lista. O código a seguir demonstra isso.

```java
Map<String, String> map = new HashMap<>();
map.put("Android", "Mobile");
map.put("Eclipse IDE", "Java");
map.put("Eclipse RCP", "Java");
map.put("Git", "Version control system");

// convert keys to array
String[] keys = map.keySet().toArray(new String[map.keySet().size()])

for (String string : keys) {
    System.out.println(string);
}
// convert keys to list
List<String> list = new ArrayList<String>(map.keySet());
for (String string : list) {
    System.out.println(string);
}
```
Você pode usar o método getOrDefault() para retornar o valor de uma chave ou um valor padrão se a chave não estiver presente no mapa.

```java
Map<String,Integer> map = new HashMap<>();
map.put("Android", 1 + map.getOrDefault("Android", 0));

// write to command line
map.forEach((k, v) -> System.out.printf("%s %s%n", k, v));
```

O computeIfAbsent calcula e adiciona uma entrada ao mapa se ela não estiver presente no mapa.

```java
Map<String,Integer> map = Map.of();

Integer calculatedVaue = map.computeIfAbsent("Java", it -> 0);
System.out.println(calculatedVaue);

map.keySet().forEach(key -> System.out.println(key + " " + map.get(key)));
```

Classificar uma coleção em Java é fácil, basta usar Collections.sort(Collection) para classificar seus valores. O código a seguir mostra um exemplo para isso.

```java
package collections;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class Simple {
    public static void main(String[] args) {
        // create a new ArrayList with the Arrays.asList helper method
        List<Integer> list = Arrays.asList(5,4,3,7,2,1);
        // sort it
        Collections.sort(list);
        // print each element to the console
        list.forEach(System.out::println);
    }
}
```

Isso é possível porque Integer implementa a interface Comparable. Esta interface define o método compare que realiza a comparação pairwise dos elementos e retorna -1 se o elemento for menor que o elemento comparado, 0 se for igual e 1 se for maior. Se o que classificar de forma diferente, você pode definir sua implementação personalizada com base na interface Comparator por meio de uma expressão lambda.

```java
package collections;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class ListCustomSorterExample {
    public static void main(String[] args) {
        List<Integer> list = Arrays.asList(5,4,3,7,2,1);

        // custom comparator
        Collections.sort(list, (o1, o2) -> (o1>o2 ? -1 : (o1==o2 ? 0 : 1)));
        // alternative can could reuse the integer comparator
        // Collections.sort(list, Integer::);
        list.forEach(System.out::println);
    }
}
```

Você pode classificar por qualquer atributo ou até mesmo uma combinação de atributos. Por exemplo, se você tiver objetos do tipo Pessoa com os atributos chamados renda e dataOfBirth, poderá definir diferentes implementações de Comparator e classificar os objetos de acordo com suas necessidades.

