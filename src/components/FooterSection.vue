<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <img src="/logo.svg" alt="Eventshoot.nl" class="footer__logo" onerror="this.style.display='none';this.nextElementSibling.style.display='block'" />
        <span class="footer__logo-text" style="display:none">Eventshoot.nl</span>
        <p class="footer__tagline">Professionele eventfotografie<br>door heel Nederland.</p>
      </div>

      <nav class="footer__nav">
        <a href="/over-rolf">Over Rolf</a>
        <a href="/privacy">Privacy & Disclaimer</a>
        <a href="https://eventshoot.nl/wp-content/uploads/2026/03/algemene_voorwaarden_event_shoot.pdf" target="_blank" rel="noopener">Algemene voorwaarden</a>
        <a href="https://eventshoot.nl/wp-content/uploads/2026/04/Eventshoot_onepager_tarieven.pdf" target="_blank" rel="noopener">Tariefenoverzicht (PDF)</a>
        <a href="https://www.linkedin.com/company/eventshoot" target="_blank" rel="noopener">LinkedIn</a>
      </nav>
    </div>

    <div class="footer__bottom">
      <div class="container">
        <p>© Eventshoot.nl BV – {{ new Date().getFullYear() }}</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--color-border);
  background-color: var(--color-bg-section);
  padding-top: 3rem;
}

.footer__inner {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 3rem;
  flex-wrap: wrap;
  padding-bottom: 3rem;
}

.footer__logo {
  height: 32px;
  width: auto;
  margin-bottom: 1rem;
}

.footer__logo-text {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
  display: block;
  margin-bottom: 1rem;
}

.footer__tagline {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.footer__nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer__nav a {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  transition: color var(--transition);
}

.footer__nav a:hover {
  color: var(--color-text);
}

.footer__bottom {
  border-top: 1px solid var(--color-border);
  padding: 1rem 0;
}

.footer__bottom p {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}
</style>
