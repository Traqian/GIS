# 校园地理信息系统

一个基于Web的校园地理信息系统，提供校园地图展示、导航、设施查询等功能。

## 功能特点

- 🗺️ 校园地图展示
- 🏛️ 建筑物信息查询
- 🧭 路径规划与导航
- 🏥 校园设施定位
- 📍 实时位置跟踪
- 🎤 语音交互功能
- 📝 用户反馈系统

## 技术栈

- **前端**
  - React + TypeScript
  - React-Leaflet 地图组件
  - React Router 路由管理
  - Styled-components 样式管理

- **后端**
  - Node.js + Express
  - PostgreSQL + PostGIS 空间数据库
  - JWT 身份验证
  - RESTful API 设计

## 系统要求

- Node.js 18+
- PostgreSQL 14+
- Docker 20.10+
- Docker Compose 2.0+

## 安装步骤

1. 克隆项目
```bash
git clone https://github.com/yourusername/campus-gis.git
cd campus-gis
```

2. 安装依赖
```bash
# 后端
cd backend
npm install

# 前端
cd ../frontend
npm install
```

3. 配置环境变量
- 复制 `.env.example` 到 `.env`
- 修改配置文件中的数据库连接信息

4. 启动服务
```bash
# 使用 Docker
# 构建并启动所有服务
docker-compose up -d --build

# 或者单独启动
# 后端
npm start

# 前端
npm start
```

## 使用说明

1. 打开浏览器访问 http://localhost:3000
2. 在地图上查看校园布局
3. 点击建筑物获取详细信息
4. 使用导航功能规划路线
5. 使用语音功能进行交互
6. 提交用户反馈

## API 文档

查看完整 API 文档：[API 文档](docs/api.md)

## 测试

```bash
# 前端测试
npm test

# 后端测试
npm test
```

## 项目结构

```
campus-gis/
├── backend/           # 后端代码
│   ├── src/          # 源代码
│   ├── tests/        # 测试代码
│   └── database/     # 数据库脚本
├── frontend/         # 前端代码
│   ├── src/         # 源代码
│   ├── tests/       # 测试代码
│   └── public/      # 静态资源
└── docs/            # 文档
```

## 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证。

一个基于Web的校园地理信息系统，提供校园地图展示、导航、信息查询等功能。

## 功能特点

- 校园地图展示
- 建筑物信息查询
- 路径规划
- 校园设施定位
- 实时位置跟踪

## 技术栈

- 前端：React + Leaflet.js
- 后端：Node.js + Express
- 数据库：PostgreSQL + PostGIS

## 安装步骤

1. 克隆项目
2. 安装依赖
3. 配置数据库
4. 启动服务

## 项目结构

```
campus-gis/
├── frontend/           # 前端代码
├── backend/            # 后端代码
├── database/           # 数据库脚本
└── docs/              # 文档
```
