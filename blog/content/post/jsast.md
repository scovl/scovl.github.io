## Desvendando ASTs com JavaScript, TypeScript e Esprima: Um Guia Amigável 🤖

*Tempo de Leitura: uns 15-25 minutinhos (ou um café ☕)*

**O que você vai encontrar aqui:**

*   Introdução (Sem formalidades!)
*   ASTs: O Que Raios é Isso?
    *   Traduzindo: O que é uma AST?
    *   Pra que serve essa "árvore"?
    *   Os 3 Passos Mágicos da AST
    *   Por que começar com o Esprima?
*   Mão na Massa: Bora Codar!
    *   Preparando o Terreno (Instalação)
    *   Nosso Projetinho Simples
    *   "Parseando": Transformando Código em AST
    *   "Traversando": Dando um Rolê na AST
    *   Analisando: Catando Informações Úteis
*   Como Rodar Isso Aí
    *   Instalando o Esprima (Moleza!)
    *   Exemplo Básico pra Sentir o Gostinho
    *   Botando pra Funcionar
*   Detalhes Importantes (Pra Ficar Ligado!)
    *   Performance: Roda Liso?
    *   Entendendo as Peças do Quebra-Cabeça (ESTree)
    *   E se o Código Tiver Erro?
*   Próximos Níveis (O que mais dá pra fazer?)
    *   Turbinando a Brincadeira
    *   Outras Ferramentas na Caixa
*   Onde Achar Mais Info (Links Úteis)


Olá pessoal! 👋

Neste artigo, vou desmistificar um pouco como navegar através de uma AST usando o Esprima em Javascript/Typescript. Desta maneira você pode manipular código evitando ao máximo usar expressões regulares (que em muitos casos são um pesadelo). Mas vamos começar pelo começo, o que é uma AST? Uma AST é uma representação abstrata da estrutura sintática de um programa. Ela é uma árvore de nós que representa a hierarquia e a relação entre as partes do código. 

Isto é muito útil para uma diversidade de aplicações como:

*   Análise de código - como o ESLint
*   Transformação de código - como o Babel
*   Verificação de padrões - como o Prettier

E muito mais!

Abstraíndo um pouco o conceito, imagina que seu código é uma receita de bolo. A AST é tipo um **diagrama ou um mapa mental** dessa receita. Ela pega o texto puro do código e organiza ele numa estrutura de árvore, mostrando como cada pedacinho se conecta. Ela ignora coisas como espaços extras ou comentários (na maioria das vezes) e foca no que realmente importa: a estrutura**lógica** do código. Exemplo:

```javascript
const PI = 3.14;
```

**AST (Versão Super Simplificada):**

