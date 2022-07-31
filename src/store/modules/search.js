import { getLocalItem, setLocalItem } from '@/utils/storage.js'

const state = {
  historyList: getLocalItem('historyList') || [],
  favSongList: getLocalItem('favSongList') || [],
  historyPlayList: getLocalItem('historyPlayList') || []
}

const mutations = {
  update_historyList (state, payload) {
    if (state.historyList.indexOf(payload) === -1) {
      state.historyList.unshift(payload)
      setLocalItem('historyList', state.historyList)
    }
  },
  delete_history (state, payload) {
    const index = state.historyList.indexOf(payload)
    state.historyList.splice(index, 1)
    setLocalItem('historyList', state.historyList)
  },
  clear_history (state) {
    state.historyList = []
    setLocalItem('historyList', state.historyList)
  },
  add_favSong (state, payload) {
    state.favSongList.unshift(payload)
    setLocalItem('favSongList', state.favSongList)
  },
  delete_favSong (state, payload) {
    const index = state.favSongList.map(item => item.id).indexOf(payload.id)
    state.favSongList.splice(index, 1)
    setLocalItem('favSongList', state.favSongList)
  },
  add_historyPlay (state, payload) {
    const index = state.historyPlayList.map(item => item.id).indexOf(payload.id)
    if (index === -1) {
      state.historyPlayList.unshift(payload)
      setLocalItem('historyPlayList', state.historyPlayList)
    }
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
  // getters
}
