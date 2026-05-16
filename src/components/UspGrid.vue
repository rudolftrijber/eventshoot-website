<script setup lang="ts">
import { TrophyIcon, UserGroupIcon, MapPinIcon, BoltIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <section class="usp">
    <div class="container">
      <h2 class="usp__heading">Waarom kiezen voor Eventshoot.nl</h2>
      <div class="usp__grid">
        <div class="usp__card">
          <TrophyIcon class="usp__icon" />
          <h3 class="usp__title">40+ jaar ervaring</h3>
          <p class="usp__text">Senioriteit als productiekracht. Veertig jaar in beeldproductie zit ingebakken in wat je krijgt. Geen onzekere handen, geen gemiste momenten. Een scherp oog voor wat zich aandient, en het sociale gemak om in twee tonen te schakelen: de taal van technici én die van de directiekamer.</p>
        </div>
        <div class="usp__card">
          <UserGroupIcon class="usp__icon" />
          <h3 class="usp__title">Mensen, geen AI</h3>
          <p class="usp__text">Eventshoot.nl gebruikt geen AI-gegenereerde video of stockbeelden. Alles wat je krijgt is echt opgenomen op jouw event, met echte mensen en professionele apparatuur. Voor de nabewerking, zoals selectie, transcriptie en ondertiteling, gebruiken we AI. Voor de beelden zelf, mensen.</p>
        </div>
        <div class="usp__card">
          <MapPinIcon class="usp__icon" />
          <h3 class="usp__title">Vooraf afgestemd met de locatie</h3>
          <p class="usp__text">Backdrop, beeldwand, podiumlicht, presentatieformat, groepsfoto-moment en interviewlocatie worden samen met techniek doorgenomen voordat de eerste gast binnenkomt. Dia's met een donkere achtergrond in plaats van andersom, beter voor de deelnemers én voor het beeld. Geen toeval, wel verschil.</p>
        </div>
        <div class="usp__card">
          <BoltIcon class="usp__icon" />
          <h3 class="usp__title">Geleverd binnen 48 uur</h3>
          <p class="usp__text">Je bestanden zijn binnen twee dagen klaar voor je marketeer, terwijl het event nog vers in het geheugen zit. In de juiste formaten voor elk kanaal: horizontaal voor de website, 4:5 voor LinkedIn en verticaal voor Stories en Reels. Geen extra nabewerking nodig, direct te plaatsen.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.usp {
  background: rgba(49, 159, 232, 0.40);
  padding: 4rem 0;
}

.usp__heading {
  text-align: center;
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 700;
  color: #fff;
  margin-bottom: 2.5rem;
}

.usp__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.usp__card {
  background: rgba(0, 0, 0, 0.35);
  border-radius: 12px;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: background var(--transition);
}

.usp__card:hover {
  background: rgba(0, 0, 0, 0.50);
}

.usp__icon {
  width: 28px;
  height: 28px;
  color: var(--color-accent);
  stroke-width: 1.5;
  flex-shrink: 0;
}

.usp__title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
}

.usp__text {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.7;
}

@media (max-width: 900px) {
  .usp__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 500px) {
  .usp__grid { grid-template-columns: 1fr; }
}
</style>