```json
- Program {
    type: "Program",
    start: 0,
    end: 16,
    body: [
        - VariableDeclaration {
            type: "VariableDeclaration",
            start: 0,
            end: 16,
            declarations: [
                - VariableDeclarator {
                    type: "VariableDeclarator",
                    start: 6,
                    end: 15,
                    id: Identifier {
                        type: "Identifier",
                        start: 6,
                        end: 8,
                        name: "PI"
                    },
                    init: Literal {
                        type: "Literal",
                        start: 11,
                        end: 15,
                        value: 3.14,
                        raw: "3.14"
                    }
                }
            ]
            kind: "const"
        }
    ]
    sourceType: "script"
}

Viu só? Cada parte do código (o `const`, o nome `PI`, o número `3.14`) vira um **"nó"** nessa árvore. Cada nó tem um `type` dizendo o que ele é (`VariableDeclaration`, `Identifier`, `Literal`) e outras informações pra dar mais detalhes. É basicamente **código falando sobre código**!

Você pode estar se perguntando: Blz, mas pra que serve essa "árvore"? ASTs são o coração de muitas ferramentas que usamos:

*   **Linters (ESLint):** Ele "lê" a AST (o mapa do código) pra ver se você seguiu as regras de estilo ou se tem algum erro bobo ali, *sem precisar rodar o código*.
*   **Transpilers (Babel):** Quer usar código JavaScript moderno que o navegador antigo não entende? O Babel olha a AST, "reescreve" as partes modernas de um jeito mais antigo, e depois gera o código JS compatível. Pura mágica da AST!
*   **Bundlers (Webpack, Rollup):** Eles olham os `import` e `export` na AST pra entender quais arquivos dependem de quais e juntar tudo num pacote só.
*   **Formatadores (Prettier):** Ele não liga pro seu estilo, ele olha a AST (a estrutura lógica) e reescreve o código do jeito *dele*, todo formatadinho.
*   **Refatoração em IDEs:** Sabe quando você renomeia uma variável e a IDE magicamente atualiza em todos os lugares? Adivinha? AST em ação!

> **Resumindo:** É muito mais fácil pra um programa analisar ou modificar outro programa usando a AST do que tentando entender a string de texto puro. É o jeito inteligente de fazer as coisas! 😉

#### Os 3 Passos Mágicos da AST

Geralmente, trabalhar com AST envolve 3 etapas:

**AST: O Fluxo**

Código (Texto) ➡️ **1. Parsing** ➡️ AST (Mapa) ➡️ **2. Traversal** ➡️ Visita aos Nós ➡️ **3. Análise/Transformação** ➡️ Info Útil / Código Novo

1.  **Parsing (Tradução):** É pegar o textão do código e transformar ele na estrutura de árvore (a AST). Quem faz isso é um carinha chamado **Parser** (tipo o Esprima). Ele verifica se o código tá certinho (sintaxe) e monta o mapa.
2.  **Traversal (Passeio):** Com o mapa (AST) pronto, a gente precisa "andar" por ele pra visitar os nós (as partes do código). O jeito comum é usar o **Visitor Pattern**: você define funções tipo "ei, quando encontrar um nó do tipo `FunctionDeclaration`, faça isso aqui!". É como ter um guia turístico pra cada tipo de lugar no mapa.
3.  **Análise/Transformação (Ação):** Enquanto passeia pelos nós, você pode fazer coisas:
    *   **Análise:** Só olhar e coletar informações (Ex: contar quantas funções tem, achar todos os `console.log`).
    *   **Transformação:** Mudar a própria AST (Ex: renomear uma variável, trocar um nó por outro). Aí depois você pode gerar código novo a partir da AST modificada.


### Mão na Massa: Bora Codar!

#### Preparando o Terreno (Instalação)

Você vai precisar do **Node.js** instalado (com npm ou yarn).

No terminal, dentro da pasta do seu projeto, manda bala:

```bash
# Com npm
npm install esprima
npm install --save-dev @types/esprima @types/estree # Se for usar TypeScript

# Ou com yarn
yarn add esprima
yarn add --dev @types/esprima @types/estree # Se for usar TypeScript
```

*Dica:* `@types/estree` são as definições de tipo pro padrão ESTree, super útil em TS!

Moleza, né? 😉

#### Nosso Projetinho Simples

Cria uma pasta e um arquivo `index.js` (ou `index.ts`) dentro dela. Algo tipo:

```
meu-projeto-ast/
├── node_modules/
├── index.js   # Ou index.ts
└── package.json
```

#### "Parseando": Transformando Código em AST

A principal função do Esprima é a `parseScript` (pra código JS normal) ou `parseModule` (se tiver `import`/`export`).

**Exemplo em JavaScript (`index.js`):**

```javascript
const esprima = require('esprima');

const codigo = 'const ANO = 2024; console.log("Olá, AST!");';

