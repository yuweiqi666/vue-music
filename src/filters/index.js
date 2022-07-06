
import Vue from 'vue'

Vue.filter('formatmillionSecond', function (value) {
  let minutes = parseInt(value % (1000 * 60 * 60) / (1000 * 60))
  minutes = minutes < 10 ? '0' + minutes : minutes
  let seconds = (value % (1000 * 60) / 1000) | 0
  seconds = seconds < 10 ? '0' + seconds : seconds
  return minutes + ':' + seconds
})
