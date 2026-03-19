# frontend

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### 构建镜像
```
docker build -t yuanxiaoer-frontend .
```

### 把镜像打包成 tar 文件
```
docker save -o yuanxiaoer-frontend.tar yuanxiaoer-frontend
```

### 宝塔终端加载镜像
```
docker load -i yuanxiaoer-frontend.tar
```

### 启动容器
```
docker run -d -p 8080:80 --name vue-container yuanxiaoer-frontend
```

### 更新代码
```
# 停止并删除旧容器
docker stop vue-container
docker rm vue-container
# 删除旧镜像 (可选，为了节省空间)
docker rmi yuanxiaoer-frontend
# 然后再执行 load 和 run...
```