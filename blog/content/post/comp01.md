+++
title = ""
description = ""
date = 2025-03-28T12:00:00-00:00
tags = ["RAG", "LLM", "AI", "Optimização", "Produção", "PostgreSQL", "Ollama"]
draft = true
weight = 3
author = "Vitor Lobo Ramos"
+++

# 1. INTRODUÇÃO

Linguagens de programação são notações para se descrever computações para pessoas e para máquinas. O mundo conforme o conhecemos depende de linguagens de programação, pois todo o software executando em todos os computadores foi escrito em alguma linguagem de programação. Mas, antes que possa rodar, um programa primeiro precisa ser
traduzido para um formato que lhe permita ser executado por um computador.

Os sistemas de software que fazem essa tradução são denominados compiladores.

Este livro ensina como projetar e implementar compiladores. Vamos descobrir que algumas poucas idéias básicas podem
ser utilizadas na construção de tradutores para uma grande variedade de linguagens e máquinas. Além dos compiladores, os princípios e técnicas para o seu projeto se aplicam a vários outros domínios que provavelmente serão reutilizados muitas vezes na carreira de um cientista da computação. O estudo da escrita de compiladores abrange linguagens de programação, arquitetura de máquina, teoria de linguagem, algoritmos e engenharia de software.
Neste capítulo preliminar, introduzimos as diferentes formas de tradutores de linguagens, apresentamos uma visão de alto nível da estrutura de um compilador típico e discutimos as novas tendências das linguagens de programação e das arquiteturas de máquina que estão influenciando os compiladores. Incluímos algumas observações sobre o relacionamento entre o projeto de um compilador e a teoria da ciência da computação, além de um esboço das aplicações da tecnologia de compilador que ultrapassam a fronteira da compilação. Terminamos com uma rápida apresentação dos principais conceitos de linguagem de programação que serão necessários para o nosso estudo dos compiladores.
## 1.1 PROCESSADORES DE LINGUAGEM

Colocando de uma forma bem simples, um compilador é um programa que recebe como entrada um programa em uma
linguagem de programação - a linguagem fonte – e o traduz para um programa equivalente em outra linguagem – a linguagem objeto; ver Figura 1.1. Um papel importante do compilador é relatar quaisquer erros no programa fonte detectados durante esse processo de tradução.
```
programa fonte
Compilador
programa objeto
```

**FIGURA 1.1** Um compilador.
Se o programa objeto for um programa em uma linguagem de máquina executável, poderá ser chamado pelo usuário para processar entradas e produzir saída; ver Figura 1.2.
```
entrada
Programa Objeto
saída
```

**FIGURA 1.2** Executando o programa objeto.
## COMPILADORES: PRINCÍPIOS, TÉCNICAS E FERRAMENTAS

Um interpretador é outro tipo comum de processador de linguagem. Em vez de produzir um programa objeto como resultado da tradução, um interpretador executa diretamente as operações especificadas no programa fonte sobre as entradas fornecidas pelo usuário, como mostra a Figura 1.3.
```
programa fonte
entrada
Interpretador
saída
```

**FIGURA 1.3** Um interpretador.
O programa objeto em linguagem de máquina produzido por um compilador normalmente é muito mais rápido no mapeamento de entradas para saídas do que um interpretador. Porém, um interpretador freqüentemente oferece um melhor diagnóstico de erro do que um compilador, pois executa o programa fonte instrução por instrução.
**EXEMPLO 1.1:** Os processadores da linguagem Java combinam compilação e interpretação, como mostrado na Figura 1.4. Um programa fonte em Java pode ser primeiro compilado para uma forma intermediária, chamada bytecodes. Os bytecodes
(ou códigos de bytes) são então interpretados por uma máquina virtual. Como um benefício dessa combinação, os bytecodes compilados em uma máquina podem ser interpretados em outra máquina, talvez por meio de uma rede.
```
programa fonte
Tradutor
código intermediário
entrada
Máquina Virtual
saída
```

**FIGURA 1.4** Um compilador híbrido.
A fim de conseguir um processamento mais rápido das entradas para as saídas, alguns compiladores Java, chamados compiladores just-in-time, traduzem os bytecodes para uma dada linguagem de máquina imediatamente antes de executarem o programa intermediário para processar a entrada.
Além de um compilador, vários outros programas podem ser necessários para a criação de um programa objeto executável, como mostra a Figura 1.5. Um programa fonte pode ser subdividido em módulos armazenados em arquivos separados. A
tarefa de coletar o programa fonte às vezes é confiada a um programa separado, chamado pré-processador. O pré-processador também pode expandir macros em comandos na linguagem fonte.
 programa fonte
 Pré-processador
 programa fonte modificado
 Compilador
 programa objeto em assembly
 Montador
 código de máquina relocável
 Editor de Ligação/Carregador
 código de máquina alvo
 arquivos de biblioteca
 arquivos objeto relocáveis
 FIGURA 1.5 Um sistema de processamento de linguagem.
3
 CAPÍTULO 1: INTRODUÇÃO
 CAPÍTULO 1: INTRODUÇÃO
 O compilador recebe na entrada o programa fonte modificado e pode produzir como saída um programa em uma linguagem
 simbólica, conhecida como assembly, considerada mais fácil de ser gerada como saída e mais fácil de depurar. A linguagem sim
bólica é então processada por um programa chamado montador (assembler), que produz código de máquina relocável como sua
 saída.
 Programas grandes normalmente são compilados em partes, de modo que o código de máquina relocável pode ter de ser liga
do a outros arquivos objeto relocáveis e a arquivos de biblioteca para formar o código que realmente é executado na máquina. O
 editor de ligação (linker) resolve os endereços de memória externos, onde o código em um arquivo pode referir-se a uma locali
zação em outro arquivo. O carregador (loader) reúne então todos os arquivos objeto executáveis na memória para a execução.
 1.1.1 EXERCÍCIOS DA SEÇÃO 1.1
 Exercício 1.1.1: Qual é a diferença entre um compilador e um interpretador?
 Exercício 1.1.2: Quais são as vantagens de (a) um compilador em relação a um interpretador e (b) um interpretador em rela
ção a um compilador?
 Exercício 1.1.3: Que vantagens existem em um sistema de processamento de linguagem no qual o compilador produz lingua
gem simbólica em vez de linguagem de máquina?
 Exercício 1.1.4: Um compilador que traduz uma linguagem de alto nível para outra linguagem de alto nível é chamado de tra
dutor de fonte para fonte. Que vantagens existem em usar C como linguagem objeto para um compilador?
 Exercício 1.1.5: Descreva algumas das tarefas que um programa montador precisa realizar.
 1.2 A ESTRUTURA DE UM COMPILADOR
 Até este ponto, tratamos um compilador como uma caixa-preta que mapeia um programa fonte para um programa obje
to semanticamente equivalente. Se abrirmos um pouco essa caixa, veremos que existem duas partes nesse mapeamento: análi
se e síntese.
 A parte de análise subdivide o programa fonte em partes constituintes e impõe uma estrutura gramatical sobre elas.
 Depois, usa essa estrutura para criar uma representação intermediária do programa fonte. Se a parte de análise detectar que o
 programa fonte está sintaticamente mal formado ou semanticamente incorreto, então ele precisa oferecer mensagens esclare
cedoras, de modo que o usuário possa tomar a ação corretiva. A parte de análise também coleta informações sobre o programa
 fonte e as armazena em uma estrutura de dados chamada tabela de símbolos, que é passada adiante junto com a representação
 intermediária para a parte de síntese.
 A parte de síntese constrói o programa objeto desejado a partir da representação intermediária e das informações na tabe
la de símbolos. A parte de análise normalmente é chamada de front-end do compilador; a parte de síntese é o back-end.
 Se examinarmos o processo de compilação detalhadamente, veremos que ele é desenvolvido como uma seqüência de
 fases, cada uma transformando uma representação do programa fonte em outra. A Figura 1.6 exibe a decomposição típica 
de um compilador em fases. Na prática, várias fases podem ser agrupadas, e as representações intermediárias entre essas fases
 agrupadas não precisam ser construídas explicitamente. A tabela de símbolos, responsável pelo armazenamento das informa
ções sobre todo o programa fonte, é utilizada por todas as fases do compilador.
 Alguns compiladores possuem uma fase de otimização independente de máquina entre o front-end e o back-end. A fina
lidade dessa fase de otimização é realizar transformações na representação intermediária, de modo que o back-end possa pro
duzir um programa objeto melhor do que teria produzido a partir de uma representação intermediária não otimizada. Como esta
 etapa é opcional, uma das duas fases de otimização mostradas na Figura 1.6 pode ser omitida.
 1.2.1 ANÁLISE LÉXICA
 A primeira fase de um compilador é chamada de análise léxica ou leitura (scanning). O analisador léxico lê o fluxo de
 caracteres que compõem o programa fonte e os agrupa em seqüências significativas, chamadas lexemas. Para cada lexema, o
 analisador léxico produz como saída um token no formato:
 nome-token, valor-atributo
 que ele passa para a fase subseqüente, a análise sintática. Em um token, o primeiro componente, nome-token, é um símbolo
 abstrato que é usado durante a análise sintática, e o segundo componente, valor-atributo, aponta para uma entrada na tabela de
 símbolos referente a esse token. A informação da entrada da tabela de símbolos é necessária para a análise semântica e para a
 geração de código.
4
 COMPILADORES: PRINCÍPIOS, TÉCNICAS E FERRAMENTAS
 fluxo de caracteres
 Analisador Léxico
 fluxo de tokens
 Analisador Sintático
 árvore de sintaxe
 Analisador Semântico
 árvore de sintaxe
 Tabela de Símbolos
 Gerador de Código Intermediário
 representação intermediária
 Otimizador de Código 
Dependente da Máquina
 representação intermediária
 Gerador de Código
 código da máquina alvo
 Otimizador de Código 
Independente de Máquina
 código da máquina alvo
 FIGURA 1.6 Fases de um compilador.
 Por exemplo, suponha que um programa fonte contenha o comando de atribuição
 position = initial + rate * 60
 (1.1)
 Os caracteres nessa atribuição poderiam ser agrupados nos seguintes lexemas e mapeados para os seguintes tokens passados
 ao analisador sintático:
 1.
 2.
 3.
 4.
 5.
 6.
 7.
 position é um lexema mapeado em um token id, 1, onde id é um símbolo abstrato que significa identifica
dor e 1 aponta para a entrada da tabela de símbolos onde se encontra position. A entrada da tabela de símbolos
 para um identificador mantém informações sobre o identificador, como seu nome e tipo.
 O símbolo de atribuição = é um lexema mapeado para o token =. Como esse token não precisa de um valor de atri
buto, omitimos o segundo componente. Poderíamos ter usado qualquer símbolo abstrato, como atribuir para o nome
 do token, mas, por conveniência de notação, escolhemos usar o próprio lexema como nome do símbolo abstrato.
 initial é um lexema mapeado para o token id,2, onde 2 aponta para a entrada da tabela de símbolos onde se
 encontra initial.
 + é um lexema mapeado para o token +.
 rate é um lexema mapeado para o token id,3, onde o valor 3 aponta para a entrada da tabela de símbolos onde
 se encontra rate.
 * é um lexema mapeado para o token *.
 60 é um lexema mapeado para o token 601.
 Os espaços que separam os lexemas são descartados pelo analisador léxico.
 A Figura 1.7 mostra a representação do comando de atribuição (1.1) após a análise léxica como uma seqüência de tokens
 id, 1 = id, 2 + id, 3 * 60
 (1.2)
 1 Tecnicamente falando, para o lexema 60,deveríamos ter um token como número,4, onde o valor 4 aponta para a tabela de símbolos, para a repre
sentação interna do inteiro 60. No Capítulo 2 discutimos sobre a representação dos tokens relacionados aos números. O Capítulo 3 discute a res
peito das técnicas usadas na criação de analisadores léxicos.
 1 Tecnicamente falando, para o lexema 60,deveríamos ter um token como número,4, onde o valor 4 aponta para a tabela de símbolos, para a repre
sentação interna do inteiro 60. No Capítulo 2 discutimos sobre a representação dos tokens relacionados aos números. O Capítulo 3 discute a res
peito das técnicas usadas na criação de analisadores léxicos.
5
 CAPÍTULO 1: INTRODUÇÃO
 CAPÍTULO 1: INTRODUÇÃO
 Nessa representação, os nomes de token =, + e * são símbolos abstratos para os operadores de atribuição, adição e multiplica
