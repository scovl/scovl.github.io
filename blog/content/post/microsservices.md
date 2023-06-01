# CAPÍTULO 1

## O que são Microservices?

Microservices se tornaram uma escolha de arquitetura cada vez mais popular na última década, desde que escrevi a primeira edição deste livro. Não posso receber crédito pela subsequente explosão de popularidade, mas a corrida para utilizar arquiteturas de microservices significa que, embora muitas das ideias que eu capturei anteriormente agora sejam testadas e comprovadas, novas ideias surgiram ao mesmo tempo em que práticas anteriores caíram em desuso. Portanto, mais uma vez é hora de destilar a essência da arquitetura de microservices, destacando os conceitos principais que tornam os microservices funcionais. Este livro como um todo foi projetado para fornecer uma visão geral ampla do impacto que os microservices têm em vários aspectos da entrega de software. Para começar, este capítulo analisará as ideias principais por trás dos microservices, as contribuições anteriores que nos trouxeram até aqui e algumas razões pelas quais essas arquiteturas são amplamente utilizadas.

## Microservices em um relance

Microservices são serviços independentemente lançáveis que são modelados em torno de um domínio de negócios. Um serviço encapsula funcionalidades e as torna acessíveis a outros serviços por meio de redes - você constrói um sistema mais complexo a partir desses blocos de construção. Um microservice pode representar o inventário, outro o gerenciamento de pedidos e ainda outro o envio, mas juntos eles podem constituir um sistema de comércio eletrônico inteiro. Os microservices são uma escolha de arquitetura focada em fornecer muitas opções para resolver os problemas que você pode enfrentar. Eles são um tipo de arquitetura orientada a serviços, embora seja uma arquitetura opinativa sobre como devem ser desenhados os limites de serviço e na qual a implantação independente é fundamental. Eles são independentes de tecnologia, o que é uma das vantagens que oferecem.

Do ponto de vista externo, um único microservice é tratado como uma caixa-preta. Ele hospeda funcionalidades comerciais em um ou mais pontos de extremidade de rede (por exemplo, uma fila ou uma API REST, conforme mostrado na Figura 1-1), por meio de protocolos mais adequados. Consumidores, sejam outros microservices ou outros tipos de programas, acessam essa funcionalidade por meio desses pontos de extremidade em rede. Detalhes internos de implementação (como a tecnologia em que o serviço é escrito ou a forma como os dados são armazenados) estão completamente ocultos para o mundo exterior. Isso significa que as arquiteturas de microservices evitam o uso de bancos de dados compartilhados na maioria das circunstâncias; em vez disso, cada microservice encapsula seu próprio banco de dados quando necessário.

Figura 1-1. Um microservice expondo sua funcionalidade por meio de uma API REST e um tópico

Os microservices abraçam o conceito de ocultação de informações. Ocultação de informações significa esconder o máximo de informações possível dentro de um componente e expor o mínimo possível por meio de interfaces externas. Isso permite uma separação clara entre o que pode mudar facilmente e o que é mais difícil de mudar. A implementação oculta para partes externas pode ser alterada livremente, desde que as interfaces em rede que o microservice expõe não mudem de maneira incompatível com versões anteriores. Mudanças dentro do limite de um microservice (conforme mostrado na Figura 1-1) não devem afetar um serviço upstream. Um equívoco comum é que um microservice deve ser pequeno. A realidade é que o tamanho é relativo. Pergunte a opinião de um desenvolvedor que trabalha em um monólito de um milhão de linhas de código e ele dirá que é realmente fácil de entender. Pergunte a opinião de alguém totalmente novo no projeto e ele achará que é muito grande. Da mesma forma, pergunte a uma empresa que acabou de embarcar em sua transição para microservices e que talvez tenha 10 ou menos microservices, e você obterá uma resposta diferente daquela que obteria de uma empresa de tamanho semelhante que utiliza microservices como norma há muitos anos e agora tem centenas.

Recomendo às pessoas que não se preocupem com o tamanho. Quando você está começando, é muito mais importante que você se concentre em duas coisas principais. Primeiro, quantos microservices você pode lidar? À medida que você tem mais serviços, a complexidade do seu sistema aumentará, e você precisará aprender novas habilidades (e talvez adotar nova tecnologia) para lidar com isso. Uma transição para microservices introduzirá novas fontes de complexidade, com todos os desafios que isso pode trazer. Por esse motivo, sou um defensor fervoroso da migração incremental para uma arquitetura de microservices. Segundo, como você define os limites de microservice para obter o máximo deles, sem que tudo se torne uma bagunça horrivelmente acoplada? Esses temas são muito mais importantes para se concentrar no início de sua jornada.


## Flexibilidade


Outra citação de James Lewis é que "microservices compram opções". Lewis foi intencional com suas palavras - eles compram opções. Eles têm um custo, e você precisa decidir se o custo vale as opções que você deseja adotar. A flexibilidade resultante em vários aspectos - organizacional, técnico, escala, robustez - pode ser incrivelmente atrativa. Não sabemos o que o futuro reserva, então gostaríamos de ter uma arquitetura que, teoricamente, possa nos ajudar a resolver quaisquer problemas que possamos enfrentar no futuro. Encontrar um equilíbrio entre manter suas opções abertas e suportar o custo de arquiteturas como essa pode ser uma verdadeira arte.

Pense em adotar microservices como algo menos como ligar um interruptor e mais como girar um botão. À medida que você gira o botão e tem mais microservices, você aumenta a flexibilidade. Mas você também aumenta os pontos problemáticos. Esta é mais uma razão pela qual eu defendo fortemente a adoção incremental de microservices. Ao girar o botão gradualmente, você é capaz de avaliar melhor o impacto à medida que avança e parar, se necessário.

## Alinhamento de Arquitetura e Organização

A MusicCorp, uma empresa de comércio eletrônico que vende CDs online, utiliza a simples arquitetura de três camadas mostrada anteriormente na Figura 1-2. Decidimos mover a MusicCorp aos trancos e barrancos para o século 21, e como parte disso, estamos avaliando a arquitetura do sistema existente. Temos uma interface de usuário baseada na web, uma camada de lógica de negócios na forma de um backend monolítico e armazenamento de dados em um banco de dados tradicional. Essas camadas, como é comum, são de propriedade de equipes diferentes. Voltaremos aos desafios da MusicCorp ao longo do livro.

## Resumo

Arquiteturas de microservices podem proporcionar um grande grau de flexibilidade na escolha de tecnologia, lidar com robustez e escalabilidade, organizar equipes e muito mais. Essa flexibilidade é em parte o motivo pelo qual muitas pessoas estão adotando arquiteturas de microservices. No entanto, os microservices também trazem consigo um grau significativo de complexidade, e você precisa garantir que essa complexidade seja justificada. Para muitos, eles se tornaram a arquitetura padrão do sistema, a ser usada em praticamente todas as situações. No entanto, ainda acredito que eles são uma escolha arquitetônica cujo uso deve ser justificado pelos problemas que você está tentando resolver; muitas vezes, abordagens mais simples podem ser implementadas com muito mais facilidade.

No entanto, muitas organizações, especialmente as maiores, demonstraram a eficácia dos microservices. Quando os conceitos principais dos microservices são compreendidos e implementados corretamente, eles podem ajudar a criar arquiteturas capacitadoras e produtivas que permitem que os sistemas se tornem mais do que a soma de suas partes. Espero que este capítulo tenha servido como uma boa introdução a esses tópicos. Em seguida, vamos analisar como definimos os limites dos microservices, explorando os tópicos de programação estruturada e design orientado ao domínio ao longo do caminho.

---

# CAPÍTULO 2

2 O ponto de partida óbvio é o resumo de Adrian de "On the Criteria...", mas a cobertura de Adrian do trabalho anterior de Parnas, "Information Distribution Aspects of Design Methodology", contém insights excelentes junto com comentários de Parnas.

3 Parnas, "Information Distribution Aspects."

## Compreensibilidade

Cada módulo pode ser analisado e compreendido isoladamente. Isso, por sua vez, facilita a compreensão do que o sistema como um todo faz.

## Flexibilidade

Os módulos podem ser alterados independentemente uns dos outros, permitindo que alterações sejam feitas na funcionalidade do sistema sem exigir que outros módulos sejam alterados. Além disso, os módulos podem ser combinados de diferentes maneiras para fornecer nova funcionalidade. Essa lista de características desejáveis complementa perfeitamente o que estamos tentando alcançar com as arquiteturas de microservices - e, na verdade, agora vejo os microservices como apenas outra forma de arquitetura modular. Adrian Colyer realmente revisou vários artigos de David Parnas desse período e os examinou em relação aos microservices, e seus resumos valem a pena ser lidos. A realidade, conforme explorado por Parnas ao longo de grande parte de seu trabalho, é que ter módulos não resulta necessariamente em alcançar esses resultados. Muito depende de como os limites dos módulos são formados. A ocultação de informações foi uma técnica fundamental para aproveitar ao máximo as arquiteturas modulares, de acordo com suas próprias pesquisas, e com uma visão moderna, o mesmo se aplica aos microservices também.

De outro trabalho de Parnas, temos a seguinte joia:

"As conexões entre os módulos são as suposições que os módulos fazem uns sobre os outros."

Ao reduzir o número de suposições que um módulo (ou microservice) faz sobre outro, impactamos diretamente as conexões entre eles. Ao manter o número de suposições pequeno, é mais fácil garantir que possamos alterar um módulo sem afetar os outros. Se um desenvolvedor que está alterando um módulo compreende claramente como o módulo é usado por outros, será mais fácil para o desenvolvedor fazer alterações com segurança, de modo que os chamadores upstream não precisem alterar também. Isso se aplica aos microservices também, exceto que também temos a oportunidade de implantar esse microservice alterado sem precisar implantar mais nada, amplificando, argumentavelmente, as três características desejáveis ​​descritas por Parnas de tempo de desenvolvimento aprimorado, compreensibilidade e flexibilidade.

