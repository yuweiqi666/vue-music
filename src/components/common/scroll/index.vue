<template>
  <div class="scroll" ref="scrollWrapper">
    <slot />
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
export default {
  name: 'Scroll',
  props: {
    probeType: {
      type: Number,
      default: 3
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      bs: null
    }
  },
  mounted () {
    this.initScroll()
  },
  methods: {
    initScroll () {
      this.bs = new BScroll(this.$refs.scrollWrapper, {
        click: this.click,
        probeType: this.probeType
      })
      this.bs.on('scroll', this.scrollEvent)
      const hooks = this.bs.scroller.hooks
      hooks.on('resize', this.reSizeEvent)
    },
    refresh () {
      this.bs && this.bs.refresh()
    },
    scrollEvent (position) {
      this.$emit('pageScroll', position)
    },
    // 监听window窗口变化
    reSizeEvent () {
      this.$emit('pageResize')
    },
    pageScrollTo (...rest) {
      this.bs && this.bs.scrollTo.apply(this.bs, rest)
    },
    pageScrollToElement (...rest) {
      this.bs && this.bs.scrollToElement.apply(this.bs, rest)
    }
  },
  watch: {
    data: {
      handler (n, o) {
        this.$nextTick(() => {
          this.refresh()
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.scroll {
  overflow: hidden;
  height: 100%;
  width: 100%;
}
</style>