ção, respectivamente.
 1.2.2 ANÁLISE SINTÁTICA
 A segunda fase do compilador é a análise sintática. O analisador sintático utiliza os primeiros componentes dos tokens
 produzidos pelo analisador léxico para criar uma representação intermediária tipo árvore, que mostra a estrutura gramatical da
 seqüência de tokens. Uma representação típica é uma árvore de sintaxe em que cada nó interior representa uma operação, e os
 filhos do nó representam os argumentos da operação. Uma árvore de sintaxe para o fluxo de tokens (1.2) aparece como saída
 do analisador sintático da Figura 1.7.
 Essa árvore mostra a ordem em que as operações do comando de atribuição
 position = initial + rate * 60
 deve ser realizada. A árvore possui um nó interior rotulado com *, com id,3 como seu filho da esquerda e o inteiro 60 como
 seu filho da direita. O nó id,3 representa o identificador rate. O nó rotulado com * torna explícito que devemos primeiro
 multiplicar o valor de rate por 60. O nó rotulado com + indica que devemos somar o resultado dessa multiplicação com o
 valor de initial. A raiz da árvore, rotulada com =, indica que devemos armazenar o resultado dessa adição em uma locali
zação associada ao identificador position. Essa ordem das operações é consistente com as convenções normais da aritmé
tica, que nos dizem que a multiplicação tem maior precedência que a adição, e por isso a multiplicação deve ser realizada antes
 da adição.
 position = initial + rate * 60
 Analisador Léxico
 id,1 =>id,2 +>id,3 +>60>
 Analisador Sintático
 =
 id,1
 id,2
 +
 id,3
 *
 60
 Analisador Semântico
 =
 id,1
 position
 initial
 rate
 ...
 ...
 id,2
 +
 id,3
 ...
 *
 inttofloat
 60
 Gerador de Código Intermediário
 TABELA DE SÍMBOLOS
 t1 = inttofloat(60)
 t2 = id3 * t1
 t3 = id2 + t2
 id1 = t3
 Otimizador de Código
 t1 = id3 * 60.0
 id1 = id2 + t1
 Gerador de Código
 LDF  R2, id3
 LDF  R1, id2
 MULF R2, R2, #60.0
 ADDF R1, R1, R2
 STF  idl, R1
6
 COMPILADORES: PRINCÍPIOS, TÉCNICAS E FERRAMENTAS
 FIGURA 1.7 Tradução de uma instrução de atribuição.
 As fases subseqüentes do compilador utilizam a estrutura gramatical para auxiliar na análise do programa fonte e para
 gerar o programa objeto. No Capítulo 4, usaremos as gramáticas livres de contexto para especificar a estrutura gramatical das
 linguagens de programação e discutiremos os algoritmos para a construção automática de analisadores sintáticos eficientes, a
 partir de certas classes de gramáticas. Nos capítulos 2 e 5, veremos que as definições dirigidas por sintaxe podem ajudar a espe
cificar a tradução das construções das linguagens de programação.
 1.2.3 ANÁLISE SEMÂNTICA
 O analisador semântico utiliza a árvore de sintaxe e as informações na tabela de símbolos para verificar a consistência
 semântica do programa fonte com a definição da linguagem. Ele também reúne informações sobre os tipos e as salva na árvo
re de sintaxe ou na tabela de símbolos, para uso subseqüente durante a geração de código intermediário.
 Uma parte importante da análise semântica é a verificação de tipo, em que o compilador verifica se cada operador possui
 operandos compatíveis. Por exemplo, muitas linguagens de programação exigem que um índice de arranjo seja um inteiro, por
tanto o compilador precisa informar um erro de tipo se um número de ponto flutuante for usado para indexar um arranjo.
 A especificação da linguagem pode permitir algumas conversões de tipos chamadas de coerções. Por exemplo, um operador
 aritmético binário pode ser aplicado a um par de inteiros ou a um par de números de ponto flutuante. Se o operador for aplicado a
 um número de ponto flutuante e a um inteiro, o compilador pode converter ou coagir o inteiro para um número de ponto flutuante.
 Essa coerção aparece na Figura 1.7. Suponha que position, initial e rate tenham sido declarados como núme
ros de ponto flutuante, e que o lexema 60 tenha a forma de um inteiro. O verificador de tipos no analisador semântico da Figura
 1.7 descobre que o operador * é aplicado a um número de ponto flutuante rate e a um inteiro 60. Nesse caso, o inteiro pode
 ser convertido em um número de ponto flutuante. Na Figura 1.7, observe que a saída do analisador semântico tem um nó extra
 para o operador inttofloat,o qual converte explicitamente seu argumento inteiro em um número de ponto flutuante. A verifi
cação de tipo e a análise semântica são discutidas no Capítulo 6.
 1.2.4 GERAÇÃO DE CÓDIGO INTERMEDIÁRIO
 No processo de traduzir um programa fonte para um código objeto, um compilador pode produzir uma ou mais represen
tações intermediárias, as quais podem ter diversas formas. As árvores de sintaxe denotam uma forma de representação inter
mediária; elas normalmente são usadas durante as análises sintática e semântica.
 Depois das análises sintática e semântica do programa fonte, muitos compiladores geram uma representação intermediá
ria explícita de baixo nível ou do tipo linguagem de máquina, que podemos imaginar como um programa para uma máquina
 abstrata. Essa representação intermediária deve ter duas propriedades importantes: ser facilmente produzida e ser facilmente
 traduzida para a máquina alvo.
 No Capítulo 6, consideramos uma forma intermediária, chamada código de três endereços, que consiste em uma seqüên
cia de instruções do tipo assembler com três operandos por instrução. Cada operando pode atuar como um registrador. A saída
 do gerador de código intermediário na Figura 1.7 consiste em uma seqüência de instruções ou código de três endereços
 t1 = inttofloat(60)
 t2 = id3 * t1
 t3 = id2 + t2
 id1 = t3
 (1.3)
 Vários pontos precisam ser observados em relação aos códigos de três endereços. Primeiro, cada instrução de atribuição
 de três endereços possui no máximo um operador do lado direito. Assim, essas instruções determinam a ordem em que as ope
rações devem ser realizadas; a multiplicação precede a adição no programa fonte (1.1). Segundo, o compilador precisa gerar
 um nome temporário para guardar o valor computado por uma instrução de três endereços. Terceiro, algumas “instruções de
 três endereços”, como a primeira e última na seqüência (1.3), possuem menos de três operandos.
 No Capítulo 6, apresentamos as principais representações intermediárias usadas nos compiladores. O Capítulo 5 introduz
 as técnicas para a tradução dirigida por sintaxe, que são aplicadas no Capítulo 6 para a verificação de tipo e a geração de códi
go intermediário de construções típicas das linguagens de programação, tais como expressões, construções de fluxo de contro
le e chamadas de procedimento.
 1.2.5 OTIMIZAÇÃO DE CÓDIGO
 A fase de otimização de código independente das arquiteturas de máquina faz algumas transformações no código inter
mediário com o objetivo de produzir um código objeto melhor. Normalmente, melhor significa mais rápido, mas outros obje
tivos podem ser desejados, como um código menor ou um código objeto que consuma menos energia. Por exemplo, um algo
ritmo direto gera o código intermediário (1.3), usando uma instrução para cada um dos operadores da representação de árvore
 produzida pelo analisador semântico.
7
 CAPÍTULO 1: INTRODUÇÃO
 CAPÍTULO 1: INTRODUÇÃO
 Uma boa estratégia para gerar um código aberto é usar um algoritmo simples de geração de código intermediário seguido
 de otimizações . Nesta abordagem, o otimizador pode deduzir que a conversão do valor inteiro 60 para ponto flutuante pode
 ser feita de uma vez por todas durante a compilação, de modo que a operação inttofloat pode ser eliminada do código substi
tuindo-se o inteiro 60 pelo número de ponto flutuante 60.0. Além do mais, t3 é usado apenas uma vez na atribuição de seu
 valor para id1, portanto o otimizador pode eliminá-lo também transformando (1.3) em uma seqüência de código menor
 t1 = id3 * 60.0
 id1 = id2 + t1
 (1.4)
 O número de otimizações de código realizadas por diferentes compiladores varia muito. Aqueles que exploram ao máxi
mo as oportunidades de otimizações são chamados “compiladores otimizadores”. Quanto mais otimizações, mais tempo é gasto
 nessa fase. Mas existem otimizações simples que melhoram significativamente o tempo de execução do programa objeto sem
 atrasar muito a compilação. A partir do Capítulo 8 discutimos em detalhes as otimizações independentes e dependentes da
 arquitetura de máquina.
 1.2.6 GERAÇÃO DE CÓDIGO
 O gerador de código recebe como entrada uma representação intermediária do programa fonte e o mapeia em uma lin
guagem objeto. Se a linguagem objeto for código de máquina de alguma arquitetura, devem-se selecionar os registradores ou
 localizações de memória para cada uma das variáveis usadas pelo programa. Depois, os códigos intermediários são traduzidos
 em seqüências de instruções de máquina que realizam a mesma tarefa. Um aspecto crítico da geração de código está relacio
nado à cuidadosa atribuição dos registradores às variáveis do programa.
 Por exemplo, usando os registradores R1 e R2,o código intermediário em (1.4) poderia ser traduzido para o código de
 máquina
 LDF
 R2,
 id3
 MULF R2, R2, #60.0
 LDF
 R1,
 id2
 ADDF R1, R1, R2
 STF
 id1, R1
 (1.5)
 O primeiro operando de cada uma das instruções especifica um destino. O F em cada uma das instruções nos diz que ela
 manipula números de ponto flutuante. O código em (1.5) carrega o conteúdo do endereço id3 no registrador R2,depois o mul
tiplica pela constante de ponto flutuante 60.0. O # significa que o valor 60.0 deve ser tratado como uma constante imedia
ta. A terceira instrução move id2 para o registrador R1,e a quarta o soma com o valor previamente calculado no registrador
 R2. Finalmente, o valor no registrador R1 é armazenado no endereço de id1, portanto o código mostrado implementa corre
tamente o comando de atribuição (1.1). O Capítulo 8 aborda a geração de código.
 Esta discussão sobre geração de código ignorou a importante questão relativa à alocação de espaço na memória para os
 identificadores do programa fonte. Conforme veremos no Capítulo 7, a organização de memória em tempo de execução depende
 da linguagem sendo compilada. Decisões sobre a alocação de espaço podem ser tomadas em dois momentos: durante a gera
ção de código intermediário ou durante a geração do código.
 1.2.7 GERENCIAMENTO DA TABELA DE SÍMBOLOS
 Uma função essencial de um compilador é registrar os nomes de variáveis usados no programa fonte e coletar informa
ções sobre os diversos atributos de cada nome. Esses atributos podem prover informações sobre o espaço de memória alocado
 para um nome, seu tipo, seu escopo, ou seja, onde seu valor pode ser usado no programa, e, no caso de nomes de procedimen
to, informações sobre a quantidade e os tipos de seus argumentos, o tipo retornado e o método de passagem de cada argumen
to, por exemplo, por valor ou por referência.
 A tabela de símbolos é uma estrutura de dados contendo um registro para cada nome de variável, com campos para os
 atributos do nome. A estrutura de dados deve ser projetada para permitir que o compilador encontre rapidamente o registro para
 cada nome e armazene ou recupere dados desse registro também rapidamente. As tabelas de símbolos são discutidas no
 Capítulo 2.
 1.2.8 O AGRUPAMENTO DE FASES EM PASSOS
 A discussão sobre as fases de um compilador diz respeito à sua organização lógica. Em uma implementação, as atividades
 de várias fases podem ser agrupadas em um passo que lê um arquivo de entrada e o escreve em um arquivo de saída. Por exem
plo, as fases de análise léxica, análise sintática, análise semântica e geração de código intermediário do front-end poderiam ser 
8
 COMPILADORES: PRINCÍPIOS, TÉCNICAS E FERRAMENTAS
 agrupadas em um passo. A fase de otimização do código poderia ser um passo opcional. Depois, poderia haver um passo
 para o back-end, consistindo na geração de código para determinada máquina alvo.
 Algumas famílias de compiladores foram criadas em torno de representações intermediárias cuidadosamente projetadas,
 que permitem que o front-end para determinada linguagem fonte tenha uma interface com o back-end para uma arquitetu
ra específica de máquina alvo. Com essas famílias, podemos produzir compiladores de diferentes linguagens fonte para
 uma determinada máquina alvo, combinando diferentes front-ends com um único back-end para essa máquina alvo. Da
 mesma forma, podemos produzir compiladores para diferentes máquinas alvo, combinando um único front-end com back
ends para diferentes máquinas alvo.
 1.2.9 FERRAMENTAS PARA CONSTRUÇÃO DE COMPILADOR
 O projetista de compilador, como qualquer desenvolvedor de software, pode tirar proveito dos diversos ambientes de
 desenvolvimento de software modernos contendo ferramentas como editores de texto, depuradores, gerenciadores de versão,
 profilers, ferramentas de testes e assim por diante. Além dessas ferramentas gerais de desenvolvimento de software, outras fer
