<template>
  <div class="audit-pass-materials-page">
    <div class="page-header">
      <el-button type="primary" @click="goBack">返回首页</el-button>
      <h1>保险公司审核通过的原始资料页面</h1>
    </div>
    <div class="page-content">
      <el-card shadow="hover">
        <p>该页面展示保险公司审核通过后的原始提交资料存档，后续可开发资料预览、下载、打印等功能。</p>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
//import { ElMessage } from 'element-plus'

const router = useRouter()

// 返回首页
const goBack = () => {
  router.push('index')
}
</script>

<style scoped>
.audit-pass-materials-page {
  width: 100vw;
  height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
}

.el-card {
  background-color: #fff;
  padding: 30px;
  font-size: 16px;
  line-height: 1.8;
}
</style>