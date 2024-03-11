<script setup>

import { onMounted, ref, watch } from 'vue'
import { buildId, setValid, validateInput } from '@/scripts/html_scripts.js'
import LogoutModal from '@/components/modal/LogoutModal.vue'
import ParkingCardComponent from '@/components/parking/ParkingCardComponent.vue'
import { fetchParkingList } from '@/scripts/parking_scripts.js'
import { PaginationDataHolder, ParkingResponseHolder, SearchDto } from '@/data/structures.ts'
import { checkErrorResponse } from '@/scripts/rest_scripts.js'
import CreateParkingModal from '@/components/modal/CreateParkingModal.vue'
import ParkingTopComponent from '@/components/page/ParkingTopComponent.vue'
import PaginationBar from '@/components/page/PaginationBar.vue'
import gsap from 'gsap'

const c_modal_id = ref(buildId())
const c_modal_key = ref(0)

const selectedSearchType = ref('street')
const searchFieldPlaceholder = ref('')
const searchedText = ref('')
const dataResponse = ref(new ParkingResponseHolder(null, {
  body: [],
  limit: 0,
  page: 1,
  total_rows: 0,
  total_pages: 1
}))
const pagination = ref(PaginationDataHolder.empty())

watch(selectedSearchType, () => matchSearchPlaceholder(), { immediate: true })

function matchSearchPlaceholder() {
  if (selectedSearchType.value === 'street') {
    searchFieldPlaceholder.value = 'Search by street name'
  } else if (selectedSearchType.value === 'owner') {
    searchFieldPlaceholder.value = 'Search by owner name'
  }
}

function searchSubmit() {
  validateInput('searchField')
}

onMounted(getParkingList)

async function reloadData() {
  await refresh()
  c_modal_key.value += 1
}

async function getParkingList() {
  dataResponse.value = await fetchParkingList(new SearchDto(pagination.value.limit, pagination.value.page, searchedText.value, null))
  checkErrorResponse(dataResponse.value.error, 'Failed to load parking list')
  pagination.value = PaginationDataHolder.of(dataResponse.value)
}

async function refresh() {
  await getParkingList()
  scrollToTop()
}

function remove(data) {
  const i = dataResponse.value.data.body.indexOf(data)
  if (i > -1) {
    dataResponse.value.data.body.splice(i, 1)
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'auto'
  });
}

function onBeforeEnter(el) {
  el.style.opacity = 0
}

function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    delay: el.dataset.index * 0.15,
    onComplete: done,
  })
}

function onLeave(el, done) {
  gsap.to(el, {
    opacity: 0,
    duration: 0.1,
    onComplete: done,
  })
}
</script>

<template>
  <ParkingTopComponent></ParkingTopComponent>

  <div class="container my-3 mx-auto border border-2 border-dark-subtle rounded-4">
    <div class="container border-bottom border-dark-subtle my-3 rounded-top-3 header-background">
      <p id="descriptionText" class="my-auto text-center fs-3 fw-bold">Parking list</p>
    </div>

    <div class="search-bar-holder">
      <form @submit.prevent="searchSubmit" class="row g-lg-2 align-items-center mx-auto" id="searchForm">
        <div class="col col-auto">
          <select class="form-select" id="searchColumnSelect" name="searchColumnSelect" v-model="selectedSearchType">
            <option value="owner">Owner name</option>
            <option value="street">Street name</option>
          </select>
        </div>
        <div class="col">
          <div class="input-group">
            <input class="form-control" id="searchField" name="searchedText" :placeholder="searchFieldPlaceholder"
                   v-model="searchedText" @click="setValid('searchField')">
          </div>
        </div>
        <div class="col col-auto">
          <button id="searchFromSubmitButton" type="submit" class="btn btn-primary">Search</button>
        </div>
        <div class="col col-auto">
          <button id="addRowSearchBarButton" class="btn btn-success" data-bs-toggle="modal" type="button"
                  :data-bs-target="'#' + c_modal_id">Add row
          </button>
        </div>
      </form>
    </div>

    <TransitionGroup appear
                     name="fade"
                     tag="div"
                     class="container-fluid filial-card-holder border border-1 border-dark-subtle rounded-3"
                     :css="false"
    >
      <!--                     @before-enter="onBeforeEnter"-->
      <!--                     @enter="onEnter"-->
      <!--                     @leave="onLeave"-->
      <ParkingCardComponent :data="data" v-for="data in dataResponse.data.body" :key="data.id"
                            @self-remove="remove(data)"></ParkingCardComponent>
    </TransitionGroup>

    <PaginationBar v-model="pagination" @page-select="refresh"></PaginationBar>
    <LogoutModal></LogoutModal>
    <CreateParkingModal :key="c_modal_key" :id="c_modal_id" @reload-data="reloadData"></CreateParkingModal>
  </div>
</template>

<style scoped>
@import '@/assets/main.css';
</style>
