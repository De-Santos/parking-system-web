<script setup>
import { formatDateTime } from '@/scripts/time_scripts.js'
import GoogleMap from '@/components/map/GoogleMap.vue'
import EditParkingModal from '@/components/modal/EditParkingModal.vue'
import { buildId, buildSmallId } from '@/scripts/html_scripts.js'
import { ref, watch } from 'vue'
import DeleteParkingModal from '@/components/modal/DeleteParkingModal.vue'

const props = defineProps({
  data: {
    required: true
  }
})
const emit = defineEmits(['self-remove'])

const dataRef = ref(props.data)

const _edit_id = ref(buildId())
const _delete_id = ref(buildId())
const googleMapKey = ref(0)

function rerenderGoogleMap() {
  googleMapKey.value += 1
}

watch(dataRef, () => {
  rerenderGoogleMap()
})

function remove() {
  emit('self-remove')
}

</script>

<template>
  <div :id="buildSmallId(dataRef.id)" class="card info-card">
    <div class="row">
      <div class="col-md-4">
        <GoogleMap :id="buildId(dataRef.id)" :marker="dataRef.coordinates" :map_control="{mapTypeControl: false}"
                   :key="googleMapKey"></GoogleMap>
      </div>
      <div class="col">
        <div class="card-body">
          <h5 class="card-title">{{ dataRef.parking_name }}</h5>
          <div class="card-text-holder">
            <p class="fs-5 fw-normal my-1">
              <span class="text-secondary">Owner: </span>
              <span class="text-black">{{ dataRef.owner }}</span>
            </p>
            <p class="fs-5 fw-normal my-1">
              <span class="text-secondary">Address: </span>
              <span class="text-black">{{ dataRef.address }}</span>
            </p>
            <p class="fs-5 fw-normal my-1">
              <span class="text-secondary">Car capacity: </span>
              <span class="text-black">{{ dataRef.capacity }}</span>
            </p>
          </div>
          <div class="d-inline-flex gap-2">
            <a href="filiate-info.html" class="btn btn-primary">View data</a>
            <button class="btn btn-success" data-bs-toggle="modal"
                    :data-bs-target="`#${_edit_id}`">Edit
            </button>
            <button class="btn btn-danger" data-bs-toggle="modal"
                    :data-bs-target="'#' + _delete_id">Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <div class="row">
        <div class="col-auto">
          <small class="text-body-secondary">
            <span>Created: </span>
            <span>{{ formatDateTime(dataRef.created_at) }}</span>
          </small>
        </div>
        <div class="col-auto">
          <small class="text-body-secondary">
            <span>Created by: </span>
            <span>{{ dataRef.created_by }}</span>
          </small>
        </div>
      </div>
    </div>
    <EditParkingModal :_id="_edit_id" v-model="dataRef"></EditParkingModal>
    <DeleteParkingModal @remove-card="remove" :data="data" :id="_delete_id"></DeleteParkingModal>
  </div>
</template>

<style scoped>
@import '@/assets/main.css';
</style>
