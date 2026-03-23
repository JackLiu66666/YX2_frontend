<template>
  <div class="agency-management-page">
    <div class="module-not-available">
      <el-icon class="lock-icon"><Lock /></el-icon>
      <h2 class="title">该模块暂未开放</h2>
      <p class="description">代理商管理功能敬请期待后续更新...</p>
    </div>
  </div>
</template>

<script setup>
import { Lock } from '@element-plus/icons-vue'
// 代理商管理页面
</script>

<style scoped>
.agency-management-page {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.module-not-available {
  text-align: center;
  padding: 60px 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.lock-icon {
  font-size: 80px;
  color: #909399;
  margin-bottom: 20px;
}

.title {
  color: #606266;
  font-size: 24px;
  margin-bottom: 10px;
  font-weight: 600;
}

.description {
  color: #909399;
  font-size: 16px;
  margin: 0;
}
</style>
