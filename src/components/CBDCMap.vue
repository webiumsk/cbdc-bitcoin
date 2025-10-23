<template>
  <div class="section cbdc-map-container">
    <!-- Loading -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading CBDC data...</p>
    </div>

    <!-- Map -->
    <template v-if="!loading">
      <h2>🌍 CBDC World Tracker</h2>

      <!-- Stats -->
      <div class="stats-grid">
        <div 
          class="stat-card all"
          :class="{ active: filterStatus === 'all' }"
          @click="filterStatus = 'all'"
        >
          <div class="stat-icon">🌍</div>
          <div class="stat-number">{{ stats.launched + stats.pilot + stats.development + stats.research + stats.cancelled }}</div>
          <div class="stat-label">{{ t('map.all') }}</div>
        </div>
        <div 
          class="stat-card launched"
          :class="{ active: filterStatus === 'launched' }"
          @click="filterStatus = 'launched'"
        >
          <div class="stat-icon">🔴</div>
          <div class="stat-number">{{ stats.launched }}</div>
          <div class="stat-label">{{ t('map.launched') }}</div>
        </div>
        <div 
          class="stat-card pilot"
          :class="{ active: filterStatus === 'pilot' }"
          @click="filterStatus = 'pilot'"
        >
          <div class="stat-icon">🟠</div>
          <div class="stat-number">{{ stats.pilot }}</div>
          <div class="stat-label">{{ t('map.pilot') }}</div>
        </div>
        <div 
          class="stat-card development"
          :class="{ active: filterStatus === 'development' }"
          @click="filterStatus = 'development'"
        >
          <div class="stat-icon">🟡</div>
          <div class="stat-number">{{ stats.development }}</div>
          <div class="stat-label">{{ t('map.development') }}</div>
        </div>
        <div 
          class="stat-card research"
          :class="{ active: filterStatus === 'research' }"
          @click="filterStatus = 'research'"
        >
          <div class="stat-icon">🔵</div>
          <div class="stat-number">{{ stats.research }}</div>
          <div class="stat-label">{{ t('map.research') }}</div>
        </div>
        <div 
          class="stat-card cancelled"
          :class="{ active: filterStatus === 'cancelled' }"
          @click="filterStatus = 'cancelled'"
        >
          <div class="stat-icon">🔵</div>
          <div class="stat-number">{{ stats.cancelled }}</div>
          <div class="stat-label">{{ t('map.cancelled') }}</div>
        </div>
      </div>
    </template>

    <!-- Map Container -->
    <div v-if="!loading" id="map" ref="mapContainer"></div>

    <!-- Info Panel -->
    <div v-if="selectedCountry" class="info-panel">
      <button class="close-btn" @click="selectedCountry = null">×</button>
      
      <div class="country-header">
        <span class="flag">{{ selectedCountry.flag }}</span>
        <div>
          <h3>{{ selectedCountry.name }}</h3>
          <p class="population">{{ formatPopulation(selectedCountry.population) }} people</p>
        </div>
      </div>

      <div class="cbdc-name">
        <h4>{{ selectedCountry.cbdcName }}</h4>
        <div class="status-badges">
          <span :class="['status-badge', selectedCountry.status]">
            {{ getStatusLabel(selectedCountry.status) }}
          </span>
          <span :class="['risk-badge', selectedCountry.riskLevel]">
            {{ selectedCountry.riskLevel.toUpperCase() }} RISK
          </span>
        </div>
        <p v-if="selectedCountry.launchedYear" class="year">
          {{ selectedCountry.status === 'launched' ? 'Launched' : 'Since' }}: {{ selectedCountry.launchedYear }}
        </p>
      </div>

      <p class="description">{{ selectedCountry.description }}</p>

      <div class="section-tracker">
        <h5>✅ Features</h5>
        <ul>
          <li v-for="feature in selectedCountry.features" :key="feature">{{ feature }}</li>
        </ul>
      </div>

      <div class="section-tracker threats">
        <h5>⚠️ Privacy Threats</h5>
        <ul>
          <li v-for="threat in selectedCountry.threats" :key="threat">&nbsp;{{ threat }}</li>
        </ul>
      </div>

      <a v-if="selectedCountry.url" :href="selectedCountry.url" target="_blank" rel="noopener" class="official-link">
        Official Website →
      </a>
    </div>

    <!-- Last Updated -->
    <div v-if="!loading" class="last-updated">{{ t('map.lastUpdated') }}: {{ lastUpdated }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const loading = ref(true)
const mapContainer = ref(null)
const selectedCountry = ref(null)
const countries = ref([])
const stats = ref({ launched: 0, pilot: 0, development: 0, research: 0, cancelled: 0 })
const lastUpdated = ref('')
const filterStatus = ref('all')
let map = null
let markers = []

const statusColors = {
  launched: '#ef4444',
  pilot: '#f97316',
  development: '#eab308',
  research: '#3b82f6',
  cancelled: '#9ca3af'
}

const getStatusLabel = (status) => {
  const labels = {
    launched: 'Launched',
    pilot: 'Pilot/Testing',
    development: 'Development',
    research: 'Research',
    cancelled: 'Cancelled'
  }
  return labels[status]
}

const formatPopulation = (pop) => {
  if (pop >= 1000000000) return (pop / 1000000000).toFixed(1) + 'B'
  if (pop >= 1000000) return (pop / 1000000).toFixed(1) + 'M'
  if (pop >= 1000) return (pop / 1000).toFixed(0) + 'K'
  return pop.toString()
}

const filteredCountries = computed(() => {
  if (filterStatus.value === 'all') return countries.value
  return countries.value.filter(c => c.status === filterStatus.value)
})

const loadData = async () => {
  try {
    const response = await fetch('/cbdc-data.json')
    const data = await response.json()
    
    countries.value = data.countries
    stats.value = data.statistics
    lastUpdated.value = data.lastUpdated
    loading.value = false
    
    setTimeout(initMap, 100)
  } catch (error) {
    console.error('Error loading CBDC data:', error)
    loading.value = false
  }
}

const initMap = () => {
  if (!mapContainer.value) return

  map = L.map(mapContainer.value, {
    center: [20, 0],
    zoom: 2,
    minZoom: 2,
    maxZoom: 6,
    scrollWheelZoom: false // Disabled by default
  })

  // Create and add scroll hint
  const hint = document.createElement('div')
  hint.className = 'scroll-hint'
  hint.innerHTML = '🖱️ Use CTRL + scroll to zoom'
  mapContainer.value.appendChild(hint)

  let hintTimeout = null

  // Enable zoom on CTRL + scroll
  map.on('wheel', (e) => {
    if (e.originalEvent.ctrlKey || e.originalEvent.metaKey) {
      map.scrollWheelZoom.enable()
      hint.classList.remove('show')
      if (hintTimeout) clearTimeout(hintTimeout)
    } else {
      map.scrollWheelZoom.disable()
      
      // Display hint
      hint.classList.add('show')
      if (hintTimeout) clearTimeout(hintTimeout)
      hintTimeout = setTimeout(() => {
        hint.classList.remove('show')
      }, 2000)
    }
  })

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '©OpenStreetMap, ©CartoDB',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map)

  updateMarkers()
}

