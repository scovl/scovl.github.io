+++
title = "Alertmanager"
description = "Configuração de alertas no Prometheus"
date = 2023-03-19T17:31:45-03:00
tags = ["observability, prometheus, promql, alertmanager"]
draft = true
weight = 1
author = "Vitor Lobo Ramos"
+++

* **[Introdução](#introdução)**
* **[Instalação e Configuração](#instalação-e-configuração)**
* **[Alertas](#alertas)**

## Introdução

O AlertManager é um componente crucial do ecossistema Prometheus, responsável pelo gerenciamento de alertas e notificações. Sua principal função é receber, agrupar e encaminhar alertas gerados a partir das regras definidas no Prometheus, possibilitando a identificação rápida e eficiente de problemas ou eventos importantes relacionados ao desempenho de sistemas e aplicações. Importante para os usuários do Prometheus, o AlertManager permite a integração com diversos sistemas de notificação, como e-mail, Slack, PagerDuty e outros, facilitando a comunicação e a tomada de ação rápida em resposta aos alertas. Além disso, ele gerencia a supressão temporária de alertas, evitando notificações duplicadas ou desnecessárias. Com o AlertManager, os usuários podem definir e personalizar regras de alerta e roteamento, garantindo que as notificações sejam enviadas para as equipes responsáveis de forma eficaz. Desse modo, o AlertManager se mostra fundamental para o monitoramento proativo e a manutenção eficiente de sistemas, contribuindo para a estabilidade e confiabilidade das infraestruturas monitoradas pelo Prometheus.

## Arquitetura AlertManager



### Alertmanager vs Grafana Alerting

Tanto o AlertManager quanto o Grafana Alerting são ferramentas eficientes para gerenciar alertas e notificações no monitoramento de métricas. Embora ambos possam ser utilizados com Prometheus, eles têm abordagens e recursos distintos. A seguir, apresentamos um comparativo entre essas duas soluções e suas vantagens:

**AlertManager**:

* **Focado no ecossistema Prometheus**: O AlertManager foi projetado especificamente para trabalhar com o Prometheus, proporcionando uma integração mais estreita e facilitando a configuração de alertas com base nas métricas coletadas por esse sistema.
* **Agrupamento e inibição de alertas**: O AlertManager possui recursos avançados para agrupar e inibir alertas, evitando notificações duplicadas ou desnecessárias e facilitando o gerenciamento de incidentes.
* **Roteamento flexível de notificações**: Com o AlertManager, é possível configurar regras de roteamento de notificações mais detalhadas e personalizadas, direcionando alertas para as equipes ou indivíduos responsáveis de forma eficaz.

**Grafana Alerting**:

* **Suporte a várias fontes de dados**: O Grafana Alerting não se limita apenas ao Prometheus, permitindo o uso de alertas com várias outras fontes de dados, como InfluxDB, Graphite, entre outras. Isso o torna mais versátil e útil em ambientes com diversas soluções de monitoramento.
* **Alertas baseados em painéis**: No Grafana, os alertas são configurados diretamente nos painéis de visualização de dados, facilitando a criação e o gerenciamento de alertas em um ambiente centralizado e visual.
* **Interface de usuário amigável**: O Grafana oferece uma interface gráfica intuitiva para configurar alertas e notificações, o que pode ser mais acessível para usuários com menos experiência em configurações baseadas em texto.

AlertManager é mais adequado para usuários que já utilizam o Prometheus e desejam uma solução de alerta focada nesse ecossistema, com recursos avançados de agrupamento, inibição e roteamento de notificações. Já o Grafana Alerting é mais versátil, suportando várias fontes de dados e oferecendo uma interface gráfica para configuração de alertas, sendo ideal para ambientes com diversas soluções de monitoramento ou usuários que preferem uma abordagem visual. 

> **NOTA**: Particularmente prefiro o AlertManager por perceber maior autonomia na construção de regras de alerta bem como o contexto dele. Mas isso é algo que deve ser avaliado caso a caso.

## Instalação e configuração

Para instalar o AlertManager, visite o repositório oficial em **[https://github.com/prometheus/alertmanager/releases](https://github.com/prometheus/alertmanager/releases)**, baixar a versão mais recente de acordo com a arquitetura do seu sistema operacional e descompactar o arquivo baixado. Em seguida, execute o comando abaixo para iniciar o AlertManager:

```bash
./alertmanager --config.file=alertmanager.yml
```
O arquivo de configuração do AlertManager deve ser criado na mesma pasta do executável e deve conter as configurações de roteamento e notificação. Para obter mais informações sobre as configurações disponíveis, consulte a documentação oficial em **[https://prometheus.io/docs/alerting/configuration/](https://prometheus.io/docs/alerting/configuration/)**.

Com o AlertManager instalado, é importante que você defina algumas configurações em seu Prometheus.yaml, para que ele possa enviar os alertas gerados para o AlertManager. Para isso, adicione as seguintes linhas ao arquivo de configuração do Prometheus:

Para configurar o Alertmanager no Prometheus, você precisa adicionar algumas linhas no arquivo prometheus.yml. Vou explicar passo a passo o que cada linha significa e como fazer a configuração de forma didática.

```yaml
alerting:
  alertmanagers:
  - static_configs:
    - targets:
      - 'alertmanager:9093'
```

Explicação das linhas:

* **alerting**: Inicia a seção de alerta no arquivo de configuração.
    alertmanagers: Define a lista de Alertmanagers que o Prometheus deve enviar alertas.
* **static_configs**: Neste exemplo, estamos usando uma configuração estática para especificar o endereço do Alertmanager. Você também pode usar o `file_sd_configs` ou `kubernetes_sd_configs` para descobrir o Alertmanager dinamicamente.
* **targets**: Lista de endereços do Alertmanager.
    'alertmanager:9093': O endereço do Alertmanager. Neste caso, alertmanager é o nome do serviço ou host onde o Alertmanager está sendo executado, e 9093 é a porta padrão do Alertmanager.

Adicione a seção rule_files para especificar os arquivos de regras de alerta:

```yaml
rule_files:
  - 'alert_rules.yml'
```

Explicação das linhas:

* **rule_files**: Define a lista de arquivos que contêm as regras de alerta.
* **'alert_rules.yml'**: O arquivo que contém as regras de alerta. Você pode nomear esse arquivo como desejar e ter vários arquivos de regras, se necessário.

Aqui está um exemplo de arquivo prometheus.yml completo:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

alerting:
  alertmanagers:
  - static_configs:
    - targets:
      - 'alertmanager:9093'

rule_files:
  - 'alert_rules.yml'
```

O arquivo alert_rules.yml contém as regras de alerta para o Prometheus. As regras de alerta são escritas usando a linguagem de consulta PromQL e são usadas para definir condições que, quando atendidas, disparam um alerta. Vou explicar de forma didática como configurar o alert_rules.yml.

Comece definindo um grupo de regras:

```yaml
groups:
- name: example_group
  rules:
```

* **groups**: Define a lista de grupos de regras no arquivo.
* **name: example_group**: O nome do grupo de regras. Escolha um nome que descreva o propósito geral das regras neste grupo.
* **rules**: Inicia a seção de regras do grupo.

Adicione regras de alerta:

```yaml
  - alert: HighRequestLatency
    expr: rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m]) > 0.5
    for: 10m
    labels:
      severity: critical
    annotations:
      summary: High request latency
      description: The average request latency is too high (over 0.5s for the last 10 minutes).
```

* **alert: HighRequestLatency**: O nome do alerta. Escolha um nome que descreva brevemente a condição de alerta.
* **expr**: A expressão PromQL que define a condição de alerta. Neste exemplo, estamos calculando a latência média das solicitações nos últimos 5 minutos e verificando se ela é maior que 0.5 segundos.
* **for: 10m**: A condição deve ser verdadeira por este período de tempo antes que o alerta seja disparado. Neste exemplo, a latência média deve ser maior que 0.5 segundos por 10 minutos consecutivos.
* **labels**: Rótulos adicionais que você deseja associar ao alerta. Neste exemplo, estamos adicionando um rótulo de severidade com valor "critical".
* **annotations**: Metadados adicionais sobre o alerta. Neste exemplo, estamos fornecendo um resumo e uma descrição do alerta.

Aqui está um exemplo completo de um arquivo `alert_rules.yml`:

```yaml
groups:
- name: example_group
  rules:
  - alert: HighRequestLatency
    expr: rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m]) > 0.5
    for: 10m
    labels:
      severity: critical
    annotations:
      summary: High request latency
      description: The average request latency is too high (over 0.5s for the last 10 minutes).
```

Você pode adicionar mais grupos e regras de alerta conforme necessário. Após configurar seu arquivo `alert_rules.yml`, verifique se ele está especificado na seção rule_files do arquivo `prometheus.yml` e reinicie o Prometheus para que as alterações entrem em vigor.

## Escalando o Alertmanager

![img#center](images/alert/umlsns.png#center)

Nesta arquitetura, o Alertmanager envia alertas para um Amazon SNS Topic. O Amazon SQS Queue está inscrito no SNS Topic para receber os alertas. A AWS Lambda Function é configurada para ser acionada quando novas mensagens chegam à fila SQS e processa os alertas conforme necessário. Aqui está um exemplo de uma função Lambda em Python para receber alertas e filtrar com base em labels. Neste exemplo, estamos usando labels aleatórias como "severity" e "team".

```python
import json

def filter_alerts_by_labels(alerts, labels):
    filtered_alerts = []
    
    for alert in alerts:
        match = all(alert.get('labels', {}).get(k) == v for k, v in labels.items())
        if match:
            filtered_alerts.append(alert)
    
    return filtered_alerts

def lambda_handler(event, context):
    print("Event: ", json.dumps(event))

    # Substitua estas labels pelos valores desejados
    required_labels = {
        "severity": "critical",
        "team": "team1"
    }

    alerts = []
    
    for record in event.get("Records", []):
        message_body = json.loads(record.get("body"))
        alerts.extend(message_body.get("alerts", []))

    filtered_alerts = filter_alerts_by_labels(alerts, required_labels)
    
    print("Alertas filtrados: ", json.dumps(filtered_alerts))

    # Aqui você pode processar os alertas filtrados de acordo com sua necessidade

    return {
        'statusCode': 200,
        'body': json.dumps('Lambda executada com sucesso!')
    }

```

Neste exemplo, a função `filter_alerts_by_labels` recebe uma lista de alertas e um dicionário de labels e retorna uma lista de alertas filtrados que correspondem às labels fornecidas. A função `lambda_handler` é a função principal que será executada quando a Lambda for acionada. Ela extrai os alertas das mensagens recebidas e, em seguida, utiliza a função `filter_alerts_by_labels` para filtrar os alertas com base nas labels desejadas. Você pode personalizar a variável `required_labels` de acordo com as labels que deseja filtrar.

---

## Alertas

### Hardware Linux

Memory Usage

```yaml
- alert: HighMemoryUsage
  expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100 > 80
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "High memory usage on {{ $labels.instance }}"
    description: "Memory usage is above 80% for more than 5 minutes on {{ $labels.instance }}"
```

CPU Usage

```yaml
- alert: HighCPUUsage
  expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "High CPU usage on {{ $labels.instance }}"
    description: "CPU usage is above 80% for more than 5 minutes on {{ $labels.instance }}"
```

Disk Usage

```yaml
- alert: HighDiskUsage
  expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100 < 20
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "High disk usage on {{ $labels.instance }}"
    description: "Disk usage is above 80% for more than 5 minutes on {{ $labels.instance }}"
```

Disk I/O

```yaml
- alert: HighDiskIO
  expr: sum by (instance) (rate(node_disk_io_time_seconds_total[5m])) > 100
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "High disk I/O on {{ $labels.instance }}"
    description: "Disk I/O is above 100 for more than 5 minutes on {{ $labels.instance }}"
```

Network I/O

```yaml
- alert: HighNetworkIO
  expr: sum by (instance) (rate(node_network_receive_bytes_total[5m]) + rate(node_network_transmit_bytes_total[5m])) / 2 > 1000000
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "High network I/O on {{ $labels.instance }}"
    description: "Network I/O is above 1 MB/s for more than 5 minutes on {{ $labels.instance }}"
```

High Latency

```yaml
- alert: HighLatency
  expr: histogram_quantile(0.99, rate(node_network_transmit_queue_length{quantile="0.99"}[5m])) > 10
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "High latency on {{ $labels.instance }}"
    description: "99th percentile network latency is above 10ms for more than 5 minutes on {{ $labels.instance }}"
```

### Hardware Windows

Memory Usage	

```yaml
- alert: HighMemoryUsage
  expr: 100 * (1 - (wmi_os_free_physical_memory_bytes / wmi_cs_physical_memory_bytes)) > 90
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "High memory usage on {{ $labels.instance }}"
    description: "Memory usage is above 90% for more than 5 minutes on {{ $labels.instance }}"

```

CPU Usage

```yaml
- alert: HighCPUUsage
  expr: 100 * (1 - avg_over_time(wmi_cpu_time_total{mode="idle"}[5m])) > 90
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "High CPU usage on {{ $labels.instance }}"
    description: "CPU usage is above 90% for more than 5 minutes on {{ $labels.instance }}"

```

Disk Usage

```yaml
- alert: HighDiskUsage
  expr: 100 * (1 - (wmi_logical_disk_free_bytes / wmi_logical_disk_size_bytes)) > 90
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "High disk usage on {{ $labels.instance }}"
    description: "Disk usage is above 90% for more than 5

```

Disk I/O

```yaml
- alert: HighDiskIO
  expr: sum by (instance) (rate(wmi_logical_disk_write_bytes_total[5m]) + rate(wmi_logical_disk_read_bytes_total[5m])) / 2 > 1000000
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "High disk I/O on {{ $labels.instance }}"
    description: "Disk I/O is above 1 MB/s for more than 5 minutes on {{ $labels.instance }}"

```

Network I/O

```yaml
- alert: HighNetworkIO
  expr: sum by (instance) (rate(wmi_network_interface_bytes_received_total[5m]) + rate(wmi_network_interface_bytes_sent_total[5m])) / 2 > 1000000
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "High network I/O on {{ $labels.instance }}"
    description: "Network I/O is above 1 MB/s for more than 5 minutes on {{ $labels.instance }}"

```

High Latency

```yaml
- alert: HighLatency
  expr: probe_duration_seconds{job="blackbox"} > 0.1
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "High latency on {{ $labels.instance }}"
    description: "Network latency is above 100ms for more than 5 minutes on {{ $labels.instance }}"

```

### Kubernetes

Pods CrashLooping

```yaml
- alert: PodCrashLooping
  expr: rate(kube_pod_container_status_restarts_total{job="kube-state-metrics"}[5m]) * 60 > 0
  for: 15m
  labels:
    severity: warning
  annotations:
    message: "Pod {{ $labels.namespace }}/{{ $labels.pod }} está em CrashLooping ({{ $value }} reinicializações nos últimos 5 minutos)"

```

Pods Not Ready

```yaml
- alert: PodNotReady
  expr: kube_pod_status_ready{condition="false"} == 1
  for: 10m
  labels:
    severity: warning
  annotations:
    message: "Pod {{ $labels.namespace }}/{{ $labels.pod }} não está pronto"

```

Pods Not Running

```yaml
- alert: PodNotRunning
  expr: kube_pod_status_phase{phase=~"Pending|Failed"} == 1
  for: 10m
  labels:
    severity: warning
  annotations:
    message: "Pod {{ $labels.namespace }}/{{ $labels.pod }} não está em execução (estado: {{ $labels.phase }})"

```

Pods Pending

```yaml
- alert: PodPending
  expr: kube_pod_status_phase{phase="Pending"} == 1
  for: 10m
  labels:
    severity: warning
  annotations:
    message: "Pod {{ $labels.namespace }}/{{ $labels.pod }} está pendente"

```

Node Not Ready

```yaml
- alert: NodeNotReady
  expr: kube_node_status_condition{condition="Ready",status="false"} == 1
  for: 15m
  labels:
    severity: warning
  annotations:
    message: "Nó {{ $labels.node }} não está pronto"

```

Node Not Schedulable

```yaml
- alert: NodeNotSchedulable
  expr: kube_node_spec_unschedulable == 1
  for: 5m
  labels:
    severity: warning
  annotations:
    message: "Nó {{ $labels.node }} não é agendável"

```

Out of Disk

```yaml
- alert: NodeOutOfDisk
  expr: kube_node_status_condition{condition="OutOfDisk",status="true"} == 1
  for: 5m
  labels:
    severity: warning
  annotations:
    message: "Nó {{ $labels.node }} está sem espaço em disco"

```

OOMKilled

```yaml
- alert: PodOOMKilled
  expr: increase(kube_pod_container_status_terminated_reason{reason="OOMKilled"}[5m]) > 0
  for: 5m
  labels:
    severity: warning
  annotations:
    message: "Container no Pod {{ $labels.namespace }}/{{ $labels.pod }} foi encerrado por falta de memória (OOMKilled)"
```

### Docker

As expressões de alerta para o Docker podem ser criadas usando as métricas do cAdvisor ou da API do Docker. Abaixo estão algumas expressões de alerta baseadas em métricas do cAdvisor. Supondo que você tenha o cAdvisor coletando métricas do Docker e integrado ao Prometheus:

Contêineres em excesso:

```yaml
- alert: ExcessiveContainers
  expr: sum(container_last_seen{name=~".+"}) by (instance) > 100
  for: 5m
  labels:
    severity: warning
  annotations:
    message: "Muitos contêineres em execução no host {{ $labels.instance }} ({{ $value }} contêineres)"

```

Alta utilização de CPU:

```yaml
- alert: HighCPUUsage
  expr: (rate(container_cpu_usage_seconds_total{container_label_com_docker_compose_project!=""}[5m]) * 100) > 90
  for: 5m
  labels:
    severity: warning
  annotations:
    message: "Alta utilização de CPU no contêiner {{ $labels.container_label_com_docker_compose_service }} ({{ $value | printf "%.2f" }}%)"

```

Alta utilização de memória:

```yaml
- alert: HighMemoryUsage
  expr: (container_memory_usage_bytes{container_label_com_docker_compose_project!=""} / container_spec_memory_limit_bytes{container_label_com_docker_compose_project!=""} * 100) > 90
  for: 5m
  labels:
    severity: warning
  annotations:
    message: "Alta utilização de memória no contêiner {{ $labels.container_label_com_docker_compose_service }} ({{ $value | printf "%.2f" }}%)"

```

Contêineres reiniciados frequentemente:

```yaml
- alert: FrequentContainerRestarts
  expr: increase(container_start_time_seconds{container_label_com_docker_compose_project!=""}[5m]) > 5
  for: 5m
  labels:
    severity: warning
  annotations:
    message: "Contêiner {{ $labels.container_label_com_docker_compose_service }} reiniciado frequentemente ({{ $value }} reinicializações nos últimos 5 minutos)"

```

Contêineres parados inesperadamente:

```yaml
- alert: UnexpectedStoppedContainers
  expr: increase(container_tasks_state{state="stopped", container_label_com_docker_compose_project!=""}[5m]) > 0
  for: 5m
  labels:
    severity: warning
  annotations:
    message: "Contêiner {{ $labels.container_label_com_docker_compose_service }} parou inesperadamente ({{ $value }} paradas nos últimos 5 minutos)"
```

Essas expressões de alerta devem ser incluídas no arquivo de configuração do Prometheus Alertmanager. Lembre-se de ajustar os valores e durações de acordo com as necessidades específicas do seu ambiente.

### MySQL

### PostgreSQL

### MongoDB

### Redis



---

### Referências