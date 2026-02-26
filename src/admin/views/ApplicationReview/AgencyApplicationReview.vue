<template>
  <div class="application-review-container">
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
            <label class="label">申请ID：</label>
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
          <div class="form-item">
            <label class="label">合作业务范围：</label>
            <span class="value">{{ application.businessScope || '-' }}</span>
          </div>
          <div class="form-item">
            <label class="label">合作区域：</label>
            <span class="value">{{ application.cooperationArea || '-' }}</span>
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
          <!-- PDF预览（使用embed标签） -->
          <embed 
            v-if="isPdfFile" 
            :src="application.sealFilePath" 
            type="application/pdf"
            class="preview-file pdf"
          >
          <!-- 图片预览（使用img标签） -->
          <img 
            v-else 
            :src="application.sealFilePath" 
            alt="盖章文件"
            class="preview-file img"
            @error="handleImageError"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import request from '@/utils/request';

// 响应式数据
const loading = ref(true); // 加载状态
const errorMsg = ref(''); // 错误信息
const application = ref({}); // 申请表单数据
const route = useRoute(); // 获取路由参数

// 判断是否为PDF文件
const isPdfFile = computed(() => {
  if (!application.value.sealFilePath) return false;
  return application.value.sealFilePath.toLowerCase().endsWith('.pdf');
});

// 图片加载失败处理
const handleImageError = () => {
  errorMsg.value = '盖章图片加载失败，请检查文件路径';
};

// 根据ID查询申请表单数据
const getApplicationById = async () => {
  try {
    const id = route.params.id; // 从路由获取ID（也可通过props/参数传递）
    if (!id) {
      errorMsg.value = '未传入申请表ID';
      loading.value = false;
      return;
    }

    // 发送请求（携带Session）
    const response = await request.get(`/admin/agencyApplicationReview/${id}`);
    if (response.data.code === 200) {
      application.value = response.data.data;
    } else {
      errorMsg.value = response.data.msg;
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
</style>