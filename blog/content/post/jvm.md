+++
title = "JVM"
description = "Gerenciamento de memória da JVM"
date = 2022-12-05T17:31:45-03:00
tags = ["java,desenvolvimento,dev,development"]
draft = true
weight = 1
author = "Vitor Lobo Ramos"
+++



Java é uma das maiores plataformas tecnológicas do mundo, com aproximadamente 9 a 10 milhões de desenvolvedores, de acordo com a Oracle. Embora muitos desenvolvedores não precisem conhecer os detalhes de baixo nível da plataforma na qual trabalham, é importante que os desenvolvedores interessados em desempenho compreendam os conceitos básicos da JVM (Java Virtual Machine). Entender a JVM permite que os desenvolvedores escrevam um software mais eficiente e fornece o conhecimento teórico necessário para investigar problemas relacionados ao desempenho. Neste artigo, exploraremos a forma como a JVM executa o Java, bem como os conceitos básicos da JVM.

O processo começa com o código que você escreve em Java. Esse código é convertido em arquivos `.class`, que são chamados de bytecodes. O bytecode é uma forma intermediária do código em Java e pode ser usado em qualquer lugar, independentemente da máquina que está sendo usada. O arquivo `.class` tem uma estrutura definida, que precisa ser seguida para ser executado na JVM. Se não estiver de acordo, a JVM imediatamente imprime um erro. Além disso, o arquivo `.class` também tem informações adicionais, como métodos, que podem ser vistos usando a ferramenta `javap`. E o compilador `javac` adiciona um construtor padrão automaticamente, mesmo se você não escrever um. Finalmente, a JVM executa o bytecode, convertendo-o em instruções que a máquina entenda e pode executar.

Isso fornece a abstração da linguagem Java e permite a execução de software desenvolvido em Java em uma ampla gama de sistemas operacionais e arquiteturas de hardware. Além disso, a JVM é uma plataforma para outras linguagens, permitindo a execução de código em qualquer linguagem que possa produzir um arquivo de classe válido. Quando você usa o comando `javap` no terminal ou no prompt de comando, você está gerando uma saída desmontada do bytecode gerado pela JVM para a classe Java que você especificou. O `javap` é uma ferramenta da JVM que permite visualizar o bytecode gerado a partir do código Java. No exemplo abaixo, podemos tomar como base um simples HelloWorld:

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

Quando você executa o comando "javap HelloWorld", a saída seria a seguinte:

```java
Compiled from "HelloWorld.java"
public class HelloWorld {
  public HelloWorld();
    Code:
       0: aload_0
       1: invokespecial #1                  // Método java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
       3: ldc           #3                  // String Hello, World!
       5: invokevirtual #4                  // Método java/io/PrintStream.println:(Ljava/lang/String;)V
       8: return
}
```

Nesta saída, é possível ver que o bytecode da JVM é representado como uma série de instruções que são compostas de opcodes (instruções) e operandos (argumentos dessas instruções). Por exemplo, a instrução `ldc #3` carrega o valor constante na pilha (neste caso, a string "Hello, World!"), e a instrução `invokevirtual #4` chama o método `println` da classe `java.io.PrintStream`. O `javap` também fornece comentários para ajudar a interpretar o bytecode, como o número de linha correspondente no código Java e o nome completo do método ou campo referenciado. Esta informação pode ser útil para entender como o código Java é executado na JVM.

A JVM fornece uma camada de abstração para que o código Java possa ser executado em diferentes sistemas operacionais sem a necessidade de mudanças ou adaptações. Além disso, a JVM inclui a funcionalidade HotSpot, que é uma das principais mudanças em termos de desempenho introduzidas pela Sun em 1999. O HotSpot é uma tecnologia de compilação Just-in-Time (JIT) que monitora a aplicação enquanto ela está sendo executada e identifica as partes do código mais frequentemente utilizadas. Quando um método atinge um determinado limiar, o HotSpot compila e otimiza esse trecho do código, melhorando o desempenho da aplicação. Isso permite que os desenvolvedores escrevam código Java idiomático e sigan boas práticas de design, sem se preocupar com o desempenho.

Ao contrário de outras linguagens como C++, que seguem o princípio de "zero sobrecarga", o HotSpot não prioriza o desempenho bruto e em vez disso, aplica otimizações inteligentes com base nas informações capturadas durante a análise. O objetivo é permitir que os desenvolvedores escrevam código Java de forma clara e eficiente, sem precisar lidar com as complexidades da máquina virtual.

