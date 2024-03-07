<script setup>
import { onBeforeMount, ref, watch } from 'vue'
import { addMarker, initMapSelector, processMarkerSwap } from '@/scripts/map_scripts.js'
import { mapHolder } from '@/assets/config/google_map_config.js'

const props = defineProps({
  id: {
    required: true
  },
  clazz: {
    required: false,
    default: 'bd-placeholder-img map-card rounded-start-top'
  },
  marker: {}
})

const latLng = ref({})

initMapSelector(props.id, props.marker, latLng)

watch(latLng, (o, n) => {
  console.log(`old is: "${o}" new is: "${n}"`)
})
</script>

<template>
  <div :id="id" :class="clazz"></div>
</template>

<style scoped>
@import '@/assets/main.css';
</style>
