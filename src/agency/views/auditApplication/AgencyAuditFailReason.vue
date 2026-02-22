<template>
  <div class="audit-fail-reason-page">
    <div class="page-header">
      <el-button type="primary" @click="goBack">返回首页</el-button>
      <h1>代理商审核失败原因页面</h1>
    </div>
    <div class="page-content">
      <el-card shadow="hover" type="warning">
        <p>该页面展示代理商审核不通过的具体原因，后续可开发原因说明、重新提交申请入口、客服咨询等功能。</p>
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
  router.push('/agency/index')
}
</script>

<style scoped>
.audit-fail-reason-page {
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