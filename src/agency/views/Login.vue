<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">院小二 - 代理商登录</h2>
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="80px">
        <el-form-item label="登录账号" prop="loginKey">
          <el-input v-model="loginForm.loginKey" placeholder="手机号/ID/用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="handleLogin">登录</el-button>
          <el-button type="text" @click="toRegister">没有账号？立即注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import request from '../../utils/request'

const router = useRouter()
const loginFormRef = ref(null)
// 登录表单
const loginForm = ref({
  loginKey: '',
  password: ''
})
// 表单校验规则
const loginRules = ref({
  loginKey: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

// 登录方法
const handleLogin = () => {
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await request.post('/agency/login', {
          loginKey: loginForm.value.loginKey,
          password: loginForm.value.password
        })
        if (res.code === 200) {
          ElMessage.success(res.msg)
          // 可选：将用户信息存到localStorage（用于前端显示）
          localStorage.setItem('loginAgency', JSON.stringify(res.data))
          // 跳转到代理商首页
          router.push('index')
        } else {
          ElMessage.error(res.msg)
        }
      } catch (error) {
        ElMessage.error('登录失败，请重试')
      }
    }
  })
}

// 跳转到注册页面
const toRegister = () => {
  router.push('register')
}
</script>

<style scoped>
/* 极简蓝白风格 */
.login-container {
  width: 100vw;
  height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 400px;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  color: #1989fa;
  margin-bottom: 20px;
}

.login-btn {
  width: 100%;
  background-color: #1989fa;
  border: none;
}
</style>