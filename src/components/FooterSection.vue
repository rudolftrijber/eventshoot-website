<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">

      <!-- Kolom 1: Brand + contact -->
      <div class="footer__col footer__col--brand">
        <a href="/" class="footer__logo-link" aria-label="Eventshoot.nl">
          <img
            src="/images/logos/logo.svg"
            alt="Eventshoot.nl"
            class="footer__logo"
            onerror="this.style.display='none';this.nextElementSibling.style.display='block'"
          />
          <span class="footer__logo-text" style="display: none">Eventshoot.nl</span>
        </a>
        <p class="footer__motto">{{ t('footer.motto') }}</p>
        <div class="footer__contact">
          <a href="tel:+31625177728" class="footer__contact-link">06 251 777 28</a>
          <a href="mailto:rolf@eventshoot.nl" class="footer__contact-link">rolf@eventshoot.nl</a>
          <a href="https://www.linkedin.com/in/rolftrijber/" target="_blank" rel="noopener" class="footer__contact-link">LinkedIn</a>
        </div>
      </div>

      <!-- Kolom 2: Pagina's -->
      <div class="footer__col">
        <h4 class="footer__col-heading">{{ t('footer.pages') }}</h4>
        <nav class="footer__nav">
          <a href="/eventfotografie">Eventfotografie</a>
          <a href="/eventvideo">Eventvideo</a>
          <a href="/werk">Werk</a>
          <a href="/tarieven">Tarieven</a>
          <a href="/over-rolf">Over Rolf</a>
          <a href="/kennismaken">Kennismaken</a>
        </nav>
      </div>

      <!-- Kolom 3: Voor wie -->
      <div class="footer__col">
        <h4 class="footer__col-heading">{{ t('footer.forWho') }}</h4>
        <nav class="footer__nav">
          <a href="/voor/brancheverenigingen">Brancheverenigingen</a>
          <a href="/voor/eventbureaus">Eventbureaus &amp; DMC's</a>
          <a href="/voor/hotels">Hotels</a>
          <a href="/voor/bedrijven">Bedrijven</a>
        </nav>
      </div>

      <!-- Kolom 4: Eventkennis -->
      <div class="footer__col">
        <h4 class="footer__col-heading">{{ t('footer.knowledge') }}</h4>
        <nav class="footer__nav">
          <a href="/eventkennis">Alle artikelen</a>
          <a href="/eventkennis">Eventfotografie tips</a>
          <a href="/eventkennis">Aftermovie laten maken</a>
          <a href="/eventkennis">Content na je event</a>
        </nav>
      </div>

    </div>

    <div class="footer__bottom">
      <p>
        &copy; Eventshoot.nl BV &ndash; {{ new Date().getFullYear() }}
        &nbsp;&middot;&nbsp;
        <a href="/privacy">Privacy &amp; Disclaimer</a>
        &nbsp;&middot;&nbsp;
        <a href="https://eventshoot.nl/wp-content/uploads/2026/03/algemene_voorwaarden_event_shoot.pdf" target="_blank" rel="noopener">Algemene voorwaarden</a>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 4rem 0 0;
}

.footer__inner {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
  gap: 3rem;
  padding-bottom: 4rem;
  align-items: start;
}

.footer__col--brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 1rem;
}

.footer__logo-link {
  display: block;
  align-self: flex-start;
  margin: 0;
  padding: 0;
  line-height: 0;
}

.footer__logo {
  display: block;
  height: 60px;
  width: auto;
  max-width: 100%;
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  box-shadow: none;
}

.footer__logo-text {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
}

.footer__motto {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.5;
  font-style: italic;
  margin: 0;
  max-width: 22rem;
  text-align: left;
}

.footer__contact {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4rem;
  width: 100%;
}

.footer__contact-link {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.65);
  transition: color var(--transition);
  text-decoration: none;
}

.footer__contact-link:hover {
  color: var(--color-accent);
}

.footer__col-heading {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.footer__nav {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.footer__nav a {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  transition: color var(--transition);
  text-decoration: none;
}

.footer__nav a:hover {
  color: var(--color-accent);
}

.footer__bottom {
  background: rgba(0, 0, 0, 0.30);
  border: none;
  box-shadow: none;
  padding: 0.75rem 1rem;
  text-align: center;
}

.footer__bottom p {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
}

.footer__bottom a {
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  transition: color var(--transition);
}

.footer__bottom a:hover {
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 1024px) {
  .footer__inner {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .footer__inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
