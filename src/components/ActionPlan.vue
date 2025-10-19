<template>
  <div class="section action">
    <h2>📋 {{ t('action.title') }}</h2>
    <div class="steps">
      <div class="step">
        <div class="step-number">{{ t('action.steps[0].number') }}</div>
        <h3>{{ t('action.steps[0].title') }}</h3>
        <p v-html="t('action.steps[0].description')"></p>
      </div>
      
      <div class="step">
        <div class="step-number">{{ t('action.steps[1].number') }}</div>
        <h3>{{ t('action.steps[1].title') }}</h3>
        <p>{{ t('action.steps[1].description') }}</p>
      </div>
      
      <div class="step">
        <div class="step-number">{{ t('action.steps[2].number') }}</div>
        <h3>{{ t('action.steps[2].title') }}</h3>
        <p>{{ t('action.steps[2].description') }}</p>
      </div>
      
      <div class="step">
        <div class="step-number">{{ t('action.steps[3].number') }}</div>
        <h3>{{ t('action.steps[3].title') }}</h3>
        <p>{{ t('action.steps[3].description') }}</p>
      </div>
      
      <div class="step">
        <div class="step-number">{{ t('action.steps[4].number') }}</div>
        <h3>{{ t('action.steps[4].title') }}</h3>
        <p>{{ t('action.steps[4].description') }}</p>
      </div>
      
      <div class="step">
        <div class="step-number">{{ t('action.steps[5].number') }}</div>
        <h3>{{ t('action.steps[5].title') }}</h3>
        <p>{{ t('action.steps[5].description') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>