<template>
  <div class="audit-status-page">
    <div class="page-header">
      <el-button type="primary" @click="goBack">返回首页</el-button>
      <h1>保险公司审核申请状态页面</h1>
    </div>
    <div class="page-content">
      <el-card shadow="hover">
        <p>该页面展示保险公司待审核状态的进度信息，后续可开发审核进度跟踪、审核人员信息、预计完成时间等功能。</p>
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
.audit-status-page {
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