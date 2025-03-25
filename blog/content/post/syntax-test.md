---
title: "Teste de Syntax Highlighting"
date: 2024-03-24T20:00:00-03:00
draft: false
---

## Teste de Syntax Highlighting para Clojure

```clojure
(defproject docai "0.1.0-SNAPSHOT"
  :description "Um assistente RAG para consulta de documentação técnica"
  :url "http://example.com/FIXME"
  :license {:name "EPL-2.0 OR GPL-2.0-or-later WITH Classpath-exception-2.0"
            :url "https://www.eclipse.org/legal/epl-2.0/"}
  :dependencies [[org.clojure/clojure "1.11.1"]
                 [markdown-to-hiccup "0.6.2"]    ; Para processar Markdown
                 [hickory "0.7.1"]               ; Para processar HTML
                 [org.clojure/data.json "2.4.0"] ; Para JSON
                 [http-kit "2.6.0"]              ; Para requisições HTTP
                 [org.clojure/tools.logging "1.2.4"]  ; Para logging
                 [org.clojure/tools.namespace "1.4.4"] ; Para reloading
                 [org.clojure/core.async "1.6.681"] ; Para operações assíncronas
                 [org.clojure/core.memoize "1.0.257"] ; Para cache
                 [org.clojure/core.cache "1.0.225"]] ; Para cache
  :main ^:skip-aot docai.core
  :target-path "target/%s"
  :profiles {:uberjar {:aot :all
                       :jvm-opts ["-Dclojure.compiler.direct-linking=true"]}})
``` 