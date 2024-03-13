<script setup>

import ParkingTopComponent from '@/components/page/ParkingTopComponent.vue'
import 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js'
import EditParkingModal from '@/components/modal/parking/EditParkingModal.vue'
import { onBeforeMount, ref, watch } from 'vue'
import { buildId } from '@/scripts/html_scripts.js'
import { fetchParking } from '@/scripts/parking_scripts.js'
import { checkErrorResponse } from '@/scripts/rest_scripts.js'
import GoogleMap from '@/components/map/GoogleMap.vue'
import { CarResponseHolder, PaginationDataHolder, SearchDto } from '@/data/structures.ts'
import { fetchCarList } from '@/scripts/car_scripts.js'
import { formatDateTime } from '@/scripts/time_scripts.js'
import CreateCarModal from '@/components/modal/car/CreateCarModal.vue'
import DeleteCarModal from '@/components/modal/car/DeleteCarModal.vue'
import EditCarModal from '@/components/modal/car/EditCarModal.vue'

const props = defineProps({
  id: {
    required: true
  }
})

const _edit_id = ref(buildId())
const _create_id = ref(buildId())
const _delete_id = ref(buildId())
const show = ref(false)
const parking = ref({})
const googleMapKey = ref(0)
const createModalKey = ref(0)
const tbodyKey = ref(0)

const selectedSearchType = ref('id')
const searchFieldPlaceholder = ref('')
const searchedText = ref('')

const deleteCar = ref({})

const pagination = ref(PaginationDataHolder.empty())
const dataResponse = ref(new CarResponseHolder(null, {
  body: [],
  limit: 0,
  page: 1,
  total_rows: 0,
  total_pages: 1
}))

function rerenderGoogleMap() {
  googleMapKey.value += 1
}

function rerenderCreateModal() {
  createModalKey.value += 1
}

onBeforeMount(preloadData)
watch(parking, () => rerenderGoogleMap())
watch(selectedSearchType, () => matchSearchPlaceholder(), { immediate: true })

async function preloadData() {
  await loadParking()
  await loadCarList()
}

async function loadParking() {
  const parking_r = await fetchParking(props.id)
  checkErrorResponse(parking_r.error, 'Failed to delete car entry')
  if (parking_r.error === null) {
    parking.value = parking_r.data
    show.value = true
  }
}

async function loadCarList() {
  dataResponse.value = await fetchCarList(new SearchDto(10, pagination.value.page, searchedText.value, props.id, selectedSearchType.value))
  checkErrorResponse(dataResponse.value.error, 'Failed to load car list')
  pagination.value = PaginationDataHolder.of(dataResponse.value)
}

async function reloadData() {
  await loadCarList()
  rerenderCreateModal()
}

function remove(data) {
  const i = dataResponse.value.data.body.indexOf(data)
  if (i > -1) {
    dataResponse.value.data.body.splice(i, 1)
  }
}

function setCar(car) {
  deleteCar.value = car
}

function refreshTable() {
  tbodyKey.value += 1
}

function update(upd, data) {
  const i = dataResponse.value.data.body.indexOf(data)
  dataResponse.value.data.body[i] = upd
  refreshTable()
}

function matchSearchPlaceholder() {
  if (selectedSearchType.value === 'id') {
    searchFieldPlaceholder.value = 'Search by id'
  } else if (selectedSearchType.value === 'vrp') {
    searchFieldPlaceholder.value = 'Search by vehicle registration plate'
  } else if (selectedSearchType.value === 'arrived') {
    searchFieldPlaceholder.value = 'Search by arrived time'
  } else if (selectedSearchType.value === 'expiration') {
    searchFieldPlaceholder.value = 'Search by expiration time'
  }
}

</script>

