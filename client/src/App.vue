<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
<style lang="less">
@import url("@/assets/css/base.css");
@import url("@/assets/css/iconfont.css");
// 全屏背景2 
// #app {
//   position: fixed;
//   background: url("@/assets/imgs/bg.jpeg") no-repeat;
//   background-size: 100% 100%;
//   height: 100%;
//   width: 100%;
//   z-index: -1;
// 
body {
    height: 100%;
    width: 100%;
    background: url("@/assets/imgs/bg.jpeg") no-repeat;
    background-size: cover;
  }
</style>
