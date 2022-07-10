<template>
  <div class="inputer">
    <svg-icon icon-class='search' class="icon-search icon-style"></svg-icon>
    <input
      ref="input"
      type="text"
      :value='value'
      @compositionstart='handleCompositionStart'
      @compositionend='handleCompositionend'
      @input="handleInput"
      :placeholder="placeholder"
    >
    <a href="javascript:;" v-show="isShowClear" @click="handleClick">
      <svg-icon icon-class='dismiss' class="icon-dismiss icon-style"></svg-icon>
    </a>
  </div>
</template>

<script>
export default {
  name: 'Inputer',
  props: {
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    value: {
      type: String
    }
  },
  methods: {
    handleCompositionStart () {
      this.isCompleteInput = false
    },
    handleCompositionend () {
      this.isCompleteInput = true
    },
    handleInput (e) {
      setTimeout(() => {
        if (this.isCompleteInput) this.$emit('input', e.target.value)
      }, 0)
    },
    handleClick () {
      this.$emit('input', '')
    }
  },
  data () {
    return {
      isShowClear: false,
      isCompleteInput: true
    }
  },
  watch: {
    value: {
      handler (n) {
        this.isShowClear = !!(n)
        this.$emit('change', n)
      }
    }
  }
}
</script>

<style scoped lang='scss'>
@import '@assets/style/variable.scss';
.inputer {
  position: relative;
  vertical-align: top;
  height: 32px;
  .icon-style {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    font-size: $font-size-large-xx;
    color: $color-text-l-singer;
  }
  .icon-search {
    left: 5px;
  }
  input {
    outline: none;
    background-color: $background-color-l;
    border: 0;
    width: 100%;
    height: 100%;
    border-radius: 6px;
    box-sizing: border-box;
    padding: 0 32px;
    vertical-align: top;
    color: $color-text;
  }
  .icon-dismiss {
    right: 5px;
    font-size: $font-size-large;
  }
}
</style>
