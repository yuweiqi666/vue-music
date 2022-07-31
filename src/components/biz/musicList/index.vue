<template>
  <div class="music-list">
    <div class="music-list-header" ref="musicListHeader">
      <a class="icon-back-wrapper" href="javascript:;" @click="handleClickBack">
        <svg-icon icon-class="back"></svg-icon>
      </a>
      <div class="music-list-header-title">{{name}}</div>
    </div>
    <div class="music-list-img-wrapper"  :style="{backgroundImage: `url(${pic})`}" ref="musicListImg">
      <div class="music-list-img-mask" ref="musicListImgMaskRef"></div>
      <div class="music-list-allplay" ref="musicListAllPlay" v-if="list && list.length" @click="handleClickRandomPlay">
        <svg-icon icon-class='play' class="icon-play"></svg-icon>
        <span class="icon-play-text">随机播放全部</span>
      </div>
    </div>
    <div class="music-list-scroll-wrapper" ref="listScrollWrapper">
      <scroll :data='list' @pageScroll='handlePageScroll' ref="scroll">
        <song-list :data='list' @selectSong='handleSelectSong' :showRank='showRank'></song-list>
      </scroll>
    </div>
  </div>
</template>

<script>
import Scroll from '@components/common/scroll'
import SongList from '@components/biz/songList'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { playlistUpdate } from '@/mixins/playlistUpdate'
import { playMode } from '@assets/constant'
import { getRandomNum } from '@/utils/tools'
export default {
  name: 'MusicList',
  mixins: [playlistUpdate],
  props: {
    name: {
      type: String
    },
    pic: {
      type: String
    },
    list: {
      type: Array
    },
    showRank: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number]
    }
  },
  components: {
    Scroll,
    SongList
  },
  computed: {
    ...mapState({
      playerId: state => state.player.playerId,
      playList: state => state.player.playList,
      sequenceList: state => state.player.sequenceList,
      currentIndex: state => state.player.currentIndex,
      mode: state => state.player.mode
    }),
    ...mapGetters('player', [
      'currentSong'
    ])
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.listScrollWrapper.style.top = (this.$refs.musicListImg.clientHeight) + 'px'
    })
  },
  methods: {
    handleClickRandomPlay () {
      const randomNum = getRandomNum(this.list.length)
      this.initPlayer({
        list: JSON.parse(JSON.stringify(this.list)),
        index: randomNum,
        isFullScreen: true,
        id: this.id
      })
      this.getPlayerData({ id: this.list[randomNum].id })
      this.updatePlayList({ list: this.sequenceList, mode: playMode.random })
      const currentIndex = this.playList.map(item => item.id).indexOf(this.currentSong.id)
      this.updateCurrentIndex(currentIndex)
      this.setRandomMode()
    },
    ...mapMutations('player', {
      updatePlaying: 'update_playing',
      updateFullScreen: 'update_fullScreen',
      setPlayList: 'set_playList',
      updatePlayList: 'update_playList',
      updateCurrentIndex: 'update_currentIndex',
      setRandomMode: 'set_Random_mode'
    }),
    handleClickBack () {
      this.$router.back(-1)
    },
    handlePageScroll (scrollData) {
      const { y } = scrollData
      this.$nextTick(() => {
        const titleDom = this.$refs.musicListHeader
        const headerDom = this.$refs.musicListImg
        const musicListImgMaskDom = this.$refs.musicListImgMaskRef
        const allPlayBtnDom = this.$refs.musicListAllPlay
        if (y < 0) {
          musicListImgMaskDom.style.backdropFilter = `blur(${Math.abs(y / headerDom.clientHeight) * 10}px)`
          musicListImgMaskDom.style.webkitBackdropFilter = `blur(${Math.abs(y / headerDom.clientHeight) * 10}px)`
        } else {
          musicListImgMaskDom.style.backdropFilter = 'blur(0)'
          headerDom.style.transform = `scale(${1 + y / headerDom.clientHeight})`
        }
        const layoutScrollY = Math.max(document.documentElement.clientWidth * 0.7 + y, titleDom.clientHeight)
        headerDom.style.paddingTop = layoutScrollY + 'px'
        if (document.documentElement.clientWidth * 0.7 + y <= titleDom.clientHeight) {
          headerDom.style.zIndex = 12
          allPlayBtnDom.style.display = 'none'
        } else {
          headerDom.style.zIndex = 0
          allPlayBtnDom.style.display = 'block'
        }
      })
    },
    async handleSelectSong (data, index) {
      try {
        if (this.playerId === this.id) {
          this.updateFullScreen(true)
          if (this.currentSong.id === data.id) {
            // this.updateFullScreen(true)
            return false
          }
          if (playMode.loop === this.mode) {
            this.setPlayList([data])
            this.checkoutSong({ step: 0 })
          } else {
            const currentPlayIndex = this.playList.map(item => item.id).indexOf(data.id)
            const step = currentPlayIndex - this.currentIndex
            this.checkoutSong({ step })
          }
          this.updateFullScreen(true)
        } else {
          this.updatePlaying(true)
          this.initPlayer({
            list: JSON.parse(JSON.stringify(this.list)),
            index,
            isFullScreen: true,
            id: this.id
          })
          await this.getPlayerData({ id: data.id })
        }
      } catch (error) {
        console.log('error', error)
      }
    },
    handlePlayListRefresh (playList) {
      this.$refs.listScrollWrapper.style.bottom = playList && playList.length ? '60px' : 0
      this.$refs.scroll.refresh()
    },
    ...mapActions('player', [
      'getPlayerData',
      'initPlayer',
      'checkoutSong'
    ])
  }
}
</script>

<style scoped lang='scss'>
@import '@assets/style/variable.scss';
.music-list {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 67;
  background-color: $background-color;
  .music-list-header {
    position: absolute;
    width: 100%;
    height: 40px;
    line-height: 40px;
    top: 0;
    left: 0;
    z-index: 13;
    .icon-back-wrapper {
      position: absolute;
      left: 15px;
      color: $color-theme;
      font-size: $font-size-large-x;
    }
    .music-list-header-title {
      width: 70%;
      margin: 0 auto;
      text-align: center;
      font-size: $font-size-large;
    }
  }
  .music-list-img-wrapper {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    background-size: cover;
    background-position: center top;
    transform: scale(1);
    transform-origin: top;
    .music-list-allplay {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 210px;
      font-size: $font-size-small;
      width: 135px;
      border: 1px solid $color-theme;
      color: $color-theme;
      border-radius: 100px;
      padding: 7px 0;
      text-align: center;
      .icon-play {
        // width: 16px;
        // height: 16px;
        font-size: $font-size-medium-x;
        margin-right: 6px;
        font-weight: 600;
        vertical-align: -4px;
      }
      .icon-play-text {

      }
    }
    .music-list-img-mask {
      position: absolute;
      width: 100%;
      top: 0;
      bottom: 0;
      background-color: $color-music-list-img-mask;
      backdrop-filter: blur(0);
    }
  }
  .music-list-scroll-wrapper {
    position: fixed;
    width: 100%;
    bottom: 0;
    .scroll {
      overflow: unset;
    }
  }
}
</style>