As implicações da ocultação de informações se manifestam de muitas maneiras, e vou explorar esse tema ao longo do livro.

O que define um bom limite para um Microservice?

## Coesão

Uma das definições mais concisas que já ouvi para descrever coesão é esta: "o código que muda junto, permanece junto". Para nossos propósitos, essa é uma definição bastante boa. Como já discutimos, estamos otimizando nossa arquitetura de microservices em torno da facilidade de fazer alterações na funcionalidade comercial - portanto, queremos agrupar a funcionalidade de forma que possamos fazer alterações em poucos lugares quanto possível. Queremos que o comportamento relacionado esteja agrupado e o comportamento não relacionado esteja em outro lugar. Por quê? Bem, se queremos alterar o comportamento, queremos ser capazes de alterá-lo em um único lugar e lançar essa alteração o mais rápido possível. Se tivermos que alterar esse comportamento em muitos lugares diferentes, teremos que lançar muitos serviços diferentes (talvez ao mesmo tempo) para fornecer essa alteração. Fazer alterações em muitos lugares diferentes é mais lento e implantar muitos serviços de uma vez é arriscado - portanto, queremos evitar ambos.

Portanto, queremos encontrar limites dentro de nosso domínio de problemas que ajudem a garantir que o comportamento relacionado esteja em um único lugar e que se comuniquem com outros limites da maneira mais solta possível. Se a funcionalidade relacionada estiver espalhada pelo sistema, dizemos que a coesão é fraca - enquanto para nossas arquiteturas de microservices, estamos buscando uma coesão forte.

## Acoplamento

Quando os serviços estão fracamente acoplados, uma alteração em um serviço não deve exigir uma alteração em outro. O objetivo principal de um microservice é poder fazer uma alteração em um serviço e implantá-lo sem precisar alterar qualquer outra parte do sistema. Isso é realmente muito importante. Quais são as coisas que causam acoplamento forte? Um erro clássico é escolher um estilo de integração que vincule fortemente um serviço a outro, fazendo com que as alterações dentro do serviço exijam uma alteração nos consumidores. Um serviço com acoplamento fraco sabe apenas o necessário sobre os serviços com os quais colabora. Isso também significa que provavelmente queremos limitar o número de tipos diferentes de chamadas de um serviço para outro, porque além do problema potencial de desempenho, uma comunicação excessiva pode levar a um acoplamento forte.

No entanto, o acoplamento vem em muitas formas, e vi algumas incompreensões sobre a natureza do acoplamento em relação à arquitetura baseada em serviços. Com isso em mente, acredito que é importante explorar esse tópico com mais detalhes, o que faremos em breve.

## O Jogo do Acoplamento e da Coesão

Como já mencionamos, os conceitos de acoplamento e coesão estão logicamente relacionados. Logicamente, se a funcionalidade relacionada estiver espalhada por nosso sistema, as alterações nessa funcionalidade afetarão esses limites, implicando um acoplamento mais estreito. A lei de Constantine, nomeada em homenagem a Larry Constantine, pioneiro do design estruturado, resume isso de forma precisa:

"Uma estrutura é estável se a coesão é forte e o acoplamento é baixo."

O conceito de estabilidade é importante para nós. Para que nossos limites de microservices cumpram a promessa de implantação independente, permitindo-nos trabalhar em microservices em paralelo e reduzir a quantidade de coordenação entre as equipes que trabalham nesses serviços, precisamos de algum grau de estabilidade nos próprios limites. Se o contrato que um microservice expõe estiver mudando constantemente de maneira incompatível com versões anteriores, isso fará com que os consumidores upstream tenham que mudar constantemente também. Acoplamento e coesão estão fortemente relacionados e, em algum nível, são argumentavelmente a mesma coisa, pois ambos os conceitos descrevem a relação entre as coisas. A coesão se aplica à relação entre as coisas dentro de um limite (um microservice em nosso contexto), enquanto o acoplamento descreve a relação entre as coisas através de um limite. Não existe uma melhor forma absoluta de organizar nosso código; acoplamento e coesão são apenas uma maneira de articular as várias compensações que fazemos em relação a onde agrupamos o código e por quê. Tudo o que podemos fazer é buscar o equilíbrio certo entre essas duas ideias, aquele que faz mais sentido para o contexto específico e os problemas que estamos enfrentando atualmente.

Lembre-se de que o mundo não é estático - é possível que, à medida que os requisitos do seu sistema mudem, você encontre razões para revisitar suas decisões. Às vezes, partes do seu sistema podem estar passando por tantas mudanças que a estabilidade pode ser impossível. Veremos um exemplo disso no Capítulo 3, quando compartilharei as experiências da equipe de desenvolvimento de produtos por trás do Snap CI.

## Tipos de Acoplamento

Você poderia inferir a partir da visão geral acima que todo acoplamento é ruim. Isso não é estritamente verdade. Em última análise, algum acoplamento em nosso sistema será inevitável. O que queremos fazer é reduzir a quantidade de acoplamento que temos. Muito trabalho foi feito para analisar as diferentes formas de acoplamento no contexto da programação estruturada, que considerava em grande parte software modular (não distribuído, monolítico). Muitos desses modelos diferentes para avaliar o acoplamento se sobrepõem ou entram em conflito, e, de qualquer forma, eles falam principalmente sobre coisas no nível do código, em vez de considerar interações baseadas em serviços. Como os microservices são um estilo de arquitetura modular (embora com a complexidade adicional de sistemas distribuídos), podemos usar muitos desses conceitos originais e aplicá-los no contexto de nossos sistemas baseados em microservices.

## Estado da Arte em Programação Estruturada

Grande parte do nosso trabalho em computação envolve construir sobre o trabalho anterior. Às vezes, é impossível reconhecer tudo o que veio antes, mas com esta segunda edição, meu objetivo é destacar a arte anterior sempre que possível - em parte para dar crédito onde o crédito é devido, em parte como uma forma de garantir que eu deixe algumas migalhas de pão para os leitores que desejam explorar determinados tópicos com mais detalhes, mas também para mostrar que muitas dessas ideias são testadas e comprovadas. Quando se trata de construir sobre o trabalho anterior, há poucas áreas deste livro que têm tanto trabalho anterior quanto a programação estruturada. Já mencionei Larry Constantine; seu livro com Edward Yourdon, "Structured Design", é considerado um dos textos mais importantes nessa área. "The Practical Guide to Structured Systems Design", de Meilir Page-Jones, também é útil. Infelizmente, esses livros têm em comum o quão difícil pode ser encontrá-los, pois estão fora de circulação e não estão disponíveis em formato eletrônico. Mais uma razão para apoiar sua biblioteca local!

Nem todas as ideias se encaixam perfeitamente, então fiz o meu melhor para sintetizar um modelo de trabalho para os diferentes tipos de acoplamento para microservices. Quando essas ideias se encaixam perfeitamente nas definições anteriores, mantive esses termos. Em outros lugares, tive que criar novos termos ou mesclar ideias de outros lugares. Portanto, considere o que segue como construído em cima de muitas ideias anteriores nesse espaço, as quais estou tentando dar mais significado no contexto dos microservices.

Na Figura 2-1, temos uma visão geral breve dos diferentes tipos de acoplamento, organizados de baixo (desejável) a alto (indesejável).

A seguir, examinaremos cada forma de acoplamento, mostrando exemplos de como essas formas podem se manifestar em nossa arquitetura de microservices.

mudanças organizacionais exigiriam apenas que o proprietário de um microservice existente fizesse a alteração. Considere uma situação em que a equipe responsável pelas operações de armazenamento anteriormente também cuidava da funcionalidade de calcular quantos itens devem ser pedidos aos fornecedores. Vamos supor que decidamos transferir essa responsabilidade para uma equipe dedicada de previsão que deseja obter informações das vendas atuais e das promoções planejadas para calcular o que precisa ser pedido. Se a equipe de armazenamento tivesse um microservice dedicado de Pedido de Fornecedor, isso poderia ser transferido para a nova equipe de previsão. Por outro lado, se essa funcionalidade estivesse anteriormente integrada em um sistema de escopo mais amplo de propriedade do armazenamento, ela poderia precisar ser separada.
Mesmo quando trabalhamos dentro de uma estrutura organizacional existente, existe o perigo de não colocarmos nossos limites no lugar certo. Há muitos anos, alguns colegas e eu estávamos trabalhando com um cliente na Califórnia, ajudando a empresa a adotar práticas de código mais limpas e avançar para testes automatizados. Começamos com algumas coisas mais fáceis, como decomposição de serviços, quando notamos algo muito mais preocupante. Não posso entrar em muitos detalhes sobre o que o aplicativo fazia, mas era um aplicativo voltado para o público com uma grande base de clientes global.

A equipe e o sistema haviam crescido. Originalmente, era a visão de uma pessoa, mas o sistema adquiriu cada vez mais recursos e mais usuários. Eventualmente, a organização decidiu aumentar a capacidade da equipe, tendo um novo grupo de desenvolvedores com base no Brasil assumindo parte do trabalho. O sistema foi dividido, sendo que a metade da frente do aplicativo era essencialmente sem estado, implementando o site voltado para o público, como mostrado na Figura 2-19. A metade de trás do sistema era simplesmente uma interface de chamada de procedimento remoto (RPC) sobre um banco de dados. Basicamente, imagine que você tenha separado uma camada de repositório em seu código e a transformado em um serviço separado.

