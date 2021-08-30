<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot />
    </div>
    <div class="slider-dots">
      <span
        :key="index"
        v-for="(item, index) in sliderNum"
        class="dot-item"
        :class="{ 'slider-active': index == currentPageIndex }">
      </span>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
export default {
  name: 'Silder',
  data () {
    return {
      sliderNum: 0,
      currentPageIndex: 0
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoplay: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    this.setSliderWidth()
    this.initSlider()
  },
  methods: {
    setSliderWidth () {
      const sliderWidth = this.$refs.slider.clientWidth
      const sliderGroupDom = this.$refs.sliderGroup
      const children = sliderGroupDom.children
      this.sliderNum = children.length
      sliderGroupDom.style.width = children.length * sliderWidth + 'px'
      children.forEach(child => {
        child.style.width = sliderWidth + 'px'
        child.style.overflow = 'hidden'
        child.classList.add('slider-item')
      })
    },
    initSlider () {
      const slider = new BScroll('.slider', {
        scrollX: true,
        scrollY: false,
        slide: {
          loop: this.loop,
          autoplay: this.autoplay,
          threshold: 100
        },
        momentum: false,
        bounce: false,
        stopPropagation: true,
        click: true
      })
      slider.on('slidePageChanged', (page) => {
        this.currentPageIndex = page.pageX
      })
    }
  }

}
</script>

<style scoped lang='scss'>
@import '../../assets/style/variable.scss';
.slider {
  position: relative;
  .slider-group {
    display: flex;
    .slider-item {
      a {
        img {
          width: 100%;
        }
      }
    }
  }
  .slider-dots {
    position: absolute;
    width: 100%;
    bottom: 8px;
    display: flex;
    justify-content: center;
    .dot-item {
      display: block;
      margin-right: 5px;
      width: 6px;
      height: 6px;
      border-radius: 6px;
      background-color: $color-text-ll;
    }
    .slider-active {
      width: 16px ;
    }
  }
}

</style>
