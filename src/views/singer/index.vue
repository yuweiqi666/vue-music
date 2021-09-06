<template>
  <div class="singer">
    i am singer
  </div>
</template>

<script>
import { getSingerListApi } from '@/http/singer'
export default {
  name: 'Singer',
  async created () {
    const res = await getSingerListApi()
    console.log('歌手列表', res)
  }
}
</script>

<style>

</style>
