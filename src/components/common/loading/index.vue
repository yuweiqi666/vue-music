<template>
  <div class="loading">
    <img width="20" height="20" src="./loading.gif" alt="">
    <div class="loading-text">
      {{ loadingText }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    loadingText: {
      type: String,
      default: '正在加载中...'
    }
  }
}
</script>

<style scoped lang='scss'>
@import '../../../assets/style/variable.scss';
  .loading {
    text-align: center;
    .loading-text {
      font-size: $font-size-small;
      color: $color-text-d;
      line-height: 20px;
    }
  }
</style>
