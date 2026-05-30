<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const B = '/DATA_EVENTSHOOT/SITE_IMAGES/EVENTFOTOS/'

const props = withDefaults(defineProps<{
  photos?: string[]
}>(), {
  photos: () => [
    B + 'eventshoot-75.jpg',
    B + 'eventshoot-82.jpg',
    B + 'eventshoot-88.jpg',
    B + 'eventshoot-96.jpg',
    B + 'eventshoot-101.jpg',
  ],
})

const current = ref(0)

function prev() {
  current.value = (current.value - 1 + props.photos.length) % props.photos.length
}
function next() {
  current.value = (current.value + 1) % props.photos.length
}
</script>

<template>
  <section class="caseteaser section section--blue">
    <div class="container">
      <h2 class="caseteaser__title">Werk dat voor zichzelf spreekt</h2>
      <p class="caseteaser__sub">Een selectie uit onze portfolio.</p>

      <div class="caseteaser__carousel">
        <button class="caseteaser__arrow caseteaser__arrow--prev" @click="prev" aria-label="Vorige foto">&#8249;</button>
        <div class="caseteaser__img-wrap">
          <img
            v-for="(photo, i) in props.photos"
            :key="photo"
            :src="photo"
            :class="['caseteaser__img', { 'caseteaser__img--active': i === current }]"
            alt="Eventfoto Eventshoot.nl"
          />
        </div>
        <button class="caseteaser__arrow caseteaser__arrow--next" @click="next" aria-label="Volgende foto">&#8250;</button>
      </div>

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

.caseteaser__carousel {
  position: relative;
  padding: 0 3.5rem;
}

.caseteaser__img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 8px;
}

.caseteaser__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.caseteaser__img--active {
  opacity: 1;
}

.caseteaser__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #fff;
  font-size: 2rem;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 1;
}

.caseteaser__arrow:hover {
  background: rgba(255, 255, 255, 0.3);
}

.caseteaser__arrow--prev { left: 0; }
.caseteaser__arrow--next { right: 0; }

.caseteaser__cta {
  text-align: center;
  margin-top: 2rem;
}
</style>
