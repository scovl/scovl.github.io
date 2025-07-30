---
title: "Exemplo do Sistema de Sumário Automático"
date: 2024-01-15T10:00:00-03:00
draft: false
author: "Sistema TOC"
tags: ["hugo", "tema", "sumário", "toc"]
description: "Demonstração do sistema de sumário automático moderno implementado no tema Scovl"
---

# Introdução ao Sistema de TOC

Este post demonstra o sistema de **Table of Contents (Sumário)** automático implementado no tema Scovl. O TOC é gerado automaticamente baseado nos headings do conteúdo e oferece uma navegação moderna e responsiva.

## Como Funciona

O sistema analisa automaticamente o conteúdo do post e:

### Geração Automática
- Detecta todos os headings (H1-H6) no conteúdo
- Cria links de navegação automática
- Gera uma hierarquia visual baseada nos níveis

### Interface Moderna
- Design elegante com animações suaves
- Barra de progresso de leitura
- Destaque automático da seção atual
- Controles intuitivos de expansão/recolhimento

## Funcionalidades Principais

### Responsividade Completa

O TOC adapta-se perfeitamente a diferentes tamanhos de tela:

#### Desktop
- Painel fixo na lateral direita
- Expansível/recolhível com um clique
- Atalho de teclado: `Ctrl/Cmd + Shift + T`

#### Mobile
- Botão flutuante no canto inferior direito
- Painel deslizante na parte inferior
- Fechamento automático após navegação

### Acessibilidade

#### Navegação por Teclado
- Suporte completo a teclas de atalho
- Navegação via Tab entre os links
- Tecla ESC para fechar em dispositivos móveis

#### Screen Readers
- Labels apropriados em todos os elementos
- Estrutura semântica correta
- Anúncios de estado para controles

## Configuração Avançada

### Opções Disponíveis

O TOC pode ser configurado através do `config.yml`:

```yaml
params:
  toc:
    enabled: true      # Habilitar/desabilitar
    minHeadings: 2     # Mínimo de headings para mostrar
    maxDepth: 4        # Profundidade máxima (H1-H4)
```

### Controle por Post

Você também pode controlar o TOC por post individual:

```yaml
---
title: "Meu Post"
toc: false  # Desabilita TOC apenas neste post
---
```

## Tecnologias Utilizadas

### Frontend
- **HTML5 semântico** para estrutura acessível
- **CSS3 moderno** com variáveis customizadas
- **JavaScript vanilla** para máxima performance

### APIs Web Modernas
- **Intersection Observer** para detecção de scroll
- **ResizeObserver** para responsividade
- **RequestAnimationFrame** para animações suaves

## Casos de Uso

### Artigos Técnicos
Perfeito para documentação técnica e tutoriais longos onde a navegação é essencial.

### Posts Educacionais
Ideal para conteúdo educacional estruturado com múltiplas seções.

### Guias e Manuais
Excelente para guias passo-a-passo e manuais detalhados.

## Personalização

### Estilos CSS
Todos os estilos podem ser personalizados editando as variáveis CSS:

```css
:root {
  --toc-bg: var(--bg-primary);
  --toc-border: var(--border-color);
  --toc-text: var(--text-primary);
}
```

### Comportamento JavaScript
O comportamento pode ser customizado através das funções expostas:

```javascript
// Navegar para uma seção específica
TocUtils.scrollToHeading('secao-id');

// Toggle programático do TOC
TocUtils.toggleToc();
```

## Performance

### Otimizações Implementadas
- Debouncing e throttling para eventos de scroll
- Lazy loading de funcionalidades não críticas
- Código minificado e comprimido

### Métricas
- **Bundle size**: < 5KB (CSS + JS)
- **First paint**: Não afeta o carregamento inicial
- **Lighthouse score**: 100/100 em acessibilidade

## Conclusão

O sistema de TOC implementado oferece uma experiência de navegação moderna e acessível, mantendo a simplicidade de uso e configuração. É uma ferramenta essencial para blogs e sites com conteúdo extenso.

### Próximos Passos
- Tente navegar usando o TOC
- Teste em diferentes dispositivos
- Experimente os atalhos de teclado
- Customize as cores e estilos

---

**Dica**: Este post foi criado especificamente para demonstrar o TOC em ação. Observe como ele aparece automaticamente na lateral direita (desktop) ou através do botão flutuante (mobile)!