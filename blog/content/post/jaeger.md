+++
title = "Jaeger"
description = "Open source, end-to-end distributed tracing - [PT-BR]"
date = 2021-03-13T17:39:09-03:00
tags = ["default"]
weight = 1
draft = false
+++


### Introdução

Antes de introduzir ao Jaeger especificamente, é importante fortalecer alguns conceitos como por exemplo: o que é a observabilidade, o desafio da Observabilidade no contexto dos microsserviços, a diferença entre as ferramentas de monitoramento com o tracing distribuído.

### O que é a Observabilidade?

Emprestado da teoria de controle, o termo observabilidade significa formalmente que os estados internos de um sistema podem ser inferidos a partir de suas saídas externas. Isso se tornou necessário dentro dessas organizações à medida que a complexidade de seus sistemas crescia tanto - e o número de pessoas responsáveis por gerenciá-los permanecia relativamente pequeno - que eles precisavam de uma maneira de simplificar o espaço do problema.

Além disso, como parte das organizações de engenharia de confiabilidade de site (SRE), muitos dos engenheiros responsáveis pela observabilidade não estavam trabalhando no software diretamente, mas na infraestrutura responsável por operá-lo e torná-lo confiável. Como tal, um modelo para entender o desempenho do software a partir de um conjunto de sinais externos era atraente e, em última análise, necessário. Apesar de uma definição formal, a observabilidade continua a iludir a compreensão de muitos profissionais. Para muitos, o termo é igualado às ferramentas usadas para observar sistemas de software: métricas, logs e o rastreamento distribuído. Essas três ferramentas ficaram conhecidas como os **três pilares da observabilidade**, cada uma delas uma parte necessária para a compreensão do comportamento do sistema.

