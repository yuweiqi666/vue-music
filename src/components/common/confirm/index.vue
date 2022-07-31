<template>
  <transition name="fade">
    <div class="confirm" v-show="isShow">
      <div class="confirm-text">{{msg}}</div>
      <div class="confirm-btn-wrapper">
        <div class="cancel-btn" @click="$emit('update:isShow', false)">取消</div>
        <div class="confirm-btn" @click="$emit('onConfirm')">确定</div>
      </div>
    </div>
  </transition>
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
  .confirm {
    position: fixed;
    top: 300px;
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
  @keyframes scaleDia {
    0% {
      opacity: 0;
      transform: scale(0);
    }
    80% {
      opacity: 0.8;
      transform: scale(1.1);
    }
    100% {
      opacity: 1;
      transform-origin: center center;
      transform: scale(1);
    }
  }
</style>
