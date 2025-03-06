+++
title = "Do Código à Beleza dos Números"
description = ""
date = 2025-03-05T18:00:45-03:00
tags = ["math, programming, scheme"]
draft = true
weight = 5
author = "Vitor Lobo Ramos"
+++

Minha jornada pessoal com a matemática começou de forma turbulenta. Durante anos, me considerei um fracasso na matéria – aquele aluno que suava frio diante de equações e que via fórmulas como hieróglifos indecifráveis. Esta sensação de inadequação me acompanhou até mesmo quando já programava profissionalmente. Foi apenas quando percebi que estava construindo sistemas complexos sem entender seus fundamentos matemáticos que decidi enfrentar esse bloqueio.

Ao longo de minha infância e adolescência e boa parte da vida adulta a matemática foi um dos assuntos que mais me assustavam. E com o tempo aprendi que tornar desafiador é divertido. Tornar um assunto desafiador em algo divertido, é uma estratégia muito interessante para o aprendizado.

Isso me fez lembrar de um artigo antigo que circula na comunidade de desenvolvimento há quase uma década: ["Lógica de programação é bobagem", de Paulo Torrens](https://gist.github.com/vinicius73/8d121301de6788528bf8a55e824caa97). O texto argumenta, entre outras coisas, que o conceito de "lógica de programação" é limitado ao paradigma imperativo e inútil para outros paradigmas como o funcional ou lógico. 

Embora Torrens levante pontos válidos sobre a diversidade de paradigmas, acredito que podemos expandir sua análise. O que ele identifica como uma limitação terminológica aponta para algo mais profundo: **a matemática que fundamenta e unifica todos os paradigmas de programação**, mesmo quando parecem tão distintos na superfície.

> **NOTA**: como o artigo de Torrens tem mais de 10 anos que foi escrito, não sei como ele se posiciona atualmente em relação ao que escreveu. 

A programação imperativa relaciona-se à [lógica proposicional](https://pt.wikipedia.org/wiki/Lógica_proposicional) e da [teoria dos conjuntos](https://pt.wikipedia.org/wiki/Teoria_dos_conjuntos), influenciando estruturas de controle e dados; o paradigma funcional é uma implementação direta do [cálculo lambda](https://pt.wikipedia.org/wiki/Cálculo_lambda) e da [teoria das categorias](https://pt.wikipedia.org/wiki/Teoria_das_categorias); a programação lógica baseia-se na [lógica de primeira ordem](https://pt.wikipedia.org/wiki/Lógica_de_primeira_ordem) e no [cálculo de predicados](https://pt.wikipedia.org/wiki/Cálculo_de_predicados). Todos esses paradigmas, aparentemente distintos, compartilham raízes matemáticas comuns – e compreender essas raízes é o que realmente importa.

> NOTA: A leitura de [Alonzo Church](https://pt.wikipedia.org/wiki/Alonzo_Church) é essencial para entender a relação entre a matemática e a programação. No caso, o livro [The Calculi of Lambda-Conversion](https://www.amazon.com/Calculi-Lambda-Conversion-Mathematics-Studies-ebook/dp/B088PK9PC7/ref=sr_1_1?dib=eyJ2IjoiMSJ9.fs233WcEl9eiQ9UeqbL9lxE17mCnUrKAfDCnynj0CW0.xN_oFowwnUX_5pcDEjcNpwCPkJbs71b0XrmfYtJKhog&dib_tag=se&keywords=The+Calculi+of+Lambda-Conversion&qid=1741204180&sr=8-1), fornece uma introdução concisa para os cálculos de lambda-conversão descoberto pela primeira vez por Alonzo Church e desenvolvido por ele em colaboração com seus alunos, S. C. Kleene e J. B. Rosser.

Este artigo nasceu dessa realização: a matemática não é um obstáculo para programadores, mas sim a linguagem universal que conecta todos os aspectos da computação. Como disse [Edsger W. Dijkstra](https://pt.wikipedia.org/wiki/Edsger_W._Dijkstra), pioneiro da [ciência da computação](https://pt.wikipedia.org/wiki/Ciência_da_computação), "programar é aplicar a matemática de maneira elegante e prática". Nos algoritmos mais recentes de [Large Language Models (LLMs)](https://en.wikipedia.org/wiki/Large_language_model), como o [DeepSeek-R1](https://github.com/deepseek-ai/DeepSeek-R1), essa conexão é ainda mais evidente: fórmulas matemáticas complexas – como as de [reforço por aprendizado (RL)](https://pt.wikipedia.org/wiki/Aprendizado_por_reforço) e otimização de políticas – guiam o modelo para raciocinar em tarefas de matemática e lógica, alcançando desempenho comparável a sistemas como o [o1 da OpenAI](https://openai.com/).

Neste artigo, usaremos [Scheme](https://www.scheme.org/), uma linguagem funcional derivada de [Lisp](https://pt.wikipedia.org/wiki/Lisp), escolhida não apenas por sua tradição acadêmica no [MIT](https://pt.wikipedia.org/wiki/Instituto_de_Tecnologia_de_Massachusetts) através do clássico [SICP](https://en.wikipedia.org/wiki/Structure_and_Interpretation_of_Computer_Programs), mas principalmente por suas propriedades matemáticas intrínsecas. Scheme implementa o [cálculo lambda](https://pt.wikipedia.org/wiki/Cálculo_lambda) de [Alonzo Church](https://pt.wikipedia.org/wiki/Alonzo_Church), oferecendo uma correspondência direta com a notação matemática formal através de sua [sintaxe homoicônica](https://en.wikipedia.org/wiki/Homoiconicity) e [avaliação de ordem aplicativa](https://en.wikipedia.org/wiki/Evaluation_strategy#Applicative_order). 

Suas expressões S refletem naturalmente estruturas matemáticas como [árvores de sintaxe abstrata](https://pt.wikipedia.org/wiki/Árvore_sintática_abstrata) e [grafos direcionados](https://pt.wikipedia.org/wiki/Grafo_direcionado), permitindo manipular funções como [objetos de primeira classe](https://pt.wikipedia.org/wiki/Objeto_de_primeira_classe) – um conceito fundamental na matemática discreta e na teoria das categorias. Esta elegância estrutural torna Scheme excepcionalmente adequada para demonstrar como a matemática – da [lógica booleana](https://pt.wikipedia.org/wiki/Álgebra_booleana) à [estatística](https://pt.wikipedia.org/wiki/Estatística), passando por [teoria dos conjuntos](https://pt.wikipedia.org/wiki/Teoria_dos_conjuntos) e [linguagens formais](https://pt.wikipedia.org/wiki/Linguagem_formal) – resolve problemas reais na programação, com exemplos práticos e cálculos detalhados que revelam a beleza dessa conexão.

---

## Sumário

1. [Lógica Booleana e Decisões](#lógica-booleana-e-decisões)  
2. [Teoria dos Conjuntos e Dados](#teoria-dos-conjuntos-e-dados)  
3. [Estatística e Análise de Dados](#estatística-e-análise-de-dados)  
4. [Linguagens Formais e Expressões Regulares](#linguagens-formais-e-expressões-regulares)  
5. [Aritmética Modular e Datas](#aritmética-modular-e-datas)  
6. [Recursão e Indução Matemática](#recursão-e-indução-matemática)  
7. [Fórmulas Matemáticas em Projetos Open-Source](#fórmulas-matemáticas-em-projetos-open-source)  

---

## Lógica Booleana e Decisões

Quando você faz uma busca no Google ou filtra produtos em um site de compras, está interagindo com a [lógica booleana](https://pt.wikipedia.org/wiki/Álgebra_booleana). Essa lógica foi criada por [George Boole](https://pt.wikipedia.org/wiki/George_Boole) no século XIX e é fundamental para o funcionamento dos computadores hoje em dia. A lógica booleana simplifica decisões complexas em valores simples: verdadeiro ou falso. Para isso, ela usa operadores como [AND](https://pt.wikipedia.org/wiki/Conjunção_lógica) (E), [OR](https://pt.wikipedia.org/wiki/Disjunção_lógica) (OU) e [NOT](https://pt.wikipedia.org/wiki/Negação_lógica) (NÃO). 

A álgebra booleana é um sistema matemático completo, com axiomas e propriedades que permitem manipulações formais. Por exemplo, a lei da distributividade $A \land (B \lor C) = (A \land B) \lor (A \land C)$ nos permite reorganizar expressões lógicas complexas, assim como fazemos com expressões algébricas comuns. Considere um sistema de filtragem de livros na Amazon que precisa apresentar resultados relevantes para uma busca. Definimos três predicados booleanos:

- $D(x)$: livro $x$ está disponível para entrega imediata
- $R(x)$: livro $x$ possui avaliação acima de 4 estrelas
- $G(x,g)$: livro $x$ pertence ao gênero $g$

Podemos então construir expressões lógicas mais elaboradas. Por exemplo, a expressão $D(x) \land (R(x) \lor G(x, \text{"ficção científica"}))$ seleciona livros disponíveis que ou têm boa avaliação ou são de ficção científica. Vamos analisar um caso real de filtragem para uma página de resultados. Considere a expressão booleana completa:

$$\phi(x) = D(x) \land (R(x) \lor \neg G(x, \text{"técnico"}))$$

Esta expressão seleciona livros disponíveis que ou têm boa avaliação ou não são técnicos. A tabela verdade abaixo demonstra todas as possíveis combinações:

| $D(x)$ | $R(x)$ | $G(x,\text{"técnico"})$ | $\neg G(x,\text{"técnico"})$ | $R(x) \lor \neg G(x,\text{"técnico"})$ | $\phi(x) = D(x) \land (R(x) \lor \neg G(x,\text{"técnico"}))$ |
|:------:|:------:|:----------------------:|:---------------------------:|:-------------------------------------:|:----------------------------------------------------------:|
| true   | true   | true                   | false                       | true                                  | true                                                       |
| true   | true   | false                  | true                        | true                                  | true                                                       |
| true   | false  | true                   | false                       | false                                 | false                                                      |
| true   | false  | false                  | true                        | true                                  | true                                                       |
| false  | true   | true                   | false                       | true                                  | false                                                      |
| false  | true   | false                  | true                        | true                                  | false                                                      |
| false  | false  | true                   | false                       | false                                 | false                                                      |
| false  | false  | false                  | true                        | true                                  | false                                                      |

Analisando a tabela, vemos que apenas 3 das 8 combinações possíveis resultam em verdadeiro. Isso nos permite otimizar o algoritmo de busca, focando apenas nos casos relevantes. Vamos implementar este sistema em Scheme, aproveitando sua elegância para expressar lógica formal:

```scheme
;; Definição dos predicados booleanos
(define (disponivel? livro)
  (member livro '(livro1 livro3 livro5)))

(define (bem-avaliado? livro)
  (member livro '(livro1 livro2 livro6)))

(define (genero? livro tipo)
  (member (list livro tipo)
          '((livro1 "romance")
            (livro2 "ficção científica")
            (livro3 "técnico")
            (livro5 "ficção científica")
            (livro6 "técnico"))))

;; Implementação da expressão lógica φ(x) = D(x) ∧ (R(x) ∨ ¬G(x, "técnico"))
(define (selecionar-livros livro)
  (and (disponivel? livro)
       (or (bem-avaliado? livro)
           (not (genero? livro "técnico")))))

;; Lista de todos os livros
(define todos-livros '(livro1 livro2 livro3 livro4 livro5 livro6))

;; Aplicando a seleção e mostrando os resultados
(define livros-selecionados
  (filter selecionar-livros todos-livros))

;; Demonstração com análise detalhada
(define (analisar-livro livro)
  (let ((d (disponivel? livro))
        (r (bem-avaliado? livro))
        (g (genero? livro "técnico")))
    (display livro)
    (display ": Disponível=") (display d)
    (display ", Bem-avaliado=") (display r)
    (display ", Técnico=") (display g)
    (display " → Selecionado=") 
    (display (and d (or r (not g))))
    (newline)))

;; Analisando cada livro
(for-each analisar-livro todos-livros)

;; Resultado final
(display "Livros selecionados para exibição: ")
(display livros-selecionados)
(newline)
```

Saída:

```bash
livro1: Disponível=(livro1 livro3 livro5), Bem-avaliado=(livro1 livro2 livro6), Técnico=#f → Selecionado=(livro1 livro2 livro6)
livro2: Disponível=#f, Bem-avaliado=(livro2 livro6), Técnico=#f → Selecionado=#f
livro3: Disponível=(livro3 livro5), Bem-avaliado=#f, Técnico=((livro3 técnico) (livro5 ficção científica) (livro6 técnico)) → Selecionado=#f
livro4: Disponível=#f, Bem-avaliado=#f, Técnico=#f → Selecionado=#f
livro5: Disponível=(livro5), Bem-avaliado=#f, Técnico=#f → Selecionado=#t
livro6: Disponível=#f, Bem-avaliado=(livro6), Técnico=((livro6 técnico)) → Selecionado=#f
Livros selecionados para exibição: (livro1 livro5)
```

O código implementa um sistema de decisão baseado em [álgebra booleana](https://pt.wikipedia.org/wiki/Álgebra_booleana) utilizando a linguagem [Scheme](https://pt.wikipedia.org/wiki/Scheme), que por sua natureza [funcional](https://pt.wikipedia.org/wiki/Programação_funcional) expressa diretamente as propriedades matemáticas subjacentes. A implementação materializa a expressão formal $\phi(x) = D(x) \land (R(x) \lor \neg G(x, \text{"técnico"}))$ através de [funções de primeira classe](https://pt.wikipedia.org/wiki/Função_de_primeira_classe) que encapsulam [predicados](https://pt.wikipedia.org/wiki/Predicado_(programação)) fundamentais. Cada predicado (`disponivel?`, `bem-avaliado?`, `genero?`) constitui uma [função característica](https://pt.wikipedia.org/wiki/Função_característica) que mapeia elementos do [domínio](https://pt.wikipedia.org/wiki/Domínio_de_uma_função) para o conjunto booleano $\{verdadeiro, falso\}$.

A função `selecionar-livros` exemplifica a [composição funcional](https://pt.wikipedia.org/wiki/Composição_de_funções) de operadores lógicos, transformando predicados atômicos em uma [expressão booleana](https://pt.wikipedia.org/wiki/Expressão_booleana) complexa. Esta abordagem demonstra o [isomorfismo](https://pt.wikipedia.org/wiki/Isomorfismo) entre a lógica proposicional e sua implementação computacional. A aplicação da função `filter` sobre a coleção de livros representa uma [operação de conjunto](https://pt.wikipedia.org/wiki/Teoria_dos_conjuntos#Operações_entre_conjuntos) que seleciona um [subconjunto](https://pt.wikipedia.org/wiki/Subconjunto) satisfazendo a condição booleana – concretizando o conceito matemático de [compreensão de conjunto](https://pt.wikipedia.org/wiki/Compreensão_de_conjunto) $\{x \in X \mid \phi(x)\}$.

A função `analisar-livro` implementa uma [tabela verdade](https://pt.wikipedia.org/wiki/Tabela_verdade) dinâmica, calculando os valores intermediários e finais da expressão booleana para cada livro. O uso de [ligações lexicais](https://pt.wikipedia.org/wiki/Escopo_(computação)) via `let` cria um [ambiente de avaliação](https://pt.wikipedia.org/wiki/Ambiente_de_execução) isolado, permitindo a [avaliação parcial](https://pt.wikipedia.org/wiki/Avaliação_parcial) das subexpressões. A iteração final com `for-each` demonstra o [princípio de aplicação universal](https://pt.wikipedia.org/wiki/Aplicação_universal), aplicando a função de análise a cada elemento do conjunto, produzindo uma [correspondência](https://pt.wikipedia.org/wiki/Correspondência_(matemática)) entre livros e seus respectivos resultados booleanos.

---

## Teoria dos Conjuntos e Dados

Organizar informações é uma necessidade antiga, e a [teoria dos conjuntos](https://pt.wikipedia.org/wiki/Teoria_dos_conjuntos) – formalizada por [<ins>Georg Cantor</ins>](https://pt.wikipedia.org/wiki/Georg_Cantor) – é a ferramenta perfeita para isso na programação moderna. Pense em um sistema de e-commerce como a Amazon por exemplo. Imagine que você está procurando um novo smartphone em uma loja online. Temos os seguintes conjuntos:
 
 | Símbolo | Significado | Exemplo |
 |---------|-------------|---------|
 | $U$ | Todos os produtos | {iPhone, Galaxy, Pixel, iPad, MacBook, ...} |
 | $E$ | Produtos eletrônicos | {iPhone, Galaxy, Pixel, iPad, MacBook, ...} |
 | $S$ | Smartphones | {iPhone, Galaxy, Pixel, ...} |
 | $P$ | Produtos em promoção | {Galaxy, iPad, ...} |
 | $D$ | Produtos disponíveis | {iPhone, Galaxy, iPad, ...} |

Quando você filtra por "smartphones em promoção disponíveis", está pedindo: $S \cap P \cap D = \{Galaxy\}$

 | Operação | Símbolo | Significado | Exemplo |
 |----------|---------|-------------|---------|
 | **Interseção** | $A \cap B$ | Elementos que estão em A **E** em B | $S \cap P = \{Galaxy\}$ |
 | **União** | $A \cup B$ | Elementos que estão em A **OU** em B | $S \cup P = \{iPhone, Galaxy, Pixel, iPad\}$ |
 | **Diferença** | $A - B$ | Elementos que estão em A mas **NÃO** em B | $S - P = \{iPhone, Pixel\}$ |
 | **Complemento** | $A^c$ | Elementos que **NÃO** estão em A | $S^c = \{iPad, MacBook, ...\}$ |

Em termos simples, a teoria dos conjuntos é como organizar itens em diferentes caixas e depois verificar quais itens estão em várias caixas ao mesmo tempo (interseção) ou combinar caixas diferentes (união).

![Diagrama de Venn mostrando S ∩ P ∩ D](https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Venn_diagram_cmyk.svg/1024px-Venn_diagram_cmyk.svg.png)
*Diagrama de Venn: a área onde todos os círculos se sobrepõem representa nossa busca por "smartphones em promoção disponíveis"*

```scheme
;; Implementação da diferença de conjuntos A - B
;; Em palavras simples: "me dê todos os itens de A que não estão em B"
(define (diferenca-conjuntos a b)
  (filter (lambda (x) (not (member x b))) a))

;; Implementação da interseção de conjuntos A ∩ B
;; Em palavras simples: "me dê todos os itens que estão tanto em A quanto em B"
(define (intersecao-conjuntos a b)
  (filter (lambda (x) (member x b)) a))

;; Implementação da união de conjuntos A ∪ B
;; Em palavras simples: "me dê todos os itens que estão em A ou em B, sem repetições"
(define (uniao-conjuntos a b)
  (let ((resultado a))
    (for-each (lambda (x)
                (when (not (member x resultado))
                  (set! resultado (cons x resultado))))
              b)
    resultado))

;; Exemplo prático: sistema de recomendação de produtos
(define todos-produtos '("Smartphone" "Notebook" "Headphone" "Monitor" "Teclado" "Mouse" "Câmera"))
(define produtos-eletronicos '("Smartphone" "Notebook" "Headphone" "Monitor" "Teclado" "Mouse"))
(define produtos-promocao '("Notebook" "Monitor" "Câmera"))
(define produtos-disponiveis '("Smartphone" "Notebook" "Headphone" "Câmera"))

;; Encontrar eletrônicos em promoção disponíveis
(define eletronicos-promocao 
  (intersecao-conjuntos produtos-eletronicos produtos-promocao))
(define resultado-final 
  (intersecao-conjuntos eletronicos-promocao produtos-disponiveis))

(display "Produtos eletrônicos em promoção disponíveis: ")
(display resultado-final) (newline)
;; Saída: (Notebook)

;; Demonstrando outras operações
(display "Todos os produtos em promoção ou disponíveis: ")
(display (uniao-conjuntos produtos-promocao produtos-disponiveis)) (newline)
;; Saída: (Câmera Headphone Smartphone Notebook Monitor)

(display "Produtos disponíveis que não estão em promoção: ")
(display (diferenca-conjuntos produtos-disponiveis produtos-promocao)) (newline)
;; Saída: (Smartphone Headphone)
```
Saída:

```bash
Produtos eletrônicos em promoção disponíveis: (Notebook)
Todos os produtos em promoção ou disponíveis: (Headphone Smartphone Notebook Monitor Câmera)
Produtos disponíveis que não estão em promoção: (Smartphone Headphone)
```


### Aplicações práticas da Teoria dos Conjuntos

| Área | Aplicação | Operação de Conjunto |
|------|-----------|----------------------|
| **Mecanismos de busca** | Resultados para "gato E cachorro" | Interseção de páginas com "gato" e páginas com "cachorro" |
| **Redes sociais** | "Amigos em comum" | Interseção entre seus amigos e os amigos de outra pessoa |
| **Bancos de dados** | Consulta SQL com JOIN | Interseção de tabelas baseada em condições |
| **Análise de dados** | Segmentação de clientes | Divisão em subconjuntos baseados em comportamento |
| **Sistemas de recomendação** | "Quem comprou X também comprou Y" | Interseção de conjuntos de compras de diferentes usuários |

A teoria dos conjuntos está presente em praticamente todos os sistemas digitais que usamos diariamente. Quando você filtra e-mails no Gmail, seleciona filtros no Instagram, ou busca produtos com características específicas na Amazon, está utilizando operações de conjuntos. Estas operações permitem que sistemas complexos organizem e recuperem informações de forma eficiente, transformando grandes volumes de dados em resultados relevantes para você.

---

## Estatística e Análise de Dados

Enquanto a teoria dos conjuntos nos ajuda a organizar e filtrar dados, a [estatística descritiva](https://pt.wikipedia.org/wiki/Estatística_descritiva) nos permite extrair significado desses dados. Imagine que você é um analista de dados da Netflix analisando o tempo de visualização (em minutos) de um novo documentário pelos usuários. Tempos de visualização (em minutos) de 10 usuários:

 $V = \{120, 150, 110, 130, 145, 160, 125, 135, 140, 155\}$

 | Métrica | Fórmula | Cálculo | Resultado | Significado simples |
 |---------|---------|---------|-----------|---------------------|
 | **Média** | $\mu = \frac{\sum_{i=1}^{n} x_i}{n}$ | $\frac{1370}{10}$ | 137 | O "valor típico" - somamos tudo e dividimos pela quantidade |
 | **Mediana** | Valor central | $\frac{135 + 140}{2}$ | 137.5 | O valor do meio quando ordenamos todos os dados |
 | **Desvio Padrão** | $\sigma = \sqrt{\frac{\sum_{i=1}^{n} (x_i - \mu)^2}{n-1}}$ | $\sqrt{\frac{2310}{9}}$ | 16.02 | Quanto os valores tendem a se afastar da média |

![Gráfico de distribuição normal](https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Normal_Distribution_PDF.svg/1200px-Normal_Distribution_PDF.svg.png)
*Distribuição normal: a maioria dos valores se concentra próximo à média, com poucos valores nos extremos*

Em palavras simples:
- **Média**: É como o "centro de gravidade" dos dados. Se você equilibrasse todos os valores em uma balança, a média seria o ponto de equilíbrio.
- **Mediana**: É o valor do meio quando você coloca todos os dados em ordem. Metade dos valores está acima, metade está abaixo.
- **Desvio Padrão**: É como um "termômetro de variação". Um valor baixo significa que os dados estão agrupados próximos à média; um valor alto significa que estão espalhados.

```scheme
;; Lista de valores diários de vendas
(define vendas '(120 150 110 130 145 160 125 135 140 155))

;; Calcula a média aritmética de uma lista de números
;; Em palavras simples: somamos todos os valores e dividimos pela quantidade
(define (media lst)
  (/ (apply + lst) (length lst)))

;; Calcula a mediana de uma lista de números
;; Em palavras simples: ordenamos os valores e pegamos o do meio
(define (mediana lst)
  (let* ((sorted (sort lst <))         ; Ordena a lista em ordem crescente
         (n (length lst))              ; Obtém o tamanho da lista
         (mid (quotient n 2)))         ; Calcula o índice do meio
    (if (even? n)                      ; Verifica se o tamanho é par
        (/ (+ (list-ref sorted (- mid 1)) (list-ref sorted mid)) 2)
        (list-ref sorted mid))))       ; Se ímpar, retorna o elemento central

;; Calcula o desvio padrão de uma lista de números
;; Em palavras simples: medimos quanto cada valor se afasta da média, em média
(define (desvio-padrao lst)
  (let ((mu (media lst)))              ; Calcula a média primeiro
    (sqrt (/ (apply + (map (lambda (x) (expt (- x mu) 2)) lst))
             (- (length lst) 1)))))    ; Divide pela quantidade de graus de liberdade (n-1)

;; Calcula o valor mínimo e máximo
(define (minimo lst) (apply min lst))
(define (maximo lst) (apply max lst))

;; Calcula os quartis (dividem os dados em 4 partes iguais)
(define (quartis lst)
  (let* ((sorted (sort lst <))
         (n (length sorted))
         (q2 (mediana sorted))
         (lower (filter (lambda (x) (< x q2)) sorted))
         (upper (filter (lambda (x) (> x q2)) sorted)))
    (list (mediana lower) q2 (mediana upper))))

;; Exibindo os resultados
(display "Média: ") (display (media vendas)) (newline)         ; 137
(display "Mediana: ") (display (mediana vendas)) (newline)     ; 137.5
(display "Desvio Padrão: ") (display (desvio-padrao vendas)) (newline) ; ~16.02
(display "Mínimo: ") (display (minimo vendas)) (newline)       ; 110
(display "Máximo: ") (display (maximo vendas)) (newline)       ; 160
(display "Quartis (Q1, Q2, Q3): ") (display (quartis vendas)) (newline) ; (125 137.5 150)
```

### Aplicações práticas da Estatística

| Área | Aplicação | Métricas Utilizadas |
|------|-----------|---------------------|
| **Streaming** | Recomendação de conteúdo | Média e desvio padrão de avaliações |
| **E-commerce** | Previsão de vendas | Médias móveis e tendências sazonais |
| **Saúde** | Monitoramento de sinais vitais | Limites estatísticos para alertas |
| **Finanças** | Análise de risco | Desvio padrão de retornos (volatilidade) |
| **Redes Sociais** | Detecção de conteúdo viral | Taxas de engajamento acima da média |

Estas métricas estatísticas são fundamentais para sistemas de recomendação. Quando a Netflix sugere "93% de compatibilidade" com um novo show, por trás há um sistema estatístico comparando seus padrões de visualização com os de outros usuários semelhantes.

---

## Linguagens Formais e Expressões Regulares

Da organização de dados com teoria dos conjuntos e sua análise estatística, passamos agora para a estruturação e validação de informações textuais. Imagine um sistema de monitoramento de servidores que precisa extrair informações importantes de logs. Um exemplo genérico como `2023-10-27 14:35:22 [ERROR] Falha na autenticação do usuário ID1234`. Vamos supor que precisamos extrair: data, hora, nível de erro e ID do usuário:

 | Componente | Padrão Regex | Exemplo | Explicação Simples |
 |------------|--------------|---------|---------------------|
 | **Data** | `(\d{4}-\d{2}-\d{2})` | 2023-10-27 | 4 dígitos, hífen, 2 dígitos, hífen, 2 dígitos |
 | **Hora** | `(\d{2}:\d{2}:\d{2})` | 14:35:22 | 2 dígitos, dois-pontos, 2 dígitos, dois-pontos, 2 dígitos |
 | **Nível** | `\[(\w+)\]` | [ERROR] | Texto entre colchetes |
 | **ID** | `ID(\d+)` | ID1234 | "ID" seguido de um ou mais dígitos |

![Diagrama de autômato finito](https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/DFA_example_multiplies_of_3.svg/500px-DFA_example_multiplies_of_3.svg.png)
*Autômato finito: a base teórica das expressões regulares. Cada círculo é um estado, e as setas mostram transições entre estados.*

Em palavras simples, expressões regulares são como "moldes" para encontrar padrões em texto. Imagine que você tem um carimbo especial que só marca palavras com um formato específico - é assim que as regex funcionam!

```scheme
;; String de log que queremos analisar
(define log "2023-10-27 14:35:22 [ERROR] Falha na autenticação do usuário ID1234")

;; Função para extrair partes do log usando funções de string básicas
(define (extrair-data log)
  (substring log 0 10))

(define (extrair-hora log)
  (substring log 11 19))

(define (extrair-nivel log)
  (let* ((inicio (+ (string-index log #\[) 1))
         (fim (string-index log #\])))
    (substring log inicio fim)))

(define (extrair-id log)
  (let* ((inicio (+ (string-index log #\I) 2))
         (fim (string-length log)))
    (substring log inicio fim)))

;; Exibe as partes extraídas
(display "String completa: ") (display log) (newline)
(display "Data: ") (display (extrair-data log)) (newline)         ; "2023-10-27"
(display "Hora: ") (display (extrair-hora log)) (newline)        ; "14:35:22"
(display "Nível: ") (display (extrair-nivel log)) (newline)      ; "ERROR"
(display "ID: ") (display (extrair-id log)) (newline)   ; "1234"

;; Função para validar um endereço de email sem usar regexp
(define (email-valido? email)
  (and (string-index email #\@)                 ; Deve conter @
       (string-index email #\.)                 ; Deve conter .
       (> (string-length email) 5)                 ; Tamanho mínimo razoável
       (not (string-index email #\space))           ; Não deve conter espaços
       (> (string-index email #\.) 
          (string-index email #\@))))           ; O ponto deve vir depois do @

(display "teste@exemplo.com é válido? ")
(display (email-valido? "teste@exemplo.com")) (newline) ; #t

(display "email_invalido é válido? ")
(display (email-valido? "email_invalido")) (newline) ; #f
```

### Aplicações práticas de Expressões Regulares

| Área | Aplicação | Exemplo de Padrão |
|------|-----------|-------------------|
| **Formulários Web** | Validação de email | `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$` |
| **Segurança** | Detecção de injeção SQL | `(SELECT\|INSERT\|UPDATE\|DELETE\|DROP)` |
| **Análise de Texto** | Extração de URLs | `https?://[^\s]+` |
| **Processamento de Logs** | Filtragem de erros | `\[ERROR\].*` |
| **Desenvolvimento Web** | Roteamento de URLs | `/produtos/(\d+)` |

Na prática, expressões regulares são essenciais em sistemas de segurança para detectar padrões suspeitos em logs, em ferramentas de ETL para validar e transformar dados, e até mesmo em editores de código para funcionalidades de busca e substituição avançadas.

---

## Aritmética Modular e Datas

Datas são caóticas – meses variam, anos têm bissextos – mas a [aritmética modular](https://pt.wikipedia.org/wiki/Aritmética_modular) traz ordem. Pense em calcular quantos dias, horas e minutos se passaram entre $ 15/01/2023 \, 10:00 $ e $ 27/10/2023 \, 18:30 $. Sistemas como calendários digitais ou cronômetros dependem disso.

Convertemos tudo a segundos desde uma referência (epoch), subtraímos e usamos divisões e restos:  
- $ \Delta t $ em segundos.  
- Dias: $ \lfloor \Delta t / 86400 \rfloor $ (86400s = 1 dia).  
- Horas: $ \lfloor (\Delta t \mod 86400) / 3600 \rfloor \$.  
- Minutos: $ \lfloor ((\Delta t \mod 86400) \mod 3600) / 60 \rfloor \$.  

Em Scheme:  

```scheme
(define (data-segundos ano mes dia hora min)
  (+ (* ano 31536000) (* mes 2592000) (* dia 86400) (* hora 3600) (* min 60)))

(define inicio (data-segundos 2023 1 15 10 0))
(define fim (data-segundos 2023 10 27 18 30))
(define diferenca (- fim inicio))

(display (quotient diferenca 86400)) (newline)          ; dias
(display (quotient (remainder diferenca 86400) 3600)) (newline) ; horas
(display (quotient (remainder (remainder diferenca 86400) 3600) 60)) (newline) ; minutos
```

Essa lógica é a base de bibliotecas como `strftime` e até de fusos horários em sistemas operacionais. 

---

## Recursão e Indução Matemática

Da tomada de decisões lógicas, avançamos para um dos conceitos mais poderosos na programação: a recursão. Imagine que você precisa calcular o fatorial de 5 (5!):

 | Passo | Cálculo | Explicação em linguagem simples |
 |-------|---------|----------------------------------|
 | 5! | 5 × 4! | "Para calcular 5!, multiplique 5 pelo fatorial de 4" |
 | 4! | 4 × 3! | "Para calcular 4!, multiplique 4 pelo fatorial de 3" |
 | 3! | 3 × 2! | "Para calcular 3!, multiplique 3 pelo fatorial de 2" |
 | 2! | 2 × 1! | "Para calcular 2!, multiplique 2 pelo fatorial de 1" |
 | 1! | 1 | "Sabemos que o fatorial de 1 é 1" (caso base) |
 | Resultado | 5 × 4 × 3 × 2 × 1 = 120 | "Agora substituímos de baixo para cima" |

![Visualização da recursão](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Tower_of_Hanoi_4.gif/300px-Tower_of_Hanoi_4.gif)
*Torre de Hanói: um problema clássico resolvido recursivamente. Cada movimento depende de resolver uma versão menor do mesmo problema.*

Em palavras simples, recursão é como resolver um problema grande dividindo-o em versões menores do mesmo problema, até chegar a um caso tão simples que você já sabe a resposta diretamente.

| Conceito | Explicação | Exemplo |
|----------|------------|---------|
| **Caso Base** | A condição de parada que resolve diretamente | fatorial(1) = 1 |
| **Caso Recursivo** | Reduz o problema a uma versão menor | fatorial(n) = n × fatorial(n-1) |
| **Pilha de Chamadas** | Registra as chamadas pendentes | fatorial(5) → fatorial(4) → fatorial(3) → ... |
| **Recursão de Cauda** | Otimização que evita crescimento da pilha | Passa o resultado parcial como parâmetro |

```scheme
;; Implementação recursiva do fatorial
;; Em palavras simples: "Para calcular n!, multiplique n pelo fatorial de (n-1)"
(define (fatorial n)
  (if (<= n 1)                ; Se n é 0 ou 1
      1                       ; O resultado é 1 (caso base)
      (* n (fatorial (- n 1))))) ; Senão, multiplique n pelo fatorial de (n-1)

(display "5! = ") (display (fatorial 5)) (newline) ; 120

;; Implementação com recursão de cauda (mais eficiente)
(define (fatorial-cauda n)
  (define (iter n acumulador)
    (if (<= n 1)
        acumulador
        (iter (- n 1) (* n acumulador))))
  (iter n 1))

(display "5! (recursão de cauda) = ") (display (fatorial-cauda 5)) (newline) ; 120

;; Exemplo prático: navegando em uma árvore genealógica
(define (listar-ancestrais pessoa profundidade)
  (display (make-string (* profundidade 2) #\space)) ; Indentação para visualizar a hierarquia
  (display (string-append "Nome: " (car pessoa)))
  (newline)
  ;; Se a pessoa tem pais registrados, liste-os recursivamente
  (when (cdr pessoa)
    (for-each (lambda (pai)
                (listar-ancestrais pai (+ profundidade 1)))
              (cdr pessoa))))

;; Estrutura de dados representando uma árvore genealógica simplificada
;; Cada pessoa é representada como (nome . lista-de-pais)
(define arvore-genealogica
  '("João" 
    ("Maria" 
     ("Ana" ("Beatriz") ("Carlos"))
     ("Pedro" ("Diana") ("Eduardo")))
    ("José" 
     ("Fernando") 
     ("Gabriela"))))

(listar-ancestrais arvore-genealogica 0)
```

### Aplicações práticas da Recursão

| Área | Aplicação | Exemplo |
|------|-----------|---------|
| **Sistemas de Arquivos** | Navegação em diretórios | Listar todos os arquivos, incluindo subdiretórios |
| **Compiladores** | Análise sintática | Processar expressões aninhadas como (2 * (3 + 4)) |
| **Gráficos** | Fractais | Padrões como o Triângulo de Sierpinski que se repetem em escalas menores |
| **Jogos** | Inteligência artificial | Algoritmo Minimax para jogos como xadrez |
| **Estruturas de Dados** | Árvores e grafos | Percorrer todos os nós de uma árvore binária |

A recursão é usada em muitas aplicações práticas: navegação em sistemas de arquivos, processamento de estruturas de dados hierárquicas (como XML/HTML), algoritmos de busca em árvores (usados em bancos de dados) e até mesmo em inteligência artificial para percorrer árvores de decisão.

---

## Fórmulas Matemáticas em Projetos Open-Source

Após explorarmos conceitos matemáticos fundamentais e suas implementações, vamos examinar como esses princípios são aplicados em projetos de software reais que impactam milhões de usuários diariamente. Veja abaixo alguns exemplos:

 | Projeto | Conceito Matemático | Fórmula | Aplicação Prática |
 |---------|---------------------|---------|-------------------|
 | **[Linux Kernel](https://github.com/torvalds/linux)** | Escalonamento de Processos | $ \text{Prioridade Dinâmica} = \text{Prioridade Estática} - \text{Bônus} + 5 $ | Determina qual processo recebe tempo de CPU |
 | **[PostgreSQL](https://github.com/postgres/postgres)** | Otimização de Consultas | $ \text{Custo} = \text{Páginas de Disco} \times \text{random\_page\_cost} + \text{Linhas} \times \text{cpu\_tuple\_cost} $ | Escolhe o plano de execução mais eficiente |
 | **[OpenSSL](https://github.com/openssl/openssl)** | Criptografia | $ C = M^e \bmod n $ | Protege dados sensíveis na internet |
 | **[Blender](https://github.com/blender/blender)** | Gráficos 3D | $ P' = P \times M_{transformação} $ | Renderiza modelos 3D realistas |
 | **[scikit-learn](https://github.com/scikit-learn/scikit-learn)** | Machine Learning | $ J(\theta) = \frac{1}{2m} \sum_{i=1}^{m} (h_\theta(x^{(i)}) - y^{(i)})^2 $ | Treina modelos preditivos |
 | **[TensorFlow](https://github.com/tensorflow/tensorflow)** | Gradiente Descendente | $ \theta_{t+1} = \theta_t - \alpha \nabla_\theta J(\theta_t) $ | Otimiza redes neurais |

![Visualização de algoritmo](https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Quicksort.gif/330px-Quicksort.gif)
*Algoritmo Quicksort em ação: um exemplo de como a matemática se traduz em algoritmos eficientes*

### Como a matemática se traduz em código real

Vamos ver um exemplo concreto do algoritmo de gradiente descendente usado em machine learning:

```python
# Implementação simplificada de gradiente descendente em Python
def gradient_descent(X, y, theta, alpha, iterations):
    """
    X: matriz de features
    y: vetor de valores alvo
    theta: parâmetros iniciais
    alpha: taxa de aprendizado
    iterations: número de iterações
    """
    m = len(y)  # número de exemplos de treinamento
    cost_history = []
    
    for i in range(iterations):
        # Previsão: h(x) = X * theta
        prediction = X.dot(theta)
        
        # Erro: h(x) - y
        error = prediction - y
        
        # Gradiente: (1/m) * X' * (h(x) - y)
        gradient = (1/m) * X.T.dot(error)
        
        # Atualização: theta = theta - alpha * gradiente
        theta = theta - alpha * gradient
        
        # Cálculo do custo: (1/2m) * sum((h(x) - y)^2)
        cost = (1/(2*m)) * np.sum(np.square(error))
        cost_history.append(cost)
    
    return theta, cost_history
```

Estes exemplos demonstram como a matemática transcende o ambiente acadêmico e se torna a espinha dorsal de sistemas que usamos todos os dias. Do kernel que executa seu smartphone aos algoritmos que recomendam seu próximo filme, a matemática está presente, trabalhando silenciosamente para tornar a tecnologia mais eficiente e inteligente.

Ao longo deste artigo, exploramos como a matemática é a base de muitos conceitos e técnicas usados na programação. Desde a lógica booleana até a recursão, cada tópico demonstra que a matemática não é apenas uma ferramenta teórica, mas uma linguagem universal que nos permite resolver problemas complexos de forma elegante e eficiente. Dominar esses conceitos não só melhora suas habilidades como programador, mas também abre portas para a criação de sistemas mais robustos e inovadores.

A matemática está presente em praticamente todos os sistemas digitais que usamos diariamente. Quando você filtra e-mails no Gmail, seleciona filtros no Instagram, ou busca produtos com características específicas na Amazon, está utilizando operações de conjuntos. Estas operações permitem que sistemas complexos organizem e recuperem informações de forma eficiente, transformando grandes volumes de dados em resultados relevantes para você.

---

### Livros Recomendados

Por fim, para aprofundar sua compreensão dos conceitos matemáticos que exploramos neste artigo, recomendo os seguintes livros:

 | Nível | Título | Autor | Foco | Melhor para |
 |-------|--------|-------|------|-------------|
 | **Iniciante** | [Matemática Discreta para Computação e Informática](https://www.amazon.com.br/Matem%C3%A1tica-Computa%C3%A7%C3%A3o-Inform%C3%A1tica-did%C3%A1ticos-inform%C3%A1tica-ebook/dp/B0176PU3XA) | Paulo Blauth Menezes | Fundamentos para programação | Estudantes iniciando na área |
 | **Iniciante** | [Estatística Básica](https://www.amazon.com.br/Estat%C3%ADstica-B%C3%A1sica-Wilton-Bussab/dp/8547220224) | Wilton O. Bussab e Pedro A. Morettin | Estatística com exemplos práticos | Quem precisa analisar dados |
 | **Intermediário** | [Matemática Discreta e Suas Aplicações](https://www.amazon.com.br/Matem%C3%A1tica-discreta-suas-aplica%C3%A7%C3%B5es-Rosen/dp/0070681880/ref=sr_1_2?__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=22G3TBXZYABNQ&dib=eyJ2IjoiMSJ9.MSydvBTLjysMwGhHtf2BDfZoe9RU1sfvm9vMJY5fY7P2NyqYTx1kfv_EdDLm6Inqjq4kz03jAlXllE4VK6GPUBxlhZxLt2jpiOjOFQn3yv5ct1bOPrguD3b4Di8NYFqrkfD6Pv9g52aIty1LFrRp0g.hjqbwrCQq0LjwVw3lsc4h9N4K9a_2n3Xt7NeeQ2IFJw&dib_tag=se&keywords=Matem%C3%A1tica+Discreta+e+Suas+Aplica%C3%A7%C3%B5es+kenneth&qid=1741205749&s=books&sprefix=matem%C3%A1tica+discreta+e+suas+aplica%C3%A7%C3%B5es+kenneth%2Cstripbooks%2C146&sr=1-2) | Kenneth H. Rosen | Teoria dos conjuntos, lógica, grafos | Programadores que querem aprofundar |
 | **Intermediário** | [Introduction to Algorithms](https://www.amazon.com/Introduction-Algorithms-3rd-MIT-Press/dp/0262033844) | Cormen, Leiserson, Rivest e Stein | Análise matemática de algoritmos | Desenvolvedores de software |
 | **Avançado** | [Concrete Mathematics](https://www.amazon.com/Concrete-Mathematics-Foundation-Computer-Science-ebook/dp/B07C2HMZQR/ref=sr_1_2?crid=386XK9B7H5C0R&dib=eyJ2IjoiMSJ9.hb1ftOjpuhk1KGiKwhrAOpNYeUS4StklrGO6bp8jix0XRb39PjcGasnBl-XB8UD-4tgo9Upk3ghSQFGC7ozvVmLSs5pOTUp_TGGMfQBMsVHEQT2ucXqZoNMgw8D92hkMPVjdMrBHjvnXan9CeNO5538Cjj3SWdP2j_hZf6XA9LY.5B83JzPYUwnxhwuFzOEOEIzIeUB4HQzE4ydBXgWr0m0&dib_tag=se&keywords=Concrete+Mathematics%3A+A+Foundation+for+Computer+Science&qid=1741205803&s=books&sprefix=concrete+mathematics+a+foundation+for+computer+science%2Cstripbooks-intl-ship%2C161&sr=1-2) | Graham, Knuth e Patashnik | Matemática para análise de algoritmos | Engenheiros de software experientes |
 | **Avançado** | [The Art of Computer Programming](https://www.amazon.com/Art-Computer-Programming-Volumes-1-4/dp/0321751043) | Donald E. Knuth | Análise matemática profunda | Cientistas da computação |

 > **NOTA**: a coletânea de livros de Donald Knuth é uma das mais importantes e influentes da história da computação. No entanto, não é recomendado para iniciantes, pois é um material muito denso, pesado, e de fácil leitura.

Estes livros fornecem tanto o rigor teórico quanto as aplicações práticas dos conceitos matemáticos que exploramos. Alguns são mais acessíveis, enquanto outros oferecem tratamento mais avançado – escolha de acordo com seu nível de familiaridade com os temas.