Para que você entenda o que é Observabilidade, recomendo que assista a **[este vídeo que produzí no youtube](https://youtu.be/Xz4uYQpu2sM)**. Em resumo, métricas, logs e traces podem ser usados para gerar dados dos aplicativos que servirão como insumos para investigar o comportamento das aplicações e sistema ou a causa raiz de problemas. Na Observabilidade usamos ferramentas e a nossa experiência profissional afim de depurar aplicações.


### O desafio da Observabilidade no contexto dos microsserviços

Apesar dos benefícios e da rápida adoção por empresas, os microsserviços apresentam seus próprios desafios e complexidade. **[Yuri Shkuro](https://www.shkuro.com/)** criador do Jaeger no livro **[Mastering Distributed Tracing](https://www.amazon.com.br/Mastering-Distributed-Tracing-performance-microservices-ebook/dp/B07MBNGF7Q)** exemplifica bem a complexidade em administrar microsserviços ao mostrar uma representação visual de um subconjunto de microsserviços na arquitetura de microsserviços do Uber renderizada no Jaeger. A imagem é semelhante a esta abaixo: 

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/blog/content/post/images/jaeger/microsservices.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/blog/content/post/images/jaeger/microsservices.png#center)

Na imagem acima, os círculos representam diferentes microsserviços. As arestas são desenhadas entre os nodes que se comunicam entre si. O diâmetro dos nodes é proporcional ao número de outros microsserviços que se conectam a eles e a largura de uma borda é proporcional ao volume do tráfego que passsa por essa borda. Em suma, a imagem acima é tão complexa que nem mesmo temos espaço para incluir os nomes dos serviços. Para executar esses microsserviços em produção, precisamos de uma plataforma de orquestração avançada como o Kubernetes. Para se comunicar, os microsserviços precisam saber como se encontrar na rede, como rotear em torno de áreas problemáticas, como realizar o balanceamento de carga e assim por diante. Quando observamos que algumas solicitações estão lentas ou falhando, desejamos que nossas práticas e ferramentas de Observabilidade gere insumos para que possamos entender o que está ocorrendo com estas solicitações. Pensando nesta abordagem, podemos refletir a cerca de algumas perguntas como:

* Por quais serviços a solicitação passou?
* O que cada microsserviço fez ao processar a solicitação?
* Se a solicitação está lenta, onde estão os gargalos?
* Se a solicitação falhou, onde ocorreu o erro?
* Quão diferente foi a execução da solicitação no sistema?
* Qual foi o caminho crítico da solicitação?

As ferramentas de monitoramento tradicionais foram projetadas para sistemas monolíticos observando a saúde e o comportamento de uma única instância de aplicativo. Eles são capazes de nos mostrar o histórico de uma única instância não sendo capazes de revelar dados a cerca de transações distribuídas que passaram por ela. Além disso, ferramentas que não foram projetadas para atuar em sistemas distribuídos, não guardam o contexto da solicitação. Para além das ferramentas tradicionais, existem também outras ferramentas que atuam em microsserviços mas não respondem às perguntas acima. Um exemplo disso são as Métricas e o Logs. Métricas são medidas numéricas registradas pelos aplicativos e são baratas de coletar, pois os valores numéricos podem ser facilmente agregados para reduzir a sobrecarga de transmissão desses dados para o sistema de monitoramento. Eles também são bastante precisos, razão pela qual são muito úteis para o monitoramento real e alertas. No entanto, a mesma capacidade de agregação é o que torna as métricas inadequadas para explicar o comportamento patológico do aplicativo. **Ao agregar dados, estamos jogando fora todo o contexto que tínhamos sobre as transações individuais**.

Ferramentas de Logs são ainda mais básicas do que as de métricas. Os logs não funcionam muito bem com microsserviços porque cada fluxo de log nos fala apenas sobre uma única instância de um serviço. Observar o comportamento dos sistemas a partir dos logs é muito difícil, a menos que anotemos todos os logs com algum tipo de id único representando a solicitação em vez do thread, uma técnica que realmente nos aproxima de como o rastreamento distribuído funciona. Por fim, os microsserviços introduziram o que podemos chamar de "simultaneidade distribuída". Não apenas a execução de uma única solicitação pode pular entre threads, mas também pode pular entre processos, quando um microsserviço faz uma chamada de rede para outro.

Precisamos saber o que acontece com as solicitações de ponta a ponta, se quisermos entender como um sistema está se comportando. Em outras palavras, primeiro precisamos de uma visão macro e ao mesmo tempo uma visão micro do que exatamente aconteceu com aquela solicitação naquele componente. O tracing distribuído tem uma visão centrada na solicitação. Ele captura a execução detalhada de atividades causalmente relacionadas realizadas pelos componentes de um sistema distribuído, uma vez que processa um determinado pedido. Ao assumir uma visão centrada na solicitação, o trace ajuda a descobrir diferentes comportamentos do sistema. Ao contrário da maioria das ferramentas que monitoram apenas componentes individuais da arquitetura, como um processo ou um servidor, o tracing desempenha uma função exclusiva por ser capaz de observar a execução ponta a ponta de solicitações individuais ou transações, acompanhando-as através dos limites do processo e da rede.


---

### OpenTracing , OpenCensus e OpenTelemetry

O OpenTracing e o OpenCensus são especificações de tracing que são usados através de APIs, frameworks ou bibliotecas que implementaram a especificação e documentação para o projeto. Em suma, o OpenTracing/OpenCensus permitem que os desenvolvedores adicionem instrumentação ao código da aplicação usando APIs. Eles incluem APIs de tracing padrão em várias das principais linguagens de programação e mantém mais de 100 módulos que fornecem instrumentação para várias estruturas populares open-source. Há vários bons motivos para você preferir uma biblioteca de instrumentação de uso geral em vez de uma personalizada:

* Uma biblioteca de uso geral terá mais probabilidade de apresentar melhor desempenho no caso de uso geral.
* É mais provável que os autores da biblioteca de uso geral tenham considerado casos extremos e outras situações.
* Usar uma biblioteca de uso geral pode economizar meses de dores de cabeça de manutenção na adaptação, extensão e uso de uma biblioteca personalizada.

À medida que seu software se torna mais complexo e os ciclos de desenvolvimento ficam mais tensos, a base lógica para a biblioteca de uso geral aumenta. Você provavelmente não tem tempo ou desejo para implementar seu próprio coletor de telemetria ou API. Você pode não ter a experiência para criar ou manter bibliotecas de telemetria sob medida em todos os idiomas usados por seu aplicativo ou pode achar que a dinâmica organizacional de criar um padrão interno é intransponível. Finalmente, você provavelmente não quer ter que reinventar a roda em termos de geração de dados de telemetria de suas dependências - estruturas RPC, bibliotecas HTTP, etc. OpenTelemetry resolve esses problemas e uma série de outros para você. O objetivo principal do OpenTelemetry é fornecer um único conjunto de APIs, bibliotecas, agentes e coletores que você pode usar para capturar rastreamento distribuído e telemetria métrica de seu aplicativo. Ao fazer isso, a OpenTelemetry imagina um mundo onde dados de telemetria portáteis e de alta qualidade são um recurso integrado do software nativo da nuvem.

OpenTelemetry foi formalmente anunciado em 2019 como o **grande lançamento do OpenTracing e do OpenCensus**. Esses dois projetos tinham objetivos semelhantes, mas maneiras diferentes de alcançá-los. As sementes do OpenTelemetry foram plantadas no outono de 2018 em vários tópicos de amplo espectro no Twitter que cristalizaram o principal obstáculo enfrentado por ambos os projetos - o surgimento de uma “guerra de padrões” entre os dois. Os autores de projetos de código aberto, vendo que havia dois padrões incompatíveis para instrumentação, adiariam a adição de rastreio a suas bibliotecas e estruturas na ausência de consenso sobre no qual deveriam se concentrar.

Essas e outras divergências levaram a negociações e discussões secundárias entre os fundadores de cada projeto junto com um mediador neutro. Uma pequena equipe técnica foi formada para criar o protótipo de uma API mesclada, que se tornou o protótipo inicial do OpenTelemetry. A primavera de 2019 viu o trabalho continuar no protótipo, junto com os esforços para codificar a nova estrutura de governança, tirando lições de outros projetos de código aberto bem-sucedidos, como o Kubernetes. Após o anúncio em maio, colaboradores de uma ampla variedade de empresas, incluindo Microsoft, Google, Lightstep e Datadog, trabalharam em conjunto para formalizar a especificação, interface de programação de aplicativo (API), kit de desenvolvimento de software (SDK) e outros componentes.

---

### Jaeger

Jaeger é um fork do projeto **[OpenZipkin](https://zipkin.io/)** que é sistema de rastreamento distribuído desenvolvido pelo Twitter usado para monitorar e solucionar problemas de sistemas distribuídos baseados em microsserviços. O Twitter desenvolveu o Zipkin e o lançou para a comunidade de open-source em 2012. Grande parte da terminologia usada no Zipkin é portável para outros sistemas de tracing, devido à herança compartilhada do whitepaper descrito no Dapper. O **[Dapper](https://research.google/pubs/pub36356/)** é um artigo escrito pelo Google sobre tracing para uso interno. Ele foi escrito em 2010 e ainda é usado como referência para implementação de tracing. 

Agora saindo um pouco da parte teórica, experimente usar o Jaeger um pouco para compreender sua funcionalidade. Nesse caso, como primeira experiência use a imagem docker all-in-one (todos os componentes juntos) do Jaeger:

```bash
$ docker run -d --name jaeger \
  -e COLLECTOR_ZIPKIN_HTTP_PORT=9411 \
  -p 5775:5775/udp \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 5778:5778 \
  -p 16686:16686 \
  -p 14268:14268 \
  -p 14250:14250 \
  -p 9411:9411 \
  jaegertracing/all-in-one:latest
```
Após rodar o container acima, você poderá usar a interface do Jaeger através do **[http://localhost:16686/](http://localhost:16686/)**. Para popular o Jaeger com **SPANS**, rode a aplicação **[HOTROD Ride](https://github.com/jaegertracing/jaeger/tree/master/examples/hotrod)** da seguinte maneira:

```bash
$ docker run --rm -it \
  --link jaeger \
  -p8080-8083:8080-8083 \
  -e JAEGER_AGENT_HOST="jaeger" \
  jaegertracing/example-hotrod:latest \
  all
```
Após rodar o container acima, você poderá usar a interface web do HotROD através da url **[http://localhost:8080/](http://localhost:8080)**. Abaixo uma explicação de como funciona esta primeira experiencia usando o HotROD e o Jaeger:

---

### Componentes

O Jaeger é composto por quatro componentes. São eles:

* **Jaeger Agent** - é um **[daemon de rede]()** que detecta **SPANS** enviados por meio do protocolo UDP, os agrupa e envia para o collector. O agent deve estar no mesmo host da aplicação, e poderá ser implementado por meio de um sidecar com o collector ao invés de componentes separados.
* **Jaeger Collector** - recebe os spans e os coloca em uma fila para processamento.
* **Jaeger Ingester** - é um serviço que lê o tópico do Kafka e grava em outro backend de armazenamento (Cassandra ou Elasticsearch).
* **Jaeger Query** - é um serviço que recupera os dados armazenados e hospeda uma interface para exibi-los.

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/blog/content/post/images/jaeger/arq1.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/blog/content/post/images/jaeger/arq1.png#center)

### O que são SPANS?

O Jaeger apresenta as solicitações de execução como traces, que mostram os dados/caminhos de execução através de um sistema. Um trace é formado por um ou mais spans, que são as **unidades de trabalho lógicas do Jaeger**. Cada span inclui o nome da operação, a data/hora de início e a duração. Os spans podem estar aninhados e ordenados. Os componentes do Jaeger funcionam juntos para coletar, armazenar e visualizar spans e traces.

Dito de maneira ainda mais simples, um SPAN representa duas coisas:

1. O intervalo de tempo em que seu serviço estava funcionando.
2. O mecanismo pelo qual os dados são transportados de seu serviço para algum sistema de análise capaz de processá-los e interpretá-los.

Basicamente os SPANS criam períodos eficazes que revelam insights sobre o comportamento do seu serviço. Os SPANS são uma abstração do trabalho de um serviço. 

Agora que você já compreende melhor os componentes do Jaeger, rode-os separadamente usando o `docker-compose`:



---

### Montando um cluster jaeger no k8s


---

### Melhores práticas de instrumentação

---

### Tracing não é uma bala de prata

**Limitações do tracing distribuído**:


---

### Referências:

* **[Mastering Distributed Tracing]()**
* **[Distributed Tracing in Action]()**
* **[Microservices: a definition of this new architectural term](https://www.martinfowler.com/articles/microservices.html)**
* **[Evolving Distributed Tracing at Uber Engineering](https://eng.uber.com/distributed-tracing/)**
* **[The OpenTracing Project](https://opentracing.io/)**
* **[The OpenCensus Project](https://opencensus.io/)**
* **[Juraci Paixão Kröhling. Running Jaeger Agent on bare metal](https://medium.com/jaegertracing/deployment-strategies-for-the-jaeger-agent-1d6f91796d09)**
* **[Juraci Paixão Kröhling. Protecting Jaeger UI with an OAuth sidecar Proxy](https://medium.com/jaegertracing/deployment-strategies-for-the-jaeger-agent-1d6f91796d09)**