ramentas mais especializadas foram desenvolvidas para auxiliar na programação de diversas fases de um compilador.
 Essas ferramentas utilizam linguagens especializadas para especificar e implementar componentes específicos, e muitas
 usam algoritmos bastante sofisticados. As ferramentas mais bem-sucedidas são aquelas que ocultam os detalhes de seus algo
ritmos e produzem componentes que podem ser facilmente integrados ao restante do compilador. Algumas das ferramentas
 mais utilizadas na construção de compiladores são
 1.
 2.
 3.
 4.
 5.
 6.
 Geradores de analisadores sintáticos, que produzem automaticamente reconhecedores sintáticos a partir de uma des
crição gramatical de uma linguagem de programação.
 Geradores de analisadores léxicos, que produzem analisadores léxicos a partir de uma descrição dos tokens de uma
 linguagem em forma de expressão regular.
 Mecanismos de tradução dirigida por sintaxe, que produzem coleções de rotinas para percorrer uma árvore de deri
vação e gerar código intermediário.
 Geradores de gerador de código, que produzem um gerador de código a partir de uma coleção de regras para tradu
zir cada operação da linguagem intermediária na linguagem de máquina para uma máquina alvo.
 Mecanismos de análise de fluxo de dados, que facilitam a coleta de informações sobre como os valores são transmi
tidos de parte de um programa para cada uma das outras partes. A análise de fluxo de dados é uma ferramenta essen
cial para a otimização do código.
 Conjuntos de ferramentas para a construção de compiladores, que oferecem um conjunto integrado de rotinas para
 a construção das diversas fases de um compilador.
 Descreveremos várias dessas ferramentas no decorrer deste livro.
 1.3 EVOLUÇÃO DAS LINGUAGENS DE PROGRAMAÇÃO
 Os primeiros computadores eletrônicos apareceram na década de 1940 e eram programados em linguagem de máquina
 por seqüências de 0s e 1s que diziam explicitamente ao computador quais operações deveriam ser executadas e em que ordem.
 As operações em si eram de muito baixo nível: mover dados de um local para outro, somar o conteúdo de dois registradores,
 comparar valores e assim por diante. Nem é preciso dizer que esse tipo de programação era lento, cansativo e passível de erros.
 E, uma vez escritos, tais programas eram difíceis de entender e modificar.
 1.3.1 MUDANÇA PARA LINGUAGENS DE ALTO NÍVEL
 O primeiro passo para tornar as linguagens de programação mais inteligíveis às pessoas se deu no início da década de
 1950 com o desenvolvimento das linguagens simbólicas ou assembly. Inicialmente, as instruções em uma linguagem simbóli
ca eram apenas representações mnemônicas das instruções de máquina. Mais tarde, foram acrescentadas instruções de macro
 às linguagens simbólicas, para que um programador pudesse definir abreviaturas parametrizadas para seqüências de instruções
 de máquina usadas com freqüência.
 Um passo importante em direção às linguagens de alto nível foi dado na segunda metade da década de 1950, com o desen
volvimento do Fortran para a computação científica, do Cobol para o processamento de dados comercial, e do Lisp para a com
putação simbólica. A filosofia por trás dessas linguagens era criar construções de alto nível a partir das quais os programado
res poderiam escrever com mais facilidade cálculos numéricos, aplicações comerciais e programas simbólicos. Essas lingua
gens tiveram tanto sucesso que continuam sendo utilizadas até hoje.
 Nas décadas seguintes, foram projetadas muitas linguagens com recursos inovadores para ajudar a tornar a programação
 mais fácil, mais natural e mais poderosa. A seguir, neste capítulo, discutiremos algumas das principais características comuns
 a muitas linguagens de programação modernas.
9
 CAPÍTULO 1: INTRODUÇÃO
 CAPÍTULO 1: INTRODUÇÃO
 Atualmente, existem milhares de linguagens de programação. Elas podem ser classificadas de diversas maneiras. Uma
 classificação diz respeito à sua geração. Linguagens de primeira geração são as linguagens de máquina; de segunda geração
 são as linguagens simbólicas ou de montagem, também conhecidas como assembly; e as de terceira geração são linguagens
 de alto nível, procedimentais, como Fortran, Cobol, Lisp, C, C++, C# e Java. Linguagens de quarta geração são criadas para
 aplicações específicas, por exemplo, a linguagem NOMAD para geração de relatórios, SQL para consultas a banco de dados e
 Postscript para formatação de textos. O termo linguagem de quinta geração tem sido aplicado a linguagens baseadas em lógi
ca com restrição, como Prolog e OPS5.
 Outra classificação utilizada denomina imperativas as linguagens em que um programa especifica como uma computação
 deve ser feita e declarativas as linguagens em que um programa especifica qual computação deve ser feita. Linguagens como
 C, C++, C# e Java são linguagens imperativas. Nas linguagens imperativas, existe a noção de estado do programa e mudança
 do estado provocadas pela execução das instruções. Linguagens funcionais como ML e Haskell, e linguagens de lógica com
 restrição, como Prolog, normalmente são consideradas linguagens declarativas.
 O termo linguagem de von Neumann é aplicado a linguagens de programação cujo modelo computacional se baseia na
 arquitetura de computador de von Neumann. Muitas das linguagens de hoje, como Fortran e C, são linguagens de von
 Neumann.
 Uma linguagem orientada por objeto é aquela que admite a programação orientada por objeto, um estilo de programação
 no qual um programa consiste em uma coleção de objetos que interagem uns com os outros. Simula 67 e Smalltalk são as prin
cipais linguagens orientadas por objeto mais antigas. Linguagens como C++, C#, Java e Ruby são linguagens orientadas por
 objeto mais recentes.
 Linguagens de scripting são linguagens interpretadas com operadores de alto nível projetados para “juntar” computações.
 Essas computações eram originalmente chamadas de scripts. Awk, JavaScript, Perl, PHP, Python, Ruby e Tcl são exemplos
 populares de linguagens de scripting. Programas escritos em linguagens de scripting normalmente são muitos menores do que
 os programas equivalentes escritos em linguagens como C.
 1.3.2 IMPACTOS NOS COMPILADORES
 Como o projeto de linguagens de programação e os compiladores estão intimamente relacionados, os avanços nas lingua
gens de programação impõem novas demandas sobre os projetistas de compiladores. Eles têm de criar algoritmos e representa
ções para traduzir e dar suporte aos novos recursos das linguagens. Desde a década de 1940, as arquiteturas de computadores
 também têm evoluído. Os desenvolvedores de compiladores tiveram não apenas de acompanhar os novos recursos das lingua
gens, mas também de projetar algoritmos de tradução que tirassem o máximo de proveito das novas capacidades do hardware.
 Os compiladores podem ajudar a difundir o uso de linguagens de alto nível, minimizando o custo adicional da execução
 dos programas escritos nessas linguagens. Os compiladores também são responsáveis por efetivar o uso das arquiteturas de
 computador de alto desempenho nas aplicações dos usuários. De fato, o desempenho de um sistema de computação é tão
 dependente da tecnologia de compilação que os compiladores são usados como uma ferramenta na avaliação dos conceitos
 arquitetônicos antes que um computador seja montado.
 O projeto de compiladores é desafiador. Um compilador por si só é um programa grande. Além do mais, muitos sistemas
 de processamento de linguagem modernos tratam de várias linguagens fonte e máquinas alvo dentro de um mesmo arcabouço
 (framework); ou seja, eles servem como famílias de compiladores, possivelmente consistindo em milhões de linhas de código.
 Por conseguinte, boas técnicas de engenharia de software são essenciais para a criação e evolução dos processadores de lin
guagem modernos.
 Um compilador precisa traduzir corretamente um conjunto potencialmente infinito de programas que poderiam ser escri
tos na linguagem fonte. O problema de gerar código objeto ótimo a partir de um programa fonte é, em geral, indecidível; assim,
 os projetistas de compiladores precisam avaliar as escolhas sobre quais problemas enfrentar e quais heurísticas utilizar para
 resolver o problema de gerar um código eficiente.
 Estudar compiladores também é estudar de que forma a teoria encontra a prática, conforme veremos na Seção 1.4.
 A finalidade deste texto é ensinar a metodologia e as idéias fundamentais usadas no projeto de compiladores. Não é nossa
 intenção ensinar todos os algoritmos e técnicas que poderiam ser usados para a criação de um sistema de processamento de lin
guagem de última geração. Porém, os leitores deste texto poderão adquirir o conhecimento básico para entender como imple
mentar um compilador de modo relativamente fácil.
 1.3.3 EXERCÍCIOS DA SEÇÃO 1.3
 Exercício 1.3.1: Indique quais dos seguintes termos:
 a) imperativa 
b) declarativa
 d) orientada por objeto
 g) quarta geração
 e) funcional
 c) von Neumann
 f) terceira geração
 h) de scripting
10
 COMPILADORES: PRINCÍPIOS, TÉCNICAS E FERRAMENTAS
 aplicam-se às seguintes linguagens
 1) C
 6) Lisp
 2) C++
 7) ML
 3) Cobol
 8) Perl
 4) Fortran
 9) Python
 1.4 A CIÊNCIA DA CRIAÇÃO DE UM COMPILADOR
 5) Java
 10) VB.
 O projeto de compilador é repleto de belos exemplos nos quais problemas complicados do mundo real são solucionados
 abstraindo-se matematicamente a essência do problema. Esses exemplos servem como excelentes ilustrações de como as abstra
ções podem ser usadas para solucionar problemas: dado um problema, formule uma abstração matemática que capture suas prin
cipais características e resolva-o usando técnicas matemáticas. A formulação do problema precisa ser baseada em um conheci
mento sólido sobre as características dos programas de computador, e a solução precisa ser validada e refinada empiricamente.
 Um compilador precisa aceitar todos os programas fonte que estão de acordo com a especificação da linguagem; o conjun
to de programas fonte é infinito, e qualquer programa pode ser muito grande, consistindo em possivelmente milhões de linhas
 de código. Qualquer transformação realizada pelo compilador durante a tradução de um programa fonte precisa preservar a
 semântica do programa sendo compilado. Logo, os projetistas de compiladores têm influência não apenas sobre os compilado
res que eles mesmos criam, mas sobre todos os programas que seus compiladores compilam. Essa influência torna a escrita de
 compiladores particularmente recompensadora; porém, também torna desafiador o desenvolvimento de compiladores.
 1.4.1 MODELAGEM NO PROJETO E IMPLEMENTAÇÃO DO COMPILADOR
 O estudo dos compiladores é principalmente um estudo de como projetar os modelos matemáticos certos e escolher cor
retamente os algoritmos, mantendo-se o equilíbrio entre a necessidade de generalização e abrangência versus simplicidade e
 eficiência.
 Entre os modelos mais importantes destacam-se as máquinas de estado finito e expressões regulares, as gramáticas livres
 de contexto e as árvores. As máquinas de estado finito e expressões regulares, que veremos no Capítulo 3, são úteis para des
crever as unidades léxicas dos programas (palavras-chave, identificadores etc.) e os algoritmos usados pelo compilador para
 reconhecer essas unidades. As gramáticas livres de contexto são utilizadas para descrever a estrutura sintática das linguagens
 de programação, como o balanceamento dos parênteses ou construções de controle. Estudaremos as gramáticas no Capítulo 4.
 As árvores são consideradas um importante modelo para representar a estrutura dos programas e sua tradução para código obje
to, conforme veremos no Capítulo 5.
 1.4.2 A CIÊNCIA DA OTIMIZAÇÃO DO CÓDIGO
 O termo “otimização” no projeto de compiladores refere-se às tentativas que um compilador faz para produzir um códi
go que seja mais eficiente do que o código óbvio. “Otimização” é, portanto, um nome errado, pois não é possível garantir que
 um código produzido por um compilador seja tão ou mais rápido do que qualquer outro código que realiza a mesma tarefa.
 A otimização de código vem-se tornando cada vez mais importante e também mais complexa no projeto de um compila
dor. Mais complexa porque as arquiteturas dos processadores se tornaram mais complexas, gerando mais oportunidades de
 melhorar a forma como o código é executado. E mais importante porque os computadores maciçamente paralelos exigem oti
mizações substanciais, ou seu desempenho é afetado por algumas ordens de grandeza. Com a provável predominância de arqui
teturas de máquinas multicore (computadores com chips possuindo maiores quantidades de processadores), os compiladores
 enfrentarão mais um desafio para tirar proveito das máquinas multiprocessadoras.
 É difícil, se não impossível, construir um compilador robusto a partir de “pedaços”. Assim, uma extensa e útil teoria foi
 criada em torno do problema de otimização de código. O uso de uma base matemática rigorosa permite mostrar que uma oti