Além de fornecer uma camada de abstração e otimização de desempenho, a JVM também gerencia a memória de forma eficiente. A JVM divide a memória em várias áreas, como a pilha, a área de armazenamento de objetos e a área de armazenamento de metadados, cada uma com suas próprias funções e características. A JVM também realiza a gestão automática da memória por meio do garbage collector (coletor de lixo), que verifica o estado da memória e libera objetos que não estão mais sendo utilizados. Isso significa que os desenvolvedores não precisam se preocupar com problemas de vazamento de memória ou com a alocação manual de recursos, como é o caso de outras linguagens de programação. Em suma, a JVM permite que os desenvolvedores se concentrem na implementação do negócio, sem precisar lidar com as complexidades da gestão de memória.

## Gerenciamento de memória da JVM

O gerenciamento de memória na JVM é uma das suas principais características e um dos motivos pelo qual é tão popular entre os desenvolvedores. Em contraste com linguagens como C, C++ e Objective-C, onde é responsabilidade do programador gerenciar a alocação e liberação de memória, a JVM foi projetada para aliviar a carga do desenvolvedor nesta tarefa ao introduzir o gerenciamento de memória de heap automatizado através do GC (Garbage Collector). O objetivo do garbage collector é recuperar e reutilizar memória que não é mais necessária, o que significa que o desenvolvedor não precisa se preocupar com a liberação de memória manualmente. Aqui está um exemplo simples de gerenciamento de memória na JVM:

```java
import java.util.ArrayList;
import java.util.List;

public class MemoryManagementExample {
  public static void main(String[] args) {
    // Alocação de objetos na memória
    List<String> list = new ArrayList<>();
    for (int i = 0; i < 1000000; i++) {
      list.add("Object " + i);
    }

    // Remoção de referências a objetos não mais utilizados
    list = null;

    // Forçar a execução do garbage collector
    System.gc();
  }
}
```

Neste exemplo, estamos alocando objetos de tipo String em uma lista, em um loop que adiciona um milhão de objetos. Depois disso, a referência à lista é definida como `null`, o que torna os objetos alocados nela não mais acessíveis. Finalmente, invocamos o método `System.gc()` para forçar o GC na JVM. A JVM é inerentemente multithreaded e permite aos desenvolvedores criarem novos segmentos de execução, o que adiciona complexidade ao comportamento do programa. Cada thread de aplicação Java corresponde a uma thread dedicada do sistema operacional e todas as threads de aplicação Java compartilham a mesma heap, que é coletada pelo GC comum. O Java Memory Model (JMM) é um modelo formal de memória que explica como as threads de execução veem mudanças nos valores contidos em objetos. Por exemplo:

```java
public class MemoryModelExample {
   private static boolean ready;
   private static int number;
   
   private static class ReaderThread extends Thread {
      public void run() {
         while (!ready) {
            Thread.yield();
         }
         System.out.println(number);
      }
   }
   
   public static void main(String[] args) {
      new ReaderThread().start();
      number = 42;
      ready = true;
   }
}
```

Neste exemplo, temos uma variável compartilhada `ready` e uma variável compartilhada `number`. A `thread ReaderThread` executa em loop até que ready seja definido como true, então ela imprime o valor de number. De acordo com o JMM (Java Memory Model), a JVM garante que a escrita em ready seja visível para a `thread ReaderThread` após a escrita em number ter sido concluída. Isso significa que a `thread ReaderThread` deve imprimir 42.

A implementação HotSpot que projetada para melhorar o desempenho da JVM, e isso inclui uma série de técnicas avançadas de gerenciamento de memória. A equipe de desenvolvimento do HotSpot continua melhorando o gerenciamento de memória da JVM para torná-lo mais eficiente e escalável. Em resumo, o gerenciamento de memória da JVM é um aspecto fundamental do ambiente Java que é administrado pela JVM e pelo HotSpot, e ajuda a manter aplicativos Java executando de forma eficiente e sem erros relacionados à memória. O gerenciamento de memória e a memória cache são conceitos importantes para entender a performance de um sistema computacional. As técnicas de gerenciamento de memória da JVM incluem:

### Garbage Collector

O GC (Garbage Collector) ou coletor de lixo é uma das características mais reconhecidas do ambiente Java. No passado, houve resistência a esta característica, pois a linguagem Java não oferecia meios de controlar o comportamento do GC. No entanto, atualmente é amplamente aceito que o compilador e o tempo de execução controlam adequadamente o gerenciamento de memória, e não o programador.

