<script setup lang="ts">
defineProps<{
  body?: string
}>()
</script>

<template>
  <section class="motto-strip">
    <div class="motto-strip__inner container">
      <h2 class="motto-strip__title">Jouw event is een goudmijn aan content.</h2>
      <p v-if="body" class="motto-strip__body">{{ body }}</p>
    </div>
  </section>
</template>

<style scoped>
.motto-strip {
  background: rgba(255, 140, 0, 0.42);
  padding: 5.5rem 0;
}

.motto-strip__inner {
  text-align: center;
  max-width: 780px;
  margin: 0 auto;
}

.motto-strip__title {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 700;
  color: #fff;
  margin-bottom: 1rem;
}

.motto-strip__body {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
}
</style>
