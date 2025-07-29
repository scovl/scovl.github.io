// ===== FUNCIONALIDADES PRINCIPAIS =====

console.log('main-minimal.js carregado com sucesso - v{{ now.Unix }}');

// ===== LIMPEZA E INICIALIZAÇÃO =====
function cleanupPage() {
    console.log('🧹 Iniciando limpeza da página...');
    
    // Remover elementos dinâmicos criados anteriormente
    const existingThemeToggle = document.querySelector('.theme-toggle');
    if (existingThemeToggle) {
        existingThemeToggle.remove();
        console.log('✅ Botão de tema removido');
    }
    
    // Limpar event listeners duplicados
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        backToTopButton.removeAttribute('data-initialized');
        console.log('✅ Atributos do botão back-to-top limpos');
    }
    
    // Forçar recarregamento de estilos
    const styleSheets = document.styleSheets;
    for (let i = 0; i < styleSheets.length; i++) {
        try {
            const rules = styleSheets[i].cssRules || styleSheets[i].rules;
            if (rules) {
                console.log(`📄 Estilos da folha ${i} carregados: ${rules.length} regras`);
            }
        } catch (e) {
            console.log(`⚠️ Erro ao acessar folha de estilo ${i}:`, e);
        }
    }
    
    console.log('✅ Limpeza da página concluída');
}

// ===== REINICIALIZAÇÃO FORÇADA =====
function forceReinitialize() {
    console.log('🔄 Forçando reinicialização completa...');
    
    // Limpar tudo
    cleanupPage();
    
    // Aguardar um pouco e reinicializar
    setTimeout(() => {
        console.log('🔄 Reinicializando funcionalidades...');
        
        // Reinicializar tudo
        initPrism();
        initMermaid();
        initSmoothScroll();
        initCodeCopy();
        initDarkMode();
        initBackToTop();
        
        console.log('✅ Reinicialização completa concluída');
    }, 200);
}

// ===== PRISM.JS =====
function initPrism() {
    try {
        if (typeof Prism !== 'undefined') {
            // Aguardar um pouco para garantir que o DOM está pronto
            setTimeout(() => {
                Prism.highlightAll();
                console.log('Prism.js inicializado com sucesso');
                console.log('Linguagens disponíveis:', Object.keys(Prism.languages));
                
                // Verificar se C++ está disponível
                if (Prism.languages.cpp) {
                    console.log('✅ C++ disponível');
                } else {
                    console.warn('❌ C++ não disponível');
                }
                
                // Verificar se Rust está disponível
                if (Prism.languages.rust) {
                    console.log('✅ Rust disponível');
                } else {
                    console.warn('❌ Rust não disponível');
                }
                
                // Verificar se Clojure está disponível
                if (Prism.languages.clojure) {
                    console.log('✅ Clojure disponível');
                } else {
                    console.warn('❌ Clojure não disponível');
                }
                
                // Verificar se Swift está disponível
                if (Prism.languages.swift) {
                    console.log('✅ Swift disponível');
                } else {
                    console.warn('❌ Swift não disponível');
                }
                
                // Verificar se Bash está disponível
                if (Prism.languages.bash) {
                    console.log('✅ Bash disponível');
                } else {
                    console.warn('❌ Bash não disponível');
                }
            }, 100);
        } else {
            console.warn('Prism.js não está disponível');
        }
    } catch (error) {
        console.warn('Erro ao inicializar Prism.js:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Inicializando página...');
    
    // Limpar elementos anteriores
    cleanupPage();
    
    // Inicializar Prism.js para syntax highlighting
    initPrism();
    
    // Inicializar Mermaid se disponível
    initMermaid();
    
    // Smooth scroll para links internos
    initSmoothScroll();
    
    // Adicionar funcionalidade de copiar código
    initCodeCopy();
    
    // Adicionar funcionalidade de tema escuro (opcional)
    initDarkMode();
    
    // Adicionar funcionalidade de back to top
    initBackToTop();
    
    // Inicializar funcionalidades modernas de UX/UI
    initToastSystem();
    initSkeletonLoading();
    
    console.log('✅ Inicialização da página concluída');
});

