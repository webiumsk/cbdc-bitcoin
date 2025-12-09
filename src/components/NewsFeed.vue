<template>
  <div class="section news-feed">
    <h2>📰 {{ t('news.title') }}</h2>
    
    <div class="controls">
      <div class="toggle-group">
        <button 
          :class="['toggle-btn', { active: feedMode === 'local' }]"
          @click="feedMode = 'local'"
        >
          {{ t('news.localNews') }} ({{ currentLanguage }})
        </button>
        <button 
          :class="['toggle-btn', { active: feedMode === 'global' }]"
          @click="feedMode = 'global'"
        >
          {{ t('news.globalNews') }} (EN)
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">
      {{ t('news.loading') }}...
    </div>
    
    <div v-else-if="items.length === 0" class="no-news">
      <p>{{ t('news.noNewsFound') }}</p>
      <button @click="feedMode = 'global'" class="switch-btn">{{ t('news.switchToGlobal') }}</button>
    </div>
    
    <div v-else class="news-grid">
      <div v-for="(item, index) in displayItems" :key="index" class="news-card">
        <div class="news-date">{{ formatDate(item.pubDate) }}</div>
        <h3>
          <a :href="item.link" target="_blank" rel="noopener">{{ item.title }}</a>
        </h3>
        <div class="news-source">
          <span class="source-icon">📡</span> {{ item.source || t('news.sourceUnknown') }}
        </div>
        <p v-if="item.description" class="news-excerpt" v-html="cleanDescription(item.description)"></p>
        <a :href="item.link" target="_blank" rel="noopener" class="read-more">
          {{ t('news.readMore') }} →
        </a>
      </div>
    </div>
    
    <div class="actions" v-if="!loading && hasMore && items.length > 0">
      <button @click="loadMore" class="load-more-btn">{{ t('news.loadMore') }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const items = ref([])
const loading = ref(true)
const visibleCount = ref(3)
const feedMode = ref('local') // 'local' or 'global'

const currentLanguage = computed(() => locale.value.toUpperCase())

// Fallback news in case RSS fetch fails
const fallbackNews = [
  {
    title: "ECB moves to next phase of Digital Euro project",
    pubDate: "2024-11-01 10:00:00",
    link: "https://www.ecb.europa.eu/paym/digital_euro/html/index.en.html",
    source: "European Central Bank",
    description: "The preparation phase paves the way for the potential future issuance of a digital euro."
  },
  {
    title: "FED chair Powell on US CBDC: We are nowhere near recommending it",
    pubDate: "2024-03-07 14:00:00",
    link: "https://www.federalreserve.gov/central-bank-digital-currency.htm",
    source: "Federal Reserve",
    description: "Federal Reserve Chair Jerome Powell states that the US central bank is not close to adopting a CBDC."
  },
  {
    title: "BIS releases new report on CBDC interoperability",
    pubDate: "2024-11-25 11:00:00",
    link: "https://www.bis.org/publ/bppdf/bispap136.pdf",
    source: "BIS",
    description: "Bank for International Settlements discusses cross-border payment efficiency with CBDCs."
  }
]

const displayItems = computed(() => {
  return items.value.slice(0, visibleCount.value)
})

const hasMore = computed(() => {
  return visibleCount.value < items.value.length
})

const loadMore = () => {
  visibleCount.value += 3
}

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(locale.value, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  } catch (e) {
    return dateString
  }
}

const cleanDescription = (html) => {
  if (!html) return ''
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  const text = tmp.textContent || tmp.innerText || "";
  return text.length > 100 ? text.substring(0, 100) + '...' : text;
}

