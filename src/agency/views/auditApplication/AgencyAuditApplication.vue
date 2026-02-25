<template>
  <div class="audit-application-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-button type="primary" @click="goBack" icon="el-icon-arrow-left">返回首页</el-button>
      <h1>代理商合作审核申请表</h1>
    </div>

    <!-- 表单内容 -->
    <div class="page-content">
      <el-card shadow="hover" class="form-card">
        <!-- 提示：已提交申请则禁用表单 -->
        <el-alert v-if="hasApplied" title="您已提交过申请，不可重复提交" type="warning" closable show-icon class="mb-4" />

        <el-form ref="applicationFormRef" :model="applicationForm" :rules="formRules" label-width="180px" :disabled="hasApplied">
          <!-- 基础信息 -->
          <el-divider content-position="left">基础信息</el-divider>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="机构全称" prop="agencyFullName">
                <el-input v-model="applicationForm.agencyFullName" placeholder="请输入与营业执照一致的机构全称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="统一社会信用代码" prop="socialCreditCode">
                <el-input v-model="applicationForm.socialCreditCode" placeholder="请输入18位信用代码" maxlength="18" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="注册地址" prop="registeredAddress">
            <el-input v-model="applicationForm.registeredAddress" type="textarea" :rows="2" placeholder="请输入营业执照注册地址" />
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="机构类型" prop="agencyType">
                <el-select v-model="applicationForm.agencyType" placeholder="请选择机构类型">
                  <el-option label="保险代理" value="保险代理" />
                  <el-option label="保险经纪" value="保险经纪" />
                  <el-option label="渠道代理" value="渠道代理" />
                  <el-option label="其他" value="其他" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经营许可证/备案号" prop="businessLicenseNo">
                <el-input v-model="applicationForm.businessLicenseNo" placeholder="请输入许可证/备案号" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="许可证有效期" prop="licenseValidRange">
            <el-date-picker v-model="applicationForm.licenseValidRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
          </el-form-item>

          <!-- 法定代表人信息 -->
          <el-divider content-position="left">法定代表人信息</el-divider>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="法定代表人姓名" prop="legalPersonName">
                <el-input v-model="applicationForm.legalPersonName" placeholder="请输入姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="法定代表人身份证号" prop="legalPersonIdCard">
                <el-input v-model="applicationForm.legalPersonIdCard" placeholder="请输入18位身份证号" maxlength="18" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="法定代表人手机号" prop="legalPersonPhone">
                <el-input v-model="applicationForm.legalPersonPhone" placeholder="请输入手机号" maxlength="11" />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 对接负责人信息 -->
          <el-divider content-position="left">对接负责人信息</el-divider>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="对接负责人姓名" prop="contactPersonName">
                <el-input v-model="applicationForm.contactPersonName" placeholder="请输入姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="对接负责人职务" prop="contactPersonPosition">
                <el-input v-model="applicationForm.contactPersonPosition" placeholder="请输入职务" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="对接负责人手机号" prop="contactPersonPhone">
                <el-input v-model="applicationForm.contactPersonPhone" placeholder="请输入手机号" maxlength="11" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="对接负责人办公电话" prop="contactPersonOfficePhone">
                <el-input v-model="applicationForm.contactPersonOfficePhone" placeholder="选填" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="对接负责人邮箱" prop="contactPersonEmail">
                <el-input v-model="applicationForm.contactPersonEmail" placeholder="请输入邮箱（文件往来用）" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="公司固定电话" prop="companyFixedPhone">
            <el-input v-model="applicationForm.companyFixedPhone" placeholder="请输入公司总机电话" />
          </el-form-item>

          <!-- 合作信息 -->
          <el-divider content-position="left">合作信息</el-divider>
          <el-form-item label="合作业务范围" prop="businessScope">
            <el-input v-model="applicationForm.businessScope" type="textarea" :rows="2" placeholder="请输入可代理险种/业务类型" />
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="合作区域" prop="cooperationArea">
                <el-select v-model="applicationForm.cooperationArea" placeholder="请选择合作区域">
                  <el-option label="本市" value="本市" />
                  <el-option label="本省" value="本省" />
                  <el-option label="全国" value="全国" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合作模式" prop="cooperationMode">
                <el-input v-model="applicationForm.cooperationMode" placeholder="如：渠道推广/客户引流/系统对接等" />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 承诺与文件 -->
          <el-divider content-position="left">承诺与文件</el-divider>
          <el-form-item label="资料真实性承诺" prop="authenticityCommitment">
            <el-radio-group v-model="applicationForm.authenticityCommitment">
              <el-radio label="1">我承诺所提供资料真实、合规</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="申请单位盖章" prop="sealFile">
            <el-upload ref="sealFileUpload" :auto-upload="false" :file-list="sealFileList" accept=".jpg,.png,.pdf" :on-change="handleFileChange">
              <el-button type="primary" icon="el-icon-upload">选择文件</el-button>
              <template #tip>
                <div class="el-upload__tip">请上传盖章扫描件（jpg/png/pdf，大小不超过10MB）</div>
              </template>
            </el-upload>
          </el-form-item>

          <el-form-item label="申请日期" prop="applyDate">
            <el-date-picker v-model="applicationForm.applyDate" type="date" placeholder="请选择申请日期" />
          </el-form-item>

          <!-- 提交按钮 -->
          <el-form-item class="submit-btn">
            <el-button type="primary" @click="submitApplication" :loading="submitting">提交申请</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "../../../utils/request";
