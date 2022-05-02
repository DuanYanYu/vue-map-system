<template>
  <div class="main">
    <mc-gis m-width="100vw" m-height="100vh"></mc-gis>
  </div>
</template>

<script>
export default {
  name: 'MapBase',
  data() { // 可直接挂载到data数据上
    return {
      Width: document.documentElement.clientWidth,
      Height: document.documentElement.clientHeight
    }
  }
}
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
}
.main {
}
</style>
