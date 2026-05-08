<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  name: string
  price: string
  description: string
  features: string[]
  highlighted?: boolean
}>()
</script>

<template>
  <div class="pricing-card" :class="{ 'pricing-card--highlighted': highlighted }">
    <div v-if="highlighted" class="pricing-card__badge">Meest gekozen</div>
    <h3 class="pricing-card__name">{{ name }}</h3>
    <div class="pricing-card__price">
      <span class="pricing-card__amount">{{ price }}</span>
      <span class="pricing-card__period">excl. btw</span>
    </div>
    <p class="pricing-card__desc">{{ description }}</p>
    <ul class="pricing-card__features">
      <li v-for="feature in features" :key="feature">
        <span class="pricing-card__check">✓</span> {{ feature }}
      </li>
    </ul>
    <RouterLink to="/contact" class="btn" :class="highlighted ? 'btn--primary' : 'btn--outline'">
      Offerte aanvragen
    </RouterLink>
  </div>
</template>

<style scoped>
.pricing-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
}

.pricing-card--highlighted {
  border-color: var(--color-accent);
  background: #1c1a12;
}

.pricing-card__badge {
  position: absolute;
  top: -13px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-accent);
  color: #0f0f0f;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  white-space: nowrap;
}

.pricing-card__name {
  font-size: 1.25rem;
  font-weight: 700;
}

.pricing-card__price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.pricing-card__amount {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--color-accent);
}

.pricing-card__period {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.pricing-card__desc {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.pricing-card__features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex: 1;
}

.pricing-card__features li {
  font-size: 0.9rem;
  color: var(--color-text);
  display: flex;
  gap: 0.5rem;
}

.pricing-card__check {
  color: var(--color-accent);
  font-weight: 700;
  flex-shrink: 0;
}
</style>
