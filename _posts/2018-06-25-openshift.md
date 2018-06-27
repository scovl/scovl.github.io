---
layout: post
title: OpenShift 
snip:  Arrumando a casa
tags: openshift fedora
---

> Este é um material que fora elaborado com o propósito de compreender melhor o funcionamento do OpenShift, e de plataformas agregadas. Se houver por minha parte alguma informação errada, por favor, entre em contato ou me mande um pull request no github. As referências usadas para o estudo além da experiência prática, estarão no rodapé da página. Artigo em constante atualização e revisão.

---

#### CAPÍTULO 1 - O CONCEITO

*   **[Breve introdução](#breve-introducao)**
*   **[Plataforma em contêineres](#plataforma-em-conteineres)**
*   **[Casos de Uso](#casos-de-uso)**
*   **[Escalonando Aplicações](#escalonando-aplicacoes)**

#### CAPÍTULO 2 - GETTING STARTED

* **[Instalando o OpenShift](#instalando-o-openshift)**
* **[Configurando o ambiente](#configurando-o-ambiente)**
* **[Instalando ferramentas no servidor master](#instalando-ferramentas-no-servidor-principal)**

#### CAPÍTULO 3 - WIP
* **[Acessando seu cluster e efetuando login](#acessando-seu-cluster-e-efetuando-login)**
* **[Criando projetos e implementando aplicativos](#criando-projetos-e-implementando-aplicativos)**
* **[Acessando sua aplicação criando rotas](#acessando-sua-aplicacao-criando-rotas)**
* **[Investigando componentes da aplicação](#investigando-componentes-da-aplicacao)**
* **[Comparando linha de comando com fluxo de trabalho web](#comparando-linha-de-comando-com-fluxo-de-trabalho-web)**


---

### BREVE INTRODUCAO

Devido ao crescimento da demanda por máquinas virtuais e grande dificuldade na operação desse ambiente, surgiu a necessidade de melhorar esse modelo. Com isso empresas que buscam melhores soluções para administradores de sistemas, e desenvolvedores tanto do meio corporativo, quanto da própria comunidade, perceberam que não havia a necessidade de recriar um sistema complexo bastando apenas reutilizar alguns recursos da própria arquitetura e engenharia do kernel Linux. 

Lançando mão de uma funcionalidade nativa do Kernel Linux para facilitar a criação e gestão destes ambientes virtuais, eles conseguiram ótimos resultados. Assim surgiu o **[LXC](https://en.wikipedia.org/wiki/LXC)**.

![https://i.imgur.com/ycHhkfb.png](https://i.imgur.com/ycHhkfb.png)

O Linux Container ou **[LXC](https://en.wikipedia.org/wiki/LXC)** como é mais conhecido, foi lançado em 2008 e é uma tecnologia que permite a criação de múltiplas instâncias isoladas de um determinado Sistema Operacional dentro de um único host. É uma maneira de virtualizar aplicações dentro de um servidor Linux. O conceito é simples e antigo sendo o comando **[chroot](https://en.wikipedia.org/wiki/Chroot)** seu precursor mais famoso que foi lançado em 1979 pelo **[Unix V7](https://en.wikipedia.org/wiki/Version_7_Unix)** com o intuito de segregar acessos a diretórios e evitar que o usuário pudesse ter acesso à estrutura raiz (“/” ou root). Esse conceito evoluiu alguns anos mais tarde com o lançamento do **[jail](https://www.freebsd.org/cgi/man.cgi?query=jail&amp;sektion=8&amp;manpath=freebsd-release-ports)**, no sistema operacional FreeBSD 4.

Essa implementação já introduzia a ideia de segregação de rede e limitação dos acessos de superusuários aos processos que passou a ser adotada com maiores funcionalidades pelas distribuições Linux. Posteriormente foi melhor definido em alguns sistemas como o **[AIX WPAR](https://en.wikipedia.org/wiki/Workload_Partitions)** e o **[Solaris Containers](https://en.wikipedia.org/wiki/Solaris_Containers)**. Nesses dois sistemas já havia o conceito de virtualização de sistema operacional, mas não o conceito de contêineres.

Nas distribuições Linux o chroot era uma maneira fácil de criar uma jail para as conexões dos servidores FTP, mas acabou ficando mais conhecido pela sua vulnerabilidade do que pela sua segurança. Mais tarde o chroot acabou ajudando a cunhar um termo **[jailbreak](https://pt.wikipedia.org/wiki/Jailbreak_(iOS))**.

A grande diferença entre o chroot e o LXC é o nível de segurança que se pode alcançar. Com relação à virtualização, a diferença está no fato do LXC não necessitar de uma camada de sistema operacional para cada aplicação. Ao comparar com a virtualização tradicional, fica mais claro que uma aplicação sendo executada em um LXC demanda muito menos recursos, consumindo menos espaço em disco, e com um nível de portabilidade difícil de ser alcançado por outras plataformas.

Mas não foi só a adoção de desenvolvedores e administradores de sistemas que tornou essa tecnologia tão popular. A consolidação da virtualização no mercado e a crescente demanda por computação em nuvem criaram o ambiente perfeito para o LXC se espalhar rapidamente. Aplicações podem ser portadas direto do laptop do desenvolvedor, para o servidor de produção, ou ainda para uma instância virtual em uma nuvem pública ou privada.

![https://i.imgur.com/6zqz4UI.png](https://i.imgur.com/6zqz4UI.png)

Hoje um dos mais conhecidos LXC’s do mercado é o **[Docker](https://pt.wikipedia.org/wiki/Docker_(programa))**, escrito em **[GO](https://golang.org/)**, que nasceu como um projeto open source da **[DotCloud](https://cloud.docker.com/)**, uma empresa de **[PaaS (Platform as a Service)](https://pt.wikipedia.org/wiki/Plataforma_como_servi%C3%A7o)** que apesar de estar mais interessada em utilizar LXC apenas em suas aplicações, acabou desenvolvendo um produto que foi muito bem aceito pelo mercado.

Do ponto de vista de desenvolvimento, o Docker por sí atendeu muito bem em vários quesitos. No entanto, com a crescente demanda e necessidade de entregar mais resultados em menos tempo, surgiu também a necessidade de extender as funcionalidades do Docker. Surgiu então ferramentas de orquestração de contêineres como Kubernetes e posteriormente potencializadores do próprio Kubernetes como é o caso do OpenShift.

---

### PLATAFORMA EM CONTEINERES

**O que é uma plataforma de contêineres?**

Trata-se de uma plataforma que usa contêineres para gerar build, deploy, servir e orquestrar os aplicativos em execução dentro dele. Os contêineres contém todas as bibliotecas e códigos necessários para que as aplicações funcionem adequadamente e de maneira isolada. Existem basicamente, cinco tipos de recursos são isolados em contêineres. São eles:

*   Sistemas de arquivos montados.
*   Recursos de memória compartilhada.
*   Nome do host e nome de domínio.
*   Recursos de rede (endereço IP, endereço MAC, buffers de memória).
*   Contadores de processo.

Embora o docker engine gerencie contêineres facilitando os recursos do kernel do Linux, ele é limitado a um único sistema operacional no host. Para orquestrar contêineres em vários servidores com eficiência, é necessário usar um mecanismo de orquestração de contêineres. Isto é, um aplicativo que gerencia contêineres em tempo de execução em um cluster de hosts para fornecer uma plataforma de aplicativo escalonável.

Existem alguns orquestradores conhecidos na comunidade e no mercado como o Rancher, Heroku, Apache Mesos, Docker Swarm, Kubernetes e o OpenShift. O **[OpenShift](https://www.openshift.com/)** usa o **[Kubernetes](https://kubernetes.io)** como seu mecanismo de orquestração de contêineres. O Kubernetes é um projeto de código aberto que foi iniciado pelo Google. Em 2015, foi doado para a **[Cloud Native Computing Foundation](http://www.cncf.io)**.

O Kubernetes emprega uma arquitetura master/node. Os servidores master do Kubernetes mantêm as informações sobre o cluster de servidores e os nodes executam as cargas de trabalho reais do aplicativo. A grande vantagem de usar o OpenShift ao invés de seu concorrente Heroku, é que o OpenShift é gratuito, de código aberto, e roda tanto em rede pública, quanto em rede privada. O Heroku roda em plataforma fechada e somente em redes públicas. A baixo uma visão geral da arquitetura do Kubernetes:

![https://i.imgur.com/2wzeZJt.png](https://i.imgur.com/2wzeZJt.png)

Para tirar proveito de todo o potencial de uma plataforma de contêiner como o Kubernetes, é necessário alguns componentes adicionais. O OpenShift usa o docker e o Kubernetes como ponto de partida e adiciona mais algumas ferramentas para proporcionar uma melhor experiência aos usuários. O OpenShift usa a arquitetura master/node do Kubernetes e partir daí, se expande para fornecer serviços adicionais.

Em uma plataforma de contêiner como o OpenShift, as imagens são criadas quando ocorre o deploy das aplicações, ou quando as imagens são atualizadas. Para ser eficaz, as imagens devem estar disponíveis rapidamente em todos os nodes em um cluster. Para tornar isto possível, o OpenShift inclui um registro de imagens integrado como parte de sua configuração padrão. O registro de imagem é um local central que pode servir imagens dos contêineres para vários locais (tipo um **[DockerHub](https://hub.docker.com/)** local).

No Kubernetes, os contêineres são criados nos nodes usando componentes chamados **pods**. Os pods são a menor unidade dentro de um cluster Kubernetes e nada mais é do que containers rodando dentro do seu cluster. Quando um aplicativo consiste em mais de um pods, o acesso ao aplicativo é gerenciado por meio de um componente chamado service. 

Um service é um proxy que conecta vários pods e os mapeia para um endereço IP em um ou mais nodes no cluster. Os endereços IP podem ser difíceis de gerenciar e compartilhar, especialmente quando estão por trás de um firewall. O OpenShift ajuda a resolver esse problema fornecendo uma camada de roteamento integrada. A camada de roteamento é um software balanceador de carga.

Quando é feito um deploy de uma aplicação no OpenShift, um registro DNS é criado automaticamente para ele. Esse registro DNS é adicionado ao balanceador de carga, e o balanceador de carga faz interface com o serviço Kubernetes para lidar eficientemente com as conexões entre o deploy da aplicação e seus usuários. Dessa forma, não interessa saber o IP do pod uma vez que quando o container for derrubado e subir outro contêiner para substituí-lo, haverá outro IP em seu lugar.

Nesse caso o registro DNS que fora criado automaticamente será nosso mapeamento de rede daquela respectiva aplicação. Com as aplicações sendo executadas em pods em vários nodes e solicitações de gerenciamento vindas do node master, há bastante comunicação entre os servidores em um cluster do OpenShift. Assim, você precisa ter certeza de que o tráfego está corretamente criptografado e que poderá separar quando necessário. Visão geral da arquitetura OpenShift:

![https://i.imgur.com/o3uoJ12.png](https://i.imgur.com/o3uoJ12.png)

O OpenShift usa uma solução de rede definida por software **[SDN](https://pt.wikipedia.org/wiki/Software_defined_networking)** para criptografar e modelar o tráfego de rede em um cluster. O OpenShift SDN, é uma solução que usa o **[Open vSwitch](http://openvswitch.org)** e outras tecnologias software livre, que são configuradas por padrão quando o OpenShift é implementado. Outras soluções SDN também são suportadas.

O OpenShift possui fluxos de trabalho projetados para ajudá-lo a gerenciar seus aplicativos em todas as fases de seu ciclo de vida:

*   **Build**

	* A principal maneira de criar aplicativos no OpenShift é usando `build image`. Esse processo é o fluxo de trabalho padrão.

*   **Deployment**

	* No fluxo de trabalho padrão no OpenShift, o deployment da aplicação é acionado automaticamente depois que a imagem do contêiner é criado e disponibilizado. O processo de deployment usa a imagem do aplicativo recém criado e a implanta em um ou mais nodes. Além dos pods dos aplicativos, um serviço é criado, junto com uma rota de DNS na camada de roteamento.

![https://i.imgur.com/tl53ec9.png](https://i.imgur.com/tl53ec9.png)

*   **Upgrade**

	* Os usuários podem acessar o aplicativo recém-criado através da camada de roteamento após todos os componentes terem sido implantados. As atualizações de aplicativos usam o mesmo fluxo de trabalho. Quando um upgrade é acionado, uma nova imagem de contêiner é criada e a nova versão do aplicativo é implantada. Vários processos de atualização estarão disponíveis. A baixo a visão geral do processo de deploy da aplicação:![https://i.imgur.com/aGhInY5.png](https://i.imgur.com/aGhInY5.png)

É assim que o OpenShift funciona em alto nível. Para obter uma lista mais abrangente de como o OpenShift se integra e
expande as funcionalidades do Kubernetes, visite **[www.openshift.com/container-platform/kubernetes.html](http://www.openshift.com/container-platform/kubernetes.html)**.

*   Retirement (fim do ciclo de vida).

---

### CASOS DE USO

Se parar-mos para refletir um pouco sobre tecnologias que vieram com a proposta de isolar processos e serviços como os mainframes, e a revolução da virtualização onde várias máquinas virtuais podem ser executadas em um único servidor físico, podemos compreender melhor o rumo em que as tecnologias hoje tem avançado.

Por exemplo, com máquinas virtuais, cada processo é isolado em sua própria máquina virtual. Como cada máquina virtual possui um sistema operacional completo e um kernel completo, ele deve ter todos os sistemas de arquivos necessários para um sistema operacional completo. Isso também significa que ele deve ser corrigido, gerenciado e tratado como uma infraestrutura tradicional. Contêineres são o próximo passo nessa evolução. Um contêiner contém tudo o que a aplicação precisa para rodar com sucesso. Como por exemplo:

*   Código-fonte ou o código compilado
*   Bibliotecas e aplicativos necessários para rodar corretamente
*   Configurações e informações sobre como conectar-se a fontes de dados compartilhadas

Máquinas virtuais podem ser usadas para isolamento do processo:

![https://i.imgur.com/FsyZT7m.png](https://i.imgur.com/FsyZT7m.png)

Casos de uso para plataformas que trabalham com contêineres:

![https://i.imgur.com/MTIhnmV.png](https://i.imgur.com/MTIhnmV.png)

Os contêineres usam um único kernel para servir aplicações economizando espaço, e recursos e fornecendo plataformas de aplicações flexíveis. No entanto, é bom frizar que **o que os contêineres não contêm, é igualmente importante**. Ao contrário das máquinas virtuais, todos os contêineres são executados em um único kernel Linux compartilhado. 

Para isolar os aplicativos, os contêineres usam componentes dentro do kernel. Como os contêineres não precisam incluir um kernel completo para atender a aplicação a ser implementada, além de todas as dependências de um sistema operacional, eles tendem a ser muito menores do que as máquinas virtuais, tanto em suas necessidades de armazenamento, quanto no consumo de recursos.

Por exemplo, enquanto uma máquina virtual típica você poderá começar com um storage de 10 GB mais ou menos, a imagem do contêiner do CentOS 7 é de 140 MB (do Alpine Linux é ainda menor). Ser menor vem com algumas vantagens: Primeiro, a portabilidade é aprimorada. Mover 140 MB de um servidor para outro é muito mais rápido do que mover 10 GB ou mais. Em segundo lugar, iniciar um contêiner não inclui a inicialização de um kernel inteiro, o processo de inicialização é muito mais rápido. Iniciar um contêiner é normalmente medido em milissegundos, ao contrário de segundos ou minutos para máquinas virtuais.

As tecnologias por trás dos contêineres fornecem vários benefícios técnicos. Eles também oferecem vantagens comerciais. Soluções empresariais modernas devem incluir economia de tempo ou recursos como parte de seu design. Se você comparar um servidor que usa máquinas virtuais para isolar processos com um que usa contêineres para fazer o mesmo, notará algumas diferenças fundamentais:

*   Os contêineres consomem os recursos do servidor com mais eficiência. Como há um único kernel compartilhado para todos os contêineres em um host, em vez de vários kernels virtualizados, como em máquinas virtuais, mais recursos do servidor são usados para fornecer aplicações, em vez de haver sobrecarga na plataforma.
*   A densidade da aplicação aumenta com os contêineres. Como a unidade básica usada para efetuar o deploy da aplicação (imagens de contêiner) é muito menor que a unidade para máquinas virtuais (imagens de máquina virtual), mais aplicativos podem caber por servidor. Isso significa que mais aplicações exigem menos servidores para serem executados.

Comparando máquinas virtuais e contêineres, podemos ver, por exemplo, que os contêineres fornecem uma melhor utilização dos recursos do servidor:

![https://i.imgur.com/IP1wCV7.png](https://i.imgur.com/IP1wCV7.png)

No entanto, mesmo que os contêineres sejam ótimas ferramentas, nem sempre são a melhor ferramenta para todos os trabalhos. Por exemplo, se você tiver um aplicativo legado complexo, tenha cuidado ao decidir dividi-lo e convertê-lo em uma série de contêineres. Se a aplicação em questão trata-se de um modelo monolítico muito grande, e com diversos recursos, com um banco de dados relacional enorme, e esta aplicação fizer parte de todo um ecossistema de outras aplicações onde compartilha recursos, executa-lo em um contêiner não fará muito sentido e poderá ser um desafio bastante cansativo de tentar implementa-lo em contêineres.

Os contêineres são uma tecnologia revolucionária, **mas não fazem tudo por conta própria**. O armazenamento é uma área em que os contêineres precisam ser configurados com outras soluções para efetuar deploys em produção, por exemplo. Isso ocorre porque o armazenamento criado quando um contêiner é levantado, é efêmero. Isto é, se um contêiner for destruído ou substituído, o armazenamento de dentro desse contêiner não será reutilizado.

Isso é proposital e ocorre por design para permitir que os contêineres estejam sempre stateless por padrão. Isto é, se algo der errado, um container pode ser removido completamente do seu ambiente, e um novo pode ser colocado para substituí-lo quase que instantaneamente. Em outras palavras, **contêineres foram feitos para morrer**. A idéia de um contêiner stateless é ótima. Mas em algum lugar em sua aplicação, geralmente em vários lugares, os dados precisam ser compartilhados em vários contêineres, e o estado do serviço precisa ser preservado. Aqui estão alguns exemplos dessas situações:

*   Dados compartilhados que precisam estar disponíveis em vários contêineres, como imagens carregadas para um aplicativo da web.
*   Informações do estado do usuário em um aplicativo complexo, que permite que os usuários continuem de onde pararam durante uma transação de longa duração.
*   Informações armazenadas em bancos de dados relacionais ou não relacionais.

Em todas essas situações e muitas outras, você precisa ter **armazenamento persistente disponível em seus contêineres**. Esse armazenamento deve ser definido como parte do deploy da sua aplicação e deve estar disponível em todos os nodes do cluster no OpenShift. Felizmente, o OpenShift tem várias maneiras de resolver esse problema. Quando você consegue integrar efetivamente o armazenamento compartilhado aos contêineres da sua aplicação, poderá pensar em escalabilidade.

---

### ESCALONANDO APLICACOES

Para aplicações stateless, escalar para cima e para baixo é simples. Como não há dependências além do que está no contêiner e como as transações que acontecem no contêiner são atômicas por design, tudo o que você precisa fazer para dimensionar uma aplicação stateless, é implantar mais instâncias dele e equilibrá-las. Para tornar esse processo ainda mais fácil, o OpenShift faz o proxy das conexões para cada aplicativo por meio de um balanceador de carga integrado. Isso permite que os aplicativos aumentem e diminuam o escalonamento sem alteração na maneira como os usuários se conectam a aplicação.

Se seus aplicativos forem stateful, o que significa que eles precisam armazenar ou recuperar dados compartilhados, como um banco de dados ou dados que um usuário carregou, então você precisará fornecer armazenamento persistente para eles. Esse armazenamento precisa ser ampliado e reduzido automaticamente em suas aplicações no OpenShift. Para aplicações com informações de estado, o armazenamento persistente é um componente-chave que deve ser totalmente integrado ao seu design.

À medida que você começa a separar os aplicativos tradicionais e monolíticos em serviços menores que funcionam de forma eficaz em contêineres, você começará a visualizar suas necessidades de dados de uma maneira diferente. Esse processo é geralmente chamado de design de aplicativos como microsserviços. Integrando aplicativos stateful e stateless:

![https://i.imgur.com/cG69vhp.png](https://i.imgur.com/cG69vhp.png)

O OpenShift pode integrar e gerenciar plataformas de armazenamento externo e garantir que o volume de armazenamento de melhor ajuste seja correspondido com os aplicativos que precisam dele. Para qualquer aplicação, você terá serviços que precisam ser informativos e outros sem estado. Por exemplo, o serviço que fornece conteúdo da web estático pode ser sem estado, enquanto o serviço que processa a autenticação do usuário precisa poder gravar informações no armazenamento persistente.

Como cada serviço é executado em seu próprio contêiner, os serviços podem ser ampliados e desativados independentemente. Em vez de precisar ampliar toda a sua base de código, com os contêineres, você dimensiona apenas os serviços em seu aplicativo que precisam processar cargas de trabalho adicionais. Além disso, como apenas os contêineres que precisam de acesso ao armazenamento persistente o contêm, os dados que entram no contêiner são mais seguros.

No exemplo abaixo, se houvesse uma vulnerabilidade no serviço B, um processo comprometido teria dificuldade em obter acesso aos dados armazenados no armazenamento persistente. Ilustrandoas diferenças entre aplicativos tradicionais e de microsserviço: os aplicativos de microsserviço escalonam seus componentes de forma independente, criando melhor desempenho e utilização de recursos:

![https://i.imgur.com/8sPOhGu.png](https://i.imgur.com/8sPOhGu.png)

Isso nos leva ao fim do nosso passo inicial inicial do OpenShift e como ele implementa, gerencia e orquestra os aplicativos implantados com contêineres usando o docker e o Kubernetes. Osbenefícios fornecidos pelo OpenShift economizam tempo para humanos e usam os recursos do servidor com mais eficiência. Além disso, a natureza de como os contêineres funcionam oferece melhor escalabilidade e velocidade de implantação em relação às implantações de máquinas virtuais.

---

#### INSTALANDO O OPENSHIFT

Para este artigo, usarei a distribuição GNU/Linux Centos 7. Ele pode ser executado em servidores físicos, máquinas virtuais (VMs) ou VMs em uma nuvem pública, como o Amazon Web Services (AWS) EC2 ou Google Cloud. Essa instalação deve levar aproximadamente uma hora, dependendo da velocidade da sua conexão com a Internet.

Na maior parte do tempo configurando o OpenShift, darei ênfase à linha de comando para controlar o cluster. Para instalar o `oc`, você precisará ser super usuário, ou ter acesso ao **root**. Para compreender melhor do que se trata o comando `oc`, recomendo acessar **[https://github.com/openshift/origin/blob/master/docs/cli.md](https://github.com/openshift/origin/blob/master/docs/cli.md)** documentação completa do comando `oc`. A configuração padrão do OpenShift usa a porta **TCP 8443** para acessar a API, e a interface Web. Acessaremos o servidor master nessa porta.

Para garantir que o cluster possa se comunicar adequadamente, várias portas TCP e UDP precisam estar abertas no master e nos nodes. Você poderá encontrar mais detalhes em **[https://docs.openshift.org/3.6/install_config/install/prerequisites.html#required-ports](https://docs.openshift.org/3.6/install_config/install/prerequisites.html#required-ports)**. Em nosso caso, faremos isto de maneira mais simples. Por exemplo, caso você esteja criando este ambiente uma rede isolada, como em seu laptop, poderá deixar todas as portas abertas. Ou se preferir, abaixo uma lista de portas que usaremos inicialmente:

![https://i.imgur.com/SH20A4i.png](https://i.imgur.com/SH20A4i.png)

No OpenShift, os hostnames para todos os nodes devem ter um registro DNS. Isso permite que o tráfego criptografado rede entre os nodes funcione corretamente. Basicamente você precisará configurar um **[registro DNS curinga](https://tools.ietf.org/html/rfc4592)** que apontará para o seu cluster afim de acessar os aplicativos que você implementar futuramente.

Se você já tem um servidor DNS já resolve a questão. Caso contrário, você poderá usar o domínio **[nip.io](nip.io)**.

> NOTA: Se você tem experiência com servidores Linux, poderá estar se perguntando: "Por que não posso simplesmente usar o arquivo `/etc/hosts` para este fim? A resposta é bem simples: esta configuração só funcionaria bem em um host pois não há propagação do DNS na rede. Serviria bem para um Minishift por exemplo. Mas para clusters distribuídos, o melhor é ter um DNS propagado.

O domínio **[nip.io](http://nip.io/)** quebra um galho enorme neste aspecto. Em vez de configurar e gerenciar um servidor DNS, você poderá criar registros DNS que resolvam qualquer endereço IP escolhido. 

A única desvantagem do **[nip.io](http://nip.io/)** em comparação ao um servidor DNS próprio, é que você dependerá do acesso á Internet. O único requisito para nossa instalação, no entanto, é que todos os seus servidores possam acessar um servidor DNS público. Como tenho que escolher qual DNS usarei para este artigo, então, escolhi usar o **[nip.io](http://nip.io/)**.  A baixo, um exemplo do que poderemos configurar como modelo:

![https://i.imgur.com/LKIgIoQ.png](https://i.imgur.com/LKIgIoQ.png)

O CentOS 7 com o OpenShift terá endereço IP estático para garantir que o DNS e os hostnames configurados funcionem de maneira consistente. Se você não usasse endereço IP estático, seria necessário gerenciar um servidor DHCP em seu ambiente o que de todo modo não é uma boa prática.

> NOTA: O servidor DNS que estamos usando é o 8.8.8.8, que é um dos servidores DNS públicos do Google. Você pode usar qualquer servidor DNS que desejar, mas, para funcionar, ele deve resolver consultas DNS públicas para o domínio nip.io. 

Consulte os **[requisitos oficiais de hardware](https://docs.openshift.org/3.6/install_config/install/prerequisites.html#system-requirements)** para a instalação do OpenShift Origin. Eles são baseados na premissa de que você montará um cluster grande em produção. Em nosso caso, vamos testar algo menor:

![https://i.imgur.com/qAChvCm.png](https://i.imgur.com/qAChvCm.png)


Agora como já vimos como preparar o ambiente, vamos à primeira etapa de instalação do OpenShift. Primeiro, vamos instalar o repositório **[Extra Packages for Enterprise Linux - EPEL]()** e em seguida o OpenShift Origin. Para tal, execute o seguinte comando:

{% highlight bash %}
sudo yum -y install epel-release centos-release-openshift-origin36
{% endhighlight %}

Em seguida, alguns pacotes adicionais:

{% highlight bash %}
sudo yum -y install origin origin-clients vim-enhanced atomic-openshift-utils 
{% endhighlight %}

Agora o NetworkManager e o certificado:

{% highlight bash %}
sudo yum -y install NetworkManager python-rhsm-certificates
{% endhighlight %}

Com esses pacotes instalados, precisaremos iniciar o NetworkManager pois o OpenShift usa o NetworkManager para gerenciar as configurações de rede de todos os servidores no cluster:

{% highlight bash %}
sudo systemctl enable NetworkManager --now
{% endhighlight %}

Posso dizer que a partir daquí já temos o OpenShift Origin instalado no servidor. No entanto, é necessário mais alguns passos afim de deixa-lo de fato "redondo". Como por exemplo, temos que configurar a resolução do DNS nos dois servidores, precisamos preparar o servidor master, configurar o contêiner responsável pelo armazenamento de dados da aplicação, ativar e iniciar o docker nos nodes do OpenShift, e configurar o SELinux. Ou seja, bastante trabalho pela frente.

---

#### CONFIGURANDO O AMBIENTE

Como o DNS é usado pelo OpenShift para tudo, desde o tráfego criptografado até a comunicação entre os serviços implementados, a configuração do DNS nos nodes é essencial. 

> NOTA: Estas etapas se aplicam somente se você estiver usando o **[nip.io]()** para seus hostnames.

Vamos então editar o  client DNS do CentOs através do arquivo `/etc/resolv.conf`, que foi gerado quando instalamos o NetworkManager. O parâmetro `nameserver` se refere ao servidor DNS do qual seu servidor irá se conectar. Você pode ter até três parâmetros `nameserver` listados no resolv.conf. 

O outro parâmetro padrão do `resolv.conf`, é o `search`. O valor do `search` é usado para qualquer consulta no DNS que não seja FQDN. Isto é, nome de domínio completo. Os FQDNs são registros DNS completos - isso significa que um FQDN contém um hostname, e um domínio de nível superior.

Caso não esteja familiarizado com a abreviação FQDN,  acesse **[https://wikibase.adentrocloud.com.br/index.php?rp=/knowledgebase/63/Fully-Qualified-Domain-Name-FQDN-e-Hostname.html](https://wikibase.adentrocloud.com.br/index.php?rp=/knowledgebase/63/Fully-Qualified-Domain-Name-FQDN-e-Hostname.html)** para saber mais.

Usando o domínio **[nip.io]()**, perceba que cada octeto no endereço IP é separado por um período. Isso significa que cada número no endereço IP é um nível no domínio sendo o **[nip.io]()** de nível superior. Devido a algumas configurações que o OpenShift adiciona a cada contêiner, isso pode causar confusão ao extrair imagens de nosso **[registro intergrado]()**. Sendo assim, o recomendado é editar o parâmetro `search` para ter apenas o domínio de nível superior (no caso, **[nip.io]()**), conforme mostrado seguir:

Editando o `/etc/resolv.conf`:
{% highlight bash %}
# Generated by NetworkManager
search nip.io
nameserver 8.8.8.8
{% endhighlight %}

Esta configuração, no entanto, só permanecerá assim até você reiniciar os servidores. Isso ocorre porque o NetworkManager controla o `/etc/resolv.conf` e naturalmente adicionará ao parâmetro `search` que retornará o valor anterior à reset da máquina. Para impedir que isso aconteça, você precisa configurar o NetworkManager para não fazer mais alterações no `/etc/resolv.conf`. No CentOS 7, o arquivo de configuração do NetworkManager está localizado em `/etc/NetworkManager/NetworkManager.conf`.

Exemplo do `/etc/NetworkManager/NetworkManager.conf` padrão:

{% highlight bash %}
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
{% endhighlight %}

Você precisa adicionar uma linha à seção `[main]` para que o NetworkManager não altere o arquivo `/etc/resolv.conf`. Desta maneira:


{% highlight bash %}
[main]
plugins=ifcfg-rh
dns=none
{% endhighlight %}

Depois que você reiniciar o NetworkManager, a alteração feita no `/etc/resolv.conf` persistirá nas reinicializações do servidor. Para reiniciar o NetworkManager, execute o seguinte comando systemctl:

{% highlight bash %}
sudo systemctl restart NetworkManager
{% endhighlight %}

Depois de concluído, confirme se o NetworkManager está sendo executado usando o status do systemctl:

{% highlight bash %}
systemctl status NetworkManager
? NetworkManager.service - Network Manager
Loaded: loaded (/usr/lib/systemd/system/NetworkManager.service; enabled;
➥ vendor preset: enabled)
Active: active (running) Because Sat 2017-05-13 17:05:12 EDT; 6s ago
...
{% endhighlight %}

Pós reiniciar o NetworkManager, confira se de fato o arquivo `/etc/resolv.conf` foi alterado. Se não houver o parâmetro `search`, tudo estará como deveria, e você estará pronto para seguir em frente. Agora vamos configurar um software específico para os servidores master e o node.


<div>
<style media="screen" type="text/css">

pre.att {
    font-size: 1em;
    line-height: 1.5em;
    font-family: "Courier New",Courier,monospace;
    overflow: auto;
    width: 100%;
    position: relative;
    background: #eee;
    padding: .75em;
    margin: 1.5em 0 1.5em 0;
    -moz-border-radius: .3em;
    -webkit-border-radius: .3em;
    border-radius: .3em;
    white-space: pre-wrap;
    border-radius: 8px;
    text-align: justify;
}
</style>

<pre class="att">
<strong>PARA SABER MAIS ----------- </strong> 
<strong>Uma visão mais aprofundada dos subdomínios curinga e do OpenShift:</strong>

O domínio usar precisará apontar para o servidor do node. Isso ocorre porque o OpenShift usa o <strong><a href="">HAProxy</a></strong> para rotear o tráfego corretamente entre seu DNS, e os contêineres apropriados. O <strong><a href="">HAProxy</a></strong> é um balanceador de carga popular, software livre. No OpenShift, ele é executado em um contêiner e em um host específico em seu cluster.

Tratando-se de DNS, ter um domínio curinga significa que qualquer host desse domínio apontará automaticamente para o mesmo endereço IP. Vamos ver alguns exemplos. Primeiro, aqui está um domínio curinga real que configuramos em um domínio:

$ dig +short *.apps.jeduncan.com
12.207.21.2

Observe que se você procurar qualquer outro registro terminado em .apps.jeduncan.com, e ele retornará o mesmo IP:

$ dig +short app1.apps.jeduncan.com
12.207.21.2

ou

$ dig +short someother.apps.jeduncan.com
12.207.21.2

O OpenShift usa a mesma lógica. Cada aplicativo um DNS que é membro do domínio curinga criado. Dessa forma, todas as entradas do DNS para seus aplicativos funcionam sem qualquer configuração adicional.
</pre>
</div>

---

#### INSTALANDO FERRAMENTAS NO SERVIDOR MASTER

---

### WIP - Continua...

#### ACESSANDO SEU CLUSTER E EFETUANDO LOGIN

Existem três maneiras de interagir com o OpenShift: por linha de comando, por interface web e pela **[API RESTful]()**. Quase todas as ações no OpenShift podem ser realizadas usando os três métodos de acesso. 

Antes de começar a usar o OpenShift de fato, é importar ressaltar que existe uma maneira mais fácil de testar esta tecnologia usando o **[Minishift](https://github.com/minishift/minishift)** que funciona **[all in one]()**. Isto é, tudo em uma coisa só. Para desenvolvimento é ótimo pois você conseguirá levantar o ambiente com bastante praticidade em uma máquina virtual simples, rodando em seu laptop. No entanto, se o seu objetivo for mais refinado, certamente que terá problemas quando começar a trabalhar com armazenamento persistente, métricas, deployments complexos de aplicativos e redes. 

Montar um ambiente do zero é um aprendizado bastante rico e te encorajo a faze-lo. Para facilitar um pouco mais na montagem dos ambientes, irei compartilhar a maneira automatizada de montagem de um ambiente OpenShifit usando o **[Ansible]()** para obter o mesmo resultado.

No OpenShift, toda ação requer autenticação. Isso permite que todas as ações sejam regidas pelas regras de segurança e acesso configuradas para todos os usuários em um cluster. Por padrão, a configuração inicial do OpenShift é definida para permitir que qualquer combinação de usuário e senha combinação para efetuar login. 

Esta configuração inicial é chamada de **[Allow All identity provider]()**. Isto é, cada nome de usuário é exclusivo e a senha pode ser qualquer coisa, exceto um campo vazio. Essa configuração é segura e recomendada apenas para configurações para estudo de implementação (nosso caso). 

O primeiro usuário que você criar será chamado **fulano**. Este usuário representará um usuário final do OpenShift. 


> NOTA: Este método de autenticação é sensível a maiúsculas e minúsculas. Embora as senhas possam ser qualquer coisa, fulano e Fulano são usuários diferentes.


Usando a linha de comando, execute o comando `oc login`, usando **fulano** para o nome de usuário e senha e o URL para o servidor de API do servidor master. Abaixo a sintaxe para efetuar login incluindo o nome de usuário, a senha e a URL para o OpenShift Master API server:


{% highlight bash %}
$ oc login -u fulano -p fulano https://ocp-1.192.168.122.100.nip.io:8443
{% endhighlight %}

``