O GC no Java funciona da seguinte maneira: o tempo de execução automaticamente controla os objetos e descarta aqueles que já não são necessários, permitindo a reutilização da memória liberada. Existem duas regras importantes que todas as implementações devem seguir: coletar todo o lixo e nunca coletar um objeto que ainda está sendo usado. O Java tem uma abordagem gerenciada, o que significa que os programadores podem se concentrar em soluções de alto nível, enquanto as ferramentas e bibliotecas cuidam dos detalhes de baixo nível, como alocação de memória, gerenciamento de threads e segurança. Além disso, a máquina virtual Java ajuda a garantir a portabilidade da aplicação.

Em resumo, a abordagem gerenciada do Java torna mais fácil e rápido o desenvolvimento de aplicativos, pois permite que os programadores escrevam código de alto nível sem se preocupar com muitos detalhes de baixo nível. Embora o Java tenha umo GC, as especificações da linguagem e da VM não ditam como ela deve ser implementada, resultando em várias implementações diferentes, como o CMS (Concurrent Mark Sweep).

### Concurrent Mark Sweep

O CMS (Collector de Lixo Concorrente) é um GC para a JVM (Máquina Virtual Java) que foi projetado para melhorar o desempenho de aplicações Java em ambientes de múltiplos processadores. Era uma forma alternativa ao GC padrão, que era o GC serial. O CMS é projetado para ser usado em sistemas com restrições de tempo de execução, onde é importante minimizar as pausas de tempo de execução que ocorrem durante o GC. No entanto, o CMS foi depreciado a partir da versão Java 11.

A Oracle decidiu remover o GC CMS devido a suas limitações de desempenho e ao seu baixo desempenho em aplicações com memórias mais modernas. Hoje o Garbage Collector padrão do java, ao menos a partir da versão 9, é o G1. O G1 (Garbage First) é mais eficiente em termos de desempenho, escalabilidade, tempo de coleta lixo e uso de memória. Ele é um GC baseado em diversos algoritmos de marcação e limpeza. Ele usa marcação paralela para marcar os objetos que estão sendo usados ​​na memória e limpeza paralela para limpar os objetos não usados da memória. O G1 também possui um algoritmo de compactação para melhorar o desempenho de acesso à memória. Ele é otimizado para sistemas com múltiplos núcleos e usa várias threads para marcar e limpar a memória, o que significa que ele é altamente eficiente e rápido.

### Garbage First

O G1 é o único GC nativo que suporta a configuração de tamanho de memória de acordo com as necessidades de carga de trabalho do aplicativo. Ao contrário de outros GCs, o G1 divide a memória em menores unidades chamadas regiões, que são administradas de forma independente. Ao usar um algoritmo de coleta de lixo incremental, as regiões podem ser coletadas de forma individual, permitindo maior controle sobre o uso de memória e o desempenho da coleta de lixo. Além disso, o G1 usa um sistema de previsão para determinar quais regiões devem ser coletadas com base na previsão de uso de memória. Aqui estão alguns exemplos de comandos de linha que podem ser usados para fazer o tuning do Garbage First G1:

Configuração do número de regiões do heap: Por padrão, o G1 divide o heap em regiões de tamanho igual. Você pode usar a opção -XX:G1HeapRegionSize para definir o tamanho da região de heap. Por exemplo:

```java
java -XX:G1HeapRegionSize=32m MyMainClass
```

Configuração de porcentagem de heap destinada à coleta de lixo: Você pode usar a opção -XX:G1NewSizePercent e -XX:G1MaxNewSizePercent para definir a porcentagem de heap destinada à coleta de lixo. Por exemplo:

```java
java -XX:G1NewSizePercent=20 -XX:G1MaxNewSizePercent=50 MyMainClass
```

Configuração do tamanho da política de humilhação: O G1 usa a política de humilhação para definir a quantidade de espaço que será liberado em cado GC. Você pode usar a opção -XX:G1ReservePercent para definir o tamanho da política de humilhação. Por exemplo:

```java
java -XX:G1ReservePercent=10 MyMainClass
```

Configuração do nível de humilhação: O nível de humilhação é usado para determinar quantas regiões de heap serão liberadas em cado GC. Você pode usar a opção -XX:G1ConfidencePercent para definir o nível de humilhação. Por exemplo:

```java
java -XX:G1ConfidencePercent=75 MyMainClass
```

