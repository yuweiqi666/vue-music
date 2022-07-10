<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <div class="no-result-text">{{text}}</div>
  </div>
</template>

<script>
export default {
  name: 'NoResult',
  props: {
    text: {
      type: String,
      default: '无结果'
    }
  }
}
</script>

<style scoped lang='scss'>
@import '@assets/style/variable.scss';
@import '@assets/style/mixins.scss';
.no-result-icon {
  width: 86px;
  height: 90px;
  margin: 0 auto;
  @include bg-image('../../../assets/imgs/no-result');
  background-size: 86px 90px;
}
.no-result-text {
  margin-top: 20px;
  font-size: $font-size-medium;
  color: $color-text-d;
  text-align: center;
}
</style>
