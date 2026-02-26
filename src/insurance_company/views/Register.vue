<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="register-title">院小二 - 保险公司注册</h2>
      <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="registerForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="register-btn" @click="handleRegister">注册</el-button>
          <el-button type="text" @click="toLogin">已有账号？立即登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import request from '@/utils/request'

const router = useRouter()
const registerFormRef = ref(null)
// 注册表单
const registerForm = ref({
  username: '',
  password: '',
  phone: ''
})
// 表单校验规则
const registerRules = ref({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
})

// 注册方法
const handleRegister = () => {
  registerFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await request.post('/insurance_company/register', registerForm.value)
        if (res.code === 200) {
          ElMessage.success(res.msg)
          // 注册成功跳转到登录页
          router.push('login')
        } else {
          ElMessage.error(res.msg)
        }
      } catch (error) {
        ElMessage.error('注册失败，请重试')
      }
    }
  })
}

// 跳转到登录页面
const toLogin = () => {
  router.push('login')
}
</script>

<style scoped>
/* 极简蓝白风格 */
.register-container {
  width: 100vw;
  height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-card {
  width: 400px;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.register-title {
  text-align: center;
  color: #1989fa;
  margin-bottom: 20px;
}

.register-btn {
  width: 100%;
  background-color: #1989fa;
  border: none;
}
</style>