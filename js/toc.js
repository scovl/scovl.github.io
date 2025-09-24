// ===== TABLE OF CONTENTS (TOC) FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function () {
  initTableOfContents();
});

function initTableOfContents() {
  const toc = document.getElementById('toc');
  if (!toc) {
    console.warn('TOC não encontrado na página');
    return;
  }

  const tocToggle = document.getElementById('toc-toggle');
  const tocMobileToggle = document.getElementById('toc-mobile-toggle');
  const tocContent = document.getElementById('toc-content');
  const tocProgressBar = document.getElementById('toc-progress-bar');
  const tocNav = toc.querySelector('.toc-nav');

  // ===== NOVO: construir TOC se estiver vazio (Org) =====
  // usa data-* do #toc quando disponíveis
  const startLevel = parseInt(toc.dataset.start || '2', 10);           // h2 padrão
  const endLevel   = parseInt(toc.dataset.end   || '4', 10);           // até h4
  const minHead    = parseInt(toc.dataset.min   || '2', 10);           // min headings
  const contentSel = toc.dataset.contentSelector || '.post-content, article, main';

  if (tocNav && !tocNav.querySelector('ul,ol,#TableOfContents')) {
    buildTocFromHeadings({ tocNav, startLevel, endLevel, minHead, contentSel, toc });
  }

  // (re)captura links após possível construção
  const tocNavLinks = toc.querySelectorAll('.toc-nav a');

  // Toggle desktop
  if (tocToggle && tocContent) {
    tocToggle.addEventListener('click', function () {
      const isExpanded = tocToggle.getAttribute('aria-expanded') === 'true';
      tocToggle.setAttribute('aria-expanded', String(!isExpanded));
      toc.classList.toggle('collapsed');
    });
  }

  // Toggle mobile
  if (tocMobileToggle) {
    tocMobileToggle.addEventListener('click', function () {
      toc.classList.toggle('show-mobile');
      const isVisible = toc.classList.contains('show-mobile');
      tocMobileToggle.setAttribute('aria-label', isVisible ? 'Ocultar Sumário' : 'Mostrar Sumário');
    });
  }

  // Smooth scroll
  tocNavLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href') || '';
      if (!href.startsWith('#')) return; // links externos passam direto
      e.preventDefault();

      const targetElement = document.getElementById(decodeURIComponent(href.slice(1)));
      if (targetElement) {
        const headerHeight = getHeaderHeight();
        const elementPosition = targetElement.offsetTop - headerHeight - 20;
        window.scrollTo({ top: elementPosition, behavior: 'smooth' });

        if (window.innerWidth <= 1200) {
          toc.classList.remove('show-mobile');
          if (tocMobileToggle) tocMobileToggle.setAttribute('aria-label', 'Mostrar Sumário');
        }
      }
    });
  });

  // Scroll spy + progresso
  if (tocNavLinks.length > 0) {
    initTocScrollSpy(tocNavLinks, tocProgressBar);
  }

  // Fechar TOC mobile ao clicar fora
  document.addEventListener('click', function (e) {
    if (
      window.innerWidth <= 1200 &&
      toc.classList.contains('show-mobile') &&
      !toc.contains(e.target) &&
      !tocMobileToggle?.contains(e.target)
    ) {
      toc.classList.remove('show-mobile');
      tocMobileToggle?.setAttribute('aria-label', 'Mostrar Sumário');
    }
  });

  // Atalhos
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && window.innerWidth <= 1200 && toc.classList.contains('show-mobile')) {
      toc.classList.remove('show-mobile');
      tocMobileToggle?.setAttribute('aria-label', 'Mostrar Sumário');
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T' && window.innerWidth > 1200) {
      e.preventDefault();
      tocToggle?.click();
    }
  });

  // Ocultar TOC em páginas muito curtas (desktop)
  const postContent = document.querySelector('.post-content');
  if (postContent && postContent.scrollHeight < window.innerHeight * 2) {
    hideOnShortContent();
  }

  showTocWhenNeeded();
}