mização está correta e produz o efeito desejado para todas as entradas possíveis. A partir do Capítulo 9, veremos como os
 modelos baseados em gráficos, matrizes e programas lineares são necessários para auxiliar o compilador a produzir um códi
go “ótimo”.
 Por outro lado, a teoria pura sozinha é insuficiente. Assim, como para muitos problemas do mundo real, não existem res
postas perfeitas. Na verdade, quase todas as perguntas que fazemos a respeito da otimização de compiladores são indecidíveis.
 Uma das habilidades mais importantes no projeto de compiladores é a capacidade de formular corretamente o problema que
 se quer solucionar. Para começar, precisamos de um bom conhecimento do comportamento dos programas, experimentando
os e avaliando-os completamente, a fim de validar nossas intuições.
 As otimizações de um compilador precisam atender os seguintes objetivos de projeto:
 • A otimização precisa ser correta, ou seja, preservar a semântica do programa compilado.
 • A otimização precisa melhorar o desempenho de muitos programas.
 • O tempo de compilação precisa continuar razoável.
 • O esforço de engenharia empregado precisa ser administrável.
11
 CAPÍTULO 1: INTRODUÇÃO
 CAPÍTULO 1: INTRODUÇÃO
 Nunca é demais enfatizar a importância da exatidão. É trivial escrever um compilador que gera código rápido se este códi
go não precisa estar correto! É tão difícil ter compiladores otimizadores corretos que ousamos dizer que nenhum compilador
 otimizador está completamente livre de erros! Assim, o objetivo mais importante no desenvolvimento de um compilador é que
 ele seja correto.
 O segundo objetivo é que o compilador seja eficiente na melhoria do desempenho de muitos programas de entrada.
 Normalmente, desempenho diz respeito à velocidade de execução do programa. Especialmente em aplicações embutidas, tam
bém pode ser necessário diminuir o tamanho do código gerado. E, no caso de dispositivos móveis, também é desejável que o
 código gerado minimize o consumo de energia. Normalmente, as mesmas otimizações que diminuem o tempo de execução
 reduzem também a energia gasta. Além do desempenho, são importantes ainda os aspectos de usabilidade, como relatório de
 erros e depuração.
 Terceiro, precisamos manter o tempo de compilação pequeno para dar suporte a um ciclo rápido de desenvolvimento e
 depuração. Fica mais fácil atender este requisito à medida que as máquinas se tornam mais rápidas. Normalmente, primeiro
 desenvolve-se e depura-se um programa sem otimizações. Usando esta estratégia, não apenas reduz-se o tempo de compilação,
 porém, mais importante, os programas não otimizados se tornam mais fáceis de depurar, pois as otimizações introduzidas por
 um compilador tendem a obscurecer o relacionamento entre o código fonte e o código objeto. A ativação de otimizações no
 compilador às vezes expõe novos problemas no programa fonte; assim, o teste precisa ser novamente realizado no código oti
mizado. A necessidade de teste adicional às vezes desencoraja o uso das otimizações nas aplicações, especialmente se seu
 desempenho não for crítico.
 Finalmente, um compilador é um sistema complexo; temos de manter o sistema simples para garantir que os custos de
 engenharia e manutenção do compilador sejam viáveis. Poderíamos implementar um número infinito de otimizações de pro
grama, e é necessário um esforço incomum para criar uma otimização correta e eficiente. Temos de priorizar as otimizações,
 implementando apenas aquelas que proporcionam maiores benefícios nos programas fonte encontrados na prática.
 Assim, estudando os compiladores, aprendemos não apenas a construir um compilador, mas também a metodologia geral
 para solucionar problemas complexos e problemas abertos. A técnica usada no desenvolvimento de compilador envolve teoria
 e experimentação. Normalmente, começamos formulando o problema com base em nossas intuições sobre quais são os aspec
tos importantes.
 1.5 APLICAÇÕES DA TECNOLOGIA DE COMPILADORES
 O projeto de um compilador não diz respeito apenas a compiladores, e muitas pessoas usam a tecnologia aprendida pelo
 estudo de compiladores na escola, embora nunca tenham, estritamente falando, nem mesmo escrito parte de um compilador
 para uma linguagem de programação conhecida. A tecnologia de compiladores possui também outras aplicações importantes.
 Além do mais, o projeto de um compilador tem impacto em várias outras áreas da ciência da computação. Nesta seção, vere
mos as interações e aplicações mais importantes dessa tecnologia.
 1.5.1 IMPLEMENTAÇÃO DE LINGUAGENS DE PROGRAMAÇÃO DE ALTO NÍVEL
 Uma linguagem de programação de alto nível define uma abstração de programação: o programador escreve um algoritmo
 usando a linguagem, e o compilador deve traduzir esse programa para a linguagem objeto. Em geral, é mais fácil programar
 em linguagens de programação de alto nível, mas elas são menos eficientes, ou seja, os programas objetos são executados mais
 lentamente. Os programadores que usam uma linguagem de baixo nível têm mais controle sobre uma computação e podem, a
 princípio, produzir código mais eficiente. Infelizmente, os programas feitos desta forma são mais difíceis de escrever e – pior
 ainda – menos transportáveis para outras máquinas, mais passíveis de erros e mais difíceis de manter. Os compiladores otimi
zadores dispõem de técnicas para melhorar o desempenho do código gerado, afastando assim a ineficiência introduzida pelas
 abstrações de alto nível.
 EXEMPLO 1.2: A palavra-chave register da linguagem de programação C é um velho exemplo da interação entre a tec
nologia de compiladores e a evolução da linguagem. Quando a linguagem C foi criada em meados da década de 1970, consi
derou-se importante permitir o controle pelo programador de quais variáveis do programa residiam nos registradores. Esse con
trole tornou-se desnecessário quando foram desenvolvidas técnicas eficazes de alocação de registradores, e a maioria dos pro
gramas modernos não usa mais esse recurso da linguagem.
 Na verdade, os programas que usam a palavra-chave register podem perder a eficiência, pois os programadores nor
malmente não são os melhores juízes em questões de muito baixo nível, como a alocação de registradores. A escolha de
 uma boa estratégia para a alocação de registradores depende muito de detalhes específicos de uma arquitetura de máqui
na. Tomar decisões sobre o gerenciamento de recursos de baixo nível, como a alocação de registradores, pode de fato pre
judicar o desempenho, especialmente se o programa for executado em máquinas diferentes daquela para a qual ele foi
 escrito.
12
 COMPILADORES: PRINCÍPIOS, TÉCNICAS E FERRAMENTAS
 A adoção de novas linguagens de programação tem sido na direção daquelas que oferecem maior nível de abstração. Nos
 anos 80, C foi a linguagem de programação de sistemas predominante; muitos dos novos projetos iniciados nos anos 1990 esco
lheram C++; a linguagem Java, introduzida em 1995, rapidamente ganhou popularidade no final da década de 1990. Os novos
 recursos de linguagem de programação introduzidos a cada rodada incentivaram novas pesquisas sobre otimização de compi
lador. A seguir, apresentamos uma visão geral dos principais recursos de linguagens de programação que têm estimulado avan
ços significativos na tecnologia de compilação.
 Praticamente todas as linguagens de programação comuns, incluindo C, Fortran e Cobol, admitem que os usuários definam
 tipos de dados compostos, como arranjo e estruturas, e fluxo de controle de alto nível, como loops e chamadas de procedimen
to. Se simplesmente traduzirmos diretamente para código de máquina cada construção de alto nível ou operação de acesso, o
 resultado será ineficaz. Um conjunto de otimizações, conhecido como otimizações de fluxo de dados,foi desenvolvido para ana
lisar o fluxo de dados de um programa, e remover as redundâncias encontradas nessas construções. Essas otimizações têm-se
 revelado eficazes, e o código gerado se assemelha ao código escrito em um nível mais baixo por um programador habilidoso.
 A orientação por objeto foi introduzida inicialmente na linguagem Simula em 1967, e incorporada em linguagens como
 Smalltalk, C++, C# e Java. As principais idéias por trás da orientação por objeto são
 1.
 2.
 Abstração de dados e
 Herança de propriedades,
 ambas consideradas fundamentais para tornar os programas mais modulares e mais fáceis de manter. Os programas orientados
 por objeto são diferentes daqueles escritos em várias outras linguagens, pois possuem mais, porém menores, procedimentos
 (chamados métodos no contexto da orientação por objeto). Assim, as otimizações presentes no compilador precisam ser efica
zes além dos limites de procedimento do programa fonte. A “expansão em linha” (do inglês, inlining) de procedimento, que
 corresponde à substituição de uma chamada de procedimento pelo seu corpo, é particularmente útil neste contexto. Também
 têm sido desenvolvidas otimizações para agilizar os disparos dos métodos virtuais.
 A linguagem Java possui muitos recursos que tornam a programação mais fácil, e muitos deles foram introduzidos ante
riormente em outras linguagens. A linguagem é segura em termos de tipo; ou seja, um objeto não pode ser usado como um
 objeto de um tipo não relacionado. Todos os acessos a arranjo são verificados para garantir que estejam dentro dos limites do
 arranjo. Java não possui apontadores nem permite aritmética de apontadores. Ela possui uma função primitiva (built-in) para a
 coleta de lixo, a qual libera automaticamente a memória das variáveis que não são mais usadas. Embora todos esses recursos
 facilitem a programação, eles geram um custo adicional no tempo de execução. Foram desenvolvidas otimizações no compi
lador para reduzir esse custo adicional, por exemplo, eliminando verificações de limites desnecessárias e alocando na pilha, ao
 invés de na heap, os objetos que não são acessíveis fora de um procedimento. Algoritmos eficientes também foram desenvol
vidos para reduzir o custo adicional atribuído à coleta de lixo.
 Além disso, a linguagem Java é projetada para prover código transportável e móvel. Os programas são distribuídos
 como bytecode Java, que precisa ser interpretado ou compilado para o código nativo dinamicamente, ou seja, em tempo
 de execução. A compilação dinâmica também tem sido estudada em outros contextos, nos quais a informação é extraída
 dinamicamente em tempo de execução e usada para produzir um código mais otimizado. Na otimização dinâmica, é impor
tante minimizar o tempo de compilação, pois ele faz parte do custo adicional da execução. Uma técnica muito utilizada é
 compilar e otimizar apenas as partes do programa que serão executadas com mais freqüência.
 1.5.2 OTIMIZAÇÕES PARA ARQUITETURAS DE COMPUTADOR
 A rápida evolução das arquiteturas de computador também gerou uma demanda insaciável por novas técnicas de compi
lação. Quase todos os sistemas de alto desempenho tiram proveito de duas técnicas básicas: o paralelismo e as hierarquias de
 memória. O paralelismo pode ser encontrado em diversos níveis: em nível de instrução, onde várias operações são executadas
 simultaneamente; e em nível de processador, onde diferentes threads da mesma aplicação são executadas em diferentes pro
cessadores. As hierarquias de memória são uma resposta à limitação básica de que podemos construir um dispositivo de arma
zenamento muito rápido ou muito grande, mas não um dispositivo de armazenamento que seja tanto rápido quanto grande.
 Paralelismo
 Todos os microprocessadores modernos exploram o paralelismo em nível de instrução. No entanto, esse paralelismo pode
 não ser visível ao programador. Os programas são escritos como se todas as instruções fossem executadas seqüencialmente; o
 hardware verifica dinamicamente se há dependências no fluxo seqüencial das instruções e, quando possível, as emite em para
lelo. Em alguns casos, a máquina inclui no hardware um escalonador que pode alterar a ordem das instruções para aumentar
 o paralelismo do programa. Independentemente de o hardware reordenar as instruções ou não, os compiladores podem rear
ranjá-las para tornar mais eficiente o paralelismo em nível de instrução.
 O paralelismo em nível de instrução também pode aparecer explicitamente no conjunto de instruções. Máquinas VLIW
 (Very Long Instruction Word) possuem instruções que podem emitir várias operações em paralelo. A máquina Intel IA64 é um
 exemplo bem conhecido desse tipo de arquitetura. Todos os microprocessadores de alto desempenho de uso geral também
13
 CAPÍTULO 1: INTRODUÇÃO
 CAPÍTULO 1: INTRODUÇÃO
 incluem instruções que podem operar sobre um vetor de dados ao mesmo tempo. Técnicas de compiladores têm sido desen
volvidas para gerar automaticamente código para essas máquinas a partir de programas seqüenciais.
 Os multiprocessadores também se tornaram predominantes; até mesmo os computadores pessoais normalmente possuem
 múltiplos processadores. Os programadores podem escrever código multithreaded para multiprocessadores, ou o código para
lelo pode ser gerado automaticamente por um compilador a partir de programas seqüenciais convencionais. Esse compilador
 esconde dos programadores os detalhes para localizar o paralelismo em um programa, distribuindo a computação pela máqui
