<template>
  <div class="section solution">
    <h2>₿ {{ t('solution.title') }}</h2>
    <div class="solution-grid">
      <div class="solution-card">
        <div class="icon">{{ t('solution.items[0].icon') }}</div>
        <h3>{{ t('solution.items[0].title') }}</h3>
        <p>{{ t('solution.items[0].description') }}</p>
      </div>
      
      <div class="solution-card">
        <div class="icon">{{ t('solution.items[1].icon') }}</div>
        <h3>{{ t('solution.items[1].title') }}</h3>
        <p>{{ t('solution.items[1].description') }}</p>
      </div>
      
      <div class="solution-card">
        <div class="icon">{{ t('solution.items[2].icon') }}</div>
        <h3>{{ t('solution.items[2].title') }}</h3>
        <p>{{ t('solution.items[2].description') }}</p>
      </div>
      
      <div class="solution-card">
        <div class="icon">{{ t('solution.items[3].icon') }}</div>
        <h3>{{ t('solution.items[3].title') }}</h3>
        <p>{{ t('solution.items[3].description') }}</p>
      </div>
      
      <div class="solution-card">
        <div class="icon">{{ t('solution.items[4].icon') }}</div>
        <h3>{{ t('solution.items[4].title') }}</h3>
        <p>{{ t('solution.items[4].description') }}</p>
      </div>
      
      <div class="solution-card">
        <div class="icon">{{ t('solution.items[5].icon') }}</div>
        <h3>{{ t('solution.items[5].title') }}</h3>
        <p>{{ t('solution.items[5].description') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>