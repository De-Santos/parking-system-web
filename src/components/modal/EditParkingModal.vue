<script setup>

import { computed, onBeforeMount, ref} from 'vue'
import { Coordinates, UpdateParkingDto } from '@/data/structures.ts'
import GoogleMapSelector from '@/components/map/GoogleMapSelector.vue'
import { buildId, emulateClick } from '@/scripts/html_scripts.js'
import store from '@/vuex/index.js'
import { useToast } from 'vue-toastification'
import { saveUpdatedParkingData } from '@/scripts/parking_scripts.js'
import { checkErrorResponse } from '@/scripts/rest_scripts.js'

defineProps({
  _id: {
    required: true,
    default: buildId()
  }
})

const model = defineModel()

const title_id = ref(buildId())
const map_id = buildId(model.value.id)

const lat = computed(() => {
  return store.state.lat
})
const lng = computed(() => {
  return store.state.lng
})

const r_btn_id = ref(buildId())

const parkingName = ref()
const owner = ref()
const address = ref()
const capacity = ref()
const coordinates = ref()
const toast = useToast()

function setData() {
  parkingName.value = model.value.parking_name
  owner.value = model.value.owner
  address.value = model.value.address
  capacity.value = model.value.capacity
  coordinates.value = model.value.coordinates
}

onBeforeMount(() => {
  setData()
})

function resetData() {
  emulateClick(r_btn_id.value)
  setData()
  toast.success("Data has been reset")
}

function resetMap() {
  toast.success("Map has been reset")
}

async function saveData() {
  const dto = new UpdateParkingDto(
    model.value.id,
    parkingName.value,
    owner.value,
    address.value,
    capacity.value,
    new Coordinates(lat.value, lng.value)
  )
  const response = await saveUpdatedParkingData(dto)
  checkErrorResponse(response.error, "Failed to update parking")
  model.value = response.data
  toast.success("Changes has been saved")
}

</script>

<template>
  <div class="modal fade" :id="_id" data-bs-backdrop="static" data-bs-keyboard="false"
       tabindex="-1" :aria-labelledby="title_id" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
      <form class="modal-content" autocomplete="off">
        <div class="modal-header">
          <h1 class="modal-title fs-5" :id="title_id">
            <span>Edit </span>
            <span class="fw-bolder">{{ parkingName + ' ' }}</span>
            <span>info</span>
          </h1>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <GoogleMapSelector :id="map_id" :marker="coordinates" :rest_btn="r_btn_id"
                               clazz="bd-placeholder-img map-rectangle rounded-1 my-2"></GoogleMapSelector>
            <div class="row align-items-end">
              <div class="col-3">
                <label for="latitudeInput" class="form-label">Latitude</label>
                <input id="latitudeInput" type="text" class="form-control" :value="lat" disabled>
              </div>
              <div class="col-3">
                <label for="longitudeInput" class="form-label">Longitude</label>
                <input id="longitudeInput" type="text" class="form-control" :value="lng" disabled>
              </div>
              <div class="col-3">
                <button :id="r_btn_id" class="btn btn-danger" @click="resetMap">Reset map</button>
              </div>
            </div>
          </div>

          <div class="container my-3">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" class="form-control" id="parkingName-inputGroup" placeholder="parking_name"
                       v-model="parkingName" required>
                <label for="parkingName-inputGroup">Parking name</label>
                <div id="ownerHelp" class="form-text mx-1">
                  <span>Enter </span>
                  <span class="fw-bolder">parking name</span>
                  <span>.</span>
                </div>
              </div>
            </div>
          </div>

          <div class="container my-3">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" class="form-control" id="owner-inputGroup" placeholder="owner" v-model="owner" required>
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
                <input type="text" class="form-control" id="address-inputGroup" placeholder="address" v-model="address" required>
                <label for="address-inputGroup">Address</label>
                <div id="addressHelp" class="form-text mx-1">
                  <span>Enter </span>
                  <span class="fw-bolder">parking </span>
                  <span>address.</span>
                </div>
              </div>
            </div>
          </div>
          <div class="container my-3">
            <div class="input-group">
              <div class="form-floating">
                <input type="number" class="form-control" id="carCapacity-inputGroup"
                       placeholder="capacity" min="0" v-model="capacity" required>
                <label for="carCapacity-inputGroup">Capacity</label>
                <div id="carCapacityHelp" class="form-text mx-1">
                  <span>Enter parking </span>
                  <span class="fw-bolder">car capacity</span>
                  <span>.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-danger" @click="resetData">Reset</button>
          <button type="submit" class="btn btn-success" @click.prevent="saveData">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/main.css';
</style>
