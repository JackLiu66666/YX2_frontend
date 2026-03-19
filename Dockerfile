# 第一阶段：构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖 (使用国内源加速)
RUN npm config set registry https://registry.npmmirror.com
RUN npm install

# 复制所有源代码
COPY . .

# 执行生产环境构建
RUN npm run build

# 第二阶段：运行阶段 (Nginx)
FROM nginx:alpine

# 维护者信息
LABEL maintainer="Jack Liu"

# 从第一阶段复制构建好的 dist 文件夹到 Nginx 的静态文件目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制我们自定义的 Nginx 配置文件 (覆盖默认配置)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]