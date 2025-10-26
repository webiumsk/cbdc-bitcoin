<template>
  <div class="youtube-lazy-container" ref="containerRef">
    <div v-if="!isLoaded" class="youtube-placeholder" @click="loadVideo">
      <img 
        :src="thumbnailUrl" 
        :alt="title"
        class="youtube-thumbnail"
        loading="lazy"
      >
      <div class="play-button">
        <svg viewBox="0 0 68 48" width="68" height="48">
          <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#f00"/>
          <path d="M45 24 27 14v20" fill="#fff"/>
        </svg>
      </div>
      <div v-if="showTitle" class="video-title">{{ title }}</div>
    </div>
    
    <iframe
      v-else
      :src="embedUrl"
      :title="title"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
      loading="lazy"
      class="youtube-iframe"
    ></iframe>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  videoId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'YouTube video'
  },
  autoload: {
    type: Boolean,
    default: false
  },
  showTitle: {
    type: Boolean,
    default: false
  },
  thumbnailQuality: {
    type: String,
    default: 'maxresdefault',
    validator: (value) => ['default', 'mqdefault', 'hqdefault', 'sddefault', 'maxresdefault'].includes(value)
  },
  params: {
    type: String,
    default: 'autoplay=1&rel=0&modestbranding=1'
  },
  noCookie: {
    type: Boolean,
    default: true
  }
})

const containerRef = ref(null)
const isLoaded = ref(false)
const observer = ref(null)

const thumbnailUrl = computed(() => 
  `https://img.youtube.com/vi/${props.videoId}/${props.thumbnailQuality}.jpg`
)

const embedUrl = computed(() => {
  const domain = props.noCookie ? 'youtube-nocookie.com' : 'youtube.com'
  return `https://www.${domain}/embed/${props.videoId}?${props.params}`
})

const loadVideo = () => {
  isLoaded.value = true
}

const setupIntersectionObserver = () => {
  if (!props.autoload || !containerRef.value) return

  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isLoaded.value) {
          loadVideo()
          observer.value?.disconnect()
        }
      })
    },
    {
      rootMargin: '50px',
      threshold: 0.1
    }
  )

  observer.value.observe(containerRef.value)
}

onMounted(() => {
  setupIntersectionObserver()
})

onUnmounted(() => {
  observer.value?.disconnect()
})
</script>

<style scoped>
.youtube-lazy-container {
  position: relative;
  width: 100%;
  max-width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.youtube-placeholder {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.youtube-placeholder:hover {
  transform: scale(1.02);
}

.youtube-placeholder:hover .play-button {
  transform: translate(-50%, -50%) scale(1.1);
}

.youtube-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  transition: all 0.3s ease;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.play-button svg {
  filter: grayscale(0%);
  transition: filter 0.2s ease;
}

.youtube-placeholder:hover .play-button svg {
  filter: grayscale(0%) brightness(1.2);
}

.video-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  z-index: 1;
}

.youtube-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .youtube-lazy-container {
    border-radius: 6px;
  }
  
  .video-title {
    font-size: 0.9rem;
    padding: 12px 15px;
  }
  
  .play-button svg {
    width: 56px;
    height: 40px;
  }
}
</style>