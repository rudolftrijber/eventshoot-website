<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FaqBlock from '@/components/FaqBlock.vue'
import { useSeo } from '@/composables/useSeo'
import { useEmailJS } from '@/composables/useEmailJS'
import { PhoneIcon, EnvelopeIcon, ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()

onMounted(() => {
  useSeo({
    title: 'Kennismaken | Eventshoot.nl',
    description: 'Een korte kennismaking duurt 20 minuten. Daarna weet je precies welk pakket bij je event past. Bel, mail of stuur een bericht.',
    url: 'https://eventshoot.nl/kennismaken',
  })
})

const { send } = useEmailJS()

const form = ref({ name: '', email: '', phone: '', message: '' })
const submitting = ref(false)
const submitted = ref(false)
const error = ref(false)

async function submitForm() {
  submitting.value = true
  error.value = false
  try {
    await send(import.meta.env.VITE_EMAILJS_TEMPLATE_ID, {
      from_name: form.value.name,
      from_email: form.value.email,
      phone: form.value.phone,
      message: form.value.message,
    })
    submitted.value = true
  } catch {
    error.value = true
  } finally {
    submitting.value = false
  }
}

const faqFallback = computed(() => [
  { question: t('km.faq1Q'), answer: t('km.faq1A') },
  { question: t('km.faq2Q'), answer: t('km.faq2A') },
  { question: t('km.faq3Q'), answer: t('km.faq3A') },
  { question: t('km.faq4Q'), answer: t('km.faq4A') },
])
</script>

<template>
  <main>
    <!-- Hero -->
    <section class="km-hero">
      <div class="km-hero__bg">
        <img src="/DATA_EVENTSHOOT/SITE_IMAGES/espresso.jpg" alt="Kennismaken met Rolf Trijber" />
        <div class="km-hero__overlay"></div>
      </div>
      <div class="container km-hero__content">
        <h1>{{ t('km.h1') }}</h1>
        <p>{{ t('km.sub') }}</p>
      </div>
    </section>

    <!-- Contact opties -->
    <section class="opties section section--blue">
      <div class="container">
        <div class="opties__grid">
          <div class="opties__card">
            <PhoneIcon class="opties__icon" />
            <h3>{{ t('km.callTitle') }}</h3>
            <p>{{ t('km.callDesc') }}</p>
            <a href="tel:+31625177728" class="btn btn--primary">{{ t('km.callBtn') }}</a>
          </div>
          <div class="opties__card">
            <EnvelopeIcon class="opties__icon" />
            <h3>{{ t('km.emailTitle') }}</h3>
            <p>{{ t('km.emailDesc') }}</p>
            <a href="mailto:rolf@eventshoot.nl" class="btn btn--primary">{{ t('km.emailBtn') }}</a>
          </div>
          <div class="opties__card">
            <ChatBubbleLeftRightIcon class="opties__icon" />
            <h3>{{ t('km.formTitle') }}</h3>
            <p>{{ t('km.formDesc') }}</p>
            <a href="#contact-form" class="btn btn--primary">{{ t('km.formBtn') }}</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Contactformulier -->
    <section id="contact-form" class="form-section section">
      <div class="container form-section__inner">
        <div class="form-section__text">
          <h2>{{ t('km.sectionTitle') }}</h2>
          <p>{{ t('km.sectionDesc') }}</p>
          <ul class="form-section__checks">
            <li><span>✓</span> {{ t('km.check1') }}</li>
            <li><span>✓</span> {{ t('km.check2') }}</li>
            <li><span>✓</span> {{ t('km.check3') }}</li>
          </ul>
        </div>
        <div class="form-wrap">
          <template v-if="!submitted">
            <form class="contact-form" @submit.prevent="submitForm" novalidate>
              <div class="form-field">
                <label for="name">{{ t('km.labelName') }}</label>
                <input id="name" v-model="form.name" type="text" :placeholder="t('km.placeholderName')" required />
              </div>
              <div class="form-field">
                <label for="email">{{ t('km.labelEmail') }}</label>
                <input id="email" v-model="form.email" type="email" :placeholder="t('km.placeholderEmail')" required />
              </div>
              <div class="form-field">
                <label for="phone">{{ t('km.labelPhone') }}</label>
                <input id="phone" v-model="form.phone" type="tel" :placeholder="t('km.placeholderPhone')" />
              </div>
              <div class="form-field">
                <label for="message">{{ t('km.labelMessage') }}</label>
                <textarea id="message" v-model="form.message" rows="5" :placeholder="t('km.placeholderMessage')" required></textarea>
              </div>
              <p v-if="error" class="form-error">{{ t('km.errorMsg') }}</p>
              <button type="submit" class="btn btn--primary" :disabled="submitting">
                {{ submitting ? t('km.submitting') : t('km.submitBtn') }}
              </button>
            </form>
          </template>
          <template v-else>
            <div class="form-success">
              <p class="form-success__icon">✓</p>
              <h3>{{ t('km.successTitle') }}</h3>
              <p>{{ t('km.successDesc') }}</p>
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Motto strook -->
    <section class="motto-bar">
      <div class="container motto-bar__inner">
        <p class="motto-bar__text">{{ t('tarieven.motto') }}</p>
      </div>
    </section>

    <FaqBlock page="kennismaken" :fallback="faqFallback" :subtitle="t('km.faqSub')" />
  </main>
</template>

<style scoped>
.km-hero {
  position: relative;
  min-height: 45vh;
  display: flex;
  align-items: center;
}

.km-hero__bg {
  position: absolute;
  inset: 0;
}

.km-hero__bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}

