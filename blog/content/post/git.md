+++
title = "Git"
description = "Git além do básico"
date = 2023-03-19T17:31:45-03:00
tags = ["git"]
draft = true
weight = 9
author = "Vitor Lobo Ramos"
+++


## Table of Contents

- [Comandos de Log no Git](#comandos-de-log-no-git)
- [Branches e Stash](#branches-e-stash)
- [Acompanhando Renomeações de Arquivos](#acompanhando-renomeacoes-de-arquivos)
- [Histórico com Decoração](#histórico-com-decoração)
- [Comparando Mudanças com git diff](#comparando-mudancas-com-git-diff)
   - [Exibindo Informações de Commits com git show](#exibindo-informacoes-de-commits-com-git-show)
- [Usando git rebase](#usando-git-rebase)
- [Gerenciando Stash](#gerenciando-stash)
- [Desfazendo Alterações e Cherry-pick](#desfazendo-alteracoes-e-cherry-pick)
- [Atribuindo Alterações com git blame](#atribuindo-alteracoes-com-git-blame)
- [Gerenciando Versões com Tags](#gerenciando-versoes-com-tags)
   - [Criando e Exibindo Tags](#criando-e-exibindo-tags)
   - [Enviando Tags para o Repositório Remoto](#enviando-tags-para-o-repositorio-remoto)
   - [Removendo Tags](#removendo-tags)

---

Neste artigo, vamos explorar comandos que muitas vezes não usamos com frequência, mas que podem ser muito úteis no seu dia a dia como desenvolvedor. Vamos nessa!

## Comandos de Log no Git

O comando `git log` é essencial para navegar e entender o histórico de um repositório, mas ele pode ser muito mais poderoso quando usado com algumas opções adicionais. Por padrão, o `git log` mostra a lista dos commits realizados no repositório, exibindo informações como hash, autor, data e a mensagem do commit. No entanto, para explorar detalhes mais profundos das mudanças de código, o Git oferece diversas opções que ampliam essa funcionalidade.

Quando você deseja ver as mudanças exatas feitas em cada commit, pode usar a opção `-p` (ou `--patch`). Essa opção gera um *diff* entre os arquivos modificados, mostrando o que foi adicionado e o que foi removido. Cada linha removida aparece com um sinal de `-` e cada linha adicionada aparece com um `+`. Imagine que você tem um arquivo `HelloWorld.java` com o seguinte conteúdo:

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

Se você editar a mensagem de saída para `System.out.println("Hello, Git!")`, depois fizer o commit e rodar o comando `git log -p`, o resultado seria algo assim:

```bash
commit abc123...
Author: Seu Nome
Date:   ...

    Atualizando a saída do programa

diff --git a/HelloWorld.java b/HelloWorld.java
index 83db48d..1d56b5e 100644
--- a/HelloWorld.java
+++ b/HelloWorld.java
@@ -2,5 +2,5 @@ public class HelloWorld {
    public static void main(String[] args) {
-       System.out.println("Hello, World!");
+       System.out.println("Hello, Git!");
    }
}
```

O `git log -p` não apenas mostra o histórico dos commits, mas também detalha as mudanças feitas em cada commit, linha por linha. Caso você queira um resumo do que foi alterado em vez do conteúdo exato das mudanças, a opção `--stat` é ideal. Ela mostra o número de linhas adicionadas e removidas para cada arquivo alterado em um commit. Exemplo:

```bash
git log --stat
```

O resultado para o exemplo acima seria algo assim:

```bash
 HelloWorld.java | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Aqui, vemos que o arquivo `HelloWorld.java` teve uma linha adicionada e uma removida. Isso é útil para ter uma visão geral das mudanças sem entrar em muitos detalhes. Se a intenção é ver apenas quais arquivos foram alterados em cada commit, sem mostrar as diferenças no código ou o número de linhas modificadas, você pode usar `--name-only`. Isso exibe apenas o nome dos arquivos afetados por cada commit. Exemplo:

```bash
git log --name-only
```

O resultado seria algo como:

```bash
commit abc123...
Author: Seu Nome
Date:   ...

    Atualizando a saída do programa

HelloWorld.java
```

O `git log` também permite pesquisar commits com base em conteúdos específicos modificados. Você pode buscar por commits que alteraram uma linha contendo uma string ou que adicionaram/removeram uma determinada palavra. Para isso, as opções `-S` e `-G` são bastante úteis.

- `-S<string>`: Busca commits onde o número de ocorrências de uma string mudou (ou seja, onde essa string foi adicionada ou removida).
- `-G<regex>`: Busca commits onde o *diff* contém linhas que correspondem a uma expressão regular. Exemplo:

```bash
git log -S"System.out.println"
```

Isso exibiria todos os commits onde a ocorrência de `System.out.println` foi modificada.

```bash
git log -G"main"
```

Aqui, seriam listados commits onde qualquer mudança no *diff* envolve a palavra `main`. O Git permite uma personalização bastante detalhada na exibição do log. Por exemplo, você pode usar `--oneline` para obter uma visão compacta dos commits, onde apenas o hash abreviado e a mensagem do commit são exibidos:

```bash
git log --oneline
```

Se precisar de mais informações, como o autor e a data em uma linha compacta, o `git log --pretty` permite ajustar o formato da saída conforme suas necessidades:

```bash
git log --pretty=format:"%h - %an, %ar : %s"
```

Esse comando exibiria algo como:

```bash
abc1234 - Seu Nome, 2 hours ago : Atualizando a saída do programa
```

Essa flexibilidade torna o `git log` uma ferramenta poderosa para inspeção e entendimento do histórico de um projeto, ajustando a exibição conforme o nível de detalhe necessário.

---

## Branches e Stash

Branches e o comando `stash` são funcionalidades avançadas do Git que permitem uma gestão mais eficiente do fluxo de trabalho, especialmente quando se lida com mudanças em múltiplos contextos ou quando surgem urgências inesperadas. Vamos explorar cada um deles em detalhes.

O conceito de branch (ramo) é fundamental no Git, pois ele permite criar linhas paralelas de desenvolvimento. Ao trabalhar em uma feature específica, correções de bugs, ou melhorias, é comum criar uma nova branch para isolar essas mudanças, sem afetar o código da branch principal. Exemplo:

- Suponha que você esteja trabalhando na branch principal (`main`), e decidiu iniciar o desenvolvimento de uma nova funcionalidade. Para manter o código organizado, você cria uma nova branch:

```bash
git checkout -b nova-feature
```

O comando `checkout -b` cria uma nova branch chamada `nova-feature` e automaticamente troca para ela. Agora você pode começar a implementar a nova funcionalidade sem interferir no trabalho da branch `main`.

Às vezes, enquanto está trabalhando em uma feature, algo urgente acontece, e você precisa interromper o que está fazendo para resolver um problema em outra branch, como a branch principal. No entanto, as suas mudanças ainda não estão prontas para serem commitadas. Nesse caso, você pode "guardar" temporariamente essas modificações usando o `git stash`. Exemplo:

- Imagine que você está no meio da implementação de uma nova funcionalidade na branch `nova-feature` e de repente precisa resolver um bug na branch `main`. Ao invés de fazer um commit das suas mudanças inacabadas, você pode usar o `git stash` para salvá-las temporariamente:

```bash
git stash
```

O comando `stash` armazena suas mudanças locais (modificações em arquivos rastreados e novos arquivos que ainda não foram commitados) em uma espécie de pilha, deixando o seu ambiente de trabalho limpo, como se nenhuma modificação tivesse sido feita. Agora, você pode trocar de branch para resolver o problema na `main`:

```bash
git checkout main
```

Após resolver o problema e fazer o commit necessário, você pode retornar à sua branch de desenvolvimento e restaurar as mudanças temporárias:

```bash
git checkout nova-feature
git stash pop
```

O `git stash pop` recupera as mudanças que você havia guardado anteriormente e as aplica de volta ao seu ambiente atual. Além disso, ele remove essas mudanças da pilha de stashes, ao contrário de `git stash apply`, que aplica as mudanças mas as mantém na pilha para possível reutilização. Suponha que, na branch `nova-feature`, você tenha começado a implementar uma nova funcionalidade no arquivo `Feature.java`:

```java
public class Feature {
    public void newFeature() {
        System.out.println("Implementando nova funcionalidade...");
    }
}
```

Mas antes de completar essa implementação, surge um bug crítico na branch `main` que precisa ser corrigido imediatamente. Você pode fazer o *stash* das suas mudanças para salvá-las temporariamente:

```bash
git stash
```

Em seguida, você troca para a branch `main`, resolve o bug e faz o commit necessário:

```bash
git checkout main
# Resolver o bug e commitar
git commit -am "Corrigindo bug crítico"
```

Depois de resolver o problema, você pode voltar à branch `nova-feature` e restaurar as mudanças que estavam no *stash*:

```bash
git checkout nova-feature
git stash pop
```

Agora, seu código da nova funcionalidade será restaurado exatamente como estava antes de fazer o *stash*, e você pode continuar trabalhando. Se você utilizar `git stash` várias vezes, suas mudanças serão empilhadas, e cada entrada da pilha terá um número de índice, permitindo que você recupere stashes específicos. Para visualizar os stashes salvos, use:

```bash
git stash list
```

Isso exibirá algo assim:

```bash
stash@{0}: WIP on nova-feature: abc1234 Implementando nova funcionalidade
stash@{1}: WIP on main: def5678 Corrigindo bug crítico
```

Se você quiser aplicar um *stash* específico, pode usar o índice:

```bash
git stash apply stash@{1}
```

Isso aplicará as mudanças daquele *stash*, mas ele permanecerá na lista de stashes até que você decida removê-lo manualmente. A combinação de branches e *stash* permite trabalhar de forma mais organizada, especialmente em projetos que envolvem múltiplas tarefas e onde a urgência pode surgir a qualquer momento.

Usar `git stash` garante que você possa alternar entre contextos de trabalho sem comprometer o progresso atual, enquanto o uso de branches ajuda a manter o código isolado e organizado. O Git, com seus comandos poderosos, possibilita uma fluidez no desenvolvimento, permitindo que você gerencie várias tarefas simultaneamente sem perder o controle sobre o que está sendo alterado em cada branch ou área de trabalho.

---

## Acompanhando Renomeações de Arquivos

Ao trabalhar em projetos de software que evoluem ao longo do tempo, é comum que arquivos sejam renomeados por diversos motivos — seja por mudanças na arquitetura do sistema ou pela necessidade de um nome mais descritivo. Quando isso acontece, o comando padrão `git log` exibe apenas o histórico de commits feitos após a renomeação, o que pode ser um problema se você quiser rastrear todas as mudanças desde a criação do arquivo, incluindo o período em que ele tinha um nome diferente.

Para resolver esse problema, o Git oferece a opção `--follow`, que permite rastrear o histórico completo de um arquivo, mesmo após renomeações. Imagine que você tem um projeto Java e, inicialmente, um arquivo chamado `UserController.java` foi criado.

Esse arquivo evoluiu ao longo do tempo, mas em determinado momento foi renomeado para `AccountController.java` para refletir melhor sua nova responsabilidade. Se você executar o comando `git log` no arquivo `AccountController.java`, verá apenas os commits feitos após a renomeação, como mostra o exemplo:

```bash
git log AccountController.java
```

No entanto, você quer visualizar todas as mudanças feitas, inclusive aquelas que ocorreram quando o arquivo ainda era chamado `UserController.java`. Para isso, você pode usar a opção `--follow`:

```bash
git log --follow AccountController.java
```

Com essa opção, o Git vai rastrear o histórico do arquivo desde a sua criação, passando pelas mudanças que ocorreram quando ele ainda tinha o nome `UserController.java`. Isso é extremamente útil para entender o contexto completo das alterações, sem a interrupção causada pela renomeação.

O Git, por padrão, trata um arquivo renomeado como um novo arquivo, razão pela qual `git log` sem a opção `--follow` mostra apenas os commits após a renomeação. A opção `--follow` faz com que o Git rastreie o histórico além do ponto da renomeação, verificando o histórico anterior do arquivo com o nome antigo.

Isso é especialmente útil em projetos grandes, onde mudanças estruturais podem acontecer frequentemente, mas você ainda precisa manter a capacidade de auditar todo o histórico de modificações em arquivos chave. Suponha que, inicialmente, o arquivo `UserController.java` continha o seguinte código:

```java
public class UserController {
    public String getUser() {
        return "User data";
    }
}
```

Mais tarde, após várias mudanças, o arquivo foi renomeado para `AccountController.java` e agora contém o seguinte:

```java
public class AccountController {
    public String getAccount() {
        return "Account data";
    }
}
```

Se você rodar apenas o comando `git log AccountController.java`, o resultado exibido será algo como:

```bash
commit abc123...
Author: Seu Nome
Date:   ...

    Renomeando UserController para AccountController

commit def456...
Author: Seu Nome
Date:   ...

    Alterando método para getAccount
```

No entanto, ao usar `--follow`, o Git também exibirá o histórico de `UserController.java`, incluindo os commits antes da renomeação:

```bash
commit abc123...
Author: Seu Nome
Date:   ...

    Renomeando UserController para AccountController

commit def456...
Author: Seu Nome
Date:   ...

    Alterando método para getAccount

commit ghi789...
Author: Seu Nome
Date:   ...

    Criando UserController.java com método getUser
```

Agora você tem o histórico completo do arquivo, desde sua criação até sua forma atual, sem lacunas. Assim como o comando `git log` permite várias opções adicionais, você pode combiná-las com `--follow` para personalizar ainda mais a exibição do histórico de arquivos renomeados. Por exemplo:

- **Mostrar as alterações em formato de patch**:
  ```bash
  git log --follow -p AccountController.java
  ```

  Isso exibe as mudanças exatas feitas no arquivo ao longo de todo o seu histórico, desde que foi criado como `UserController.java`.

- **Mostrar um resumo das mudanças (linhas adicionadas/removidas)**:
  ```bash
  git log --follow --stat AccountController.java
  ```

Esse comando dá uma visão geral das alterações feitas, com o número de linhas modificadas em cada commit. A opção `--follow` é uma ferramenta poderosa para rastrear o histórico completo de arquivos que foram renomeados. Ela garante que você tenha acesso a todas as mudanças feitas em um arquivo, independentemente do nome que ele tinha no passado, o que é fundamental para uma boa gestão do código em projetos de longa duração.

---

## Histórico com decorate

A opção `--decorate` no Git é usada para exibir informações extras sobre onde os commits estão referenciados no repositório, como branches e tags. Isso é particularmente útil quando você está revisando o histórico de um projeto e quer ver de forma clara em quais branches ou tags cada commit está presente.

Imagine que você está investigando um bug que foi corrigido em uma branch de *hotfix* e quer saber se essa correção já foi integrada na branch `main`. Você pode usar a opção `--decorate` para ver em quais branches e tags os commits estão. Assim, fica mais fácil visualizar se o commit da correção foi incorporado na branch `main` ou em outras branches relevantes.

**Comando:**

```bash
git log --decorate=short
```

O resultado mostrará o histórico dos commits e, ao lado de cada commit, as informações de quais branches ou tags fazem referência a esse commit. Por exemplo:

```bash
commit abc1234 (HEAD -> hotfix-1, main)
Author: Seu Nome
Date:   ...

    Corrigindo bug crítico
```

Nesse caso, você pode ver que o commit `abc1234` está presente tanto na branch `hotfix-1` quanto na branch `main`, o que indica que a correção foi integrada. Você pode personalizar ainda mais o comportamento de `--decorate` com diferentes modos:

- **`--decorate=full`**: Exibe os nomes completos das branches e tags, incluindo o nome completo de refs remotas.
- **`--decorate=short`**: Exibe uma versão abreviada das referências, como mostrado no exemplo acima.

Essas opções ajudam a visualizar facilmente o estado do repositório e em quais partes ele foi atualizado, seja em branches locais ou remotas, com uma visão mais clara do que está acontecendo no histórico de commits.

A opção `--decorate` é uma ferramenta valiosa para rastrear onde os commits estão referenciados no repositório, especialmente quando se trabalha com múltiplas branches ou tags. O uso de `--decorate` facilita a visualização do histórico e garante que você possa acompanhar se commits importantes, como correções de bugs, foram devidamente propagados pelas branches principais do projeto.

---

### Comparando Mudanças com `git diff`

O comando `git diff` é uma das ferramentas mais poderosas do Git para comparar alterações entre diferentes versões do seu código. Ele permite verificar as mudanças entre o estado atual e o último commit, entre branches, ou mesmo entre commits específicos. Vamos explorar algumas das funcionalidades mais úteis do `git diff` e como ele pode ajudar a revisar mudanças de forma eficiente.

Imagine o seguinte cenário: você fez um commit que alterou vários arquivos, mas depois percebe que se esqueceu de revisar algo. Agora, você quer verificar todas as mudanças que foram feitas nesse commit, inclusive os arquivos que não fazem parte da sua área de trabalho atual. Para isso, você pode usar a opção `--full-diff`, que permite visualizar o *diff* completo de um commit, mesmo se você estiver interessado em um único arquivo.

**Exemplo:**

```bash
git log --full-diff <file>
```

Essa opção mostra todas as diferenças introduzidas no commit, abrangendo todos os arquivos modificados, não apenas o arquivo especificado. Isso é útil quando você quer revisar o escopo completo de um commit que pode ter impacto em várias partes do projeto.

Um dos usos mais comuns do `git diff` é comparar mudanças entre branches diferentes. Por exemplo, você pode estar trabalhando em uma branch de feature chamada `nova-feature` e quer revisar as diferenças entre essa branch e a branch principal (`main`) antes de integrar as mudanças com um *merge*.

**Exemplo:**

```bash
git diff main...nova-feature
```

Esse comando compara o estado atual da branch `nova-feature` com a branch `main`, mostrando todas as mudanças feitas em `nova-feature` que ainda não estão presentes em `main`. É uma excelente forma de revisar o impacto das alterações antes de fazer o *merge*.

Na comparação entre branches, o uso de `...` tem um significado especial. Ele mostra as diferenças entre o ponto de divergência (ou o commit comum mais recente) das duas branches até o estado atual da branch que você está comparando. Isso ajuda a focar apenas nas mudanças que realmente ocorreram após as branches se separarem.

Se você quiser comparar diretamente os estados das duas branches sem levar em consideração o ponto de divergência, você pode usar apenas dois pontos (`..`), o que compararia o último commit de `main` com o último commit de `nova-feature`:

```bash
git diff main..nova-feature
```

Se você quiser focar a comparação em arquivos específicos entre duas branches, pode especificar o arquivo diretamente no comando `git diff`. Por exemplo, para ver as diferenças apenas no arquivo `AccountController.java` entre as duas branches:

```bash
git diff main...nova-feature AccountController.java
```

Isso exibirá as mudanças feitas apenas nesse arquivo, ignorando outras alterações no restante do projeto. Além de comparar branches, `git diff` pode ser usado em vários outros cenários:

- **Comparar o estado atual com o último commit**:
  ```bash
  git diff
  ```
  Isso mostra as mudanças que você fez no seu ambiente de trabalho (arquivos modificados mas não commitados) em comparação com o último commit.

- **Comparar mudanças entre commits específicos**:
  ```bash
  git diff <commit1> <commit2>
  ```
  Isso mostra as mudanças entre dois commits específicos.

- **Comparar mudanças com a área de staging**:
  ```bash
  git diff --staged
  ```
  Exibe as diferenças entre o que está na área de staging (arquivos preparados para commit) e o último commit.

O comando `git diff` é uma ferramenta essencial para verificar mudanças no seu repositório, seja para revisar o que foi modificado localmente, comparar branches antes de um *merge*, ou visualizar as alterações entre commits passados.

Ele oferece flexibilidade e controle sobre como você pode auditar o código e garantir que as mudanças feitas estejam alinhadas com o esperado. Usar `--full-diff` e comparar branches com `...` são apenas algumas das maneiras de explorar seu potencial ao máximo.

---

### Exibindo Informações de Commits com git show

O comando `git show` é uma maneira prática de revisar detalhes de um commit específico, mostrando tanto os metadados quanto as alterações de código realizadas. Ele fornece uma visão abrangente de um commit, exibindo informações como o autor, a data, a mensagem de commit e o *diff* que mostra as mudanças feitas no código. Se você acabou de fazer um commit e deseja revisar imediatamente as mudanças que foram incluídas, o comando mais simples é:

```bash
git show
```

Isso exibe as informações do último commit realizado, incluindo:

- **Metadados do Commit**: como o autor, a data e a mensagem do commit.
- **Mudanças no Código**: o *diff* detalhado mostrando o que foi adicionado ou removido em cada arquivo.

Por exemplo, após um commit em um projeto Java, o resultado de `git show` pode ser algo assim:

```bash
commit abc1234...
Author: Seu Nome
Date:   ...

    Atualizando o método de autenticação

diff --git a/src/UserController.java b/src/UserController.java
index 83db48d..1d56b5e 100644
--- a/src/UserController.java
+++ b/src/UserController.java
@@ -10,7 +10,7 @@ public class UserController {
     public String authenticate(String username, String password) {
         if (username.equals("admin") && password.equals("123")) {
-            return "Authenticated";
+            return "User authenticated successfully";
         }
         return "Authentication failed";
     }
}
```

Aqui, além das informações básicas, vemos que o método `authenticate` no arquivo `UserController.java` foi modificado. A linha `- return "Authenticated";` foi substituída por `+ return "User authenticated successfully";`. Se você quiser visualizar um commit específico, em vez de apenas o último, pode fornecer o hash do commit como argumento para `git show`. O hash é um identificador único que o Git gera para cada commit.

**Exemplo:**

```bash
git show abc1234
```

Esse comando exibe as mesmas informações detalhadas, mas para o commit identificado pelo hash `abc1234`. Além de visualizar um commit específico, o `git show` pode ser usado para exibir informações de outros objetos no Git, como tags ou blobs. No entanto, seu uso mais comum continua sendo a revisão de commits.

**Exemplos de Uso Adicional:**

- **Exibir informações de uma tag**:
  ```bash
  git show v1.0.0
  ```

Esse comando exibe informações sobre a tag `v1.0.0`, incluindo o commit que ela referencia.

- **Exibir o conteúdo de um blob (arquivo)**:
  ```bash
  git show HEAD:<caminho-do-arquivo>
  ```

Esse comando exibe o conteúdo de um arquivo em um commit específico, como o arquivo na cabeça da branch (`HEAD`). Assim como muitos outros comandos do Git, o `git show` pode ser customizado com diversas opções. Por exemplo:

- **Mostrar um resumo das alterações**: Em vez de mostrar o *diff* completo, você pode optar por exibir apenas um resumo das mudanças nos arquivos.

  ```bash
  git show --stat
  ```

  O resultado seria algo como:

  ```bash
  commit abc1234...
  Author: Seu Nome
  Date:   ...

      Atualizando o método de autenticação

   src/UserController.java | 2 +-
   1 file changed, 1 insertion(+), 1 deletion(-)
  ```

- **Mostrar apenas as mensagens de commit**: Se você quiser ver apenas a mensagem do commit e ignorar o *diff* ou outras informações, pode usar:

  ```bash
  git show --no-patch
  ```

O `git show` é uma maneira eficiente de revisar detalhes completos de um commit específico no Git. Ele é especialmente útil para rever rapidamente as alterações feitas logo após um commit, ou para inspecionar um commit passado a partir de seu hash. Seja para entender o contexto de uma mudança ou verificar o impacto no código, `git show` oferece uma visão detalhada e informativa do histórico do seu repositório.

---

## Usando git rebase

O comando `git rebase` é uma ferramenta poderosa no Git, frequentemente subestimada ou mal compreendida. Ele é usado principalmente para manter um histórico de commits mais limpo e linear, evitando merges desnecessários e tornando o histórico mais fácil de seguir. Vamos entender como ele funciona e quando deve ser utilizado.

Ao contrário do `git merge`, que une duas branches criando um commit de merge, o `git rebase` pega os commits de uma branch e reaplica essas mudanças em cima de outra. O resultado é um histórico mais linear, sem os commits adicionais que um merge gera. Isso pode ser muito útil quando você deseja evitar um histórico poluído com múltiplos merges.

Imagine que você está trabalhando em uma nova feature na branch `nova-feature`, enquanto a branch principal (`main`) recebeu atualizações importantes. Para trazer essas atualizações para sua branch sem criar um commit de merge, você pode usar o `git rebase`. Isso reaplicará seus commits de `nova-feature` em cima dos commits mais recentes da branch `main`, como se você tivesse começado a trabalhar com a versão mais atualizada de `main` desde o início.

**Exemplo:**

```bash
git checkout nova-feature
git rebase main
```

Esse comando faz com que o Git "rebaseie" os commits da sua branch `nova-feature` em cima dos commits mais recentes da `main`. O resultado é um histórico linear, onde parece que sua branch sempre esteve atualizada com `main`. O `git rebase` basicamente "pega" todos os commits que foram feitos na sua branch (`nova-feature`) desde que ela se separou da branch `main` e reaplica esses commits um a um em cima da versão mais atualizada da `main`. Isso é útil para evitar a criação de um commit de merge, mantendo o histórico mais limpo e fácil de seguir.

```text
main
  |
  o---o---o (nova-feature)
```

### Após o rebase:

```text
main---o---o (nova-feature)
```

Os commits de `nova-feature` agora parecem ter sido aplicados diretamente em cima dos commits de `main`.

O `git rebase` também permite combinar, reordenar ou modificar commits com a opção `-i` (rebase interativo). Isso dá muito mais controle sobre o histórico da sua branch. Com o rebase interativo, você pode "esmagar" (ou seja, combinar) múltiplos commits em um só, editar mensagens de commits antigos, ou até mesmo reordenar os commits para que façam mais sentido.

**Exemplo:**

```bash
git rebase -i HEAD~3
```

Esse comando abre um editor com os três últimos commits (`HEAD~3`). A partir daí, você pode escolher o que fazer com cada commit:

- `pick`: Mantém o commit como está.
- `squash`: Combina esse commit com o commit anterior, útil para juntar múltiplos commits relacionados em um só.
- `edit`: Permite modificar o commit (por exemplo, ajustar a mensagem de commit ou alterar o código).

Um exemplo do arquivo que seria mostrado no editor:

```bash
pick abc1234 Atualizando o método de autenticação
pick def5678 Corrigindo bug no método de autenticação
squash ghi7890 Melhorando a lógica do método
```

Nesse exemplo, os dois últimos commits (`def5678` e `ghi7890`) serão combinados em um só. Suponha que você está trabalhando em uma feature e fez três commits:

1. Primeiro commit implementando a lógica.
2. Segundo commit corrigindo um erro.
3. Terceiro commit adicionando documentação.

Após concluir, você percebe que seria mais elegante combinar o segundo commit (a correção) com o primeiro, para que o histórico mostre a implementação da lógica já sem o erro.

Usando `git rebase -i`, você pode combinar esses commits, resultando em um histórico onde a feature é implementada de forma limpa, com uma única commit que já inclui a correção.

Embora ambos os comandos tenham seu lugar, o `git rebase` é preferido quando você quer manter o histórico limpo e linear. No entanto, é importante ter cuidado ao usar o `rebase` em branches que já foram compartilhadas com outros colaboradores, pois o rebase altera o histórico de commits, o que pode causar confusão se outra pessoa já estiver trabalhando com esses commits. O rebase é ideal para trabalho local ou em branches que ainda não foram publicadas.

Por outro lado, o `git merge` é a melhor escolha quando você quer preservar o histórico de como as branches evoluíram e se uniram. O merge cria um commit de junção explícito, deixando claro quando duas linhas de desenvolvimento se fundiram.

O `git rebase` é uma ferramenta essencial para quem deseja manter um histórico de commits mais limpo e organizado. Ele permite trazer atualizações de uma branch para outra sem criar commits de merge desnecessários, além de oferecer controle sobre o histórico com a opção interativa. Quando usado corretamente, pode melhorar significativamente a legibilidade do histórico de um projeto.

---

## Gerenciando Stash

O `git stash` é uma ferramenta útil no Git para salvar mudanças não comitadas temporariamente, permitindo que você "limpe" o estado atual do seu diretório de trabalho sem perder as alterações feitas. Ele é particularmente útil quando você precisa trocar de branch ou resolver um problema urgente, mas não quer perder ou commitar as mudanças inacabadas.

Quando você roda o comando `git stash`, o Git salva o estado atual do seu diretório de trabalho — incluindo arquivos modificados e novos arquivos ainda não comitados — e remove essas mudanças do seu ambiente de trabalho. Isso deixa o projeto em um estado "limpo", como se você não tivesse feito nenhuma modificação. Exemplo:

```bash
git stash
```

Isso salva as mudanças atuais e limpa o diretório de trabalho. Agora você pode trocar de branch ou resolver outras tarefas sem o risco de perder as alterações que ainda não foram finalizadas. Depois de resolver suas tarefas, você pode querer restaurar o *stash* para continuar o trabalho de onde parou.

O comando `git stash apply` reaplica o *stash* no seu diretório de trabalho, mas ele **não remove o stash da pilha**, o que significa que você pode reaplicar o mesmo *stash* em várias branches, se necessário. Exemplo:

```bash
git stash apply
```

Isso restaura as mudanças salvas pelo último `git stash` sem removê-las da pilha. Dessa forma, o mesmo conjunto de mudanças pode ser aplicado novamente mais tarde ou em outra branch, se for o caso. Se você não precisa mais das mudanças salvas, pode querer limpar o *stash* específico da pilha. O comando `git stash drop` remove o *stash* da lista, liberando espaço e prevenindo qualquer confusão futura com *stashes* antigos. Exemplo:

```bash
git stash drop
```

Esse comando remove o último *stash* da pilha. Se você quiser remover um *stash* específico, pode referenciar seu índice com algo como `git stash drop stash@{1}`. Se você acumulou vários *stashes* ao longo do tempo e não precisa mais de nenhum deles, o comando `git stash clear` limpa todos de uma vez, eliminando toda a pilha de *stashes*. Exemplo:

```bash
git stash clear
```

Esse comando remove todos os *stashes*, deixando sua pilha de *stashes* vazia. Isso pode ser útil para limpar o ambiente e evitar que *stashes* antigos se acumulem ao longo do tempo. Se você quiser ver o que foi salvo em um *stash*, pode usar o comando `git stash list` para visualizar todos os *stashes* guardados:

```bash
git stash list
```

Isso mostrará uma lista de todos os *stashes* salvos, com seus índices e descrições. Imagine que você está desenvolvendo uma nova feature na branch `nova-feature` e fez algumas modificações, mas precisa interromper o trabalho para resolver um bug na branch `main`.

1. Salvar as mudanças atuais com `git stash`:

   ```bash
   git stash
   ```

   Agora seu diretório de trabalho está limpo, e você pode mudar de branch sem perder as modificações.

2. Trocar para a branch `main` para resolver o bug:

   ```bash
   git checkout main
   ```

3. Depois de resolver o problema e fazer o commit, voltar para a branch de desenvolvimento:

   ```bash
   git checkout nova-feature
   ```

4. Reaplicar o stash para continuar o trabalho de onde parou:

   ```bash
   git stash apply
   ```

5. Se as mudanças foram reaplicadas com sucesso, e você não precisa mais do *stash*, removê-lo da pilha:

   ```bash
   git stash drop
   ```

6. Se quiser limpar todos os *stashes*, pode usar o comando:

   ```bash
   git stash clear
   ```

O `git stash` é uma ferramenta indispensável para gerenciar mudanças temporárias no Git. Ele permite que você guarde rapidamente alterações inacabadas e limpe seu diretório de trabalho para lidar com outras tarefas. Com comandos como `git stash apply`, `git stash drop` e `git stash clear`, você tem controle total sobre quando restaurar ou descartar essas mudanças, garantindo um fluxo de trabalho ágil e organizado.

---

## Desfazendo Alterações e Cherry-pick

No Git, é comum que você precise desfazer alterações locais que ainda não foram commitadas ou aplicar commits específicos de outras branches. Para essas situações, comandos como `git restore` e `git cherry-pick` são extremamente úteis. Vamos entender como eles funcionam.

Se você está trabalhando em um arquivo e percebe que deseja desfazer as modificações feitas localmente, ou seja, voltar o arquivo ao estado que ele tinha no último commit (ou à versão mais recente no repositório), o comando `git restore` faz exatamente isso. Ele remove as mudanças não commitadas no arquivo, restaurando-o à versão mais recente. Exemplo:

```bash
git restore <file>
```

Esse comando desfaz todas as mudanças feitas localmente no `<file>`, sem afetar o histórico do repositório ou qualquer commit já feito. Ele é útil, por exemplo, se você editou um arquivo e decide que as mudanças não são necessárias ou estavam incorretas.

- Se quiser desfazer as mudanças em todos os arquivos modificados localmente:

  ```bash
  git restore .
  ```

Antigamente, o comando `git checkout` também era usado para desfazer alterações, mas ele agora foi dividido em dois comandos para fins de clareza: `git restore` (para restaurar arquivos) e `git switch` (para trocar de branch). Isso torna o uso do Git mais intuitivo, já que cada comando tem uma responsabilidade mais clara.

O comando `git cherry-pick` é utilizado quando você quer aplicar um commit específico de outra branch ao seu histórico atual, sem precisar fazer um merge completo ou trazer todas as mudanças daquela branch. Exemplo de Cenário:

Imagine que você está na branch `main`, e outra branch chamada `nova-feature` contém um commit com uma correção de bug importante que você deseja aplicar à `main`, sem trazer o resto das mudanças da branch `nova-feature`. Nesse caso, você pode usar o `git cherry-pick` para "pegar" apenas esse commit e aplicá-lo à `main`. Comando:

```bash
git cherry-pick abc123
```

Aqui, `abc123` é o hash do commit específico que você quer aplicar. O Git então cria um novo commit na sua branch atual (`main`), contendo as mesmas alterações feitas no commit `abc123`, preservando a autoria e as mensagens originais.

O `git cherry-pick` essencialmente copia um commit de outra branch ou ponto do histórico e o aplica na branch atual, como se você estivesse reescrevendo as mesmas mudanças. Ele é útil para casos onde você quer incorporar correções ou mudanças específicas sem trazer outros commits ou realizar merges complexos.

1. Você tem um commit na branch `bugfix` que corrige um problema crítico, e deseja aplicá-lo na branch `main`.

   ```bash
   git checkout main
   ```

2. Use o `git cherry-pick` para aplicar o commit específico:

   ```bash
   git cherry-pick abc123
   ```

O commit `abc123` agora será aplicado à branch `main`, preservando as mesmas mudanças e a mensagem de commit. Assim como em um *merge*, pode haver conflitos quando você faz um `cherry-pick`, especialmente se o código no commit que está sendo aplicado colide com mudanças feitas na branch atual. Nesse caso, o Git pausará o processo e pedirá que você resolva os conflitos manualmente. Após resolver os conflitos, finalize o *cherry-pick* com:

```bash
git cherry-pick --continue
```

Se você quiser cancelar o processo de *cherry-pick* durante um conflito, use:

```bash
git cherry-pick --abort
```

O `git restore` e o `git cherry-pick` são comandos úteis e específicos para diferentes cenários no fluxo de trabalho do Git. Enquanto o `git restore` desfaz mudanças locais antes do commit, o `git cherry-pick` permite aplicar commits específicos de outra branch ao seu histórico atual sem a necessidade de fazer merges completos. Esses comandos fornecem mais flexibilidade e controle sobre como você gerencia e aplica mudanças em seu repositório.

---

## Atribuindo Alterações com git blame

O comando `git blame` é uma ferramenta extremamente útil no Git para investigar o histórico de um arquivo e descobrir quem alterou uma linha de código específica e quando essa alteração foi feita.

Ele é essencial para rastrear o autor de mudanças e entender o contexto por trás de uma modificação, especialmente quando se está depurando ou revisando código. Quando você executa `git blame` em um arquivo, o Git exibe, linha por linha, informações detalhadas sobre cada alteração, incluindo:

- **O commit** no qual a linha foi modificada (representado pelo hash do commit).
- **O autor** da mudança.
- **A data** em que a mudança foi feita.

Essas informações ajudam a identificar rapidamente quem fez uma alteração específica e quando essa mudança ocorreu, o que pode ser essencial em situações de depuração ou revisão de código. Imagine que você quer descobrir quem alterou uma linha de código no arquivo `UserController.java`. Você pode usar o seguinte comando:

```bash
git blame UserController.java
```

O resultado seria algo assim:

```bash
abc1234 (João Silva 2023-05-10 13:45:22 -0300 1) public class UserController {
abc1234 (João Silva 2023-05-10 13:45:22 -0300 2)     public String getUser() {
def5678 (Maria Santos 2023-08-01 09:22:15 -0300 3)         return "User data";
abc1234 (João Silva 2023-05-10 13:45:22 -0300 4)     }
abc1234 (João Silva 2023-05-10 13:45:22 -0300 5) }
```

Neste exemplo:

- O commit `abc1234` foi feito por **João Silva** em **10 de maio de 2023**, e ele alterou as linhas 1, 2, 4 e 5.
- O commit `def5678` foi feito por **Maria Santos** em **1º de agosto de 2023**, e ela modificou a linha 3.

Dessa forma, se você quer saber quem modificou a linha `return "User data";`, o `git blame` te mostra que essa alteração foi feita por **Maria Santos**.

- **Rastrear bugs**: Se você encontrou um bug em uma parte do código, pode usar `git blame` para descobrir quem foi o autor da última alteração nessa linha de código. A partir disso, pode ser mais fácil identificar o que foi mudado e por que o bug foi introduzido.
- **Revisar histórico de mudanças**: Quando uma mudança parece inconsistente ou você quer entender melhor o raciocínio por trás de uma decisão de código, o `git blame` permite encontrar o responsável pela alteração e consultar o commit original, bem como sua mensagem.
- **Atribuir responsabilidade**: Em grandes equipes de desenvolvimento, `git blame` ajuda a atribuir responsabilidade sobre uma linha específica de código, facilitando a comunicação direta com o desenvolvedor que fez a modificação.

O `git blame` também permite várias opções para ajustar a saída e filtrar resultados, tornando-o ainda mais poderoso.

- **Mostrar desde um commit específico**: Se você está interessado apenas em mudanças feitas após um commit específico, pode usar:

  ```bash
  git blame <file> <commit>
  ```

- **Ignorar mudanças de formatação**: Para ignorar commits que alteraram apenas o estilo ou formatação (como mudanças de indentação), você pode usar:

  ```bash
  git blame -w <file>
  ```

  Isso ajuda a focar em mudanças de lógica, ignorando alterações triviais.

- **Limitar o histórico a um intervalo de commits**: Se você deseja ver as alterações de um arquivo dentro de um intervalo específico de commits, pode fazer algo assim:

```bash
git blame <file> HEAD~10..HEAD
```

Isso exibirá as alterações feitas nos últimos 10 commits.

O `git blame` é uma ferramenta poderosa para rastrear o histórico de alterações em arquivos e linhas específicas no Git. Ele oferece uma maneira rápida de descobrir quem fez uma mudança, quando foi feita e em qual commit, facilitando a análise de código e a resolução de problemas. Seja para depurar bugs ou entender melhor o histórico de um projeto, o `git blame` oferece uma visão detalhada e cronológica das alterações.

---

## Gerenciando Versões com Tags

No Git, as *tags* são usadas para marcar pontos específicos no histórico de um projeto, como versões de lançamento, marcos importantes ou entregas significativas. Elas ajudam a referenciar um estado específico do repositório de forma fácil e conveniente, sendo amplamente usadas em sistemas de versionamento e distribuição de software.

As tags podem ser criadas a qualquer momento para marcar um commit específico no histórico do Git. Há dois tipos principais de tags: **anotadas** e **leves**.

- **Tag leve**: Simplesmente marca o commit, sem adicionar metadados adicionais como uma mensagem de anotação. Exemplo:

  ```bash
  git tag v1.0.0
  ```

  Esse comando cria uma tag chamada `v1.0.0` associada ao commit atual. É uma tag leve, usada para marcações simples.

- **Tag anotada**: Contém metadados adicionais, como nome do autor, data e uma mensagem descritiva. Exemplo:

  ```bash
  git tag -a v1.0.0 -m "Primeira versão estável"
  ```

  O comando acima cria uma tag anotada com o nome `v1.0.0` e a mensagem "Primeira versão estável". Essa tag é preferível para versionamentos formais, como releases de software, já que contém mais informações sobre o contexto da marcação. Para listar todas as tags existentes no repositório, use o comando:

```bash
git tag
```

Isso exibirá uma lista de todas as tags que foram criadas no repositório.
Se quiser ver detalhes de uma tag anotada, incluindo a mensagem de anotação e informações associadas, use:

```bash
git show v1.0.0
```

Isso mostrará o commit associado à tag, junto com a mensagem de anotação e outros metadados. As tags criadas localmente não são automaticamente enviadas para o repositório remoto ao rodar `git push`. Se você deseja compartilhar uma tag com outros desenvolvedores ou publicar uma nova versão do software, é necessário enviar a tag explicitamente. Exemplo:

```bash
git push origin v1.0.0
```

Esse comando envia a tag `v1.0.0` para o repositório remoto. Se quiser enviar todas as tags de uma vez, use:

```bash
git push origin --tags
```

Isso envia todas as tags locais que ainda não foram enviadas ao repositório remoto. Caso você crie uma tag por engano ou precise remover uma tag, o Git permite que você faça isso tanto localmente quanto no repositório remoto.

- **Remover uma tag localmente**:

  Para remover uma tag do seu repositório local, use o seguinte comando:

  ```bash
  git tag -d v1.0.0
  ```

  Isso apaga a tag `v1.0.0` do seu repositório local, mas ela ainda permanecerá no repositório remoto se já tiver sido enviada.

- **Remover uma tag do repositório remoto**:

  Se a tag também precisa ser removida do repositório remoto, use o comando:

  ```bash
  git push origin --delete v1.0.0
  ```

  Isso remove a tag `v1.0.0` do repositório remoto. É importante ter cuidado ao remover tags remotas, pois outras pessoas podem estar usando essas tags para referenciar versões específicas do software. Imagine que você lançou a primeira versão estável do seu software e quer marcar esse ponto no histórico para referência futura.

1. **Criação da tag**:

   ```bash
   git tag -a v1.0.0 -m "Primeira versão estável"
   ```

2. **Enviar a tag para o repositório remoto**:

   ```bash
   git push origin v1.0.0
   ```

Agora, todos os desenvolvedores que trabalham no projeto podem ver e usar a tag `v1.0.0` para referenciar a primeira versão estável do software.

Se, por algum motivo, você precisar remover essa tag, pode usar os comandos:

- Remover localmente:

  ```bash
  git tag -d v1.0.0
  ```

- Remover do repositório remoto:

  ```bash
  git push origin --delete v1.0.0
  ```

As tags são ferramentas essenciais para gerenciar versões e marcos em um projeto Git. Elas permitem que você marque pontos importantes no histórico do repositório, como lançamentos de software, e compartilhe esses pontos de referência com outros colaboradores. Com os comandos para criar, enviar e remover tags, você tem total controle sobre como versionar e gerenciar o progresso do seu projeto ao longo do tempo.
