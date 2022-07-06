<template>
  <div class="process-circle-wrapper">
    <svg viewBox='0 0 100 100' xmlns="http://www.w3.org/2000/svg">
      <circle class="process-bg" cx="50" cy="50" r="50" stroke="green" stroke-width="8" fill="transparent"></circle>
      <circle
        class="process-circle"
        cx="50"
        cy="50"
        r="50"
        stroke="green"
        stroke-width="8"
        fill="transparent"
        :stroke-dasharray='dasharray'
        :stroke-dashoffset='dashoffset'
      ></circle>
    </svg>
    <slot ></slot>
  </div>
</template>

<script>
export default {
  name: 'ProcessCircle',
  props: {
    percent: {
      type: Number,
      default: 0.1
    }
  },
  data () {
    return {
      dasharray: Math.PI * 100
    }
  },
  computed: {
    dashoffset () {
      return this.dasharray * (1 - this.percent)
    }
  }
}
</script>

<style scoped lang='scss'>
@import '@assets/style/variable.scss';
.process-circle-wrapper {
  position: relative;
  width: 30px;
  height: 30px;
  .process-bg {
    transform-origin: center;
    transform: scale(0.8);
    stroke: $color-theme-d;
    opacity: .1;
  }
  .process-circle {
    stroke: $color-theme;
    transform-origin: center;
    transform: scale(0.8) rotate(-90deg);
  }
}

</style>
