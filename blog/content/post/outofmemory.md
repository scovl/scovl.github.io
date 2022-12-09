+++
title = "Java#Core - java.lang.OutOfMemoryError"
description = "Como simular o java.lang.OutOfMemoryError"
date = 2022-12-09T05:31:45-03:00
tags = ["java,desenvolvimento,dev,development"]
draft = false
weight = 3
author = "Vitor Lobo Ramos"
+++

![Java](https://cdn-icons-png.flaticon.com/512/1183/1183618.png#center)

Criar e manter estruturas de dados dinâmicos requer alocação dinâmica em memória. Isto é, permissão para que um programa obtenha mais espaço em memória e em tempo de execução para armazenar novos nodes e, ao mesmo tempo, liberar espaço não mais necessário. Lembre-se de que o Java não exige que você libere explicitamente a memória alocada dinamicamente. Em vez disso, ele realiza a coleta de lixo automática de objetos que não são mais referenciados em um programa. O limite para alocação dinâmica de memória pode ser tão grande quanto a quantidade de memória física disponível no computador ou a quantidade de espaço em disco disponível em um sistema de memória virtual. 

Frequentemente, os limites são muito menores, porque a memória disponível do computador deve ser compartilhada entre muitos aplicativos. A idéia do código a seguir é a de criar um objeto de 1 MB, adicionar a uma lista e repetir o processo de criação e adição até que a JVM lance `OutOfMemoryError`.

```java
package br.com.java.memory;

import java.util.ArrayList;
import java.util.List;

public class JavaEatMemory {
	public static void main(String[] args) {
        List<byte[]> list = new ArrayList<>();
        int index = 1;
        while (true) {
                // 1MB cada loop, 1 x 1024 x 1024 = 1048576
                byte[] b = new byte[1048576];
                list.add(b);
                Runtime rt = Runtime.getRuntime();
                System.out.printf("[%d] memória livre de: %s%n", index++, rt.freeMemory());
        }
    }
}
```

Saída:

```bash
[2037] memória livre de: 7633504
[2038] memória livre de: 5536352
[2039] memória livre de: 3439104
[2040] memória livre de: 1573072

Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
	at com.mkyong.JavaEatMemory.main(JavaEatMemory.java:20)
```

Qual a utilidade de propositalmente gerar estes erros!? A de configurar a JVM para gerar um DUMP do erro e o analisar afim de escobrir onde e porque o erro foi estourado exatamente considerando que estamos tratando de uma aplicação consideravelmente grande. 

Embora os dumps de heap sejam gerados apenas em resposta a um vazamento de memória detectado, você deve entender que gerar dumps de heap pode ter um impacto de desempenho grave em servidores. Ao gerar vários dumps do heap manualmente para análise de fuga de memória, certifique-se de que objetos significativos sejam deixados de fora entre os dois dumps do heap. Essa abordagem permite que as que você garanta a origem da fuga de memória. Heap dumps, que são snapshots da memória, guardam todo o conteúdo da memória em um arquivo .hprof. Podemos gerar este arquivo adicionando o seguinte parâmetro na JVM:

```bash
-XX:+HeapDumpOnOutOfMemoryError
```

Isso irá gerar um dump toda vez que erros de OutOfMemoryError ocorrerem. Para analisar este arquivo você pode utilizar o **[Analyze the memory snapshot](https://www.jetbrains.com/help/idea/read-the-memory-snapshot.html)** no Intellij idea, assim será possível identificar exatamente qual classe e/ou objeto está causando o estouro de memória no Java e efetivamente corrigir o problema.