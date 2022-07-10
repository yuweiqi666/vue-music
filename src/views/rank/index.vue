<template>
  <div class="rank" ref="rank">
    <scroll :data='rankList' ref="scroll">
      <div class="rank-list-wrapper">
        <div class="rank-list-item" v-for="rank in rankList" :key="rank.id" @click="hancleClickRank(rank)">
          <div class="rank-list-left">
            <img v-lazy='rank.coverImgUrl' alt="">
          </div>
          <div class="rank-list-right">
            <div class="rank-list-right-item" v-for="(song, index) in rank.tracks" :key="index">
              {{index + 1}}. {{song.first}}
            </div>
          </div>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Scroll from '@components/common/scroll'
import { getSongRankListApi } from '@/http/rank'
import { playlistUpdate } from '@/mixins/playlistUpdate'
import { getSongListDetailApi } from '@http/recommend'
export default {
  name: 'Rank',
  mixins: [playlistUpdate],
  components: {
    Scroll
  },
  data () {
    return {
      rankList: []
    }
  },
  created () {
    this.getSongRankList()
  },
  methods: {
    async getSongRankList () {
      const res = await getSongRankListApi()
      console.log(res.data.list)
      this.rankList = res.data.list
      this.rankList.forEach(async song => {
        if (!song.tracks || !song.tracks.length) {
          const rankDetail = await getSongListDetailApi({
            id: song.id
          })
          song.tracks = rankDetail.data.playlist.tracks.slice(0, 3).map(item => ({
            first: item.name
          }))
        }
      })
    },
    hancleClickRank (data) {
      console.log('data', data)
      const { id, coverImgUrl, name } = data
      this.$router.push({
        name: 'rankDetail',
        params: { id },
        query: { picUrl: coverImgUrl, name }
      })
    },
    handlePlayListRefresh (playList) {
      this.$refs.rank.style.bottom = playList && playList.length ? '60px' : 0
      this.$refs.scroll.refresh()
    }
  }
}
</script>

<style scoped lang='scss'>
@import '@assets/style/variable.scss';
@import '@assets/style/mixins.scss';
.rank {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  .rank-list-wrapper {
    .rank-list-item {
      height: 100px;
      padding-top: 20px;
      margin: 0 20px;
      display: flex;
      .rank-list-left {
        width: 100px;
        height: 100px;
        &>img {
          width: 100%;
          height: 100%;
        }
      }
      .rank-list-right {
        flex: 1;
        color: $color-text-l-singer;
        background-color: $background-color-l;
        font-size: $font-size-small;
        padding: 0 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        line-height: 26px;
        overflow: hidden;
        .rank-list-right-item {
          @include no-wrapper;
        }
      }
      &:last-child {
        padding-bottom: 20px;
      }
    }
  }
}
</style>