na e minimizando a sincronização e a comunicação entre os processadores. Muitas aplicações de computação científica e enge
nharia fazem cálculos intensivos e podem beneficiar-se muito com o processamento paralelo. Técnicas de paralelismo têm sido
 desenvolvidas para traduzir automaticamente os programas científicos seqüenciais em código multiprocessável.
 Hierarquias de memória
 Uma hierarquia de memória consiste em vários níveis de armazenamento com diferentes velocidades e tamanhos, com o
 nível mais próximo do processador sendo o mais rápido, porém o menor. O tempo médio de acesso à memória de um progra
ma é reduzido se a maior parte dos seus acessos for satisfeita pelos níveis mais rápidos da hierarquia. Tanto o paralelismo quan
to a existência de uma hierarquia de memória melhoram o desempenho potencial de uma máquina, mas ambos precisam ser
 utilizados de modo eficaz pelo compilador, a fim de oferecer um desempenho real em uma aplicação.
 As hierarquias de memória são encontradas em todas as máquinas. Um processador normalmente possui uma pequena
 quantidade de registradores consistindo em centenas de bytes, vários níveis de caches contendo kilobytes a megabytes, memó
ria física contendo de megabytes a gigabytes, e finalmente uma memória secundária que contém gigabytes. Desta forma, a
 velocidade dos acessos entre os níveis adjacentes da hierarquia de memória pode diferir entre duas ou três ordens de grande
za. O desempenho de um sistema normalmente é limitado não pela velocidade do processador, mas pelo desempenho do sub
sistema de memória. Embora os compiladores tradicionalmente focalizem a otimização da execução do processador, a ênfase
 maior agora está em tornar a hierarquia de memória mais eficiente.
 O uso eficaz dos registradores provavelmente é o problema mais importante na otimização de um programa. Ao contrá
rio dos registradores que precisam ser gerenciados explicitamente no software, os caches e as memórias físicas não são visí
veis no conjunto de instruções e, portanto são gerenciados pelo hardware. Descobriu-se que as políticas de gerenciamento de
 cache implementadas pelo hardware não são eficientes em alguns casos, especialmente em códigos científicos que possuem
 grandes estruturas de dados (normalmente, arranjos). É possível melhorar a eficácia da hierarquia de memória alterando o
 leiaute dos dados, ou alterando a ordem das instruções que acessam os dados. Também podemos alterar o leiaute do código
 para melhorar a eficácia dos caches de instrução.
 1.5.3 PROJETO DE NOVAS ARQUITETURAS DE COMPUTADOR
 Nos primeiros projetos de arquiteturas de computadores, os compiladores só eram desenvolvidos após a construção das
 máquinas. Mas isso mudou. Como o usual é programar em linguagens de alto nível, o desempenho de um sistema de compu
tação é determinado não somente por sua inerente velocidade, mas também pela forma como os compiladores podem explorar
 seus recursos. Assim, no desenvolvimento de arquiteturas de computadores modernas, os compiladores são desenvolvidos no
 estágio de projeto do processador, e o código compilado, executando em simuladores, é usado para avaliar os recursos arqui
tetônicos propostos.
 RISC
 Um dos exemplos mais conhecidos de como os compiladores influenciaram o projeto da arquitetura de computador foi a
 invenção da arquitetura RISC (Reduced Instruction-Set Computer – computador com um conjunto reduzido de instruções).
 Antes dessa invenção, a tendência era desenvolver gradativamente conjuntos de instruções cada vez mais complexos, com o
 objetivo de tornar a programação assembler mais fácil; essas arquiteturas eram conhecidas como CISC (Complex Instruction
Set Computer – computador com um conjunto de instruções complexas). Por exemplo, os conjuntos de instruções CISC
 incluem modos de endereçamento de memória complexos para dar suporte aos acessos a estruturas de dados e instruções de
 chamada de procedimento que salvam registradores e passam parâmetros na pilha.
 Otimizações de compiladores normalmente podem reduzir essas instruções a um pequeno número de operações mais sim
ples, eliminando as redundâncias das instruções complexas. Assim, é desejável construir conjuntos de instruções simples; os
 compiladores podem usá-las de forma mais eficiente e torna-se mais fácil otimizar o hardware.
 A maioria das arquiteturas de processadores de uso geral, incluindo PowerPC, SPARC, MIPS, Alpha e PA-RISC, é basea
da no conceito de RISC. Embora a arquitetura x86 – o microprocessador mais popular – possua um conjunto de instruções
 CISC, muitas das idéias desenvolvidas para máquinas RISC são usadas nas implementações do próprio processador. Além
 disso, o modo mais eficiente de usar uma máquina x86 de alto desempenho é usar apenas suas instruções mais simples.
 Arquiteturas especializadas
 Durante as três últimas décadas, foram propostos muitos conceitos arquitetônicos. Eles incluem máquinas de fluxo de
 dados, máquinas de vetor, máquinas VLIW (Very Long Instruction Word – palavra de instrução muito longa), arranjos de pro
14
 COMPILADORES: PRINCÍPIOS, TÉCNICAS E FERRAMENTAS
 cessadores SIMD (Single Instruction, Multiple Data – única instrução, múltiplos dados), arranjos sistólicos, multiprocessado
res com memória compartilhada e multiprocessadores com memória distribuída. O desenvolvimento de cada um desses con
ceitos arquitetônicos foi acompanhado pela pesquisa e desenvolvimento de novas tecnologias de compilação.
 Algumas dessas idéias deram origem aos projetos de máquinas embutidas. Uma vez que sistemas inteiros podem
 caber em um único chip, os processadores não precisam mais ser unidades tipo produto pré-empacotado, mas podem ser
 feitos sob medida para melhorar a relação custo-benefício de determinada aplicação. Assim, ao contrário dos processado
res de uso geral, nos quais as economias de escala levaram à convergência das arquiteturas de computador, os processadores
 de aplicações específicas apresentam uma diversidade de arquiteturas de computador. A tecnologia de compiladores é neces
sária não apenas para dar suporte à programação para essas arquiteturas, mas também para avaliar os projetos arquitetônicos
 propostos.
 1.5.4 TRADUÇÕES DE PROGRAMA
 Embora normalmente pensemos na compilação como uma tradução de uma linguagem de alto nível para o nível de
 máquina, a mesma tecnologia pode ser aplicada para traduzir entre diferentes tipos de linguagens. A seguir são apresentadas
 algumas aplicações importantes das técnicas de tradução de programa.
 Tradução binária
 A tecnologia de compiladores pode ser usada para traduzir o código binário de uma máquina para o de outra, permitindo
 que uma máquina execute programas compilados originalmente para outro conjunto de instruções. A tecnologia de tradução
 binária tem sido usada por diversas empresas de computadores para aumentar a disponibilidade do software para suas máqui
nas. Em particular, devido ao domínio do mercado de computadores pessoais x86, a maior parte dos títulos de software está
 disponível como código x86. Tradutores binários têm sido desenvolvidos para converter o código x86 em código Alpha e Sparc.
 A tradução binária também foi usada pela Transmeta Inc. em sua implementação do conjunto de instruções x86. Em vez de
 executar este complexo conjunto de instruções diretamente no hardware, o processador Transmeta Crusoe é um processador
 VLIW que usa a tradução binária para converter o código x86 em código VLIW nativo.
 A tradução binária também pode ser usada para prover compatibilidade para trás (backward compatibility). Por exemplo,
 quando o processador Motorola MC 68040 foi substituído pelo PowerPC no Apple Macintosh em 1994, usou-se a tradução
 binária para permitir que os processadores PowerPC executassem o código legado do MC 68040.
 Síntese de hardware
 Assim como a maioria do software é escrita em linguagens de programação de alto nível, os projetos de hardware tam
bém o são. Estes são especificados principalmente em linguagens de descrição de arquitetura de alto nível, como, por
 exemplo, Verilog e VHDL (Very high-speed integrated circuit Hardware Description Language – linguagem de descrição
 de hardware para circuito integrado de altíssima velocidade). Os projetos de hardware são tipicamente descritos em RTL
 (Register Transfer Level), onde as variáveis representam registradores e as expressões representam lógica combinatória.
 Ferramentas de síntese de hardware traduzem automaticamente descrições RTL para portas, que são então mapeadas para
 transistores e eventualmente para um leiaute físico. Diferentemente dos compiladores para linguagens de programação,
 essas ferramentas normalmente gastam horas otimizando o circuito. Também existem técnicas para traduzir projetos em
 níveis mais altos, como o nível de comportamento ou funcional.
 Interpretadores de consulta de banco de dados
 Além de especificar software e hardware, as linguagens de programação são úteis em muitas outras aplicações. Por exem
plo, as linguagens de consulta, especialmente SQL (Structured Query Language – linguagem de consulta estruturada), são usa
das para pesquisas em bancos de dados. As consultas em banco de dados consistem em predicados contendo operadores rela
cionais e boolianos, os quais podem ser interpretados ou compilados para comandos que consultam registros de um banco de
 dados satisfazendo esse predicado.
 Simulação compilada
 Simulação é uma técnica geral utilizada em muitas disciplinas científicas e de engenharia para compreender um fenôme
no ou validar um projeto. As entradas de um simulador usualmente incluem a descrição do projeto e parâmetros de entrada
 específicos para que uma simulação em particular execute. As simulações podem ser muito dispendiosas. Normalmente, pre
cisamos simular muitas das possíveis alternativas de projeto em vários conjuntos de entrada diferentes, e cada experimento
 pode levar dias para ser concluído em uma máquina de alto desempenho. Em vez de escrever um simulador que interprete o
 projeto, é mais rápido compilar o projeto para produzir código de máquina que simula esse projeto em particular nativamente.
 A simulação compilada pode ser executada muitas vezes mais rapidamente do que uma abordagem interpretada. A simulação
 compilada é usada em muitas ferramentas de última geração que simulam projetos escritos em Verilog ou VHDL.
15
 CAPÍTULO 1: INTRODUÇÃO
 CAPÍTULO 1: INTRODUÇÃO
 1.5.5 FERRAMENTAS DE PRODUTIVIDADE DE SOFTWARE
 Os programas são comprovadamente os artefatos de engenharia mais complicados já produzidos; eles consistem em mui
tos e muitos detalhes, cada um devendo estar correto antes que o programa funcione completamente. Como resultado, os erros
 são como rompantes nos programas; eles podem arruinar um sistema, produzir resultados errados, tornar um sistema vulnerá
vel a ataques de segurança, ou, ainda, levar a falhas catastróficas em sistemas críticos. O teste é a principal técnica para loca
lizar erros nos programas.
 Uma técnica complementar interessante e promissora é usar a análise de fluxo de dados para localizar erros estaticamen
te, ou seja, antes que o programa seja executado. A análise de fluxo de dados pode localizar erros em todos os caminhos de
 execução possíveis, e não apenas aqueles exercidos pelos conjuntos de dados de entrada, como no caso do teste do programa.
 Muitas das técnicas de análise de fluxo de dados, originalmente desenvolvidas para otimizações de compilador, podem ser usa
das para criar ferramentas que auxiliam os programadores em suas tarefas de engenharia de software.
 O problema de localizar todos os erros de um programa é indeciso. Uma ferramenta para a análise de fluxo de dados pode
 ser criada para avisar aos programadores sobre todas as instruções que podem infringir determinada categoria de erros. Mas,
 se a maioria desses avisos forem alarmes falsos, os usuários não usarão a ferramenta. Assim, os detectores de erro práticos nor
malmente não são seguros nem completos. Ou seja, eles podem não encontrar todos os erros no programa, e não há garantias
 de que todos os erros relatados sejam erros reais. Apesar disso, diversas análises estáticas têm sido desenvolvidas e considera
das eficazes na localização de erros, tais como tentativas de acessos via apontadores nulos ou liberados, nos programas reais.
 O fato de os detectores de erro poderem ser inseguros os torna significativamente diferentes das otimizações de compiladores.
 Os otimizadores de código precisam ser conservadores e não podem alterar a semântica do programa sob circunstância algu
ma.
 No fim desta seção, mencionaremos diversas maneiras pelas quais a análise do programa, baseada nas técnicas desenvol
vidas originalmente para otimizar o código nos compiladores, melhorou a produtividade do software. Técnicas que detectam
 estaticamente quando um programa pode ter uma vulnerabilidade de segurança são de especial importância.
 Verificação de tipos
 A verificação de tipos é uma técnica eficaz e bastante estabelecida para identificar inconsistências nos programas. Ela
 pode ser usada para detectar erros, por exemplo, quando uma operação é aplicada ao tipo errado de objeto, ou se os parâme
