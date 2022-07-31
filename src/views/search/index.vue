<template>
  <div class="search" ref="search">
    <div class="search-input-wrapper">
      <Inputer
        v-model="searchValue"
        @change="handleValChange"
        placeholder="搜索歌曲、歌手"
      ></Inputer>
    </div>
    <div class="search-result-wrapper" v-show="!searchValue">
      <div class="hot-search-wrapper">
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
      <div class="history-list-wrapper" v-show="historyList && historyList.length">
        <div class="history-list-title">
          <div class="history-list-title-left">搜索历史</div>
          <a href="javascript:;" class="history-list-title-right" @click="isShow=true">
            <svg-icon icon-class='delete'></svg-icon>
          </a>
        </div>
        <div class="history-list-content" ref="historyListWrapper">
          <history-list ref="historyList" @clickHistoryItem='searchValue = $event'></history-list>
        </div>
      </div>
    </div>
    <div class="suggest-list-wrapper" v-show="searchValue" ref="suggestListWrapper">
      <suggest-list ref="suggestList" :query='searchValue'></suggest-list>
    </div>
    <confirm :isShow.sync='isShow' @onConfirm='onConfirm'></confirm>
  </div>
</template>

<script>
import Inputer from '@components/common/inputer'
import { getHotSearchApi } from '@/http/search.js'
import SuggestList from '@components/biz/suggestList'
import Loading from '@components/common/loading'
import { playlistUpdate } from '@/mixins/playlistUpdate'
import HistoryList from '@components/biz/historyList'
import Confirm from '@components/common/confirm'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Search',
  mixins: [playlistUpdate],
  components: {
    Inputer,
    SuggestList,
    Loading,
    HistoryList,
    Confirm
  },
  data () {
    return {
      searchValue: '',
      hotList: [],
      isShow: false
    }
  },
  computed: {
    ...mapState({
      historyList: state => state.search.historyList
    })
  },
  created () {
    this.getHotSearchData()
  },
  methods: {
    ...mapMutations('search', {
      clearHistory: 'clear_history'
    }),
    handleValChange (value) {
      if (!value) this.$refs.historyList.$refs.scroll.refresh()
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
      this.$refs.suggestListWrapper.style.bottom = playList && playList.length ? 0 : '20px'
      this.$refs.historyListWrapper.style.bottom = playList && playList.length ? '80px' : '20px'
      this.$nextTick(() => {
        this.$refs.suggestList.$refs.scroll.refresh()
      })
    },
    onConfirm () {
      this.isShow = false
      this.clearHistory()
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
  .search-result-wrapper {
    padding: 0 20px;
    .hot-search-wrapper {
      margin-bottom: 20px;
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
    .history-list-wrapper {
      .history-list-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: $color-text-singer;
        .history-list-title-left {
          font-size: $font-size-medium;
        }
        .history-list-title-right {
          font-size: $font-size-large;
        }
      }
      .history-list-content {
        position: fixed;
        top: 340px;
        bottom: 20px;
        left: 20px;
        right: 20px;
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
