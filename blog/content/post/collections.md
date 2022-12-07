+++
title = "Java#Core - Collections"
description = "Usando lists e maps"
date = 2022-12-05T17:31:45-03:00
tags = ["java,desenvolvimento,dev,development"]
draft = true
weight = 1
author = "Vitor Lobo Ramos"
+++

Diferentemente de arrays convencionais que servem para armazenar diversos objetos e que é inicializado com um tamanho predefinido durante a instanciação, as collections são estruturas que processam um conjunto de dados que são encapsulados e os dados só são acessados por meio de métodos. Na prática as collections usam matrizes para armazenamento com a diferença na simplificação do gerenciamento dinâmico dos dados. Por exemplo, imagine que sua aplicação salva os dados em um objeto do tipo Pessoas. Você poderá armazenar vários objetos Pessoas em uma collection. O Java normalmente fornece uma interface, como `List` e uma ou várias implementações para essa interface, por exemplo, a classe `ArrayList` e `LinkedList`. Uma classe ou interface cuja declaração tem um ou mais parâmetros de tipo, é uma classe ou interface genérica. Por exemplo, `List` define um parâmetro de tipo `List<E>`.

Um ponto importante sobre as collections é que elas devem ser parametrizadas com uma declaração de tipo. Isso permite que o compilador Java verifique se você tentou usar sua collection com o tipo correto de objetos. Os genéricos permitem que um tipo ou método opere em objetos de vários tipos enquanto fornecem segurança de tipo em tempo de compilação. Antes dos genéricos, você tinha que converter todos os objetos lidos de uma coleção e, se inserisse um objeto do tipo errado em uma collection, criaria uma exceção de tempo de execução. Algumas Collections são ordenadas, outras organizadas. Na API elas estão organizadas como na seguinte instrução:

> * **Organizada:** LinkedHashSet, ArrayList, Vector, LinkedList, LinkedHashMap
> * **Não organizada:** HashSet, TreeSet, PriorityQueue, HashMap, HashTable, TreeMap
> * **Ordenada:** TreeSet, PriorityQueue, TreeMap
> * **Não ordenada:** HashSet, LinkedHashSet, ArrayList, Vector, LinkedList, HashMap, HashTable, LinkedHashMap.

Um outro ponto importante da biblioteca de collections é que ela oferece suporte a expressões lambda o que simplifica ainda mais o processo. O código a seguir mostra um exemplo de como criar uma Collection do tipo `List` que é parametrizada com `<String>` para indicar ao compilador Java que somente Strings são permitidos nesta lista:

```java
package br.com.collections;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MyArrayList {

    public static void main(String[] args) {

        // criar uma lista usando o Arrays.asList
        List<String> list = Arrays.asList("Fulano", "Ciclano");

        // outra alternativa
        List<String> anotherList = new ArrayList<>();
        anotherList.add("Fulano");
        anotherList.add("Ciclano");

        // printar cada elemento usando referências de método
        list.forEach(System.out::println);
        anotherList.forEach(System.out::println);
    }
}

```

Se você tentar colocar um objeto nesta lista que não seja uma String, receberá um erro do compilador. A interface `List` é a interface base para coleções que permite armazenar objetos em um contêiner redimensionável. `ArrayList` é uma implementação desta interface e permite que elementos sejam adicionados e removidos dinamicamente da lista. Se mais elementos forem adicionados a `ArrayList` do que seu tamanho inicial, seu tamanho será aumentado dinamicamente. Os elementos em um `ArrayList` podem ser acessados direta e eficientemente usando os métodos `get()` e `set()`, já que ArrayList é implementado com base em um array. `ArrayList` é normalmente usado em implementações como classe de implementação para a interface `List`. Já o `LinkedList` é implementado como uma lista encadeada dupla. Isto é, quando você usa os métodos `add()` e `remove()` o desempenho acaba sendo maior do que quando você opera em uma `Arraylist`. Os métodos `get()` e `set()` têm desempenho inferior que o `ArrayList`, pois o `LinkedList` não fornece acesso direto aos seus membros. O código a seguir demonstra o uso de `List` e `ArrayList`.

```java
package br.com.java.collections.list;
import java.util.ArrayList;
import java.util.List;

public class ListExample {
    public static void main(String[] args) {
        // usa inferência de tipo para ArrayList
        List<Integer> list = Arrays.asList(3,2,1,4,5,6,6);
        // uma alternativa é declarar a lista via:
        // List<Integer> list = new ArrayList<>();
        // e usar list.add(element); para adicionar elementos
        for (Integer integer : list) {
            System.out.println(integer);
        }
    }
}
```

Você pode classificar listas via lambdas para definir o `Comparator.compare()`. Do Java 8 em diante, você pode usar uma expressão lambda ou uma referência de método:

```java
package br.com.java.collections.list;

import java.util.Arrays;
import java.util.List;

public class ListSorter {
    public static void main(String[] args) {
        System.out.println("Classificando como é feito normalmente");
        List<String> l1 = createList();
        l1.sort(null);
        l1.forEach(System.out::println);

        System.out.println("Classificando com uma expressão lambda");
        List<String> l2 = createList();
        // ordena ignorando maiúsculas e minúsculas
        l2.sort((s1, s2) -> s1.compareToIgnoreCase(s2));
        l2.forEach(System.out::println);

        System.out.println("Classificando com referências de método");
        List<String> l3 = createList();
        l3.sort(String::compareToIgnoreCase);
        l3.forEach(System.out::println);

    }

    private static List<String>  createList() {
        return Arrays.asList("Fedora", "OpenBSD", "Debian", "Arch Linux");
    }
}
```

