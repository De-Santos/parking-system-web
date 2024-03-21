<script setup>

import { buildId } from '@/scripts/html_scripts.js'
import { ref } from 'vue'
import { CarDto } from '@/data/structures.ts'
import { checkErrorResponse } from '@/scripts/rest_scripts.js'
import { useToast } from 'vue-toastification'
import { saveCar } from '@/scripts/car_scripts.js'
import { formatDate } from '@/scripts/time_scripts.js'

const props = defineProps({
  id: {
    required: true,
    default: buildId('default')
  },
  parking_id: {
    required: true
  }
})
const emit = defineEmits(['reload-data', 'self-refresh'])
const toast = useToast()

const vrp = ref('')
const arrived = ref()
const expiration = ref()

function selfRefresh() {
  emit('self-refresh')
}

async function createCar() {
  const dto = new CarDto(
    null,
    vrp.value,
    formatDate(new Date(arrived.value)),
    formatDate(new Date(expiration.value)),
    +props.parking_id
  )
  const response = await saveCar(dto)
  checkErrorResponse(response.error, "Failed to create car entry")
  if (response.error === null) {
    toast.success('New car entry has been created')
    emit('reload-data')
  }
}

</script>

<template>
  <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="addCarEntryModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <form class="modal-content" autocomplete="off" @submit.prevent="createCar">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="addCarEntryModalLabel">Add car entry</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                  @click="selfRefresh"></button>
        </div>
        <div class="modal-body">
          <div>
            <div class="container my-3">
              <div class="input-group">
                <div class="form-floating">
                  <input type="text" class="form-control" id="id-inputGroup" placeholder="Id" disabled>
                  <label for="id-inputGroup">Id</label>
                  <div id="IdHelp" class="form-text mx-1">
                    <span>Entry Id. </span>
                    <span class="fw-bolder">Auto incremented.</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="container my-3">
              <div class="input-group">
                <div class="form-floating">
                  <input type="text" class="form-control" id="vpr-inputGroup" placeholder="VRP" v-model="vrp">
                  <label for="vpr-inputGroup">VPR</label>
                  <div id="VRPHelp" class="form-text mx-1">
                    Please write vehicle registration plate.
                  </div>
                </div>
              </div>
            </div>
            <div class="container-sm my-3">
              <label for="floatingInputGroup2" class="form-label mx-1">Arrived</label>
              <input type="datetime-local" class="form-control" id="floatingInputGroup2" placeholder="Arrived"
                     v-model="arrived">
            </div>
            <div class="container my-3">
              <label for="floatingInputGroup2" class="form-label mx-1">Expiration</label>
              <input type="datetime-local" class="form-control" id="floatingInputGroup2" placeholder="Expiration"
                     v-model="expiration">
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
