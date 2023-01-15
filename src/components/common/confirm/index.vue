<template>
  <div class="confirm-wrapper" v-show="isShow">
    <transition name="fade">
      <div class="confirm" v-show="isShow">
        <div class="confirm-text">{{msg}}</div>
        <div class="confirm-btn-wrapper">
          <div class="cancel-btn" @click="$emit('update:isShow', false)">取消</div>
          <div class="confirm-btn" @click="$emit('onConfirm')">确定</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Confirm',
  props: {
    msg: {
      type: String,
      default: '是否确定？'
    },
    isShow: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped lang='scss'>
@import '@assets/style/variable.scss';
@import '@assets/style/mixins.scss';
  .confirm-wrapper {
    background-color: rgba($color: #000000, $alpha: 0.5);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
  }
  .confirm {
    position: absolute;
    top: 35%;
    right: 0;
    left: 0;
    margin: auto;
    background-color: $background-highlight-color;
    width: 240px;
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px 0 0 0;
    box-sizing: border-box;
    border-radius: 20px;
    .confirm-text {
      font-size: $font-size-medium;
      text-align: center;
      padding-bottom: 25px;
      @include border-1px-bottom(#fff);
    }
    .confirm-btn-wrapper {
      font-size: $font-size-medium-x;
      display: flex;
      flex: 1;
      align-items: center;
      .cancel-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        flex: 1;
        @include border-1px-right(#fff);
      }
      .confirm-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        flex: 1;
      }
    }
  }
  .fade-enter-active {
    animation: scaleDia 0.2s ease;
  }
  .fade-leave-active {
    animation: scaleDia 0.2s ease reverse;
  }
</style>
