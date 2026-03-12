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
          
          <!-- 合作业务范围 - 改为多选框 -->
          <el-form-item label="合作业务范围" prop="businessScope">
            <el-checkbox-group v-model="applicationForm.businessScope">
              <el-checkbox label="1" border>院陪诊（医院陪诊服务）</el-checkbox>
              <el-checkbox label="2" border>院陪护（医院陪护服务）</el-checkbox>
              <el-checkbox label="3" border>院办办（院方办理相关服务）</el-checkbox>
              <el-checkbox label="4" border>院保保（医院保险相关服务）</el-checkbox>
              <el-checkbox label="5" border>院垫垫（医院垫付相关服务）</el-checkbox>
              <el-checkbox label="6" border>院探探（医院探望服务）</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <!-- 合作区域 - 省市区医院多级联动 -->
          <el-divider content-position="left">合作区域</el-divider>
          <div class="cooperation-area-section">
            <div class="area-add-section">
              <h4>添加合作区域</h4>
              <el-form :inline="true" class="area-form">
                <el-form-item label="省份">
                  <el-select 
                    v-model="selectedProvince" 
                    placeholder="请选择省份" 
                    @change="handleProvinceChange"
                    style="width: 200px"
                  >
                    <el-option
                      v-for="item in provinceList"
                      :key="item.province"
                      :label="item.province"
                      :value="item.province"
                    />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="城市">
                  <el-select 
                    v-model="selectedCity" 
                    placeholder="请选择城市" 
                    @change="handleCityChange"
                    :disabled="!selectedProvince"
                    style="width: 200px"
                  >
                    <el-option
                      v-for="item in cityList"
                      :key="item.city"
                      :label="item.city"
                      :value="item.city"
                    />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="医院">
                  <el-select 
                    v-model="selectedHospitalIds" 
                    placeholder="请选择医院（留空表示全市）" 
                    multiple
                    :disabled="!selectedCity"
                    style="width: 300px"
                  >
                    <el-option
                      v-for="item in hospitalList"
                      :key="item.id"
                      :label="item.hospitalName"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="addCooperationArea" :disabled="!selectedCity">
                    添加此区域
                  </el-button>
                </el-form-item>
              </el-form>
            </div>

            <!-- 已选区域列表 -->
            <div class="area-list-section" v-if="cooperationAreaList.length > 0">
              <h4>已选合作区域</h4>
              <el-table :data="cooperationAreaList" border style="width: 100%">
                <el-table-column prop="province" label="省份" width="120" />
                <el-table-column prop="city" label="城市" width="120" />
                <el-table-column label="医院范围">
                  <template #default="{ row }">
                    <span v-if="row.hospitalIds && row.hospitalIds.length > 0">
                      指定 {{ row.hospitalIds.length }} 家医院
                    </span>
                    <span v-else style="color: #909399;">全市</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template #default="{ index }">
                    <el-button type="danger" size="small" @click="removeCooperationArea(index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <el-form-item label="合作模式" prop="cooperationMode">
            <el-input v-model="applicationForm.cooperationMode" placeholder="如：渠道推广/客户引流/系统对接等" />
          </el-form-item>

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
          <el-form-item class="test-btn">
            <el-button type="info" @click="fillTestData" style="margin-bottom: 16px">填充测试数据</el-button>
            
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
  businessScope: [], // 改为数组存储 [1,2,3]
  cooperationArea: "", // 存储 JSON 字符串
  cooperationMode: "",
  authenticityCommitment: "",
  sealFile: null,
  applyDate: new Date(),
});

// 合作区域相关数据
const provinceList = ref([]);
const cityList = ref([]);
const hospitalList = ref([]);
const selectedProvince = ref("");
const selectedCity = ref("");
const selectedHospitalIds = ref([]);
const cooperationAreaList = ref([]);

// 盖章文件列表
const sealFileList = ref([]);

