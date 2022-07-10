<template>
  <div class="list-view">
    <div class="cate-side">
      <div
        ref="indexItem"
        class="cate-side-item" :class="activeIndex === index ? 'click-active' : ''"
        :key="index"
        v-for="(item, index) in indexList"
        @touchstart='handleTouchStartFindex($event, index)'
        @touchmove.stop.prevent='handleTouchMoveFindex($event, index)'
      >{{item}}</div>
    </div>
    <Scroll :data='data' @pageScroll='handleScroll' @pageResize='handlePageResize' ref="scroll">
      <Loading v-if="isLoading" />
      <div v-else class="cate-content">
        <div class="cate-content-item" :key="index" v-for="(item, index) in data" ref="cateContentItem">
          <div class="cate-content-item-title">
            {{item.title}}
          </div>
          <div class="cate-content-item-wrapper" @click="$emit('handleClickItem', singer)" :key="singer.id" v-for="singer in item.children">
            <div class="singer-img">
              <img width="50" height="50" class="singer-img" v-lazy="singer.img1v1Url" alt="">
            </div>
            <div class="singer-name">{{singer.name}}</div>
          </div>
        </div>
      </div>
      <div ref="listTopFix" class="list-top-fix" v-show="fixedTitle">{{fixedTitle}}</div>
    </Scroll>
  </div>
</template>

<script>
import Scroll from '@components/common/scroll'
import Loading from '@components/common/loading'
export default {
  name: 'ListView',
  components: {
    Scroll,
    Loading
  },
  props: {
    data: {
      type: Array
    }
  },
  computed: {
    indexList () {
      let result = []
      result = this.data.map(item => {
        return item.title.slice(0, 1)
      })
      return result
    }
  },
  data () {
    return {
      isLoading: true,
      activeIndex: 0,
      distance: {
        start: 0,
        move: 0
      },
      heightToTopList: [],
      fixedTitle: ''
    }
  },
  created () {
    // this.isLoading = false
  },
  mounted () {
    // this.handleCateItemHeight()
  },
  methods: {
    refresh () {
      this.$refs.scroll.refresh()
    },
    handlePageResize () {
      this.heightToTopList = []
      this.handleCateItemHeight()
    },
    handleCateItemHeight () {
      this.$nextTick(() => {
        this.$refs.cateContentItem.forEach(cate => {
          const topHeight = cate.offsetTop
          this.heightToTopList.push(topHeight)
        })
      })
    },
    handleTouchStartFindex (e, index) {
      this.distance.start = e.touches[0].pageY
      this.distance.currentIndex = index
      this.activeIndex = index
      this.$refs.scroll.pageScrollToElement(this.$refs.cateContentItem[index], 0)
    },
    handleTouchMoveFindex (e, index) {
      this.distance.move = e.touches[0].pageY
      const height = this.$refs.indexItem[index].offsetHeight
      const distance = Math.floor((this.distance.move - this.distance.start) / height)
      const moveDistance = this.distance.currentIndex + distance
      if (moveDistance >= 0 && moveDistance <= this.$refs.cateContentItem.length - 1) {
        this.activeIndex = moveDistance
        this.$refs.scroll.pageScrollToElement(this.$refs.cateContentItem[moveDistance], 0)
      }
    },
    handleScroll (value) {
      if (value.y > 0) this.fixedTitle = ''
      const currentHeight = value.y * (-1)
      this.heightToTopList.forEach((h, index) => {
        if (this.heightToTopList[index + 1] && currentHeight >= h && currentHeight < this.heightToTopList[index + 1]) {
          this.activeIndex = index
          this.fixedTitle = this.data[index].title
          return false
        } else if (!this.heightToTopList[index + 1] && currentHeight >= this.heightToTopList[index]) {
          this.activeIndex = index
          this.fixedTitle = this.data[index].title
          return false
        }
      })
      // 计算差值  边界情况fixToptitle往上顶
      const diff = this.heightToTopList[this.activeIndex + 1] - currentHeight
      // 动态获取fixTopTitle元素高度 因为做了适配 高度会变化
      const fixTopTitleDom = this.$refs.listTopFix
      if (diff < fixTopTitleDom.offsetHeight && diff > 0) {
        this.$refs.listTopFix.style.top = -(fixTopTitleDom.offsetHeight - diff) + 'px'
      } else {
        this.$refs.listTopFix.style.top = 0
      }
    }
  },
  watch: {
    data: {
      handler (n, o) {
        if (n && n.length) {
          if (this.isLoading) this.isLoading = false
          this.handleCateItemHeight()
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped lang='scss'>
@import '@assets/style/variable.scss';
.list-view {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  .cate-side {
    position: absolute;
    top: 2%;
    right: 0;
    background-color: $background-color-d;
    width: 20px;
    font-size: 14px;
    padding-top: 15px;
    border-radius: 12px;
    z-index: 66;
    .cate-side-item {
      padding-bottom: 5px;
      font-size: $font-size-small;
      text-align: center;
      color: $color-text-singer;
    }
    .click-active {
      color: $color-theme;
    }
  }

  .list-top-fix {
    position: absolute;
    top: 0;
    z-index: 65;
    width: 100%;
    font-size: $font-size-small;
    background: $background-highlight-color;
    color: $color-text-singer;
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
  }

  .cate-content {
    .cate-content-item {
      padding-bottom: 30px;
      .cate-content-item-title {
        font-size: $font-size-small;
        background: $background-highlight-color;
        color: $color-text-singer;
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
      }
      .cate-content-item-wrapper {
        display: flex;
        padding: 20px 0 0 30px;
        .singer-img {
          width: 50px;
          height: 50px;
          border-radius: 50px;
          overflow: hidden;
        }
        .singer-name {
          font-size: $font-size-medium;
          color: $color-text-singer;
          line-height: 50px;
          margin-left: 14px;
        }
      }
    }
  }
}
</style>
