<template>
  <div class="home-container">
    <!-- 顶部栏 -->
    <el-header style="text-align: right; font-size: 12px">
      <div style="display: flex; justify-content: flex-end; align-items: center">
        <span>欢迎回来，{{ adminName }}</span>
        <el-button type="text" @click="logout" style="margin-left: 15px">退出登录</el-button>
      </div>
    </el-header>

    <!-- 主要内容区 -->
    <el-main>
      <div class="main-content">
        <!-- 地图组件 -->
        <AgencyMap />

        <!-- 按钮区域 -->
        <el-card class="home-card">
          <div style="display: flex; gap: 20px">
            <el-button type="primary" size="large" @click="goToAudit"> 进入代理商审核界面 </el-button>
            <el-button type="primary" size="large" @click="goToInsurance"> 进入保险公司审核界面 </el-button>
          </div>
        </el-card>
      </div>
    </el-main>
  </div>
</template>

<script>
import request from "@/utils/request"; // 根据实际路径导入封装的 request 模块
import AgencyMap from "@/admin/views/AgencyMap.vue";

export default {
  name: "Home",
  components: {
    AgencyMap,
  },
  data() {
    return {
      adminName: "admin", // 实际可从登录状态获取
    };
  },
  methods: {
    goToAudit() {
      this.$router.push("agencyAudit");
    },
    goToInsurance() {
      this.$router.push("insuranceCompany");
    },
    async logout() {
      try {
        const res = await request.post("/admin/logout");
        if (res.code === 200) {
          this.$message.success("退出成功！");
          // 跳转到登录页
          this.$router.push("login");
        } else {
          this.$message.error(res.msg || "退出失败");
        }
      } catch (error) {
        console.error("退出请求异常", error);
        this.$message.error("网络错误，请稍后重试");
      }
    },
  },
};
</script>

<style scoped>
.home-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-header {
  background-color: #f5f7fa;
  border-bottom: 1px solid #e6e9f0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.el-main {
  padding: 20px;
  overflow-y: auto;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.home-card {
  width: auto;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
}
</style>
