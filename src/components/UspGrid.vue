<template>
  <section class="usp section">
    <div class="container">
      <div class="usp__grid">
        <div v-for="item in usps" :key="item.title" class="usp__card">
          <span class="usp__icon">{{ item.icon }}</span>
          <h3 class="usp__title">{{ item.title }}</h3>
          <p class="usp__text">{{ item.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const usps = [
  {
    icon: '🏆',
    title: '40+ jaar oog voor het moment',
    text: 'Senior fotograaf met veertig jaar vakervaring. Hij weet precies wanneer het beslissende moment komt.',
  },
  {
    icon: '📞',
    title: 'Één aanspreekpunt, geen gedoe',
    text: 'Rolf is jouw vaste contactpersoon van briefing tot levering. Geen verrassingen, geen tussenpersonen.',
  },
  {
    icon: '🎯',
    title: 'Representatief op elk niveau',
    text: 'Van intern seminar tot internationale conferentie — altijd de juiste stijl en uitstraling.',
  },
  {
    icon: '⚡',
    title: 'Geleverd binnen 48 uur',
    text: 'De volgende ochtend kun je al posten. Snel geleverd, direct bruikbaar voor LinkedIn en je website.',
  },
]
</script>

<style scoped>
.usp__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.usp__card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 2rem 1.5rem;
  transition: border-color var(--transition);
}

.usp__card:hover {
  border-color: var(--color-accent);
}

.usp__icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 1rem;
}

.usp__title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.usp__text {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}

@media (max-width: 900px) {
  .usp__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 500px) {
  .usp__grid {
    grid-template-columns: 1fr;
  }
}
</style>
