<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="contentyear section section--blue">
    <div class="container contentyear__inner">
      <div class="contentyear__copy">
        <h2 class="contentyear__title">Meerdere events per jaar?</h2>
        <p class="contentyear__text">
          Met het Content Year jaarcontract heb je drie events per jaar op Heroes-niveau, voorrang in de agenda en een doorlopende stijl.
        </p>
      </div>
      <div class="contentyear__cta">
        <RouterLink to="/tarieven" class="btn btn--primary">Bekijk jaarcontract</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contentyear__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}
.contentyear__title {
  font-size: clamp(1.2rem, 2.2vw, 1.7rem);
  font-weight: 800;
  margin-bottom: 0.5rem;
}
.contentyear__text {
  color: rgba(255,255,255,0.75);
  line-height: 1.7;
  max-width: 56ch;
  margin: 0;
}
@media (max-width: 800px) {
  .contentyear__inner { flex-direction: column; align-items: flex-start; }
}
</style>
