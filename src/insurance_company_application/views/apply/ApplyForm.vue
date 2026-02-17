<template>
  <div class="container">
    <div class="card">
      <h2 style="color: var(--primary-color); margin-bottom: 24px;">
        保险公司合作对接申请表
      </h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="180px" size="default">
        <!-- 基本信息 -->
        <el-divider content-position="left">基本信息</el-divider>
        <el-form-item label="保险公司全称" prop="companyFullName">
          <el-input v-model="form.companyFullName" placeholder="与营业执照一致"></el-input>
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="socialCreditCode">
          <el-input v-model="form.socialCreditCode" placeholder="18位信用代码"></el-input>
        </el-form-item>
        <el-form-item label="注册地址" prop="registeredAddress">
          <el-input v-model="form.registeredAddress" placeholder="营业执照注册地址"></el-input>
        </el-form-item>
        
        <!-- 许可证信息 -->
        <el-divider content-position="left">许可证信息</el-divider>
        <el-form-item label="经营保险业务许可证号" prop="businessLicenseNo">
          <el-input v-model="form.businessLicenseNo"></el-input>
        </el-form-item>
        <el-form-item label="许可证有效期" prop="licenseValid">
          <el-date-picker
            v-model="form.licenseValid"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          ></el-date-picker>
        </el-form-item>
        
        <!-- 联系人信息 -->
        <el-divider content-position="left">联系人信息</el-divider>
        <el-form-item label="法定代表人姓名" prop="legalPersonName">
          <el-input v-model="form.legalPersonName"></el-input>
        </el-form-item>
        <el-form-item label="法定代表人身份证号" prop="legalPersonIdCard">
          <el-input v-model="form.legalPersonIdCard"></el-input>
        </el-form-item>
        <el-form-item label="法定代表人联系电话" prop="legalPersonPhone">
          <el-input v-model="form.legalPersonPhone"></el-input>
        </el-form-item>
        <el-form-item label="对接负责人姓名" prop="contactPersonName">
          <el-input v-model="form.contactPersonName"></el-input>
        </el-form-item>
        <el-form-item label="对接负责人职务" prop="contactPersonPosition">
          <el-input v-model="form.contactPersonPosition"></el-input>
        </el-form-item>
        <el-form-item label="对接负责人手机号" prop="contactPersonMobile">
          <el-input v-model="form.contactPersonMobile"></el-input>
        </el-form-item>
        <el-form-item label="对接负责人办公电话" prop="contactPersonOfficePhone">
          <el-input v-model="form.contactPersonOfficePhone"></el-input>
        </el-form-item>
        <el-form-item label="对接负责人邮箱" prop="contactPersonEmail">
          <el-input v-model="form.contactPersonEmail"></el-input>
        </el-form-item>
        <el-form-item label="公司联系电话" prop="companyPhone">
          <el-input v-model="form.companyPhone"></el-input>
        </el-form-item>
        
        <!-- 合作信息 -->
        <el-divider content-position="left">合作信息</el-divider>
        <el-form-item label="合作业务类型" prop="businessType">
          <el-select v-model="form.businessType" placeholder="请选择">
            <el-option label="车险" value="车险"></el-option>
            <el-option label="意外险" value="意外险"></el-option>
            <el-option label="健康险" value="健康险"></el-option>
            <el-option label="企财险" value="企财险"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合作区域范围" prop="cooperationArea">
          <el-select v-model="form.cooperationArea" placeholder="请选择">
            <el-option label="全国" value="全国"></el-option>
            <el-option label="省内" value="省内"></el-option>
            <el-option label="本市" value="本市"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请合作内容" prop="cooperationContent">
          <el-input v-model="form.cooperationContent" type="textarea" :rows="3"></el-input>
        </el-form-item>
        
        <!-- 其他信息 -->
        <el-divider content-position="left">其他信息</el-divider>
        <el-form-item label="保险公司承诺" prop="companyCommitment">
          <el-input v-model="form.companyCommitment" type="textarea" :rows="3" placeholder="合规经营、资料真实有效"></el-input>
        </el-form-item>
        <el-form-item label="申请日期" prop="applyDate">
          <el-date-picker v-model="form.applyDate" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
        </el-form-item>
        
        <!-- 文件上传 -->
        <el-divider content-position="left">附件上传</el-divider>
        <el-form-item label="申请单位盖章" prop="applySeal">
          <el-upload
            v-model:file-list="sealFileList"
            :before-upload="handleSealUpload"
            :auto-upload="false"
            accept=".jpg,.png,.pdf"
            drag
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">点击或拖拽文件至此处上传</div>
            <template #tip>
              <div class="el-upload__tip">只能上传jpg/png/pdf文件，且不超过10MB</div>
            </template>
            </el-upload>
        </el-form-item>
        
        <el-form-item label="营业执照复印件">
          <FileUpload ref="fileUpload1" title="营业执照复印件（加盖公章）"></FileUpload>
        </el-form-item>
        <el-form-item label="经营保险业务许可证复印件">
          <FileUpload ref="fileUpload2" title="经营保险业务许可证复印件（加盖公章）"></FileUpload>
        </el-form-item>
        <el-form-item label="法定代表人身份证复印件">
          <FileUpload ref="fileUpload3" title="法定代表人身份证复印件"></FileUpload>
        </el-form-item>
        <el-form-item label="对接负责人身份证复印件">
          <FileUpload ref="fileUpload4" title="对接负责人身份证复印件"></FileUpload>
        </el-form-item>
        <el-form-item label="授权委托书">
          <FileUpload ref="fileUpload5" title="授权委托书（总公司授权）"></FileUpload>
        </el-form-item>
        <el-form-item label="偿付能力报告摘要">
          <FileUpload ref="fileUpload6" title="近期偿付能力报告摘要"></FileUpload>
        </el-form-item>
        
        <!-- 提交按钮 -->
        <el-form-item style="text-align: center; margin-top: 30px;">
          <el-button type="primary" @click="submitForm" size="large">
            提交申请
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import FileUpload from '../../components/FileUpload.vue'
import { submitApply, uploadFile } from '../../api/application'

