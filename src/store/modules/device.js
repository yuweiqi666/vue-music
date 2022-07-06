const state = {
  deviceMsg: ''
}

const mutations = {
  GET_DEVICE_MSG (state, data) {
    state.deviceMsg = data
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
