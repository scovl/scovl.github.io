+++
title = "Sobre"
description = "Vitor Lobo — desenvolvedor, open source, infraestrutura e compiladores"
date = 2025-07-28
weight = 1
+++

<section class="about-header">
  <img src="https://avatars.githubusercontent.com/u/1684061?v=4" alt="Vitor Lobo" class="about-avatar">
  <div class="about-intro">
    <h1>Vitor Lobo</h1>
    <p class="about-role">Engenheiro de Software · Open Source · DevOps/SRE</p>
    <p class="about-bio">
      Com mais de 15 anos construindo software, já passei por infraestrutura, engenharia de plataforma e SRE.
      Mas é no código que me encontro — construir soluções e entregar valor é o que me move.
      Comecei em 2009 nas comunidades open source do IRC e nunca parei.
    </p>
  </div>
</section>

<section class="projects-section">
  <div class="section-label">// projetos</div>
  <div class="projects-grid">
    <div class="project-card">
      <div class="project-lang">go</div>
      <h3>Ollanta</h3>
      <p>análise estática multi-linguagem</p>
      <a href="https://github.com/ollantacorp/Ollanta" target="_blank" rel="noopener">github →</a>
    </div>
    <div class="project-card">
      <div class="project-lang">go</div>
      <h3>GopherLab</h3>
      <p>laboratório de experimentos em Go</p>
      <a href="https://github.com/lobovit/gopherlab" target="_blank" rel="noopener">github →</a>
    </div>
    <div class="project-card">
      <div class="project-lang">c / rust</div>
      <h3>Checkrc</h3>
      <p>validador de configurações para FreeBSD</p>
      <a href="https://github.com/lobovit/checkrc" target="_blank" rel="noopener">github →</a>
    </div>
  </div>
</section>

<section class="contributions-section">
  <div class="section-label">// contribuições open source</div>
  <div class="contrib-list">
    <a href="https://github.com/SpectoLabs/hoverfly" class="contrib-item" target="_blank" rel="noopener">
      <span class="contrib-name">Hoverfly</span>
      <span class="contrib-desc">simulação e mock de APIs</span>
    </a>
    <a href="https://github.com/spf13/cobra" class="contrib-item" target="_blank" rel="noopener">
      <span class="contrib-name">Cobra</span>
      <span class="contrib-desc">biblioteca de CLI em Go</span>
    </a>
    <a href="https://github.com/elazarl/goproxy" class="contrib-item" target="_blank" rel="noopener">
      <span class="contrib-name">Go Proxy</span>
      <span class="contrib-desc">proxy HTTP/HTTPS em Go</span>
    </a>
    <a href="https://github.com/rochacbruno/marmite" class="contrib-item" target="_blank" rel="noopener">
      <span class="contrib-name">Marmite</span>
      <span class="contrib-desc">gerador de sites estáticos em Rust</span>
    </a>
    <a href="https://github.com/lobovit/java-kubernetes" class="contrib-item" target="_blank" rel="noopener">
      <span class="contrib-name">java-kubernetes</span>
      <span class="contrib-desc">clientes Java para Kubernetes</span>
    </a>
  </div>
</section>

<section class="about-footer">
  <p>Fora do código, gosto de escrever, estudar filosofia e literatura, e coleciono livros da editora DarkSide.</p>
  <a href="/cv.pdf" class="cv-link" target="_blank">Curriculum vitae (PDF) →</a>
</section>

<style>
  .about-header {
    padding: 5rem 2rem 3rem;
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
  }

  .about-avatar {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .about-intro h1 {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 0.3rem;
    letter-spacing: -0.5px;
  }

  .about-role {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    color: var(--accent);
    margin-bottom: 1rem;
  }

  .about-bio {
    font-size: 0.95rem;
    color: var(--text-secondary);
    line-height: 1.75;
    max-width: 600px;
  }

  .projects-section {
    padding: 2rem 2rem 3rem;
    max-width: 900px;
    margin: 0 auto;
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .project-card {
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    padding: 1.2rem;
    transition: all 0.2s ease;
  }

  .project-card:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
  }

  .project-lang {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    color: var(--accent);
    text-transform: lowercase;
    margin-bottom: 0.6rem;
    letter-spacing: 0.5px;
  }

  .project-card h3 {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 0.3rem;
  }

  .project-card p {
    font-size: 0.8rem;
    color: var(--text-muted);
    line-height: 1.5;
    margin-bottom: 0.8rem;
  }

  .project-card a {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.2s;
  }

  .project-card a:hover {
    color: var(--accent);
  }

  .contributions-section {
    padding: 2rem 2rem 3rem;
    max-width: 900px;
    margin: 0 auto;
  }

  .contrib-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
  }

  .contrib-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.9rem 1.2rem;
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .contrib-item:hover {
    border-color: var(--accent);
  }

  .contrib-name {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text);
    min-width: 100px;
  }

  .contrib-item:hover .contrib-name {
    color: var(--accent);
  }

  .contrib-desc {
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  .about-footer {
    padding: 3rem 2rem 5rem;
    max-width: 900px;
    margin: 0 auto;
    border-top: 1px solid var(--border-subtle);
  }

  .about-footer p {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-bottom: 1rem;
    line-height: 1.7;
  }

  .cv-link {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85rem;
    color: var(--accent);
    text-decoration: none;
    transition: color 0.2s;
  }

  .cv-link:hover {
    color: var(--accent-dim);
  }

  @media (max-width: 768px) {
    .about-header {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .about-bio {
      max-width: 100%;
    }

    .projects-grid {
      grid-template-columns: 1fr;
    }

    .contrib-list {
      grid-template-columns: 1fr;
    }
  }
</style>
