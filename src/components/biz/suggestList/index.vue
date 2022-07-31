<template>
  <div class="suggest-list" ref="suggestList">
    <scroll :data='suggestList' @pageScroll='handlePageScroll' ref="scroll">
      <div class="suggest-list-wrapper" ref="suggestWrapper" v-if="suggestList && suggestList.length">
        <div class="suggest-list-item" v-for="(item, index) in suggestList" :key="index" @click="handleClickSearchSong(item, index)">
          <svg-icon icon-class='music' class="suggest-list-item-icon"></svg-icon>
          <div class="suggest-list-item-name">
            {{item.name}} - {{item.albums}} - {{item.desc}}
          </div>
        </div>
        <div class="loading-wrapper" v-show="isLoading">
          <loading ref="loading"></loading>
        </div>
      </div>
      <div v-show="isNoResult">
        <no-result text="抱歉，暂无搜索结果"></no-result>
      </div>
    </scroll>
  </div>
</template>

<script>
import Loading from '@components/common/loading'
import Scroll from '@components/common/scroll'
import { getKwSearchApi } from '@/http/search'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import NoResult from '@components/common/noResult'
import { trottle } from '@/utils/tools'
import { playMode } from '@assets/constant'
export default {
  name: 'SuggestList',
  components: {
    Loading,
    Scroll,
    NoResult
  },
  props: {
    query: {
      type: String
    }
  },
  data () {
    return {
      suggestList: [],
      isLoading: false,
      isFinish: false,
      offset: 0,
      isNoResult: false
    }
  },
  computed: {
    ...mapState({
      sequenceList: state => state.player.sequenceList,
      mode: state => state.player.mode,
      playList: state => state.player.playList,
      currentIndex: state => state.player.currentIndex
    }),
    ...mapGetters('player', [
      'currentSong'
    ])
  },
  methods: {
    ...mapMutations('player', {
      updatePlaying: 'update_playing',
      setSequenceList: 'set_sequenceList',
      updateFullScreen: 'update_fullScreen',
      setPlayList: 'set_playList',
      updateSequenceList: 'update_sequenceList',
      updatePlayList: 'update_playList'
    }),
    ...mapMutations('search', {
      updateHistoryList: 'update_historyList'
    }),
    ...mapActions('player', [
      'getPlayerData',
      'checkoutSong'
    ]),
    async getKwSearch (query) {
      const res = await getKwSearchApi(query)
      if (!res.data.result.songCount) {
        this.isFinish = true
        this.isNoResult = true
        return
      }
      const currentSuggestList = res.data.result.songs.map(item => ({
        name: item.name,
        desc: item.ar.map(item => item.name).join('/'),
        albums: item.al.name,
        id: item.id,
        dt: item.dt
      }))
      this.suggestList.push(...currentSuggestList)
      this.isLoading = false
      if (res.data.result.songCount <= this.offset + 30) this.isFinish = true
    },
    handlePageScroll (position) {
      if (!this.suggestList.length) return
      const toTopH = this.$refs.suggestList.clientHeight
      const boxH = this.$refs.suggestWrapper.clientHeight
      if (boxH <= toTopH - position.y && !this.isFinish && !this.isLoading) {
        this.isLoading = true
      }
    },
    async handleClickSearchSong (data, index) {
      try {
        this.updatePlaying(true)
        const isExistSong = this.sequenceList.some(item => item.id === data.id)
        // 更新播放歌单
        if (!isExistSong) {
          if (!this.playList.length) {
            this.setPlayList([data])
            this.updateSequenceList(this.playList)
          } else {
            this.setSequenceList(data)
          }
        } else {
          this.updateFullScreen(true)
          if (this.currentSong.id === data.id) return false
        }
        // 切换当前播放歌曲
        if (playMode.loop === this.mode) {
          this.setPlayList([data])
          this.checkoutSong({ step: 0 })
        } else {
          if (playMode.random === this.mode) this.updatePlayList({ list: this.sequenceList, mode: this.mode })
          const currentPlayIndex = this.playList.map(item => item.id).indexOf(data.id)
          const step = currentPlayIndex - this.currentIndex
          console.log('step', step)
          this.checkoutSong({ step })
        }
        this.updateFullScreen(true)
      } catch (error) {
        console.log('error', error)
      }
    }
  },
  watch: {
    query: {
      handler: trottle(function (n, o) {
        this.suggestList = []
        if (n) {
          // 添加关键词到搜索历史
          this.updateHistoryList(n)
          this.getKwSearch({
            keywords: n,
            offset: 0
          })
        } else {
          this.isFinish = false
          this.offset = 0
          // this.$refs.suggestWrapper.style.paddingBottom = '60px'
        }
      }, 2000)
    },
    isLoading: {
      handler (n, o) {
        if (n) {
          this.offset += 30
          this.getKwSearch({
            keywords: this.query,
            offset: this.offset
          })
        }
      }
    },
    isFinish: {
      handler (n, o) {
        if (n) {
          this.$nextTick(() => {
            this.$refs.suggestWrapper.style.paddingBottom = 0
            this.$refs.scroll.refresh()
          })
        }
      }
    }
  }
}
</script>

<style scoped lang='scss'>
  @import '@assets/style/variable.scss';
  @import '@assets/style/mixins.scss';
  .suggest-list {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 20px;
    right: 20px;
    .suggest-list-wrapper {
      position: relative;
      width: 100%;
      padding-bottom: 60px;
      .suggest-list-item {
        display: flex;
        align-items: center;
        width: 100%;
        .suggest-list-item-icon {
          font-size: $font-size-small;
          margin-right: 6px;
        }
        .suggest-list-item-name {
          flex: 1;
          @include no-wrapper;
          line-height: 24px;
          color: $color-text-singer;
          font-size: $font-size-small;
        }
      }
      .loading-wrapper {
        position: absolute;
        bottom: 0;
        width: 100%;
      }
    }
  }
</style>
