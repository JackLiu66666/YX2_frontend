<template>
  <div class="application-review-container">
    <!-- 顶部返回按钮 -->
    <div class="header">
      <el-button 
        type="primary" 
        icon="el-icon-arrow-left" 
        @click="goBack"
        class="back-btn"
      >
        返回
      </el-button>
    </div>

    <!-- 加载提示 -->
    <div v-if="loading" class="loading">加载中...</div>

    <!-- 错误提示 -->
    <div v-else-if="errorMsg" class="error">{{ errorMsg }}</div>

    <!-- 表单内容 -->
    <div v-else class="application-form">
      <h2 class="form-title">代理商申请表详情</h2>
      
      <!-- 基础信息区域 -->
      <div class="form-section">
        <h3 class="section-title">基础信息</h3>
        <div class="form-grid">
          <div class="form-item">
            <label class="label">申请 ID：</label>
            <span class="value">{{ application.applyId || '-' }}</span>
          </div>
          <div class="form-item">
            <label class="label">机构全称：</label>
            <span class="value">{{ application.agencyFullName || '-' }}</span>
          </div>
          <div class="form-item">
            <label class="label">统一社会信用代码：</label>
            <span class="value">{{ application.socialCreditCode || '-' }}</span>
          </div>
          <div class="form-item">
            <label class="label">注册地址：</label>
            <span class="value">{{ application.registeredAddress || '-' }}</span>
          </div>
          <div class="form-item">
            <label class="label">机构类型：</label>
            <span class="value">{{ application.agencyType || '-' }}</span>
          </div>
          <div class="form-item">
            <label class="label">经营许可证/备案号：</label>
            <span class="value">{{ application.businessLicenseNo || '-' }}</span>
          </div>
          <div class="form-item">
            <label class="label">许可证有效期：</label>
            <span class="value">
              {{ application.licenseValidStart || '-' }} 至 {{ application.licenseValidEnd || '-' }}
            </span>
          </div>
          <div class="form-item">
            <label class="label">申请日期：</label>
            <span class="value">{{ application.applyDate || '-' }}</span>
          </div>
        </div>
      </div>

      <!-- 联系人信息区域 -->
      <div class="form-section">
        <h3 class="section-title">联系人信息</h3>
        <div class="form-grid">
          <div class="form-item">
            <label class="label">法定代表人姓名：</label>
            <span class="value">{{ application.legalPersonName || '-' }}</span>
          </div>
          <div class="form-item">
            <label class="label">法定代表人身份证号：</label>
            <span class="value">{{ application.legalPersonIdCard || '-' }}</span>
          </div>
          <div class="form-item">
            <label class="label">法定代表人手机号：</label>
            <span class="value">{{ application.legalPersonPhone || '-' }}</span>
          </div>
          <div class="form-item">
            <label class="label">对接负责人姓名：</label>
            <span class="value">{{ application.contactPersonName || '-' }}</span>
          </div>
          <div class="form-item">
            <label class="label">对接负责人职务：</label>
            <span class="value">{{ application.contactPersonPosition || '-' }}</span>
          </div>
          <div class="form-item">
            <label class="label">对接负责人手机号：</label>
            <span class="value">{{ application.contactPersonPhone || '-' }}</span>
          </div>
          <div class="form-item">
            <label class="label">对接负责人办公电话：</label>
            <span class="value">{{ application.contactPersonOfficePhone || '-' }}</span>
          </div>
          <div class="form-item">
            <label class="label">对接负责人邮箱：</label>
            <span class="value">{{ application.contactPersonEmail || '-' }}</span>
          </div>
          <div class="form-item">
            <label class="label">公司固定电话：</label>
            <span class="value">{{ application.companyFixedPhone || '-' }}</span>
          </div>
        </div>
      </div>

      <!-- 合作信息区域 -->
      <div class="form-section">
        <h3 class="section-title">合作信息</h3>
        <div class="form-grid">
          <div class="form-item full-width">
            <label class="label">合作业务范围：</label>
            <div class="business-scope-tags">
              <el-tag 
                v-for="(scope, index) in parsedBusinessScope" 
                :key="index"
                type="info"
                effect="plain"
                class="scope-tag"
              >
                {{ scope }}
              </el-tag>
            </div>
          </div>
          <div class="form-item full-width">
            <label class="label">合作区域：</label>
            <div class="cooperation-area-content">
              <el-button 
                type="primary" 
                link 
                @click="toggleCooperationArea"
                class="toggle-btn"
              >
                {{ isCooperationAreaExpanded ? '收起' : '展开' }}
                <el-icon :class="{ 'rotated': isCooperationAreaExpanded }">
                  <arrow-down />
                </el-icon>
              </el-button>
              
              <transition name="expand">
                <div v-show="isCooperationAreaExpanded" class="cooperation-area-detail">
                  <div v-for="(area, index) in parsedCooperationArea" :key="index" class="area-item">
                    <div class="area-province">
                      <strong>{{ area.province }} - {{ area.city }}</strong>
                    </div>
                    <div v-if="area.hospitals && area.hospitals.length > 0" class="hospital-list">
                      <div v-for="hospital in area.hospitals" :key="hospital.id" class="hospital-item">
                        {{ hospital.province }}{{ hospital.city }}{{ hospital.districtCounty }} - {{ hospital.hospitalName }}（{{ hospital.hospitalLevel }}）
                      </div>
                    </div>
                    <div v-else class="no-hospitals">全部医院</div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
          <div class="form-item">
            <label class="label">合作模式：</label>
            <span class="value">{{ application.cooperationMode || '-' }}</span>
          </div>
          <div class="form-item">
            <label class="label">资料真实性承诺：</label>
            <span class="value">{{ application.authenticityCommitment === 1 ? '同意' : '未同意' }}</span>
          </div>
        </div>
      </div>

      <!-- 盖章文件预览区域 -->
      <div class="form-section" v-if="application.sealFilePath">
        <h3 class="section-title">盖章文件预览</h3>
        <div class="file-preview">
          <!-- PDF 预览（使用 embed 标签） -->
          <embed 
            v-if="isPdfFile" 
            :src="application.sealFilePath" 
            type="application/pdf"
            class="preview-file pdf"
          >
          <!-- 图片预览（使用 img 标签） -->
          <img 
            v-else 
            :src="application.sealFilePath" 
            alt="盖章文件"
            class="preview-file img"
            @error="handleImageError"
          >
        </div>
      </div>

      <!-- 审核操作按钮 -->
      <div class="action-buttons">
        <el-button 
          type="success" 
          size="large"
          @click="handlePassApplication"
          :loading="submitting"
        >
          通过申请
        </el-button>
        <el-button 
          type="danger" 
          size="large"
          @click="handleRejectApplication"
          :loading="submitting"
        >
          不通过申请
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute} from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';
import request from '@/utils/request';

