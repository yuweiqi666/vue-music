<template>
  <div class="recommend">
    <scroll :data='recommendList' ref="scroll">
      <div>
        <!-- 轮播图 -->
        <slider v-if="bannerImg.length">
          <div v-for="item in bannerImg" :key="item.bannerId" class="recommend-item">
            <a :href="item.url">
              <img @load='imgLoad' :src="item.pic" alt="">
              <div
                class="recommend-title"
                :style='`background-color: ${item.titleColor}`'
              >
                {{ item.typeTitle }}
              </div>
            </a>
          </div>
        </slider>
        <!-- 推荐列表 -->
        <div class="recommend-list">
          <div class="recommend-list-title">
            热门歌单推荐
          </div>
          <div class="recommend-list-wrapper">
            <div v-for="item in recommendList" :key="item.id" class="recommend-list-wrapper-item">
              <!-- {{ item.name }} -->
              <div class="recommend-list-wrapper-item-side-img">
                <img v-lazy="item.picUrl" alt="">
              </div>
              <div class="recommend-list-wrapper-item-side-content">
                <div class="recommend-list-wrapper-item-side-content-title">
                  {{ item.name }}
                </div>
                <div class="recommend-list-wrapper-item-side-content-text">
                  {{ item.copywriter }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import Slider from '@/components/slider'
import Scroll from '@/components/scroll'
import { getBannerApi, getHotListApi } from '@/http/recommend'
import { handleBannerImg } from './format/index'
export default {
  name: 'Recommend',
  components: {
    Slider,
    Scroll
  },
  data () {
    return {
      // 轮播图片
      bannerImg: [],
      // 推荐歌单列表数据
      recommendList: [],
      // img轮播图的第一张图片是否加载
      isLoadImg: false
    }
  },
  created () {
    // 获取设备os  不同的手机系统调用接口传的参数不一样
    const os = this.$store.state.device.deviceMsg
    this.getBannerData(os)
    this.getHotListData()
  },
  methods: {
    // 获取轮播图
    async getBannerData (os) {
      const typeObj = {
        pc: 0,
        android: 1,
        ios: 2,
        ipad: 3
      }
      const { data } = await getBannerApi({
        type: typeObj[os]
      })
      this.bannerImg = handleBannerImg(data.banners, os)
    },
    // 获取推荐歌单
    async getHotListData () {
      const { data } = await getHotListApi()
      this.recommendList = data.result
    },
    // 轮播图图片加载后触发
    imgLoad () {
      console.log('加载图片')
      if (!this.isLoadImg) {
        this.$refs.scroll.refresh()
        this.isLoadImg = true
      }
    }
  }
}
</script>

<style scoped lang='scss'>
@import '../../assets/style/variable.scss';
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .scroll {
    height: 100%;
    overflow: hidden;
    .slider {
      .recommend-item {
        border-radius: 8px;
        overflow: auto;
        a {
          position: relative;
          .recommend-title {
            position: absolute;
            bottom: 0;
            right: 0;
            font-size: $font-size-small;
            text-align: center;
            padding: 2px 4px;
            border-radius: 10px 0 0 0;
            color: $color-text-ll;
          }
        }
      }
    }
    .recommend-list {
      .recommend-list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-suze-medium;
        color: $color-theme;
      }
      .recommend-list-wrapper {
        padding: 0 20px;
        .recommend-list-wrapper-item {
          display: flex;
          padding-bottom: 20px;
          .recommend-list-wrapper-item-side-img {
            width: 60px;
            height: 60px;
            margin-right: 20px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .recommend-list-wrapper-item-side-content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-size: $font-suze-medium;
            .recommend-list-wrapper-item-side-content-title {
              margin-bottom: 10px;
              color: $color-text-ll;
            }
            .recommend-list-wrapper-item-side-content-text {
              color: $color-text-d;
            }
          }
        }
      }
    }
  }

}
</style>
