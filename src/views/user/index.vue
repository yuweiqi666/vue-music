<template>
  <transition name="user" appear>
    <div class="user">
      <div class="user-header">
        <a class="user-back-wrapper" href="javascript:;" @click="$router.go(-1)">
          <svg-icon icon-class="back"></svg-icon>
        </a>
        <div class="user-header-title">
          <div class="bg-bar" ref="bgBar"></div>
          <div ref="tabItem0" class="header-title-fav user-header-title-item" :class="activeClass(0)" @click="handleClickTanItem(0)">我喜欢的</div>
          <div ref="tabItem1" class="header-title-history user-header-title-item" :class="activeClass(1)" @click="handleClickTanItem(1)">最近播放</div>
        </div>
      </div>
      <div class="random-play-btn-wrapper" v-if="list && list.length" @click="handleClickRandomPlay">
        <div class="random-play-btn">
          <svg-icon icon-class="play" class="play-btn-icon"></svg-icon>
          随机播放全部
        </div>
      </div>
      <div class="list-content" ref="listContent">
        <scroll :data='list' ref="scroll">
          <song-list :data='list' @selectSong='handleSelectSong'></song-list>
        </scroll>
      </div>
    </div>
  </transition>
</template>

<script>
import Scroll from '@components/common/scroll'
import SongList from '@components/biz/songList'
import { playlistUpdate } from '@/mixins/playlistUpdate'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import { getRandomNum } from '@/utils/tools'
import { playMode } from '@assets/constant'
export default {
  name: 'User',
  mixins: [playlistUpdate],
  data () {
    return {
      activeTab: 0,
      list: []
    }
  },
  components: {
    Scroll,
    SongList
  },
  created () {
    this.list = this.favSongList
  },
  computed: {
    ...mapState({
      favSongList: state => state.search.favSongList,
      historyPlayList: state => state.search.historyPlayList,
      sequenceList: state => state.player.sequenceList,
      playList: state => state.player.playList
    }),
    ...mapGetters('player', [
      'currentSong'
    ]),
    activeClass () {
      const reF = (num) => {
        if (num === this.activeTab) {
          return 'active'
        } else {
          return ''
        }
      }
      return reF
    }
  },
  methods: {
    ...mapMutations('player', {
      updatePlaying: 'update_playing',
      updateFullScreen: 'update_fullScreen',
      setPlayList: 'set_playList',
      updatePlayList: 'update_playList',
      updateCurrentIndex: 'update_currentIndex',
      setRandomMode: 'set_Random_mode'
    }),
    ...mapActions('player', [
      'getPlayerData',
      'initPlayer',
      'checkoutSong'
    ]),
    handleClickTanItem (num) {
      if (this.activeTab === num) return
      this.activeTab = num
      if (num === 0) {
        this.list = this.favSongList
      } else if (num === 1) {
        this.list = this.historyPlayList
      }
      const offsetLeft = this.$refs[`tabItem${num}`].offsetLeft
      this.$refs.bgBar.style.transform = `translate(${offsetLeft}px, 0)`
    },
    async handleSelectSong (data, index) {
      try {
        this.updatePlaying(true)
        this.initPlayer({
          list: JSON.parse(JSON.stringify(this.list)),
          index,
          isFullScreen: true,
          id: this.id
        })
        await this.getPlayerData({ id: data.id })
      } catch (error) {
        console.log('error', error)
      }
    },
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
    handlePlayListRefresh (playList) {
      this.$refs.listContent.style.bottom = playList && playList.length ? '60px' : 0
      this.$refs.scroll.refresh()
    }
  }
}
</script>

<style scoped lang='scss'>
  @import '@assets/style/variable';
  .user {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: $background-color;
    .user-header {
      position: relative;
      height: 40px;
      .user-back-wrapper {
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: $color-theme;
        font-size: $font-size-large-x;
      }
      .user-header-title {
        position: absolute;
        display: flex;
        top: 50%;
        left: 50%;
        width: 240px;
        height: 30px;
        border: 1px solid $background-color-l;
        box-sizing: border-box;
        transform: translate(-50%, -40%);
        font-size: $font-size-medium;
        border-radius: 5px;
        color: $color-text-singer;
        .user-header-title-item {
          flex: 1;
          text-align: center;
          line-height: 28px;
        }
        .bg-bar {
          position: absolute;
          height: 30px;
          width: 120px;
          border-radius: 5px;
          background-color: $background-color-l;
          z-index: -1;
          transform: translate(0, 0);
          transition: all 0.3s;
        }
      }
    }
    .random-play-btn-wrapper {
      padding: 20px;
      .random-play-btn {
        margin: 0 auto;
        width: 135px;
        height: auto;
        padding: 7px 0;
        text-align: center;
        border: 1px solid $color-text-singer;
        border-radius: 100px;
        font-size: $font-size-small;
        color: $color-text-singer;
        .play-btn-icon {
          width: 30px;
        }
      }
    }
    .list-content {
      position: fixed;
      top: 100px;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
  .active {
    color: $color-text;
  }
  h1 {
    font-size: 16px;
  }
  .user-enter-active,
  .user-leave-active {
    transition: all 0.3s;
  }
  .user-enter,
  .user-leave-to {
    transform: translate(100%, 0);
  }
</style>