// ===== MERMAID =====
function initMermaid() {
    if (typeof mermaid !== 'undefined') {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            align: 'center',
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true
            },
            sequence: {
                useMaxWidth: true,
                diagramMarginX: 50,
                diagramMarginY: 10
            },
            gantt: {
                useMaxWidth: true
            }
        });
    }
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== COPIAR CÓDIGO =====
function initCodeCopy() {
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach(block => {
        // Criar botão de copiar
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '📋 Copiar';
        copyButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255, 255, 255, 0.1);
            color: #e2e8f0;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            z-index: 10;
        `;
        
        // Adicionar hover effect
        copyButton.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        
        copyButton.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        
        // Adicionar funcionalidade de copiar
        copyButton.addEventListener('click', function() {
            const code = block.querySelector('code') || block;
            const textToCopy = code.textContent;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Feedback visual com toast
                if (window.showToast) {
                    window.showToast('Código copiado para a área de transferência!', 'success', 'Sucesso', 3000);
                } else {
                    // Fallback para navegadores antigos
                    const originalText = this.innerHTML;
                    this.innerHTML = '✅ Copiado!';
                    this.style.background = 'rgba(34, 197, 94, 0.2)';
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.style.background = 'rgba(255, 255, 255, 0.1)';
                    }, 2000);
                }
            }).catch(err => {
                console.error('Erro ao copiar:', err);
                if (window.showToast) {
                    window.showToast('Erro ao copiar código', 'error', 'Erro', 3000);
                } else {
                    this.innerHTML = '❌ Erro';
                }
            });
        });
        
        // Adicionar botão ao bloco de código
        block.style.position = 'relative';
        block.appendChild(copyButton);
    });
}

// ===== TEMA ESCURO =====
function initDarkMode() {
    // Verificar se já existe um botão de tema
    const existingThemeToggle = document.querySelector('.theme-toggle');
    if (existingThemeToggle) {
        console.log('✅ Botão de tema já existe, pulando criação...');
        return;
    }
    
    // Criar botão de alternar tema (opcional)
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌙';
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    // Adicionar ao body
    document.body.appendChild(themeToggle);
    console.log('✅ Botão de tema criado');
    
    // Alternar tema
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            this.innerHTML = '☀️';
        } else {
            this.innerHTML = '🌙';
        }
    });
}

// ===== BACK TO TOP =====
function initBackToTop() {
    console.log('Iniciando funcionalidade "Voltar ao topo"...');
    
    // Aguardar um pouco para garantir que o DOM está completamente carregado
    setTimeout(() => {
        const backToTopButton = document.getElementById('back-to-top');
        
        if (!backToTopButton) {
            console.warn('❌ Botão "Voltar ao topo" não encontrado no DOM');
            return;
        }
        
        console.log('✅ Botão "Voltar ao topo" encontrado:', backToTopButton);
        
        // Verificar se já tem event listeners (evitar duplicação)
        if (backToTopButton.hasAttribute('data-initialized')) {
            console.log('✅ Botão já inicializado, pulando...');
            return;
        }
        
        // Marcar como inicializado
        backToTopButton.setAttribute('data-initialized', 'true');
        
        // Smooth scroll to top when button is clicked
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 Botão "Voltar ao topo" clicado - iniciando scroll...');
            
            try {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                console.log('✅ Scroll iniciado com sucesso');
            } catch (error) {
                console.error('❌ Erro ao fazer scroll:', error);
                // Fallback para navegadores que não suportam smooth scroll
                window.scrollTo(0, 0);
            }
        });
        
        // Adicionar também um listener para tecla Enter
        backToTopButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        console.log('✅ Funcionalidade "Voltar ao topo" inicializada com sucesso');
    }, 100);
}

// ===== EVENT LISTENERS ADICIONAIS =====

// Adicionar classe ativa ao link de navegação atual
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});

// ===== DETECÇÃO DE MUDANÇA DE PÁGINA =====
// Para navegação SPA ou mudanças dinâmicas
let currentUrl = window.location.href;

// Verificar mudanças de URL
function checkUrlChange() {
    if (currentUrl !== window.location.href) {
        console.log('🔄 URL mudou, limpando e reinicializando...');
        currentUrl = window.location.href;
        
        // Aguardar um pouco para o DOM atualizar
        setTimeout(() => {
            cleanupPage();
            
            // Reinicializar funcionalidades
            initPrism();
            initMermaid();
            initSmoothScroll();
            initCodeCopy();
            initDarkMode();
            initBackToTop();
            initToastSystem();
            initSkeletonLoading();
        }, 100);
    }
}

// Verificar mudanças a cada 100ms
setInterval(checkUrlChange, 100);

// Listener para mudanças de visibilidade da página
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        console.log('📄 Página voltou a ficar visível, verificando estado...');
        setTimeout(() => {
            cleanupPage();
            initBackToTop();
        }, 50);
    }
});

// ===== TOAST NOTIFICATIONS =====
function initToastSystem() {
    // Criar container de toast se não existir
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Função global para mostrar toast
    window.showToast = function(message, type = 'info', title = null, duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const toastHeader = document.createElement('div');
        toastHeader.className = 'toast-header';
        
        const toastTitle = document.createElement('div');
        toastTitle.className = 'toast-title';
        toastTitle.textContent = title || type.charAt(0).toUpperCase() + type.slice(1);
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = () => removeToast(toast);
        
        const toastMessage = document.createElement('div');
        toastMessage.className = 'toast-message';
        toastMessage.textContent = message;
        
        toastHeader.appendChild(toastTitle);
        toastHeader.appendChild(closeBtn);
        toast.appendChild(toastHeader);
        toast.appendChild(toastMessage);
        
        toastContainer.appendChild(toast);
        
        // Auto-remover após duração
        setTimeout(() => {
            removeToast(toast);
        }, duration);
        
        return toast;
    };
    
    function removeToast(toast) {
        toast.classList.add('removing');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
    
    console.log('✅ Sistema de toast inicializado');
}

// ===== SKELETON LOADING =====
function initSkeletonLoading() {
    // Função para mostrar skeleton
    window.showSkeleton = function(container, type = 'post') {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-container';
        
        if (type === 'post') {
            skeleton.innerHTML = `
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text" style="width: 60%;"></div>
            `;
        } else if (type === 'list') {
            skeleton.innerHTML = `
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-button" style="margin-top: 1rem;"></div>
            `;
        }
        
        container.appendChild(skeleton);
        return skeleton;
    };
    
    // Função para remover skeleton
    window.hideSkeleton = function(skeleton) {
        if (skeleton && skeleton.parentNode) {
            skeleton.parentNode.removeChild(skeleton);
        }
    };
    
    // Auto-skeleton para posts que estão carregando
    const posts = document.querySelectorAll('.post');
    posts.forEach(post => {
        if (post.querySelector('img')) {
            const images = post.querySelectorAll('img');
            images.forEach(img => {
                if (!img.complete) {
                    img.style.opacity = '0';
                    img.addEventListener('load', function() {
                        this.style.transition = 'opacity 0.3s ease';
                        this.style.opacity = '1';
                    });
                }
            });
        }
    });
    
    console.log('✅ Sistema de skeleton loading inicializado');
} 