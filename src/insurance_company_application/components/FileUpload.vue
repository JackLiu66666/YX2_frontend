<template>
  <el-upload
    :before-upload="handleBeforeUpload"
    :auto-upload="false"
    accept=".jpg,.png,.pdf"
    drag
    class="ica-upload"
  >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">点击或拖拽文件至此处上传<br/>{{ title }}</div>
    <template #tip>
      <div class="el-upload__tip">只能上传jpg/png/pdf文件，且不超过10MB</div>
    </template>
  </el-upload>
</template>

<script setup>
import { ref, defineProps } from 'vue'

// 接收父组件传值
//const props = 
defineProps({
  title: {
    type: String,
    required: true
  }
})

// 存储文件
const file = ref(null)

// 上传前处理
const handleBeforeUpload = (fileObj) => {
  file.value = fileObj
  return false // 阻止自动上传
}

// 暴露文件给父组件
defineExpose({
  file
})
</script>

<style scoped>
.ica-upload {
  border: 1px dashed var(--ica-border);
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s;
}

.ica-upload:hover {
  border-color: var(--ica-primary);
}
</style>