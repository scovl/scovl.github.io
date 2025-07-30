# Tema Scovl - Hugo

Um tema moderno e elegante para Hugo com design responsivo, syntax highlighting e funcionalidades avançadas.

## 🎨 Características

### Design Moderno e Simples
- **Design Responsivo**: Adapta-se perfeitamente a todos os dispositivos
- **Layout Limpo**: Lista simples de posts sem cards desnecessários
- **Tipografia Elegante**: Usa Inter para texto e JetBrains Mono para código
- **Cores Harmoniosas**: Paleta de cores moderna e acessível
- **Imagens Centralizadas**: Todas as imagens são centralizadas por padrão

### Syntax Highlighting
- **Prism.js**: Syntax highlighting avançado para mais de 200 linguagens
- **Tema Escuro**: Suporte completo para modo escuro
- **Botão de Copiar**: Copie código com um clique
- **Números de Linha**: Opcional para blocos de código

### Funcionalidades Avançadas
- **Tema Escuro**: Alternância automática baseada na preferência do sistema
- **Smooth Scroll**: Navegação suave entre seções
- **Animações de Scroll**: Elementos aparecem com animação ao scroll
- **Busca em Tempo Real**: Filtre posts instantaneamente

## 📁 Estrutura de Arquivos

```
themes/scovl/
├── layouts/
│   ├── _default/
│   │   ├── baseof.html      # Template base
│   │   ├── index.html       # Página inicial
│   │   ├── single.html      # Página de post individual
│   │   └── _markup/
│   │       └── render-codeblock.html  # Template de código
│   └── partials/
│       ├── head.html        # Meta tags e CSS
│       ├── header.html      # Cabeçalho
│       └── footer.html      # Rodapé
├── static/
│   ├── css/
│   │   └── main.css         # Estilos principais
│   └── js/
│       └── main.js          # JavaScript
└── README.md               # Esta documentação
```

## 🚀 Instalação

1. Clone o tema para sua pasta `themes/`:
```bash
cd themes/
git clone [url-do-repositorio] scovl
```

2. Configure o tema no seu `config.toml`:
```toml
theme = "scovl"
```

3. Adicione configurações opcionais:
```toml
[params]
  # Informações do site
  description = "Descrição do seu blog"
  
  # Links sociais
  github = "https://github.com/seu-usuario"
  linkedin = "https://linkedin.com/in/seu-usuario"
  email = "seu@email.com"
  
  # Funcionalidades
  readingTime = true
  readingTimeText = "Tempo de leitura:"
  
  # Mermaid (para diagramas)
  mermaid = true
  [params.mermaid]
    theme = "default"
    align = "center"
```

## 🎯 Uso

### Posts
Para criar um post, use o front matter padrão do Hugo:

```markdown
---
title: "Meu Post"
date: 2024-01-01
description: "Descrição do post"
tags: ["tag1", "tag2"]
author: "Seu Nome"
---

Conteúdo do post aqui...
```

### Código
Para destacar código, use blocos de código markdown:

````markdown
```javascript
function hello() {
    console.log("Hello, World!");
}
```
````

Ou com nome de arquivo:

````markdown
```javascript:app.js
function hello() {
    console.log("Hello, World!");
}
```
````

### Mermaid (Diagramas)
Para criar diagramas centralizados, use o shortcode Mermaid:

```html
{{< mermaid theme="default" align="center" >}}
graph TD
    A[Início] --> B{Decisão}
    B -->|Sim| C[Processo]
    B -->|Não| D[Fim]
    C --> D
{{< /mermaid >}}
```

### Shortcodes
O tema suporta shortcodes personalizados:

#### Código com destaque:
```html
{{< code lang="javascript" filename="app.js" >}}
function hello() {
    console.log("Hello, World!");
}
{{< /code >}}
```

#### Diagramas Mermaid:
```html
{{< mermaid >}}
sequenceDiagram
    participant U as Usuário
    participant S as Sistema
    U->>S: Login
    S->>U: Resposta
{{< /mermaid >}}
```

