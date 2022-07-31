<template>
  <div class="m-header">
    <div class="m-logo"></div>
    <div class="m-title">Chicken Music</div>
    <a href="javascript:;" class="m-mine" @click="$router.push('/dashboard/user')">
      <svg-icon icon-class="mine"></svg-icon>
    </a>
  </div>
</template>

<script>
export default {
  name: 'MHeader'
}
</script>

<style scoped lang='scss'>
@import '@assets/style/variable.scss';
@import '@assets/style/mixins.scss';
.m-header {
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  .m-logo {
    width: 30px;
    height: 32px;
    margin-right: 9px;
    @include bg-image('../../../assets/imgs/logo')
  }
  .m-title {
    color: $color-theme;
    font-size: $font-size-large;
  }
  .m-mine {
    position: absolute;
    right: 10px;
    font-size: $font-size-large;
    color: $color-theme;
  }
}
</style>
