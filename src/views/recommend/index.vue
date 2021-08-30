<template>
  <div class="recommend">
    <!-- 轮播图 -->
    <slider v-if="bannerImg.length">
      <div v-for="item in bannerImg" :key="item.bannerId" class="recommend-item">
        <a :href="item.url">
          <img :src="item.pic" alt="">
          <div
            class="recommend-title"
            :style='`background-color: ${item.titleColor}`'
          >
            {{ item.typeTitle }}
          </div>
        </a>
      </div>
    </slider>
  </div>
</template>

<script>
import Slider from '@/components/slider'
import { getBannerApi, getHotListApi } from '@/http/recommend'
export default {
  name: 'Recommend',
  components: {
    Slider
  },
  data () {
    return {
      bannerImg: []
    }
  },
  created () {
    const os = this.$store.state.device.deviceMsg
    this.getBannerData(os)
    this.getHotListData()
  },
  methods: {
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
      this.bannerImg = data.banners
    },
    async getHotListData () {
      const { data } = await getHotListApi()
      console.log('热门歌单', data)
    }
  }
}
</script>

<style scoped lang='scss'>
@import '../../assets/style/variable.scss';
.recommend {
  .recommend-item {
    border-radius: 8px;
    overflow: hidden;
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
</style>
