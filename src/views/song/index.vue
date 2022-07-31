<template>
  <transition name='slide' appear>
    <music-list
      :id='$route.params.id'
      :name='$route.query.name'
      :pic='$route.query.picUrl'
      :list='formatMusicList'
    ></music-list>
  </transition>
</template>

<script>
import MusicList from '@components/biz/musicList'
import { getMusicListApi } from '@http/song'
export default {
  name: 'Song',
  components: {
    MusicList
  },
  data () {
    return {
      musicList: []
    }
  },
  created () {
    this.getMusicList()
  },
  computed: {
    formatMusicList () {
      return this.musicList.map(music => ({
        id: music.id,
        name: music.name,
        desc: music.ar.map(item => item.name).join('/') + '·' + music.al.name,
        dt: music.dt
      }))
    }
  },
  methods: {
    async getMusicList () {
      const musicList = await getMusicListApi({
        id: this.$route.params.id
      })
      this.musicList = musicList.data.songs
    }
  }
}
</script>

<style scoped lang='scss'>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate(100%, 0);
}
</style>
