<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">院小二后台管理系统</h2>
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="80px">
        <el-form-item label="账号" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入管理员账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" style="width:100%">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      // 登录表单
      loginForm: {
        username: '',
        password: ''
      },
      // 表单校验规则
      loginRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 登录处理
    handleLogin() {
      // 表单校验
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          try {
            // 调用后端登录接口
            const res = await this.$axios.post('/api/v1/admin/login', this.loginForm)
            if (res.data.code === 200) {
              this.$message.success('登录成功！')
              // 跳转到后台首页
              this.$router.push('/admin/home')
            } else {
              this.$message.error(res.data.msg)
            }
          } catch (error) {
            this.$message.error('登录失败，请检查网络或后端服务！')
            console.error('登录异常：', error)
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-card {
  width: 400px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.login-title {
  text-align: center;
  margin-bottom: 20px;
  color: #1989fa;
}
</style>