tros passados a um procedimento não casam com a assinatura do procedimento. A análise do programa pode ir além de encon
trar erros de tipo, analisando o fluxo de dados ao longo de um programa. Por exemplo, se for atribuído um valor null ao apon
tador e depois ele for imediatamente utilizado para acesso, o programa conterá claramente um erro.
 A mesma abordagem pode ser usada para identificar diversas brechas na segurança, em que um invasor fornece uma
 cadeia de caracteres ou outro dado que seja usado descuidadamente pelo programa. Uma cadeia de caracteres fornecida pelo
 usuário pode ser rotulada com um tipo “perigoso”. Se essa cadeia de caracteres não tiver o formato correto verificado, ela per
manece “perigosa”, e, se uma cadeia de caracteres desse tipo for capaz de influenciar o fluxo de controle do código em algum
 ponto no programa, então existe uma falha de segurança potencial.
 Verificação de limites
 É mais fácil cometer erros ao programar em uma linguagem de baixo nível do que em uma linguagem de alto nível. Por
 exemplo, muitas brechas de segurança nos sistemas são causadas por estouros do buffer em programas escritos na linguagem
 C. Como C não possui verificação de limites de arranjos, fica a critério do usuário garantir que os arranjos não sejam acessa
dos fora dos limites. Deixando de verificar se os dados fornecidos pelo usuário podem estourar um buffer, o programa pode ser
 enganado e armazenar dados do usuário fora do buffer. Um invasor pode manipular dados de entrada que causem um compor
tamento errôneo no programa e comprometer a segurança do sistema. Foram desenvolvidas técnicas para encontrar estouros
 de buffer nos programas, mas com um sucesso limitado.
 Se o programa tivesse sido escrito em uma linguagem segura, que inclui verificação automática de limites de arranjo, esse
 problema não teria ocorrido. A mesma análise de fluxo de dados usada para eliminar verificações de limites redundantes tam
bém pode ser utilizada para localizar estouros de buffer. No entanto, a principal diferença é que deixar de eliminar uma verifi
cação de limites só resulta em um pequeno custo em tempo de execução, enquanto deixar de identificar um estouro de buffer
 potencial pode comprometer a segurança do sistema. Assim, embora seja adequado usar técnicas simples para otimizar as veri
ficações de limites, para conseguir resultados de alta qualidade nas ferramentas de detecção de erros são necessárias análises
 sofisticadas, tais como o rastreamento dos valores de apontadores entre procedimentos
 Ferramentas de gerenciamento de memória
 A coleta de lixo é outro exemplo excelente de compromisso entre a eficiência e uma combinação de facilidade de progra
mação e confiabilidade de software. O gerenciamento automático da memória suprime todos os erros de gerenciamento de
 memória (por exemplo, “vazamento de memória”), que são uma grande fonte de problemas nos programas em C e C++.
 Diversas ferramentas foram desenvolvidas para auxiliar os programadores a encontrar erros de gerenciamento de memória. Por
16
 COMPILADORES: PRINCÍPIOS, TÉCNICAS E FERRAMENTAS
 exemplo, Purify é uma ferramenta muito utilizada para detectar erros de gerenciamento de memória dinamicamente, à medida
 que acontecem. Também foram desenvolvidas ferramentas que ajudam a identificar alguns desses problemas estaticamente.
 1.6 FUNDAMENTOS DA LINGUAGEM DE PROGRAMAÇÃO
 Nesta seção, discutiremos a terminologia e as diferenças mais importantes que aparecem no estudo das linguagens de pro
gramação. Não é nossa intenção abordar todos os conceitos ou todas as linguagens de programação populares. Consideraremos
 que o leitor domina pelo menos uma dentre C, C++, C# ou Java, e pode ter visto outras linguagens também.
 1.6.1 A DIFERENÇA ENTRE ESTÁTICO E DINÂMICO
 Um dos aspectos mais importantes ao projetar um compilador para uma linguagem diz respeito às decisões que o compi
lador pode tomar sobre um programa. Se uma linguagem utiliza uma política que permite ao compilador decidir a respeito de
 uma questão, dizemos que a linguagem usa uma política estática ou que a questão pode ser decidida em tempo de compilação.
 Por outro lado, uma política que só permite que uma decisão seja tomada quando executamos o programa é considerada uma
 política dinâmica, ou que exige decisão em tempo de execução.
 Uma questão na qual nos concentraremos é o escopo das declarações. O escopo de uma declaração de x é a região do pro
grama em que os usos de x se referem a essa declaração. Uma linguagem usa escopo estático ou escopo léxico se for possível
 determinar o escopo de uma declaração examinando-se apenas o programa. Caso contrário, a linguagem utiliza escopo dinâ
mico. Com o escopo dinâmico, enquanto o programa é executado, o mesmo uso de x poderia referir-se a qualquer uma dentre
 as várias declarações diferentes de x.
 A maioria das linguagens, como C e Java, utiliza escopo estático. Discutiremos sobre escopo estático na Seção 1.6.3.
 EXEMPLO 1.3: Como outro exemplo da distinção entre estático e dinâmico, considere o uso do termo static aplicado aos
 dados em uma declaração de classe Java. Em Java, uma variável é um nome que designa uma localização de memória usada
 para armazenar o valor de um dado. Neste contexto, static refere-se não ao escopo da variável, mas sim à capacidade de o com
pilador determinar a localização na memória onde a variável declarada pode ser encontrada. Uma declaração como
 public static int x;
 torna x uma variável de classe e diz que existe apenas uma única cópia de x, não importa quantos objetos dessa classe sejam
 criados. Além disso, o compilador pode determinar uma localização na memória onde esse inteiro x será mantido. Ao contrá
rio, se “static” fosse omitido dessa declaração, cada objeto da classe teria sua própria localização onde x seria mantido, e o
 compilador não poderia determinar todos esses lugares antes da execução do programa.
 1.6.2 AMBIENTES E ESTADOS
 Outra distinção importante que precisamos fazer ao discutir linguagens de programação é se as mudanças que ocorrem
 enquanto o programa é executado afetam os valores dos elementos de dados ou afetam a interpretação dos nomes para esses
 dados. Por exemplo, a execução de uma atribuição como x = y + 1 muda o valor denotado pelo nome x. Mais especifica
mente, a atribuição muda o valor em alguma localização designada para x.
 Pode não ser tão claro que a localização denotada por x pode mudar durante a execução. Por exemplo, conforme discuti
mos no Exemplo 1.3, se x não for uma variável (ou “classe”) estática, cada objeto da classe tem sua própria localização para
 uma instância da variável x. Nesse caso, a atribuição para x pode mudar qualquer uma dessas variáveis de “instância”, depen
dendo do objeto ao qual é aplicado um método contendo essa atribuição.
 A associação dos nomes às localizações na memória (o armazenamento) e depois aos valores pode ser descrita por dois
 mapeamentos que mudam à medida que o programa é executado (ver Figura 1.8):
 1.
 2.
 O ambiente é um mapeamento de um nome para uma posição de memória. Como as variáveis se referem a localiza
ções (“valores-l” ou “valores à esquerda”, do inglês left-value, na terminologia da linguagem C), poderíamos como
 alternativa definir um ambiente como um mapeamento entre nomes e variáveis.
 O estado é um mapeamento de uma posição de memória ao valor que ela contém. Ou seja, o estado mapeia os “valo
res-l” aos “valores-r” (“valores à direita”, do inglês right-value, na terminologia da linguagem C) correspondentes.
 ambiente
 estado
 nomes
 locais
 (variáveis)
 valores
 FIGURA 1.8 Mapeamento em dois estágios entre nomes e valores.
17
 CAPÍTULO 1: INTRODUÇÃO
 Os ambientes mudam de acordo com as regras de escopo de uma linguagem.
 EXEMPLO 1.4: Considere o fragmento de programa em C que aparece na Figura 1.9. O inteiro i é declarado como uma
 variável global, e também é declarado como uma variável local à função f. Quando f está sendo executada, o ambiente se ajusta
 de modo que i se refira à localização reservada para i que é local a f,e qualquer uso de i, como a atribuição i = 3 mostrada
 explicitamente, se refira a essa localização. Normalmente, a variável local i é armazenada em uma localização na pilha em
 tempo de execução.
 int i; 
...
 void f(...) {
 int i; 
...
 i = 3; 
...
 }
 ...
 x = i + 1; 
/* i global */
 /* i local */
 /* uso do i local */
 /* uso do i global */
 FIGURA 1.9 Duas declarações do nome i.
 Sempre que uma função g diferente de f estiver sendo executada, os usos de i não poderão referir-se ao i que é local a f.
 Os usos do nome i em g precisam estar dentro do escopo de alguma outra declaração de i. Um exemplo é a instrução x = i+1
 mostrada explicitamente, e que está dentro de algum procedimento cuja definição não é exibida. Presume-se que o i em i + 1
 se refira ao i global. Assim como na maioria das linguagens, as declarações em C precisam preceder seu uso, de modo que uma
 função que vem antes do i global não pode referir-se a ele.
 O ambiente e os mapeamentos de estado na Figura 1.8 são dinâmicos, mas existem algumas exceções:
 1. Vínculo estático versus dinâmico dos nomes para as localizações. A maior parte do vínculo dos nomes para as locali
zações é dinâmica, e discutiremos várias abordagens para esse tipo de vínculo no decorrer da seção. Algumas declara
ções, como o i global da Figura 1.9, podem ser colocadas em uma localização de memória definitivamente, enquanto
 o compilador gera o código objeto.2
 2. Vínculo estático versus dinâmico das localizações para os valores. O vínculo de localizações para valores (ver segun
do estágio da Figura 1.8) geralmente também é dinâmico, pois não sabemos qual é o valor em uma localização até que
 o programa seja executado. As constantes declaradas são exceções à regra. Por exemplo, a definição na linguagem C,
 #define ARRAYSIZE 1000
 Nomes, identificadores e variáveis
 Embora os termos “nome” e “variável” normalmente se refiram à mesma coisa, vamos usá-los cuidadosamente para
 distinguir entre os nomes usados em tempo de compilação e as localizações em tempo de execução denotadas pelos nomes.
 Um identificador é uma cadeia de caracteres, normalmente letras ou dígitos, que se refere a (identifica) uma entida
de, como um objeto de dados, um procedimento, uma classe ou um tipo. Todos os identificadores são nomes, mas nem
 todos os nomes são identificadores. Os nomes também podem ser expressões. Por exemplo, o nome x.y poderia designar
 o campo y de uma estrutura representada por x. Neste contexto, x e y são identificadores, enquanto x.y é um nome, mas não
 um identificador. Nomes compostos como x.y são chamados de nomes qualificados.
 Uma variável refere-se a um endereço particular de memória. É comum que o mesmo identificador seja declarado mais
 de uma vez, sendo que cada declaração introduz uma nova variável. Mesmo que cada identificador seja declarado apenas uma
 vez, um identificador local a um procedimento recursivo continuará referindo-se a diferentes endereços de memória em dife
rentes momentos.
 2 Tecnicamente, o compilador C atribuirá um endereço na memória virtual para o i global, deixando para o carregador e para o sistema operacional
 determinar onde i estará localizado na memória física da máquina. No entanto, não devemos ficar preocupados com questões de “relocação” como
 estas, que não causam impacto na compilação. Em vez disso, vamos tratar o espaço de endereços que o compilador usa para o seu código de saída
 como se fosse localizações da memória física.
 2 Tecnicamente, o compilador C atribuirá um endereço na memória virtual para o i global, deixando para o carregador e para o sistema operacional
 determinar onde i estará localizado na memória física da máquina. No entanto, não devemos ficar preocupados com questões de “relocação” como
 estas, que não causam impacto na compilação. Em vez disso, vamos tratar o espaço de endereços que o compilador usa para o seu código de saída
 como se fosse localizações da memória física.
18
 COMPILADORES: PRINCÍPIOS, TÉCNICAS E FERRAMENTAS
 vincula estaticamente o nome ARRAYSIZE ao valor 1000. Podemos determinar esse vínculo examinando o comando,
 e sabemos que é impossível que esse vínculo mude quando o programa for executado.
 1.6.3 ESCOPO ESTÁTICO E ESTRUTURA DE BLOCOS
 A maioria das linguagens, incluindo C e sua família, utiliza escopo estático. As regras de escopo para C são baseadas na
 estrutura do programa; o escopo de uma declaração é determinado implicitamente pelo local onde a declaração aparece no pro
grama. Outras linguagens mais modernas, como C++, Java e C#, também oferecem controle explícito sobre escopos, por meio
 de palavras-chave como public, private e protected.
 Nesta seção, consideramos as regras de escopo estático para uma linguagem com blocos, onde um bloco é um agrupa
