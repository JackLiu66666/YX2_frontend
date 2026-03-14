<template>
  <div class="business-agency-page">
    <!-- 顶部导航栏 -->
    <div class="business-nav">
      <el-button
        v-for="item in businessTypes"
        :key="item.value"
        :type="currentBusiness === item.value ? 'primary' : 'default'"
        @click="handleBusinessClick(item.value)"
        class="nav-btn"
      >
        {{ item.label }}
      </el-button>
    </div>

    <!-- 代理商列表展示区 -->
    <div class="agency-list-container">
      <el-card class="agency-list-card">
        <template #header>
          <div class="card-header">
            <span class="current-business-title">{{ currentBusinessLabel }}</span>
            <span class="agency-count">共 {{ agencyList.length }} 家代理商</span>
          </div>
        </template>

        <el-table
          :data="agencyList"
          style="width: 100%"
          v-loading="loading"
          empty-text="暂无代理商数据"
        >
          <el-table-column
            prop="agencyId"
            label="代理商 ID"
            width="120"
          />
          <el-table-column
            prop="agencyFullName"
            label="代理商全称"
          />
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "BusinessAgency",
  data() {
    return {
      businessTypes: [
        { value: 1, label: "院陪诊" },
        { value: 2, label: "院陪护" },
        { value: 3, label: "院办办" },
        { value: 4, label: "院保保" },
        { value: 5, label: "院垫垫" },
        { value: 6, label: "院探探" }
      ],
      currentBusiness: 1,
      agencyList: [],
      loading: false
    };
  },
  computed: {
    currentBusinessLabel() {
      const current = this.businessTypes.find(item => item.value === this.currentBusiness);
      return current ? current.label : '';
    }
  },
  mounted() {
    this.fetchAgencyList(1);
  },
  methods: {
    handleBusinessClick(businessValue) {
      this.currentBusiness = businessValue;
      this.fetchAgencyList(businessValue);
    },
    async fetchAgencyList(businessValue) {
      this.loading = true;
      try {
        const res = await request.get(`/admin/businessScope/${businessValue}`);
        if (res.code === 200) {
          this.agencyList = res.data || [];
        } else {
          this.$message.error(res.msg || '获取数据失败');
          this.agencyList = [];
        }
      } catch (error) {
        console.error("获取代理商列表异常", error);
        this.$message.error("网络错误，请稍后重试");
        this.agencyList = [];
      } finally {
        this.loading = false;
      }
    }
  },
};
</script>

<style scoped>
.business-agency-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.business-nav {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.nav-btn {
  min-width: 120px;
}

.agency-list-container {
  flex: 1;
  overflow: hidden;
}

.agency-list-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.current-business-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.agency-count {
  font-size: 14px;
  color: #909399;
}

:deep(.el-card__body) {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}
</style>