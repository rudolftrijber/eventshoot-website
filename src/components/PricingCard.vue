<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import OptimizedImage from '@/components/OptimizedImage.vue'

const { t } = useI18n()

defineProps<{
  name: string
  price: string
  description: string
  features: string[]
  image: string
  highlighted?: boolean
}>()
</script>

<template>
  <div class="card" :class="{ 'card--highlighted': highlighted }">
    <div v-if="highlighted" class="card__badge">{{ t('pricing.mostChosen') }}</div>
    <div v-else class="card__spacer"></div>
    <div class="card__inner">
      <h3 class="card__name">{{ name }}</h3>
      <div class="card__img-wrap">
        <OptimizedImage :src="image" :alt="name" preset="card" img-class="card__img" />
      </div>
      <div class="card__price" :class="{ 'card__price--accent': highlighted }">{{ price }}</div>
      <p class="card__desc">{{ description }}</p>
      <ul class="card__features">
        <li v-for="feature in features" :key="feature">
          <span class="card__check">✓</span>
          <span>{{ feature }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.card--highlighted {
  background: rgba(255, 255, 255, 0.15);
}

.card--highlighted .card__inner {
  padding-top: 2rem;
}

.card__spacer {
  height: 42px;
  background: transparent;
}

.card__badge {
  background: var(--color-accent);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  text-align: center;
  padding: 0.8rem 1rem;
}

.card__inner {
  padding: 1.5rem 1.5rem 3rem;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
  flex: 1;
}

.card__name {
  font-size: 1.9rem;
  font-weight: 700;
  color: #fff;
  text-align: center;
  letter-spacing: -0.01em;
  min-height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card__img-wrap {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card__price {
  font-size: 4rem;
  font-weight: 900;
  color: #fff;
  line-height: 1;
}

.card__price--accent {
  color: var(--color-accent);
}

.card__desc {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.6;
  text-align: center;
}

.card__features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.card__features li {
  display: flex;
  gap: 0.6rem;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.4;
}

.card__check {
  color: var(--color-accent);
  font-weight: 700;
  flex-shrink: 0;
}
</style>
