+++
title = "Inferência de Tipos em Rust e C++"
description = "Por que isso pode facilitar sua vida."
date = 2025-07-18T23:18:18-03:00
tags = ["Inferência de Tipos", "Programação", "Rust", "C++", "Swift"]
draft = false
weight = 1
+++


Inferência de tipos é um recurso de muitas linguagens de programação que permite ao compilador descobrir o tipo de uma variável sem que você precise especificá-lo explicitamente. Este artigo explica como a inferência de tipos funciona em Rust e C++, por que eles são diferentes e o que isso significa para você como programador. Também faremos uma comparação divertida com Swift no final.

![](../post/images/retropc01.png)	

## O que é Inferência de Tipos?

Em programação, um **tipo** indica ao computador que tipo de dado uma variável contém — como um número, texto ou algo mais específico, como um endereço de e-mail. Em linguagens **estaticamente tipadas** como Rust e C++, você geralmente precisa especificar os tipos para que o compilador possa verificar se seu código faz sentido. A inferência de tipos facilita isso, permitindo que o compilador deduza o tipo com base em como você usa a variável, assim você não precisa escrevê-lo toda vez.

Por exemplo, em C++, você pode escrever:

```c    
std::vector<int> get_vector(); // Uma função que retorna uma lista de inteiros
int main() {
    std::vector<int> v = get_vector(); // Diz explicitamente que v é um vetor de inteiros
    auto w = get_vector();             // Deixa o compilador descobrir o tipo de w
}
```

Aqui, `auto` diz ao compilador para deduzir que `w` é um `std::vector<int>` com base no que `get_vector()` retorna. Isso economiza tempo, especialmente quando os tipos são longos ou complexos, como em lambdas (funções anônimas) que não têm um tipo nomeável. Rust faz algo semelhante, mas de uma maneira diferente, como veremos.

![](images/retropc02.png)	

## Como o C++ Lida com Inferência de Tipos

No C++, a inferência de tipos é direta. Quando você usa `auto`, o compilador olha o valor atribuído a uma variável e usa isso para decidir o tipo. Por exemplo:

```c    
auto x = 42; // x é um int porque 42 é um int
```

O C++ também tem `decltype`, que permite reutilizar o tipo de uma expressão existente:

```c    
auto x = 42;
std::vector<decltype(x)> v; // v é um vetor de inteiros
```

O compilador do C++ trabalha "olhando para trás", usando informações de valores e funções já definidos para determinar os tipos. Ele processa o código linha por linha, resolvendo tipos com base no que já sabe. Isso significa que o compilador nunca tenta adivinhar como uma variável será usada no futuro para determinar seu tipo.

Por exemplo, em C++, você não pode fazer algo assim e esperar que o compilador descubra o tipo com base em usos futuros:

```c    
auto x = {};
foo(x); // Isso não funciona — o compilador não sabe o tipo de x
```

Essa abordagem mantém as coisas previsíveis, mas exige que você seja mais explícito em alguns casos, especialmente com templates ou tipos complexos.

![](images/retropc03.png)	

## Como o Rust Lida com Inferência de Tipos

Rust usa um sistema chamado **Hindley-Milner**, que é bem diferente. Em vez de deduzir tipos apenas com base no valor atribuído, o Rust analisa todo o contexto do código, incluindo como a variável é usada mais adiante. Veja este exemplo:

```rust
fn foo(v: Vec<i32>) {} // Função que aceita um vetor de inteiros
fn bar(v: Vec<String>) {} // Função que aceita um vetor de strings

fn main() {
    let x = Vec::new(); // Cria um vetor vazio
    let y = Vec::new(); // Outro vetor vazio
    foo(x); // x é deduzido como Vec<i32>
    bar(y); // y é deduzido como Vec<String>
}
```

Aqui, `x` e `y` são inicializados da mesma forma, mas têm tipos diferentes porque o compilador olha como eles são usados (em `foo` e `bar`). Isso é poderoso, mas pode surpreender programadores acostumados com C++ ou Go, onde o tipo depende apenas do valor inicial.

O Rust exige que os tipos sejam únicos e sem ambiguidades. Se o compilador não conseguir decidir o tipo ou encontrar uma contradição, ele gera um erro:

```rust
fn bar(v: Vec<String>) {}
fn main() {
    let x: Vec<i32> = Vec::new(); // Especifica que x é Vec<i32>
    bar(x); // ERRO: tipos incompatíveis, esperado Vec<String>
}
```

Essa abordagem faz com que o Rust pareça mais **declarativo**. Você não precisa especificar tipos em todos os lugares, porque o compilador conecta todas as pistas do seu código para entender o que você quer.


## Diferenças Práticas

As diferenças entre C++ e Rust têm grandes impactos:

- **C++**: A inferência é local e limitada. O compilador usa apenas as informações disponíveis na linha atual, o que torna o comportamento previsível, mas exige mais anotações de tipo, especialmente com templates. Por exemplo, em C++20, você pode usar `auto` em parâmetros de função, que é apenas um atalho para templates:

```c    
auto twice(auto x) {
    return x + x; // Funciona para qualquer tipo com operador +
}
```

Isso é semelhante a um template, mas não é exatamente inferência de tipos no sentido mais amplo.

- **Rust**: A inferência é global e mais flexível. O compilador analisa todo o contexto, permitindo que você escreva menos anotações de tipo. Por exemplo:

```rust
fn parse_strings_to_ints(v: Vec<&str>) -> Result<Vec<i64>, ParseIntError> {
    v.into_iter()
        .map(|x| x.parse())
        .collect()
}
```

