<script setup>
import { initMapSelector } from '@/scripts/map_scripts.js'

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

initMapSelector(props.id, props.marker)

</script>

<template>
  <div :id="id" :class="clazz"></div>
</template>

<style scoped>
@import '@/assets/main.css';
</style>
