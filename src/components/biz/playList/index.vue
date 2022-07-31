<template>
  <transition name="playlist">
    <div class="play-list" v-show="playListPop" @click="$emit('update:playListPop', false)">
      <div class="list-pop" @click.stop>
        <div class="list-pop-top">
          <div class="list-pop-top-mode">
            <a href="javascript:;" @click="updatePlayMode">
              <svg-icon :icon-class='modeObj.modeIcon' class="mode-icon"></svg-icon>
            </a>
            <span>{{modeObj.modeText}}</span>
          </div>
          <a href="javascript:;" class="list-pop-top-del" @click.stop="isShow = true">
            <svg-icon icon-class='delete'></svg-icon>
          </a>
        </div>
        <div class="list-pop-content-wrapper">
          <scroll ref="scroll" :data='sequenceList'>
            <div class="list-pop-content">
              <div class="list-pop-content-item" ref="listItem" :key="index" v-for="(item, index) in sequenceList" @click="handleClickSongItem(item, index)">
                <span class="list-pop-content-item-left">
                  <svg-icon icon-class='play' class="play-icon" v-show="item.id === currentSong.id"></svg-icon>
                  {{item.name}}
                </span>
                <span class="list-pop-content-item-right">
                  <a href="javascript:;">
                    <svg-icon icon-class='noFavorites'></svg-icon>
                  </a>
                  <a href="javascript:;" @click.stop="handleClearSongItem(item, index)">
                    <svg-icon icon-class='clear'></svg-icon>
                  </a>
                </span>
              </div>
            </div>
          </scroll>
        </div>
        <div class="list-pop-add">
          <svg-icon icon-class='add' class="icon-add"></svg-icon>
          <span>添加歌曲到队列</span>
        </div>
        <div class="list-pop-bottom-close" @click.stop="$emit('update:playListPop', false)">
          关闭
        </div>
        <confirm :isShow.sync='isShow' @onConfirm='onConfirm'></confirm>
      </div>
    </div>
  </transition>
</template>