// 表单校验规则
const formRules = reactive({
  agencyFullName: [{ required: true, message: "请输入机构全称", trigger: "blur" }],
  socialCreditCode: [
    { required: true, message: "请输入统一社会信用代码", trigger: "blur" },
    { pattern: /^[0-9A-Z]{18}$/, message: "请输入 18 位有效信用代码", trigger: "blur" },
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
  businessScope: [
    { required: true, message: "请至少选择一个业务模块", trigger: "change" },
    { validator: (rule, value, callback) => {
        if (!Array.isArray(value) || value.length === 0) {
          callback(new Error('请至少选择一个业务模块'));
        } else {
          callback();
        }
      }, 
      trigger: "change" 
    }
  ],
  cooperationArea: [
    { required: true, message: "请至少添加一个合作区域", trigger: "change" },
    { validator: (rule, value, callback) => {
        const list = JSON.parse(value || '[]');
        if (!Array.isArray(list) || list.length === 0) {
          callback(new Error('请至少添加一个合作区域'));
        } else {
          callback();
        }
      }, 
      trigger: "change" 
    }
  ],
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
    if (res.code === 200) {
      hasApplied.value = res.data;
      if (hasApplied.value) {
        goBack();
      }
    }
  } catch (error) {
    ElMessage.error("检查申请状态失败：" + error.message);
  }
};

// 加载省份列表
const loadProvinces = async () => {
  try {
    const res = await request.get("/agencyAuditApplication/provinces");
    if (res.code === 200) {
      provinceList.value = res.data;
    }
  } catch (error) {
    ElMessage.error("加载省份列表失败：" + error.message);
  }
};

// 处理省份变化
const handleProvinceChange = async () => {
  cityList.value = [];
  hospitalList.value = [];
  selectedCity.value = "";
  selectedHospitalIds.value = [];
  
  if (!selectedProvince.value) return;
  
  try {
    const res = await request.get("/agencyAuditApplication/cities", {
      params: { province: selectedProvince.value }
    });
    if (res.code === 200) {
      cityList.value = res.data;
    }
  } catch (error) {
    ElMessage.error("加载城市列表失败：" + error.message);
  }
};

// 处理城市变化
const handleCityChange = async () => {
  hospitalList.value = [];
  selectedHospitalIds.value = [];
  
  if (!selectedCity.value) return;
  
  try {
    const res = await request.get("/agencyAuditApplication/hospitals", {
      params: { city: selectedCity.value }
    });
    if (res.code === 200) {
      hospitalList.value = res.data;
    }
  } catch (error) {
    ElMessage.error("加载医院列表失败：" + error.message);
  }
};

// 添加合作区域
const addCooperationArea = () => {
  if (!selectedProvince.value || !selectedCity.value) {
    ElMessage.warning("请选择省份和城市");
    return;
  }
  
  // 检查是否已存在相同的省市区组合
  const exists = cooperationAreaList.value.some(item => 
    item.province === selectedProvince.value && 
    item.city === selectedCity.value
  );
  
  if (exists) {
    ElMessage.warning("该区域已添加，请勿重复添加");
    return;
  }
  
  cooperationAreaList.value.push({
    province: selectedProvince.value,
    city: selectedCity.value,
    hospitalIds: [...selectedHospitalIds.value]
  });
  
  // 清空选择
  selectedCity.value = "";
  selectedHospitalIds.value = [];
  hospitalList.value = [];
  
  ElMessage.success("添加成功");
};

// 删除合作区域
const removeCooperationArea = (index) => {
  cooperationAreaList.value.splice(index, 1);
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
    
    // 5. 处理特殊字段格式
    // businessScope: 数组转为 JSON 字符串
    if (Array.isArray(submitData.businessScope)) {
      submitData.businessScope = JSON.stringify(submitData.businessScope);
    }
    
    // cooperationArea: 使用已选择的区域列表，转为 JSON 字符串
    if (cooperationAreaList.value.length > 0) {
      submitData.cooperationArea = JSON.stringify(cooperationAreaList.value);
    }
    
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
    if (res.code === 200) {
      ElMessage.success(res.msg);
      checkApplied();
      goBack();
    } else {
      ElMessage.error(res.msg);
    }
  } catch (error) {
    if (error.message !== "cancel") {
      // 排除取消确认的情况
      ElMessage.error("提交失败：" + (error.response?.msg || error.message));
    }
  } finally {
    submitting.value = false;
  }
};

// 页面加载时检查申请状态
onMounted(() => {
  checkApplied();
  loadProvinces(); // 加载省份列表
});

//测试部分
const fillTestData = () => {
  // 使用 Object.assign 批量更新 reactive 对象的属性
  Object.assign(applicationForm, {
    agencyFullName: '云测科技有限公司',
    socialCreditCode: '91310115MA1H2Y9P6X',
    registeredAddress: '上海市浦东新区松涛路 666 号',
    agencyType: '保险代理',                // 改为与选项匹配的值
    businessLicenseNo: '沪 B2-20230123',
    licenseValidRange: [
      new Date(),
      dayjs().add(1, 'year').toDate()
    ],
    legalPersonName: '张明',
    legalPersonIdCard: '110101199001011234',
    legalPersonPhone: '13800138000',
    contactPersonName: '李芳',
    contactPersonPosition: '市场总监',
    contactPersonPhone: '13912345678',
    contactPersonEmail: 'lifang@yhence.com',
    contactPersonOfficePhone: '021-12345678', // 如果有此字段
    companyFixedPhone: '021-12345678',
    businessScope: ['1', '2', '3'],         // 改为数组格式
    cooperationArea: '',                     // cooperationArea 通过 cooperationAreaList 填充
    cooperationMode: '代理分成',
    authenticityCommitment: '1',             // 改为字符串 "1"，与 radio 的 label 匹配
    sealFile: null,
    applyDate: new Date(),
  });

  // 设置测试用的合作区域
  cooperationAreaList.value = [
    { province: '广东省', city: '广州市', hospitalIds: [1, 2, 3] },
    { province: '广东省', city: '深圳市', hospitalIds: [] }
  ];

  // 清空文件列表（如果之前有文件）
  sealFileList.value = [];

  ElMessage.info('测试数据已填充，请手动选择盖章文件后提交');
};
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

/* 合作区域样式 */
.cooperation-area-section {
  padding: 15px;
  background-color: #f9fafc;
  border-radius: 4px;
  margin-top: 10px;
}

.area-add-section h4,
.area-list-section h4 {
  margin: 0 0 15px 0;
  color: #1989fa;
  font-size: 15px;
}

.area-form {
  margin-bottom: 20px;
}

.area-list-section {
  margin-top: 20px;
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
  
  .area-form {
    display: flex;
    flex-direction: column;
  }
  
  .area-form .el-form-item {
    width: 100%;
    margin-right: 0;
  }
  
  .area-form .el-select {
    width: 100% !important;
  }
}
</style>