try {
  // A mágica acontece aqui!
  const ast = esprima.parseScript(codigo, {
    loc: true, // Quero saber a linha/coluna de cada nó
    range: true // Quero saber o índice de início/fim no texto original
  });

  // Imprime a AST toda bonitona (é um objeto gigante!)
  console.log("AST Gerada:");
  console.log(JSON.stringify(ast, null, 2));

} catch (e) {
  // Se der erro de sintaxe no código, ele cai aqui
  console.error("Eita, deu erro no parsing:", e.description);
  console.error(` >> Na linha ${e.lineNumber}, coluna ${e.column}`);
}
```

**Exemplo em TypeScript (`index.ts`):**

```typescript
import * as esprima from 'esprima';
import { Program, Node } from 'estree'; // Tipos pra deixar o TS feliz

const codigo: string = 'let message = "TypeScript + AST = ❤️";';

try {
  const ast: Program = esprima.parseScript(codigo, {
    loc: true,
    range: true,
    tokens: true // Opcional: Me dá uma lista de todos os "pedaços" (palavras-chave, nomes, etc.)
  });

  console.log("AST Gerada (TS):");
  console.log(JSON.stringify(ast, null, 2));

} catch (e: any) { // Captura o erro
  console.error("Ops, erro no parsing (TS):", e.description);
  console.error(` >> Na linha ${e.lineNumber}, coluna ${e.column}`);
}
```

*   **`parseScript` vs `parseModule`:** Lembra: `parseModule` se tiver `import`/`export`.
*   **Opções úteis:**
    *   `loc`/`range`: Pra saber *onde* cada parte da AST está no código original (ótimo pra mostrar erros!).
    *   `tokens`: Te dá uma lista de todos os "tokens" (tipo `const`, `ANO`, `=`, `2024`, `;`). Útil pra algumas análises, mas gasta mais memória.
    *   `comment`: Pra incluir os comentários na AST.
    *   `jsx`: Se tiver código React/JSX.

Roda isso e você vai ver a estrutura da AST impressa! É um JSONzão, mas ali tá todo o seu código organizado.

#### "Traversando": Dando um Rolê na AST

Beleza, temos o mapa (AST). Como a gente "anda" por ele pra ver o que tem em cada lugar? Podemos fazer isso com uma função recursiva simples, ou usar bibliotecas prontas (como `estraverse`).

Vamos criar nossa função de "passeio" (um Visitor Pattern bem simples):

**JavaScript (`index.js` - continuação):**

```javascript
// ... (código do parsing ali em cima) ...

// Função pra "passear" na árvore
function traverse(node, visitor) {
  // 1. Visita o nó atual: Se o visitor tiver algo pra esse tipo de nó, chama!
  if (visitor[node.type]) {
    visitor[node.type](node);
  }

  // 2. Visita os filhos: Olha todas as propriedades do nó
  for (const key in node) {
    if (node.hasOwnProperty(key)) {
      const child = node[key];
      // Se for um objeto ou array...
      if (typeof child === 'object' && child !== null) {
        // Se for um array de nós, visita cada um
        if (Array.isArray(child)) {
          child.forEach(subChild => {
            if (subChild && subChild.type) { // Garante que é um nó AST válido
              traverse(subChild, visitor);
            }
          });
        }
        // Se for um único nó filho, visita ele
        else if (child.type) {
          traverse(child, visitor);
        }
      }
    }
  }
}

// Nosso "guia turístico": o que fazer quando encontrar cada tipo de nó
const meuVisitor = {
  // Quando achar uma declaração de função...
  FunctionDeclaration(node) {
    console.log(`\n==> Achei uma função! Nome: ${node.id.name}, Linha: ${node.loc.start.line}`);
  },
  // Quando achar uma chamada de função...
  CallExpression(node) {
    // Verifica se tá chamando direto um nome (tipo console.log)
    if (node.callee.type === 'Identifier') {
      console.log(`\n==> Opa, chamando a função: ${node.callee.name}()`);
    }
  }
  // Poderia adicionar mais: 'IfStatement', 'ForStatement', etc.
};

// Só roda a travessia se o parsing deu certo
if (typeof ast !== 'undefined') {
  console.log("\nBora passear pela AST e analisar...");
  traverse(ast, meuVisitor);
}
```

**TypeScript (`index.ts` - continuação):**

```typescript
// ... (código do parsing ali em cima) ...

