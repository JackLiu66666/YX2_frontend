<template>
  <div class="home-container">
    <!-- 顶部栏 -->
    <el-header class="header">
      <div class="header-content">
        <span class="system-title">院小二 - 管理员后台</span>
        <!-- 用一个容器包裹右侧元素，方便整体右对齐 -->
        <div class="header-right">
          <span class="welcome-text">欢迎回来，{{ adminName }}</span>
          <el-button type="text" @click="logout" class="logout-btn">退出登录</el-button>
        </div>
      </div>
    </el-header>

    <!-- 主体内容区（左侧导航 + 右侧内容） -->
    <div class="main-body">
      <!-- 左侧导航栏 -->
      <el-aside class="sidebar">
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          @select="handleMenuSelect"
        >
          <el-menu-item index="map">
            <el-icon><Location /></el-icon>
            <span>全国服务网络布局地图</span>
          </el-menu-item>
          <el-menu-item index="business">
            <el-icon><OfficeBuilding /></el-icon>
            <span>业务范围布局列表</span>
          </el-menu-item>
          <el-menu-item index="audit">
            <el-icon><Document /></el-icon>
            <span>代理商申请审核</span>
          </el-menu-item>
          <el-sub-menu index="organization-management">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>机构与人员管理</span>
            </template>
            <el-menu-item index="admin-management">
              <el-icon><User /></el-icon>
              <span>管理员管理</span>
            </el-menu-item>
            <el-menu-item index="agency-management">
              <el-icon><Shop /></el-icon>
              <span>代理商管理</span>
            </el-menu-item>
            <el-menu-item index="insurance-company-management">
              <el-icon><DataLine /></el-icon>
              <span>保险公司管理</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="hospital-data">
            <template #title>
              <el-icon><DataAnalysis /></el-icon>
              <span>医院数据分析</span>
            </template>
            <el-menu-item index="hospital-data-list">
              <el-icon><Document /></el-icon>
              <span>医院数据列表</span>
            </el-menu-item>
            <el-menu-item index="hospital-data-rank">
              <el-icon><TrendCharts /></el-icon>
              <span>医院星级排行</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- 右侧内容区 -->
      <el-main class="content-area">
        <!-- 地图组件 -->
        <div v-if="activeMenu === 'map'" class="map-wrapper">
          <AgencyMap />
        </div>

        <!-- 代理商审核页面 -->
        <div v-if="activeMenu === 'audit'" class="audit-page-wrapper">
          <AgencyAuditPage />
        </div>

        <!-- 管理员管理页面 -->
        <div v-if="activeMenu === 'admin-management'" class="admin-management-wrapper">
          <AdminManagement />
        </div>

        <!-- 代理商管理页面 -->
        <div v-if="activeMenu === 'agency-management'" class="agency-management-wrapper">
          <AgencyManagement />
        </div>

        <!-- 保险公司管理页面 -->
         <div v-if="activeMenu === 'insurance-company-management'" class="insurance-company-management-wrapper">
          <InsuranceCompanyManagement />
        </div>

        <!-- 业务范围代理商页面 -->
        <div v-if="activeMenu === 'business'" class="business-page-wrapper">
          <BusinessAgency />
        </div>

        <!-- 医院数据列表页面 -->
        <div v-if="activeMenu === 'hospital-data-list'" class="hospital-data-wrapper">
          <HospitalDataList />
        </div>

        <!-- 医院星级排行页面 -->
        <div v-if="activeMenu === 'hospital-data-rank'" class="hospital-rank-wrapper">
          <HospitalRank />
        </div>
      </el-main>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import AgencyMap from "@/admin/views/AgencyMap.vue";
import AgencyAuditPage from "@/admin/views/AgencyAuditPage.vue";
import BusinessAgency from "@/admin/views/BusinessAgency.vue";
import HospitalDataList from "@/admin/views/HospitalData/HospitalDataList.vue";
import HospitalRank from "@/admin/views/HospitalData/HospitalRank.vue";
import AdminManagement from "@/admin/views/Management/AdminManagement.vue";
import AgencyManagement from "@/admin/views/Management/AgencyManagement.vue";
import InsuranceCompanyManagement from "@/admin/views/Management/InsuranceCompanyManagement.vue";
import { Location, Document, OfficeBuilding, DataAnalysis, Setting, User, Shop, DataLine, TrendCharts } from "@element-plus/icons-vue";

export default {
  name: "Home",
  components: {
    AgencyMap,
    AgencyAuditPage,
    BusinessAgency,
    HospitalDataList,
    HospitalRank,
    AdminManagement,
    AgencyManagement,
    InsuranceCompanyManagement,
    Location,
    Document,
    OfficeBuilding,
    DataAnalysis,
    Setting,
    User,
    Shop,
    DataLine,
    TrendCharts
  },
  data() {
    return {
      adminName: "admin",
      activeMenu: "map", // 默认显示地图
    };
  },
  methods: {
    handleMenuSelect(index) {
      this.activeMenu = index;
    },
    async logout() {
      try {
        const res = await request.post("/admin/logout");
        if (res.code === 200) {
          this.$message.success("退出成功！");
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
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e6e9f0;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  height: 60px;
  padding: 0 20px;
  width: 100%;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.system-title {
  font-size: 18px;
  font-weight: bold;
  color: #409EFF;
  margin-right: auto;
}

.welcome-text {
  font-size: 14px;
  color: #606266;
}

.logout-btn {
  margin-left: 10px;
  color: #409EFF;
  font-size: 14px;
}

.main-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 220px;
  background-color: #304156;
  overflow-y: auto;
  flex-shrink: 0;
}

.sidebar-menu {
  border-right: none;
  height: 100%;
}

.content-area {
  flex: 1;
  padding: 0;
  overflow-y: auto;
  background-color: #f5f7fa;
}

.map-wrapper {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.map-wrapper .map-container {
  width: 100%;
  height: 100%;
}

.audit-page-wrapper {
  width: 100%;
  height: 100%;
}

.business-page-wrapper {
  width: 100%;
  height: 100%;
}

.hospital-data-wrapper {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.hospital-rank-wrapper {
  width: 100%;
  height: 100%;
}

.admin-management-wrapper {
  width: 100%;
  height: 100%;
}

.agency-management-wrapper {
  width: 100%;
  height: 100%;
}

.insurance-company-management-wrapper {
  width: 100%;
  height: 100%;
}

:global(body),
:global(html) {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
</style>