.km-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 100%);
}

.km-hero__content {
  position: relative;
  z-index: 1;
  padding-top: 8rem;
  padding-bottom: 4rem;
  max-width: 680px;
}

.km-hero__content h1 {
  font-size: clamp(1.75rem, 3.5vw, 3rem);
  font-weight: 800;
  margin-bottom: 1.25rem;
  line-height: 1.15;
}

.km-hero__content p {
  font-size: 1.05rem;
  color: rgba(255,255,255,0.82);
  line-height: 1.75;
}

.opties__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.opties__card {
  background: rgba(0,0,0,0.35);
  border-radius: 12px;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
}

.opties__icon {
  width: 28px;
  height: 28px;
  color: var(--color-accent);
  stroke-width: 1.5;
  flex-shrink: 0;
}

.opties__card h3 {
  font-size: 1.1rem;
  font-weight: 700;
}

.motto-bar {
  background: rgba(255, 140, 0, 0.42);
  padding: 3rem 0;
}

.motto-bar__inner {
  text-align: center;
}

.motto-bar__text {
  font-size: clamp(1.4rem, 3vw, 2.25rem);
  font-weight: 800;
  color: #fff;
  font-style: italic;
}

.opties__card p {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.7);
  line-height: 1.6;
  flex: 1;
}

.form-section__inner {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 5rem;
  align-items: start;
}

.form-section__text h2 {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 800;
  margin-bottom: 1rem;
}

.form-section__text p {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.7);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.form-section__checks {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-section__checks li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
}

.form-section__checks span {
  color: var(--color-accent);
  font-weight: 700;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  align-items: flex-start;
}

.contact-form .form-field {
  width: 100%;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-field label {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
}

.form-field input,
.form-field textarea {
  background: rgba(255,255,255,0.07);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 0.95rem;
  padding: 0.75rem 1rem;
  transition: border-color var(--transition), background var(--transition);
  font-family: inherit;
  resize: vertical;
}

.form-field input:focus,
.form-field textarea:focus {
  outline: none;
  border-color: var(--color-accent);
  background: rgba(255,255,255,0.10);
}

.form-field input::placeholder,
.form-field textarea::placeholder {
  color: rgba(255,255,255,0.35);
}

.form-error {
  font-size: 0.875rem;
  color: #ffcdd2;
}


.form-success {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(0,0,0,0.2);
  border-radius: 12px;
}

.form-success__icon {
  font-size: 2.5rem;
  color: var(--color-accent);
  font-weight: 700;
  margin-bottom: 1rem;
}

.form-success h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.form-success p {
  color: rgba(255,255,255,0.7);
}

@media (max-width: 768px) {
  .opties__grid { grid-template-columns: 1fr; }
  .form-section__inner { grid-template-columns: 1fr; gap: 2.5rem; }
}
</style>
