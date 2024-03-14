<script setup>

import { range } from '@/scripts/scripts.js'
import { PaginationDataHolder } from '@/data/structures.ts'


defineProps({
  start: {
    required: false,
    default: 2
  },
  stop: {
    required: false,
    default: 20
  },
  step: {
    required: false,
    default: 4
  }
})
const model = defineModel({ type: PaginationDataHolder })
const emits = defineEmits(['page-select'])

const mdp = 3

const previousDisabled = () => {
  return model.value.page === 1
}

const nextDisabled = () => {
  return !(model.value.page < model.value.total_pages)
}

function isActive(page) {
  return model.value.page === page
}

function showEllipsisBefore(list) {
  if ((list[0] - 1) === 1) {
    return false
  }

  return (model.value.page - mdp) > 0 && (mdp + 1) !== model.value.total_pages
}

function showEllipsisAfter(list) {
  if (list.length <= 2 || (list[list.length - 1] + 1) === model.value.total_pages) {
    return false
  }
  return (model.value.total_pages - model.value.page) < 0 || (model.value.page + (mdp - 1)) < model.value.total_pages
}

function next() {
  model.value.page += 1
  refresh()
}

function prev() {
  model.value.page -= 1
  refresh()
}

function teleport(num) {
  console.log('hello from teleport')
  model.value.page = num
  refresh()
}

function refresh() {
  emits('page-select')
}

function changeLimit() {
  model.value.page = 1
  refresh()
}

function centerPage() {
  const pagesList = []
  for (let i = 2; i < model.value.total_pages; i++) {
    pagesList.push(i)
  }

  // Handle edge cases:
  if ((model.value.page - mdp) <= 0) {
    return pagesList.slice(0, mdp) // Return first maxFrame pages
  }
  if ((model.value.page + mdp) > model.value.total_pages) {
    return pagesList.slice(-mdp) // Return last maxFrame pages
  }

  // Select pages around the current page
  const frame = []
  for (const i of range(model.value.page - mdp, pagesList.length)) {
    if (frame.length === mdp) {
      break
    }
    frame.push(pagesList[i])
  }

  return frame
}

</script>

<template>
  <div class="row justify-content-end">
    <div class="col-auto align-content-end">
      <select class="form-select" aria-label="limit select" v-model="model.limit" @change="changeLimit">
        <option v-for="i in range(start, stop, step)" :value="i" :key="i">{{ i }}</option>
      </select>
    </div>
    <div class="col-auto">
      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-end">
          <li class="page-item" :class="{ disabled: previousDisabled() }">
            <button class="page-link" @click="prev">Previous</button>
          </li>
          <li class="page-item" :class="{ active: isActive(1)}">
            <button class="page-link" @click="teleport(1)">1</button>
          </li>
          <li class="page-item" v-if="showEllipsisBefore(centerPage())">
            <span class="page-link" disabled>...</span>
          </li>
          <li class="page-item" :class="{ active: isActive(p)}" v-for="p in centerPage()" :key="p">
            <button class="page-link" @click="teleport(p)">{{ p }}</button>
          </li>
          <li class="page-item" v-if="showEllipsisAfter(centerPage())">
            <span class="page-link" disabled>...</span>
          </li>
          <li class="page-item" :class="{ active: isActive(model.total_pages)}" v-if="model.total_pages !== 1">
            <button class="page-link" @click="teleport(model.total_pages)">{{ model.total_pages }}</button>
          </li>
          <li class="page-item" :class="{ disabled: nextDisabled() }">
            <button class="page-link" @click="next">Next</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/main.css';
</style>
