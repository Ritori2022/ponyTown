# 🆓 免费云端部署指南

## 快速选择

| 平台 | 免费额度 | 难度 | 推荐度 | 适合人群 |
|------|---------|------|--------|---------|
| **Railway** | $5/月 | ⭐ 简单 | ⭐⭐⭐⭐⭐ | 新手，快速测试 |
| **Oracle Cloud** | 永久免费 | ⭐⭐⭐ 中等 | ⭐⭐⭐⭐⭐ | 长期运行 |
| **Google Cloud** | $300/90天 | ⭐⭐ 简单 | ⭐⭐⭐⭐ | 3个月试用 |
| **Fly.io** | 免费额度 | ⭐⭐ 简单 | ⭐⭐⭐ | 轻度使用 |
| **Render + Atlas** | 免费 | ⭐⭐ 简单 | ⭐⭐⭐ | 休眠可接受 |

---

## 方案1: Railway（最简单）⭐ 推荐新手

### 优点
✅ 最简单的部署方式
✅ 自动HTTPS
✅ 内置MongoDB
✅ 一个命令完成部署

### 缺点
❌ 只有$5/月免费额度
❌ 超出后需付费

### 预计运行时间
- 小型游戏（<10人）: 整个月
- 中型游戏（10-50人）: 约2周
- 大型游戏（>50人）: 可能不够

### 一键部署

```bash
# 1. 运行部署脚本
./deploy-railway.sh

# 就这么简单！脚本会自动：
# - 安装Railway CLI
# - 登录账户
# - 创建项目
# - 添加MongoDB
# - 部署应用
```

### 手动部署（如果脚本失败）

```bash
# 1. 安装Railway CLI
# macOS:
brew install railway

# Linux:
curl -fsSL https://railway.app/install.sh | sh

# Windows:
# 下载安装器: https://railway.app/install

# 2. 登录
railway login

# 3. 创建项目
railway init

# 4. 添加MongoDB
railway add -d mongodb

# 5. 部署
railway up

# 6. 打开项目
railway open
```

### 配置OAuth登录

1. 在Railway面板中，点击 "Variables"
2. 添加以下变量：

```
GOOGLE_CLIENT_ID=你的Google_Client_ID
GOOGLE_CLIENT_SECRET=你的Google_Client_Secret
```

3. 重新部署：`railway up`

---

## 方案2: Oracle Cloud（永久免费）⭐ 最推荐

### 优点
✅ **永久免费**
✅ 2个VM实例（各1GB RAM）
✅ 可以长期稳定运行
✅ 没有休眠

### 缺点
❌ 注册需要信用卡（但不会扣费）
❌ 配置相对复杂
❌ 国内访问速度较慢

### 部署步骤

#### 1. 注册Oracle Cloud账户

访问: https://www.oracle.com/cloud/free/

- 需要信用卡验证（不会扣费）
- 选择"Free Tier"

#### 2. 创建VM实例

```bash
# Luna为你准备了自动化脚本
# 将在下一步创建
```

1. 登录Oracle Cloud控制台
2. 创建Compute实例
3. 选择镜像：Ubuntu 22.04
4. 选择Shape：VM.Standard.E2.1.Micro（永久免费）
5. 下载SSH密钥

#### 3. 连接到实例

```bash
# 使用下载的SSH密钥连接
ssh -i ~/Downloads/ssh-key.key ubuntu@<实例公网IP>
```

#### 4. 运行一键部署脚本

```bash
# 在Oracle VM中执行
curl -fsSL https://raw.githubusercontent.com/你的用户名/ponyTown/main/deploy-oracle.sh | bash
```

---

## 方案3: Google Cloud Platform（$300额度）

### 优点
✅ $300免费额度（新用户）
✅ 可运行3个月
✅ 性能强大
✅ 全球CDN

### 缺点
❌ 需要信用卡
❌ 90天后开始收费

### 快速部署

