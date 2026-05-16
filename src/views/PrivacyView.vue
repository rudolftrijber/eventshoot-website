<script setup lang="ts">
import { onMounted } from 'vue'
import { useSeo } from '@/composables/useSeo'

onMounted(() => {
  useSeo({
    title: 'Privacy & Disclaimer | Eventshoot.nl',
    description: 'Privacy- en disclaimer-informatie van Eventshoot.nl BV.',
    url: 'https://eventshoot.nl/privacy',
  })
})
</script>

<template>
  <main>
    <section class="privacy section">
      <div class="container privacy__inner">
        <h1>Privacy &amp; Disclaimer</h1>
        <p class="privacy__intro">Eventshoot.nl BV, gevestigd in Nederland, is verantwoordelijk voor de verwerking van persoonsgegevens zoals weergegeven in deze privacyverklaring.</p>

        <h2>Contactgegevens</h2>
        <p>
          Eventshoot.nl BV<br>
          E-mail: <a href="mailto:rolf@eventshoot.nl">rolf@eventshoot.nl</a><br>
          Telefoon: <a href="tel:+31625177728">06 251 777 28</a>
        </p>

        <h2>Persoonsgegevens die wij verwerken</h2>
        <p>Eventshoot.nl verwerkt persoonsgegevens die je zelf actief verstrekt via het contactformulier of per e-mail. Dit betreft naam, e-mailadres en telefoonnummer.</p>

        <h2>Doel van de verwerking</h2>
        <p>Wij verwerken persoonsgegevens uitsluitend voor het beantwoorden van vragen en het aangaan of uitvoeren van opdrachten.</p>

        <h2>Bewaarperiode</h2>
        <p>Persoonsgegevens worden niet langer bewaard dan noodzakelijk voor de doeleinden waarvoor ze zijn verzameld, met een maximum van 2 jaar na het laatste contact.</p>

        <h2>Delen met derden</h2>
        <p>Wij verkopen jouw gegevens niet aan derden en verstrekken deze uitsluitend indien dit nodig is voor de uitvoering van onze overeenkomst of om te voldoen aan een wettelijke verplichting.</p>

        <h2>Disclaimer</h2>
        <p>Aan de informatie op deze website kunnen geen rechten worden ontleend. Eventshoot.nl BV is niet aansprakelijk voor schade die voortvloeit uit het gebruik van of het vertrouwen op de inhoud van deze website.</p>

        <h2>Vragen?</h2>
        <p>Stuur een e-mail naar <a href="mailto:rolf@eventshoot.nl">rolf@eventshoot.nl</a>.</p>
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
