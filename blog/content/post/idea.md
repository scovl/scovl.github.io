+++
title = "Intellij IDEA"
description = "Under the hood"
date = 2023-04-04T09:18:18-03:00
tags = ["Java", "IDE", "Intellij IDEA"]
draft = false
weight = 8
+++

## Introdução

![img#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/main/blog/content/post/images/idea/idea.png#center)

IntelliJ IDEA é um ambiente de desenvolvimento integrado (IDE) criado pela JetBrains e é um das IDEs mais populares para desenvolvimento em Java/Kotlin/Scala e outras que rodam na JVM/GraalVM. Existem duas edições principais do IntelliJ IDEA: a Community e a Ultimate. **[A edição Community é gratuita e de código aberto](https://github.com/JetBrains/intellij-community)**, e é voltada para desenvolvedores individuais ou pequenas equipes que trabalham em projetos Java de médio porte. Ela oferece uma ampla gama de recursos, como suporte a linguagens e frameworks populares, integração com sistemas de controle de versão, depurador, refatoração de código, testes automatizados e muito mais. A edição Ultimate é paga e é voltada para empresas e equipes maiores que trabalham em projetos Java de grande porte. Ela oferece todos os recursos da edição Community, além de recursos avançados, como ferramentas de análise de código, depuração remota, suporte a tecnologias empresariais, integração com sistemas de gerenciamento de projetos e muito mais. A edição Ultimate é frequentemente usada em projetos de missão crítica, onde a produtividade e a eficiência são fundamentais para o sucesso do projeto. Ambas as edições do IntelliJ IDEA são altamente respeitadas na comunidade de desenvolvimento de software e são amplamente utilizadas em todo o mundo.

### Pré-requisitos

O pré-requisito para rodar bem o Intellij IDEA é ter uma máquina com pelo menos 8GB de RAM e um processador com 4 núcleos. O ideal é ter 16GB de RAM e um processador com 8 núcleos segundo o **[próprio site da JetBrains](https://www.jetbrains.com/help/idea/prerequisites.html#min_requirements)**.

## Under the hood 

### O que ocorre quando você inicia o Intellij IDEA? 

Quando você inicia o IntelliJ IDEA, uma série de processos ocorre em segundo plano para configurar o ambiente de desenvolvimento e prepará-lo para o uso. Vamos detalhar esses processos e entender o papel de cada componente no funcionamento do IntelliJ IDEA.

### Inicialização:

![img#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/main/blog/content/post/images/idea/ideainit.png#center)

Quando você executa o IntelliJ IDEA, o aplicativo carrega sua interface gráfica e verifica a existência de atualizações e plugins. Dependendo da configuração do seu sistema, você também pode ser solicitado a selecionar um JDK (Java Development Kit) para o projeto. A JVM (Java Virtual Machine) é iniciada para executar o aplicativo e alocar a memória necessária. Se você estiver criando um novo projeto, o IntelliJ IDEA solicitará que você selecione um diretório para armazenar os arquivos do projeto. Dentro deste diretório, várias pastas serão criadas para gerenciar diferentes aspectos do projeto:

```bash
<project_name>
├── .idea
│   ├── modules.xml
│   ├── workspace.xml
│   ├── misc.xml
│   └── <module_name>.iml
├── src
│   └── <package_name>
│       └── <source_file>.java
└── out
    └── production
        └── <project_name>
            └── <compiled_class>.class
```
        
* **.idea**: Esta pasta contém arquivos de configuração específicos do IntelliJ IDEA, como informações do projeto e do módulo, configurações do workspace e arquivos de cache. Essa pasta geralmente não é compartilhada entre desenvolvedores. Esta pasta contém arquivos de configuração específicos do IntelliJ IDEA e é criada automaticamente para cada projeto. Ela inclui:
  * **modules.xml**: Define os módulos do projeto e suas dependências.
  * **workspace.xml**: Armazena as configurações do ambiente de desenvolvimento, incluindo configurações de execução e depuração.
  * **misc.xml**: Contém configurações diversas, como o JDK do projeto.
  * **.iml**: Arquivos de configuração de módulo específicos do IntelliJ que contêm informações sobre as dependências do módulo, o SDK e o compilador.
* **src**: Esta pasta contém o código-fonte do seu projeto, incluindo arquivos Java, arquivos de recursos e outros arquivos relacionados.
* **out ou target**: Esta pasta armazena os arquivos compilados gerados pelo IntelliJ IDEA ou por ferramentas de compilação externas, como o Maven ou o Gradle. Os arquivos nesta pasta são gerados automaticamente e geralmente não são incluídos no controle de versão.

### Cache e Índices:

![img#center](https://raw.githubusercontent.com/lobocode/lobocode.github.io/main/blog/content/post/images/idea/cache.png#center)

O IntelliJ IDEA utiliza cache e índices para acelerar a navegação, pesquisa e compilação de código. Essas informações são armazenadas no diretório de cache do sistema, que geralmente está localizado em `~/.cache/JetBrains/IntelliJIdea<versão>` no Linux, `%LOCALAPPDATA%\JetBrains\IntelliJIdea<versão>` no Windows e `~/Library/Caches/JetBrains/IntelliJIdea<versão>` no macOS. Os índices são usados para melhorar o desempenho de pesquisas e inspeções de código, enquanto o cache armazena dados temporários que podem ser reutilizados para acelerar a inicialização e a compilação do projeto. O IntelliJ IDEA usa o padrão de projeto Maven por padrão para organizar a estrutura do diretório do projeto e gerenciar dependências. O padrão Maven é amplamente utilizado na comunidade Java e facilita a colaboração entre desenvolvedores e a integração com outras ferramentas de desenvolvimento. No entanto, o IntelliJ IDEA também suporta outros padrões de projeto, como o Gradle. Depois de criar ou abrir um projeto, o IntelliJ IDEA configura o ambiente de desenvolvimento, incluindo a criação de uma configuração de execução e depuração, a vinculação do JDK e a configuração de outras ferramentas e plugins específicos do projeto. Essas configurações são armazenadas no arquivo `.idea/workspace.xml`.

### Customizando o IntelliJ IDEA

A pasta de cache do IntelliJ IDEA cresce principalmente devido ao armazenamento temporário de dados e arquivos gerados durante o uso do IDE. Esses dados incluem informações de índice, histórico de versões, arquivos compilados, configurações de execução e outros dados temporários. O cache é usado para melhorar o desempenho e a eficiência do IntelliJ IDEA, permitindo acesso rápido a informações frequentemente usadas e evitando a necessidade de regerar dados. No entanto, com o uso contínuo, a pasta de cache pode continuar a crescer e ocupar espaço significativo em disco. Isso acontece porque, em alguns casos, os arquivos temporários não são excluídos automaticamente pelo IDE. Além disso, o cache pode incluir dados de projetos que não estão mais em uso ou informações desatualizadas. Para controlar o crescimento da pasta de cache e liberar espaço em disco, você pode seguir estas etapas:

* **Limpar o cache do sistema**: No IntelliJ IDEA, vá para **File > Invalidate Caches / Restart**. Isso abrirá uma janela de diálogo onde você pode selecionar **Invalidate and Restart**. Isso limpará o cache do sistema e reiniciará o IntelliJ IDEA.
* **Excluir arquivos temporários manualmente**: Navegue até a pasta de cache do IntelliJ IDEA (geralmente localizada em `C:\Users\<username>\.IntelliJIdea<version>\system\` no Windows ou `~/Library/Caches/JetBrains/IntelliJIdea<version>/` no macOS) e exclua os arquivos e pastas que não são mais necessários. Certifique-se de fechar o IntelliJ IDEA antes de fazer isso para evitar possíveis problemas.
* **Configure o tamanho máximo do cache**: Você pode limitar o tamanho do cache ajustando as configurações do IntelliJ IDEA. Para fazer isso, vá para **Help > Edit Custom Properties** e adicione a seguinte linha: `idea.max.content.cache.size=<tamanho_em_MB>`. Salve o arquivo e reinicie o IntelliJ IDEA.

Ou se preferir, execute os scripts abaixo de acordo com cada OS:

### Linux

```bash
#!/bin/bash

# Remove o cache do IntelliJ IDEA
rm -rf ~/.cache/JetBrains/Idea*/caches/

# Adicionando o parametro idea.max.content.cache.size no custom properties
# Lembre-se de usar o valor que lhe for mais conveniente
echo "idea.max.content.cache.size=1024" >> ~/.IntelliJIdea*/config/options/custom.properties
```

### Windows

```powershell
# Remove o cache do IntelliJ IDEA
Remove-Item -Path "$env:LOCALAPPDATA\JetBrains\IntelliJIdea*\system\caches" -Recurse -Force
# Adicionando o parametro idea.max.content.cache.size no custom properties
# Lembre-se de usar o valor que lhe for mais conveniente
Add-Content -Path "$env:LOCALAPPDATA\JetBrains\IntelliJIdea*\config\options\custom.properties" -Value "idea.max.content.cache.size=1024"
```

### macOS

```bash
#!/bin/bash

# Remove o cache do IntelliJ IDEA
rm -rf ~/Library/Caches/JetBrains/IntelliJIdea*/system/caches

# Adicionando o parametro idea.max.content.cache.size no custom properties
# Lembre-se de usar o valor que lhe for mais conveniente
echo "idea.max.content.cache.size=1024" >> ~/Library/Preferences/JetBrains/IntelliJIdea*/options/custom.properties
```

O arquivo `idea.properties` que se encontra no caminho  **Help > Edit Custom Properties**, permite personalizar várias configurações do IntelliJ IDEA. No entanto, o recomendado é que ao invés de você editar diretamente o `idea.properties`, crie um `custom.properties`. Isso porque o `idea.properties` pode ser sobrescrito em uma atualização do IntelliJ IDEA. Aqui estão algumas configurações úteis que você pode adicionar ou modificar neste arquivo:

* **idea.max.content.cache.size**: Define o tamanho máximo do cache do IntelliJ IDEA. O valor padrão é 1024 MB.
* **idea.max.intellisense.filesize**: Define o tamanho máximo do arquivo para o qual o IntelliSense é aplicado. O valor padrão é 100 MB.
* **idea.max.intellisense.filesize.java**: Define o tamanho máximo do arquivo para o qual o IntelliSense é aplicado para arquivos Java. O valor padrão é 100 MB.
* **idea.max.intellisense.filesize.xml**: Define o tamanho máximo do arquivo para o qual o IntelliSense é aplicado para arquivos XML. O valor padrão é 100 MB.

> **Nota**: Perceba que você pode alterar o valor do intellisense para cada linguagem, como Java, XML, etc.

* **idea.system.path=<caminho_do_diretório_do_sistema>**: Define o caminho do diretório do sistema do IntelliJ IDEA. O valor padrão é `~/.IntelliJIdea<version>/system`.
* **idea.config.path=<caminho_do_diretório_de_configuração>**: Define o caminho do diretório de configuração do IntelliJ IDEA. O valor padrão é `~/.IntelliJIdea<version>/config`.
* **idea.heap.size.initial=<tamanho_inicial_em_MB>**: Define o tamanho inicial da memória heap do IntelliJ IDEA. O valor padrão é 256 MB.
* **idea.heap.size.maximum=<tamanho_máximo_em_MB>**: Define o tamanho máximo da memória heap do IntelliJ IDEA. O valor padrão é 750 MB.
* **idea.max.intellisense.filesize=<tamanho_em_KB>**: Define o tamanho máximo do arquivo para o qual o IntelliSense é aplicado. O valor padrão é 100 MB.
* **idea.plugins.path=<caminho_do_diretório_de_plugins>**: 
* **idea.save.files.automatically=false**: Desativa o salvamento automático de arquivos.
* **idea.cycle.buffer.size=<tamanho_em_KB>**: Define o tamanho do buffer de ciclo de vida do IntelliJ IDEA. O valor padrão é 100 MB.
* **idea.popup.weight=0.6**: Define a largura máxima dos pop-ups do IntelliJ IDEA como uma fração da largura da tela.
* **idea.smooth.scrolling=true**: Ativa o rolagem suave do IntelliJ IDEA.
* **idea.max.recent.projects=<número_de_projetos>**: Define o número máximo de projetos recentes que o IntelliJ IDEA deve exibir no menu **Arquivo > Abrir recentemente**.
* **idea.use.default.antialiasing.in.editor=true**: Ativa o antialiasing padrão no editor do IntelliJ IDEA.
* **disable.process.cache=true**: Desativa o cache de processos do IntelliJ IDEA. Isso pode ser útil se você estiver tendo problemas com o IntelliSense e queda de desempenho.

Para mais informações sobre as configurações do IntelliJ IDEA, consulte a **[documentação oficial](https://www.jetbrains.com/help/idea/tuning-the-ide.html#config-file)**. Se desejar agilizar o processo de customização do IntelliJ IDEA, você poderá editar as sugestões de scripts acima de acordo com seu SO e necessidade. Dessa forma, você poderá criar um script para cada configuração que desejar e executá-lo sempre que precisar caso mude de ambiente, por exemplo. Abaixo um exemplo de customização que você poderá adotar em seu IntelliJ IDEA:

```bash
#!/bin/bash

# Procurando a pasta correta e usando ela como padrão
ideaPath=$(find . -iname idea.properties -exec dirname {} \;)

# Cria o arquivo custom.properties
touch ~/$ideaPath/custom.properties

# Definindo tamanho máximo do cache
echo "idea.max.content.cache.size=1024" >> ~/$ideaPath/custom.properties
                                                    
# Definindo o heap inicial
echo "idea.heap.size.initial=1024" >> ~/$ideaPath/custom.properties

# Definindo o tamanho máximo de memória heap
echo "idea.heap.size.maximum=2048" >> ~/$ideaPath/custom.properties

# Definindo o tamanho do Buffer de ciclo de vida
echo "idea.cycle.buffer.size=1024" >> ~/$ideaPath/custom.properties

# Habilita a leitura do custom.properties no IntelliJ IDEA
echo "idea.config.path=$HOME/.IntelliJIdea*/config" >> ~/$ideaPath/custom.properties
```

No caso do Windows, recomendo ou que você use o **[GitBash](https://gitforwindows.org/)** para execução do script acima, ou que você utilize o WSL (Windows Subsystem for Linux). Para saber mais sobre o WSL, consulte o artigo **[WSL: O que é e como instalar no Windows 10](https://www.devmedia.com.br/wsl-o-que-e-e-como-instalar-no-windows-10/40650)**.

## Instalando plugins no IntelliJ IDEA

Você sabia que é possível instalar plugins no IntelliJ IDEA via linha de comando? Para isso, basta executar o comando abaixo:

```bash
$ ./idea.sh install-plugin <plugin_name>
``` 

Exemplo:

```bash
$ # instalando o plugin github-copilot
$ ./idea.sh install-plugin github-copilot
```

Agora podemos explorar isso de uma forma mais divertida. Vamos criar um script que instala uma lista de plugins no IntelliJ IDEA. Para isso, crie um arquivo chamado `install-plugins.sh` e adicione o seguinte conteúdo:

```bash
#!/bin/bash

# Lista de plugins que serão instalados

PLUGINS=(
    "github-copilot"
    "gitignore"
    "lombok"
    "material-theme-ui"
    "sonarlint"
    "sonarqube-community"
    "string-manipulation"
    "yaml"
)

# Instalando os plugins
for plugin in "${PLUGINS[@]}"; do
    ./idea.sh install-plugin $plugin
done
```

Agora edite o arquivo `custom.properties` e adicione o seguinte conteúdo:

```bash
idea.plugins.path=~/plugins
```

Ou se preferir, você pode usar o diretório padrão que fica em `~/.IntelliJIdea<version>/config/plugins`. Agora execute o script `install-plugins.sh` e veja os plugins sendo instalados no IntelliJ IDEA:

```bash
$ ./install-plugins.sh
```

Bastante prático, não é mesmo? Agora você pode criar um script para cada configuração que desejar e executá-lo sempre que precisar caso mude de ambiente.

## Customizando a JVM do IntelliJ IDEA

O IntelliJ IDEA pode consumir bastante recursos no geral. Por isso, é importante que você configure a JVM corretamente para que o software funcione de forma satisfatória. Para isso, você pode ir em Help > Edit Custom VM Options que irá abrir o arquivo `idea64.exe.vmoptions` ou `idea64.vmoptions` (dependendo do seu sistema operacional) no diretório de instalação do IntelliJ IDEA. Neste arquivo, você pode adicionar as seguintes configurações:

* **-Xms1024m**: Define o tamanho inicial da memória heap do IntelliJ IDEA. O valor padrão é 256 MB.
* **-Xmx2048m**: Define o tamanho máximo da memória heap do IntelliJ IDEA. O valor padrão é 750 MB.
* **-XX:ReservedCodeCacheSize=240m**: Define o tamanho do cache de código reservado do IntelliJ IDEA. O valor padrão é 240 MB.
* **-XX:+UseConcMarkSweepGC**: Ativa o coletor de lixo do tipo CMS (Concurrent Mark Sweep) do IntelliJ IDEA.
* **-XX:SoftRefLRUPolicyMSPerMB=50**: Define a política de referência suave do IntelliJ IDEA.
* **-XX:+Use<GC>**: - Define o coletor de lixo a ser usado (G1, Parallel, ConcMarkSweep, etc.)
* **-XX:MaxGCPauseMillis=<value>**: - Define o tempo máximo de pausa para a coleta de lixo
* **-XX:ParallelGCThreads=<value>**: - Define o número de threads usadas pelo coletor de lixo paralelo
* **-XX:NewSize=128m**: Define o tamanho inicial da memória heap do IntelliJ IDEA
* **-XX:MaxNewSize=256m**: Define o tamanho máximo da memória heap do IntelliJ IDEA

Para mais informações, acesse a documentação oficial do IntelliJ IDEA em **[https://www.jetbrains.com/help/idea/tuning-the-ide.html](https://www.jetbrains.com/help/idea/tuning-the-ide.html)**.


## Reparando o IntelliJ IDEA

Se você estiver tendo problemas com o IntelliJ IDEA, você pode tentar reparar o software. Para isso, basta executar o comando abaixo:

```bash
$ ./idea.sh repair
```

Ou se preferir, você pode ir em File > Repair IDE. Desta forma, o IntelliJ IDEA irá reparar o software e reiniciar automaticamente. 

## Definindo estrutura do projeto

É possível também definir a estrutura do projeto tudo por linha de comando. Para isso, basta executar o comando abaixo:

```bash
./idea.sh create-project --name <project_name>
--group <group_id>
--artifact <artifact_id>
--version <version>
--package <package_name>
--src <source_directory>
--test <test_directory>
--out <output_directory>
--project <project_directory>
--location <project_location>
--language <language>
--build-system <build_system>
--jdk <jdk_version>
--sample-code
```

Onde os parâmetros são:

* **--name**: Nome do projeto.
* **--group**: ID do grupo. Por exemplo, `com.example`.
* **--artifact**: ID do artefato. Por exemplo, `my-project`.
* **--version**: Versão do projeto. Por exemplo, `1.0-SNAPSHOT`.
* **--package**: Nome do pacote. Por exemplo, `com.example.myproject`.
* **--src**: Diretório de origem. Por exemplo, `src/main/java`.
* **--test**: Diretório de testes. Por exemplo, `src/test/java`.
* **--out**: Diretório de saída. Por exemplo, `target/classes`.
* **--project**: Diretório do projeto. Por exemplo, `.`.
* **--location**: Localização do projeto. Por exemplo, `.`.
* **--language**: Linguagem do projeto. Por exemplo, `Java`.
* **--build-system**: Sistema de build do projeto. Por exemplo, `Maven`.
* **--jdk**: Versão do JDK. Por exemplo, `11`.
* **--sample-code**: Adiciona código de exemplo (OPCIONAL).

Exemplo:

```bash
./idea.sh create-project --name myproject
--group com.example
--artifact myproject
--version 1.0.0
--package com.example.myproject
--src src/main/java
--test src/test/java
--out target
--project .
--location ~/projects/myproject
--language Java
--build-system Maven
--jdk 11
--sample-code
```

Isso criaria um projeto Java com Maven no diretório ~/projects/myproject, com a estrutura de diretórios padrão do Maven, e com um código de exemplo. Além disso, o repositório Git seria inicializado e o primeiro commit seria feito. Você pode fazer tudo isso de forma interativa também se preferir através da interface gráfica do IntelliJ IDEA. Para isso, basta ir em `File > New > Project` e seguir os passos. Também é possível configurar macros diversos no IntelliJ IDEA. Por exemplo:


## Tips and Tricks

O IntelliJ IDEA possui muitos hotkeys que podem ajudar a melhorar a produtividade no dia-a-dia. Aqui estão alguns exemplos úteis:

* **Ctrl + Shift + T (ou Cmd + Shift + T no Mac)**: Abre a caixa de diálogo "Go to Test" (Ir para teste), que permite navegar rapidamente entre o código de produção e o código de teste.
* **Ctrl + Shift + Alt + T (ou Cmd + Shift + Option + T no Mac)**: Abre a caixa de diálogo "Surround With" (Cercar com), que permite cercar um bloco de código com uma estrutura específica, como um try-catch.
* **Ctrl + Shift + A (ou Cmd + Shift + A no Mac)**: Abre a caixa de diálogo "Find Action" (Encontrar ação), que permite pesquisar rapidamente por qualquer ação, configuração ou opção no IntelliJ IDEA.
* **Ctrl + Alt + V (ou Cmd + Option + V no Mac)**: Extrai uma expressão em uma variável, ajudando a evitar a repetição de código.
* **Ctrl + Alt + M (ou Cmd + Option + M no Mac)**: Extrai um trecho de código em um método, tornando o código mais legível e reutilizável.
* **Ctrl + Shift + F (ou Cmd + Shift + F no Mac)**: Procura por um texto específico em todo o código do projeto, incluindo arquivos não abertos.
* **Ctrl + Shift + U (ou Cmd + Shift + U no Mac)**: Alterna entre letras maiúsculas e minúsculas, ajudando a corrigir erros de digitação.
* **Alt + Enter (ou Option + Enter no Mac)**: Abre a janela de sugestões do IntelliJ IDEA, que oferece correções de código e outras sugestões úteis.
* **Ctrl + D (ou Cmd + D no Mac)**: Duplica uma linha de código.
* **Ctrl + / (ou Cmd + / no Mac)**: Comenta a linha atual ou o bloco selecionado de código.

Para mais informações, acesse o seguinte **[cheatsheet do IntelliJ IDEA](https://resources.jetbrains.com/storage/products/intellij-idea/docs/IntelliJIDEA_ReferenceCard.pdf)** onde contém uma lista completa de todos os hotkeys disponíveis. Além dos hotkeys listados, é possível salvar as configurações do IntelliJ IDEA em um repositório Git e sincronizar as configurações em diferentes computadores. Para isso, basta seguir os passos abaixo:

1. Abra o IntelliJ IDEA e vá para `File > Manage IDE Settings > Export Settings` (Arquivo > Gerenciar configurações do IDE > Exportar configurações).
2. Selecione as configurações que deseja exportar (como hotkeys, configurações de editor, etc.) e escolha um local para salvar o arquivo ZIP que contém as configurações exportadas.
3 . Crie um repositório Git para o projeto e coloque-o no GitHub ou em qualquer outro serviço de hospedagem de repositórios Git.
4. Extraia o arquivo ZIP que contém as configurações exportadas e copie a pasta ".idea" para a raiz do diretório do seu projeto Git.
5. No IntelliJ IDEA, vá para `File > Manage IDE Settings > Import Settings` (Arquivo > Gerenciar configurações do IDE > Importar configurações) e selecione a pasta ".idea" que você acabou de copiar para o diretório do projeto.
6. Selecione as configurações que deseja importar e escolha "OK".
7. As configurações do IntelliJ IDEA agora estão sincronizadas em todos os computadores que clonaram o repositório Git.

Você pode também simplificar esse passos por linha de comando usando o seguinte comando:

```bash
# Exportando as configurações do IntelliJ IDEA para um arquivo ZIP
./idea.sh export -o ~/settings.zip
```

E para importar:

```bash
# Importando as configurações do IntelliJ IDEA de um arquivo ZIP
./idea.sh import -i ~/settings.zip
```

Lembrando que o idea.sh se refere ao script que está na pasta bin do IntelliJ IDEA para Linux e Mac. No Windows, o script é chamado de idea.bat ou diretamente pelo binário idea.exe. É importante lembrar que algumas configurações podem ser específicas do sistema operacional ou do ambiente de desenvolvimento em que você está trabalhando, então é importante verificar se as configurações exportadas são relevantes para todos os computadores em que você deseja sincronizá-las.

### IntelliJ IDEA Ultimate vs IntelliJ IDEA Community

O IntelliJ IDEA Ultimate é a versão completa e paga do IntelliJ IDEA, e possui recursos avançados que não estão disponíveis na versão Community. Alguns dos recursos exclusivos do IntelliJ IDEA Ultimate incluem:

* **Suporte avançado a frameworks**: O IntelliJ IDEA Ultimate possui suporte completo para vários frameworks, incluindo Spring, Java EE, Grails, Play, Micronaut e outros.
* **Análise de código**: O IntelliJ IDEA Ultimate possui recursos avançados de análise de código que podem detectar problemas e sugerir melhorias de código em tempo real.
* **Ferramentas de banco de dados**: O IntelliJ IDEA Ultimate possui suporte integrado para vários bancos de dados e permite trabalhar com SQL diretamente na IDE.
* **Testes de desempenho**: O IntelliJ IDEA Ultimate possui recursos avançados de profiling e testes de desempenho que podem ajudar a identificar gargalos de desempenho e otimizar o código.
* **Suporte a linguagens**: O IntelliJ IDEA Ultimate oferece suporte a várias linguagens de programação além do Java, incluindo Kotlin, Groovy, Scala, TypeScript e outras.
* **Refatoração de código avançada**: O IntelliJ IDEA Ultimate possui várias ferramentas de refatoração de código avançadas que podem ajudar a reorganizar e simplificar o código.
* **Suporte para ambientes de desenvolvimento remoto**: O IntelliJ IDEA Ultimate possui recursos avançados para trabalhar com ambientes de desenvolvimento remoto, incluindo SSH e Docker.

> **OBS**: Na minha opinião, o IntelliJ IDEA Community é mais do que suficiente na maioria casos. Particularmente não vejo muita necessidade de pagar por uma licença do IntelliJ IDEA Ultimate, pois a versão Community já oferece tudo o que eu preciso para trabalhar. Então vale a pena analisar bem se realmente vale a pena pagar por uma licença do IntelliJ IDEA Ultimate.

## Conclusão

Do ponto de vista técnico, o IntelliJ IDEA é uma aplicação que não exige tanto recurso quanto se espera. Por exemplo, a versão 2021.3 exige um sistema operacional de 64 bits que já é padrão hoje em dia, um processador Intel ou AMD de 2,3 GHz ou superior, pelo menos 4 GB de RAM (recomendado 8 GB ou mais), 2 GB de espaço em disco e uma placa de vídeo compatível com DirectX 11 ou posterior. Apesar do IntelliJ IDEA usar a biblioteca gráfica Swing para sua interface, já não é mais um problema para a maioria dos computadores modernos (é mais leve do que IDEs como Eclipse e NetBeans e em alguns casos até do que o próprio Visual Studio Code). É comum encontrar a informação de que que o Java é lento por causa do uso de IDEs. Na verdade, esta é uma informação equivocada pois, a velocidade de execução de um programa em Java não é afetada pelo uso de uma IDE, mas por sua implementação e por como você configura a JVM. O uso de uma IDE, como o IntelliJ IDEA, pode até melhorar a performance do desenvolvimento fornecendo recursos avançados.

---

## Referências

* **[IntelliJ IDEA](https://www.jetbrains.com/pt-br/idea/)**
* **[IntelliJ IDEA: The Java IDE for Professional Developers](https://www.jetbrains.com/pt-br/idea/features/)**
* **[Artigo de IntelliJ IDEA da Alura](https://www.alura.com.br/artigos/dicas-e-truques-de-intellij-idea-para-quem-esta-comecando)**