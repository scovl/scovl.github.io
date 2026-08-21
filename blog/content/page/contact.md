---
---

<section class="contact-grid">
  <a href="mailto:lobocode@gmail.com" class="contact-card">
    <div class="contact-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
    </div>
    <div class="contact-info">
      <span class="contact-label">email</span>
      <span class="contact-value">lobocode@gmail.com</span>
    </div>
  </a>

  <a href="https://github.com/lobovit" class="contact-card" target="_blank" rel="noopener">
    <div class="contact-icon">
      <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
    </div>
    <div class="contact-info">
      <span class="contact-label">github</span>
      <span class="contact-value">github.com/lobovit</span>
    </div>
  </a>

  <a href="https://linkedin.com/in/vitor-lobo" class="contact-card" target="_blank" rel="noopener">
    <div class="contact-icon">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    </div>
    <div class="contact-info">
      <span class="contact-label">linkedin</span>
      <span class="contact-value">linkedin.com/in/vitor-lobo</span>
    </div>
  </a>

  <a href="https://hachyderm.io/@lobocode" class="contact-card" target="_blank" rel="noopener">
    <div class="contact-icon">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 00.023-.043v-1.809a.052.052 0 00-.02-.041.053.053 0 00-.046-.01 20.282 20.282 0 01-4.709.547c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 01-.319-1.433.053.053 0 01.066-.054 19.648 19.648 0 004.636.536c.562 0 1.124-.011 1.684-.034 1.857-.077 3.85-.24 5.696-.663 1.904-.447 3.637-1.284 4.88-2.638.56-.613.992-1.28 1.304-1.994a14.08 14.08 0 00.225-5.223c-.032-1.378-.144-2.74-.38-4.072z"/></svg>
    </div>
    <div class="contact-info">
      <span class="contact-label">mastodon</span>
      <span class="contact-value">@lobocode</span>
    </div>
  </a>
</section>

<style>
  .contact-grid {
    padding: 4rem 2rem 5rem;
    max-width: 900px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .contact-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.2rem 1.5rem;
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .contact-card:hover {
    border-color: var(--accent);
    background: var(--bg-card-hover);
    transform: translateY(-2px);
  }

  .contact-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-elevated);
    border-radius: 8px;
    color: var(--accent);
    flex-shrink: 0;
  }

  .contact-icon svg {
    width: 20px;
    height: 20px;
  }

  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    min-width: 0;
  }

  .contact-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .contact-value {
    font-size: 0.9rem;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .contact-card:hover .contact-value {
    color: var(--accent);
  }

  @media (max-width: 640px) {
    .contact-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
