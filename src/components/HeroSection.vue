<template>
  <div class="section hero">
    <h1>{{ t('hero.title') }}</h1>
    <h2 class="subtitle">{{ t('hero.subtitle') }}</h2>
    
    <div class="vs">⚔️</div>
    
    <div class="hero-boxes">
      <div class="hero-box cbdc">
        <h3>🏛️ {{ t('hero.cbdc.title') }}</h3>
        <p>{{ t('hero.cbdc.items[0]') }}</p>
        <p>{{ t('hero.cbdc.items[1]') }}</p>
        <p>{{ t('hero.cbdc.items[2]') }}</p>
      </div>
      
      <div class="hero-box bitcoin">
        <h3>₿ {{ t('hero.bitcoin.title') }}</h3>
        <p>{{ t('hero.bitcoin.items[0]') }}</p>
        <p>{{ t('hero.bitcoin.items[1]') }}</p>
        <p>{{ t('hero.bitcoin.items[2]') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>