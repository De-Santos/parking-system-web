import { createStore } from 'vuex'


const state = {
  parking: null,
  lat: 0,
  lng: 0
}

const getters = {
  parking: (state) => {
    return state.parking
  },
  lat: (state) => {
    return state.lat
  },
  lng: (state) => {
    return state.lng
  }
}

const actions = {
  parking(context, parking) {
    context.commit('SET_PARKING', parking)
  },
  setLatLng(context, { lat, lng }) {
    context.commit('SET_LAT_LNG', { lat, lng })
  }
}

const mutations = {
  SET_PARKING(state, parking) {
    state.parking = parking
  },
  SET_LAT_LNG(state, { lat, lng }) {
    state.lat = lat
    state.lng = lng
  }
}

const store = createStore({
  state,
  getters,
  actions,
  mutations
})

export default store
