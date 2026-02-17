<template>
  <el-container style="height: 100vh;">
    <NavBar />
    <el-main class="ica-container">
      <!-- 这里可以放模块内的路由出口，或直接使用根路由出口 -->
      <router-view />
    </el-main>
    <el-footer style="text-align: center; font-size: 12px; color: var(--ica-gray);">
      院小二管理系统 - 保险公司申请模块 ©2026
    </el-footer>
  </el-container>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import './styles/index.css'
</script>

<style scoped>
.el-main {
  margin-top: 60px;
  padding: 20px;
}

.el-footer {
  padding: 10px 0;
  background-color: #f5f8fa;
}
</style>