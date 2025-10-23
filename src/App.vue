<template>
  <div id="app">
    <LanguageSwitcher />
    <!-- TrackerFloatingButton / -->
    <BackToTop />
    <router-view />
  </div>
</template>

<script setup>
import { watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import BackToTop from './components/BackToTop.vue'
//import TrackerFloatingButton from './components/TrackerFloatingButton.vue'

const { t, locale } = useI18n()
const route = useRoute()

const siteData = computed(() => {
  const baseUrl = 'https://cbdc.icu'
  const currentLocale = locale.value
  const ogImage = 'https://cbdc.icu/cbdc-vs-btc.jpg'
  let url = baseUrl
  let ogLocale = 'en_US' // Default EN
  
  if (currentLocale === 'sk') {
    url = `${baseUrl}/sk`
    ogLocale = 'sk_SK'
  } else if (currentLocale === 'es') {
    url = `${baseUrl}/es`
    ogLocale = 'es_ES'
  } else if (currentLocale === 'de') {
    url = `${baseUrl}/de`
    ogLocale = 'de_DE'
  }
  
  return {
    title: t('meta.title'),
    meta: [
      { name: 'description', content: t('meta.description') },
      { name: 'keywords', content: 'CBDC, Bitcoin, digital euro, ECB, financial freedom, decentralization, cryptocurrency, digitálne euro, finančná sloboda, kryptomeny, euro digital, digitaler euro' },
      
      // Open Graph
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: ogImage },
      { property: 'og:site_name', content: 'CBDC.icu' },
      { property: 'og:url', content: url },
      { property: 'og:title', content: t('meta.ogTitle') },
      { property: 'og:description', content: t('meta.ogDescription') },
      { property: 'og:locale', content: ogLocale },
      { property: 'og:image:secure_url', content: ogImage },
      { property: 'og:image:type', content: 'image/jpeg' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: t('meta.imageAlt') },
      
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:url', content: url },
      { name: 'twitter:title', content: t('meta.ogTitle') },
      { name: 'twitter:description', content: t('meta.ogDescription') },
      { name: 'twitter:image', content: ogImage },
      { name: 'twitter:image:alt', content: t('meta.imageAlt') },
    ],
    link: [
      { rel: 'canonical', href: url },
      { rel: 'alternate', hreflang: 'en', href: baseUrl },
      { rel: 'alternate', hreflang: 'sk', href: `${baseUrl}/sk` },
      { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es` },
      { rel: 'alternate', hreflang: 'de', href: `${baseUrl}/de` },
      { rel: 'alternate', hreflang: 'x-default', href: baseUrl },
    ]
  }
})

useHead(siteData)

// Dynamically change html lang attribute
watch(locale, (newLocale) => {
  document.documentElement.setAttribute('lang', newLocale)
}, { immediate: true })
</script>

<style>
/* Styles will be in style.css */
</style>