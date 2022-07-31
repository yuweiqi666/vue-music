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
import { getSongListDetailApi } from '@http/recommend'
export default {
  name: 'SongListDetail',
  components: {
    MusicList
  },
  data () {
    return {
      songDetailList: []
    }
  },
  created () {
    this.getSongListDetail()
  },
  computed: {
    formatMusicList () {
      return this.songDetailList.map(music => ({
        id: music.id,
        name: music.name,
        desc: music.ar.map(item => item.name).join('/') + '·' + music.al.name,
        dt: music.dt
      }))
    }
  },
  methods: {
    async getSongListDetail () {
      const res = await getSongListDetailApi({
        id: this.$route.params.id
      })
      this.songDetailList = res.data.playlist.tracks
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
