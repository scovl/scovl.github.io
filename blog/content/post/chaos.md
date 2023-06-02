+++
title = "Chaos Engineering"
description = "Art of Chaos Engineering"
date = 2023-03-19T17:31:45-03:00
tags = ["chaos, chaosengineering, observability, sre, developers, devops, cloud, kubernetes, k8s, microservices, cloudnative, cloudnativebrasil, cloudnativebr, cloudnativebrasil, cloud"]
draft = false
weight = 2
author = "Vitor Lobo Ramos"
+++

* **[Introdução](#introdução)**
* **[Motivação](#motivação)**
* **[Como funciona a Engenharia do Caos?](#como-funciona-a-engenharia-do-caos)**
* **[Observabilidade](#observabilidade)**
* **[O que a Engenharia do Caos não é](#o-que-a-engenharia-do-caos-não-é)**
* **[Exemplos práticos](#exemplos-práticos)**
* **[Blast Radius](#blast-radius)**
* **[Complexidade dos sistemas modernos](#complexidade-dos-sistemas-modernos)**
* **[Cultura](#cultura)**
* **[Princípios da Engenharia do Caos](#princípios-da-engenharia-do-caos)**
* **[Práticas da Engenharia do Caos](#práticas-da-engenharia-do-caos)**
* **[Falhas notórias](#falhas-notórias)**
* **[Benefícios](#benefícios)**
* **[Ferramentas e frameworks](#ferramentas-e-frameworks)**
* **[Desafio e estratégias na adoção](#desafio-e-estratégias-na-adoção)**
* **[Conclusão](#conclusão)**


![img#center](images/chaos/monkey.png#center)

## Introdução

A Engenharia do Caos é uma abordagem inovadora para melhorar a resiliência e a confiabilidade dos sistemas. Ela começou na **[Netflix]()**, uma das maiores empresas de streaming de vídeo do mundo, por volta de 2010. Nessa época, a Netflix enfrentava o desafio de garantir a disponibilidade e o desempenho de seus serviços em uma infraestrutura complexa e distribuída em nuvem. A dor que a Netflix experimentava era a necessidade de manter seus serviços funcionando continuamente e sem interrupções, mesmo diante de falhas e incidentes inesperados. Eles perceberam que, para abordar essa questão de forma eficaz, precisavam adotar uma abordagem proativa, em vez de reativa, para gerenciar a resiliência de seus sistemas.

A disciplina da Engenharia do Caos ajudou com a solução deste problema introduzindo falhas deliberadas e estresse em seu ambiente de produção, permitindo que a equipe identificasse e corrigisse pontos fracos antes que se tornassem problemas reais. Isso permitiu à empresa melhorar a resiliência de seus sistemas e garantir uma experiência de usuário consistente e confiável. A proposta central da Engenharia do Caos é a ideia de que, ao testar intencionalmente a capacidade de um sistema de lidar com falhas e estresse, as equipes possam aprender mais sobre a resiliência de seus sistemas e trabalhar para melhorá-los continuamente. Em vez de esperar por falhas reais e correr o risco de interrupções significativas nos serviços, a Engenharia do Caos defende a experimentação proativa e o aprendizado contínuo. Desde sua criação na Netflix, a disciplina de Engenharia do Caos tem evoluído e ganhado popularidade em toda a indústria de tecnologia. Empresas como Google, Amazon, Microsoft e Facebook também adotaram a prática para aprimorar a confiabilidade de seus próprios sistemas. Além disso, uma série de ferramentas e frameworks, como **[Chaos Monkey]()**, **[Gremlin]()** e **[Litmus]()**, foram desenvolvidos para facilitar a implementação da Engenharia do Caos em diversos ambientes.

## Motivação

A Engenharia do Caos é uma estratégia pra deixar sistemas complexos mais confiáveis e resilientes. Com essa abordagem, dá pra estimar riscos, definir metas de desempenho e garantir que tudo funcione bem. É tipo testar o sistema todo, não só partes isoladas, pra ver se ele aguenta situações adversas e falhas previsíveis. E o legal é que a Engenharia do Caos ainda lhe ajuda a descobrir problemas inesperados que surgem quando componentes interagem entre si. Assim, dá pra resolver essas tretas e melhorar a confiabilidade e resiliência do sistema.

Se tivessem usado essa abordagem antes, vários desastres poderiam ter sido evitados. Olha só alguns exemplos práticos:

* **Knight Capital Group** - em 2012, um erro de software fez a empresa perder US$ 440 milhões em menos de uma hora. Com a Engenharia do Caos, isso poderia ter sido evitado.
* **Lembra quando o Healthcare.gov deu ruim em 2013?** - o site do governo dos EUA pro Obamacare falhou por causa de problemas de software e capacidade. A Engenharia do Caos poderia ter ajudado a evitar essa catástrofe.
* **E o ataque WannaCry em 2017?** - foi um ransomware que se aproveitou de falhas no Windows e afetou uma galera pelo mundo todo. Com a Engenharia do Caos, dava pra reforçar a segurança e evitar esse transtorno.

Esses são só alguns exemplos, mas dá pra sacar que a Engenharia do Caos é uma jogada inteligente pra prevenir problemas e garantir que tudo funcione de boa. É tipo dar um tapa na confiabilidade dos sistemas complexos e distribuídos.

## Como funciona a Engenharia do Caos?

![img#center](images/chaos/geo01.png#center)

A Engenharia do Caos é realizada por meio de experimentos de caos, que são as unidades básicas desse tipo de engenharia. Em um experimento de caos, você investiga como um sistema de computador reage a eventos adversos, focando em provar ou refutar suas suposições sobre como o sistema será afetado por determinada condição. Vamos considerar um exemplo: você possui um site popular e um datacenter inteiro. É necessário garantir que seu site continue funcionando mesmo em caso de queda de energia. Para isso, você instala duas fontes de energia independentes no datacenter. Mesmo assim, muita coisa pode dar errado, como falhas na troca automática entre as fontes ou a insuficiência de uma única fonte para todos os servidores. A Engenharia do Caos pode ajudá-lo a identificar esses problemas. Você pode projetar um experimento de caos simples para descobrir o que acontece quando uma das fontes de energia falha. Siga estes quatro passos para cada fonte de energia, uma de cada vez:

* Verifique se o site está funcionando.
* Abra o painel elétrico e desligue a fonte de energia.
* Observe como o sistema reage à interrupção de energia e registre os resultados.
* Ligue a fonte de energia novamente e verifique se o site está funcionando normalmente.

Ao realizar esses experimentos, você poderá descobrir possíveis falhas e vulnerabilidades em seu sistema e tomar as medidas necessárias para corrigi-las. Assim, a Engenharia do Caos ajuda a garantir a confiabilidade e a resiliência do seu sistema frente a eventos adversos.

* Verifique se o site continua funcionando.
* Ligue a fonte de energia novamente.

O processo pode parecer simples e óbvio, mas é eficiente. Dado um sistema de computador (um datacenter) e uma característica (sobreviver à falha de uma única fonte de energia), você projetou um experimento (desligar uma fonte de energia e verificar se o site continua no ar) que aumenta sua confiança na capacidade do sistema de resistir a problemas de energia. Você usou a ciência para o bem e precisou de apenas um minuto para configurar o experimento. No entanto, é importante considerar os riscos de seus experimentos e escolher o ambiente certo para executá-los. Caso o experimento falhe e o datacenter seja desligado, você terá criado uma interrupção por conta própria. Quando você lida com problemas mais complexos, o processo começa com a formulação de uma hipótese que deseja provar ou refutar. Em seguida, você projeta a experiência inteira em torno dessa ideia. Por exemplo, quando Gregor Mendel teve uma intuição sobre as leis da hereditariedade, ele projetou uma série de experimentos com ervilhas amarelas e verdes, provando a existência de características dominantes e recessivas. Os resultados de Mendel não seguiram as expectativas, mas isso foi perfeitamente aceitável; na verdade, foi assim que ele fez sua descoberta revolucionária em genética. Utilizar a Engenharia do Caos para entender como nosso sistema se comporta diante de eventos adversos e garantir sua confiabilidade e resiliência. O processo de quatro etapas para projetar um experimento de caos é simples e pode ser descrito da seguinte maneira:

* **Observabilidade:** certifique-se de que você possa observar os resultados de forma precisa. Seja a cor das ervilhas resultantes, a integridade do boneco de teste de colisão, seu site funcionando, a carga da CPU, o número de solicitações por segundo ou a latência das solicitações bem-sucedidas, o primeiro passo é garantir que você possa ler com precisão o valor dessas variáveis.
* **Estado estável:** usando os dados observados, defina o que é normal para que você possa entender quando algo está fora do intervalo esperado. Por exemplo, você pode esperar que a carga da CPU em uma média de 15 minutos seja inferior a 20% para seus servidores de aplicativos durante a semana de trabalho. Ou talvez você espere de 500 a 700 solicitações por segundo por instância do servidor de aplicativos executando com quatro núcleos na especificação de hardware de referência.
* **Hipótese:** transforme sua intuição em uma hipótese que possa ser provada ou refutada, usando os dados que você pode coletar de maneira confiável (observabilidade). Um exemplo simples pode ser: "Desligar uma das máquinas não afeta a latência média do serviço."
* **Execução do experimento:** realize o experimento, fazendo as medições para concluir se sua hipótese estava correta. Curiosamente, é bom estar errado, porque é com os erros que você aprende mais. Repita o processo quantas vezes for necessário. Quanto mais simples for o experimento, geralmente melhor. Não há pontos extras para designs elaborados, a menos que essa seja a melhor maneira de provar a hipótese.

Lembre-se de que o objetivo dos experimentos de caos é compreender como seu sistema se comporta diante de eventos adversos, assegurando sua confiabilidade e resiliência. A chave para o sucesso é projetar experimentos simples e eficazes que permitam aprender e melhorar continuamente seu sistema.

### Definindo um estado estável

Depois de obter dados confiáveis na etapa anterior (observabilidade), é necessário definir o que é normal para que você possa identificar anormalidades. Uma maneira mais sofisticada de dizer isso é definir um estado estável. O que você mede dependerá do sistema e dos objetivos relacionados a ele. Pode ser "carro intacto a 60 mph em linha reta" ou talvez "99% dos nossos usuários podem acessar nossa API em menos de 200 ms". 

Geralmente, isso será determinado diretamente pela estratégia de negócios. É importante mencionar que em um servidor Linux moderno, muitas coisas estarão acontecendo, e você tentará isolar o máximo possível de variáveis. Vamos usar o exemplo do uso de CPU do seu processo. Pode parecer simples, mas na prática, muitos fatores podem afetar sua leitura. Seu processo está recebendo CPU suficiente ou está sendo roubado por outros processos (talvez seja uma máquina compartilhada ou um trabalho do cron atualizando o sistema durante seu experimento)? O kernel alocou ciclos para outro processo com prioridade mais alta? Você está em uma máquina virtual e talvez o hipervisor tenha decidido que algo mais precisa de mais CPU?

Você pode se aprofundar muito nesse assunto. A boa notícia é que muitas vezes você repetirá seus experimentos várias vezes, e algumas das outras variáveis serão reveladas. No entanto, lembre-se de que todos esses outros fatores podem afetar seus experimentos e mantenha isso em mente durante a realização deles.

### Formulando uma hipótese

![img#center](images/chaos/geo03.png#center)

Agora chegamos à parte realmente divertida onde você transforma seus palpites em hipóteses como por exemplo: Ele continuará funcionando? Vai desacelerar? Quanto? Na vida real, essas perguntas geralmente são motivadas por incidentes (problemas não planejados que você descobre quando as coisas param de funcionar), mas quanto melhor você se torna neste jogo, mais você pode (e deve) antecipar. No início deste capítulo, listei alguns exemplos do que tende a dar errado. Esses eventos podem ser amplamente categorizados da seguinte forma:

* Eventos externos (terremotos, inundações, incêndios, quedas de energia, etc.)
* Falhas de hardware (discos, CPUs, switches, cabos, fontes de alimentação, etc.)
* Escassez de recursos (CPU, RAM, swap, disco, rede)
* Erros de software (loops infinitos, travamentos, invasões)
* Gargalos não supervisionados
* Propriedades emergentes imprevistas do sistema
* Máquinas virtuais (Java Virtual Machine, V8, outras)
* Erros de hardware
* Erros humanos (apertar o botão errado, enviar a configuração errada, puxar o cabo errado, etc.)

Alguns deles são fáceis (desligar uma máquina para simular falha na máquina ou retirar o cabo Ethernet para simular problemas de rede), enquanto outros serão muito mais avançados (adicionar latência a uma chamada de sistema). A escolha das falhas a serem consideradas requer um bom entendimento do sistema em que você está trabalhando. Aqui estão alguns exemplos do que uma hipótese pode parecer:

* Em uma colisão frontal a 60 mph, nenhum boneco será esmagado.
* Se ambas as ervilhas-mãe forem amarelas, toda a descendência será amarela.
* Se tirarmos 30% de nossos servidores, a API continuará a atender o percentil 99 das solicitações em menos de 200 ms.
* Se um de nossos servidores de banco de dados falhar, continuaremos cumprindo nosso SLO (Service Level Objective).

### Agora é hora de executar o experimento

Finalmente, você executa o experimento, mede os resultados e conclui se estava certo. Lembre-se de que estar errado é bom - e muito mais emocionante nesta fase! Todos recebem uma medalha nas seguintes condições:

* Se você estava certo, parabéns! Você acabou de ganhar mais confiança em seu sistema resistir a um dia tempestuoso.
* Se você estava errado, parabéns! Você acabou de encontrar um problema em seu sistema antes que seus clientes o fizessem, e ainda pode corrigi-lo antes que alguém se machuque!

## Observabilidade

![img#center](images/chaos/geo04.png#center)

Observabilidade, no contexto da engenharia do caos, refere-se à capacidade de entender o estado interno de um sistema a partir de suas saídas externas, como métricas, registros e rastreamentos. A observabilidade é fundamental para identificar problemas, diagnosticar falhas e melhorar a resiliência de um sistema. Vamos explicar isso de forma didática utilizando um exemplo simples:

Imagine que você é responsável por um serviço de comércio eletrônico. Este serviço possui várias partes, como gerenciamento de pedidos, pagamento e entrega. Para garantir que seu sistema seja confiável e resiliente, você implementa práticas de engenharia do caos, como testes de falha e simulações de eventos adversos. A observabilidade desempenha um papel crucial nesse processo. Sem uma visão clara do que está acontecendo dentro do sistema, seria difícil identificar e solucionar problemas. Aqui estão algumas ações que você pode tomar para melhorar a observabilidade do seu sistema de comércio eletrônico:

* **Logs**: Faça com que cada componente do seu sistema registre informações sobre suas ações e ocorrências relevantes. Isso inclui solicitações recebidas, erros e eventos importantes. Os registros ajudam a rastrear o fluxo de eventos e a diagnosticar problemas.
* **Metrics**: Colete métricas em tempo real de diferentes partes do seu sistema, como tempo de resposta, taxa de erros e uso de recursos (como CPU, memória e largura de banda). As métricas ajudam a identificar gargalos de desempenho, falhas e áreas de melhoria.
* **Tracing**: Rastreie as solicitações conforme elas passam por diferentes componentes e serviços do sistema. O rastreamento distribuído permite que você entenda a latência e o desempenho de diferentes partes do sistema, facilitando a localização de problemas e a identificação de melhorias.
* **Alertas e monitoramento**: Configure alertas e monitore continuamente as métricas e os registros coletados. Isso permite que você identifique rapidamente quaisquer problemas e tome medidas corretivas antes que afetem os usuários finais.

Em resumo, a observabilidade é uma parte essencial da engenharia do caos, pois permite que você entenda o estado interno do seu sistema e tome decisões informadas para melhorar a resiliência e a confiabilidade. Através de registros, métricas, rastreamento distribuído e monitoramento, você pode identificar e solucionar problemas com eficácia, garantindo uma experiência de usuário mais satisfatória e um serviço mais robusto

## O que a Engenharia do Caos não é

A Engenharia do Caos não é uma solução milagrosa que conserta automaticamente seu sistema, cura o câncer ou garante a perda de peso. Na verdade, pode nem mesmo ser aplicável ao seu caso de uso ou projeto. Um equívoco comum é pensar que a Engenharia do Caos envolve destruir coisas aleatoriamente. Embora a aleatoriedade possa ser uma ferramenta poderosa, você deve controlar as variáveis com as quais está interagindo o máximo possível.

A Engenharia do Caos não se resume a ferramentas como Chaos Monkey, Chaos Toolkit ou PowerfulSeal. Essas ferramentas facilitam a implementação de certos tipos de experimentos, mas a verdadeira dificuldade está em aprender a analisar criticamente os sistemas e prever onde podem estar os pontos frágeis. É importante entender que a Engenharia do Caos não substitui outros métodos de teste, como testes unitários ou de integração. Em vez disso, ela os complementa, assim como os airbags são testados isoladamente e depois com o restante do carro em um teste de colisão. Cada sistema é diferente e, embora examinaremos cenários comuns juntos, você precisará entender profundamente as fraquezas do seu sistema para criar experimentos úteis de Engenharia do Caos. O valor que você obtém dos experimentos de Engenharia do Caos dependerá do seu sistema, do quão bem você o compreende, da profundidade dos testes e da qualidade da sua observabilidade. Embora a Engenharia do Caos deva ser executada em produção, essa não é a única situação em que se aplica. Há valor em aplicar os princípios da Engenharia do Caos e realizar experimentos em outros ambientes também. Por fim, embora exista alguma sobreposição, a Engenharia do Caos não se origina da teoria do caos em matemática e física. Com essas ressalvas, vamos experimentar a Engenharia do Caos com um pequeno estudo de caso. A Engenharia do Caos também é frequentemente confundido com "quebrar coisas em produção" e Antifragilidade. No entanto, esses conceitos são diferentes:

* **Quebrar coisas em produção**: Embora pareça interessante, essa descrição não é apropriada para organizações de grande escala. Chaos Engineering é melhor caracterizado como "consertar coisas em produção". O objetivo é melhorar proativamente a disponibilidade e a segurança de sistemas complexos, enquanto outras ferramentas e disciplinas lidam com a resposta reativa a incidentes. Chaos Engineering se concentra em melhorar a segurança de forma proativa.

* **Antifragility**: Introduzido por Nassim Taleb, refere-se a sistemas que se tornam mais fortes quando expostos a estresses aleatórios. A principal distinção entre Chaos Engineering e Antifragilidade é que o primeiro educa os operadores humanos sobre o caos já presente no sistema, tornando a equipe mais resiliente. A Antifragilidade, por outro lado, adiciona caos ao sistema na esperança de que ele se torne mais forte. Embora ambos lidem com caos e sistemas complexos, Antifragilidade não compartilha o mesmo embasamento empírico e fundamentação teórica que o Chaos Engineering.

Portanto, Chaos Engineering e Antifragilidade são conceitos distintos, embora ambos lidem com a complexidade e o caos em sistemas. O Chaos Engineering foca em educar os operadores sobre o caos existente e melhorar a resiliência, enquanto a Antifragilidade visa tornar os sistemas mais fortes ao adicionar caos a eles.

## Exemplos práticos

O primeiro passo é escolher um problema específico para trabalhar. Neste exemplo, vamos considerar um cenário em que o sistema está enfrentando problemas de falta de memória. Para simular esse problema, podemos executar um programa que consuma muita memória, como o `stress-ng`. Supondo que você esteja executando o Debian/Ubuntu, você pode instalar o `stress-ng` com o seguinte comando:

```bash
sudo apt install -y stress-ng
```

Com o stress-ng instalado, vamos executá-lo com um número alto de threads e um tamanho grande de bloco de memória.

```bash
stress-ng --vm-bytes $(awk '/MemAvailable/{printf "%d\n", $2 * 0.9;}' < /proc/meminfo) --vm-keep -m 1 -t 60s --tz -v -x
```

Essa linha de comando inicia o `stress-ng` com o objetivo de consumir 90% da memória disponível. O processo é executado por 60 segundos e produz uma saída detalhada que nos permite analisar o comportamento do sistema. Agora, vamos aplicar a Engenharia do Caos para entender o comportamento do sistema nesse cenário. O primeiro passo é identificar as variáveis ​​que podem afetar o comportamento do sistema. Neste exemplo, podemos considerar a quantidade de memória disponível, o número de threads em execução, a intensidade de uso da CPU, a utilização do disco rígido e a taxa de transferência de rede. Em seguida, precisamos definir um conjunto de ações que podem ser executadas para influenciar essas variáveis. Algumas ações que podemos tentar incluem:

* Alocar mais memória para o sistema
* Reduzir o número de threads em execução
* Reduzir a intensidade de uso da CPU
* Limpar o cache do disco rígido
* Aumentar a taxa de transferência de rede

Com essas variáveis ​​e ações em mente, podemos começar a experimentar diferentes combinações para entender como elas afetam o comportamento do sistema. Por exemplo, podemos tentar alocar mais memória para o sistema e, em seguida, observar se isso ajuda a resolver o problema de falta de memória. Para fazer isso, podemos executar o seguinte comando para liberar a memória cache do sistema:

```bash
sudo sysctl vm.drop_caches=3
```

Em seguida, podemos verificar a quantidade de memória disponível no sistema com o comando `free -m`. Se a quantidade de memória disponível aumentar, isso indica que a ação foi eficaz em aumentar a memória disponível. Podemos continuar experimentando diferentes combinações de variáveis ​​e ações para entender como elas afetam o comportamento do sistema. Ao fazer isso, podemos descobrir soluções mais eficazes e eficientes para lidar com problemas de gerenciamento de memória no sistema Linux. Em resumo, a engenharia do caos pode ser uma abordagem útil para entender e prever comportamentos complexos em sistemas. Ao identificar variáveis ​​importantes e experimentar diferentes ações, podemos descobrir soluções mais eficazes para problemas de gerenciamento de memória em sistemas Linux.

### Kubernetes - ChaosMesh

Um outro exemplo mais avançado é o uso do Chaosmesh para simular queda de pods. **[ChaosMesh]()** é uma plataforma de experimentação de caos de código aberto para Kubernetes, que permite aos usuários simular falhas em uma infraestrutura em produção para ver como o sistema se comporta sob diferentes condições. Neste tutorial, vamos explorar como usar o ChaosMesh para realizar experimentos de falhas em pods Kubernetes.

### Pré-requisitos:

* Um cluster Kubernetes configurado e funcionando.
* O ChaosMesh instalado no cluster Kubernetes. Se você ainda não tiver o ChaosMesh instalado, siga as instruções em **https://chaos-mesh.org/docs/installation/quick-start/** para instalá-lo.

1. Configurando a experimentação de queda de pods

Vamos começar criando um arquivo YAML para a configuração de nosso experimento. Abra o seu editor de texto favorito e crie um arquivo chamado pod-failure.yaml com o seguinte conteúdo:

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: PodChaos
metadata:
  name: pod-failure
  namespace: chaos-testing
spec:
  selector:
    labelSelectors:
      "app.kubernetes.io/name": "app-name" # Insira o nome do seu aplicativo aqui
  mode: one
  action: pod-failure
  duration: "60s" # Insira a duração da experimentação aqui
  scheduler:
    cron: "@every 10s" # Insira a frequência da experimentação aqui
```

Neste arquivo, estamos criando uma configuração para um experimento que irá selecionar um conjunto de pods por meio de um seletor de rótulo (labelSelector) e falhará em um único pod de cada vez (mode: one) através da ação pod-failure. A duração e a frequência das experimentações podem ser definidas por meio dos campos duration e scheduler.

2. Salve o arquivo e aplique-o ao cluster Kubernetes usando o comando:

```bash
kubectl apply -f pod-failure.yaml
```

3. Você pode verificar o status do experimento usando o seguinte comando:

```bash
kubectl describe podchaos pod-failure -n chaos-testing
```

Isso deve exibir informações sobre o experimento e seu status atual.

4. Verificando o resultado do experimento

Depois que a experimentação for concluída, você pode verificar se os pods falharam e se foram recuperados pelo Kubernetes. Use o seguinte comando para listar todos os pods que pertencem ao aplicativo:

```bash
kubectl get pods -l app.kubernetes.io/name=app-name
```

5. Você também pode verificar os logs do pod falhado para ver se há alguma mensagem de erro. Use o seguinte comando para exibir os logs do pod falhado:

```bash
kubectl logs <pod-name>
```

No exemplo acima, mostrei como usar o ChaosMesh para realizar experimentos de falhas em pods Kubernetes. Ao realizar esses experimentos, você pode identificar e corrigir problemas antes que eles ocorram em um ambiente de produção real. Para mais informações sobre o ChaosMesh, consulte **https://chaos-mesh.org/**

### Engenharia do Caos em Microsserviços

![img#center](images/chaos/geo02.png#center)

Vamos usar o framework de testes de integração "RestAssured" e o framework de engenharia do caos "Chaos Monkey for Spring Boot" para implementar o teste de latência de requisições com injeção de falhas. Antes de começarmos, certifique-se de que o Maven e o Java estejam instalados em sua máquina.

1. Crie um projeto Spring Boot

Crie um novo projeto Spring Boot no IDE de sua preferência ou através do Spring Initializr.

2. Adicione as dependências

No arquivo pom.xml, adicione as seguintes dependências:

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>io.rest-assured</groupId>
        <artifactId>rest-assured</artifactId>
        <version>4.4.0</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>de.codecentric</groupId>
        <artifactId>chaos-monkey-spring-boot</artifactId>
        <version>3.1.0</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

3. Implemente o serviço

Crie um serviço simples que retorne uma mensagem em JSON e adicione um atraso de 1 segundo antes de retornar a resposta:

```java
@RestController
public class ExampleController {
    @GetMapping("/example")
    public Map<String, String> example() throws InterruptedException {
        Thread.sleep(1000);
        return Map.of("message", "Hello, world!");
    }
}
```

4. Crie o teste

Crie uma classe de teste que faça uma requisição GET para o endpoint "/example" e verifique se a resposta é bem-sucedida (status 200) e se a mensagem de retorno está correta:

```java
import io.restassured.RestAssured;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
public class ExampleControllerTest {

    @Test
    public void testExample() {
        given()
            .when()
            .get("/example")
            .then()
            .statusCode(200)
            .body("message", equalTo("Hello, world!"));
    }
}
```

5. Configure o Chaos Monkey

No arquivo application.properties, adicione as seguintes configurações para habilitar o Chaos Monkey:

```java
spring.profiles.active=chaos-monkey
management.endpoint.chaosmonkey.enabled=true
```

Em seguida, adicione as seguintes configurações para especificar o tipo de falha a ser injetada e a probabilidade de ocorrência:

```java
chaos.monkey.assaults.level=3
chaos.monkey.assaults.latencyRangeStart=1000
chaos.monkey.assaults.latencyRangeEnd=3000
```

Essas configurações definem que a falha a ser injetada é um atraso na resposta entre 1 e 3 segundos, com uma probabilidade de 100%.

6. Execute o teste com a injeção de falhas

```java
mvn clean test
```

Após a execução, você poderá ver no console a saída do Chaos Monkey injetando as falhas, como:

```bash
2023-03-23 10:31:55.045  INFO 95920 --- [    Test worker] c.n.chaos.monkey.component.ChaosMonkey  : Delay injected with 500ms latency for method sayHello
2023-03-23 10:31:55.047  INFO 95920 --- [    Test worker] c.n.chaos.monkey.component.ChaosMonkey  : Exception injected for method sayHello
```

Além disso, ao executar o teste novamente, você poderá ver o aumento do tempo de resposta devido à injeção de atraso. O relatório de teste também indicará se houve algum erro durante a execução do teste. Com isso, você pode ver como é fácil usar o Chaos Monkey e o Spring Boot para testar a resiliência de seus microsserviços em relação a falhas. Para mais informações sobre o Chaos Monkey, consulte **https://codecentric.github.io/chaos-monkey-spring-boot/**.

## Blast Radius

![img#center](images/chaos/geo05.png#center)

O conceito de blast radius (ou raio de impacto em tradução livre) na engenharia do caos refere-se ao impacto que uma falha ou problema em um sistema ou componente específico pode ter sobre o sistema como um todo. É uma medida de quão longe o "estrago" causado por uma falha pode se espalhar, afetando outras partes do sistema. Para explicar de forma didática, imagine um sistema como uma cidade, e os componentes individuais são os edifícios. Se um edifício (componente) sofre um desastre, como uma explosão, o "blast radius" seria a área ao redor do edifício afetada pelos danos causados pela explosão. Em um sistema bem projetado, o objetivo é minimizar o blast radius de falhas, de modo que um único problema não leve a uma falha generalizada do sistema. Imagine um sistema de pedidos online que possui várias classes, como Pedido, Cliente e Item. Em uma situação específica, um erro ocorre no processamento de um pedido, o que pode afetar outros componentes do sistema. Vamos analisar um trecho de código em Java que exemplifica isso:

```java
class Pedido {
    Cliente cliente;
    List<Item> itens;

    public void processar() {
        try {
            // Processa o pedido
            // ...
            double desconto = calcularDesconto();
            aplicarDesconto(desconto);
            // ...
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private double calcularDesconto() {
        // Um erro ocorre aqui, por exemplo, divisão por zero
        int quantidadeTotal = cliente.getQuantidadeTotalPedidos();
        return 100.0 / (quantidadeTotal - 1);
    }

    private void aplicarDesconto(double desconto) {
        for (Item item : itens) {
            item.setPreco(item.getPreco() * (1 - desconto / 100));
        }
    }
}
```

Neste exemplo, um erro ocorre no método `calcularDesconto()`, onde uma divisão por zero pode acontecer se o cliente tiver apenas um pedido (quantidadeTotal - 1 == 0). O "blast radius" refere-se à extensão dos impactos desse erro no resto do sistema. No caso do nosso exemplo, o erro pode ter um impacto nos seguintes pontos:

* O método `processar()` captura a exceção, mas não lida adequadamente com ela, o que significa que o pedido não é processado corretamente.
* O método `aplicarDesconto()` pode não ser chamado devido ao erro, fazendo com que o desconto não seja aplicado aos itens do pedido.

Para minimizar o "blast radius" neste exemplo, poderíamos aplicar práticas de programação mais robustas e resilientes, como:

* Utilizar um tratamento de exceções mais específico e talvez aplicar um desconto padrão se o cálculo do desconto falhar.
* Separar o cálculo e a aplicação do desconto em componentes independentes e monitorar cada etapa cuidadosamente.

Dessa forma, um erro em uma parte do código teria um impacto menor em outras partes do sistema, reduzindo o "raio de impacto" e melhorando a resiliência geral do sistema. Para mais informações sobre o conceito de blast radius, consulte **https://en.wikipedia.org/wiki/Blast_radius**.

## Complexidade dos sistemas modernos

![img#center](images/chaos/geo06.png#center)

Para decidir se a Engenharia do Caos faz sentido em seu sistema, é necessário entender a diferença entre sistemas simples e complexos. Sistemas simples são geralmente lineares, onde uma mudança na entrada resulta em uma mudança correspondente na saída. Já os sistemas complexos são não lineares, apresentando resultados imprevisíveis e interações complexas entre suas partes. Sistemas complexos possuem tantas partes móveis ou mudanças rápidas que é impossível para uma pessoa compreender tudo. Isso torna difícil simular ou modelar o comportamento desses sistemas. No mundo do software, muitos sistemas são complexos e tendem a aumentar sua complexidade com o tempo.

Com o aumento dos sistemas complexos, o papel tradicional do arquiteto de software torna-se menos relevante. Em sistemas simples, um arquiteto pode coordenar o trabalho de vários engenheiros, pois consegue compreender todo o sistema. Já em sistemas complexos, isso se torna inviável, exigindo maior envolvimento dos engenheiros no projeto do sistema. Em sistemas complexos, a divisão de trabalho burocrático, com pessoas decidindo o que fazer e como fazer, torna-se contraproducente, pois aqueles que têm maior contexto são os que realmente executam o trabalho. Isso leva à adoção de estruturas organizacionais menos burocráticas para construir, interagir e responder de forma eficaz a esses sistemas.

A Engenharia do Caos é uma abordagem especialmente relevante no contexto de sistemas complexos e modernos, como os sistemas distribuídos e microsserviços. Esses sistemas são compostos por múltiplos componentes interconectados que funcionam em conjunto para fornecer um serviço ou aplicativo. Devido à sua natureza descentralizada, sistemas distribuídos são propensos a falhas e problemas inesperados, o que torna a Engenharia do Caos uma prática valiosa para garantir sua resiliência e confiabilidade. E embora o nome "Engenharia do Caos" possa assustar à primeira vista, a proposta não é gerar o caos, mas sim aprender a lidar com ele e melhorar a robustez dos sistemas. A ideia é realizar experimentos controlados e intencionais, introduzindo falhas e estresse nos sistemas, para entender como eles se comportam nessas situações e identificar áreas de melhoria. Aqui estão alguns cases reais em que a adoção da Engenharia do Caos fez uma diferença significativa na resiliência e confiabilidade dos sistemas:

* **Netflix**: Como mencionado anteriormente, a Netflix foi pioneira na Engenharia do Caos. Eles criaram o Chaos Monkey, uma ferramenta que seleciona aleatoriamente e desativa servidores em seu ambiente de produção. Essa prática ajudou a Netflix a identificar pontos fracos em sua infraestrutura e aprimorar a resiliência de seus sistemas, garantindo a continuidade do serviço mesmo diante de falhas de componentes.

* **Amazon**: A Amazon adotou a Engenharia do Caos em suas operações, incluindo o desenvolvimento do AWS, seu serviço de computação em nuvem. A empresa utiliza o **[GameDay]()**, um exercício que simula cenários de falha e interrupção, permitindo que as equipes aprendam a lidar com essas situações e melhorem a resiliência de seus sistemas. Como resultado, a AWS tem sido capaz de manter altos níveis de confiabilidade e disponibilidade para seus clientes.
* **Google**: O Google também adotou a Engenharia do Caos em sua infraestrutura global. Eles realizam exercícios chamados "DiRT" **[Disaster Recovery Testing]()**, nos quais simulam falhas e incidentes em larga escala para testar a resiliência de seus sistemas. Esses testes ajudaram o Google a identificar áreas de melhoria e garantir a continuidade dos serviços mesmo em situações adversas.
* **Facebook**: O Facebook utiliza uma abordagem de Engenharia do Caos chamada **[Storm]()**, que consiste em simular falhas em servidores e data centers para testar a resiliência de seus sistemas. Esses testes permitiram que a empresa identificasse e corrigisse vulnerabilidades, melhorando a estabilidade e a confiabilidade de suas plataformas.
* **LinkedIn:** O LinkedIn adotou a Engenharia do Caos em seus sistemas, desenvolvendo uma plataforma chamada **[Waterbear]()**. Essa plataforma permite que a empresa simule diferentes cenários de falha e teste a resiliência de seus sistemas. Como resultado, o LinkedIn tem sido capaz de aprimorar a confiabilidade de seus serviços e garantir a continuidade das operações.

### Engenharia do Chaos e Testes de Software

Testes de software e Engenharia do Caos são abordagens complementares para garantir a qualidade, a confiabilidade e a robustez de um sistema de software, mas possuem objetivos e métodos distintos.

Testes de software envolvem a verificação e validação do funcionamento de um sistema de acordo com os requisitos e expectativas. Os testes de software podem incluir testes unitários, testes de integração, testes funcionais, testes de desempenho, testes de segurança, entre outros. O objetivo é identificar e corrigir defeitos, garantir a qualidade do código e o cumprimento das especificações. Engenharia do Caos, por outro lado, é uma abordagem proativa para melhorar a resiliência e a confiabilidade de sistemas distribuídos e complexos. A Engenharia do Caos envolve a injeção intencional de falhas e perturbações no ambiente de produção para identificar pontos fracos e comportamentos inesperados do sistema em situações de estresse e falhas. O objetivo é revelar fragilidades e melhorar a capacidade do sistema de se recuperar e se adaptar a condições adversas.

A principal diferença entre os testes de software e a Engenharia do Caos é que os testes de software se concentram na verificação do funcionamento correto do sistema em condições normais, enquanto a Engenharia do Caos busca avaliar e melhorar a resiliência do sistema em condições extremas e caóticas. Ambas as abordagens são importantes para garantir sistemas de software de alta qualidade e confiáveis. Vamos ilustrar a diferença entre testes de software e Engenharia do Caos usando exemplos práticos, incluindo testes unitários e outros tipos de testes:

**Testes de software:**

* **Testes unitários**: Esses testes focam em verificar a funcionalidade de uma única unidade de código, como uma função ou um método. O objetivo é garantir que cada parte individual do sistema esteja funcionando corretamente e de acordo com as especificações. Por exemplo, se você tem uma função que calcula a área de um retângulo, o teste unitário verificaria se a função retorna o valor correto para várias combinações de comprimento e largura.
* **Testes de integração**: Esses testes visam validar a interação entre diferentes componentes do sistema, garantindo que eles trabalhem juntos conforme esperado. Por exemplo, você pode ter um sistema que inclui um frontend, um backend e um banco de dados. Os testes de integração verificariam se as requisições do frontend são corretamente processadas pelo backend e se os dados são adequadamente armazenados e recuperados do banco de dados.
* **Testes de desempenho**: Esses testes avaliam a capacidade do sistema de lidar com cargas de trabalho específicas, como um grande número de usuários simultâneos ou um volume elevado de requisições. O objetivo é identificar gargalos e garantir que o sistema possa atender às demandas esperadas. Por exemplo, um teste de desempenho pode simular milhares de usuários acessando um site simultaneamente para verificar se o site mantém um tempo de resposta aceitável.

**Engenharia do Caos**:

* **Injeção de latência**: Um exemplo prático de Engenharia do Caos é a injeção de latência nos serviços de um sistema distribuído. Isso pode envolver a introdução de atrasos deliberados nas respostas de um serviço para simular problemas de rede ou sobrecarga no serviço. O objetivo é avaliar como o sistema lida com essas condições adversas e verificar se as medidas de tolerância a falhas, como timeouts e fallbacks, estão funcionando corretamente.
* **Desligamento de instâncias**: Outro exemplo de Engenharia do Caos é desligar instâncias de serviços ou componentes do sistema para simular falhas de hardware ou erros de configuração. Isso ajuda a identificar pontos únicos de falha e testar mecanismos de recuperação, como balanceamento de carga e autoescalabilidade.
* **Ataques de segurança simulados**: A Engenharia do Caos também pode incluir a simulação de ataques de segurança, como injeção de SQL ou ataques DDoS, para avaliar a resiliência do sistema a ameaças e verificar se as medidas de segurança estão funcionando conforme esperado.

## Cultura

A adoção da Engenharia do Caos em uma organização exige uma mudança cultural significativa. Essa mudança é fundamental para garantir que a equipe esteja alinhada com os princípios e objetivos da Engenharia do Caos e possa trabalhar juntos para criar sistemas mais resilientes e confiáveis. Vamos explorar alguns aspectos dessa mudança cultural de maneira didática.

1. **Primeiro**, é importante criar uma mentalidade de aceitação de falhas. A Engenharia do Caos se baseia na ideia de que falhas são inevitáveis e que é melhor aprender com elas em um ambiente controlado do que enfrentá-las em situações reais e imprevisíveis. Isso significa que as equipes devem estar dispostas a enfrentar as falhas, analisá-las e aprender com elas, em vez de simplesmente evitá-las ou temê-las.

2. **Em segundo lugar**, a cultura de aprendizado contínuo deve ser incentivada. A Engenharia do Caos é um processo iterativo, no qual as equipes realizam experimentos, analisam os resultados e aplicam melhorias com base no que aprenderam. Isso requer uma abordagem de mentalidade de crescimento, na qual as equipes estão constantemente buscando oportunidades para aprimorar seus sistemas e suas habilidades.

3. **Terceiro**, é crucial promover a colaboração e a comunicação entre as equipes. A Engenharia do Caos envolve a realização de experimentos que afetam várias partes do sistema, o que significa que várias equipes podem ser impactadas e precisarão trabalhar juntas para identificar e solucionar problemas. Isso exige uma cultura de cooperação e transparência, na qual as equipes compartilham informações e trabalham em conjunto para alcançar objetivos comuns.

Além disso, a liderança da organização deve apoiar e promover a adoção da Engenharia do Caos. Isso pode incluir a criação de políticas e procedimentos que incentivem a experimentação, o fornecimento de recursos e ferramentas necessárias para realizar experimentos de Engenharia do Caos e a comunicação clara dos benefícios e objetivos dessa prática para toda a organização. Por fim, é importante lembrar que a adoção da Engenharia do Caos é um processo contínuo e que a mudança cultural não acontece da noite para o dia. As organizações devem estar dispostas a investir tempo e esforço na criação de uma cultura que apoie a Engenharia do Caos e estar preparadas para ajustar e adaptar suas práticas conforme necessário. Para saber mais sobre a cultura da Engenharia do Caos, confira o artigo **[Chaos Engineering is Not Just Tools—It's Culture](https://www.gremlin.com/blog/chaos-engineering-is-not-just-tools-its-culture/)**.

## Princípios da Engenharia do Caos

A Engenharia do Caos é uma abordagem de engenharia de software que visa melhorar a resiliência e a confiabilidade de sistemas complexos, especialmente aqueles que operam em ambientes distribuídos e em larga escala, como nuvens e microserviços. A ideia principal por trás da Engenharia do Caos é introduzir intencionalmente falhas e perturbações no sistema para identificar e corrigir pontos fracos antes que eles causem problemas reais aos usuários. Abaixo estão alguns princípios e práticas da Engenharia do Caos que podem ser aplicados em diferentes contextos:

* **Pensar em falhas como uma parte natural e inevitável dos sistemas**: A Engenharia do Caos parte do princípio de que os sistemas falharão e, portanto, é crucial estar preparado para lidar com essas falhas.
* **Proatividade**: Em vez de apenas reagir às falhas, a Engenharia do Caos busca identificar proativamente os problemas antes que eles ocorram, testando e estressando o sistema em diferentes cenários.
* **Experimentação contínua**: Os engenheiros do caos realizam experimentos regularmente para encontrar pontos fracos no sistema e melhorar sua resiliência.
* **Monitoramento e observabilidade**: É fundamental monitorar o sistema e coletar informações detalhadas sobre seu comportamento para que as equipes possam tomar decisões informadas e corrigir problemas rapidamente.
* **Aprender com os resultados dos experimentos**: Os resultados dos experimentos devem ser compartilhados e discutidos entre as equipes, e as lições aprendidas devem ser aplicadas para melhorar continuamente a resiliência do sistema.

## Práticas da Engenharia do Caos:

### GameDay

GameDay é um evento planejado no qual as equipes de engenharia, operações e outros membros da organização se reúnem para testar a resiliência de um sistema e a eficácia dos processos de resposta a incidentes. Para organizar e aplicar um Gameday, algumas etapas são seguidas. Inicialmente, é importante definir os objetivos do evento, que podem incluir a identificação de pontos fracos no sistema, o teste da eficácia dos processos de resposta a incidentes e a melhoria da comunicação entre as equipes. Em seguida, com os objetivos em mente, a equipe responsável pelo Gameday deve criar um cenário de teste realista, projetado para simular falhas ou problemas que possam ocorrer no sistema. As equipes envolvidas no Gameday devem ser informadas sobre o evento com antecedência e receber informações detalhadas sobre o cenário, as expectativas e os objetivos. 

Além disso, é importante garantir que todos os recursos necessários estejam disponíveis, como ferramentas de monitoramento, ambientes de teste e acesso a sistemas críticos. No dia do evento, as equipes executam o cenário planejado e monitoram de perto o comportamento do sistema e a eficácia das respostas aos incidentes. Durante o Gameday, é importante que as equipes se comuniquem de forma eficaz e documentem todas as ações tomadas e observações feitas. Após a conclusão do Gameday, a equipe responsável deve analisar os resultados e identificar áreas de melhoria. O aprendizado obtido durante o evento deve ser compartilhado entre todas as equipes envolvidas para que possam aplicar as melhorias necessárias ao sistema e aos processos. As vantagens dos Gamedays são diversas, incluindo a identificação de pontos fracos no sistema antes que causem problemas reais aos usuários, a melhoria dos processos de resposta a incidentes e a promoção da colaboração e comunicação entre as equipes. Além disso, os Gamedays ajudam a criar uma cultura de conscientização sobre a importância da resiliência e da preparação para lidar com falhas e problemas. Essa abordagem proativa pode resultar em sistemas mais estáveis e confiáveis, melhorando a experiência do usuário e reduzindo o tempo de inatividade do sistema. Para mais informações sobre GameDay, consulte o artigo **[Chaos Gamedays: A Step-by-Step Guide to Chaos](https://dzone.com/articles/chaos-gamedays-a-step-by-step-guide-to-chaos)**.

### DiRT

O lema do time de Engenharia de Confiabilidade de Site (SRE) do Google é "esperança não é uma estratégia". Isso reflete a filosofia central da Engenharia do Caos, que busca testar falhas em sistemas para garantir sua resiliência. Em 2006, o Google criou o programa DiRT (Disaster Recovery Testing), no qual engenheiros provocam falhas intencionais em sistemas críticos para identificar riscos não previstos. Ao testar falhas controladas, os engenheiros podem analisar e corrigir problemas com mais calma, sem a pressão de uma situação de emergência real. O programa começou com exercícios de simulação e evoluiu para testes práticos, como adicionar latência e desativar comunicações com dependências "não críticas". Com o tempo, mais equipes se envolveram, e o programa revelou várias áreas de melhoria na arquitetura do Google. Atualmente, milhares de exercícios DiRT são realizados em todo o Google. A participação é obrigatória para as equipes de SRE e incentivada em toda a empresa. Além disso, nos últimos anos, houve um foco na criação de testes automatizados para sistemas de rede e software. Esses testes facilitam a entrada no programa e auxiliam na identificação de falhas específicas da arquitetura.

A confiabilidade dos produtos do Google não é mágica, mas sim resultado de um esforço constante para desafiar suposições e preparar-se para falhas incomuns. Para garantir a confiabilidade de um sistema, é necessário esperar falhas, projetá-las com as falhas em mente e verificar continuamente a validade desses projetos. Para mais informações a cerca do DiRT, consulte o artigo **[DiRT: Disaster Recovery Testing](https://landing.google.com/sre/sre-book/chapters/dirt/)**.

### Chaos Monkey e Simian Army

![img#center](images/chaos/monkeys.png#center)

O Chaos Monkey é um aplicativo simples usado pela Netflix para melhorar a resiliência de seus sistemas. Ele seleciona aleatoriamente uma instância em um cluster e a desativa durante o horário comercial, simulando falhas reais. Isso força os engenheiros a solucionar problemas de disponibilidade do serviço, já que precisam lidar com as interrupções causadas pelo Chaos Monkey. Eventualmente, a ferramenta se tornou popular e foi adotada por outras equipes.

Em 24 de dezembro de 2012, a Netflix enfrentou um problema quando os balanceadores de carga da AWS falharam, afetando a capacidade dos clientes de escolher e transmitir vídeos. Isso levou a equipe da Netflix a questionar se um conceito semelhante ao Chaos Monkey poderia ser aplicado em uma escala maior para resolver problemas como o desaparecimento de regiões inteiras de servidores. Em resumo, o Chaos Monkey é uma ferramenta que ajuda a melhorar a robustez dos sistemas, forçando os engenheiros a lidar com falhas reais. Embora tenha sido eficaz em pequena escala, a Netflix ainda busca soluções para problemas maiores, como falhas em regiões inteiras. Já o Simian Army surgiu como uma evolução do Chaos Monkey na Netflix por volta de 2011. A ideia inicial do Chaos Monkey de introduzir falhas em instâncias de servidores para testar a resiliência do sistema provou ser eficaz, e a Netflix decidiu expandir esse conceito para outros cenários e falhas mais complexas.

O Simian Army é um conjunto de ferramentas e agentes de software que simulam várias falhas e condições adversas em ambientes de produção. Cada "macaco" no Simian Army tem uma finalidade específica, e juntos, eles ajudam a garantir que os sistemas da Netflix sejam resilientes, escaláveis e tolerantes a falhas. Para organizar e aplicar Chaos Monkey e Simian Army, siga estas etapas:

* **Configuração das ferramentas**: Comece configurando e personalizando o Chaos Monkey e as outras ferramentas da Simian Army para se adequarem ao seu ambiente de nuvem e aos requisitos específicos de seus sistemas.
* **Definição de escopo e objetivos**: Determine os objetivos e o escopo de sua implementação do Chaos Monkey e Simian Army, como identificar pontos fracos no sistema, melhorar a resiliência e garantir a recuperação rápida de falhas.
* **Implementação e monitoramento**: Implemente o Chaos Monkey e as outras ferramentas da Simian Army em seu ambiente de nuvem. Monitore as ações das ferramentas e o comportamento do sistema em resposta às falhas intencionalmente induzidas.
* **Análise e ajuste**: Analise os resultados dos testes e identifique áreas de melhoria em seu sistema e processos. Faça ajustes e correções conforme necessário para aumentar a resiliência e a capacidade de recuperação do sistema.
* **Iteração e melhoria contínua**: Execute regularmente o Chaos Monkey e a Simian Army para garantir que seu sistema continue resiliente e adaptável às mudanças nas condições e requisitos.

As vantagens de usar o Chaos Monkey e a Simian Army incluem a identificação proativa de vulnerabilidades e pontos fracos nos sistemas antes que causem problemas reais aos usuários. Ao testar regularmente a resiliência do sistema e melhorar a capacidade de recuperação em caso de falhas, as organizações podem reduzir o tempo de inatividade e melhorar a experiência do usuário. Além disso, o Chaos Monkey e a Simian Army ajudam a criar uma cultura de conscientização sobre a importância da resiliência e da preparação para lidar com falhas e problemas. Essa abordagem proativa resulta em sistemas mais estáveis, confiáveis e adaptáveis, capazes de enfrentar as incertezas e desafios inerentes aos ambientes de nuvem e de tecnologia em constante evolução. Para mains informações sobre Chaos Monkey e Simian Army, consulte a documentação oficial em **[https://netflix.github.io/chaosmonkey/](https://netflix.github.io/chaosmonkey/)**.

### Chaos Kong

O Chaos Kong surgiu por volta de 2012, após um incidente no Natal em que a Netflix enfrentou uma interrupção no serviço devido a uma falha na infraestrutura da AWS. Esse evento destacou a necessidade de a empresa criar uma solução mais resiliente e capaz de lidar com falhas em grande escala, como o desaparecimento de uma região inteira da AWS. A proposta do Chaos Kong é simular a falha de uma região inteira da AWS e garantir que a Netflix possa transferir o tráfego de clientes para outra região funcionando normalmente. Ao realizar esses testes regularmente, a Netflix pode identificar e corrigir problemas em seu sistema, melhorando sua capacidade de se recuperar rapidamente de falhas reais.

O Chaos Kong foi desenvolvido para complementar o Chaos Monkey, que já estava em vigor na Netflix e focava em lidar com falhas em menor escala, como instâncias individuais desaparecendo. Juntos, o Chaos Monkey e o Chaos Kong ajudam a empresa a criar um sistema mais robusto e resiliente, capaz de enfrentar falhas tanto em pequena quanto em grande escala. Para mais informações sobre o Chaos Kong, consulte a documentação oficial em **[](https://netflix.github.io/chaosmonkey/)**.

## Falhas notórias

Embora a Engenharia do Caos seja uma prática projetada para melhorar a resiliência e a confiabilidade dos sistemas, ela também destaca falhas notórias com potencial para causar danos significativos. Vamos explorar alguns exemplos de falhas notórias:

* **Falhas de infraestrutura**: Falhas em componentes de hardware, redes e serviços de nuvem, como o apagão da Amazon Web Services (AWS) em 2017, que afetou uma ampla gama de serviços e sites dependentes da AWS.
* **Erros de software**: Erros de programação e falhas de software que levam a problemas significativos, como o bug do milênio (Y2K), que foi causado pela representação incorreta de datas nos sistemas de computador.
* **Falhas de escalabilidade e desempenho**: Quando os sistemas não conseguem lidar com a carga, resultando em falhas e degradação do desempenho. Um exemplo é a falha do site da HealthCare.gov em 2013, quando o tráfego massivo de usuários tentando se inscrever no programa de saúde causou problemas de desempenho e indisponibilidade do site.
* **Problemas de segurança e violações de dados**: Falhas que resultam em violações de segurança, como o ataque cibernético ao Equifax em 2017, no qual informações pessoais de milhões de pessoas foram comprometidas.
* **Falhas de integração e dependência**: Problemas causados por falhas em sistemas interdependentes ou na integração de componentes de software. Um exemplo é a falha do sistema de reserva da British Airways em 2017, que resultou em cancelamentos e atrasos de voos devido a problemas com a comunicação entre os sistemas da empresa.

A Engenharia do Caos é uma abordagem que pode ajudar a prevenir ou mitigar esses tipos de falhas, identificando e corrigindo problemas potenciais em sistemas antes que causem interrupções significativas ou danos. Ao realizar experimentos de caos, as organizações podem aumentar a resiliência de seus sistemas e estar melhor preparadas para lidar com falhas inesperadas.

## Benefícios

Um dos principais benefícios da Engenharia do Caos é a capacidade de identificar e mitigar pontos fracos e vulnerabilidades nos sistemas. Ao introduzir falhas intencionalmente, os engenheiros podem observar como o sistema se comporta sob condições adversas e identificar áreas onde melhorias são necessárias. Essa prática permite que a equipe antecipe e corrija problemas antes que se tornem críticos, melhorando assim a estabilidade e a confiabilidade do sistema em produção. Outro benefício importante é o desenvolvimento de uma mentalidade de resiliência entre os membros da equipe. A adoção da Engenharia do Caos incentiva os engenheiros a projetar e desenvolver sistemas que sejam capazes de se recuperar rapidamente de falhas e continuar funcionando em condições adversas. Isso resulta em um produto mais robusto e confiável que pode lidar com as incertezas e variações inerentes aos ambientes de produção.

Além disso, a Engenharia do Caos promove uma cultura de aprendizado e melhoria contínua. Ao testar proativamente os sistemas em produção e aprender com os resultados desses experimentos, os engenheiros podem aprimorar continuamente o sistema e desenvolver soluções mais eficazes para lidar com problemas emergentes. Essa cultura de aprendizado ajuda a garantir que a equipe esteja sempre pronta para enfrentar novos desafios e se adaptar às mudanças nas condições do ambiente de produção. A aplicação da Engenharia do Caos também ajuda a equipe a desenvolver habilidades importantes para lidar com incidentes em tempo real. Ao conduzir experimentos de caos e analisar as respostas do sistema, os engenheiros podem melhorar suas habilidades de solução de problemas e diagnóstico de falhas, tornando-os mais eficazes na resolução de incidentes em produção quando ocorrem.

Por fim, a adoção da Engenharia do Caos pode aumentar a confiança dos clientes e usuários finais no sistema. Quando um sistema é comprovadamente resiliente e confiável, mesmo sob condições adversas, os clientes têm maior probabilidade de confiar na solução e continuar a usá-la. Isso pode levar a uma maior satisfação do cliente, retenção e sucesso a longo prazo para a organização. Em resumo, a adoção de práticas de Engenharia do Caos em um ambiente produtivo pode proporcionar melhorias significativas na resiliência, confiabilidade e desempenho dos sistemas. Além disso, pode promover uma cultura de aprendizado e melhoria contínua, desenvolver habilidades de solução de problemas e aumentar a confiança dos clientes no sistema.

## Ferramentas e frameworks

Aqui estão algumas das principais ferramentas e frameworks de Engenharia do Caos:

* **Chaos Monkey**: É uma ferramenta de código aberto desenvolvida pela Netflix que aleatoriamente encerra instâncias de serviço em um ambiente de produção para testar a capacidade de um sistema de se recuperar de falhas. Site oficial: **https://netflix.github.io/chaosmonkey/**
* **Gremlin**: É uma plataforma de Engenharia do Caos como serviço que permite que as organizações testem a resiliência de seus sistemas através de ataques controlados e gerenciados. Site oficial: **https://www.gremlin.com/**
* **Chaos Toolkit**: É um kit de ferramentas de código aberto que fornece um conjunto de recursos para projetar, executar e analisar experimentos de Engenharia do Caos. Site oficial: **https://chaostoolkit.org/**
* **LitmusChaos**: É uma plataforma de código aberto para Engenharia do Caos em Kubernetes que permite executar experimentos de caos para testar a resiliência de aplicativos e infraestrutura. Site oficial: **https://litmuschaos.io/**
* **PowerfulSeal**: É uma ferramenta de Engenharia do Caos de código aberto que adiciona falhas a clusters Kubernetes para testar a resiliência dos aplicativos e serviços implantados. Site oficial: **https://github.com/bloomberg/powerfulseal**
* **Chaos Mesh**: É uma plataforma de Engenharia do Caos de código aberto que permite executar experimentos de caos em Kubernetes para testar a resiliência de aplicativos e infraestrutura em nuvem. Site oficial: **https://chaos-mesh.org/**
* **GameDays**: Desenvolvido pela Amazon Web Services, o GameDays é um evento organizado para testar a resiliência e a escalabilidade dos sistemas em um ambiente controlado. Site oficial: **https://aws.amazon.com/gameday/**

Essas ferramentas e frameworks são projetados para ajudar as organizações a testar e melhorar a resiliência de seus sistemas através de experimentos de Engenharia do Caos. Ao utilizar essas soluções, as equipes de engenharia podem identificar e corrigir problemas potenciais antes que causem interrupções no ambiente de produção.

## Desafio e estratégias na adoção

Existem vários desafios na adoção da Engenharia do Caos. Um deles é a cultura organizacional, que requer uma mudança na mentalidade para aceitar e abraçar a ideia de introduzir falhas intencionais nos sistemas. Muitas organizações ainda são resistentes a essa abordagem e podem ter dificuldades em adotá-la. Outro desafio é a falta de conhecimento e experiência com as práticas e ferramentas de Engenharia do Caos. Isso pode dificultar a implementação bem-sucedida de experimentos de caos, pois as equipes podem não saber como planejar, executar e analisar experimentos corretamente.

Além disso, a coordenação entre equipes é crucial para o sucesso da Engenharia do Caos. Sem uma comunicação eficaz e a colaboração entre as equipes de desenvolvimento, operações e infraestrutura, os experimentos podem levar a interrupções não planejadas e causar mais problemas do que soluções. Também é importante garantir que os sistemas e processos de monitoramento e alerta estejam em vigor antes de iniciar os experimentos de Engenharia do Caos. Sem o monitoramento adequado, as equipes podem não ser capazes de identificar e corrigir problemas rapidamente. Por último, a medição e a análise dos resultados dos experimentos de Engenharia do Caos são fundamentais para melhorar a resiliência dos sistemas. No entanto, as organizações podem enfrentar desafios para coletar, analisar e aprender com os dados gerados durante os experimentos. Superar esses desafios é fundamental para uma adoção bem-sucedida da Engenharia do Caos e para garantir que os sistemas se tornem mais resilientes e capazes de lidar com falhas inesperadas.

## Conclusão

A Engenharia do Caos é uma prática importante e valiosa que visa melhorar a resiliência e a confiabilidade dos sistemas e infraestruturas de TI. Por meio da introdução intencional de falhas e da realização de experimentos controlados, as organizações podem identificar e corrigir problemas antes que causem interrupções ou impactos negativos. No entanto, a adoção da Engenharia do Caos não está isenta de desafios, como a resistência à mudança na cultura organizacional, a falta de conhecimento e experiência, e a necessidade de colaboração entre equipes. Para superar esses obstáculos, é crucial que as organizações invistam na educação e no treinamento das equipes, bem como na implementação de processos e ferramentas adequados para facilitar a colaboração e a comunicação eficaz. Além disso, o estudo de falhas notórias em sistemas e infraestruturas de TI pode fornecer insights valiosos sobre as áreas em que a Engenharia do Caos pode ser aplicada para evitar problemas semelhantes no futuro. Ao aprender com esses casos e aplicar os princípios e práticas da Engenharia do Caos, as organizações podem aumentar a resiliência de seus sistemas e estar melhor preparadas para enfrentar as inevitáveis falhas e desafios que surgem no mundo dinâmico e complexo da tecnologia da informação.

---

## Referências

* **[Chaos Engineering](https://www.oreilly.com/library/view/chaos-engineering/9781491988459/)** - Este livro, escrito por Nora Jones, Casey Rosenthal, e outros membros da equipe de Engenharia de Resiliência da Netflix, apresenta uma introdução abrangente à Engenharia do Caos e como aplicá-la na prática.
* **[Site Reliability Engineering](https://landing.google.com/sre/books/)** - Este livro, escrito por engenheiros do Google, aborda as práticas e princípios da Engenharia de Confiabilidade do Site (SRE), que inclui a Engenharia do Caos como uma de suas abordagens fundamentais para garantir a resiliência dos sistemas.
* **[Chaos Engineering: Crash Test Your Applications](https://www.manning.com/books/chaos-engineering)** - Este livro de Russ Miles oferece uma introdução prática e orientada a exemplos sobre como aplicar a Engenharia do Caos em sistemas modernos de software.
* **[Principles of Chaos Engineering](https://principlesofchaos.org/)** - Este site apresenta os princípios fundamentais da Engenharia do Caos e fornece informações adicionais sobre como aplicá-los na prática.
* **[The Art of Capacity Planning](https://principlesofchaos.org/)** - Escrito por John Allspaw, este livro explora a importância do planejamento de capacidade e monitoramento de sistemas para garantir escalabilidade e resiliência, aspectos relacionados à Engenharia do Caos.
* **[Chaos and Resilience - A Collection of Chaos Engineering Resources](https://github.com/dastergon/awesome-chaos-engineering)** - Este repositório GitHub, mantido por Vassilis Georgitzikis, é uma coleção abrangente de recursos e links relacionados à Engenharia do Caos, incluindo artigos, apresentações, ferramentas e estudos de caso.

