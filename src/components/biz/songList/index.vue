<template>
  <div class="song-list">
    <loading v-if="!data || !data.length"></loading>
    <div v-else class="song-list-item" @click="selectSong(song, index)" :key="song.id" v-for="(song, index) in data">
      <div class="song-list-item-left" v-if="index <= 2 && showRank" :class="`song-list-item-left-${index + 1}`"></div>
      <div class="song-list-item-left" v-else-if="showRank">{{index + 1}}</div>
      <div class="song-list-item-right">
        <div class="song-list-item-name">{{song.name}}</div>
        <div class="song-list-item-desc">{{song.desc}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from '@components/common/loading'
export default {
  name: 'SongList',
  props: {
    data: {
      type: Array
    },
    showRank: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Loading
  },
  methods: {
    selectSong (song, index) {
      this.$emit('selectSong', song, index)
    }
  }
}
</script>

<style scoped lang='scss'>
@import '@assets/style/variable.scss';
@import '@assets/style/mixins.scss';
.song-list {
  padding: 20px 30px;
  background: $background-color;
  .song-list-item {
    font-size: $font-size-medium;
    height: 64px;
    display: flex;
    align-items: center;
    .song-list-item-left {
      width: 25px;
      height: 24px;
      margin-right: 20px;
      font-size: $font-size-large;
      color: $color-theme;
      text-align: center;
    }
    .song-list-item-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 20px;
      @include no-wrapper;
      .song-list-item-name {
        color: $color-text;
        margin-bottom: 4px;
        @include no-wrapper()
      }
      .song-list-item-desc {
        color: $color-text-singer;
        @include no-wrapper()
      }
    }
  }
  .song-list-item-left-1 {
    background: url('../../../assets/imgs/first.png');
    background-size: 25px 24px;
  }
  .song-list-item-left-2 {
    background: url('../../../assets/imgs/second.png');
    background-size: 25px 24px;
  }
  .song-list-item-left-3 {
    background: url('../../../assets/imgs/third.png');
    background-size: 25px 24px;
  }
}
</style>
