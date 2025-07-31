# 部署指南

## 1. 系统要求

### 1.1 硬件要求
- CPU: 4 核心或以上
- 内存: 8GB RAM 或以上
- 磁盘: 20GB 可用空间
- 网络: 稳定的互联网连接

### 1.2 软件要求
- Docker 20.10+
- Docker Compose 2.0+
- PostgreSQL 14+
- Node.js 18+
- npm 8+

## 2. 部署步骤

### 2.1 准备工作
1. 安装必要的软件
   ```bash
   # 安装 Docker 和 Docker Compose
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. 配置环境变量
   - 复制 `.env.example` 到 `.env`
   - 根据实际情况修改配置

### 2.2 启动服务
1. 构建和启动所有服务
   ```bash
   docker-compose up -d --build
   ```

2. 检查服务状态
   ```bash
   docker-compose ps
   ```

3. 查看日志
   ```bash
   docker-compose logs -f
   ```

### 2.3 数据库初始化
1. 进入 PostgreSQL 容器
   ```bash
   docker-compose exec postgres psql -U postgres
   ```

2. 执行数据库迁移
   ```bash
   docker-compose exec backend npm run migrate
   ```

## 3. 系统配置

### 3.1 环境变量配置
在 `.env` 文件中配置以下变量：
```env
# 后端配置
NODE_ENV=production
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_NAME=campus_gis
DB_USER=postgres
DB_PASSWORD=postgres

# 前端配置
REACT_APP_API_URL=http://localhost:3000
```

### 3.2 Nginx 配置
1. 配置反向代理
2. 配置 SSL 证书（可选）
3. 配置缓存策略

## 4. 监控与维护

### 4.1 监控
1. 系统资源监控
2. 应用性能监控
3. 数据库性能监控

### 4.2 备份
1. 数据库备份
   ```bash
   docker-compose exec postgres pg_dump -U postgres campus_gis > backup.sql
   ```

2. 文件备份
   ```bash
   docker-compose exec backend tar -czf backup.tar.gz /app/database
   ```

### 4.3 日志管理
1. 日志轮转
2. 错误日志分析
3. 性能日志分析

## 5. 常见问题

### 5.1 启动问题
- 端口冲突：修改 docker-compose.yml 中的端口配置
- 权限问题：确保 Docker 有足够的权限
- 网络问题：检查 Docker 网络配置

### 5.2 数据库问题
- 连接失败：检查数据库配置
- 查询慢：检查索引和查询优化
- 空间不足：清理不必要的数据

### 5.3 性能问题
- 页面加载慢：检查网络和服务器性能
- API 响应慢：优化 API 逻辑
- 内存占用高：优化代码和配置

## 6. 更新流程

### 6.1 拉取最新代码
```bash
# 拉取最新代码
git pull origin main

# 重建容器
docker-compose up -d --build
```

### 6.2 数据库迁移
```bash
# 进入容器
docker-compose exec backend bash

# 执行迁移
npm run migrate
```

### 6.3 重启服务
```bash
# 重启所有服务
docker-compose restart
```

## 7. 安全配置

### 7.1 网络安全
- 配置防火墙规则
- 使用 HTTPS
- 配置安全头

### 7.2 数据安全
- 数据加密
- 定期备份
- 访问控制

### 7.3 应用安全
- 输入验证
- SQL 注入防护
- XSS 防护
