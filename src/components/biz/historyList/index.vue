<template>
  <div class="historyList-wrapper">
    <scroll ref="scroll" :data='historyList'>
      <div class="historyList">
        <div class="historyList-item" v-for="(history, index) in historyList" :key="index" @click="$emit('clickHistoryItem', history)">
          <div class="historyList-item-left">
            {{history}}
          </div>
          <a href="javascript:;" class="historyList-item-right" @click.stop="deleteHistory(history)">
            <svg-icon icon-class='clear'></svg-icon>
          </a>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '@components/common/scroll'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'HistoryList',
  components: {
    Scroll
  },
  computed: {
    ...mapState({
      historyList: state => state.search.historyList
    })
  },
  data () {
    return {

    }
  },
  methods: {
    ...mapMutations('search', {
      deleteHistory: 'delete_history'
    })
  }
}
</script>

<style scoped lang='scss'>
@import '@assets/style/variable.scss';
.historyList-wrapper {
  width: 100%;
  height: 100%;
  .historyList {
    .historyList-item {
      display: flex;
      justify-content: space-between;
      color: $color-text-l;
      font-size: $font-size-medium;
      margin-bottom: 10px;
      .historyList-item-left {
        line-height: $font-size-large-x;
      }
      .historyList-item-right {
        font-size: $font-size-large-x;
      }
    }
  }
}
</style>
