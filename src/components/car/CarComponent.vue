<script setup>
// function updateSearchInputFieldType() {
//   var selectedOption = this.value;
//   var inputField = document.getElementById('searchedText');
//
//   // Change input type and placeholder based on selected option
//   if (selectedOption === 'vrp') {
//     inputField.type = 'text';
//     inputField.placeholder = 'Search by vehicle registration plate';
//   } else if (selectedOption === 'id') {
//     inputField.type = 'number';
//     inputField.placeholder = 'Search by Id';
//   } else if (selectedOption === 'arrived' || selectedOption === 'expiration') {
//     inputField.type = 'date';
//     inputField.placeholder = 'Search by date';
//   }
//   // Add more conditions for other options as needed
// };
//
// document.getElementById('searchColumnSelect').addEventListener('change', updateSearchInputFieldType);
//
// // Call the function initially to set the initial input type and placeholder
// updateSearchInputFieldType();
//
// document.getElementById('searchForm').addEventListener('submit', function (event) {
//   var inputField = document.getElementById('searchedText');
//
//   // Validation logic
//   if (inputField.value.trim() === '') {
//     // If the input is empty, prevent form submission and add error class
//     inputField.classList.add('is-invalid');
//     event.preventDefault();
//   }
// });
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

const props = defineProps({
  id: {
    required: true
  }
})

const _edit_id = ref(buildId())
const _create_id = ref(buildId())
const show = ref(false)
const parking = ref({})
const googleMapKey = ref(0)
const createModalKey = ref(0)

const selectedSearchType = ref('id')
const searchFieldPlaceholder = ref('')
const searchedText = ref('')

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
  checkErrorResponse(parking_r.error, 'Failed to load parking data')
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


    <!-- ABOUT FILIATION -->
    <BCollapse class="collapse my-2 text-start lh-base" id="parking-info-collapse">
      <div class="card card-body">
        <!-- FILIATION CONTENT -->
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
        </div>
        <GoogleMap :id="buildId(parking.id)" :marker="parking.coordinates" :key="googleMapKey"
                   clazz="bd-placeholder-img map-collapse rounded rounded-2" :zoom="10"></GoogleMap>
      </div>
    </BCollapse>

    <!-- CAR LIST -->
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
          <TransitionGroup appear
                           name="fade"
                           tag="tbody"
          >
            <tr v-for="data in dataResponse.data.body" :key="data.id">
              <td>{{ data.id }}</td>
              <td>{{ data.vrp }}</td>
              <td>{{ formatDateTime(data.arrived) }}</td>
              <td>{{ formatDateTime(data.expiration) }}</td>
              <td>
                <div class="text-center">
                  <div class="d-inline-flex gap-2">
                    <button type="button" class="btn btn-success btn-sm" data-bs-toggle="modal"
                            data-bs-target="#editCarEntryModal">edit
                    </button>
                    <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal"
                            data-bs-target="#deleteCarEntryModal">delete
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

    <!-- Modal -->
    <div class="modal fade" id="deleteCarEntryModal" data-bs-backdrop="static" data-bs-keyboard="false"
         tabindex="-1" aria-labelledby="deleteCarEntryModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="deleteCarEntryModalLabel">Modal title</h1>
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
    <!-- Modal -->
    <div class="modal fade" id="editCarEntryModal" tabindex="-1" aria-labelledby="editCarEntryModalLabel"
         aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <form class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="editCarEntryModalLabel">Edit car entry</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div>
              <div class="container my-3">
                <div class="input-group">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="id-inputGroup" placeholder="Id"
                           value="1032324" disabled>
                    <label for="id-inputGroup">Id</label>
                    <div id="IdHelp" class="form-text mx-1">
                      Entry Id.
                    </div>
                  </div>
                </div>
              </div>
              <div class="container my-3">
                <div class="input-group">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="vpr-inputGroup" placeholder="VRP"
                           required>
                    <label for="vpr-inputGroup">VPR</label>
                    <div id="VRPHelp" class="form-text mx-1">
                      Please write vehicle registration plate.
                    </div>
                  </div>
                </div>
              </div>
              <div class="container-sm my-3">
                <label for="floatingInputGroup2" class="form-label mx-1">Arrived</label>
                <input type="datetime-local" class="form-control" id="floatingInputGroup2"
                       placeholder="Arrived" required>
              </div>
              <div class="container my-3">
                <label for="floatingInputGroup2" class="form-label mx-1">Expiration</label>
                <input type="datetime-local" class="form-control" id="floatingInputGroup2"
                       placeholder="Expiration" required>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button id="" type="button" class="btn btn-warning">Reset</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-success" data-bs-dismiss="modal">Save changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <CreateCarModal :id="_create_id" :parking_id="id" :key="createModalKey"
                  @reload-data="reloadData()"
                  @self-refresh="rerenderCreateModal()"></CreateCarModal>
  <template v-if="show">
    <EditParkingModal :id="_edit_id" v-model="parking"></EditParkingModal>
  </template>
</template>

<style scoped>
@import '@/assets/main.css';
</style>
