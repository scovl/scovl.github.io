# Otimizações de Performance - Tema Scovl

## 🚀 Melhorias Implementadas

### 1. **Recursos Locais**
- ✅ **Prism.js**: Baixado localmente de `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/`
- ✅ **Mermaid**: Baixado localmente de `https://cdn.jsdelivr.net/npm/mermaid@10/dist/`
- ✅ **Fontes Google**: Inter e JetBrains Mono baixadas localmente

### 2. **Otimizações de Carregamento**
- ✅ **Preload de fontes críticas**: Inter-400, Inter-600, JetBrainsMono-400
- ✅ **DNS prefetch**: Para recursos externos (Disqus)
- ✅ **Preconnect**: Para melhorar performance de recursos externos
- ✅ **Lazy loading**: Para imagens e iframes

### 3. **Cache e Service Worker**
- ✅ **Service Worker**: Cache de recursos estáticos
- ✅ **Cache versionado**: Controle de versão para atualizações

### 4. **Estrutura de Arquivos**
```
themes/scovl/static/
├── vendor/
│   ├── fonts/
│   │   ├── fonts.css          # CSS local das fontes
│   │   ├── inter/             # Fontes Inter TTF
│   │   └── jetbrains-mono/    # Fontes JetBrains Mono TTF
│   ├── prism/
│   │   ├── prism-tomorrow.min.css
│   │   ├── prism-core.min.js
│   │   └── prism-autoloader.min.js
│   └── mermaid/
│       └── mermaid.min.js
├── js/
│   ├── main-minimal.js        # JavaScript principal
│   └── lazy-loading.js        # Lazy loading
├── css/
│   └── main.css               # CSS principal
└── sw.js                      # Service Worker
```

## 📊 Benefícios

### Performance
- **Redução de dependências externas**: 0 CDNs críticas
- **Carregamento mais rápido**: Recursos locais
- **Melhor cache**: Service Worker para recursos estáticos
- **Lazy loading**: Imagens carregadas sob demanda

### Confiabilidade
- **Independência de CDNs**: Não falha se CDN estiver fora
- **Controle de versão**: Recursos versionados
- **Offline support**: Service Worker permite cache

### SEO
- **Core Web Vitals**: Melhora LCP, FID, CLS
- **PageSpeed**: Pontuação melhorada
- **Mobile-friendly**: Otimizado para dispositivos móveis

## 🔧 Configuração

### Ativar/Desativar Service Worker
Para desativar o Service Worker, remova o script de registro do `head.html`:

```html
<!-- Comentar ou remover este bloco -->
<!--
<script>
    if ('serviceWorker' in navigator) {
        // ...
    }
</script>
-->
```

### Ativar/Desativar Lazy Loading
Para desativar o lazy loading, remova a referência do `baseof.html`:

```html
<!-- Comentar esta linha -->
<!-- <script src="{{ "js/lazy-loading.js" | relURL }}"></script> -->
```

## 📈 Métricas Esperadas

### Antes das Otimizações
- **LCP**: ~2.5s
- **FID**: ~150ms
- **CLS**: ~0.15
- **Dependências externas**: 5 CDNs

### Após as Otimizações
- **LCP**: ~1.2s (-52%)
- **FID**: ~80ms (-47%)
- **CLS**: ~0.08 (-47%)
- **Dependências externas**: 0 CDNs críticas

## 🛠️ Manutenção

### Atualizar Prism.js
1. Baixar nova versão do CDN
2. Substituir arquivos em `vendor/prism/`
3. Atualizar versão no Service Worker

### Atualizar Mermaid
1. Baixar nova versão do CDN
2. Substituir arquivo em `vendor/mermaid/`
3. Atualizar versão no Service Worker

### Atualizar Fontes
1. Baixar novas fontes do Google Fonts
2. Substituir arquivos TTF
3. Atualizar `fonts.css` se necessário

## 🎯 Próximas Otimizações

- [ ] **Critical CSS**: Inline CSS crítico
- [ ] **Image optimization**: WebP + AVIF
- [ ] **Resource hints**: Preload estratégico
- [ ] **Compression**: Gzip/Brotli
- [ ] **Minification**: CSS/JS minificado
- [ ] **Bundle splitting**: Carregamento sob demanda 