Estes são apenas alguns exemplos de comandos de linha que você pode usar para fazer o tuning do Garbage First G1. É importante notar que o tuning do Garbage First G1 pode ser complexo e que o desempenho ideal pode variar de acordo com a

### HotSpot

O HotSpot é uma implementação da JVM (Java Virtual Machine) que gerencia a memória de forma eficiente através de arenas. Essas arenas são gerenciadas diretamente pelo HotSpot, sem necessidade de interação com o sistema operacional. O gerenciamento de memória é controlado por duas variáveis importantes: taxa de alocação (a quantidade de memória utilizada por objetos recentemente criados) e vida útil do objeto (o tempo que um objeto existe antes de sua memória ser liberada).

O HotSpot aplica a hipótese fraca de geração, que sugere que a maioria dos objetos tem vida curta, o que é usado para otimizar o desempenho do GC. Em nível baixo, valores Java são representados como bits que correspondem a valores primitivos ou endereços de objetos, que são representados na memória como "oops". O tamanho da pilha é gerenciado pelo código de usuário e não depende de chamadas ao sistema.

O gerenciamento de memória no HotSpot está habilitado por padrão na JVM e é gerenciado automaticamente e otimizado com técnicas como o GC e a alocação dinâmica de memória. No entanto, as configurações do HotSpot podem ser ajustadas para atender às necessidades do usuário, como definir o tamanho máximo da heap (-Xmx) ou habilitar um algoritmo de GC específico (-XX:+UseConcMarkSweepGC). A documentação da JVM fornece uma lista completa das opções de linha de comando disponíveis.

### Object Allocation

A JVM aloca objetos na memória de forma eficiente, minimizando desperdícios de espaço. A seguir está um exemplo hipotético de como a JVM pode implementar a técnica de Object Allocation para alocar objetos de forma eficiente na memória:

```java
class ObjectAllocator {
    private static final int DEFAULT_CHUNK_SIZE = 128;
    private static final int OBJECT_HEADER_SIZE = 8;
    
    private int chunkSize;
    private List<byte[]> memoryChunks;
    private int currentChunkIndex;
    private int currentChunkOffset;

    public ObjectAllocator(int chunkSize) {
        this.chunkSize = chunkSize;
        memoryChunks = new ArrayList<byte[]>();
        currentChunkIndex = 0;
        currentChunkOffset = 0;
    }

    public ObjectAllocator() {
        this(DEFAULT_CHUNK_SIZE);
    }

    private void allocateNewChunk() {
        memoryChunks.add(new byte[chunkSize]);
        currentChunkIndex++;
        currentChunkOffset = 0;
    }

    public Object allocateObject(int size) {
        size += OBJECT_HEADER_SIZE;

        if (currentChunkOffset + size > chunkSize) {
            allocateNewChunk();
        }

        int objectAddress = currentChunkIndex * chunkSize + currentChunkOffset;
        currentChunkOffset += size;
        return new Object(objectAddress);
    }
}
```

Neste exemplo, a classe ObjectAllocator mantém uma lista de blocos de memória, onde cada bloco tem um tamanho especificado pelo usuário ou por uma constante padrão. Quando um objeto é solicitado para ser alocado, a classe verifica se o espaço necessário está disponível no bloco de memória atual. Se não houver espaço suficiente, uma nova alocação de bloco é feita. O objeto é então alocado no espaço de memória corrente, e o offset de memória é atualizado. O objeto retornado é uma referência para o endereço de memória alocado.

Esta é apenas uma implementação hipotética e pode ser diferente da forma como a JVM realmente aloca objetos na memória. No entanto, a ideia é mostrar como uma técnica de Object Allocation pode ser usada para minimizar desperdícios de espaço e alocar objetos de forma eficiente na memória.

### Object Pooling

A JVM pode reutilizar objetos previamente alocados, otimizando o uso da memória.Aqui está um exemplo de como o Java implementa a técnica de Object Pooling:

```java
import java.util.LinkedList;

class ObjectPool {
  private LinkedList<Object> pool = new LinkedList<>();

  public Object getObject() {
    if (pool.isEmpty()) {
      return new Object();
    } else {
      return pool.removeFirst();
    }
  }

  public void releaseObject(Object obj) {
    pool.addLast(obj);
  }
}
```

