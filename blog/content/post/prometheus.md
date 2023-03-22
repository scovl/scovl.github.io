+++
title = "Prometheus"
description = "Under the hood"
date = 2023-03-19T23:18:18-03:00
tags = ["Prometheus", "Grafana", "Monitoring", "TSDB"]
draft = false
+++


* **[Introdução](#introdução)**
* **[Instalação](#instalação)**
* **[Promtool](#promtool)**
* **[Instrumentação](#instrumentação)**
* **[Alertmanager](#alertmanager)**
* **[PushGateway](#pushgateway)**
* **[Federação](#federação)**
* **[Under the Hood](#under-the-hood)**

## Introdução 

### Prometheus

O Prometheus é uma ferramenta de monitoramento de sistemas e aplicativos open-source. Foi desenvolvida com o objetivo de fornecer uma forma eficiente de coletar, armazenar e analisar métricas de desempenho de sistemas distribuídos. Ele foi projetado para ser escalável, fácil de usar e altamente personalizável. Possui sua própria linguagem de consulta, chamada PromQL, que permite aos usuários criar consultas complexas para analisar os dados de métricas. Ele também possui uma interface web para visualizar e explorar esses dados. Além disso, é compatível com uma variedade de sistemas e aplicativos, incluindo Kubernetes, Docker, e outros sistemas de gerenciamento de contêineres. O Prometheus também é frequentemente usado em conjunto com outras ferramentas, como Grafana, que fornece recursos avançados de visualização de dados, alertas e análise histórica de dados. 

A ferramenta foi criada por uma equipe de desenvolvedores liderada por Julius Volz na empresa de consultoria de engenharia de software, SoundCloud, em 2012. No entanto, em 2016, a equipe do Prometheus foi transferida para a **[Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/)**, uma organização sem fins lucrativos que abriga projetos de código aberto para sistemas nativos da nuvem. A CNCF agora é a responsável pelo desenvolvimento e manutenção do projeto Prometheus.

> **NOTA**: Leia mais sobre PromQL em **[Aqui](https://lobocode.github.io/2023/03/19/promql/)**.

### Tipos de métricas

O Prometheus suporta quatro tipos principais de métricas: Counter, Gauge, Histogram e Summary:

* **Counter:** São métricas que representam um valor crescente ao longo do tempo, como o número de solicitações recebidas por um servidor. Os contadores nunca diminuem, exceto quando redefinidos manualmente. Por exemplo, você pode usar a função `increase()` para calcular a taxa de incremento de um contador.
* **Gauge**: São métricas que representam um valor arbitrário em um determinado momento, como o uso de CPU. Os valores dos indicadores podem aumentar ou diminuir ao longo do tempo e não têm um valor mínimo ou máximo definido. As funções mais comuns para os indicadores são `sum()`, `avg()` e `min()` e `max()`.
* **Histogram:** São métricas que calculam a distribuição de valores em um intervalo de tempo, como o tempo de resposta de uma solicitação de rede. Os histogramas são calculados a partir de contadores, em que os valores dos contadores são divididos em intervalos ou buckets de tamanho fixo. As funções `histogram_quantile()` e `irate()` são frequentemente usadas para analisar histogramas.
* **Summary**: São métricas semelhantes a um histogram, mas em vez de contabilizar os valores dos contadores em baldes fixos, calcula a média, o percentil e o número total de valores em um determinado período. É indicado para o cálculo de médias, valores extremos e percentis.

Além desses tipos de métricas, o Prometheus também suporta métricas de estado, que são usadas para indicar se um determinado recurso está `up`,`down`. Essas métricas são geralmente usadas para monitorar a disponibilidade de serviços. 

### Monitoramento pull vs push

Para simplificar o entendimento a cerca de monitoramento Pull vs Push, imagine que você tem um vaso de flores em sua janela. O monitoramento pull é como você ir lá todos os dias para verificar se as flores precisam de água. Você está puxando informações sobre as flores. Já o monitoramento push é como se você tivesse um sistema automático que envia uma mensagem para você quando as flores precisam de água. Neste caso, as informações estão sendo empurradas para você. Tecnicamente, o monitoramento pull é um método no qual um dispositivo ou sistema solicita periodicamente informações de outro dispositivo ou sistema. Ele "puxa" as informações. Por exemplo, em um sistema de monitoramento de rede, um dispositivo de monitoramento pode enviar uma solicitação de status para cada dispositivo na rede a intervalos regulares e armazenar as informações retornadas.

![img#center](images/tsdb/prom-pullvspush.png#center)

Já o monitoramento push é um método no qual um dispositivo ou sistema envia automaticamente informações para outro dispositivo ou sistema sem esperar uma solicitação. Ele "empurra" as informações. Por exemplo, em um sistema de monitoramento de rede, cada dispositivo na rede pode ser configurado para automaticamente enviar informações de status para um dispositivo de monitoramento sempre que houver uma alteração. Em resumo, o monitoramento pull é baseado em solicitação e o monitoramento push é baseado em notificação. O Prometheus usa um sistema chamado "Exporters" para coletar dados de diversos sistemas e aplicativos e envia esses dados para o Prometheus para serem armazenados e analisados (monitoramento pull). O Prometheus não precisa solicitar esses dados, pois eles são enviados automaticamente pelos Exporters. Isso permite que o Prometheus colete dados em tempo real e sem sobrecarregar os sistemas e aplicativos monitorados.

### Arquitetura do Prometheus

A arquitetura do Prometheus torna mais fácil encontrar e obter dados de diferentes pontos de acesso. O servidor Prometheus cuida da coleta e armazenamento das métricas. Ele organiza as tarefas de monitoramento - consultando fontes de dados (conhecidas como "instâncias") em intervalos de tempo predefinidos. As tarefas de monitoramento são configuradas usando uma ou mais diretrizes chamadas "configurações de coleta", gerenciadas por um arquivo de configuração em formato YAML. A imagem abaixo representa a arquitetura do Prometheus:

![img#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/main/post/images/prometheus/arch.png#center)

O ecossistema do Prometheus é composto por diversos componentes, muitos deles opcionais como por exemplo:

* **Servidor principal do Prometheus**: é responsável por raspar (coletar) e armazenar dados de séries temporais. Ele também fornece uma interface de consulta para consultar esses dados.
* **Bibliotecas cliente**: são usadas para adicionar instrumentação (métricas) ao código da aplicação, facilitando a coleta de informações pelo Prometheus.
* **Gateway de envio (Push Gateway)**: permite o suporte a trabalhos de curta duração, já que o Prometheus utiliza um modelo de coleta "pull". O gateway de envio recebe métricas desses trabalhos e as armazena temporariamente até que o Prometheus as colete.
* **Exportadores específicos**: são programas que coletam métricas de serviços como HAProxy, StatsD, Graphite, entre outros, e as convertem para o formato compatível com o Prometheus. Isso facilita o monitoramento desses serviços.
* **Gerenciador de alertas (Alertmanager)**: é responsável por tratar os alertas. O Prometheus avalia regras de alerta baseadas nas métricas coletadas e envia notificações ao Alertmanager, que agrupa, silencia e encaminha esses alertas para os canais de notificação adequados, como e-mail, Slack ou PagerDuty.
* **Ferramentas de suporte**: incluem uma variedade de ferramentas que auxiliam no uso e gerenciamento do Prometheus, como painéis de visualização de dados, ferramentas de linha de comando e utilitários para análise e depuração.

### Labels e Samples

Labels são como etiquetas que adicionamos às coisas para identificá-las. Por exemplo, você tem um armário com camisetas e você coloca etiquetas nas camisetas com as cores, tamanhos e tipos delas. Então, se você quer pegar uma camiseta verde, você vai olhar na etiqueta e buscar uma camiseta verde. No Prometheus, labels são usadas para identificar e agrupar diferentes dados de métricas, assim como as etiquetas nas camisetas. Por exemplo, você tem vários computadores e quer monitorar o uso de memória de cada um deles. Você pode adicionar labels como "hostname" e "sistema operacional" para cada dado de métrica, então se você quiser saber o uso de memória de um computador específico, você pode buscar pela label "hostname" dele. Já as Samples são como pequenas amostras de algo. Por exemplo, você está fazendo uma pesquisa sobre quantas balas as crianças gostam de comer e você pede para cada criança escolher uma amostra de 3 balas. Essas 3 balas que cada criança escolheu são as samples. No Prometheus, samples são pequenas medidas de algo que queremos monitorar, como por exemplo, a utilização de CPU de um computador. Cada vez que coletamos uma medida, é criado um sample. Esses samples são armazenados juntos com labels, permitindo que você possa ver como a medida mudou ao longo do tempo. Por exemplo, você pode ver como a utilização de CPU de um computador específico mudou ao longo de um dia.

![img#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/tsdb/samples01.png#center)

## Instalação

Existem inúmeras maneiras de instalar o Prometheus, mas aqui vamos mostrar como instalar o Prometheus usando o Docker e o Docker Compose, Grafana e o PromSim um simulador de métricas para testar o Prometheus e Grafana. Crie um arquivo de configuração do Docker Compose chamado `docker-compose.yml` no mesmo diretório que o arquivo prometheus.yml. Inclua as seguintes configurações:

```yaml
version: "3"

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - "./prometheus.yml:/etc/prometheus/prometheus.yml"
    depends_on:
      - promsim

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3000:3000"

  promsim:
    image: sysdigtraining/promsim:latest
    container_name: promsim
    ports:
      - "8080:8080"

```

Em seguida, crie um arquivo de configuração do Prometheus chamado prometheus.yml no mesmo diretório que o arquivo docker-compose.yml. Inclua as seguintes configurações:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: "promsim"
    static_configs:
      - targets: ["promsim:8080"]
```

No terminal, navegue até o diretório onde você salvou o docker-compose.yml e execute o seguinte comando para iniciar os serviços:

```bash
docker-compose up -d
```

No Grafana, você precisará adicionar o Prometheus como uma fonte de dados (datasource). Faça login no Grafana (usuário padrão: admin, senha: admin), vá para "Configuration" (ícone de engrenagem) e clique em "Data Sources". Adicione uma nova fonte de dados com o tipo Prometheus e use a URL **http://prometheus:9090**. Agora você pode criar painéis no Grafana usando métricas do Prometheus e do PromSim. O PromSim irá gerar métricas simuladas que você pode usar para testar o comportamento do threshold. O PromSim é um simulador de métricas que gera métricas aleatórias para testar o Prometheus. Para mais informações sobre o PromSim, consulte a documentação oficial em **https://github.com/dmitsh/promsim**.

Se você quiser instalar somente o Prometheus, basta rodar `docker run -p 9090:9090 prom/prometheus`. Você pode acessar a interface web do Prometheus em **http://localhost:9090**. Para mais informações sobre como instalar o Prometheus, consulte a documentação oficial do Prometheus em **https://prometheus.io/docs/prometheus/latest/getting_started/**.

![img#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/tsdb/ui01.png#center)

A interface do Prometheus é composta pelos seguintes menus:

* **Alerts**: este menu exibe todos os alertas ativos e permite visualizar o histórico de alertas. Os alertas são disparados quando uma determinada métrica ultrapassa um limite configurado.
* **Graph**: este menu permite criar e visualizar gráficos de métricas coletadas pelo Prometheus. O usuário pode definir a escala do eixo X e Y, bem como personalizar a aparência do gráfico.
* **Status**: este menu exibe o status atual do Prometheus, incluindo informações sobre as métricas coletadas, alertas ativos e configurações do sistema.
* **Help**: este menu fornece informações úteis sobre o Prometheus, incluindo documentação, exemplos de consulta e informações de contato da equipe de suporte.
* **Classic UI**: este menu oferece uma interface alternativa para visualização de métricas, com recursos adicionais em comparação com a interface padrão.

Além disso, a interface do Prometheus contém as seguintes opções:

* **Use local time**: essa opção permite que o usuário visualize as métricas em seu fuso horário local em vez do horário do servidor.
* **Enable query history**: essa opção permite que o usuário acesse o histórico de consultas que foram executadas anteriormente.
* **Enable autocomplete**: essa opção permite que o usuário obtenha sugestões de consulta enquanto digita no campo de consulta.
* **Campo de consulta**: este é o campo onde o usuário pode inserir consultas PromQL para recuperar métricas específicas.
* **Campo Table e Graph**: este campo permite que o usuário selecione entre exibir o resultado da consulta como uma tabela ou um gráfico.
* **Evaluation time**: este campo permite que o usuário especifique o período de tempo para o qual as métricas devem ser recuperadas pela consulta.

### Configuração

No geral a estrutura de diretórios do Prometheus é a seguinte:

```bash
/opt/prometheus/
├── console_libraries/
│   ├── prom.lib.js
│   ├── react-16.8.3.production.min.js
│   └── ...
├── consoles/
│   ├── index.html
│   ├── queries_range.html
│   └── ...
├── prometheus
├── prometheus.yml
├── promtool
└── ...
```
Pode variar a depender da versão, mas a estrutura acima é a mais comum. Os arquivos `prometheus` e `promtool` são os binários do Prometheus e do promtool, respectivamente. O diretório `console_libraries` contém bibliotecas JavaScript que são usadas para renderizar a interface do Prometheus. O diretório `consoles` contém arquivos HTML que são usados para renderizar a interface do Prometheus. O arquivo `prometheus.yaml` é o arquivo onde são definidas as configurações de scrape (coleta) de métricas dos alvos a serem monitorados, regras de alerta, entre outras configurações. Um exemplo de arquivo prometheus.yaml default pode ser algo parecido com isso:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
```
Nesse exemplo, temos duas seções no arquivo de configuração:

* **global**: define as configurações globais do Prometheus, como a frequência de coleta de métricas (scrape_interval), que neste caso é de 15 segundos.
* **scrape_configs**: define as configurações de coleta de métricas para os alvos a serem monitorados. Neste caso, temos apenas um job (trabalho) definido, chamado prometheus, que monitora o próprio servidor do Prometheus na porta 9090. Para adicionar um sistema genérico ao prometheus.yaml, é necessário criar uma nova configuração de scrape. Por exemplo, suponha que temos um sistema com a aplicação web em execução na porta 8080. Podemos adicionar essa configuração de scrape da seguinte forma:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'my-app'
    static_configs:
      - targets: ['my-app:8080']

```

Neste exemplo, foi criado um novo job chamado `my-app` que monitora o sistema genérico na porta `8080`. O `static_configs` define os alvos a serem monitorados, que neste caso é o sistema `my-app` na porta `8080`. Caso você deseje adicionar uma ou mais máquinas, recomendo que faça isso apontando para arquivos externos `.json` ao Prometheus. Para tal, podemos utilizar o mecanismo de discovery de arquivos estáticos. O discovery de arquivos estáticos permite ao Prometheus carregar dinamicamente configurações de scrape a partir de arquivos `.json` que contêm informações sobre os alvos a serem monitorados. Por exemplo:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'my-app'
    file_sd_configs:
      - files:
        - /path/to/targets.json
```

No exemplo acima, foi criado um novo job chamado `my-app`, que usará o discovery de arquivos estáticos para buscar os alvos a serem monitorados a partir do arquivo `/path/to/targets.json`. A seção `file_sd_configs` define as configurações para o discovery de arquivos estáticos, que neste caso é apenas o arquivo targets.json. O arquivo targets.json deve estar no seguinte formato:

```yaml
[
  {
    "labels": {
      "job": "my-app",
      "env": "production"
    },
    "targets": [
      "my-app1:8080",
      "my-app2:8080"
    ]
  }
]
```

Cada objeto tem uma chave labels que contém um objeto com rótulos adicionais para os alvos (neste exemplo, os rótulos são job e env), e uma chave targets que contém uma lista de alvos a serem monitorados. O job my-app terá dois alvos a serem monitorados: my-app1:8080 e my-app2:8080. Esses alvos terão os rótulos job e env definidos como my-app e production, respectivamente.

> **Observação**: o discovery de arquivos estáticos é apenas um dos vários mecanismos de descoberta disponíveis no Prometheus. Para obter uma lista completa de mecanismos de descoberta, consulte a documentação oficial do Prometheus.

## Promtool

O promtool é uma ferramenta de linha de comando que fornece várias funcionalidades para ajudar a verificar a sintaxe de arquivos de configuração do Prometheus, como o arquivo prometheus.yaml. Para verificar a sintaxe de um arquivo de configuração, basta executar o seguinte comando:

```bash
promtool check config /path/to/prometheus.yaml
```

O promtool também permite validar a sintaxe das regras de alerta definidas no arquivo de configuração do Prometheus. Para isso, basta usar o seguinte comando:

```bash
promtool check rules /path/to/prometheus.yaml
```

É possível também validar a sintaxe dos arquivos de registro de métricas antes de serem importados pelo Prometheus. Para isso, basta usar o seguinte comando:

```bash
promtool check metrics /path/to/metrics.json
```

Além disso, podemos métricas entre diferentes formatos, como JSON e texto simples. Por exemplo, para converter um arquivo de registro de métricas de formato texto para formato JSON, use o seguinte comando:

```bash
$ promtool convert metrics --from=txt --to=json <arquivo_de_registro_de_metricas>

```

O promtool pode ser usado para validar a integridade do armazenamento de métricas, ajudando a detectar problemas comuns, como blocos de registro corrompidos. Para isso, use o seguinte comando:

```bash
promtool tsdb check /path/to/data/dir
```

Essas são apenas algumas das funcionalidades do promtool. Ele pode ser uma ferramenta muito útil para garantir a qualidade do seu ambiente de monitoramento com Prometheus.

## Instrumentação

A instrumentação é um processo crucial para coletar dados de desempenho e monitorar sistemas em tempo real. No contexto do Prometheus, existem dois tipos principais de instrumentação: direta e indireta.

* **A instrumentação direta** envolve a coleta de métricas diretamente de um aplicativo ou serviço, usando bibliotecas ou frameworks específicos. Isso permite que os desenvolvedores definam as métricas que são importantes para o seu aplicativo ou serviço e coletem informações específicas, como tempo de resposta de uma chamada de API ou a quantidade de memória usada.

* **A instrumentação indireta** envolve a coleta de métricas de sistemas de terceiros, como servidores de banco de dados ou balanceadores de carga. Isso pode ser feito usando plugins ou exporters que se comunicam com o sistema externo e traduzem as métricas em um formato que o Prometheus possa entender.

Ambos os tipos de instrumentação são importantes para obter insights precisos e valiosos sobre o desempenho do sistema. A instrumentação direta fornece dados específicos e granulares sobre o desempenho do aplicativo ou serviço, enquanto a instrumentação indireta permite monitorar o sistema como um todo e identificar gargalos e problemas em componentes externos.

### Instrumentação indireta

### Exporters

O Prometheus é compatível com uma variedade de sistemas e aplicativos, incluindo Kubernetes, Docker, e outros sistemas de gerenciamento de contêineres. Para coletar métricas de desempenho desses sistemas e aplicativos, você pode usar exporters, que são projetados para coletar dados de métricas de fontes específicas, como sistemas operacionais, redes e aplicativos. Isso permite que os usuários coletem métricas de diferentes fontes e as analisem de forma integrada. O Prometheus possui uma série de exporters nativos, que são projetados para coletar métricas de desempenho de sistemas e aplicativos específicos. Esses exporters são projetados para serem fáceis de usar e integrar com o Prometheus. Além disso, você pode usar exporters de terceiros para coletar métricas de desempenho de sistemas e aplicativos específicos. Para mais informações sobre exporters, consulte a documentação oficial do Prometheus em **https://prometheus.io/docs/instrumenting/exporters/**.

### Linux
O node_exporter é um exporter para o Prometheus que permite coletar métricas do sistema operacional Linux. Ele coleta informações sobre o uso de recursos como CPU, memória, disco, rede, entre outros. Ele fornece uma interface HTTP para expor esses dados no formato de métricas Prometheus, que podem ser coletadas pelo Prometheus Server e posteriormente visualizadas e analisadas. O node_exporter é especialmente útil para monitorar hosts Linux e obter uma visão geral do desempenho do sistema operacional. 

Ele pode ser usado para monitorar a utilização de recursos, identificar gargalos de desempenho, detectar problemas de saúde e criar alertas baseados em métricas específicas. O node_exporter também é uma ferramenta popular para monitorar clusters Kubernetes, pois ele pode coletar informações sobre o uso de recursos dentro dos contêineres, ajudando a identificar problemas de recursos e garantir a saúde do cluster. Para mais informações sobre o node_exporter, consulte a documentação oficial do Prometheus em **https://prometheus.io/docs/guides/node-exporter/**.

### Windows

O Windows_exporter é um exporter para o Prometheus que permite coletar métricas do sistema operacional Windows. Ele é uma versão específica para o Windows do node_exporter. Ele coleta informações sobre o uso de recursos como CPU, memória, disco, rede, entre outros. Ele fornece uma interface HTTP para expor esses dados no formato de métricas Prometheus, que podem ser coletadas pelo Prometheus Server e posteriormente visualizadas e analisadas. Para mais informações sobre o Windows_exporter, consulte a documentação oficial do projeto em **https://github.com/prometheus-community/windows_exporter**.

### Blackbox

O Blackbox Exporter é um componente do Prometheus que permite monitorar serviços externos a partir de uma perspectiva externa. Ele funciona realizando requisições `HTTP`, `TCP` e `ICMP` em endpoints específicos, permitindo verificar se esses serviços estão funcionando corretamente. Para mais informações sobre o Blackbox Exporter, consulte a documentação oficial do projeto em **https://github.com/prometheus/blackbox_exporter**.

### Instrumentação direta

### Java

A instrumentação indireta no Prometheus usando Java envolve a adição de código ao seu aplicativo Java para coletar e fornecer dados de métricas ao Prometheus. Isso geralmente é feito adicionando uma biblioteca de instrumentação ao seu aplicativo e configurando-a para se comunicar com o Prometheus. Existem várias bibliotecas de instrumentação disponíveis para coletar métricas em aplicativos Java, como o **[https://micrometer.io/](https://micrometer.io/)**. Aqui está um exemplo de como adicionar o "Prometheus Java client" ao seu aplicativo Java e configurá-lo para coletar métricas de tempo de resposta de uma rota específica:

1. Adicione as dependências Micrometer e Prometheus ao seu projeto. Você pode fazer isso no Maven ou Gradle, adicionando as seguintes linhas ao arquivo de configuração:

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-core</artifactId>
    <version>1.6.6</version>
</dependency>

<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
    <version>1.6.6</version>
</dependency>
```

2. Crie um objeto MeterRegistry para registrar as métricas. Você pode fazer isso criando uma instância de PrometheusMeterRegistry, que é uma implementação do MeterRegistry para o Prometheus:

```java
MeterRegistry registry = new PrometheusMeterRegistry(PrometheusConfig.DEFAULT);
```

3. Adicione contadores, temporizadores, etc. ao MeterRegistry para registrar as métricas. Por exemplo, para criar um contador:

```java
Counter counter = registry.counter("nome_do_contador");
counter.increment();
```


4. Exporte as métricas para o Prometheus. Você pode fazer isso adicionando um PrometheusMeterRegistry ao seu servidor HTTP. Por exemplo, se você estiver usando o Spring Boot, pode adicionar o seguinte código ao seu arquivo de configuração:

```java
@Bean
public MeterRegistryCustomizer<PrometheusMeterRegistry> prometheusRegistryCustomizer(
        PrometheusProperties prometheusProperties) {
    return registry -> {
        CollectorRegistry collectorRegistry = new CollectorRegistry();
        registry.add(new JvmMemoryMetrics());
        registry.add(new JvmGcMetrics());
        registry.add(new ProcessorMetrics());
        registry.add(new UptimeMetrics());
        new JvmThreadMetrics().bindTo(registry);
        new ClassLoaderMetrics().bindTo(registry);
        new DiskSpaceMetrics(new File("/")).bindTo(registry);
        PrometheusMeterRegistry.prometheusRegistry = collectorRegistry;
        new JvmMicrometerPrometheusExporter(collectorRegistry).register();
    };
}
```

Isso adiciona um PrometheusMeterRegistry ao seu aplicativo Spring Boot e registra as métricas com o Prometheus. Verifique as métricas no Prometheus. Você pode acessar as métricas do seu aplicativo Java no Prometheus acessando a URL **[http://seu_aplicativo:porta/metrics](http://seu_aplicativo:porta/metrics)**. As métricas serão exibidas no formato Prometheus, que você pode usar para criar gráficos e alertas.

### JavaScript/Node

A instrumentação indireta no Prometheus usando Node envolve a adição de código ao seu aplicativo Node.js para coletar e fornecer dados de métricas ao Prometheus. Isso geralmente é feito adicionando uma biblioteca de instrumentação ao seu aplicativo e configurando-a para se comunicar com o Prometheus. Existem várias bibliotecas de instrumentação disponíveis para coletar métricas em aplicativos Node.js, como o "prom-client" ou o "node-prom-bundle". Aqui está um exemplo de como adicionar o "prom-client" ao seu aplicativo Node.js e configurá-lo para coletar métricas de tempo de resposta de uma rota específica:

Instale o "prom-client" usando o npm:

```javascript
npm install prom-client
```

No código da sua classe principal, importe a biblioteca e crie um objeto "Counter" para armazenar as métricas de tempo de resposta:

```javascript
const promClient = require('prom-client');
const responseTime = new promClient.Counter({
    name: 'myapp_response_time_seconds',
    help: 'Response time in seconds'
});
```

Na rota específica que você deseja monitorar, adicione código para medir o tempo de resposta e atualizar o contador:

```javascript
app.get("/example", (req, res) => {
    const start = process.hrtime();
    // ... your code here ...
    responseTime.inc({route: 'example'}, process.hrtime(start)[1] / 1e9);
    res.send("Hello, World!");
});
```

Inicie um servidor HTTP na porta 9091 para expor as métricas:

```javascript
const http = require('http');
http.createServer((req, res) => {
    res.setHeader('Content-Type', promClient.register.contentType);
    res.end(promClient.register.metrics());
}).listen(9091);
```

Configure o Prometheus para "scrape" as métricas no endereço **http://localhost:9091/metrics**

Dessa forma, você estará coletando e fornecendo dados de métricas de tempo de resposta para o Prometheus, permitindo monitorar o desempenho da sua rota específica. É possível adicionar mais métricas como essa para monitorar outras partes do seu aplicativo, como o uso de CPU, memória, número de requisições e outros. Além disso, é importante notar que, além de coletar métricas, também é possível criar alertas no Prometheus com base nas métricas coletadas, permitindo que você seja notificado quando determinadas condições de métricas forem atingidas. Isso pode ser feito criando regras de alerta no arquivo de configuração do Prometheus, especificando quais métricas devem ser monitoradas e quais condições devem ser atendidas para disparar o alerta. É possível também usar outros sistemas como o Alertmanager para gerenciar esses alertas e notificações.

### Python

A instrumentação indireta no Prometheus usando Python envolve a adição de código ao seu aplicativo Python para coletar e fornecer dados de métricas ao Prometheus. Isso geralmente é feito adicionando uma biblioteca de instrumentação ao seu aplicativo e configurando-a para se comunicar com o Prometheus. Existem várias bibliotecas de instrumentação disponíveis para coletar métricas em aplicativos Python, como o "prometheus_client" ou o "py-prometheus-client". Aqui está um exemplo de como adicionar o "prometheus_client" ao seu aplicativo Python e configurá-lo para coletar métricas de tempo de resposta de uma rota específica:

Instale o "prometheus_client" usando o pip:

```python
pip install prometheus_client
```

No código da sua classe principal, importe a biblioteca e crie um objeto "Counter" para armazenar as métricas de tempo de resposta:

```python
from prometheus_client import Counter

response_time = Counter('myapp_response_time_seconds', 'Response time in seconds')
```

Na rota específica que você deseja monitorar, adicione código para medir o tempo de resposta e atualizar o contador:

```python
import time

@app.route("/example")
def example():
    start_time = time.time()
    # ... your code here ...
    response_time.labels(route='example').inc(time.time() - start_time)
    return "Hello, World!"
```

Inicie o servidor de métricas no seu aplicativo, geralmente na porta 9090:

```python
from prometheus_client import start_http_server

if __name__ == '__main__':
    start_http_server(9090)
    app.run()
```

Configure o Prometheus para "scrape" as métricas no endereço http://localhost:9090/metrics. 

Dessa forma, você estará coletando e fornecendo dados de métricas de tempo de resposta para o Prometheus, permitindo monitorar o desempenho da sua rota específica. É possível adicionar mais métricas como essa para monitorar outras partes do seu aplicativo, como o uso de CPU, memória, número de requisições e outros. Além disso, é importante notar que, além de coletar métricas, também é possível criar alertas no Prometheus com base nas métricas coletadas, permitindo que você seja notificado quando determinadas condições de métricas forem atingidas. Isso pode ser feito criando regras de alerta no arquivo de configuração do Prometheus, especificando quais métricas devem ser monitoradas e quais condições devem ser atendidas para disparar o alerta.

### Ferramentas legadas e privadas

Muitas vezes temos sistemas e serviços legados ou ferramentas fechadas que não fornecem suas métricas em um formato compatível com o Prometheus. Nesses casos, existem algumas soluções possíveis para monitorá-los com o Prometheus:

* **Bridge**: outra opção é utilizar bridges, que são programas que atuam como intermediários entre o Prometheus e as ferramentas legadas ou fechadas. O bridge coleta as métricas da ferramenta em um formato não compatível com o Prometheus e as converte para um formato compatível antes de disponibilizá-las para o Prometheus.
* **Plugins**: uma terceira opção é utilizar plugins, que são programas que estendem as funcionalidades do Prometheus. Um plugin pode ser desenvolvido para coletar métricas de uma ferramenta específica e disponibilizá-las em um formato compatível com o Prometheus.

## Alertmanager

O Alertmanager é uma ferramenta que trabalha em conjunto com o Prometheus para gerenciar alertas. Ele recebe alertas do Prometheus e os processa de acordo com regras configuradas pelo usuário, como notificações por email, Slack, PagerDuty, entre outras. Basicamente ele funciona como um servidor HTTP que aguarda as notificações de alertas enviadas pelo Prometheus. Quando o Prometheus detecta uma condição de alerta, ele envia uma notificação ao Alertmanager, que então segue as regras de roteamento de alertas configuradas pelo usuário para enviar notificações.

Para configurar o Alertmanager com o Prometheus, é necessário criar um arquivo de configuração `alertmanager.yml` e especificar o endpoint do Alertmanager no arquivo de configuração `prometheus.yml`. O arquivo `alertmanager.yml` contém as regras de roteamento de alertas e configurações de notificação, como os destinatários e as plataformas de notificação. Para mais informações sobre como configurar o Alertmanager, consulte a documentação oficial em https://prometheus.io/docs/alerting/latest/configuration/.

> **Observação**: o Alertmanager não é um componente obrigatório do Prometheus. Ele é uma ferramenta opcional que pode ser usada para gerenciar alertas. Se você não precisar de alertas, não precisa configurar o Alertmanager. Pretendo escrever um outro artigo dedicado ao Alertmanager, então fique ligado!

## PushGateway

PushGateway é um componente adicional do Prometheus que permite que aplicativos e sistemas enviem dados de métricas para o Prometheus sem precisar de um exporter ou client library. Ele funciona como uma "ponte" que recebe os dados enviados pelos aplicativos e os repassa para o Prometheus Server. O PushGateway é útil em situações em que os aplicativos ou sistemas não podem ser modificados para incluir suporte nativo ao Prometheus, ou quando os aplicativos são temporários e não precisam ser monitorados continuamente. Ele também é útil para coletar métricas de scripts e tarefas cron. Ao mesmo tempo, é importante notar que o **PushGateway não é projetado para ser usado como solução de longo prazo para monitoramento**, já que ele não armazena dados por muito tempo e não suporta a funcionalidade de alertas do Prometheus. Ele é melhor usado em conjunto com outras ferramentas de monitoramento ou como uma solução temporária.

## Federação

A Federação no Prometheus é um recurso que permite que várias instâncias do Prometheus sejam agrupadas e gerenciadas como uma única instância. Isso é útil quando você tem vários sistemas ou aplicativos que precisam ser monitorados, mas quer gerenciar esses dados de métricas de forma centralizada. A Federação funciona criando uma hierarquia de instâncias do Prometheus, onde cada instância é chamada de "federada" ou "filha" e uma instância é chamada de "federadora" ou "pai". A instância "federadora" é responsável por coletar dados de métricas de todas as instâncias "federadas" e agrupá-los em um único local. No entanto, em alguns casos, o uso da Federação pode causar problemas. Abaixo uma melhor explicação sobre estes pontos:

* **Grande volume de dados**: Se você estiver lidando com um grande volume de dados, a Federação pode sobrecarregar a instância central do Prometheus, já que todas as métricas são coletadas de várias instâncias e armazenadas na instância central. Isso pode levar a problemas de desempenho e latência.
* **Aumento da complexidade**: A configuração e manutenção de uma estrutura federada pode ser complexa, especialmente se você tiver várias instâncias do Prometheus e hierarquias diferentes. Isso pode tornar a solução difícil de gerenciar e manter, aumentando a chance de erros e problemas de configuração.
* **Dependência de rede**: A Federação exige uma conexão de rede estável e confiável entre as instâncias do Prometheus. Se a rede entre as instâncias for instável ou lenta, a coleta e consolidação das métricas pode ser afetada, causando atrasos ou perda de dados.
* **Escalabilidade limitada**: A Federação pode não ser a melhor opção para ambientes de grande escala, com muitos serviços e instâncias do Prometheus. Nesse cenário, a instância central pode se tornar um gargalo e limitar a escalabilidade geral do sistema de monitoramento.
* **Segurança**: A Federação requer que as instâncias do Prometheus se comuniquem entre si e compartilhem dados. Isso pode aumentar a superfície de ataque e potencialmente expor informações sensíveis, caso as medidas adequadas de segurança não sejam implementadas.

> **NOTA**: Em um outro artigo pretendo escrever sobre como resolver o problema de federação potencializando o Prometheus com outras técnologias, fique ligado!

## Under the Hood

A pasta raiz do Prometheus contém vários arquivos de configuração e dados. Os arquivos mais comuns incluem:

* **prometheus.yml:** Este é o arquivo de configuração principal do Prometheus. Ele contém configurações como endereços de coleta de dados, regras de alerta e configurações de armazenamento.
* **alert.rules:** Este arquivo contém regras de alerta que o Prometheus usa para gerar alertas quando as métricas atenderem a certas condições.
* **scrape_configs:** Este arquivo contém configurações de coleta de dados que o Prometheus usa para coletar métricas de diferentes fontes.
* **rules.yml:** Este arquivo contém as regras de processamento de métricas do Prometheus. Ele especifica como o Prometheus deve processar as métricas coletadas.
* **data:** Esta pasta contém os dados de métricas coletadas pelo Prometheus. Isso inclui arquivos como o banco de dados de métricas e arquivos de registro.

Além desses arquivos, a pasta raiz do Prometheus também pode conter outros arquivos de configuração e dados, dependendo da configuração do Prometheus.  A pasta **/data** no Prometheus é usada para armazenar todos os dados coletados pelo Prometheus. Ela contém várias pastas, como **WAL, chunks_head,** que são usadas para armazenar diferentes tipos de dados. Exemplo:

```bash
./data
├── 01BKGV7JBM69T2G1BGBGM6KB12
│   └── meta.json
├── 01BKGTZQ1SYQJTR4PB43C8PD98
│   ├── chunks
│   │   └── 000001
│   ├── tombstones
│   ├── index
│   └── meta.json
├── 01BKGTZQ1HHWHV8FBJXW1Y3W0K
│   └── meta.json
├── 01BKGV7JC0RY8A6MACW02A2PJD
│   ├── chunks
│   │   └── 000001
│   ├── tombstones
│   ├── index
│   └── meta.json
├── chunks_head
│   └── 000001
└── wal
    ├── 000000002
    └── checkpoint.00000001
        └── 00000000
```

* **WAL** - (Write Ahead Log) é o arquivo de log onde o Prometheus escreve todas as atualizações de dados antes de atualizar o banco de dados principal. Ele é usado para garantir a consistência e recuperação dos dados armazenados pelo Prometheus. Abaixo está um exemplo de como os dados são armazenados no WAL:

```bash
prometheus
└── wal
    ├── 0
    │   ├── index
    │   ├── segments
    │   ├── tombstones
    │   └── wal
    ├── 1
    │   ├── index
    │   ├── segments
    │   ├── tombstones
    │   └── wal
    └── ...  
```

Para simplificar ainda mais, imagine que o Prometheus é um cofre, e dentro dele temos muitas coisas importantes, como números e informações sobre o seu computador ou até mesmo sobre sua casa. Agora, imagine que toda vez que você adiciona algo novo no seu cofre, como por exemplo, a temperatura da sua casa, é preciso escrever esse novo número em um diário, para sempre ter registro dele e poder acessá-lo depois. Esse diário é o que chamamos de WAL (Write Ahead Log) do Prometheus. Ele é como um diário onde o Prometheus escreve tudo o que ele coleta e guarda essas informações, para que possamos acessá-las depois. Assim como o diário precisa ser guardado em algum lugar seguro, o WAL também precisa ser guardado em um lugar seguro, para que não possa ser perdido ou danificado. Isso garante que todas as informações importantes sejam sempre salvas e possam ser acessadas quando precisarmos delas.

* **chunks_head** - é a pasta onde o Prometheus armazena os principais dados de métricas coletadas. Ela contém pastas com nomes numéricos, cada uma corresponde a uma série de métricas. Dentro de cada pasta, encontra-se outras pastas como chunks, tombstones e arquivos como meta.json e index.
* **chunks** - é a pasta onde o Prometheus armazena os dados de métricas coletadas em um formato compactado. Cada arquivo dentro dessa pasta representa um período de tempo específico.
* **tombstones** - é a pasta onde o Prometheus armazena informações sobre métricas que foram removidas do banco de dados. Isso é usado para garantir que essas métricas não sejam incluídas na recuperação do banco de dados.
* **meta.json** - é um arquivo que contém informações sobre a série de métricas, incluindo o nome, labels e outras informações relevantes.
* **index** - é um arquivo que contém um índice dos dados de métricas armazenados no banco de dados. Isso é usado para permitir que o Prometheus localize rapidamente os dados desejados.

Tomando a pasta **01BKGTZQ1SYQJTR4PB43C8PD98** como exemplo, que é um ID de bloco, observe que existe a seguinte estrutura:

```bash
├── chunks
│   └── 000001
├── tombstones
├── index
└── meta.json
```


O arquivo meta.json é usado para armazenar metadados dos séries de dados que o Prometheus está rastreando. Ele contém informações como o nome do arquivo e o intervalo de tempo dos dados armazenados, bem como outras informações relevantes para o funcionamento interno do Prometheus. Os itens específicos dentro do arquivo meta.json podem variar dependendo da configuração específica do Prometheus e do tipo de série de dados que está sendo rastreada. Vamos aos detalhes:

```bash
{
    "ulid": "01BKGTZQ1SYQJTR4PB43C8PD98",
    "minTime": 1602237600000,
    "maxTime": 1602244800000,
    "stats": {
        "numSamples": 553673232,
        "numSeries": 1346066,
        "numChunks": 4440437
    },
    "compaction": {
        "level": 1,
        "sources": [
            "01EM65SHSX4VARXBBHBF0M0FDS",
            "01EM6GAJSYWSQQRDY782EA5ZPN"
        ]
    },
    "version": 1
}
```

* **ulid:** é um identificador único gerado para cada arquivo meta.json. É usado para identificar de forma única cada série de dados armazenada pelo Prometheus.
* **minTime e maxTime:** são os intervalos de tempo de início e fim dos dados armazenados no arquivo meta.json. Eles são usados para determinar o período de tempo para o qual os dados armazenados no arquivo são válidos.
* **stats:** é um objeto que contém estatísticas sobre o uso de memória do arquivo meta.json, incluindo o tamanho do arquivo, o número de séries de dados armazenadas e o número de amostras de dados.
* **numSamples:** é o número de amostras de dados armazenadas no arquivo meta.json.
* **numSeries:** é o número de séries de dados armazenadas no arquivo meta.json.
* **numChunks:** é o número de chunks de dados (grupos de amostras de dados) armazenados no arquivo meta.json.
* **compaction:** é um objeto que contém informações sobre a compactação dos dados armazenados no arquivo meta.json.
* **level:** é o nível de compactação dos dados armazenados no arquivo meta.json.
* **sources:** é um array que contém informações sobre as fontes dos dados armazenados no arquivo meta.json.
* **version:** é a versão do arquivo meta.json. É usado para garantir compatibilidade com versões futuras do Prometheus.

A pasta "chunks" dentro da pasta 01BKGTZQ1SYQJTR4PB43C8PD98 dentro do diretório /data do Prometheus é usada para armazenar os chunks de dados (grupos de amostras de dados) para cada série de dados que o Prometheus está rastreando. Cada arquivo dentro dessa pasta representa um chunk de dados único, e o nome do arquivo contém informações sobre o intervalo de tempo e a série de dados a qual ele pertence. Os arquivos de chunks são gerados pelo processo de compactação do Prometheus. Eles são criados quando o Prometheus precisa remover dados antigos para liberar espaço e continuar coletando novos dados. 

Esses chunks são usados para a recuperação dos dados e para realizar consultas no futuro. Os arquivos contidos dentro dessa pasta são codificados e compactados de forma a ocupar menos espaço e são lidos pelo Prometheus para responder consultas e exibir gráficos. Já o arquivo index, contém o índice dos chunks de dados armazenados na pasta "chunks" da mesma pasta. O índice é usado para permitir que o Prometheus rápida e eficientemente localize os chunks de dados relevantes para uma consulta específica. Esse arquivo contém informações sobre as séries de dados, o intervalo de tempo dos dados, o nome do arquivo de chunk correspondente, e outras informações relevantes. O Prometheus usa essas informações para saber onde procurar os dados quando uma consulta é realizada, permitindo que ele responda rapidamente.

### Gerenciamento de memória pelo Prometheus

![img#center](images/tsdb/prom-mem01.png#center)
<small style="text-align:center;"><b>Imagem 1.1</b></small>

A imagem 1.1 acima representa o Prometheus quando usa muita memória RAM e memória em disco devido a natureza dos dados que ele coleta e armazena. Como ele armazena métricas de forma temporal (time series), ele precisa manter uma grande quantidade de dados em memória para que essas métricas possam ser consultadas rapidamente. Isso é especialmente importante quando ele precisa responder a consultas de alertas ou gráficos em tempo real. Além disso, Prometheus usa uma estratégia de sliding window para descartar métricas antigas que já não são consideradas relevantes. Isso significa que ele precisa manter uma grande quantidade de dados em memória para garantir que as métricas mais recentes possam ser acessadas rapidamente. Por outro lado, Prometheus usa muita memória em disco para armazenar esses dados de forma persistente, o que permite que os dados sejam recuperados mesmo depois de um reinício do sistema. Isso também permite que os dados sejam consultados novamente em um momento posterior, mesmo que não estejam mais disponíveis na memória. O Prometheus precisa de uma grande quantidade de memória RAM e memória em disco para garantir que os dados possam ser coletados, armazenados e consultados de forma eficiente e rápida.

![img#center](images/tsdb/prom-mem02.png#center)
<small style="text-align:center;"><b>Imagem 1.2</b></small>

Como bem mostra a Imagem 1.2 acima, quanto mais dias de dados são armazenados, mais memória e espaço em disco serão necessários para armazená-los. Isso pode levar a problemas de performance, pois aumenta a quantidade de dados que precisam ser carregados e processados para responder a consultas. Além disso, como os dados antigos tendem a ser menos relevantes, isso pode levar a problemas de escalabilidade, pois os dados antigos podem acabar consumindo muitos recursos de armazenamento e processamento, dificultando a capacidade de Prometheus de lidar com novos dados. Além disso, é importante considerar que o objetivo do Prometheus é fornecer uma visão em tempo real do sistema, então manter muitos dias de dados pode não ser tão útil para detectar problemas recentes ou tendências atuais no sistema, e pode acabar fazendo com que os dados relevantes sejam enterrados em meio a grande quantidade de dados antigos. Por essas razões, é recomendado manter apenas uma quantidade de dias de dados que seja suficiente para as necessidades de monitoramento do seu sistema, e não mais do que isso. É possível configurar o Prometheus para descartar dados antigos de acordo com a necessidade, e também é possível armazenar os dados históricos em outro sistema de armazenamento para análise futura.

![img#center](images/tsdb/prom-mem03.png#center)
<small style="text-align:center;"><b>Imagem 1.3</b></small>

Como mostra na Imagem 1.3 acima, o Prometheus utiliza a memória principal do host Linux para armazenar todas as métricas coletadas. Essas métricas são mantidas em memória para permitir uma consulta rápida e eficiente pelos usuários. Nesse processo é usado o modelo de coleta ativa, ou seja, é responsabilidade do próprio Prometheus coletar as métricas dos serviços e aplicativos em execução. Isso significa que o Prometheus precisa gerenciar as métricas de cada alvo e garantir que elas estejam disponíveis para consulta. Para manter as métricas em memória, o Prometheus utiliza um buffer de gravação em disco para evitar perda de dados. Quando a memória RAM fica cheia, as métricas mais antigas são gravadas no buffer de gravação em disco. Esse buffer é dimensionado automaticamente de acordo com a quantidade de métricas que o Prometheus está coletando. Quando o buffer de gravação em disco está cheio, o Prometheus começa a descartar as métricas mais antigas, garantindo que as mais recentes estejam sempre disponíveis. Além disso, o Prometheus também utiliza o swap do host para armazenar parte das métricas caso a memória RAM esteja completamente cheia.


No que diz respeito à pilha do Prometheus, o sistema utiliza uma estrutura de dados chamada heap para armazenar as métricas. A heap é uma área de memória dinâmica onde as métricas são alocadas e liberadas durante a execução do Prometheus. O gerenciamento da heap é feito automaticamente pelo sistema operacional. Quando o Prometheus executa consultas, ele carrega todos os dados históricos em memória para processamento. Portanto, quanto mais tempo de dados históricos, mais memória é consumida. Para gerenciar esse problema, é importante definir políticas de retenção de dados sensatas para reduzir o tamanho dos dados armazenados no Prometheus. Também é importante monitorar o uso de memória do servidor e ajustar as configurações do Prometheus, como a frequência de coleta de dados, para otimizar o uso da memória. 

Além disso, pode ser necessário considerar o dimensionamento vertical ou horizontal do servidor para lidar com grandes volumes de dados. Já que o gerenciamento de memória do Prometheus é feito pelo sistema operacional, não há muito o que possamos fazer para otimizar o uso de memória, o recomendado é potencializar o prometheus de modo que ele se torne apenas um componente de um sistema de monitoramento mais robusto, como é o caso do Thanos, Victoriametrics, Cortex, etc. Mas esse é um papo para outro artigo.

## Conclusão

Neste artigo, vimos como o Prometheus funciona e como ele coleta e armazena dados de métricas. Também vimos como o Prometheus funciona internamente, como ele armazena dados em memória e em disco, e como ele gerencia a memória do host Linux. Espero que você tenha gostado do artigo e que ele tenha ajudado você a entender melhor como o Prometheus

---

## Referências

* **[Documentação Oficial](https://prometheus.io/docs/introduction/overview/)**
* **[Site da RobustPerception](https://www.robustperception.io/blog/)**
* **[Prometheus Up and Running](https://www.oreilly.com/library/view/prometheus-up/9781492034131/)**