<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">院小二 - 护士登录</h2>
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="0px">
        <el-form-item prop="loginKey">
          <el-input 
            v-model="loginForm.loginKey" 
            placeholder="手机号/ID/用户名"
            size="large"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码"
            size="large"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            class="login-btn" 
            @click="handleLogin"
            size="large"
            :loading="loading"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
          <el-button 
            type="text" 
            @click="toRegister" 
            class="register-link"
          >
            没有账号？立即注册
          </el-button>
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
const loading = ref(false)

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
      loading.value = true
      try {
        const res = await request.post('/nurse/login', {
          loginKey: loginForm.value.loginKey,
          password: loginForm.value.password
        })
        if (res.code === 200) {
          ElMessage.success(res.msg)
          // 存储用户信息
          localStorage.setItem('loginNurse', JSON.stringify(res.data))
          // 检查审核状态并跳转
          await checkAuditStatusAndRedirect()
        } else {
          ElMessage.error(res.msg)
        }
      } catch (error) {
        ElMessage.error('登录失败，请重试')
      } finally {
        loading.value = false
      }
    }
  })
}

// 检查审核状态并跳转
const checkAuditStatusAndRedirect = async () => {
  try {
    const res = await request.get('/nurse/check_audit_status')
    if (res.code === 200) {
      const auditStatus = res.data.auditStatus
      const routeMap = {
        0: 'NurseAuditApplication',
        1: 'NurseAuditStatus',
        2: 'NurseIndex',
        3: 'NurseAuditFailReason'
      }
      
      const targetRoute = routeMap[auditStatus]
      if (targetRoute) {
        router.push({ name: targetRoute })
      } else {
        ElMessage.warning('未知审核状态')
        router.push({ name: 'NurseIndex' })
      }
    } else {
      ElMessage.error(res.msg)
      router.push({ name: 'NurseIndex' })
    }
  } catch (error) {
    ElMessage.error('检查审核状态失败')
    router.push({ name: 'NurseIndex' })
  }
}

// 跳转到注册页面
const toRegister = () => {
  router.push('register')
}
</script>

<style scoped>
.login-container {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.login-card {
  width: 100%;
  max-width: 350px;
  padding: 30px 20px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.login-title {
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

.login-btn {
  width: 100%;
  height: 45px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  margin-top: 10px;
}

.register-link {
  width: 100%;
  text-align: center;
  margin-top: 15px;
  color: #667eea;
  font-size: 14px;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .login-container {
    padding: 15px;
  }
  
  .login-card {
    padding: 25px 15px;
  }
  
  .login-title {
    font-size: 22px;
    margin-bottom: 25px;
  }
  
  :deep(.el-input__inner) {
    height: 42px;
    font-size: 15px;
  }
  
  .login-btn {
    height: 42px;
    font-size: 15px;
  }
}
</style>