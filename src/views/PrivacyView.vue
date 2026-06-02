<script setup lang="ts">
import { usePageSeo } from '@/composables/usePageSeo'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

usePageSeo('privacy', { url: 'https://eventshoot.nl/privacy' })
</script>

<template>
  <main>
    <section class="privacy section">
      <div class="container privacy__inner">
        <h1>{{ t('privacyPage.h1') }}</h1>
        <p class="privacy__intro">{{ t('privacyPage.intro') }}</p>

        <h2>{{ t('privacyPage.h2Contact') }}</h2>
        <p>
          Eventshoot.nl BV<br>
          E-mail: <a href="mailto:rolf@eventshoot.nl">rolf@eventshoot.nl</a><br>
          {{ t('privacyPage.contactPhone') }}:
          <a href="tel:+31625177728">{{ t('belRolf.phoneDisplay') }}</a>
        </p>

        <h2>{{ t('privacyPage.h2Data') }}</h2>
        <p>{{ t('privacyPage.pData') }}</p>

        <h2>{{ t('privacyPage.h2Purpose') }}</h2>
        <p>{{ t('privacyPage.pPurpose') }}</p>

        <h2>{{ t('privacyPage.h2Retention') }}</h2>
        <p>{{ t('privacyPage.pRetention') }}</p>

        <h2>{{ t('privacyPage.h2Third') }}</h2>
        <p>{{ t('privacyPage.pThird') }}</p>

        <h2>{{ t('privacyPage.h2Disclaimer') }}</h2>
        <p>{{ t('privacyPage.pDisclaimer') }}</p>

        <h2>{{ t('privacyPage.h2Questions') }}</h2>
        <p>
          {{ t('privacyPage.pQuestionsBefore') }}
          <a href="mailto:rolf@eventshoot.nl">rolf@eventshoot.nl</a>.
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.privacy { padding-top: 9rem; }

.privacy__inner {
  max-width: 760px;
}

.privacy__inner h1 {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
}

.privacy__intro {
  font-size: 1.05rem;
  color: rgba(255,255,255,0.75);
  line-height: 1.75;
  margin-bottom: 2.5rem;
}

.privacy__inner h2 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 2rem 0 0.75rem;
  color: #fff;
}

.privacy__inner p {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.75);
  line-height: 1.75;
}

.privacy__inner a {
  color: var(--color-accent);
  text-decoration: none;
}
.privacy__inner a:hover { text-decoration: underline; }
</style>