// Interface pro nosso Visitor (pra ajudar o TS)
interface Visitor {
  [nodeType: string]: (node: Node) => void; // Aceita qualquer tipo de nó do ESTree
}

// Função traverse (igual a de JS, mas com um pouco de tipagem)
function traverse(node: Node, visitor: Visitor): void {
  // ... (lógica igual à da versão JS) ...
  if (visitor[node.type]) {
    visitor[node.type](node);
  }
  for (const key in node) {
    // ... (restante da lógica recursiva) ...
  }
}


const meuVisitorTS: Visitor = {
  VariableDeclarator(node: any) { // Usando 'any' pra simplificar o acesso às props
    console.log(`\n==> Variável declarada (TS)! Nome: ${node.id.name}, Linha: ${node.loc?.start.line}`);
  },
  Literal(node: any) {
    if (typeof node.value === 'string') {
      console.log(`\n==> Achei um texto (string literal): "${node.value}"`);
    }
  }
};

declare const ast: Program | undefined; // Avisa pro TS que 'ast' existe

if (ast) { // Verifica se ast não é undefined
  console.log("\nPasseando pela AST (TS)...");
  traverse(ast, meuVisitorTS);
}
```

Essa função `traverse` é bem básica. Bibliotecas como `estraverse` são tipo um "GPS mais chique", te dão mais controle (tipo avisar quando *entra* e quando *sai* de um nó).

#### Analisando: Catando Informações Úteis

A "análise" acontece dentro das funções que a gente colocou no `visitor`. Viu ali no `meuVisitor`? Quando ele encontra um nó `FunctionDeclaration`, ele imprime o nome e a linha. Quando acha um `CallExpression`, imprime o nome da função chamada.

É aí que a mágica acontece! Você pode criar visitors pra:

*   Pegar todos os nomes de variáveis.
*   Verificar se alguém usou `eval` (geralmente não é legal!).
*   Contar quantas vezes `console.log` foi chamado.
*   Achar todos os links (`<a>` em JSX, por exemplo).
*   Medir a complexidade do código (contando `if`, `for`, etc.).
*   O céu é o limite! 🚀

### Como Rodar Isso Aí

#### Instalando o Esprima (Moleza!)

Já fizemos lá em cima, né? Só garantir que o Node.js tá aí e rodar `npm install esprima` ou `yarn add esprima`.

#### Exemplo Básico pra Sentir o Gostinho

Pega o código completo (parsing + traverse + visitor) que montamos acima e salva num arquivo `index.js` ou `index.ts`.

**Exemplo Completo Simples (JS - pra facilitar o copiar/colar):**

```javascript
// index.js
const esprima = require('esprima');

// Nosso código de exemplo
const codigo = `
function calcularArea(largura, altura) {
  // Função simples
  if (largura <= 0 || altura <= 0) {
    return null; // Não calcula área inválida
  }
  const area = largura * altura;
  console.log("Área calculada:", area);
  return area;
}

let resultado = calcularArea(10, 5);
let nome = "AST Explorer"; // Uma string literal
`;

// Função pra "passear" na árvore (copie daqui se precisar)
function traverse(node, visitor) {
  if (!node) return; // Segurança extra
  if (visitor[node.type]) {
    visitor[node.type](node);
  }
  for (const key in node) {
    if (node.hasOwnProperty(key)) {
      const child = node[key];
      if (typeof child === 'object' && child !== null) {
        if (Array.isArray(child)) {
          child.forEach(subChild => {
            if (subChild && subChild.type) { traverse(subChild, visitor); }
          });
        } else if (child.type) {
          traverse(child, visitor);
        }
      }
    }
  }
}


