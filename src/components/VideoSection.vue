<template>
  <div class="section video-section">
    <h2>🎥 {{ t('video.title') }}</h2>
    <p class="video-description">{{ t('video.description') }}</p>
    <div class="video-container">
      <LazyYoutube 
        video-id="sUOZNo4Gbfw"
        :no-cookie="true"
      />
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import LazyYoutube from './LazyYoutube.vue'
const { t } = useI18n()
</script>

<style scoped>
/* Base */
.video-section { background: linear-gradient(135deg, #0f3460, #16213e); }
.video-section h2 { font-size: 3rem; margin-bottom: 20px; text-align: center; color: #f39c12; text-transform: uppercase; }
.video-description { font-size: 1.3rem; color: #ecf0f1; text-align: center; max-width: 800px; margin: 0 auto 40px; line-height: 1.6; }

/* Video Container - 16:9 Aspect Ratio */
.video-container {
  position: relative; 
  width: 100%; 
  max-width: 900px;
  overflow: hidden;
  border-radius: 15px; 
  border: 2px solid #f39c12;
  /*box-shadow: 0 10px 40px rgba(243, 156, 18, 0.3);*/
}
.video-container iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 12px; }

/* Mobile */
@media (max-width: 768px) {
  .video-section h2 { font-size: 2rem; }
  .video-description { font-size: 1.1rem; padding: 0 20px; }
}
</style>