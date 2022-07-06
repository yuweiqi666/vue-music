<template>
  <div class="fullscreen-player-bottom-process" ref="processWrapper">
    <div class="process-start-time">{{displayCurrentTime | formatmillionSecond}}</div>
    <div class="process-bar" ref="process" @click="clickProcessBar">
      <div class="process-bar-inner" ref="currentTimeProcess"></div>
      <div class="process-bar-round-wrapper" ref="processBarRound">
        <div
          class="process-bar-round"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchmove"
          @touchend="handleTouchend"
        ></div>
      </div>
    </div>
    <div class="process-end-time">{{dt | formatmillionSecond}}</div>
  </div>
</template>

<script>
export default {
  name: 'ProcessBar',
  props: {
    dt: {
      type: Number
    },
    currentTime: {
      type: Number
    }
  },
  data () {
    return {
      isChangeProcess: false,
      isControlProcess: false,
      displayCurrentTime: this.currentTime
    }
  },
  methods: {
    updateProcess (currentTime) {
      this.$nextTick(() => {
        const processRef = this.$refs.currentTimeProcess
        const processBarRoundRef = this.$refs.processBarRound
        const dtWidth = this.$refs.process.clientWidth
        const innerWidth = dtWidth * (currentTime / this.dt) + 'px'
        processRef.style.width = innerWidth
        processBarRoundRef.style.transform = `translate(${innerWidth}, -50%)`
      })
    },
    handleTouchStart (e) {
      this.isControlProcess = true
    },
    handleTouchend (e) {
      this.isControlProcess = false
      const currentTime = this.getCurrentTimeByProcess(e.changedTouches[0]?.pageX)
      this.$emit('update:currentTime', currentTime)
      this.isChangeProcess = true
    },
    handleTouchmove (e) {
      const currentTime = this.getCurrentTimeByProcess(e.targetTouches[0]?.pageX)
      this.displayCurrentTime = currentTime
      this.updateProcess(currentTime)
    },
    clickProcessBar (e) {
      const currentTime = this.getCurrentTimeByProcess(e.pageX)
      this.updateProcess(currentTime)
      this.isChangeProcess = true
      this.$emit('update:currentTime', currentTime)
    },
    getCurrentTimeByProcess (x) {
      if (!x) return 0
      const processMoveWidth = x - this.$refs.process.getBoundingClientRect().left
      const totalProcessWidth = this.$refs.process.clientWidth
      let currentTime = (processMoveWidth / totalProcessWidth) * this.dt
      if (currentTime < 0) currentTime = 0
      if (currentTime > this.dt) currentTime = this.dt
      return currentTime
    }
  },
  watch: {
    currentTime: {
      handler (n, o) {
        if (this.isChangeProcess) {
          this.$emit('currentTimeUpdate', n)
          this.isChangeProcess = false
        }
        if (!this.isControlProcess) {
          this.updateProcess(n)
          this.displayCurrentTime = n
        }
      }
    }
  }
}
</script>

<style scoped lang='scss'>
@import '@assets/style/variable.scss';
.fullscreen-player-bottom-process {
  display: flex;
  align-items: center;
  height: 30px;
  width: 80%;
  margin: 0 auto;
  padding: 10px 0;
  .process-start-time,
  .process-end-time {
    font-size: $font-size-small;
    color: $color-text;
  }
  .process-start-time {
    padding-right: 10px;
  }
  .process-end-time {
    padding-left: 10px;
  }
  .process-bar {
    position: relative;
    width: 100%;
    height: 4px;
    background-color: $background-color-d;
    .process-bar-inner {
      position: absolute;
      left: 0;
      right: 0;
      height: 100%;
      background-color: $color-theme;
    }
    .process-bar-round-wrapper {
      position: absolute;
      left: -10px;
      top: 50%;
      transform: translate(0, -50%);
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      .process-bar-round {
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        background-color: $color-theme;
        border-radius: 50%;
      }
    }

  }
}
</style>
