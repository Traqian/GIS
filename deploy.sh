#!/bin/bash

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI 未安装，正在安装..."
    npm install -g vercel
fi

# 进入前端目录
echo "切换到前端目录..."
cd frontend

# 安装依赖
echo "安装前端依赖..."
npm install

# 构建项目
echo "构建前端项目..."
npm run build

# 部署到 Vercel
echo "开始部署到 Vercel..."
vercel --prod

# 显示部署结果
echo "部署完成！请访问以下地址:"
vercel link
