<template>
  <div class="player" v-show="playList && playList.length">
    <transition
      name='fullscreen'
      appear
      @enter='fullscreenEnter'
      @after-enter='fullscreenAfterEnter'
      @leave='fullscreenLeave'
      @after-leave='fullscreenAfterLeave'
    >
      <div class="fullscreen-player" v-show="fullScreen">
        <div class="fullscreen-player-background" :style="{ backgroundImage: `url(${pic})` }"></div>
        <div class="fullscreen-player-header">
          <div class="fullscreen-player-title">
            <a href="javascript:;" class="icon-back-wrapper" @click="handleClickBack">
              <svg-icon icon-class='back' class="icon-back"></svg-icon>
            </a>
            <div class="fullscreen-player-title-text">{{currentSong.name}}</div>
          </div>
          <div class="fullscreen-player-desc">{{currentSong.desc}}</div>
        </div>
        <div
          class="fullscreen-player-content-wrapper"
          ref="fullscreenPlayerContentWrapperRef"
          @touchstart='handleTouchStart'
          @touchmove='handleTouchMove'
          @touchend='handleTouchEnd'
        >
          <div class="fullscreen-player-content" ref="fullscreenPlayerContentRef">
            <div class="fullscreen-player-content-cd-wrapper" ref="cdWrapper">
              <div class="fullscreen-player-content-cd cdRoteta" :class="pauseRotateClass" ref="fullscreenPlayerRef">
                <img width="100%" height="100%" :src="pic" alt="">
              </div>
              <div class="fullscreen-player-content-needle" ref="cdNeedle"></div>
              <div class="fullscreen-player-current-lyric">{{currentLyric}}</div>
            </div>
          </div>
          <Scroll :data='lyricObj && lyricObj.lines' ref="scroll">
            <div class="fullscreen-player-lyric">
              <div v-if="lyricObj">
                <div
                  class="fullscreen-player-lyric-line"
                  :class="currentLyricLineNum === index ? 'fullscreen-player-lyric-line-hightLight' : ''"
                  v-for="(line, index) in lyricObj.lines"
                  :key="index"
                  ref="lyricLines"
                >
                  {{line.txt}}
                </div>
              </div>
            </div>
          </Scroll>
          <div class="fullscreen-player-content-dots">
            <div class="fullscreen-player-content-dots-item" :class="currentPlayerPage === 1 ? 'fullscreen-player-content-dots-item-active' : ''"></div>
            <div class="fullscreen-player-content-dots-item" :class="currentPlayerPage === 2 ? 'fullscreen-player-content-dots-item-active' : ''"></div>
          </div>
        </div>
        <div class="fullscreen-player-bottom">
          <process-bar
            :currentTime.sync='currentTime'
            :dt='currentSong.dt'
            ref="processBar"
            @currentTimeUpdate='currentTimeUpdate'
            @touchmoveend='processTouchMoveEnd'
          ></process-bar>
          <div class="fullscreen-player-bottom-btn">
            <a href="javascript:;" @click="updatePlayMode">
              <svg-icon :icon-class="iconMode" class="icon-mode"></svg-icon>
            </a>
            <a href="javascript:;" @click="handleCheckoutSong(-1)">
              <svg-icon icon-class="previous"></svg-icon>
            </a>
            <a href="javascript:;" @click="controlPlay">
              <svg-icon :icon-class="palyIcon" class="icon-play"></svg-icon>
            </a>
            <a href="javascript:;" @click="handleCheckoutSong(1)">
              <svg-icon icon-class="next"></svg-icon>
            </a>
            <a href="javascript:;">
              <svg-icon icon-class="noFavorites"></svg-icon>
            </a>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini" appear>
      <div class="mini-player" v-show="!fullScreen" @click="handleClickMiniPlayer">
        <div class="mini-player-left">
          <div class="mini-player-left-img cdRoteta" :class="pauseRotateClass" ref="miniPlayerRef">
            <img :src="pic" alt="">
          </div>
          <div class="mini-player-left-text">
            <div class="mini-player-left-text-name">{{currentSong.name}}</div>
            <div class="mini-player-left-text-desc">{{currentSong.desc}}</div>
          </div>
        </div>
        <div class="mini-player-right">
          <a href="javascript:;" @click.stop="controlPlay" class="icon-play-wrapper">
            <Process-circle :percent='percent'>
              <svg-icon :icon-class="palyIcon" class="icon-play"></svg-icon>
            </Process-circle>
          </a>
          <a href="javascript:;">
            <svg-icon icon-class="playlist" class="icon-playlist"></svg-icon>
          </a>
        </div>
      </div>
    </transition>
    <audio
      :id="currentSong.id"
      :src="url"
      ref="audio"
      @ended="handleCheckoutSong(1)"
      @canplay="songReady = true"
      @timeupdate="handleTimeUpdate"
    ></audio>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from '@assets/constant'
