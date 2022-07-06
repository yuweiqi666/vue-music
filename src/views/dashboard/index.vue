<template>
  <div class="dashboard">
    <m-header></m-header>
    <m-container></m-container>
  </div>
</template>

<script>
import MHeader from './components/m-header.vue'
import MContainer from './components/m-container.vue'
export default {
  name: 'Dashboard',
  components: {
    MHeader,
    MContainer
  }
}
</script>

<style scoped lang='scss'>
</style>