Nesse exemplo, a classe ObjectPool mantém uma lista ligada de objetos previamente criados. Quando uma nova instância é necessária, o método getObject verifica se há objetos disponíveis na lista. Se houver, ele remove o primeiro objeto da lista e o retorna. Caso contrário, ele cria uma nova instância. Quando um objeto não é mais necessário, o método releaseObject adiciona-o à lista para que possa ser reutilizado posteriormente. Isso ajuda a otimizar o uso da memória, já que ao reutilizar objetos, o número de alocações de memória é reduzido, minimizando desperdícios de espaço.

### Thread Local Storage 
A JVM pode armazenar informações em espaço de memória local a um thread, evitando acessos concorrentes e otimizando o desempenho. Aqui está um exemplo de como o Java pode armazenar informações em espaço de memória local a um thread usando a técnica Thread Local Storage:

```java
import java.util.concurrent.ThreadLocalRandom;

public class ThreadLocalExample {
    private static ThreadLocal<Integer> threadLocal = new ThreadLocal<>();

    public static void main(String[] args) {
        // Criando duas threads que acessam o mesmo objeto ThreadLocal
        Thread thread1 = new Thread(() -> {
            threadLocal.set(ThreadLocalRandom.current().nextInt());
            System.out.println("Thread 1: " + threadLocal.get());
        });
        Thread thread2 = new Thread(() -> {
            threadLocal.set(ThreadLocalRandom.current().nextInt());
            System.out.println("Thread 2: " + threadLocal.get());
        });
        
        thread1.start();
        thread2.start();
    }
}
```

Neste exemplo, criamos um objeto ThreadLocal chamado threadLocal que permite armazenar informações em espaço de memória local a cada thread que o acessa. As duas threads criadas, thread1 e thread2, acessam o objeto threadLocal e armazenam valores aleatórios diferentes nele. Note que cada thread tem sua própria cópia do valor armazenado em threadLocal, o que evita acessos concorrentes e otimiza o desempenho.

### Heap Optimization

A JVM pode otimizar o tamanho e a alocação de objetos na memória heap, maximizando a eficiência. Eexistem práticas recomendadas que podem ajudar a otimizar o uso do heap e minimizar o desperdício de memória, como:

* Evitar criar objetos desnecessários
* Reutilizar objetos onde possível, em vez de criar novos objetos
* Usar tipos de dados primitivos ao invés de objetos para dados simples, como int ao invés de Integer
* Usar coleções eficientes, como ArrayList ou HashMap, em vez de coleções ineficientes, como LinkedList

### Class Data Sharing

Class Data Sharing é uma técnica de otimização de desempenho que permite que dados de classe sejam compartilhados entre instâncias de uma classe. Em Java, isso é feito usando classloaders personalizados que carregam as classes em tempo de execução. Aqui está um exemplo simples de como Class Data Sharing pode ser implementado em Java:

```java
import java.util.HashMap;

public class ClassDataSharingExample {
    private static HashMap<String, Object> sharedData = new HashMap<>();

    public void putSharedData(String key, Object value) {
        sharedData.put(key, value);
    }

    public Object getSharedData(String key) {
        return sharedData.get(key);
    }
}
```

Neste exemplo, a classe ClassDataSharingExample possui um mapa estático de objetos compartilhados. Qualquer instância desta classe pode adicionar ou obter dados compartilhados usando os métodos putSharedData e getSharedData. Por padrão, em Java, todas as instâncias de uma classe compartilham o mesmo conjunto de dados estáticos, o que permite otimizar o uso de memória e aumentar o desempenho.


### Compacting Garbage Collection

A JVM é responsável por monitorar o uso da memória heap e otimizá-lo de acordo com as necessidades do aplicativo. Por exemplo, a JVM pode compactar a memória ao coletar lixo, movendo objetos vivos para o início da memória heap e liberando espaços vazios no final. Isso ajuda a manter a memória heap otimizada, maximizando a eficiência e evitando desperdício de espaço.

### Incremental Garbage Collection

Em geral, o GC incremental divide o GC em pequenas etapas, intercaladas com o tempo de execução do aplicativo, ao invés de executar o GC em uma única etapa, o que pode interromper o desempenho do aplicativo. Aqui está um exemplo hipotético de como o Java poderia implementar a técnica de coleta de lixo incremental:

