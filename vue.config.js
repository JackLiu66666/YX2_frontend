const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  //lintOnSave: false, // 关闭 ESLint 警告或错误
  transpileDependencies: true,
  //关闭生产环境的 Source Map
  productionSourceMap: false, 
  
  devServer: {
    proxy: {
      '/api': {                       // 拦截以 /api 开头的请求
        target: 'http://localhost:8081', // 目标后端地址
        changeOrigin: true,            // 支持跨域
        logLevel: 'debug'
      }
    },
     client: {overlay: false},
  }
})