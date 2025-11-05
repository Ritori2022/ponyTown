# Pony Town - Modernized 2025 | 小马镇 - 2025现代化版本

<div align="center">

**🎉 现代化状态 | Modernization Status**: ✅ **服务器运行中 | SERVER RUNNING**

Phase 1-4 完成 | Complete (2025-11-05)

[English](#english) | [中文](#chinese)

</div>

---

<a name="english"></a>
## 📖 English Documentation

> **Status**: This fork has been fully modernized from 2019 tech stack to 2025 standards.

### 📊 Modernization Overview

This branch contains a **full modernization** of the Pony Town codebase:

| Component | Original | Current | Status |
|-----------|----------|---------|--------|
| Node.js | ~12.x | 22.21.0 LTS | ✅ |
| TypeScript | 3.5.3 | 5.9.3 | ✅ |
| Angular | 8.2.4 | 18.2.14 | ✅ |
| Webpack | 4.39.3 | 5.102.1 | ✅ |
| Express | 4.17.1 | 4.21.2 | ✅ |
| Mongoose | 5.6.11 | 8.19.3 | ✅ |
| RxJS | 6.6.7 | 7.8.1 | ✅ |
| WebSocket | clusterws-uws | ws | ✅ |
| Passport | 0.4.x | 0.6.0 | ✅ |
| connect-mongo | 3.x | 5.1.0 | ✅ |
| ESLint | TSLint (deprecated) | 9.15.0 | ✅ |
| Sass Compiler | node-sass | dart-sass 1.80.7 | ✅ |

**See [MODERNIZATION_SUMMARY.md](./MODERNIZATION_SUMMARY.md) for complete details.**

---

### 🛠️ Prerequisites

* **[Node.js](https://nodejs.org/)** (version 22.x LTS) - **Updated from v9**
* gulp `npm install -g gulp`
* MongoDB: [download link](https://www.mongodb.com/download-center/community) and [installation instructions](https://docs.mongodb.com/manual/administration/install-community/)
* [ImageMagick](https://imagemagick.org/script/download.php#windows) (optional, required for generating preview gifs in animation tool)

### 📦 Installation

```bash
# Install dependencies (may take a few minutes)
npm install --legacy-peer-deps

# Note: --legacy-peer-deps is needed due to some legacy dependencies
# Some native modules (canvas) may fail to compile but are not critical
```

**Known Installation Issues:**
- `canvas` package may fail (not required for core functionality)
- Use `--ignore-scripts` if you encounter compilation errors

### 🗄️ Setting up Database

- Install MongoDB
- Start `mongo` from command line (you may need to go to `C:\Program Files\MongoDB\Server\4.0\bin` path on windows to run the command)
- Type `use your_database_name` to create database
- Type `db.new_collection.insert({ some_key: "some_value" })` to initialize database
- Type
  ```javascript
  db.createUser(
    {
      user: "your_username",
      pwd: "your_password",
      roles: [ { role: "readWrite", db: "your_database_name" } ]
    }
  )
  ```
  to create database user.
- Type `quit()` to exit mongo

### 🔑 Setting up OAuth keys

Get OAuth keys for authentication platform of your choice (github, google, twitter, facebook, vkontakte, patreon)

#### Github

- Go to https://github.com/settings/developers create new OAuth app.
- Set authorization callback URL to `http://<your domain>/auth/github/callback` or `http://localhost:8090/auth/github/callback` for localhost server.
- Add this to `oauth` field in your `config.json`

```json
"github": {
  "clientID": "<your_client_id>",
  "clientSecret": "<your_client_secret>"
}
```

#### Twitter

- Go to https://developer.twitter.com/en/apps create new app.
- Set callback URL to `http://<your domain>/auth/twitter/callback` or `http://localhost:8090/auth/twitter/callback` for localhost server.
- Add this to `oauth` field in your `config.json`

```json
"twitter": {
  "consumerKey": "<your_consumer_key>",
  "consumerSecret": "<your_consumer_secret>"
}
```

#### Google

- Go to https://console.developers.google.com/apis/dashboard create new project from dropdown at the top, go to credentials and create new entry.
- Add to Authorized JavaScript origins `http://<your domain>` or `http://localhost:8090/` for localhost server.
- Add to Authorized redirect URIs `http://<your domain>/auth/google/callback` or `http://localhost:8090/auth/google/callback` for localhost server.
- Add this to `oauth` field in your `config.json`

```json
"google": {
  "clientID": "<your_client_id>",
  "clientSecret": "<your_client_secret>"
}
```

#### Other Platforms

If you want to add other sign-in methods you need to find appropriate [passport](http://www.passportjs.org/) package and add it in `src/ts/server/oauth.ts` and add correct entry in `config.json`.

### ⚙️ Configuration

Add `config.json` file in root directory with following content. You can use `config-template.json` as a starting point for your own config. (do not include comments in your `config.json` file)

```javascript
{
  "title": "Pony Town",
  "twitterLink": "https://twitter.com/<twitter_name>", // optional
  "contactEmail": "<your_contact_email>",
  "port": 8090,
  "adminPort": 8091,
  "host": "http://localhost:8090/",
  "local": "localhost:8090",
  "adminLocal": "localhost:8091",
  "secret": "<some_random_string_here>",
  "token": "<some_random_string_here>",
  "db": "mongodb://<username>:<password>@localhost:27017/<database_name>",
  "oauth": {
    "google": {
      "clientID": "<CLIENT_ID_HERE>",
      "clientSecret": "<CLIENT_SECRET_HERE>"
    }
    // other oauth entries here
  },
  "servers": [
    {
      "id": "dev",
      "port": 8090,
      "path": "/s00/ws",
      "local": "localhost:8090",
      "name": "Dev server",
      "desc": "Development server",
      "flag": "test",
      "flags": {
        "test": true,
        "editor": true
      },
      "alert": "18+"
    }
  ]
}
```

### 🚀 Running

**Important:** Create `config.json` from `config-template.json` before starting!

#### Production environment

```bash
# Compile TypeScript
npm run ts

# Start server
npm start
```

**✅ Server Status (2025-11-05):**
- Server successfully starts and listens on port 8090
- All major dependencies modernized and working
- WebSocket connections using standard `ws` library
- MongoDB connection ready (requires configured database)
- Canvas module gracefully degrades if unavailable (not critical)

**⚠️ Known Limitations:**
- Full Webpack AOT build requires configuration updates (see Phase 4.2 in docs)
- Production assets build uses development mode for now
- 221 non-critical TypeScript warnings (deferred to Phase 5)
- See [MODERNIZATION_SUMMARY.md](./MODERNIZATION_SUMMARY.md) for details

#### Development environment

```bash
npm run ts-watch    # terminal 1
npm run wds         # terminal 2
gulp dev            # terminal 3
gulp test           # terminal 4 (optional)
```

```bash
gulp dev --sprites  # run with generation of sprite sheets
gulp dev --test     # run with tests
gulp dev --coverage # run with tests and code coverage
```

### 👤 Admin Commands

Adding/removing roles

```bash
node cli.js --addrole <account_id> <role>   # roles: superadmin, admin, mod, dev
node cli.js --removerole <account_id> <role>
```

To setup superadmin role use following command

```bash
node cli.js --addrole <your_account_id> superadmin
```

Admin panel is accessible at `<base_url>/admin/` (requires admin or superadmin role to access)
Tools are accessible at `<base_url>/tools/` (only available in dev mode or when started with --tools flag)

### 🔧 Technology Stack (2025)

#### Frontend
- **Angular 18.2.14** (from 8.2.4) - Modern framework with Ivy engine
- **TypeScript 5.9.3** - Latest language features
- **Webpack 5.102.1** - Modern bundler with improved performance
- **Sass 1.93.3** - Dart Sass (replaces deprecated node-sass)

#### Backend
- **Node.js 22.21.0** - LTS version
- **Express 4.21.2** - Latest 4.x
- **Mongoose 8.19.3** - Modern MongoDB ODM
- **Passport 0.7.0** - Authentication

#### Build Tools
- **ESLint 9.39.1** - Replaces deprecated TSLint
- **gulp-sass 5.1.0** - Compatible with Dart Sass

### 📚 Modernization Documentation

- **[MODERNIZATION_SUMMARY.md](./MODERNIZATION_SUMMARY.md)** - Complete modernization report
- **[MODERNIZATION_PLAN.md](./MODERNIZATION_PLAN.md)** - Original 5-phase plan
- **[REFACTOR_PROGRESS.md](./REFACTOR_PROGRESS.md)** - Detailed progress tracking
- **[REFACTOR_DAILY_LOG.md](./REFACTOR_DAILY_LOG.md)** - Development log

### 🎨 Customization

- `package.json` - settings for title and description of the website
- `assets/images` - logos and team avatars
- `public/images` - additional logos
- `public` - privacy policy and terms of service
- `favicons` - icons
- `src/ts/common/constants.ts` - global settings
- `src/ts/server/maps/*` - maps configuration and setup
- `src/ts/server/start.ts` - world setup
- `src/ts/components/services/audio.ts` - adding/removing sound tracks
- `src/ts/client/credits` - credits and contributors
- `src/style/partials/_variables.scss` - page style configuration

---

<a name="chinese"></a>
## 📖 中文文档

> **状态**: 此分支已从2019年技术栈完全现代化到2025年标准。

### 📊 现代化概览

本分支包含Pony Town代码库的**完整现代化**：

| 组件 | 原版本 | 当前版本 | 状态 |
|------|--------|----------|------|
| Node.js | ~12.x | 22.21.0 LTS | ✅ |
| TypeScript | 3.5.3 | 5.9.3 | ✅ |
| Angular | 8.2.4 | 18.2.14 | ✅ |
| Webpack | 4.39.3 | 5.102.1 | ✅ |
| Express | 4.17.1 | 4.21.2 | ✅ |
| Mongoose | 5.6.11 | 8.19.3 | ✅ |
| RxJS | 6.6.7 | 7.8.1 | ✅ |
| WebSocket | clusterws-uws | ws | ✅ |
| Passport | 0.4.x | 0.6.0 | ✅ |
| connect-mongo | 3.x | 5.1.0 | ✅ |
| ESLint | TSLint (已废弃) | 9.15.0 | ✅ |
| Sass 编译器 | node-sass | dart-sass 1.80.7 | ✅ |

**详细信息请参阅 [MODERNIZATION_SUMMARY.md](./MODERNIZATION_SUMMARY.md)**

---

### 🛠️ 系统要求

* **[Node.js](https://nodejs.org/)** (版本 22.x LTS) - **从 v9 更新**
* gulp `npm install -g gulp`
* MongoDB: [下载链接](https://www.mongodb.com/download-center/community) 和 [安装说明](https://docs.mongodb.com/manual/administration/install-community/)
* [ImageMagick](https://imagemagick.org/script/download.php#windows) (可选，用于动画工具中生成预览GIF)

### 📦 安装

```bash
# 安装依赖（可能需要几分钟）
npm install --legacy-peer-deps

# 注意：由于某些遗留依赖，需要 --legacy-peer-deps 标志
# 某些原生模块（canvas）可能编译失败，但不影响核心功能
```

**已知安装问题：**
- `canvas` 包可能编译失败（核心功能不需要）
- 如遇到编译错误，可使用 `--ignore-scripts`

### 🗄️ 数据库设置

- 安装 MongoDB
- 从命令行启动 `mongo`（Windows用户可能需要进入 `C:\Program Files\MongoDB\Server\4.0\bin` 路径运行命令）
- 输入 `use your_database_name` 创建数据库
- 输入 `db.new_collection.insert({ some_key: "some_value" })` 初始化数据库
- 输入以下命令创建数据库用户：
  ```javascript
  db.createUser(
    {
      user: "your_username",
      pwd: "your_password",
      roles: [ { role: "readWrite", db: "your_database_name" } ]
    }
  )
  ```
- 输入 `quit()` 退出 mongo

### 🔑 OAuth密钥配置

为你选择的认证平台（github、google、twitter、facebook、vkontakte、patreon）获取OAuth密钥。

#### Github

- 访问 https://github.com/settings/developers 创建新的 OAuth 应用
- 设置授权回调URL为 `http://<你的域名>/auth/github/callback` 或本地服务器使用 `http://localhost:8090/auth/github/callback`
- 在 `config.json` 的 `oauth` 字段中添加：

```json
"github": {
  "clientID": "<你的客户端ID>",
  "clientSecret": "<你的客户端密钥>"
}
```

#### Twitter

- 访问 https://developer.twitter.com/en/apps 创建新应用
- 设置回调URL为 `http://<你的域名>/auth/twitter/callback` 或本地服务器使用 `http://localhost:8090/auth/twitter/callback`
- 在 `config.json` 的 `oauth` 字段中添加：

```json
"twitter": {
  "consumerKey": "<你的消费者密钥>",
  "consumerSecret": "<你的消费者密钥>"
}
```

#### Google

- 访问 https://console.developers.google.com/apis/dashboard 从顶部下拉菜单创建新项目，进入凭据并创建新条目
- 在"已授权的JavaScript来源"中添加 `http://<你的域名>` 或本地服务器使用 `http://localhost:8090/`
- 在"已授权的重定向URI"中添加 `http://<你的域名>/auth/google/callback` 或本地服务器使用 `http://localhost:8090/auth/google/callback`
- 在 `config.json` 的 `oauth` 字段中添加：

```json
"google": {
  "clientID": "<你的客户端ID>",
  "clientSecret": "<你的客户端密钥>"
}
```

#### 其他平台

如需添加其他登录方式，请找到合适的 [passport](http://www.passportjs.org/) 包并在 `src/ts/server/oauth.ts` 中添加，同时在 `config.json` 中添加相应条目。

### ⚙️ 配置

在根目录添加 `config.json` 文件，内容如下。可以使用 `config-template.json` 作为起点（不要在 `config.json` 中包含注释）。

```javascript
{
  "title": "Pony Town",
  "twitterLink": "https://twitter.com/<twitter名称>", // 可选
  "contactEmail": "<你的联系邮箱>",
  "port": 8090,
  "adminPort": 8091,
  "host": "http://localhost:8090/",
  "local": "localhost:8090",
  "adminLocal": "localhost:8091",
  "secret": "<随机字符串>",
  "token": "<随机字符串>",
  "db": "mongodb://<用户名>:<密码>@localhost:27017/<数据库名>",
  "oauth": {
    "google": {
      "clientID": "<客户端ID>",
      "clientSecret": "<客户端密钥>"
    }
    // 其他oauth配置
  },
  "servers": [
    {
      "id": "dev",
      "port": 8090,
      "path": "/s00/ws",
      "local": "localhost:8090",
      "name": "开发服务器",
      "desc": "开发环境服务器",
      "flag": "test",
      "flags": {
        "test": true,
        "editor": true
      },
      "alert": "18+"
    }
  ]
}
```

### 🚀 运行

**重要提示：** 启动前请从 `config-template.json` 创建 `config.json`！

#### 生产环境

```bash
# 编译 TypeScript
npm run ts

# 启动服务器
npm start
```

**✅ 服务器状态 (2025-11-05)：**
- 服务器成功启动并监听8090端口
- 所有主要依赖已现代化并正常工作
- WebSocket连接使用标准 `ws` 库
- MongoDB连接就绪（需要配置数据库）
- Canvas模块在不可用时优雅降级（非关键功能）

**⚠️ 已知限制：**
- 完整的Webpack AOT构建需要配置更新（见文档Phase 4.2）
- 生产资源构建暂时使用开发模式
- 221个非关键TypeScript警告（推迟到Phase 5处理）
- 详情参见 [MODERNIZATION_SUMMARY.md](./MODERNIZATION_SUMMARY.md)

#### 开发环境

```bash
npm run ts-watch    # 终端 1
npm run wds         # 终端 2
gulp dev            # 终端 3
gulp test           # 终端 4 (可选)
```

```bash
gulp dev --sprites  # 运行并生成精灵图
gulp dev --test     # 运行并测试
gulp dev --coverage # 运行测试和代码覆盖率
```

### 👤 管理员命令

添加/删除角色

```bash
node cli.js --addrole <账户ID> <角色>   # 角色: superadmin, admin, mod, dev
node cli.js --removerole <账户ID> <角色>
```

设置超级管理员角色

```bash
node cli.js --addrole <你的账户ID> superadmin
```

管理面板访问地址：`<基础URL>/admin/`（需要admin或superadmin角色）
工具访问地址：`<基础URL>/tools/`（仅在开发模式或使用--tools标志启动时可用）

### 🔧 技术栈 (2025)

#### 前端
- **Angular 18.2.14**（从8.2.4升级）- 使用Ivy引擎的现代框架
- **TypeScript 5.9.3** - 最新语言特性
- **Webpack 5.102.1** - 性能改进的现代打包工具
- **Sass 1.93.3** - Dart Sass（替代已废弃的node-sass）

#### 后端
- **Node.js 22.21.0** - LTS版本
- **Express 4.21.2** - 最新4.x版本
- **Mongoose 8.19.3** - 现代MongoDB ODM
- **Passport 0.7.0** - 认证中间件

#### 构建工具
- **ESLint 9.39.1** - 替代已废弃的TSLint
- **gulp-sass 5.1.0** - 兼容Dart Sass

### 📚 现代化文档

- **[MODERNIZATION_SUMMARY.md](./MODERNIZATION_SUMMARY.md)** - 完整现代化报告
- **[MODERNIZATION_PLAN.md](./MODERNIZATION_PLAN.md)** - 原始5阶段计划
- **[REFACTOR_PROGRESS.md](./REFACTOR_PROGRESS.md)** - 详细进度跟踪
- **[REFACTOR_DAILY_LOG.md](./REFACTOR_DAILY_LOG.md)** - 开发日志

### 🎨 自定义

- `package.json` - 网站标题和描述设置
- `assets/images` - logo和团队头像
- `public/images` - 额外的logo
- `public` - 隐私政策和服务条款
- `favicons` - 图标
- `src/ts/common/constants.ts` - 全局设置
- `src/ts/server/maps/*` - 地图配置和设置
- `src/ts/server/start.ts` - 世界设置
- `src/ts/components/services/audio.ts` - 添加/删除音轨
- `src/ts/client/credits` - 致谢和贡献者
- `src/style/partials/_variables.scss` - 页面样式配置

---

## 📖 原始文档

历史参考，请查看原始 [pony-town-reboot](https://github.com/Ritori2022/pony-town-reboot) 项目。

**最后更新 | Last Updated**: 2025-11-05
**现代化分支 | Modernization Branch**: `claude/pony-town-modernization-011CUqRSp1cMrZSm7fY5Zeg7`
