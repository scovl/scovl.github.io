+++
title = "OpenShift"
description = "Arrumando a casa"
date = 2019-06-08T19:47:57-03:00 
tags = [
    "fedora",
]
author = "Vitor Lobo Ramos"
weight = 6
draft = false
+++

> Este material foi elaborado com o propósito de compreender melhor o funcionamento do OpenShift, e de plataformas agregadas. Se houver por minha parte alguma informação errada, por favor, entre em contato ou me mande um pull request em meu perfil no [github](https://github.com/lobocode/lobocode.github.io/blob/master/_posts/2018-06-25-openshift.md). As referências usadas para o estudo além da experiência prática, estarão no rodapé da página. Artigo em constante atualização e revisão.

---

### CAPÍTULO 1 - O CONCEITO

* **[Breve introdução](#breve-introducao)**
* **[Plataforma em contêineres](#plataforma-em-conteineres)**
* **[Casos de Uso](#casos-de-uso)**
* **[Escalando Aplicações](#escalando-aplicacoes)**

### CAPÍTULO 2 - PREPARANDO O AMBIENTE

* **[Preparando para instalar o OpenShift](#preparando-para-instalar-o-openshift)**
* **[Configurando o NetworkManager](#configurando-o-networkmanager)**
* **[Instalando ferramentas no servidor master](#instalando-ferramentas-no-servidor-master)**
* **[Configurando o conteiner storage](#configurando-o-conteiner-storage)**
* **[Configurando o SElinux em seus nodes](#configurando-o-selinux-em-seus-nodes)**
* **[Instalando o OpenShift](#instalando-o-openshift)**
* **[Executando o Playbook](#executando-o-playbook)**

### CAPÍTULO 3 - TEST DRIVE

* **[Criando Projetos](#criando-projetos)**
* **[Implementando nosso primeiro aplicativo](#implementando-nosso-primeiro-aplicativo)**
* **[Trabalhando diretamente com docker](#trabalhando-diretamente-com-docker)**

### CAPÍTULO 4 - APROFUNDANDO

* **[Compreendendo o processo](#compreendendo-o-processo)**
* **[Um pouco sobre kubernetes](#um-pouco-sobre-kubernetes)**
* **[Um pouco sobre Docker](#um-pouco-sobre-docker)**
* **[Fluxo de trabalho automatizado](#fluxo-de-trabalho-automatizado)**
* **[O namespace MOUNT](#o-namespace-mount)**
* **[O namespace UTS](#o-namespace-uts)**
* **[O namespace PID](#o-namespace-pid)**


---

### BREVE INTRODUCAO

Imagine o seguinte cenário: 

Você contém diversos servidores rodando diversas aplicações em produção e homologação que precisam ser monitoradas, os deploy's precisam ser rápidos e eficientes com o menor risco possível de queda. Além disso a sua infraEstrutura precisa ser escalável, precisa suportar todas as requesições necessárias para atender à demanda esperada pelo cliente. Imagine este cenário com integração contínua, com deploy contínuo onde ao desenvolvedor, caberá apenas trabalhar com a ferramenta de controle de versão (git, svn, etc..). Imagine um sistema inteligente o suficiente para detectar alterações em código, falhas, ser capaz de voltar a versão automaticamente se algo der errado, ser capaz de escalar horizontalmente automaticamente se as requisições e os acessos aumentarem de repente, e também ser capaz de voltar ao seu estado normal assim que os acessos cessarem. 

Além de tudo isso, este sistema inteligente é capaz de prolongar a vida útil dos servidores por entrar em estado IDLE quando nenhuma requisição estiver rodando, e retornar ao estado normal a partir da primeira requisição. E tudo de maneira automática. Este sistema também é capaz de fazer canary teste, para descobrir a aceitação em produção de um determinado sistema. Imaginou o cenário? Pois bem, é sobre esta tecnologia que irei escrever aqui. Devido ao crescimento da demanda por máquinas virtuais e grande dificuldade na operação desse ambiente, surgiu a necessidade de melhorar esse modelo. Com isso empresas que buscam melhores soluções para administradores de sistemas, e desenvolvedores tanto do meio corporativo, quanto da própria comunidade, perceberam que não havia a necessidade de recriar um sistema complexo bastando apenas reutilizar alguns recursos da própria arquitetura e engenharia do kernel Linux. Lançando mão de uma funcionalidade nativa do Kernel Linux para facilitar a criação e gestão destes ambientes virtuais, eles conseguiram ótimos resultados. Assim surgiu o **[LXC](https://en.wikipedia.org/wiki/LXC)**.

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/lxc.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/lxc.png#center)

O Linux Container ou **[LXC](https://en.wikipedia.org/wiki/LXC)** como é mais conhecido, foi lançado em 2008 e é uma tecnologia que permite a criação de múltiplas instâncias isoladas de um determinado Sistema Operacional dentro de um único host. É uma maneira de virtualizar aplicações dentro de um servidor Linux. O conceito é simples e antigo sendo o comando **[chroot](https://en.wikipedia.org/wiki/Chroot)** seu precursor mais famoso que foi lançado em 1979 pelo **[Unix V7](https://en.wikipedia.org/wiki/Version_7_Unix)** com o intuito de segregar acessos a diretórios e evitar que o usuário pudesse ter acesso à estrutura raiz (“/” ou root). Esse conceito evoluiu alguns anos mais tarde com o lançamento do **[jail](https://www.freebsd.org/cgi/man.cgi?query=jail&amp;sektion=8&amp;manpath=freebsd-release-ports)**, no sistema operacional FreeBSD 4.

Essa implementação já introduzia a ideia de segregação de rede e limitação dos acessos de superusuários aos processos que passou a ser adotada com maiores funcionalidades pelas distribuições Linux. Posteriormente foi melhor definido em alguns sistemas como o **[AIX WPAR](https://en.wikipedia.org/wiki/Workload_Partitions)** e o **[Solaris Containers](https://en.wikipedia.org/wiki/Solaris_Containers)**. Nesses dois sistemas já havia o conceito de virtualização de sistema operacional, mas não o conceito de contêineres.

Nas distribuições Linux o chroot era uma maneira fácil de criar uma jail para as conexões dos servidores FTP, mas acabou ficando mais conhecido pela sua vulnerabilidade do que pela sua segurança. Mais tarde o chroot acabou ajudando a cunhar um termo **[jailbreak](https://pt.wikipedia.org/wiki/Jailbreak_(iOS))**. A grande diferença entre o chroot e o LXC é o nível de segurança que se pode alcançar. Com relação à virtualização, a diferença está no fato do LXC não necessitar de uma camada de sistema operacional para cada aplicação. Ao comparar com a virtualização tradicional, fica mais claro que uma aplicação sendo executada em um LXC demanda muito menos recursos, consumindo menos espaço em disco, e com um nível de portabilidade difícil de ser alcançado por outras plataformas. Mas não foi só a adoção de desenvolvedores e administradores de sistemas que tornou essa tecnologia tão popular. A consolidação da virtualização no mercado e a crescente demanda por computação em nuvem criaram o ambiente perfeito para o LXC se espalhar rapidamente. Aplicações podem ser portadas direto do laptop do desenvolvedor, para o servidor de produção, ou ainda para uma instância virtual em uma nuvem pública ou privada.

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/docker.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/docker.png#center)

Hoje um dos mais conhecidos LXC’s do mercado é o **[Docker](https://pt.wikipedia.org/wiki/Docker_(programa))**, escrito em **[GO](https://golang.org/)**, que nasceu como um projeto open source da **[DotCloud](https://cloud.docker.com/)**, uma empresa de **[PaaS (Platform as a Service)](https://pt.wikipedia.org/wiki/Plataforma_como_servi%C3%A7o)** que apesar de estar mais interessada em utilizar LXC apenas em suas aplicações, acabou desenvolvendo um produto que foi muito bem aceito pelo mercado. Do ponto de vista de desenvolvimento, o Docker por sí atendeu muito bem em vários quesitos. No entanto, com a crescente demanda e necessidade de entregar mais resultados em menos tempo, surgiu também a necessidade de extender as funcionalidades do Docker. Surgiu então ferramentas de orquestração de contêineres como Kubernetes e posteriormente potencializadores do próprio Kubernetes como é o caso do OpenShift.

---

### PLATAFORMA EM CONTEINERES

**O que é uma plataforma de contêineres?**

Trata-se de uma plataforma que usa contêineres para gerar build, deploy, servir e orquestrar os aplicativos em execução dentro dele. Os contêineres contém todas as bibliotecas e códigos necessários para que as aplicações funcionem adequadamente e de maneira isolada. Existem basicamente, cinco tipos de recursos são isolados em contêineres. São eles:

* Sistemas de arquivos montados.
* Recursos de memória compartilhada.
* Hostname e nome de domínio (dns).
* Recursos de rede (endereço IP, endereço MAC, buffers de memória).
* Contadores de processo.

Embora o docker engine gerencie contêineres facilitando os recursos do kernel do Linux, ele é limitado a um único sistema operacional no host. Para orquestrar contêineres em vários servidores com eficiência, é necessário usar um mecanismo de orquestração de contêineres. Isto é, um aplicativo que gerencia contêineres em tempo de execução em um cluster de hosts para fornecer uma plataforma de aplicativo escalável. Existem alguns orquestradores conhecidos na comunidade e no mercado como o Rancher, Heroku, Apache Mesos, Docker Swarm, Kubernetes e o OpenShift. O **[OpenShift](https://www.openshift.com/)** usa o **[Kubernetes](https://kubernetes.io)** como seu mecanismo de orquestração de contêineres. O Kubernetes é um projeto de código aberto que foi iniciado pelo Google. Em 2015, foi doado para a **[Cloud Native Computing Foundation](http://www.cncf.io)**.

O Kubernetes emprega uma arquitetura master/node. Os servidores master do Kubernetes mantêm as informações sobre o cluster de servidores e os nodes executam as cargas de trabalho reais do aplicativo. A grande vantagem de usar o OpenShift ao invés de seu concorrente Heroku, é que o OpenShift é gratuito, de código aberto, e roda tanto em rede pública, quanto em rede privada. O Heroku roda em plataforma fechada e somente em redes públicas. A baixo uma visão geral da arquitetura do Kubernetes:

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/2wzeZJt.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/2wzeZJt.png#center)

> NOTA: Um NODE é uma máquina de trabalho no OpenShift, anteriormente conhecida como minion no Kubernetes. Um node pode ser uma máquina virtual ou física, dependendo do cluster. Cada node tem os serviços necessários para executar pods e é gerenciado pelos componentes principais. Os serviços em um node incluem [Docker](https://www.docker.com/what-docker), [kubelet](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/) e [kube-proxy](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/). Consulte a seção sobre nodes do Kubernetes no [documento de design da arquitetura](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/architecture/architecture.md#the-kubernetes-node) para obter mais detalhes.

Para tirar proveito de todo o potencial de uma plataforma de contêiner como o Kubernetes, é necessário alguns componentes adicionais. O OpenShift usa o docker e o Kubernetes como ponto de partida e adiciona mais algumas ferramentas para proporcionar uma melhor experiência aos usuários. O OpenShift usa a arquitetura master/node do Kubernetes e partir daí, se expande para fornecer serviços adicionais.

Em uma plataforma de contêiner como o OpenShift, as imagens são criadas quando ocorre o deploy das aplicações, ou quando as imagens são atualizadas. Para ser eficaz, as imagens devem estar disponíveis rapidamente em todos os nodes em um cluster. Para tornar isto possível, o OpenShift inclui um registro de imagens integrado como parte de sua configuração padrão. O registro de imagem é um local central que pode servir imagens dos contêineres para vários locais (tipo um **[DockerHub](https://hub.docker.com/)** local). No Kubernetes, os contêineres são criados nos nodes usando componentes chamados **pods**. Os pods são a menor unidade dentro de um cluster Kubernetes e nada mais é do que containers rodando dentro do seu cluster. Quando um aplicativo consiste em mais de um pods, o acesso ao aplicativo é gerenciado por meio de um componente chamado service. 

Um service é um proxy que conecta vários pods e os mapeia para um endereço IP em um ou mais nodes no cluster. Os endereços IP podem ser difíceis de gerenciar e compartilhar, especialmente quando estão por trás de um firewall. O OpenShift ajuda a resolver esse problema fornecendo uma camada de roteamento integrada. A camada de roteamento é um software balanceador de carga. Quando é feito um deploy de uma aplicação no OpenShift, um registro DNS é criado automaticamente para ele. Esse registro DNS é adicionado ao balanceador de carga, e o balanceador de carga faz interface com o serviço Kubernetes para lidar eficientemente com as conexões entre o deploy da aplicação e seus usuários. Dessa forma, não interessa saber o IP do pod uma vez que quando o container for derrubado e subir outro contêiner para substituí-lo, haverá outro IP em seu lugar.

Nesse caso o registro DNS que fora criado automaticamente será nosso mapeamento de rede daquela respectiva aplicação. Com as aplicações sendo executadas em pods em vários nodes e solicitações de gerenciamento vindas do node master, há bastante comunicação entre os servidores em um cluster do OpenShift. Assim, você precisa ter certeza de que o tráfego está corretamente criptografado e que poderá separar quando necessário. Visão geral da arquitetura OpenShift:

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/o3uoJ12.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/o3uoJ12.png#center)

O OpenShift usa uma solução de rede definida por software **[SDN](https://pt.wikipedia.org/wiki/Software_defined_networking)** para criptografar e modelar o tráfego de rede em um cluster. O OpenShift SDN, é uma solução que usa o **[Open vSwitch](http://openvswitch.org)** e outras tecnologias software livre, que são configuradas por padrão quando o OpenShift é implementado. Outras soluções SDN também são suportadas. O OpenShift possui fluxos de trabalho projetados para ajudá-lo a gerenciar seus aplicativos em todas as fases de seu ciclo de vida:

* **Build**

	* A principal maneira de criar aplicativos no OpenShift é usando `build image`. Esse processo é o fluxo de trabalho padrão.

* **Deployment**

	* No fluxo de trabalho padrão no OpenShift, o deployment da aplicação é acionado automaticamente depois que a imagem do contêiner é criado e disponibilizado. O processo de deployment usa a imagem do aplicativo recém criado e a implanta em um ou mais nodes. Além dos pods dos aplicativos, um serviço é criado, junto com uma rota de DNS na camada de roteamento.

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/tl53ec9.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/tl53ec9.png#center)

* **Upgrade**

	* Os usuários podem acessar o aplicativo recém-criado através da camada de roteamento após todos os componentes terem sido implantados. As atualizações de aplicativos usam o mesmo fluxo de trabalho. Quando um upgrade é acionado, uma nova imagem de contêiner é criada e a nova versão do aplicativo é implantada. Vários processos de atualização estarão disponíveis. A baixo a visão geral do processo de deploy da aplicação:![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/aGhInY5.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/aGhInY5.png#center)

É assim que o OpenShift funciona em alto nível. Para obter uma lista mais abrangente de como o OpenShift se integra e
expande as funcionalidades do Kubernetes, visite **[www.openshift.com/container-platform/kubernetes.html](http://www.openshift.com/container-platform/kubernetes.html)**.

*   Retirement (fim do ciclo de vida).

---

### CASOS DE USO

Se parar-mos para refletir um pouco sobre tecnologias que vieram com a proposta de isolar processos e serviços como os mainframes, e a revolução da virtualização onde várias máquinas virtuais podem ser executadas em um único servidor físico, podemos compreender melhor o rumo em que as tecnologias hoje tem avançado. Por exemplo, com máquinas virtuais, cada processo é isolado em sua própria máquina virtual. Como cada máquina virtual possui um sistema operacional completo e um kernel completo, ele deve ter todos os sistemas de arquivos necessários para um sistema operacional completo. Isso também significa que ele deve ser corrigido, gerenciado e tratado como uma infraestrutura tradicional. Contêineres são o próximo passo nessa evolução. Um contêiner contém tudo o que a aplicação precisa para rodar com sucesso. Como por exemplo:

* Código-fonte ou o código compilado
* Bibliotecas e aplicativos necessários para rodar corretamente
* Configurações e informações sobre como conectar-se a fontes de dados compartilhadas

Máquinas virtuais podem ser usadas para isolamento do processo:

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/FsyZT7m.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/FsyZT7m.png#center)

Casos de uso para plataformas que trabalham com contêineres:

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/MTIhnmV.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/MTIhnmV.png#center)

Os contêineres usam um único kernel para servir aplicações economizando espaço, e recursos e fornecendo plataformas de aplicações flexíveis. No entanto, é bom frizar que **o que os contêineres não contêm, é igualmente importante**. Ao contrário das máquinas virtuais, todos os contêineres são executados em um único kernel Linux compartilhado. Para isolar os aplicativos, os contêineres usam componentes dentro do kernel. Como os contêineres não precisam incluir um kernel completo para atender a aplicação a ser implementada, além de todas as dependências de um sistema operacional, eles tendem a ser muito menores do que as máquinas virtuais, tanto em suas necessidades de armazenamento, quanto no consumo de recursos.

Por exemplo, enquanto uma máquina virtual típica você poderá começar com um storage de 10 GB mais ou menos, a imagem do contêiner do CentOS 7 é de 140 MB (do Alpine Linux é ainda menor). Ser menor vem com algumas vantagens: Primeiro, a portabilidade é aprimorada. Mover 140 MB de um servidor para outro é muito mais rápido do que mover 10 GB ou mais. Em segundo lugar, iniciar um contêiner não inclui a inicialização de um kernel inteiro, o processo de inicialização é muito mais rápido. Iniciar um contêiner é normalmente medido em milissegundos, ao contrário de segundos ou minutos para máquinas virtuais.

As tecnologias por trás dos contêineres fornecem vários benefícios técnicos. Eles também oferecem vantagens comerciais. Soluções empresariais modernas devem incluir economia de tempo ou recursos como parte de seu design. Se você comparar um servidor que usa máquinas virtuais para isolar processos com um que usa contêineres para fazer o mesmo, notará algumas diferenças fundamentais:

*   Os contêineres consomem os recursos do servidor com mais eficiência. Como há um único kernel compartilhado para todos os contêineres em um host, em vez de vários kernels virtualizados, como em máquinas virtuais, mais recursos do servidor são usados para fornecer aplicações, em vez de haver sobrecarga na plataforma.
*   A densidade da aplicação aumenta com os contêineres. Como a unidade básica usada para efetuar o deploy da aplicação (imagens de contêiner) é muito menor que a unidade para máquinas virtuais (imagens de máquina virtual), mais aplicativos podem caber por servidor. Isso significa que mais aplicações exigem menos servidores para serem executados.

Comparando máquinas virtuais e contêineres, podemos ver, por exemplo, que os contêineres fornecem uma melhor utilização dos recursos do servidor:

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/IP1wCV7.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/IP1wCV7.png#center)

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

À medida que você começa a separar os aplicativos tradicionais e monolíticos em serviços menores que funcionam de forma eficaz em contêineres, você começará a visualizar suas necessidades de dados de uma maneira diferente. Esse processo é geralmente chamado de design de aplicativos como microsserviços. Integrando aplicativos stateful e stateless:

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/cG69vhp.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/cG69vhp.png#center)

O OpenShift pode integrar e gerenciar plataformas de armazenamento externo e garantir que o volume de armazenamento de melhor ajuste seja correspondido com os aplicativos que precisam dele. Para qualquer aplicação, você terá serviços que precisam ser informativos e outros sem estado. Por exemplo, o serviço que fornece conteúdo da web estático pode ser sem estado, enquanto o serviço que processa a autenticação do usuário precisa poder gravar informações no armazenamento persistente.

Como cada serviço é executado em seu próprio contêiner, os serviços podem ser ampliados e desativados independentemente. Em vez de precisar ampliar toda a sua base de código, com os contêineres, você dimensiona apenas os serviços em seu aplicativo que precisam processar cargas de trabalho adicionais. Além disso, como apenas os contêineres que precisam de acesso ao armazenamento persistente o contêm, os dados que entram no contêiner são mais seguros. No exemplo abaixo, se houvesse uma vulnerabilidade no serviço B, um processo comprometido teria dificuldade em obter acesso aos dados armazenados no armazenamento persistente. Ilustrandoas diferenças entre aplicativos tradicionais e de microsserviço: os aplicativos de microsserviço escalam seus componentes de forma independente, criando melhor desempenho e utilização de recursos:

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/8sPOhGu.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/8sPOhGu.png#center)

Isso nos leva ao fim do nosso passo inicial inicial do OpenShift e como ele implementa, gerencia e orquestra os aplicativos implantados com contêineres usando o docker e o Kubernetes. Osbenefícios fornecidos pelo OpenShift economizam tempo para humanos e usam os recursos do servidor com mais eficiência. Além disso, a natureza de como os contêineres funcionam oferece melhor escalabilidade e velocidade de implantação em relação às implantações de máquinas virtuais.

---

### PREPARANDO PARA INSTALAR O OPENSHIFT

Para este artigo, usarei a distribuição GNU/Linux Centos 7. Ele pode ser executado em servidores físicos, máquinas virtuais (VMs) ou VMs em uma nuvem pública, como o Amazon Web Services (AWS) EC2 ou Google Cloud. Essa instalação deve levar aproximadamente uma hora, dependendo da velocidade da sua conexão com a Internet. Na maior parte do tempo configurando o OpenShift, darei ênfase à linha de comando para controlar o cluster. Para instalar o `oc`, você precisará ser super usuário, ou ter acesso ao **root**. Para compreender melhor do que se trata o comando `oc`, recomendo acessar **[https://goo.gl/9n8DbQ](https://goo.gl/9n8DbQ)** documentação completa do comando `oc`. A configuração padrão do OpenShift usa a porta **TCP 8443** para acessar a API, e a interface Web. Acessaremos o servidor master nessa porta.

Para garantir que o cluster possa se comunicar adequadamente, várias portas TCP e UDP precisam estar abertas no master e nos nodes. Você poderá encontrar mais detalhes em **[https://docs.openshift.org/3.6/install_config/install/prerequisites.html#required-ports](https://docs.openshift.org/3.6/install_config/install/prerequisites.html#required-ports)**. Em nosso caso, faremos isto de maneira mais simples. Por exemplo, caso você esteja criando este ambiente uma rede isolada, como em seu laptop, poderá deixar todas as portas abertas. Ou se preferir, abaixo uma lista de portas que usaremos inicialmente:

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/SH20A4i.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/SH20A4i.png#center)

No OpenShift, os hostnames para todos os nodes devem ter um registro DNS. Isso permite que o tráfego criptografado rede entre os nodes funcione corretamente. Basicamente você precisará configurar um **[registro DNS curinga](https://tools.ietf.org/html/rfc4592)** que apontará para o seu cluster afim de acessar os aplicativos que você implementar futuramente. Se você já tem um servidor DNS já resolve a questão. Caso contrário, você poderá usar o domínio **[nip.io](nip.io)**.

> NOTA: Se você tem experiência com servidores Linux, poderá estar se perguntando: "Por que não posso simplesmente usar o arquivo `/etc/hosts` para este fim? A resposta é bem simples: esta configuração só funcionaria bem em um host pois não há propagação do DNS na rede. Serviria bem para um Minishift por exemplo. Mas para clusters distribuídos, o melhor é ter um DNS propagado.

O domínio **[nip.io](http://nip.io/)** quebra um galho enorme neste aspecto. Em vez de configurar e gerenciar um servidor DNS, você poderá criar registros DNS que resolvam qualquer endereço IP escolhido. A única desvantagem do **[nip.io](http://nip.io/)** em comparação ao um servidor DNS próprio, é que você dependerá do acesso á Internet. O único requisito para nossa instalação, no entanto, é que todos os seus servidores possam acessar um servidor DNS público. Como tenho que escolher qual DNS usarei para este artigo, então, escolhi usar o **[nip.io](http://nip.io/)**.  A baixo, um exemplo do que poderemos configurar como modelo:

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/LKIgIoQ.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/LKIgIoQ.png#center)

O CentOS 7 com o OpenShift terá endereço IP estático para garantir que o DNS e os hostnames configurados funcionem de maneira consistente. Se você não usasse endereço IP estático, seria necessário gerenciar um servidor DHCP em seu ambiente o que de todo modo não é uma boa prática.

> NOTA: O servidor DNS que estamos usando é o 8.8.8.8, que é um dos servidores DNS públicos do Google. Você pode usar qualquer servidor DNS que desejar, mas, para funcionar, ele deve resolver consultas DNS públicas para o domínio nip.io. 

Consulte os **[requisitos oficiais de hardware](https://docs.openshift.org/3.6/install_config/install/prerequisites.html#system-requirements)** para a instalação do OpenShift Origin. Eles são baseados na premissa de que você montará um cluster grande em produção. Em nosso caso, vamos testar algo menor:

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/qAChvCm.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/qAChvCm.png#center)


Agora como já vimos como preparar o ambiente, vamos à primeira etapa de instalação do OpenShift. Primeiro, vamos instalar o repositório **[Extra Packages for Enterprise Linux - EPEL]()** e em seguida o OpenShift Origin. Para tal, execute o seguinte comando:


```bash
sudo yum -y install epel-release centos-release-openshift-origin36
```

Em seguida, alguns pacotes adicionais:

```bash
sudo yum -y install origin origin-clients vim-enhanced atomic-openshift-utils 
```

Agora o NetworkManager e o certificado:

```bash
sudo yum -y install NetworkManager python-rhsm-certificates
```

Com esses pacotes instalados, precisaremos iniciar o NetworkManager pois o OpenShift usa o NetworkManager para gerenciar as configurações de rede de todos os servidores no cluster:

```bash
sudo systemctl enable NetworkManager --now
```

Mais a diante irei configurar a resolução do DNS nos dois servidores, será necessário configurar o servidor master, configurar o contêiner responsável pelo armazenamento de dados da aplicação, ativar e iniciar o docker nos nodes do OpenShift, e configurar o SELinux, e de fato instalar o OpenShift com a criação de Playbooks no Ansible. Ou seja, bastante trabalho pela frente.

---

### CONFIGURANDO O NETWORKMANAGER

Como o DNS é usado pelo OpenShift para tudo, desde o tráfego criptografado até a comunicação entre os serviços implementados, a configuração do DNS nos nodes é essencial. 

> NOTA: Estas etapas se aplicam somente se você estiver usando o **[nip.io](nip.io)** para seus hostnames.

Vamos então editar o  client DNS do CentOs através do arquivo `/etc/resolv.conf`, que foi gerado quando instalamos o NetworkManager. O parâmetro `nameserver` se refere ao servidor DNS do qual seu servidor irá se conectar. Você pode ter até três parâmetros `nameserver` listados no resolv.conf. O outro parâmetro padrão do `resolv.conf`, é o `search`. O valor do `search` é usado para qualquer consulta no DNS que não seja FQDN. Isto é, nome de domínio completo. Os FQDNs são registros DNS completos - isso significa que um FQDN contém um hostname, e um domínio de nível superior.

Caso não esteja familiarizado com a abreviação FQDN,  acesse **[https://wikibase.adentrocloud.com.br/index.php?rp=/knowledgebase/63/Fully-Qualified-Domain-Name-FQDN-e-Hostname.html](https://wikibase.adentrocloud.com.br/index.php?rp=/knowledgebase/63/Fully-Qualified-Domain-Name-FQDN-e-Hostname.html)** para saber mais. Usando o domínio **[nip.io]()**, perceba que cada octeto no endereço IP é separado por um período. Isso significa que cada número no endereço IP é um nível no domínio sendo o **[nip.io]()** de nível superior. Devido a algumas configurações que o OpenShift adiciona a cada contêiner, isso pode causar confusão ao extrair imagens de nosso **[registro intergrado]()**. Sendo assim, o recomendado é editar o parâmetro `search` para ter apenas o domínio de nível superior (no caso, **[nip.io](nip.io)**), conforme mostrado seguir:

Editando o `/etc/resolv.conf`:
```bash
# Generated by NetworkManager
search nip.io
nameserver 8.8.8.8
```

Esta configuração, no entanto, só permanecerá assim até você reiniciar os servidores. Isso ocorre porque o NetworkManager controla o `/etc/resolv.conf` e naturalmente adicionará ao parâmetro `search` que retornará o valor anterior à reset da máquina. Para impedir que isso aconteça, você precisa configurar o NetworkManager para não fazer mais alterações no `/etc/resolv.conf`. No CentOS 7, o arquivo de configuração do NetworkManager está localizado em `/etc/NetworkManager/NetworkManager.conf`.

Exemplo do `/etc/NetworkManager/NetworkManager.conf` padrão:

```bash
# Configuration file for NetworkManager.
#
# See "man 5 NetworkManager.conf" for details.
#
# The directory /etc/NetworkManager/conf.d/ can contain additional configuration
# snippets. Those snippets override the settings from this main file.
#
# The files within conf.d/ directory are read in asciibetical order.
#
# If two files define the same key, the one that is read afterwards will overwrite
# the previous one.

[main]
plugins=ifcfg-rh
[logging]
#level=DEBUG
#domains=ALL
```

Você precisa adicionar uma linha à seção `[main]` para que o NetworkManager não altere o arquivo `/etc/resolv.conf`. Desta maneira:


```bash
[main]
plugins=ifcfg-rh
dns=none
```

Depois que você reiniciar o NetworkManager, a alteração feita no `/etc/resolv.conf` persistirá nas reinicializações do servidor. Para reiniciar o NetworkManager, execute o seguinte comando systemctl:

```bash
sudo systemctl restart NetworkManager
```

Depois de concluído, confirme se o NetworkManager está sendo executado usando o status do systemctl:

```bash
systemctl status NetworkManager
? NetworkManager.service - Network Manager
Loaded: loaded (/usr/lib/systemd/system/NetworkManager.service; enabled;
➥ vendor preset: enabled)
Active: active (running) Because Sat 2017-05-13 17:05:12 EDT; 6s ago
...
```

Pós reiniciar o NetworkManager, confira se de fato o arquivo `/etc/resolv.conf` foi alterado. Se não houver o parâmetro `search`, tudo estará como deveria, e você estará pronto para seguir em frente. Agora vamos configurar um software específico para os servidores master e o node.

### Uma visão mais aprofundada dos subdomínios curinga e do OpenShift:

O domínio usar precisará apontar para o servidor do node. Isso ocorre porque o OpenShift usa o **[HAProxy]()** para rotear o tráfego corretamente entre seu DNS, e os contêineres apropriados. O **[HAProxy]()** é um balanceador de carga popular, software livre. No OpenShift, ele é executado em um contêiner e em um host específico em seu cluster. Tratando-se de DNS, ter um domínio curinga significa que qualquer host desse domínio apontará automaticamente para o mesmo endereço IP. Vamos ver alguns exemplos. Primeiro, aqui está um domínio curinga real que configuramos em um domínio:

```bash
$ dig +short *.apps.jeduncan.com
12.207.21.2
```

Observe que se você procurar qualquer outro registro terminado em .apps.jeduncan.com, e ele retornará o mesmo IP:

```bash
$ dig +short app1.apps.jeduncan.com
12.207.21.2
```

ou

```bash
$ dig +short someother.apps.jeduncan.com
12.207.21.2
```

O OpenShift usa a mesma lógica. Cada aplicativo um DNS que é membro do domínio curinga criado. Dessa forma, todas as entradas do DNS para seus aplicativos funcionam sem qualquer configuração adicional.

---

### INSTALANDO FERRAMENTAS NO SERVIDOR MASTER

Vários pacotes precisam ser instalados apenas no servidor master. O processo de instalação do OpenShift é escrito usando o Ansible. 
Para instalar o OpenShift, você criará um arquivo de configuração escrito em YAML. Esse arquivo será lido pelo mecanismo Ansible para implementar o OpenShift exatamente como deve ser. Criaremos um arquivo de configuração relativamente simples. Para instalações mais elaboradas, existe uma documentação em **[https://goo.gl/rngdLy](https://goo.gl/rngdLy)**. O instalador do OpenShift é escrito e testado em relação a uma versão específica do Ansible. Isso significa que você precisa verificar se a versão do Ansible está instalada no seu servidor master.

> NOTA: Precisamos nos preocupar apenas com Ansible no servidor master. Isso porque não há agente nos nodes. O Ansible não usa um agente nos sistemas que está controlando; em vez disso, ele usa o SSH como um mecanismo de transporte e para executar comandos remotos. 

Inicie este processo executando o seguinte comando yum:

```bash
sudo yum -y install httpd-tools gcc python-devel python-pip
```

O pacote python-pip instala o gerenciador de pacotes de aplicativos Python chamado pip. Ele é usado para instalar aplicativos escritos em Python e disponíveis no Índice de pacotes do Python (www.pypi.org). Com pip instalado, você pode usá-lo para instalar o Ansible e garantir que você instale a versão 2.2.2.0, que é a usada com o OpenShift 3.6:

```bash
pip -v install ansible==2.2.2.0
```

Para que o instalador do OpenShift funcione corretamente, você precisa criar um par de chaves SSH no seu servidor master e distribuir a chave pública para o seu node. Para criar um novo par de chaves SSH em seu servidor master, você pode usar o comando `ssh-keygen` como neste exemplo:

```bash
sudo ssh-keygen -f /root/.ssh/id_rsa -t rsa -N ''
```

Esse comando cria um par de chaves SSH no diretório inicial do usuário `/root`, na subpasta `.ssh`. No Linux, esse é o local padrão para as chaves SSH de um usuário. Em seguida, execute o seguinte comando `ssh-copy-id` para distribuir sua chave pública SSH recém-criada para o seu node OpenShift (se você usou endereços IP diferentes para seu mestre e node, ajuste o comando de acordo):

```bash
for i in 192.168.100.1 192.168.100.2;do ssh-copy-id root@$i;done
```

Este comando adicionará a chave pública SSH ao arquivo authorized_keys em `/root/.ssh` no node OpenShift. Isso permitirá que o instalador do OpenShift se conecte ao master e ao node para executar as etapas de instalação. Os requisitos de software para os nodes são um pouco diferentes. A maior diferença, é que é no node que é onde o docker será instalado. O pacote `libcgroup-tools` fornece utilitários que você usará para inspecionar como os aplicativos são isolados usando grupos de controle de kernel. Para instalar esses pacotes, execute o seguinte comando yum:

```bash
sudo yum -y install docker libcgroup-tools
```

A partir daquí, estaremos prontos para configurar o contêiner de armazenamento de dados do OpenShift.

---

### CONFIGURANDO O CONTEINER STORAGE

Um aplicativo chamado `docker-storage-setup` configura o armazenamento desejado para o Docker usar quando ele cria contêineres para o OpenShift.

> NOTA: Neste artigo estou usando uma configuração de gerenciamento baseado no volume lógico (LVM). Esta configuração cria um volume LVM para cada contêiner sob demanda.

Inicialmente, eles são pequenos, mas podem crescer até o tamanho máximo configurado no OpenShift para seus contêineres. Você pode encontrar detalhes adicionais sobre a configuração de armazenamento na documentação do OpenShift em **[https://goo.gl/knBqkk](https://goo.gl/knBqkk)**. A primeira etapa desse processo é criar um arquivo de configuração para o `docker-storage-setup` em seu nó OpenShift. O disco especificado em `/etc/sysconfig/docker-storage-setup` é o segundo disco que você criou para sua VM.

> NOTA: Dependendo da sua distribuição Linux, o nome do particionamento de disco `/dev /vdb em nosso exemplo` pode variar, mas a operação não.

Criando o arquivo de configuração do `docker-storage-setup`:

```bash
cat <<EOF > /etc/sysconfig/docker-storage-setup
DEVS=/dev/vdb 
VG=docker-vg
EOF
```

Perceba que o particionamento `/dev/vdb`, trata-se do volume de 20 GB que você criou para os nodes.

> NOTA: Se você não tiver certeza sobre o nome do disco a ser usado para o armazenamento em contêiner, o comando `lsblk` fornecerá uma lista de todos os discos em seu servidor. A saída está em um diagrama de árvore fácil de entender.

Depois de criar o arquivo `/etc/sysconfig/docker-storage-setup`, execute o `docker-storage-setup` que deverá gerar uma saída parecida com esta:

```bash
docker-storage-setup

Checking that no-one is using this disk right now ...
OK
Disk /dev/vdb: 41610 cylinders, 16 heads, 63 sectors/track
...
Rounding up size to full physical extent 24.00 MiB
Logical volume "docker-pool" created.
Logical volume docker-vg/docker-pool changed.
```

Com o contêiner storage configurado, é hora de iniciar o serviço do docker no node do OpenShift. Observe que este é o tempo de execução médio que os serviços irão iniciar daquí em diante usando o OpenShift:

```bash
sudo systemctl enable docker.service --now
```

Agora verifique se o serviço docker iniciou corretamente:

```bash
sudo systemctl status docker
```

A saída esperada do comando acima, será algo semelhante a isto:

```bash
? docker.service - Docker Application Container Engine
Loaded: loaded (/usr/lib/systemd/system/docker.service; enabled; vendor preset: disabled)
Drop-In: /etc/systemd/system/docker.service.d
??custom.conf
Active: active (running) since Fri 2017-11-10 18:45:12 UTC; 12 secs ago
Docs: http://docs.docker.com
Main PID: 2352 (dockerd-current)
Memory: 121.4M
CGroup: /system.slice/docker.service
```

O próximo passo é modificar o **[SELinux]()** para permitir que o OpenShift se conecte ao **[NFS]()** como uma fonte de armazenamento persistente.

---

### CONFIGURANDO O SELINUX EM SEUS NODES

No geral, as aplicações OpenShift precisarão de volumes NFS para atuar como armazenamento persistente. Para fazer isso com sucesso, você precisa informar ao SELinux sobre seus nodes para permitir que os contêineres usem o NFS. Você faz isso usando o utilitário de linha de comando `setsebool`:

```bash
sudo setsebool -P virt_use_nfs 1
sudo setsebool -P virt_sandbox_use_nfs 1
```

---

### INSTALANDO O OPENSHIFT

O OpenShift é instalado usando um playbook Ansible. Isto é, uma coleção de tarefas e parâmetros necessários para executar uma tarefa. Para executar um playbook Ansible, três coisas devem estar presentes no seu servidor:

* **Ansible Engine** - Executa o código do manual. Se você seguiu o artigo desde o início, certamente já o tem instalado.
* **Playbook** - O código que é executado propriamente. Quando você instalou os pacotes do OpenShift, diversos playbooks foram incluídos.
* **Inventário** - A lista de hosts onde os playbooks serão executados. Os inventários podem ser divididos em grupos, e conter quaisquer variáveis necessárias para executar os playbooks nos hosts.

O inventário Ansible para o OpenShift contém informações sobre seus dois hosts e especifica quais funções cada node terá em seu cluster. Se você estiver usando os endereços IP e os hostnames que estamos usando neste artigo, poderá fazer o download de um inventário preparado para o seu node master a seguir:

```bash
sudo curl -o /root/hosts https://raw.githubusercontent.com/OpenShiftInAction/AppendixA/master/hosts
```

Para aqueles que desejam personalizar a instalação, vamos analisar os componentes do inventário e como eles são projetados. Inventários fatíveis são divididos em grupos. Cada grupo consiste em hosts que são definidos pelo hostname ou pelo endereço IP. Em um inventário, um grupo também pode ser definido listando os grupos filho usando a sintaxe `:children`. No exemplo a seguir, o grupo `master_group` é formado pelos hosts no grupo1 e group2:

```bash
[master_group:children]
group1
group2

[group1]
host1
host2

[group2]
host3
host4

[group3]
host5
host6
```

Outra capacidade dos inventários é que você pode definir variáveis para os hosts, e grupos de hosts. Você pode definir variáveis para um grupo inteiro usando um cabeçalho de grupo e a sintaxe `:vars`. Para definir uma variável para um único host, adicione-a à mesma linha usada para definir o host em um grupo. Por exemplo:

```bash
[group1]
host1 var2=False var3=42
host1 foo=bar

[group1:vars]
var1=True
```

Seu inventário inicial no OpenShift usa vários grupos e muitas variáveis:

* **OSEv3** - O grupo que representa seu cluster inteiro. É composto pelos nós de grupos secundários, mestres, nfs e etcd.
* **nodes** - Todos os grupos em seu cluster, incluindo todos os mestres e todos os nós de aplicativos.
* **masters** - os nós no seu cluster que serão designados como mestres.
* **nfs** - Nós usados para fornecer armazenamento compartilhado do NFS para vários serviços nos nós principais. Isso é necessário se você tiver vários servidores mestres. Não estamos aproveitando vários mestres neste cluster inicial, mas o grupo ainda é necessário para implantar o OpenShift.
* **etcd** - Os nós onde o etcd será implantado. O etcd é o banco de dados do Kubernetes e do OpenShift. Seu cluster usará o servidor master para abrigar o banco de dados do etcd. Para clusters maiores, o etcd pode ser separado em seus próprios nós do cluster.

Para os grupos de nodes e masters, você desabilitará algumas das verificações do sistema que o manual de implantação executa antes da implantação. Essas verificações verificam a quantidade de espaço livre e memória disponível no sistema; Para um cluster inicial, você poderá usar valores menores que as recomendações que são apontadas por um dessas verificações. (Você poderá aprender mais sobre essas tais verificações em **[https://goo.gl/8C65s7](https://goo.gl/8C65s7)**. Para desabilitar as verificações, você define variáveis para cada um desses grupos:

```bash
[nodes:vars]
openshift_disable_check=disk_availability,memory_availability,docker_storage

[masters:vars]
openshift_disable_check=disk_availability,memory_availability,docker_storage
```

Os comandos acima desativam as verificações de armazenamento e memória para o grupo masters.

Seu inventário poderá conter definições de variáveis para a maioria dos hosts. A variável `ansible_connection` informa ao mecanismo Ansible para se conectar ao host a partir do sistema local onde o playbook está sendo executado. Variáveis Ansible adicionais são discutidas em **[https://goo.gl/kAvqKz](https://goo.gl/kAvqKz)**.

> NOTA: Os endereços IP e os hostnames usados neste inventário são específicos para um exemplo de cluster. Se seus endereços IP e hostnames forem diferentes, você precisará alterá-los no inventário para implementar o OpenShift com êxito.

As demais variáveis são específicas do manual do OpenShift e estão documentadas na listagem a seguir, que é um exemplo completo do inventário do OpenShift.

```bash
[OSEv3:children]
nodes
nfs
masters
etcd

[OSEv3:vars]
openshift_master_cluster_public_hostname=None
openshift_master_default_subdomain=apps.192.168.100.2.nip.io
ansible_ssh_user=root
openshift_master_cluster_hostname=None
openshift_override_hostname_check=true
deployment_type=origin

[nodes:vars]
openshift_disable_check=disk_availability,memory_availability,docker_storage

[masters:vars]
openshift_disable_check=disk_availability,memory_availability,docker_storage

[nodes]
192.168.122.100 openshift_public_ip=192.168.100.1 openshift_ip=192.168.100.1 openshift_public_hostname=ocp1.192.168.100.1.nip.io openshift_hostname=ocp1.192.168.100.1.nip.io connect_to=192.168.100.1 openshift_schedulable=False ansible_connection=local
192.168.100.2 openshift_public_ip=192.168.100.2 openshift_ip=192.168.100.2 openshift_public_hostname=ocp2.192.168.100.2.nip.io openshift_hostname=ocp2.192.168.100.2.nip.io connect_to=192.168.100.2 openshift_node_labels="{'region': 'infra'}" openshift_schedulable=True

[nfs]
192.168.100.1 connect_to=192.168.100.1 ansible_connection=local

[masters]
192.168.100.1 openshift_public_ip=192.168.100.1 openshift_ip=192.168.100.1 openshift_public_hostname=ocp1.192.168.100.1.nip.io openshift_hostname=ocp1.192.168.100.1.nip.io connect_to=192.168.100.1 ansible_connection=local

[etcd]
192.168.100.1  openshift_public_ip=192.168.100.1 openshift_ip=192.168.100.1 openshift_public_hostname=ocp1.192.168.100.1.nip.io openshift_hostname=ocp1.192.168.100.1.nip.io connect_to=192.168.100.1 ansible_connection=local
```

> NOTA: O node ocp1 possui uma variável chamada `openshift_node_labels`. Os labels dos nodes são valores arbitrários que você pode aplicar a nodes em seu cluster. O label aplicado durante o nosso deployment, `region = infra`, por exemplo, informa ao OpenShift os componentes de infraestrutura como o router, o registro integrado, métricas etc..

Depois de fazer qualquer edição de inventário necessária para corresponder ao seu ambiente, salve seu inventário em seu node master como `/root/ hosts`. O próximo passo é iniciar a implementação do OpenShift.

---

### EXECUTANDO O PLAYBOOK

O Ansible usa o SSH para efetuar login em cada node e executar as tarefas para implementar o OpenShift, portanto, esse comando precisa ser executado como o usuário root no master, que possui as chaves de acesso SSH em cada node. Para executar o playbook adequado, execute o comando `ansible-playbook`, especificando o arquivo de inventário, e a implementação de playbook instalado em `/usr/share/ansible/openshift-ansible/playbooks/byo/config.yml`:

```bash
# ansible-playbook -i /root/hosts \
/usr/share/ansible/openshift-ansible/playbooks/byo/config.yml
```

Isso inicia o processo de deploy. Dependendo da velocidade da sua conexão com a Internet, o deploy pode levar cerca de 30 a 45 minutos. Se tudo for bem sucedido, a saída indicará que o processo foi concluído com sucesso. Do contrário, observe o erro que estará em vermelho no terminal e busque debuga-lo. Quando a instalação estiver concluída, você poderá acessar seu host `https://ocp1.192.168.1.100.nip.io:8443`:

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/tela.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/tela.png#center)

> NOTA: Provavelmente você receberá um aviso sobre o site estar inseguro porque o certificado SSL não foi assinado corretamente. Não se preocupe com isso - o OpenShift criou seus próprios certificados SSL como parte do processo de instalação. Em nossa configuração, como o deploy do cluster foi feito em um laptop, o cluster está disponível apenas no laptop onde os nodes da VM estão instalados.

Se você conseguir acessar a interface da figura acima, o seu Openshift foi instalado com sucesoo! Nos próximos capítulos irei aprofundar melhor nas funcionalidades da ferramenta.

---

### CRIANDO PROJETOS 

Existem três maneiras de interagir com o OpenShift: por linha de comando, por interface web e pela **[API RESTful](https://docs.openshift.com/container-platform/3.5/rest_api/index.html)**. Quase todas as ações no OpenShift podem ser realizadas usando os três métodos de acesso. Antes de começar a usar o OpenShift, é importante atentar ao fato de que a minha proposta aqui é a de orientar na montagem, e configuração de um servidor OpenShift Origin distribuído. No entanto, se a sua intenção é a de testar o funcionamento do OpenShift de maneira simples, tudo em uma coisa só, saiba que existe o projeto **[Minishift](https://github.com/minishift/minishift)** isto é, um projeto **[all-in-one](https://blog.openshift.com/goodbye-openshift-all-in-one-vm-hello-minishift/)**. Para desenvolvimento é ótimo pois você conseguirá levantar o ambiente com bastante praticidade em uma máquina virtual simples, rodando em seu laptop. No entanto, se o seu objetivo for mais refinado certamente que terá problemas quando começar a trabalhar com armazenamento persistente, métricas, deployments complexos de aplicativos e redes. 

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

> NOTA: Você poderá encontrar na documentação todos os recursos do comando `oc` em **[https://goo.gl/Y3soGH](https://goo.gl/Y3soGH)**.

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

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/novoprojeto.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/novoprojeto.png#center)

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

Para fazer o deployment dos aplicativos usamos o comando `oc new-app`. Executando este comando em nosso aplicativo, no caso, o Image Uploader, será necessário fornecer três informações:

* O tipo do image stream que você deseja usar - o OpenShift envia várias imagens chamadas de `builder images` que você pode usar como ponto de partida para os aplicativos. Neste exemplo, usaremos o builder image do [Golang]() para criar o aplicativo.
* Um nome para o seu aplicativo - neste exemplo, usarei `app-cli`, porque esta versão do seu aplicativo será implementado em linha de comando.
* O local onde estará o código-fonte do aplicativo - o OpenShift pegará esse código-fonte e o combinará com o `builder image` Golang para criar uma imagem personalizada.

Seguindo as informações acima vamos organizar como será o projeto:

```bash
$ oc new-app \
> --image-stream=golang \
> --code=https://github.com/lobocode/image-uploader.git \
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

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/deployanapplication.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/deployanapplication.png#center)

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

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/imageuploader1.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/imageuploader1.png#center)


No OpenShift, vários componentes trabalham em conjunto para criar, implantar e gerenciar os aplicativos:

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/apprequest.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/apprequest.png#center)

Todo este processo de deployment da nossa aplicação poderia ter sido feita pela interface web do OpenShift. No entanto, compreendo que temos mais domínio da ferramenta se optarmos pelas configurações em linha de comando. Você poderá experimentar usar a interface Web do OpenShift para fazer o mesmo ou explorar outros caminhos. A partir daquí, analisaremos mais detalhadamente o cluster do OpenShift e investigaremos como os contêineres isolam seus processos no node do aplicativo.


---

### TRABALHANDO DIRETAMENTE COM DOCKER

O [Docker](https://www.docker.com/what-docker) possui em uma ferramenta de linha de comando apropriadamente chamada de `docker`. Para obter as informações necessárias para aprofundar o modo como os contêineres isolam os aplicativos no OpenShift, o comando `docker` deve ser o seu ponto de partida. Para interagir diretamente com o docker, você precisa do SSH e preferencialmente executar os comandos em modo `root` no node da aplicação. A primeira coisa a percorreremos, é a lista de todos os contêineres atualmente em execução.

Entre no node da aplicação e execute o comando `docker ps`. Este comando retorna uma lista de todos os contêineres atualmente em execução no node do aplicativo. Cada linha na saída do comando `docker ps` representa um contêiner em execução. O primeiro valor em cada linha é uma versão abreviada do ID desse contêiner. Você pode também confirmar com qual aplicação está lidando ao observar o nome dado ao contêiner. Se você seguiu os passos acima, certamente que a saída do `docker ps` será grande pois inclui informações sobre contêineres que hospedam o registro interno e o balanceador de carga HAProxy. 

A URL que aponta para a imagem no registro OpenShift pode parecer um pouco estranho se você já fez o download de uma imagem de qualquer aplicação ou ferramenta antes. Uma URL padrão de solicitação de registro contém um nome de contêiner e uma tag correspondente, como _docker.io/lobocode/golang-app:latest_ por exemplo. Essa URL do registro pode ser dividida em quatro componentes:

* docker.io - URL do registro. Nesse caso, o Docker Hub.
* lobocode - conta de usuário para o registro. Neste caso, lobocode, a minha conta pessoal.
* golang-app - Nome da imagem do contêiner para download.
* latest - Tag ou versão específica da imagem do contêiner.

> NOTA: A URL _docker.io/lobocode/golang-app:latest_, é meramente ilustrativa. Sinta-se livre para testar quaisquer aplicações consultando o [Dockerhub](https://hub.docker.com/).

O valor _latest_ se refere a tag da imagem que você deseja baixar. As Tags das images são valores arbitrários que especificam uma versão da imagem a ser baixada. Em vez de usar tags para especificar uma versão de uma imagem, o OpenShift usa o valor de hash [SHA256](https://en.wikipedia.org/wiki/SHA-2) exclusivo para cada versão de uma imagem. O download de uma imagem pelo hash [SHA256](https://en.wikipedia.org/wiki/SHA-2) é um benefício de segurança para o OpenShift. As tags são mutáveis, o que significa que várias tags podem apontar para diferentes versões de imagem em momentos diferentes. As hashes [SHA256](https://en.wikipedia.org/wiki/SHA-2) são imutáveis ​​e sempre apontam para uma única imagem, independentemente de quaisquer tags associadas a ela. Se uma imagem for alterada por algum motivo, a hash SHA256 será alterada, mesmo que suas tags não sejam alteradas.

O comando `docker inspect` exibe todas as informações de tempo de execução de baixo nível sobre um contêiner. Se você não especificar nenhum parâmetro, o `docker inspect` retornará uma longa lista de informações sobre o contêiner no formato [JSON](https://pt.wikipedia.org/wiki/JSON). Usando o parâmetro -f, você pode especificar uma parte da saída JSON que deseja visualizar. Usando o ID do contêiner app-cli obtido usando o `docker ps`, é possível também obter o PID do contêiner app-cli usando o `docker inspect`, conforme demonstrado no exemplo a seguir:

```bash
# docker inspect -f '{{ .State.Pid }}' fae9e245e6a7 4470
```

O `Property accessors` é uma maneira de descrever e acessar uma parte específica de dados em um conjunto de dados JSON. (Você pode aprender mais sobre em [https://goo.gl/ZY9vNt](https://goo.gl/ZY9vNt).) É possível executar o docker inspect <ID do contêiner> no node do aplicativo para ver todos os dados disponíveis no Docker sobre um contêiner em execução. 

Se você excluir o pode app-cli ou parar o contêiner usando o docker diretamente, o OpenShift criará um novo contêiner usando a mesma imagem e configuração, mas terá um PID diferente. O PID também será alterado se você reiniciar o node do aplicativo ou fizer redeploy dos seus aplicativos. De forma semelhante, o ID do contêiner será alterado nas mesmas circunstâncias. Estes não são valores permanentes no seu node. Para iniciar uma sessão de shell interativa em um contêiner em execução, edite o seguinte comando para fazer referência ao ID do seu contêiner:

```bash
# docker exec -it fae9e245e6a7 bash
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

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/appco01.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/appco01.png#center)

O build config cria uma imagem customizada específica do aplicativo usando o builder image e o código-fonte especificado. Esta imagem é armazenada no registro de imagens e o componente do deployment config cria um deploy exclusivo para cada versão do aplicativo. O image stream é criado e monitora as alterações na configuração de deployment e nas imagens relacionadas no registro interno. A rota do DNS também é criada e será vinculada a um objeto do Kubernetes. Na imagem acima observe que os usuários estão sem acesso ao aplicativo. Não há aplicação. O OpenShift depende do Kubernetes, bem como do docker para obter o deployment do aplicativo para o usuário. 

---

### UM POUCO SOBRE KUBERNETES

O Kubernetes é a engine de orquestração, e é o coração do OpenShift. De muitas maneiras, um cluster do OpenShift é um cluster do Kubernetes. Se você fez o deploy da nossa aplicação de exemplo, no caso o `app-cli`, o Kubernetes criou vários componentes como:

* Replication controller - que dimensiona o aplicativo conforme necessário no Kubernetes. Esse componente também garante que o número desejado de réplicas no deployment config seja mantido em todos os momentos.
* Service - este componente expõe o aplicativo. Um service do Kubernetes é um endereço IP único usado para acessar todos os pods ativos de um deployment da aplicação. Quando você dimensiona um aplicativo para cima ou para baixo, o número de pods muda, mas eles todos são acessados através de um único service.
* Pods - representa a menor unidade escalável no OpenShift.

Normalmente, um único pod é composto por um único contêiner. Mas, em algumas situações, faz sentido ter um pod composto por vários contêineres. A figura a seguir ilustra os relacionamentos entre os componentes criador pelo Kubernetes. O replication controller determina quantos pods são criados para um deploy inicial de um aplicativo e está vinculado ao componente de deployment do OpenShift. O service também está vinculado ao pod. O service representa todos os pods que o replication controller efetuou o deploy. Ele fornece um único endereço IP no OpenShift para acessar seu aplicativo, pois ele é dimensionado para cima e para baixo em diferentes nodes em seu cluster. O service é o endereço IP interno mencionado na rota criada no balanceador de carga do OpenShift.

O relacionamento entre o deployment e os replication controllers pode ser explicado na forma como é feito o deployment dos aplicativos, como são dimensionados e atualizados. Quando são feitas alterações em uma configuração de deployment, um novo deploy é criado, o que, por sua vez, cria um novo replication controller. O replication controller, em seguida, cria o número desejado de pods dentro do cluster, que é onde realmente ocorre o deployment do aplicativo.

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/appco02.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/appco02.png#center)

O Kubernetes é usado para orquestrar contêineres em um cluster do OpenShift. Mas em cada node do aplicativo, o Kubernetes depende do [docker](https://www.docker.com/what-docker) para criar os contêineres das aplicações.

---

### UM POUCO SOBRE DOCKER

O [Docker](https://www.docker.com/what-docker) é um contêiner runtime. Isto é, é uma aplicação em servidor que cria, mantém e remove contêineres. Basicamente um contêiner runtime pode atuar como uma ferramenta independente em um laptop ou em um único servidor, mas é mais poderoso quando está sendo orquestrado em um cluster por uma ferramenta como o Kubernetes.

Posso dizer, então, que o Docker é o contêiner runtime do OpenShift. No entanto, não é o único, pois, um novo runtime é suportado a partir do OpenShift 3.9 e é chamado cri-o e você pode encontra-lo em [http://cri-o.io](http://cri-o.io). O Kubernetes controla o docker para criar contêineres que hospedam o aplicativo. Para isolar as bibliotecas e aplicativos na imagem, juntamente com outros recursos do servidor, o [docker](https://www.docker.com/what-docker) usa componentes do kernel do Linux. Esses recursos no nível do kernel são os componentes que isolam os aplicativos em seu contêiner.

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/appco03.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/appco03.png#center)

O Docker usa três componentes do kernel Linux para isolar os aplicativos em execução nos contêineres que são criados e limita seu acesso aos recursos no host. São eles:

* Linux namespaces - forneça isolamento para os recursos em execução no contêiner. Embora o termo seja o mesmo, esse é um conceito diferente dos namespaces do Kubernetes [https://goo.gl/GYZQ4a](https://goo.gl/GYZQ4a), que são mais ou menos análogos a um projeto do OpenShift.
* Control groups (cgroups) - fornecem limites máximos de acesso garantido para CPU e memória no node do aplicativo. 
* SELinux contexts - Impede que os aplicativos em um contêiner acessem indevidamente recursos no host ou em outros contêineres. Um SELinux context é um rótulo exclusivo do aplicado aos recursos de um contêiner no node. Esse rótulo exclusivo impede que o contêiner acesse qualquer coisa que não tenha um marcador correspondente no host. 

O [daemon](https://pt.wikipedia.org/wiki/Daemon_(computa%C3%A7%C3%A3o)) do docker cria esses recursos do kernel dinamicamente quando o contêiner é criado. Aplicativos no OpenShift são executados e associados a esses componentes do kernel. Eles fornecem o isolamento que você vê de dentro de um contêiner.
![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/appco04.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/appco04.png#center)

Um servidor Linux é separado em dois grupos de recursos principais: o espaço do usuário e o espaço do kernel. O espaço do usuário é onde os aplicativos são executados. Qualquer processo que não faz parte do kernel é considerado parte do espaço do usuário em um servidor Linux. O [kernelspace](http://www.uniriotec.br/~morganna/guia/kernel.html) é o próprio kernel. Sem privilégios especiais de administrador, como os usuário root, os usuários não podem fazer alterações no código em execução no [kernelspace](http://www.uniriotec.br/~morganna/guia/kernel.html).

Os aplicativos em um contêiner são executados no espaço do usuário, mas os componentes que isolam os aplicativos no contêiner são executados no [kernelspace](http://www.uniriotec.br/~morganna/guia/kernel.html). Isso significa que os contêineres são isolados usando componentes do kernel que não podem ser modificados de dentro do contêiner. 

---

### FLUXO DE TRABALHO AUTOMATIZADO

O fluxo de trabalho automatizado executado após um deploy de um aplicativo no OpenShift inclui o Kubernetes, o docker e o kernel do Linux. As interações e dependências se estendem por vários serviços, conforme descrito na imagem abaixo:

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/appco05.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/appco05.png#center)

O OpenShift trabalha com o Kubernetes para garantir que as solicitações dos usuários sejam atendidas e que os aplicativos sejam entregue. Como qualquer outro processo em execução em um servidor Linux, cada contêiner tem um identificador do processo (PID) no node da aplicação.

Você pode analisar como os contêineres isolam recursos de processo com namespaces do Linux testando o PID atual do contêiner `app-cli`. O Docker cria um conjunto exclusivo de namespaces para isolar os recursos em cada contêiner. A aplicação está vinculada aos namespaces porque elas são exclusivas para cada contêiner. O [Cgroups](https://en.wikipedia.org/wiki/Cgroups) e o [SELinux](https://en.wikipedia.org/wiki/Security-Enhanced_Linux) são configurados para incluir informações para um contêiner recém-criado, mas esses recursos do kernel Linux são compartilhados entre todos os contêineres em execução no node do aplicativo.

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

![https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/namespace-mount.png#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/master/post/images/namespace-mount.png#center)

Quando configuramos o OpenShift, especificamos um dispositivo de bloco para o docker a ser usado para armazenamento em contêiner. Sua configuração do OpenShift usa o gerenciamento de volume lógico [LVM]() neste dispositivo para armazenamento em contêiner. Cada contêiner recebe seu próprio volume lógico [LV]() quando é criado. Essa solução de armazenamento é rápida se adapta bem a grandes clusters em produção. Para visualizar todos os LVs criados pelo docker no seu host, execute o comando `lsblk`. O dispositivo LV que o contêiner _app-cli_ usa para armazenamento é registrado nas informações do `docker inspect`. Para obter o LV para seu contêiner _app-cli_, execute o seguinte comando: 

```bash
docker inspect -f '{{ .GraphDriver.Data.DeviceName }}' fae8e211e7a7
```

Você receberá um valor semelhante ao `docker-253: 1-10125-8bd64caed0421039e83ee4f1cdcbcf25708e3da97081d43a99b6d20a3eb09c98`. Esse é o nome do LV que está sendo usado como o sistema de arquivos _root_ do contêiner _app-cli_. O namespace _mount_ para os contêineres das suas aplicações é criado em um namespace de montagem diferente do sistema operacional do node. Quando o daemon do docker é iniciado, ele cria seu próprio namespace _mount_ para conter o conteúdo do sistema de arquivos para os contêineres que cria. Você pode confirmar isso executando `lsns` para o processo docker. Para obter o PID do processo docker principal, execute o seguinte comando `pgrep` (o processo `dockerd-current` é o nome do processo principal do daemon do docker):

```bash
# pgrep -f dockerd-current
```

Depois de ter o PID do daemon do docker, você pode usar o comando `lsns` para visualizar seus namespaces. Você pode também usar uma ferramenta de linha de comando chamada `nsenter` caso deseje inserir um namespace ativo para outro aplicativo. É uma ótima ferramenta para usar quando você precisa solucionar problemas de um contêiner que não está funcionando como deveria. Para usar o `nsenter`, você dá a ele um PID para o container com a opção `--target` e, em seguida, instrui-o a respeito de quais namespaces você deseja inserir para esse PID:

```bash
$ nsenter --target 2385
```

De dentro do namespace _mount_ do docker, a saída do comando `mount` inclui o ponto de montagem do sistema de arquivos root do app-cli. O LV que o docker criou para o app-cli é montado no node do aplicativo em `/var/lib/docker/devicemapper/mnt/8bd64cae...`. Vá para esse diretório enquanto estiver no namespace _mount_ do daemon do docker e você encontrará um diretório chamado _rootfs_. Este diretório é o sistema de arquivos da sua aplicação app-cli no contêiner:

```bash
# ls -al rootfs
-rw-r--r--. 	 1 root root 15759 Aug 1 17:24 anaconda-post.log
lrwxrwxrwx. 	 1 root root 7 Aug 1 17:23 bin -> usr/bin
drwxr-xr-x. 	 3 root root 18 Sep 14 22:18 boot
drwxr-xr-x. 	 4 root root 43 Sep 21 23:19 dev
drwxr-xr-x. 	53 root root 4096 Sep 21 23:19 etc
-rw-r--r--. 	 1 root root 7388 Sep 14 22:16 help.1
drwxr-xr-x. 	 2 root	root 6 Nov 5 2016 home
lrwxrwxrwx.      1 root root 7 Aug 1 17:23 lib -> usr/lib
lrwxrwxrwx. 	 1 root root 9 Aug 1 17:23 lib64 -> usr/lib64
drwx------. 	 2 root root 6 Aug 1 17:23 lost+found
drwxr-xr-x. 	 2 root root 6 Nov 5 2016 media
drwxr-xr-x.      2 root root 6 Nov 5 2016 mnt
drwxr-xr-x. 	 4 root root 32 Sep 14 22:05 opt
...
```

Entender como esse processo funciona e onde os artefatos são criados é importante quando você usa contêineres todos os dias. Do ponto de vista dos aplicativos em execução no contêiner app-cli, tudo o que está disponível para eles é o que está no diretório rootfs, porque o namespace _mount_ criado para o contêiner isola seu conteúdo. Entender como os namespaces _mount_ funcionam em um node e saber como inserir um namespace de contêiner manualmente é uma ferramenta inestimável para solucionar um problema de uma contêiner que não está funcionando como foi projetado. Por fim, ainda sobre o namespace _mount_ pressione `Ctrl+D` para sair dele e retornar ao namespace padrão do node. A seguir vamos conhecer o namespace _UTS_ .

---

### O NAMESPACE UTS

O namespace _UTS_ ou  _Unix time sharing_ permite que cada contêiner tenha seu próprio hostname e domain name. Mas não se engane, o namespace _UTS_ não tem nada a ver com o gerenciamento do relógio do sistema. O namespace _UTS_ é onde o hostname, o domain name e outras informações do sistema são retidos. Basicamente se você executar o comando `uname -a` em um servidor Linux para obter informações de hostname ou domain name, saiba que o namespace _UTS_ segue basicamente a mesma estrutura de dados. Para obter o valor do hostname de um contêiner em execução, digite o comando `docker exec` com o ID do contêiner e o mesmo comando do nome do host que você deseja executar no contêiner. O hostname de cada contêiner do OpenShift é o nome do seu pod:

```bash
# docker exec fae8e211e7a7 hostname
```

Se você escalar a sua aplicação, o container em cada pod terá um hostname único também. Para confirmar que cada contêiner possui um hostname exclusivo, efetue login no seu cluster como seu usuário desenvolvedor:

```bash
oc login -u developer -p developer https://ocp1.192.168.100.1.nip.io:8443
```

A ferramenta de linha de comando `oc` tem uma funcionalidade semelhante ao `docker exec`. Em vez de passar o ID para o contêiner, no entanto, você pode passar o pod no qual deseja executar o comando. Depois de efetuar login no seu cliente oc, dimensione sua aplicação para dois pods com o seguinte comando:

```bash
oc scale dc/app-cli --replicas=2
```

Isso causará uma atualização no deployment config da aplicação e acionará a criação de um novo pod. Você pode obter o nome do novo grupo executando o comando `oc get pods --show-all=false`. A opção `--show-all=false` impede a saída de pods em um estado Concluído, portanto, você vê apenas pods ativos na saída:

```bash
$ oc get pods --show-all=false
```

Para obter o hostname de seu novo pod, use o comando `oc exec`. É semelhante ao `docker exec`, mas, em vez do ID de um contêiner, você usa o nome do pod para especificar onde deseja que o comando seja executado. O hostname do novo pod corresponde ao nome do pod, assim como o seu pod original:

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

Agora que você pode acompanhar um pouco sobre namespaces no OpenShift, nos próximos capítulos irei abordar sobre os services, como testar uma aplicação uma aplicação resiliente, compreender melhor o replication controller, labels e seletores, como escalar aplicações com auto-scaling e metrics, como configurar um storage persistente com nfs e lvm, operações de segurança com SElinux, quotas, cgroups, e compreender melhor sobre HAPROXY. Por fim, irei concluir este artigo com a integração de tudo isso ao Jenkins.

---

### Referências

* OpenShift in Action - [https://www.manning.com/books/openshift-in-action](https://www.manning.com/books/openshift-in-action)
* Kubernetes in Action - [https://www.manning.com/books/kubernetes-in-action](https://www.manning.com/books/kubernetes-in-action)
* Docker in Practice, Second Edition - [https://www.manning.com/books/docker-in-practice-second-edition](https://www.manning.com/books/docker-in-practice-second-edition)
* GO in Action - [https://www.manning.com/books/go-in-action](https://www.manning.com/books/go-in-action)
* Go Web Programming - [https://www.manning.com/books/go-web-programming](https://www.manning.com/books/go-web-programming)
