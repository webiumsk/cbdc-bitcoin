<template>
  <div class="section threats">
    <h2>⚠️ {{ t('threats.title') }}</h2>
    <div class="threat-cards">
      <div class="threat-card">
        <div class="number">{{ t('threats.items[0].number') }}</div>
        <h3>{{ t('threats.items[0].title') }}</h3>
        <p>{{ t('threats.items[0].description') }}</p>
      </div>
      
      <div class="threat-card">
        <div class="number">{{ t('threats.items[1].number') }}</div>
        <h3>{{ t('threats.items[1].title') }}</h3>
        <p>{{ t('threats.items[1].description') }}</p>
      </div>
      
      <div class="threat-card">
        <div class="number">{{ t('threats.items[2].number') }}</div>
        <h3>{{ t('threats.items[2].title') }}</h3>
        <p>{{ t('threats.items[2].description') }}</p>
      </div>
      
      <div class="threat-card">
        <div class="number">{{ t('threats.items[3].number') }}</div>
        <h3>{{ t('threats.items[3].title') }}</h3>
        <p>{{ t('threats.items[3].description') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>