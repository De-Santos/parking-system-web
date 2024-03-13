<script setup>

import { buildId } from '@/scripts/html_scripts.js'
import { onBeforeMount, ref } from 'vue'
import { updateCar } from '@/scripts/car_scripts.js'
import { CarDto } from '@/data/structures.ts'
import { formatDate } from '@/scripts/time_scripts.js'
import { useToast } from 'vue-toastification'
import { checkErrorResponse } from '@/scripts/rest_scripts.js'

const props = defineProps({
  id: {
    required: true,
    default: buildId('default')
  },
  data: {
    required: true
  }
})
const emit = defineEmits(['self-update'])
const toast = useToast()

const vrp = ref('')
const arrived = ref()
const expiration = ref()

onBeforeMount(setData)

function setData() {

  vrp.value = props.data.vrp
  arrived.value = new Date(props.data.arrived).toISOString().slice(0, 19)
  expiration.value = new Date(props.data.expiration).toISOString().slice(0, 19)
}

function reset() {
  setData()
  toast.success('Data has been reset')
}

async function saveChanges() {
  const dto = new CarDto(
    props.data.id,
    vrp.value,
    formatDate(new Date(arrived.value)),
    formatDate(new Date(expiration.value)),
    null
  )

  const response = await updateCar(dto)
  checkErrorResponse(response.error, 'Failed to update car entry')
  if (response.error === null) {
    toast.success('Changes has been saved')
    emit('self-update', response.data)
  }
}

</script>

<template>
  <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="editCarEntryModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <form class="modal-content" autocomplete="off" @submit.prevent="saveChanges">
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
                         :value="data.id" disabled>
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
              <input type="datetime-local" class="form-control" id="floatingInputGroup2"
                     placeholder="Arrived" v-model="arrived">
            </div>
            <div class="container my-3">
              <label for="floatingInputGroup2" class="form-label mx-1">Expiration</label>
              <input type="datetime-local" class="form-control" id="floatingInputGroup2"
                     placeholder="Expiration" v-model="expiration">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button id="" type="button" class="btn btn-warning" @click="reset">Reset</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="submit" class="btn btn-success" data-bs-dismiss="modal">Save changes</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/main.css';
</style>
