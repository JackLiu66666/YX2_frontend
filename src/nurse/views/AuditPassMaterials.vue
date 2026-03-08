<template>
  <div class="audit-pass-materials-page">
    <div class="page-header">
      <el-button type="primary" @click="goBack" icon="el-icon-arrow-left" size="small">返回首页</el-button>
      <h1>审核通过材料</h1>
    </div>
    <div class="page-content">
      <el-card shadow="hover">
        <p>这里是护士审核通过后的材料展示页面。</p>
        <p>2：去主页</p>
        <el-button type="primary" @click="viewMaterials">查看材料</el-button>
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

const viewMaterials = () => {
  ElMessage.success('正在查看审核通过材料...')
  // 这里应该调用实际的查看材料接口
}
</script>

<style scoped>
.audit-pass-materials-page {
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
  .audit-pass-materials-page {
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