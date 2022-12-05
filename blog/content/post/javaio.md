+++
title = "#Java - Read and Write"
description = "Leitura e escrita de arquivos em Java"
date = 2020-04-19T17:31:45-03:00
tags = ["java,desenvolvimento,dev,development"]
draft = true
weight = 6
author = "Vitor Lobo Ramos"
+++

### Java I/O (entrada/saída) para arquivos

O Java fornece a API java.nio.file para ler e gravar arquivos. A classe InputStream é a superclasse de todas as classes que representam um fluxo de entrada de bytes. Para ler um arquivo de texto você pode usar o método Files.readAllBytes. O uso desse método é demonstrado na listagem a seguir.

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

// somewhere in your code

String content = Files.readString(Path.of("resources", "work", "input.xml"));
```

Para ler um arquivo de texto linha por linha em uma estrutura List do tipo String, você pode usar o método Files.readAllLines.

```java
List<String> lines = Files.readAllLines(Paths.get(fileName));
```

Files.readAllLines usa codificação de caracteres UTF-8. Ele também garante que o arquivo seja fechado após a leitura de todos os bytes ou caso ocorra uma exceção. O método Files.lines permite ler um arquivo linha por linha, oferecendo um stream. Este fluxo pode ser filtrado e mapeado. Files.lines não fecha o arquivo depois que seu conteúdo é lido, portanto, ele deve ser agrupado dentro de uma instrução try-with-resource. No exemplo a seguir, os espaços em branco desnecessários no final de cada linha são removidos e as linhas vazias são filtradas.

```java
//read all lines and remove whitespace (trim)
//filter empty lines
//and print result to System.out

Files.lines(new File("input.txt").toPath())
    .map(s -> s.trim())
 .filter(s -> !s.isEmpty())
 .forEach(System.out::println);
```

O próximo exemplo demonstra como filtrar linhas com base em uma determinada expressão regular.

```java
Files.lines(new File("input.txt").toPath())
    .map(s -> s.trim())
 .filter(s -> !s.matches("yourregularexpression"))
 .forEach(System.out::println);
```

O próximo exemplo extrai uma linha começando com "Bundle-Version:" de um arquivo chamado MANIFEST.MF localizado na pasta META-INF. Ele remove o prefixo e todos os espaços em branco iniciais e finais..

```java
package com.vogella.eclipse.ide.first;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.stream.Stream;

public class ReadMANIFESTFile {
    public static void main(String[] args) throws IOException {
        String versionString = readStreamOfLinesUsingFiles();
        System.out.println(versionString);
    }

    private static String readStreamOfLinesUsingFiles() throws IOException {
        Stream<String> lines = Files.lines(Paths.get("META-INF", "MANIFEST.MF"));
        Optional<String> versionString = lines.filter(s -> s.contains("Bundle-Version:")).map(e-> e.substring(15).trim()).findFirst();

        lines.close();
        if (versionString.isPresent())
        {
            return versionString.get();
        }
        return "";
    }
}
```

Para processar cada elemento de um mapa, você pode usar o método forEach, que recebe um lambda como parâmetro.

```java
map.forEach((k, v) -> System.out.printf("%s %s%n", k, v));
```

Para gravar um arquivo, você pode usar o seguinte método:

```java
Files.write(stateFile.toPath(), content.getBytes(StandardCharsets.UTF_8), StandardOpenOption.CREATE);
```

Você pode acessar arquivos relativos ao diretório de execução atual do seu programa Java. Para acessar o diretório atual no qual seu programa Java está sendo executado, você pode usar a seguinte instrução.

```java
// writes all files of the current directory
Files.list(Paths.get(".")).forEach(System.out::println);
```

Como identificar o diretório atual:

```java
String currentDir = System.getProperty("user.dir");
```

Crie um novo projeto Java chamado com.vogella.java.files. Crie a seguinte classe FilesUtil.java.

```java
package com.vogella.java.files;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.List;

public class FilesUtil {
    public static String readTextFile(String fileName) throws IOException {
        String content = new String(Files.readAllBytes(Paths.get(fileName)));
        return content;
    }

    public static List<String> readTextFileByLines(String fileName) throws IOException {
        List<String> lines = Files.readAllLines(Paths.get(fileName));
        return lines;
    }

    public static void writeToTextFile(String fileName, String content) throws IOException {
        Files.write(Paths.get(fileName), content.getBytes(), StandardOpenOption.CREATE);
    }
}
```

Para testar esses métodos, crie um arquivo de texto chamado file.txt com algum conteúdo na pasta do seu projeto. Crie a seguinte classe Main e execute-a.

```java
package com.vogella.java.files;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

public class Main {
  public static void main(String[] args) throws IOException {
    String input = FilesUtil.readTextFile("file.txt");
    System.out.println(input);
    FilesUtil.writeToTextFile("copy.txt", input);

    System.out.println(FilesUtil.readTextFile("copy.txt"));

    FilesUtil.readTextFileByLines("file.txt");
    Path path = Paths.get("file.txt");
  }
}
```

O Java 8 fornece um bom fluxo para processar todos os arquivos em uma árvore.

```java
Files.walk(Paths.get(path))
     .filter(Files::isRegularFile)
     .forEach(System.out::println);
```

Para excluir um diretório e todo o seu conteúdo.

```java
String stringPath="...yourPath...";
Path path = new File(stringPath).toPath();
Files.walk(path)
    .sorted(Comparator.reverseOrder())
    .map(Path::toFile)
.forEach(File::delete);
```

Você pode ler recursos de seu projeto ou de seu arquivo jar por meio da cadeia de métodos .getClass().getResourceAsStream() de qualquer objeto.