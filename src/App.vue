<template>
  <div id="app">
    <router-view/>
    <!-- 播放器组件 -->
    <player></player>
  </div>
</template>

<script>
import Player from '@components/biz/player'
export default {
  data () {
    return {
    }
  },
  components: {
    Player
  }
}
</script>

<style lang="scss" scoped>
</style>