// Nosso "guia turístico"
const meuVisitor = {
  FunctionDeclaration(node) {
    console.log(`\n[INFO] Função encontrada: '${node.id.name}' com ${node.params.length} params. Linha: ${node.loc.start.line}`);
  },
  VariableDeclarator(node) {
    console.log(`[INFO] Var declarada: '${node.id.name}'. Tipo: ${node.kind || 'var/let/const'}.`); // kind só em VariableDeclaration
  },
  CallExpression(node) {
    if (node.callee.type === 'Identifier') {
      console.log(`[INFO] Chamada de função: ${node.callee.name}(). Linha: ${node.loc.start.line}`);
    } else if (node.callee.type === 'MemberExpression') { // tipo console.log
        if (node.callee.object.type === 'Identifier' && node.callee.property.type === 'Identifier') {
             console.log(`[INFO] Chamada de método: ${node.callee.object.name}.${node.callee.property.name}(). Linha: ${node.loc.start.line}`);
        }
    }
  },
  IfStatement(node) {
    console.log(`[INFO] Encontrado um 'if'. Linha: ${node.loc.start.line}`);
  },
  Literal(node) {
      if(typeof node.value === 'string' && node.value.length > 0) {
        console.log(`[INFO] String encontrada: "${node.value}". Linha: ${node.loc.start.line}`);
      }
  }
};

// --- Roda Tudo ---
try {
  console.log("--- Analisando o Código ---");
  const ast = esprima.parseScript(codigo, { loc: true, range: true });

  // Descomente pra ver a ASTzona completa:
  // console.log("\n--- AST Completa ---");
  // console.log(JSON.stringify(ast, null, 2));

  console.log("\n--- Iniciando Análise com Visitor ---");
  traverse(ast, meuVisitor);
  console.log("\n--- Análise Concluída ---");

} catch (e) {
  console.error("\n--- ERRO ---");
  console.error("Deu ruim no parsing:", e.description);
  console.error(`Local: Linha ${e.lineNumber}, Coluna ${e.column}`);
}
```

#### Botando pra Funcionar

Abre o terminal na pasta do projeto e manda ver:

```bash
# Se for JavaScript
node index.js

