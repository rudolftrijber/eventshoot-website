<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

const showEventkennis = computed(() => !locale.value.startsWith('en'))

const termsUrl = computed(() =>
  locale.value === 'en'
    ? '/DATA_EVENTSHOOT/FILES/general_terms_eventshoot.pdf'
    : '/DATA_EVENTSHOOT/FILES/algemene_voorwaarden_eventshoot.pdf'
)

const pagesLinks = computed(() => [
  { to: '/eventfotografie', label: t('nav.photography') },
  { to: '/eventvideo', label: t('nav.video') },
  { to: '/werk', label: t('nav.work') },
  { to: '/tarieven', label: t('nav.pricing') },
  { to: '/over-rolf', label: t('nav.aboutRolf') },
  { to: '/kennismaken', label: t('nav.contact') },
])

const forWhoLinks = computed(() => [
  { to: '/voor/brancheverenigingen', label: t('footer.linkAssociations') },
  { to: '/voor/eventbureaus', label: t('footer.linkAgencies') },
  { to: '/voor/hotels', label: t('footer.linkHotels') },
  { to: '/voor/bedrijven', label: t('footer.linkCompanies') },
])

const knowledgeLinks = computed(() => [
  { to: '/eventkennis', label: t('footer.linkAllArticles') },
  { to: '/eventkennis', label: t('footer.linkPhotoTips') },
  { to: '/eventkennis', label: t('footer.linkAftermovie') },
  { to: '/eventkennis', label: t('footer.linkContent') },
])
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner" :class="{ 'footer__inner--no-knowledge': !showEventkennis }">

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
          <a href="tel:+31625177728" class="footer__contact-link">{{ t('belRolf.phoneDisplay') }}</a>
          <a href="mailto:rolf@eventshoot.nl" class="footer__contact-link">rolf@eventshoot.nl</a>
          <a href="https://www.linkedin.com/in/rolftrijber/" target="_blank" rel="noopener" class="footer__contact-link">LinkedIn</a>
        </div>
      </div>

      <!-- Kolom 2: Pagina's -->
      <div class="footer__col">
        <h4 class="footer__col-heading">{{ t('footer.pages') }}</h4>
        <nav class="footer__nav">
          <a v-for="link in pagesLinks" :key="link.to + link.label" :href="link.to">{{ link.label }}</a>
        </nav>
      </div>

      <!-- Kolom 3: Voor wie -->
      <div class="footer__col">
        <h4 class="footer__col-heading">{{ t('footer.forWho') }}</h4>
        <nav class="footer__nav">
          <a v-for="link in forWhoLinks" :key="link.to" :href="link.to">{{ link.label }}</a>
        </nav>
      </div>

      <!-- Kolom 4: Eventkennis (alleen NL) -->
      <div v-if="showEventkennis" class="footer__col">
        <h4 class="footer__col-heading">{{ t('footer.knowledge') }}</h4>
        <nav class="footer__nav">
          <a v-for="link in knowledgeLinks" :key="link.label" :href="link.to">{{ link.label }}</a>
        </nav>
      </div>

    </div>

    <div class="footer__bottom">
      <p>
        &copy; Eventshoot.nl BV &ndash; {{ new Date().getFullYear() }}
        &nbsp;&middot;&nbsp;
        <a href="/privacy">{{ t('footer.privacy') }}</a>
        &nbsp;&middot;&nbsp;
        <a :href="termsUrl" target="_blank" rel="noopener">{{ t('footer.terms') }}</a>
        &nbsp;&middot;&nbsp;
        {{ t('footer.kvk') }}
        &nbsp;&middot;&nbsp;
        {{ t('footer.btw') }}
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

.footer__inner--no-knowledge {
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr);
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
