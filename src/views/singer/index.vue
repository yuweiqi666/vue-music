<template>
  <div class="singer" ref="singer">
    <list-view :data='formatSingerList' @handleClickItem='handleClickSinger' ref="listView"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import singerList from './mock/index'
import ListView from '@components/biz/listView'
import { playlistUpdate } from '@/mixins/playlistUpdate'
export default {
  name: 'Singer',
  mixins: [playlistUpdate],
  components: {
    ListView
  },
  data () {
    return {
      singerList
    }
  },
  computed: {
    formatSingerList () {
      return this.singerList.map(item => ({
        title: item.findex,
        children: item.singerList
      }))
    }
  },
  methods: {
    handlePlayListRefresh (playList) {
      this.$refs.singer.style.bottom = playList && playList.length ? '60px' : 0
      this.$refs.listView.refresh()
    },
    handleClickSinger (data) {
      console.log('歌手id', data)
      const { id, picUrl, name } = data
      this.$router.push({
        name: 'song',
        params: { id },
        query: { picUrl, name }
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.singer {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
