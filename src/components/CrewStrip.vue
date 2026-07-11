<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const members = computed(() => [
  {
    name: t('overRolf.crewMauriceName'),
    photo: '/DATA_EVENTSHOOT/TEAM/maurice_antenbrink.png',
    paragraphs: [t('overRolf.crewMauriceP1'), t('overRolf.crewMauriceP2')],
  },
  {
    name: t('overRolf.crewRonName'),
    photo: '/DATA_EVENTSHOOT/TEAM/ron_gessel.png',
    paragraphs: [t('overRolf.crewRonP1'), t('overRolf.crewRonP2')],
  },
  {
    name: t('overRolf.crewVanessaName'),
    photo: '/DATA_EVENTSHOOT/TEAM/Vanessa_christina.png',
    paragraphs: [t('overRolf.crewVanessaP1'), t('overRolf.crewVanessaP2')],
  },
])
</script>

<template>
  <section class="crew section section--blue">
    <div class="container">
      <h2 class="crew__title">{{ t('overRolf.crewH2') }}</h2>
      <div class="crew__grid">
        <article v-for="member in members" :key="member.name" class="crew__card">
          <img
            :src="member.photo"
            :alt="member.name"
            class="crew__photo"
            loading="lazy"
          />
          <h3 class="crew__name">{{ member.name }}</h3>
          <p v-for="(paragraph, i) in member.paragraphs" :key="i" class="crew__text">
            {{ paragraph }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.crew__title {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 800;
  margin-bottom: 2.5rem;
  text-align: center;
}

.crew__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.crew__card {
  text-align: center;
}

.crew__photo {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center top;
  margin: 0 auto 1.25rem;
  display: block;
  border: 3px solid rgba(255, 255, 255, 0.25);
}

.crew__name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 1rem;
}

.crew__text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.75;
  margin-bottom: 0.85rem;
  text-align: left;
}

.crew__text:last-child {
  margin-bottom: 0;
}

@media (max-width: 900px) {
  .crew__grid {
    grid-template-columns: 1fr;
    gap: 3rem;
    max-width: 520px;
    margin: 0 auto;
  }

  .crew__photo {
    width: 140px;
    height: 140px;
  }
}
</style>