<script>
import Scroll from '@components/common/scroll'
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import { playMode } from '@assets/constant'
import Confirm from '@components/common/confirm'
export default {
  name: 'PlayList',
  props: {
    playListPop: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isShow: false
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
    ]),
    modeObj () {
      let modeIcon = ''
      let modeText = ''
      switch (this.mode) {
        case playMode.sequence:
          modeIcon = 'sequence'
          modeText = '顺序播放'
          break
        case playMode.loop:
          modeIcon = 'loop'
          modeText = '循环播放'
          break
        case playMode.random:
          modeIcon = 'random'
          modeText = '随机播放'
          break
        default:
          break
      }
      return {
        modeIcon,
        modeText
      }
    }
  },
  components: {
    Scroll,
    Confirm
  },
  methods: {
    ...mapMutations('player', {
      setPlayList: 'set_playList',
      updateUrl: 'update_url',
      updateSequenceList: 'update_sequenceList',
      updatePlaying: 'update_playing',
      updateFullScreen: 'update_fullScreen',
      updateId: 'update_id',
      deleteSequenceList: 'delete_sequenceList',
      deletePlayList: 'delete_playList',
      updateCurrentIndex: 'update_currentIndex'
    }),
    ...mapActions('player', [
      'updatePlayMode',
      'checkoutSong',
      'getPlayerData'
    ]),
    handleClickSongItem (data, index) {
      if (data.id === this.currentSong.id) {
        return false
      } else {
        if (this.mode === playMode.loop) {
          this.setPlayList([data])
          this.checkoutSong({ step: 0 })
        } else {
          const currentPlayIndex = this.playList.map(item => item.id).indexOf(data.id)
          const step = currentPlayIndex - this.currentIndex
          this.checkoutSong({ step })
        }
      }
    },
    onConfirm () {
      this.setPlayList([])
      this.updateUrl('')
      this.updateSequenceList([])
      this.updatePlaying(false)
      this.updateId(null)
      this.$emit('update:playListPop', false)
      this.isShow = false
    },
    handleClearSongItem (song, index) {
      const listItem = this.$refs.listItem
      listItem[index].style.height = 0
      listItem[index].style.opacity = 0
      if (song.id === this.currentSong.id) {
        if (this.mode === playMode.loop) {
          let restList = this.sequenceList.slice(index + 1)
          if (!restList.length) {
            restList = this.sequenceList.slice(0, this.sequenceList.length - 1)
            index = -1
            this.deleteSequenceList(this.sequenceList.length - 1)
          }
          console.log('restList', restList)
          for (let i = 0; i < restList.length; i++) {
            if (listItem[index + i + 1].style.height !== '0px') {
              this.setPlayList([this.sequenceList[index + i + 1]])
              this.checkoutSong({ step: 0 })
              break
            }
          }
        } else {
          let restPlayList = this.playList.slice(this.currentIndex + 1)
          if (!restPlayList.length) {
            restPlayList = this.playList.slice(0, this.playList.length - 1)
            this.deletePlayList(this.playList.length - 1)
          }
          for (let i = 0; i < restPlayList.length; i++) {
            const playIndex = this.sequenceList.map(item => item.id).indexOf(restPlayList[i].id)
            if (listItem[playIndex].style.height !== '0px') {
              if (this.currentIndex === this.playList.length) {
                this.checkoutSong({ step: i })
              } else {
                this.checkoutSong({ step: i + 1 })
              }
              break
            }
          }
        }
      }
      this.$nextTick(() => {
        this.$refs.scroll.refresh()
      })
    }
  },
  watch: {
    playListPop: {
      handler (n, o) {
        console.log(123)
        if (n) {
          this.$nextTick(() => {
            const scroll = this.$refs.scroll
            const listItem = this.$refs.listItem
            const index = this.sequenceList.map(item => item.id).indexOf(this.currentSong.id)
            if (listItem[index].style.height === '0px') {
              listItem[index].style.height = '40px'
              listItem[index].style.opacity = 1
            }
            scroll.refresh()
            scroll.pageScrollToElement(listItem[index], 0)
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
.play-list {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $background-color-d;
  .list-pop {
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    // height: 424px;
    background-color: $background-color-l;
    box-sizing: border-box;
    .list-pop-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding: 20px 30px 0 20px;
      .list-pop-top-mode {
        display: flex;
        align-items: center;
        &>a {
          .mode-icon {
            vertical-align: 1px;
            font-size: $font-size-large-xx;
          }
        }
        &>span {
          font-size: $font-size-medium;
          margin-left: 6px;
          color: $color-text-singer;
        }
      }
      .list-pop-top-del {
        font-size: $font-size-large;
        color: $color-text-singer;
      }
    }
    .list-pop-content-wrapper {
      padding: 0 30px 0 20px;
      color: $color-text-l-singer;
      font-size: $font-size-medium;
      .scroll{
        max-height: 240px;
        .list-pop-content-item {
          display: flex;
          justify-content: space-between;
          height: 40px;
          line-height: 40px;
          transition: all 0.4s;
          overflow: hidden;
          opacity: 1;
          .list-pop-content-item-left {
            padding-left: 24px;
            position: relative;
            @include no-wrapper;
            flex: 1;
            .play-icon {
              position: absolute;
              left: 0;
              top: 50%;
              transform: translate(0, -50%);
              margin-right: 6px;
              font-size: $font-size-medium;
              opacity: 0.5;
            }
          }
          .list-pop-content-item-right {
            &>a {
              margin-left: 10px;
              font-size: $font-size-large-x;
            }
          }
        }
      }
    }
    .list-pop-add {
      width: 140px;
      margin: 20px auto 30px auto;
      border: 1px solid $color-text-singer;
      border-radius: 100px;
      color: $color-text-singer;
      font-size: $font-size-medium;
      padding: 6px 10px;
      text-align: center;
      &>span {
        margin-left: 5px;
      }
      .icon-add {
        font-size: $font-size-medium-x;
      }
    }
    .list-pop-bottom-close {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      text-align: center;
      background-color: $background-color;
      font-size: $font-size-medium-x;
      color: $color-text-singer;
      padding: 15px 0;
    }
  }
}
.playlist-enter-active,
.playlist-leave-active {
  transition: all 0.3s;
  .list-pop {
    transition: all 0.3s;
  }
}
.playlist-enter,
.playlist-leave-to {
  opacity: 0;
  .list-pop {
    opacity: 0;
    transform: translate(0, 424px);
  }
}
.contentItem-leave-active {
  transition: all 1s;
}
.contentItem-leave-to {
  height: 0;
}
</style>
