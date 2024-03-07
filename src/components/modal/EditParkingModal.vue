<script setup>

import { ref } from 'vue'
import { ParkingDto } from '@/data/structures.ts'
import GoogleMapSelector from '@/components/map/GoogleMapSelector.vue'
import { buildId } from '@/scripts/html_scripts.js'

const props = defineProps({
  data: {
    type: ParkingDto,
    required: true
  }
})

const id = ref()
const parkingName = ref(props.data.parking_name)
const owner = ref()
const address = ref()
const capacity = ref()
const coordinates = ref()

</script>

<template>
  <div class="modal fade" id="editParkingInfoModal" data-bs-backdrop="static" data-bs-keyboard="false"
       tabindex="-1" aria-labelledby="editParkingInfoModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
      <form class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="editParkingInfoModalLabel">
            <span>Edit </span>
            <span class="fw-bolder">{{parkingName + ' '}}</span>
            <span>info</span>
          </h1>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <GoogleMapSelector :id="buildId(data.id)" :marker="data.coordinates" clazz="bd-placeholder-img map-rectangle rounded-1"></GoogleMapSelector>
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
                       placeholder="address" value="{value}" required>
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
                       placeholder="capacity" min="0" value="100" required>
                <label for="carCapacity-inputGroup">Capacity</label>
                <div id="carCapacityHelp" class="form-text mx-1">
                  <span>Please enter parking </span>
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
