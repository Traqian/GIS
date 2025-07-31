# 校园地理信息系统云部署指南

## 1. 部署方案选择

### 1.1 免费方案
1. **Vercel**
   - 前端部署免费
   - 支持自动部署
   - 全球 CDN
   - 适合静态网站

2. **Netlify**
   - 前端部署免费
   - 自动构建
   - 自定义域名
   - 适合静态网站

### 1.2 云服务器方案
1. **阿里云**
   - 服务器 + 域名 + SSL
   - 适合完整部署
   - 支持数据库
   - 适合生产环境

2. **腾讯云**
   - 服务器 + 域名 + SSL
   - 适合完整部署
   - 支持数据库
   - 适合生产环境

## 2. 部署步骤

### 2.1 使用Vercel部署（推荐）
1. 注册账号
   ```bash
   # 访问 https://vercel.com
   # 使用 GitHub 账号登录
   ```

2. 部署前端
   ```bash
   # 在项目根目录
   $ cd frontend
   # 在 Vercel 网站点击 "Import Project"
   # 选择 GitHub 仓库
   # 点击 "Deploy"
   ```

3. 获取访问地址
   ```bash
   # 部署完成后会生成访问地址
   # 格式：https://your-project-name.vercel.app
   ```

### 2.2 使用Netlify部署
1. 注册账号
   ```bash
   # 访问 https://www.netlify.com
   # 使用 GitHub 账号登录
   ```

2. 部署前端
   ```bash
   # 在项目根目录
   $ cd frontend
   # 在 Netlify 网站点击 "New site from Git"
   # 选择 GitHub 仓库
   # 点击 "Deploy site"
   ```

3. 获取访问地址
   ```bash
   # 部署完成后会生成访问地址
   # 格式：https://your-project-name.netlify.app
   ```

### 2.3 使用阿里云部署
1. 购买服务器
   ```bash
   # 访问 https://www.aliyun.com
   # 购买 ECS 服务器
   # 购买域名
   # 购买 SSL 证书
   ```

2. 部署步骤
   ```bash
   # 1. 安装 Docker
   # 2. 配置域名解析
   # 3. 部署项目
   $ docker-compose up -d --build
   ```

3. 访问地址
   ```bash
   # 格式：https://your-domain.com
   ```

## 3. 访问方式

### 3.1 通过域名访问
- 访问格式：https://your-project.vercel.app
- 或：https://your-project.netlify.app
- 或：https://your-domain.com

### 3.2 通过IP访问
- 访问格式：http://your-server-ip
- 或：https://your-server-ip

## 4. 常见问题

### 4.1 部署问题
- 部署失败：检查配置文件
- 访问失败：检查域名解析
- SSL 问题：检查证书配置

### 4.2 性能问题
- 加载慢：检查服务器配置
- 响应慢：优化代码
- 内存不足：升级服务器

### 4.3 安全问题
- 未加密：配置 SSL
- 被攻击：配置防火墙
- 数据泄露：检查权限

## 5. 维护指南

### 5.1 日常维护
- 监控服务器状态
- 检查日志文件
- 备份数据
- 更新安全补丁

### 5.2 故障处理
1. 检查服务状态
2. 查看日志
3. 重启服务
4. 联系技术支持

## 6. 技术支持

### 6.1 联系方式
- 邮箱：support@campusgis.com
- 电话：+86-123456789
- QQ：123456789

### 6.2 支持时间
- 工作日：9:00-18:00
- 假日：10:00-17:00

## 7. 更新说明

### 7.1 更新方式
1. 停止服务
```bash
$ docker-compose down
```

2. 拉取最新代码
```bash
$ git pull origin main
```

3. 重新部署
```bash
$ docker-compose up -d --build
```

### 7.2 注意事项
- 更新前备份数据
- 测试新版本功能
- 记录更新日志

## 8. 安全说明

### 8.1 数据安全
- 数据加密存储
- 定期备份数据
- 严格访问控制

### 8.2 系统安全
- 定期更新补丁
- 防火墙配置
- 安全审计

## 9. 快捷键

### 9.1 网站操作
- Ctrl + +：放大地图
- Ctrl + -：缩小地图
- Ctrl + 0：重置缩放

### 9.2 导航操作
- F5：刷新页面
- Esc：取消操作
- Enter：确认选择
