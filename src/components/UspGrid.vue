<script setup lang="ts">
import { TrophyIcon, UserGroupIcon, MapPinIcon, BoltIcon } from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <section class="usp">
    <div class="container">
      <h2 class="usp__heading">{{ t('usp.heading') }}</h2>
      <div class="usp__grid">
        <div class="usp__card">
          <TrophyIcon class="usp__icon" />
          <h3 class="usp__title">{{ t('usp.usp1Title') }}</h3>
          <p class="usp__text">{{ t('usp.usp1Text') }}</p>
        </div>
        <div class="usp__card">
          <UserGroupIcon class="usp__icon" />
          <h3 class="usp__title">{{ t('usp.usp2Title') }}</h3>
          <p class="usp__text">{{ t('usp.usp2Text') }}</p>
        </div>
        <div class="usp__card">
          <MapPinIcon class="usp__icon" />
          <h3 class="usp__title">{{ t('usp.usp3Title') }}</h3>
          <p class="usp__text">{{ t('usp.usp3Text') }}</p>
        </div>
        <div class="usp__card">
          <BoltIcon class="usp__icon" />
          <h3 class="usp__title">{{ t('usp.usp4Title') }}</h3>
          <p class="usp__text">{{ t('usp.usp4Text') }}</p>
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
