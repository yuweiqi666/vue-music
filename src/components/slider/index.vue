<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot />
    </div>
    <div class="slider-dots"></div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
export default {
  name: 'Silder',
  mounted () {
    this.$nextTick(() => {
    // 设置轮播图容器的宽度
      // const silderGroupDom = this.$refs.sliderGroup
      // console.log('silderGroupDom', silderGroupDom)
      // const childrenDom = silderGroupDom.children
      // console.log('childrenDom', childrenDom)
      // const sliderWidth = this.$refs.slider.clientWidth
      // childrenDom.forEach(child => {
      //   child.style.width = sliderWidth + 'px'
      // })

      // this.$refs.sliderGroup.style.width = 12 * 100 + '%'

    })
    setTimeout(() => {
      this.setSliderGroupWidth()

      const bs = new BScroll('.slider', {
        scrollX: true
      })
      console.log(bs)
    }, 20)
  },
  methods: {
    setSliderGroupWidth () {
      const sliderGroup = this.$refs.sliderGroup
      const children = sliderGroup.children
      const sliderWidth = this.$refs.slider.clientWidth
      children.forEach(child => {
        child.classList.add('slider-item')
        child.style.width = sliderWidth + 'px'
      })
      sliderGroup.style.width = children.length * sliderWidth + 'px'
    }
  }

}
</script>

<style scoped lang='scss'>
.slider {
  .slider-group {
    .slider-item {
      display: flex;
      a {
      display: block;
      width: 100%;
        img {
          vertical-align: middle;
        }
      }
    }

  }
}
</style>
