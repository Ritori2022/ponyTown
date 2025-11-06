# 🚀 快速开始指南 - 无需OAuth配置

## 方式一：开发模式（推荐新手，无需OAuth）

### 1. 快速配置

```bash
# 1. 复制环境变量模板
cp .env.example .env

# 2. 编辑 .env 文件
nano .env
```

在 `.env` 中修改：
```env
MONGO_USERNAME=admin
MONGO_PASSWORD=你的密码123  # 改成你自己的密码
MONGO_DATABASE=ponytown
```

### 2. 创建开发配置文件

创建 `config.dev.json`（开发专用，无需OAuth）：

```json
{
  "title": "Pony Town Dev",
  "contactEmail": "admin@example.com",
  "port": 8090,
  "adminPort": 8091,
  "host": "http://localhost:8090/",
  "local": "localhost:8090",
  "adminLocal": "localhost:8091",
  "secret": "dev-secret-change-in-production",
  "token": "dev-token-change-in-production",
  "db": "mongodb://admin:你的密码123@mongodb:27017/ponytown?authSource=admin",
  "oauth": {},
  "assetsPath": "assets",
  "servers": [
    {
      "id": "dev",
      "port": 8090,
      "path": "/s00/ws",
      "local": "localhost:8090",
      "name": "Dev Server",
      "desc": "Development server",
      "flags": {
        "test": true,
        "editor": true
      }
    }
  ]
}
```

### 3. 修改 Dockerfile 启用开发模式

在 `Dockerfile` 的最后一行改为：

```dockerfile
# 开发模式启动（不需要OAuth）
CMD ["node", "pony-town.js", "--login", "--admin", "--game", "--local"]
```

### 4. 一键启动

```bash
# 使用开发配置启动
cp config.dev.json config.json
docker-compose up -d
```

### 5. 查看日志

```bash
docker-compose logs -f ponytown
```

### 6. 访问游戏

打开浏览器访问：
- **游戏主页**: http://localhost:8090

**开发模式下的登录方式**：

由于开发模式启用了 mock login，你需要先创建一个账户ID才能登录。

**方式A：通过MongoDB直接创建测试账户**

```bash
# 进入MongoDB容器
docker-compose exec mongodb mongosh -u admin -p 你的密码123 --authenticationDatabase admin

# 切换到ponytown数据库
use ponytown

# 创建测试账户
db.accounts.insertOne({
  name: "测试玩家",
  email: "test@example.com",
  createdAt: new Date(),
  lastVisit: new Date(),
  roles: ["user"],
  settings: {},
  state: {}
})

# 记住返回的 _id，例如: ObjectId("507f1f77bcf86cd799439011")
```

**方式B：通过OAuth登录一次后使用账户ID**

如果你不想配置OAuth，建议使用方式A。

**登录步骤**：
1. 打开浏览器访问: `http://localhost:8090/local?username=<你的账户ID>`
2. 例如: `http://localhost:8090/local?username=507f1f77bcf86cd799439011`
3. 就可以直接登录，无需OAuth！

---

## 方式二：生产模式（需要OAuth配置）

如果你要正式对外开放，建议配置OAuth社交登录。

### 配置 Google OAuth（最简单）

1. **创建 Google Cloud 项目**
   - 访问 https://console.cloud.google.com/
   - 创建新项目

2. **启用 Google+ API**
   - 在API库中搜索 "Google+ API"
   - 点击启用

3. **创建OAuth凭据**
   - 导航到 "凭据" → "创建凭据" → "OAuth 2.0 客户端ID"
   - 应用类型: Web应用
   - 已授权的重定向URI:
     - 本地测试: `http://localhost:8090/auth/google/callback`
     - 生产环境: `https://你的域名.com/auth/google/callback`

4. **获取凭据**
   - 复制 Client ID 和 Client Secret

5. **更新 config.json**

```json
{
  "oauth": {
    "google": {
      "clientID": "你的Google_Client_ID",
      "clientSecret": "你的Google_Client_Secret"
    }
  }
}
```

6. **重启服务**

