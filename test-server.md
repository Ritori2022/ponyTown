# Pony Town 功能测试指南

## 方案 1: 基础HTTP服务测试（最简单）

### 1. 启动服务器
```bash
# 编译TypeScript（如果还没编译）
npm run ts

# 启动服务器
npm start
```

### 2. 测试HTTP端点（打开新终端）
```bash
# 测试主页
curl -I http://localhost:8090/

# 测试静态资源
curl -I http://localhost:8090/assets/

# 测试Service Worker
curl -I http://localhost:8090/sw.js
```

**预期结果**:
- 服务器日志: `[info] Listening on port 8090`
- HTTP请求返回 200 或 404（正常响应）
- 无崩溃或未捕获错误

---

## 方案 2: 完整功能测试（需要MongoDB）

### 前置条件
1. 安装并启动MongoDB
2. 创建测试数据库
3. 更新config.json中的数据库连接

### MongoDB快速设置（Docker方式）
```bash
# 拉取MongoDB镜像
docker pull mongo:latest

# 启动MongoDB容器
docker run -d \
  --name ponytown-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=ponytown \
  -e MONGO_INITDB_ROOT_PASSWORD=testpass123 \
  mongo:latest

# 更新config.json
# "db": "mongodb://ponytown:testpass123@localhost:27017/ponytowndb?authSource=admin"
```

### 测试步骤
1. 启动服务器: `npm start`
2. 浏览器访问: `http://localhost:8090`
3. 测试OAuth登录（需要配置OAuth密钥）
4. 测试管理面板: `http://localhost:8090/admin`

---

## 方案 3: 开发模式测试

### 启动开发环境
```bash
# 终端1: TypeScript watch
npm run ts-watch

# 终端2: Webpack dev server
npm run wds

# 终端3: Gulp开发服务器
gulp dev
```

**功能**:
- 热重载（HMR）
- 自动编译TypeScript
- 实时CSS更新

---

## 🔍 健康检查清单

### 服务器启动验证
- [ ] ✅ 端口8090已监听
- [ ] ✅ 无fatal错误
- [ ] ✅ WebSocket服务就绪
- [ ] ⚠️ MongoDB连接（可选，需配置）

### 核心功能验证
- [ ] HTTP服务响应
- [ ] 静态资源服务
- [ ] WebSocket连接（需前端）
- [ ] OAuth认证（需配置密钥）
- [ ] 管理面板访问（需管理员账户）

### 已知行为
- MongoDB超时是正常的（未配置数据库时）
- Canvas警告可忽略（非核心功能）
- 部分OAuth失败正常（未配置密钥）

---

## 📊 测试日志示例

### 成功启动日志
```
Canvas module not available, image processing features will be disabled
[Nov 05 22:45:04] [info] Listening on port 8090 (production, login, admin, game:test)
```

### MongoDB连接等待（正常）
```
[error] MongooseError: Operation `events.findOne()` buffering timed out after 10000ms
```
这是预期的，因为没有配置真实数据库。

---

## 🚀 下一步

### 快速测试（5分钟）
推荐使用**方案1**，只测试服务器基础功能。

### 完整测试（30分钟）
配置MongoDB和OAuth，测试完整游戏功能。

### 生产部署
需要：
- 真实MongoDB实例
- OAuth应用密钥（Google/Twitter/GitHub等）
- 域名和SSL证书

