import { map_loader } from '@/assets/config/google_map_config.js'

const n_c = { lat: 0, lng: 0 }

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


export async function initMapSelector(elementId, coordinates, rbi, am, zoom) {
  const { Map } = await map_loader.importLibrary('maps')
  const { LatLng } = await map_loader.importLibrary('core')

  let map
  let m = null
  let c = coordinates.value

  map = new Map(document.getElementById(elementId), {
    zoom: zoom,
    center: coordinates.value === null ? n_c : coordinates.value,
    mapId: 'DEMO_MAP_ID'
  })

  if (coordinates.value !== null && am === true) {
    m = await addMarker(coordinates.value, map, coordinates)
  }

  map.addListener('click', async (event) => {
    if (m !== null) {
      m.setMap(null)
    }
    m = await addMarker(event.latLng, map, coordinates)
    coordinates.value = { lat: event.latLng.lat(), lng: event.latLng.lng() }
  })

  document.getElementById(rbi).addEventListener('click', async (event) => {
    event.preventDefault()

    if (m !== null) {
      m.setMap(null)
    }
    if (am === true) {
      m = await addMarker(c, map, coordinates)
    }
    map.panTo(new LatLng(c.lat, c.lng))
    coordinates.value = c
  })
}

export async function addMarker(position, map, c) {
  const { AdvancedMarkerElement } = await map_loader.importLibrary('marker')
  const marker = new AdvancedMarkerElement({
    map,
    position: position
  })
  marker.addListener('click', async () => {
    marker.setMap(null)
    console.log(c.value)
    console.log(n_c)
    c.value = n_c
    console.log(c.value)
  })
  return marker
}
