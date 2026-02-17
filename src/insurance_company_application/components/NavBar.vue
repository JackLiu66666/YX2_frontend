<template>
  <el-header style="background-color: var(--ica-primary); color: white; line-height: 60px;">
    <el-container>
      <el-aside width="200px">
        <h1 style="font-size: 20px; margin: 0;">院小二-保险公司申请</h1>
      </el-aside>
      <el-main style="text-align: right;">
        <el-menu 
          :default-active="activeIndex" 
          mode="horizontal" 
          text-color="white" 
          active-text-color="#ffd04b"
        >
          <el-menu-item index="1" @click="toPage('/ica/register')">
            <el-icon><user /></el-icon>
            <span>账号注册</span>
          </el-menu-item>
          <el-menu-item index="2" @click="toPage('/ica/apply/form')">
            <el-icon><form /></el-icon>
            <span>提交申请</span>
          </el-menu-item>
          <el-menu-item index="3" @click="toPage('/ica/apply/query')">
            <el-icon><search /></el-icon>
            <span>查询申请</span>
          </el-menu-item>
          <el-menu-item index="4" @click="toPage('/ica/admin/apply/list')">
            <el-icon><tools /></el-icon>
            <span>申请管理</span>
          </el-menu-item>
          <!-- 可添加返回主admin的入口 -->
          <el-menu-item index="5" @click="toPage('/admin')">
            <el-icon><home /></el-icon>
            <span>返回主管理系统</span>
          </el-menu-item>
        </el-menu>
      </el-main>
    </el-container>
  </el-header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Search, Tools, Home } from '@element-plus/icons-vue'

const router = useRouter()
const activeIndex = ref('1')

// 跳转页面（限定在本模块内）
const toPage = (path) => {
  router.push(path)
}
</script>

<style scoped>
.el-header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
}

.el-menu {
  background-color: transparent;
}
</style>