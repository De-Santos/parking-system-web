import { map_loader } from '@/assets/config/google_map_config.js'
import store from '@/vuex/index.js'

export async function initMap(elementId, markerPosition, controlProp) {
  let map

  const { Map } = await map_loader.importLibrary('maps')
  const { AdvancedMarkerElement } = await map_loader.importLibrary('marker')


  map = new Map(document.getElementById(elementId), {
    zoom: 15,
    center: markerPosition,
    mapId: 'DEMO_MAP_ID',
    zoomControl: controlProp.zoomControl,
    mapTypeControl: controlProp.mapTypeControl,
    scaleControl: controlProp.scaleControl,
    streetViewControl: controlProp.streetViewControl,
    rotateControl: controlProp.rotateControl,
    fullscreenControl: controlProp.fullscreenControl
  })

  new AdvancedMarkerElement({
    map: map,
    position: markerPosition
  })
}


export async function initMapSelector(elementId, center) {
  const { Map } = await map_loader.importLibrary('maps')

  let map
  let m

  map = new Map(document.getElementById(elementId), {
    zoom: 12,
    center: center === null ? { lat: 0, lng: 0 } : center,
    mapId: 'DEMO_MAP_ID'
  })

  if (center !== null) {
    m = await addMarker(center, map)
    await updateCoordinates({lat: center.lat, lng: center.lng})
  }

  map.addListener('click', async (event) => {
    if (m !== null) {
      m.setMap(null)
    }
    m = await addMarker(event.latLng, map)
    await updateCoordinates({lat: event.latLng.lat(), lng: event.latLng.lng()})
  })
}

export async function addMarker(position, map) {
  const { AdvancedMarkerElement } = await map_loader.importLibrary('marker')
  const marker = new AdvancedMarkerElement({
    map,
    position: position
  })
  marker.addListener('click', async () => {
    marker.setMap(null)
    await store.dispatch('setLatLng', {lat: 0, lng: 0})
  })
  return marker
}

async function updateCoordinates({lat, lng}){
  await store.dispatch('setLatLng', {lat: lat, lng: lng})

}
