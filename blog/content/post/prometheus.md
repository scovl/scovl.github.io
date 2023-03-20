+++
title = "Prometheus"
description = "Under the hood"
date = 2023-03-25T23:18:18-03:00
tags = ["default"]
draft = true
+++


* [Uma breve introdução à engenharia]
* [Uma breve introdução ao assunto que será escrito]

## Introdução 

### Prometheus

Prometheus é uma ferramenta de monitoramento de sistemas e aplicativos open-source. Foi desenvolvida com o objetivo de fornecer uma forma eficiente de coletar, armazenar e analisar métricas de desempenho de sistemas distribuídos. Ele foi projetado para ser escalável, fácil de usar e altamente personalizável. Prometheus possui sua própria linguagem de consulta, chamada PromQL, que permite aos usuários criar consultas complexas para analisar os dados de métricas. Ele também possui uma interface web para visualizar e explorar esses dados. Além disso, ele é compatível com uma variedade de sistemas e aplicativos, incluindo Kubernetes, Docker, e outros sistemas de gerenciamento de contêineres. Prometheus também é frequentemente usado em conjunto com outras ferramentas, como Grafana, que fornece recursos avançados de visualização de dados, alertas e análise histórica de dados. Isso permite que os usuários criem painéis personalizados e dashboards para monitorar e analisar os dados de métricas de desempenho.

Além disso, Prometheus também pode ser usado em conjunto com ferramentas de coleta de dados, como exporters, que coletam dados de métricas de fontes específicas, como sistemas operacionais, redes e aplicativos. Isso permite que os usuários coletem métricas de diferentes fontes e as analisem de forma integrada. Em resumo, Prometheus é uma ferramenta de monitoramento de sistemas e aplicativos open-source, desenvolvida para coletar, armazenar e analisar métricas de desempenho de sistemas distribuídos, ele é escalável, fácil de usar e altamente personalizável, e é frequentemente utilizado em conjunto com outras ferramentas para fornecer recursos avançados de visualização, alertas e análise histórica.

