<template>
  <div class="audit-container">
    <el-card class="audit-card">
      <h1>审核界面</h1>
      <p>这里是院小二系统的审核功能区域，后续可扩展具体审核逻辑</p>
      <el-button type="default" @click="goBack" style="margin-top: 20px">返回首页</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Audit',
  methods: {
    // 返回后台首页
    goBack() {
      this.$router.push('/home')
    }
  }
}
</script>

<style scoped>
.audit-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}
.audit-card {
  width: 600px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
h1 {
  color: #1989fa;
  margin-bottom: 20px;
}
</style>