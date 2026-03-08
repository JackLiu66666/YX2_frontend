<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="register-title">院小二 - 护士注册</h2>
      <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" label-width="0px">
        <el-form-item prop="username">
          <el-input 
            v-model="registerForm.username" 
            placeholder="请输入用户名"
            size="large"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            v-model="registerForm.password" 
            type="password" 
            placeholder="请输入密码"
            size="large"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input 
            v-model="registerForm.confirmPassword" 
            type="password" 
            placeholder="请确认密码"
            size="large"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input 
            v-model="registerForm.phone" 
            placeholder="请输入手机号"
            size="large"
            prefix-icon="el-icon-phone"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            class="register-btn" 
            @click="handleRegister"
            size="large"
            :loading="loading"
          >
            {{ loading ? '注册中...' : '注册' }}
          </el-button>
          <el-button 
            type="text" 
            @click="toLogin" 
            class="login-link"
          >
            已有账号？立即登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import request from '../../utils/request'

const router = useRouter()
const registerFormRef = ref(null)
const loading = ref(false)

// 注册表单
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  phone: ''
})

// 表单校验规则
const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度为2-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

// 注册方法
const handleRegister = () => {
  registerFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const res = await request.post('/nurse/register', {
          username: registerForm.username,
          password: registerForm.password,
          phone: registerForm.phone
        })
        if (res.code === 200) {
          ElMessage.success(res.msg)
          // 注册成功跳转到登录页
          router.push('login')
        } else {
          ElMessage.error(res.msg)
        }
      } catch (error) {
        ElMessage.error('注册失败，请重试')
      } finally {
        loading.value = false
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
.register-container {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.register-card {
  width: 100%;
  max-width: 350px;
  padding: 30px 20px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.register-title {
  text-align: center;
  color: #667eea;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 600;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-input__inner) {
  height: 45px;
  border-radius: 8px;
  font-size: 16px;
}

.register-btn {
  width: 100%;
  height: 45px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  margin-top: 10px;
}

.login-link {
  width: 100%;
  text-align: center;
  margin-top: 15px;
  color: #667eea;
  font-size: 14px;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .register-container {
    padding: 15px;
  }
  
  .register-card {
    padding: 25px 15px;
  }
  
  .register-title {
    font-size: 22px;
    margin-bottom: 25px;
  }
  
  :deep(.el-input__inner) {
    height: 42px;
    font-size: 15px;
  }
  
  .register-btn {
    height: 42px;
    font-size: 15px;
  }
}
</style>