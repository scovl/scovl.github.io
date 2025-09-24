+++
title = "GNU Emacs"
description = "O poder do Emacs puro"
date = 2025-08-08T19:00:00-00:00
tags = ["OOP","software","engineering", "Clojure"]
draft = true
weight = 1
author = "Vitor Lobo Ramos"
+++



Após anos experimentando diversos editores de texto para escrita e programação, comecei a me frustrar com a dependência excessiva de plugins que tornavam a experiência cada vez mais pesada, instável e lenta. 

> O que deveria ser uma ferramenta simples de escrita se transformava em um ambiente sobrecarregado e pouco confiável.

A migração dessas configurações complexas entre diferentes ambientes — especialmente ao alternar entre sistemas operacionais — tornou-se um obstáculo significativo que me levou a questionar fundamentalmente minha abordagem na escolha de editores. Se você enfrenta desafios similares, este artigo oferece uma perspectiva alternativa.

# Por que considerar o Emacs

O GNU Emacs é um editor **extensível, customizável e auto-documentado**, com décadas de estabilidade e uma comunidade enorme. Ele é “programável” em Emacs Lisp, o que permite que você molde o editor ao seu fluxo de trabalho em vez de se adaptar ao editor. ([gnu.org][1])

Nos últimos lançamentos, o Emacs evoluiu muito para desenvolvimento moderno: **[suporte a tree-sitter](https://en.wikipedia.org/wiki/Tree_sitter)** (análise sintática incremental) e um **[cliente LSP nativo (Eglot)](https://www.gnu.org/software/emacs/manual/html_node/eglot/index.html)** simplificam autocompletar, navegação e refatoração em várias linguagens, sem depender de plugins externos pesados.

Ao instalar e abrir o Emacs pela primeira vez, você será surpreendido por uma interface estranha (feia, bem feia), com uma barra de menus e uma barra de ferramentas e um bocado de texto. Observe a imagem abaixo:

![Emacs](/post/images/emacs/emacs01.png)

> **NOTA**: Não se preocupe com a estética do Emacs no início. Você poderá customiza-lo para se adequar à estética de sua preferência.

Aqui temos muitas informações importantes que valem a pena serem observadas:

- **A barra de menus** - [File, Edit, Options, Buffers, Tools e Help] - Aqui você encontra os botões e menus principais do Emacs. O mais importante aqui, na minha opinião, é você estabelecer quais as opções que mais utiliza em seu dia-a-dia e observar que o Emacs mostra logo de início as hotkeys (teclas de atalho) para cada opção. 

> Essas hotkeys vão lhe auxiliar em sua experiência com o Emacs. Uma dica interessante, é a criação do seu próprio cheatsheet com as hotkeys que mais fazem sentido para você.

- **A barra de ferramentas** - Aqui você encontra os botões e menus principais do Emacs (não muito importante para o dia-a-dia), pois, como disse acima, mais importante do que botões, são as hotkeys.
- **Texto de startup** - Aqui você encontra o texto de startup do Emacs que é exibido quando o Emacs é iniciado. Aqui tem vários guias para você começar a usar o Emacs. 
- **Barra de status** - Aqui estão as informações do status do Emacs. Este é um campo muito importante para você, pois ele mostra informações importantes como o modo de edição, o buffer atual, o cursor, etc.

A recomendação da qual considero a mais importante, é que você use o Emacs puro, sem plugins, com as funções nativas dele. Experimente escrever textos, artigos, etc. Esta é, na minha opinião, a melhor forma de começar a usar o Emacs. Desta forma você irá se familiarizar com o Emacs e poderá começar a usar plugins depois. Vamos pelo simples.

---

## Teclas que você precisa saber

O Emacs assim como o [Vim](https://www.vim.org/), tem uma sintaxe de atalhos muito parecida, mas com algumas diferenças. Aqui estão as teclas que você precisa saber:

![Emacs](/post/images/emacs/emacs02.png)

> **Curiosidade**: RET é a notação histórica do Emacs para a tecla Return (carriage return). Emacs adotou esses nomes de controle (RET, LFD, etc.) muito antes de “Enter” virar o rótulo comum nos teclados modernos. Como a maioria dos teclados atuais manda o mesmo sinal para “Enter/Return”, o Emacs continua usando a abreviação clássica RET.

Bastante coisa, né? Mas não se preocupe, você não precisa saber todas elas. Nem mesmo nos editores mais famosos, como o [VSCode](https://code.visualstudio.com/), você precisa saber todas as teclas. Você pode aprender as que mais fazem sentido para você (ou que você achar que é mais útil). 

Não tenha pressa, leia e entenda o que cada tecla faz. Dê um tempo pra isso. Não fique tentando aprender tudo de uma vez. 

Crie um cheatsheet como este que fiz acima com as hotkeys que mais fazem sentido para você. Utilize o Emacs puro por um tempo considerável antes de seguir para o próximo passo. 
Algo em torno de uma a duas semanas (será que compensa? vai vendo...). A propósito, criei este cheatsheet acima usando o [Excalidraw](https://excalidraw.com/).

---

# Buffer

No Emacs, o que você vê e edita na tela é um **buffer**. Ele pode estar ligado a um arquivo do disco — mas **nem todo buffer é um arquivo**. Você pode criar um buffer vazio só para rascunhar, colar trechos de log, testar ideias… sem precisar dar um nome ou salvar. **Só vira arquivo quando você quiser salvar**; até lá, ele existe apenas dentro do Emacs.

Buffers não servem só para texto “comum”: o Emacs também usa buffers para conversar com outros programas (como um shell Bash ou Python) e para muitas das suas próprias telas.

Quase todos os comandos do Emacs agem **sobre o buffer ativo**: buscar/substituir, mover, apagar, tudo acontece nesse “documento” aberto. Pensar assim simplifica: aprenda a usar os comandos no dia a dia e estará, sem perceber, usando o mesmo modelo que o Emacs usa por dentro.

**Dicas rápidas**

* **Abrir arquivo (cria um buffer ligado a ele):** `C-x C-f`
* **Criar/ir para um buffer pelo nome:** `C-x b` (digite um nome novo para um buffer vazio)
* **Salvar o buffer:** `C-x C-s` (ou `C-x C-w` para “Salvar como…”)
* **Fechar o buffer atual:** `C-x k`

> **Nota**: pense no buffer como uma **folha de trabalho viva**. Às vezes ela tem um arquivo por trás; às vezes é só um espaço temporário para você trabalhar com liberdade. Quando fizer sentido, você salva.



---

# Org Mode 

Vamos supor que você queira escrever um artigo. Geralmente as pessoas escolhem escreve-lo em [Markdown](https://www.markdownguide.org/). O Emacs tem um modo especial para isso, chamado [Org Mode](https://orgmode.org/). 

Este modo transforma arquivos `.org` (isto é, em formato de texto simples) em um ambiente de escrita e organização poderoso: você captura ideias, estrutura tópicos, acompanha tarefas e exporta para [HTML, PDF, DOCX e mais](https://orgmode.org/manual/Export-Formats.html) — tudo em texto simples. 

É ideal para quem quer escrever sem distrações e com versionamento. É o tipo de experiência que você só perceberá após o uso. Essa função é tão poderosa que prefiro que vocês vejam um vídeo de demonstração:

{{< video src="https://www.youtube.com/embed/6yRhWG28-84" title="Org Mode Demonstration" >}}

Além de ser ideal para escrever artigos e anotações sem distrações, o Org Mode oferece recursos práticos que vão muito além da escrita básica. Seguem alguns destaques do que você pode fazer:

## Estruturação do documento

Uma das características mais poderosas do Org Mode é sua capacidade de estruturar documentos de forma hierárquica e intuitiva. A organização do conteúdo é feita através de asteriscos `*`, onde cada nível de profundidade representa uma seção diferente do documento. 

Vamos seguir um pequeno roadmap para você entender como funciona a estruturação do documento no Org Mode. Comecemos pelo básico:

1. **Crie um arquivo `.org`** - `C-x C-f` e digite o nome do arquivo. Exemplo: `artigo.org`.
2. **Edite o arquivo** - `C-x C-e` e digite o conteúdo do arquivo. Exemplo:

```bash
* Seção
** Subseção
*** Subsubseção
```

3. **Visualize o arquivo** - `C-c C-v` e pressione `l` para visualizar o arquivo.
4. **Salve o arquivo** - `C-x C-s` e pressione `s` para salvar o arquivo.
5. **Exporte o arquivo** - `C-c C-e` e pressione `l` para exportar o arquivo no formato HTML.

A estrutura funciona de maneira simples: um asterisco `*` cria uma seção principal, dois asteriscos `**` criam uma subseção, três asteriscos `***` criam uma subsubseção, e assim por diante. 

Essa abordagem permite criar documentos com múltiplos níveis de organização sem a necessidade de formatação complexa. Com isso, você organiza tópicos de forma clara e expansível.

## Estilo e marcação

Continuando com o nosso exemplo, vamos ver como podemos formatar o texto e enriquecer o documento. Ainda no mesmo arquivo, vamos adicionar o seguinte:

```bash

* Seção

Lorem ipsum dolor sit amet, /consectetur adipiscing elit/. Sed do eiusmod *tempor incididunt* ut _labore et dolore magna_ aliqua. +Ut enim ad minim+ veniam, quis nostrud exercitation =ullamco= laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum:

** Subseção

~código~
#+BEGIN_QUOTE
A arte deve ser como um espelho
Que nos mostra o nosso próprio rosto.
#+END_QUOTE
#+BEGIN_SRC python :results output
print(6 * 7)
#+END_SRC

*** Subsubseção
```

Perceba que não precisamos usar tags HTML para formatar o texto. O Org Mode já faz isso para você. Abaixo estão alguns exemplos de formatação de estilo e marcação que usamos no exemplo acima:

* `/itálico/` → *itálico*
* `*negrito*` → **negrito**
* `_sublinhado_` → <u>sublinhado</u>
* `+riscado+` → ~~riscado~~
* `=verbatim=` → `verbatim`
* `~código~` → `código`

Note que no Org Mode, você pode usar markdown, html, latex, etc. Acima usamos markdown e latex ao mesmo tempo. Todos os formatos são suportados. Veja a lista completa de formatos suportados [aqui](https://orgmode.org/worg/org-syntax.html).

### Listas e tabelas

Continuando com o nosso exemplo, vamos ver como podemos criar listas e tabelas. Ainda no mesmo arquivo, vamos adicionar o seguinte:

```bash
1. item 1
2. [X] item 2
   - some tag :: item 2.1
3. [ ] item 3
   - some tag :: item 3.1
   - some tag :: item 3.2
4. [ ] item 4
   - some tag :: item 4.1
   - some tag :: item 4.2

| Nome     | Idade |
|----------+-------|
| Alice    |  25   |
| Roberto  |  30   |
```

* Listas ordenadas, não ordenadas e descritivas são suportadas de forma intuitiva.
* Tabelas são fáceis de criar: basta usar `|` para separar colunas e pressionar `TAB` para alinhar.


## Imagens, links e notas de rodapé

Olha como é fácil adicionar imagens, links e notas de rodapé. Ainda no mesmo arquivo, vamos adicionar o seguinte:

```bash
[[./imagem.png]]
[[https://orgmode.org][Site oficial]]
[fn:1] Este é um exemplo de nota de rodapé.
```

* **Imagens**: Use `[[./caminho/para/imagem.png]]` ou com descrição `[[./imagem.png][Descrição da imagem]]`
* **Links externos**: `[[https://exemplo.com][Texto do link]]`  
* **Links internos**: `[[*Título da seção][Link para seção]]`
* **Notas de rodapé**: Use `[fn:1]` no texto e defina com `[fn:1] Conteúdo da nota` em qualquer lugar do documento

O Org Mode automaticamente numera e organiza suas referências, criando um sistema de navegação limpo e profissional. Além disso, você pode criar blocos especiais para diferentes tipos de conteúdo, como veremos a seguir.

## Blocos especiais

Podemos também adicionar blocos especiais como citações, versículos, código, etc. Veja um exemplo:

```bash
#+BEGIN_QUOTE
A arte deve ser como um espelho
Que nos mostra o nosso próprio rosto.
#+END_QUOTE
```

E executar código dentro do arquivo de forma dinâmica? Veja um exemplo:

```bash
#+BEGIN_SRC python :results output
print(6 * 7)
#+END_SRC
```

Como resultado, você verá o seguinte:
```
42
```

Estes blocos especiais tornam o Org Mode extremamente versátil para documentação técnica, permitindo combinar texto explicativo com código executável e resultados em um único documento. Com toda essa flexibilidade para criar conteúdo rico, o próximo passo é compartilhar seu trabalho através das poderosas opções de exportação do Org Mode.

## Exportação

Com um simples atalho `C-c C-e`, você pode exportar o documento para vários fo{}rmatos:

| Atalho | Formato | Descrição |
|--------|---------|-----------|
| `C-c C-e l p` | PDF | Exporta via LaTeX |
| `C-c C-e h o` | HTML | Abre no navegador |
| `C-c C-e t u` | UTF-8 | Texto simples |
| `C-c C-e t o` | Org Mode | Formato nativo |
| `C-c C-e t m` | Markdown | Para blogs/docs |
| `C-c C-e t r` | RST | reStructuredText |
| `C-c C-e t d` | DocBook | XML estruturado |
| `C-c C-e t x` | XML | Formato genérico |
| `C-c C-e t j` | JSON | Dados estruturados |
| `C-c C-e t y` | YAML | Configuração |
| `C-c C-e t h` | HTML | Página web |
| `C-c C-e t b` | BibTeX | Bibliografia |
| `C-c C-e t c` | CSV | Planilha |

O Org Mode não é só um editor de artigos, mas uma verdadeira plataforma de **escrita, organização e automação**. Você pode começar simples, como escrever seu artigo, e evoluir para usar tabelas, gráficos, blocos de código executáveis e até mesmo geração de sites inteiros. 

Vale muito a pena investir tempo nisso. A propósito, aqui está a [documentação oficial do Org Mode](https://orgmode.org/org.pdf) em PDF.

---

# Navegador nativo

Se a graça do Org Mode é **escrever e ler com foco**, o [EWW](https://www.gnu.org/software/emacs/manual/html_node/eww/index.html) é o passo seguinte: **pesquisar e consumir conteúdo** sem sair do Emacs. Pense nele como um “reader mode” embutido — simples, rápido e bom o suficiente para docs, blogs e referências técnicas enquanto você codifica/escreve.

![EWW](/post/images/emacs/eww.png)

## Comandos essenciais

| Ação | Atalho | Descrição |
|------|--------|-----------|
| **Abrir URL/buscar** | `M-x eww` | Se não for URL, busca no DuckDuckGo |
| **Recarregar** | `g` | Atualiza a página atual |
| **Voltar** | `l` | Página anterior |
| **Avançar** | `r` | Próxima página |
| **Sair** | `q` | Fecha o EWW |
| **Novo buffer** | `M-RET` | Abre link em novo buffer |
| **Copiar URL** | `w` | Copia URL do cursor ou página |
| **Favoritar** | `b` | Adiciona aos bookmarks |
| **Ver favoritos** | `B` | Lista todos os bookmarks |
| **Histórico** | `H` | Mostra páginas visitadas |

### Aprendizado gradual

Não precisa memorizar todos os atalhos de uma vez. Comece pelos essenciais (`M-x eww`, `q`, `g`) e vá incorporando outros conforme a necessidade. 

A personalização de atalhos pode ficar para depois — primeiro, entenda o fluxo básico do EWW. Construir uma base sólida é mais importante que customizações prematuras.

### Deixe a leitura confortável (toggles essenciais)

* **Fonte variável (prosa mais legível)**: `F` (altera `shr-use-fonts`)
* **Respeitar/ignorar cores da página**: `M-C` (altera `shr-use-colors`)
* **Mostrar/Ocultar imagens**: `M-I` (altera `shr-inhibit-images`)
* **Modo leitura** (remove menus/ruído): `R` (toggle de “readable”)

O EWW se integra naturalmente ao fluxo de trabalho do Emacs — você pode estar editando código, precisar consultar uma documentação, abrir rapidamente com `M-x eww`, ler o que precisa, e voltar ao seu buffer anterior com `C-x b` ou `C-x 4 b` para abrir em outra janela. 

A beleza está na **simplicidade funcional**: sem abas confusas, sem distrações visuais, apenas o conteúdo que importa. 

E quando você encontra algo relevante, pode facilmente copiar trechos para seus arquivos Org ou código, mantendo tudo dentro do mesmo ambiente. Claro, nem tudo é perfeito — sites modernos dependem muito de JavaScript, e é aí que você precisa saber quando usar cada ferramenta. 

### Quando a página “não rola”

O EWW é um navegador **minimalista por design** — ele não executa JavaScript e tem suporte limitado ao CSS moderno. Isso é uma **vantagem** para leitura focada, mas significa que alguns sites não vão funcionar como esperado. 

Quando uma página "quebrar" no EWW, simplesmente digite `&` e ela abrirá no seu navegador padrão. Exemplo prático:

1. Você está no EWW lendo sobre uma biblioteca Python
2. Clica num link para uma demo interativa que não carrega
3. Aperta `&` → a página abre no Firefox/Chrome
4. Volta pro EWW com `C-x b` quando terminar

### Downloads e PDFs

* **Baixar** o link sob o cursor (ou a página atual): `d` → vai para `eww-download-directory` (padrão: `~/Downloads/`).
* **PDFs** abrem inline (doc-view). Se preferir outro viewer, ajuste via *mailcap*.


---

# Lisp?

O Emacs é construído quase todo em **Emacs Lisp (elisp)**, uma variação de LISP. Isso significa que o editor pode **inspecionar, executar e mudar a si mesmo** enquanto você o usa.

Na prática, você pode começar sem saber elisp, mas com o tempo vai querer ajustar algo (por exemplo, **trocar um atalho** ou **ligar um recurso**) e acabará esbarrando em pequenas linhas de elisp. A boa notícia: é simples, direto e há muitos exemplos prontos — você geralmente só **copia, adapta e testa**.

Por que LISP aqui? Porque em LISP **código e dados têm a mesma forma**. Isso torna o Emacs **extensível**: você consegue adicionar funções, alterar comportamentos existentes e “colar” melhorias sem reescrever tudo. O resultado é um editor que você **molda ao seu jeito** — dos atalhos à aparência, do fluxo de trabalho do projeto a automações do dia a dia.

**Dicas rápidas**

* **Avaliar um trecho** agora: `M-:` (digite uma expressão) ou `C-x C-e` no fim da linha.
* **Entender o que é uma função/variável:** `C-h f` (describe-function), `C-h v` (describe-variable).
* **Ver o que uma tecla faz:** `C-h k` e pressione a tecla/atalho.
* **Aprender o básico de elisp:** `M-x info RET` → *Emacs Lisp Intro* (guia oficial).
* **Testar ideias sem bagunçar arquivos:** use o buffer `*scratch*` (modo Lisp Interaction).


---

# Customização

É aqui que vamos desbloquear todo o potencial do Emacs e sem usar nenhum plugin! Faço questão de mostrar tudo o que podemos fazer usando este maravilhoso Editor nativamente. 

Abra seu Emacs, pressione `C-x C-f` e em seguida digite `~/.emacs.d/init.el` e pressione ENTER. Feito isso, vamos agora customizar de verdade. Primeiro, vamos limpar o Emacs e deixa-lo clean:

```lisp
;; Inibir items da interface
;; Inibir startup screen e message
(setq inhibit-startup-screen t
			inhibit-startup-message t)

;; Desativar scrollbar e toolbar
(when (display-graphic-p)
  (scroll-bar-mode -1)
  (tool-bar-mode -1)
```

Agora pressione `C-x C-s` para salvar, e em seguida `C-c C-e` para dar reload no Emacs para que você consiga ver o que ocorreu. Outra maneira de aplicar reload, é pressionando `M-x` e digitando em seguida `eval-buffer`. Seu Emacs a partir de agora ficará assim:

![]()

Perceba que agora temos um Emacs mais clean, sem aquelas opções que o tornam semelhante a um editor dos anos 80. Agora vamos continuar nossa configuração:

```lisp
;; Números de linha em todos os buffers
(global-display-line-numbers-mode t)

;; Fonte padrão (deve estar instalada). 130 = 13pt
(set-face-attribute 'default nil :family "Fira Code" :height 130)

;; Legibilidade: espaçamento extra; tab=2; usa espaços; coluna alvo 80
(setq-default line-spacing 1
              tab-width 2
              indent-tabs-mode nil
              fill-column 80)

;; Linha-guia na coluna 80 (prog-mode)
(setq-default display-fill-column-indicator-column 80)
(add-hook 'prog-mode-hook #'display-fill-column-indicator-mode)

;; Syntax highlight global
(global-font-lock-mode t)

;; Edição: fecha pares; destaca par; digitar substitui seleção
(electric-pair-mode 1)
(show-paren-mode 1)
(delete-selection-mode 1)

;; Recarrega buffer se o arquivo mudar no disco
(global-auto-revert-mode 1)

;; Histórico: volta onde parou; lista “recentes”
(save-place-mode 1)
(recentf-mode 1)

;; Undo/redo de layouts de janelas (C-c ← / C-c →)
(winner-mode 1)
```

Novamente, pressione `C-x C-s` para salvar, e `C-c C-e` para dar reload nas configurações do Emacs. Observe que agora temos contador de linhas e outras opções que estão descritas acima. Terminamos por aqui? Agora vamos inserir Plugins? A resposta é…não! Ainda tem bastante coisa…vai vendo:

```lisp
;;; Tema (não pergunta ao carregar)
(load-theme 'wombat t)

;; "yes-or-no?" vira "y/n?"
(fset 'yes-or-no-p 'y-or-n-p)

;; Cursor sem piscar; destaca a linha atual
(blink-cursor-mode -1)
(global-hl-line-mode 1)

;; Scrolling suave/preciso (Emacs 29+)
(pixel-scroll-precision-mode 1)

;; Relógio no mode-line (ative bateria se quiser)
(display-time-mode 1)
;; (display-battery-mode 1)

;; UTF-8 como padrão para idioma/arquivos
(set-language-environment "UTF-8")
(prefer-coding-system 'utf-8)

;; Melhor desempenho com arquivos/líneas enormes
(global-so-long-mode 1)

;; Completação nativa Fido em lista vertical (M-x, C-x C-f, etc.)
(fido-vertical-mode 1)
(setq completion-styles '(basic partial-completion flex) ; estilos de match
      completions-format 'one-column                    ; layout da lista
      completions-max-height 20)                        ; altura máxima
```

O **Fido vertical** é a completação nativa do Emacs que mostra as sugestões em **lista vertical** no minibuffer. Ele acelera comandos como `M-x`, abrir arquivos (`C-x C-f`) e trocar buffers (`C-x b`) porque você vê, em tempo real, os candidatos que batem com o que digitou — tudo leve e sem plugins.

Para usar, basta começar a digitar: navegue na lista com **↑/↓** (ou **C-p/C-n**), pressione **RET** para escolher e **TAB** para completar o trecho comum. Ele funciona “em todo lugar” que usa a API padrão de completação do Emacs. Se quiser buscas mais flexíveis, adicione o estilo `flex` aos `completion-styles`, mas o comportamento padrão já é direto e eficiente. Vamos continuar nossa customização:

```lisp
;; Dired: recursivo p/ copiar/apagar; sugere outro painel; usa lixeira; esconde detalhes
(with-eval-after-load 'dired
  (setq dired-recursive-deletes 'always
        dired-recursive-copies  'always
        dired-dwim-target t            ; destino = outro Dired ao lado
        delete-by-moving-to-trash t)    ; mover p/ lixeira do SO
  (add-hook 'dired-mode-hook #'dired-hide-details-mode))

;; Dired: reusar o MESMO buffer ao entrar em diretórios/arquivos
(put 'dired-find-alternate-file 'disabled nil)

;; Abas nativas (tab-bar): ativa e atalhos simples
(tab-bar-mode 1)
(setq tab-bar-new-tab-choice "*scratch*" ; buffer inicial da nova aba
      tab-bar-show 1)                    ; mostra barra se ≥1 aba
(global-set-key (kbd "C-c t n") #'tab-new)
(global-set-key (kbd "C-c t k") #'tab-close)
(global-set-key (kbd "C-c t o") #'tab-next)

;; Project.el: menu rápido ao trocar de projeto
(setq project-switch-commands
      '((project-find-file "Find file")
        (project-find-regexp "Ripgrep")
        (project-dired "Dired")
        (project-eshell "Eshell")
        (project-compile "Compile")))

;; Imenu: índice de símbolos no menu (prog-mode)
(add-hook 'prog-mode-hook #'imenu-add-menubar-index)

;; Mostra a função/método atual no mode-line
(which-function-mode 1)

;; Busca: ignore maiúsc./minúsc. (ativa sensível se usar caps no padrão)
(setq case-fold-search t)

;; Isearch: mostra contagem de ocorrências ao buscar
(setq isearch-lazy-count t)

;; C-k: no início da linha, remove a linha inteira (inclui newline)
(setq kill-whole-line t)

;; Paginação mantém o cursor na mesma posição da tela
(setq scroll-preserve-screen-position t)

;; Seleção integra com o clipboard do sistema (Ctrl+C/Ctrl+V do SO)
(setq select-enable-clipboard t)
```

O primeiro bloco ajusta o **gerenciador de arquivos do Emacs** (chamado *Dired*). Em termos simples: ele permite **copiar e apagar pastas inteiras de uma vez**, **sugerir automaticamente a janela ao lado como destino** quando você está com duas janelas abertas, **mandar itens para a lixeira do sistema** (em vez de apagar para sempre) e **mostrar a lista de arquivos de forma mais limpa**, escondendo detalhes que distraem.

Também faz a navegação **reaproveitar a mesma janela**, evitando abrir várias telas enquanto você entra e sai de pastas. O segundo bloco ativa **abas** (como no navegador). Assim você separa tarefas: por exemplo, uma aba para rascunhos, outra para código, outra para anotações.

A configuração abre **uma nova aba pronta para escrever** e mostra a barra de abas apenas quando houver mais de uma, mantendo a interface simples. Há atalhos fáceis para **criar**, **fechar** e **pular** entre abas, deixando o fluxo parecido com o que você já faz na web.

O terceiro bloco organiza um **menu rápido por projeto**. Quando você alterna de projeto, aparece um conjunto de ações úteis: **abrir arquivos do projeto**, **procurar texto dentro dele**, **ver a pasta do projeto**, **abrir um terminal integrado na pasta do projeto** e **rodar a compilação**. Em resumo, tudo o que você mais usa fica a um passo, o que acelera bastante o seu dia a dia.

Lembra que no início do artigo citei que o Emacs tem LSP server nativo através do EGLOT? Vamos explorar isso? Bom, atualmente faço experimentos em LISP usando Clojure, trabalho com Java, Python e colaboro para projetos Rust, C, C++. Além disso, gostaria conhecer um pouco de Zig.

É possível usar o Emacs para todas essas linguagens nativamente sem instalar plugins? A resposta é sim!! Vejamos:

```lisp
;;; ---------------- LSP nativo (Eglot) ----------------
(add-hook 'clojure-mode-hook #'eglot-ensure)
(add-hook 'java-mode-hook    #'eglot-ensure)
(add-hook 'python-mode-hook  #'eglot-ensure)
(add-hook 'c-mode-hook       #'eglot-ensure)
(add-hook 'c++-mode-hook     #'eglot-ensure)
(add-hook 'rust-mode-hook    #'eglot-ensure)
(add-hook 'zig-mode-hook     #'eglot-ensure)

(defun my/eglot-format-buffer-before-save ()
  (when (bound-and-true-p eglot-managed-mode)
    (eglot-format-buffer)))
(add-hook 'before-save-hook #'my/eglot-format-buffer-before-save)
```
Essa configuração liga o **Eglot**, o suporte nativo do Emacs para “inteligência de linguagem”, sempre que você abrir arquivos de Clojure, Java, Python, C, C++, Rust ou Zig e muitas outras.

Na prática, isso dá recursos de IDE: **autocompletar**, **ir para definição**, **mostrar erros/avisos** enquanto digita e **informações rápidas** sobre símbolos — tudo automaticamente, sem você precisar ligar nada manualmente.

O segundo trecho faz o Emacs **formatar o código ao salvar**: sempre que o Eglot estiver ativo naquele arquivo, ele pede ao “servidor da linguagem” a formatação padrão do projeto (quando disponível). O resultado é um código salvo já **padronizado e limpo**, seguindo as regras do ecossistema de cada linguagem.

---