> **NOTA**: Leia mais sobre PromQL em **[Aqui](https://lobocode.github.io/2023/03/19/promql/)**.

### Tipos de métricas

O Prometheus suporta três tipos principais de métricas: contadores, histogramas e médias ponderadas.

* **Counter:** São métricas que representam um valor crescente ao longo do tempo, como o número de solicitações recebidas por um servidor. Os contadores nunca diminuem, exceto quando redefinidos manualmente. Por exemplo, você pode usar a função `increase()` para calcular a taxa de incremento de um contador.
* **Gauge**: São métricas que representam um valor arbitrário em um determinado momento, como o uso de CPU. Os valores dos indicadores podem aumentar ou diminuir ao longo do tempo e não têm um valor mínimo ou máximo definido. As funções mais comuns para os indicadores são `sum()`, `avg()` e `min()` e `max()`.
* **Histogram:** São métricas que calculam a distribuição de valores em um intervalo de tempo, como o tempo de resposta de uma solicitação de rede. Os histogramas são calculados a partir de contadores, em que os valores dos contadores são divididos em intervalos ou buckets de tamanho fixo. As funções `histogram_quantile()` e `irate()` são frequentemente usadas para analisar histogramas.
* **Summary**: São métricas semelhantes a um histogram, mas em vez de contabilizar os valores dos contadores em baldes fixos, calcula a média, o percentil e o número total de valores em um determinado período. É indicado para o cálculo de médias, valores extremos e percentis.

Além desses tipos de métricas, o Prometheus também suporta métricas de estado, que são usadas para indicar se um determinado recurso está `up`,`down`. Essas métricas são geralmente usadas para monitorar a disponibilidade de serviços. 

### Monitoramento pull vs push

Para simplificar o entendimento a cerca de monitoramento Pull vs Push, imagine que você tem um vaso de flores em sua janela. O monitoramento pull é como você ir lá todos os dias para verificar se as flores precisam de água. Você está puxando informações sobre as flores. Já o monitoramento push é como se você tivesse um sistema automático que envia uma mensagem para você quando as flores precisam de água. Neste caso, as informações estão sendo empurradas para você. Tecnicamente, o monitoramento pull é um método no qual um dispositivo ou sistema solicita periodicamente informações de outro dispositivo ou sistema. Ele "puxa" as informações. Por exemplo, em um sistema de monitoramento de rede, um dispositivo de monitoramento pode enviar uma solicitação de status para cada dispositivo na rede a intervalos regulares e armazenar as informações retornadas.

Já o monitoramento push é um método no qual um dispositivo ou sistema envia automaticamente informações para outro dispositivo ou sistema sem esperar uma solicitação. Ele "empurra" as informações. Por exemplo, em um sistema de monitoramento de rede, cada dispositivo na rede pode ser configurado para automaticamente enviar informações de status para um dispositivo de monitoramento sempre que houver uma alteração. Em resumo, o monitoramento pull é baseado em solicitação e o monitoramento push é baseado em notificação. O Prometheus usa um sistema chamado "Exporters" para coletar dados de diversos sistemas e aplicativos e envia esses dados para o Prometheus para serem armazenados e analisados (monitoramento pull). O Prometheus não precisa solicitar esses dados, pois eles são enviados automaticamente pelos Exporters. Isso permite que o Prometheus colete dados em tempo real e sem sobrecarregar os sistemas e aplicativos monitorados.

### Arquitetura do Prometheus

O Prometheus é composto por diversos componentes mas que boa parte deles sao opcionais.Seu principal método de coleta de dados, consiste em extrair métricas de aplicativos e serviços instrumentados, que expõem métricas em um formato de texto simples por meio de endpoints HTTP. A arquitetura do Prometheus facilita a descoberta e a extração de dados em diferentes endpoints. O servidor Prometheus lida com a raspagem e o armazenamento de métricas. O servidor gerencia o agendamento de trabalhos de monitoramento – consultando fontes de dados (chamadas “instâncias”) em uma frequência de pesquisa predefinida. Os trabalhos de monitoramento são configurados por meio de uma ou mais diretivas “scrape config”, gerenciadas por meio de um arquivo de configuração YAML que pode ser recarregado ao vivo usando um SIGHUP ou a API de gerenciamento.

![img#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/main/post/images/prometheus/arch.png#center)

O Prometheus depende muito de vários mecanismos de descoberta de serviço (SD) para identificar alvos a serem raspados. Essas integrações de descoberta de serviço variam de interfaces genéricas, como uma descoberta de serviço baseada em arquivo, que as implementações personalizadas de SD podem aproveitar ao gerenciar um arquivo JSON ou YAML contendo uma lista de destinos. O Prometheus também fornece várias implementações de SD específicas da plataforma, incluindo: Kubernetes, AWS EC2, Azure, GCE, Docker Swarm, OpenStack e muito mais. Eles geralmente se integram às APIs correspondentes para consultar a plataforma para destinos que executam aplicativos e exportadores que podem ser copiados pelo Prometheus. A arquitetura do Prometheus é composta por três componentes principais: o Prometheus Server, os Exporters, e as Client Libraries.

* **Prometheus Server:** É o componente principal do Prometheus, responsável por armazenar e processar os dados coletados. Ele usa um banco de dados do tipo Time Series Database (TSDB) para armazenar os dados de métricas, e uma linguagem de consulta chamada PromQL para acessar e analisar esses dados. O Prometheus Server também fornece uma interface web para visualizar e gerenciar os dados.
* **Exporters:** São programas que coletam dados de sistemas e aplicativos externos e os convertem em um formato que o Prometheus possa entender. Existem vários tipos de exporters para diferentes sistemas e aplicativos, como por exemplo, o node_exporter para coletar dados do sistema operacional, o MySQLd_exporter para coletar dados do banco de dados MySQL, entre outros.
* **Client Libraries:** São bibliotecas que permitem que outros aplicativos e sistemas enviem dados diretamente para o Prometheus Server sem precisar de exporters. Essas bibliotecas estão disponíveis em várias linguagens de programação, como Go, Python, Java, entre outras.

Na arquitetura do Prometheus, os exporters ou client libraries coletam os dados e os enviam para o Prometheus Server, onde são armazenados e processados. O Prometheus Server, por sua vez, fornece uma interface web para visualizar e gerenciar esses dados, bem como uma linguagem de consulta para analisar e extrair insights. Além disso, o Prometheus Server também fornece uma funcionalidade de alertas, onde é possível criar regras para disparar alertas quando as métricas atingem um determinado valor.

### Prometheus vs Graphite, Zabbix, Nagios, etc.

Prometheus é uma ferramenta de monitoramento de código aberto que se destaca por sua capacidade de coletar e armazenar dados de métricas em tempo real e sua linguagem de consulta poderosa, o PromQL. Ele também tem uma arquitetura escalável e distribuída, o que o torna adequado para grandes ambientes de produção. Além disso, o Prometheus possui integração nativa com outras ferramentas do ecossistema de Kubernetes, o que o torna uma escolha popular para aplicativos baseados em containers. Zabbix, Graphite e Nagios são ferramentas de monitoramento de código aberto também, mas cada uma possui suas próprias características e funcionalidades. O Zabbix é uma ferramenta completa de monitoramento de rede e sistemas, com recursos avançados de alerta e relatórios. O Graphite é uma ferramenta de monitoramento de desempenho baseado em gráficos que é especialmente útil para visualizar tendências de longo prazo. O Nagios é uma ferramenta de monitoramento de rede e sistemas que se concentra em alertas e notificações.

Em resumo, a escolha da ferramenta de monitoramento dependerá das necessidades específicas do seu ambiente, mas o Prometheus é uma boa opção para quem busca monitoramento em tempo real, escalabilidade e integração com o Kubernetes.

### Labels e Samples

Labels são como etiquetas que adicionamos às coisas para identificá-las. Por exemplo, você tem um armário com camisetas e você coloca etiquetas nas camisetas com as cores, tamanhos e tipos delas. Então, se você quer pegar uma camiseta verde, você vai olhar na etiqueta e buscar uma camiseta verde. No Prometheus, labels são usadas para identificar e agrupar diferentes dados de métricas, assim como as etiquetas nas camisetas. Por exemplo, você tem vários computadores e quer monitorar o uso de memória de cada um deles. Você pode adicionar labels como "hostname" e "sistema operacional" para cada dado de métrica, então se você quiser saber o uso de memória de um computador específico, você pode buscar pela label "hostname" dele.

Já as Samples são como pequenas amostras de algo. Por exemplo, você está fazendo uma pesquisa sobre quantas balas as crianças gostam de comer e você pede para cada criança escolher uma amostra de 3 balas. Essas 3 balas que cada criança escolheu são as samples. No Prometheus, samples são pequenas medidas de algo que queremos monitorar, como por exemplo, a utilização de CPU de um computador. Cada vez que coletamos uma medida, é criado um sample. Esses samples são armazenados juntos com labels, permitindo que você possa ver como a medida mudou ao longo do tempo. Por exemplo, você pode ver como a utilização de CPU de um computador específico mudou ao longo de um dia.

## Instalando e configuando o Prometheus

Para instalar o Prometheus, você pode baixar o binário pré-compilado para o seu sistema operacional ou compilar o código-fonte. Para baixar o binário pré-compilado, você pode acessar a página de download do Prometheus e baixar o arquivo mais recente para o seu sistema operacional. Para compilar o código-fonte, você pode clonar o repositório do Prometheus no GitHub e executar o comando make build. A instalação do Prometheus pode ser feita usando várias ferramentas de gerenciamento de configuração, como Docker, Ansible, Chef, Puppet ou SaltStack. A escolha da ferramenta dependerá das necessidades específicas do ambiente e do conhecimento da equipe de operações. Aqui estão alguns exemplos de como instalar o Prometheus usando cada uma dessas ferramentas:

* **Docker:** 

O Prometheus pode ser facilmente instalado usando uma imagem do Docker disponível no repositório oficial do Prometheus. Isso pode ser feito executando o comando `docker run -p 9090:9090 prom/prometheus`.

* **Ansible:** 

Ansible é uma ferramenta de automação de configuração que pode ser usada para instalar e configurar o Prometheus em vários hosts. Isso pode ser feito usando um playbook Ansible, que é um script de configuração escrito em YAML.


Cada uma dessas ferramentas tem sua própria documentação e comunidade, então é recomendado se aprofundar em cada uma delas para entender como funciona e como instalar o Prometheus. Após a instalação, você pode executar o Prometheus com o comando ./prometheus. Isso iniciará o servidor do Prometheus na porta 9090. Você pode acessar a interface web do Prometheus em **http://localhost:9090**. A interface do Prometheus consiste em vários componentes, cada um com uma função específica:

* **Gráficos:** Permite visualizar gráficos das métricas coletadas, com opções de zoom, pan e seleção de intervalos de tempo.
* **Consulta:** Permite fazer consultas para buscar e filtrar métricas específicas.
* **Alertas:** Exibe uma lista de alertas ativos e histórico de alertas disparados.
* **Targets:** Exibe uma lista de alvos de coleta de métricas, incluindo status de disponibilidade e informações sobre a última coleta.
* **Configurações:** Permite gerenciar as configurações do Prometheus, incluindo regras de alertas e configurações de coleta de métricas.
* **Status:** Fornece informações sobre o status geral do Prometheus, incluindo a versão, uptime e uso de recursos.

## Instrumentação

A instrumentação é um processo crucial para coletar dados de desempenho e monitorar sistemas em tempo real. No contexto do Prometheus, existem dois tipos principais de instrumentação: direta e indireta.

* **A instrumentação direta** envolve a coleta de métricas diretamente de um aplicativo ou serviço, usando bibliotecas ou frameworks específicos. Isso permite que os desenvolvedores definam as métricas que são importantes para o seu aplicativo ou serviço e coletem informações específicas, como tempo de resposta de uma chamada de API ou a quantidade de memória usada.

* **A instrumentação indireta** envolve a coleta de métricas de sistemas de terceiros, como servidores de banco de dados ou balanceadores de carga. Isso pode ser feito usando plugins ou adaptadores que se comunicam com o sistema externo e traduzem as métricas em um formato que o Prometheus possa entender.

Ambos os tipos de instrumentação são importantes para obter insights precisos e valiosos sobre o desempenho do sistema. A instrumentação direta fornece dados específicos e granulares sobre o desempenho do aplicativo ou serviço, enquanto a instrumentação indireta permite monitorar o sistema como um todo e identificar gargalos e problemas em componentes externos.

### Instrumentação direta

#### Exporters

O Prometheus é compatível com uma variedade de sistemas e aplicativos, incluindo Kubernetes, Docker, e outros sistemas de gerenciamento de contêineres. Para coletar métricas de desempenho desses sistemas e aplicativos, você pode usar exporters, que são projetados para coletar dados de métricas de fontes específicas, como sistemas operacionais, redes e aplicativos. Isso permite que os usuários coletem métricas de diferentes fontes e as analisem de forma integrada. O Prometheus possui uma série de exporters nativos, que são projetados para coletar métricas de desempenho de sistemas e aplicativos específicos. Esses exporters são projetados para serem fáceis de usar e integrar com o Prometheus. Além disso, você pode usar exporters de terceiros para coletar métricas de desempenho de sistemas e aplicativos específicos.

#### Linux
O node_exporter é um exporter para o Prometheus que permite coletar métricas do sistema operacional Linux. Ele coleta informações sobre o uso de recursos como CPU, memória, disco, rede, entre outros. Ele fornece uma interface HTTP para expor esses dados no formato de métricas Prometheus, que podem ser coletadas pelo Prometheus Server e posteriormente visualizadas e analisadas. O node_exporter é especialmente útil para monitorar hosts Linux e obter uma visão geral do desempenho do sistema operacional. Ele pode ser usado para monitorar a utilização de recursos, identificar gargalos de desempenho, detectar problemas de saúde e criar alertas baseados em métricas específicas. O node_exporter também é uma ferramenta popular para monitorar clusters Kubernetes, pois ele pode coletar informações sobre o uso de recursos dentro dos contêineres, ajudando a identificar problemas de recursos e garantir a saúde do cluster. Aqui estão os passos gerais para instalar e configurar o node_exporter em um host Linux:

* Baixe o arquivo binário do node_exporter para o host Linux: você pode baixar o arquivo binário do node_exporter do site oficial do Prometheus ou usando o gerenciador de pacotes do seu sistema operacional.
* Crie um usuário e um grupo para executar o node_exporter: crie um usuário e grupo com privilégios limitados para executar o node_exporter.
* Crie um arquivo de configuração para o node_exporter: crie um arquivo de configuração para o node_exporter, onde você pode definir as opções de configuração, como por exemplo, a porta em que o node_exporter vai escutar, as métricas que serão coletadas, entre outros.
* Crie um arquivo de serviço para o node_exporter: Crie um arquivo de serviço para o node_exporter, para que ele possa ser iniciado e gerenciado pelo gerenciador de serviços do sistema operacional.
* Inicie e habilite o node_exporter: Inicie o node_exporter usando o arquivo de serviço e configure-o para ser iniciado automaticamente durante o boot.
* Configure o Prometheus Server para coletar dados do node_exporter: Adicione uma configuração de coleta de dados do node_exporter no arquivo de configuração

#### Windows

O Windows_exporter é um exporter para o Prometheus que permite coletar métricas do sistema operacional Windows. Ele é uma versão específica para o Windows do node_exporter. Ele coleta informações sobre o uso de recursos como CPU, memória, disco, rede, entre outros. Ele fornece uma interface HTTP para expor esses dados no formato de métricas Prometheus, que podem ser coletadas pelo Prometheus Server e posteriormente visualizadas e analisadas. Para instalar e configurar o Windows_exporter, você precisará seguir os seguintes passos gerais:

* Baixe o arquivo binário do Windows_exporter para o host Windows: você pode baixar o arquivo binário do Windows_exporter do site oficial do Prometheus.
* Crie um arquivo de configuração para o Windows_exporter: crie um arquivo de configuração para o Windows_exporter, onde você pode definir as opções de

#### Blackbox

O blackbox exporter é como um robô que verifica se os websites e outros endereços da internet estão funcionando corretamente. Ele envia uma mensagem para esses endereços e espera uma resposta. Se ele recebe uma resposta, significa que o endereço está funcionando bem, mas se ele não recebe, significa que algo está errado. Ele também mede quanto tempo leva para receber a resposta, assim você pode saber se o website está rápido ou lento. Ele envia essas informações o Prometheus, que as usa para mostrar gráficos e alertas quando algo está errado. Ele realiza testes de ping, HTTP, HTTPS, DNS, TCP e ICMP para verificar se o alvo está ativo e medir a latência de resposta. Ele fornece uma interface HTTP para expor esses dados no formato de métricas Prometheus, que podem ser coletadas pelo Prometheus Server e posteriormente visualizadas e analisadas.

Para instalar e configurar o blackbox exporter, você precisará seguir os seguintes passos gerais:

* Baixe o arquivo binário do blackbox exporter para o seu sistema: você pode baixar o arquivo binário do blackbox exporter do site oficial do Prometheus.
* Crie um arquivo de configuração para o blackbox exporter: crie um arquivo de configuração para o blackbox exporter, onde você pode definir as opções de configuração, como por exemplo, a porta em que o blackbox exporter vai escutar, os alvos que serão monitorados, entre outros.
* Execute o blackbox exporter: execute o blackbox exporter usando o arquivo binário baixado e o arquivo de configuração criado.
* Configure o Prometheus Server para coletar dados do blackbox exporter: Adicione uma configuração de coleta de dados do blackbox exporter no arquivo de configuração do Prometheus Server.

### Instrumentação indireta

#### Java

A instrumentação indireta no Prometheus usando Java envolve a adição de código ao seu aplicativo Java para coletar e fornecer dados de métricas ao Prometheus. Isso geralmente é feito adicionando uma biblioteca de instrumentação ao seu aplicativo e configurando-a para se comunicar com o Prometheus. Existem várias bibliotecas de instrumentação disponíveis para coletar métricas em aplicativos Java, como o "Prometheus Java client" ou o "Micrometer". Aqui está um exemplo de como adicionar o "Prometheus Java client" ao seu aplicativo Java e configurá-lo para coletar métricas de tempo de resposta de uma rota específica:

Adicione a dependência do "Prometheus Java client" ao seu arquivo pom.xml:

```xml
<dependency>
    <groupId>io.prometheus</groupId>
    <artifactId>simpleclient_httpserver</artifactId>
    <version>0.8.0</version>
</dependency>
```

No código da sua classe principal, importe a biblioteca e crie um objeto "Counter" para armazenar as métricas de tempo de resposta:

```java
import io.prometheus.client.Counter;

public class MyApp {
    private static final Counter responseTime = Counter.build()
        .name("myapp_response_time_seconds")
        .help("Response time in seconds.")
        .register();
}
```

Na rota específica que você deseja monitorar, adicione código para medir o tempo de resposta e atualizar o contador:

```java
import java.util.concurrent.TimeUnit;

app.get("/example", (req, res) -> {
    long start = System.nanoTime();
    // ... your code here ...
    responseTime.labels("example").inc((System.nanoTime() - start) / TimeUnit.SECONDS.toNanos(1));
    return "Hello, World!";
});
```

Inicie o servidor de métricas no seu aplicativo, geralmente na porta 9091:

```java
    import io.prometheus.client.exporter.HTTPServer;

public class MyApp {
    public static void main(String[] args) throws Exception {
        new HTTPServer(9091);
    }
}
```

Configure o Prometheus para "scrape" as métricas no endereço http://localhost:9091/metrics

Dessa forma, você estará coletando e fornecendo dados de métricas de tempo de resposta para o Prometheus, permitindo monitorar o desempenho da sua rota específica. É possível adicionar mais métricas como essa para monitorar outras partes do seu aplicativo, como o uso de CPU, memória, número de requisições e outros. Além disso, é importante notar que, além de coletar métricas, também é possível criar alertas no Prometheus com base nas métricas coletadas, permitindo que você seja notificado quando determinadas condições de métricas forem atingidas. Isso pode ser feito criando regras de alerta no arquivo de configuração do Prometheus, especificando quais métricas devem ser monitoradas e quais condições devem ser atendidas para disparar o alerta.

#### JavaScript/Node

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

Configure o Prometheus para "scrape" as métricas no endereço http://localhost:9091/metrics

Dessa forma, você estará coletando e fornecendo dados de métricas de tempo de resposta para o Prometheus, permitindo monitorar o desempenho da sua rota específica. É possível adicionar mais métricas como essa para monitorar outras partes do seu aplicativo, como o uso de CPU, memória, número de requisições e outros. Além disso, é importante notar que, além de coletar métricas, também é possível criar alertas no Prometheus com base nas métricas coletadas, permitindo que você seja notificado quando determinadas condições de métricas forem atingidas. Isso pode ser feito criando regras de alerta no arquivo de configuração do Prometheus, especificando quais métricas devem ser monitoradas e quais condições devem ser atendidas para disparar o alerta. É possível também usar outros sistemas como o Alertmanager para gerenciar esses alertas e notificações.

#### Python

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

Configure o Prometheus para "scrape" as métricas no endereço http://localhost:9090/metrics

Dessa forma, você estará coletando e fornecendo dados de métricas de tempo de resposta para o Prometheus, permitindo monitorar o desempenho da sua rota específica. É possível adicionar mais métricas como essa para monitorar outras partes do seu aplicativo, como o uso de CPU, memória, número de requisições e outros. Além disso, é importante notar que, além de coletar métricas, também é possível criar alertas no Prometheus com base nas métricas coletadas, permitindo que você seja notificado quando determinadas condições de métricas forem atingidas. 

Isso pode ser feito criando regras de alerta no arquivo de configuração do Prometheus, especificando quais métricas devem ser monitoradas e quais condições devem ser atendidas para disparar o alerta.

## PushGateway

PushGateway é um componente adicional do Prometheus que permite que aplicativos e sistemas enviem dados de métricas para o Prometheus sem precisar de um exporter ou client library. Ele funciona como uma "ponte" que recebe os dados enviados pelos aplicativos e os repassa para o Prometheus Server. O PushGateway é útil em situações em que os aplicativos ou sistemas não podem ser modificados para incluir suporte nativo ao Prometheus, ou quando os aplicativos são temporários e não precisam ser monitorados continuamente. Ele também é útil para coletar métricas de scripts e tarefas cron. Ao mesmo tempo, é importante notar que o PushGateway não é projetado para ser usado como solução de longo prazo para monitoramento, já que ele não armazena dados por muito tempo e não suporta a funcionalidade de alertas do Prometheus. Ele é melhor usado em conjunto com outras ferramentas de monitoramento ou como uma solução temporária.

## Profiling

O profiling é uma técnica usada para medir o desempenho de um aplicativo ou sistema. Ele ajuda a identificar gargalos de desempenho, tais como rotinas de alto uso de CPU, alocamento excessivo de memória e operações de I/O lentas. O profiling pode ser usado para coletar dados de métricas, como tempo de execução, uso de recursos e alocação de memória, para identificar problemas de desempenho e ajudar a otimizar o desempenho do sistema. Existem várias formas de fazer profiling, como por exemplo, instrumentação, análise estática e profilers. A instrumentação é uma técnica que adiciona código ao aplicativo para coletar dados de métricas em tempo real, enquanto a análise estática é uma técnica que analisa o código-fonte sem a necessidade de executá-lo. Os profilers são ferramentas específicas que podem ser usadas para coletar dados de métricas em tempo real enquanto o aplicativo estiver em execução.

No contexto de observabilidade, o profiling é uma técnica importante para coletar dados de métricas de desempenho e ajudar a identificar problemas de desempenho no sistema. Ele é usado junto com outras técnicas de observabilidade, como log analysis e tracing, para obter uma visão completa do desempenho e comportamento do sistema.

[falar mais sobre profiling no prometheus]

### Federação

A Federação no Prometheus é um recurso que permite que várias instâncias do Prometheus sejam agrupadas e gerenciadas como uma única instância. Isso é útil quando você tem vários sistemas ou aplicativos que precisam ser monitorados, mas quer gerenciar esses dados de métricas de forma centralizada. A Federação funciona criando uma hierarquia de instâncias do Prometheus, onde cada instância é chamada de "federada" ou "filha" e uma instância é chamada de "federadora" ou "pai". A instância "federadora" é responsável por coletar dados de métricas de todas as instâncias "federadas" e agrupá-los em um único local.

A configuração da Federação é feita adicionando uma configuração de "job" na instância "federadora" que especifica quais instâncias "federadas" devem ser monitoradas. Isso permite que a instância "federadora" colete dados de métricas de todas as instâncias "federadas" especificadas e os agrupe em um único local. Dessa forma, é possível acessar e analisar os dados de métricas de todas as instâncias "federadas" a partir de uma única interface na instância "federadora". A Federação no Prometheus deve ser evitada quando a topologia da rede é simples e pode ser gerenciada por uma única instância do Prometheus. Isso inclui ambientes pequenos ou quando há poucas instâncias do Prometheus que precisam ser monitoradas. Além disso, a Federação também deve ser evitada se houver restrições de rede ou de segurança que impeçam a comunicação entre instâncias do Prometheus.

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

* **WAL** - (Write Ahead Log) é o arquivo de log onde o Prometheus escreve todas as atualizações de dados antes de atualizar o banco de dados principal. Ele é usado para garantir a consistência e recuperação dos dados armazenados pelo Prometheus.
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

A pasta "chunks" dentro da pasta 01BKGTZQ1SYQJTR4PB43C8PD98 dentro do diretório /data do Prometheus é usada para armazenar os chunks de dados (grupos de amostras de dados) para cada série de dados que o Prometheus está rastreando. Cada arquivo dentro dessa pasta representa um chunk de dados único, e o nome do arquivo contém informações sobre o intervalo de tempo e a série de dados a qual ele pertence. Os arquivos de chunks são gerados pelo processo de compactação do Prometheus. Eles são criados quando o Prometheus precisa remover dados antigos para liberar espaço e continuar coletando novos dados. Esses chunks são usados para a recuperação dos dados e para realizar consultas no futuro. Os arquivos contidos dentro dessa pasta são codificados e compactados de forma a ocupar menos espaço e são lidos pelo Prometheus para responder consultas e exibir gráficos.

Já o arquivo index, contém o índice dos chunks de dados armazenados na pasta "chunks" da mesma pasta. O índice é usado para permitir que o Prometheus rápida e eficientemente localize os chunks de dados relevantes para uma consulta específica. Esse arquivo contém informações sobre as séries de dados, o intervalo de tempo dos dados, o nome do arquivo de chunk correspondente, e outras informações relevantes. O Prometheus usa essas informações para saber onde procurar os dados quando uma consulta é realizada, permitindo que ele responda rapidamente.

#### WAL

Imagine que o Prometheus é um cofre, e dentro dele temos muitas coisas importantes, como números e informações sobre o seu computador ou até mesmo sobre sua casa. Agora, imagine que toda vez que você adiciona algo novo no seu cofre, como por exemplo, a temperatura da sua casa, é preciso escrever esse novo número em um diário, para sempre ter registro dele e poder acessá-lo depois. Esse diário é o que chamamos de WAL (Write Ahead Log) do Prometheus. Ele é como um diário onde o Prometheus escreve tudo o que ele coleta e guarda essas informações, para que possamos acessá-las depois. Assim como o diário precisa ser guardado em algum lugar seguro, o WAL também precisa ser guardado em um lugar seguro, para que não possa ser perdido ou danificado. Isso garante que todas as informações importantes sejam sempre salvas e possam ser acessadas quando precisarmos delas.

### Gerenciamento de memória pelo Prometheus

Prometheus usa muita memória RAM e memória em disco devido a natureza dos dados que ele coleta e armazena. Como ele armazena métricas de forma temporal (time series), ele precisa manter uma grande quantidade de dados em memória para que essas métricas possam ser consultadas rapidamente. Isso é especialmente importante quando ele precisa responder a consultas de alertas ou gráficos em tempo real. Além disso, Prometheus usa uma estratégia de "janela deslizante" para descartar métricas antigas que já não são consideradas relevantes. Isso significa que ele precisa manter uma grande quantidade de dados em memória para garantir que as métricas mais recentes possam ser acessadas rapidamente. 

Por outro lado, Prometheus usa muita memória em disco para armazenar esses dados de forma persistente, o que permite que os dados sejam recuperados mesmo depois de um reinício do sistema. Isso também permite que os dados sejam consultados novamente em um momento posterior, mesmo que não estejam mais disponíveis na memória. Em resumo, Prometheus precisa de uma grande quantidade de memória RAM e memória em disco para garantir que os dados possam ser coletados, armazenados e consultados de forma eficiente e rápida.

Quanto mais dias de dados são armazenados, mais memória e espaço em disco serão necessários para armazená-los. Isso pode levar a problemas de performance, pois aumenta a quantidade de dados que precisam ser carregados e processados para responder a consultas. Além disso, como os dados antigos tendem a ser menos relevantes, isso pode levar a problemas de escalabilidade, pois os dados antigos podem acabar consumindo muitos recursos de armazenamento e processamento, dificultando a capacidade de Prometheus de lidar com novos dados. Além disso, é importante considerar que o objetivo do Prometheus é fornecer uma visão em tempo real do sistema, então manter muitos dias de dados pode não ser tão útil para detectar problemas recentes ou tendências atuais no sistema, e pode acabar fazendo com que os dados relevantes sejam enterrados em meio a grande quantidade de dados antigos. 

Por essas razões, é recomendado manter apenas uma quantidade de dias de dados que seja suficiente para as necessidades de monitoramento do seu sistema, e não mais do que isso. É possível configurar o Prometheus para descartar dados antigos de acordo com a necessidade, e também é possível armazenar os dados históricos em outro sistema de armazenamento para análise futura.

O Prometheus utiliza a memória principal do host Linux para armazenar todas as métricas coletadas. Essas métricas são mantidas em memória para permitir uma consulta rápida e eficiente pelos usuários. Nesse processo é usado o modelo de coleta ativa, ou seja, é responsabilidade do próprio Prometheus coletar as métricas dos serviços e aplicativos em execução. Isso significa que o Prometheus precisa gerenciar as métricas de cada alvo e garantir que elas estejam disponíveis para consulta.

Para manter as métricas em memória, o Prometheus utiliza um buffer de gravação em disco para evitar perda de dados. Quando a memória RAM fica cheia, as métricas mais antigas são gravadas no buffer de gravação em disco. Esse buffer é dimensionado automaticamente de acordo com a quantidade de métricas que o Prometheus está coletando. Quando o buffer de gravação em disco está cheio, o Prometheus começa a descartar as métricas mais antigas, garantindo que as mais recentes estejam sempre disponíveis. Além disso, o Prometheus também utiliza o swap do host para armazenar parte das métricas caso a memória RAM esteja completamente cheia.

No que diz respeito à pilha do Prometheus, o sistema utiliza uma estrutura de dados chamada heap para armazenar as métricas. A heap é uma área de memória dinâmica onde as métricas são alocadas e liberadas durante a execução do Prometheus. O gerenciamento da heap é feito automaticamente pelo sistema operacional. Quando o Prometheus executa consultas, ele carrega todos os dados históricos em memória para processamento. Portanto, quanto mais tempo de dados históricos, mais memória é consumida.

Para gerenciar esse problema, é importante definir políticas de retenção de dados sensatas para reduzir o tamanho dos dados armazenados no Prometheus. Também é importante monitorar o uso de memória do servidor e ajustar as configurações do Prometheus, como a frequência de coleta de dados, para otimizar o uso da memória. Além disso, pode ser necessário considerar o dimensionamento vertical ou horizontal do servidor para lidar com grandes volumes de dados.

Já que o gerenciamento de memória do Prometheus é feito pelo sistema operacional, não há muito o que possamos fazer para otimizar o uso de memória, o recomendado é potencializar o prometheus de modo que ele se torne apenas um componente de um sistema de monitoramento mais robusto, como é o caso do Thanos, Victoriametrics, Cortex, etc. Mas esse é um papo para outro artigo.

## Conclusão

Neste artigo, vimos como o Prometheus funciona e como ele coleta e armazena dados de métricas. Também vimos como o Prometheus funciona internamente, como ele armazena dados em memória e em disco, e como ele gerencia a memória do host Linux. Espero que você tenha gostado do artigo e que ele tenha ajudado você a entender melhor como o Prometheus funciona e como ele coleta e armazena dados de métricas.
