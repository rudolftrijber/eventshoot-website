<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSeo } from '@/composables/useSeo'
import { useEmailJS } from '@/composables/useEmailJS'

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

const faqs = [
  { q: 'Hoe snel reageert Rolf?', a: 'Doorgaans binnen een paar uur op werkdagen. Rolf reageert persoonlijk, geen callcenter.' },
  { q: 'Wat kost een kennismaking?', a: 'Een kennismaking is gratis en vrijblijvend. Geen verplichtingen.' },
  { q: 'Kan ik ook last-minute boeken?', a: 'Bel direct: 06 251 777 28. Rolf probeert altijd iets te regelen als de agenda het toelaat.' },
  { q: 'Werkt Rolf door heel Nederland?', a: 'Ja, Eventshoot.nl is actief door heel Nederland. Reiskosten worden separaat berekend.' },
]
</script>

<template>
  <main>
    <!-- Hero -->
    <section class="km-hero section">
      <div class="container km-hero__inner">
        <h1 class="km-hero__h1">Even kennismaken?</h1>
        <p class="km-hero__sub">Een korte kennismaking duurt 20 minuten. Daarna weet je precies welk pakket bij je event past, en of we elkaar liggen.</p>
      </div>
    </section>

    <!-- Contact opties -->
    <section class="opties section section--dark">
      <div class="container">
        <div class="opties__grid">
          <div class="opties__card">
            <div class="opties__icon">📞</div>
            <h3>Bel direct</h3>
            <p>Liever gelijk een stem? Bel Rolf. Beschikbaar op werkdagen.</p>
            <a href="tel:+31625177728" class="btn btn--primary">06 251 777 28</a>
          </div>
          <div class="opties__card">
            <div class="opties__icon">✉️</div>
            <h3>Stuur een mail</h3>
            <p>Rolf reageert persoonlijk, doorgaans binnen een paar uur op werkdagen.</p>
            <a href="mailto:rolf@eventshoot.nl" class="btn btn--primary">rolf@eventshoot.nl</a>
          </div>
          <div class="opties__card">
            <div class="opties__icon">💬</div>
            <h3>Stuur een bericht</h3>
            <p>Vertel kort over je event. Rolf kijkt wat hij voor je kan doen.</p>
            <a href="#contact-form" class="btn btn--primary">Formulier hieronder</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Contactformulier -->
    <section id="contact-form" class="form-section section">
      <div class="container form-section__inner">
        <div class="form-section__text">
          <h2>Vertel over je event</h2>
          <p>Rolf reageert persoonlijk binnen 24 uur. Geen geautomatiseerde reacties, geen callcenters.</p>
          <ul class="form-section__checks">
            <li><span>✓</span> Vrijblijvend</li>
            <li><span>✓</span> Binnen 24 uur reactie</li>
            <li><span>✓</span> Persoonlijk antwoord</li>
          </ul>
        </div>
        <div class="form-wrap">
          <template v-if="!submitted">
            <form class="contact-form" @submit.prevent="submitForm" novalidate>
              <div class="form-field">
                <label for="name">Naam</label>
                <input id="name" v-model="form.name" type="text" placeholder="Jouw naam" required />
              </div>
              <div class="form-field">
                <label for="email">E-mail</label>
                <input id="email" v-model="form.email" type="email" placeholder="jouw@emailadres.nl" required />
              </div>
              <div class="form-field">
                <label for="phone">Telefoon</label>
                <input id="phone" v-model="form.phone" type="tel" placeholder="06 xx xx xx xx" />
              </div>
              <div class="form-field">
                <label for="message">Je event</label>
                <textarea id="message" v-model="form.message" rows="5" placeholder="Vertel me over je event, dan kijk ik wat ik voor je kan doen." required></textarea>
              </div>
              <p v-if="error" class="form-error">Er ging iets mis. Probeer het opnieuw of bel direct.</p>
              <button type="submit" class="btn btn--primary btn--full" :disabled="submitting">
                {{ submitting ? 'Versturen…' : 'Verstuur' }}
              </button>
            </form>
          </template>
          <template v-else>
            <div class="form-success">
              <p class="form-success__icon">✓</p>
              <h3>Bericht ontvangen.</h3>
              <p>Rolf reageert persoonlijk, doorgaans binnen 24 uur.</p>
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq section section--dark">
      <div class="container">
        <h2 class="faq__title">Veelgestelde vragen</h2>
        <div class="faq__list">
          <div v-for="item in faqs" :key="item.q" class="faq__item">
            <h3 class="faq__q">{{ item.q }}</h3>
            <p class="faq__a">{{ item.a }}</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.km-hero {
  padding-top: 9rem;
  text-align: center;
}

.km-hero__inner {
  max-width: 640px;
  margin: 0 auto;
}

.km-hero__h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  margin-bottom: 1.25rem;
}

.km-hero__sub {
  font-size: 1.05rem;
  color: rgba(255,255,255,0.75);
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

.opties__icon { font-size: 2rem; }

.opties__card h3 {
  font-size: 1.1rem;
  font-weight: 700;
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
  border: 1px solid rgba(255,255,255,0.12);
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

.btn--full { width: 100%; justify-content: center; }

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

.faq__title {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 800;
  margin-bottom: 2rem;
}

.faq__list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 760px;
}

.faq__item {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1.5rem;
}

.faq__q {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.faq__a {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.7;
}

@media (max-width: 768px) {
  .opties__grid { grid-template-columns: 1fr; }
  .form-section__inner { grid-template-columns: 1fr; gap: 2.5rem; }
}
</style>