Mudanças frequentemente tinham que ser feitas em ambos os serviços. Ambos os serviços se comunicavam por meio de chamadas de método RPC de baixo nível, que eram excessivamente frágeis (discutiremos isso mais adiante no Capítulo 4). A interface de serviço também era muito comunicativa, resultando em problemas de desempenho. Isso levou à necessidade de mecanismos elaborados de agrupamento de chamadas RPC. Eu chamava isso de "arquitetura de cebola", pois tinha muitas camadas e me fazia chorar quando tínhamos que cortá-la. Agora, olhando de fora, a ideia de dividir o sistema monolítico anterior ao longo de linhas geográficas/organizacionais faz todo sentido, como vamos expandir no Capítulo 15. No entanto, aqui, em vez de fazer uma divisão vertical focada nos negócios através do stack, a equipe optou por fazer uma divisão horizontal de uma API em processo. Um modelo melhor teria sido a equipe na Califórnia ter uma fatia vertical de ponta a ponta, consistindo das partes relacionadas da interface frontal e da funcionalidade de acesso aos dados, com a equipe no Brasil assumindo outra fatia.

## Alternativas para Limites de Domínio de Negócio

Como espero que você possa ver até agora, não sou fã de uma arquitetura com camadas horizontais. No entanto, o uso de camadas pode ter seu lugar. Dentro de um limite de microservice, pode ser totalmente sensato delimitar diferentes camadas para facilitar o gerenciamento do código. O problema ocorre quando essa estratificação se torna o mecanismo pelo qual seus limites de microservice e propriedade são definidos.

## Misturando Modelos e Exceções

Como espero que esteja claro até agora, não sou dogmático em termos de como você encontra esses limites. Se você seguir as diretrizes de ocultação de informações e compreender a interação entre acoplamento e coesão, é provável que evite algumas das piores armadilhas de qualquer mecanismo que escolher. Eu acredito que, ao focar nessas ideias, você tem mais chances de acabar com uma arquitetura orientada a domínio, mas isso é apenas um detalhe. No entanto, existem muitas vezes motivos para misturar modelos, mesmo que "orientação a domínio" seja o que você escolher como seu principal mecanismo para definir limites de microservices. Os diferentes mecanismos que delineamos até agora também têm muito potencial de interação entre eles. Ser muito restrito em suas escolhas fará com que você siga o dogma em vez de fazer o que é certo. A decomposição baseada em volatilidade pode fazer muito sentido se o seu foco for melhorar a velocidade de entrega, mas se isso fizer com que você extraia um serviço que atravessa limites organizacionais, espere que o ritmo das mudanças seja afetado devido a conflitos de entrega.

Posso definir um bom serviço de Armazém com base no meu entendimento do domínio de negócios, mas se uma parte desse sistema precisa ser implementada em C++ e outra em Kotlin, você terá que decompor ainda mais ao longo dessas linhas técnicas. Limites organizacionais e orientados a domínio são o meu ponto de partida, mas isso é apenas minha abordagem padrão. Normalmente, vários dos fatores que mencionei aqui entram em jogo, e quais deles influenciam suas próprias decisões serão baseados nos problemas que você está tentando resolver. Você precisa analisar suas circunstâncias específicas para determinar o que funciona melhor para você - e espero ter fornecido algumas opções diferentes para você considerar. Apenas lembre-se de que, se alguém disser "A única maneira de fazer isso é X!", provavelmente está apenas tentando impor um dogma. Você pode fazer melhor do que isso. Dito isso, vamos mergulhar mais fundo no tópico de modelagem de domínio, explorando o design orientado a domínio com um pouco mais de detalhes.

## Resumo

Neste capítulo, você aprendeu um pouco sobre o que torna um bom limite de microservice e como encontrar pontos de separação em nosso espaço de problemas que nos proporcionam os benefícios de baixo acoplamento e alta coesão. Ter uma compreensão detalhada do nosso domínio pode ser uma ferramenta vital para nos ajudar a encontrar esses pontos de separação e, ao alinhar nossos microservices a esses limites, garantimos que o sistema resultante tenha todas as chances de manter essas virtudes intactas. Também demos uma dica de como podemos subdividir ainda mais nossos microservices.

As ideias apresentadas no Domain-Driven Design de Eric Evans são muito úteis para encontrar limites sensíveis para nossos serviços, e aqui eu apenas arranhei a superfície - o livro de Eric aborda o assunto com muito mais detalhes. Se você quiser se aprofundar, posso recomendar o livro Implementing Domain-Driven Design de Vaughn Vernon para ajudá-lo a entender a praticidade dessa abordagem, enquanto o livro Domain-Driven Design Distilled de Vernon é uma ótima visão geral condensada se você estiver procurando por algo mais breve. Grande parte deste capítulo descreveu como encontrar o limite para nossos microservices. Mas o que acontece se você já tiver um aplicativo monolítico e estiver procurando migrar para uma arquitetura de microservices? Isso é algo que exploraremos com mais detalhes no próximo capítulo.

---

# Capítulo 3

## Dividindo o Monólito

Muitos de vocês que estão lendo este livro provavelmente não têm uma tela em branco na qual projetar seu sistema, e mesmo que tivessem, começar com microservices pode não ser uma ótima ideia, por razões que exploramos no Capítulo 1. Muitos de vocês já têm um sistema existente, talvez alguma forma de arquitetura monolítica, que vocês estão procurando migrar para uma arquitetura de microservices.
Neste capítulo, vou delinear alguns primeiros passos, padrões e dicas gerais para ajudá-lo a navegar na transição para uma arquitetura de microservices.

## Tenha um objetivo

Microservices não são o objetivo final. Você não "ganha" ao ter microservices. A adoção de uma arquitetura de microservices deve ser uma decisão consciente, baseada em tomada de decisões racionais. Você deve estar pensando em migrar para uma arquitetura de microservices apenas se não encontrar nenhuma maneira mais fácil de avançar em direção ao seu objetivo final com sua arquitetura atual. Sem um entendimento claro do que você está tentando alcançar, você pode cair na armadilha de confundir atividade com resultado. Já vi equipes obcecadas em criar microservices sem nunca perguntar por quê. Isso é extremamente problemático, dadas as novas fontes de complexidade que os microservices podem introduzir.

Focar nos microservices em vez do objetivo final também significa que você provavelmente deixará de pensar em outras maneiras pelas quais pode alcançar a mudança que está procurando. Por exemplo, os microservices podem ajudá-lo a dimensionar seu sistema, mas muitas vezes existem várias técnicas alternativas de escalabilidade que devem ser consideradas primeiro. Criar algumas cópias adicionais do seu sistema monolítico existente atrás de um balanceador de carga pode ajudar a dimensionar seu sistema de forma muito mais eficaz do que passar por uma decomposição complexa e demorada em microservices.

## Microservices não são fáceis. Comece pelas coisas simples primeiro.

Finalmente, sem um objetivo claro, torna-se difícil saber por onde começar. Qual microservice você deve criar primeiro? Sem uma compreensão abrangente do que você está tentando alcançar, você está voando às cegas. Portanto, seja claro sobre a mudança que você está tentando alcançar e considere maneiras mais fáceis de alcançar esse objetivo antes de considerar os microservices. Se os microservices realmente forem a melhor maneira de avançar, acompanhe seu progresso em relação a esse objetivo final e mude de curso conforme necessário.

## Migração Incremental

Se você fizer uma reescrita completa, a única coisa garantida é um grande estrondo.
—Martin Fowler

Se você chegar ao ponto de decidir que dividir seu sistema monolítico existente é a coisa certa a fazer, eu aconselho fortemente que você vá removendo o monolito, extraindo um pouco de cada vez. Uma abordagem incremental ajudará você a aprender sobre microservices conforme avança e também limitará o impacto de cometer erros (e você cometerá erros!). Pense no nosso monolito como um bloco de mármore. Podemos explodi-lo por completo, mas isso raramente termina bem. Faz muito mais sentido ir quebrando-o aos poucos, incrementalmente. Divida a grande jornada em muitos pequenos passos. Cada passo pode ser realizado e aprendido. Se acabar sendo um passo retrógrado, foi apenas um pequeno passo. De qualquer forma, você aprende com ele, e o próximo passo que você der será informado pelos passos anteriores.

Dividir as coisas em pedaços menores também permite identificar conquistas rápidas e aprender com elas. Isso pode ajudar a facilitar o próximo passo e construir momentum. Ao dividir os microservices um de cada vez, você também consegue aproveitar o valor que eles trazem de forma incremental, em vez de ter que esperar por uma grande implantação. Tudo isso leva ao que se tornou meu conselho padrão para pessoas que estão considerando os microservices: se você acha que os microservices são uma boa ideia, comece por algo pequeno. Escolha uma ou duas áreas de funcionalidade, implemente-as como microservices, coloque-as em produção e depois reflita se a criação de seus novos microservices ajudou você a se aproximar do seu objetivo final. Você não vai apreciar o verdadeiro horror, dor e sofrimento que uma arquitetura de microservices pode trazer até que esteja em produção.

## O Monólito Raramente é o Inimigo

Embora eu já tenha argumentado no início do livro que alguma forma de arquitetura monolítica pode ser uma escolha totalmente válida, vale a pena repetir que uma arquitetura monolítica não é intrinsecamente ruim e, portanto, não deve ser vista como o inimigo. Não se concentre em "não ter o monólito"; concentre-se nos benefícios que você espera que a mudança em sua arquitetura traga. É comum que a arquitetura monolítica existente permaneça após a transição para microservices, embora frequentemente em uma capacidade reduzida. Por exemplo, uma mudança para melhorar a capacidade do aplicativo de lidar com mais carga pode ser satisfeita removendo os 10% de funcionalidade que estão atualmente restritos, deixando os 90% restantes no sistema monolítico.

Muitas pessoas acham a realidade de um monólito e microservices coexistindo "bagunçada", mas a arquitetura de um sistema em execução no mundo real nunca é limpa ou imaculada. Se você deseja uma arquitetura "limpa", então emoldure uma versão idealizada da arquitetura do sistema que você poderia ter tido, se apenas tivesse uma visão perfeita e recursos ilimitados. A arquitetura de um sistema real é algo em constante evolução que deve se adaptar às necessidades e ao conhecimento em mudança. A habilidade está em se acostumar com essa ideia, algo sobre o qual voltarei a falar no Capítulo 16. Ao tornar sua migração para microservices uma jornada incremental, você é capaz de remover gradualmente a arquitetura monolítica existente, entregando melhorias ao longo do caminho e, importante, sabendo quando parar.

