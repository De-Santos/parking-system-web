<script setup>


import { deleteParking } from '@/scripts/modal_scripts.js'
import { buildId } from '@/scripts/html_scripts.js'
import { useToast } from 'vue-toastification'
import { checkErrorResponse } from '@/scripts/rest_scripts.js'

const props = defineProps({
  data: {
    required: true
  },
  id: {
    required: true,
    default: buildId('default')
  }
})

const toast = useToast()
const emit = defineEmits(['remove-card'])

async function processDelete() {
  const response = await deleteParking(props.data.id)
  checkErrorResponse(response.error, "Failed to delete parking")
  if (response.error === null) {
    emit('remove-card')
    toast.success("Parking has been deleted")
  }
}

</script>

<template>
  <div class="modal fade" :id="id" data-bs-backdrop="static" data-bs-keyboard="false"
       tabindex="-1" aria-labelledby="deleteParkingEntryModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="deleteParkingEntryModalLabel">Delete parking ?</h1>
        </div>
        <div class="modal-body fw-semibold">
          <div class="container-fluid my-auto">
            <p class="text-start">Are you sure ?</p>
            <p class="text-start">
              <span>Do you want to </span>
              <span class="text-danger">delete </span>
              <span>{{ data.parking_name }} ?</span>
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="processDelete">
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
