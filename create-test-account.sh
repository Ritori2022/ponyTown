#!/bin/bash
# ===========================================
# Pony Town - 创建测试账户脚本
# ===========================================
# 用于开发模式下快速创建测试账户

set -e

echo "========================================"
echo "  Pony Town - 创建测试账户"
echo "========================================"
echo ""

# 检查参数
USERNAME=${1:-"测试玩家"}
EMAIL=${2:-"test@example.com"}

echo "📝 账户信息："
echo "   用户名: $USERNAME"
echo "   邮箱: $EMAIL"
echo ""

# 检查MongoDB容器是否运行
if ! docker compose ps mongodb | grep -q "Up"; then
    echo "❌ MongoDB容器未运行"
    echo "请先启动服务: docker compose up -d"
    exit 1
fi

echo "🔄 正在创建账户..."

# 创建账户并获取ID
ACCOUNT_ID=$(docker compose exec -T mongodb mongosh \
    --username admin \
    --password changeme123 \
    --authenticationDatabase admin \
    --quiet \
    ponytown \
    --eval "var result = db.accounts.insertOne({name: '$USERNAME', email: '$EMAIL', createdAt: new Date(), lastVisit: new Date(), roles: ['user'], settings: {}, state: {}, flags: {}}); print(result.insertedId);" | tail -1)

# 清理输出中的ObjectId()包装
ACCOUNT_ID=$(echo "$ACCOUNT_ID" | sed 's/ObjectId("\(.*\)")/\1/' | tr -d '[:space:]')

echo ""
echo "✅ 账户创建成功！"
echo ""
echo "========================================"
echo "  登录信息"
echo "========================================"
echo ""
echo "📋 账户ID: $ACCOUNT_ID"
echo ""
echo "🌐 开发模式登录URL:"
echo "   http://localhost:8090/local?username=$ACCOUNT_ID"
echo ""
echo "🚀 访问以上URL即可直接登录（无需OAuth）"
echo ""
echo "💡 提示："
echo "   - 该账户可以用于开发和测试"
echo "   - 生产环境请使用OAuth登录"
echo "   - 如需管理员权限，使用: docker compose exec ponytown node cli.js --addrole $ACCOUNT_ID superadmin"
echo ""
