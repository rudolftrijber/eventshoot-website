<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SectionHeading from '@/components/SectionHeading.vue'
import { useSeo } from '@/composables/useSeo'
import { useEmailJS } from '@/composables/useEmailJS'

onMounted(() => {
  useSeo({
    title: 'Contact | Eventshoot.nl',
    description: 'Neem contact op met Rolf voor een offerte voor eventfotografie of eventvideo. Reactie binnen 24 uur.',
    url: 'https://eventshoot.nl/contact',
  })
})

const form = ref({
  naam: '',
  email: '',
  telefoon: '',
  bericht: '',
})

const { send } = useEmailJS()
const state = ref<'idle' | 'sending' | 'success' | 'error'>('idle')

async function submit() {
  state.value = 'sending'
  try {
    await send(import.meta.env.VITE_EMAILJS_TEMPLATE_ID, {
      from_name: form.value.naam,
      from_email: form.value.email,
      phone: form.value.telefoon,
      message: form.value.bericht,
    })
    state.value = 'success'
    form.value = { naam: '', email: '', telefoon: '', bericht: '' }
  } catch {
    state.value = 'error'
  }
}
</script>

<template>
  <main>
    <section class="contact section">
      <div class="container">
        <div class="contact__inner">
          <div class="contact__info">
            <SectionHeading title="Neem contact op" subtitle="Vertel me over je event, dan kijk ik wat ik voor je kan doen." align="left" />
            <p class="contact__promise">Rolf reageert persoonlijk binnen 24 uur.<br>Geen automatische reacties, geen callcenters.</p>
            <a href="tel:+31625177728" class="contact__phone">📞 06 251 777 28</a>

            <div class="contact__usps">
              <div class="contact__usp"><span>✓</span> 40+ jaar ervaring</div>
              <div class="contact__usp"><span>✓</span> Één aanspreekpunt</div>
              <div class="contact__usp"><span>✓</span> Geleverd binnen 48 uur</div>
              <div class="contact__usp"><span>✓</span> Corporate kwaliteit</div>
            </div>
          </div>

          <div class="contact__form-wrap">
            <form v-if="state !== 'success'" class="contact__form" @submit.prevent="submit">
              <div class="contact__field">
                <label for="naam">Naam *</label>
                <input id="naam" v-model="form.naam" type="text" required placeholder="Jouw naam" />
              </div>
              <div class="contact__field">
                <label for="email">E-mail *</label>
                <input id="email" v-model="form.email" type="email" required placeholder="jouw@email.nl" />
              </div>
              <div class="contact__field">
                <label for="telefoon">Telefoon</label>
                <input id="telefoon" v-model="form.telefoon" type="tel" placeholder="06 12345678" />
              </div>
              <div class="contact__field">
                <label for="bericht">Jouw event *</label>
                <textarea id="bericht" v-model="form.bericht" required rows="5" placeholder="Vertel me over je event, dan kijk ik wat ik voor je kan doen"></textarea>
              </div>
              <button type="submit" class="btn btn--primary" :disabled="state === 'sending'">
                {{ state === 'sending' ? 'Versturen...' : 'Verstuur bericht' }}
              </button>
              <p v-if="state === 'error'" class="contact__error">Er ging iets mis. Bel me op 06 251 777 28.</p>
            </form>

            <div v-else class="contact__success">
              <span class="contact__success-icon">✓</span>
              <h3>Bericht verzonden!</h3>
              <p>Rolf neemt persoonlijk contact met je op binnen 24 uur.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.contact {
  padding-top: 8rem;
}

.contact__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: start;
}

.contact__promise {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.contact__phone {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-accent);
  margin-bottom: 2rem;
  transition: color var(--transition);
}

.contact__phone:hover {
  color: var(--color-accent-hover);
}

.contact__usps {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact__usp {
  display: flex;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: var(--color-text-muted);
}

.contact__usp span {
  color: var(--color-accent);
  font-weight: 700;
}

.contact__form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.contact__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.contact__field label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.contact__field input,
.contact__field textarea {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 0.75rem 1rem;
  color: var(--color-text);
  font-family: var(--font-base);
  font-size: 0.95rem;
  transition: border-color var(--transition);
  outline: none;
  resize: vertical;
}

.contact__field input:focus,
.contact__field textarea:focus {
  border-color: var(--color-accent);
}

.contact__field input::placeholder,
.contact__field textarea::placeholder {
  color: #555;
}

button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.contact__error {
  color: #e05c5c;
  font-size: 0.875rem;
}

.contact__success {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 2rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius);
  gap: 1rem;
}

.contact__success-icon {
  font-size: 3rem;
  color: var(--color-accent);
  font-weight: 800;
}

.contact__success h3 {
  font-size: 1.5rem;
}

.contact__success p {
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .contact__inner {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}
</style>
