<script setup>
import { initMap } from '@/scripts/map_scripts.js'

const props = defineProps({
  id: {
    required: true
  },
  clazz: {
    required: false,
    default: 'bd-placeholder-img map-card rounded-start-top'
  },
  marker: {
    required: true
  },
  map_control: {
    required: false,
    default: {
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: true,
      rotateControl: true,
      fullscreenControl: true
    }
  },
  zoom: {
    required: false,
    default: 15
  }
})

initMap(props.id, props.marker, props.map_control, props.zoom)

</script>

<template>
  <div :id="id" :class="clazz"></div>
</template>

<style scoped>
@import '@/assets/main.css';
</style>
