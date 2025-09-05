// ===== FUNCIONALIDADES PRINCIPAIS =====

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar Prism.js para syntax highlighting (com tratamento de erro)
    try {
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    } catch (error) {
        console.warn('Prism.js não carregou corretamente:', error);
    }
    
    // Smooth scroll para links internos
    initSmoothScroll();
    
    // Adicionar funcionalidade de copiar código
    initCodeCopy();
    
    // Adicionar funcionalidade de tema escuro (opcional)
    initDarkMode();
    
    // Adicionar funcionalidade de back to top
    initBackToTop();
    
    // Adicionar animações de scroll (desabilitado temporariamente para evitar problemas)
    // if (!document.querySelector('.post')) {
    //     initScrollAnimations();
    // }
});

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
                // Feedback visual
                const originalText = this.innerHTML;
                this.innerHTML = '✅ Copiado!';
                this.style.background = 'rgba(34, 197, 94, 0.2)';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.background = 'rgba(255, 255, 255, 0.1)';
                }, 2000);
            }).catch(err => {
                console.error('Erro ao copiar:', err);
                this.innerHTML = '❌ Erro';
            });
        });
        
        // Adicionar botão ao bloco de código
        block.style.position = 'relative';
        block.appendChild(copyButton);
    });
}

// ===== TEMA ESCURO =====
function initDarkMode() {
    // Verificar se o usuário prefere tema escuro
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
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
    const backToTopButton = document.getElementById('back-to-top');
    
    if (!backToTopButton) {
        return;
    }
    
    // Smooth scroll to top when button is clicked
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Optional: Show/hide button based on scroll position
    // Uncomment the following code if you want the button to only appear when scrolling down
    /*
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.pointerEvents = 'auto';
        } else {
            backToTopButton.style.opacity = '0.7';
            backToTopButton.style.pointerEvents = 'none';
        }
    });
    */
}

// ===== ANIMAÇÕES DE SCROLL =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar apenas elementos específicos para animação (não todos os posts)
    const animatedElements = document.querySelectorAll('.post-header, .post-content h1, .post-content h2, .post-content h3');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== UTILITÁRIOS =====

// Função para debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Função para throttle
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
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

// Adicionar funcionalidade de busca (se implementada)
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            const query = e.target.value.toLowerCase();
            const posts = document.querySelectorAll('.post-item');
            
            posts.forEach(post => {
                const title = post.querySelector('.post-item-title').textContent.toLowerCase();
                const excerpt = post.querySelector('.post-item-excerpt')?.textContent.toLowerCase() || '';
                
                if (title.includes(query) || excerpt.includes(query)) {
                    post.style.display = 'block';
                } else {
                    post.style.display = 'none';
                }
            });
        }, 300));
    }
}

// Inicializar busca se existir
document.addEventListener('DOMContentLoaded', initSearch); 