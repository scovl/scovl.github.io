+++
title = "Building Order"
description = "DevOps Lab"
date = 2019-06-14T05:49:24-03:00
tags = ["fedora","linux","sysadmin","devops"]
draft = true
weight = 1
+++

Este artigo tem como objetivo simular diversos cenários de infraEstrutura para que possamos expandir diversas possibilidades de implementação de acordo com a necessidade de cada um. Como base usarei o Vagrant para permitir uma abordagem básica dos ambientes, o orquestrador de containeres Kubernetes, o Zabbix como sistema de monitoramento, e o Ansible como provisionamento de ambientes. Acredito que a melhor maneira de visualizar a simulação um ambiente, é desenhando o cenário proposto. Desta maneira, podemos estudar melhor cada caso. Para desenhar os cenários propostos usarei o Draw.io.

### Porque infraEstrutura em containeres?

Acredito que boa parte dos softwares e em especial os grandes monólitos, são executados como um único processo ou como um pequeno número de processos espalhados por um punhado de servidores. Esses sistemas legados têm ciclos de liberação lenta e costumam ser atualizados com pouca frequência. No final de cada ciclo de lançamento, os desenvolvedores empacotam todo o sistema e o entregam à equipe de operações que fazem o deploy e monitora o comportamento da aplicação. E em caso de falhas de hardware, a equipe de operações migra manualmente para os servidores remanescentes.

Uma das alternativas para resolver esta questão dos monolitos, é a construção de aplicações menores, modulares e independentes chamados de microsserviços. Como os microsserviços são dissociados uns dos outros, eles podem ser desenvolvidos, implantados, atualizados e dimensionados individualmente. Isso permite que você altere os componentes com rapidez e com a frequência necessária para acompanhar os requisitos de negócios com mais velocidade. Seja na abordagem de softwares monólitos ou de microserviços, em uma infraEstrutura tradicional em cascata, teríamos algo semelhante a isto:

![]()


Muitas vezes devido a falta de recursos, acabamos agrupando vários aplicativos em cada VM ao invés de poucos aplicativos em uma VM inteira (reduzindo assim a concorrência entre as aplicações). Os microserviços não resolvem os problemas operacionais que demandam grande quantidade de recursos em hardware e datacenteres cada vez maiores. Ou seja, os microserviços ao mesmo tempo que resolvem um lado, desorienta o time de operações que precisa gerenciar, monitorar e garantir o melhor funcionamento destes serviços. O problema é que fazer tudo isso manualmente é um trabalho árduo. 

Pensando nesta situação, precisamos então incluir tecnologias que possibilitem criar um cenário que possibilite automações como configuração automática dos ambientes, dos serviços, a supervisão e manuseio de falhas. É aqui que entra o Kubernetes. O Kubernetes abstrai a infraEstrutura convencional e expõe todo o seu datacenter como um único recurso computacional enorme. Ao usar contêineres, você pode (e deve) ter um contêiner para cada aplicativo. Conforme mostrado na figura abaixo, o resultado final é que você pode ajustar muito mais aplicativos na mesma máquina bare-metal:

![]()

Em comparação com as VMs, os contêineres são muito mais leves, o que permite a execução de um maior número de componentes de software no mesmo hardware, principalmente porque cada VM precisa executar seu próprio conjunto de processos do sistema, o que exige recursos computacionais adicionais aos consumidos o próprio processo do componente. Um contêiner, por outro lado, nada mais é do que um único processo isolado em execução no sistema operacional host, consumindo apenas os recursos que o aplicativo consome e sem a sobrecarga de nenhum processo adicional.

![]()

Quando você executa três VMs em um host, você tem três sistemas operacionais completamente separados em execução e compartilhando o mesmo hardware bare-metal. Abaixo dessas VMs está o sistema operacional do host e um hipervisor, que divide os recursos de hardware físico em conjuntos menores de recursos virtuais que podem ser usados pelo sistema operacional dentro de cada VM. Os aplicativos executados nessas VMs realizam chamadas do sistema para o kernel do sistema operacional guest na VM, e o kernel executa instruções x86 na CPU física do host por meio do hypervisor.

Os contêineres, por outro lado, executam todas as chamadas do sistema no mesmo kernel em execução no sistema operacional host. Esse único kernel é o único que executa instruções do x86 na CPU do host. A CPU não precisa fazer nenhum tipo de virtualização como as VMs. O principal benefício das máquinas virtuais é o isolamento completo que elas fornecem, porque cada VM executa seu próprio kernel Linux, enquanto todos os contêineres chamam o mesmo kernel, o que pode claramente representar um risco de segurança. Se você tiver uma quantidade limitada de recursos de hardware, as VMs só poderão ser uma opção quando você tiver um pequeno número de processos que deseja isolar.

Para executar um maior número de processos isolados na mesma máquina, os contêineres são uma opção muito melhor devido à baixa sobrecarga. Lembre-se de que cada VM executa seu próprio conjunto de serviços do sistema, enquanto os contêineres não, porque todos eles são executados no mesmo sistema operacional. Isso também significa que, para executar um contêiner, nada precisa ser inicializado, como é o caso das VMs. Um processo executado em um contêiner é iniciado imediatamente.


---

![]()

Baseado no gráfico acima, irei provisionar a nossa InfraEstrutura usando a distribuição GNU/Linux CentOS como Host. Para tal, irei usar uma instalação base kickstart, e um playbook Ansible para prover tudo aquilo que desejo configurar neste servidor: 