const updateMarkers = () => {
  if (!map) return

  // Remove existing markers
  markers.forEach(marker => map.removeLayer(marker))
  markers = []

  // Add new markers
  filteredCountries.value.forEach(country => {
    const color = statusColors[country.status]
    
    const marker = L.circleMarker([country.lat, country.lng], {
      radius: getMarkerSize(country.population),
      fillColor: color,
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(map)

    marker.on('click', () => { selectedCountry.value = country })
    marker.bindTooltip(`<b>${country.flag} ${country.name}</b><br>${country.cbdcName}`, { direction: 'top' })
    markers.push(marker)
  })
}

const getMarkerSize = (population) => {
  if (population >= 1000000000) return 20
  if (population >= 100000000) return 15
  if (population >= 10000000) return 10
  return 8
}

onMounted(() => loadData())
onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})

// Watch for filter changes
watch(filterStatus, () => {
  updateMarkers()
})
</script>

<style scoped>
/* Base */
.cbdc-map-container { 
  width: 100%; 
  min-height: 100vh; 
  background: linear-gradient(135deg, #1a1a2e, #16213e); 
  padding: 40px 0; 
  position: relative; 
}

/* Loading */
.loading { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center; 
  height: 80vh; 
  color: #f39c12; 
}
.spinner { 
  border: 4px solid rgba(243,156,18,0.3); 
  border-top: 4px solid #f39c12; 
  border-radius: 50%; 
  width: 50px; 
  height: 50px; 
  animation: spin 1s linear infinite; 
  margin-bottom: 20px; 
}
@keyframes spin { 
  0% { transform: rotate(0deg); } 
  100% { transform: rotate(360deg); } 
}

/* Main Title */
.cbdc-map-container > h2 { 
  font-size: 3rem; 
  text-transform: uppercase;
  margin: 0 auto 40px; 
  text-align: center; 
  color: #f39c12; 
  max-width: 1200px;
  padding: 0 20px;
}

/* Stats */
.stats-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
  gap: 15px; 
  max-width: 1200px; 
  margin: 0 auto 40px; 
  padding: 0 20px;
}
.stat-card { 
  background: rgba(255,255,255,0.05); 
  border-radius: 10px; 
  padding: 20px; 
  text-align: center; 
  border: 2px solid; 
  transition: all 0.3s; 
  cursor: pointer;
  user-select: none;
}
.stat-card:hover { 
  transform: translateY(-5px) scale(1.03); 
  box-shadow: 0 8px 25px rgba(243, 156, 18, 0.3);
}
.stat-card.active {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(243, 156, 18, 0.5);
  background: rgba(243, 156, 18, 0.15);
}
.stat-card.all { border-color: #f39c12; }
.stat-card.all.active { border-color: #f39c12; box-shadow: 0 10px 30px rgba(243, 156, 18, 0.6); }
.stat-card.launched { border-color: #ef4444; }
.stat-card.launched.active { border-color: #ef4444; box-shadow: 0 10px 30px rgba(239, 68, 68, 0.6); }
.stat-card.pilot { border-color: #f97316; }
.stat-card.pilot.active { border-color: #f97316; box-shadow: 0 10px 30px rgba(249, 115, 22, 0.6); }
.stat-card.development { border-color: #eab308; }
.stat-card.development.active { border-color: #eab308; box-shadow: 0 10px 30px rgba(234, 179, 8, 0.6); }
.stat-card.research { border-color: #3b82f6; }
.stat-card.research.active { border-color: #3b82f6; box-shadow: 0 10px 30px rgba(59, 130, 246, 0.6); }
.stat-card.cancelled { border-color: #9ca3af; }
.stat-card.cancelled.active { border-color: #9ca3af; box-shadow: 0 10px 30px rgba(156, 163, 175, 0.6); }
.stat-icon { 
  font-size: 2rem; 
  margin-bottom: 10px; 
}
.stat-number { 
  font-size: 2.5rem; 
  font-weight: bold; 
  color: #fff; 
  margin-bottom: 5px; 
}
.stat-label { 
  font-size: 0.9rem; 
  color: #bdc3c7; 
}

/* Map */
#map { 
  width: 100%; 
  max-width: 100%; 
  height: 600px; 
  margin: 0; 
  border: none;
  border-radius: 0; 
  box-shadow: none;
  position: relative;
}

/* Scroll Hint */
.scroll-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 15px 25px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  z-index: 1000;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(5px);
  border: 2px solid #f39c12;
  box-shadow: 0 5px 20px rgba(243, 156, 18, 0.4);
}

.scroll-hint.show {
  opacity: 1;
}

/* Info Panel */
.info-panel {
  position: fixed; 
  top: 50%; 
  right: 20px; 
  transform: translateY(-50%);
  width: 400px; 
  max-height: 80vh; 
  overflow-y: auto;
  background: linear-gradient(135deg, #16213e, #0f3460);
  border: 2px solid #f39c12; 
  border-radius: 15px; 
  padding: 25px;
  color: #fff; 
  box-shadow: 0 10px 40px rgba(0,0,0,0.5); 
  z-index: 1000;
}
.close-btn { 
  position: sticky; 
  top: -10px; 
  float: right;
  margin: -10px -10px 10px 10px;
  background: rgba(239,68,68,0.8); 
  border: none; 
  color: #fff; 
  font-size: 2rem; 
  width: 40px; 
  height: 40px; 
  border-radius: 50%; 
  cursor: pointer; 
  transition: all 0.3s;
  z-index: 10;
}
.close-btn:hover { 
  background: #ef4444; 
  transform: rotate(90deg); 
}

/* Country Header in panel */
.country-header { 
  display: flex; 
  align-items: center; 
  gap: 15px; 
  margin-bottom: 20px; 
}
.country-header h3 { 
  font-size: 1.5rem; 
  margin: 0; 
  color: #f39c12; 
}
.flag { 
  font-size: 3rem; 
}
.population { 
  font-size: 0.9rem; 
  color: #bdc3c7; 
  margin: 5px 0 0; 
}

/* CBDC Details */
.cbdc-name h4 { 
  font-size: 1.3rem; 
  color: #ecf0f1; 
  margin-bottom: 10px; 
}
.status-badges { 
  display: flex; 
  gap: 10px; 
  margin-bottom: 10px; 
  flex-wrap: wrap;
}
.status-badge, .risk-badge { 
  padding: 5px 12px; 
  border-radius: 20px; 
  font-size: 0.75rem; 
  font-weight: bold; 
}
.status-badge.launched { background: #ef4444; color: #fff; }
.status-badge.pilot { background: #f97316; color: #fff; }
.status-badge.development { background: #eab308; color: #000; }
.status-badge.research { background: #3b82f6; color: #fff; }
.status-badge.cancelled { background: #9ca3af; color: #000; } 
.risk-badge.extreme { background: #dc2626; color: #fff; }
.risk-badge.high { background: #f97316; color: #fff; }
.risk-badge.medium { background: #eab308; color: #000; }
.risk-badge.low { background: #10b981; color: #fff; }
.year { 
  font-size: 0.9rem; 
  color: #bdc3c7; 
  margin: 5px 0 0; 
}
.description { 
  font-size: 1rem; 
  line-height: 1.6; 
  color: #ecf0f1; 
  margin: 20px 0; 
}

/* Sections */
.section-tracker { 
  margin: 20px 0; 
  padding: 15px; 
}
.section-tracker h5 { 
  font-size: 1.1rem; 
  color: #f39c12; 
  margin-bottom: 10px; 
}
.section-tracker ul { 
  list-style: none; 
  padding: 0; 
  margin: 0; 
}
.section-tracker li { 
  padding: 8px 0 8px 25px; 
  position: relative; 
  font-size: 0.95rem; 
  color: #ecf0f1; 
  border-bottom: 1px solid rgba(255,255,255,0.1); 
}
.section-tracker li:before { 
  content: "•"; 
  position: absolute; 
  left: 10px; 
  color: #27ae60; 
}
.section-tracker.threats li:before { 
  content: "⚠️"; 
  font-size: 0.8rem; 
}

/* Links */
.official-link { 
  display: inline-block; 
  margin-top: 20px; 
  padding: 12px 25px; 
  background: #f39c12; 
  color: #000; 
  text-decoration: none; 
  border-radius: 8px; 
  font-weight: bold; 
  transition: all 0.3s; 
}
.official-link:hover { 
  background: #e67e22; 
  transform: translateY(-2px); 
}

/* Footer */
.last-updated { 
  text-align: center; 
  color: #bdc3c7; 
  font-size: 0.9rem; 
  margin-top: 30px; 
  padding: 0 20px;
}

/* Mobile */
@media (max-width: 768px) {
  .cbdc-map-container { padding: 20px 10px; }
  .cbdc-map-container > h2 { font-size: 1.8rem; }
  #map { height: 400px; border-radius: 10px; }
  .info-panel { 
    position: fixed; 
    top: auto; 
    bottom: 0; 
    right: 0; 
    left: 0; 
    width: 100%; 
    max-height: 70vh; 
    transform: none; 
    border-radius: 15px 15px 0 0; 
  }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>