import animations from 'create-keyframe-animation'
import ProcessBar from '@components/common/processbar'
import ProcessCircle from '@components/common/processcircle'
import Scroll from '@components/common/scroll'
import Lyric from 'lyric-parser'
export default {
  name: 'Player',
  components: {
    ProcessBar,
    ProcessCircle,
    Scroll
  },
  data () {
    return {
      songReady: false,
      currentTime: 0,
      lyricObj: null,
      currentPlayerPage: 1,
      touchX: 0
    }
  },
  mounted () {

  },
  computed: {
    ...mapState({
      playList: state => state.player.playList,
      fullScreen: state => state.player.fullScreen,
      pic: state => state.player.pic,
      url: state => state.player.url,
      playing: state => state.player.playing,
      currentIndex: state => state.player.currentIndex,
      mode: state => state.player.mode,
      lyric: state => state.player.lyric,
      currentLyricLineNum: state => state.player.currentLyricLineNum
    }),
    ...mapGetters('player', [
      'currentSong'
    ]),
    palyIcon () {
      return this.playing ? 'pause' : 'play'
    },
    pauseRotateClass () {
      return this.playing ? '' : 'cdRotatePause'
    },
    percent () {
      return this.currentTime / this.currentSong.dt
    },
    iconMode () {
      const playModeKeyMap = Object.keys(playMode)
      const playModeValueMap = Object.values(playMode)
      const index = playModeValueMap.indexOf(this.mode)
      return playModeKeyMap[index]
    },
    currentLyric () {
      return this.lyricObj?.lines[this.currentLyricLineNum]?.txt
    }
  },
  methods: {
    ...mapMutations('player', {
      updateFullScreen: 'update_fullScreen',
      updatePlaying: 'update_playing',
      updateCurrentLyricLineNum: 'update_currentLyricLineNum'
    }),
    ...mapActions('player', [
      'checkoutSong',
      'updatePlayMode'
    ]),
    handleTimeUpdate (e) {
      this.currentTime = e.target.currentTime * 1000
    },
    processTouchMoveEnd (currentTime) {
      if (this.lyricObj) {
        this.lyricObj.seek(currentTime)
      }
    },
    controlPlay () {
      this.updatePlaying(!this.playing)
      if (this.lyricObj) {
        this.lyricObj.togglePlay()
      }
    },
    handleCheckoutSong (step) {
      if (!this.songReady) return
      if (!this.playing) this.controlPlay()
      this.songReady = false
      this.checkoutSong({ step }).then(res => {
        if (this.mode === playMode.loop) {
          this.$nextTick(() => {
            const audio = this.$refs.audio
            audio.play()
            if (this.lyricObj) this.lyricObj.seek(0)
          })
        }
      })
    },
    handleClickBack () {
      this.updateFullScreen(false)
    },
    handleClickMiniPlayer () {
      this.updateFullScreen(true)
    },
    fullscreenEnter (el, done) {
      const { x, y, scale } = this.getBeforeEnterPlayPosition()
      const animation = {
        0: {
          transform: `translate3d(-${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: 'translate3d(0,0,0) scale(1.1)'
        },
        100: {
          transform: 'translate3d(0,0,0) scale(1)'
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 500,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    fullscreenAfterEnter (el) {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    fullscreenLeave (el, done) {
      this.$nextTick(() => {
        const { x, y, scale } = this.getBeforeEnterPlayPosition()
        this.$refs.cdWrapper.style.transform = `translate(-${x}px, ${y}px) scale(${scale})`

        this.$refs.cdWrapper.style.transition = '0.5s all'

        this.$refs.cdWrapper.addEventListener('transitionend', done)
      })
    },
    fullscreenAfterLeave (el) {
      this.$refs.cdWrapper.style.transform = ''
      this.$refs.cdWrapper.style.transition = ''
    },
    currentTimeUpdate (time) {
      this.$nextTick(() => {
        this.$refs.audio.currentTime = time / 1000
      })
    },
    getBeforeEnterPlayPosition () {
      const miniPlayer = this.$refs.miniPlayerRef
      const fullscreenPlayer = this.$refs.fullscreenPlayerRef
      const fullscreenPlayerWrapper = this.$refs.fullscreenPlayerContentRef
      const miniPlayerLeft = miniPlayer.offsetLeft
      const miniPlayerTop = miniPlayer.offsetTop
      const miniPlayerWidth = miniPlayer.offsetWidth
      const miniPlayerHeight = miniPlayer.offsetHeight
      const fullscreenPlayerLeft = fullscreenPlayer.offsetLeft
      const fullscreenPlayerTop = fullscreenPlayerWrapper.offsetTop
      const fullscreenPlayerWidth = fullscreenPlayer.offsetWidth
      const fullscreenPlayerHeight = fullscreenPlayer.offsetHeight
      const x = fullscreenPlayerLeft + fullscreenPlayerWidth * 0.5 - (miniPlayerLeft + miniPlayerWidth * 0.5)
      const y = document.documentElement.clientHeight - (fullscreenPlayerTop + 0.5 * fullscreenPlayerHeight) - 0.5 * miniPlayerHeight - miniPlayerTop
      const scale = miniPlayerWidth / fullscreenPlayerWidth
      return { x, y, scale }
    },
    handleTouchStart (e) {
      this.$refs.scroll.$el.style.transition = 'unset'
      this.$refs.fullscreenPlayerContentRef.style.transition = 'unset'
      this.touchX = e.touches[0].pageX
    },
    handleTouchMove (e) {
      const playerContent = this.$refs.fullscreenPlayerContentRef
      const moveX = this.touchX - e.touches[0].pageX
      if (this.currentPlayerPage === 1) {
        if (moveX < 0) return

        const touchX = window.innerWidth - moveX
        this.$refs.scroll.$el.style.left = `${touchX}px`
      } else if (this.currentPlayerPage === 2) {
        if (moveX > 0) return
        this.$refs.scroll.$el.style.left = `${-moveX}px`
      }
      const percentOpacity = Math.min(window.innerWidth, this.$refs.scroll.$el.offsetLeft)
      playerContent.style.opacity = percentOpacity / window.innerWidth
    },
    handleTouchEnd (e) {
      if (e.changedTouches[0]?.pageX - this.touchX === 0) return
      const playerContent = this.$refs.fullscreenPlayerContentRef
      this.$refs.scroll.$el.style.transition = 'all 0.5s'
      playerContent.style.transition = 'all 0.5s'
      if (this.currentPlayerPage === 1) {
        if (this.touchX - e.changedTouches[0]?.pageX > 80) {
          this.$refs.scroll.$el.style.left = '0'
          playerContent.style.opacity = '0'
          this.currentPlayerPage = 2
        } else {
          this.$refs.scroll.$el.style.left = `${window.innerWidth}px`
          playerContent.style.opacity = '1'
        }
      } else if (this.currentPlayerPage === 2) {
        if (e.changedTouches[0]?.pageX - this.touchX > 80) {
          this.$refs.scroll.$el.style.left = `${window.innerWidth}px`
          playerContent.style.opacity = '1'
          this.currentPlayerPage = 1
        } else {
          this.$refs.scroll.$el.style.left = '0'
          playerContent.style.opacity = '0'
        }
      }
    }
  },
  watch: {
    url: {
      handler (n, o) {
        this.$nextTick(() => {
          const audio = this.$refs.audio
          audio.play()
        })
      }
    },
    playing: {
      handler (n, o) {
        this.$nextTick(() => {
          const audio = this.$refs.audio
          if (n) {
            audio.currentTime = this.currentTime / 1000
            audio.play()
            this.$refs.cdNeedle.style.transform = 'rotate(-25deg)'
          } else {
            audio.pause()
            this.$refs.cdNeedle.style.transform = 'rotate(-55deg)'
          }
        })
      }
    },
    fullScreen: {
      handler (n, o) {
        if (n) {
          this.$refs.processBar.updateProcess(this.currentTime)
          this.$nextTick(() => {
            const scrollDom = this.$refs.scroll.$el
            if (this.currentPlayerPage === 1) {
              scrollDom.style.left = `${window.innerWidth}px`
            } else if (this.currentPlayerPage === 2) {
              scrollDom.style.left = '0'
            }
          })
        }
      }
    },
    lyric: {
      handler (n, o) {
        if (this.lyricObj) this.lyricObj.stop()
        this.lyricObj = new Lyric(n, ({ lineNum, text }) => {
          this.updateCurrentLyricLineNum(lineNum)
          // 控制歌词滚动
          const lyricLines = this.$refs.lyricLines
          if (this.currentLyricLineNum > 5) {
            this.$refs.scroll.pageScrollToElement(lyricLines[this.currentLyricLineNum - 5], 1000)
          } else {
            this.$refs.scroll.pageScrollToElement(lyricLines[0], 1000)
          }
        })
        if (this.playing) this.lyricObj.play()
      }
    }
  }
}
</script>

<style scoped lang='scss'>
@import '@assets/style/variable.scss';
@import '@assets/style/mixins.scss';
.player {
  .fullscreen-enter-active,
  .fullscreen-leave-active {
    transition: all 0.5s linear;
    .fullscreen-player-header,
    .fullscreen-player-bottom {
      transition: all 0.5s linear;
    }
  }
  .fullscreen-enter,
  .fullscreen-leave-to {
    opacity: 0;
    .fullscreen-player-header {
      transform: translate(0, -100px);
    }
    .fullscreen-player-bottom {
      transform: translate(0, 100px);
    }
  }
  .mini-enter-active,
  .mini-leave-active {
    transition: all 0.5s linear;
  }
  .mini-enter,
  .mini-leave-to {
    opacity: 0;
    transform: translate(0, 60px);
  }
  .fullscreen-player {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: $background-color;
    .fullscreen-player-background {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background-size: 100% 100%;
      filter: blur(20px);
      opacity: 0.6;
      z-index: -1;
    }
    .fullscreen-player-header {
      .fullscreen-player-title {
        position: relative;
        height: 40px;
        line-height: 40px;
        .icon-back-wrapper {
          position: absolute;
          left: 15px;
          color: $color-theme;
          font-size: $font-size-large-x;
          .icon-back {
            transform: rotate(-90deg);
          }
        }
        .fullscreen-player-title-text {
          width: 70%;
          margin: 0 auto;
          text-align: center;
          font-size: $font-size-large;
          @include no-wrapper();
        }
      }
      .fullscreen-player-desc {
        font-size: $font-size-medium;
        text-align: center;
        line-height: 20px;
      }
    }
    .fullscreen-player-content-wrapper {
      position: fixed;
      top: 80px;
      bottom: 170px;
      width: 100%;
      .fullscreen-player-content {
        width: 100%;
        height: 100%;
        .fullscreen-player-content-cd-wrapper {
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          transition: all 0.4s;
          .fullscreen-player-content-cd {
            position: absolute;
            top: 30px;
            left: 0;
            right: 0;
            margin: auto;
            width: 80%;
            height: 100%;
            overflow: hidden;
            &>img {
              border-radius: 100%;
              border: 10px solid hsla(0,0%,100%,.1);
              box-sizing: border-box;
            }
          }
          .fullscreen-player-content-needle {
            position: absolute;
            top: 0;
            left: 40%;
            transform-origin: 12px 12px;
            transform: rotate(-25deg);
            transition: all 0.6s;
            width: 73px;
            height: 118px;
            background: url('../../../assets/imgs/needle@3x.png');
            background-size: 100% 100%;
          }
          .fullscreen-player-current-lyric {
            position: absolute;
            top: 375px;
            left: 50%;
            transform: translateX(-50%);
            font-size: $font-size-medium;
            color: $color-text-singer;
          }
        }
      }
      .scroll {
        position: absolute;
        top: 0;
        width: 100%;
        .fullscreen-player-lyric {
          // width: 100%;
          // height: 100%;
          font-size: $font-size-medium;
          white-space: pre-line;
          text-align: center;
          .fullscreen-player-lyric-line {
            line-height: 32px;
            color: $color-text-singer;
          }
          .fullscreen-player-lyric-line-hightLight {
            color: $color-text;
          }
        }
      }
      .fullscreen-player-content-dots {
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0);
        margin-top: 10px;
        display: flex;
        .fullscreen-player-content-dots-item {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: $color-text-singer;
          margin: 0 2px;
        }
        .fullscreen-player-content-dots-item-active {
          width: 20px;
          border-radius: 5px;
          background-color: $color-text-dark;
        }
      }
    }
    .fullscreen-player-bottom {
      position: absolute;
      bottom: 50px;
      left: 0;
      right: 0;
      .fullscreen-player-bottom-btn {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        &>a {
          font-size: $font-size-iconfont-medium;
          .icon-play {
            font-size: $font-size-iconfont-big;
          }
        }
      }
    }
  }
  .mini-player {
    position: fixed;
    bottom: 0;
    height: 60px;
    width: 100%;
    background-color: $background-highlight-color;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 20px;
    box-sizing: border-box;
    .mini-player-left {
      display: flex;
      align-items: center;
      .mini-player-left-img {
        width: 40px;
        height: 40px;
        margin-right: 10px;
        &>img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .mini-player-left-text {
        line-height: 20px;
        width: 210px;
        .mini-player-left-text-name {
          font-size: $font-size-medium;
          color: $color-text;
          margin-bottom: 2px;
          @include no-wrapper();
        }
        .mini-player-left-text-desc {
          font-size: $font-size-small;
          color: $color-text-singer;
          @include no-wrapper();
        }
      }
    }
    .mini-player-right {
      &>a {
        display: inline-block;
        padding: 0 6px;
        .icon-play {
          opacity: .6;
          font-size: 30px;
          position: absolute;
          left: 0;
          top: 0;
        }
        .icon-playlist {
          font-size: 30px;
          opacity: 0.6;
        }
      }
    }
    .icon-play-wrapper {
        vertical-align: -4px;
    }
  }
}

.cdRoteta {
  animation: rotate 12s linear infinite
}
.cdRotatePause {
  animation-play-state: paused
}
@keyframes rotate {
  0% {
    transform: rotate(0)
  }

  100% {
     transform: rotate(360deg)
  }
}
</style>
