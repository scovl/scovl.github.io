+++
title = "Java - java.lang.OutOfMemoryError"
description = "Como simular o java.lang.OutOfMemoryError"
date = 2020-04-19T17:31:45-03:00
tags = ["java,desenvolvimento,dev,development"]
draft = true
weight = 7
author = "Vitor Lobo Ramos"
+++

A ideia é simples, crie um objeto com 1 MB, adicione-o a uma lista e repita o processo de criação e adição até que a JVM lance OutOfMemoryError.

```java
while (true) {
    // 1MB each loop, 1 x 1024 x 1024 = 1048576
    byte[] b = new byte[1048576];
    list.add(b);
}
```

### Java heap space

O exemplo de Java abaixo será executado e lançará um java.lang.OutOfMemoryError:

```java
package br.com.java.memory;

import java.util.ArrayList;
import java.util.List;

public class JavaEatMemory {
	public static void main(String[] args) {
        List<byte[]> list = new ArrayList<>();
        int index = 1;
        while (true) {
                // 1MB each loop, 1 x 1024 x 1024 = 1048576
                byte[] b = new byte[1048576];
                list.add(b);
                Runtime rt = Runtime.getRuntime();
                System.out.printf("[%d] free memory: %s%n", index++, rt.freeMemory());
        }
	}
}
```

Saída:

```bash
[2037] free memory: 7633504
[2038] free memory: 5536352
[2039] free memory: 3439104
[2040] free memory: 1573072
Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
	at com.mkyong.JavaEatMemory.main(JavaEatMemory.java:20)
```