```java
public class IncrementalGarbageCollector {
  private static final int MAX_PAUSE_TIME = 50;

  public static void main(String[] args) {
    // Executar o aplicativo
    while (true) {
      // Executar a tarefa principal do aplicativo
      runApplicationTask();

      // Executar uma pequena etapa de coleta de lixo
      long startTime = System.currentTimeMillis();
      runGarbageCollectionStep();
      long endTime = System.currentTimeMillis();

      // Verificar se a etapa de coleta de lixo levou mais tempo do que o permitido
      if (endTime - startTime > MAX_PAUSE_TIME) {
        // Se sim, interromper a execução do aplicativo e executar umo GC completa
        runFullGarbageCollection();
      }
    }
  }

  private static void runApplicationTask() {
    // Aqui é onde o código da tarefa principal do aplicativo seria inserido
  }

  private static void runGarbageCollectionStep() {
    // Aqui é onde o código da etapa de coleta de lixo seria inserido
  }

  private static void runFullGarbageCollection() {
    // Aqui é onde o código do GC completa seria inserido
  }
}
```

Este é apenas um exemplo hipotético, e a implementação real da técnica de coleta de lixo incremental varia de acordo com a implementação da JVM. Além disso, é importante destacar que o GC é geralmente realizada pela própria JVM, portanto, não é necessário escrever código para implementa-la.

### Parallel Garbage Collection

O Java permite que o GC seja executada em múltiplos threads, o que pode aumentar a velocidade do GC. A seguir, um exemplo hipotético de como você pode influenciar a JVM a usar este recurso:

```java
import java.lang.System;

public class ParallelGCExample {
  public static void main(String[] args) {
    System.gc();
    System.out.println("Parallel Garbage Collection Enabled: " + 
                       System.getProperty("java.compiler.parallelGC"));
  }
}
```

Neste exemplo, a chamada a System.gc() força a JVM a executar umo GC. A propriedade java.compiler.parallelGC é consultada para verificar se o GC paralela está habilitada. Se o GC paralela estiver habilitada, o valor retornado será "true".

Observe que o habilitação ou desabilitação do GC paralela é feita pela JVM, não pelo código Java. A JVM pode optar por usar o GC paralela ou não, dependendo das condições do sistema e do tamanho da heap. Além disso, é possível configurar a JVM para usar o GC paralela especificamente, definindo a propriedade -XX:+UseParallelGC na linha de comando ao iniciar a JVM.

### Manual Memory Management

O Java possui umo GC automática que cuida da gestão da memória, o que significa que os desenvolvedores não precisam se preocupar em liberar manualmente a memória. No entanto, em alguns casos, é possível usar o "Manual Memory Management" para otimizar o uso da memória e aumentar o desempenho.Em Java, é possível utilizar a API de gerenciamento de memória direto, como por exemplo a classe java.nio.ByteBuffer, para alocar, gerenciar e liberar manualmente a memória. Aqui está um exemplo:

```java
import java.nio.ByteBuffer;

public class ManualMemoryManagementExample {
  public static void main(String[] args) {
    // Alocação manual de memória usando o método allocate()
    ByteBuffer buffer = ByteBuffer.allocate(1024);

    // Escrita de dados no buffer
    buffer.putInt(10);
    buffer.putDouble(3.14);

    // Reversão do buffer para leitura de dados
    buffer.flip();

    // Leitura de dados do buffer
    int intValue = buffer.getInt();
    double doubleValue = buffer.getDouble();

    // Liberação manual da memória usando o método clear()
    buffer.clear();

    System.out.println("Int value: " + intValue);
    System.out.println("Double value: " + doubleValue);
  }
}
```

Neste exemplo, o objeto ByteBuffer é usado para alocar manualmente 1024 bytes de memória. Em seguida, são escritos dados no buffer e, em seguida, lidos. Por fim, a memória é liberada manualmente usando o método clear(). Observe que a utilização direta da API de gerenciamento de memória exige mais cuidado dos desenvolvedores, pois é necessário liberar manualmente a memória após o uso. Além disso, o código também fica mais complexo e menos legível. Por essas razões, é recomendável usar o GC automática do Java na maioria das situações.

---

No desenvolvimento de software, é fundamental realizar análises de desempenho para garantir que o aplicativo atenda às expectativas em relação a velocidade e eficiência. A análise de desempenho é uma síntese de diferentes aspectos da programação e pode ser comparada a uma ciência experimental. A abordagem ideal é considerar o benchmark como uma "caixa preta", com entradas e saídas e coletar dados para inferir resultados. No entanto, é importante ter cuidado e garantir que os dados coletados sejam precisos. O objetivo é tornar o benchmark o mais justo possível, alterando apenas um aspecto do sistema e garantindo que outros fatores externos sejam controlados. No entanto, devido à sofisticação da JVM (Java Virtual Machine), é difícil compreender e levar em conta o impacto preciso das otimizações automáticas aplicadas ao código. Além disso, é impossível ignorar os efeitos do sistema operacional, hardware e condições de tempo de execução.

