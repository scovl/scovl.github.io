+++
title = "Prometheus"
description = "Zero to Hero"
date = 2022-03-03T23:18:18-03:00
tags = ["default"]
draft = true
+++


* [Uma breve introdução à engenharia]
* [Uma breve introdução ao assunto que será escrito]

### Introdução a TSDB

Time Series Database - banco de dados de série temporal (TSDB), é um banco de dados otimizado que registra data e hora ao longo do tempo. Os dados da série temporal são simplesmente medições ou eventos que são rastreados, monitorados e agregados. Estes dados podem registrar métricas de servidores, métricas de desempenho de aplicativos, dados de rede, eventos, cliques, dados financeiros e muitos outros tipos de dados analíticos. Para que você possa compreender melhor o que é um Banco de dados de série temporal, vou simplificar esta definição usando como base algo de nosso cotidiano. Digamos que você more em São Paulo a alguns anos planeja passar férias curtindo as praias em Pernambuco/PE. Afim de evitar chuva quando estiver em Pernambuco, você decide então, pesquisar qual a precipitação média anual de São Paulo em relação a Pernambuco. Isto é, o quanto poderá chover em Pernambuco baseando-se na média anual entre as duas cidades.

Como a São Paulo recebe em média maior de chuvas por ano do que a de Pernambuco, nesse cenário parece que viajar em dezembro é uma boa a melhor escolha. Então você decide viajar em Dezembro, pega o avião, vai pra Pernambuco e ao chegar ao local, se surpreende com uma chuvarada que perdura por quatro dias seguidos. Com isso, você conclui que a probabilidade de escolher um destino ensolarado para dezembro poderia ter sido maior se você tivesse considerado as medições de chuva registradas ao longo do ano em vez de se basear apenas em uma média anual. Desta forma um padrão de chuvas seria revelado, conforme mostrado na imagem abaixo. 

