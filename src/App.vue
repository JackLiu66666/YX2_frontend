<template>
  <div id="app">
    <!-- 全局导航栏：切换模块 -->
    <!-- <header>
      <router-link to="/admin">后台管理</router-link>
      <router-link to="/ica">保险公司申请</router-link>
    </header> -->
    <!-- 主路由出口：显示当前激活的模块（即 AdminApp 或 IcaApp） -->
    <router-view />
  </div>
</template>

<script setup>
// 全局逻辑（如主题、用户状态等）可以放在这里
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}
</style>