// 响应式数据
const loading = ref(true); // 加载状态
const errorMsg = ref(''); // 错误信息
const application = ref({}); // 申请表单数据
const route = useRoute(); // 获取路由参数
const submitting = ref(false); // 提交中状态
const isCooperationAreaExpanded = ref(false); // 合作区域是否展开

// 解析合作业务范围
const parsedBusinessScope = computed(() => {
  if (!application.value.businessScope) return [];
  try {
    // 如果是字符串，尝试解析 JSON
    if (typeof application.value.businessScope === 'string') {
      return JSON.parse(application.value.businessScope);
    }
    return application.value.businessScope;
  } catch (e) {
    console.error('解析合作业务范围失败：', e);
    return [];
  }
});

// 解析合作区域数据
const parsedCooperationArea = computed(() => {
  if (!application.value.cooperationArea) return [];
  try {
    // 如果是字符串，尝试解析 JSON
    if (typeof application.value.cooperationArea === 'string') {
      return JSON.parse(application.value.cooperationArea);
    }
    return application.value.cooperationArea;
  } catch (e) {
    console.error('解析合作区域失败：', e);
    return [];
  }
});

// 判断是否为 PDF 文件
const isPdfFile = computed(() => {
  if (!application.value.sealFilePath) return false;
  return application.value.sealFilePath.toLowerCase().endsWith('.pdf');
});

// 图片加载失败处理
const handleImageError = () => {
  errorMsg.value = '盖章图片加载失败，请检查文件路径';
};

// 切换合作区域展开/收起状态
const toggleCooperationArea = () => {
  isCooperationAreaExpanded.value = !isCooperationAreaExpanded.value;
};

// 通过申请
const handlePassApplication = async () => {
  try {
    await ElMessageBox.confirm(
      '确认要通过该申请吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }
    );
    
    submitting.value = true;
    // TODO: 调用通过申请的接口
    // const response = await request.post(`/admin/agencyApplicationReview/pass/${application.value.id}`);
    // if (response.data.code === 200) {
    //   ElMessage.success('审核通过成功');
    //   router.back();
    // } else {
    //   ElMessage.error(response.data.msg || '审核通过失败');
    // }
    
    ElMessage.success('审核通过成功（接口待接入）');
    // router.back();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败：' + (error.message || '网络异常'));
    }
  } finally {
    submitting.value = false;
  }
};

