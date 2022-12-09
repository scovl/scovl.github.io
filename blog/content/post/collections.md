+++
title = "Java#Core - Collections"
description = "Usando lists e maps"
date = 2022-12-05T17:31:45-03:00
tags = ["java,desenvolvimento,dev,development"]
draft = false
weight = 1
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

O código acima funciona, e a mão invisível da gambiarra treme quando desejamos forçar seu funcionamento. O problema é que o código fica muito pouco legível, fica bem porco mesmo. Então a sugestão que indico é ir pelo caminho feliz usando a interface Collection. A interface Collection é um subtipo da `Iterable` e tem um método stream , portanto, possibilita tanto a iteração como o acesso em stream. À vista disso, a Collection ou um subtipo apropriado é geralmente o melhor tipo de retorno para um método público que retorne uma sequência. Os arrays também possibilitam uma iteração fácil e um acesso em stream a partir dos métodos `Arrays.asList` e `Stream.of`. Se a sequência que você está retornando for pequena o bastante para se encaixar facilmente na memória, provavelmente é melhor você retornar uma das implementações padrões da coleção, tais como a `ArrayList` ou `HashSet` . Porém, não armazene uma sequência grande na memória somente para a retornar como uma coleção .


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

---

![qa](https://cdn-icons-png.flaticon.com/128/1720/1720482.png#center)

# Perguntas e respostas em entrevistas

Abaixo selecionei alguma perguntas e respostas em entrevistas relacionadas ao assunto deste artigo. Vamos lá:


## 1. Como funciona o LinkedList em Java?

**LinkedList** é a implementação de lista duplamente vinculada da interface de lista, pode ser iterado na direção reversa usando `descendingIterator()` e pode conter elementos duplicados. Além disso o `LinkedList` mantém a ordem de inserção, não é sincronizado e a manipulação de `LinkedList` é rápida porque nenhum deslocamento precisa ocorrer. E por fim, `LinkedList` pode ser usado como lista, pilha ou fila.

## 2. Quais são as vantagens e desvantagens das LinkedList?

**Vantagens das LinkedList em Java:**

As LinkedList têm operação de inserção e exclusão em qualquer posição. Arrays requerem tempo `O(n)O(n)` para fazer a mesma coisa, porque você teria que "deslocar" todos os itens subseqüentes em 1 índice. As LinkedList podem continuar a se expandir enquanto houver espaço na máquina. Arrays (em linguagens de baixo nível) devem ter seu tamanho especificado com antecedência. Mesmo se o array for dinâmico como é o caso das `ArrayLists` que se redimensionam automaticamente quando ficam sem espaço, a operação para redimensionar um array dinâmico tem um alto custo que pode tornar uma única inserção inesperadamente cara. 

**Desvantagens das LinkedList em Java:**

Para acessar ou editar um item em uma lista encadeada, você deve levar `O(i)O(i)` de tempo para caminhar do início da lista até o iésimo item (a menos, é claro, que você já tenha um ponteiro direto para esse item). 

## 3. Quantos tipos de LinkedLists existem?

As LinkedLists podem ser categorizadas em três tipos: 

**Link único:** as listas têm um único ponteiro apontando para o próximo elemento da lista. O último ponteiro está vazio ou aponta para nulo, significando o fim da lista. 

**Duplamente encadeados:** as listas possuem dois ponteiros, um apontando para o próximo elemento e outro apontando para o elemento anterior. O ponteiro anterior do nó principal aponta para nulo e o próximo ponteiro do nó final aponta para nulo para sinalizar o fim da lista. 

**Circular vinculado:** as listas geralmente representam buffers. Eles não têm cabeça ou cauda, e a questão principal é evitar travessias infinitas por causa do ciclo. As matrizes geralmente são um substituto melhor para uma lista vinculada circular, usando o operador de módulo para contornar.

## 4. Como descobrir se a LinkedList tem um loop?

Se mantivermos dois ponteiros e incrementarmos um ponteiro após processar dois nodes e outro após processar cada node. É provável que encontremos uma situação em que ambos os ponteiros estarão apontando para o mesmo node. Isso só acontecerá se a lista encadeada tiver um loop.

## 5. Qual é a diferença entre Singly Linked List e Doubly Linked List no Java?

A principal diferença entre uma Singly Linked List e uma Doubly Linked List é a capacidade de percorrer de cada uma delas. Em uma Singly Linked List, o node aponta apenas para o próximo node e não há ponteiro para o node anterior. O que significa que você não pode voltar em uma Singly Linked List. Por outro lado, a Doubly Linked List mantém dois ponteiros, para o nó seguinte e anterior, o que permite navegar em ambas as direções em qualquer lista vinculada.

## 6. Quais interfaces são implementadas por LinkedList em Java?

As seguintes interfaces são implementadas por Linkedlists:

* Serializable - 
* Queue - 
* List - 
* Cloneable - 
* Collection - 
* Deque - 
* Iterable - 

## 7. Qual a diferença entre LinkedList e Array?
* **Tamanho:** Como os dados só podem ser armazenados em blocos contíguos de memória em um array, seu tamanho não pode ser alterado em tempo de execução devido ao risco de sobrescrever outros dados. No entanto, em uma `LinkedList`, cada nó aponta para o próximo, de modo que os dados possam existir em endereços dispersos (não contíguos); isso permite um tamanho dinâmico que pode mudar em tempo de execução. 
* **Alocação de memória:** Para arrays em tempo de compilação e em tempo de execução para `LinkedList`. mas uma matriz alocada dinamicamente também aloca memória em tempo de execução. 
* **Eficiência de memória:** Para o mesmo número de elementos, as `LinkedList` usam mais memória, pois uma referência ao próximo nó também é armazenada junto com os dados. No entanto, a flexibilidade de tamanho em listas encadeadas pode fazer com que usem menos memória geral; isso é útil quando há incerteza sobre o tamanho ou há grandes variações no tamanho dos elementos de dados; A memória equivalente ao limite superior do tamanho deve ser alocada (mesmo que nem toda ela esteja sendo usada) durante o uso de arrays, enquanto as listas encadeadas podem aumentar seus tamanhos passo a passo proporcionalmente à quantidade de dados.
* **Tempo de execução:** Qualquer elemento em uma matriz pode ser acessado diretamente com seu índice. No entanto, no caso de uma `LinkedList`, todos os elementos anteriores devem ser percorridos para chegar a qualquer elemento. Além disso, uma melhor localidade de cache em arrays (devido à alocação de memória contígua) pode melhorar significativamente o desempenho. Como resultado, algumas operações (como modificar um determinado elemento) são mais rápidas em arrays, enquanto outras (como inserir/excluir um elemento nos dados) são mais rápidas em listas encadeadas.
* **Inserção:** Em uma matriz, a operação de inserção leva mais tempo, mas em uma `LinkedList` essas operações são rápidas. Por exemplo, se quisermos inserir um elemento na matriz na posição final da matriz e a matriz estiver cheia, copiamos a matriz em outra matriz e podemos adicionar um elemento, enquanto se a lista vinculada estiver cheia, encontramos o último nó e torná-lo ao lado do novo nó.
* **Dependência:** Em uma matriz, os valores são independentes uns dos outros, mas no caso de `LinkedList`, os nós são dependentes uns dos outros. um nó é dependente de seu nó anterior. Se o nó anterior for perdido, não poderemos encontrar os próximos nós subsequentes. 

## 8. Qual a diferença entre LinkedList e Array List?

* **No LinkedList**, as operações de inserção, adição e remoção são mais rápidas em comparação com os ArrayLists porque não há necessidade de redimensionar o LinkedList.
* **LinkedList** é baseado na implementação dupla de `LinkedList`, por outro lado, os ArrayLists são baseados em arrays redimensionáveis dinamicamente.
* **LinkedList** consome mais memória do que ArrayList.
* **ArrayList** fornece acesso aleatório a qualquer item, enquanto `LinkedList` fornece acesso sequencial aos itens.
* **Em ArrayList**, o processo de manipulação é um pouco lento em comparação com `LinkedList` porque em `ArrayList`, quando um item é removido, várias alterações (mudança de itens) ocorrem.