<template>
  <div class="scroll">
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
      default: 1
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
      this.bs = new BScroll('.scroll')
    },
    refresh () {
      this.bs && this.bs.refresh()
    }
  },
  watch: {
    data: {
      handler (n, o) {
        console.log('n', n)
        this.$nextTick(() => {
          this.refresh()
        })
      }
    }
  }
}
</script>

<style scoped lang='scss'></style>