import dayjs from 'dayjs'

const router = useRouter();
const applicationFormRef = ref(null);
const submitting = ref(false);
const hasApplied = ref(false);

// 表单数据
const applicationForm = reactive({
  agencyFullName: "",
  socialCreditCode: "",
  registeredAddress: "",
  agencyType: "",
  businessLicenseNo: "",
  licenseValidRange: [],
  legalPersonName: "",
  legalPersonIdCard: "",
  legalPersonPhone: "",
  contactPersonName: "",
  contactPersonPosition: "",
  contactPersonPhone: "",
  contactPersonOfficePhone: "",
  contactPersonEmail: "",
  companyFixedPhone: "",
  businessScope: "",
  cooperationArea: "",
  cooperationMode: "",
  authenticityCommitment: "",
  sealFile: null,
  applyDate: new Date(),
});

// 有效期范围（临时存储）
//const licenseValidRange = ref([]);
// 盖章文件列表
const sealFileList = ref([]);

// 表单校验规则
const formRules = reactive({
  agencyFullName: [{ required: true, message: "请输入机构全称", trigger: "blur" }],
  socialCreditCode: [
    { required: true, message: "请输入统一社会信用代码", trigger: "blur" },
    { pattern: /^[0-9A-Z]{18}$/, message: "请输入18位有效信用代码", trigger: "blur" },
  ],
  registeredAddress: [{ required: true, message: "请输入注册地址", trigger: "blur" }],
  agencyType: [{ required: true, message: "请选择机构类型", trigger: "change" }],
  businessLicenseNo: [{ required: true, message: "请输入经营许可证/备案号", trigger: "blur" }],
  licenseValidRange: [{ required: true, message: "请选择许可证有效期", trigger: "change" }],
  legalPersonName: [{ required: true, message: "请输入法定代表人姓名", trigger: "blur" }],
  legalPersonIdCard: [
    { required: true, message: "请输入法定代表人身份证号", trigger: "blur" },
    { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: "请输入有效身份证号", trigger: "blur" },
  ],
  legalPersonPhone: [
    { required: true, message: "请输入法定代表人手机号", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入有效手机号", trigger: "blur" },
  ],
  contactPersonName: [{ required: true, message: "请输入对接负责人姓名", trigger: "blur" }],
  contactPersonPosition: [{ required: true, message: "请输入对接负责人职务", trigger: "blur" }],
  contactPersonPhone: [
    { required: true, message: "请输入对接负责人手机号", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入有效手机号", trigger: "blur" },
  ],
  contactPersonEmail: [
    { required: true, message: "请输入对接负责人邮箱", trigger: "blur" },
    { type: "email", message: "请输入有效邮箱", trigger: "blur" },
  ],
  companyFixedPhone: [{ required: true, message: "请输入公司固定电话", trigger: "blur" }],
  businessScope: [{ required: true, message: "请输入合作业务范围", trigger: "blur" }],
  cooperationArea: [{ required: true, message: "请选择合作区域", trigger: "change" }],
  cooperationMode: [{ required: true, message: "请输入合作模式", trigger: "blur" }],
  authenticityCommitment: [{ required: true, message: "请确认资料真实性承诺", trigger: "change" }],
  sealFile: [{ required: true, message: "请上传申请单位盖章文件", trigger: "change" }],
  applyDate: [{ required: true, message: "请选择申请日期", trigger: "change" }],
});

// 返回首页
const goBack = () => {
  router.push("index");
};


// 处理文件选择
const handleFileChange = (file) => {
  sealFileList.value = [file]; // 只允许上传一个文件
  applicationForm.sealFile = file.raw; // 保存原始文件对象
};

// 检查是否已提交申请
const checkApplied = async () => {
  try {
    const res = await request.get("/agencyAuditApplication/check-applied");
    if (res.data.code === 200) {
      hasApplied.value = res.data.data;
    }
  } catch (error) {
    ElMessage.error("检查申请状态失败：" + error.message);
  }
};

// 提交申请
const submitApplication = async () => {
  try {
    // 1. 表单校验
    const valid = await applicationFormRef.value.validate();
    if (!valid) return;

    // 2. 确认提交
    await ElMessageBox.confirm("确认提交申请？提交后不可修改", "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    });

    submitting.value = true;

    // 3. 复制表单数据（避免直接修改原响应式对象）
    const submitData = { ...applicationForm };

    // 4. 格式化所有日期字段
    // 格式化 applyDate
    if (submitData.applyDate) {
      submitData.applyDate = dayjs(submitData.applyDate).format('YYYY-MM-DD');
    }

    // 处理许可证有效期范围：拆分为开始和结束日期，并格式化
    if (submitData.licenseValidRange && submitData.licenseValidRange.length === 2) {
      submitData.licenseValidStart = dayjs(submitData.licenseValidRange[0]).format('YYYY-MM-DD');
      submitData.licenseValidEnd = dayjs(submitData.licenseValidRange[1]).format('YYYY-MM-DD');
    }
    // 删除不再需要的 licenseValidRange 字段
    delete submitData.licenseValidRange;
    // 5. 构建 FormData（关键修改：使用 submitData）
    const formData = new FormData();
    for (const key in submitData) {
      if (key !== "sealFile") {
        formData.append(key, submitData[key]);
      }
    }
    formData.append("sealFile", submitData.sealFile); // 或 applicationForm.sealFile

    // 4. 提交请求
    const res = await request.post("/agencyAuditApplication/submit", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // 5. 处理结果
    if (res.data.code === 200) {
      ElMessage.success(res.data.msg);
      checkApplied(); // 刷新申请状态
    } else {
      ElMessage.error(res.data.msg);
    }
  } catch (error) {
    if (error.message !== "cancel") {
      // 排除取消确认的情况
      ElMessage.error("提交失败：" + (error.response?.data?.msg || error.message));
    }
  } finally {
    submitting.value = false;
  }
};

// 页面加载时检查申请状态
onMounted(() => {
  checkApplied();
});
</script>

<style scoped>
/* 整体样式 - 极简蓝白风格 */
.audit-application-page {
  width: 100vw;
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
  font-size: 20px;
  color: #1989fa; /* Element Plus主色 */
  font-weight: 600;
  margin: 0;
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
}

.form-card {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.el-form {
  margin-top: 20px;
}

.el-divider {
  margin: 25px 0 15px 0;
}

.el-divider__text {
  color: #1989fa;
  font-weight: 500;
}

.submit-btn {
  text-align: center;
  margin-top: 30px;
}

.mb-4 {
  margin-bottom: 16px;
}

/* 适配移动端 */
@media (max-width: 768px) {
  .audit-application-page {
    padding: 10px;
  }

  .el-form-item {
    margin-bottom: 15px;
  }

  .el-form-item__label {
    width: 120px !important;
    font-size: 14px;
  }
}
</style>