const router = useRouter()
const formRef = ref(null)
const sealFileList = ref([])
const applyId = ref(null)

// 表单数据
const form = ref({
  companyFullName: '',
  socialCreditCode: '',
  registeredAddress: '',
  businessLicenseNo: '',
  licenseValid: [],
  legalPersonName: '',
  legalPersonIdCard: '',
  legalPersonPhone: '',
  contactPersonName: '',
  contactPersonPosition: '',
  contactPersonMobile: '',
  contactPersonOfficePhone: '',
  contactPersonEmail: '',
  companyPhone: '',
  businessType: '',
  cooperationArea: '',
  cooperationContent: '',
  companyCommitment: '',
  applySeal: '',
  applyDate: '',
  userId: 1 // 实际项目中需替换为登录用户ID
})

// 表单校验规则
const rules = ref({
  companyFullName: [{ required: true, message: '请输入保险公司全称', trigger: 'blur' }],
  socialCreditCode: [
    { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
    { len: 18, message: '统一社会信用代码必须为18位', trigger: 'blur' }
  ],
  registeredAddress: [{ required: true, message: '请输入注册地址', trigger: 'blur' }],
  businessLicenseNo: [{ required: true, message: '请输入许可证号', trigger: 'blur' }],
  licenseValid: [{ required: true, message: '请选择许可证有效期', trigger: 'change' }],
  legalPersonName: [{ required: true, message: '请输入法定代表人姓名', trigger: 'blur' }],
  legalPersonIdCard: [{ required: true, message: '请输入法定代表人身份证号', trigger: 'blur' }],
  legalPersonPhone: [{ required: true, message: '请输入法定代表人联系电话', trigger: 'blur' }],
  contactPersonName: [{ required: true, message: '请输入对接负责人姓名', trigger: 'blur' }],
  contactPersonPosition: [{ required: true, message: '请输入对接负责人职务', trigger: 'blur' }],
  contactPersonMobile: [{ required: true, message: '请输入对接负责人手机号', trigger: 'blur' }],
  contactPersonEmail: [{ required: true, message: '请输入对接负责人邮箱', trigger: 'blur' }],
  companyPhone: [{ required: true, message: '请输入公司联系电话', trigger: 'blur' }],
  businessType: [{ required: true, message: '请选择合作业务类型', trigger: 'change' }],
  cooperationArea: [{ required: true, message: '请选择合作区域范围', trigger: 'change' }],
  cooperationContent: [{ required: true, message: '请输入申请合作内容', trigger: 'blur' }],
  companyCommitment: [{ required: true, message: '请输入保险公司承诺', trigger: 'blur' }],
  applyDate: [{ required: true, message: '请选择申请日期', trigger: 'change' }]
})

// 处理盖章文件上传
const handleSealUpload = (file) => {
  form.value.applySeal = file
  return false // 阻止自动上传
}

// 提交表单
const submitForm = async () => {
  try {
    await formRef.value.validate()
    
    // 组装申请数据
    const applyData = {
      ...form.value,
      licenseValidStart: form.value.licenseValid[0],
      licenseValidEnd: form.value.licenseValid[1],
      applySeal: form.value.applySeal.name || ''
    }
    
    // 提交申请
    const res = await submitApply(applyData)
    applyId.value = res.data
    ElMessage.success(`申请提交成功！申请ID：${applyId.value}`)
    
    // 上传盖章文件
    if (form.value.applySeal) {
      await uploadFile(applyId.value, form.value.applySeal)
    }
    
    // 上传其他附件
    const fileUploads = [
      ref.fileUpload1,
      ref.fileUpload2,
      ref.fileUpload3,
      ref.fileUpload4,
      ref.fileUpload5,
      ref.fileUpload6
    ]
    
    for (const upload of fileUploads) {
      if (upload.value && upload.value.file) {
        await uploadFile(applyId.value, upload.value.file)
      }
    }
    
    ElMessageBox.alert(
      `申请提交成功！您的申请ID是：${applyId.value}，请妥善保管`,
      '提交成功',
      {
        confirmButtonText: '前往查询',
        callback: () => {
          router.push('ica/apply/query')
        }
      }
    )
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('申请提交失败，请重试')
  }
}
</script>