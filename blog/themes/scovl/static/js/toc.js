// ===== TABLE OF CONTENTS (TOC) FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    initTableOfContents();
});

function initTableOfContents() {
    const toc = document.getElementById('toc');
    if (!toc) return;

    const tocToggle = document.getElementById('toc-toggle');
    const tocMobileToggle = document.getElementById('toc-mobile-toggle');
    const tocContent = document.getElementById('toc-content');
    const tocProgressBar = document.getElementById('toc-progress-bar');
    const tocNavLinks = toc.querySelectorAll('.toc-nav a');

    // Configurar comportamento de toggle desktop
    if (tocToggle && tocContent) {
        tocToggle.addEventListener('click', function() {
            const isExpanded = tocToggle.getAttribute('aria-expanded') === 'true';
            tocToggle.setAttribute('aria-expanded', !isExpanded);
            toc.classList.toggle('collapsed');
        });
    }

    // Configurar comportamento de toggle mobile
    if (tocMobileToggle) {
        tocMobileToggle.addEventListener('click', function() {
            toc.classList.toggle('show-mobile');
            
            // Atualizar aria-label baseado no estado
            const isVisible = toc.classList.contains('show-mobile');
            tocMobileToggle.setAttribute('aria-label', 
                isVisible ? 'Ocultar Sumário' : 'Mostrar Sumário'
            );
        });
    }

    // Configurar scroll smooth para links do TOC
    tocNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calcular offset para compensar header fixo (se houver)
                const headerHeight = getHeaderHeight();
                const elementPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });

                // Fechar TOC mobile após navegação
                if (window.innerWidth <= 1200) {
                    toc.classList.remove('show-mobile');
                    tocMobileToggle.setAttribute('aria-label', 'Mostrar Sumário');
                }
            }
        });
    });

    // Configurar highlighting automático dos links baseado na posição de scroll
    if (tocNavLinks.length > 0) {
        initTocScrollSpy(tocNavLinks, tocProgressBar);
    }

    // Configurar fechamento do TOC mobile ao clicar fora
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1200 && 
            toc.classList.contains('show-mobile') &&
            !toc.contains(e.target) && 
            !tocMobileToggle.contains(e.target)) {
            toc.classList.remove('show-mobile');
            tocMobileToggle.setAttribute('aria-label', 'Mostrar Sumário');
        }
    });

    // Configurar teclas de atalho
    document.addEventListener('keydown', function(e) {
        // ESC para fechar TOC mobile
        if (e.key === 'Escape' && window.innerWidth <= 1200 && toc.classList.contains('show-mobile')) {
            toc.classList.remove('show-mobile');
            tocMobileToggle.setAttribute('aria-label', 'Mostrar Sumário');
        }
        
        // Ctrl/Cmd + Shift + T para toggle do TOC desktop
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T' && window.innerWidth > 1200) {
            e.preventDefault();
            tocToggle.click();
        }
    });

    // Ocultar TOC automaticamente em telas pequenas se não houver conteúdo suficiente
    const postContent = document.querySelector('.post-content');
    if (postContent && postContent.scrollHeight < window.innerHeight * 2) {
        hideOnShortContent();
    }

    // Mostrar TOC apenas quando necessário
    showTocWhenNeeded();
}

function initTocScrollSpy(tocNavLinks, progressBar) {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
        .filter(heading => heading.id);

    if (headings.length === 0) return;

    const observerOptions = {
        rootMargin: '-20% 0px -35% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            const link = document.querySelector(`.toc-nav a[href="#${id}"]`);
            
            if (entry.isIntersecting) {
                // Remove active class de todos os links
                tocNavLinks.forEach(l => l.classList.remove('active'));
                
                // Adiciona active class ao link atual
                if (link) {
                    link.classList.add('active');
                    
                    // Garantir que o link ativo esteja visível no scroll do TOC
                    scrollTocIntoView(link);
                }
                
                // Atualizar barra de progresso
                updateProgressBar(entry.target, headings, progressBar);
            }
        });
    }, observerOptions);

    headings.forEach(heading => observer.observe(heading));

    // Fallback para scroll manual
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateProgressBarOnScroll(headings, progressBar);
                ticking = false;
            });
            ticking = true;
        }
    });
}

function updateProgressBar(activeHeading, allHeadings, progressBar) {
    if (!progressBar || allHeadings.length === 0) return;

    const activeIndex = allHeadings.indexOf(activeHeading);
    const progress = (activeIndex + 1) / allHeadings.length * 100;
    
    progressBar.style.width = `${Math.min(progress, 100)}%`;
}

function updateProgressBarOnScroll(headings, progressBar) {
    if (!progressBar || headings.length === 0) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = Math.min(scrollTop / documentHeight * 100, 100);
    
    progressBar.style.width = `${scrollProgress}%`;
}

function scrollTocIntoView(activeLink) {
    const tocNav = document.querySelector('.toc-nav');
    if (!tocNav || !activeLink) return;

    const linkRect = activeLink.getBoundingClientRect();
    const tocRect = tocNav.getBoundingClientRect();
    
    // Verificar se o link está fora da área visível
    if (linkRect.top < tocRect.top || linkRect.bottom > tocRect.bottom) {
        activeLink.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

function getHeaderHeight() {
    const header = document.querySelector('header');
    return header ? header.offsetHeight : 0;
}

function hideOnShortContent() {
    const toc = document.getElementById('toc');
    if (!toc) return;

    // Em dispositivos móveis, sempre mostrar o toggle
    if (window.innerWidth <= 1200) return;

    // Se o conteúdo for muito curto, ocultar o TOC inicialmente
    toc.classList.add('collapsed');
    const tocToggle = document.getElementById('toc-toggle');
    if (tocToggle) {
        tocToggle.setAttribute('aria-expanded', 'false');
    }
}

function showTocWhenNeeded() {
    const tocNavLinks = document.querySelectorAll('.toc-nav a');
    const toc = document.getElementById('toc');
    
    // Só mostrar TOC se houver pelo menos 2 headings
    if (tocNavLinks.length < 2 && toc) {
        toc.style.display = 'none';
    }
}

// Utilitários para melhorar a performance
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

// Configurar redimensionamento da janela
window.addEventListener('resize', debounce(function() {
    const toc = document.getElementById('toc');
    const tocMobileToggle = document.getElementById('toc-mobile-toggle');
    
    if (toc && tocMobileToggle) {
        // Resetar estado mobile quando mudar para desktop
        if (window.innerWidth > 1200) {
            toc.classList.remove('show-mobile');
            tocMobileToggle.setAttribute('aria-label', 'Mostrar Sumário');
        }
    }
}, 250));

// Exportar funções para uso global se necessário
if (typeof window !== 'undefined') {
    window.TocUtils = {
        scrollToHeading: function(headingId) {
            const element = document.getElementById(headingId);
            if (element) {
                const headerHeight = getHeaderHeight();
                const elementPosition = element.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
            }
        },
        
        toggleToc: function() {
            const tocToggle = document.getElementById('toc-toggle');
            if (tocToggle) {
                tocToggle.click();
            }
        }
    };
}