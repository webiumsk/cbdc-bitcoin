<template>
  <div class="section comparison">
    <h2>⚖️ {{ t('comparison.title') }}</h2>
    <div class="comparison-grid">
      <div class="comparison-card bad">
        <h3><span class="icon">🏛️</span> {{ t('comparison.cbdc.title') }}</h3>
        <ul>
          <li>{{ t('comparison.cbdc.items[0]') }}</li>
          <li>{{ t('comparison.cbdc.items[1]') }}</li>
          <li>{{ t('comparison.cbdc.items[2]') }}</li>
          <li>{{ t('comparison.cbdc.items[3]') }}</li>
          <li>{{ t('comparison.cbdc.items[4]') }}</li>
          <li>{{ t('comparison.cbdc.items[5]') }}</li>
          <li>{{ t('comparison.cbdc.items[6]') }}</li>
          <li>{{ t('comparison.cbdc.items[7]') }}</li>
        </ul>
      </div>
      
      <div class="comparison-card good">
        <h3><span class="icon">₿</span> {{ t('comparison.bitcoin.title') }}</h3>
        <ul>
          <li>{{ t('comparison.bitcoin.items[0]') }}</li>
          <li>{{ t('comparison.bitcoin.items[1]') }}</li>
          <li>{{ t('comparison.bitcoin.items[2]') }}</li>
          <li>{{ t('comparison.bitcoin.items[3]') }}</li>
          <li>{{ t('comparison.bitcoin.items[4]') }}</li>
          <li>{{ t('comparison.bitcoin.items[5]') }}</li>
          <li>{{ t('comparison.bitcoin.items[6]') }}</li>
          <li>{{ t('comparison.bitcoin.items[7]') }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>