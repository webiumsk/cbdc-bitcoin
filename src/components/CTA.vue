<template>
  <div class="section cta">
    <h2>⚡ {{ t('cta.title') }}</h2>
    <p>{{ t('cta.lines[0]') }}</p>
    <p>{{ t('cta.lines[1]') }}</p>
    <p class="quote">{{ t('cta.quote') }}</p>
    <p>{{ t('cta.politiciansLine') }}</p>
    <p>{{ t('cta.bitcoinLine') }}</p>
    
    <div class="action-block">
      <p class="action-text">{{ t('cta.actionText') }}</p>
      <a href="https://www.dvadsatjeden.org" class="cta-button" target="_blank" rel="noopener">
        {{ t('cta.button') }}
      </a>
    </div>

    <SocialShare />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import SocialShare from './SocialShare.vue'
const { t } = useI18n()
</script>

<style scoped>
/* Footer Content (ak je súčasť CTA) */
.footer-content {
  margin-top: 80px; display: flex; flex-direction: column; align-items: center;
  gap: 20px; padding: 30px 20px; border-top: 2px solid rgba(255,255,255,0.1);
  max-width: 800px;
}

/* Action Block */
.action-block { margin-top: 60px; }
.action-text { font-size: 2rem; margin-bottom: 20px; }
</style>