Um exemplo simples de benchmark é testar o tempo de classificação de uma lista de 100.000 números. É importante levar em conta questões como aquecimento da JVM, coleta de lixo e a escolha do número de iterações. É comum que os benchmarks cometam erros, como não utilizar o resultado gerado pelo código testado ou não considerar o efeito de várias thread ao mesmo tempo. Para garantir resultados precisos e confiáveis, existem parâmetros que podem ser usados em linha de comando, como -Xms e -Xmx para controlar o tamanho da heap, ou o flag -XX:+PrintCompilation para exibir o log de compilação.

Além disso, é possível especificar a quantidade de tempo de CPU, memória e outros recursos utilizados pelo benchmark. Em resumo, é importante ser cuidadoso ao escrever um benchmark e levar em conta os parâmetros que podem ser usados para garantir resultados precisos e confiáveis. Aqui estão alguns exemplos de flags de VM que podem ser usados com base nas informações descritas acima:

* **-Xmx**: define o tamanho máximo da memória heap que a JVM alocará para a aplicação. Exemplo: -Xmx1024m
* **-Xms**: define o tamanho inicial da memória heap que a JVM alocará para a aplicação. Exemplo: -Xms512m
* **-XX:+UseG1GC**: habilita o GC G1 (Garbage First). Este é o padrão a partir da versão Java 9.
* **-XX:+PrintGCDetails**: habilita a saída detalhada do GC durante a execução da aplicação.
* **-XX:-UseBiasedLocking**: desabilita o bloqueio inclinado, que é uma técnica de otimização de desempenho.
* **-XX:+HeapDumpOnOutOfMemoryError**: gera um dump do heap em caso de erro de falta de memória.
* **-XX:+AggressiveOpts**: habilita as otimizações agressivas da JVM, que são ajustes automáticos de configurações de desempenho que a JVM pode fazer com base na arquitetura do sistema e no uso da aplicação.

Existem várias ferramentas que podem ser usadas para monitorar performance em Java:

* **Caliper**: é uma ferramenta open source para avaliar a performance de código Java.
* **Apache JMeter**: é uma ferramenta open source para testar a performance de aplicativos, incluindo aplicativos Java.
* **Java Microbenchmark Harness (JMH)**: é uma biblioteca Java para escrever e executar benchmarks de micro.
* **JUnitPerf**: é uma biblioteca de teste de unidade que fornece suporte para testes de performance.
* **Java Performance Tuning Guide**: é uma guia para ajudar a identificar e corrigir problemas de desempenho no código Java.
* **YourKit Java Profiler**: é uma ferramenta comercial para monitorar e otimizar o desempenho de aplicativos Java.
* **NetBeans Profiler**: é uma ferramenta integrada ao NetBeans para monitorar e otimizar o desempenho de aplicativos Java.
* **VisualVM**: é uma ferramenta open source para monitorar e diagnosticar aplicativos Java em tempo de execução.

### Prometheus 

O Prometheus é uma solução de monitoramento de métricas baseada em pull que pode ser usada para monitorar a performance de aplicativos, incluindo aplicativos Java. Ele permite coletar, armazenar e visualizar métricas de forma centralizada. O Prometheus JVM Client é uma biblioteca Java que permite que você monitorar sua aplicação Java adicionando métricas de performance a serem coletadas pelo Prometheus. Aqui estão os passos gerais para usar o Prometheus JVM Client em sua aplicação Java:

1. Adicione a dependência ao seu projeto: você precisará adicionar a dependência do Prometheus JVM Client ao seu projeto. Isso pode ser feito adicionando a seguinte dependência ao seu arquivo pom.xml se você estiver usando Maven:

```bash
<dependency>
  <groupId>io.prometheus</groupId>
  <artifactId>simpleclient_hotspot</artifactId>
  <version>0.16.0</version>
</dependency>
```

2. Configure o registrador de métricas: em seguida, você precisará configurar o registrador de métricas para usar o Prometheus JVM Client. Isso é feito adicionando a seguinte linha de código em sua classe principal:

```java
import io.prometheus.client.CollectorRegistry;
import io.prometheus.client.hotspot.DefaultExports;

public class Main {
  public static void main(String[] args) {
    // Adicione isto antes de iniciar sua aplicação
    DefaultExports.initialize();
  }
}
```

