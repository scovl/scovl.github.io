+++
title = "Java#Core - Read and Write"
description = "Leitura e escrita de arquivos em Java"
date = 2022-12-08T17:31:45-03:00
tags = ["java,desenvolvimento,dev,development"]
draft = true
weight = 2
author = "Vitor Lobo Ramos"
+++

![Java](https://cdn-icons-png.flaticon.com/512/1183/1183618.png#center)

Dados armazenados em variáveis e arrays são temporários eles são perdidos quando programa termina. Para retenção persistente de longo prazo podemos usar o registro destes dados em arquivos. Felizmente, várias linguagens orientadas a objetos (incluindo Java) fornecem maneiras de gravá-los e lê-los de arquivos (conhecidas como serialização e desserialização de objetos). Para ilustrar isso, recriamos alguns de nossos programas de acesso sequencial que utilizaram arquivos de texto, dessa vez armazenando e recuperando objetos de arquivos binários. O Java fornece a API `java.nio.file` para ler e gravar arquivos. A classe `InputStream` é a superclasse de todas as classes que representam um fluxo de entrada de bytes. Para ler um arquivo de texto você pode usar o método `Files readAllBytes`. O uso desse método é demonstrado na listagem a seguir.

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

// em algum lugar do seu código

String content = Files.readString(Path.of("resources", "work", "input.xml"));
```

Para ler um arquivo de texto linha por linha em uma estrutura `List` do tipo `String`, você pode usar o método `Files.readAllLines`.

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

// em algum lugar do seu código

String content = Files.readString(Path.of("resources", "work", "input.xml"));
List<String> lines = Files.readAllLines(Paths.get(fileName));
```

`Files.readAllLines` usa codificação de caracteres `UTF-8`. Ele também garante que o arquivo seja fechado após a leitura de todos os bytes ou caso ocorra uma exceção. O método `Files.lines` permite ler um arquivo linha por linha, oferecendo um stream. Este fluxo pode ser filtrado e mapeado. `Files.lines` não fecha o arquivo depois que seu conteúdo é lido, portanto, ele deve ser agrupado dentro de uma instrução `try-with-resource`. No exemplo a seguir, os espaços em branco desnecessários no final de cada linha são removidos e as linhas vazias são filtradas.

```java
//lê todas as linhas e remove os espaços em branco (trim)
//filtra linhas vazias
//e imprime o resultado para System.out

Files.lines(new File("input.txt").toPath())
    .map(s -> s.trim())
    .filter(s -> !s.isEmpty())
    .forEach(System.out::println);
```

O próximo exemplo demonstra como filtrar linhas com base em uma determinada expressão regular.

```java
Files.lines(new File("input.txt").toPath())
    .map(s -> s.trim())
    .filter(s -> !s.matches("seuRegex"))
    .forEach(System.out::println);
```

O próximo exemplo extrai uma linha começando com "Bundle-Version:" de um arquivo chamado MANIFEST.MF localizado na pasta META-INF (lembrando que o arquivo MANIFEST.MF contém metadados sobre o conteúdo do JAR). Ele remove o prefixo e todos os espaços em branco iniciais e finais..

```java
package br.com.javaio.first;

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
        if (versionString.isPresent()) {
            return versionString.get();
        }
        return "";
    }
}
```

Para processar cada elemento de um mapa, você pode usar o método `forEach`, que recebe um lambda como parâmetro.

```java
map.forEach((k, v) -> System.out.printf("%s %s%n", k, v));
```

Para gravar um arquivo, você pode usar o seguinte método:

```java
Files.write(stateFile.toPath(), content.getBytes(StandardCharsets.UTF_8), StandardOpenOption.CREATE);
```

Você pode acessar arquivos relativos ao diretório de execução atual do seu programa Java. Para acessar o diretório atual no qual seu programa Java está sendo executado, você pode usar a seguinte instrução.

```java
// escreve todos os arquivos do diretório atual
Files.list(Paths.get(".")).forEach(System.out::println);
```

Como identificar o diretório atual:

```java
String currentDir = System.getProperty("user.dir");
```

Crie um novo projeto Java chamado `br.com.java.files`. Crie a seguinte classe `FilesUtil.java`.

```java
package br.com.java.files;

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
package br.com.java.files;

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

Você pode ler recursos de seu projeto ou de seu arquivo jar por meio da cadeia de métodos `.getClass().getResourceAsStream()` de qualquer objeto. O Java não impõe nenhuma estrutura a um arquivo noções como registros não fazem parte da linguagem Java. Portan- to, você deve estruturar os arquivos para atender os requisitos dos seus aplicativos. No exemplo a seguir, veremos como impor uma estrutura de registro chaveado a um arquivo. O programa desta seção cria um arquivo de acesso sequencial simples que pode ser usado em um sistema de contas a receber para monitorar os valores devidos a uma empresa por seus clientes creditícios. Para cada cliente, o programa obtém do usuário um número de conta, o nome e o saldo do cliente (isto é, o valor que o cliente deve à empresa por bens e serviços recebidos). 

Os dados de cada cliente constituem um “registro” para ele. Esse aplicativo utiliza o número de conta como a chave de registro do arquivo que será criado e mantido em na ordem dos números das contas. O programa assume que o usuário irá inserir os registros em ordem de número de conta. Em um sistema abrangente de contas a receber (baseado em arquivos de acesso sequencial), seria fornecido um recurso de classificação, de modo que o usuário pudesse inserir o registro em qualquer ordem. Os registros seriam, então, classificados e gravados no arquivo. A classe `CreateTextFile` usa um `Formatter` para gerar `Strings` formatadas utilizando as mesmas capacidades de formatação que as do método `System.out.printf`. Um objeto Formatter pode gerar saída para vários locais, como para uma janela de comando ou um arquivo, como fazemos neste exemplo. 

```java
// Gravando dados em um arquivo de texto sequencial com a classe Formatter.

import java.io.FileNotFoundException;
import java.lang.SecurityException;
import java.util.Formatter;
import java.util.FormatterClosedException;
import java.util.NoSuchElementException;
import java.util.Scanner;

public class CreateTextFile {

    // envia uma saída de texto para um arquivo
    private static Formatter output; 

    public static void main(String[] args) {
        openFile();
        addRecords();
        closeFile();
    }
    
    // abre o arquivo clients.txt
    public static void openFile() {

        try {
            output = new Formatter("clients.txt"); // abre o arquivo
        } catch (SecurityException securityException) {
            System.err.println("Não conseguiu gerar o arquivo...Terminando...");
            System.exit(1); // termina o programa
        } catch (FileNotFoundException fileNotFoundException){
            System.err.println("Erro ao abrir o arquivo...Terminando...");
            System.exit(1); // termina o programa
        }
    }

    // adiciona registros ao arquivo
    public static void addRecords() {
        Scanner input = new Scanner(System.in);
        System.out.printf("%s%n%s%n? ",
                "Digite o número da conta, nome, sobrenome e saldo: ",
                "Digite algo para sinalizar o fim do arquivo: ");

        // faz um loop até o indicador de fim de arquivo
        while (input.hasNext()) {

            try {
                // gera saída do novo registro para o arquivo; supõe entrada válida
                output.format("%d %s %s %.2f%n", input.nextInt(), input.next(), input.next(), input.nextDouble());
            } catch (FormatterClosedException formatterClosedException) {
                System.err.println("Não conseguiu gerar o arquivo...Terminando...");
                break;
            } catch (NoSuchElementException elementException) {
                System.err.println("Entrada inválida. Tente novamente!");
                input.nextLine(); // descarta entrada para o usuário tentar de novo
            }

            System.out.print("?");

        } // fim do while
    } // fim do método addRecords

    // fecha o arquivo
    public static void closeFile() {
        if (output != null)
            output.close();
    }
} // fim da classe CreateTextFile
```

O que ocorre aqui é que o código acima estrutura um arquivo.txt e se o arquivo não existir, ele será criado. Se um arquivo existente estiver aberto, seu conteúdo será truncado e todos os dados no arquivo serão descartados. Se nenhuma exceção ocorrer, o arquivo é aberto para gravação e o objeto `Formatter` resultante pode ser usado a fim de gravar dados no arquivo. Os dados são armazenados em arquivos de modo que possam ser recuperados para processamento quando necessário. A Se- ção 15.4.1 demonstrou como criar um arquivo de acesso sequencial. Agora que criamos um arquivo com dados registrados sequencialmente nele, vamos criar uma classe que irá ler e exibir cada um desses registros no arquivocriado acima:

```java
// Esse programa lê um arquivo de texto e exibe cada registro.
import java.io.IOException;
import java.lang.IllegalStateException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.NoSuchElementException;
import java.util.Scanner;
public class ReadTextFile {
    private static Scanner input;

    public static void main(String[] args) {
        openFile();
        readRecords();
        closeFile();
    }

    // abre o arquivo clients.txt
    public static void openFile() {
        
        try {
            input = new Scanner(Paths.get("clients.txt"));
        } catch (IOException ioException) {
            System.err.println("Erro ao tentar abrir arquivo.");
            System.exit(1);
        }
    }
    // lê o registro no arquivo
    public static void readRecords() {
        System.out.printf("%-10s%-12s%-12s%10s%n", "Conta","Nome", "Sobrenome", "Resultados");

        try {
            while (input.hasNext()) {
                // exibe o conteúdo de registro
                System.out.printf("%-10d%-12s%-12s%10.2f%n", input.nextInt(), input.next(), input.next(), input.nextDouble());
            }
        } catch (NoSuchElementException elementException) {
            System.err.println("Arquivo formado incorretamente. Terminando.");
        } catch (IllegalStateException stateException) {
            System.err.println("Erro ao ler do arquivo. Terminando.");
        }
    } // fim do método readRecords
    // fecha o arquivo e termina o aplicativo
    public static void closeFile() {
        if (input != null)
            input.close();
    }
} // fim da classe ReadTextFile
```

---

![Java2](https://cdn2.iconfinder.com/data/icons/artificial-intelligence-44/512/ai_0004-512.png#center)

Se você estiver participando da série **[Taverna dos Javeiros](https://youtube.com/playlist?list=PL18Eo0t4Gk5XRjRBG3YY8Hqm4tk1vVDMP)**, talvez seja uma boa idéia pensar em implementar a lógica de escrita e leitura em arquivos para gerar a ficha dos personagens! Caso você que esteja lendo este artigo desconhece o projeto, lhe convido a nos seguir **[neste link](https://youtube.com/playlist?list=PL18Eo0t4Gk5XRjRBG3YY8Hqm4tk1vVDMP)**.

