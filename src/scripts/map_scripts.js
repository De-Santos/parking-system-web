export async function initMap(elementId, markerPosition, controlProp) {
  let map

  const { Map } = await google.maps.importLibrary('maps')
  const { AdvancedMarkerElement } = await google.maps.importLibrary('marker')
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


export async function initMapSelector(elementId, center, c) {
  const { Map } = await google.maps.importLibrary('maps')

  let map;
  let m;

  map = new Map(document.getElementById(elementId), {
    zoom: 12,
    center: center === null ? { lat: 0, lng: 0 } : center,
    mapId: 'DEMO_MAP_ID'
  })

  if (center !== null) {
    m = await addMarker(center, map)
  }

  map.addListener('click', async (event) => {
    m.setMap(null)
    m = await addMarker(event.latLng, map)
    c.value = event.latLng
  })
}

export async function addMarker(position, map) {
  const { Marker } = await google.maps.importLibrary('marker')
  return new Marker({
    map,
    position: position
  })
}

export async function processMarkerSwap(event, map, mrk) {
  mrk.value.setMap(null)
  mrk.value = await addMarker(event.latLng, map.value)
  console.log(mrk.value)
}
