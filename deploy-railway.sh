#!/bin/bash
# ===========================================
# Pony Town - Railway 一键部署脚本
# ===========================================
# 使用Railway的免费额度部署ponyTown

set -e

echo "🚂 Railway 部署向导"
echo "=========================================="
echo ""

# 检查是否安装了Railway CLI
if ! command -v railway &> /dev/null; then
    echo "📦 Railway CLI未安装，正在安装..."

    # 检测操作系统
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install railway
        else
            echo "❌ 请先安装Homebrew: https://brew.sh/"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -fsSL https://railway.app/install.sh | sh
    else
        echo "❌ 不支持的操作系统"
        echo "请手动安装Railway CLI: https://docs.railway.app/develop/cli"
        exit 1
    fi
fi

echo "✅ Railway CLI已就绪"
echo ""

# 登录Railway
echo "🔐 步骤1: 登录Railway"
echo "（浏览器将打开，请登录你的Railway账户）"
echo ""
railway login

echo ""
echo "✅ 登录成功！"
echo ""

# 创建新项目
echo "🎨 步骤2: 创建Railway项目"
read -p "请输入项目名称 (默认: ponytown): " PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-ponytown}

railway init --name "$PROJECT_NAME"

echo ""
echo "✅ 项目创建成功: $PROJECT_NAME"
echo ""

# 添加MongoDB
echo "📊 步骤3: 添加MongoDB数据库"
railway add --database mongodb

echo ""
echo "✅ MongoDB已添加"
echo ""

# 生成随机密钥
echo "🔑 步骤4: 生成安全密钥"
SESSION_SECRET=$(openssl rand -base64 32)
API_TOKEN=$(openssl rand -base64 32)

echo "✅ 密钥已生成"
echo ""

# 设置环境变量
echo "⚙️  步骤5: 配置环境变量"

read -p "请输入游戏服务器域名 (如: ponytown.railway.app): " DOMAIN
DOMAIN=${DOMAIN:-$PROJECT_NAME.railway.app}

railway variables set PORT=8090
railway variables set NODE_ENV=production
railway variables set HOST="https://$DOMAIN/"
railway variables set SESSION_SECRET="$SESSION_SECRET"
railway variables set API_TOKEN="$API_TOKEN"

# MongoDB连接字符串会由Railway自动设置

echo ""
echo "✅ 环境变量已配置"
echo ""

# 创建Railway配置文件
echo "📝 步骤6: 创建Railway配置"

cat > railway.json << 'RAILWAY_EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm ci --legacy-peer-deps && npm run ts && npm run build"
  },
  "deploy": {
    "startCommand": "node pony-town.js --login --admin --game",
    "healthcheckPath": "/api/state",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
RAILWAY_EOF

echo "✅ Railway配置已创建"
echo ""

# 部署
echo "🚀 步骤7: 开始部署"
echo "（这可能需要5-10分钟）"
echo ""

railway up

echo ""
echo "========================================"
echo "🎉 部署完成！"
echo "========================================"
echo ""
echo "📊 项目信息:"
echo "  • 项目名: $PROJECT_NAME"
echo "  • 域名: https://$DOMAIN"
echo "  • MongoDB: 已配置"
echo ""
echo "🔗 访问你的游戏:"
echo "  https://$DOMAIN"
echo ""
echo "📱 管理面板:"
echo "  https://$DOMAIN:8091"
echo ""
echo "⚙️  管理项目:"
echo "  railway status    # 查看状态"
echo "  railway logs      # 查看日志"
echo "  railway open      # 打开项目面板"
echo ""
echo "💡 下一步:"
echo "  1. 配置OAuth登录（Google/GitHub）"
echo "  2. 在Railway面板中绑定自定义域名"
echo "  3. 配置环境变量中的OAuth凭据"
echo ""
echo "📖 详细文档: DEPLOYMENT.md"
echo ""
