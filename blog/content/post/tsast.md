+++
title = "AST e CST: Análise Estrutural de Código"
description = "Por que AST/CST são melhores que Regex para analisar código"
date = 2023-03-19T17:31:45-03:00
tags = ["javascript", "typescript", "ast", "cst", "análise de código", "desenvolvimento"]
draft = true
weight = 4
author = "Vitor Lobo Ramos"
+++

## AST/CST ao invés de Regex para Análise de Código

E aí, devs! Beleza? 😄

Quantas vezes você já precisou "entender" um código JavaScript ou TypeScript? Seja pra validar um padrão, extrair informações específicas (tipo nomes de funções, variáveis usadas), para parsear um arquivo de configuração, ou até mesmo para criar aquela ferramenta de *lint* customizada pro seu time? Aposto que a primeira ideia que veio na cabeça foi: "[Regex](https://pt.wikipedia.org/wiki/Express%C3%A3o_regular)!".

[Regex](https://pt.wikipedia.org/wiki/Express%C3%A3o_regular) é uma ferramenta poderosa, sem dúvida. Um verdadeiro canivete suíço pra buscar padrões em texto. Mas, quando o "texto" é **código fonte**, a história muda. Usar Regex pra parsear código é como tentar construir uma casa usando apenas uma fita métrica: você consegue medir as coisas, identificar alguns padrões, mas não tem as ferramentas adequadas para entender a estrutura completa ou lidar com todas as complexidades. A chance de perder detalhes importantes ou interpretar algo incorretamente é **enorme**.

É aí que entram os verdadeiros super-heróis dessa história: a **AST (Abstract Syntax Tree)** e a **CST (Concrete Syntax Tree)**. Neste artigo, vamos botar a mão na massa com [TypeScript](https://www.typescriptlang.org/) pra ver como extrair essas árvores e por que essa abordagem é muito mais **segura, confiável e profissional** do que usar expressões regulares (regex).

### O Problema com Regex pra Código

Imagina que você quer encontrar todas as chamadas da função `fetch` no seu código JS. Um Regex tipo `/fetch\(/g` parece resolver, né? Mas e se tiver: `// fetch()` (um comentário), `const meuFetch = fetch; meuFetch()` (uma chamada indireta), `console.log("vou chamar o fetch()");` (dentro de uma string), ou `objeto.fetch()` (um método com o mesmo nome)? Seu Regex simples já começa a falhar ou a precisar de tantas condições e [lookarounds](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Lookbehind_and_Lookahead) que vira um monstro ilegível e difícil de manter.

Código tem **estrutura** e **semântica**, coisas que Regex ignora completamente. Ele só vê texto plano, sem compreender o contexto ou significado real das expressões. Por exemplo, abaixo temos um código que usa fetch de forma indireta, algo que seria extremamente difícil de capturar corretamente apenas com expressões regulares:

```javascript
const meuFetch = fetch;
meuFetch("https://api.example.com/data");
```

Se usarmos um Regex para encontrar todas as chamadas de `fetch`, ele vai falhar, porque o `meuFetch` é uma função e não uma string. Já com a AST, podemos encontrar todas as chamadas de `fetch` de forma precisa, independente de como elas estão escritas. Por exemplo, podemos usar a AST para encontrar todas as chamadas de `fetch` global, ignorando comentários e strings:

```javascript
const fetchCalls = ast.body.filter(
  (node) =>
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'fetch'
);
```

Percebe como a AST nos dá uma visão muito mais clara e precisa do código? Ela nos permite entender o significado do código, independente de como ele está escrito.

### Entendendo as Árvores: CST e AST

Quando um compilador ou interpretador lê seu código, ele não vê só um monte de caracteres. Ele transforma isso em uma estrutura organizada que representa a lógica e a sintaxe do programa. É aqui que entram a CST e a AST.

1.  **CST (Concrete Syntax Tree / Árvore de Sintaxe Concreta):** Pense nela como a árvore genealógica *completa* do seu código. Ela representa **exatamente** o que foi escrito, incluindo todos os detalhes sintáticos como parênteses, vírgulas, pontos e vírgulas, espaços em branco e comentários. Ela é "concreta" porque mapeia diretamente a gramática da linguagem. É útil pra ferramentas que precisam preservar a formatação original ou analisar detalhes muito específicos da sintaxe.

2.  **AST (Abstract Syntax Tree / Árvore de Sintaxe Abstrata):** A AST é uma versão mais "resumida" e focada no **significado** do código. Ela abstrai os detalhes puramente sintáticos (como parênteses desnecessários ou a maioria dos delimitadores) e se concentra na estrutura lógica: quais são as declarações, expressões, operadores, chamadas de função, etc. É a estrutura mais usada pra análise estática, *linting*, transpilação (como o próprio TypeScript faz com JS) e refatoração.

**Analogia Rápida:** Pense numa frase: "O gato (preto) sentou no tapete.".
*   A **CST** seria como a análise sintática completa da escola: Sujeito ("O gato (preto)"), Predicado ("sentou no tapete"), com detalhes sobre o artigo "O", o substantivo "gato", o adjetivo entre parênteses "(preto)", o verbo "sentou", a preposição "no", o artigo "o" (contraído) e o substantivo "tapete". Inclui os parênteses!
*   A **AST** focaria na ação principal: Quem? ("gato", talvez com um atributo "cor: preto"). Fez o quê? ("sentou"). Onde? ("tapete"). Ela captura a essência sem se prender *exatamente* a como foi escrito (os parênteses poderiam sumir se não mudassem o significado essencial).

> **Nota:** Na prática, muitas ferramentas que dizem gerar "AST" podem, na verdade, gerar árvores que contêm alguns detalhes da CST, dependendo da implementação e do objetivo. A distinção é importante conceitualmente, mas no dia a dia, você provavelmente vai interagir mais diretamente com a AST.

---

### Mão na Massa: Extraindo a AST com TypeScript

Vamos usar uma biblioteca popular e robusta pra parsear código JavaScript/TypeScript e gerar uma AST compatível com o padrão [ESTree](https://github.com/estree/estree), que é amplamente usado no ecossistema JavaScript (ESLint, Babel, Prettier, etc.). A `@typescript-eslint/typescript-estree` é perfeita pra isso, pois usa o próprio compilador do TypeScript por baixo dos panos.

**1. Preparando o Ambiente:**

Primeiro, crie um projetinho [Node.js](https://nodejs.org/) básico (se ainda não tiver um) e instale as dependências:

```bash
mkdir meu-analisador-ast
cd meu-analisador-ast
npm init -y
npm install typescript @types/node @typescript-eslint/typescript-estree --save-dev
# Ou usando yarn:
# yarn add typescript @types/node @typescript-eslint/typescript-estree --dev

# Crie um arquivo tsconfig.json básico (se não tiver)
npx tsc --init
```

**2. O Código que Vamos Analisar:**

Crie um arquivo `exemplo.js` (sim, podemos analisar JS puro também!) com o seguinte conteúdo:

```javascript
// exemplo.js
const MENSAGEM = "Olá, AST!";

function saudacao(nome) {
  console.log(`${MENSAGEM} Bem-vindo, ${nome}!`);
  const valor = calcula(10, 5);
  return valor;
}

function calcula(a, b) {
  // Uma função simples
  return a + b;
}

saudacao("Mundo");
```

**3. O Script TypeScript para Extrair a AST:**

Crie um arquivo `analisador.ts`:

```typescript
import * as parser from '@typescript-eslint/typescript-estree';
import * as fs from 'fs';
import * as path from 'path';

// Caminho para o arquivo que queremos analisar
const filePath = path.join(__dirname, 'exemplo.js');
const code = fs.readFileSync(filePath, 'utf-8');

console.log('Código a ser analisado:');
console.log('-----------------------');
console.log(code);
console.log('-----------------------\n');

try {
  // O pulo do gato: parsear o código!
  const ast = parser.parse(code, {
    // Opções importantes:
    loc: true, // Pega informações de linha/coluna (location)
    range: true, // Pega o índice de início/fim de cada nó no código fonte
    comment: true, // Inclui comentários na árvore (útil!)
    tokens: true, // Inclui a lista de tokens (às vezes útil, mais próximo da CST)
    jsx: false, // Se seu código tivesse JSX, mude pra true
    ecmaVersion: 'latest', // Use a versão mais recente do ECMAScript
    sourceType: 'module', // Ou 'script', dependendo do seu código
  });

  console.log('AST (Abstract Syntax Tree) gerada:');
  // Usamos JSON.stringify para visualizar a estrutura da árvore.
  // O segundo argumento (null) é o 'replacer', e o terceiro (2) é a indentação.
  console.log(JSON.stringify(ast, null, 2));

  // --- Exemplo de como usar a AST ---
  console.log('\n--- Análise Simples da AST ---');

  // Encontrar todas as declarações de função
  const funcoesDeclaradas = ast.body.filter(
    (node): node is parser.AST.FunctionDeclaration =>
      node.type === 'FunctionDeclaration'
  );

  console.log(`Funções declaradas (${funcoesDeclaradas.length}):`);
  funcoesDeclaradas.forEach(func => {
    console.log(`- Nome: ${func.id?.name}`);
    console.log(`  - Parâmetros: ${func.params.map((p: any) => p.name).join(', ')}`);
    // Poderíamos analisar o corpo (func.body) aqui dentro recursivamente!
  });

  // Encontrar todas as chamadas de console.log
  let chamadasConsoleLog = 0;
  parser.AST_NODE_TYPES.CallExpression
  function encontrarChamadasConsole(node: parser.AST.Node | null) {
      if (!node) return;

      if (node.type === parser.AST_NODE_TYPES.CallExpression &&
          node.callee.type === parser.AST_NODE_TYPES.MemberExpression &&
          node.callee.object.type === parser.AST_NODE_TYPES.Identifier &&
          node.callee.object.name === 'console' &&
          node.callee.property.type === parser.AST_NODE_TYPES.Identifier &&
          node.callee.property.name === 'log')
      {
          chamadasConsoleLog++;
          console.log(`\nEncontrada chamada console.log na linha ${node.loc.start.line}:`);
          // Poderia extrair os argumentos: node.arguments
      }

      // Navega recursivamente pelos filhos do nó atual
      for (const key in node) {
          if (node.hasOwnProperty(key)) {
              const child = (node as any)[key];
              if (typeof child === 'object' && child !== null) {
                  if (Array.isArray(child)) {
                      child.forEach(item => encontrarChamadasConsole(item));
                  } else {
                      encontrarChamadasConsole(child);
                  }
              }
          }
      }
  }

  // Inicia a busca a partir da raiz da AST
  encontrarChamadasConsole(ast);
  console.log(`\nTotal de chamadas a console.log encontradas: ${chamadasConsoleLog}`);


} catch (error) {
  console.error('Erro ao parsear o código:', error);
}
```

**4. Executando:**

Compile e execute o script:

```bash
npx tsc # Compila analisador.ts para analisador.js
node analisador.js
```

**Saída Esperada:**

Você verá o código original, seguido por um JSON **gigante** representando a AST. Pode parecer assustador no começo, mas explore a estrutura! Você verá nós como:

*   `Program`: O nó raiz.
*   `VariableDeclaration`: Para `const MENSAGEM = ...`
    *   `kind`: "const"
    *   `declarations`: Um array com os detalhes da variável (`id` com nome "MENSAGEM", `init` com o valor "Olá, AST!").
*   `FunctionDeclaration`: Para as funções `saudacao` e `calcula`.
    *   `id`: Com o nome da função.
    *   `params`: Array com os parâmetros.
    *   `body`: Um `BlockStatement` contendo o corpo da função.
*   `ExpressionStatement`: Para a chamada `saudacao("Mundo");`.
    *   `expression`: Um `CallExpression` representando a chamada da função.
        *   `callee`: O `Identifier` "saudacao".
        *   `arguments`: Array com os argumentos passados ("Mundo").

Depois do JSON da AST, você verá a análise simples que fizemos, mostrando os nomes das funções declaradas e a contagem de chamadas a `console.log`. Percebeu como conseguimos informações precisas e estruturadas? Poderíamos facilmente:

*   Verificar se `MENSAGEM` é realmente uma constante (`kind === 'const'`).
*   Listar todos os parâmetros de `saudacao`.
*   Analisar o corpo de `calcula` pra ver quais operações ela faz (`BinaryExpression` com operador `+`).
*   Verificar se `calcula` está sendo chamada dentro de `saudacao`.

Tentar fazer isso com Regex seria... uma aventura dolorosa e muitas vezes insegura.


---


**O Cenário: Extraindo Configurações Simples de uma AST**

Imagine que temos um arquivo de configuração em TypeScript e queremos usar a AST para **extrair todas as propriedades de nível superior que tenham valores literais simples** (string, número, booleano, null). Queremos ignorar propriedades com valores complexos (objetos, arrays, chamadas de função, etc.) ou chaves que não sejam identificadores simples.

**Nosso Código de Exemplo (`config.ts`):**

```typescript
// config.ts
export const settings = {
  apiKey: "xyz123abc", // Queremos: { apiKey: "xyz123abc" }
  timeout: 5000,       // Queremos: { timeout: 5000 }
  isEnabled: true,    // Queremos: { isEnabled: true }
  retryCount: null,    // Queremos: { retryCount: null }
  "complex-key": "value", // Ignorar: Chave não é identificador simples
  nested: {           // Ignorar: Valor é um objeto (não literal simples)
    level: 2
  },
  features: ["A", "B"], // Ignorar: Valor é um array
  getEndpoint: () => process.env.ENDPOINT, // Ignorar: Valor é uma função
};
```

**O Objetivo:** A partir da AST gerada para o objeto `settings`, queremos obter o seguinte resultado:

```javascript
{
  apiKey: "xyz123abc",
  timeout: 5000,
  isEnabled: true,
  retryCount: null
}
```

**Ferramentas (Simuladas):**

Para focar na lógica FP vs. OO, vamos *simular* que já temos a AST. Usaremos interfaces TypeScript simplificadas para representar os nós relevantes. Na prática, você usaria uma biblioteca como `@typescript-eslint/typescript-estree`, `@babel/parser` ou a API do compilador TypeScript.

**Interfaces da AST (Simplificadas):**

```typescript
// Tipos base para nós da AST
type NodeType = "ObjectExpression" | "Property" | "Identifier" | "Literal" | "ArrayExpression" | "ArrowFunctionExpression" | "ObjectExpressionNode"; // Adicionado ObjectExpressionNode para clareza

interface Node {
  type: NodeType;
  // Em uma AST real, teríamos loc, range, etc.
}

// Representa um nome, como a chave de uma propriedade ou nome de variável
interface Identifier extends Node {
  type: "Identifier";
  name: string;
}

// Representa um valor literal (string, número, booleano, null)
interface Literal extends Node {
  type: "Literal";
  value: string | number | boolean | null;
  raw?: string; // O texto original do literal
}

// Representa uma chave de propriedade que é uma string literal (ex: "complex-key")
interface StringLiteralKey extends Node {
    type: "Literal";
    value: string;
}


// Representa outros tipos de nós que podem ser valores (vamos ignorá-los)
interface ObjectExpressionNode extends Node { type: "ObjectExpressionNode"; properties: Property[]; } // Exemplo para aninhado
interface ArrayExpression extends Node { type: "ArrayExpression"; elements: Node[]; }
interface ArrowFunctionExpression extends Node { type: "ArrowFunctionExpression"; params: any[]; body: any; }

// Representa uma propriedade dentro de um objeto literal (chave: valor)
interface Property extends Node {
  type: "Property";
  key: Identifier | StringLiteralKey; // A chave pode ser um nome ou uma string literal
  value: Node; // O valor pode ser qualquer tipo de nó
  kind: 'init'; // Geralmente 'init' para propriedades normais
  method: boolean;
  shorthand: boolean;
  computed: boolean;
}

// Representa um objeto literal { ... }
interface ObjectExpression extends Node {
  type: "ObjectExpression";
  properties: Property[];
}

// --- Simulação da AST para o objeto 'settings' ---
// (Isto viria de um parser na vida real)
const settingsObjectAST: ObjectExpression = {
  type: "ObjectExpression",
  properties: [
    // apiKey: "xyz123abc"
    { type: "Property", key: { type: "Identifier", name: "apiKey" }, value: { type: "Literal", value: "xyz123abc" }, kind: 'init', method: false, shorthand: false, computed: false },
    // timeout: 5000
    { type: "Property", key: { type: "Identifier", name: "timeout" }, value: { type: "Literal", value: 5000 }, kind: 'init', method: false, shorthand: false, computed: false },
    // isEnabled: true
    { type: "Property", key: { type: "Identifier", name: "isEnabled" }, value: { type: "Literal", value: true }, kind: 'init', method: false, shorthand: false, computed: false },
    // retryCount: null
    { type: "Property", key: { type: "Identifier", name: "retryCount" }, value: { type: "Literal", value: null }, kind: 'init', method: false, shorthand: false, computed: false },
    // "complex-key": "value"
    { type: "Property", key: { type: "Literal", value: "complex-key" }, value: { type: "Literal", value: "value" }, kind: 'init', method: false, shorthand: false, computed: false }, // Chave é Literal, não Identifier
    // nested: { ... }
    { type: "Property", key: { type: "Identifier", name: "nested" }, value: { type: "ObjectExpressionNode", properties: [/*...*/] } as ObjectExpressionNode, kind: 'init', method: false, shorthand: false, computed: false }, // Valor é ObjectExpressionNode
    // features: ["A", "B"]
    { type: "Property", key: { type: "Identifier", name: "features" }, value: { type: "ArrayExpression", elements: [/*...*/] } as ArrayExpression, kind: 'init', method: false, shorthand: false, computed: false }, // Valor é ArrayExpression
    // getEndpoint: () => ...
    { type: "Property", key: { type: "Identifier", name: "getEndpoint" }, value: { type: "ArrowFunctionExpression", params:[], body: {} } as ArrowFunctionExpression, kind: 'init', method: false, shorthand: false, computed: false } // Valor é ArrowFunctionExpression
  ]
};
```

---

### Abordagem 1: Orientação a Objetos (OO)

Criamos uma classe para encapsular a lógica de extração.

```typescript
// --- Abordagem OO ---

interface SimpleSettings {
  [key: string]: string | number | boolean | null;
}

class SimpleSettingsExtractor {
  private extractedSettings: SimpleSettings;

  constructor() {
    this.extractedSettings = {};
  }

  // Método público para iniciar a extração
  public extractFrom(node: Node): SimpleSettings {
    // Resetar o estado para garantir que a instância seja reutilizável
    // ou criar uma nova instância a cada chamada seria outra opção OO.
    this.extractedSettings = {};

    // Verifica se o nó inicial é o que esperamos
    if (node.type !== 'ObjectExpression') {
      console.warn("Nó inicial não é um ObjectExpression.");
      return {};
    }

    // Chama um método privado para processar as propriedades
    this.processProperties(node.properties);

    return this.extractedSettings;
  }

  // Método privado para iterar e processar cada propriedade
  private processProperties(properties: Property[]): void {
    // Loop imperativo: percorre cada propriedade
    for (const prop of properties) {
      // Verifica se a propriedade tem o formato desejado
      if (this.isValidSimpleProperty(prop)) {
        // Se for válida, extrai e armazena o valor
        // Note: O type cast aqui é seguro devido à validação anterior
        const keyName = (prop.key as Identifier).name;
        const value = (prop.value as Literal).value;
        this.extractedSettings[keyName] = value;
      }
      // Se não for válida, simplesmente a ignoramos (poderia ter lógica 'else' aqui)
    }
  }

  // Método privado para validar uma única propriedade
  private isValidSimpleProperty(prop: Property): boolean {
    // 1. A propriedade deve ser do tipo 'Property' e 'kind: init' (simplificação)
    if (prop.type !== 'Property' || prop.kind !== 'init') {
      return false;
    }
    // 2. A chave (key) deve ser um 'Identifier' (nome simples)
    if (prop.key.type !== 'Identifier') {
      return false;
    }
    // 3. O valor (value) deve ser um 'Literal' simples
    if (!this.isSimpleLiteralValue(prop.value)) {
      return false;
    }
    // Se passou por todas as verificações, é válida
    return true;
  }

  // Método privado auxiliar para checar se o valor é um Literal simples
  private isSimpleLiteralValue(valueNode: Node): valueNode is Literal {
    return valueNode.type === 'Literal' &&
           (typeof valueNode.value === 'string' ||
            typeof valueNode.value === 'number' ||
            typeof valueNode.value === 'boolean' ||
            valueNode.value === null);
  }
}

// --- Uso da Abordagem OO ---
console.log("--- Abordagem OO ---");
const ooExtractor = new SimpleSettingsExtractor(); // Instanciação necessária
const ooResult = ooExtractor.extractFrom(settingsObjectAST);

console.log("Resultado OO:", ooResult);
// Esperado: Resultado OO: { apiKey: 'xyz123abc', timeout: 5000, isEnabled: true, retryCount: null }
```

**Análise Didática da Abordagem OO:**

*   **Encapsulamento:** A lógica está organizada dentro de uma classe (`SimpleSettingsExtractor`). Métodos privados (`processProperties`, `isValidSimpleProperty`, `isSimpleLiteralValue`) escondem os detalhes da implementação. Isso é bom para organização.
*   **Estado:** A classe *mantém estado* (`this.extractedSettings`). Embora seja resetado a cada chamada `extractFrom`, a *existência* de estado interno é uma característica fundamental da OO. Para operações mais complexas (ex: coletar informações em várias passagens pela AST), esse estado poderia se tornar mais significativo (e potencialmente mais complexo de gerenciar).
*   **Estilo Imperativo:** O código dentro de `processProperties` usa um loop `for...of` e condicionais `if` para controlar o fluxo. Dizemos ao computador *como* fazer a extração passo a passo: "pegue a lista", "para cada item", "se a chave for X", "se o valor for Y", "então adicione ao resultado".
*   **Boilerplate:** Requer a definição da classe, construtor (mesmo que simples) e a instanciação (`new SimpleSettingsExtractor()`) antes de poder ser usada.

---

### Abordagem 2: Programação Funcional (FP)

Usamos funções puras e combinamos operações de coleções (como `filter` e `reduce` ou `map`).

```typescript
// --- Abordagem FP ---

// Interface para o resultado (a mesma de OO)
interface SimpleSettings {
  [key: string]: string | number | boolean | null;
}

// --- Funções Auxiliares Puras (Type Guards) ---

// Verifica se um nó é um Identifier (chave simples)
const isIdentifierKey = (node: Node): node is Identifier => node.type === 'Identifier';

// Verifica se um nó é um Literal com valor simples (string, number, boolean, null)
const isSimpleLiteralValue = (node: Node): node is Literal =>
  node.type === 'Literal' &&
  (typeof node.value === 'string' ||
   typeof node.value === 'number' ||
   typeof node.value === 'boolean' ||
   node.value === null);

// Verifica se um nó de Propriedade representa uma configuração simples desejada
// Recebe um nó qualquer, retorna `true` se for uma Property válida, `false` caso contrário.
// Usa type guards para refinar o tipo de `prop` dentro do if.
const isSimpleConfigProperty = (node: Node): node is Property & { key: Identifier; value: Literal } => {
    // Usamos '&&' para garantir que todas as condições sejam verdadeiras
    return node.type === 'Property' &&          // É uma propriedade?
           node.kind === 'init' &&              // É uma inicialização normal?
           isIdentifierKey(node.key) &&       // A chave é um identificador simples?
           isSimpleLiteralValue(node.value); // O valor é um literal simples?
}


// --- Função Principal (Usando filter + reduce) ---
// Recebe a AST do objeto e retorna o objeto de configurações simples.
const extractSimpleSettingsFP_FilterReduce = (node: Node): SimpleSettings => {
  // 1. Validação inicial do nó de entrada
  if (node.type !== 'ObjectExpression') {
    console.warn("Nó inicial não é um ObjectExpression.");
    return {};
  }

  // 2. Filtrar: Seleciona apenas as propriedades que atendem aos critérios.
  //    `node.properties.filter(isSimpleConfigProperty)` retorna um *novo array*
  //    contendo apenas as propriedades que fizeram `isSimpleConfigProperty` retornar `true`.
  const validProperties: (Property & { key: Identifier; value: Literal })[] = node.properties.filter(isSimpleConfigProperty);

  // 3. Reduzir: Transforma o array de propriedades válidas no objeto final.
  //    `reduce` itera sobre `validProperties`.
  //    `acc` (acumulador) começa como `{}` (o objeto resultado).
  //    Para cada `prop` válida, adicionamos a chave/valor ao `acc`.
  //    Retornamos o `acc` modificado para a próxima iteração.
  //    IMPORTANTE: Por performance, `reduce` frequentemente MUTA o acumulador.
  //               Para imutabilidade estrita, criaríamos um novo objeto a cada passo:
  //               `return { ...acc, [prop.key.name]: prop.value.value };`
  //               Mas para este caso, mutar o `acc` interno é comum e aceitável.
  const result = validProperties.reduce((acc, prop) => {
    acc[prop.key.name] = prop.value.value;
    return acc;
  }, {} as SimpleSettings); // `{}` é o valor inicial do acumulador `acc`

  return result;
};


// --- Função Principal Alternativa (Usando filter + map + Object.fromEntries) ---
// Muitas vezes considerada mais declarativa ainda.
const extractSimpleSettingsFP_FilterMap = (node: Node): SimpleSettings => {
   if (node.type !== 'ObjectExpression') {
    console.warn("Nó inicial não é um ObjectExpression.");
    return {};
   }

   // 1. Filtrar (igual ao anterior): Pega só as propriedades válidas.
   const validProperties = node.properties.filter(isSimpleConfigProperty);

   // 2. Mapear: Transforma cada propriedade válida em um par [chave, valor].
   //    `map` cria um *novo array* onde cada item é o resultado da função aplicada.
   const keyValuePairs = validProperties.map(prop =>
       [prop.key.name, prop.value.value] as [string, string | number | boolean | null]
   );
   // Exemplo de resultado de keyValuePairs:
   // [
   //   ["apiKey", "xyz123abc"],
   //   ["timeout", 5000],
   //   ["isEnabled", true],
   //   ["retryCount", null]
   // ]

   // 3. Construir Objeto: Converte o array de pares [chave, valor] no objeto final.
   //    `Object.fromEntries` é perfeito para isso.
   return Object.fromEntries(keyValuePairs);
}


// --- Uso da Abordagem FP ---
console.log("--- Abordagem FP ---");
const fpResultFilterReduce = extractSimpleSettingsFP_FilterReduce(settingsObjectAST);
const fpResultFilterMap = extractSimpleSettingsFP_FilterMap(settingsObjectAST);

console.log("Resultado FP (Filter/Reduce):", fpResultFilterReduce);
// Esperado: Resultado FP (Filter/Reduce): { apiKey: 'xyz123abc', timeout: 5000, isEnabled: true, retryCount: null }

console.log("Resultado FP (Filter/Map):", fpResultFilterMap);
// Esperado: Resultado FP (Filter/Map): { apiKey: 'xyz123abc', timeout: 5000, isEnabled: true, retryCount: null }
```

**Análise Didática da Abordagem FP:**

*   **Funções Puras:** As funções auxiliares (`isIdentifierKey`, `isSimpleLiteralValue`, `isSimpleConfigProperty`) são (ou deveriam ser) puras: seu resultado depende *apenas* das suas entradas e elas não causam efeitos colaterais (não modificam nada fora delas). Isso as torna fáceis de testar e raciocinar sobre.
*   **Imutabilidade:** As operações (`filter`, `map`, `reduce`, `Object.fromEntries`) não modificam a AST original (`settingsObjectAST`). Elas operam sobre os dados e produzem *novos* resultados (novos arrays, novo objeto final). Isso é mais seguro, especialmente se a AST fosse usada em outros lugares.
*   **Estilo Declarativo:** Funções como `filter`, `map`, `reduce` descrevem *o que* você quer fazer ("filtrar os itens que atendem a `isSimpleConfigProperty`", "mapear cada item para um par `[chave, valor]`", "reduzir a lista a um único objeto"), em vez de detalhar *como* fazer com loops e ifs explícitos. Isso pode tornar a intenção do código mais clara.
*   **Composição:** A lógica é construída combinando (compondo) funções menores (`isSimpleConfigProperty` é usada dentro de `filter`). Se a lógica ficasse mais complexa, poderíamos criar mais funções pequenas e compô-las.
*   **Menos Boilerplate:** Não há necessidade de definir uma classe ou instanciá-la. As funções podem ser importadas e usadas diretamente.
*   **Sem Estado:** As funções de extração não dependem de nenhum estado externo ou `this`. O resultado é determinado unicamente pela AST de entrada.

---

**Comparação Pragmática: Por que FP Brilha Aqui?**

1.  **Natureza dos Dados vs. Comportamento:** A AST é fundamentalmente uma *estrutura de dados* que representa código. Ela não tem "comportamento" inerente como um objeto `User` que "faz login". A tarefa é *transformar* esses dados. FP é otimizada para transformação de dados. OO é otimizada para modelar entidades com estado e comportamento. Aplicar OO aqui pode parecer um pouco forçado – estamos criando uma classe (`SimpleSettingsExtractor`) cujo único propósito é executar uma transformação de dados, sem realmente precisar do encapsulamento de estado e comportamento que a OO oferece.
2.  **Fluxo de Dados Claro:** A abordagem FP, especialmente com `filter`/`map`, torna o fluxo de dados muito explícito: pegue as propriedades -> filtre as válidas -> transforme-as em pares -> construa o objeto final. É um pipeline de transformações. Na OO, o fluxo está dentro dos métodos e pode envolver a modificação do estado interno (`this.extractedSettings`).
3.  **Menos Cerimônia:** Para uma tarefa focada como esta, a FP evita a "cerimônia" de criar uma classe, instanciar, gerenciar `this`, etc. O código é mais direto ao ponto.
4.  **Segurança com Imutabilidade:** Ao não modificar a AST original e sempre retornar novos dados, a FP reduz o risco de erros sutis causados por mutações inesperadas, o que é uma vantagem ao lidar com estruturas potencialmente complexas como ASTs.
5.  **Reutilização e Testabilidade:** As pequenas funções puras da FP (`isIdentifierKey`, etc.) são trivialmente testáveis e podem ser reutilizadas em outras tarefas de análise de AST. Testar métodos privados de uma classe OO pode ser um pouco mais complicado.


Neste cenário específico de analisar uma estrutura de dados (AST) e extrair/transformar informações dela, a abordagem funcional (FP) tende a ser mais **direta**, **declarativa**, **segura (devido à imutabilidade)** e **concisa** do que a abordagem Orientada a Objetos (OO). Isso ocorre porque a natureza do problema (transformação de dados) se alinha melhor com os pontos fortes da FP.

A OO ainda é poderosa para muitos outros problemas, especialmente aqueles que envolvem modelar entidades complexas do mundo real com estado e comportamento interligados. No entanto, para a manipulação de ASTs, a FP frequentemente oferece uma solução mais elegante e pragmática.