## 🎨 Personalização

### Cores
As cores são definidas como variáveis CSS. Para personalizar, edite `static/css/main.css`:

```css
:root {
    --primary-color: #2563eb;    /* Cor principal */
    --accent-color: #f59e0b;     /* Cor de destaque */
    --text-primary: #1e293b;     /* Texto principal */
    /* ... outras variáveis */
}
```

### Tema Escuro
O tema escuro é ativado automaticamente ou via botão. Para personalizar:

```css
.dark-mode {
    --bg-primary: #0f172a;
    --text-primary: #f1f5f9;
    /* ... outras variáveis */
}
```

### Fontes
Para alterar as fontes, modifique as variáveis CSS:

```css
:root {
    --font-family: 'Sua Fonte', sans-serif;
    --font-mono: 'Sua Fonte Mono', monospace;
}
```

## 🔧 Funcionalidades JavaScript

### Syntax Highlighting
- Usa Prism.js para highlighting
- Suporte para 200+ linguagens
- Tema escuro automático

### Copiar Código
- Botão de copiar em todos os blocos de código
- Feedback visual ao copiar
- Suporte para clipboard API

### Animações
- Fade-in suave para posts
- Animações de scroll
- Transições CSS otimizadas

### Tema Escuro
- Detecção automática da preferência do sistema
- Botão de alternância flutuante
- Transição suave entre temas

## 📱 Responsividade

O tema é totalmente responsivo com breakpoints otimizados:

- **Desktop (> 768px)**: Layout completo com navegação horizontal
- **Tablet (768px - 480px)**: Layout adaptado com navegação vertical
- **Mobile (< 480px)**: Layout otimizado com espaçamento reduzido

### Características Responsivas:
- **Navegação**: Adapta-se de horizontal para vertical
- **Tipografia**: Tamanhos de fonte ajustados para cada dispositivo
- **Espaçamento**: Margens e paddings otimizados para mobile
- **Imagens**: Centralizadas e responsivas em todos os dispositivos

## 🎯 Performance

- CSS otimizado com variáveis CSS
- JavaScript modular e eficiente
- Fontes carregadas via CDN
- Imagens otimizadas

## 🤝 Contribuição

Para contribuir com o tema:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Faça suas alterações
4. Teste localmente
5. Envie um pull request

## 📄 Licença

Este tema está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

## 📋 Sistema de Sumário Automático (TOC)

O tema inclui um sistema de Table of Contents (Sumário) moderno e responsivo:

### ✨ Características

- **Geração automática** - Criado automaticamente baseado nos headings do post
- **Design moderno** - Interface elegante com animações suaves
- **Totalmente responsivo** - Comportamento otimizado para mobile e desktop
- **Barra de progresso** - Indicador visual do progresso de leitura
- **Navegação inteligente** - Destaque automático da seção atual
- **Acessibilidade** - Suporte completo a screen readers e navegação por teclado
- **Configurável** - Controle total sobre quando e como exibir

### ⚙️ Configuração

Adicione ao seu `config.yml`:

```yaml
params:
  toc:
    enabled: true      # Habilitar/desabilitar TOC
    minHeadings: 2     # Mínimo de headings para mostrar TOC
    maxDepth: 4        # Profundidade máxima dos headings (H1-H4)
```

### 🎮 Controles

**Desktop:**
- Clique no ícone de toggle para expandir/recolher
- `Ctrl/Cmd + Shift + T` para toggle rápido via teclado

**Mobile:**
- Botão flutuante no canto inferior direito
- Painel deslizante na parte inferior da tela
- `ESC` para fechar
- Toque fora do painel para fechar

### 🎨 Personalização

O TOC herda as cores do tema automaticamente e inclui suporte para modo escuro. Você pode personalizar os estilos editando o CSS em `static/css/main.css`.

## 🆘 Suporte

Para suporte ou dúvidas:

- Abra uma issue no GitHub
- Consulte a documentação do Hugo
- Verifique os exemplos incluídos

---

**Desenvolvido com ❤️ para a comunidade Hugo** 