Em circunstâncias surpreendentemente raras, o desaparecimento do monólito pode ser um requisito rígido. Em minha experiência, isso muitas vezes se limita a situações em que o monólito existente é baseado em tecnologia obsoleta ou moribunda, está vinculado à infraestrutura que precisa ser desativada ou é talvez um sistema de terceiros caro do qual você deseja se livrar. Mesmo nessas situações, uma abordagem incremental para decomposição é justificada pelos motivos que mencionei.

## Os Perigos da Decomposição Prematura

Há perigo em criar microservices quando você tem uma compreensão pouco clara do domínio. Um exemplo dos problemas que isso pode causar vem da minha empresa anterior, a Thoughtworks. Um de seus produtos era o Snap CI, uma ferramenta hospedada de integração contínua e entrega contínua (discutiremos esses conceitos no Capítulo 7). O monólito inicialmente continha todas as funcionalidades do Snap CI, mas a equipe decidiu dividi-lo em microservices com base em fronteiras de funcionalidade. A equipe achou difícil definir essas fronteiras porque não tinha um entendimento claro do domínio. Consequentemente, eles tomaram decisões erradas ao separar as funcionalidades em microservices e, como resultado, o sistema se tornou mais complexo e difícil de manter.

## A integridade dos dados

Bancos de dados podem ser úteis para garantir a integridade dos nossos dados. Voltando à Figura 3-6, com as tabelas Album e Ledger estando no mesmo banco de dados, poderíamos (e provavelmente deveríamos) definir um relacionamento de chave estrangeira entre as linhas da tabela Ledger e a tabela Album. Isso garantiria que sempre pudéssemos navegar de um registro na tabela Ledger de volta às informações sobre o álbum vendido, pois não seríamos capazes de excluir registros da tabela Album se eles fossem referenciados na Ledger.

Com essas tabelas agora vivendo em bancos de dados diferentes, não temos mais a aplicação da integridade do nosso modelo de dados. Nada impede que excluamos uma linha na tabela Album, o que causa um problema quando tentamos descobrir exatamente qual item foi vendido. Até certo ponto, você simplesmente precisará se acostumar com o fato de que não pode mais depender do banco de dados para aplicar a integridade dos relacionamentos entre entidades. Obviamente, para dados que permanecem dentro de um único banco de dados, isso não é um problema.

Existem várias soluções alternativas, embora "padrões de adaptação" seria um termo melhor para as maneiras como podemos lidar com esse problema. Podemos usar uma exclusão suave (soft delete) na tabela Album para que não removamos realmente um registro, apenas marcamos como excluído. Outra opção poderia ser copiar o nome do álbum na tabela Ledger quando uma venda for feita, mas teríamos que resolver como lidar com a sincronização das alterações no nome do álbum.

## Transações

Muitos de nós passaram a depender das garantias que obtemos ao gerenciar dados em transações. Com base nessa certeza, construímos aplicativos de certa maneira, sabendo que podemos contar com o banco de dados para lidar com várias coisas para nós. No entanto, quando começamos a dividir dados em vários bancos de dados, perdemos a segurança das transações ACID às quais estamos acostumados. (Explico o acrônimo ACID e discuto transações ACID com mais profundidade no Capítulo 6).

Para as pessoas que estão migrando de um sistema em que todas as alterações de estado podiam ser gerenciadas em uma única fronteira transacional, a mudança para sistemas distribuídos pode ser um choque, e a reação geralmente é buscar implementar transações distribuídas para recuperar as garantias que as transações ACID nos proporcionavam com arquiteturas mais simples. Infelizmente, como veremos em detalhes em "Transações de banco de dados" na página 175, as transações distribuídas não apenas são complexas de implementar, mesmo quando bem feitas, mas também não nos oferecem as mesmas garantias que esperávamos das transações de banco de dados com escopo mais restrito.

Conforme exploramos em "Sagas" na página 182, existem mecanismos alternativos (e preferíveis) às transações distribuídas para gerenciar alterações de estado em vários microservices, mas eles trazem novas fontes de complexidade. Assim como a integridade dos dados, temos que nos conformar com o fato de que, ao separar nossos bancos de dados por boas razões, iremos encontrar um novo conjunto de problemas.

## Ferramentas

Mudar de banco de dados é difícil por muitos motivos, um dos quais é que existem poucas ferramentas disponíveis para facilitar as mudanças. Com código, temos ferramentas de refatoração incorporadas em nossos IDEs, e ainda temos a vantagem adicional de que os sistemas que estamos alterando são fundamentalmente sem estado. Com um banco de dados, as coisas que estamos alterando têm estado e também não temos boas ferramentas de refatoração. Existem muitas ferramentas disponíveis para ajudá-lo a gerenciar o processo de alteração do esquema de um banco de dados relacional, mas a maioria segue o mesmo padrão. Cada alteração de esquema é definida em um script de delta controlado por versão. Esses scripts são executados em uma ordem estrita de maneira idempotente. As migrações do Rails funcionam dessa maneira, assim como o DBDeploy, uma ferramenta que ajudei a criar muitos anos atrás.

Hoje em dia, recomendo o Flyway ou o Liquibase para alcançar o mesmo resultado, caso você ainda não tenha uma ferramenta que funcione dessa maneira.

## Banco de Dados de Relatórios

Como parte da extração de microservices de nossa aplicação monolítica, também dividimos nossos bancos de dados, pois queremos ocultar o acesso direto ao nosso armazenamento interno de dados. Ao ocultar o acesso direto aos nossos bancos de dados, somos capazes de criar interfaces estáveis, o que torna possível a implantação independente. Infelizmente, isso nos causa problemas quando temos casos de uso legítimos para acessar dados de mais de um microservice ou quando esses dados são mais bem disponibilizados em um banco de dados, em vez de via algo como uma API REST. Com um banco de dados de relatórios, criamos um banco de dados dedicado projetado para acesso externo, e tornamos responsabilidade do microservice enviar dados do armazenamento interno para o banco de dados de relatórios acessível externamente, como visto na Figura 3-8.

O banco de dados de relatórios nos permite ocultar o gerenciamento interno do estado, ao mesmo tempo em que apresentamos os dados em um banco de dados, o que pode ser muito útil. Por exemplo, você pode querer permitir que as pessoas executem consultas SQL definidas ad hoc, realizem junções em grande escala ou façam uso de cadeias de ferramentas existentes que esperam ter acesso a um ponto de extremidade SQL. O banco de dados de relatórios é uma solução interessante para esse problema. Há dois pontos-chave a serem destacados aqui. Em primeiro lugar, ainda queremos praticar o encapsulamento de informações. Portanto, devemos expor apenas o mínimo de dados no banco de dados de relatórios. Isso significa que o que está no banco de dados de relatórios pode ser apenas um subconjunto dos dados armazenados pelo microservice. No entanto, como isso não é um mapeamento direto, cria-se a oportunidade de criar um design de esquema para o banco de dados de relatórios que seja exatamente adaptado aos requisitos dos consumidores - isso pode envolver o uso de um esquema radicalmente diferente ou até mesmo um tipo diferente de tecnologia de banco de dados.

O segundo ponto-chave é que o banco de dados de relatórios deve ser tratado como qualquer outro ponto de extremidade de microservice, e é responsabilidade do mantenedor do microservice garantir que a compatibilidade deste ponto de extremidade seja mantida mesmo se o microservice alterar seu detalhe de implementação interna. O mapeamento do estado interno para o banco de dados de relatórios é responsabilidade das pessoas que desenvolvem o próprio microservice. Resumindo, ao migrar a funcionalidade de uma arquitetura monolítica para uma arquitetura de microservices, você deve ter uma compreensão clara do que espera alcançar. Esse objetivo moldará a forma como você realiza o trabalho e também o ajudará a entender se está avançando na direção certa. A migração deve ser incremental. Faça uma mudança, implemente essa mudança, avalie-a e continue. Até mesmo o ato de separar um microservice pode ser dividido em uma série de pequenos passos.

---

# CAPÍTULO 4

Obter a comunicação entre microservices correta é problemático para muitos devido, em grande parte, ao fato de as pessoas se inclinarem para uma abordagem tecnológica escolhida sem antes considerar os diferentes tipos de comunicação que desejam. Neste capítulo, tentarei separar os diferentes estilos de comunicação para ajudá-lo a entender os prós e contras de cada um, bem como qual abordagem se adequará melhor ao seu espaço de problema.

Vamos analisar os mecanismos de comunicação síncrona bloqueante e assíncrona não bloqueante, além de comparar a colaboração de solicitação-resposta com a colaboração orientada a eventos. Ao final deste capítulo, você estará muito melhor preparado para entender as diferentes opções disponíveis para você e terá um conhecimento fundamental que ajudará quando começarmos a analisar preocupações de implementação mais detalhadas nos capítulos seguintes.

## De In-Process para Inter-Processo

Ok, vamos começar com o que parece ser a parte fácil - ou pelo menos o que espero que seja a parte fácil. Chamadas entre processos diferentes por meio de uma rede (inter-processo) são muito diferentes de chamadas dentro de um único processo (in-process). Em um nível, podemos ignorar essa distinção. É fácil, por exemplo, pensar em um objeto fazendo uma chamada de método em outro objeto e, em seguida, apenas mapear essa interação para dois microservices se comunicando por meio de uma rede. Deixando de lado o fato de que os microservices não são apenas objetos, esse pensamento pode nos levar a muitos problemas. Vamos analisar algumas dessas diferenças e como elas podem alterar a maneira como você pensa sobre as interações entre seus microservices.

## Desempenho