mento de declarações e comandos. C utiliza chaves { e } para delimitar um bloco; o uso alternativo de begin e end para a
 mesma finalidade teve origem na linguagem Algol.
 EXEMPLO 1.5: Para uma primeira visão, a política de escopo estático de C é a seguinte:
 1. Um programa C consiste em uma seqüência de declarações globais (top-level) de variáveis e funções.
 2. As funções podem conter declarações de variável; estas variáveis incluem as variáveis locais e parâmetros. O escopo
 de cada declaração desse tipo é restrito à função em que ela aparece.
 Procedimentos, funções e métodos
 Para evitar dizer “procedimentos, funções ou métodos” toda vez que quisermos falar sobre um subprograma que pode
 ser chamado, normalmente nos referimos a todos eles como “procedimentos”. A exceção é que, quando se fala explicita
mente de programas em linguagens como C, que só possuem funções, nos referimos a eles como “funções”. Ou, se esti
vermos discutindo sobre uma linguagem como Java, que possui apenas métodos, também usamos esse termo.
 Uma função geralmente retorna um valor de algum tipo (o “tipo de retorno”), enquanto um procedimento não retor
na nenhum valor. A linguagem C e outras semelhantes, que possuem apenas funções, tratam os procedimentos como fun
ções, mas com um tipo de retorno especial “void”, que significa nenhum valor de retorno. As linguagens orientadas por
 objeto, como Java e C++, utilizam o termo “métodos”. Estes podem comportar-se como funções ou procedimentos, mas
 estão associados a uma classe em particular.
 3. O escopo de uma declaração global de um nome x consiste de todo o programa que se segue, com a exceção dos
 comandos que estão dentro de uma função que também possui uma declaração de x.
 O detalhe adicional em relação à política de escopo estático de C trata de declarações de variável dentro de comandos.
 Examinamos essas declarações em seguida e no Exemplo 1.6.
 Em C, a sintaxe dos blocos é dada por:
 1.
 2.
 Bloco é um tipo de comando. Os blocos podem aparecer em qualquer lugar em que outros tipos de comandos (como
 os comandos de atribuição) podem aparecer.
 Um bloco é uma seqüência de declarações seguida por uma seqüência de comandos, todos entre chaves.
 Observe que essa sintaxe permite que os blocos sejam aninhados um dentro do outro. Essa propriedade de encaixamento
 é chamada de estrutura de bloco. A família de linguagens C possui estrutura de bloco, exceto pelo fato de que uma função não
 pode ser definida dentro de outra função.
 Dizemos que uma declaração D “pertence” a um bloco B se B for o bloco aninhado mais próximo contendo D; ou seja,
 Destá localizada dentro de B, mas não dentro de qualquer bloco que esteja aninhado dentro de B.
 A regra de escopo estático para declarações de variável em uma linguagem com estrutura de bloco é a seguinte: se a decla
ração D do nome x pertence ao bloco B, então o escopo de D é todo o B,exceto por quaisquer blocos B’ aninhados em qual
quer profundidade dentro de B, em que x é redeclarado. Aqui, x é redeclarado em B’ se alguma outra declaração D’ com o
 mesmo nome x pertencer a B’.
 Uma forma equivalente de expressar essa regra é focar um uso de um nome x. Considere que B1,B2,..., Bk sejam todos os
 blocos que envolvem esse uso de x, com Bk sendo o menor, aninhado dentro de Bk-1, que está aninhado dentro de Bk-2,e assim
 por diante. Procure o maior i de modo que haja uma declaração de x pertencente a Bi. Esse uso de x refere-se à declaração Bi.
 Alternativamente, esse uso de x está dentro do escopo da declaração em Bi.
19
 CAPÍTULO 1: INTRODUÇÃO
 CAPÍTULO 1: INTRODUÇÃO
 main () {
 int a = 1;
 int b = 1;
 {
 int b = 2;
 {
 int a = 3;
 cout << a << b;
 }
 {
 int b = 4;
 cout << a << b;
 }
 cout << a << b;
 }
 cout << a << b;
 }
 FIGURA 1.10 Blocos em um programa C++.
 B1
 B2
 B3
 B4
 EXEMPLO 1.6: O programa C++ na Figura 1.10 tem quatro blocos, com várias definições das variáveis a e b. Para facili
tar, cada declaração inicia a sua variável com o número do bloco ao qual ela pertence.
 Por exemplo, considere a declaração int a = 1 no bloco B1. Seu escopo é todo o B1,exceto por aqueles blocos ani
nhados (talvez profundamente) dentro de B1 que têm sua própria declaração de a. B2, aninhado imediatamente dentro de B1,
 não possui uma declaração de a, mas B3 possui. B4 não possui uma declaração de a, de modo que o bloco B3 é o único local
 no programa inteiro que está fora do escopo da declaração do nome a que pertence a B1. Ou seja, esse escopo inclui B4 e todo
 o B2,exceto pela parte de B2 que está dentro de B3. Os escopos de todas as cinco declarações são resumidos na Figura 1.11.
 DECLARAÇÃO
 ESCOPO
 int a = 1;
 int b = 1;
 int b = 2;
 int a = 3;
 int b = 4;
 B1 
B1 
B2 
B3
 B4
 B3
 B2
 B4
 FIGURA 1.11 Escopos das declarações no Exemplo 1.6.
 Olhando por outro ângulo, vamos considerar o comando de saída no bloco B4 e vincular as variáveis a e b usadas lá às
 declarações apropriadas. A lista de blocos envolventes, em ordem crescente de tamanho, é B4, B2, B1. Observe que B3 não
 envolve o ponto em questão. B4 contém uma declaração de B, portanto é a essa declaração que esse uso de B se refere, e o valor
 de B impresso é 4. No entanto, B4 não possui uma declaração de a, de modo que em seguida examinamos B2. Esse bloco tam
bém não tem uma declaração de a, então prosseguimos para B1. Felizmente, existe uma declaração int a = 1 pertencente
 a esse bloco, portanto o valor impresso de a é 1. Se não houvesse tal declaração, o programa apresentaria um erro.
 1.6.4 CONTROLE DE ACESSO EXPLÍCITO
 Classes e estruturas introduzem um novo escopo para seus membros. Se p é um objeto de uma classe com um campo
 (membro) x, então o uso de x em p.x refere-se ao campo x na definição da classe. Em analogia com a estrutura de blocos, o
 escopo de uma declaração do membro x em uma classe C se estende a qualquer subclasse C’,exceto se C’ tiver uma declara
ção local com o mesmo nome x.
 Com o uso de palavras-chave como public, private e protected, as linguagens orientadas por objeto, como C++ ou Java,
 oferecem controle explícito sobre o acesso aos nomes de membro em uma superclasse. Essas palavras-chave admitem a encap
sulação pela restrição do acesso. Assim, nomes privados recebem propositadamente um escopo que inclui apenas as declara
20
 COMPILADORES: PRINCÍPIOS, TÉCNICAS E FERRAMENTAS
 ções e definições de método associadas a essa classe e a quaisquer classes “amigas” (ou “friend”, o termo da C++). Os nomes
 protegidos são acessíveis às subclasses. Os nomes públicos são acessíveis de fora da classe.
 Em C++, uma definição de uma classe pode estar separada das definições de alguns ou de todos os seus métodos.
 Portanto, um nome x associado à classe C pode ter uma região do código que está fora do seu escopo, seguida por outra região
 (uma definição de método) que está dentro do seu escopo. De fato, as regiões dentro e fora do escopo podem alternar-se, até
 que todos os métodos tenham sido definidos.
 Declarações e definições
 Os termos aparentemente semelhantes “declaração” e “definição” para conceitos da linguagem de programação são,
 na realidade, bem diferentes. As declarações dizem respeito aos tipos das construções, enquanto definições se referem aos
 seus valores. Definições têm o efeito de criar uma associação. Assim, int i é uma declaração de i, enquanto i = 1 é
 uma definição de i.
 A diferença é mais significativa quando tratamos de métodos ou outros procedimentos. Em C++, um método é decla
rado em uma definição de classe, dando os tipos dos argumentos e resultado do método (normalmente chamado de assi
natura do método). O método é então definido, ou seja, o código para executar o método é dado em outro local. De modo
 semelhante, é comum definir uma função C em um arquivo e declará-la em outros arquivos, onde a função é usada.
 1.6.5 ESCOPO DINÂMICO
 Tecnicamente, qualquer política de escopo é dinâmica se for baseada em fatores que possam ser conhecidos apenas quan
do o programa é executado. O termo escopo dinâmico, porém, normalmente se refere à seguinte política: um uso de um nome
 x se refere à declaração de x no procedimento chamado mais recentemente com tal declaração. O escopo dinâmico desse tipo
 aparece apenas em situações especiais. Vamos considerar dois exemplos de políticas dinâmicas: expansão de macro no pré-pro
cessador C e resolução de método na programação orientada por objeto.
 EXEMPLO 1.7:No programa C da Figura 1.12, o identificador a é uma macro composta pela expressão (x 1). Mas o que
 é x? Não podemos resolver x estaticamente, ou seja, em termos do texto do programa.
 #define a (x+1)
 int x = 2;
 void b() { int x = 1; printf(“%d\n”, a); }
 void c() { printf(“%d\n”, a); }
 void main() { b(); c(); }
 FIGURA 1.12 Uma macro cujos nomes precisam ter escopo dinâmico.
 Na verdade, para interpretar x, temos de usar a regra usual de escopo dinâmico. Examinamos todas as chamadas de fun
ção que estão atualmente ativas e pegamos a função chamada mais recentemente que tenha uma declaração de x. É a essa decla
ração que o uso de x se refere.
 No exemplo da Figura 1.12, a função main chama primeiramente a função b. Quando b executa, ela imprime o valor da macro
 a. Como (x 
1) precisa ser substituído por a,resolvemos esse uso de x para a declaração int x = 1 na função b. O motivo é
 que b possui uma declaração de x,de modo que o (x 
1) no printf de b se refere a esse x. Assim, o valor impresso é 1.
 Depois que b termina e c é chamada, precisamos novamente imprimir o valor da macro a. Porém, o único x acessível a c
 é o x global. A instrução printf em c, portanto, refere-se a essa declaração de x,e o valor 2 é impresso.
 Analogia entre escopo estático e dinâmico
 Embora possa haver diversas políticas para o escopo estático ou dinâmico, existe um relacionamento interessante
 entre a regra de escopo estático normal (estruturado em bloco) e a política dinâmica normal. De certa forma, a regra dinâ
mica está para o tempo assim como a regra estática está para o espaço. Enquanto a regra estática nos pede para encontrar
 a declaração cuja unidade (bloco) cerca mais de perto a localização física do uso, a regra dinâmica nos pede para encon
trar a declaração cuja unidade (chamada de procedimento) cerca mais de perto o tempo do uso.
21
 CAPÍTULO 1: INTRODUÇÃO
 CAPÍTULO 1: INTRODUÇÃO
 A resolução do escopo dinâmico também é essencial para procedimentos polimórficos, aqueles que possuem duas ou mais
 definições para o mesmo nome, dependendo apenas dos tipos dos argumentos. Em algumas linguagens, como ML (ver Seção
 7.3.3), é possível determinar estaticamente os tipos para todos os usos dos nomes, nos quais o compilador pode substituir cada
 uso de um procedimento de nome p por uma referência ao código para o procedimento apropriado. Porém, em outras lingua
gens, como Java e C++, há ocasiões em que o compilador não pode fazer essa determinação.
 EXEMPLO 1.8: Um recurso que distingue a programação orientada por objeto é a capacidade de cada objeto invocar o método
 apropriado em resposta a uma mensagem. Em outras palavras, o procedimento chamado quando x.m( ) é executado depende
 da classe de objeto denotada por x naquele momento. Um exemplo típico é o seguinte:
 1.
 2.
 3.
 Existe uma classe C com um método chamado m().
 Dé uma subclasse de C,e D tem seu próprio método chamado m().
 Existe um uso de m na forma x.m(), onde x é um objeto da classe C.
 Normalmente, é impossível saber durante a compilação se x será da classe C ou da subclasse D. Se a aplicação do méto
do ocorre várias vezes, é altamente provável que algumas sejam sobre objetos indicados por x que estão na classe C, mas não
 D, enquanto outras estarão na classe D. Somente no momento da execução é que pode ser decidida qual definição de m é a cor
reta. Assim, o código gerado pelo compilador precisa determinar a classe do objeto x e chamar um ou outro método denomi
nado m.
 1.6.6 MECANISMOS DE PASSAGEM DE PARÂMETROS
 Todas as linguagens de programação possuem a noção de procedimento, mas elas podem diferir no modo como esses pro
cedimentos recebem seus argumentos. Nesta seção, vamos considerar como os parâmetros reais (os parâmetros usados na 
chamada de um procedimento) estão associados aos parâmetros formais (aqueles usados na definição do procedimento). O
 mecanismo utilizado determina como o código na seqüência de chamada trata os parâmetros. A grande maioria das linguagens 
