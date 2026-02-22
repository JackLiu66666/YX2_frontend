<template>
  <div class="agent-index">
    <div class="header">
      <h1 style="color: #1989fa;">院小二 - 代理商管理系统</h1>
    </div>
    <div class="content">
      <el-card shadow="hover">
        <h2>欢迎进入代理商界面</h2>
        <p>该界面待开发，后续可扩展代理商的核心功能（如订单管理、数据统计等）</p>
      </el-card>
    </div>
  </div>
</template>

<script setup>
// 暂无需逻辑，仅占位
</script>

<style scoped>
.agent-index {
  width: 100vw;
  height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
  box-sizing: border-box;
}

.header {
  margin-bottom: 20px;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

.el-card {
  background-color: #fff;
  padding: 20px;
}
</style>