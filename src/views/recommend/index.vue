<template>
  <div class="recommend">
    <!-- 轮播图 -->
    <slider>
      <div v-for="item in bannerImg" :key="item.bannerId">
        <a href="">
          <img :src="item.pic" alt="" style="width: 100%">
        </a>
      </div>
    </slider>
  </div>
</template>

<script>
import Slider from '@/components/slider'
import { getBannerApi } from '@/http/recommend'
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
    }
  }
}
</script>

<style>

</style>