Aqui, o compilador deduz que `.parse()` retorna `Result<i64, ParseIntError>` através de um processo de inferência reversa: ele sabe que a função retorna um `Result<Vec<i64>, ParseIntError>` e, portanto, o `.collect()` deve coletar elementos do tipo `Result<i64, ParseIntError>`. Com base nisso, ele infere que o `.map` deve produzir esse tipo, o que por sua vez define o tipo de retorno de `x.parse()`.

Essa flexibilidade do Rust permite coisas como a função `parse`, que converte uma string em qualquer tipo que você precisar (como um inteiro ou até um endereço IP), desde que o contexto deixe claro.

![](images/retropc04.png)	

## Por que Isso Importa? (E um Pouco sobre Swift)

A abordagem do Rust funciona bem porque ele evita certos recursos que complicam a inferência de tipos, como:

- **Sem sobrecarga de funções**: Diferente do C++, onde você pode ter várias funções com o mesmo nome, mas assinaturas diferentes, o Rust usa **traits** para evitar ambiguidades.
- **Sem conversões implícitas**: O Rust não converte tipos automaticamente (como transformar um `int` em `float`), o que reduz confusão.
- **Sem herança**: O Rust usa traits em vez de herança, simplificando a resolução de tipos.
- **Sem especialização**: Você não pode criar implementações diferentes de uma função para tipos específicos, o que mantém o sistema de tipos mais simples.

O C++ permite todos esses recursos, o que torna sua inferência de tipos mais limitada, mas também mais previsível em alguns casos. Agora, sobre o Swift: ele tenta combinar a inferência de tipos avançada (como a do Rust) com recursos como sobrecarga de funções e conversões implícitas. Isso pode levar a problemas. Por exemplo, em Swift, uma expressão simples como:

```swift
let a: Double = -(1 + 2) + -(3 + 4) + -(5)
```

Pode fazer o compilador travar com um erro de "expressão muito complexa para ser verificada em tempo razoável". Isso acontece porque o Swift permite que literais (como `1`) sejam convertidos em muitos tipos diferentes, criando uma explosão de possibilidades que o compilador precisa verificar. [Rust](https://www.rust-lang.org/) e [C++](https://en.wikipedia.org/wiki/C%2B%2B) abordam a inferência de tipos de maneiras muito diferentes. 

O C++ é mais rígido, deduzindo tipos apenas com base no que está na linha atual, enquanto o Rust usa um sistema mais inteligente ([Hindley-Milner](https://en.wikipedia.org/wiki/Hindley%E2%80%93Milner_type_system)) que analisa o contexto todo. Isso torna o Rust mais flexível, mas exige que a linguagem evite recursos como sobrecarga de funções ou conversões implícitas para manter tudo sob controle.

[Swift](https://www.swift.org/), por outro lado, mostra o que acontece quando você tenta misturar tudo isso: o compilador pode ficar sobrecarregado. No final, a escolha entre esses sistemas reflete um equilíbrio entre flexibilidade, previsibilidade e desempenho do compilador. Se você gosta de C++ ou Rust, da próxima vez que quiser discutir linguagens de programação, que tal falar sobre inferência de tipos? É um tópico bem mais interessante do que apenas segurança ou sintaxe!

### O que isso muda na prática? 

A forma como uma linguagem lida com a inferência de tipos tem um impacto direto no seu dia a dia como programador. A escolha entre sistemas como os de C++ e Rust reflete um compromisso entre flexibilidade, previsibilidade e o chamado "custo cognitivo".

* **Para o C++:** A inferência é uma ferramenta de conveniência. Você a usa para evitar a repetição de tipos longos (`std::vector<std::string>::iterator`) ou para simplificar o código em situações específicas, como com lambdas. A previsibilidade de `auto` significa que você raramente terá surpresas — o tipo é sempre óbvio pela linha de código. No entanto, se o tipo for complexo ou se a expressão não fornecer informação suficiente, o compilador vai exigir que você seja explícito. Isso mantém o código robusto, mas pode levar a mais anotações de tipo.

* **Para o Rust:** A inferência de tipos é um pilar da linguagem. Ela permite que você se concentre na lógica do seu programa, e não em como os dados fluem. Em vez de decorar o código com tipos, você escreve o que quer que aconteça, e o compilador "conecta os pontos". Isso resulta em um código mais limpo e conciso, pois o compilador trabalha nos bastidores para garantir que tudo se encaixe. A contrapartida é que, quando algo dá errado, a mensagem de erro pode ser mais abstrata, pois o problema pode estar longe de onde o tipo deveria ser óbvio.

A história do **Swift**, que mencionei acima, nos mostra um perigo real: misturar um sistema de inferência avançado com recursos que criam ambiguidades (como sobrecarga e conversões implícitas) pode levar a um compilador que "pensa demais", resultando em erros complexos e tempos de compilação longos.

No fim das contas, a escolha da linguagem reflete um compromisso. Se você valoriza a previsibilidade e o controle explícito sobre cada tipo, a abordagem do C++ pode parecer mais confortável. Mas se você prefere um fluxo de trabalho onde a linguagem cuida da complexidade dos tipos, permitindo que você se concentre no que seu código faz, a filosofia de design do Rust se destacará.

A inferência de tipos não é apenas uma característica; é uma decisão de design que molda a experiência de escrever, ler e depurar código. E, como vimos, as abordagens dessas linguagens são tão distintas quanto as filosofias que as criaram.