<script setup>

import { buildId } from '@/scripts/html_scripts.js'
import { deleteCar } from '@/scripts/car_scripts.js'
import { checkErrorResponse } from '@/scripts/rest_scripts.js'
import { useToast } from 'vue-toastification'

defineProps({
  id: {
    required: false,
    default: buildId('default')
  }
})
const emit = defineEmits(['remove-entry'])
const model = defineModel()

const toast = useToast()

async function remove() {
  const result = await deleteCar(model.value.id)
  checkErrorResponse(result.error, 'Failed to load parking data')
  if (result.error === null) {
    toast.success(`Car with id: ${model.value.id} has been removed`)
    emit('remove-entry', model.value)
  }
}

function close() {
  model.value = null
}

</script>

<template>
  <div class="modal fade" :id="id" data-bs-backdrop="static" data-bs-keyboard="false"
       tabindex="-1" aria-labelledby="deleteCarEntryModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="deleteCarEntryModalLabel">Delete entry ?</h1>
        </div>
        <div class="modal-body fw-semibold">
          <div class="container-fluid my-auto">
            <p class="text-start">Are you sure ?</p>
            <p class="text-start">
              <span>Do you want to </span>
              <span class="text-danger">delete </span>
              <span>this entry ?</span>
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="close">Close</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="remove">Yes, delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