O método `removeIf` permite remover itens da lista com base em uma condição.

```java
package br.com.java.collections.list;

import java.util.ArrayList;
import java.util.List;

public class RemoveIfList {
    public static void main(String[] args) {
        System.out.println("Demonstração do método removeIf");
        List<String> l1 = createList();
        // remove todos os itens que contém um "x"
        l1.removeIf(s-> s.toLowerCase().contains("x"));
        l1.forEach(s->System.out.println(s));
    }

    private static List<String>  createList() {
        List<String> anotherList = new ArrayList<>();
        anotherList.addAll(Arrays.asList("Fedora", "OpenBSD", "Debian", "Arch Linux"));
        return anotherList;
    }
}
```

A interface `Map` define um objeto que mapeia chaves para valores. Um `Map` não pode conter chaves duplicadas; cada chave pode mapear para no máximo um valor. A classe `HashMap` é uma implementação eficiente da interface `Map`. Abaixo lhe convido a experimentar cada uma das faixas de código para entender as diferenças e alternativas:
```java
package br.com.java.collections.map;

import java.util.HashMap;
import java.util.Map;

public class MapTester {
    public static void main(String[] args) {
        // teste o código aqui
    }
}
```

O código a seguir demonstra como inicializar um `HashMap` em Java:

```java
Map<String, String> map = Map.of();
```

No exemplo a seguir, um `Map` com várias entradas é inicializado. Este por padrão suporta um máximo de 10 pares chave-valor e só é suportado a partir do Java 9 em diante **(recomendo que use o 11)**.

```java
Map<String, String> map = Map.of("key1","value1", "key2", "value2");
```
Outro formato seria:

```java
Map<String, String> map1 = Map.ofEntries(
        Map.entry("key1","value1"),
        Map.entry("key2", "value2")
)
```

O código a seguir cria um **map** por meio `new` e adiciona várias entradas a ele por meio do operador `put`.

```java
Map<String, String> map = new HashMap<>();
map.put("Android", "Mobile");
map.put("Intellij Idea Community IDE", "Java");
map.put("Eclipse RCP", "Java");
map.put("Git", "Version control system");
```

Você pode remover uma entrada de um **map** por meio do método `remove`.

```java
Map<String, String> map = Map.of("Android","Mobile OS", "Flutter", "Development environment");
map.remove("Android");
```
Para printar cada elemento de um **map**, você pode usar o método `forEach`, que recebe um lambda como parâmetro.

```java
map.forEach((k, v) -> System.out.printf("%s %s%n", k, v));
```

Você pode também converter suas chaves ou valores em uma matriz ou lista. O código a seguir demonstra isso.

```java
Map<String, String> map = new HashMap<>();
map.put("Android", "Mobile");
map.put("Eclipse IDE", "Java");
map.put("Intellij IDE", "Java");
map.put("Git", "Version control system");

// converte chaves para um array
String[] keys = map.keySet().toArray(new String[map.keySet().size()])

for (String string : keys) {
    System.out.println(string);
}
// converte chaves para uma lista
List<String> list = new ArrayList<String>(map.keySet());
for (String string : list) {
    System.out.println(string);
}
```
Você pode usar o método `getOrDefault()` para retornar o valor de uma chave ou um valor padrão se a chave não estiver presente no **map**.

```java
Map<String,Integer> map = new HashMap<>();
map.put("Android", 1 + map.getOrDefault("Android", 0));

// escrever na linha de comando
map.forEach((k, v) -> System.out.printf("%s %s%n", k, v));
```

O `computeIfAbsent` calcula e adiciona uma entrada ao **map** se ela não estiver presente no **map**.

```java
Map<String,Integer> map = Map.of();

Integer calculatedVaue = map.computeIfAbsent("Java", it -> 0);
System.out.println(calculatedVaue);

map.keySet().forEach(key -> System.out.println(key + " " + map.get(key)));
```

---

Classificar uma collection em Java é fácil, basta usar `Collections.sort(Collection)` para classificar seus valores. O código a seguir mostra um exemplo:

```java
package br.com.collections;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class Simple {
    public static void main(String[] args) {
        // crie um novo ArrayList com o método auxiliar Arrays.asList
        List<Integer> list = Arrays.asList(5,4,3,6,7,2,1);
        // classificando
        Collections.sort(list);
        // printar no console
        list.forEach(System.out::println);
    }
}
```

Isso é possível porque `Integer` implementa a interface `Comparable`. Esta interface define o método compare que realiza a comparação por pares dos elementos e retorna -1 se o elemento for menor que o elemento comparado, 0 se for igual e 1 se for maior. Se o que classificar de forma diferente, você pode definir sua implementação personalizada com base na interface Comparator por meio de uma expressão lambda.

```java
package br.com.collections;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class ListCustomSorterExample {
    public static void main(String[] args) {
        List<Integer> list = Arrays.asList(5,4,3,6,7,2,1);

        // comparador personalizado
        Collections.sort(list, (o1, o2) -> (o1>o2 ? -1 : (o1==o2 ? 0 : 1)));
        // a alternativa pode reutilizar o comparador inteiro
        // Collections.sort(list, Integer::);
        list.forEach(System.out::println);
    }
}
```

Você pode classificar por qualquer atributo ou até mesmo uma combinação de atributos. Por exemplo, se você tiver objetos do tipo Pessoa com os atributos chamados `income` e `dataOfBirth`, poderá definir diferentes implementações de `Comparator` e classificar os objetos de acordo com suas necessidades.