// 不通过申请
const handleRejectApplication = async () => {
  try {
    await ElMessageBox.prompt(
      '请输入不通过的原因：',
      '审核不通过',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '请填写不通过原因',
        type: 'warning'
      }
    ).then(async ({ value }) => {
      submitting.value = true;
      // TODO: 调用不通过申请的接口
      // const response = await request.post(`/admin/agencyApplicationReview/reject/${application.value.id}`, {
      //   reason: value
      // });
      // if (response.data.code === 200) {
      //   ElMessage.success('审核不通过成功');
      //   router.back();
      // } else {
      //   ElMessage.error(response.data.msg || '审核不通过失败');
      // }
      
      ElMessage.success(`审核不通过成功（原因：${value}，接口待接入）`);
      // router.back();
    });
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败：' + (error.message || '网络异常'));
    }
  } finally {
    submitting.value = false;
  }
};

// 根据 ID 查询申请表单数据
const getApplicationById = async () => {
  try {
    const id = route.params.id; // 从路由获取ID
    if (!id) {
      errorMsg.value = '未传入申请表ID';
      loading.value = false;
      return;
    }

    // 发送请求（携带 Session）
    const response = await request.get(`/admin/agencyApplicationReview/list/${id}`);
    if (response.code === 200) {
      application.value = response.data;
    } else {
      errorMsg.value = response.msg || '获取详情失败';
    }
  } catch (err) {
    errorMsg.value = '请求失败：' + (err.message || '网络异常');
  } finally {
    loading.value = false;
  }
};

// 页面挂载时加载数据
onMounted(() => {
  getApplicationById();
});

// 返回上一页
const goBack = () => {
  window.history.back();
};
</script>

<style scoped>
/* 极简蓝白风格 */
.application-review-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.header {
  margin-bottom: 20px;
}

.back-btn {
  font-size: 14px;
  padding: 8px 15px;
}

.loading, .error {
  text-align: center;
  padding: 50px;
  font-size: 16px;
}

.error {
  color: #e53935;
}

.form-title {
  color: #1976d2; /* 主蓝色 */
  font-size: 20px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e3f2fd;
}

.form-section {
  margin-bottom: 30px;
}

.section-title {
  color: #1976d2;
  font-size: 16px;
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 3px solid #1976d2;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.form-item {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

.form-item.full-width {
  grid-column: 1 / -1;
}

.label {
  width: 120px;
  color: #666;
  font-weight: 500;
  flex-shrink: 0;
}

.value {
  color: #333;
  flex: 1;
  word-break: break-all;
}

/* 合作业务范围标签样式 */
.business-scope-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 5px 0;
}

.scope-tag {
  font-size: 13px;
  padding: 4px 12px;
  border-radius: 4px;
  background-color: #f0f9ff;
  border-color: #bae7ff;
  color: #1890ff;
}

/* 合作区域样式 */
.cooperation-area-content {
  flex: 1;
}

.toggle-btn {
  font-size: 14px;
  padding: 0;
  vertical-align: middle;
}

.toggle-btn .el-icon {
  transition: transform 0.3s;
}

.toggle-btn .el-icon.rotated {
  transform: rotate(180deg);
}

.cooperation-area-detail {
  margin-top: 10px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 4px;
}

.area-item {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #e0e0e0;
}

.area-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.area-province {
  font-size: 15px;
  color: #1976d2;
  margin-bottom: 10px;
}

.hospital-list {
  padding-left: 20px;
}

.hospital-item {
  padding: 5px 0;
  color: #666;
  font-size: 14px;
}

.no-hospitals {
  color: #1976d2;
  font-style: italic;
  padding-left: 20px;
  font-weight: 500;
}

/* 展开动画 */
.expand-enter-active,
.expand-leave-active {
  overflow: hidden;
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 1000px;
}

/* 文件预览样式 */
.file-preview {
  margin-top: 10px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 4px;
}

.preview-file {
  width: 100%;
  min-height: 600px;
  border: none;
}

.img.preview-file {
  min-height: auto;
  max-height: 800px;
  object-fit: contain;
}

/* 审核操作按钮 */
.action-buttons {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 2px solid #e3f2fd;
  display: flex;
  justify-content: center;
  gap: 30px;
}

.action-buttons .el-button {
  min-width: 150px;
  font-size: 16px;
}
</style>