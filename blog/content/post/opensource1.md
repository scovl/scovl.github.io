+++
title = "External Secrets"
description = "Open Source contributing #1"" 
date = 2023-04-04T09:18:18-03:00
tags = ["Golang", "Kubernetes", "Open Source", "External Secrets"]
draft = true
weight = 8
+++

### Parte 1 - Conhecendo o projeto
* **[Introdução](#introdução)**
* **[Roadmap de contribuição](#roadmap-de-contribuição)**
* **[Pré-requisitos do projeto](#pré-requisitos-do-projeto)**
* **[Instalação do projeto](#instalação-do-projeto)**
* **[Conhecendo a estrutura do projeto](#conhecendo-a-estrutura-do-projeto)**


### Parte 2 - Mãos ao código

* **[Mãos ao código](#mãos-ao-código)**
* **[Testes e build do projeto](#testes-e-build-do-projeto)**

### Parte 3 - Considerações finais

* **[Considerações finais](#considerações-finais)**
* **[Mastodon](#mastodon)**


## Introdução

![img#center](https://raw.githubusercontent.com/external-secrets/external-secrets/main/assets/eso-logo-medium.png#center)

O **[External Secrets Operator](https://github.com/external-secrets/external-secrets)** é **[Kubernetes Operator](https://www.redhat.com/pt-br/topics/containers/what-is-a-kubernetes-operator)** que integra sistemas externos de gerenciamento de segredos, como o AWS Secrets Manager, o HashiCorp Vault, o Google Secrets Manager, o Azure Key Vault, o IBM Cloud Secrets Manager, o Akeyless e muitos outros. Ele lê informações das APIs externas e injeta automaticamente os valores em um Kubernetes Secret.

Muitas pessoas e organizações estão se unindo para criar uma única solução de External Secrets com base em projetos existentes. E você também pode se juntar a essa comunidade para colaborar e contribuir com sua experiência e conhecimento. Se você se interessa em contribuir de alguma forma para a evolução desta ferramenta de código aberto, está no lugar certo! Abaixo está um passo a passo de como começar a contribuir para o projeto. A forma de gerenciar secrets padrão do Kubernetes é armazenar os valores em um arquivo YAML e codificá-los em base64. Essa abordagem é muito insegura e não é recomendada para ambientes de produção. O External Secrets Operator é uma solução que resolve este problema.

**NOTA:** Este artigo tem como foco a contribuição em código, mas você também pode contribuir de outras formas, como, por exemplo, traduzindo a documentação, criando tutoriais etc. Todo tipo de contribuição é bem-vindo!

**IMPORTANTE**: Não conhece nada sobre Kubernetes? nesse caso este projeto ainda não é para você, mas você pode começar a aprender sobre Kubernetes através do curso gratuito do **[Kubernetes.io](https://kubernetes.io/pt-br/)**. Ou no curso da LINUXtips **[Descomplicando o Kubernetes](https://www.youtube.com/watch?v=pV0nkr61XP8)**. 

Independente de seu nível de conhecimento o Roadmap abaixo serve para quaisquer projetos open source. Logo, você pode começar a contribuir com qualquer projeto open source seguindo o Roadmap a seguir. Pretendo continuar essa série para outros projetos e liguagens de programação. Portanto, fiquem ligados!

## Roadmap de contribuição

Aqui é o pontapé inicial para você começar a contribuir com quaisquer projetos open source. Abaixo está o planejamento que eu faço antes de começar a contribuir com um projeto open source:

1. **Escolha um projeto para contribuir** - Recomendo que você pense em projetos que estejam presentes no seu dia a dia, como bibliotecas, linguagens de programação, plataformas e ferramentas em geral. Outra dica é verificar sites como **[codetriage.com](codetriage.com/)** , **[up-for-grabs.net](up-for-grabs.net/)**, **[firsttimersonly.com](firsttimersonly.com/)**, **[goodfirstissues.com](goodfirstissues.com/)**, **[contributor.ninja](contributor.ninja/)**. Esses sites listam projetos de código aberto que precisam de ajuda.

2. **Leia o COC do projeto** - Após escolher um projeto, você deve ler o código de conduta do projeto. Esse código de conduta é uma forma de entender como a comunidade do projeto funciona e como se comportar. Evite entrar em discussões e debates desnecessários, seja educado e respeitoso com os outros membros da comunidade. Essa é uma forma de se integrar à comunidade do projeto e também de fazer networking com outros desenvolvedores.

3. **Leia a documentação de contribuição** - Após escolher um projeto, você deve ler a documentação de contribuição do projeto. Essa documentação geralmente está escrita em Markdown e se chama `CONTRIBUTING.md`. Ela contém informações sobre como contribuir com o projeto, como configurar o ambiente de trabalho, como executar testes, como enviar um pull request, etc.

4. **Observe o projeto atentamente** - Após ler a documentação de contribuição, é importante observar o projeto com atenção. Observe como o projeto está estruturado, como os testes são executados, como o código é organizado, como os pull requests são revisados, etc. Essa observação é importante para entender como o projeto funciona e como contribuir com ele.

5. **Escolha uma issue para resolver** - Após ler a documentação de contribuição, escolha uma issue (problema) para resolver. Essa issue pode ser uma issue de bug, uma issue de melhoria, uma issue de documentação, etc. Uma boa dica é começar por issues marcadas com uma tag `good first issue` ou `help wanted`. Essas tags indicam que a issue é uma boa opção para iniciantes. Resolver issues é uma maneira de investigar e entender o projeto, absorver conhecimento e entender como o projeto funciona.

6. **Use o git corretamente** - É comum que nossos pull requests sejam rejeitados porque não estamos usando o Git corretamente. Isso quer dizer que você deve criar um branch para cada issue que resolver. Por exemplo, se resolver uma issue chamada `#123`, , crie um branch chamada `123`. É importante usar mensagens de commit claras e concisas e fazer o rebase do seu branch com o branch `main` antes de enviar o pull request. Essas são algumas dicas para usar o Git corretamente.

7. **Participe da comunidade** - Após resolver uma issue, é importante  **[participar da comunidade do projeto](https://github.com/external-secrets/external-secrets/discussions)**. Você pode participar da comunidade do projeto através de discussões, perguntas, sugestões, etc. Essa participação é importante para entender melhor o projeto e também para fazer networking com outros desenvolvedores. Além disso, esse projeto contém reuniões de desenvolvimento quinzenal a cada semana, às 20h (horário de Berlim) nas quartas-feiras por **[agenda](https://hackmd.io/GSGEpTVdRZCP6LDxV3FHJA)** e  **[chamadas em jitsi](https://meet.jit.si/eso-community-meeting)**. Há também o canal **[#external-secrets no Kubernetes Slack](https://kubernetes.slack.com/messages/external-secrets)** e **[Twitter](https://twitter.com/ExtSecretsOptr)**.

Agora que você sabe como começar, vamos contribuir para o projeto External Secrets Operator!

## Pré-requisitos do projeto

Se você não souber programar em Golang ou estiver aprendendo, recomendo que veja a série de vídeos produzidos por Ellen Korbes **[Aprenda Go](https://www.youtube.com/watch?v=WiGU_ZB-u0w&list=PLCKpcjBB_VlBsxJ9IseNxFllf-UFEXOdg)**. Essa série de vídeos é muito boa para quem está começando a aprender Go. Outro link é o do **[MarmotaProject](https://marmotaproject.github.io/)** onde contém inúmeras dicas a cerca de Golang.

Portanto, antes de começar, certifique-se de ter um ambiente de trabalho Go funcionando. Você pode encontrar informações sobre como instalar o Go **[aqui](https://go.dev/doc/install)**. Para programar em GO, você pode usar qualquer IDE ou editor de texto para contribuir com o projeto External Secrets Operator. Particularmente recomendo que use o **[Visual Studio Code](https://code.visualstudio.com/)**. Ele é leve, rápido e tem uma grande comunidade. Além disso, ele tem uma grande variedade de extensões que podem ajudá-lo a desenvolver em Go. Para facilitar e resumir como configurar o Visual Studio Code, instale os seguintes plugins:

* **[Go Extension Pack](https://marketplace.visualstudio.com/items?itemName=doggy8088.go-extension-pack)** - O Go Extension Pack é uma extensão que contém várias extensões para desenvolver em Go. 
* **[EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)** - Note que no repositorio do projeto existe um arquivo chamado `.editorconfig`. Esse arquivo contém configurações para o editor. O EditorConfig é uma extensão que permite que você defina e forneça configurações para o seu editor. Então, o projeto já vem com configurações para o editor, basta instalar a extensão e o editor irá ler as configurações do arquivo `.editorconfig`.

Em seguida, entre em seu github, **[crie um fork do projeto](https://github.com/external-secrets/external-secrets/fork)** e clone o repositório para o seu ambiente de trabalho. Exemplo:

```bash
git clone https://github.com/<seu_usuario>/external-secrets.git
cd external-secrets
```
Para instalar tudo o que é necessário para rodar o projeto, criei um playbook Ansible (para Linux) que instala tudo o que é necessário para rodar o projeto. Siga as instruções abaixo para instalar o Ansible e executar o playbook:

```bash

# Instale o PIP caso não tenha instalado 
# Estou considerando que sua distro seja Debian/Ubuntu
# Use o gerenciador de pacotes da sua distro
sudo apt install python3-pip -y

# De upgrade no PIP
pip install --upgrade pip

# instalar o Ansible 
pip install ansible --user

# clonar o repositório
git clone https://github.com/lobocode/workstation 
cd workstation

# executar o playbook
ansible-playbook -i inventory/hosts site.yaml -bKk -vv

```

O playbook cobre Debian/Ubuntu, ArchLinux, Centos, Fedora, Rhel e outras distros. No entanto, somente adaptei o playbook de prerequs pra Debian. Sintam-se a vontade para adaptar com a Distro que você usa, ou me chama que nois resolve. O playbook instala as seguintes ferramentas:

* **yq** - É recomendado que você instale o **yq**. Pois, muitos dos comandos `make` que usaremos no processo usam o **yq**. O yq é uma ferramenta de linha de comando para manipular arquivos YAML (semelante ao `jq`). 
* **Envtest** - Envtest é um pacote que contém uma versão local do controller do Kubernetes. Isto é útil para testar o seu código sem precisar de um cluster Kubernetes. Para mais informações, consulte a documentação setup-envtest em **[https://book.kubebuilder.io/reference/envtest.html](https://book.kubebuilder.io/reference/envtest.html)**. 
* **Docker** - O Docker é uma ferramenta para criar, executar e distribuir aplicativos. Para mais informações, consulte a documentação do Docker em **[https://docs.docker.com/](https://docs.docker.com/)**.
* **Kind** - O kind é uma ferramenta para criar clusters Kubernetes locais usando contêineres Docker. Para mais informações, consulte a documentação do kind em **[https://kind.sigs.k8s.io/](https://kind.sigs.k8s.io/)**.
* **Helm** - O helm é uma ferramenta para gerenciar pacotes de Kubernetes. Para mais informações, consulte a documentação do helm em **[https://helm.sh/docs/](https://helm.sh/docs/)**.
* **Helm-unittest** - O helm chart do projeto será testado usando o helm-unittest. Você precisará instalá-lo para executar testes localmente se modificar o helm chart.

No Windows existe um problema que é o uso do kubebuilder. Oficialmente o Kubebuilder não oferece suporte para Windows. No entanto, como o kubebuilder é desenvolvido em GO, gerei um build para Windows manualmente através do **autochoco** uma ferramenta que desenvolvi pra ajudar vocês a resolver esse e outros rolês bastando executar com privilégios de administrador o powershell e digitar os comandos a seguir:

```powershell
git clone https://github.com/lobocode/autochoco.git
cd .\autochoco\contributing\
powershell.exe -ExecutionPolicy Bypass -File .\external-secrets.ps1
```

Este script instala o chocolatey e através do chocolatey instala e configura golang o yq, o docker, o kind, o helm, helm-unittest e tudo o que você precisa. Para mais informações, consulte o repositório **[https://github.com/lobocode/autochoco](https://github.com/lobocode/autochoco)**.

**NOTA:** Outra opção é instalando o Windows Subsystem for Linux (WSL). Para instalar o WSL, siga as instruções em **[https://docs.microsoft.com/pt-br/windows/wsl/install-win10](https://docs.microsoft.com/pt-br/windows/wsl/install-win10)**. E instalar usando o playbook sugeriro.

Ou se preferir instalar tudo manualmente, apenas sigas as instruções abaixo:

1. **[Instale o Golang](https://go.dev/doc/install)** 
2. **[Instale o yq](https://mikefarah.gitbook.io/yq/)** 
3. **[setup-envtest](https://book.kubebuilder.io/reference/envtest.html)** 
4. **[Make](https://www.gnu.org/software/make/)** 
5. **[Instale o Docker](https://docs.docker.com/get-docker/)**
6. **[Instale o Kind](https://kind.sigs.k8s.io/docs/user/quick-start/)**
7. **[Instale o Helm](https://helm.sh/docs/intro/install/)**
8. **[Instale o Helm-unittest](https://github.com/helm-unittest/helm-unittest)**



## Instalação do projeto

Agora vamos usar o Kind para criar um cluster localmente. Para isso, execute o comando abaixo:

```bash
helm repo add external-secrets https://charts.external-secrets.io
helm repo update
helm install external-secrets external-secrets/external-secrets
```

Você também pode executar o controlador em seu sistema de host para fins de desenvolvimento:

```bash
make crds.install
make run
```

Para remover os CRDs, execute:

```bash
make crds.uninstall
```

CRDs são uma extensão do Kubernetes que permite que você crie novos tipos de recursos. O External Secrets Operator usa CRDs para criar novos tipos de recursos que representam os secrets externas. Por exemplo, o External Secrets Operator usa o tipo de recurso `ExternalSecret` para representar um segredo externo. O External Secrets Operator usa o tipo de recurso `SecretStore` para representar um armazenamento de segredos externo. Para saber mais sobre CRDs, consulte a documentação **[aqui](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)**. Se você precisar testar outras integrações do k8s e precisar que o operador seja implantado no cluster real enquanto desenvolve, pode usar o seguinte fluxo de trabalho:

```bash
kind create cluster --name external
```

## Conhecendo a estrutura do projeto

Como já resumi a documentação de contribuição acima, vamos serguir o item 4 do Roadmap, isto é, o item (**4. Observe o projeto atentamente**) e observar o projeto numa de entender quais erros foram cometidos ao envierem PRs (**aprenda com os erros dos outros**). Como também observar o histórico de commits para entender o que foi feito e como foi feito:

![](https://i.imgur.com/0Z7ZQ9M.png#center)

Além disso, você entende a estrutura de pastas deste projeto? Vamos dar uma olhada:

```bash
├───.github
├───apis
├───assets
├───cmd
├───config
├───deploy
├───design
├───docs
├───e2e
├───hack
├───overrides
├───pkg
└───terraform

```
Uma breve descrição de cada pasta principais e arquivo pode ser encontrada abaixo:

* **.github:** pasta com arquivos de configuração do GitHub Actions, isto é, do CI/CD incluindo workflows e templates de issues e pull requests.
* **apis:** pacote que define as interfaces gRPC para o servidor e o cliente, incluindo protobuffers, arquivos de serviço e stubs.
* **assets:** pasta com arquivos de imagem usados na documentação e no site.
* **cmd:** pacote que contém o código principal para o aplicativo.
* **config:** pasta com os arquivos YAML usados para instalar o External Secrets no cluster do Kubernetes.
* **deploy:** pasta com arquivos e scripts para implantar o External Secrets em diferentes ambientes, incluindo Helm charts e manifests do Kubernetes.
* **design:** pasta com documentos de design para o projeto.
* **docs:** pasta com documentação do projeto, incluindo guias, exemplos e snippets de código.
* **e2e:** pasta com testes end-to-end, incluindo casos de teste para diferentes provedores de segredos.
* **hack:** pasta com scripts auxiliares para desenvolvimento e build do projeto.
* **overrides:** pasta com arquivos YAML usados para substituir as configurações padrão.
* **pkg:** pacote que contém a lógica principal do projeto, incluindo controladores, provedores de segredos e utilitários.
* **terraform:** pasta com módulos Terraform para implantar o External Secrets em diferentes provedores de nuvem.

Você pode estar se perguntando como descobri tudo isso. A resposta é simples: eu naveguei pelo repositório e fui lendo os arquivos. É claro que você não precisa fazer isso, mas é uma boa prática para entender melhor o projeto. Particularmente, me sinto melhor quando entendo o que estou fazendo. Mas, cada um tem sua própria forma de estudar, não é mesmo? :)

---

## Mãos ao código

### Escolha uma issue para resolver

Agora que entendi o padrão de commits, que observei os erros dos PRs e o que foi feito e quando foi feito, vamos escolher uma issue para resolver. Para isso, vamos acessar a aba **[Issues](https://github.com/external-secrets/external-secrets/issues)** do projeto e filtrar por **[good first issue](https://github.com/external-secrets/external-secrets/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)**. No momento que escrevo esse artigo, existem 18 issues com essa tag.

![](https://i.imgur.com/0Z7ZQ9M.png#center)

A primeira issue que eu escolhi foi esta aqui **[#2151](https://github.com/external-secrets/external-secrets/issues/2151)**. Agora algumas perguntas interessante a se fazer a cerca da issue que escolhí:

1. **Do que se trata a issue?**

O usuário **creosonic** está pedindo para adicionar métricas em um formato semelhante à métrica já existente `externalsecret_status_condition`. A adição dessa métrica traria valor ao melhorar as capacidades de observabilidade relacionadas à verificação do status das secret stores. Com essa métrica disponível, os administradores e operadores do sistema poderão monitorar melhor a saúde e a disponibilidade de suas secret stores. Isso pode ajudar a identificar possíveis problemas e tomar medidas proativas para evitar qualquer tempo de inatividade ou perda de dados.

Em resumo, a Issue propõe adicionar duas novas métricas no caso a métrica `SecretStore` e `ClusterSecretStore` ao Prometheus para melhorar as capacidades de Observabilidade e a monitoração das secret stores. No projeto, abra o arquivo `docs/api/metrics.md`. O objetivo desta documentação é explicar como expor essas métricas através do Prometheus e como monitorar o desempenho da ferramenta. Além disso, são apresentados alguns indicadores de nível de serviço (SLIs) que podem ser usados para avaliar a eficiência e qualidade da ferramenta. A documentação também inclui um painel do Grafana para visualização das métricas. Caso queira entender mais sobre o que é SLI, SLO e SLA, recomendo a leitura do artigo **[SLI's, SLA's e SLO's](https://www.nanoshots.com.br/2019/12/sre-slo-slis-nao-sabe-por-onde-comecar.html)** escrito pelo saudoso **[Matheus Fidelis](https://www.linkedin.com/in/msfidelis/)**. Caso não conheça o Prometheus, **[recomendo a leitura do artigo que escrevi a cerca do prometheus aqui no blog](https://lobocode.github.io/2023/03/21/prometheus/)**.

Agora que você entende melhor a sugestão da issue, vamos entender melhor o que é necessário para resolve-la. Abra o arquivo em `pkg/provider/metrics/metrics.go`. Nele você encontrará as métricas já existentes. Para adicionar as novas métricas, você precisará adicionar as seguintes linhas de código:

```go

```

## Testes e Build do projeto

O projeto usa o sistema de construção `make`. Ele executará geradores de código, testes e análises de código estático. Construindo o binário e a imagem do operador Docker:

```bash
make build
make docker.build IMG=external-secrets:latest
```

Executar testes e verificar o código: (golangci-lint@1.49.0 é necessário.)

```bash
make test
make lint # OU
docker run --rm -v $(pwd):/app -w /app golangci/golangci-lint:v1.49.0 golangci-lint run
```

Construir a documentação:

```bash
make docs
```


## Pull Request

Para submeter uma alteração ao projeto, você pode utilizar o processo de `pull request` para o repositório do projeto, é importante verificar se a sua alteração atende aos seguintes critérios:

* Se possível, deve haver um problema documentando o problema ou recurso em detalhes.
* O código deve ter uma quantidade razoável de cobertura de testes.
* Os testes devem ser aprovados e executados sem falhas.
* O pull request precisa ser revisado e aprovado por um mantenedor do projeto.

Após esses critérios serem atendidos, o pull request será mesclado por um proprietário do código. É possível que um mantenedor seja atribuído para acompanhar o pull request, garantindo que ele seja revisado e mesclado dentro do prazo. O projeto utiliza testes extensos de integração com as APIs reais de provedores de nuvem. Para executar esses testes localmente, é necessário configurar o ambiente de shell com as variáveis necessárias para o runner de teste saber quais credenciais utilizar. Depois disso, é possível executar a suíte de testes e filtrar os testes que deseja executar usando rótulos Ginkgo.

Antes de realizar alterações significativas no projeto, é importante criar um documento no diretório "design/" descrevendo a proposta e solicitar feedback através de um pull request em modo de rascunho. Depois que a proposta for aceita e o pull request for mesclado, as implementações podem ser realizadas. Por fim, para oferecer suporte aos usuários do projeto, é possível utilizar os seguintes canais:

* Canal #external-secrets no Slack do Kubernetes
* Discussões no GitHub
* Problemas no GitHub, com etiquetas especiais para identificar o status de um problema de suporte.

O projeto é lançado em uma base de acordo com a necessidade. Para solicitar um lançamento, abra um problema no GitHub. Os detalhes de como realizar um lançamento podem ser encontrados na página de lançamento (release.md).

## Nota importante sobre o projeto

O projeto External-Secrets é dividido em três partes: o ESO (External-Secrets Operator), o Helm Chart e o OLM Bundle. Cada uma dessas partes pode ter lançamentos independentes. Um lançamento do Helm Chart é identificado com o nome external-secrets-x.y.z.

Para lançar uma nova versão do ESO, é necessário seguir os seguintes passos:

* Executar a ação Create Release para criar um novo lançamento, informando o número da versão desejada.
* A workflow release.yml será executada, criando um GitHub Release e um changelog, e promovendo a imagem do container.
* Atualizar o Helm Chart, conforme indicado abaixo.
* Atualizar o OLM Bundle, seguindo as instruções da documentação do helm-operator.
* Anunciar o novo lançamento no canal #external-secrets do Kubernetes Slack.

Para lançar uma nova versão do Helm Chart, é necessário seguir os seguintes passos:

* Atualizar o número da versão e/ou do appVersion no arquivo Chart.yaml e executar os comandos make helm.docs helm.update.appversion.
* Se houver alteração no CRD, executar os comandos make helm.test.update e make helm.test.
* Fazer o push das alterações para a branch e abrir um pull request.
* Executar o comando /ok-to-test-managed para todos os provedores de nuvem.
* Combinar o pull request se tudo estiver correto.
* O CI pegará a nova versão do Helm Chart e criará um novo lançamento no GitHub.

Para lançar uma nova versão do OLM Bundle, é necessário seguir os seguintes passos:

* Incrementar a versão no arquivo Makefile, conforme descrito acima.
* Executar os comandos descritos no bloco de código.
* Verificar os arquivos gerados no diretório bundle/. Se estiverem corretos, adicionar e fazer o commit desses arquivos e abrir um pull request contra o repositório community-operators.
* Executar o comando make bundle-operatorhub, que fará o push e abrirá os pull requests necessários nos repositórios community-operators.

---

## Mastodon

Aproveitando o espaço aqui para divulgar a palavra da salvação, o Mastodon. Pessoal, se você ainda não conhece o Mastodon, recomendo que vocês dêem uma olhada. É uma rede social descentralizada, livre e de código aberto. Descentralizada, porque não existe um servidor central, mas sim uma rede de servidores que se comunicam entre si. Livre, porque você pode hospedar o seu próprio servidor e ter total controle sobre os seus dados. E de código aberto, porque o código fonte é aberto e qualquer um pode contribuir com o projeto.

Vamos dar menos palco para redes centralizadas que estão literalmente se tornando 4chans para dar espaço para redes onde as regras de conduta são definidas pela comunidade e não por uma empresa que só quer ganhar dinheiro com a sua privacidade? Abaixo algumas dicas para você começar a usar o Mastodon:

* Instale o aplicativo para o seu celular, recomendo o Tusky, que é o mais popular e tem suporte para várias plataformas.
* Escolha uma instância para se registrar, recomendo a instância **https://bolha.us**, que é a instância que eu uso e que tem uma comunidade de tecnologia bastante ativa. Se você quiser, pode me seguir no Mastodon, meu usuário é **[@lobocode@bolha.us](https://bolha.us/@lobocode)**. Abaixo o link para outras instâncias:
   * **https://colorid.es** - Comunidade LGBTQIA+.
   * **https://cuscuz.i** - Comunidade focada em um público nordestino.
   * **https://vira-lata.org** - Comunidade deboísta, zen e discordiana. 
   * **https://komuna.digital** - Comunidade dos camaradas comunas.
   * **https://ursal.zone** - Outra comunidade dos comunas.

### Como funciona?

Entenda rede descentralizada ou federada com mais ou menos funciona os servidores de E-mail. Como com E-mail, que é descentralizado, o Mastodon também é uma rede social descentralizada, ou seja, não existe um servidor central, mas sim uma rede de servidores que se comunicam entre si. Se alguma instância for derrubada por algum motivo que vá contra as regras da comunidade, ela deixa de existir, mas a rede continua funcionando normalmente. Há um código de ética que define as regras de conduta da rede, que são definidas pela comunidade e não por uma empresa que só quer ganhar dinheiro com a sua privacidade.

### Porque vale a pena usar?

Mastodon é livre de algoritmos de engajamento, que muitas vezes são usados para manter as pessoas viciadas em redes sociais. Em vez disso, o Mastodon exibe os posts em ordem cronológica, o que significa que você vê o que as pessoas postaram mais recentemente, em vez do que a rede social quer que você veja. O Mastodon também é livre de anúncios, o que significa que você não precisa se preocupar com anúncios de produtos que você não quer comprar, ou com anúncios de políticos que você não quer apoiar. Abaixo um exemplo de como é a timeline do Mastodon:

![img](https://i.imgur.com/0Z7Z7Zm.png)