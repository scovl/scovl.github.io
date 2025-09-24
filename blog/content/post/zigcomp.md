+++
title = "Como o compilador do Zig funciona?"
description = "Uma análise técnica do compilador Zig: arquitetura, representações intermediárias e toolchain universal"
date = 2025-07-21T12:00:00-00:00
tags = ["Zig", "Compiladores", "LLVM", "C", "Desempenho", "Sistemas", "Metaprogramação"]
draft = true
weight = 1
author = "Vitor Lobo Ramos"
+++

# Introdução

A evolução das linguagens de programação de sistemas reflete uma tensão constante entre controle de baixo nível e segurança de alto nível. 

Desde os anos 1970, **C estabeleceu o paradigma fundamental** para programação de sistemas: acesso direto à memória, controle explícito de recursos e overhead mínimo. Esta filosofia moldou sistemas operacionais, compiladores e infraestrutura crítica por décadas.

Nas últimas duas décadas, emergiu uma consciência crescente sobre os **custos de segurança** dessa abordagem. Vulnerabilidades de memória ([buffer overflows](https://en.wikipedia.org/wiki/Buffer_overflow), [use-after-free](https://en.wikipedia.org/wiki/Use-after-free), [data races](https://en.wikipedia.org/wiki/Race_condition)) tornaram-se vetores principais de ataques de segurança, levando a questionar se o controle absoluto justifica os riscos associados.

**Rust** (2010) representou uma resposta radical: garantir segurança de memória em tempo de compilação através de [ownership](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html) e [borrow checking](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html), mesmo ao custo de maior complexidade conceitual. Esta abordagem demonstrou viabilidade técnica, mas exigiu mudança paradigmática significativa.

## O Zig como Terceira Via

![Figura 0: O Zig como Terceira Via](/post/images/zig/zigbridge.png)

O Zig emerge como uma linguagem de programação que propõe uma **terceira via** entre C e Rust. Caracteriza-se por oferecer simplicidade sintática, segurança opcional e performance previsível, posicionando-se simultaneamente como linguagem de sistemas e potencial substituto do C.

> Sua proposta fundamental diverge tanto do "controle total" do C quanto da "segurança compulsória" do Rust, oferecendo **segurança configurável**: o desenvolvedor escolhe quando e onde aplicar verificações, permitindo transição gradual de código legado e otimização específica por contexto.  

Como o compilador do Zig transforma código fonte em binários eficientes e portáteis? Este artigo apresenta uma análise técnica do funcionamento do compilador Zig, sua integração com o **[LLVM](https://llvm.org/)** e o desenvolvimento do **Zig Backend** próprio. Exploramos como o Zig processa parsing, aplica otimizações, realiza geração de código e mantém interoperabilidade direta com C.  

Demonstraremos como o compilador do Zig constitui uma peça central da linguagem, funcionando não apenas como gerador de código eficiente, mas também como "toolchain universal" para projetos C/C++.

## A ponte entre seu código e o computador

Zig se posiciona de forma parecida com C e Rust: ele está no meio do caminho entre o controle direto do hardware e facilidades de linguagens de alto nível. O diferencial é que o Zig oferece:

- **Controle manual da memória** como o C (não há borrow checker em tempo de compilação).
- **Ferramentas modernas** que detectam erros em tempo de compilação e podem inserir *safety checks* em tempo de execução (quando você quiser).
- **Interoperação nativa com C**, permitindo incluir cabeçalhos com `@cImport` e compilar bibliotecas C diretamente com o compilador do Zig.
- **Compatibilidade ABI** com C, incluindo tipos especiais (`c_int`, `c_long`, `c_char`) e o tipo `anyopaque`, equivalente a `void *` em C.

![Figura 1: Posicionamento do Zig entre linguagens de alto e baixo nível](/post/images/zig/zig01.png)
<small>Figura 1: O Zig se posiciona entre o controle direto do hardware (como C) e facilidades de linguagens de alto nível, oferecendo segurança opcional e interoperabilidade nativa.</small>

Essa filosofia de "segurança opcional" é uma das principais diferenças entre [Zig](https://ziglang.org/) e [Rust](https://www.rust-lang.org/). No Zig, você não precisa enfrentar a complexidade de um [borrow checker](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html) ou dominar conceitos complexos de [ownership](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html) - o compilador confia que você sabe o que está fazendo, mas oferece ferramentas para auxiliá-lo quando necessário.

Enquanto o Rust garante segurança com regras rígidas de posse e empréstimo, o Zig aposta em dar ao desenvolvedor a escolha: você pode escrever código 100% manual ou habilitar [**safety checks**](https://ziglang.org/documentation/master/#safety-checks) para capturar erros como [**buffer overflow**](https://ziglang.org/documentation/master/#buffer-overflow) ou [**integer overflow**](https://ziglang.org/documentation/master/#integer-overflow) ainda durante a execução em modo debug.

![Figura 2: Safety Checks](/post/images/zig/zig07.png)
<small>Figura 2: Safety Checks.</small> 

Os [safety checks](https://ziglang.org/documentation/master/#safety-checks) podem ser ativados ou desativados através dos modos de compilação (`Debug`, `ReleaseSafe`, `ReleaseFast`, `ReleaseSmall`), permitindo encontrar bugs durante o desenvolvimento sem sacrificar performance no binário final.

A interoperabilidade com C é outro ponto forte que coloca o Zig numa posição única. Diferente de outras linguagens modernas que tratam C como "cidadão de segunda classe", o Zig foi projetado desde o início para ser um **"C melhorado"**. 

Isso significa que você pode incluir headers C diretamente com `@cImport`, linkar bibliotecas C sem wrappers especiais, e até mesmo usar o compilador do Zig para compilar código C/C++ existente - muitas vezes com melhor diagnóstico de erros e builds mais rápidos que GCC ou Clang tradicionais.

## O compilador do Zig

O compilador do Zig também segue o modelo clássico de três etapas: **frontend**, **middle-end** e **backend**. A diferença é que, além do backend tradicional usando LLVM, o Zig está desenvolvendo seu próprio backend para não depender totalmente de bibliotecas externas.

![Figura 2: Arquitetura do compilador Zig](/post/images/zig/zig02.png)
<small>*Figura 2: Arquitetura do compilador Zig mostrando as três etapas principais (frontend, middle-end, backend) e as representações intermediárias (ZIR, AIR, MIR).*</small>

As representações intermediárias (IRs) do Zig constituem uma hierarquia bem definida que reflete a filosofia da linguagem de simplicidade progressiva e controle granular:

O **ZIR (Zig Intermediate Representation)** é a representação mais próxima da sintaxe original, mantendo a estrutura semântica do código fonte. Nesta fase, o compilador realiza verificações semânticas iniciais, mantém informações de localização para diagnósticos precisos, preserva a estrutura de controle de fluxo original, mas ainda não possui informações completas de tipo. 

O **AIR (Analyzed Intermediate Representation)** representa código já analisado e tipado, onde o compilador completa a resolução de tipos e símbolos, aplica transformações semânticas e verificações de segurança, executa código marcado com `comptime`, prepara otimizações independentes da arquitetura e implementa verificações de null safety e bounds checking.

O **MIR (Machine Intermediate Representation)** é a representação mais próxima da máquina alvo, onde operações são decompostas em instruções primitivas (*lowering*), convenções de chamada específicas são implementadas, alocação de registradores é decidida, safety checks são inseridos ou removidos conforme o modo de compilação, e o código é preparado para geração LLVM IR ou assembly nativo. 

Essa progressão através das três representações intermediárias permite que o compilador mantenha simplicidade conceitual enquanto oferece controle granular sobre otimizações e geração de código específico para cada arquitetura alvo.

Essa arquitetura em camadas permite que o Zig implemente recursos únicos como [**comptime**](https://ziglang.org/documentation/master/#comptime) — a capacidade de executar código Zig durante a compilação. 

> Quando você marca uma função ou expressão com `comptime`, o compilador literalmente executa esse código nas IRs intermediárias, gerando valores constantes que são "colados" no binário final. 

Isso elimina overhead de runtime para computações que podem ser feitas em tempo de compilação, algo especialmente poderoso para metaprogramação e geração de código.

### Frontend: entendendo seu código

Quando você compila um arquivo `.zig`, a primeira etapa é o **analisador léxico** (*lexing*), que transforma o código em tokens. Em seguida, o **parser** organiza esses tokens numa **AST (árvore sintática abstrata)**. O compilador então converte essa AST em representações intermediárias próprias:

- **ZIR** (**Zig IR** não tipado) - é a primeira representação após o parsing, ainda sem informações de tipo — ele captura a estrutura do código de forma genérica.
- **AIR** (**Typed IR**) - adiciona todas as informações de tipo e resolve símbolos, permitindo que o compilador detecte erros de tipo e aplique otimizações mais sofisticadas.
- **MIR** (**Machine IR**, específico da arquitetura) - prepara o código para a geração final.

![Figura 3: Fluxo das representações intermediárias](/post/images/zig/zig03.png)
<small>Figura 3: Transformação do código Zig através das representações intermediárias: ZIR (não tipado) → AIR (tipado) → MIR (específico da arquitetura).</small>

Essas IRs não existem para aplicar verificações como o [borrow checker do Rust](https://doc.rust-lang.org/reference/borrow-checker.html), mas para viabilizar otimizações, suportar múltiplos backends e permitir **execução em tempo de compilação** ([*comptime*](https://ziglang.org/documentation/master/#comptime)). Isso significa que o compilador pode executar funções e gerar valores constantes já durante a compilação.

![Figura 4: Comptime](/post/images/zig/zig04.png)
<small>Figura 4: Comptime é uma feature do Zig que permite executar código durante a compilação.</small>

O **comptime** é uma das características mais distintivas do Zig, permitindo que código seja executado durante a compilação. Diferente de sistemas de macros tradicionais, o comptime utiliza a própria sintaxe do Zig para metaprogramação. 

> Quando uma expressão é marcada com `comptime`, o compilador a executa literalmente durante o processo de compilação, substituindo-a pelo resultado no código final. Isso elimina [overhead de runtime](https://en.wikipedia.org/wiki/Overhead) para computações que podem ser determinadas antecipadamente.

Parâmetros marcados com `comptime` implementam generics através de "duck typing em tempo de compilação". Uma função como `fn max(comptime T: type, a: T, b: T) T` aceita qualquer tipo que suporte a operação de comparação. 

O compilador verifica se o tipo é compatível apenas quando a função é instanciada, gerando versões especializadas para cada tipo usado. Dentro da função, o valor do parâmetro `comptime` é conhecido durante a compilação, permitindo decisões condicionais baseadas no tipo, como `if (T == bool)` para implementar comportamentos específicos.

Variáveis `comptime` garantem que todas as operações de leitura e escrita aconteçam em tempo de compilação. Isso, combinado com loops inline (`inline while`), permite funções que são parcialmente avaliadas durante a compilação. 

>Por exemplo, um loop que itera sobre uma estrutura de dados constante pode ser completamente "desenrolado" pelo compilador, gerando código especializado para cada caso de uso específico, mantendo apenas as operações de runtime necessárias no binário final.

A transição do [**ZIR**](https://ziglang.org/documentation/master/#zig-ir) para [**AIR**](https://ziglang.org/documentation/master/#air) é onde o compilador do Zig realmente "entende" seu código. Durante essa fase, acontecem várias análises cruciais: resolução de tipos, onde o compilador determina o tipo de cada expressão, resolve tipos genéricos e aplica inferência de tipos onde necessário — por exemplo, uma variável declarada como `var x = 42` tem seu tipo inferido como `comptime_int`, que depois pode ser coagido para `i32`, `u64` ou outros tipos conforme o contexto.

A análise semântica também acontece nesta etapa, verificando que todas as variáveis foram declaradas antes do uso, que funções são chamadas com o número correto de argumentos, e que operações são válidas para os tipos envolvidos. 

Simultaneamente, o compilador faz a resolução de símbolos, conectando cada uso de variável, função ou tipo à sua declaração correspondente, construindo uma tabela de símbolos completa.

Um aspecto único do Zig é que durante a geração do [**AIR**](https://ziglang.org/documentation/master/#air), expressões marcadas com `comptime` são avaliadas: o compilador literalmente executa esse código, substituindo-o pelos valores resultantes no AIR final. Isso permite metaprogramação poderosa sem overhead de runtime.

A transformação do [**AIR**](https://ziglang.org/documentation/master/#air) para [**MIR**](https://ziglang.org/documentation/master/#mir) é onde o código abstrato se torna específico da arquitetura alvo. Nesta fase, operações de alto nível são decompostas em instruções mais primitivas através de um processo chamado *lowering* — por exemplo, uma operação de divisão pode virar uma sequência de shifts e subtrações em certas arquiteturas que não possuem instrução de divisão dedicada.

O compilador também decide a alocação de registradores, determinando quais valores ficam em registradores da CPU e quais vão para a stack, otimizando o uso dos recursos limitados do processador.

> As convenções de chamada específicas da arquitetura são implementadas no [**MIR**](https://ziglang.org/documentation/master/#mir), definindo como funções passam parâmetros e retornam valores (via registradores, stack, etc.) para cada plataforma alvo.

Dependendo do modo de compilação escolhido, o [**MIR**](https://ziglang.org/documentation/master/#mir) pode incluir ou omitir verificações de segurança como overflow checks, bounds checking e outras validações de runtime. O resultado final é uma representação que está a apenas um passo da geração do assembly específico da máquina alvo, seja através do backend [LLVM](https://llvm.org/) ou do backend nativo do Zig.



### Middle-End: otimizações independentes da máquina

O **middle-end** do Zig aplica **otimizações genéricas**, como:

- **Inlining de funções** - substituição de chamadas de função por seu corpo, otimizando a performance.
- **Eliminação de código morto** - remoção de código que não é executado.
- **Simplificação de expressões** - simplificação de expressões complexas para melhorar a performance.
- **Checagens opcionais de segurança** (ativas em **Debug** e **ReleaseSafe**) - checagens de segurança opcionais que podem ser ativadas ou desativadas conforme o modo de compilação.

Além disso, o Zig trata comportamentos ilegais como [**overflow de inteiros, divisão por zero e acesso fora de limites**](https://ziglang.org/documentation/master/#integer-overflow) de forma diferente conforme o modo de compilação: em [**Debug**](https://ziglang.org/documentation/master/#debug) e [**ReleaseSafe**](https://ziglang.org/documentation/master/#release-safe) esses erros são detectados em runtime; em [**ReleaseFast**](https://ziglang.org/documentation/master/#release-fast) e [**ReleaseSmall**](https://ziglang.org/documentation/master/#release-small) eles são removidos para máxima performance.

Outro detalhe: variáveis inicializadas com `undefined` recebem padrões especiais em **Debug** para ajudar a detectar bugs em tempo de execução.

### Backend: LLVM e Zig Backend

O **backend** é responsável pela transformação final em código de máquina. O Zig mantém uma estratégia dual que reflete sua filosofia de independência gradual:

### LLVM Backend (Principal)
O **LLVM continua sendo o backend principal** para a maioria dos casos de uso, aproveitando:
- Décadas de otimizações maduras para múltiplas arquiteturas (x86, ARM, RISC-V, etc.)
- Suporte robusto a debugging e profiling
- Otimizações de alto nível comprovadas em produção
- Compatibilidade com toolchains existentes

### Zig Backend (Self-Hosted)
O **backend self-hosted está em desenvolvimento ativo**, visando independência gradual do LLVM:
- Atualmente limitado principalmente a builds Debug em x86_64
- Foco em tempos de compilação mais rápidos para desenvolvimento iterativo
- Controle total sobre geração de código e otimizações específicas do Zig
- Redução de dependências externas para simplicidade de distribuição

**Status atual**: O LLVM permanece essencial para builds de produção e suporte completo a arquiteturas, enquanto o self-hosted backend serve como base para experimentação e desenvolvimento futuro.

### Zig como Toolchain Universal
Independente do backend usado, o Zig funciona como **substituto moderno para GCC e Clang**, permitindo compilar projetos C/C++ com `zig cc` e `zig c++`. Suas vantagens incluem:

- **Headers e bibliotecas incluídas**: Já contém bibliotecas padrão de várias plataformas
- **Cross-compilation nativa**: Pode compilar para outros sistemas operacionais com facilidade  
- **Configuração simplificada**: Elimina complexidade de toolchains diferentes para cada alvo
- **Linker universal**: O linker self-hosted suporta formatos como Mach-O, ELF, WASM e PE/COFF
- **Diagnóstico aprimorado**: Oferece melhor detecção de erros e builds mais consistentes entre plataformas

## Sistema de Build e Gerenciamento de Dependências

O Zig inclui um sistema de build nativo que elimina a necessidade de ferramentas externas como CMake, Autotools ou Makefile. O arquivo `build.zig` define todo o processo de compilação usando código Zig:

![Figura 5: Sistema de Build Integrado](/post/images/zig/zig05.png)
<small>Figura 5: Sistema de Build Integrado.</small>

> Este sistema de build integrado elimina a complexidade de configuração e dependências externas que tradicionalmente afligem projetos em C/C++. Todo o processo de compilação é definido programaticamente usando a própria linguagem Zig, permitindo lógica condicional, loops e abstrações sofisticadas para configurar builds complexos.

Abaixo um exemplo de como configurar um build para um projeto Zig:

```zig
const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});
    
    const exe = b.addExecutable(.{
        .name = "app",
        .root_source_file = .{ .path = "src/main.zig" },
        .target = target,
        .optimize = optimize,
    });
    
    b.installArtifact(exe);
}
``` 

O sistema suporta nativamente múltiplos targets, diferentes níveis de otimização ([Debug](https://ziglang.org/documentation/master/#debug), [ReleaseSafe](https://ziglang.org/documentation/master/#release-safe), [ReleaseFast](https://ziglang.org/documentation/master/#release-fast), [ReleaseSmall](https://ziglang.org/documentation/master/#release-small)) e pode integrar tanto código Zig quanto bibliotecas C/C++ existentes sem ferramentas adicionais.

A vantagem fundamental dessa abordagem é a eliminação da "toolchain hell" - o problema comum onde diferentes sistemas operacionais, versões de compiladores e ferramentas de build criam incompatibilidades entre ambientes de desenvolvimento. 

> Com o sistema de build do Zig, a mesma configuração funciona consistentemente em Windows, macOS e Linux, e pode gerar executáveis para qualquer target suportado sem instalação adicional de cross-compilers ou SDKs específicos. 

Isso reduz significativamente o tempo de configuração de projetos e elimina problemas de reprodutibilidade entre diferentes máquinas de desenvolvimento.


### Gerenciador de Pacotes Integrado

Desde a versão 0.11, o Zig possui um gerenciador de pacotes integrado que simplifica o gerenciamento de dependências. No arquivo `build.zig.zon`, você pode declarar dependências:

```zig
.{
    .name = "meu-projeto",
    .version = "0.1.0",
    .dependencies = .{
        .json = .{
            .url = "https://github.com/json-zig/json/archive/refs/tags/v1.0.tar.gz",
            .hash = "1220...",
        },
    },
}
```

O sistema integra diretamente ao compilador o download, verificação de integridade via hash e linkagem das dependências, dispensando ferramentas externas separadas. 

O gerenciador de pacotes utiliza hashes criptográficos para verificação de integridade e segue [versionamento semântico](https://ziglang.org/documentation/master/#semantic-versioning) para controle de versões. Essa abordagem busca reduzir conflitos de dependência e melhorar a reprodutibilidade de builds entre diferentes ambientes de desenvolvimento.

### Compilação Incremental e Análise Lazy

O compilador Zig implementa **análise preguiçosa** (*lazy analysis*), onde apenas código efetivamente usado é analisado e compilado. Isso significa que:

- Funções não chamadas não são analisadas para erros
- Templates/generics só são instanciados quando usados
- Reduz significativamente os tempos de compilação em projetos grandes

A **compilação incremental** permite recompilar apenas as partes do código que mudaram, mantendo um cache inteligente das análises anteriores.

## Integração Nativa com C e Gerenciamento de Memória

O Zig oferece integração sem precedentes com bibliotecas C, incluindo suporte avançado a **allocators** e **async/await** em chamadas C:

```zig
const std = @import("std");
const c = @cImport({
    @cInclude("sqlite3.h");
});

// Allocator explícito para controle de memória
fn databaseExample(allocator: std.mem.Allocator) !void {
    var db: ?*c.sqlite3 = null;
    
    // Chamada C com tratamento de erro Zig
    const result = c.sqlite3_open(":memory:", &db);
    if (result != c.SQLITE_OK) {
        return error.DatabaseError;
    }
    defer _ = c.sqlite3_close(db);
    
    // Uso de allocator para gerenciamento de strings
    const query = try allocator.dupeZ(u8, "CREATE TABLE test (id INTEGER)");
    defer allocator.free(query);
    
    // Execução com verificação de erro
    const exec_result = c.sqlite3_exec(db, query.ptr, null, null, null);
    if (exec_result != c.SQLITE_OK) {
        return error.QueryError;
    }
}

// Integração com async (quando disponível)
fn asyncCExample() !void {
    // Exemplo conceitual de integração async com C
    const file_data = try std.fs.cwd().readFileAlloc(
        std.heap.page_allocator, 
        "data.txt", 
        1024 * 1024
    );
    defer std.heap.page_allocator.free(file_data);
    
    // Processamento que pode ser async
    std.debug.print("Loaded {} bytes\n", .{file_data.len});
}
```

Esse exemplo demonstra como o Zig facilita a [interoperabilidade com bibliotecas C existentes](https://ziglang.org/documentation/master/#c-interoperability). O sistema `@cImport` permite importar headers C diretamente, enquanto os allocators explícitos oferecem controle granular sobre o gerenciamento de memória. 

A integração é transparente: funções C podem ser chamadas diretamente, mas o sistema de tipos do Zig adiciona verificações de segurança onde apropriado. O tratamento de erros permanece explícito através do sistema `!` e `try`, evitando comportamentos indefinidos comuns em C.

> O tratamento de erros permanece explícito através do sistema `!` e `try`, evitando comportamentos indefinidos comuns em C.

O suporte a [allocators](https://ziglang.org/documentation/master/#allocators) é particularmente relevante para integração com código C legado, onde diferentes estratégias de alocação podem ser necessárias dependendo do contexto da biblioteca. Isso permite que desenvolvedores migrem gradualmente de malloc/free para sistemas de gerenciamento mais sofisticados sem quebrar a compatibilidade.


### Gerenciamento Manual de Memória com Allocators

Essa abordagem de allocators explícitos contrasta com o garbage collection automático de linguagens como Java ou Go, onde o programador tem menos controle sobre quando e como a memória é gerenciada. 

Também difere do sistema de ownership do Rust, que resolve o problema em tempo de compilação através de análise estática. O código abaixo é uma pequena demonstração de como isso pode ser feito:

```zig
const std = @import("std");

fn allocatorExample() !void {
    // Arena allocator para liberação em bloco
    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Alocação manual controlada
    const numbers = try allocator.alloc(i32, 1000);
    // Arena é liberada automaticamente no defer
    
    // Allocator geral para controle granular
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const gp_allocator = gpa.allocator();
    
    const dynamic_array = try gp_allocator.alloc(u8, 256);
    defer gp_allocator.free(dynamic_array);
}
```

> O Zig opta por um meio-termo: oferece ferramentas poderosas para gerenciamento manual, mas com verificações de segurança que podem ser habilitadas ou desabilitadas conforme necessário.

Na prática, isso torna o Zig não apenas uma linguagem, mas também um "gerenciador de toolchains" que simplifica o processo de compilação de projetos C/C++ em ambientes variados, mantendo controle total sobre recursos computacionais.

## Segurança Opcional e Tratamento de Erros

O Zig implementa uma filosofia única de **segurança opcional** que evita exceções e exige tratamento explícito de erros, diferenciando-se tanto do C quanto do Rust.

### Modos de Compilação e Safety Checks

- **Debug**: insere checagens de segurança em tempo de execução (detecta estouro de inteiros, acesso fora dos limites de arrays, ponteiros inválidos).
- **ReleaseSafe**: compila com otimizações, mas mantém as checagens de segurança ligadas.
- **ReleaseFast / ReleaseSmall**: remove todas as checagens e otimiza para velocidade ou tamanho, entregando performance comparável (ou até superior) ao C.

![Figura 6: Modos de Compilação e Safety Checks](/post/images/zig/zig06.png)
<small>Figura 6: Modos de Compilação e Safety Checks.</small>

O sistema de modos de compilação do Zig oferece controle granular sobre o equilíbrio entre segurança e performance. No modo [**Debug**](https://ziglang.org/documentation/master/#debug), todas as verificações de segurança permanecem ativas ([overflow de inteiros](https://en.wikipedia.org/wiki/Integer_overflow), [acesso fora dos limites de arrays](https://en.wikipedia.org/wiki/Array_bounds_checking), [ponteiros inválidos](https://en.wikipedia.org/wiki/Null_pointer)) com otimizações mínimas, facilitando o desenvolvimento e depuração. 

O [**ReleaseSafe**](https://ziglang.org/documentation/master/#release-safe) mantém essas mesmas verificações mas adiciona otimizações completas, resultando em código seguro com performance próxima ao modo release. O [**ReleaseFast**](https://ziglang.org/documentation/master/#release-fast) remove todas as verificações de segurança e aplica otimizações máximas para velocidade, enquanto o [**ReleaseSmall**](https://ziglang.org/documentation/master/#release-small) prioriza a redução do tamanho do binário sobre a velocidade bruta. 

No gráfico, as marcações **"On"** e **"Off"** referem-se ao estado das **verificações de segurança** (safety checks) em cada modo de compilação. Quando marcado como **"On"**, significa que as verificações de segurança estão ativas e sendo executadas em tempo de execução. Quando marcado como **"Off"**, essas verificações foram removidas para maximizar a performance.

Os modos **Debug** e **ReleaseSafe** aparecem como **"On"** porque mantêm todas as verificações de segurança ativas:
- Detecção de overflow/underflow de inteiros
- Verificação de limites de arrays
- Validação de ponteiros nulos ou inválidos
- Checagem de undefined behavior

Os modos **ReleaseFast** e **ReleaseSmall** aparecem como **"Off"** porque removem todas as verificações para maximizar performance ou minimizar o tamanho do binário, assumindo que o código já foi validado durante o desenvolvimento. 

Você como desenvolvedor tem **controle total** sobre quando ativar ou desativar essas verificações. Diferentemente de linguagens que impõem um modelo fixo de segurança, o Zig permite escolher o modo de compilação através de flags:

```bash
zig build -Ddebug=true
zig build -Drelease_safe=true
zig build -Drelease_fast=true
zig build -Drelease_small=true
```



Essa flexibilidade permite que desenvolvedores escolham o nível apropriado de segurança versus performance para cada contexto de deployment, desde prototipagem até produção crítica.


### Tratamento Explícito de Erros com `try`

O Zig utiliza **union types** para representar erros sem overhead de exceções:

```zig
const std = @import("std");

fn divide(a: f32, b: f32) !f32 {
    if (b == 0) return error.DivisionByZero;
    return a / b;
}

fn example() !void {
    // Uso do try para propagação automática de erros
    const result = try divide(10, 0); // Propaga erro automaticamente
    std.debug.print("Result: {}\n", .{result});
}

// Tratamento explícito com catch
fn safeExample() void {
    const result = divide(10, 0) catch |err| switch (err) {
        error.DivisionByZero => {
            std.debug.print("Cannot divide by zero!\n", .{});
            return;
        },
    };
    std.debug.print("Result: {}\n", .{result});
}
```

Este modelo de tratamento de erros apresenta algumas características distintas das exceções tradicionais. Os erros são representados como valores de retorno, o que reduz o overhead de performance comparado a mecanismos de exceção que precisam desempilhar a stack. 

O tratamento de erros torna-se explícito no código, exigindo que o desenvolvedor lide com possíveis falhas de forma consciente.

O operador `try` simplifica a propagação de erros: quando uma função retorna um erro, ele é automaticamente repassado para a função chamadora. O `catch` permite tratamento localizado, onde diferentes tipos de erro podem ser tratados de forma específica através de [pattern matching](https://ziglang.org/documentation/master/#pattern-matching).

Esta abordagem requer que o programador considere cenários de falha durante o desenvolvimento, o que pode resultar em código mais robusto. No entanto, também pode tornar o código mais verboso em comparação com linguagens que utilizam exceções, especialmente em casos onde múltiplas operações que podem falhar são encadeadas.

### Null Safety e Optional Types

O Zig trata valores nulos de forma explícita com optional types:

```zig
fn findValue(array: []i32, target: i32) ?usize {
    for (array, 0..) |value, index| {
        if (value == target) return index;
    }
    return null; // Retorno explícito de ausência de valor
}

fn useOptional() void {
    const numbers = [_]i32{1, 2, 3, 4, 5};
    
    // Unwrapping seguro com if
    if (findValue(&numbers, 3)) |index| {
        std.debug.print("Found at index: {}\n", .{index});
    } else {
        std.debug.print("Not found\n", .{});
    }
}
```

Os optional types do [Zig](https://ziglang.org/documentation/master/#optional-types) eliminam uma classe inteira de erros comuns em programação: o acesso a valores nulos não inicializados. Diferente de linguagens como C ou Java, onde null pointers podem causar crashes inesperados, o Zig força o desenvolvedor a considerar explicitamente a possibilidade de ausência de valor. 

O tipo `?T` indica que uma variável pode conter um valor do tipo `T` ou `null`, e o compilador exige que essa possibilidade seja tratada antes do uso do valor.

O [unwrapping seguro através de construções como `if (optional_value) |unwrapped|`](https://ziglang.org/documentation/master/#unwrapping-optionals) garante que o código só execute quando um valor válido estiver presente. Esta abordagem previne null pointer dereferences em tempo de compilação, eliminando uma fonte significativa de bugs em tempo de execução. 

> O operador [`orelse`](https://ziglang.org/documentation/master/#orelse) oferece uma alternativa concisa para fornecer valores padrão, enquanto o `try` pode ser usado com optionals que implementam error unions, permitindo propagação de "ausência" como um tipo específico de erro.

### Bounds Checking e Memory Safety

O Zig adota uma abordagem pragmática para [memory safety](https://ziglang.org/documentation/master/#memory-safety) que difere tanto de linguagens com garbage collection quanto de linguagens completamente unsafe. Por exemplo, o código abaixo, mostra como o Zig detecta acessos fora dos limites de um array:

```zig
fn boundsExample() !void {
    var array = [_]i32{1, 2, 3, 4, 5};
    
    // Em Debug: detecta acesso fora dos limites
    // Em Release: pode resultar em comportamento indefinido
    const index: usize = 10;
    const value = array[index]; // Panic em Debug se index >= array.len
    
    // Acesso seguro com verificação
    if (index < array.len) {
        const safe_value = array[index];
        std.debug.print("Value: {}\n", .{safe_value});
    }
}
```

 

O [bounds checking](https://ziglang.org/documentation/master/#bounds-checking) é ativo por padrão em builds de debug, detectando acessos inválidos a arrays e slices em tempo de execução. No entanto, em builds otimizados, essa verificação pode ser desabilitada para maximizar performance, transferindo a responsabilidade para o desenvolvedor.

> **Esta estratégia oferece um meio-termo interessante**: durante o desenvolvimento, erros de bounds são capturados automaticamente, facilitando a depuração. Em produção, o overhead das verificações pode ser removido quando necessário. 

Contudo, isso significa que bugs não detectados durante o desenvolvimento podem resultar em comportamento indefinido em builds release.

O sistema de gerenciamento de memória manual do [Zig](https://ziglang.org/documentation/master/#memory-safety) exige disciplina do programador. Diferente de Rust, que garante memory safety através do sistema de ownership em tempo de compilação, o Zig oferece ferramentas (como allocators explícitos e detecção de vazamentos em testes) mas não impõe restrições sintáticas rígidas. 

Isso resulta em maior flexibilidade e controle direto sobre alocações, mas também maior responsabilidade na prevenção de use-after-free e memory leaks.


## Infraestrutura de Testes

O compilador Zig não serve apenas para gerar binários: ele também inclui um sistema de testes integrado:

- **Declarações `test` embutidas no código** - permite que o compilador verifique se o código está correto.
- **Execução via `zig test`** - permite que o compilador execute os testes.
- **Suporte a *doctests*** - permite que o compilador verifique se o código está correto.
- **Filtros e skip de testes** - permite que o compilador ignore alguns testes.
- **Detecção automática de vazamentos de memória** - permite que o compilador detecte vazamentos de memória.

Por exemplo, vamos ver como isso funciona na prática:

```zig

test "test_add" {
    const result = add(1, 2);
    try expect(result == 3);
}

```

Agora vamos compilar o código e executar os testes:

```bash
zig test test_add.zig
```

O resultado será:

```bash
Running ./zig-cache/bin/test_add...
test "test_add" ... ok

Test [1/1] test_add... 1 passed, 0 failed.
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

Isso mostra que o Zig oferece uma infraestrutura moderna de testes como parte da própria linguagem.

## Limitações e Desafios Atuais

Embora o Zig apresente características promissoras, é importante reconhecer suas limitações atuais, com alguns pontos de contexto adicionais que confirmam a veracidade das limitações e trazem atualizações relevantes:

### Performance de Compilação

**Tempo de compilação em codebases extensas**: De fato, em projetos grandes, os tempos de compilação do Zig podem se tornar um gargalo significativo. 

O exemplo do runtime [Bun](https://bun.sh/) ([JavaScript runtime escrito em Zig](https://bun.sh/)) ilustra isso claramente: compilar toda a base de código do Bun (~850 mil linhas) leva em torno de 90 segundos em modo debug – isso por build completo, não havendo compilação incremental efetiva ainda. Em modo release otimizado, o tempo chega a vários minutos (aprox. 5 minutos) mesmo em hardware potente. 

Ou seja, pequenas mudanças exigem recompilar tudo, acumulando atrasos; um desenvolvedor do Bun mediu cerca de 45 minutos por dia só esperando o compilador. 

Essa lentidão ocorre porque atualmente o [Zig](https://ziglang.org/) recompila todo o projeto a cada build, já que a compilação incremental ainda não está totalmente implementada/estabilizada – há um modo incremental beta, mas com restrições (por exemplo, não suporta certos recursos como `usingnamespace`, utilizados centenas de vezes no Bun).

**Backend self-hosted em desenvolvimento ativo**: O backend self-hosted (isto é, o novo compilador do Zig escrito em Zig mesmo) ainda está em desenvolvimento e com performance variável. 

Até pouco tempo atrás, o novo compilador não superava drasticamente o antigo em velocidade – nos testes iniciais, era apenas ~7% mais rápido para compilar o próprio [Zig](https://ziglang.org/) que o compilador bootstrap em [C++](https://en.wikipedia.org/wiki/C%2B%2B). Em alguns cenários de depuração chegou-se a observar regressões de performance, indicando que o ganho dependia do caso de uso específico.

Isso vem mudando: em 2025 o projeto [Zig](https://ziglang.org/) efetivou melhorias significativas [no compilador self-hosted](https://github.com/ziglang/zig/tree/master/lib/self-hosted). Por exemplo, foi introduzido um backend nativo para [x86_64](https://en.wikipedia.org/wiki/X86-64) que substitui o backend [LLVM](https://llvm.org/) nas builds de debug em Linux/macOS, trazendo compilação paralela de código de máquina. 

O resultado foi uma grande redução no tempo de build em certos contextos – compilar o próprio compilador [Zig](https://ziglang.org/) (um projeto grande) caiu de ~75 segundos para cerca de 20 segundos com o novo backend ativado. Um simples "Hello World" em [Zig](https://ziglang.org/) também compilou ~70% mais rápido usando o backend nativo em vez do [LLVM](https://llvm.org/).

Essas melhorias mostram progresso, mas ainda não eliminam todos os gargalos: a geração de código para outros alvos (e.g. ARM/aarch64) continua em desenvolvimento, e etapas como linking podem se tornar o novo limite de velocidade. 

Além disso, a análise semântica do Zig (que é "lazy" e feita em tempo de compilação) ainda ocorre de forma single-threaded e envolve computação pesada devido ao recurso de `comptime`. 

Em projetos de alta complexidade estrutural, essa fase de análise/otimização pode saturar um núcleo de CPU, tornando a compilação demorada mesmo com otimizações no backend.

**Promessa de rapidez vs. realidade atual**: Um dos objetivos de design do Zig sempre foi proporcionar compilação rápida, mas na prática esse objetivo enfrentou desafios em projetos grandes. 

Isso contrasta com a expectativa inicial – por exemplo, a equipe da linguagem [Roc](https://roc-lang.org/) citou que "compilações em Rust são lentas; em Zig são rápidas" como um dos motivos para considerar migração para Zig. 

No entanto, desenvolvedores do [Bun](https://bun.sh/) relataram exatamente a experiência oposta: "Os tempos de compilação do Zig consistentemente foram uma espinha no meu sapato", disse um engenheiro, ressaltando que o ciclo de feedback ficou mais lento do que em Rust naquele contexto.

Em outras palavras, embora projetos pequenos/menos complexos em Zig de fato compilam depressa (graças a uma linguagem simples e otimizações como execução `comptime` e avaliador preguiçoso), em um projeto extenso os benefícios não se traduziram em builds rápidos ainda. 

> A boa notícia é que a comunidade Zig reconhece essas limitações e está trabalhando para corrigi-las – há esforços contínuos para compilação incremental verdadeira (com atualizações binárias em milissegundos) e para paralelizar ainda mais etapas como análise semântica no futuro.

### Ecossistema e Maturidade

**Comunidade menor e ecossistema de bibliotecas limitado**: Correto – o ecossistema do Zig ainda está em fase inicial de crescimento se comparado a linguagens estabelecidas. A comunidade de usuários é bem menor que a de C, C++ ou Rust. 

Para termos de comparação, estimativas de 2024 mostravam que o Rust era cerca de 25 vezes mais popular que o Zig (medido por enquetes e atividade online), evidenciando a diferença de adoção e base de desenvolvedores.

Consequentemente, a disponibilidade de bibliotecas de terceiros para Zig é limitada em relação a esses concorrentes. Muitas funcionalidades que em C++/Rust já contam com múltiplos pacotes maduros simplesmente não existem em Zig (ou estão em estágios experimentais). 

> Desenvolvedores chegaram a apontar que o Zig "praticamente não tem um ecossistema" robusto ainda, especialmente para aplicações de alto nível, ao passo que Rust possui crates bem estabelecidos para quase tudo que se precisa.

Na prática, isso significa que projetos Zig às vezes precisam "reinventar a roda" ou recorrer a integração com bibliotecas C para suprir certas necessidades. Outro reflexo da juventude da linguagem é a falta (até o momento) de um gerenciador oficial de pacotes. 

Até o início de 2025, o Zig não possui um package manager nativo – a funcionalidade está planejada para o futuro (provavelmente na 1.0), mas por ora os desenvolvedores dependem de soluções alternativas da comunidade para gerir dependências.

**Evolução da linguagem e quebras de compatibilidade (breaking changes)**: Está correta também a observação de que Zig, por ser pré-1.0, ainda passa por mudanças significativas que podem quebrar compatibilidade com versões anteriores. 

A linguagem não está estável ainda – nem o core nem a biblioteca padrão – e os mantenedores deixam claro que preferem aprimorar e até modificar designs agora, antes da versão 1.0, mesmo que isso traga breaking changes.

De fato, quase toda nova versão 0.x do Zig introduz ajustes na sintaxe ou nas APIs. Por exemplo, ocorreram mudanças recentes na sintaxe do loop `for` e no sistema de formatação `std.fmt` que exigiram refatoração de códigos existentes ao atualizar para novas versões. 

Desenvolvedores relatam que "coisas básicas que funcionavam deixam de compilar após um update" durante essa fase, o que pode ser frustrante em projetos de longo prazo.

No fórum Zig oficial, a equipe e usuários experientes reforçam que "nem a linguagem nem a std são estáveis… mais breaking changes virão", e que isso é esperado e aceitável enquanto Zig estiver em versão 0.x, já que o objetivo é chegar na 1.0 o mais consistente possível. 

> Em outras palavras, os desenvolvedores que adotam Zig hoje devem estar preparados para adaptar seu código de tempos em tempos conforme a linguagem evolui. A boa notícia é que, uma vez alcançada a 1.0 (ainda por vir, possivelmente nos próximos anos), espera-se que Zig adote semânticas estáveis com compatibilidade mantida, reduzindo drasticamente essas quebras.

### Recursos em Desenvolvimento

Algumas funcionalidades importantes ainda estão sendo implementadas ou redesenhadas. O suporte à programação assíncrona através de `async/await` foi temporariamente removido e está sendo completamente redesenhado para melhor integração com o modelo de execução do Zig.

O tooling de desenvolvimento, incluindo IDEs e ferramentas de análise estática, ainda está amadurecendo. Embora existam plugins para editores populares, a experiência de desenvolvimento pode não ser tão polida quanto em linguagens mais estabelecidas. 

Similarmente, o suporte a debuggers ainda está sendo aprimorado, o que pode impactar a produtividade durante o desenvolvimento e resolução de problemas.

---

# Rust ou Zig como substituto do C?

O C é uma linguagem de sistemas com mais de 60 anos de história, tendo influenciado o desenvolvimento de sistemas operacionais, compiladores e bancos de dados. Esse histórico estabeleceu o C como padrão de interoperabilidade e referência comum entre programadores. 

> Linguagens que propõem substituí-lo precisam considerar tanto aspectos técnicos quanto a compatibilidade com o extenso ecossistema de código legado e ferramentas existentes.

O **Rust** aborda essa substituição através de segurança de memória garantida em tempo de compilação. Seu [**borrow checker**](https://doc.rust-lang.org/reference/borrow-checker.html) previne erros comuns de memória em C, como [**use-after-free**](https://en.wikipedia.org/wiki/Use-after-free) ou [**data races**](https://en.wikipedia.org/wiki/Race_condition). Isso o torna adequado para aplicações críticas de segurança, como drivers e sistemas embarcados. 

O trade-off é uma maior complexidade sintática e conceitual. Rust introduz um paradigma diferente de desenvolvimento em baixo nível, exigindo investimento em treinamento e reescrita de código existente.

O **Zig** por sua vez, mantém o modelo mental do C, oferecendo controle manual da memória, interoperabilidade direta com código C e toolchain moderna para cross-compilation. Sua abordagem é evoluir o C incrementalmente: segurança opcional, sintaxe mais consistente, [**comptime**](https://ziglang.org/documentation/master/#comptime) para metaprogramação e eliminação de algumas armadilhas históricas da linguagem. 

Dito isso, na minha opinião, para desenvolvedores com experiência em [C](https://en.wikipedia.org/wiki/C_(programming_language)), [Zig](https://ziglang.org/) oferece uma migração mais gradual que [Rust](https://www.rust-lang.org/), preservando a filosofia de controle direto enquanto adiciona ferramentas modernas de produtividade.

**Minha análise**: A substituição completa do C é improvável no curto prazo devido ao seu legado extenso. Acredito que Rust se consolidará em domínios onde segurança é crítica, enquanto Zig pode emergir como sucessor natural do C em contextos que priorizam simplicidade e compatibilidade. 

Ambas as linguagens não substituem o C universalmente, mas oferecem caminhos para diferentes necessidades de desenvolvimento de sistemas.

---

## Comunidade

A [comunidade do Zig](https://ziglang.org/community/) ainda é pequena quando comparada a linguagens consolidadas como [C](https://en.wikipedia.org/wiki/C_(programming_language)), [C++](https://en.wikipedia.org/wiki/C%2B%2B) ou [Rust](https://www.rust-lang.org/). Isso se reflete na quantidade de bibliotecas e ferramentas disponíveis: há projetos relevantes em andamento, mas a cobertura não é tão ampla, o que obriga o desenvolvedor a recorrer com frequência à interoperabilidade com C para suprir lacunas. 

Por outro lado, a [comunidade do Zig](https://ziglang.org/community/) é bastante técnica e engajada, com foco em sistemas de baixo nível, compiladores e desenvolvimento de ferramentas.

O [ecossistema do Zig](https://ziglang.org/community/) ainda está amadurecendo. O gerenciador de pacotes é recente e a linguagem passa por mudanças que quebram compatibilidade em versões pré-1.0. Isso exige atenção a changelogs e certa disciplina em fixar versões para manter estabilidade em projetos de médio e longo prazo. 

A experiência em editores e IDEs também está em evolução: já existem suporte LSP e formatação automática, mas a integração não é tão polida quanto em linguagens mais maduras.

Em termos de governança, o desenvolvimento é orientado por decisões técnicas conservadoras, priorizando simplicidade e previsibilidade. A revisão de contribuições tende a ser exigente, o que garante consistência, mas pode tornar o processo de contribuição mais lento. 

Ainda assim, a [comunidade do Zig](https://ziglang.org/community/) costuma ser aberta a novos participantes, especialmente quando trazem exemplos claros, testes e preocupação com portabilidade.

De forma prática, o [Zig](https://ziglang.org/) já tem uma base comunitária suficiente para projetos sérios, principalmente em áreas como compilação cruzada, bindings para C e metaprogramação com `comptime`. 

Porém, para usos em larga escala ou em domínios que dependem de bibliotecas especializadas, é preciso considerar a dependência em código legado [C](https://en.wikipedia.org/wiki/C_(programming_language)) e a instabilidade típica de uma linguagem em estágio pré-1.0.

---

## Conclusão

Após explorar o [Zig](https://ziglang.org/) em detalhes, minha impressão é de uma linguagem que encontrou um ponto interessante entre pragmatismo e modernidade. A decisão de manter compatibilidade conceitual com [C](https://en.wikipedia.org/wiki/C_(programming_language)), ao invés de revolucionar completamente o modelo mental, me parece acertada para a adoção em sistemas existentes.

O que mais me chamou atenção foi a filosofia de "falha explícita" - não ter garbage collector ou features ocultas torna o comportamento previsível, algo crucial quando você está debuggando um driver ou otimizando um loop crítico. O `comptime` oferece metaprogramação sem a complexidade de macros tradicionais, permitindo abstrações que não sacrificam performance.

Na prática, testei o [Zig](https://ziglang.org/) em alguns cenários reais e a interoperabilidade com [C](https://en.wikipedia.org/wiki/C_(programming_language)) funcionou sem surpresas. Consegui integrar bibliotecas existentes sem [overhead de FFI](https://en.wikipedia.org/wiki/Foreign_function_interface), e o [cross-compilation](https://ziglang.org/documentation/master/#cross-compilation) realmente simplifica builds para diferentes arquiteturas - algo que sempre foi doloroso em [C](https://en.wikipedia.org/wiki/C_(programming_language)) puro.

> Devo admitir que me sinto muito mais confortável programando em [Zig](https://ziglang.org/) do que em [Rust](https://www.rust-lang.org/) quando preciso de uma abordagem próxima ao [C](https://en.wikipedia.org/wiki/C_(programming_language)). 

Onde [Rust](https://www.rust-lang.org/) me força a repensar completamente minha forma de gerenciar memória e ownership, [Zig](https://ziglang.org/) preserva o modelo mental familiar, apenas adicionando garantias e ferramentas modernas. Isso se traduz em uma curva de aprendizado muito mais suave para quem vem do [C](https://en.wikipedia.org/wiki/C_(programming_language)).

Para experimentação prática, desenvolvi este projeto: [https://github.com/scovl/zInputs](https://github.com/scovl/zInputs) - uma API de interceptação para dispositivos de entrada.

---

## Referências

* [Site oficial do Zig](https://ziglang.org/) - A linguagem de programação Zig
* [Documentação do Zig (master)](https://ziglang.org/documentation/master/) - Documentação do Zig
* [Zig no GitHub](https://github.com/ziglang/zig) - Zig no GitHub
* [Por que Zig se o mundo já tem C++, D e Rust?](https://ziglang.org/learn/why_zig_rust_d_cpp/) - Por que Zig se o mundo já tem C++, D e Rust?
* [Zig como compilador C/C++](https://ziglang.org/learn/overview/#zig-as-a-cc-compiler) - Zig como compilador C/C++
* [Manual de referência do LLVM](https://llvm.org/docs/LangRef.html) - Manual de referência do LLVM
* Artigo: *[LLVM – A Compilation Framework for Lifelong Program Analysis & Transformation](https://llvm.org/pubs/2004-CGO-LLVM.pdf)* (CGO 2004)
* *[The Rust Programming Language](https://doc.rust-lang.org/book/)* (2018) - Livro sobre o Rust
* *[The C Programming Language](https://www.amazon.com.br/Programming-Language-Brian-W-Kernighan/dp/0131103709)* (Kernighan & Ritchie, 1988)
* *[Computer Organization and Design](https://www.amazon.com.br/Computer-Organization-Design-MIPS-Architecture/dp/0123838720)* (Patterson & Hennessy, 2013)
* *[Compilers – Principles, Techniques, and Tools](https://www.amazon.com.br/Compilers-Principles-Techniques-Alfred-Aho/dp/0201101947)* (Aho, Sethi & Ullman, 2006)
