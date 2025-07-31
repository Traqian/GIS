# 校园地理信息系统文档

## 1. 系统概述

### 1.1 系统功能
- 校园地图展示
- 建筑物信息查询
- 路径规划与导航
- 校园设施定位
- 实时位置跟踪
- 交互式地图操作
- 用户反馈系统

### 1.2 技术架构
- **前端**
  - React + TypeScript
  - React-Leaflet 地图组件
  - React Router 路由管理
  - Styled-components 样式管理
  - Axios API 请求

- **后端**
  - Node.js + Express
  - PostgreSQL + PostGIS 空间数据库
  - JWT 身份验证
  - RESTful API 设计

## 2. 系统安装

### 2.1 环境要求
- Node.js 18+
- PostgreSQL 14+
- Docker 20.10+
- Docker Compose 2.0+

### 2.2 安装步骤
1. 克隆代码仓库
2. 安装依赖
   ```bash
   npm install
   ```
3. 配置环境变量
   - 复制 `.env.example` 到 `.env`
   - 修改配置文件
4. 启动服务
   ```bash
   docker-compose up -d --build
   ```

## 3. 数据库结构

### 3.1 核心表结构
1. **建筑物表 (buildings)**
   - id (主键)
   - name (名称)
   - description (描述)
   - address (地址)
   - building_type (类型)
   - floors (楼层数)
   - capacity (容纳人数)
   - geom (地理位置)
   - created_at (创建时间)
   - updated_at (更新时间)

2. **设施表 (facilities)**
   - id (主键)
   - name (名称)
   - type (类型)
   - description (描述)
   - opening_hours (开放时间)
   - contact_info (联系方式)
   - geom (地理位置)
   - created_at (创建时间)
   - updated_at (更新时间)

3. **路径表 (paths)**
   - id (主键)
   - start_point (起点)
   - end_point (终点)
   - length_meters (长度)
   - path_type (路径类型)
   - is_accessible (是否无障碍)
   - created_at (创建时间)
   - updated_at (更新时间)

## 4. API 文档

### 4.1 建筑物相关 API
- GET /api/buildings - 获取所有建筑物列表
  ```json
  {
    "id": 1,
    "name": "图书馆",
    "description": "主图书馆",
    "address": "校内主干道",
    "building_type": "library",
    "floors": 5,
    "capacity": 1000,
    "geom": "POINT(114.3187 30.5234)"
  }
  ```

- GET /api/buildings/:id - 获取单个建筑物信息
- GET /api/buildings/nearby - 获取附近建筑物

### 4.2 导航相关 API
- GET /api/paths - 获取所有路径信息
- POST /api/navigation - 规划导航路线
  ```json
  {
    "start": {
      "lat": 30.5234,
      "lng": 114.3187
    },
    "end": {
      "lat": 30.5235,
      "lng": 114.3188
    }
  }
  ```

### 4.3 设施相关 API
- GET /api/facilities - 获取所有设施
- GET /api/facilities/nearby - 获取附近设施

## 5. 使用指南

### 5.1 基础使用
1. 打开系统主界面
2. 在地图上查看校园布局
3. 点击建筑物获取详细信息
4. 使用导航功能规划路线

### 5.2 高级功能
1. 语音识别导航
2. 实时位置跟踪
3. 设施快速查找
4. 用户反馈提交

## 6. 开发指南

### 6.1 代码结构
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

### 6.2 开发规范
1. **代码规范**
   - 使用 ESLint 进行代码检查
   - 统一代码风格
   - 代码注释规范

2. **测试规范**
   - 单元测试覆盖率要求
   - 集成测试要求
   - 性能测试要求

3. **提交规范**
   - 提交信息格式
   - 分支命名规范
   - 代码审查流程

## 7. 常见问题

### 7.1 启动问题
- 端口冲突：修改配置文件中的端口
- 数据库连接：检查数据库配置
- API 请求：检查 API 路径和参数

### 7.2 性能问题
- 页面加载慢：检查网络和服务器性能
- API 响应慢：优化数据库查询
- 内存占用高：优化代码和配置

### 7.3 数据问题
- 数据不完整：检查数据导入
- 数据错误：检查数据验证
- 数据更新：执行数据库迁移

## 8. 更新日志

### 8.1 版本历史
- v1.0.0 (2025-07-31)
  - 初始版本发布
  - 实现核心功能
  - 完成基本测试

### 8.2 更新计划
- v1.1.0
  - 优化性能
  - 添加新功能
  - 修复已知问题

## 9. 联系方式

### 9.1 技术支持
- 邮箱: support@campusgis.com
- 电话: +86-123456789
- QQ: 123456789

### 9.2 反馈渠道
- 用户反馈系统
- 官方网站
- 技术论坛
