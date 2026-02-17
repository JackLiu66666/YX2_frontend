<template>
  <div class="home-container">
    <el-header style="text-align: right; font-size: 12px">
      <el-dropdown>
        <i class="el-icon-setting" style="margin-right: 15px"></i>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span>欢迎回来，{{ adminName }}</span>
    </el-header>
    <el-main>
      <el-card class="home-card">
        <el-button type="primary" size="large" @click="goToAudit" icon="el-icon-check"> 进入审核界面 </el-button>
      </el-card>
    </el-main>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      adminName: "admin", // 简化处理，实际可从登录返回结果中获取
    };
  },
  methods: {
    // 跳转到审核界面
    goToAudit() {
      this.$router.push("/audit");
    },
  },
};
</script>

<style scoped>
.home-container {
  height: 100vh;
}
.home-card {
  width: 500px;
  height: 300px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
