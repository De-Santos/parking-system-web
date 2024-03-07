import { createStore } from 'vuex'


const state = {
  parking: null,
}
const getters = {
  parking: (state)=> {
    return state.parking;
  },
}

const actions = {
  parking(context, parking) {
    context.commit('SET_PARKING', parking)
  },
}

const mutations = {
  SET_PARKING(state, parking) {
    state.parking = parking
  },
}

const store = createStore({
  state,
  getters,
  actions,
  mutations
})

export default store
