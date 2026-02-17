<template>
  <!-- 使用模块专属样式类名，避免冲突 -->
  <div class="ica-container" style="max-width: 600px; margin-top: 50px;">
    <div class="ica-card">
      <h2 style="text-align: center; color: var(--ica-primary); margin-bottom: 24px;">
        保险公司账号注册
      </h2>
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="formRef" 
        label-width="120px"
        class="ica-el-form"
      >
        <el-form-item label="统一社会信用代码" prop="username">
          <el-input 
            v-model="form.username" 
            placeholder="请输入18位统一社会信用代码"
            class="ica-el-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="保险公司全称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入与营业执照一致的全称"></el-input>
        </el-form-item>
        <el-form-item label="设置密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请设置登录密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item style="text-align: center;">
          <el-button 
            type="primary" 
            @click="submitForm" 
            size="large"
            class="ica-el-button--primary"
          >
            完成注册
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
// 引入模块内的接口（而非全局）
import { registerUser } from '../../api/user'

const router = useRouter()
const formRef = ref(null)

// 表单数据
const form = ref({
  username: '',
  companyName: '',
  password: '',
  confirmPassword: ''
})

// 表单校验规则
const rules = ref({
  username: [
    { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
    { len: 18, message: '统一社会信用代码必须为18位', trigger: 'blur' }
  ],
  companyName: [
    { required: true, message: '请输入保险公司全称', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请设置密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 提交表单
const submitForm = async () => {
  try {
    await formRef.value.validate()
    const res = await registerUser({
      username: form.value.username,
      password: form.value.password,
      companyName: form.value.companyName
    })
    // 使用res的值，消除警告
    console.log('注册接口返回:', res)
    ElMessage.success(`注册成功！${res.msg || '请前往申请页面提交资料'}`)
    router.push('/ica/apply/form')
  } catch (error) {
    console.error('注册失败:', error)
  }
}
</script>

<!-- 引入模块独立样式 -->
<style scoped>
@import '../../styles/index.css';
</style>