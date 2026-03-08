<template>
  <div class="audit-application-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-button type="primary" @click="goBack" icon="el-icon-arrow-left" size="small" round>返回</el-button>
      <h1>护士资质审核申请</h1>
    </div>

    <!-- 表单内容 -->
    <div class="page-content">
      <el-card shadow="never" class="form-card">
        <!-- 提示信息 -->
        <el-alert 
          v-if="hasApplied" 
          title="您已提交过申请，不可重复提交" 
          type="warning" 
          show-icon 
          class="mb-20"
        />

        <el-form 
          ref="applicationFormRef" 
          :model="applicationForm" 
          :rules="formRules" 
          label-width="0px"
          :disabled="hasApplied"
        >
          <!-- 基础信息 -->
          <div class="section-title">基础信息</div>
          
          <el-form-item prop="nurseName">
            <el-input 
              v-model="applicationForm.nurseName" 
              placeholder="请输入真实姓名"
              size="large"
              prefix-icon="el-icon-user"
            />
          </el-form-item>
          
          <el-form-item prop="idCard">
            <el-input 
              v-model="applicationForm.idCard" 
              placeholder="请输入身份证号码"
              size="large"
              prefix-icon="el-icon-document"
              maxlength="18"
            />
          </el-form-item>
          
          <el-form-item prop="phone">
            <el-input 
              v-model="applicationForm.phone" 
              placeholder="请输入手机号码"
              size="large"
              prefix-icon="el-icon-phone"
              maxlength="11"
            />
          </el-form-item>

          <!-- 专业资质 -->
          <div class="section-title">专业资质</div>
          
          <el-form-item prop="nursingLevel">
            <el-select 
              v-model="applicationForm.nursingLevel" 
              placeholder="请选择护理级别"
              size="large"
              style="width: 100%"
            >
              <el-option label="初级护士" value="初级" />
              <el-option label="中级护士" value="中级" />
              <el-option label="高级护士" value="高级" />
              <el-option label="主管护师" value="主管" />
            </el-select>
          </el-form-item>
          
          <el-form-item prop="workYears">
            <el-input-number 
              v-model="applicationForm.workYears" 
              :min="0"
              :max="50"
              placeholder="工作年限"
              size="large"
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item prop="certificateNumber">
            <el-input 
              v-model="applicationForm.certificateNumber" 
              placeholder="请输入护士执业证书编号"
              size="large"
              prefix-icon="el-icon-medal"
            />
          </el-form-item>

          <!-- 工作经历 -->
          <div class="section-title">工作经历</div>
          
          <el-form-item prop="hospitalName">
            <el-input 
              v-model="applicationForm.hospitalName" 
              placeholder="请输入当前/最近工作医院"
              size="large"
              prefix-icon="el-icon-office-building"
            />
          </el-form-item>
          
          <el-form-item prop="department">
            <el-input 
              v-model="applicationForm.department" 
              placeholder="请输入所在科室"
              size="large"
              prefix-icon="el-icon-school"
            />
          </el-form-item>

          <!-- 承诺与文件 -->
          <div class="section-title">承诺声明</div>
          
          <el-form-item prop="commitment">
            <el-checkbox v-model="applicationForm.commitment" label="1">
              我承诺所提供的所有信息真实有效，如有虚假愿意承担相应责任
            </el-checkbox>
          </el-form-item>

          <!-- 提交按钮 -->
          <el-form-item class="submit-section">
            <el-button 
              type="primary" 
              @click="submitApplication" 
              size="large"
              :loading="submitting"
              class="submit-btn"
            >
              {{ submitting ? '提交中...' : '提交申请' }}
            </el-button>
            <el-button 
              @click="resetForm" 
              size="large"
              class="reset-btn"
            >
              重置表单
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import request from '../../utils/request'

const router = useRouter()
const applicationFormRef = ref(null)
const submitting = ref(false)
const hasApplied = ref(false)

// 表单数据
const applicationForm = reactive({
  nurseName: '',
  idCard: '',
  phone: '',
  nursingLevel: '',
  workYears: null,
  certificateNumber: '',
  hospitalName: '',
  department: '',
  commitment: false
})