```bash
docker-compose restart ponytown
```

现在访问 http://localhost:8090 就可以看到 "Sign in with Google" 按钮了！

---

## Docker 配置详解

### 当前目录结构

```
ponyTown/
├── Dockerfile              # Docker镜像构建文件
├── docker-compose.yml      # 服务编排文件
├── .dockerignore          # Docker忽略文件
├── .env.example           # 环境变量模板
├── config.json            # 应用配置（运行时）
├── config.dev.json        # 开发配置（你创建）
└── nginx.conf             # Nginx反向代理配置
```

### 常用 Docker 命令

```bash
# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose down

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f ponytown
docker-compose logs -f mongodb

# 重启服务
docker-compose restart ponytown

# 重新构建镜像
docker-compose build --no-cache

# 进入容器Shell
docker-compose exec ponytown sh
docker-compose exec mongodb mongosh

# 清理所有（删除容器和数据卷，慎用！）
docker-compose down -v
```

### 修改配置后重启

```bash
# 方式1：只修改了config.json（不需要重新构建）
docker-compose restart ponytown

# 方式2：修改了代码或Dockerfile（需要重新构建）
docker-compose down
docker-compose build
docker-compose up -d
```

### 数据持久化

MongoDB数据存储在Docker volume中，即使删除容器也不会丢失：

```bash
# 查看volumes
docker volume ls | grep ponytown

# 备份数据
docker-compose exec mongodb mongodump \
  --username=admin \
  --password=你的密码123 \
  --authenticationDatabase=admin \
  --out=/data/backup

# 恢复数据
docker-compose exec mongodb mongorestore \
  --username=admin \
  --password=你的密码123 \
  --authenticationDatabase=admin \
  /data/backup
```

---

## 故障排除

### 问题1：容器启动失败

```bash
# 查看详细日志
docker-compose logs ponytown

# 常见原因：
# - MongoDB未启动完成：等待30秒后重试
# - config.json格式错误：检查JSON语法
# - 端口被占用：修改.env中的端口
```

### 问题2：无法连接MongoDB

检查 `config.json` 中的数据库连接字符串：

```json
{
  "db": "mongodb://admin:你的密码123@mongodb:27017/ponytown?authSource=admin"
}
```

**注意**：
- 主机名必须是 `mongodb`（不是localhost）
- 密码必须和 `.env` 中的 `MONGO_PASSWORD` 一致
- 必须包含 `?authSource=admin`

### 问题3：浏览器无法访问

```bash
# 1. 检查容器是否运行
docker-compose ps

# 2. 检查端口映射
docker-compose ps ponytown
# 应该看到: 0.0.0.0:8090->8090/tcp

# 3. 检查防火墙（云服务器）
# 确保安全组开放了8090端口

# 4. 检查应用日志
docker-compose logs ponytown | tail -50
```

### 问题4：开发模式登录返回404

确保：
1. Dockerfile 最后一行包含 `--local` 参数
2. 重新构建镜像：`docker-compose build`
3. 重启服务：`docker-compose up -d`
4. 访问 `/local?username=<账户ID>` （不是 `/auth/local`）

---

## 下一步

### 本地开发测试通过后，部署到云端：

1. **选择云平台**（推荐 DigitalOcean $12/月）
2. **参考 DEPLOYMENT.md** 的详细部署指南
3. **配置域名和HTTPS**
4. **配置OAuth** 用于生产环境
5. **设置自动备份**

---

## 快速参考

| 操作 | 命令 |
|------|------|
| 启动 | `docker-compose up -d` |
| 停止 | `docker-compose down` |
| 重启 | `docker-compose restart ponytown` |
| 日志 | `docker-compose logs -f ponytown` |
| 进入MongoDB | `docker-compose exec mongodb mongosh -u admin -p 密码` |
| 重新构建 | `docker-compose build --no-cache` |
| 清理一切 | `docker-compose down -v` (慎用！) |

**开发模式登录URL**：
```
http://localhost:8090/local?username=<MongoDB中的账户_id>
```

祝你玩得开心！ 🎮
