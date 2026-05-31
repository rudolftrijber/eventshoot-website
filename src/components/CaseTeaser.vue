<script setup lang="ts">
import { RouterLink } from 'vue-router'
import PhotoCarousel from '@/components/PhotoCarousel.vue'

withDefaults(defineProps<{
  photos?: string[]
}>(), {
  photos: () => [
    '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-75.jpg',
    '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-82.jpg',
    '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-88.jpg',
    '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-96.jpg',
    '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/eventshoot-101.jpg',
  ],
})
</script>

<template>
  <section class="caseteaser section section--blue">
    <div class="container">
      <h2 class="caseteaser__title">Werk dat voor zichzelf spreekt</h2>
      <p class="caseteaser__sub">Een selectie uit onze portfolio.</p>

      <PhotoCarousel :photos="photos" />

      <div class="caseteaser__cta">
        <RouterLink to="/werk" class="btn btn--primary">Bekijk het werk</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.caseteaser__title {
  text-align: center;
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.caseteaser__sub {
  text-align: center;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 2rem;
}

.caseteaser__cta {
  text-align: center;
  margin-top: 2rem;
}
</style>