/** Constrói o TOC a partir de headings reais (fallback para Org). */
function buildTocFromHeadings({ tocNav, startLevel, endLevel, minHead, contentSel, toc }) {
  const container =
    document.querySelector(contentSel) ||
    document.querySelector('.post-content') ||
    document.querySelector('article') ||
    document.querySelector('main') ||
    document;

  // Seleciona h{start}..h{end}
  const selectors = [];
  for (let l = startLevel; l <= endLevel; l++) selectors.push('h' + l);
  const headings = Array.from(container.querySelectorAll(selectors.join(',')));

  if (headings.length < minHead) {
    toc.style.display = 'none';
    return;
  }

  // Gera IDs previsíveis quando faltarem
  const slug = s =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s\-_.]/g, '')
      .trim()
      .replace(/\s+/g, '-');

  headings.forEach(h => {
    if (!h.id || document.getElementById(h.id) !== h) {
      let id = slug(h.textContent);
      // Evita duplicatas
      let k = 2;
      while (id && document.getElementById(id)) id = `${slug(h.textContent)}-${k++}`;
      if (!id) id = 'sec-' + Math.random().toString(36).slice(2, 8);
      h.id = id;
    }
  });

  // Monta lista aninhada
  const root = document.createElement('ul');
  let stack = [root];
  let lastLevel = startLevel;

  headings.forEach(h => {
    const lvl = parseInt(h.tagName[1], 10);
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${h.id}`;
    a.textContent = h.textContent;
    li.appendChild(a);

    if (lvl > lastLevel) {
      const ul = document.createElement('ul');
      stack[stack.length - 1].lastElementChild?.appendChild(ul);
      stack.push(ul);
    } else if (lvl < lastLevel) {
      while (lvl < startLevel + stack.length - 1) stack.pop();
    }
    stack[stack.length - 1].appendChild(li);
    lastLevel = lvl;
  });

  tocNav.innerHTML = '';
  tocNav.appendChild(root);
}

function initTocScrollSpy(tocNavLinks, progressBar) {
  const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).filter(h => h.id);
  if (headings.length === 0) return;

  const observerOptions = { rootMargin: '-20% 0px -35% 0px', threshold: 0 };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector(`.toc-nav a[href="#${CSS.escape(id)}"]`);
      if (entry.isIntersecting) {
        tocNavLinks.forEach(l => l.classList.remove('active'));
        if (link) {
          link.classList.add('active');
          scrollTocIntoView(link);
        }
        updateProgressBar(entry.target, headings, progressBar);
      }
    });
  }, observerOptions);

  headings.forEach(h => observer.observe(h));

  let ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateProgressBarOnScroll(headings, progressBar);
        ticking = false;
      });
      ticking = true;
    }
  });
}

function updateProgressBar(activeHeading, allHeadings, progressBar) {
  if (!progressBar || allHeadings.length === 0) return;
  const idx = allHeadings.indexOf(activeHeading);
  const pct = ((idx + 1) / allHeadings.length) * 100;
  progressBar.style.width = `${Math.min(pct, 100)}%`;
}

function updateProgressBarOnScroll(headings, progressBar) {
  if (!progressBar || headings.length === 0) return;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = Math.min((scrollTop / (docHeight || 1)) * 100, 100);
  progressBar.style.width = `${pct}%`;
}

function scrollTocIntoView(activeLink) {
  const tocNav = document.querySelector('.toc-nav');
  if (!tocNav || !activeLink) return;
  const linkRect = activeLink.getBoundingClientRect();
  const tocRect = tocNav.getBoundingClientRect();
  if (linkRect.top < tocRect.top || linkRect.bottom > tocRect.bottom) {
    activeLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function getHeaderHeight() {
  const header = document.querySelector('header, .header');
  return header ? header.offsetHeight : 0;
}

function hideOnShortContent() {
  const toc = document.getElementById('toc');
  if (!toc) return;
  if (window.innerWidth <= 1200) return;
  toc.classList.add('collapsed');
  const tocToggle = document.getElementById('toc-toggle');
  tocToggle?.setAttribute('aria-expanded', 'false');
}

function showTocWhenNeeded() {
  const tocNavLinks = document.querySelectorAll('.toc-nav a');
  const toc = document.getElementById('toc');
  if (tocNavLinks.length < 2 && toc) {
    toc.style.display = 'none';
  }
}

// Utils
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
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

window.addEventListener(
  'resize',
  debounce(function () {
    const toc = document.getElementById('toc');
    const tocMobileToggle = document.getElementById('toc-mobile-toggle');
    if (toc && tocMobileToggle && window.innerWidth > 1200) {
      toc.classList.remove('show-mobile');
      tocMobileToggle.setAttribute('aria-label', 'Mostrar Sumário');
    }
  }, 250)
);

// Export global helpers
if (typeof window !== 'undefined') {
  window.TocUtils = {
    scrollToHeading(headingId) {
      const el = document.getElementById(headingId);
      if (el) {
        const headerHeight = getHeaderHeight();
        const y = el.offsetTop - headerHeight - 20;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    },
    toggleToc() {
      document.getElementById('toc-toggle')?.click();
    }
  };
}