utiliza “chamada por valor”, ou a “chamada por referência”, ou ambas. Vamos explicar esses termos, além de outro método,
 conhecido como “chamada por nome”, cujo principal interesse é histórico.
 Chamada por valor
 Na chamada por valor,o parâmetro real é avaliado (se for uma expressão) ou copiado (se for uma variável). O valor é
 armazenado em uma localização pertencente ao parâmetro formal correspondente do procedimento chamado. Esse método é usado
 em C e Java, e é uma opção comum em C++, bem como na maioria das outras linguagens. A chamada por valor tem o efeito
 de que toda a computação envolvendo os parâmetros formais feita pelo procedimento chamado é local a esse procedimento, e
 os próprios parâmetros reais não podem ser alterados.
 Observe, porém, que em C podemos passar um apontador a uma variável para permitir que a variável seja alterada pelo
 procedimento chamado. De forma semelhante, os nomes de arranjos passados como parâmetros em C, C++ ou Java dão ao pro
cedimento chamado o que é de fato um apontador ou uma referência para o próprio arranjo. Assim, se a é o nome de um arran
jo do procedimento que chama, e ele é passado por valor ao parâmetro formal x correspondente, então uma atribuição como
 x[i] = 2 na realidade muda o elemento do arranjo a[2]. A razão para isso é que, embora x receba uma cópia do valor de a,
 esse valor na realidade é um apontador para o início da área de armazenamento onde está localizado o arranjo chamado a.
 De forma semelhante, em Java, muitas variáveis são na realidade referências (ou apontadores) para as construções que
 elas representam. Essa observação se aplica a arranjos, cadeias de caracteres e objetos de todas as classes. Embora Java utili
ze exclusivamente a chamada por valor, sempre que passamos o nome de um objeto a um procedimento chamado, o valor rece
bido por esse procedimento é na verdade um apontador para o objeto. Assim, o procedimento chamado é capaz de afetar o valor
 do próprio objeto.
 Chamada por referência
 Na chamada por referência,o endereço do parâmetro real é passado ao procedimento chamado como o valor do parâme
tro formal correspondente. Os usos do parâmetro formal no código chamado são implementados seguindo-se esse apontador
 para o local indicado por quem chamou. As mudanças no parâmetro formal, portanto, aparecem como mudanças no parâme
tro real.
 Porém, se o parâmetro real for uma expressão, então a expressão é avaliada antes da chamada, e seu valor é armazenado
 em um local próprio. As mudanças no parâmetro formal mudam essa localização, mas podem não ter efeito algum sobre os
 dados de quem chamou.
 A chamada por referência é usada para parâmetros “ref ” em C++ e é uma opção em muitas outras linguagens. Ela é quase
 essencial quando o parâmetro formal é um objeto, um arranjo ou uma estrutura grande. A razão para isso é que a chamada por
 valor estrita exige que quem chama copie o parâmetro real inteiro para o espaço pertencente ao parâmetro formal correspon
dente. Essa cópia é dispendiosa quando o parâmetro é grande. Conforme observamos ao discutir sobre a chamada por valor,
22
 COMPILADORES: PRINCÍPIOS, TÉCNICAS E FERRAMENTAS
 linguagens como Java solucionam o problema passando arranjos, strings ou outros objetos copiando apenas uma referência a
 esses objetos. O efeito é que Java se comporta como se usasse a chamada por referência para qualquer coisa fora um tipo bási
co, como um número inteiro ou real.
 Chamada por nome
 Um terceiro mecanismo – a chamada por nome – era usado na antiga linguagem de programação Algol 60. Ele exige que
 o procedimento chamado seja executado como se o parâmetro formal fosse substituído literalmente pelo parâmetro real no
 código chamado, como se o parâmetro formal fosse uma macro significando o parâmetro real (renomeando nomes locais no pro
cedimento chamado, para mantê-los distintos). Quando o parâmetro real é uma expressão, em vez de uma variável, ocorrem
 alguns comportamentos não intuitivos, motivo pelo qual esse mecanismo não tem a preferência da maioria atualmente. 
1.6.7 SINÔNIMOS
 Existe uma conseqüência interessante da passagem de parâmetros na chamada por referência ou sua simulação, como em
 Java, onde as referências a objetos são passadas por valor. É possível que dois parâmetros formais se refiram ao mesmo local;
 tais variáveis são consideradas sinônimos (aliases) uma da outra. Como resultado, duas variáveis quaisquer, que correspondem
 a dois parâmetros formais distintos, também podem tornar-se sinônimos uma da outra.
 EXEMPLO 1.9:Suponha que a seja um arranjo pertencente a um procedimento p,e p chama outro procedimento q(x, y) com
 uma chamada q(a, a). Suponha também que os parâmetros sejam passados por valor, mas que os nomes de arranjo sejam na
 realidade referências às localizações onde o arranjo está armazenado, como em C ou em linguagens semelhantes. Agora, x e y
 se tornaram sinônimos um do outro. O ponto importante é que, se dentro de q houver uma atribuição do tipo x[10] = 2,
 então o valor de y[10] também se torna 2.
 Acontece que entender os sinônimos e os mecanismos que o criam é essencial se um compilador tiver de otimizar um pro
grama. Conforme veremos a partir do Capítulo 9, existem muitas situações em que só podemos otimizar o código se tivermos
 certeza de que certas variáveis não são sinônimos uma da outra. Por exemplo, poderíamos determinar que x = 2 é o único
 local em que a variável x é atribuída. Nesse caso, podemos substituir um uso de x por um uso de 2; por exemplo, substituir 
a = x+3 pela atribuição mais simples a = 5. Mas suponha que existisse outra variável y que fosse um alias de x. Então a
 atribuição y = 4 poderia ter um efeito inesperado ao alterar x. Isso também poderia significar que a substituição de a = x+3
 por a = 5 seria um erro; o valor apropriado de a poderia ser 7 nesse caso.
 1.6.8 EXERCÍCIOS DA SEÇÃO 1.6
 Exercício 1.6.1: Para o código C estruturado em bloco da Figura 1.13(a), indique os valores atribuídos a w, x, y e z.
 Exercício 1.6.2: Repita o Exercício 1.6.1 para o código da Figura 1.13(b).
 int w, x, y, z;
 int i = 4; int j = 5;
 {   int j = 7;
 i = 6;
 w = i + j;
 }
 x = i + j;
 {   int i = 8;
 y = i + j;
 }
 z = i + j;
 (a) Código para o Exercício 1.6.1.
 int w, x, y, z;
 int i = 3; int j = 4;
 {   int i = 5;
 w = i + j;
 }
 x = i + j;
 {   int j = 6;
 i = 7;
 y = i + j;
 }
 z = i + j;
 (a) Código para o Exercício 1.6.2.
 FIGURA 1.13 Código estruturado em bloco.
 Exercício 1.6.3: Para o código estruturado em bloco da Figura 1.14, considerando o escopo estático usual das declarações, dê
 o escopo para cada uma das doze declarações.
23
 CAPÍTULO 1: INTRODUÇÃO
 CAPÍTULO 1: INTRODUÇÃO
 {   int w, x, y, z;     /* Bloco B1 */
 {   int x, z;       /* Bloco B2 */
 {   int w, x;   /* Bloco B3 */ }
 }
 {   int w, x;       /* Bloco B4 */
 {   int y, z;   /* Bloco B5 */ }
 }
 }
 FIGURA 1.14 Código estruturado em bloco para o Exercício 1.6.3.
 Exercício 1.6.4: O que é impresso pelo seguinte código em C?
 #define a (x+1)
 int x = 2;
 void b() { x = a; printf(“%d\n”, x); }
 void c() { int x = 1; printf(“%d\n”), a; }
 void main() { b(); c(); }
 1.7 RESUMO DO CAPÍTULO 1
 • Processadores de linguagem. Um ambiente de desenvolvimento de software integrado inclui muitos tipos diferentes
 de processadores de linguagem, como compiladores, interpretadores, montadores, editores de ligação, carregadores,
 depuradores e profilers.
 • Fases do compilador. Um compilador opera como uma seqüência de fases, cada uma transformando o programa fonte
 de uma representação intermediária para outra.
 • Linguagens de máquina e linguagem simbólica. As linguagens de máquina foram as linguagens de programação da pri
meira geração, seguidas pelas linguagens simbólicas. A programação nessas linguagens era demorada e passível de erro.
 • Modelagem no projeto do compilador. O projeto do compilador é uma das áreas em que a teoria teve mais impacto na
 prática. Os modelos mais importantes incluem gramáticas, expressões regulares, árvores e muitos outros.
 • Otimização de código. Embora o código não possa ser realmente “otimizado”, a ciência de melhorar a eficiência do
 código é complexa e muito importante. Ela é uma parte importante do estudo da compilação.
 • Linguagens de alto nível. Com o passar do tempo, as linguagens de programação assumem cada vez mais tarefas que
 anteriormente eram responsabilidade do programador, como o gerenciamento de memória, a verificação de consistên
cia de tipo ou a execução paralela do código.
 • Compiladores e arquitetura de computador. A tecnologia de compiladores influencia a arquitetura de computadores,
 além de ser influenciada pelos avanços na arquitetura. Muitas inovações modernas na arquitetura dependem da capa
cidade de os compiladores extraírem dos programas fonte as oportunidades de usar as capacidades do hardware de
 modo eficaz.
 • Produtividade e segurança do software. A mesma tecnologia que permite aos compiladores otimizar seu código pode
 ser usada para diversas tarefas de análise de programa, desde detectar erros comuns em programas até descobrir que
 um programa é vulnerável a um dos muitos tipos de intrusões descobertas pelos hackers.
 • Regras de escopo. O escopo de uma declaração de x é o contexto em que os usos de x se referem a essa declaração, ou
 seja, é o fragmento do programa em que a declaração tem efeito. Uma linguagem usa escopo estático ou escopo léxi
co se for possível determinar o escopo de uma declaração examinando apenas o programa. Caso contrário, a lingua
gem usa o escopo dinâmico.
 • Ambiente. O ambiente mapeia um nome para uma localização de memória, enquanto o estado mapeia uma posição de
 memória ao valor que ela contém. 
• Estrutura de bloco. As linguagens que permitem que os blocos sejam encaixados são consideradas como tendo uma
 estrutura de bloco. Um nome x em um bloco aninhado B está no escopo de uma declaração D de x em um bloco deli
mitado se não houver outra declaração de x em um bloco entre eles.
 • Passagem de parâmetros. Os parâmetros são passados por valor ou por referência de um procedimento chamador para
 o procedimento chamado. Quando grandes objetos são passados por valor, os valores passados são, na realidade, refe
rências aos próprios objetos, resultando em uma efetiva chamada por referência.
 • Sinônimo. Quando os parâmetros são (efetivamente) passados por referência, dois parâmetros formais podem referir
se ao mesmo objeto. Essa possibilidade permite que a alteração em uma variável mude outra variável.
24
 COMPILADORES: PRINCÍPIOS, TÉCNICAS E FERRAMENTAS
 1.8 REFERÊNCIAS DO CAPÍTULO 1
 Para saber mais sobre o desenvolvimento das linguagens de programação que foram criadas e estiveram em uso por volta
 de 1967, incluindo Fortran, Algol, Lisp e Simula, ver [7]. Para estudar sobre as linguagens que foram criadas por volta de 1982,
 incluindo C, C++, Pascal e Smalltalk, ver [1].
 A GNU Compiler Collection, gcc, é uma ferramenta popular de código-fonte aberto de compiladores para C, C++, Fortran,
 Java e outras linguagens [2]. Phoenix é um kit de ferramentas de construção de compiladores que oferece uma estrutura integra
da para a construção das fases de análise, geração e otimização de código dos compiladores discutidos neste livro [3].
 Para obter mais informações sobre conceitos de linguagem de programação, recomendamos [5 e 6]. Para ver mais sobre
 arquitetura de computadores e seu impacto sobre a compilação, sugerimos [4].
 1.
 2.
 3.
 4.
 5.
 6.
 7.
 BERGIN, T. J. e GIBSON R. G. History of programming languages. Nova York: ACM Press, 1996.
 http://gcc.gnu.org/.
 http://research.microsoft.com/phoenix/default.aspx.
 HENNESSY, J. L. e PATTERSON D. A. Computer organization and design: the hardware/software interface, San
 Francisco: Morgan-Kaufmann, 2004.
 SCOTT, M. L. Programming language pragmatics. 2ed. São Francisco: Morgan-Kaufmann, 2006.
 SETHI, R. Programming languages: concepts and constructs, Addison-Wesley, 1996.
 WEXELBLAT, R. L. History of programming languages. Nova York: Academic Press, 1981.
