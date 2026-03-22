<template>
  <div class="audit-pass-materials-page">
    <div class="page-header">
      <el-button type="primary" @click="goBack">返回首页</el-button>
      <h1>代理商个人资料</h1>
    </div>
    
    <div class="page-content">
      <el-card shadow="hover" v-loading="loading">
        <template #header>
          <div class="card-header">
            <span class="company-name">{{ agencyInfo.agencyFullName || '暂无数据' }}</span>
            <el-tag type="success" size="large">审核通过</el-tag>
          </div>
        </template>
        
        <div v-if="!loading && agencyInfo.agencyFullName" class="info-container">
          <!-- 基本信息 -->
          <div class="info-section">
            <h2 class="section-title">基本信息</h2>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="机构全称">{{ agencyInfo.agencyFullName }}</el-descriptions-item>
              <el-descriptions-item label="统一社会信用代码">{{ agencyInfo.socialCreditCode }}</el-descriptions-item>
              <el-descriptions-item label="注册地址">{{ agencyInfo.registeredAddress }}</el-descriptions-item>
              <el-descriptions-item label="机构类型">{{ agencyInfo.agencyType }}</el-descriptions-item>
              <el-descriptions-item label="营业执照注册号">{{ agencyInfo.businessLicenseNo }}</el-descriptions-item>
              <el-descriptions-item label="执照有效期">
                {{ agencyInfo.licenseValidStart }} 至 {{ agencyInfo.licenseValidEnd }}
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 法人信息 -->
          <div class="info-section">
            <h2 class="section-title">法人信息</h2>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="法人姓名">{{ agencyInfo.legalPersonName }}</el-descriptions-item>
              <el-descriptions-item label="法人身份证号">{{ agencyInfo.legalPersonIdCard }}</el-descriptions-item>
              <el-descriptions-item label="法人手机号">{{ agencyInfo.legalPersonPhone }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 联系人信息 -->
          <div class="info-section">
            <h2 class="section-title">联系人信息</h2>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="联系人姓名">{{ agencyInfo.contactPersonName }}</el-descriptions-item>
              <el-descriptions-item label="联系人职位">{{ agencyInfo.contactPersonPosition }}</el-descriptions-item>
              <el-descriptions-item label="联系人手机">{{ agencyInfo.contactPersonPhone }}</el-descriptions-item>
              <el-descriptions-item label="联系人办公电话">{{ agencyInfo.contactPersonOfficePhone }}</el-descriptions-item>
              <el-descriptions-item label="联系人邮箱">{{ agencyInfo.contactPersonEmail }}</el-descriptions-item>
              <el-descriptions-item label="公司固定电话">{{ agencyInfo.companyFixedPhone }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 业务范围 -->
          <div class="info-section">
            <h2 class="section-title">业务范围</h2>
            <div class="business-scope">
              <el-tag 
                v-for="scope in businessScopeList" 
                :key="scope"
                type="primary"
                size="medium"
                class="scope-tag"
              >
                {{ scope }}
              </el-tag>
            </div>
          </div>

          <!-- 合作区域 -->
          <div class="info-section">
            <h2 class="section-title">合作区域</h2>
            <div class="cooperation-area">
              <div v-for="(area, index) in cooperationAreaList" :key="index" class="area-item">
                <span class="area-province">{{ area.province }}</span>
                <span class="area-divider">-</span>
                <span class="area-city">{{ area.city }}</span>
                <span class="area-hospitals">
                  {{ getHospitalText(area.hospitalIds) }}
                </span>
              </div>
            </div>
          </div>

          <!-- 合作模式 -->
          <div class="info-section">
            <h2 class="section-title">合作模式</h2>
            <div class="cooperation-mode">
              <el-tag type="success" size="large">{{ agencyInfo.cooperationMode }}</el-tag>
            </div>
          </div>
        </div>

        <el-empty v-else-if="!loading" description="暂无数据" />
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const router = useRouter()
const loading = ref(true)
const agencyInfo = ref({})
const businessScopeList = ref([])
const cooperationAreaList = ref([])

// 业务范围代码映射
const getBusinessScopeName = (code) => {
  switch (code) {
    case '1': return '院陪诊'
    case '2': return '院陪护'
    case '3': return '院办办'
    case '4': return '院保保'
    case '5': return '院垫垫'
    case '6': return '院探探'
    default: return `未知业务 (${code})`
  }
}

// 获取医院文本描述
const getHospitalText = (hospitalIds) => {
  if (!hospitalIds || hospitalIds.length === 0) {
    return '全市'
  }
  return `已选择 ${hospitalIds.length} 家医院`
}

// 获取代理商信息
const getAgencyInfo = async () => {
  try {
    const res = await request.get('/agency/getAgencyInfo')
    if (res.code === 200 && res.data) {
      agencyInfo.value = res.data
      
      // 解析业务范围
      if (res.data.businessScope) {
        try {
          const scopeArray = JSON.parse(res.data.businessScope)
          businessScopeList.value = scopeArray.map(code => getBusinessScopeName(code))
        } catch (e) {
          console.error('解析业务范围失败:', e)
          businessScopeList.value = []
        }
      }
      
      // 解析合作区域
      if (res.data.cooperationArea) {
        try {
          cooperationAreaList.value = JSON.parse(res.data.cooperationArea)
        } catch (e) {
          console.error('解析合作区域失败:', e)
          cooperationAreaList.value = []
        }
      }
    }
  } catch (error) {
    console.error('获取代理商信息失败:', error)
    ElMessage.error('获取代理商信息失败')
  } finally {
    loading.value = false
  }
}

// 返回首页
const goBack = () => {
  router.push('/agency/index')
}

onMounted(() => {
  getAgencyInfo()
})
</script>

<style scoped>
.audit-pass-materials-page {
  width: 100%;
  min-height: 100vh;
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

.page-header h1 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
}

.el-card {
  background-color: #fff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.company-name {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

.info-container {
  padding: 10px 0;
}

.info-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  color: #409EFF;
  margin: 0 0 15px 0;
  padding-left: 10px;
  border-left: 4px solid #409EFF;
}

.business-scope {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.scope-tag {
  margin-right: 5px;
}

.cooperation-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.area-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.area-province {
  font-weight: bold;
  color: #606266;
  margin-right: 5px;
}

.area-divider {
  color: #909399;
  margin: 0 8px;
}

.area-city {
  color: #606266;
  margin-right: 15px;
}

.area-hospitals {
  color: #909399;
  font-size: 14px;
}

.cooperation-mode {
  padding: 10px 0;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .audit-pass-materials-page {
    padding: 10px;
  }
  
  .page-header h1 {
    font-size: 20px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .company-name {
    font-size: 18px;
  }
  
  .section-title {
    font-size: 16px;
  }
  
  .area-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .area-city {
    margin-right: 0;
  }
}
</style>