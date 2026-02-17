import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'

const app = createApp(App)

// 配置 axios 基础路径
//axios.defaults.baseURL = 'http://localhost:8081'

// 将 axios 挂载到全局属性（方便在组件内通过 this.$http 访问）
app.config.globalProperties.$axios = axios

// 使用插件
app.use(router)
app.use(ElementPlus)

// 挂载应用
app.mount('#app')