// 表单校验规则
const formRules = {
  nurseName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度为2-10个字符', trigger: 'blur' }
  ],
  idCard: [
    { required: true, message: '请输入身份证号码', trigger: 'blur' },
    { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, 
      message: '请输入有效的身份证号码', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }
  ],
  nursingLevel: [
    { required: true, message: '请选择护理级别', trigger: 'change' }
  ],
  workYears: [
    { required: true, message: '请输入工作年限', trigger: 'blur' }
  ],
  certificateNumber: [
    { required: true, message: '请输入护士执业证书编号', trigger: 'blur' }
  ],
  hospitalName: [
    { required: true, message: '请输入工作医院名称', trigger: 'blur' }
  ],
  department: [
    { required: true, message: '请输入所在科室', trigger: 'blur' }
  ],
  commitment: [
    { required: true, message: '请同意承诺声明', trigger: 'change' }
  ]
}

// 返回首页
const goBack = () => {
  router.push('/nurse/index')
}

// 检查是否已提交申请
const checkApplied = async () => {
  try {
    const res = await request.get('/nurse/audit-application/check-applied')
    if (res.code === 200) {
      hasApplied.value = res.data
    }
  } catch (error) {
    console.log('检查申请状态失败')
  }
}

// 提交申请
const submitApplication = async () => {
  try {
    const valid = await applicationFormRef.value.validate()
    if (!valid) return

    await ElMessageBox.confirm('确认提交申请？提交后不可修改', '提示', {
      confirmButtonText: '确认提交',
      cancelButtonText: '取消',
      type: 'warning'
    })

    submitting.value = true
    
    const res = await request.post('/nurse/audit-application/submit', applicationForm)
    
    if (res.code === 200) {
      ElMessage.success('申请提交成功，请等待审核')
      hasApplied.value = true
    } else {
      ElMessage.error(res.msg)
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('提交失败：' + (error.response?.data?.msg || error.message))
    }
  } finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  applicationFormRef.value.resetFields()
}

// 页面加载时检查申请状态
onMounted(() => {
  checkApplied()
})
</script>

<style scoped>
.audit-application-page {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 12px;
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-header h1 {
  font-size: 18px;
  color: #667eea;
  font-weight: 600;
  margin: 0;
  flex: 1;
  text-align: center;
}

.page-content {
  max-width: 100%;
}

.form-card {
  background-color: #fff;
  border-radius: 15px;
  padding: 20px 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 16px;
  color: #667eea;
  font-weight: 600;
  margin: 20px 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #eef0ff;
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}

:deep(.el-input__inner),
:deep(.el-select) {
  height: 45px;
  border-radius: 10px;
  font-size: 15px;
}

:deep(.el-textarea__inner) {
  border-radius: 10px;
  font-size: 15px;
  min-height: 80px;
}

:deep(.el-checkbox__label) {
  font-size: 14px;
  line-height: 1.4;
}

.submit-section {
  margin-top: 25px;
  text-align: center;
}

.submit-btn, .reset-btn {
  width: 45%;
  height: 45px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  margin-right: 10px;
}

.reset-btn {
  border: 1px solid #667eea;
  color: #667eea;
}

.mb-20 {
  margin-bottom: 20px;
}

/* 移动端优化 */
@media (max-width: 480px) {
  .audit-application-page {
    padding: 10px;
  }
  
  .page-header {
    margin-bottom: 12px;
    gap: 10px;
  }
  
  .page-header h1 {
    font-size: 16px;
  }
  
  .form-card {
    padding: 15px 12px;
  }
  
  .section-title {
    font-size: 15px;
    margin: 18px 0 12px 0;
  }
  
  :deep(.el-input__inner),
  :deep(.el-select) {
    height: 42px;
    font-size: 14px;
  }
  
  :deep(.el-textarea__inner) {
    font-size: 14px;
    min-height: 70px;
  }
  
  .submit-btn, .reset-btn {
    width: 48%;
    height: 42px;
    font-size: 15px;
  }
  
  :deep(.el-checkbox__label) {
    font-size: 13px;
  }
}

/* 超小屏幕优化 */
@media (max-width: 360px) {
  .audit-application-page {
    padding: 8px;
  }
  
  .page-header h1 {
    font-size: 15px;
  }
  
  .form-card {
    padding: 12px 10px;
  }
  
  .section-title {
    font-size: 14px;
  }
  
  :deep(.el-input__inner),
  :deep(.el-select) {
    height: 40px;
    font-size: 13px;
  }
  
  .submit-btn, .reset-btn {
    height: 40px;
    font-size: 14px;
  }
}
</style>