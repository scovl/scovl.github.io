+++
title = "OpenShift"
description = "Instalando e configurando On-Premise"
date = 2025-07-19T19:47:57-03:00
tags = [
    "openshift",
    "kubernetes",
    "cri-o",
    "linux",
    "rhel",
    "centos",
    "fedora",
]
author = "Vitor Lobo Ramos"
weight = 6
draft = true
+++

Imagine o seguinte cenário:

Você contém diversos servidores rodando diversas aplicações em produção e homologação que precisam ser monitoradas, os deploy's precisam ser rápidos e eficientes com o menor risco possível de queda. Além disso a sua infraEstrutura precisa ser escalável, precisa suportar todas as requesições necessárias para atender à demanda esperada pelo cliente. Imagine este cenário com integração contínua, com deploy contínuo onde ao desenvolvedor, caberá apenas trabalhar com a ferramenta de controle de versão ([git](https://git-scm.com/), [svn](https://subversion.apache.org/), etc..). 

Imagine um sistema inteligente o suficiente para detectar alterações em código, falhas, ser capaz de voltar a versão automaticamente se algo der errado, ser capaz de escalar horizontalmente automaticamente se as requisições e os acessos aumentarem de repente, e também ser capaz de voltar ao seu estado normal assim que os acessos cessarem. Além de tudo isso, este sistema inteligente é capaz de prolongar a vida útil dos servidores por entrar em estado IDLE quando nenhuma requisição estiver rodando, e retornar ao estado normal a partir da primeira requisição. 

E tudo de maneira automática. Este sistema também é capaz de fazer canary teste, para descobrir a aceitação em produção de um determinado sistema. Imaginou o cenário? Pois bem, é sobre esta tecnologia que irei escrever aqui. Devido ao crescimento da demanda por máquinas virtuais e grande dificuldade na operação desse ambiente, surgiu a necessidade de melhorar esse modelo. 

