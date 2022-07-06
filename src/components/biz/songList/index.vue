<template>
  <div class="song-list">
    <loading v-if="!data || !data.length"></loading>
    <div v-else class="song-list-item" @click="selectSong(song, index)" :key="song.id" v-for="(song, index) in data">
      <div class="song-list-item-name">{{song.name}}</div>
      <div class="song-list-item-desc">{{song.desc}}</div>
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
    font-size: $font-suze-medium;
    height: 64px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 20px;
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
</style>
