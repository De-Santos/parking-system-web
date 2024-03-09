<script setup>
import { initMapSelector } from '@/scripts/map_scripts.js'
import { ref } from 'vue'

const props = defineProps({
  id: {
    required: true
  },
  clazz: {
    required: false,
    default: 'bd-placeholder-img map-card rounded-start-top'
  },
  rest_btn: {
    required: true
  },
  add_marker: {
    required: false,
    default: true
  },
  zoom: {
    type: Number,
    required: false,
    default: 12
  }
})

const _zoom = ref(0)
_zoom.value = props.zoom

const model = defineModel()

initMapSelector(props.id, model, props.rest_btn, props.add_marker, _zoom.value)

</script>

<template>
  <div :id="id" :class="clazz"></div>
</template>

<style scoped>
@import '@/assets/main.css';
</style>
