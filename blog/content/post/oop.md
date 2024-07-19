+++
title = "Java e Clojure"
description = "Explorando outros mundos"
date = 2024-07-18T19:00:00-00:00
tags = ["OOP","software","engineering"]
draft = false
weight = 4
+++


Ao estudar diferentes linguagens de programação, fui atraído pela família Lisp devido à sua simplicidade e poder. Lisp, criado por [John McCarthy](https://www.britannica.com/biography/John-McCarthy) em 1958, é conhecido pela notação de código como listas de dados e pela capacidade de manipular código como uma estrutura de dados. Emacs Lisp e Common Lisp são dois dos muitos dialetos que evoluíram a partir do Lisp original, cada um com suas próprias peculiaridades e casos de uso.

Minha jornada com Lisp levou-me ao Clojure, um moderno dialeto que roda na Java Virtual Machine (JVM). Escolhi o Clojure por causa da interoperabilidade com código Java, já que eu tinha uma base sólida em Java. Esta transição foi também influenciada pela frustração com as complexidades da programação orientada a objetos (OOP) em Java.

Percebi que a construção de hierarquias de classes complexas frequentemente introduz uma complexidade desnecessária na OOP. Essa complexidade, especialmente em Java, surge mais das metodologias e tecnologias escolhidas do que dos desafios inerentes ao problema a ser resolvido. Por exemplo, montar um modelo de avião a partir de um kit pode ser simplificado com um design mais intuitivo e menos peças, semelhante à forma como a programação pode se beneficiar de abordagens que reduzem a rigidez e a complexidade não essencial.

Complexidades adicionais surgem não por causa do problema em si, mas devido às ferramentas e métodos escolhidos. Isso se manifesta através de práticas que complicam desnecessariamente o código, como a proliferação de POJOs (Plain Old Java Objects) e códigos boilerplate. POJOs, embora simples em uso, podem resultar em excesso de classes que servem principalmente para armazenar e recuperar dados. O código boilerplate, repetido em várias partes do aplicativo, inclui a implementação frequente de métodos como `get` e `set`, `hashCode`, `equals` e `toString`, que obscurecem a lógica principal do código e aumentam a carga de manutenção.

Considere o exemplo clássico abaixo na classe `Employee` abaixo, em Java, que exemplifica essa questão:

```java
public class Employee {
    private String name;
    private int age;
    private String department;

    public Employee(String name, int age, String department) {
        this.name = name;
        this.age = age;
        this.department = department;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Employee employee = (Employee) obj;
        return age == employee.age &&
               Objects.equals(name, employee.name) &&
               Objects.equals(department, employee.department);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, age, department);
    }

    @Override
    public String toString() {
        return "Employee{" +
               "name='" + name + '\'' +
               ", age=" + age +
               ", department='" + department + '\'' +
               '}';
    }
}
```

Geralmente quando o cenário é este, a sugestão que brota automaticamente na maioria das vezes é o uso de bibliotecas como Lombok que podem ajudar a reduzir essa complexidade acidental ao gerar automaticamente código boilerplate durante a compilação com anotações como `@Data`, `@Getter`, `@Setter`, `@EqualsAndHashCode`, e `@ToString`. Essas anotações substituem a necessidade de escrever manualmente o código mostrado acima. Contudo, essa abordagem pode reduzir a transparência do código e complicar a depuração.

Em contraste, em Clojure, uma linguagem funcional que é dialeto LISP, a modelagem de dados e comportamentos é abordada de maneira diferente. Utilizando estruturas de dados imutáveis e funções puras, Clojure elimina muitos problemas associados à complexidade acidental em OOP. Veja como o exemplo da classe `Employee` seria em Clojure:

```clojure
(defrecord Employee [name age department])

(defn create-employee [name age department]
  (->Employee name age department))

(defn employee-name [employee]
  (:name employee))

(defn set-employee-name [employee new-name]
  (assoc employee :name new-name))

(defn employee-age [employee]
  (:age employee))

(defn set-employee-age [employee new-age]
  (assoc employee :age new-age))

(defn employee-department [employee]
  (:department employee))

(defn set-employee-department [employee new-department]
  (assoc employee :department new-department))
```

Aqui, `defrecord` cria uma estrutura de dados com campos nomeados, gerando funções para acessar e modificar esses campos, promovendo a imutabilidade. Isso reduz a probabilidade de erros comuns, como alterações de estado não intencionais, e simplifica o entendimento, teste e manutenção do código.

Essa abordagem minimiza a cerimônia e o boilerplate típicos da OOP em Java, focando mais nos dados e comportamentos reais do que na estrutura de classes. Além disso, `defrecord` implementa automaticamente interfaces para serialização e outras funcionalidades, oferecendo mais do que apenas uma simplificação do acesso aos dados.

É essencial reconhecer que muito depende das escolhas e habilidades do desenvolvedor. No entanto, a linguagem, juntamente com seus frameworks, bibliotecas e a filosofia subjacente da POO, tendem a conduzir os desenvolvedores para uma maior complexidade. Java, como uma linguagem projetada com uma forte inclinação para a POO, encoraja a criação de hierarquias de classes e o uso de padrões de design que, embora úteis em muitos contextos, podem adicionar camadas de complexidade não pertinentes à lógica de negócios.

Frameworks Java, como Spring e Hibernate, oferecem ferramentas de abstração poderosas que simplificam o desenvolvimento, mas podem levar a um código altamente acoplado e difícil de gerenciar se não forem usados com discernimento. POJOs e código boilerplate são exemplos de como práticas comuns em Java podem contribuir para a complexidade.

Embora a intenção seja promover a reutilização de código e a clareza, a implementação repetitiva de métodos padrão em cada classe pode obscurecer a lógica principal e aumentar a carga de manutenção, especialmente em projetos de grande escala.

Portanto, embora muito dependa do desenvolvedor em termos de como ele escolhe estruturar e implementar soluções em Java, o ambiente e as práticas incentivadas pela linguagem e seus frameworks geralmente conduzem a uma complexidade desnecessária. Isso destaca a importância de uma abordagem crítica e reflexiva no uso das capacidades da linguagem para evitar armadilhas.

## Manutenibilidade

Este conceito se refere à facilidade com que um software pode ser modificado para corrigir falhas, melhorar a funcionalidade ou adaptar-se a mudanças no ambiente. Java incentiva a modelagem de soluções através de hierarquias de classes e interfaces. Um exemplo clássico dessa abordagem é o padrão de design Composite, utilizado para construir uma estrutura de objetos em que os objetos individuais podem ser tratados de maneira uniforme. Veja um exemplo simplificado abaixo:

```java
interface Component {
    void operation();
}

class Leaf implements Component {
    public void operation() {
        // realiza uma operação específica
    }
}

class Composite implements Component {
    private List<Component> children = new ArrayList<>();

    public void operation() {
        for (Component child : children) {
            child.operation();
        }
    }

    public void add(Component component) {
        children.add(component);
    }

    public void remove(Component component) {
        children.remove(component);
    }
}
```

Este padrão é útil, mas à medida que a árvore de componentes cresce e se torna mais complexa, a manutenção pode se tornar um desafio. O gerenciamento de estados e o impacto das mudanças em uma parte do sistema podem afetar outras partes de maneira não trivial, aumentando o risco de bugs e reduzindo a clareza do código.

Por outro lado, Clojure promove a imutabilidade e o uso de funções puras. Isso resulta em um estilo de código que é frequentemente mais conciso e expressivo. Um exemplo equivalente ao padrão Composite em Clojure pode ser visto na manipulação de estruturas de dados aninhadas, como listas ou vetores, utilizando funções de alta ordem:

```clojure
(defn operation [component]
  (if (coll? component)
    (map operation component)
    ;; realiza uma operação específica para não coleções
    ))

(def tree
  [[:a] [:b [:b1 :b2] [:b3]] [:c]])

(operation tree)
```

Neste exemplo, a função `operation` manipula recursivamente uma estrutura aninhada, aplicando a operação a cada elemento, seja ele simples ou composto. A clareza e simplicidade do código são mantidas, mesmo quando a estrutura se torna complexa. A manutenibilidade em Java pode ser desafiadora devido à necessidade de gerenciar estados mutáveis e a complexidade associada a hierarquias de classes extensas. A herança e o polimorfismo, enquanto poderosos, podem introduzir dependências ocultas e efeitos colaterais que dificultam as modificações e a compreensão do sistema como um todo.

A imutabilidade por padrão ajuda a evitar muitos bugs comuns associados a mudanças de estado, e as funções puras promovem um estilo de programação que é intrinsecamente mais fácil de testar e verificar.

## Transparência referencial

A transparência referencial é um conceito fundamental em programação funcional e se refere à propriedade de funções onde a substituição de uma expressão por seu valor não altera o comportamento do programa. Este conceito é crucial para garantir a previsibilidade e a confiabilidade do código, especialmente em análises e otimizações de compiladores.

Java frequentemente lida com estados mutáveis, o que pode comprometer a transparência referencial. Em Java, objetos podem ter seus estados internos alterados, o que significa que chamadas repetidas ao mesmo método no mesmo objeto podem produzir resultados diferentes se o estado do objeto tiver sido modificado entre chamadas. Vejamos um exemplo clássico na classe Counter abaixo:

```java
class Counter {
    private int count = 0;

    public void increment() {
        count += 1;
    }

    public int getCount() {
        return count;
    }
}

Counter myCounter = new Counter();
System.out.println(myCounter.getCount());  // Output: 0
myCounter.increment();
System.out.println(myCounter.getCount());  // Output: 1
```

Neste exemplo, a chamada ao método `getCount` retorna resultados diferentes dependendo do estado interno do objeto `Counter`. Esta não é uma função com transparência referencial, pois o resultado depende do histórico de interações com o objeto, não apenas de seus argumentos de entrada. Em contraste, Clojure promove a imutabilidade e funções puras, que são compatíveis com a transparência referencial. Os dados são imutáveis por padrão, e as funções são projetadas para não ter efeitos colaterais. Isso facilita o raciocínio sobre o código e a previsão de seu comportamento, independentemente do contexto em que é utilizado. Um exemplo análogo ao contador em Java pode ser implementado em Clojure como segue:

```clojure
(defn increment [count]
  (+ count 1))

(def initial-count 0)
(def new-count (increment initial-count))
```

Neste caso, a função `increment` é pura e possui transparência referencial. Independente de quantas vezes você chame `increment` com o mesmo valor de `count`, o resultado será sempre o mesmo, e não haverá efeitos colaterais que alterem outros estados ou dados. Isso não apenas simplifica o entendimento do código, mas também o torna mais seguro em ambientes concorrentes e distribuídos.

A falta de transparência referencial em Java pode levar a bugs sutis e dificuldades de manutenção, pois o desenvolvedor deve manter um modelo mental do estado de todo o sistema ao analisar o comportamento do código. Isso é especialmente problemático em sistemas grandes e complexos, onde os efeitos colaterais de uma parte do sistema podem ter implicações inesperadas em outra parte.

Em Clojure, a garantia de transparência referencial contribui para uma maior modularidade e reusabilidade do código. Funções puras e imutáveis podem ser combinadas e reutilizadas em diferentes contextos sem preocupação com interações inesperadas, tornando o sistema globalmente mais fácil de entender e de manter.

A transparência referencial é mais do que uma característica técnica; é uma filosofia de design que influencia profundamente a confiabilidade, a manutenibilidade e a escalabilidade de software. Enquanto Java pode ser adaptado para seguir este princípio até certo ponto (usando objetos imutáveis e minimizando efeitos colaterais), Clojure o incorpora de maneira fundamental.

## Problemas de Reutilização

A reutilização de código é um objetivo desejado em desenvolvimento de software, visando reduzir redundância, aumentar a eficiência e facilitar a manutenção. No entanto, as abordagens de Java (orientada a objetos) e Clojure (funcional) apresentam desafios distintos que podem afetar a eficácia da reutilização do código.

Em Java, a reutilização de código é frequentemente implementada através de herança, permitindo que classes derivadas reutilizem código de suas classes base. Embora útil, este método pode levar a problemas de acoplamento e fragilidade. Por exemplo, a herança profunda pode obscurecer a origem dos dados e métodos, dificultando a rastreabilidade e a manutenção do código. Além disso, alterações na classe base podem ter efeitos colaterais inesperados nas classes derivadas. Vejamos um exemplo clássico na classe Vehicle abaixo:

```java
class Vehicle {
    void startEngine() {
        System.out.println("Engine started.");
    }
}

class Car extends Vehicle {
    void openSunroof() {
        System.out.println("Sunroof opened.");
    }
}

class ElectricCar extends Car {
    @Override
    void startEngine() {
        System.out.println("Electric engine started silently.");
    }
}
```

Neste exemplo, `ElectricCar` reutiliza o código de `Vehicle` e `Car`, mas a sobrescrita do método `startEngine` introduz um comportamento específico que pode não ser esperado ou desejado em todas as situações onde `Car` é utilizado. Clojure, ao enfatizar a programação funcional, promove a composição de funções como método primário para reutilização de código. Funções em Clojure são projetadas para serem pequenas, com um único propósito, e facilmente combináveis sem efeitos colaterais, o que promove a reutilização. Por exemplo:

```clojure
(defn add [x y]
  (+ x y))

(defn add-five [x]
  (add x 5))

(defn multiply-by-two [x]
  (* x 2))

(defn add-five-and-double [x]
  (multiply-by-two (add-five x)))
```

Neste exemplo, as funções `add`, `add-five`, e `multiply-by-two` são compostas para criar uma nova função `add-five-and-double`. Cada função pode ser reutilizada independentemente em outros contextos.

A reutilização em Java, baseada em herança, pode levar à rigidez e a um acoplamento não intencional entre classes. A herança impõe uma relação "é-um" que nem sempre é a mais adequada para todos os cenários de reutilização, e a modificação de classes base pode afetar todas as subclasses de maneiras inesperadas.

Um exemplo clássico de rigidez e acoplamento não intencional ocorre quando se usa herança para compartilhar funcionalidades entre classes que não possuem uma relação natural de "é-um". Isso pode levar a uma estrutura de código onde mudanças em uma superclasse afetam inesperadamente suas subclasses.

Considere um sistema onde uma classe `Animal` é usada como superclasse para várias subclasses específicas de animais. A classe `Animal` pode incluir métodos que não são aplicáveis a todas as suas subclasses, forçando um comportamento específico onde ele pode não ser necessário ou adequado.

```java
class Animal {
    void breathe() {
        System.out.println("Breathe in, breathe out.");
    }

    void eat() {
        System.out.println("Eating food.");
    }
}

class Fish extends Animal {
    @Override
    void breathe() {
        System.out.println("Breathing through gills.");
    }

    void swim() {
        System.out.println("Swimming in water.");
    }
}

class Bird extends Animal {
    @Override
    void eat() {
        System.out.println("Eating seeds.");
    }

    void fly() {
        System.out.println("Flying in the sky.");
    }
}
```

Entendi o problema. Vou focar apenas na remoção de redundâncias, mantendo o texto o mais próximo possível do original.

---

A classe `Animal` define métodos `breathe` e `eat` que todas as subclasses são forçadas a herdar. Isso pode não ser ideal para todos os tipos de animais, como os que possuem métodos de respiração ou alimentação únicos, exigindo que essas subclasses sobrescrevam esses métodos para comportamentos específicos. Todas as subclasses de `Animal` estão ligadas às implementações de `breathe` e `eat` da superclasse.

Qualquer mudança nos métodos da classe `Animal` pode ter efeitos colaterais em `Fish`, `Bird` e outras subclasses. Por exemplo, se adicionarmos um método `sleep` na classe `Animal` que define como os animais dormem, todas as subclasses terão esse método, mesmo que a maneira de dormir varie entre diferentes tipos de animais, ou mesmo não seja relevante para todos.

Este exemplo ilustra como a herança em Java pode introduzir rigidez e acoplamento entre classes. A herança obriga as subclasses a aderirem à interface e ao comportamento da superclasse, o que pode não ser desejável e pode limitar a flexibilidade do design. Mudanças na superclasse podem afetar todas as subclasses de maneiras não previstas, tornando o sistema mais difícil de manter e evoluir. A composição, em vez de herança, é frequentemente recomendada para mitigar esses problemas, permitindo maior flexibilidade e reduzindo o acoplamento indesejado.

Em contraste, Clojure favorece uma abordagem de composição funcional, onde a reutilização do código é alcançada combinando funções menores e mais genéricas. Essa abordagem reduz o acoplamento e aumenta a flexibilidade, permitindo que os desenvolvedores construam novas funcionalidades de maneira mais previsível e segura.

## Pattern Null Object

O uso de `nil` em Clojure como um objeto nulo simplifica o tratamento de valores ausentes em sequências, coleções e mapas. Este suporte embutido reduz a necessidade de verificações extensivas de nulos e tratamentos especiais. Em contraste, o `null` de Java requer verificações explícitas para prevenir NullPointerException, levando a um código verboso e propenso a erros. Exemplo:

Em Clojure:

```clojure
(first nil) ;; nil
(get nil :chave) ;; nil
```

Já em Java:

```java
List<String> lista = null;
if (lista != null) {
    lista.get(0);
}
```

O tratamento de valores nulos em Java é uma fonte frequente de erros em tempo de execução e isso aumenta a complexidade do código e a probabilidade de bugs, prejudicando a confiabilidade do software visto que sempre precisa tratar o uso do `null`.

## Pattern Singleton

O `defonce` e referências atômicas em Clojure fornecem uma maneira simples e segura para threads de implementar singletons. No entanto, o padrão Singleton é geralmente desencorajado em ambos os paradigmas devido à sua tendência de introduzir estado global e dependências difíceis de gerenciar e testar. A implementação tradicional de singleton em Java muitas vezes envolve mecanismos complexos de sincronização para garantir a segurança em threads, aumentando a complexidade. Exemplo:

Em Clojure:

```clojure
(defonce servidor-web (atom nil))

(defn iniciar-servidor []
  (if @servidor-web
    (println "Servidor já está em execução!")
    (reset! servidor-web (iniciar-jetty rotas {:port 8080 :join? false}))))
```

Em Java:

```java
public class ServidorWeb {
    private static ServidorWeb instancia;

    private ServidorWeb() {}

    public static synchronized ServidorWeb getInstancia() {
        if (instancia == null) {
            instancia = new ServidorWeb();
        }
        return instancia;
    }
}
```

O pattern Singleton introduz dependências ocultas e estado global, que podem levar a um acoplamento rígido e dificuldade nos testes. Em Java, garantir a segurança em threads em singletons adiciona complexidade adicional e potencial para bugs sutis.


## Pattern Observer

A função `add-watch` de Clojure e a biblioteca `core.async` oferecem soluções elegantes para implementar o padrão observer, permitindo modelos de programação reativa. O pattern `observer` em Java envolve a definição de objetos observáveis e interfaces de observadores, o que pode resultar em acoplamento rígido entre os componentes e mecanismos de tratamento de eventos mais complexos. Exemplo:

Em Clojure:

```clojure
(def jogador (atom {:pontuacao 0}))

(add-watch jogador :pontuacao
  (fn [chave ref antigo novo]
    (println "Pontuação atualizada:" (:pontuacao novo))))
```

Em Java:

```java
public class Jogador extends Observable {
    private int pontuacao;

    public void setPontuacao(int pontuacao) {
        this.pontuacao = pontuacao;
        setChanged();
        notifyObservers();
    }
}

public class PontuacaoObserver implements Observer {
    @Override
    public void update(Observable o, Object arg) {
        Jogador jogador = (Jogador) o;
        System.out.println("Pontuação atualizada: " + jogador.getPontuacao());
    }
}
```

O pattern `observer` em Java frequentemente leva a componentes fortemente acoplados e gerenciamento de eventos complexo. Essa complexidade pode tornar o sistema mais difícil de manter e estender, especialmente à medida que o número de observadores cresce...

---

Por fim, a comparação entre Java e Clojure é relevante porque ambos operam na Java Virtual Machine (JVM). Essa proximidade tecnológica permite explorar como diferentes paradigmas de programação — orientada a objetos e funcional — podem ser implementados em um mesmo ambiente de runtime, proporcionando uma comparação direta das características e vantagens de cada linguagem sob as mesmas condições de infraestrutura.

Java, sendo uma das linguagens mais utilizadas e com um vasto ecossistema, exemplifica o paradigma orientado a objetos, enquanto Clojure, também rodando na JVM, oferece uma abordagem funcional.

A utilização da JVM por ambas as linguagens garante que qualquer comparação seja focada nas linguagens e seus paradigmas, em vez de variáveis externas como diferenças no desempenho do sistema operacional ou do ambiente de execução. Isso torna as discussões sobre performance, manutenção e design de código mais claras e fundamentadas, já que ambas as linguagens podem aproveitar as otimizações e características de performance da JVM, como gerenciamento de memória e coleta de lixo.

Outras linguagens funcionais que não operam na JVM, como Elixir e Haskell, também poderiam ser comparadas a Java. Elixir, que roda na Erlang VM, é conhecida por sua capacidade de lidar com sistemas distribuídos de alta disponibilidade, enquanto Haskell é frequentemente elogiada por seu sistema de tipos rigoroso e avaliação preguiçosa, minimizando bugs e maximizando a eficiência em termos de execução de algoritmos complexos. No entanto, essas comparações introduziriam variáveis adicionais relacionadas às diferenças nas máquinas virtuais e modelos de execução, complicando a análise direta dos paradigmas de programação.

Encorajo todos os desenvolvedores a experimentar Clojure ou outra linguagem funcional. Explorar essas linguagens pode não apenas melhorar suas habilidades de programação, mas também oferecer novas ferramentas para resolver problemas de maneiras que antes não pareciam possíveis.

A aprendizagem e adaptação a novos paradigmas não apenas enriquecem o seu conhecimento, mas também expandem sua capacidade de escolher a ferramenta certa para o trabalho certo, abrindo novos caminhos para soluções criativas. Experimentar algo novo pode ser desafiador, mas as recompensas em termos de crescimento profissional e satisfação na resolução de problemas são imensuráveis.
