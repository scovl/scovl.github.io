# 🎨 Demonstração do Tema Scovl

Este arquivo demonstra as principais funcionalidades do tema Scovl para Hugo.

## ✨ Funcionalidades Principais

### 🎯 Design Moderno
- **Layout responsivo** que se adapta a todos os dispositivos
- **Tipografia elegante** com Inter para texto e JetBrains Mono para código
- **Cores harmoniosas** com paleta moderna e acessível
- **Animações suaves** com transições CSS otimizadas

### 💻 Syntax Highlighting Avançado
- **Prism.js** para highlighting de mais de 200 linguagens
- **Botão de copiar** em todos os blocos de código
- **Tema escuro** automático para código
- **Números de linha** opcionais

### 🌙 Tema Escuro
- **Detecção automática** da preferência do sistema
- **Botão de alternância** flutuante
- **Transição suave** entre temas
- **Cores otimizadas** para ambos os modos

### 📱 Responsividade Completa
- **Desktop**: Layout completo com sidebar
- **Tablet**: Layout adaptado para telas médias
- **Mobile**: Layout otimizado para telas pequenas

## 🚀 Como Usar

### 1. Instalação
```bash
# Clone o tema
git clone https://github.com/seu-usuario/scovl.git themes/scovl

# Configure no config.toml
theme = "scovl"
```

### 2. Configuração Básica
```toml
# config.toml
baseURL = "https://seu-site.com/"
languageCode = "pt-BR"
title = "Meu Blog"
theme = "scovl"

[params]
  description = "Descrição do seu blog"
  github = "https://github.com/seu-usuario"
  linkedin = "https://linkedin.com/in/seu-usuario"
  email = "seu@email.com"
```

### 3. Criando Posts
```markdown
---
title: "Meu Post"
date: 2024-01-15
description: "Descrição do post"
tags: ["tag1", "tag2"]
author: "Seu Nome"
---

# Conteúdo do post

Aqui vai o conteúdo...
```

## 🎨 Personalização

### Cores
Edite as variáveis CSS em `static/css/main.css`:

```css
:root {
    --primary-color: #2563eb;    /* Cor principal */
    --accent-color: #f59e0b;     /* Cor de destaque */
    --text-primary: #1e293b;     /* Texto principal */
}
```

### Fontes
```css
:root {
    --font-family: 'Sua Fonte', sans-serif;
    --font-mono: 'Sua Fonte Mono', monospace;
}
```

## 🔧 Funcionalidades JavaScript

### Syntax Highlighting
- Automático para blocos de código
- Suporte para 200+ linguagens
- Tema escuro automático

### Copiar Código
- Botão em todos os blocos
- Feedback visual
- Suporte para clipboard API

### Animações
- Fade-in para posts
- Animações de scroll
- Transições suaves

### Tema Escuro
- Detecção automática
- Botão de alternância
- Transição suave

## 📊 Performance

- **CSS otimizado** com variáveis CSS
- **JavaScript modular** e eficiente
- **Fontes via CDN** para carregamento rápido
- **Imagens otimizadas** com lazy loading

## 🎯 Exemplos de Uso

### Código com Syntax Highlighting
````markdown
```javascript
function hello() {
    console.log("Hello, World!");
}
```
````

### Código com Nome de Arquivo
````markdown
```javascript:app.js
function hello() {
    console.log("Hello, World!");
}
```
````

### Tabelas
```markdown
| Coluna 1 | Coluna 2 | Coluna 3 |
|----------|----------|----------|
| Dado 1   | Dado 2   | Dado 3   |
```

### Citações
```markdown
> Esta é uma citação importante.
> 
> — Autor
```

## 🌟 Recursos Avançados

### Menu de Navegação
Configure no `config.toml`:

```toml
[menu]
  [[menu.main]]
    name = "Início"
    url = "/"
    weight = 1
  [[menu.main]]
    name = "Posts"
    url = "/post/"
    weight = 2
```

### Links Sociais
```toml
[params]
  github = "https://github.com/seu-usuario"
  linkedin = "https://linkedin.com/in/seu-usuario"
  email = "seu@email.com"
  mastodon = "https://mastodon.social/@seu-usuario"
```

### Funcionalidades Opcionais
```toml
[params]
  readingTime = true
  readingTimeText = "Tempo de leitura:"
  
  # Mermaid para diagramas
  mermaid = true
  [params.mermaid]
    theme = "default"
    align = "center"
```

## 📱 Responsividade

O tema é totalmente responsivo:

- **Desktop (> 768px)**: Layout completo
- **Tablet (768px - 480px)**: Layout adaptado
- **Mobile (< 480px)**: Layout otimizado

## 🎨 Paleta de Cores

### Modo Claro
- **Primária**: `#2563eb` (Azul)
- **Secundária**: `#64748b` (Cinza)
- **Destaque**: `#f59e0b` (Laranja)
- **Texto**: `#1e293b` (Cinza escuro)

### Modo Escuro
- **Fundo**: `#0f172a` (Azul muito escuro)
- **Texto**: `#f1f5f9` (Branco)
- **Bordas**: `#334155` (Cinza escuro)

## 🚀 Próximos Passos

1. **Configure o tema** no seu `config.toml`
2. **Personalize as cores** conforme sua preferência
3. **Adicione seus posts** usando o formato markdown
4. **Configure os menus** e links sociais
5. **Teste a responsividade** em diferentes dispositivos

## 🤝 Suporte

Para suporte ou dúvidas:

- 📖 Consulte a documentação completa
- 🐛 Reporte bugs via GitHub Issues
- 💡 Sugira melhorias via Pull Requests
- 📧 Entre em contato via email

---

**Desenvolvido com ❤️ para a comunidade Hugo**

*Tema Scovl - Moderno, Elegante e Funcional* 