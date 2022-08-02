import { playMode } from '@assets/constant/index'
import { getRandomNum } from '../../utils/tools'
import { getMusicDetailApi, getMusicLyricApi, getMusicUrlApi } from '@http/song.js'
const state = {
  // 歌曲的播放和暂停
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  // 歌曲音频连接
  url: '',
  // 歌曲图片
  pic: '',
  // 歌词
  lyric: '',
  currentLyricLineNum: 0,
  // 歌单id
  playerId: null
}

const mutations = {
  update_playList (state, { list, mode }) {
    let playList
    if (mode === playMode.sequence) {
      playList = list
    } else if (mode === playMode.loop) {
      playList = [list[state.currentIndex]]
    } else if (mode === playMode.random) {
      playList = new Array(list.length)
      list.forEach(item => {
        let randomNum = getRandomNum(list.length - 1)
        while (playList[randomNum]) {
          randomNum = getRandomNum(list.length - 1)
        }
        playList[randomNum] = item
      })
    }
    state.playList = playList
  },
  set_playList (state, payload) {
    state.playList = payload
  },
  update_sequenceList (state, payload) {
    state.sequenceList = payload
  },
  set_sequenceList (state, payload) {
    const index = state.sequenceList.indexOf(state.playList[state.currentIndex])
    state.sequenceList.splice(index + 1, 0, payload)
  },
  delete_sequenceList (state, payload) {
    state.sequenceList.splice(payload, 1)
  },
  delete_playList (state, payload) {
    state.playList.splice(payload, 1)
  },
  update_currentIndex (state, payload) {
    state.currentIndex = payload
  },
  update_fullScreen (state, payload) {
    state.fullScreen = payload
  },
  update_pic (state, payload) {
    state.pic = payload
  },
  update_lyric (state, payload) {
    state.lyric = payload
  },
  update_url (state, payload) {
    state.url = payload
  },
  update_playing (state, payload) {
    state.playing = payload
  },
  init_mode (state) {
    state.mode = playMode.sequence
  },
  update_currentLyricLineNum (state, payload) {
    state.currentLyricLineNum = payload
  },
  update_id (state, payload) {
    state.playerId = payload
  },
  set_Random_mode (state, playload) {
    state.mode = playMode.random
  }
}

const actions = {
  checkoutSong ({ state, commit, dispatch, getters }, { step }) {
    return new Promise((resolve, reject) => {
      let relIndex = state.currentIndex + step
      if (relIndex > state.playList.length - 1) {
        relIndex = relIndex - state.playList.length
      }
      if (relIndex < 0) relIndex = state.playList.length - 1
      commit('update_currentIndex', relIndex)
      dispatch('getPlayerData', { id: getters.currentSong.id }).then(resolve)
    })
  },
  getPlayerData ({ commit, dispatch }, { id }) {
    return new Promise((resolve, reject) => {
      try {
        Promise.all([dispatch('getMusicPic', id), dispatch('getMusicLyric', id), dispatch('getMusicUrl', id)])
          .then(res => {
            const commitMap = ['update_pic', 'update_lyric', 'update_url']
            res.forEach((data, index) => commit(commitMap[index], data))
            resolve('player ready')
          })
          .catch(reason => {
            reject(reason)
          })
      } catch (error) {
        reject(error)
      }
    })
  },
  initPlayer ({ state, commit, dispatch }, { index, isFullScreen, list, id }) {
    commit('init_mode')
    commit('update_id', id)
    commit('update_currentIndex', index)
    commit('update_fullScreen', isFullScreen)
    commit('update_sequenceList', list)
    commit('update_playList', { list, mode: state.mode })
  },
  updatePlayMode ({ state, commit, getters }) {
    const currentSongId = getters.currentSong.id
    const playModeMap = Object.values(playMode)
    let nextIndex = playModeMap.indexOf(state.mode) + 1
    if (nextIndex >= playModeMap.length) nextIndex = 0
    state.mode = playModeMap[nextIndex]
    commit('update_playList', { list: state.sequenceList, mode: state.mode })
    const currentIndex = state.playList.map(item => item.id).indexOf(currentSongId)
    commit('update_currentIndex', currentIndex)
  },
  async getMusicPic (context, payload) {
    return new Promise((resolve, reject) => {
      getMusicDetailApi({
        ids: payload
      }).then(res => {
        resolve(res.data?.songs[0]?.al?.picUrl)
      })
    })
  },

  async getMusicLyric ({ state }, payload) {
    return new Promise((resolve, reject) => {
      getMusicLyricApi({
        id: payload
      }).then(res => {
        const relLyric = res?.data?.lrc?.lyric.replace(/\[(.+?)\]/g, value => {
          if (value.length === 11) {
            const result = '[' + value.split('').slice(1, 9).join('') + ']'
            return result
          } else {
            return value
          }
        })
        resolve(relLyric)
      })
    })
  },

  async getMusicUrl (context, payload) {
    return new Promise((resolve, reject) => {
      getMusicUrlApi({
        id: payload
      }).then(res => {
        resolve(res?.data?.data[0]?.url)
      })
    })
  }
}

const getters = {
  currentSong (state) {
    return state.playList[state.currentIndex] || {}
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
