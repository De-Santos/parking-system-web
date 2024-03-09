<script setup>
import GoogleMapSelector from '@/components/map/GoogleMapSelector.vue'
import { buildId } from '@/scripts/html_scripts.js'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { Coordinates, ParkingDto } from '@/data/structures.ts'
import { saveUpdatedParkingData } from '@/scripts/parking_scripts.js'
import { checkErrorResponse } from '@/scripts/rest_scripts.js'

defineProps({
  id: {
    required: true
  }
})
const emit = defineEmits(['reload-data'])

const map_id = buildId('new')
const zoom = ref(3)
const r_btn_id = ref(buildId())
const toast = useToast()

const parkingName = ref()
const owner = ref()
const address = ref()
const capacity = ref()
const coordinates = ref({lat: 0, lng: 0})

function resetMap() {
  toast.success("Map has been reset")
}

async function createParking() {
  const dto = new ParkingDto(
    null,
    parkingName.value,
    owner.value,
    address.value,
    capacity.value,
    new Coordinates(coordinates.value.lat, coordinates.value.lng),
    null, null
  )
  const response = await saveUpdatedParkingData(dto)
  checkErrorResponse(response.error, "Failed to create parking")
  if (response.error === null) {
    toast.success('New parking has been created')
    emit('reload-data')
  }
}

</script>

<template>
  <div :id="id" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false"
       tabindex="-1" aria-labelledby="createParkingInfoModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
      <form class="modal-content" autocomplete="off" @submit.prevent="createParking">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="createParkingInfoModalLabel">
            Create new parking
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <GoogleMapSelector :id="map_id" :rest_btn="r_btn_id" :add_marker="false"
                               :zoom="zoom" v-model="coordinates"
                               clazz="bd-placeholder-img map-rectangle rounded-1 my-2"></GoogleMapSelector>
            <div class="row align-items-end">
              <div class="col-3">
                <label for="latitudeInput" class="form-label">Latitude</label>
                <input id="latitudeInput" type="text" class="form-control" :value="coordinates.lat" disabled>
              </div>
              <div class="col-3">
                <label for="longitudeInput" class="form-label">Longitude</label>
                <input id="longitudeInput" type="text" class="form-control" :value="coordinates.lng" disabled>
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
          <button type="submit" class="btn btn-success" data-bs-dismiss="modal">Create</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/main.css';
</style>