# Se for TypeScript (precisa do ts-node ou compilar antes)
# Instala globalmente (se não tiver): npm install -g ts-node
ts-node index.ts
# Ou compila e roda:
# tsc index.ts
# node index.js
```

E pronto! Você vai ver a saída da nossa "análise" no console, mostrando as funções, variáveis, chamadas e o que mais a gente pediu pro visitor procurar. Legal, né? 😎

### Detalhes Importantes (Pra Ficar Ligado!)

#### Performance: Roda Liso?

*   **Arquivos Gigantes:** Parsear arquivos JS muito, muito grandes pode consumir bastante memória e processador. O Esprima é rápido, mas pra projetos gigantescos, pode ser um ponto a otimizar.
*   **Opções Ligadas:** Ligar opções como `tokens`, `loc`, `range`, `comment` deixa o processo um pouco mais lento e a AST maior. Só ligue se for usar mesmo.
*   **Recuperação de Erros:** O Esprima padrão para no primeiro erro de sintaxe. Ferramentas mais avançadas tentam continuar analisando mesmo com erros, mas isso é bem mais complexo.

#### Entendendo as Peças do Quebra-Cabeça (ESTree)

O segredo pra explorar ASTs é sacar o **ESTree**. É ele que define todos os tipos de nós que podem aparecer (`Identifier`, `Literal`, `IfStatement`, `ForStatement`, etc.) e o que cada um tem dentro.

**Como analisar um nó:**

Seu Visitor pega um `node` ➡️ Olha o `node.type` ➡️ Sabendo o tipo, você sabe quais propriedades procurar (ex: um `IfStatement` tem `test`, `consequent`, `alternate`) ➡️ Pega a informação que você quer!

*   **Exemplo: `IfStatement` (o nó do `if`)**
    *   `type`: "IfStatement"
    *   `test`: É a condição dentro do `if (...)`. Geralmente outro nó, tipo uma comparação (`BinaryExpression`).
    *   `consequent`: É o bloco de código `{...}` que roda se a condição for verdadeira. Geralmente um `BlockStatement`.
    *   `alternate`: É o bloco do `else` (ou `else if`). Pode ser outro `IfStatement`, um `BlockStatement` ou `null` se não tiver `else`.

Vale muito a pena dar uma olhada na documentação do ESTree (link lá no final) e brincar no [astexplorer.net](https://astexplorer.net/) pra ver como diferentes códigos viram ASTs.

#### E se o Código Tiver Erro?

Se você tentar parsear um código com erro de sintaxe (tipo esqueceu uma vírgula), o Esprima vai dar pau e jogar um erro (Exception). Por isso é **fundamental** colocar o `esprima.parseScript(...)` dentro de um bloco `try...catch`.

```javascript
try {
  const ast = esprima.parseScript("let x = oops"); // Erro aqui!
} catch (e) {
  // O 'e' tem infos úteis!
  console.error("Deu erro de sintaxe!");
  console.error("Mensagem:", e.description);
  console.error("Onde:", `Linha ${e.lineNumber}, Coluna ${e.column}`);
}
```

Assim seu programa não quebra inteiro e você pode tratar o erro direitinho.

### Próximos Níveis (O que mais dá pra fazer?)

Curtiu a brincadeira? Dá pra ir muito além!

#### Turbinando a Brincadeira

*   **Passeio Turbinado:** Dá uma olhada na biblioteca `estraverse`. Ela te dá mais controle sobre o passeio na AST.
*   **Análises Mais Ninjas:**
    *   Achar variáveis que nunca são usadas.
    *   Calcular a "complexidade" de uma função (quantos `if`s, `for`s aninhados?).
    *   Mapear quem chama quem no seu código.
*   **Brincar de Transformar:** Modifica a AST (com cuidado!) e usa uma lib tipo `escodegen` pra gerar o código JS de volta a partir da AST modificada. Imagina renomear todas as variáveis `i` de um loop pra `index` automaticamente!
*   **Falar TypeScript de Verdade:** Pra analisar código TS *com tipos*, o Esprima não serve. Aí você teria que usar a API do próprio compilador TypeScript (`tsc`) ou ferramentas como `typescript-eslint-parser`. É mais complexo, mas te dá acesso aos tipos!

#### Outras Ferramentas na Caixa

*   **Acorn:** Parser JS moderno e rápido, base do Babel. Tem plugins! É tipo o Esprima anabolizado.
*   **Babel (@babel/parser):** O parser do Babel. Entende de tudo, até das features mais novas do JS e JSX. Se você já usa Babel, pode usar o parser dele.
*   **TypeScript Compiler API:** Acesso total à AST do TypeScript, incluindo tipos. Poderoso, mas com curva de aprendizado maior.
*   **AST Explorer (astexplorer.net):** **Use isso!** É um site onde você cola seu código e vê a AST gerada por vários parsers. Melhor jeito de aprender e testar.

Esprima é show pra começar, mas pra coisas mais sérias ou específicas (principalmente com TS), talvez valha a pena olhar essas outras.

### Onde Achar Mais Info (Links Úteis)

*   **Esprima (Site Oficial):** [esprima.org](http://esprima.org/)
*   **ESTree (A "Gramática" das ASTs):** [github.com/estree/estree](https://github.com/estree/estree)
*   **AST Explorer (Seu Melhor Amigo!):** [astexplorer.net](https://astexplorer.net/)
*   **Estraverse (Pra Passear Melhor):** [github.com/estools/estraverse](https://github.com/estools/estraverse)
*   **Escodegen (Pra Gerar Código da AST):** [github.com/estools/escodegen](https://github.com/estools/escodegen)
*   **Acorn (Alternativa):** [github.com/acornjs/acorn](https://github.com/acornjs/acorn)
*   **Babel Parser (Outra Alternativa):** [babeljs.io/docs/en/babel-parser](https://babeljs.io/docs/en/babel-parser)
