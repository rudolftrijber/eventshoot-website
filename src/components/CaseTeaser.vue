<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="caseteaser section section--dark">
    <div class="container caseteaser__inner">
      <div class="caseteaser__copy">
        <h2 class="caseteaser__title">Werk dat voor zichzelf spreekt</h2>
        <p class="caseteaser__text">
          Bekijk een selectie uit congressen, conferenties, ledendagen en bedrijfsbijeenkomsten die we hebben mogen vastleggen.
        </p>
      </div>
      <div class="caseteaser__cta">
        <RouterLink to="/werk" class="btn btn--primary">Bekijk werk</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.caseteaser__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}
.caseteaser__title {
  font-size: clamp(1.2rem, 2.2vw, 1.7rem);
  font-weight: 800;
  margin-bottom: 0.5rem;
}
.caseteaser__text {
  color: rgba(255,255,255,0.75);
  line-height: 1.7;
  max-width: 60ch;
  margin: 0;
}
@media (max-width: 800px) {
  .caseteaser__inner { flex-direction: column; align-items: flex-start; }
}
</style>
