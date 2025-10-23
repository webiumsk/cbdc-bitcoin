<template>
  <transition name="fade">
    <button
      v-if="isVisible"
      @click="scrollToTop"
      class="back-to-top"
      :title="t('backToTop')"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const isVisible = ref(false)

const handleScroll = () => { isVisible.value = window.scrollY > 300 }
const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }) }

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
/* Button */
.back-to-top {
  position: fixed; bottom: 30px; right: 30px;
  width: 50px; height: 50px; border-radius: 50%;
  background: linear-gradient(135deg, #f39c12, #e67e22);
  border: none; color: #fff; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  z-index: 9999; transition: all 0.3s;
}
.back-to-top:hover { transform: translateY(-5px); background: linear-gradient(135deg, #e67e22, #d35400); }
.back-to-top:active { transform: translateY(-2px); }

/* Fade Animation */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: scale(0.8); }

/* Mobile */
@media (max-width: 768px) {
  .back-to-top { width: 45px; height: 45px; bottom: 20px; right: 20px; }
}
</style>