O desempenho de uma chamada in-processo é fundamentalmente diferente do desempenho de uma chamada inter-processo. Quando faço uma chamada in-processo, o compilador e o tempo de execução subjacentes podem realizar uma série de otimizações para reduzir o impacto da chamada, incluindo a realização de uma invocação inline, como se nunca houvesse uma chamada em primeiro lugar. Nenhuma otimização desse tipo é possível com chamadas inter-processo. Pacotes precisam ser enviados. Espere que a sobrecarga de uma chamada inter-processo seja significativa em comparação com a sobrecarga de uma chamada in-processo. A primeira é facilmente mensurável - apenas o tempo de ida e volta de um único pacote em um data center é medido em milissegundos - enquanto a sobrecarga de fazer uma chamada de método é algo com que você não precisa se preocupar.

Isso muitas vezes leva a uma reavaliação das APIs. Uma API que faz sentido in-processo pode não fazer sentido em situações inter-processo. Posso fazer mil chamadas através de uma fronteira de API in-processo sem preocupações. Eu gostaria de fazer mil chamadas de rede entre dois microservices? Talvez não. Ao passar um parâmetro para um método, a estrutura de dados que eu passo normalmente não se move - o mais provável é que eu passe um ponteiro para uma localização de memória. Passar um objeto ou estrutura de dados para outro método não requer necessariamente que mais memória seja alocada para copiar os dados.

Ao fazer chamadas entre microservices por meio de uma rede, por outro lado, os dados realmente precisam ser serializados em alguma forma que possa ser transmitida pela rede. Os dados precisam ser enviados e desserializados no outro extremo. Portanto, talvez precisemos prestar mais atenção ao tamanho das cargas úteis enviadas entre os processos. Quando foi a última vez que você estava ciente do tamanho de uma estrutura de dados que estava passando dentro de um processo? A realidade é que provavelmente você não precisava saber; agora você precisa. Isso pode levá-lo a reduzir a quantidade de dados sendo enviados ou recebidos (talvez não seja algo ruim se pensarmos em encapsulamento de informações), escolher mecanismos de serialização mais eficientes ou até mesmo transferir dados para um sistema de arquivos e passar uma referência para a localização desse arquivo.

Essas diferenças podem não causar problemas imediatamente, mas certamente você precisa estar ciente delas. Já vi muitas tentativas de esconder do desenvolvedor o fato de que uma chamada de rede está ocorrendo. Nosso desejo de criar abstrações para esconder detalhes é uma grande parte do que nos permite fazer mais coisas de maneira mais eficiente, mas às vezes criamos abstrações que escondem demais. Um desenvolvedor precisa estar ciente se está fazendo algo que resultará em uma chamada de rede; caso contrário, não se surpreenda se acabar com gargalos de desempenho desagradáveis ​​causados por interações estranhas entre serviços que não eram visíveis para o desenvolvedor que escreveu o código. Isso adiciona complexidade em termos de gerenciamento da visibilidade de diferentes eventos e garantia de que ambos os eventos sejam realmente disparados. O que acontece quando um microservice envia o primeiro tipo de evento, mas morre antes que o segundo evento possa ser enviado?

Outra consideração é que, uma vez que colocamos dados em um evento, eles se tornam parte do nosso contrato com o mundo externo. Devemos estar cientes de que se removermos um campo de um evento, poderemos quebrar partes externas. O encapsulamento de informações ainda é um conceito importante na colaboração orientada a eventos - quanto mais dados colocamos em um evento, mais suposições as partes externas terão sobre o evento. Minha regra geral é que está tudo bem colocar informações em um evento se eu ficaria feliz em compartilhar os mesmos dados por meio de uma API de solicitação-resposta.

## Onde Usar

A colaboração orientada a eventos prospera em situações em que a informação deseja ser transmitida e em situações em que você está disposto a inverter a intenção. Afastar-se de um modelo de dizer a outras coisas o que fazer e, em vez disso, permitir que os microservices downstream descubram isso por si próprios tem um grande apelo. Em uma situação em que você está focado no acoplamento flexível mais do que em outros fatores, a colaboração orientada a eventos terá um apelo óbvio. A observação cautelosa é que muitas vezes há novas fontes de complexidade que surgem com esse estilo de colaboração, especialmente se você teve exposição limitada a ele. Se você não tem certeza sobre essa forma de comunicação, lembre-se de que nossa arquitetura de microservices pode (e provavelmente terá) uma mistura de diferentes estilos de interação. Você não precisa ir com tudo na colaboração orientada a eventos; comece talvez com apenas um evento e veja a partir daí.

Pessoalmente, eu me vejo gravitando em direção à colaboração orientada a eventos quase como um padrão. Meu cérebro parece ter se reprogramado de tal forma que esses tipos de comunicação me parecem óbvios. Isso não é totalmente útil, pois pode ser complicado tentar explicar por que isso é assim, além de dizer que parece certo. Mas essa é apenas minha própria tendência interna - eu naturalmente me inclino para o que eu conheço, com base em minhas próprias experiências. Existe uma forte possibilidade de que minha atração por essa forma de interação seja motivada quase que inteiramente por minhas experiências anteriores com sistemas excessivamente acoplados. Talvez eu esteja apenas lutando a mesma batalha repetidamente sem considerar que desta vez realmente é diferente. O que eu vou dizer, deixando de lado minhas próprias tendências, é que vejo muito mais equipes substituindo interações de solicitação-resposta por interações orientadas a eventos do que o contrário.

### Padrão: Comunicação Orientada a Eventos

## Prossiga com cautela

Algumas dessas coisas assíncronas parecem divertidas, certo? Arquiteturas orientadas a eventos parecem levar a sistemas significativamente mais desacoplados e escaláveis. E podem levar. Mas esses estilos de comunicação também levam a um aumento na complexidade. Isso não é apenas a complexidade necessária para gerenciar a publicação e a inscrição em mensagens, como discutimos anteriormente, mas também a complexidade em outros problemas que podemos enfrentar. Por exemplo, ao considerar uma resposta assíncrona de longa duração, precisamos pensar no que fazer quando a resposta chegar. Ela retorna para o mesmo nó que iniciou a solicitação? Se sim, o que acontece se esse nó estiver inativo? Se não, eu preciso armazenar informações em algum lugar para poder reagir adequadamente? Uma resposta assíncrona de curta duração pode ser mais fácil de gerenciar se você tiver as APIs corretas, mas mesmo assim, é uma forma diferente de pensar para programadores acostumados com chamadas síncronas dentro do processo.

É hora de contar uma história de cautela. Lá em 2006, eu estava trabalhando na construção de um sistema de precificação para um banco. Nós analisávamos eventos de mercado e determinávamos quais itens de uma carteira precisavam ser repricados. Depois de determinarmos a lista de itens para trabalhar, colocávamos todos eles em uma fila de mensagens. Estávamos usando um conjunto de servidores para criar um pool de trabalhadores de precificação, permitindo escalar a fazenda de precificação conforme necessário. O sistema estava funcionando e nos sentíamos bastante satisfeitos. Um dia, porém, logo após lançarmos uma nova versão, enfrentamos um problema sério: nossos trabalhadores continuavam morrendo. E morrendo. E morrendo.

Eventualmente, encontramos o problema. Um bug havia se infiltrado, onde um determinado tipo de solicitação de precificação fazia com que um trabalhador travasse. Estávamos usando uma fila transacional: quando o trabalhador morria, seu bloqueio na solicitação expirava e a solicitação de precificação voltava para a fila, apenas para que outro trabalhador a pegasse e morresse. Esse foi um exemplo clássico do que Martin Fowler chama de "falha catastrófica de failover".

Além do próprio bug, não tínhamos especificado um limite máximo de tentativas para o trabalho na fila. Então, corrigimos o bug e configuramos uma quantidade máxima de tentativas. Mas também percebemos que precisávamos de uma maneira de visualizar e, potencialmente, reproduzir essas mensagens ruins. Acabamos tendo que implementar uma "message hospital" (ou fila de mensagens inválidas), onde as mensagens eram enviadas se falhassem. Também criamos uma interface para visualizar essas mensagens e reenviá-las, se necessário. Esses tipos de problemas não são imediatamente óbvios se você estiver familiarizado apenas com comunicações síncronas ponto a ponto. A complexidade associada às arquiteturas orientadas a eventos e à programação assíncrona em geral me leva a acreditar que você deve ser cauteloso em como adotar essas ideias com entusiasmo. Certifique-se de ter um bom monitoramento em vigor e considere fortemente o uso de IDs de correlação, que permitem rastrear solicitações em várias fronteiras de processo, como veremos em detalhes no Capítulo 10.

## Resumo

Neste capítulo, eu apresentei os principais estilos de comunicação entre microservices e discuti as várias compensações envolvidas. Nem sempre há uma única opção correta, mas espero ter fornecido informações suficientes sobre chamadas síncronas e assíncronas e estilos de comunicação orientados a eventos e de solicitação-resposta para ajudá-lo a tomar a decisão correta para o seu contexto específico. Minhas próprias inclinações em relação à colaboração assíncrona e orientada a eventos são resultado não apenas das minhas experiências, mas também da minha aversão ao acoplamento em geral. No entanto, esse estilo de comunicação vem com uma complexidade significativa que não pode ser ignorada, e cada situação é única. Neste capítulo, mencionei brevemente algumas tecnologias específicas que podem ser usadas para implementar esses estilos de interação. Agora estamos prontos para começar a segunda parte deste livro - a implementação. No próximo capítulo, exploraremos a implementação da comunicação entre microservices com mais profundidade.

---

# CAPÍTULO 5

O DNS possui uma série de vantagens, sendo a principal delas o fato de ser um padrão amplamente compreendido e usado, que é suportado por quase qualquer conjunto de tecnologias. Infelizmente, embora existam alguns serviços para gerenciar o DNS dentro de uma organização, poucos deles parecem projetados para um ambiente em que lidamos com hosts altamente descartáveis, o que torna a atualização das entradas DNS um tanto dolorosa. O serviço Route 53 da Amazon faz um bom trabalho nisso, mas ainda não vi uma opção auto-hospedada tão boa, embora (como discutiremos em breve) algumas ferramentas dedicadas de descoberta de serviços, como o Consul, possam nos ajudar aqui. Além dos problemas na atualização das entradas DNS, a própria especificação do DNS pode nos causar alguns problemas.

