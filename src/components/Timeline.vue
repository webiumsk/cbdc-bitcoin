<template>
  <div class="section timeline">
    <h2>⏰ {{ t('timeline.title') }}</h2>
    <div class="timeline-container">
      <div class="timeline-line"></div>
      
      <div class="timeline-item">
        <div class="timeline-content">
          <div class="timeline-date">{{ t('timeline.items[0].date') }}</div>
          <h3>{{ t('timeline.items[0].title') }}</h3>
          <p>{{ t('timeline.items[0].description') }}</p>
        </div>
        <div class="timeline-dot"></div>
      </div>

      <div class="timeline-item">
        <div class="timeline-content">
          <div class="timeline-date">{{ t('timeline.items[1].date') }}</div>
          <h3>{{ t('timeline.items[1].title') }}</h3>
          <p>{{ t('timeline.items[1].description') }}</p>
        </div>
        <div class="timeline-dot"></div>
      </div>

      <div class="timeline-item">
        <div class="timeline-content">
          <div class="timeline-date">{{ t('timeline.items[2].date') }}</div>
          <h3>{{ t('timeline.items[2].title') }}</h3>
          <p>{{ t('timeline.items[2].description') }}</p>
        </div>
        <div class="timeline-dot"></div>
      </div>

      <div class="timeline-item">
        <div class="timeline-content">
          <div class="timeline-date">{{ t('timeline.items[3].date') }}</div>
          <h3>{{ t('timeline.items[3].title') }}</h3>
          <p>{{ t('timeline.items[3].description') }}</p>
        </div>
        <div class="timeline-dot"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>