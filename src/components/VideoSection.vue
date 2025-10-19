<template>
  <div class="section video-section">
    <h2>🎥 {{ t('video.title') }}</h2>
    <p class="video-description">{{ t('video.description') }}</p>
    
    <div class="video-container">
      <iframe 
        width="100%" 
        height="100%" 
        src="https://www.youtube.com/embed/sUOZNo4Gbfw" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style scoped>
.video-section {
  background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
}

.video-section h2 {
  font-size: 3rem;
  margin-bottom: 20px;
  text-align: center;
  color: #f39c12;
  text-transform: uppercase;
}

.video-description {
  font-size: 1.3rem;
  color: #ecf0f1;
  text-align: center;
  max-width: 800px;
  margin: 0 auto 40px;
  line-height: 1.6;
}

.video-container {
  position: relative;
  width: 100%;
  max-width: 900px;
  padding-bottom: 30.625%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(243, 156, 18, 0.3);
  border: 3px solid #f39c12;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

@media (max-width: 768px) {
  .video-section h2 {
    font-size: 2rem;
  }
  
  .video-description {
    font-size: 1.1rem;
    padding: 0 20px;
  }

  .video-container {
    padding-bottom: 50.625%;
    }
}
</style>