Com isso empresas que buscam melhores soluções para administradores de sistemas, e desenvolvedores tanto do meio corporativo, quanto da própria comunidade, perceberam que não havia a necessidade de recriar um sistema complexo bastando apenas reutilizar alguns recursos da própria arquitetura e engenharia do kernel Linux. Lançando mão de uma funcionalidade nativa do Kernel Linux para facilitar a criação e gestão destes ambientes virtuais, eles conseguiram ótimos resultados. Assim surgiu o **[LXC](https://en.wikipedia.org/wiki/LXC)**.

![https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/lxc.png#center](https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/lxc.png#center)

O Linux Container ou **[LXC](https://en.wikipedia.org/wiki/LXC)** como é mais conhecido, foi lançado em 2008 e é uma tecnologia que permite a criação de múltiplas instâncias isoladas de um determinado Sistema Operacional dentro de um único host. É uma maneira de virtualizar aplicações dentro de um servidor Linux. O conceito é simples e antigo sendo o comando **[chroot](https://en.wikipedia.org/wiki/Chroot)** seu precursor mais famoso que foi lançado em 1979 pelo **[Unix V7](https://en.wikipedia.org/wiki/Version_7_Unix)** com o intuito de segregar acessos a diretórios e evitar que o usuário pudesse ter acesso à estrutura raiz ("/" ou root). Esse conceito evoluiu alguns anos mais tarde com o lançamento do **[jail](https://www.freebsd.org/cgi/man.cgi?query=jail&amp;sektion=8&amp;manpath=freebsd-release-ports)**, no sistema operacional FreeBSD 4.

Essa implementação já introduzia a ideia de segregação de rede e limitação dos acessos de superusuários aos processos que passou a ser adotada com maiores funcionalidades pelas distribuições Linux. Posteriormente foi melhor definido em alguns sistemas como o **[AIX WPAR](https://en.wikipedia.org/wiki/Workload_Partitions)** e o **[Solaris Containers](https://en.wikipedia.org/wiki/Solaris_Containers)**. Nesses dois sistemas já havia o conceito de virtualização de sistema operacional, mas não o conceito de contêineres.

Nas distribuições Linux o chroot era uma maneira fácil de criar uma jail para as conexões dos servidores FTP, mas acabou ficando mais conhecido pela sua vulnerabilidade do que pela sua segurança. Mais tarde o chroot acabou ajudando a cunhar um termo **[jailbreak](https://pt.wikipedia.org/wiki/Jailbreak_(iOS))**. A grande diferença entre o chroot e o LXC é o nível de segurança que se pode alcançar. 

Com relação à virtualização, a diferença está no fato do LXC não necessitar de uma camada de sistema operacional para cada aplicação. Ao comparar com a virtualização tradicional, fica mais claro que uma aplicação sendo executada em um LXC demanda muito menos recursos, consumindo menos espaço em disco, e com um nível de portabilidade difícil de ser alcançado por outras plataformas. Mas não foi só a adoção de desenvolvedores e administradores de sistemas que tornou essa tecnologia tão popular. A consolidação da virtualização no mercado e a crescente demanda por computação em nuvem criaram o ambiente perfeito para o LXC se espalhar rapidamente. Aplicações podem ser portadas direto do laptop do desenvolvedor, para o servidor de produção, ou ainda para uma instância virtual em uma nuvem pública ou privada.

![https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/docker.png#center](https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/docker.png#center)

Hoje um dos mais conhecidos LXC's do mercado é o **[Docker](https://pt.wikipedia.org/wiki/Docker_(programa))**, escrito em **[GO](https://golang.org/)**, que nasceu como um projeto open source da **[DotCloud](https://cloud.docker.com/)**, uma empresa de **[PaaS (Platform as a Service)](https://pt.wikipedia.org/wiki/Plataforma_como_servi%C3%A7o)** que apesar de estar mais interessada em utilizar LXC apenas em suas aplicações, acabou desenvolvendo um produto que foi muito bem aceito pelo mercado. Do ponto de vista de desenvolvimento, o Docker por sí atendeu muito bem em vários quesitos. No entanto, com a crescente demanda e necessidade de entregar mais resultados em menos tempo, surgiu também a necessidade de extender as funcionalidades do Docker. Surgiu então ferramentas de orquestração de contêineres como Kubernetes e posteriormente potencializadores do próprio Kubernetes como é o caso do OpenShift.

### CAPÍTULO 1 - O CONCEITO

* **[Plataforma em contêineres](#plataforma-em-conteineres)**
* **[Casos de Uso](#casos-de-uso)**
* **[Escalando Aplicações](#escalando-aplicacoes)**

### CAPÍTULO 2 - PREPARANDO O AMBIENTE

* **[Pré-requisitos Fundamentais](#pré-requisitos-fundamentais)**
* **[Instalando as Ferramentas Necessárias](#instalando-as-ferramentas-necessárias)**
* **[Criando o Arquivo de Configuração (install-config.yaml)](#criando-o-arquivo-de-configuração-install-configyaml)**
* **[Obtendo o Pull Secret e a Chave SSH](#obtendo-o-pull-secret-e-a-chave-ssh)**

### CAPÍTULO 3 - EXECUTANDO A INSTALAÇÃO DO CLUSTER

* **[Gerando os Manifests de Instalação](#gerando-os-manifests-de-instalação)**
* **[O Processo de Instalação Automatizado](#o-processo-de-instalação-automatizado)**
* **[Verificando a Instalação e Acessando o Cluster](#verificando-a-instalação-e-acessando-o-cluster)**
* **[Configuração Pós-Instalação](#configuração-pós-instalação)**

### CAPÍTULO 4 - TEST DRIVE

* **[Criando Projetos](#criando-projetos)**
* **[Implementando nosso primeiro aplicativo](#implementando-nosso-primeiro-aplicativo)**
* **[Trabalhando diretamente com CRI-O](#trabalhando-diretamente-com-cri-o)**

### CAPÍTULO 5 - APROFUNDANDO

* **[Compreendendo o processo](#compreendendo-o-processo)**
* **[Um pouco sobre kubernetes](#um-pouco-sobre-kubernetes)**
* **[Um pouco sobre CRI-O](#um-pouco-sobre-cri-o)**
* **[Fluxo de trabalho automatizado](#fluxo-de-trabalho-automatizado)**
* **[O namespace MOUNT](#o-namespace-mount)**
* **[O namespace UTS](#o-namespace-uts)**
* **[O namespace PID](#o-namespace-pid)**


---

### PLATAFORMA EM CONTEINERES

**O que é uma plataforma de contêineres?**

Trata-se de uma plataforma que usa contêineres para gerar build, deploy, servir e orquestrar os aplicativos em execução dentro dele. Os contêineres contém todas as bibliotecas e códigos necessários para que as aplicações funcionem adequadamente e de maneira isolada. Existem basicamente, cinco tipos de recursos são isolados em contêineres. São eles:

* **Sistemas de arquivos montados** - `/etc`, `/dev`, `/proc`, `/sys`, `/run`, `/var/run`
* **Recursos de memória compartilhada** - `shmget()`, `shmctl()`, `shmat()`, `shmdt()`
* **Hostname e nome de domínio (dns)** - `hostname`, `domainname`
* **Recursos de rede (endereço IP, endereço MAC, buffers de memória)** - `ip`, `ifconfig`, `route`, `netstat`
* **Contadores de processo** - `ps`, `top`, `htop`

Embora o **[CRI-O](https://cri-o.io/)** (Container Runtime Interface) gerencie contêineres facilitando os recursos do **[kernel do Linux](https://www.kernel.org/)**, ele é limitado a um único sistema operacional no host. Para orquestrar contêineres em vários servidores com eficiência, é necessário usar um mecanismo de orquestração de contêineres. Isto é, um aplicativo que gerencia contêineres em tempo de execução em um cluster de hosts para fornecer uma plataforma de aplicativo escalável. 

Existem alguns orquestradores conhecidos na comunidade e no mercado como o Rancher, Heroku, Apache Mesos, Docker Swarm, Kubernetes e o OpenShift. O **[OpenShift](https://www.openshift.com/)** 4.x usa o **[Kubernetes](https://kubernetes.io)** como seu mecanismo de orquestração de contêineres, mas com uma arquitetura significativamente redesenhada e o **[CRI-O](https://cri-o.io/)** como runtime padrão de contêineres. O Kubernetes é um projeto de código aberto que foi iniciado pelo Google e em 2015 foi doado para a **[Cloud Native Computing Foundation](https://www.cncf.io/)**.

O **[OpenShift 4.x](https://www.openshift.com/)** introduz uma nova arquitetura baseada em **Operadores**, que são responsáveis por automatizar a instalação, atualização e gerenciamento do ciclo de vida dos componentes do cluster e das aplicações. Os Operadores substituem a arquitetura master/node tradicional por uma abordagem mais distribuída e resiliente, onde cada componente é gerenciado por seu próprio operador especializado.

Esta arquitetura baseada em Operadores representa uma mudança fundamental no **[OpenShift 4.x](https://www.openshift.com/)**, automatizando todo o ciclo de vida não só das aplicações, mas do próprio cluster. Como veremos em detalhe no Capítulo 5, funções como atualizações, monitoramento e logging são gerenciadas por Operadores específicos que vêm por padrão na plataforma.

**Principais componentes da arquitetura OpenShift 4.x:**

* **Control Plane**: Gerenciado por operadores especializados (API Server, Controller Manager, Scheduler)
* **Worker Nodes**: Nós de trabalho que executam as aplicações
* **RHCOS**: Sistema operacional imutável baseado em Red Hat Enterprise Linux CoreOS
* **CRI-O**: Runtime padrão de contêineres, mais leve e otimizado que o Docker
* **Operators**: Automatizam a instalação, configuração e gerenciamento de componentes

A grande vantagem de usar o OpenShift ao invés de seu concorrente Heroku, é que o OpenShift é gratuito, de código aberto, e roda tanto em rede pública, quanto em rede privada. O Heroku roda em plataforma fechada e somente em redes públicas. Abaixo uma visão geral da arquitetura do OpenShift 4.x:

![https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/2wzeZJt.png#center](https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/2wzeZJt.png#center)

> NOTA: Um NODE é uma máquina de trabalho no OpenShift, anteriormente conhecida como minion no Kubernetes. Um node pode ser uma máquina virtual ou física, dependendo do cluster. Cada node tem os serviços necessários para executar pods e é gerenciado pelos componentes principais. Os serviços em um node incluem [CRI-O](https://cri-o.io/) (Container Runtime Interface), [kubelet](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/) e [kube-proxy](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/). No OpenShift 4.x, os nodes executam RHCOS (Red Hat Enterprise Linux CoreOS), um sistema operacional imutável otimizado para contêineres. Consulte a seção sobre nodes do Kubernetes no [documento de design da arquitetura](https://kubernetes.io/docs/concepts/architecture/nodes/) para obter mais detalhes.

Para tirar proveito de todo o potencial de uma plataforma de contêiner como o Kubernetes, é necessário alguns componentes adicionais. O OpenShift 4.x usa o **CRI-O** como runtime padrão de contêineres, que é uma implementação mais leve e otimizada da Interface de Runtime de Contêiner (CRI) do Kubernetes. A partir do OpenShift 4.x, o CRI-O não é apenas uma opção, mas o **único runtime de contêiner suportado**, substituindo completamente o Docker. Esta foi uma decisão estratégica para ter um runtime mais leve, seguro e alinhado ao ciclo de vida do Kubernetes.

Como veremos em detalhe na seção "UM POUCO SOBRE CRI-O E O KERNEL LINUX", o CRI-O oferece vantagens significativas em termos de segurança, performance e integração nativa com Kubernetes. O OpenShift 4.x usa uma arquitetura baseada em operadores e controladores customizados, expandindo-se para fornecer serviços adicionais com maior resiliência e automação.

Em uma plataforma de contêiner como o OpenShift, as imagens são criadas quando ocorre o deploy das aplicações, ou quando as imagens são atualizadas. Para ser eficaz, as imagens devem estar disponíveis rapidamente em todos os nodes em um cluster. Para tornar isto possível, o OpenShift inclui um registro de imagens integrado como parte de sua configuração padrão. O registro de imagem é um local central que pode servir imagens dos contêineres para vários locais (tipo um **[DockerHub](https://hub.docker.com/)** local). 

No Kubernetes, os contêineres são criados nos nodes usando componentes chamados **pods**. Os pods são a menor unidade dentro de um cluster Kubernetes e nada mais é do que containers rodando dentro do seu cluster. O CRI-O gerencia esses contêineres de forma mais eficiente que o Docker, usando menos recursos e sendo mais otimizado para Kubernetes. 

Quando um aplicativo consiste em mais de um pods, o acesso ao aplicativo é gerenciado por meio de um componente chamado service. Um service é um proxy que conecta vários pods e os mapeia para um endereço IP em um ou mais nodes no cluster. Os endereços IP podem ser difíceis de gerenciar e compartilhar, especialmente quando estão por trás de um firewall. O OpenShift ajuda a resolver esse problema fornecendo uma camada de roteamento integrada. 

A camada de roteamento é um software balanceador de carga. Quando é feito um deploy de uma aplicação no OpenShift, um registro DNS é criado automaticamente para ele. Esse registro DNS é adicionado ao balanceador de carga, e o balanceador de carga faz interface com o serviço Kubernetes para lidar eficientemente com as conexões entre o deploy da aplicação e seus usuários. Dessa forma, não interessa saber o IP do pod uma vez que quando o container for derrubado e subir outro contêiner para substituí-lo, haverá outro IP em seu lugar.

Nesse caso o registro DNS que fora criado automaticamente será nosso mapeamento de rede daquela respectiva aplicação. Com as aplicações sendo executadas em pods em vários nodes e solicitações de gerenciamento vindas do node master, há bastante comunicação entre os servidores em um cluster do OpenShift. Assim, você precisa ter certeza de que o tráfego está corretamente criptografado e que poderá separar quando necessário. Visão geral da arquitetura OpenShift:

![https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/o3uoJ12.png#center](https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/o3uoJ12.png#center)

O OpenShift usa uma solução de rede definida por software **[SDN](https://pt.wikipedia.org/wiki/Software_defined_networking)** para criptografar e modelar o tráfego de rede em um cluster. O OpenShift SDN, é uma solução que usa o **[Open vSwitch](http://openvswitch.org)** e outras tecnologias software livre, que são configuradas por padrão quando o OpenShift é implementado. Outras soluções SDN também são suportadas. O OpenShift possui fluxos de trabalho projetados para ajudá-lo a gerenciar seus aplicativos em todas as fases de seu ciclo de vida:

* **Build**

    * A principal maneira de criar aplicativos no OpenShift é usando `build image`. Esse processo é o fluxo de trabalho padrão.

* **Deployment**

    * No fluxo de trabalho padrão no OpenShift, o deployment da aplicação é acionado automaticamente depois que a imagem do contêiner é criado e disponibilizado. O processo de deployment usa a imagem do aplicativo recém criado e a implanta em um ou mais nodes. Além dos pods dos aplicativos, um serviço é criado, junto com uma rota de DNS na camada de roteamento.

![https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/tl53ec9.png#center](https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/tl53ec9.png#center)

* **Upgrade**

    * Os usuários podem acessar o aplicativo recém-criado através da camada de roteamento após todos os componentes terem sido implantados. As atualizações de aplicativos usam o mesmo fluxo de trabalho. Quando um upgrade é acionado, uma nova imagem de contêiner é criada e a nova versão do aplicativo é implantada. Vários processos de atualização estarão disponíveis. A baixo a visão geral do processo de deploy da aplicação:![https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/aGhInY5.png#center](https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/aGhInY5.png#center)

É assim que o OpenShift funciona em alto nível. Para obter uma lista mais abrangente de como o OpenShift se integra e
expande as funcionalidades do Kubernetes, visite **[www.openshift.com/container-platform/kubernetes.html](http://www.openshift.com/container-platform/kubernetes.html)**.

*   Retirement (fim do ciclo de vida).

---

### CASOS DE USO

Se parar-mos para refletir um pouco sobre tecnologias que vieram com a proposta de isolar processos e serviços como os mainframes, e a revolução da virtualização onde várias máquinas virtuais podem ser executadas em um único servidor físico, podemos compreender melhor o rumo em que as tecnologias hoje tem avançado. Por exemplo, com máquinas virtuais, cada processo é isolado em sua própria máquina virtual. Como cada máquina virtual possui um sistema operacional completo e um kernel completo, ele deve ter todos os sistemas de arquivos necessários para um sistema operacional completo. Isso também significa que ele deve ser corrigido, gerenciado e tratado como uma infraestrutura tradicional. Contêineres são o próximo passo nessa evolução. Um contêiner contém tudo o que a aplicação precisa para rodar com sucesso. Como por exemplo:

* **Código-fonte ou o código compilado** 
* **Bibliotecas e aplicativos necessários para rodar corretamente** 
* **Configurações e informações sobre como conectar-se a fontes de dados compartilhadas** 

Máquinas virtuais podem ser usadas para isolamento do processo:

![https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/FsyZT7m.png#center](https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/FsyZT7m.png#center)

Casos de uso para plataformas que trabalham com contêineres:

![https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/MTIhnmV.png#center](https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/MTIhnmV.png#center)

Os contêineres usam um único kernel para servir aplicações economizando espaço, e recursos e fornecendo plataformas de aplicações flexíveis. No entanto, é bom frizar que **o que os contêineres não contêm, é igualmente importante**. Ao contrário das máquinas virtuais, todos os contêineres são executados em um único kernel Linux compartilhado. Para isolar os aplicativos, os contêineres usam componentes dentro do kernel. Como os contêineres não precisam incluir um kernel completo para atender a aplicação a ser implementada, além de todas as dependências de um sistema operacional, eles tendem a ser muito menores do que as máquinas virtuais, tanto em suas necessidades de armazenamento, quanto no consumo de recursos.

Por exemplo, enquanto uma máquina virtual típica você poderá começar com um storage de 10 GB mais ou menos, a imagem do contêiner do CentOS 7 é de 140 MB (do Alpine Linux é ainda menor). Ser menor vem com algumas vantagens: Primeiro, a portabilidade é aprimorada. Mover 140 MB de um servidor para outro é muito mais rápido do que mover 10 GB ou mais. Em segundo lugar, iniciar um contêiner não inclui a inicialização de um kernel inteiro, o processo de inicialização é muito mais rápido. Iniciar um contêiner é normalmente medido em milissegundos, ao contrário de segundos ou minutos para máquinas virtuais.

As tecnologias por trás dos contêineres fornecem vários benefícios técnicos. Eles também oferecem vantagens comerciais. Soluções empresariais modernas devem incluir economia de tempo ou recursos como parte de seu design. Se você comparar um servidor que usa máquinas virtuais para isolar processos com um que usa contêineres para fazer o mesmo, notará algumas diferenças fundamentais:

*   Os contêineres consomem os recursos do servidor com mais eficiência. Como há um único kernel compartilhado para todos os contêineres em um host, em vez de vários kernels virtualizados, como em máquinas virtuais, mais recursos do servidor são usados para fornecer aplicações, em vez de haver sobrecarga na plataforma.
*   A densidade da aplicação aumenta com os contêineres. Como a unidade básica usada para efetuar o deploy da aplicação (imagens de contêiner) é muito menor que a unidade para máquinas virtuais (imagens de máquina virtual), mais aplicativos podem caber por servidor. Isso significa que mais aplicações exigem menos servidores para serem executados.

Comparando máquinas virtuais e contêineres, podemos ver, por exemplo, que os contêineres fornecem uma melhor utilização dos recursos do servidor:

![https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/IP1wCV7.png#center](https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/IP1wCV7.png#center)

No entanto, mesmo que os contêineres sejam ótimas ferramentas, nem sempre são a melhor ferramenta para todos os trabalhos. Por exemplo, se você tiver um aplicativo legado complexo, tenha cuidado ao decidir dividi-lo e convertê-lo em uma série de contêineres. Se a aplicação em questão trata-se de um modelo monolítico muito grande, e com diversos recursos, com um banco de dados relacional enorme, e esta aplicação fizer parte de todo um ecossistema de outras aplicações onde compartilha recursos, executa-lo em um contêiner não fará muito sentido e poderá ser um desafio bastante cansativo de tentar implementa-lo em contêineres.

Os contêineres são uma tecnologia revolucionária, **mas não fazem tudo por conta própria**. O armazenamento é uma área em que os contêineres precisam ser configurados com outras soluções para efetuar deploys em produção, por exemplo. Isso ocorre porque o armazenamento criado quando um contêiner é levantado, é efêmero. Isto é, se um contêiner for destruído ou substituído, o armazenamento de dentro desse contêiner não será reutilizado.

Isso é proposital e ocorre por design para permitir que os contêineres estejam sempre stateless por padrão. Isto é, se algo der errado, um container pode ser removido completamente do seu ambiente, e um novo pode ser colocado para substituí-lo quase que instantaneamente. Em outras palavras, **contêineres foram feitos para morrer**. A idéia de um contêiner stateless é ótima. Mas em algum lugar em sua aplicação, geralmente em vários lugares, os dados precisam ser compartilhados em vários contêineres, e o estado do serviço precisa ser preservado. Aqui estão alguns exemplos dessas situações:

* Dados compartilhados que precisam estar disponíveis em vários contêineres, como imagens carregadas para um aplicativo da web.
* Informações do estado do usuário em um aplicativo complexo, que permite que os usuários continuem de onde pararam durante uma transação de longa duração.
* Informações armazenadas em bancos de dados relacionais ou não relacionais.

Em todas essas situações e muitas outras, você precisa ter **armazenamento persistente disponível em seus contêineres**. Esse armazenamento deve ser definido como parte do deploy da sua aplicação e deve estar disponível em todos os nodes do cluster no OpenShift. Felizmente, o OpenShift tem várias maneiras de resolver esse problema. Quando você consegue integrar efetivamente o armazenamento compartilhado aos contêineres da sua aplicação, poderá pensar em escalabilidade.

---

### ESCALANDO APLICACOES

Para aplicações stateless, escalar para cima e para baixo é simples. Como não há dependências além do que está no contêiner e como as transações que acontecem no contêiner são atômicas por design, tudo o que você precisa fazer para dimensionar uma aplicação stateless, é implantar mais instâncias dele e equilibrá-las. Para tornar esse processo ainda mais fácil, o OpenShift faz o proxy das conexões para cada aplicativo por meio de um balanceador de carga integrado. Isso permite que os aplicativos aumentem e diminuam o escalonamento sem alteração na maneira como os usuários se conectam a aplicação.

Se seus aplicativos forem stateful, o que significa que eles precisam armazenar ou recuperar dados compartilhados, como um banco de dados ou dados que um usuário carregou, então você precisará fornecer armazenamento persistente para eles. Esse armazenamento precisa ser ampliado e reduzido automaticamente em suas aplicações no OpenShift. Para aplicações com informações de estado, o armazenamento persistente é um componente-chave que deve ser totalmente integrado ao seu design.

À medida que você começa a separar os aplicativos tradicionais e monolíticos em serviços menores que funcionam de forma eficaz em contêineres, você começará a visualizar suas necessidades de dados de uma maneira diferente. Esse processo é geralmente chamado de design de aplicativos como microsserviços.

**OpenShift Service Mesh (baseado em Istio):**

Para gerenciar a comunicação, segurança e observabilidade entre microsserviços, o OpenShift oferece o **Service Mesh**, uma solução baseada no Istio que é instalada e gerenciada via Operador. O Service Mesh fornece:

* **Comunicação entre Serviços**: Gerenciamento inteligente de tráfego entre microsserviços
* **Segurança**: Autenticação e autorização automática entre serviços
* **Observabilidade**: Monitoramento, logging e tracing distribuído
* **Políticas de Rede**: Controle granular sobre como os serviços se comunicam
* **Resiliência**: Circuit breakers, retry policies e fault injection

O Service Mesh é especialmente útil em arquiteturas de microsserviços complexas, onde a comunicação entre serviços precisa ser gerenciada de forma centralizada e segura.

Integrando aplicativos stateful e stateless:

![https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/cG69vhp.png#center](https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/cG69vhp.png#center)

O OpenShift pode integrar e gerenciar plataformas de armazenamento externo e garantir que o volume de armazenamento de melhor ajuste seja correspondido com os aplicativos que precisam dele. Para qualquer aplicação, você terá serviços que precisam ser informativos e outros sem estado. Por exemplo, o serviço que fornece conteúdo da web estático pode ser sem estado, enquanto o serviço que processa a autenticação do usuário precisa poder gravar informações no armazenamento persistente.

Como cada serviço é executado em seu próprio contêiner, os serviços podem ser ampliados e desativados independentemente. Em vez de precisar ampliar toda a sua base de código, com os contêineres, você dimensiona apenas os serviços em seu aplicativo que precisam processar cargas de trabalho adicionais. Além disso, como apenas os contêineres que precisam de acesso ao armazenamento persistente o contêm, os dados que entram no contêiner são mais seguros. No exemplo abaixo, se houvesse uma vulnerabilidade no serviço B, um processo comprometido teria dificuldade em obter acesso aos dados armazenados no armazenamento persistente. Ilustrandoas diferenças entre aplicativos tradicionais e de microsserviço: os aplicativos de microsserviço escalam seus componentes de forma independente, criando melhor desempenho e utilização de recursos:

![https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/8sPOhGu.png#center](https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/8sPOhGu.png#center)

Isso nos leva ao fim do nosso passo inicial inicial do OpenShift e como ele implementa, gerencia e orquestra os aplicativos implantados com contêineres usando o CRI-O e o Kubernetes. Os benefícios fornecidos pelo OpenShift economizam tempo para humanos e usam os recursos do servidor com mais eficiência. Além disso, a natureza de como os contêineres funcionam oferece melhor escalabilidade e velocidade de implantação em relação às implantações de máquinas virtuais.

---

## CAPÍTULO 2 - PREPARANDO O AMBIENTE DE INSTALAÇÃO

O processo de instalação do OpenShift 4.x é fundamentalmente diferente das versões anteriores. O OpenShift Installer automatiza grande parte do processo, mas requer uma preparação adequada do ambiente. Este capítulo aborda os pré-requisitos essenciais para uma instalação bem-sucedida.

### PRÉ-REQUISITOS FUNDAMENTAIS

#### **1. Sistema de Desenvolvimento**
Como o RHCOS é um sistema imutável, todas as ferramentas de instalação devem ser executadas em um sistema de desenvolvimento separado (laptop, servidor de jump host, ou VM dedicada). Este sistema deve ter:

* **Sistema Operacional**: RHEL 8/9, CentOS 8/9, ou Ubuntu 20.04+
* **Conectividade de Rede**: Acesso à internet para download de imagens
* **Recursos Mínimos**: 4GB RAM, 20GB disco, 2 vCPUs
* **Ferramentas**: Python 3, curl, wget, tar

#### **2. RHCOS e Infraestrutura Imutável**

O **Red Hat Enterprise Linux CoreOS (RHCOS)** representa uma mudança fundamental na arquitetura do OpenShift 4.x. Diferente do OpenShift 3.x, onde os administradores gerenciam manualmente o sistema operacional base (RHEL), no OpenShift 4.x o RHCOS é gerenciado automaticamente pelo próprio cluster através do **Machine Config Operator (MCO)**.

**Principais características da infraestrutura imutável:**

* **Sistema Imutável**: O sistema de arquivos raiz é somente leitura, garantindo consistência e segurança
* **Gerenciamento Automático**: Atualizações e configurações são gerenciadas pelo cluster OpenShift
* **Sem Acesso Manual**: Não se deve fazer login nos nós para instalar pacotes ou alterar configurações manualmente
* **Configuração Declarativa**: Todas as mudanças são feitas através de MachineConfigs aplicados pelo MCO
* **Atualizações Atômicas**: O RPM-OSTree permite atualizações atômicas e rollbacks seguros

**Machine Config Operator (MCO):**

O MCO é responsável por gerenciar todo o ciclo de vida do sistema operacional nos nós:

```yaml
# Exemplo de MachineConfig para configurar NTP
apiVersion: machineconfiguration.openshift.io/v1
kind: MachineConfig
metadata:
  name: 99-master-chrony
spec:
  config:
    ignition:
      version: 3.2.0
    storage:
      files:
      - contents:
          source: data:text/plain;charset=utf-8;base64,...
        mode: 0644
        path: /etc/chrony.conf
  machineConfigPool:
    - master
```

**Vantagens da Infraestrutura Imutável:**

* **Segurança**: Reduz a superfície de ataque e previne configurações inconsistentes
* **Consistência**: Todos os nós usam a mesma imagem base, garantindo uniformidade
* **Automação**: Elimina a necessidade de configuração manual de hosts
* **Confiabilidade**: Sistema operacional otimizado especificamente para contêineres
* **Escalabilidade**: Facilita a adição de novos nós ao cluster

#### **2. Infraestrutura de Rede**
O OpenShift 4.x requer uma infraestrutura de rede bem configurada:

* **DNS**: Servidor DNS com registros para o cluster
* **DHCP** (opcional): Para instalação UPI (User-Provisioned Infrastructure)
* **Conectividade**: Todos os nós devem se comunicar entre si
* **Portas**: Configuração adequada de firewall

#### **3. Registros DNS Necessários**
Para um cluster funcional, você precisa dos seguintes registros DNS:

```bash
# Registros para API e aplicações
api.<cluster-name>.<base-domain>     → IP do load balancer ou master
*.apps.<cluster-name>.<base-domain>  → IP do load balancer ou ingress
# Exemplo com nip.io
api.openshift-cluster.192.168.100.2.nip.io
*.apps.openshift-cluster.192.168.100.2.nip.io
```

#### **4. Configuração de Rede**
O OpenShift 4.x usa o NetworkManager para gerenciar configurações de rede. Para ambientes de desenvolvimento com `nip.io`:

```bash
# Configurar DNS para nip.io
cat > /etc/resolv.conf << EOF
nameserver 8.8.8.8
search nip.io
EOF

# Configurar NetworkManager para não sobrescrever
cat > /etc/NetworkManager/conf.d/90-dns-none.conf << EOF
[main]
dns=none
EOF

systemctl restart NetworkManager
```

### INSTALANDO AS FERRAMENTAS NECESSÁRIAS

#### **1. OpenShift CLI (oc)**
O CLI do OpenShift é a ferramenta principal para interação com o cluster:

```bash
# Baixar e instalar o OpenShift CLI
curl -L https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/openshift-client-linux.tar.gz | tar -xz
sudo mv oc kubectl /usr/local/bin/

# Verificar a instalação
oc version
```

#### **2. OpenShift Installer**
O OpenShift Installer é a ferramenta oficial para instalação do cluster:

```bash
# Baixar e instalar o OpenShift Installer
curl -L https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/openshift-install-linux.tar.gz | tar -xz
sudo mv openshift-install /usr/local/bin/

# Verificar a instalação
openshift-install version
```

#### **3. Ferramentas Adicionais**
Para ambientes bare metal, você pode precisar de ferramentas adicionais:

```bash
# Para RHEL/CentOS
sudo dnf install -y httpd-tools jq

# Para Ubuntu
sudo apt install -y apache2-utils jq
```

---

### CRIANDO O ARQUIVO DE CONFIGURAÇÃO (install-config.yaml)

O arquivo `install-config.yaml` é o coração do processo de instalação do OpenShift 4.x. Ele define toda a configuração do cluster de forma declarativa.

#### **Estrutura Básica do install-config.yaml**

```yaml
apiVersion: v1
baseDomain: 192.168.100.2.nip.io
compute:
- hyperthreading: Enabled
  name: worker
  replicas: 2
controlPlane:
  hyperthreading: Enabled
  name: master
  replicas: 3
metadata:
  name: openshift-cluster
networking:
  clusterNetwork:
  - cidr: 10.128.0.0/14
    hostPrefix: 23
  networkType: OpenShiftSDN
  serviceNetwork:
  - 172.30.0.0/16
platform:
  none: {}
pullSecret: '{"auths":{"fake":{"auth":"fake"}}}'
sshKey: 'ssh-rsa AAAA...'
```

#### **Componentes Principais**

* **apiVersion**: Versão da API do OpenShift Installer
* **baseDomain**: Domínio base para todos os serviços do cluster
* **metadata.name**: Nome do cluster
* **compute/controlPlane**: Configuração dos nós worker e master
* **networking**: Configuração de rede do cluster
* **platform**: Plataforma de infraestrutura (none, baremetal, aws, etc.)
* **pullSecret**: Credenciais para acessar o registro de imagens do Red Hat
* **sshKey**: Chave SSH para acesso aos nós

#### **Configuração para Bare Metal**

Para instalação em bare metal, você precisa especificar os hosts:

```yaml
platform:
  baremetal:
    apiVIP: 192.168.100.10
    ingressVIP: 192.168.100.11
    hosts:
    - name: master-0
      role: master
      bmc:
        address: ipmi://192.168.100.1
        username: admin
        password: password
      bootMACAddress: 52:54:00:00:00:01
      rootDeviceHints:
        deviceName: /dev/sda
    - name: worker-0
      role: worker
      bmc:
        address: ipmi://192.168.100.2
        username: admin
        password: password
      bootMACAddress: 52:54:00:00:00:02
      rootDeviceHints:
        deviceName: /dev/sda
```

### OBTENDO O PULL SECRET

O pull secret é necessário para baixar imagens do Red Hat Container Registry:

1. Acesse [https://console.redhat.com/openshift/install/pull-secret](https://console.redhat.com/openshift/install/pull-secret)
2. Faça login com sua conta Red Hat
3. Copie o pull secret JSON
4. Substitua no `install-config.yaml`

### GERANDO CHAVES SSH

Para acesso aos nós durante a instalação:

```bash
# Gerar chave SSH
ssh-keygen -t rsa -b 4096 -N '' -f ~/.ssh/id_rsa

# Copiar a chave pública para o install-config.yaml
cat ~/.ssh/id_rsa.pub
```

### PROCESSO DE INSTALAÇÃO

#### **1. Gerar Manifests**
O OpenShift Installer gera os manifests necessários:

```bash
# Criar diretório para a instalação
mkdir openshift-install
cd openshift-install

# Copiar install-config.yaml
cp /path/to/install-config.yaml .

# Gerar manifests
openshift-install create manifests
```

#### **2. Arquivos Gerados**
O instalador gera vários arquivos importantes:

* **bootstrap.ign**: Configuração Ignition para o nó bootstrap
* **master.ign**: Configuração Ignition para nós master
* **worker.ign**: Configuração Ignition para nós worker
* **auth/kubeconfig**: Credenciais de acesso ao cluster

#### **3. Iniciar Instalação**
Para instalação em bare metal:

```bash
# Iniciar instalação
openshift-install create cluster --log-level=info
```

### RHCOS E IGNITION

O RHCOS usa o sistema Ignition para configuração inicial:

#### **O que é Ignition?**
Ignition é o sistema de configuração do RHCOS que permite personalizar o sistema durante a inicialização. Ele é baseado em JSON e é executado apenas uma vez durante o primeiro boot.

#### **Arquivos de Configuração Ignition**
* **bootstrap.ign**: Configura o nó bootstrap temporário
* **master.ign**: Configura os nós master
* **worker.ign**: Configura os nós worker

#### **Como Funciona**
1. O RHCOS baixa o arquivo Ignition apropriado
2. Executa a configuração durante o primeiro boot
3. Configura rede, usuários, serviços, etc.
4. Inicia o processo de instalação do cluster

### PRÉ-REQUISITOS DE DNS E DHCP

#### **DNS**
Para um cluster funcional, você precisa:

```bash
# Registros DNS necessários
api.<cluster-name>.<base-domain>     → IP do load balancer
*.apps.<cluster-name>.<base-domain>  → IP do load balancer

# Exemplo com nip.io
api.openshift-cluster.192.168.100.2.nip.io → 192.168.100.10
*.apps.openshift-cluster.192.168.100.2.nip.io → 192.168.100.11
```

#### **DHCP (Opcional)**
Para instalação UPI (User-Provisioned Infrastructure):

* **Configuração de PXE**: Para boot automático dos nós
* **Reservas de IP**: Para IPs estáticos
* **Opções DHCP**: Para configuração de rede

### CONFIGURAÇÃO DE ARMAZENAMENTO

Com RHCOS e CRI-O, não há necessidade de configuração manual de armazenamento:

#### **Armazenamento Automático**
* **RHCOS**: Gerencia automaticamente o armazenamento para CRI-O
* **OverlayFS**: Sistema de arquivos padrão para contêineres
* **Sem LVM**: Não é necessário configurar LVM manualmente
* **Gerenciamento Automático**: O cluster gerencia o armazenamento

#### **Storage Classes**
O OpenShift 4.x inclui storage classes padrão:

```bash
# Verificar storage classes disponíveis
oc get storageclass

# Storage classes padrão
# - ocs-storagecluster-ceph-rbd (se ODF estiver instalado)
# - ocs-storagecluster-cephfs (se ODF estiver instalado)
```

### VERIFICAÇÃO DE PRÉ-REQUISITOS

Antes de iniciar a instalação, verifique:

```bash
# Verificar conectividade de rede
ping -c 3 8.8.8.8

# Verificar resolução DNS
nslookup api.openshift-cluster.192.168.100.2.nip.io

# Verificar ferramentas instaladas
openshift-install version
oc version

# Verificar arquivo de configuração
openshift-install create manifests --dir=.
```

### PRÓXIMOS PASSOS

Com o ambiente preparado e o `install-config.yaml` configurado, você está pronto para:

1. **Gerar Manifests**: Executar `openshift-install create manifests`
2. **Iniciar Instalação**: Executar `openshift-install create cluster`
3. **Monitorar Progresso**: Acompanhar logs da instalação
4. **Acessar Cluster**: Usar o kubeconfig gerado

O processo de instalação do OpenShift 4.x é muito mais automatizado que nas versões anteriores, mas requer uma preparação adequada do ambiente e configuração correta do `install-config.yaml`.

Com o ambiente preparado e o `install-config.yaml` configurado, você está pronto para iniciar a instalação do cluster OpenShift 4.x. O processo é automatizado pelos Operadores, mas requer uma preparação adequada do ambiente.

---

## CAPÍTULO 3 - EXECUTANDO A INSTALAÇÃO DO CLUSTER

O processo de instalação do OpenShift 4.x é completamente automatizado pelo OpenShift Installer. Este capítulo aborda os passos para gerar os manifests de instalação e executar a instalação do cluster.

### GERANDO OS MANIFESTS DE INSTALAÇÃO

Com o `install-config.yaml` configurado, o próximo passo é gerar os manifests de instalação. Estes arquivos incluem as configurações Ignition que serão usadas pelos nós RHCOS durante o primeiro boot.

#### **O Papel do Ignition no Processo de Bootstrap**

O **Ignition** é o sistema de configuração do RHCOS que permite personalizar o sistema durante a inicialização. Os arquivos `.ign` são usados apenas no primeiro boot para configurar os nós de forma declarativa, sendo uma peça central na automação da instalação.

**Como funciona o Ignition:**

* **Configuração Declarativa**: Define o estado desejado do sistema em formato JSON
* **Primeiro Boot Apenas**: Os arquivos Ignition são aplicados apenas durante a inicialização inicial
* **Automação Completa**: Elimina a necessidade de configuração manual dos nós
* **Segurança**: Configurações são aplicadas de forma segura e consistente

**Tipos de arquivos Ignition gerados:**

* **bootstrap.ign**: Configuração para o nó de bootstrap (temporário)
* **master.ign**: Configuração para os nós do control plane
* **worker.ign**: Configuração para os nós de trabalho

**Exemplo de configuração Ignition:**

```json
{
  "ignition": {
    "version": "3.2.0"
  },
  "storage": {
    "files": [
      {
        "path": "/etc/hostname",
        "mode": 420,
        "contents": {
          "source": "data:text/plain;charset=utf-8;base64,bWFzdGVyLTA="
        }
      }
    ]
  },
  "systemd": {
    "units": [
      {
        "name": "kubelet.service",
        "enabled": true
      }
    ]
  }
}
```

```bash
# Gerar os manifests de instalação
openshift-install create manifests --dir=.

# Verificar os arquivos gerados
ls -la
```

Os arquivos gerados incluem:

* **bootstrap.ign**: Configuração Ignition para o nó de bootstrap
* **master.ign**: Configuração Ignition para os nós do control plane
* **worker.ign**: Configuração Ignition para os nós de trabalho
* **auth/kubeconfig**: Arquivo de configuração para acesso ao cluster
* **auth/kubeadmin-password**: Senha do usuário kubeadmin

### O PROCESSO DE INSTALAÇÃO AUTOMATIZADO

O OpenShift Installer automatiza todo o processo de instalação através dos Operadores. Este instalador é fundamentalmente diferente das versões anteriores, oferecendo dois modos de instalação:

#### **IPI - Installer-Provisioned Infrastructure**

Para provedores de nuvem suportados (AWS, Azure, GCP, VMware), o OpenShift Installer automatiza a criação de toda a infraestrutura necessária:

* **Provisionamento Automático**: Cria VMs, redes, load balancers automaticamente
* **Configuração Integrada**: Configura DNS, certificados SSL, e outros componentes
* **Simplificação**: Reduz significativamente o trabalho manual de configuração

#### **UPI - User-Provisioned Infrastructure**

Para ambientes on-premise ou nuvens não suportadas, o instalador gera os artefatos necessários para uma infraestrutura pré-existente:

* **Artefatos Gerados**: Ignition files, manifests, e scripts de configuração
* **Flexibilidade**: Permite usar infraestrutura existente
* **Controle Total**: Mantém controle sobre toda a infraestrutura

#### **Agent-Based Installer (OpenShift 4.12+)**

Para instalações on-premise, especialmente em ambientes desconectados (air-gapped), o **Agent-Based Installer** é uma novidade importante que simplifica o processo:

**Vantagens do Agent-Based Installer:**

* **Sem Nó de Bootstrap**: Elimina a necessidade de um nó de bootstrap temporário
* **Ambientes Desconectados**: Funciona em ambientes air-gapped
* **Instalação Simplificada**: Processo mais direto e menos complexo
* **Menos Recursos**: Reduz os requisitos de infraestrutura

**Como usar o Agent-Based Installer:**

```bash
# Baixar o Agent-Based Installer
curl -L https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/agent-installer-linux.tar.gz | tar -xz

# Criar configuração para Agent-Based Installer
openshift-install agent create config

# Gerar imagens ISO para os nós
openshift-install agent create image

# Instalar usando os ISOs gerados
```

**Comparação dos Métodos de Instalação:**

| **Método** | **Uso** | **Complexidade** | **Automação** |
|------------|---------|------------------|---------------|
| **IPI** | Nuvens suportadas | Baixa | Total |
| **UPI** | On-premise/Cloud customizada | Média | Parcial |
| **Agent-Based** | On-premise/Air-gapped | Baixa | Alta |

```bash
# Iniciar a instalação do cluster
openshift-install create cluster --dir=.

# Monitorar o progresso da instalação
openshift-install create cluster --dir=. --log-level=info
```

**Fases da Instalação:**

1. **Bootstrap**: O nó de bootstrap inicia e configura o control plane
2. **Control Plane**: Os nós do control plane são instalados e configurados
3. **Workers**: Os nós de trabalho são instalados e ingressam no cluster
4. **Operators**: Os Operadores do cluster são instalados e configurados
5. **Finalização**: Configuração final e limpeza do bootstrap

### VERIFICANDO A INSTALAÇÃO

Após a conclusão da instalação, você pode verificar o status do cluster:

```bash
# Verificar o status dos nós
oc get nodes

# Verificar os Operadores do cluster
oc get clusteroperators

# Verificar os pods do sistema
oc get pods -n kube-system

# Acessar a console web
oc get route console -n openshift-console
```

### ACESSANDO O CLUSTER

O OpenShift Installer gera automaticamente as credenciais de acesso:

```bash
# Usar o kubeconfig gerado
export KUBECONFIG=$(pwd)/auth/kubeconfig

# Fazer login como kubeadmin
oc login -u kubeadmin -p $(cat auth/kubeadmin-password)

# Verificar o acesso
oc whoami
oc get projects
```

### CONFIGURAÇÃO PÓS-INSTALAÇÃO

Após a instalação bem-sucedida, você pode configurar:

* **Storage Classes**: Configurar armazenamento persistente
* **Users e Groups**: Configurar autenticação e autorização
* **Monitoring**: Configurar monitoramento e alertas
* **Logging**: Configurar coleta de logs centralizada

#### **OPÇÕES DE ARMAZENAMENTO NO OPENSHIFT 4.X**

O OpenShift 4.x oferece várias opções para armazenamento persistente, cada uma com suas vantagens específicas:

**OpenShift Data Foundation (ODF) - Solução Integrada**

O **OpenShift Data Foundation (ODF)** é a solução de armazenamento definida por software integrada da Red Hat para OpenShift 4.x. O ODF substituiu o **OpenShift Container Storage (OCS)** 3.x e utiliza o **Red Hat Ceph Storage** como base, oferecendo:

* **Armazenamento Distribuído**: Ceph Storage para alta disponibilidade
* **Múltiplos Tipos de Storage**: Block, File e Object storage
* **Integração Nativa**: Operadores OpenShift para gerenciamento automático
* **Escalabilidade**: Crescimento horizontal sem downtime
* **Backup e Disaster Recovery**: Recursos avançados de proteção de dados
* **Monitoramento Integrado**: Dashboards e alertas nativos

**NFS - Opção Tradicional**

O **NFS (Network File System)** continua sendo uma opção válida e amplamente utilizada:

* **Simplicidade**: Fácil de configurar e gerenciar
* **Compatibilidade**: Funciona com qualquer servidor NFS
* **Custo**: Solução econômica para ambientes menores
* **Flexibilidade**: Pode ser usado com storage existente

**Storage Classes Disponíveis**

O OpenShift 4.x suporta múltiplas storage classes:

```yaml
# Exemplo de StorageClass para NFS
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: nfs-storage
provisioner: nfs
parameters:
  server: nfs-server.example.com
  path: /exports
---
# Exemplo de StorageClass para ODF
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: ocs-storagecluster-ceph-rbd
provisioner: openshift-storage.rbd.csi.ceph.com
parameters:
  clusterID: openshift-storage
  pool: ocs-storagecluster-cephblockpool
```

**EVOLUÇÃO DO ARMAZENAMENTO: OCS → ODF**

A solução de armazenamento da Red Hat evoluiu significativamente no OpenShift 4.x:

**OpenShift Container Storage (OCS) 3.x**
* **Base**: GlusterFS
* **Arquitetura**: Storage distribuído baseado em Gluster
* **Limitações**: Escalabilidade limitada, complexidade de gerenciamento
* **Compatibilidade**: OpenShift 3.x e 4.x inicial

**OpenShift Data Foundation (ODF) 4.x**
* **Base**: Red Hat Ceph Storage
* **Arquitetura**: Storage distribuído baseado em Ceph
* **Vantagens**: 
  - Maior escalabilidade e performance
  - Múltiplos tipos de storage (Block, File, Object)
  - Melhor integração com Operadores OpenShift
  - Recursos avançados de backup e disaster recovery
* **Compatibilidade**: OpenShift 4.x

**Migração de OCS para ODF**

Para clusters que usavam OCS 3.x, a migração para ODF 4.x envolve:

```bash
# Verificar storage classes existentes
oc get storageclass

# Backup dos dados antes da migração
oc get pv,pvc -A

# Instalar ODF 4.x
oc apply -f https://raw.githubusercontent.com/red-hat-storage/ocs-operator/release-4.10/deploy/olm-catalog/ocs-operator/manifests/ocs-operator.v4.10.0.clusterserviceversion.yaml
```

**Comparação de Recursos**

| **Recurso** | **OCS 3.x (GlusterFS)** | **ODF 4.x (Ceph)** |
|-------------|-------------------------|-------------------|
| **Performance** | Boa | Superior |
| **Escalabilidade** | Limitada | Alta |
| **Tipos de Storage** | File | Block, File, Object |
| **Backup/DR** | Básico | Avançado |
| **Monitoramento** | Básico | Integrado |


O RHCOS representa uma mudança fundamental na forma como o OpenShift gerencia a infraestrutura, tornando o processo mais seguro, consistente e automatizado.





### EVOLUÇÃO DAS FERRAMENTAS DE DESENVOLVIMENTO

O ecossistema de desenvolvimento do OpenShift evoluiu significativamente:

#### **Ferramentas de Desenvolvimento Local**
* **Minishift** → **CodeReady Containers (CRC)** → **OpenShift Local**
* **OpenShift All-in-One VM** → **OpenShift Local**
* **Docker Desktop** → **Podman Desktop** (para desenvolvimento de contêineres)

#### **Ferramentas de Instalação**
* **Ansible Playbooks** → **OpenShift Installer**
* **Inventários Ansible** → **install-config.yaml**
* **Instalação Manual** → **Instalação Automatizada**

#### **Ferramentas de Gerenciamento**
* **oc adm** → **oc adm** (mantido, mas com novas funcionalidades)
* **Docker CLI** → **crictl** (para debugging em nós)
* **kubectl** → **oc** (CLI unificado do OpenShift)

---

### ARQUITETURA BASEADA EM OPERADORES

Um dos pilares fundamentais do OpenShift 4.x é a arquitetura baseada em **Operadores**. Os Operadores são aplicações que estendem o Kubernetes para automatizar tarefas complexas de gerenciamento de aplicações e serviços. Eles encapsulam o conhecimento operacional específico de uma aplicação e automatizam tarefas como instalação, configuração, atualização e recuperação.

#### O QUE SÃO OPERADORES?

Os Operadores são controladores customizados do Kubernetes que implementam o padrão de design "Operator Pattern". Eles monitoram continuamente o estado desejado de uma aplicação e tomam ações para garantir que o estado atual corresponda ao estado desejado. Os Operadores são essencialmente "controladores de aplicação" que conhecem como gerenciar aplicações específicas.

#### TIPOS DE OPERADORES NO OPENSHIFT 4.X

O OpenShift 4.x inclui vários tipos de operadores:

* **Cluster Operators**: Gerenciam componentes fundamentais do cluster como API server, scheduler, etcd, etc.
* **Machine Config Operators**: Gerenciam a configuração dos nós RHCOS
* **Node Operators**: Gerenciam aspectos específicos dos nós do cluster
* **Application Operators**: Gerenciam aplicações específicas como databases, monitoring, etc.

#### VANTAGENS DOS OPERADORES

A arquitetura baseada em operadores traz várias vantagens significativas:

* **Automação Completa**: Elimina a necessidade de intervenção manual para tarefas operacionais
* **Conhecimento Operacional Codificado**: O conhecimento específico de cada aplicação é codificado no operador
* **Recuperação Automática**: Operadores podem detectar e corrigir problemas automaticamente
* **Atualizações Automáticas**: Gerenciam atualizações de aplicações de forma transparente
* **Escalabilidade**: Facilitam o gerenciamento de aplicações complexas em escala
* **Consistência**: Garantem que todos os ambientes sejam configurados de forma consistente

#### OPERADORES PRINCIPAIS DO OPENSHIFT 4.X

Alguns dos operadores mais importantes no OpenShift 4.x incluem:

* **Cluster Version Operator**: Gerencia atualizações do cluster OpenShift
* **Machine Config Operator**: Gerencia configurações dos nós RHCOS
* **Authentication Operator**: Gerencia autenticação e autorização
* **Console Operator**: Gerencia a interface web do OpenShift
* **Ingress Operator**: Gerencia o roteamento de tráfego externo
* **Storage Operator**: Gerencia provisionamento de storage
* **Monitoring Operator**: Gerencia stack de monitoramento (Prometheus, Grafana)

#### COMO OS OPERADORES FUNCIONAM

Os Operadores funcionam através de um loop de controle contínuo:

1. **Observação**: O operador monitora constantemente o estado atual da aplicação
2. **Análise**: Compara o estado atual com o estado desejado
3. **Ação**: Executa ações necessárias para alinhar o estado atual com o desejado
4. **Repetição**: Volta ao passo 1 para continuar o monitoramento

Este ciclo garante que a aplicação sempre esteja no estado desejado, mesmo quando ocorrem falhas ou mudanças no ambiente.

#### IMPACTO NA OPERAÇÃO

A arquitetura baseada em operadores transforma fundamentalmente a forma como o OpenShift é operado:

* **Redução de Tarefas Manuais**: Muitas tarefas que antes requeriam intervenção manual agora são automatizadas
* **Maior Confiabilidade**: Operadores podem detectar e corrigir problemas mais rapidamente que humanos
* **Operação em Escala**: Facilita o gerenciamento de clusters grandes e complexos
* **Consistência**: Garante que todos os ambientes sejam configurados e operados de forma consistente

Nos próximos capítulos irei aprofundar melhor nas funcionalidades da ferramenta.

---

### CRIANDO PROJETOS

Existem três maneiras de interagir com o OpenShift: por linha de comando, por interface web e pela **[API RESTful](https://docs.openshift.com/container-platform/4.12/rest_api/index.html)**. Quase todas as ações no OpenShift podem ser realizadas usando os três métodos de acesso. Antes de começar a usar o OpenShift, é importante atentar ao fato de que a minha proposta aqui é a de orientar na montagem, e configuração de um servidor OpenShift 4.x distribuído. No entanto, se a sua intenção é a de testar o funcionamento do OpenShift de maneira simples, tudo em uma coisa só, saiba que existe o projeto **[OpenShift Local](https://developers.redhat.com/products/openshift-local/overview)** (anteriormente conhecido como CodeReady Containers/CRC), que é a ferramenta recomendada para executar um cluster OpenShift localmente para desenvolvimento e teste. Para desenvolvimento é ótimo pois você conseguirá levantar o ambiente com bastante praticidade em uma máquina virtual simples, rodando em seu laptop. No entanto, se o seu objetivo for mais refinado certamente que terá problemas quando começar a trabalhar com armazenamento persistente, métricas, deployments complexos de aplicativos e redes.

### FERRAMENTAS DE DESENVOLVIMENTO LOCAL

Para desenvolvimento e teste local, o OpenShift 4.x oferece várias opções:

#### **OpenShift Local (Recomendado)**
* **Sucessor**: Substituiu o Minishift e CodeReady Containers (CRC)
* **Funcionalidades**: Cluster OpenShift completo em uma única VM
* **Recursos**: Inclui console web, CLI, e todas as funcionalidades do OpenShift
* **Uso**: Ideal para desenvolvimento, testes e demonstrações
* **Download**: Disponível em [developers.redhat.com](https://developers.redhat.com/products/openshift-local/overview)

#### **Minikube com OpenShift**
* **Alternativa**: Para testes básicos de Kubernetes
* **Limitações**: Não inclui funcionalidades específicas do OpenShift
* **Uso**: Apenas para testes de aplicações Kubernetes básicas

#### **Kind (Kubernetes in Docker)**
* **Alternativa**: Para testes de Kubernetes puro
* **Limitações**: Não inclui OpenShift
* **Uso**: Desenvolvimento de aplicações Kubernetes nativas

No OpenShift, toda ação requer autenticação. Isso permite que todas as ações sejam regidas por regras de segurança e acesso configuradas para todos os usuários em um cluster. Por padrão, a configuração inicial do OpenShift é definida para permitir que qualquer definição de usuário e senha possam efetuar o login. Esta configuração inicial é chamada de _Allow All identity provider_. Isto é, cada nome de usuário é exclusivo, e a senha pode ser qualquer coisa, exceto um campo vazio. Essa configuração é segura e recomendada apenas para configurações de teste. O primeiro usuário que irei usar como exemplo neste artigo, se chamará _fulano_. Este usuário representará um usuário final do OpenShift.

> NOTA: Este método de autenticação é sensível a maiúsculas e minúsculas. Isto é, embora as senhas possam ser qualquer coisa, _fulano_ e Fulano são usuários diferentes.

Usando a linha de comando, execute o comando `oc login`, usando _fulano_ para o nome de usuário e senha, e a URL da API do servidor master. Abaixo a sintaxe para efetuar login incluindo o nome de usuário, a senha e a URL para o OpenShift Master API server:

```bash
$ oc login -u fulano -p fulano https://ocp-1.192.168.100.1.nip.io:8443
```

Os parâmetros usados acima para login com o comando `oc` são:
* -u, o nome de usuário para efetuar login.
* -p, a senha do usuário.
* URL da API do servidor master. Por padrão, roda em HTTPS na porta TCP 8443.

No OpenShift as aplicações são organizadas em projetos. Os projetos permitem que os usuários agrupem seus aplicativos em grupos lógicos. Eles também servem outras funções úteis relacionadas à segurança. Para especificar um comando a ser executado em um projeto específico, independentemente do seu projeto atual, use o parâmetro `-n` com o nome do projeto. Essa é uma opção útil quando você está escrevendo scripts que usam o comando `oc` e atuam em vários projetos. Também é uma boa prática em geral. Para criar um projeto, você precisa executar o comando `oc new-project` e fornecer um nome para o projeto. Para o seu primeiro projeto, use `image-uploader` como o nome do projeto:

```bash
$ oc new-project image-uploader --display-name='Image Uploader Project'
```

> NOTA: Você poderá encontrar na documentação todos os recursos do comando `oc` em **[https://docs.openshift.com/container-platform/4.12/cli_reference/openshift_cli/getting-started-cli.html](https://docs.openshift.com/container-platform/4.12/cli_reference/openshift_cli/getting-started-cli.html)**.

Além do nome do seu projeto, você pode opcionalmente fornecer um `display name`. O display name é um nome mais amigável para o seu projeto visto que o nome do projeto, tem uma sintaxe restrita porque se torna parte da URL de todos os aplicativos implementados no OpenShift. Agora que você criou seu primeiro projeto, vamos fazer o deploy do nosso primeiro aplicativo. Digamos que o Image Uploader seja um aplicativo escrito em [Golang]() usado para carregar e exibir arquivos. Antes de efetuar o deploy do aplicativo, vou explicar o funcionamento de todos os seus componentes para que você entenda como todas as partes se encaixam e funcionam juntas. Aplicações no OpenShift não são estruturas monolíticas; elas consistem em vários componentes diferentes em um projeto que trabalham em conjunto para implantar, atualizar e manter seu aplicativo durante seu ciclo de vida. Esses componentes são:

* Custom container images
* Image streams
* Application pods
* Build configs
* Deployment configs
* Deployments
* Services

Todos esses componentes trabalham juntos para atender as aplicações dos usuários finais. As interações entre os componentes do aplicativo podem parecer um tanto complexo, então, vamos ver o que esses componentes fazem com mais detalhes. Começaremos com a forma como o OpenShift cria e usa imagens personalizadas para cada aplicativo. Para cada deploy realizado, é criado uma imagem personalizada para servir a sua aplicação. Essa imagem é criada usando o código-fonte do aplicativo e uma imagem de base personalizada chamada de _builder image_.

Por exemplo, o _builder image_ do [Golang]() pode conter servidor da web, e as principais bibliotecas da linguagem. O processo de construção da imagem integra seu código-fonte e cria uma imagem customizada que será usada para o deploy do aplicativo em um contêiner. Uma vez criadas todas as imagens juntamente com todas as _builder images_, serão então armazenados no registro integrado do OpenShift. Cada aplicativo implementado cria componentes no cluster do OpenShift. Este fluxo de trabalho é totalmente automatizado e personalizável:

![https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/novoprojeto.png#center](https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/novoprojeto.png#center)

Uma _build config_ contém todas as informações necessárias para construir um aplicativo usando seu código-fonte. Isso inclui todas as informações necessárias para criar a imagem do aplicativo que irá gerar o contêiner. Por exemplo:

* A URL para o código-fonte do aplicativo
* O nome do imagem builder a ser usada
* O nome da imagem dos aplicativos criados
* Os eventos que podem acionar uma nova build

A imagem acima ilustra bem esses relacionamentos. A configuração de versão é usada para acompanhar o que é necessário para criar seu aplicativo e acionar a criação da imagem do aplicativo. Depois que a configuração do build faz seu trabalho, ele aciona a configuração do deployment criado para o aplicativo recém-criado. O trabalho de implementar e atualizar o aplicativo é tratado pelo _deployment config component_. O _deployment config_ rastreia várias informações sobre o aplicativo. Como por exemplo:

* A versão atualmente implantada do aplicativo.
* O número de réplicas a serem mantidas para o aplicativo.
* Aciona eventos que podem chamar uma redistribuição. Por padrão, as alterações do deployment config ou alterações na imagem acionam uma redistribuição automática do aplicativo.
* Atualização estratégica. O app-cli usa a estratégia padrão de atualização sem interrupção.
* O deploy de aplicativos.

Um dos principais recursos dos aplicativos executados no OpenShift é que eles são dimensionáveis horizontalmente. Esse conceito é representado no _deployment config_ pelo número de réplicas. O número de réplicas especificadas em uma configuração de deployment é passado para um objeto do Kubernetes chamado de _replication controller_. Esse é um tipo especial de pod do Kubernetes que permite várias réplicas - que são cópias de pods de aplicativos sejam mantidas em execução o tempo todo. Todos os pods no OpenShift são implementados com _replication controller_ por padrão. Outro recurso gerenciado por um deployment config é como as atualizações de aplicativos podem ser totalmente automatizados. No OpenShift, um pod pode existir em uma das cinco fases a qualquer momento em seu ciclo de vida. Essas fases são descritas em detalhes na documentação do Kubernetes [https://goo.gl/HKT5yZ](https://goo.gl/HKT5yZ). A seguir, um breve resumo das cinco fases do pod:

* Pending: o pod foi aceito pelo OpenShift, mas ainda não está agendado em um dos nodes da aplicação.
* Running - o pod está agendado em um node e está confirmado para subir e rodar.
* Succeeded: todos os contêineres em um grupo foram encerrados com sucesso e não serão reiniciados.
* Failed - um ou mais contêineres em um grupo não foram iniciados.
* Unknown - algo deu errado e o OpenShift não consegue obter um status mais preciso para o pod.

Os estados _Failed_ e _Succeeded_ são considerados estados terminais para um pod em seu ciclo de vida. Quando um pod atinge um desses estados, ele não será reiniciado. Você pode ver a fase atual de cada pod em um projeto executando o comando `oc get pods`. Cada vez que uma nova versão de um aplicativo é criada um novo deployment é criado e rastreado. Um deployment representa uma versão exclusiva de um aplicativo. Cada deployment faz referência a uma versão da imagem que foi criada, e cria o _replication controller_ para manter os pods.

O método padrão de atualização de aplicativos no OpenShift é executar uma atualização sem interrupção. Os upgrades contínuos criam novas versões de um aplicativo, permitindo que novas conexões com o aplicativo acessem apenas a nova versão. À medida que o tráfego aumenta para o novo deployment, os pods do deployment antigo são removidos do sistema. Novos deployments de aplicativos podem ser acionadas automaticamente por eventos como alterações de configuração em seu aplicativo ou uma nova versão de uma imagem disponível.

Esses tipos de eventos são monitorados pelo _image streams_ no OpenShift.De uma forma bastante resumida, o recurso _image streams_ é usado para automatizar ações no OpenShift. Eles consistem em links para uma ou mais imagens. Usando _image streams_, você poderá monitorar aplicativos e acionar novos deployments quando seus componentes forem atualizados. Agora que analisamos como os aplicativos são criados e implementados no OpenShift, vamos implementar o nosso aplicativo.

---

### IMPLEMENTANDO NOSSO PRIMEIRO APLICATIVO

O OpenShift 4.x oferece múltiplas abordagens para fazer o deployment de aplicativos. Embora o comando `oc new-app` ainda exista, o OpenShift 4.x incentiva o uso de abordagens mais declarativas, como a utilização de manifestos YAML e a interface gráfica do console, que por sua vez, utiliza o `oc new-app` por baixo dos panos.

#### **oc new-app vs. Manifestos YAML: Abordagem Imperativa vs. Declarativa**

**Abordagem Imperativa (oc new-app):**

O `oc new-app` é uma abordagem imperativa que executa comandos para criar recursos. É útil para desenvolvimento rápido e prototipagem:

```bash
# Abordagem imperativa
oc new-app --image-stream=golang \
  --code=https://github.com/scovl/image-uploader.git \
  --name=app-cli
```

**Vantagens do oc new-app:**
* **Rapidez**: Comando único para criar aplicação completa
* **Simplicidade**: Ideal para desenvolvimento e testes
* **Automação**: Cria automaticamente Deployment, Service, Route

**Desvantagens:**
* **Menos Controle**: Configurações padrão podem não ser ideais
* **Difícil Versionamento**: Não há arquivo de configuração para versionar
* **Limitado**: Menos flexibilidade para configurações complexas

**Abordagem Declarativa (Manifestos YAML):**

Para ambientes de produção e práticas de GitOps, o uso de YAML é o recomendado por garantir reprodutibilidade, versionamento e auditoria:

```yaml
# Abordagem declarativa - deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-cli
  labels:
    app: app-cli
spec:
  replicas: 3
  selector:
    matchLabels:
      app: app-cli
  template:
    metadata:
      labels:
        app: app-cli
    spec:
      containers:
      - name: app-cli
        image: docker.io/scovl/golang-app:latest
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
```

**Vantagens dos Manifestos YAML:**
* **Versionamento**: Controle de versão com Git
* **Reprodutibilidade**: Mesmo resultado em qualquer ambiente
* **Auditoria**: Histórico completo de mudanças
* **Flexibilidade**: Controle total sobre configurações
* **GitOps**: Integração com práticas de DevOps

**Comparação das Abordagens:**

| **Aspecto** | **oc new-app** | **Manifestos YAML** |
|-------------|----------------|---------------------|
| **Velocidade** | Rápido | Mais lento |
| **Controle** | Limitado | Total |
| **Versionamento** | Não | Sim |
| **Reprodutibilidade** | Baixa | Alta |
| **Uso Recomendado** | Desenvolvimento | Produção |
| **GitOps** | Não adequado | Ideal |

**Evolução das Ferramentas Locais:**

O artigo menciona o OpenShift Local (sucessor do CodeReady Containers - CRC) e o Minishift. É importante esclarecer essa evolução:

* **Minishift**: Era para OpenShift 3.x, baseado em Minikube
* **CodeReady Containers (CRC)**: Sucessor do Minishift para OpenShift 4.x
* **OpenShift Local**: Nome atual do CRC, ferramenta oficial para desenvolvimento local com OpenShift 4.x

**Instalação do OpenShift Local:**

```bash
# Baixar OpenShift Local
curl -L https://developers.redhat.com/content-gateway/rest/mirror/pub/openshift-v4/clients/crc/latest/crc-linux-amd64.tar.xz | tar -xJ

# Instalar
sudo mv crc-linux-amd64/crc /usr/local/bin/

# Iniciar cluster local
crc start
```

#### Usando o Console Web (Recomendado)

A forma mais intuitiva é usar o console web do OpenShift:

1. Acesse o console web do OpenShift
2. Navegue para o projeto desejado
3. Clique em "Add" → "From Catalog" ou "From Git"
4. Selecione a aplicação desejada ou configure um repositório Git

#### Usando Manifestos YAML (Abordagem Declarativa)

Crie um arquivo `deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-cli
spec:
  replicas: 1
  selector:
    matchLabels:
      app: app-cli
  template:
    metadata:
      labels:
        app: app-cli
    spec:
      containers:
      - name: app-cli
        image: docker.io/scovl/golang-app:latest
        ports:
        - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: app-cli-service
spec:
  selector:
    app: app-cli
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
---
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: app-cli-route
spec:
  to:
    kind: Service
    name: app-cli-service
  port:
    targetPort: 8080
```

Aplique o manifesto:

```bash
oc apply -f deployment.yaml
```

#### Usando oc new-app (Método Tradicional)

Para fazer o deployment dos aplicativos usando o método tradicional, usamos o comando `oc new-app`. Executando este comando em nosso aplicativo, no caso, o Image Uploader, será necessário fornecer três informações:

* O tipo do image stream que você deseja usar - o OpenShift envia várias imagens chamadas de `builder images` que você pode usar como ponto de partida para os aplicativos. Neste exemplo, usaremos o builder image do [Golang]() para criar o aplicativo.
* Um nome para o seu aplicativo - neste exemplo, usarei `app-cli`, porque esta versão do seu aplicativo será implementado em linha de comando.
* O local onde estará o código-fonte do aplicativo - o OpenShift pegará esse código-fonte e o combinará com o `builder image` Golang para criar uma imagem personalizada.

Seguindo as informações acima vamos organizar como será o projeto:

```bash
$ oc new-app \
> --image-stream=golang \
> --code=https://github.com/scovl/image-uploader.git \
> --name=app-cli
...
```

A saída prevista será algo mais ou menos assim:

```bash
--> Success
Build scheduled, use 'oc logs -f bc/cli-app' to track its progress.
Run 'oc status' to view your app.
```

Agora que implementamos o aplicativo, precisaremos acessar o pod recém-implementado. A imagem abaixo mostra o pod associado a um componente chamado _service_, que é vinculado para fornecer acesso do aplicativo aos usuários:

![https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/deployanapplication.png#center](https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/deployanapplication.png#center)

Um _service_ usa os rótulos aplicados aos pods quando eles são criados, para acompanhar todos os pods associados a um determinado aplicativo. Isso permite que um service atue como um proxy interno para o aplicativo. Você poderá visualizar informações sobre o service app-cli executando o comando `oc describe svc/app-cli`:

```bash
$ oc describe svc/app-cli
Name:	app-cli
Namespace:	image-uploader
Labels:	app=app-cli
Selector:	app=app-cli,deploymentconfig=app-cli
Type:	ClusterIP
IP:	172.30.90.167
Port:	8080-tcp	8080/TCP
Endpoints:
Session Affinity:	None
No events.
```

Cada service recebe um endereço IP que só pode ser roteado a partir do cluster OpenShift. Outras informações mantidas incluem o endereço IP do service e as portas TCP para se conectar ao pod. A maioria dos componentes no OpenShift tem uma abreviação que pode ser usada em linha de comando para economizar tempo, e evitar nomes de componentes com erros ortográficos. O comando anterior usa `svc/app-cli` para obter informações sobre o service do aplicativo `app-cli`. As configurações do builder podem ser acessados com `bc/<app-name>` e as configurações de deployment com `dc/<app-name>`. Você pode encontrar todas as outras referências de comandos para o service na documentação do oc em [https://docs.openshift.org/latest/cli_reference/get_started_cli.html)](https://docs.openshift.org/latest/cli_reference/get_started_cli.html).

Os services fornecem um gateway consistente para o deployment de seu aplicativo. Mas o endereço IP de um service estará disponível apenas no cluster do OpenShift. Para conectar os usuários aos seus aplicativos e fazer o DNS funcionar corretamente, você precisa de mais um componente no aplicativo. Em seguida, criaremos uma rota para expor o `app-cli` externamente no seu cluster. Quando você instala seu cluster, um dos serviços criados é o [HAProxy](https://en.wikipedia.org/wiki/HAProxy) que fica em execução em um contêiner. O HAProxy é um software open-source de balanceamento de carga. Para criar uma rota para o nosso aplicativo `app-cli`, execute o seguinte comando:

```bash
oc expose svc/app-cli
```

A URL de cada aplicativo usa o seguinte formato:

```bash
<application-name>-<project-name>.<cluster-app-domain>
```

Neste artigo, especificamente na instalação do OpenShift, especificamos o domínio `aplicativo.192,168.100.2.nip.io`. Por padrão, todos os aplicativos no OpenShift estarão disponíveis usando o protocolo HTTP. Quando você coloca tudo isso junto, a URL do `app-cli` deve ser o seguinte:

```bash
http://app-cli-image-uploader.apps.192.168.100.2.nip.io
```

Você poderá obter mais informações sobre a rota que acabou de criar, executando o comando `oc describe route/app-cli`:

```bash
$ oc describe route/app-cli
Name:		app-cli
Namespace:		image-uploader
Created:		About an hour ago
Labels:		app=app-cli
Annotations:		openshift.io/host.generated=true
Requested Host:		app-cli-image-uploader.apps.192.168.100.2.nip.io
Path:					<none>
TLS Termination:		<none>
Insecure Policy:		<none>
Endpoint Port:		8080-tcp
Service:		app-cli
Weight:		100 (100%)
Endpoints:	10.129.1.112:8080
```

A saída informa as configurações de host adicionadas ao HAProxy, o service associado à rota, e os endpoints para o service se conectar às solicitações para a rota. Agora que criamos a rota para o aplicativo, verificaremos se está funcional em um navegador Web:

![https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/imageuploader1.png#center](https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/imageuploader1.png#center)


No OpenShift, vários componentes trabalham em conjunto para criar, implantar e gerenciar os aplicativos:

![https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/apprequest.png#center](https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/apprequest.png#center)

Todo este processo de deployment da nossa aplicação poderia ter sido feita pela interface web do OpenShift. No entanto, compreendo que temos mais domínio da ferramenta se optarmos pelas configurações em linha de comando. Você poderá experimentar usar a interface Web do OpenShift para fazer o mesmo ou explorar outros caminhos. A partir daquí, analisaremos mais detalhadamente o cluster do OpenShift e investigaremos como os contêineres isolam seus processos no node do aplicativo.


---

### TRABALHANDO DIRETAMENTE COM CRI-O

O [CRI-O](https://cri-o.io/) é o runtime padrão de contêineres do OpenShift 4.x e possui uma ferramenta de linha de comando chamada `crictl` (Container Runtime Interface command line tool). Para obter as informações necessárias para aprofundar o modo como os contêineres isolam os aplicativos no OpenShift, o comando `crictl` deve ser o seu ponto de partida. A interação com os contêineres em nível de nó é feita principalmente com esta ferramenta.

Para interagir diretamente com o CRI-O, você precisa do SSH e preferencialmente executar os comandos em modo `root` no node da aplicação. A primeira coisa a percorreremos, é a lista de todos os contêineres atualmente em execução.

Entre no node da aplicação e execute o comando `crictl ps`. Este comando retorna uma lista de todos os contêineres atualmente em execução no node do aplicativo. Cada linha na saída do comando `crictl ps` representa um contêiner em execução. O primeiro valor em cada linha é uma versão abreviada do ID desse contêiner. Você pode também confirmar com qual aplicação está lidando ao observar o nome dado ao contêiner. Se você seguiu os passos acima, certamente que a saída do `crictl ps` será grande pois inclui informações sobre contêineres que hospedam o registro interno e o balanceador de carga HAProxy.

A URL que aponta para a imagem no registro OpenShift pode parecer um pouco estranho se você já fez o download de uma imagem de qualquer aplicação ou ferramenta antes. Uma URL padrão de solicitação de registro contém um nome de contêiner e uma tag correspondente, como _docker.io/scovl/golang-app:latest_ por exemplo. Essa URL do registro pode ser dividida em quatro componentes:

* docker.io - URL do registro. Nesse caso, o Docker Hub.
* scovl - conta de usuário para o registro. Neste caso, scovl, a minha conta pessoal.
* golang-app - Nome da imagem do contêiner para download.
* latest - Tag ou versão específica da imagem do contêiner.

> NOTA: Embora o Docker Hub ainda seja usado como exemplo, o CRI-O é compatível com qualquer registro de imagens que siga o padrão OCI (Open Container Initiative), incluindo registros privados e públicos.

> NOTA: A URL _docker.io/scovl/golang-app:latest_, é meramente ilustrativa. Sinta-se livre para testar quaisquer aplicações consultando o [Dockerhub](https://hub.docker.com/).

O valor _latest_ se refere a tag da imagem que você deseja baixar. As Tags das images são valores arbitrários que especificam uma versão da imagem a ser baixada. Em vez de usar tags para especificar uma versão de uma imagem, o OpenShift 4.x com CRI-O usa o valor de hash [SHA256](https://en.wikipedia.org/wiki/SHA-2) exclusivo para cada versão de uma imagem. O download de uma imagem pelo hash [SHA256](https://en.wikipedia.org/wiki/SHA-2) é um benefício de segurança para o OpenShift. As tags são mutáveis, o que significa que várias tags podem apontar para diferentes versões de imagem em momentos diferentes. As hashes [SHA256](https://en.wikipedia.org/wiki/SHA-2) são imutáveis ​​e sempre apontam para uma única imagem, independentemente de quaisquer tags associadas a ela. Se uma imagem for alterada por algum motivo, a hash SHA256 será alterada, mesmo que suas tags não sejam alteradas.

O comando `crictl inspect` exibe todas as informações de tempo de execução de baixo nível sobre um contêiner. Se você não especificar nenhum parâmetro, o `crictl inspect` retornará uma longa lista de informações sobre o contêiner no formato [JSON](https://pt.wikipedia.org/wiki/JSON). Usando o parâmetro -f, você pode especificar uma parte da saída JSON que deseja visualizar. Usando o ID do contêiner app-cli obtido usando o `crictl ps`, é possível também obter o PID do contêiner app-cli usando o `crictl inspect`, conforme demonstrado no exemplo a seguir:

```bash
# crictl inspect -f '&#123;&#123; .info.pid &#125;&#125;' fae9e245e6a7 4470
```

O `Property accessors` é uma maneira de descrever e acessar uma parte específica de dados em um conjunto de dados JSON. (Você pode aprender mais sobre em [https://goo.gl/ZY9vNt](https://goo.gl/ZY9vNt).) É possível executar o crictl inspect <ID do contêiner> no node do aplicativo para ver todos os dados disponíveis no CRI-O sobre um contêiner em execução.

Se você excluir o pode app-cli ou parar o contêiner usando o crictl diretamente, o OpenShift criará um novo contêiner usando a mesma imagem e configuração, mas terá um PID diferente. O PID também será alterado se você reiniciar o node do aplicativo ou fizer redeploy dos seus aplicativos. De forma semelhante, o ID do contêiner será alterado nas mesmas circunstâncias. Estes não são valores permanentes no seu node. Para iniciar uma sessão de shell interativa em um contêiner em execução, edite o seguinte comando para fazer referência ao ID do seu contêiner:

```bash
# crictl exec -it fae9e245e6a7 bash
```

A opção `-i` fornece uma sessão de usuário interativa, `-t` cria uma sessão `TTY` no contêiner e o `bash` inicia o programa terminal do shell bash no TTY que você criou no contêiner. Você entrou efetivamente no seu contêiner em execução. Em vez de apenas fornecer a saída do comando, o parâmetro interativo fornece um shell bash ativo.

---

### COMPREENDENDO O PROCESSO

É de extrema importância compreender como um contêiner realmente funciona, como os sistemas são projetados e como os problemas são analisados quando eles inevitavelmente ocorrem. Então vamos partir para os conceitos básicos e definir exatamente o que é um contêiner, o que roda por trás do Openshift e os seus componentes. Um contêiner pode ser definido de diversas maneiras. No entanto, particularmente, a definição que na minha opinião define melhor o que é um contêiner, é esta: "uma maneira mais eficaz de isolar processos em um sistema Linux".

Quando você faz o deploy de uma aplicação no OpenShift, uma solicitação é iniciada em sua [API](https://canaltech.com.br/software/o-que-e-api/). Para entender realmente como os contêineres isolam os processos dentro deles, precisamos olhar clinicamente como esses serviços funcionam juntos até o deploy da aplicação. Quando o deploy de um aplicativo é feito no OpenShift, o processo começa com os services. O deploy da aplicação começa com componentes de aplicativos exclusivos do OpenShift. O processo segue da seguinte maneira:

1. O OpenShift cria uma imagem personalizada usando seu código-fonte e o builder image do que você especificou. Por exemplo, app-cli usa a builder image do Go.
2. Essa imagem é carregada no registro interno que está rodando em um contêiner.
3. O OpenShift cria uma build config para documentar como seu aplicativo é construído. Isso inclui qual imagem foi criada, a builder image usada, a localização do código-fonte e outras informações.
4. O OpenShift cria um deployment config para controlar os deployments e atualizações dos seus aplicativos. As informações contidas no deployment config incluem o número de réplicas, o método de atualização e variáveis ​​específicas do aplicativo e volumes montados.
5. O OpenShift cria um deployment, que representa uma única versão do deploy do aplicativo. Cada deployment é associado ao componente deployment config do seu aplicativo.
6. O balanceador de carga interno do OpenShift é atualizado com uma entrada para o registro DNS do aplicativo. Esta entrada será vinculada a um componente criado pelo Kubernetes.
7. O OpenShift cria um componente chamado Image Stream. No OpenShift, um image stream monitora o builder image, o deployment config e outros componentes que sofrem modificações. Se uma alteração for detectada, os image streams podem acionar as redefinições de aplicativos para refletir as mudanças.

A imagem abaixo mostra como esses componentes estão interligados. Quando um desenvolvedor cria um código-fonte de um aplicativo e aciona um novo deployment (neste caso, usando a ferramenta de linha de comando `oc`), o OpenShift cria os componentes como o deployment config, o image stream e o build config.

![https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/appco01.png#center](https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/appco01.png#center)

O build config cria uma imagem customizada específica do aplicativo usando o builder image e o código-fonte especificado. Esta imagem é armazenada no registro de imagens e o componente do deployment config cria um deploy exclusivo para cada versão do aplicativo. O image stream é criado e monitora as alterações na configuração de deployment e nas imagens relacionadas no registro interno. A rota do DNS também é criada e será vinculada a um objeto do Kubernetes. Na imagem acima observe que os usuários estão sem acesso ao aplicativo. Não há aplicação. O OpenShift depende do Kubernetes, bem como do CRI-O para obter o deployment do aplicativo para o usuário.

---

### UM POUCO SOBRE KUBERNETES

O Kubernetes é a engine de orquestração, e é o coração do OpenShift. De muitas maneiras, um cluster do OpenShift é um cluster do Kubernetes. Se você fez o deploy da nossa aplicação de exemplo, no caso o `app-cli`, o Kubernetes criou vários componentes como:

* Replication controller - que dimensiona o aplicativo conforme necessário no Kubernetes. Esse componente também garante que o número desejado de réplicas no deployment config seja mantido em todos os momentos.
* Service - este componente expõe o aplicativo. Um service do Kubernetes é um endereço IP único usado para acessar todos os pods ativos de um deployment da aplicação. Quando você dimensiona um aplicativo para cima ou para baixo, o número de pods muda, mas eles todos são acessados através de um único service.
* Pods - representa a menor unidade escalável no OpenShift.

Normalmente, um único pod é composto por um único contêiner. Mas, em algumas situações, faz sentido ter um pod composto por vários contêineres. A figura a seguir ilustra os relacionamentos entre os componentes criador pelo Kubernetes. O replication controller determina quantos pods são criados para um deploy inicial de um aplicativo e está vinculado ao componente de deployment do OpenShift. O service também está vinculado ao pod. O service representa todos os pods que o replication controller efetuou o deploy. Ele fornece um único endereço IP no OpenShift para acessar seu aplicativo, pois ele é dimensionado para cima e para baixo em diferentes nodes em seu cluster. O service é o endereço IP interno mencionado na rota criada no balanceador de carga do OpenShift.

O relacionamento entre o deployment e os replication controllers pode ser explicado na forma como é feito o deployment dos aplicativos, como são dimensionados e atualizados. Quando são feitas alterações em uma configuração de deployment, um novo deploy é criado, o que, por sua vez, cria um novo replication controller. O replication controller, em seguida, cria o número desejado de pods dentro do cluster, que é onde realmente ocorre o deployment do aplicativo.

![https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/appco02.png#center](https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/appco02.png#center)

O Kubernetes é usado para orquestrar contêineres em um cluster do OpenShift. Mas em cada node do aplicativo, o Kubernetes depende do **[CRI-O](https://cri-o.io/)** para criar os contêineres das aplicações.

---

### UM POUCO SOBRE CRI-O E O KERNEL LINUX

O [CRI-O](https://cri-o.io/) é o contêiner runtime padrão do OpenShift 4.x. Isto é, é uma aplicação em servidor que cria, mantém e remove contêineres. Basicamente um contêiner runtime pode atuar como uma ferramenta independente em um laptop ou em um único servidor, mas é mais poderoso quando está sendo orquestrado em um cluster por uma ferramenta como o Kubernetes.

O CRI-O é mais leve e otimizado especificamente para Kubernetes. O Kubernetes controla o CRI-O para criar contêineres que hospedam o aplicativo. Para isolar as bibliotecas e aplicativos na imagem, juntamente com outros recursos do servidor, o CRI-O usa componentes do kernel do Linux. Esses recursos no nível do kernel são os componentes que isolam os aplicativos em seu contêiner.

![https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/appco03.png#center](https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/appco03.png#center)

O CRI-O usa três componentes do kernel Linux para isolar os aplicativos em execução nos contêineres que são criados e limita seu acesso aos recursos no host. São eles:

* Linux namespaces - forneça isolamento para os recursos em execução no contêiner. Embora o termo seja o mesmo, esse é um conceito diferente dos namespaces do Kubernetes [https://goo.gl/GYZQ4a](https://goo.gl/GYZQ4a), que são mais ou menos análogos a um projeto do OpenShift.
* Control groups (cgroups) - fornecem limites máximos de acesso garantido para CPU e memória no node do aplicativo.
* SELinux contexts - Impede que os aplicativos em um contêiner acessem indevidamente recursos no host ou em outros contêineres. Um SELinux context é um rótulo exclusivo do aplicado aos recursos de um contêiner no node. Esse rótulo exclusivo impede que o contêiner acesse qualquer coisa que não tenha um marcador correspondente no host.

O [daemon](https://pt.wikipedia.org/wiki/Daemon_(computa%C3%A7%C3%A3o)) do CRI-O cria esses recursos do kernel dinamicamente quando o contêiner é criado. Aplicativos no OpenShift são executados e associados a esses componentes do kernel. Eles fornecem o isolamento que você vê de dentro de um contêiner.
![https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/appco04.png#center](https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/appco04.png#center)

Um servidor Linux é separado em dois grupos de recursos principais: o espaço do usuário e o espaço do kernel. O espaço do usuário é onde os aplicativos são executados. Qualquer processo que não faz parte do kernel é considerado parte do espaço do usuário em um servidor Linux. O [kernelspace](http://www.uniriotec.br/~morganna/guia/kernel.html) é o próprio kernel. Sem privilégios especiais de administrador, como os usuário root, os usuários não podem fazer alterações no código em execução no [kernelspace](http://www.uniriotec.br/~morganna/guia/kernel.html).

Os aplicativos em um contêiner são executados no espaço do usuário, mas os componentes que isolam os aplicativos no contêiner são executados no [kernelspace](http://www.uniriotec.br/~morganna/guia/kernel.html). Isso significa que os contêineres são isolados usando componentes do kernel que não podem ser modificados de dentro do contêiner.

---

### FLUXO DE TRABALHO AUTOMATIZADO

O fluxo de trabalho automatizado executado após um deploy de um aplicativo no OpenShift inclui o Kubernetes, o CRI-O e o kernel do Linux. As interações e dependências se estendem por vários serviços, conforme descrito na imagem abaixo:

![https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/appco05.png#center](https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/appco05.png#center)

O OpenShift trabalha com o Kubernetes para garantir que as solicitações dos usuários sejam atendidas e que os aplicativos sejam entregue. Como qualquer outro processo em execução em um servidor Linux, cada contêiner tem um identificador do processo (PID) no node da aplicação.

Você pode analisar como os contêineres isolam recursos de processo com namespaces do Linux testando o PID atual do contêiner `app-cli`. O CRI-O cria um conjunto exclusivo de namespaces para isolar os recursos em cada contêiner. A aplicação está vinculada aos namespaces porque elas são exclusivas para cada contêiner. O [Cgroups](https://en.wikipedia.org/wiki/Cgroups) e o [SELinux](https://en.wikipedia.org/wiki/Security-Enhanced_Linux) são configurados para incluir informações para um contêiner recém-criado, mas esses recursos do kernel Linux são compartilhados entre todos os contêineres em execução no node do aplicativo.

Para obter uma lista dos namespaces criados para o `app-cli`, use o comando `lsns`. Você precisa que o PID para `app-cli` passe como parâmetro para `lsns`. O comando `lsns` aceita um PID com a opção `-p` e gera os namespaces associados a esse PID. A saída para `lsns` possui as seis colunas a seguir:

* NS - Inode associado ao namespace
* TYPE - tipo de namespace criado
* NPROCS - Número de processos associados ao namespace
* PID - processo usado para criar o namespace
* USER - usuário que possui o namespace
* COMMAND - Comando executado para iniciar o processo para criar o namespace

Quando você executa o comando, a saída de `lsns` mostra seis namespaces para app-cli. Cinco desses namespaces são exclusivos do app-cli e fornecem o isolamento do contêiner que estamos tratando. Há também dois namespaces adicionais no Linux que não são usados ​​diretamente pelo OpenShift. O namespace de usuário não é usado atualmente pelo OpenShift, e o namespace do cgroup é compartilhado entre todos os contêineres no sistema.

Em um node do aplicativo OpenShift, o namespace de usuário é compartilhado entre todos os aplicativos no host. O namespace do usuário foi criado pelo PID 1 no host, tem mais de 200 processos associados a ele, e está associado ao comando `systemd`. Os outros namespaces associados ao PID app-cli têm muito menos processos e não pertencem ao PID 1 no host. O OpenShift usa cinco namespaces do Linux para isolar processos e recursos em nodes de aplicativos. Apresentar uma definição concisa para o que um namespace faz é um pouco difícil. Duas analogias descrevem melhor suas propriedades mais importantes, se você perdoar uma pequena licença poética:

* Namespaces são como paredes de papel no kernel do Linux. Eles são leves e fáceis de levantar, mas oferecem privacidade suficiente quando estão no lugar.
* Os namespaces são semelhantes aos espelhos bidirecionais. De dentro do contêiner, apenas os recursos no namespace estão disponíveis. Mas com o ferramental adequado, você pode ver o que há em um namespace do sistema host.

O exemplo a seguir lista todos os namespaces de app-cli com `lsns`:

 ```bash
# lsns -p 4470
        NS TYPE NPROCS PID USER COMMAND
4026531837 user	254	1 root	/usr/lib/systemd/systemd --	switched-root --system --deserialize 20
4026532211 mnt	12 4470 1000080000 httpd -D FOREGROUND
4026532212 uts	12 4470 1000080000 httpd -D FOREGROUND
4026532213 pid	12 4470 1000080000 httpd -D FOREGROUND
4026532420 ipc	13 3476 1001	/usr/bin/pod
4026532423 net	13 3476 1001	/usr/bin/pod
```

Como você pode ver, os cinco namespaces que o OpenShift usa para isolar aplicativos são:

* Mount - garante que apenas o conteúdo correto esteja disponível para os aplicativos no contêiner
* Network - fornece a cada contêiner sua própria pilha de rede isolada
* PID - fornece a cada contêiner seu próprio conjunto de PID
* UTS - Dá a cada contêiner seu próprio hostname e domain name
* IPC - fornece isolamento de memória compartilhada para cada contêiner

Atualmente, há dois namespaces adicionais no kernel do Linux que não são usados ​​pelo OpenShift:

* Cgroup - Cgroups são usados ​​como um recurso compartilhado em um node OpenShift, portanto, o namespace não é necessário para o isolamento efetivo.
* User - Esse namespace pode mapear um usuário em um contêiner para um usuário diferente no host. Por exemplo, um usuário com ID 0 no contêiner poderia ter o ID do usuário 5000 ao interagir com recursos fora do contêiner. Esse recurso pode ser ativado no OpenShift, mas há problemas com o desempenho e a configuração de nodes que estão fora do escopo do nosso cluster de exemplo.

> NOTA: Observe que existe uma aplicação em  `/usr/bin/pod`. Na verdade esta é uma pseudo-aplicação que é usada para contêineres criados pelo Kubernetes. Na maioria das circunstâncias, um pod consiste em um contêiner. Existem condições, no entanto, em que um único pod pode conter vários contêineres. Quando isso ocorre, todos os contêineres no pod compartilham esses namespaces. Isso significa que eles compartilham um único endereço IP e podem se comunicar com dispositivos de memória compartilhada como se estivessem no mesmo host.

Discutiremos os cinco namespaces usados pelo OpenShift com exemplos, incluindo como eles aprimoram sua segurança e como eles isolam seus recursos associados. Vamos partir agora para namespaces como ponto de montagem.

---

### O NAMESPACE MOUNT

O namespace _mount_ isola o conteúdo do sistema de arquivos, garantindo que o conteúdo atribuído ao contêiner pelo OpenShift seja o único conteúdo disponível para os processos em execução no contêiner. O namespace _mount_ para o contêiner _app-cli_, por exemplo, permite que os aplicativos no contêiner acessem apenas o conteúdo na imagem do contêiner _app-cli_ personalizada e qualquer informação armazenada no volume persistente associado à declaração de volume persistente (PVC) para app-cli.

![https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/namespace-mount.png#center](https://raw.githubusercontent.com/scovl/scovl.github.io/master/post/images/namespace-mount.png#center)

Quando configuramos o OpenShift, especificamos um dispositivo de bloco para o CRI-O a ser usado para armazenamento em contêiner. Sua configuração do OpenShift usa o sistema de arquivos overlay neste dispositivo para armazenamento em contêiner. Cada contêiner recebe seu próprio sistema de arquivos overlay quando é criado. Essa solução de armazenamento é rápida e se adapta bem a grandes clusters em produção. Para visualizar todos os sistemas de arquivos overlay criados pelo CRI-O no seu host, execute o comando `lsblk`. O sistema de arquivos que o contêiner app-cli usa para armazenamento é registrado nas informações do `crictl inspect`. Para obter o PID e o caminho dos logs do seu contêiner app-cli, execute o seguinte comando, substituindo `<container-id>` pelo ID real do seu contêiner:

```bash
# Obter o PID e o caminho do log para um contêiner específico
crictl inspect --output go-template \
  --template '{{.info.pid}}, {{.info.logPath}}' \
  <container-id>
``` 

O namespace _mount_ para os contêineres das suas aplicações é criado em um namespace de montagem diferente do sistema operacional do node. Quando o daemon do CRI-O é iniciado, ele cria seu próprio namespace _mount_ para conter o conteúdo do sistema de arquivos para os contêineres que cria. Você pode confirmar isso executando `lsns` para o processo CRI-O. Para obter o PID do processo CRI-O principal, execute o seguinte comando `pgrep` (o processo `crio` é o nome do processo principal do daemon do CRI-O):

```bash
# pgrep -f crio
```

Depois de ter o PID do daemon do CRI-O, você pode usar o comando `lsns` para visualizar seus namespaces. Você pode também usar uma ferramenta de linha de comando chamada `nsenter` caso deseje inserir um namespace ativo para outro aplicativo. É uma ótima ferramenta para usar quando você precisa solucionar problemas de um contêiner que não está funcionando como deveria. Para usar o `nsenter`, você dá a ele um PID para o container com a opção `--target` e, em seguida, instrui-o a respeito de quais namespaces você deseja inserir para esse PID:

```bash
$ nsenter --target 2385
```

De dentro do namespace _mount_ do CRI-O, a saída do comando `mount` inclui o ponto de montagem do sistema de arquivos root do app-cli. O sistema de arquivos overlay que o CRI-O criou para o app-cli é montado no node do aplicativo em `/var/lib/containers/storage/overlay/8bd64cae...`. Vá para esse diretório enquanto estiver no namespace _mount_ do daemon do CRI-O e você encontrará um diretório chamado _rootfs_. Este diretório é o sistema de arquivos da sua aplicação app-cli no contêiner:

```bash
# ls -al rootfs
-rw-r--r--.      1 root root 15759 Aug 1 17:24 anaconda-post.log
lrwxrwxrwx.      1 root root 7 Aug 1 17:23 bin -> usr/bin
drwxr-xr-x.      3 root root 18 Sep 14 22:18 boot
drwxr-xr-x.      4 root root 43 Sep 21 23:19 dev
drwxr-xr-x.     53 root root 4096 Sep 21 23:19 etc
-rw-r--r--.      1 root root 7388 Sep 14 22:16 help.1
drwxr-xr-x.      2 root	root 6 Nov 5 2016 home
lrwxrwxrwx.      1 root root 7 Aug 1 17:23 lib -> usr/lib
lrwxrwxrwx.      1 root root 9 Aug 1 17:23 lib64 -> usr/lib64
drwx------.      2 root root 6 Aug 1 17:23 lost+found
drwxr-xr-x.      2 root root 6 Nov 5 2016 media
drwxr-xr-x.      2 root root 6 Nov 5 2016 mnt
drwxr-xr-x.      4 root root 32 Sep 14 22:05 opt
...
```

Entender como esse processo funciona e onde os artefatos são criados é importante quando você usa contêineres todos os dias. Do ponto de vista dos aplicativos em execução no contêiner app-cli, tudo o que está disponível para eles é o que está no diretório rootfs, porque o namespace _mount_ criado para o contêiner isola seu conteúdo. Entender como os namespaces _mount_ funcionam em um node e saber como inserir um namespace de contêiner manualmente é uma ferramenta inestimável para solucionar um problema de uma contêiner que não está funcionando como foi projetado. Por fim, ainda sobre o namespace _mount_ pressione `Ctrl+D` para sair dele e retornar ao namespace padrão do node. A seguir vamos conhecer o namespace _UTS_ .

---

### O NAMESPACE UTS

O namespace _UTS_ ou  _Unix time sharing_ permite que cada contêiner tenha seu próprio hostname e domain name. Mas não se engane, o namespace _UTS_ não tem nada a ver com o gerenciamento do relógio do sistema. O namespace _UTS_ é onde o hostname, o domain name e outras informações do sistema são retidos. Basicamente se você executar o comando `uname -a` em um servidor Linux para obter informações de hostname ou domain name, saiba que o namespace _UTS_ segue basicamente a mesma estrutura de dados. Para obter o valor do hostname de um contêiner em execução, você pode usar o comando `crictl exec` (quando no nó) ou `oc exec` (a partir do cliente). O hostname de cada contêiner do OpenShift é o nome do seu pod:

```bash
# Para obter o hostname do contêiner a partir do nó (via SSH)
# crictl exec <container-id> hostname

# Para obter o hostname a partir do cliente oc (forma mais comum)
oc exec <pod-name> -- hostname
```

Se você escalar a sua aplicação, o container em cada pod terá um hostname único também. Para confirmar que cada contêiner possui um hostname exclusivo, efetue login no seu cluster como seu usuário desenvolvedor:

```bash
oc login -u developer -p developer https://ocp1.192.168.100.1.nip.io:8443
```

A ferramenta de linha de comando `oc` tem uma funcionalidade semelhante ao `crictl exec`. Em vez de passar o ID para o contêiner, no entanto, você pode passar o pod no qual deseja executar o comando. Depois de efetuar login no seu cliente oc, dimensione sua aplicação para dois pods com o seguinte comando:

```bash
oc scale dc/app-cli --replicas=2
```

Isso causará uma atualização no deployment config da aplicação e acionará a criação de um novo pod. Você pode obter o nome do novo grupo executando o comando `oc get pods --show-all=false`. A opção `--show-all=false` impede a saída de pods em um estado Concluído, portanto, você vê apenas pods ativos na saída:

```bash
$ oc get pods --show-all=false
```

Para obter o hostname de seu novo pod, use o comando `oc exec`. É semelhante ao `crictl exec`, mas, em vez do ID de um contêiner, você usa o nome do pod para especificar onde deseja que o comando seja executado. O hostname do novo pod corresponde ao nome do pod, assim como o seu pod original:

```bash
$ oc exec app-cli-1-9hsz1 hostname
```

Quando você está solucionando problemas a nível da aplicação, esse é um benefício incrivelmente útil fornecido pelo _namespace UTS_. Agora que você sabe como os hostnames funcionam nos contêineres, vamos partir para o namespace do PID.

---

### O NAMESPACE PID

Os PIDs são como um aplicativo envia sinais e informações para outros aplicativos, isolar PIDs visíveis em um contêiner apenas para os aplicativos nele contidos é um recurso de segurança importante. Isso é feito usando o _namespace PID_. Em um servidor Linux, o comando `ps` mostra todos os processos em execução, juntamente com seus PIDs associados no host. A opção --ppid limita a saída a um único PID e a qualquer processo filho que tenha gerado.

Podemos usar o comando `ps` com a opção `--ppid` para visualizarmos os processos no node da aplicação. No entanto, acaba não sendo uma boa prática caso você deseje ver todos os PID's visíveis dentro do contêiner. A melhor alternativa neste caso, é usar o comando abaixo:

```bash
$ oc exec app-cli ps
```

Agora que você pode acompanhar um pouco sobre namespaces no OpenShift, nos próximos capítulos irei abordar sobre os services, como testar uma aplicação resiliente, compreender melhor o replication controller, labels e seletores, como escalar aplicações com auto-scaling e metrics, como configurar opções de storage persistente incluindo NFS, OpenShift Data Foundation (ODF), operações de segurança com SELinux, quotas, cgroups, e compreender melhor sobre HAProxy. Por fim, irei concluir este artigo com a integração de tudo isso ao Jenkins.

---

### REFERÊNCIAS

* OpenShift 4.x Documentation - [https://docs.openshift.com/container-platform/4.12/](https://docs.openshift.com/container-platform/4.12/)
* OpenShift Data Foundation Documentation - [https://access.redhat.com/documentation/en-us/red_hat_openshift_data_foundation](https://access.redhat.com/documentation/en-us/red_hat_openshift_data_foundation)
* Red Hat Ceph Storage Documentation - [https://access.redhat.com/documentation/en-us/red_hat_ceph_storage](https://access.redhat.com/documentation/en-us/red_hat_ceph_storage)
* OpenShift Local Documentation - [https://developers.redhat.com/products/openshift-local/overview](https://developers.redhat.com/products/openshift-local/overview)
* OpenShift in Action - [https://www.manning.com/books/openshift-in-action](https://www.manning.com/books/openshift-in-action)
* Kubernetes in Action - [https://www.manning.com/books/kubernetes-in-action](https://www.manning.com/books/kubernetes-in-action)
* CRI-O Documentation - [https://cri-o.io/](https://cri-o.io/)
* GO in Action - [https://www.manning.com/books/go-in-action](https://www.manning.com/books/go-in-action)
* Go Web Programming - [https://www.manning.com/books/go-web-programming](https://www.manning.com/books/go-web-programming)