As entradas DNS para nomes de domínio possuem um tempo de vida (TTL). Isso indica por quanto tempo um cliente deve considerar a entrada como atualizada. Quando queremos alterar o host para o qual o nome de domínio se refere, atualizamos essa entrada, mas temos que assumir que os clientes manterão o IP antigo por pelo menos o tempo especificado pelo TTL. As entradas DNS podem ser armazenadas em cache em vários locais (até mesmo a JVM armazena em cache as entradas DNS, a menos que você indique o contrário), e quanto mais locais elas forem armazenadas em cache, mais desatualizada a entrada poderá ficar.

Uma maneira de contornar esse problema é fazer com que a entrada do nome de domínio para o seu serviço aponte para um balanceador de carga, que por sua vez aponta para as instâncias do seu serviço, como mostrado na Figura 5-5. Quando você implanta uma nova instância, pode remover a antiga da entrada do balanceador de carga e adicionar a nova. Alguns usam o round-robin DNS, em que as próprias entradas DNS se referem a um grupo de máquinas. Essa técnica é extremamente problemática, pois o cliente está oculto do host subjacente e, portanto, não pode facilmente interromper o roteamento do tráfego para um dos hosts caso ele fique indisponível.

Como mencionado, o DNS é bem compreendido e amplamente suportado. Mas tem uma ou duas desvantagens. Eu sugeriria que você investigue se ele é adequado para você antes de escolher algo mais complexo. Para uma situação em que você tem apenas nós individuais, ter o DNS se referindo diretamente aos hosts provavelmente está tudo bem. Mas para aquelas situações em que você precisa de mais de uma instância de um host, faça com que as entradas DNS sejam resolvidas para balanceadores de carga que possam gerenciar a adição e a remoção de hosts individuais conforme necessário.

Registros de Serviços Dinâmicos

As desvantagens do DNS como forma de encontrar nós em um ambiente altamente dinâmico levaram ao surgimento de vários sistemas alternativos, a maioria dos quais envolve o registro do serviço em si em um registro central, que por sua vez oferece a capacidade de procurar esses serviços posteriormente. Muitas vezes, esses sistemas fazem mais do que apenas fornecer registro e descoberta de serviços, o que pode ser bom ou ruim. Esse é um campo concorrido, então vamos dar uma olhada em algumas opções para você ter uma ideia do que está disponível.

ZooKeeper

O ZooKeeper foi desenvolvido originalmente como parte do projeto Hadoop. Ele é usado em uma variedade quase confusa de casos de uso, incluindo gerenciamento de configuração, sincronização de dados entre serviços, eleição de líder, filas de mensagens e (útil para nós) como um serviço de nomeação.

Como muitos sistemas semelhantes, o ZooKeeper depende da execução de vários nós em um cluster para fornecer várias garantias. Isso significa que você deve esperar executar pelo menos três nós do ZooKeeper. A maior parte da inteligência do ZooKeeper está relacionada a garantir que os dados sejam replicados com segurança entre esses nós e que as coisas permaneçam consistentes quando os nós falham.

No seu cerne, o ZooKeeper fornece um namespace hierárquico para armazenar informações. Os clientes podem inserir novos nós nessa hierarquia, modificá-los ou consultá-los. Além disso, eles podem adicionar watches (observadores) aos nós para serem notificados quando eles mudam. Isso significa que poderíamos armazenar as informações sobre onde nossos serviços estão localizados nessa estrutura e sermos notificados quando elas mudarem. O ZooKeeper é frequentemente usado como um armazenamento de configuração geral, portanto, você também pode armazenar configurações específicas do serviço nele, permitindo fazer tarefas como alterar dinamicamente os níveis de log ou desativar recursos de um sistema em execução.

Na realidade, existem soluções melhores para o registro dinâmico de serviços, a ponto de eu evitar ativamente o uso do ZooKeeper para esse caso de uso hoje em dia.

Consul

Assim como o ZooKeeper, o Consul oferece suporte tanto ao gerenciamento de configuração quanto à descoberta de serviços. Mas ele vai além do ZooKeeper, oferecendo mais suporte para esses casos de uso-chave. Por exemplo, ele expõe uma interface HTTP para a descoberta de serviços, e uma das principais características do Consul é que ele realmente fornece um servidor DNS pronto para uso; especificamente, ele pode fornecer registros SRV, que fornecem tanto um IP quanto uma porta para um determinado nome. Isso significa que se parte do seu sistema já usa DNS e pode lidar com registros SRV, você pode simplesmente adicionar o Consul e começar a usá-lo sem fazer alterações no seu sistema existente.

O Consul também inclui outras capacidades que você pode achar úteis, como a capacidade de realizar verificações de saúde nos nós. Assim, o Consul pode se sobrepor às capacidades fornecidas por outras ferramentas de monitoramento dedicadas, embora você provavelmente use o Consul como uma fonte dessas informações e as integre a um conjunto de monitoramento mais abrangente

O Consul usa uma interface HTTP RESTful para tudo, desde registrar um serviço até consultar a chave/valor ou inserir verificações de saúde. Isso torna a integração com diferentes pilhas tecnológicas muito direta. O Consul também possui um conjunto de ferramentas que funcionam bem com ele, melhorando ainda mais sua utilidade. Um exemplo disso é o consul-template, que fornece uma maneira de atualizar arquivos de texto com base em entradas no Consul. À primeira vista, isso não parece tão interessante, até considerar o fato de que, com o consul-template, você pode agora alterar um valor no Consul, como a localização de um microsserviço ou um valor de configuração, e ter os arquivos de configuração em todo o seu sistema atualizados dinamicamente. De repente, qualquer programa que lê sua configuração de um arquivo de texto pode ter seus arquivos de texto atualizados dinamicamente sem precisar saber nada sobre o Consul em si. Um caso de uso excelente para isso seria adicionar ou remover dinamicamente nós em um pool de balanceadores de carga usando um balanceador de carga de software como o HAProxy.

Outra ferramenta que se integra bem com o Consul é o Vault, uma ferramenta de gerenciamento de segredos que discutiremos novamente em "Segredos" na página 356. O gerenciamento de segredos pode ser difícil, mas a combinação do Consul e do Vault certamente pode facilitar a vida.

etcd e Kubernetes

Se você está executando em uma plataforma que gerencia cargas de trabalho de contêineres para você, há grandes chances de já ter um mecanismo de descoberta de serviços fornecido. O Kubernetes não é diferente e parte dele vem do etcd, um armazenamento de gerenciamento de configuração incluído no Kubernetes. O etcd tem capacidades semelhantes às do Consul, e o Kubernetes o utiliza para gerenciar uma ampla variedade de informações de configuração.

Exploraremos o Kubernetes em mais detalhes em "Kubernetes e Orquestração de Contêineres" na página 259, mas, resumidamente, a maneira como a descoberta de serviços funciona no Kubernetes é que você implanta um contêiner em um pod e, em seguida, um serviço identifica dinamicamente quais pods devem fazer parte de um serviço por meio de correspondência de padrões nos metadados associados ao pod. É um mecanismo bastante elegante e pode ser muito poderoso. As solicitações a um serviço serão encaminhadas para um dos pods que compõem esse serviço.

As capacidades que você obtém com o Kubernetes podem fazer com que você queira usar apenas o que vem com a plataforma principal, evitando o uso de ferramentas dedicadas como o Consul, e para muitos isso faz muito sentido, especialmente se o ecossistema mais amplo de ferramentas em torno do Consul não for interessante para você. No entanto, se você estiver executando em um ambiente misto, em que você tem cargas de trabalho sendo executadas no Kubernetes e em outros lugares, ter uma ferramenta dedicada de descoberta de serviços que possa ser usada em ambas as plataformas pode ser a melhor opção.

Criando seu próprio

Uma abordagem que usei pessoalmente e vi ser usada em outros lugares é criar seu próprio sistema. Em um projeto, estávamos usando bastante a AWS, que oferece a capacidade de adicionar tags às instâncias. Ao lançar instâncias de serviço, eu aplicava tags para ajudar a definir o que a instância era e para que era usada. Isso permitia associar metadados ricos a um determinado host, por exemplo:

    serviço = contas
    ambiente = produção
    versão = 154

Em seguida, usei as APIs da AWS para consultar todas as instâncias associadas a uma determinada conta da AWS para encontrar as máquinas de que me importava. Aqui, a própria AWS está lidando com o armazenamento dos metadados associados a cada instância e nos fornecendo a capacidade de consultá-los. Em seguida, construí ferramentas de linha de comando para interagir com essas instâncias e forneceu interfaces gráficas para visualizar o status das instâncias em uma única visualização. Tudo isso se torna bastante simples se você puder reunir informações sobre as interfaces de serviço programaticamente.

Da última vez que fiz isso, não fomos tão longe a ponto de fazer com que os serviços usassem as APIs da AWS para localizar suas dependências de serviço, mas não há motivo para que você não possa fazer isso. Obviamente, se você deseja que os serviços upstream sejam alertados quando a localização de um serviço downstream muda, você está por conta própria.

Atualmente, esse não é o caminho que eu seguiria. As ferramentas disponíveis nesse espaço são maduras o suficiente para que isso seja não apenas reinventar a roda, mas criar uma roda muito pior.

Não se esqueça dos humanos!

Os sistemas que analisamos até agora facilitam o registro de uma instância de serviço e a busca de outros serviços com os quais ela precisa se comunicar. Mas como seres humanos, às vezes também queremos essas informações. Tornar as informações disponíveis de maneiras que permitam que os humanos as consumam, talvez usando APIs para extrair esses detalhes em registros compreensíveis, pode ser vital.

