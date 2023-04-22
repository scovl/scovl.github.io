+++
title = "Java#Core - Collections"
description = "Usando lists e maps"
date = 2022-12-05T17:31:45-03:00
tags = ["java,desenvolvimento,dev,development"]
draft = false
weight = 3
author = "Vitor Lobo Ramos"
+++

![Java](https://cdn-icons-png.flaticon.com/512/1183/1183618.png#center)

Streams foram adicionadas no Java 8 complicando substancialmente a tarefa de escolher o tipo de retorno mais adequado para um método que retornasse uma sequência. Afinal, agora podemos usar as streams para retornar uma sequência de elementos. No entanto, escrever um bom código exige uma combinação sensata de streams e iterações. Outro ponto é que utilizar excessivamente as streams faz com que os programas fiquem difíceis de se ler e de fazer manutenção. Se uma API retornar apenas uma stream e alguns usuários quiserem fazer iterações sobre a sequência retornando com um loop `for-each`, eles ficarão bem chateados visto que a interface Stream falha em não estender a `Iterable`. Infelizmente, não existe uma solução paliativa boa para esse problema. À primeira vista, pode parecer que passar referência de método para o método iterator da `Stream` poderia funcionar. Vamos ver essa gambeta de perto:

```java
// Nao compilará por causa das limitações de inferência de tipo do Java
for (ProcessHandle ph : ProcessHandle.allProcesses()::iterator){
    // Executa o processo
}
```

Pra dar certo, você deve fazer o cast da referência do método com uma Iterable adequadamente parametrizada:

```java
// Gambiarra medonha para fazer a iteração usando Stream
for (ProcessHandle ph : (Iterable<ProcessHandle>)){
    ProcessHandle.allProcesses()::iterator)
}
```

Apesar do código acima funcionar, fica ilegível. Minha sugestão aqui é que se use a interface Collection. A interface Collection é um subtipo da `Iterable` e tem um método stream, portanto, possibilita tanto a iteração como o acesso em stream. À vista disso, a Collection ou um subtipo apropriado é geralmente o melhor tipo de retorno para um método público que retorne uma sequência. Os arrays também possibilitam uma iteração fácil e um acesso em stream a partir dos métodos `Arrays.asList` e `Stream.of`. Se a sequência que você está retornando for pequena o bastante para se encaixar facilmente na memória, provavelmente é melhor você retornar uma das implementações padrões da coleção, tais como a `ArrayList` ou `HashSet` . Porém, não armazene uma sequência grande na memória somente para a retornar como uma coleção .


![Java](https://d1k5j68ob7clqb.cloudfront.net/processed/thumb/L83YqX0Y7RbK4Rogb0.png#floatleft)

Arrays não mudam automaticamente o tamanho em tempo de execução para acomodar elementos adicionais. Já a classe `ArrayList<T>` (pacote **[java.util]()**) fornece uma solução conveniente para esse problema — ela pode alterar dinamicamente seu tamanho para acomodar mais elementos. O T (por convenção) é um espaço reservado — ao declarar um novo `ArrayList`, substitua-o pelo tipo dos elementos que você deseja que o `ArrayList` armazene. Diferentemente de arrays convencionais que servem para armazenar diversos objetos e que é inicializado com um tamanho predefinido durante a instanciação, as collections são estruturas que processam um conjunto de dados que são encapsulados e os dados só são acessados por meio de métodos. Por exemplo, imagine que sua aplicação salva os dados em um objeto do tipo Pessoas. Você poderá armazenar vários objetos Pessoas em uma collection. O Java normalmente fornece uma interface, como `List` e uma ou várias implementações para essa interface, por exemplo, a classe `ArrayList` e `LinkedList`. Uma classe ou interface cuja declaração tem um ou mais parâmetros de tipo, é uma classe ou interface genérica. 

Por exemplo, `List` define um parâmetro de tipo `List<E>`. Um ponto importante sobre as collections é que elas devem ser parametrizadas com uma declaração de tipo. Isso permite que o compilador Java verifique se você tentou usar sua collection com o tipo correto de objetos. Os genéricos permitem que um tipo ou método opere em objetos de vários tipos enquanto fornecem segurança de tipo em tempo de compilação. Antes dos genéricos, você tinha que converter todos os objetos lidos de uma coleção e, se inserisse um objeto do tipo errado em uma collection, criaria uma exceção em tempo de execução. Algumas Collections são ordenadas, outras organizadas. Na API elas estão organizadas como na seguinte instrução:

* **Organizada:** [LinkedHashSet](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/LinkedHashSet.html), [ArrayList](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/ArrayList.html), [Vector](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Vector.html), [LinkedList](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/LinkedList.html), [LinkedHashMap](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/LinkedHashMap.html).
* **Não organizada:** [HashSet](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/HashSet.html), [TreeSet](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/TreeSet.html), [PriorityQueue](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/PriorityQueue.html), [HashMap](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/HashMap.html), [HashTable](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Hashtable.html), [TreeMap](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/TreeMap.html).
* **Ordenada:** [TreeSet](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/TreeSet.html), [PriorityQueue](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/PriorityQueue.html), [TreeMap](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/TreeMap.html).
* **Não ordenada:** [HashSet](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/HashSet.html), [LinkedHashSet](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/LinkedHashSet.html), [ArrayList](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/ArrayList.html), [Vector](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Vector.html), [LinkedList](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/LinkedList.html), [HashMap](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/HashMap.html), [HashTable](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Hashtable.html), [LinkedHashMap](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/LinkedHashMap.html).

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

A interface `Map` define um objeto que mapeia chaves para valores. Um `Map` não pode conter chaves duplicadas; cada chave pode mapear para no máximo um valor. A classe `HashMap` é uma implementação eficiente da interface `Map`. Abaixo lhe convido a experimentar cada uma das faixas de código para entender as diferenças e alternativas. O código a seguir demonstra como inicializar um `HashMap` em Java:

```java
package br.com.java.collections.map;

import java.util.HashMap;
import java.util.Map;

public class MapTester {
    public static void main(String[] args) {
        Map<String, String> map = Map.of();
        map.forEach((k, v) -> System.out.printf("%s %s%n", k, v));
    }
}
```

No exemplo a seguir, um `Map` com várias entradas é inicializado. Este por padrão suporta um máximo de 10 pares chave-valor e só é suportado a partir do Java 9 em diante **(recomendo que use o 11)**.

```java
package br.com.java.collections.map;

import java.util.HashMap;
import java.util.Map;

public class MapTester {
    public static void main(String[] args) {
        Map<String, String> map = Map.of("key1","value1", "key2", "value2");
        map.forEach((k, v) -> System.out.printf("%s %s%n", k, v));
    }
}
```

Outro formato seria:

```java
package br.com.java.collections.map;

import java.util.HashMap;
import java.util.Map;

public class MapTester {
    public static void main(String[] args) {
        Map<String, String> map1 = Map.ofEntries(
        Map.entry("key1","value1"),
        Map.entry("key2", "value2"))
        map.forEach((k, v) -> System.out.printf("%s %s%n", k, v));
    }
}
```


O código a seguir cria um **map** por meio `new` e adiciona várias entradas a ele por meio do operador `put`.

```java
package br.com.java.collections.map;

import java.util.HashMap;
import java.util.Map;

public class MapTester {
    public static void main(String[] args) {
        Map<String, String> map = new HashMap<>();
        map.put("Android", "Mobile");
        map.put("Intellij Idea Community IDE", "Java");
        map.put("Eclipse RCP", "Java");
        map.put("Git", "Version control system");

        map.forEach((k, v) -> System.out.printf("%s %s%n", k, v));
    }
}
```


Você pode remover uma entrada de um **map** por meio do método `remove`.

```java
package br.com.java.collections.map;

import java.util.HashMap;
import java.util.Map;

public class MapTester {
    public static void main(String[] args) {
        Map<String, String> map = Map.of("Fedora", "OpenBSD", "Debian", "Arch Linux");
        map.remove("Debian");

        map.forEach((k, v) -> System.out.printf("%s %s%n", k, v));
    }
}
```

Você pode também converter suas chaves ou valores em uma matriz ou lista. O código a seguir demonstra isso.

```java
package br.com.java.collections.map;

import java.util.HashMap;
import java.util.Map;

public class MapTester {
    public static void main(String[] args) {
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
    }
}
```

Você pode usar o método `getOrDefault()` para retornar o valor de uma chave ou um valor padrão se a chave não estiver presente no **map**.

```java
package br.com.java.collections.map;

import java.util.HashMap;
import java.util.Map;

public class MapTester {
    public static void main(String[] args) {
        Map<String,Integer> map = new HashMap<>();
        map.put("Android", 1 + map.getOrDefault("Android", 0));

        // escrever na linha de comando
        map.forEach((k, v) -> System.out.printf("%s %s%n", k, v));
    }
}
```

O `computeIfAbsent` calcula e adiciona uma entrada ao **map** se ela não estiver presente no **map**.

```java
package br.com.java.collections.map;

import java.util.HashMap;
import java.util.Map;

public class MapTester {
    public static void main(String[] args) {
        Map<String,Integer> map = Map.of();
        Integer calculatedVaue = map.computeIfAbsent("Java", it -> 0);
        System.out.println(calculatedVaue);

        map.keySet().forEach(key -> System.out.println(key + " " + map.get(key)));
    }
}
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

Você pode classificar por qualquer atributo ou até mesmo uma combinação de atributos. Por exemplo, se você tiver objetos do tipo Pessoa com os atributos chamados `income` e `dataOfBirth`, poderá definir diferentes implementações de `Comparator` e classificar os objetos de acordo com suas necessidades. O código abaixo demonstra várias operações em LinkedLists. O programa cria duas `LinkedLists` de Strings. Os elementos de uma `List` são adicionados à outra. Então, todas as Strings são convertidas em letras maiúsculas e um intervalo de elementos é excluído.

```java
// Lists, LinkedLists e ListIterators.
import java.util.List;
import java.util.LinkedList;
import java.util.ListIterator;
public class ListTest
{
    public static void main(String[] args){
    // adiciona elementos colors à list1
        String[] colors = {"black", "yellow", "green", "blue", "violet", "silver"};
        List<String> list1 = new LinkedList<>();

        for (String color : colors)
            list1.add(color);

    // adiciona elementos colors2 à list2
        String[] colors2 = {"gold", "white", "brown", "blue", "gray", "silver"};
        List<String> list2 = new LinkedList<>();

        for (String color : colors2)
            list2.add(color);

        list1.addAll(list2); // concatena as listas
        list2 = null; // libera recursos
        printList(list1); // imprime elementos list1
        convertToUppercaseStrings(list1); // converte em string de letras maiúsculas
        printList(list1); // imprime elementos list1
        System.out.printf("%nDeleting elements 4 to 6...");
        removeItems(list1, 4, 7); // remove itens 4 a 6 da lista
        printList(list1); // imprime elementos list1
        printReversedList(list1); // imprime lista na ordem inversa
    }
    // gera saída do conteúdo de List
    private static void printList(List<String>list){
        System.out.printf("%nlist:%n");
        for (String color : list)
            System.out.printf("%s ", color);
        System.out.println();
    }

    // localiza objetos String e converte em letras maiúsculas
    private static void convertToUppercaseStrings(List<String> list){
        ListIterator<String> iterator = list.listIterator();

        while (iterator.hasNext()){
            String color = iterator.next(); // obtém o item
            iterator.set(color.toUpperCase()); // converte em letras maiúsculas
        }
    }
    // obtém sublista e utiliza método clear para excluir itens da sublista
    private static void removeItems(List<String> list, int start, int end){
        list.subList(start, end).clear(); // remove os itens
    }
    // imprime lista invertida
    private static void printReversedList(List<String> list){
        ListIterator<String> iterator = list.listIterator(list.size());
        System.out.printf("%nReversed List:%n");
        // imprime lista na ordem inversa
        while (iterator.hasPrevious())
            System.out.printf("%s ", iterator.previous());
    }
} // fim da classe ListTest

```