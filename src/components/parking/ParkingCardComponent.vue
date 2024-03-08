<script setup>
import { formatDateTime } from '@/scripts/time_scripts.js'
import GoogleMap from '@/components/map/GoogleMap.vue'
import EditParkingModal from '@/components/modal/EditParkingModal.vue'
import { buildId, buildSmallId } from '@/scripts/html_scripts.js'
import { ref } from 'vue'

defineProps({
  data: {
    required: true
  }
})

const _edit_id = ref(buildId())


</script>

<template>
  <div :id="buildSmallId(data.id)" class="card info-card">
    <div class="row">
      <div class="col-md-4">
        <GoogleMap :id="buildId(data.id)" :marker="data.coordinates" :map_control="{mapTypeControl: false}"></GoogleMap>
      </div>
      <div class="col">
        <div class="card-body">
          <h5 class="card-title">{{data.parking_name}}</h5>
          <div class="card-text-holder">
            <p class="fs-5 fw-normal my-1">
              <span class="text-secondary">Owner: </span>
              <span class="text-black">{{data.owner}}</span>
            </p>
            <p class="fs-5 fw-normal my-1">
              <span class="text-secondary">Address: </span>
              <span class="text-black">{{data.address}}</span>
            </p>
            <p class="fs-5 fw-normal my-1">
              <span class="text-secondary">Car capacity: </span>
              <span class="text-black">{{data.capacity}}</span>
            </p>
          </div>
          <div class="d-inline-flex gap-2">
            <a href="filiate-info.html" class="btn btn-primary">View data</a>
            <button class="btn btn-success" data-bs-toggle="modal"
                    :data-bs-target="`#${_edit_id}`">Edit
            </button>
            <button class="btn btn-danger" data-bs-toggle="modal"
                    data-bs-target="#deleteParkingEntryModal">Delete
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
            <span>{{formatDateTime(data.created_at)}}</span>
          </small>
        </div>
        <div class="col-auto">
          <small class="text-body-secondary">
            <span>Created by: </span>
            <span>{{data.created_by}}</span>
          </small>
        </div>
      </div>
    </div>
    <EditParkingModal :_id="_edit_id" :data="data"></EditParkingModal>
  </div>
</template>

<style scoped>
@import '@/assets/main.css';
</style>