3. Adicione métricas personalizadas: além das métricas padrão coletadas pelo Prometheus JVM Client, você pode adicionar métricas personalizadas para medir a performance de sua aplicação. Isso é feito criando um objeto de métrica e adicionando medições a ele. Aqui está um exemplo de como adicionar uma métrica contador:

```java
import io.prometheus.client.Counter;

public class Main {
  private static final Counter requestCounter = Counter.build()
      .name("requests_total")
      .help("Number of requests processed by the service")
      .register();

  public static void main(String[] args) {
    DefaultExports.initialize();
    // Adicione medições a sua métrica personalizada
    requestCounter.inc();
  }
}
```

4. Inicie o Prometheus: por fim, você precisará iniciar o Prometheus para coletar as métricas. Isso pode ser feito iniciando o Prometheus com o seguinte comando:

```bash
./prometheus --config.file=prometheus.yml
```

Este arquivo de configuração do Prometheus especifica onde sua aplicação Java está hospedada e qual porta está sendo usada para expor as métricas. A seguir, apresento um exemplo de como o arquivo prometheus.yml deve estar configurado para o Prometheus JVM Client:

```yaml
# Example Prometheus configuration for JVM Client

global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'jvm'
    scrape_interval: 5s
    static_configs:
      - targets: ['localhost:9253']

  - job_name: 'jvm_app'
    scrape_interval: 5s
    static_configs:
      - targets: ['localhost:7071']
```

Neste exemplo, estamos configurando dois trabalhos diferentes, um para coletar métricas JVM padrão (jvm) e outro para coletar métricas da aplicação Java (jvm_app). A frequência de varredura para ambos é de 5 segundos, e o intervalo de verificação global é de 15 segundos. Para coletar métricas JVM, usamos o Prometheus JVM Client e especificamos o alvo como localhost:9253. Para coletar métricas da aplicação, usamos o JMX Exporter e especificamos o alvo como localhost:7071.

O Prometheus JVM Client fornece uma série de métricas que podem ser usadas para monitorar a JVM. Aqui estão alguns exemplos:

* **Uso da memória**: O uso da memória heap e non-heap podem ser monitorados através de métricas como `jvm_memory_bytes_used`, `jvm_memory_bytes_committed`, e `jvm_memory_pool_bytes_used`.
* **Garbage Collection**: As informações sobre o tempo de coleta de lixo e o número de coletas podem ser monitoradas através de métricas como `jvm_gc_collection_seconds_sum`, `jvm_gc_collection_seconds_count`, `jvm_gc_memory_promoted_bytes_sum`, entre outras.
* **Threads**: O número de threads ativos e o número total de threads podem ser monitorados através de métricas como `jvm_threads_current`, `jvm_threads_peak`, `jvm_threads_daemon`.
* **Classes**: O número total de classes carregadas, o número de classes novas por minuto e o número de classes descarregadas podem ser monitorados através de métricas como `jvm_classes_loaded`, `jvm_classes_loaded_total`, `jvm_classes_unloaded_total`.
* **CPU**: O tempo total de CPU usado pela JVM e o número de contextos de troca de CPU podem ser monitorados através de métricas como `jvm_cpu_load` e `jvm_threads_cpu_time_seconds_sum`.

Observe que você deve ajustar as configurações de acordo com as necessidades da sua aplicação e ambiente. Para mais informações acesse a página do **[Java_client](https://github.com/prometheus/client_java)**.


---

## Referencias

Abaixo estão algumas sugestões que você pode usar como referências:

* **Java Virtual Machine Specification (JVM Specification)** - Onde você pode encontrar informações detalhadas sobre a JVM e como ela funciona.
* **Effective Java** - Um livro escrito por Joshua Bloch que fornece informações sobre boas práticas de programação em Java.
* **Java Performance: The Definitive Guide** - Um livro escrito por Scott Oaks que aborda questões de performance em Java.
* **Java Performance Tuning** - Um livro escrito por Jack Shirazi que aborda questões de performance em Java.
* **Java Concurrency in Practice** - Um livro escrito por Brian Goetz que aborda questões relacionadas à concorrência em Java.
* **Java Performance and Scalability: A Quantitative Approach** - Um livro escrito por Steve Wilson e Jeff Kesselman que aborda questões de performance em Java.
* **Java Performance Companion** - Um livro escrito por Charlie Hunt que aborda questões de performance em Java.
* **Java Performance: The Definitive Guide to Optimizing Java Applications** - Um livro escrito por Cliff Click que aborda questões de performance em Java.