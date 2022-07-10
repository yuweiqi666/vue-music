<template>
  <div class="search" ref="search">
    <div class="search-input-wrapper">
      <Inputer
        v-model="searchValue"
        @change="handleValChange"
        placeholder="搜索歌曲、歌手"
      ></Inputer>
    </div>
    <div class="hot-search-wrapper" v-show="!searchValue">
      <div class="hot-search-title">热门搜索</div>
      <div class="hot-search-loading" v-if="!hotList || !hotList.length">
        <Loading></Loading>
      </div>
      <div class="hot-search-content" v-else>
        <div
          class="hot-search-item"
          v-for="(hot, index) in hotList"
          :key="index"
          @click="handleClickHot(hot)"
        >{{hot}}</div>
      </div>
    </div>
    <div class="suggest-list-wrapper" v-show="searchValue">
      <suggest-list ref="suggestList" :query='searchValue'></suggest-list>
    </div>
  </div>
</template>

<script>
import Inputer from '@components/common/inputer'
import { getHotSearchApi } from '@/http/search.js'
import SuggestList from '@components/biz/suggestList'
import Loading from '@components/common/loading'
import { playlistUpdate } from '@/mixins/playlistUpdate'
export default {
  name: 'Search',
  mixins: [playlistUpdate],
  components: {
    Inputer,
    SuggestList,
    Loading
  },
  data () {
    return {
      searchValue: '',
      hotList: []
    }
  },
  created () {
    this.getHotSearchData()
  },
  methods: {
    handleValChange (value) {
      console.log('修改的value值', value)
    },
    async getHotSearchData () {
      const res = await getHotSearchApi()
      this.hotList = res.data.result.hots.map(item => item.first)
    },
    handleClickHot (hotVal) {
      this.searchValue = hotVal
    },
    handlePlayListRefresh (playList) {
      this.$refs.suggestList.$el.style.bottom = playList && playList.length ? '60px' : 0
      this.$nextTick(() => {
        this.$refs.suggestList.$refs.scroll.refresh()
      })
    }
  }
}
</script>

<style scoped lang='scss'>
@import '@assets/style/variable.scss';
.search {
  position: absolute;
  width: 100%;
  bottom: 0;
  top: 0;
  height: 100%;
  .search-input-wrapper {
    margin: 20px;
  }
  .hot-search-wrapper {
    padding: 0 20px;
    .hot-search-title {
      color: $color-text-singer;
      font-size: $font-size-medium;
    }
    .hot-search-content {
      .hot-search-item {
        display: inline-block;
        color: $color-text-singer;
        font-size: $font-size-small;
        background-color: $background-color-l;
        padding: 6px;
        border-radius: 5px;
        margin-right: 10px;
      }
    }
  }
  .suggest-list-wrapper {
    padding: 0 30px;
    position: absolute;
    top: 72px;
    bottom: 20px;
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