const getRssUrl = (lang, mode) => {
  const query = 'CBDC central bank digital currency'
  
  if (mode === 'global') {
    return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`
  }

  // Local configurations
  const configs = {
    sk: { hl: 'sk', gl: 'SK', ceid: 'SK:sk', q: 'CBDC digitálne euro' },
    cs: { hl: 'cs', gl: 'CZ', ceid: 'CZ:cs', q: 'CBDC digitální měna' },
    es: { hl: 'es', gl: 'ES', ceid: 'ES:es', q: 'CBDC euro digital' },
    de: { hl: 'de', gl: 'DE', ceid: 'DE:de', q: 'CBDC digitaler euro' },
    en: { hl: 'en-US', gl: 'US', ceid: 'US:en', q: query } // default to US for EN
  }

  const config = configs[lang] || configs['en']
  return `https://news.google.com/rss/search?q=${encodeURIComponent(config.q)}&hl=${config.hl}&gl=${config.gl}&ceid=${config.ceid}`
}

const fetchNews = async () => {
  loading.value = true
  items.value = [] // Reset items
  visibleCount.value = 3
  
  try {
    const rssUrl = getRssUrl(locale.value, feedMode.value)
    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`)
    const data = await res.json()
    
    if (data.status === 'ok' && data.items.length > 0) {
      items.value = data.items.map(item => ({
        title: item.title,
        pubDate: item.pubDate,
        link: item.link,
        source: item.author || 'Google News',
        description: item.description
      })).sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    } else {
      // If local returns nothing, don't throw error immediately to fallback, 
      // instead showing "No news found" UI might be better, OR fallback to global if it was local logic.
      // But for robustness, if network error -> fallback. If just empty -> empty list.
      if (data.status === 'ok') {
        items.value = []
      } else {
        throw new Error("RSS API Error")
      }
    }
  } catch (error) {
    console.error("Failed to fetch news, using fallback", error)
    // Only use fallback hardcoded news if we are in global mode or if local fails?
    // Let's use fallback news only if we are in Global mode or if user wants to see something.
    // Actually, fallback is better than empty error.
    items.value = fallbackNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
  } finally {
    loading.value = false
  }
}

// Watchers
watch([locale, feedMode], () => {
  // If locale changes, we might want to reset feedMode to local?
  // Or just existing mode with new locale?
  // Let's keep feedMode but if it is 'local', it fetches for new locale.
  fetchNews()
})

onMounted(() => {
  fetchNews()
})
</script>

<style scoped>
.news-feed {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
}

.news-feed h2 {
  font-size: 3rem;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #00d2ff, #3a7bd5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
}

.controls {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.toggle-group {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  padding: 5px;
  border-radius: 30px;
}

.toggle-btn {
  background: transparent;
  border: none;
  color: #ccc;
  padding: 8px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.toggle-btn.active {
  background: #3a7bd5;
  color: #fff;
}

.toggle-btn:hover:not(.active) {
  color: #fff;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  width: 100%;
}

.news-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 25px;
  border-radius: 12px;
  transition: transform 0.3s, background 0.3s;
  display: flex;
  flex-direction: column;
}

.news-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1);
  border-color: #3a7bd5;
}

.news-date {
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 10px;
}

.news-card h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  line-height: 1.4;
}

.news-card h3 a {
  color: #fff;
  text-decoration: none;
  transition: color 0.2s;
}

.news-card h3 a:hover {
  color: #00d2ff;
}

.news-source {
  font-size: 0.9rem;
  color: #ccc;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.news-excerpt {
  font-size: 1rem;
  color: #aaa;
  line-height: 1.5;
  margin-bottom: 20px;
  flex-grow: 1; /* Push read-more to bottom */
}

.read-more {
  display: inline-block;
  color: #00d2ff;
  text-decoration: none;
  font-weight: bold;
  margin-top: auto; /* Align to bottom */
}

.read-more:hover {
  text-decoration: underline;
}

.actions {
  margin-top: 40px;
  text-align: center;
}

.load-more-btn, .switch-btn {
  background: transparent;
  border: 2px solid #3a7bd5;
  color: #3a7bd5;
  padding: 10px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.switch-btn {
  margin-top: 20px;
}

.load-more-btn:hover, .switch-btn:hover {
  background: #3a7bd5;
  color: #fff;
}

.loading, .no-news {
  font-size: 1.2rem;
  color: #888;
  text-align: center;
  width: 100%;
  padding: 40px;
}
</style>