![img#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/tsdb/tsdb1.png#center)

Com esse tipo de coleta de dados ao longo do tempo (em série temporal), você poderia facilmente ver que em dezembro era muito provável que tivesse férias ensolaradas em São Paulo do que em Pernambuco, embora isso certamente não fosse verdade para uma viagem em setembro. Os gráficos acima mostram as medições de precipitação mensal de Pernambuco e de São Paulo. Observe a redução acentuada nas chuvas em São Paulo, indo de setembro a outubro e de dezembro a janeiro. Apesar de uma precipitação média anual mais alta em São Paulo, seus meses de inverno de dezembro e janeiro são geralmente mais secos do que aqueles meses em Pernambuco. Essa analogia sugere insights úteis quando certos tipos de dados são registrados ao longo do tempo. A variedade de situações em que as séries temporais são úteis é ampla e crescente, especialmente à medida que novas tecnologias estão produzindo mais dados desse tipo e novas ferramentas tornam viável o uso de dados de séries temporais em grande escala e em novas aplicações.

[descrever mais]////////////


---

### Prometheus

O Prometheus é um kit de ferramentas de monitoramento e alerta open-source desenvolvido inicialmente pela plataforma de audio **[SoundCloud]()** em 2012 e que hoje pertence a comunidade. Para você compreender melhor o contexto de criação do Prometheus, começarei esta história falando de um sistema de gerenciamento de cluster distribuído desenvolvido pelo Google. O Borg System é um gerenciador de cluster que executa centenas de milhares de tarefas, de muitos milhares de aplicativos diferentes, em vários clusters, cada um com até dezenas de milhares de máquinas. O Kubernetes deve muito a esse projeto. Logo após a implantação do Borg no Google, as pessoas perceberam que essa complexidade exigia um sistema de monitoramento com capacidade semelhante. O Google construiu esse sistema e o chamou de Borgmon. Borgmon é um sistema de monitoramento de séries temporais focado em monitoramento em tempo real e que usa esses dados para identificar os problemas e alertá-los.

O Prometheus deve sua inspiração ao Borgmon do Google. Ele foi originalmente desenvolvido por Matt T. Proud, um ex-Google SRE, como um projeto de pesquisa. Depois que Matt se juntou ao SoundCloud, lá ele conheceu um outro engenheiro, Julius Volz, para desenvolver o Prometheus mais a sério. Assim como Borgmon, o Prometheus foi projetado principalmente para fornecer monitoramento de introspecção quase em tempo real de microsserviços, serviços e aplicativos baseados em nuvem e contêineres dinâmicos. O SoundCloud foi um dos primeiros a adotar esses padrões de arquitetura, e o Prometheus foi construído para responder a essas necessidades. Atualmente, o Prometheus é usado por uma ampla gama de empresas, geralmente para necessidades de monitoramento semelhantes, mas também para monitoramento de arquiteturas mais tradicionais.

### Lab 01 - Hands-on ---

Acesse o **[https://prometheus.demo.do.prometheus.io/](https://prometheus.demo.do.prometheus.io/)** onde contém um servidor Prometheus hospedado pela comunidade. Em seguida, execute a seguinte Query:

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

Se você conhece algum sistema de monitoramento, deve se lembrar do Zabbix, Nagios, Icinga, Graphite entre outros. Se comparados ao Prometheus, diria que a diferença básica entre eles e o Prometheus, está na abordagem. Por exemplo, enquanto o Zabbix trabalha com monitoramento Push onde existe explicitamente um agente que envia eventos para o servidor, o Prometheus inverte o paradigma. Isto é, o Prometheus trabalha com monitoramento Pull. Sistemas baseados em pull colhem dados de uma aplicação remota em um endpoint contendo métricas ou a partir de uma verificação usando o protocolo ICMP. Ambas as abordagens têm prós e contras. Apesar do Prometheus ter como foco o monitoramento Pull, também é possível habilitar o monitoramento Push enviando eventos para um Gateway. Mais a diante, neste artigo, irei mostrar como funciona este recurso. 

![img#center]()

No geral, uma implantação de monitoramento típica simplificada do Prometheus tem a seguinte aparência:

![img#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/tsdb/prom-pull.png#center)

O Prometheus funciona coletando dados de séries temporais expostos de aplicativos que expõem através de rotas instrumentadas. Vamos supor que dentro da sua aplicação existe uma rota /metrics onde contém as métricas que o Prometheus precisa coletar de tempo em tempo. Essas rotas podem ser feitas manualmente ou através de frameworks/exporters. Os exporters existem para muitas linguagens, estruturas e aplicativos para as mais diversas plataformas. Os dados de série temporal resultantes são coletados e armazenados localmente no servidor Prometheus. Ele também pode ser enviado do servidor para armazenamento externo ou para outro banco de dados de séries temporais. 


### Lab 02 - Hands-on ---


Agora que você entende o básico do Prometheus, vamos entender como instrumenta uma aplicacao. Abaixo uma aplicacao web simples escrita em Golang:

```go
package main

import (
    "log"
    "net/http"
)

type server struct{}

func (s *server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusOK)
    w.Write([]byte(`{"message": "hello world"}`))
}

func main() {
    s := &server{}
    http.Handle("/", s)
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

Agora vamos adicionar uma rota **/metrics**:


```bash

```

Abaixo como rodar o Prometheus localmente em Docker:

```bash
docker run \
    -p 9090:9090 \
    -v /path/to/config:/etc/prometheus \
    prom/prometheus
```

Acesse a url **[http://localhost:9090](http://localhost:9090)** em seu navegador. Agora vamos editar o arquivo **prometheus.yml** e adicionar as seguintes linhas:

```bash

```

O que está ocorrendo aqui?






> **Nota**: é possível instrumentar quaisquer aplicacoes que seja opensource e em quaisquer linguagens.




---

### Arquitetura

![img#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/tsdb/arch.png#center)

O Prometheus é composto por diversos componentes mas que boa parte deles sao opcionais.Seu principal método de coleta de dados, consiste em extrair métricas de aplicativos e serviços instrumentados, que expõem métricas em um formato de texto simples por meio de endpoints HTTP. A arquitetura do Prometheus facilita a descoberta e a extração de dados em diferentes endpoints. O servidor Prometheus lida com a raspagem e o armazenamento de métricas. O servidor gerencia o agendamento de trabalhos de monitoramento – consultando fontes de dados (chamadas “instâncias”) em uma frequência de pesquisa predefinida. Os trabalhos de monitoramento são configurados por meio de uma ou mais diretivas “scrape config”, gerenciadas por meio de um arquivo de configuração YAML que pode ser recarregado ao vivo usando um SIGHUP ou a API de gerenciamento.

O Prometheus depende muito de vários mecanismos de descoberta de serviço (SD) para identificar alvos a serem raspados. Essas integrações de descoberta de serviço variam de interfaces genéricas, como uma descoberta de serviço baseada em arquivo, que as implementações personalizadas de SD podem aproveitar ao gerenciar um arquivo JSON ou YAML contendo uma lista de destinos. O Prometheus também fornece várias implementações de SD específicas da plataforma, incluindo: Kubernetes, AWS EC2, Azure, GCE, Docker Swarm, OpenStack e muito mais. Eles geralmente se integram às APIs correspondentes para consultar a plataforma para destinos que executam aplicativos e exportadores que podem ser copiados pelo Prometheus.

Ao contrário de outras ferramentas de monitoramento que dependem de agentes ou instrumentação incorporada (por exemplo, bibliotecas de cliente APM) para coletar dados e "enviar" métricas para o back-end de monitoramento, os servidores Prometheus raspam (ou seja, "puxam") dados de aplicativos instrumentados e exportadores Prometheus. Os aplicativos são instrumentados usando bibliotecas de cliente que permitem um endpoint HTTP onde as métricas internas são expostas e coletadas por servidores Prometheus. Exportadores são “bibliotecas e servidores que ajudam na exportação de métricas existentes de sistemas de terceiros como métricas do Prometheus”. Os exportadores são “úteis nos casos em que não é viável instrumentar um determinado sistema com o Prometheus diretamente (por exemplo, estatísticas do sistema HAProxy ou Linux)”. Consulte a documentação dos exportadores e integrações do Prometheus para obter mais informações. Uma maneira de pensar nos exportadores é como "agentes de monitoramento de propósito único" projetados para coletar métricas de um sistema de terceiros específico e disponibilizá-las para os servidores Prometheus coletarem. Há pouco mais de uma dúzia de exportadores "oficiais" (mantidos como parte da organização oficial do Prometheus GitHub) e quase 200 exportadores, incluindo aqueles desenvolvidos pela comunidade Prometheus.

### Under the hood

Você que usa o Prometheus a algum tempo já deve ter notado que na pasta **/data** contém diversos dados além de outras pasta como **WAL**, **chunks_head** e dentro de cada diretório na pasta existem uma estrutura com pastas **chunks**, **tombstones**, **meta.json** e **index**. Já se perguntou o que são essas pastas e arquivos e para que servem cada uma delas? Abaixo uma explicação a cerca do assunto::

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

Na representação acima, vamos começar pelo **WAL (Write-Ahead-Log)**. O WAL é um recurso de gravação de logs sequencial de eventos que ocorrem no Prometheus. Antes de gravar/modificar ou excluir os dados no TSDB, o evento é primeiramente registrado no WAL e em seguida, as operações necessárias serão realizadas. O WAL é usado apenas para registrar os eventos e restaurar o estado na memória durante a inicialização. Isso é bastante útil para bancos de dados que perdem dados registrados em memória quando a máquina reinicializa ou o sistema falha ou trava. Na prática isso quer dizer que quando o Prometheus é reinicializado, imediatamente é iniciado um processo de restauração de eventos que foram registrados no WAL. Tomando a pasta **01BKGTZQ1SYQJTR4PB43C8PD98** como exemplo, que é um ID de bloco, observe que existe a seguinte estrutura:

```bash
├── chunks
│   └── 000001
├── tombstones
├── index
└── meta.json
```

Vamos aos detalhes de cada arquivo:

1. **meta.json**: trata-se de um arquivo ondem contém os metadados do bloco.

Ele contém todos os metadados necessários para o bloco como um todo. Aqui está um exemplo:

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

* **ulid**: contém o registro do ID de bloco (o mesmo nome do diretório em que o arquivo está).
* **minTime e maxTime**: são os registros de data e hora mínimos e máximos absolutos entre todos os blocos presentes no bloco.
* **stats**: informa o número de séries temporais, samples e chunks presentes neste bloco.
* **compaction**: aqui é registrado alguns dados importantes sobre este bloco. O **level** por exemplo, informa em quantos contextos este bloco está inserido. Se o level for 1, o bloco não tem relação com as séries temporais de outro. No entanto, se o level for 3, a compactação terá um outro campo chamado **parents**. O parents mostrará o **ulid** dos blocos que estão inseridos no mesmo contexto que este. Já o campo **sources** mostra de quais blocos este bloco foi formado. Se este bloco for formado pelo bloco principal, então o source será exatamente o mesmo de seu **ulid**. No caso o **01BKGTZQ1SYQJTR4PB43C8PD98**.

2. **chunks**: contém pedaços brutos e sem nenhum metadado sobre os chunks.

O diretório chunks contém uma sequência de arquivos numerados semelhantes aos chunks do diretório WAL/checkpoint/chunks_head. Cada arquivo é limitado a 512 MiB. Este é o formato de um arquivo individual dentro deste diretório:

[]

É muito semelhante aos arquivos contidos no diretório head_chunks mapeados em memória no disco. O número mágico identifica este arquivo como um arquivo de blocos. versão nos diz como analisar este arquivo. preenchimento é para quaisquer cabeçalhos futuros. Isso é seguido por uma lista de blocos. Aqui está o formato de um bloco individual:

[]

Precisávamos dessas informações adicionais para que os pedaços principais recriassem o índice na memória durante a inicialização. Mas, no caso de blocos, temos essa informação adicional no índice, porque índice é o lugar onde ele finalmente pertence, portanto, não precisamos dele aqui.

Aqui está o link para os documentos upstream no formato de blocos.



* **index**: arquivo onde contém o índice deste bloco.
* **tombstones**: arquivo onde contém marcadores de exclusão para excluir samples ao consultar o bloco.


 chamado **index** que é um arquivo que indexa os nomes das métricas e labels para séries temporais no diretório **chunks** na mesma estrutura de diretório. Observe que dentro do diretório **chunks** existe um arquivo chamado **000001**. Este número se trata de um arquivo de segmento que é agrupado em blocos com todas as séries temporais de uma determinada janela de tempo. Estes blocos vão sendo coletados gerando blocos novos ao passo que os blocos mais antigos serão removidos após ultrapassarem o tempo de retenção configurado. Cada arquivo de segmento é agrupado em blocos de duas horas e poderá ter no máximo o tamanho de 512 MiB cada. Quando as séries temporais são excluídas por meio da API do Prometheus, os registros de exclusão são armazenados nos arquivos de **tombstones**. 

---



### Configuracao





### PushGateway
### Federacao
### PromQL
### Tipos de Métricas
### Metodologias de monitoramento
### Quando nao usar o Prometheus?
### Potencializando o Prometheus
### Grafana MIMIR



---

Caso deseje aprofundar a cerca da engenharia e funcionamento de um TSDB, recomendo a leitura do livro **[Time Series Databases New Ways to Store and Access Data]()** de Ted Dunning e Ellen Friedman.