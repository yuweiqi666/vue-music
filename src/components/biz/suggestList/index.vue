<template>
  <div class="suggest-list" ref="suggestList">
    <scroll :data='suggestList' @pageScroll='handlePageScroll' ref="scroll">
      <div class="suggest-list-wrapper" ref="suggestWrapper" v-if="suggestList && suggestList.length">
        <div class="suggest-list-item" v-for="(item, index) in suggestList" :key="index" @click="handleClickSearchSong(item, index)">
          <svg-icon icon-class='music' class="suggest-list-item-icon"></svg-icon>
          <div class="suggest-list-item-name">
            {{item.name}} - {{item.albums}} - {{item.desc}}
          </div>
        </div>
        <div class="loading-wrapper" v-show="isLoading">
          <loading ref="loading"></loading>
        </div>
      </div>
      <div v-else>
        <no-result text="抱歉，暂无搜索结果"></no-result>
      </div>
    </scroll>
  </div>
</template>

<script>
import Loading from '@components/common/loading'
import Scroll from '@components/common/scroll'
import { getKwSearchApi } from '@/http/search'
import { mapActions, mapMutations } from 'vuex'
import NoResult from '@components/common/noResult'
export default {
  name: 'SuggestList',
  components: {
    Loading,
    Scroll,
    NoResult
  },
  props: {
    query: {
      type: String
    }
  },
  data () {
    return {
      suggestList: [],
      isLoading: false,
      isFinish: false,
      offset: 0
    }
  },
  methods: {
    ...mapMutations('player', {
      updatePlaying: 'update_playing'
    }),
    ...mapActions('player', [
      'getPlayerData',
      'initPlayer'
    ]),
    async getKwSearch (query) {
      const res = await getKwSearchApi(query)
      if (!res.data.result.songCount) {
        this.isFinish = true
        return
      }
      const currentSuggestList = res.data.result.songs.map(item => ({
        name: item.name,
        desc: item.ar.map(item => item.name).join('/'),
        albums: item.al.name,
        id: item.id,
        dt: item.dt
      }))
      this.suggestList.push(...currentSuggestList)
      this.isLoading = false
      if (res.data.result.songCount <= this.offset + 30) this.isFinish = true
    },
    handlePageScroll (position) {
      if (!this.suggestList.length) return
      const toTopH = this.$refs.suggestList.clientHeight
      const boxH = this.$refs.suggestWrapper.clientHeight
      if (boxH <= toTopH - position.y && !this.isFinish && !this.isLoading) {
        this.isLoading = true
      }
    },
    async handleClickSearchSong (data, index) {
      try {
        this.updatePlaying(true)
        this.initPlayer({
          list: this.suggestList,
          index,
          isFullScreen: true
        })
        await this.getPlayerData({ id: data.id })
      } catch (error) {
        console.log('error', error)
      }
    }
  },
  watch: {
    query: {
      handler (n, o) {
        console.log('n', n)
        this.suggestList = []
        if (n) {
          this.getKwSearch({
            keywords: n,
            offset: 0
          })
        } else {
          this.isFinish = false
          this.offset = 0
          this.$refs.suggestWrapper.style.paddingBottom = '60px'
        }
      }
    },
    isLoading: {
      handler (n, o) {
        if (n) {
          this.offset += 30
          this.getKwSearch({
            keywords: this.query,
            offset: this.offset
          })
        }
      }
    },
    isFinish: {
      handler (n, o) {
        if (n) {
          this.$refs.suggestWrapper.style.paddingBottom = 0
          this.$nextTick(() => {
            this.$refs.scroll.refresh()
          })
        }
      }
    }
  }
}
</script>

<style scoped lang='scss'>
  @import '@assets/style/variable.scss';
  @import '@assets/style/mixins.scss';
  .suggest-list {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 20px;
    right: 20px;
    .suggest-list-wrapper {
      position: relative;
      width: 100%;
      padding-bottom: 60px;
      .suggest-list-item {
        display: flex;
        align-items: center;
        width: 100%;
        .suggest-list-item-icon {
          font-size: $font-size-small;
          margin-right: 6px;
        }
        .suggest-list-item-name {
          flex: 1;
          @include no-wrapper;
          line-height: 24px;
          color: $color-text-singer;
          font-size: $font-size-small;
        }
      }
      .loading-wrapper {
        position: absolute;
        bottom: 0;
        width: 100%;
      }
    }
  }
</style>
