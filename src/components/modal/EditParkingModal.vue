<script setup>

import { computed, onBeforeMount, ref } from 'vue'
import { ParkingDto } from '@/data/structures.ts'
import GoogleMapSelector from '@/components/map/GoogleMapSelector.vue'
import { buildId } from '@/scripts/html_scripts.js'
import store from '@/vuex/index.js'

const props = defineProps({
  data: {
    type: ParkingDto,
    required: true
  },
  _id: {
    required: true,
    default: buildId()
  }
})

const title_id = ref(buildId())
const map_id = buildId(props.data.id)

// const lat_lng = ref({lat: 0, lng: 0})

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

function setData() {
  parkingName.value = props.data.parking_name
  owner.value = props.data.owner
  address.value = props.data.address
  capacity.value = props.data.capacity
  coordinates.value = props.data.coordinates

}

onBeforeMount(() => {
  setData()
})


</script>

<template>
  <div class="modal fade" :id="_id" data-bs-backdrop="static" data-bs-keyboard="false"
       tabindex="-1" :aria-labelledby="title_id" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
      <form class="modal-content">
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
                <button :id="r_btn_id" class="btn btn-danger">Reset map</button>
              </div>
            </div>
          </div>

          <div class="container my-3">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" class="form-control" id="owner-inputGroup" placeholder="owner"
                       value="{value}" required>
                <label for="owner-inputGroup">Parking name</label>
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
                <input type="text" class="form-control" id="owner-inputGroup" placeholder="owner"
                       value="{value}" required>
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
                       placeholder="address" :value="address" required>
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
                       placeholder="capacity" min="0" value="100" required>
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
          <button type="button" class="btn btn-danger">Reset</button>
          <button type="submit" class="btn btn-success">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/main.css';
</style>
