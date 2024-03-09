<script setup>

import { onBeforeMount, ref, watch } from 'vue'
import { setValid, validateInput } from '@/scripts/html_scripts.js'
import LogoutModal from '@/components/modal/LogoutModal.vue'
import ParkingCardComponent from '@/components/parking/ParkingCardComponent.vue'
import { fetchParkingList } from '@/scripts/parking_scripts.js'
import { ParkingResponseHolder, SearchDto } from '@/data/structures.ts'
import { useToast } from 'vue-toastification'
import { checkErrorResponse } from '@/scripts/rest_scripts.js'

const toast = useToast()
const selectedSearchType = ref('street')
const searchFieldPlaceholder = ref('')
const searchedText = ref('')
const limit = ref(10)
const page = ref(1)
const dataResponse = ref(new ParkingResponseHolder(null, {body: [], limit: 0, page: 0}))

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

async function getParkingList() {
  dataResponse.value = await fetchParkingList(new SearchDto(limit.value, page.value, searchedText.value))
  checkErrorResponse(dataResponse.value.error, "Failed to load parking list")
}
</script>

<template>
  <body>
  <div class="container mx-auto my-3 border border-success-subtle border-2 rounded-4">
    <nav class="navbar navbar-expand nav-fill" aria-label="main-footer-bar">
      <div class="container">
        <router-link class="navbar-brand" to="/parking"
                     style="--bs-navbar-brand-font-size: 1.5rem">Parking-system
        </router-link>
        <button type="button" class="btn btn-secondary btn-sm" data-bs-toggle="modal"
                data-bs-target="#staticLogoutBackdrop" style="--bs-btn-bg: #b5e1b7; --bs-btn-color: #000000">
          Logout
        </button>
      </div>
    </nav>
  </div>

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
          <button id="addRowSerchBarButton" class="btn btn-success" data-bs-toggle="modal" type="button"
                  data-bs-target="#createParkingInfoModal">Add row
          </button>
        </div>
      </form>
    </div>

    <div class="container-fluid filial-card-holder border border-1 border-dark-subtle rounded-3">
          <ParkingCardComponent :data="data" v-for="data in dataResponse.data.body" :key="data.id"/>
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

    <!-- Create parking modal -->
    <div class="modal fade" id="createParkingInfoModal" data-bs-backdrop="static" data-bs-keyboard="false"
         tabindex="-1" aria-labelledby="createParkingInfoModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
        <form class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="createParkingInfoModalLabel">
              Create new parking
            </h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <iframe title="map" class="bd-placeholder-img map-rectangle rounded-1"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d41226.4108465965!2d-122.42608631797496!3d37.76757124498742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808baa631dfb%3A0xf391028f0b2ff216!2sSFMTA%20-%20Union%20Square%20Garage!5e0!3m2!1sen!2sde!4v1708886338671!5m2!1sen!2sde"
                      loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>

            <div class="container my-3">
              <div class="input-group">
                <div class="form-floating">
                  <input type="text" class="form-control" id="owner-inputGroup" placeholder="owner"
                         required>
                  <label for="owner-inputGroup">Owner</label>
                  <div id="ownerHelp" class="form-text mx-1">
                    <span>Enter owner </span>
                    <span class="fw-bolder">full name</span>
                    <span>.</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="container my-3">
              <div class="input-group">
                <div class="form-floating">
                  <input type="text" class="form-control" id="address-inputGroup"
                         placeholder="address" required>
                  <label for="address-inputGroup">Address</label>
                  <div id="addressHelp" class="form-text mx-1">
                                        <span>
                                            Please enter
                                        </span>
                    <span class="fw-bolder">
                                            parking
                                        </span>
                    <span>
                                            address.
                                        </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="container my-3">
              <div class="input-group">
                <div class="form-floating">
                  <input type="number" class="form-control" id="carCapacity-inputGroup"
                         placeholder="capacity" min="0" required>
                  <label for="carCapacity-inputGroup">Capacity</label>
                  <div id="carCapacityHelp" class="form-text mx-1">
                                        <span>
                                            Please enter
                                        </span>
                    <span>
                                            parking
                                        </span>
                    <span class="fw-bolder">
                                            car capacity
                                        </span>
                    <span>
                                            .
                                        </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-success">Create</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Logout Modal -->
    <LogoutModal />

    <!-- Delete parking Modal -->
    <div class="modal fade" id="deleteParkingEntryModal" data-bs-backdrop="static" data-bs-keyboard="false"
         tabindex="-1" aria-labelledby="deleteParkingEntryModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="deleteParkingEntryModalLabel">Modal title</h1>
          </div>
          <div class="modal-body fw-semibold">
            <div class="container-fluid my-auto">
              <p class="text-start">Are you shure ?</p>
              <p class="text-start">
                <span>Do you want to </span>
                <span class="text-danger">delete </span>
                <span>this entry ?</span>
              </p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Yes, delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </body>
</template>

<style scoped>
@import '@/assets/main.css';
</style>
