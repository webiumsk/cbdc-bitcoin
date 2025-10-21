<template>
  <div class="lang-switcher" @click="toggleDropdown">
    <div class="lang-current">
      {{ getCurrentFlag() }} {{ currentLocale.toUpperCase() }}
      <span class="arrow">▼</span>
    </div>
    <div v-if="isOpen" class="lang-dropdown">
      <router-link 
        v-for="lang in languages" 
        :key="lang.code"
        :to="lang.path" 
        class="lang-option"
        @click.stop="closeDropdown"
      >
        {{ lang.flag }} {{ lang.code.toUpperCase() }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLocale = computed(() => locale.value)
const isOpen = ref(false)

const languages = [
  { code: 'en', flag: '🇬🇧', path: '/' },
  { code: 'sk', flag: '🇸🇰', path: '/sk' },
  { code: 'es', flag: '🇪🇸', path: '/es' },
  { code: 'de', flag: '🇩🇪', path: '/de' }
]

const getCurrentFlag = () => {
  const lang = languages.find(l => l.code === currentLocale.value)
  return lang ? lang.flag : '🇬🇧'
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const handleClickOutside = (event) => {
  const switcher = event.target.closest('.lang-switcher')
  if (!switcher) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.lang-switcher {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: rgba(243, 156, 18, 0.95);
  border-radius: 10px;
  padding: 10px 15px;
  backdrop-filter: blur(10px);
  cursor: pointer;
  user-select: none;
  min-width: 100px;
}

.lang-current {
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.arrow {
  font-size: 0.7rem;
  transition: transform 0.3s;
}

.lang-switcher:hover .arrow {
  transform: translateY(2px);
}

.lang-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background: rgba(243, 156, 18, 0.98);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  backdrop-filter: blur(10px);
}

.lang-option {
  display: block;
  padding: 10px 15px;
  color: #fff;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.lang-option:last-child {
  border-bottom: none;
}

.lang-option:hover {
  background: rgba(255,255,255,0.2);
  padding-left: 20px;
}

@media (max-width: 768px) {
  .lang-switcher {
    top: 10px;
    right: 10px;
    padding: 8px 12px;
    min-width: 85px;
  }

  .lang-current {
    font-size: 0.9rem;
  }

  .lang-option {
    font-size: 0.85rem;
    padding: 8px 12px;
  }
}
</style>