<template>
  <div class="m-container">
    <div class="m-tab">
      <div class="m-tab-item">
        <router-link to="/dashboard/recommend">
          <span>推荐</span>
        </router-link>
      </div>
      <div class="m-tab-item">
        <router-link to="/dashboard/singer">
          <span>歌手</span>
        </router-link>
      </div>
      <div class="m-tab-item">
        <router-link to="/dashboard/rank">
          <span>排行</span>
        </router-link>
      </div>
      <div class="m-tab-item">
        <router-link to="/dashboard/search">
          <span>搜索</span>
        </router-link>
      </div>
    </div>
    <div class="m-wrapper">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MContainer'
}
</script>

<style scoped lang='scss'>
  @import '../../../assets/style/variable.scss';
  .m-container {
    .m-tab {
      height: 44px;
      display: flex;
      justify-content: space-around;
      .m-tab-item {
        flex: 1;
        text-align: center;
        line-height: 44px;
        font-size: $font-suze-medium;
        color: $colot-text-ll;
        .router-link-active {
          span {
            padding-bottom: 5px;
            border-bottom: 2px solid $color-theme;
          }
        }
      }
    }
  }
</style>
