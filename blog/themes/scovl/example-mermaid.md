---
title: "Exemplo de Diagramas Mermaid Centralizados"
date: 2024-01-15
description: "Demonstração dos diagramas Mermaid centralizados"
tags: ["mermaid", "diagramas", "exemplo"]
author: "Scovl"
---

# Exemplo de Diagramas Mermaid Centralizados

Este post demonstra como usar diagramas Mermaid centralizados no tema Scovl.

## 📊 Fluxograma Simples

{{< mermaid theme="default" align="center" >}}
graph TD
    A[Início] --> B{Decisão}
    B -->|Sim| C[Processo]
    B -->|Não| D[Fim]
    C --> D
    style A fill:#e1f5fe
    style D fill:#ffebee
{{< /mermaid >}}

## 🔄 Diagrama de Sequência

{{< mermaid >}}
sequenceDiagram
    participant U as Usuário
    participant S as Sistema
    participant D as Banco de Dados
    
    U->>S: Login
    S->>D: Verificar credenciais
    D->>S: Retornar resultado
    S->>U: Resposta de login
{{< /mermaid >}}

## 🏗️ Diagrama de Classes

{{< mermaid theme="default" >}}
classDiagram
    class Usuario {
        +String nome
        +String email
        +login()
        +logout()
    }
    
    class Sistema {
        +String versao
        +autenticar()
        +processar()
    }
    
    Usuario --> Sistema : usa
{{< /mermaid >}}

## 📈 Gráfico de Gantt

{{< mermaid >}}
gantt
    title Cronograma do Projeto
    dateFormat  YYYY-MM-DD
    section Fase 1
    Planejamento    :done,    p1, 2024-01-01, 2024-01-15
    Design          :active,  p2, 2024-01-16, 2024-01-30
    section Fase 2
    Desenvolvimento :         p3, 2024-02-01, 2024-03-01
    Testes          :         p4, 2024-03-02, 2024-03-15
{{< /mermaid >}}

## 🎯 Diagrama de Estado

{{< mermaid theme="default" >}}
stateDiagram-v2
    [*] --> Aguardando
    Aguardando --> Processando : Iniciar
    Processando --> Concluído : Finalizar
    Processando --> Aguardando : Cancelar
    Concluído --> [*]
{{< /mermaid >}}

## 📋 Lista de Tarefas

{{< mermaid >}}
graph LR
    A[📝 Tarefa 1] --> B[✅ Concluída]
    C[📝 Tarefa 2] --> D[⏳ Em andamento]
    E[📝 Tarefa 3] --> F[⏸️ Pausada]
    
    style A fill:#e3f2fd
    style B fill:#e8f5e8
    style D fill:#fff3e0
    style F fill:#ffebee
{{< /mermaid >}}

## 🎨 Personalização

Você pode personalizar os diagramas usando parâmetros:

- **theme**: "default", "dark", "forest", etc.
- **align**: "center", "left", "right"

### Exemplo com tema escuro:

{{< mermaid theme="dark" align="center" >}}
graph TD
    A[Início] --> B[Processo]
    B --> C[Fim]
    style A fill:#4caf50
    style C fill:#f44336
{{< /mermaid >}}

---

*Todos os diagramas são automaticamente centralizados e responsivos!* 