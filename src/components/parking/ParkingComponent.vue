<script setup>

import { onBeforeMount, ref, watch } from 'vue'
import { buildId, setValid, validateInput } from '@/scripts/html_scripts.js'
import LogoutModal from '@/components/modal/LogoutModal.vue'
import ParkingCardComponent from '@/components/parking/ParkingCardComponent.vue'
import { fetchParkingList } from '@/scripts/parking_scripts.js'
import { ParkingResponseHolder, SearchDto } from '@/data/structures.ts'
import { useToast } from 'vue-toastification'
import { checkErrorResponse } from '@/scripts/rest_scripts.js'
import CreateParkingModal from '@/components/modal/CreateParkingModal.vue'
import ParkingTopComponent from '@/components/parking/ParkingTopComponent.vue'

const c_modal_id = ref(buildId())
const c_modal_key = ref(0)

const toast = useToast()
const selectedSearchType = ref('street')
const searchFieldPlaceholder = ref('')
const searchedText = ref('')
const limit = ref(10)
const page = ref(1)
const dataResponse = ref(new ParkingResponseHolder(null, { body: [], limit: 0, page: 0 }))

watch(selectedSearchType, () => matchSearchPlaceholder(), { immediate: true })

function matchSearchPlaceholder() {
  if (selectedSearchType.value === 'street') {
    searchFieldPlaceholder.value = 'Search by street name'
  } else if (selectedSearchType.value === 'owner') {
    searchFieldPlaceholder.value = 'Search by owner name'
  }
}

// TODO parse response and render parking cards
// TODO add exception handling
// TODO introduce modals to 'modals' package

function searchSubmit() {
  validateInput('searchField')
}

onBeforeMount(getParkingList)

async function reloadData() {
  await getParkingList()
  c_modal_key.value += 1
}

async function getParkingList() {
  dataResponse.value = await fetchParkingList(new SearchDto(limit.value, page.value, searchedText.value))
  checkErrorResponse(dataResponse.value.error, 'Failed to load parking list')
}

function remove(data) {
  const i = dataResponse.value.data.body.indexOf(data)
  if (i > -1) {
    dataResponse.value.data.body.splice(i, 1)
  }
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

    <div class="container-fluid filial-card-holder border border-1 border-dark-subtle rounded-3">
      <TransitionGroup>
        <ParkingCardComponent :data="data" v-for="data in dataResponse.data.body" :key="data.id" @self-remove="remove(data)"/>
      </TransitionGroup>
    </div>

    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-end">
        <li class="page-item disabled">
          <a class="page-link">Previous</a>
        </li>
        <li class="page-item"><a class="page-link" href="#">1</a></li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item">
          <a class="page-link" href="#">Next</a>
        </li>
      </ul>
    </nav>

    <LogoutModal></LogoutModal>
    <CreateParkingModal :key="c_modal_key" :id="c_modal_id" @reload-data="reloadData"></CreateParkingModal>
  </div>
</template>

<style scoped>
@import '@/assets/main.css';
</style>
