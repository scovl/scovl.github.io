# Syntax Highlighting - Tema Scovl

## 🎨 **Como Usar**

O tema Scovl usa **Prism.js** para syntax highlighting. Para usar, simplesmente adicione a linguagem após os três backticks:

### Exemplos

**C++**
````markdown
```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```
````

**Rust**
````markdown
```rust
fn main() {
    println!("Hello, World!");
}
```
````

**Clojure**
````markdown
```clojure
(defn greet [name]
  (str "Hello, " name "!"))

(println (greet "World"))
```
````

**Swift**
````markdown
```swift
func greet(name: String) -> String {
    return "Hello, \(name)!"
}

print(greet("World"))
```
````

**Bash**
````markdown
```bash
#!/bin/bash

greet() {
    local name="$1"
    echo "Hello, $name!"
}

greet "World"
```
````

**JavaScript**
````markdown
```javascript
function hello() {
    console.log("Hello, World!");
}
```
````

**Python**
````markdown
```python
def hello():
    print("Hello, World!")
```
````

**HTML**
````markdown
```html
<!DOCTYPE html>
<html>
<head>
    <title>Hello</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>
```
````

**CSS**
````markdown
```css
body {
    font-family: Arial, sans-serif;
    color: #333;
}
```
````

**Zig**
````markdown
```zig
const std = @import("std");

pub fn main() !void {
    const stdout = std.io.getStdOut().writer();
    try stdout.print("Hello, World!\n", .{});
}
```
````

## 🔧 **Linguagens Suportadas**

O Prism.js com autoloader suporta mais de 200 linguagens, incluindo:

- **C++** (`cpp`)
- **Rust** (`rust`)
- **Clojure** (`clojure`)
- **Swift** (`swift`)
- **Bash** (`bash`, `shell`)
- **JavaScript** (`javascript`, `js`)
- **Python** (`python`, `py`)
- **HTML** (`html`)
- **CSS** (`css`)
- **Java** (`java`)
- **C#** (`csharp`, `cs`)
- **Go** (`go`)
- **PHP** (`php`)
- **Ruby** (`ruby`)
- **Kotlin** (`kotlin`)
- **TypeScript** (`typescript`, `ts`)
- **Zig** (`zig`)
- **SQL** (`sql`)
- **JSON** (`json`)
- **YAML** (`yaml`, `yml`)
- **Markdown** (`markdown`, `md`)

## 🎯 **Recursos Especiais**

### Filename
Você pode adicionar um nome de arquivo ao bloco de código:

````markdown
```cpp:main.cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```
````

### Highlighting de Linhas
Para destacar linhas específicas:

````markdown
```cpp{1,3-5}
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```
````

## 🚀 **Configuração**

### Tema
O tema atual é **Tomorrow** (escuro). Para mudar, substitua o arquivo CSS:

```bash
# Baixar outro tema
curl -o vendor/prism/prism-tomorrow.min.css \
  "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-{tema}.min.css"
```

### Adicionar Linguagens
Para adicionar suporte a novas linguagens:

```bash
# Baixar componente da linguagem
curl -o vendor/prism/prism-{linguagem}.min.js \
  "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-{linguagem}.min.js"
```

Depois adicione no `baseof.html` (antes do main.js):

```html
<script src="{{ "vendor/prism/prism-{linguagem}.min.js" | relURL }}"></script>
```

**Nota**: Algumas linguagens têm dependências. Por exemplo:
- C++ precisa de `clike` e `c`
- C# precisa de `clike`
- Java precisa de `clike`
- Clojure, Swift e Bash são independentes

## 🐛 **Troubleshooting**

### Syntax Highlighting Não Funciona

1. **Verificar Console**: Abra o DevTools e veja se há erros
2. **Verificar Carregamento**: Confirme se os arquivos do Prism.js estão carregando
3. **Verificar Classes**: O HTML deve ter `class="language-{lang}"`

### Debug

Adicione este código temporariamente para debug:

```html
<script>
console.log('Prism disponível:', typeof Prism !== 'undefined');
console.log('Elementos de código:', document.querySelectorAll('pre[class*="language-"]').length);
</script>
```

## 📊 **Performance**

- **Tamanho**: ~15KB (core + componentes principais)
- **Carregamento**: Local, sem dependências externas
- **Cache**: Service Worker armazena em cache
- **Lazy Loading**: Componentes carregados sob demanda

## 🎨 **Customização**

### Cores
Edite o CSS em `vendor/prism/prism-tomorrow.min.css` ou crie um tema customizado.

### Estilos
Adicione estilos customizados em `css/main.css`:

```css
/* Customizar blocos de código */
pre[class*="language-"] {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Customizar inline code */
:not(pre) > code[class*="language-"] {
    background: #f1f5f9;
    color: #1e293b;
}
``` 