<template>
  <ParkingTopComponent></ParkingTopComponent>
  <div class="container my-3 mx-auto border border-2 border-dark-subtle rounded-4">
    <div class="mx-auto">
      <div class="container mx-0 my-2">
        <div class="my-auto d-inline-flex gap-3">
          <BButton v-b-toggle="'parking-info-collapse'" variant="primary" class="btn btn-primary" type="button"
                   data-bs-toggle="collapse"
                   aria-expanded="false" aria-controls="parking-info">
            About parking
          </BButton>
          <router-link to="/parking" type="button" class="btn btn-secondary">Back to filial</router-link>
          <button type="button" class="btn btn-success" data-bs-toggle="modal" :data-bs-target="`#${_edit_id}`">
            Edit filial
          </button>
        </div>
      </div>
    </div>

    <BCollapse class="collapse my-2 text-start lh-base" id="parking-info-collapse">
      <div class="card card-body">
        <div class="card-header my-auto">
          <p class="my-2 text-dark text-center fs-3 fw-bold">Parking info</p>
        </div>
        <div class="my-auto">
          <p class="fs-5 fw-normal my-1">
            <span class="text-secondary">Parking name: </span>
            <span class="text-black">{{ parking.parking_name }}</span>
          </p>
          <p class="fs-5 fw-normal my-1">
            <span class="text-secondary">Owner: </span>
            <span class="text-black">{{ parking.owner }}</span>
          </p>
          <p class="fs-5 fw-normal my-1">
            <span class="text-secondary">Address: </span>
            <span class="text-black">{{ parking.address }}</span>
          </p>
          <p class="fs-5 fw-normal my-1">
            <span class="text-secondary">Car capacity: </span>
            <span class="text-black">{{ parking.capacity }}</span>
          </p>
        </div>        <GoogleMap :id="buildId(parking.id)" :marker="parking.coordinates" :key="googleMapKey"
                   clazz="bd-placeholder-img map-collapse rounded rounded-2" :zoom="10"></GoogleMap>
      </div>
    </BCollapse>

    <div class="container table-container border border-1 border-dark-subtle rounded-2">
      <div class="container-fluid border-bottom border-dark-subtle my-3">
        <p id="tableDescriptionText" class="my-3 text-center fs-3 fw-bold">Cars table</p>
      </div>

      <div class="container-fluid select-container">
        <form class="row g-lg-2 align-items-center mx-auto" id="searchForm">
          <div class="col col-auto">
            <select class="form-select" id="searchColumnSelect" name="searchColumnSelect" v-model="selectedSearchType">
              <option value="id" selected>Id</option>
              <option value="vrp">VRP</option>
              <option value="arrived">Arrived</option>
              <option value="expiration">Expiration</option>
            </select>
          </div>
          <div class="col">
            <div class="input-group">
              <input class="form-control" id="searchField" name="searchedText" :placeholder="searchFieldPlaceholder"
                     v-model="searchedText">
            </div>
          </div>
          <div class="col col-auto">
            <button id="searchFromSubmitButton" type="submit" class="btn btn-primary">Search</button>
          </div>
          <div class="col col-auto">
            <button id="addRowSearchBarButton" class="btn btn-success" data-bs-toggle="modal" type="button"
                    :data-bs-target="`#${_create_id}`">Add row
            </button>
          </div>
        </form>
      </div>

      <div class="table-responsive table-data-container">
        <table class="table table-secondary table-striped table-embedded"
               aria-describedby="tableDescriptionText">
          <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Vehicle registration plate</th>
            <th scope="col">Arrived</th>
            <th scope="col">Expiration</th>
            <th scope="col" class="text-center">Setting</th>
          </tr>
          </thead>
          <TransitionGroup appear name="fade" tag="tbody" :key="tbodyKey">
            <tr v-for="data in dataResponse.data.body" :key="data.id">
              <td>{{ data.id }}</td>
              <td>{{ data.vrp }}</td>
              <td>{{ formatDateTime(data.arrived) }}</td>
              <td>{{ formatDateTime(data.expiration) }}</td>
              <td>
                <div class="text-center">
                  <div class="d-inline-flex gap-2">
                    <button type="button" class="btn btn-success btn-sm" data-bs-toggle="modal"
                            :data-bs-target="`#edit-${data.id}`">edit
                    </button>
                    <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal"
                            :data-bs-target="`#${_delete_id}`" @click="setCar(data)">delete
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </TransitionGroup>
        </table>
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
    </div>
  </div>

  <CreateCarModal :id="_create_id" :parking_id="id" :key="createModalKey"
                  @reload-data="reloadData()"
                  @self-refresh="rerenderCreateModal()"></CreateCarModal>

  <EditCarModal v-for="data in dataResponse.data.body" :key="data.id"
                :id="`edit-${data.id}`" :data="data" @self-update="(upd) => update(upd, data)"></EditCarModal>

  <DeleteCarModal :id="_delete_id" v-model="deleteCar" @remove-entry="remove"></DeleteCarModal>

  <template v-if="show">
    <EditParkingModal :id="_edit_id" v-model="parking"></EditParkingModal>
  </template>

</template>

<style scoped>
@import '@/assets/main.css';
</style>
