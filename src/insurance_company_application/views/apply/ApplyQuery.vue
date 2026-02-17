<template>
  <div class="container" style="max-width: 800px;">
    <div class="card">
      <h2 style="color: var(--primary-color); margin-bottom: 24px;">
        申请记录查询
      </h2>
      <el-form :model="form" inline @submit.prevent="queryApply">
        <el-form-item label="申请ID">
          <el-input v-model="form.applyId" placeholder="请输入申请ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryApply">查询</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 申请详情 -->
      <div v-if="applyInfo" style="margin-top: 20px;">
        <el-card shadow="hover">
          <template #header>
          <div class="clearfix">
            <span>申请详情（ID：{{ applyInfo.id }}）</span>
            <el-tag :type="getStatusTagType(applyInfo.auditStatus)" style="float: right;">
              {{ getStatusText(applyInfo.auditStatus) }}
            </el-tag>
          </div>
          </template>

          
          <el-descriptions :column="2" border>
            <el-descriptions-item label="保险公司全称">{{ applyInfo.companyFullName }}</el-descriptions-item>
            <el-descriptions-item label="统一社会信用代码">{{ applyInfo.socialCreditCode }}</el-descriptions-item>
            <el-descriptions-item label="申请日期">{{ applyInfo.applyDate }}</el-descriptions-item>
            <el-descriptions-item label="合作业务类型">{{ applyInfo.businessType }}</el-descriptions-item>
            <el-descriptions-item label="合作区域范围">{{ applyInfo.cooperationArea }}</el-descriptions-item>
            <el-descriptions-item label="对接负责人">{{ applyInfo.contactPersonName }}</el-descriptions-item>
            <el-descriptions-item label="审核备注" :span="2">
              {{ applyInfo.auditRemark || '暂无' }}
            </el-descriptions-item>
          </el-descriptions>
          
          <div style="margin-top: 20px; text-align: center;">
            <el-button 
              v-if="applyInfo.auditStatus === 1" 
              type="primary"
              @click="toCompanyPage"
            >
              进入保险公司页面
            </el-button>
            <el-button 
              v-if="applyInfo.auditStatus === 2" 
              type="warning"
              @click="toApplyForm"
            >
              重新提交申请
            </el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getApplyById } from '../../api/application'

const router = useRouter()
const form = ref({
  applyId: ''
})
const applyInfo = ref(null)

// 查询申请
const queryApply = async () => {
  if (!form.value.applyId) {
    ElMessage.warning('请输入申请ID')
    return
  }
  
  try {
    const res = await getApplyById(form.value.applyId)
    applyInfo.value = res.data
  } catch (error) {
    applyInfo.value = null
    console.error('查询失败:', error)
  }
}

// 获取状态标签类型
const getStatusTagType = (status) => {
  switch (status) {
    case 0: return 'info'
    case 1: return 'success'
    case 2: return 'danger'
    default: return 'info'
  }
}

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 0: return '待审核'
    case 1: return '审核通过'
    case 2: return '审核不通过'
    default: return '未知状态'
  }
}

// 前往保险公司页面
const toCompanyPage = () => {
  ElMessage.info('前往保险公司页面（待开发）')
  // router.push('/company/detail?id=' + applyInfo.value.id)
}

// 重新提交申请
const toApplyForm = () => {
  router.push('ica/apply/form')
}
</script>