Meshes de Serviço e Portais de API

Poucas áreas da tecnologia associadas a microsserviços receberam tanta atenção, hype e confusão quanto as malhas de serviço e os portais de API. Ambos têm seu lugar, mas, de forma confusa, também podem se sobrepor em responsabilidades. O portal de API, em particular, está sujeito a uso inadequado (e a vender erroneamente), portanto, é importante que entendamos como esses tipos de tecnologia podem se encaixar em nossa arquitetura de microsserviços. Em vez de fornecer uma visão detalhada do que você pode fazer com esses produtos, quero fornecer uma visão geral de onde eles se encaixam, como podem ajudar e algumas armadilhas a serem evitadas.

Em termos típicos de data center, falaríamos sobre o tráfego "leste-oeste" como sendo interno a um data center, com o tráfego "norte-sul" relacionado a interações que entram ou saem do data center para o mundo externo. Do ponto de vista de redes, o que é um data center se tornou um conceito um tanto nebuloso, então, para nossos propósitos, falaremos de forma mais ampla sobre um perímetro de rede. Isso pode se relacionar a um data center inteiro, um cluster Kubernetes ou talvez apenas um conceito de rede virtual como um grupo de máquinas executando na mesma LAN virtual.

Falando de forma geral, um portal de API fica no perímetro do seu sistema e lida com o tráfego norte-sul. Suas principais preocupações são gerenciar o acesso do mundo externo aos seus microsserviços internos. Por outro lado, uma malha de serviço lida de forma muito restrita com a comunicação entre microsserviços dentro do seu perímetro - o tráfego leste-oeste, como mostra a Figura 5-6.

No caso de um gateway de API ou de uma malha de serviço, eles podem permitir que os microsserviços compartilhem código sem exigir a criação de novas bibliotecas de cliente ou novos microsserviços. De forma simples, as malhas de serviço e os gateways de API podem funcionar como proxies entre os microsserviços. Isso significa que eles podem ser usados para implementar comportamentos independentes de microsserviços que, de outra forma, teriam que ser feitos no código, como descoberta de serviço ou registro de logs.

Se você estiver usando um gateway de API ou uma malha de serviço para implementar comportamentos compartilhados e comuns para seus microsserviços, é essencial que esse comportamento seja totalmente genérico - ou seja, que o comportamento no proxy não tenha relação com nenhum comportamento específico de um microsserviço individual.

No entanto, devo ressaltar que o mundo nem sempre é tão simples assim. Alguns gateways de API tentam fornecer recursos para o tráfego leste-oeste também, mas discutiremos isso em breve. Primeiro, vamos analisar os gateways de API e os tipos de coisas que eles podem fazer.

Gateways de API

O foco principal de um gateway de API em um ambiente de microsserviços é mapear solicitações de partes externas para microsserviços internos. Essa responsabilidade é semelhante ao que você poderia alcançar com um proxy HTTP simples, e, de fato, os gateways de API geralmente adicionam mais recursos aos produtos existentes de proxy HTTP e funcionam em grande parte como proxies reversos. Além disso, os gateways de API podem ser usados para implementar mecanismos como chaves de API para partes externas, registro de logs, limitação de taxa, e assim por diante. Alguns produtos de gateway de API também fornecerão portais de desenvolvedores, frequentemente direcionados a consumidores externos.

Parte da confusão em torno do gateway de API está relacionada à história. Algum tempo atrás, houve uma quantidade enorme de interesse no que foi chamado de "economia das APIs". A indústria começou a entender o poder de oferecer APIs para soluções gerenciadas, desde produtos SaaS como Salesforce até plataformas como AWS, pois ficou claro que uma API oferecia aos clientes muito mais flexibilidade em como seu software era usado. Isso fez com que muitas pessoas começassem a olhar para o software que já possuíam e considerassem os benefícios de expor aquela funcionalidade para seus clientes não apenas por meio de uma GUI, mas também por meio de uma API. A esperança era que isso abrisse oportunidades de mercado maiores e, bem, gerasse mais dinheiro. Em meio a esse interesse, surgiu um conjunto de produtos de gateway de API para ajudar a alcançar esses objetivos. Sua lista de recursos se concentrava fortemente na gestão de chaves de API para terceiros, aplicação de limites de taxa e rastreamento de uso para fins de cobrança.

No entanto, a realidade é que, embora as APIs tenham se mostrado uma excelente maneira de fornecer serviços a alguns clientes, o tamanho da economia das APIs não foi tão grande quanto alguns esperavam, e muitas empresas descobriram que haviam adquirido produtos de gateway de API cheios de recursos que nunca precisaram de fato.


