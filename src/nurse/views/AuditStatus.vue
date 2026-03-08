<template>
  <div class="audit-status-page">
    <div class="page-header">
      <el-button type="primary" @click="goBack" icon="el-icon-arrow-left" size="small">返回首页</el-button>
      <h1>审核状态查询</h1>
    </div>
    <div class="page-content">
      <el-card shadow="hover">
        <p>这里是护士审核状态查询页面，可以查看当前审核进度。</p>
        <p>1：去等待审核页面</p>
        <el-button type="primary" @click="refreshStatus">刷新状态</el-button>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push('/nurse/index')
}

const refreshStatus = () => {
  ElMessage.info('正在刷新审核状态...')
  // 这里应该调用实际的刷新接口
}
</script>

<style scoped>
.audit-status-page {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 15px;
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.page-header h1 {
  font-size: 18px;
  color: #667eea;
  font-weight: 600;
  margin: 0;
}

.page-content {
  max-width: 100%;
}

.el-card {
  background-color: #fff;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* 移动端适配 */
@media (max-width: 480px) {
  .audit-status-page {
    padding: 10px;
  }
  
  .page-header h1 {
    font-size: 16px;
  }
  
  .el-card {
    padding: 15px;
  }
}
</style>