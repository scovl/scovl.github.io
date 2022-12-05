+++
title = "#Java - Map e HashMap"
description = "Usando Map e HashMap"
date = 2020-04-19T17:31:45-03:00
tags = ["java,desenvolvimento,dev,development"]
draft = true
weight = 5
author = "Vitor Lobo Ramos"
+++

### Map e HashMap

A interface Map define um objeto que mapeia chaves para valores. Um mapa não pode conter chaves duplicadas; cada chave pode mapear para no máximo um valor. A classe HashMap é uma implementação eficiente da interface Map. Para ver os trechos de código a seguir em ação, coloque-os neste método principal onde colocar código de teste aqui é indicado. Exemplo:

```java
package br.com.java.collections.map;

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

### Inicialize um mapa não modificável por meio de Map.ofEntries();

```java
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