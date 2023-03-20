+++
title = "PromQL"
description = "Entendendo o PromQL"
date = 2023-03-19T17:31:45-03:00
tags = ["observability, prometheus, promql"]
draft = false
weight = 1
author = "Vitor Lobo Ramos"
+++

* **[Introdução](#introdução)**
* **[Funções](#funções)**
* **[Agregadores e Operadores](#agregadores-e-operadores)**
* **[PromQL na prática](#promql-na-prática)**

## Introdução

PromQL é uma linguagem de consulta de métricas do Prometheus. Ela é baseada em expressões regulares e permite que você faça consultas de métricas e alertas. A linguagem PromQL permite que os usuários escrevam expressões que definem cálculos em cima dos dados de métricas coletados, como contar o número de requisições HTTP por segundo ou calcular a média das taxas de utilização da CPU por servidor. PromQL também suporta funções matemáticas, operações booleanas, operações de comparação, agrupamento de dados e agregações. Ele também possui recursos avançados como subconsultas e funções de séries temporais. Os usuários podem executar consultas PromQL usando a interface web do Prometheus ou por meio de APIs e bibliotecas de clientes. Além disso, é possível criar gráficos e painéis de visualização dos dados de métricas usando ferramentas de visualização de dados, como o Grafana.

### Time series database

O Prometheus armazena dados em um formato binário chamado TSDB (Time Series Database). O TSDB é um banco de dados de séries temporais que é otimizado para armazenar dados de métricas. Ele é escrito em Go e é um projeto de código aberto hospedado no GitHub. Para simplificar o entendimento a cerca de um banco de dados de série temporal, imagine que você tem um diário onde você registra a temperatura do ar todos os dias, às mesmas horas, assim como a velocidade do vento, pressão atmosférica, entre outras informações. Essas informações são armazenadas em ordem cronológica, ou seja, por ordem de tempo, e é possível consultá-las para ver como esses dados variam ao longo do tempo. É uma forma de armazenar e consultar dados que possuem uma dimensão temporal. Monitorar métricas a partir de um banco de dados em série temporal tem várias vantagens. Algumas das principais vantagens incluem:

* **Análise histórica:** Um banco de dados em série temporal armazena dados em ordem cronológica, o que permite a análise de tendências e padrões ao longo do tempo. Isso é útil para entender como o desempenho do sistema evoluiu e identificar tendências que possam indicar problemas futuros.
* **Identificação de problemas:** Armazenando dados em ordem cronológica, é possível investigar problemas usando dados históricos. Isso permite identificar a causa raiz de problemas de desempenho e disponibilidade.
* **Alertas baseados no tempo:** Com dados armazenados em ordem cronológica, é possível criar alertas baseados no tempo, como alertas de desempenho abaixo do normal em horários específicos ou alertas de tendências preocupantes.
* **Armazenamento escalável:** Banco de dados em série temporal são projetados para lidar com grandes volumes de dados e escalar horizontalmente, permitindo que as métricas sejam armazenadas sem perda de desempenho.
* **Integração com outras ferramentas:** A maioria das ferramentas de monitoramento e análise de dados suportam a coleta de dados de banco de dados em série temporal, o que permite a integração com outras ferramentas de monitoramento e análise.

Em resumo, usar um banco de dados em série temporal permite coletar, armazenar e analisar dados de métricas de desempenho ao longo do tempo, permitindo a identificação de problemas, tendências e padrões, criação de alertas baseados no tempo, escalabilidade e integração com outras ferramentas de monitoramento e análise. PromQL (Prometheus Query Language) é a linguagem de consulta usada para extrair dados de métricas armazenadas em Prometheus. Ele permite que os usuários criem consultas complexas para analisar os dados de métricas.PromQL é baseado em expressões, que podem ser combinadas para criar consultas mais complexas. As expressões mais comuns incluem:

* **Funções de agregação:** Essas funções, como média, soma e máximo, permitem agregar dados de métricas ao longo de um período de tempo específico. Por exemplo, a função de média pode ser usada para calcular a média de uma métrica ao longo de um período de tempo.
* **Funções de filtragem:** Essas funções permitem filtrar os dados de métricas para incluir ou excluir dados específicos. Por exemplo, a função "igual" pode ser usada para selecionar apenas os dados de uma métrica específica.
* **Funções de transformação:** Essas funções permitem transformar os dados de métricas. Por exemplo, a função "diferença" pode ser usada para calcular a diferença entre dois valores de uma métrica.

PromQL também suporta operações matemáticas básicas, como adição, subtração, multiplicação e divisão, que podem ser usadas para combinar diferentes métricas e expressões. PromQL também suporta a utilização de operadores lógicos, como "and" e "or", para combinar expressões e criar consultas mais complexas. Além disso, PromQL também oferece recursos avançados, como suporte a rótulos, que permitem selecionar dados específicos de métricas baseadas em rótulos associados a essas métricas. PromQL é uma linguagem poderosa e flexível, que permite aos usuários criar consultas complexas para analisar os dados de métricas armazenadas em Prometheus. Isso permite a identificação de problemas, tendências e padrões, criação de alertas baseados no tempo e integração com outras ferramentas de monitoramento e análise.

### Seletores

Os Selectors em PromQL são como filtros que nos permitem escolher uma ou mais métricas específicas para consultas. Existem dois tipos de seletores: o primeiro é o seletor de nome de métrica, que seleciona métricas pelo seu nome, como por exemplo `http_requests_total`. O segundo é o seletor de label, que seleciona métricas pelo label associado a elas. Por exemplo, podemos ter uma métrica `http_requests_total` com os labels `method` e `handler`, e com valores `GET` e `/api/v1/users`, respectivamente. Usando o seletor de label, podemos escolher as métricas com label `method` igual a `GET` e `handler` igual a `/api/v1/users`. Os seletores são combinados com operadores de correspondência para selecionar um conjunto específico de séries de métricas. Esses operadores incluem `=, !=, =~` e `!~`, e são usados para comparar valores ou expressões regulares. Combinando os seletores com os operadores de correspondência, podemos selecionar as métricas exatas que desejamos. Exemplo:

```bash
http_requests_total{method="GET", handler="/api/v1/users"}
```

- Selecionando todas as métricas que possuem "http" no nome:

```bash
{__name__=~"http.*"}

```

- Selecionando métricas que possuem o label "status" com o valor "error":

```bash
{status="error"}
```

Selecionando métricas que possuem o label "app" com os valores "frontend" ou "backend":

```bash
{app=~"frontend|backend"}

```

### Tipos de expressões

Em PromQL, existem vários tipos de expressões que podem ser usados ​​para manipular as métricas coletadas pelo Prometheus. Essas expressões podem ser usadas para realizar cálculos matemáticos, agrupar métricas, filtrar resultados e muito mais. Aqui estão alguns dos principais tipos de expressões em PromQL:

* **Expressões aritméticas**: São usadas para realizar cálculos matemáticos em séries de métricas. Por exemplo, podemos somar ou subtrair o valor de duas métricas usando operadores como `+` e `-`, ou ainda multiplicar ou dividir pelo valor de uma constante usando `*` e `/`.
* **Funções de agregação**: São usadas para agrupar e resumir séries de métricas. Essas funções incluem sum, avg, max e min, que permitem somar, calcular a média, obter o valor máximo e mínimo de uma série de métricas.
* **Funções de filtro**: São usadas para filtrar séries de métricas com base em seus labels. Essas funções incluem label_values e topk, que permitem obter os valores de um label específico e selecionar as principais séries de métricas com base em um label.
* **Funções de transformação**: São usadas para transformar séries de métricas de uma maneira específica. Essas funções incluem rate, que permite calcular a taxa de mudança entre pontos de dados, irate, que permite calcular a taxa instantânea de mudança, e delta, que permite calcular a diferença entre os valores de métricas em dois pontos de tempo diferentes.
* **Expressões booleanas**: São usadas para avaliar se uma determinada condição é verdadeira ou falsa. Essas expressões incluem operadores como and, or e unless, que permitem combinar ou negar condições.

### Vector vs Range Vector

Em PromQL, há dois tipos principais de vetores que podemos usar em nossas consultas: Vector e Range Vector.

* **Vector**: É um conjunto de pontos de dados com os mesmos labels, representando a série temporal de uma única métrica. Por exemplo, o vector `up{job="prometheus"}` representa o tempo em que o serviço Prometheus estava em execução ou não, com o label `job="prometheus"`.
* **Range Vector**: É um conjunto de pontos de dados com os mesmos labels, mas que representa um intervalo de tempo em vez de um único ponto no tempo. Os dados em um Range Vector são coletados ao longo do tempo e armazenados em uma janela deslizante. Por exemplo, o range vector `up{job="prometheus"}[5m]` representa o tempo em que o serviço Prometheus estava em execução ou não nos últimos 5 minutos. 
 
Exemplos de consultas PromQL usando vetores e range vectors:

- Selecionando o valor atual da métrica `cpu_usage` para a instância "webserver-1":

```bash
cpu_usage{instance="webserver-1"}

```

- Selecionando a diferença entre os valores atuais das métricas `http_requests_total` e `http_requests_failed` para cada instância:

```bash
http_requests_total - http_requests_failed
```

- Selecionando os últimos 5 minutos de dados da métrica `cpu_usage` para cada instância:

```bash
rate(cpu_usage[5m])

```

- Selecionando o valor máximo da métrica "network_traffic" em um intervalo de 30 minutos para cada instância:

```bash
max_over_time(network_traffic[30m]) by (instance)
```

Em outras palavras, um Vector é uma série temporal que representa o valor de uma única métrica em um determinado momento, enquanto um Range Vector é uma série temporal que representa o valor de uma única métrica em um intervalo de tempo específico. Os Range Vectors são especialmente úteis para consultas que exigem agregação ou transformação de dados ao longo do tempo, como cálculos de média móvel, cálculos de taxa de mudança, entre outros. Por outro lado, os Vectors são adequados para consultas que exigem dados em um único ponto no tempo, como a consulta do valor atual de uma métrica.

### Selector Safety

Selector Safety é um conceito em PromQL que se refere à capacidade de uma expressão de selecionar métricas de forma segura, sem risco de gerar resultados imprecisos ou indesejados. Em PromQL, os Selectors são usados para filtrar e selecionar as métricas que desejamos consultar. Por exemplo, podemos usar um Selector para selecionar todas as métricas que correspondem a um determinado label, como `job="prometheus"`. No entanto, nem todos os Selectors são seguros, pois alguns podem selecionar métricas indesejadas ou que não correspondem ao que queremos.

Um exemplo de um Selector inseguro é o uso de uma expressão de correspondência de prefixo em um label, como `job=~"prom.*"`. Esta expressão selecionará todas as métricas com o label `job` que começa com a palavra "prom", incluindo métricas que não correspondem ao que estamos procurando. Isso pode resultar em resultados imprecisos ou indesejados. Para garantir a segurança dos Selectors em PromQL, é recomendável seguir algumas práticas recomendadas, como evitar o uso de expressões de correspondência de prefixo e usar apenas operadores de correspondência exata, como `=`, `!=` e `=~`. Além disso, é importante entender bem as métricas que estão sendo coletadas e seus labels, para que possamos criar Selectors precisos e seguros.

Exemplos de Selectors seguros e inseguros:

- Selecionando o valor atual da métrica "http_requests_total" para qualquer instância, sem usar um seletor não seguro:
    
```bash
http_requests_total{job="webserver"}

```

- Selecionando o valor atual da métrica "cpu_usage" para todas as instâncias, usando um seletor seguro:
    
```bash
cpu_usage * on(instance) group_left(instance) {job="webserver"}

```
- Selecionando o valor médio da métrica "memory_usage" em um intervalo de 1 hora, sem usar um seletor não seguro:

```bash
avg_over_time(memory_usage[1h])

```

- Selecionando o valor máximo da métrica "network_traffic" em um intervalo de 30 minutos para cada instância, usando um seletor seguro:

```bash
max_over_time(network_traffic[30m]) by (instance) * on(instance) group_left(instance) {job="webserver"}

```

### Instant Vector Staleness

Em PromQL, o Instant Vector é um conjunto de pontos de dados que representam o valor de uma única métrica em um determinado momento no tempo. Quando executamos uma consulta usando um Instant Vector, o Prometheus retorna o valor mais recente da métrica no momento da consulta. No entanto, se a métrica não tiver sido coletada recentemente, o valor retornado pelo Prometheus pode estar desatualizado, o que é conhecido como Instant Vector Staleness. Isso pode ser um problema em casos em que a precisão dos dados é crítica, como em alertas de segurança ou monitoramento de sistemas críticos. Para lidar com o Instant Vector Staleness, o Prometheus permite configurar o intervalo de avaliação para consultas que usam Instant Vectors. Isso permite que a consulta leve em consideração um período de tempo maior e, assim, reduzir o impacto do Instant Vector Staleness. Por exemplo, podemos configurar uma consulta para usar o intervalo de avaliação de 5 minutos ([5m]) para considerar os valores da métrica nos últimos 5 minutos em vez do valor mais recente no momento da consulta. Isso pode ajudar a garantir que os dados retornados pela consulta sejam mais precisos e atualizados.

Em resumo, Instant Vector Staleness é um problema potencial em PromQL que se refere à idade dos dados de uma métrica no momento em que a consulta é executada. Para lidar com o Instant Vector Staleness, é recomendável configurar o intervalo de avaliação para consultas que usam Instant Vectors, permitindo que a consulta leve em consideração um período de tempo maior e, assim, reduzir o impacto do Staleness.

Exemplos de consultas usando Instant Vectors:

- Verificando se a métrica "http_requests_total" é atualizada nos últimos 5 minutos:

```bash
http_requests_total unless absent(rate(http_requests_total[5m]))

```

- Selecionando o valor atual da métrica "cpu_usage" apenas para as instâncias que atualizaram a métrica nos últimos 30 segundos:

```bash
cpu_usage * on(instance) group_left(instance) (timestamp(cpu_usage) > bool 1601920922)

```

- Selecionando o valor atual da métrica "memory_usage" para todas as instâncias, excluindo as que não atualizaram a métrica nos últimos 2 minutos:

```bash
memory_usage unless absent_over_time(memory_usage[2m])

```

## Funções

### Functions, Math Functions e Clamping

As funções permitem manipular e processar métricas. Elas podem ser usadas para realizar cálculos matemáticos, agregações, transformações e outras operações em métricas. Entre as funções mais comuns em PromQL estão as Math Functions, que são funções matemáticas usadas para realizar operações aritméticas em métricas. Essas funções incluem operações básicas, como soma, subtração, multiplicação e divisão, bem como funções mais avançadas, como exponenciação e raiz quadrada. Por exemplo, podemos usar a função `sum()` para somar os valores de uma métrica em um determinado intervalo de tempo. Podemos usar a função `rate()` para calcular a taxa de variação de uma métrica em um intervalo de tempo, ou a função `max()` para encontrar o valor máximo de uma métrica em um intervalo de tempo. Além das Math Functions, outra função útil em PromQL é a Clamping Function. Essa função é usada para limitar o valor de uma métrica a um determinado intervalo. Por exemplo, podemos usar a função `clamp_min()` para garantir que o valor de uma métrica não seja inferior a um determinado limite mínimo, ou a função `clamp_max()` para garantir que o valor não seja superior a um determinado limite máximo. Exemplo:

- Para calcular a média dos valores de uma métrica nos últimos 5 minutos:

```bash
avg_over_time(metric_name[5m])
```
- Para calcular a soma dos valores de uma métrica nos últimos 10 minutos:

```bash
sum_over_time(metric_name[10m])
```
- Para calcular o máximo valor de uma métrica em um intervalo de tempo específico:

```bash
max_over_time(metric_name{label="value"}[1h])
```

Em resumo, as Functions são ferramentas poderosas em PromQL que permitem manipular e processar métricas. As Math Functions são usadas para realizar cálculos matemáticos em métricas, enquanto a Clamping Function é usada para limitar o valor de uma métrica a um determinado intervalo. O conhecimento dessas funções pode ajudar a realizar consultas mais avançadas e obter insights mais precisos a partir dos dados coletados.

### Timestamps e Time and Dates

Em PromQL, Timestamps são valores numéricos que representam o tempo em segundos desde o início da época Unix (1º de janeiro de 1970, 00:00:00 UTC). Os Timestamps são usados para indicar quando uma métrica foi coletada ou para especificar um intervalo de tempo em uma consulta. Por exemplo, podemos usar um Timestamp para especificar uma janela de tempo em uma consulta usando a função `time()`. A função `time()` retorna o Timestamp atual no momento da execução da consulta. Podemos usar esse valor para definir um intervalo de tempo a ser considerado na consulta. Além disso, PromQL também oferece suporte para lidar com Time and Dates (tempo e datas). Isso é feito através do uso de funções como `hour()`, `day_of_week()` e `month()`, que permitem extrair informações específicas sobre o tempo e a data de uma métrica. Por exemplo, podemos usar a função `hour()` para extrair a hora do dia em que uma métrica foi coletada, ou a função `day_of_week()` para extrair o dia da semana em que a métrica foi coletada. Essas informações podem ser usadas para realizar análises mais precisas e identificar padrões sazonais ou diários em nossos dados.

Exemplos de consultas usando Timestamps e Time and Dates:

- Selecionar a taxa de transferência média nos últimos 5 minutos:

```bash
rate(my_metric_total[5m])
```

- Selecionar a média das taxas de transferência por hora para as últimas 24 horas:

```bash
avg_over_time(rate(my_metric_total[1h]))[24h:1h]
```

- Selecionar o valor médio da métrica my_metric para o último dia:

```bash
avg_over_time(my_metric[1d])
```

- Selecionar a métrica my_metric para um período específico:

```bash
my_metric{job="prometheus", instance="localhost"}[start_time, end_time]
```

### Counter Range Vectors, Aggregating Across Time e Subqueries

Counter Range Vectors são um tipo de vetor que contém uma série de pontos de dados que representam a contagem de eventos que ocorreram ao longo do tempo. Em outras palavras, os Counter Range Vectors fornecem informações sobre a taxa de eventos que ocorreram em um intervalo de tempo específico. Por exemplo, podemos usar um Counter Range Vector para acompanhar a quantidade de solicitações HTTP que um servidor recebe a cada segundo. Ao longo do tempo, podemos acumular esses dados em uma série temporal, que pode ser usada para análises posteriores.

Para agregarmos os dados de um Counter Range Vector, podemos usar funções de agregação que operam sobre um intervalo de tempo, como `rate()` e `irate()`. Essas funções calculam a taxa de variação da contagem de eventos dentro do intervalo de tempo especificado. Além disso, PromQL também permite a realização de subconsultas, ou Subqueries. Isso permite que consultas mais avançadas sejam realizadas, onde uma consulta é realizada dentro de outra consulta. Por exemplo, podemos usar uma subconsulta para calcular a média de uma série temporal ao longo de um intervalo de tempo específico, que é então usado como entrada para uma consulta principal.

A seguir, estão alguns exemplos de expressões PromQL envolvendo Counter Range Vectors, Aggregating Across Time e Subqueries:

- Selecionar a taxa de transferência média nos últimos 5 minutos para uma métrica my_metric que é um contador:

```bash
rate(my_metric[5m])
```

Selecionar a soma das taxas de transferência por hora para as últimas 24 horas para uma métrica my_metric que é um contador:

```bash
sum(rate(my_metric[1h]))[24h:1h]
```

- Selecionar a métrica my_metric para um período específico e calcular a soma cumulativa usando uma subconsulta:

```bash
sum(my_metric - my_metric offset 1d)
```

- Selecionar a média das taxas de transferência por hora para as últimas 24 horas para uma métrica my_metric que é um contador e calcular a diferença entre os valores em intervalos de 6 horas:

```bash
delta(avg_over_time(rate(my_metric[1h]))[24h:6h])
```

### Histograms, Switching Types, Altering Labels e Sorting

Histogramas são uma forma de agrupar e contar observações em intervalos (buckets) de valores. Eles são úteis para analisar a distribuição de valores em uma métrica, por exemplo, para determinar quantas solicitações HTTP foram concluídas em diferentes intervalos de tempo de resposta. Em PromQL, um Histograma é representado como um vetor com várias séries temporais, cada uma correspondendo a um intervalo (bucket) de valores. Para calcular a contagem total de observações em um Histograma, podemos usar a função `sum()`.

Quando trabalhamos com Histogramas, também podemos alternar o tipo de dados entre o Histograma original e sua versão sumarizada (Summary). Isso pode ser feito usando a função `histogram_quantile()`, que calcula a distribuição de quantis do Histograma. Podemos então usar a função `sum()` em cima do resultado dessa função para obter uma versão sumarizada do Histograma. Outra funcionalidade importante em PromQL é a capacidade de alterar labels em uma consulta. Podemos usar as funções `label_replace()` e `label_map()` para adicionar, alterar ou remover labels de uma métrica. Isso pode ser útil para transformar métricas existentes em formatos mais úteis para nossos objetivos de análise. Finalmente, em PromQL, podemos classificar os resultados de uma consulta usando a função `sort()`. Isso permite que os resultados da consulta sejam ordenados em ordem crescente ou decrescente com base em um label ou valor específico. Em resumo, Histogramas são uma forma de agrupar e contar observações em intervalos (buckets) de valores. Em PromQL, podemos alternar o tipo de dados entre o Histograma original e sua versão sumarizada, alterar labels em uma consulta usando funções como `label_replace()` e `label_map()`, e classificar os resultados de uma consulta usando a função `sort()`.

A seguir, estão alguns exemplos de expressões PromQL envolvendo Histograms, Switching Types, Altering Labels e Sorting:

- Exemplo de consulta para exibir a contagem de observações em um intervalo de tempo para um histograma:

```bash
sum(rate(my_histogram_bucket[5m])) by (le)
```

Essa consulta irá exibir a contagem de observações para cada intervalo de tempo do histograma, representado pelos valores de "le" (menor ou igual). A função "rate" é usada para calcular a taxa de mudança do número de observações por segundo, e o operador "sum" é usado para adicionar as observações em cada intervalo de tempo.

- Exemplo de consulta para converter um tipo de dados em outro:

```bash
histogram_quantile(0.9, sum(rate(my_histogram_bucket[5m])) by (le))
```

Essa consulta converte um histograma em uma série de quantis, especificamente extraindo o quantil de 90% dos valores registrados no histograma. A função "histogram_quantile" é usada para calcular o quantil com base no histograma, e o operador "sum" é usado para agrupar as observações por intervalo de tempo.

- Exemplo de consulta para alterar o rótulo de uma métrica:

```bash
label_replace(my_metric, "new_label", "$1", "old_label", "(.*)")
```

Essa consulta substitui o valor de um rótulo existente em uma métrica por um novo valor. A função "label_replace" é usada para especificar o rótulo existente e o novo valor, e o argumento "$1" é usado para capturar o valor existente do rótulo. A expressão regular "(.*)" é usada para corresponder a qualquer valor de rótulo existente.

### Missing values

Valores ausentes (Missing Values) podem ser um problema em consultas PromQL, pois podem afetar a precisão das análises e visualizações dos dados. Felizmente, PromQL tem uma maneira de lidar com valores ausentes, usando a função `absent()`. Essa função retorna 1 se uma série temporal estiver ausente em um determinado intervalo de tempo ou 0 caso contrário.

## Agregadores e Operadores

### Operators, Arithmetic e Simple Binary Operator Matching

PromQL tem uma variedade de operadores que podem ser usados para combinar ou comparar séries temporais e seus valores. Esses operadores podem ser divididos em diferentes categorias, incluindo Operadores Aritméticos, Operadores Lógicos e Operadores de Comparação. No PromQL, Aggregators são funções que agregam resultados de várias séries temporais. Por exemplo, a função `sum()` retorna a soma dos valores de várias séries temporais para um intervalo de tempo. Outros exemplos de Aggregators incluem `avg()`, `min()`, `max()`, `count()`, entre outros. Quando trabalhamos com Aggregators, podemos escolher como os labels de saída são nomeados usando a função `by()`. Por exemplo, `sum by (foo)` retornará a soma dos valores agrupados pela label foo.

Os Operadores Aritméticos são usados para executar operações matemáticas em séries temporais e seus valores. Esses operadores incluem `+` (adição), `-` (subtração), `*` (multiplicação) e `/` (divisão). Eles podem ser usados para combinar ou transformar séries temporais em diferentes maneiras. Os Operadores Lógicos são usados para combinar ou comparar séries temporais com base em valores booleanos. Eles incluem `and` (e lógico), `or` (ou lógico) e `unless` (a menos que). Esses operadores podem ser úteis para filtrar séries temporais com base em certas condições. Os Operadores de Comparação são usados para comparar valores em séries temporais e produzir valores booleanos como resultado. Eles incluem `==` (igual a), `!=` (diferente de), `>` (maior que), `<` (menor que), `>=` (maior ou igual a) e `<=` (menor ou igual a). Esses operadores são úteis para filtrar e analisar séries temporais com base em valores específicos. Para usar esses operadores, podemos usar a sintaxe PromQL adequada. Por exemplo, para somar duas séries temporais foo e bar, podemos usar a expressão `foo + bar`. Para comparar os valores de uma série temporal foo com um valor específico de 10, podemos usar a expressão `foo > 10`.

PromQL também tem a funcionalidade de Simple Binary Operator Matching, que permite que um operador binário seja aplicado a todas as combinações possíveis de pares de séries temporais com o mesmo conjunto de labels. Por exemplo, a expressão `foo + bool` bar adicionará todas as combinações de foo e bar que têm o mesmo conjunto de labels. Em resumo, PromQL tem uma variedade de operadores que podem ser usados para combinar ou comparar séries temporais e seus valores. Os Operadores Aritméticos são usados para executar operações matemáticas, os Operadores Lógicos são usados para combinar ou comparar séries temporais com base em valores booleanos, e os Operadores de Comparação são usados para comparar valores em séries temporais e produzir valores booleanos como resultado Podemos usar a sintaxe PromQL adequada para aplicar esses operadores e também podemos usar a funcionalidade de Simple Binary Operator Matching para aplicar um operador binário a todas as combinações possíveis de pares de séries temporais.

Aqui estão alguns exemplos práticos de expressões PromQL usando operadores, aritmética e correspondência de operadores binários simples:

- Somando valores de duas métricas

```bash
sum(metric1) + sum(metric2)
```

- Subtraindo valores de duas métricas

```bash
sum(metric1) - sum(metric2)
```

- Multiplicando valores de duas métricas

```bash
sum(metric1) * sum(metric2)
```

- Dividindo valores de duas métricas

```bash
sum(metric1) / sum(metric2)
```

- Usando o operador de comparação "maior que"

```bash
sum(metric1) > 10
```

### Matching Your Time Series, Many to One e Comparison Operators

Uma das tarefas mais comuns em PromQL é combinar séries temporais com base em seus labels. Isso pode ser feito usando a função match, que permite selecionar séries temporais com base em seus labels. A função match pode ser usada para selecionar séries temporais com base em um ou mais labels. Por exemplo, a expressão `match(foo{bar="baz"})` selecionará todas as séries temporais que tiverem o label bar definido como baz na métrica foo. Podemos usar operadores de comparação, como `==`, `!=`,`>`, `<`, `>=` e `<=`, para filtrar ainda mais as séries temporais com base em seus valores. Além disso, podemos combinar várias séries temporais em uma única série temporal usando funções de agregação, como `sum`, `avg`, `max`, `min`, `count`, entre outras. Essas funções permitem que várias séries temporais sejam agrupadas em uma única série temporal com base em um label em comum.

Quando combinamos várias séries temporais em uma única série temporal, é importante lembrar que nem sempre haverá uma correspondência um para um entre as séries. Isso é conhecido como Many-to-One Matching, onde várias séries temporais são agrupadas em uma única série temporal com base em um label em comum. Ao usar Many-to-One Matching, pode ser necessário usar funções de agregação para reduzir as múltiplas séries temporais em um único valor. Por exemplo, podemos usar a função sum para adicionar os valores de várias séries temporais em uma única série temporal. Além disso, PromQL também possui Comparison Operators, que permitem comparar valores de uma série temporal com valores de outra série temporal. Esses operadores incluem `==`, `!=`, `>`, `<`, `>=` e `<=`. Eles podem ser úteis para comparar valores de duas séries temporais diferentes ou para comparar valores de uma série temporal com um valor constante.

Em resumo, PromQL permite combinar séries temporais com base em seus labels usando a função match, que pode ser filtrada ainda mais usando operadores de comparação. Também é possível combinar várias séries temporais em uma única série temporal usando funções de agregação. Quando usamos Many-to-One Matching, pode ser necessário usar funções de agregação para reduzir as múltiplas séries temporais em um único valor. Além disso, PromQL também possui Comparison Operators, que permitem comparar valores de uma série temporal com valores de outra série temporal.

### Bool vs Filtering

No PromQL, podemos usar operadores booleanos para comparar valores de séries temporais e criar expressões condicionais. Os operadores booleanos incluem `and`, `or` e `unless`. Podemos usar esses operadores para criar filtros em nossas consultas. Por exemplo, a expressão `foo > 0 and bar == "baz"` selecionará todas as séries temporais que tiverem a métrica foo com valores maiores que 0 e a label bar com valor "baz". Por exemplo:

- Selecionando métricas que correspondem a uma condição específica utilizando a função sum() e a expressão ==:

```bash
sum(up{job="node"} == 1)
```

Essa expressão irá retornar o número de instâncias que correspondem à condição `up{job="node"} == 1`, ou seja, o número de instâncias que estão atualmente em execução.

- Selecionando métricas que correspondem a várias condições utilizando a função `or()`:

```bash
sum(up{job="node"} == 1 or up{job="db"} == 1)
```

Essa expressão irá retornar o número de instâncias que correspondem a uma das duas condições especificadas, ou seja, o número total de instâncias que estão atualmente em execução em qualquer um dos trabalhos "node" ou "db".

- Filtrando métricas usando a função topk() e a expressão =~:

```bash
topk(5, sum(rate(http_requests_total{status_code=~"5.*"}[5m])) by (job))
``` 

Em resumo, o PromQL permite filtrar séries temporais usando operadores booleanos e a cláusula where. Os operadores booleanos são usados para filtrar séries temporais antes da aplicação de funções de agregação, enquanto a cláusula where é usada para filtrar séries temporais após a aplicação de funções de agregação.

### Logical/Set Operators

No PromQL, os operadores lógicos e de conjunto são usados para combinar e manipular séries temporais.

Os operadores lógicos mais comuns incluem:

* `and`: retorna as séries temporais que atendem a todas as condições fornecidas;
* `or`: retorna as séries temporais que atendem a pelo menos uma das condições fornecidas;
* `unless`: retorna as séries temporais que atendem à primeira condição, mas não à segunda.

Por exemplo, a expressão `foo > 0` and `bar == "baz"` selecionará todas as séries temporais que tiverem a métrica foo com valores maiores que 0 e o label bar com valor "baz". Os operadores de conjunto permitem que você combine séries temporais com base em suas identidades de métrica e label. Alguns dos operadores de conjunto mais comuns incluem:

* `union`: retorna a união de duas ou mais séries temporais, ou seja, todas as séries temporais que aparecem em qualquer um dos argumentos;
* `on`: permite especificar quais labels devem ser usados para agrupar as séries temporais;
* `ignoring`: permite especificar quais labels devem ser ignorados ao agrupar as séries temporais;
* `by`: permite agrupar as séries temporais com base em uma ou mais expressões regulares de label.

Por exemplo, a expressão `sum by (instance) (foo)` irá agrupar todas as séries temporais da métrica foo com base em seu label instance e, em seguida, calcular a soma de cada grupo separadamente. Em resumo, os operadores lógicos e de conjunto no PromQL permitem combinar e manipular séries temporais com base em suas métricas e labels. Os operadores lógicos permitem filtrar séries temporais com base em condições, enquanto os operadores de conjunto permitem agrupar e combinar séries temporais com base em suas identidades de métrica e label.

---

## PromQL na prática

Acesse o https://prometheus.demo.do.prometheus.io/ onde contém um servidor Prometheus hospedado pela comunidade. Em seguida, execute a seguinte Query:

```bash
100 * (1 - ((avg_over_time(node_memory_MemFree_bytes[10m]) + avg_over_time(node_memory_Cached_bytes[10m]) + 
avg_over_time(node_memory_Buffers_bytes[10m])) / avg_over_time(node_memory_MemTotal_bytes[10m])))
```

![img#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/tsdb/ui01.png#center)

O Prometheus acima está coletando métricas de diversos **[targets](https://prometheus.demo.do.prometheus.io/targets)**. A métrica acima, se refere ao **[Node_Exporter](http://demo.do.prometheus.io:9100/metrics)**. Isto é, sao métricas de Sistema Operacional e Hardware Linux. A Query acima está registrando o consumo médio de memória. Em breve, entrarei em mais detalhes sobre a linguagem de consulta do Prometheus o **PromQL**, bem como os mais diversos tipos e formas de expor métricas de SO, apps etc... Por hora, vamos focar em um overview detalhado da ferramenta. Com a interface do Prometheus aberta em seu navegador, vá até a aba **GRAPH**. O Prometheus é focado no que está acontecendo agora em vez de rastrear dados ao longo de semanas ou meses. Isso se baseia na premissa de que a maioria das consultas e alertas de monitoramento são gerados a partir de dados recentes, geralmente, com menos de um dia. O Prometheus é responsável por armazenar suas métricas como dados de séries temporais, isto é, ao longo do tempo:

![img#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/tsdb/timeseries01.png#center)

As métricas são armazenadas com o registro de data/hora, juntamente com pares de valores-chave opcionais chamados labels. Entenda labels como filtros que você aplica para trazer dados mais precisos a cerca de um ou mais endpoints. As métricas desempenham um papel importante para entender o comportamento da sua aplicação. Métricas são medidas de componentes de software ou hardware. Para tornar uma métrica útil, acompanhamos seu estado, geralmente registrando data points ao longo do tempo. Esses data points ou pontos de dados, são chamados de **observations** como mostra a imagem a seguir:

![img#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/tsdb/observation.png#center)

Um observation (o potinho no gráfico), consiste em um registro de data/hora bastante preciso em milissegundos e um valor float64. Uma coleção de observations registrados ao longo do tempo, é o que é denominado de série temporal. Um ou mais quadros atuais, ou seja, as séries temporais que voce está analizando atualmente, por sua vez, é chamado de **samples**:

![img#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/tsdb/samples01.png#center)

Experimente executar cada uma das métricas abaixo em seu devido contexto:

### CPU Usage

- Uso médio da CPU nos últimos 5 minutos:

```bash
avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100

```
Essa expressão calcula a taxa de variação média do tempo de CPU ocioso nos últimos 5 minutos e, em seguida, a converte em uma porcentagem do tempo total da CPU. Isso pode ser útil para monitorar a utilização geral da CPU em um host.

- Uso da CPU por processo:

```bash
100 - avg by (process) (irate(process_cpu_seconds_total{process!="prometheus"}[5m])) * 100
```
Essa expressão calcula a taxa de variação média do tempo de CPU gasto por cada processo nos últimos 5 minutos e, em seguida, a converte em uma porcentagem do tempo total da CPU. Isso pode ser útil para monitorar a utilização da CPU por processos específicos.

- Uso da CPU por processo em um determinado host:

```bash
100 - avg by (process) (irate(process_cpu_seconds_total{process!="prometheus", instance="hostname:9100"}[5m])) * 100
```

Essa expressão é semelhante ao exemplo 2, mas é usada para monitorar o uso da CPU por processo em um host específico (substitua "hostname" pelo nome do host). A condição "instance = 'hostname:9100'" é usada para filtrar as métricas apenas para o host especificado.

### Memória

- Porcentagem de memória usada

```bash
100 - ((node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100)
```

Existem alguns padrões comuns de consulta em PromQL que podem ser úteis para monitorar o estado do sistema ou para solucionar problemas específicos. Abaixo estão alguns exemplos de padrões de consulta comuns em PromQL:

* **Monitoramento de métricas específicas**: para monitorar uma métrica específica, você pode usar uma consulta simples como metric_name. Por exemplo, `cpu_usage` retornará a série temporal correspondente à métrica `cpu_usage`.
* **Agregação por labels**: para agrupar as métricas por labels, você pode usar o operador `by`. Por exemplo, `sum by (instance) (cpu_usage)` retornará a soma da métrica cpu_usage agrupada por cada valor exclusivo do label instance.
* **Cálculos de taxa de variação**: para calcular a taxa de variação de uma métrica, você pode usar a função `rate()`. Por exemplo, `rate(http_requests_total[5m])` retornará a taxa de variação média dos últimos 5 minutos da métrica `http_requests_total`.
* **Cálculos percentuais**: para calcular uma porcentagem de uma métrica, você pode usar a função `100 * (metric_a / metric_b)`. Por exemplo, `100 * (http_requests_success / http_requests_total)` retornará a porcentagem de solicitações HTTP bem-sucedidas em relação ao total de solicitações HTTP.
* **Busca por padrões em labels**: para pesquisar por padrões em labels, você pode usar a função `=~`. Por exemplo, `metric_name{label_name =~ "pattern"}` retornará todas as séries temporais que contêm um label cujo valor corresponde ao padrão especificado.
* **Análise de anomalias**: para identificar anomalias em uma métrica, você pode usar funções como `absent()` e `changes()`. Por exemplo, `absent(metric_name[5m])` retornará uma série temporal que é não vazia se a métrica especificada não for reportada por pelo menos 5 minutos. Já `changes(metric_name[5m])` retornará uma série temporal que indica a frequência com que a métrica mudou nos últimos 5 minutos.

Aqui estão algumas armadilhas comuns que você deve estar ciente ao trabalhar com PromQL:

* **Agregação**: ao agregar métricas, é importante lembrar que a ordem das operações pode afetar o resultado. Por exemplo, a consulta `sum(rate(metric_name[1m]))` retornará uma taxa de variação média para cada série temporal de métrica e, em seguida, somará todas as taxas de variação. Por outro lado, a consulta `rate(sum(metric_name[1m]))` retornará a taxa de variação média da soma de todas as séries temporais de métrica.
* **Limite a partir de uma métrica**: ao definir um limite com base em uma métrica, é importante considerar a natureza do valor da métrica. Por exemplo, se você estiver monitorando a latência de uma solicitação HTTP e quiser definir um limite com base nessa métrica, poderá estar interessado apenas nos valores acima de um determinado limiar. No entanto, se a métrica incluir valores negativos (o que pode acontecer devido a flutuações aleatórias), o limite não será eficaz.
* **Combinando condições de alerta**: ao definir condições de alerta, é importante considerar como as condições se combinam. Por exemplo, se você tiver duas condições, uma para o valor da métrica acima de um limite e outra para o valor da métrica abaixo de outro limite, isso poderá resultar em alertas falsos se a métrica flutuar em torno do valor limite.
* **Encontrando grandes métricas**: se você tiver muitas métricas em seu sistema, pode ser difícil encontrar as métricas mais importantes para monitorar. Uma abordagem comum é classificar as métricas por importância ou impacto no sistema. Isso pode ser feito usando uma combinação de critérios, como frequência de uso, tamanho do impacto e criticidade para o sistema.

---

## Referências

* **Documentação oficial do Prometheus**: https://prometheus.io/docs/prometheus/latest/querying/basics/
* **Livro "Prometheus**: Up & Running" de Brian Brazil (O'Reilly Media, 2018)
* **Curso online "Monitoring and Alerting with Prometheus" da Udemy**: https://www.udemy.com/course/monitoring-and-alerting-with-prometheus/
* **Blog da empresa Robust Perception**: https://www.robustperception.io/blog/
* **Documentação do Grafana, que utiliza PromQL para consultas**: https://grafana.com/docs/grafana/latest/datasources/prometheus/