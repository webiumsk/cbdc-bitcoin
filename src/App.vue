<template>
  <div id="app">
    <LanguageSwitcher />
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

const { t, locale } = useI18n()
const route = useRoute()

const siteData = computed(() => {
  const baseUrl = 'https://cbdc.icu'
  const currentLocale = locale.value
  let url = baseUrl
  let ogLocale = 'sk_SK'
  
  if (currentLocale === 'en') {
    url = `${baseUrl}/en`
    ogLocale = 'en_US'
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
      { name: 'keywords', content: 'CBDC, Bitcoin, digitálne euro, ECB, finančná sloboda, decentralizácia, kryptomeny, digital euro, financial freedom, decentralization, cryptocurrency, euro digital, digitaler euro' },
      
      // Open Graph
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { property: 'og:title', content: t('meta.ogTitle') },
      { property: 'og:description', content: t('meta.ogDescription') },
      { property: 'og:image', content: 'https://cbdc.icu/cbdc-vs-btc.jpg' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: t('meta.imageAlt') },
      { property: 'og:locale', content: ogLocale },
      
      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:url', content: url },
      { name: 'twitter:title', content: t('meta.ogTitle') },
      { name: 'twitter:description', content: t('meta.ogDescription') },
      { name: 'twitter:image', content: 'https://cbdc.icu/cbdc-vs-btc.jpg' },
    ],
    link: [
      { rel: 'canonical', href: url },
      { rel: 'alternate', hreflang: 'sk', href: baseUrl },
      { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/en` },
      { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es` },
      { rel: 'alternate', hreflang: 'de', href: `${baseUrl}/de` },
      { rel: 'alternate', hreflang: 'x-default', href: baseUrl },
    ]
  }
})

useHead(siteData)
</script>

<style>
/* Styles will be in style.css */
</style>