The main problem with both the protocol rewriting capability and the implementa‐
tion of call aggregation inside API gateways is that we are violating the rule of keep‐
ing the pipes dumb, and the endpoints smart. The “smarts” in our system want to live
in our code, where we can have full control over them. The API gateway in this
example is a pipe—we want it as simple as possible. With microservices, we are push‐
ing for a model in which changes can be made and more easily released through
independent deployability. Keeping smarts in our microservices helps this. If we now
also have to make changes in intermediate layers, things become more problematic.
Given the criticality of API gateways, changes to them are often tightly controlled. It
seems unlikely that individual teams will be given free rein to self-service change
these often centrally managed services. What does that mean? Tickets. To roll out a
change to your software, you end up having the API gateway team make changes for
you. The more behavior you leak into API gateways (or into enterprise service buses),
the more you run the risk of handoffs, increased coordination, and slowed delivery.
The last issue is the use of an API gateway as an intermediary for all inter-
microservice calls. This can be extremely problematic. If we insert an API gateway or
a normal network proxy between two microservices, then we have normally added at
least a single network hop. A call from microservice A to microservice B first goes
from A to the API gateway and then from the API gateway to B. We have to consider
the latency impact of the additional network call and the overhead of whatever the
Service Meshes and API Gateways | 165
proxy is doing. Service meshes, which we explore next, are much better placed to
solve this problem.
Service Meshes
With a service mesh, common functionality associated with inter-microservice com‐
munication is pushed into the mesh. This reduces the functionality that a microser‐
vice needs to implement internally, while also providing consistency across how
certain things are done.
Common features implemented by service meshes include mutual TLS, correlation
IDs, service discovery and load balancing, and more. Often this type of functionality
is fairly generic from one microservice to the next, so we’d end up making use of a
shared library to handle it. But then you have to deal with what happens if different
microservices have different versions of the libraries running, or what happens if you
have microservices written in different runtimes.
Historically at least, Netflix would mandate that all nonlocal network communication
had to be done JVM to JVM. This was to ensure that the tried and tested common
libraries that are a vital part of managing effective communication between microser‐
vices could be reused. With the use of a service mesh, though, we have the possibility
of reusing common inter-microservice functionality across microservices written in
different programming languages. Service meshes can also be incredibly useful in
implementing standard behavior across microservices created by different teams—
and the use of a service mesh, especially on Kubernetes, has increasingly become an
assumed part of any given platform you might create for self-service deployment and
management of microservices.
Making it easy to implement common behavior across microservices is one of the big
benefits of a service mesh. If this common functionality was implemented solely
through shared libraries, changing this behavior would require every microservice to
pull in a new version of said libraries and be deployed before that change is live. With
a service mesh, you have much more flexibility in rolling out changes in terms of
inter-microservice communication without requiring a rebuild and redeploy.
How they work
In general, we’d expect to have less north-south traffic than east-west traffic with a
microservice architecture. A single north-south call—placing an order, for example—
could result in multiple east-west calls. This means that when considering any sort of
proxy for in-perimeter calls, we have to be aware of the overhead these additional
calls can cause, and this is a core consideration in terms of how service meshes are
built.
166 | Chapter 5: Implementing Microservice Communication
Service meshes come in different shapes and sizes, but what unites them is that their
architecture is based on trying to limit the impact caused by calls to and from the
proxy. This is achieved primarily by distributing the proxy processes to run on the
same physical machines as the microservice instances, to ensure that the number of
remote network calls is limited. In Figure 5-7 we see this in action—the Order Pro
cessor is sending a request to the Payment microservice. This call is first routed
locally to a proxy instance running on the same machine as Order Processor, before
continuing to the Payment microservice via its local proxy instance. The Order Pro
cessor thinks it’s making a normal network call, unaware that the call is routed
locally on the machine, which is significantly faster (and also less prone to partitions).
Figure 5-7. A service mesh is deployed to handle all direct inter-microservice
communication
A control plane would sit on top of the local mesh proxies, acting as both a place in
which the behavior of these proxies can be changed and a place in which you can col‐
lect information about what the proxies are doing.
When deploying on Kubernetes, you would deploy each microservice instance in a
pod with its own local proxy. A single pod is always deployed as a single unit, so you
always know that you have a proxy available. Moreover, a single proxy dying would
impact only that one pod. This setup also allows you to configure each proxy differ‐
ently for different purposes. We’ll look at these concepts in more detail in “Kuber‐
netes and Container Orchestration” on page 259.
Many service mesh implementations use the Envoy proxy for the basis of these
locally running processes. Envoy is a lightweight C++ proxy often used as the
building block for service meshes and other types of proxy-based software—it is an
important building block for Istio and Ambassador, for example.
These proxies are in turn managed by a control plane. This will be a set of software
that helps you see what is going on and control what is being done. When using a
service mesh to implement mutual TLS, for example, the control plane would be used
to distribute client and server certificates.
Aren’t service meshes smart pipes?
So all this talk of pushing common behavior into a service mesh might have alarm
bells ringing for some of you. Isn’t this approach open to the same sorts of problems
as enterprise service buses or overly bloated API gateways? Aren’t we at risk of push‐
ing too many “smarts” into our service mesh?
The key thing to remember here is that the common behavior we are putting into the
mesh is not specific to any one microservice. No business functionality has leaked to
the outside. We’re configuring generic things like how request time-outs are handled.
In terms of common behavior that might want to be tweaked on a per-microservice
basis, that’s typically something that is well catered for, without the need for work to
be done on a central platform. For example, with Istio, I can define my time-out
requirements on a self-service basis just by changing my service definition.
Do you need one?
When the use of service meshes first started becoming popular, just after the release
of the first edition of this book, I saw a lot of merit in the idea but also saw a lot of
churn in the space. Different deployment models were suggested, built, and then
dropped, and the number of companies offering solutions in this space increased
drastically; but even for those tools that had been around for a long time, there was
an apparent lack of stability. Linkerd, which arguably did as much as anyone to pio‐
neer this space, totally rebuilt its product from scratch in the shift from v1 to v2. Istio,
which was the Google-anointed service mesh, took years to get to an initial 1.0
release, and even still it had significant subsequent changes in its architecture (mov‐
ing somewhat ironically, although sensibly, to a more monolithic deployment model
for its control plane).
For much of the last five years, when I have been asked “Should we get a service
mesh?” my advice has been “If you can afford to wait six months before making a
choice, then wait six months.” I was sold on the idea but concerned about the stabil‐
ity. And something like a service mesh is not where I personally want to take a lot of
risks—it’s so key, so essential to everything working well. You’re putting it on your
critical path. It’s up there with selecting a message broker or cloud provider in terms
of how seriously I’d take it.
168 | Chapter 5: Implementing Microservice Communication
Since then, I’m happy to say, this space has matured. The churn to some extent has
slowed, but we still have a (healthy) plurality of vendors. That said, service meshes
aren’t for everyone. Firstly, if you aren’t on Kubernetes, your options are limited. Sec‐
ondly, they do add complexity. If you have five microservices, I don’t think you can
easily justify a service mesh (it’s arguable as to whether you can justify Kubernetes if
you only have five microservices!). For organizations that have more microservices,
especially if they want the option for those microservices to be written in different
programming languages, service meshes are well worth a look. Do your homework,
though—switching between service meshes is painful!
Monzo is one organization that has spoken openly about how its use of a service
mesh was essential in allowing it to run its architecture at the scale it does. Its use of
version 1 of Linkerd to help manage inter-microservice RPC calls proved hugely ben‐
eficial. Interestingly, Monzo had to handle the pain of a service mesh migration to
help it achieve the scale it needed when the older architecture of Linkerd v1 no longer
met its requirements. In the end it moved effectively to an in-house service mesh
making use of the Envoy proxy.
What About Other Protocols?
API gateways and service meshes are primarily used to handle HTTP-related calls. So
REST, SOAP, gRPC, and the like can be managed via these products. Things get a bit
more murky, though, when you start looking at communication via other protocols,
like the use of message brokers such as Kafka. Typically, at this point the service mesh
gets bypassed—communication is done directly with the broker itself. This means
that you cannot assume your service mesh is able to work as an intermediary for all
calls between microservices.
Documenting Services
By decomposing our systems into finer-grained microservices, we’re hoping to
expose lots of seams in the form of APIs that people can use to do many hopefully
wonderful things. If you get our discovery right, we know where things are. But how
do we know what those things do or how to use them? One option is obviously to
have documentation about the APIs. Of course, documentation can often be out of
date. Ideally, we’d ensure that our documentation is always up to date with the
microservice API and make it easy to see this documentation when we know where a
service endpoint is.
Explicit Schemas
Having explicit schemas does go a long way toward making it easier to understand
what any given endpoint exposes, but by themselves they are often not enough. As
we’ve already discussed, schemas help show the structure, but they don’t go very far
Documenting Services | 169
in helping communicate the behavior of an endpoint, so good documentation could
still be required to help consumers understand how to use an endpoint. It’s worth
noting, of course, that if you decide not to use an explicit schema, your documenta‐
tion will end up doing more work. You’ll need to explain what the endpoint does and
also document the structure and detail of the interface. Moreover, without an explicit
schema, detecting whether your documentation is up to date with the real endpoints
is more difficult. Stale documentation is an ongoing problem, but at least an explicit
schema gives you more chance of it being up to date.
I’ve already introduced OpenAPI as a schema format, but it also is very effective in
providing documentation, and a lot of open source and commercial tools now exist
that can support consuming the OpenAPI descriptors to help create useful portals to
allow developers to read the documentation. It’s worth noting that the open source
portals for viewing OpenAPI seem somewhat basic—I struggled to find one that sup‐
ported search functionality, for example. For those on Kubernetes, Ambassador’s
developer portal is especially interesting. Ambassador is already a popular choice as
an API gateway for Kubernetes, and its Developer Portal has the ability to autodis‐
cover available OpenAPI endpoints. The idea of deploying a new microservice and
having its documentation automatically available greatly appeals to me.
In the past we’ve lacked good support for documenting event-based interfaces. Now
at least we have options. The AsyncAPI format started off as an adaptation of Open‐
API, and we also now have CloudEvents, which is a CNCF project. I’ve not used
either in anger (that is, in a real setting), but I’m more drawn to CloudEvents purely
because it seems to have a wealth of integration and support, due in large part to its
association with the CNCF. Historically, at least, CloudEvents seemed to be more
restrictive in terms of the event format compared to AsyncAPI, with only JSON being
properly supported, until protocol buffer support was recently reintroduced after
previously being removed; so that may be a consideration.
The Self-Describing System
During the early evolution of SOA, standards like Universal Description, Discovery,
and Integration (UDDI) emerged to help us make sense of what services were run‐
ning. These approaches were fairly heavyweight, which led to alternative techniques
to try to make sense of our systems. Martin Fowler has discussed the concept of the
humane registry, a much more lightweight approach in which humans can record
information about the services in the organization in something as basic as a wiki.
170 | Chapter 5: Implementing Microservice Communication
Getting a picture of our system and how it is behaving is important, especially when
we’re at scale. We’ve covered a number of different techniques that will help us gain
understanding directly from our system. By tracking the health of our downstream
services together with correlation IDs to help us see call chains, we can get real data
in terms of how our services interrelate. Using service discovery systems like Consul,
we can see where our microservices are running. Mechanisms like OpenAPI and
CloudEvents can help us see what capabilities are being hosted on any given end‐
point, while our health check pages and monitoring systems let us know the health of
both the overall system and individual services.
All of this information is available programmatically. All of this data allows us to
make our humane registry more powerful than a simple wiki page that will no doubt
get out of date. Instead, we should use it to harness and display all the information
our system will be emitting. By creating custom dashboards, we can pull together the
vast array of information that is available to help us make sense of our ecosystem.
By all means, start with something as simple as a static web page or wiki that perhaps
scrapes in a bit of data from the live system. But look to pull in more and more infor‐
mation over time. Making this information readily available is a key tool for manag‐
ing the emerging complexity that will come from running these systems at scale.
I’ve spoken with a number of companies that have had these issues and that ended up
creating simple in-house registries to help collate metadata around services. Some of
these registries simply crawl source code repositories, looking for metadata files to
build up a list of services out there. This information can be merged with real data
coming from service discovery systems like Consul or etcd to build up a richer pic‐
ture of what is running and whom you could speak to about it.
The Financial Times created Biz Ops to help address this problem. The company has
several hundred services developed by teams all over the world. The Biz Ops tool
(Figure 5-8) gives the company a single place where you can find out lots of useful
information about its microservices, in addition to information about other IT infra‐
structure services such as networks and file servers. Built on top of a graph database,
Biz Ops has a lot of flexibility about what data it gathers and how the information can
be modeled.
Documenting Services | 171
Figure 5-8. The Financial Times Biz Ops tool, which collates information about its
microservices
The Biz Ops tool goes further than most of the similar tools I have seen, however.
The tool calculates what it calls a System Operability Score, as shown in Figure 5-9.
The idea is that there are certain things that services and their teams should do to
ensure the services can be easily operated. This can range from making sure the
teams have provided the correct information in the registry to ensuring the services
have proper health checks. The System Operability Score, once calculated, allows
teams to see at a glance if there are things that need to be fixed.
This is a growing space. In the open source world, Spotify’s Backstage tool offers a
mechanism for building a service catalog like Biz Ops, with a plug-in model to allow
for sophisticated additions, such as being able to trigger the creation of a new micro‐
service or pulling in live information from a Kubernetes cluster. Ambassador’s own
Service Catalog is more narrowly focused on visibility of services in Kubernetes,
which means it might not have as much general appeal as something like the FT’s
172 | Chapter 5: Implementing Microservice Communication
Biz Ops, but it’s nonetheless good to see some new takes on this idea that are more
generally available.
Figure 5-9. An example of the Service Operability Score for a microservice at the
Financial Times
Summary
So we’ve covered a lot of ground in this chapter—let’s break some of it down:
• To begin with, ensure that the problem you are trying to solve guides your tech‐
nology choice. Based on your context and your preferred communication style,
select the technology that is most appropriate for you—don’t fall into the trap of
picking the technology first. The summary of styles of inter-microservice com‐
munication, first introduced in Chapter 4 and shown again in Figure 5-10, can
help guide your decision making, but just following this model isn’t a replace‐
ment for sitting down and thinking about your own situation.
Summary | 173
Figure 5-10. Different styles of inter-microservice communication, along with example
implementing technologies
• Whatever choice you make, consider the use of schemas, in part to help make
your contracts more explicit but also to help catch accidental breaking changes.
• Where possible, strive to make changes that are backward compatible to ensure
that independent deployability remains a possibility.
• If you do have to make backward-incompatible changes, find a way to allow con‐
sumers time to upgrade to avoid lockstep deployments.
• Think about what you can do to help surface information about your endpoints
to humans—consider the use of humane registries and the like to help make
sense of the chaos.
We’ve looked at how we can implement a call between two microservices, but what
happens when we need to coordinate operations between multiple microservices?
That will be the focus of our next chapter.
