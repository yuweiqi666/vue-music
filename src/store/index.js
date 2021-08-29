import Vue from 'vue'
import Vuex from 'vuex'

import { getDirTogether } from '@/utils/tools'

Vue.use(Vuex)

const files = require.context('./modules', false, /.js$/)

const fileObj = getDirTogether(files, {})

console.log('fileObj', fileObj)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    ...fileObj
  }
})