```bash
# 1. 安装gcloud CLI
# macOS:
brew install google-cloud-sdk

# 2. 登录
gcloud auth login

# 3. 创建项目
gcloud projects create ponytown-$(date +%s)

# 4. 部署（使用Cloud Run + MongoDB Atlas）
gcloud run deploy ponytown \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 方案4: Fly.io（免费额度）

### 优点
✅ 简单部署
✅ 全球边缘网络
✅ 免费额度够用

### 缺点
❌ 需要信用卡
❌ MongoDB需要额外配置

### 部署步骤

```bash
# 1. 安装flyctl
curl -L https://fly.io/install.sh | sh

# 2. 登录
flyctl auth login

# 3. 初始化
flyctl launch

# 4. 部署
flyctl deploy
```

---

## 方案5: Render + MongoDB Atlas（完全免费）

### 优点
✅ 完全免费
✅ 自动HTTPS
✅ 持续部署

### 缺点
❌ 15分钟无活动后休眠
❌ 首次访问需要等待唤醒（30秒）

### 部署步骤

#### 1. 注册MongoDB Atlas

1. 访问: https://www.mongodb.com/cloud/atlas/register
2. 创建免费集群（M0 Sandbox - 512MB）
3. 创建数据库用户
4. 获取连接字符串

#### 2. 部署到Render

1. 访问: https://render.com
2. 点击 "New +" → "Web Service"
3. 连接GitHub仓库
4. 配置：
   - Build Command: `npm ci --legacy-peer-deps && npm run ts && npm run build`
   - Start Command: `node pony-town.js --login --admin --game`
5. 环境变量：
   ```
   MONGODB_URI=<你的Atlas连接字符串>
   NODE_ENV=production
   ```

---

## 💰 费用对比（假设持续运行）

| 平台 | 第1个月 | 第2个月 | 第3个月 | 长期 |
|------|---------|---------|---------|------|
| Railway | $0 (额度内) | $0-$10 | $0-$10 | $5-$10/月 |
| Oracle Cloud | $0 | $0 | $0 | **永久$0** ⭐ |
| Google Cloud | $0 (额度内) | $0 (额度内) | $0 (额度内) | $10-$30/月 |
| Fly.io | $0 | $0 | $0 | $0-$5/月 |
| Render+Atlas | $0 | $0 | $0 | **永久$0** |

---

## 🎯 Luna的推荐

### 新手刚开始玩（1-7天）
👉 **Railway** - 最简单，运行 `./deploy-railway.sh` 就完成了

### 想长期运行（>1个月）
👉 **Oracle Cloud Free Tier** - 永久免费，值得花时间配置

### 不介意休眠
👉 **Render + MongoDB Atlas** - 完全免费，但15分钟无活动后休眠

### 有$300预算试3个月
👉 **Google Cloud Platform** - 性能最好

---

## 🚀 最快上手方案

Luna推荐你先用**Railway**快速体验：

```bash
# 1. 运行部署脚本（5分钟）
./deploy-railway.sh

# 2. 配置OAuth（可选，见QUICKSTART.md）

# 3. 访问你的游戏！
# https://你的项目名.railway.app
```

如果喜欢，再迁移到**Oracle Cloud永久免费版**～

---

## ❓ 常见问题

### Q: 这些真的免费吗？
A: 是的，但部分需要信用卡验证（不会自动扣费）

### Q: Railway的$5额度够用吗？
A: 轻度使用（<10人在线）够用整个月

### Q: Oracle Cloud永久免费有什么限制？
A: 1GB RAM + 0.2 OCPU，适合小型游戏（<50人同时在线）

### Q: Render为什么会休眠？
A: 免费层15分钟无活动后休眠，首次访问需30秒唤醒

### Q: 可以用两个平台吗？
A: 可以！比如游戏服务器用Oracle，数据库用MongoDB Atlas

---

## 📞 需要帮助？

查看详细部署文档：
- `DEPLOYMENT.md` - 详细部署指南
- `QUICKSTART.md` - 快速开始
- 运行 `./deploy-railway.sh` - 自动部署到Railway

喵～祝你部署顺利！ 🎉
