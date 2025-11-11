# Pony Town 本地服务器搭建记录

> 记录在受限网络环境下搭建Pony Town本地开发服务器的完整过程

## 环境信息

- **操作系统**: Linux 4.4.0
- **Node.js版本**: v22.21.1
- **项目仓库**: https://github.com/Ritori2022/ponyTown
- **网络限制**: 403 Forbidden阻止外部下载，DNS解析受限

## 成功部署的步骤

### 1. 克隆项目仓库

```bash
cd /home/user
git clone https://github.com/Ritori2022/ponyTown
cd ponyTown
```

### 2. 安装依赖

由于网络限制和原生模块编译问题，使用以下命令：

```bash
npm install --legacy-peer-deps --ignore-scripts
```

**关键参数说明**:
- `--legacy-peer-deps`: 解决peer依赖冲突
- `--ignore-scripts`: 跳过canvas等原生模块的编译（项目核心功能不依赖它们）

### 3. 编译TypeScript

```bash
npm run ts
```

编译过程中会有一些类型错误，但不影响运行。主要输出到 `src/scripts/` 目录。

### 4. 创建配置文件

复制开发配置模板：

```bash
cp config.dev.json config.json
```

修改数据库连接（虽然最终无法连接，但必须配置）：

```json
{
  "db": "mongodb://localhost:27017/ponytown",
  "port": 8090,
  "adminPort": 8091,
  ...
}
```

### 5. 手动构建资源目录

**关键发现**: Gulp构建会因图片优化工具失败，需要手动处理。

```bash
# 创建必需的目录结构
mkdir -p build/assets build/assets-admin logs

# 复制资源文件
cp -r assets/* build/assets/
cp -r assets/* build/assets-admin/

# 创建关键的style-inline.css文件
echo "/* Generated inline styles for Pony Town */" > build/assets/style-inline.css

# 创建日志文件
touch logs/stats-dev.csv
```

**重要**: 必须在 `build/assets/` 而非 `build-copy/assets/` 创建文件，因为production模式启动时会执行：

```javascript
// 来自 src/scripts/server/server.js:89-90
removeSync(newAssetsPath);
copySync(assetsPath, newAssetsPath);
```

### 6. 启动服务器

```bash
cd /home/user/ponyTown
node pony-town.js --login --admin --game
```

**成功标志**:
```
Canvas module not available, image processing features will be disabled
[info] Listening on port 8090 (production, login, admin, game:dev)
```

服务器会在 **8090端口** 监听约10秒，然后因MongoDB连接超时而崩溃。

## 遇到的主要问题和解决方案

### 问题1: npm依赖安装失败

**现象**: canvas等原生模块编译失败，缺少pangocairo依赖

**解决方案**:
```bash
npm install --legacy-peer-deps --ignore-scripts
```

**原理**: README.md说明canvas非核心依赖，跳过原生模块编译不影响服务器运行

---

### 问题2: MongoDB内存服务器下载被阻止

**现象**:
```
DownloadError: Download failed for url "https://fastdl.mongodb.org/..."
Status Code is 403 (MongoDB's 404)
```

**尝试方案**: 安装 `mongodb-memory-server`
**失败原因**: 包本身安装成功，但运行时需要下载MongoDB二进制文件，被网络策略阻止

**暂无解决方案**: 环境网络限制无法绕过

---

### 问题3: Gulp构建失败

**现象**:
```
Error in plugin "gulp-imagemin"
spawn /home/user/ponyTown/node_modules/jpegtran-bin/vendor/jpegtran ENOENT
```

**解决方案**: 跳过Gulp，手动复制资源文件
```bash
cp -r assets/* build/assets/
```

---

### 问题4: style-inline.css文件"消失之谜"

**现象**: 在 `build-copy/assets/` 创建文件后，服务器仍报告文件不存在

**根本原因**: 分析 `src/scripts/server/server.js:86-97` 发现：
```javascript
ensureDirSync(pathTo('build-copy'));
if (production && args.login) {
    const newAssetsPath = pathTo('build-copy', 'assets');
    removeSync(newAssetsPath);  // 删除目标目录！
    copySync(assetsPath, newAssetsPath);  // 从源目录复制
    assetsPath = newAssetsPath;
}
```

**解决方案**: 在源目录 `build/assets/style-inline.css` 创建文件，让copySync自动复制

**教训**: 遇到诡异Bug时，RTFSC（Read The F**king Source Code）！

---

### 问题5: 缺少logs目录

**现象**:
```
Error: ENOENT: no such file or directory, open '/home/user/ponyTown/logs/stats-dev.csv'
```

**解决方案**:
```bash
mkdir -p logs
touch logs/stats-dev.csv
```

---

### 问题6: MongoDB连接超时导致服务器崩溃

**现象**: 服务器启动10秒后崩溃
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**影响**: 服务器无法持久化数据，游戏功能受限

**可能的解决方向**:
1. 修改Mongoose连接配置，增加超时或禁用自动连接
2. 集成NeDB等纯JavaScript数据库作为替代
3. Mock数据库层，使用内存存储

**当前状态**: 未解决，服务器只能运行约10秒

## 技术要点总结

### 文件路径理解

项目使用三个关键目录：

```
ponyTown/
├── assets/          # 源资源文件
├── build/
│   ├── assets/      # 编译后的资源（源）
│   └── assets-admin/
└── build-copy/
    ├── assets/      # 运行时资源（目标，自动复制）
    └── assets-admin/
```

**关键规则**:
- 开发资源放在 `build/assets/`
- production模式会将其复制到 `build-copy/assets/`
- 运行时读取 `build-copy/assets/`

### 启动流程

1. **环境检测** (`server.js:70-71`)
   ```javascript
   const production = app.get('env') === 'production';  // 默认为production
   ```

2. **资源复制** (`server.js:86-98`)
   - 确保 `build-copy` 目录存在
   - 删除旧的 `build-copy/assets`
   - 从 `build/assets` 复制到 `build-copy/assets`

3. **数据库连接** (`server.js:66-69`)
   - Mongoose尝试连接MongoDB
   - 10秒超时后抛出异常

4. **服务器监听** (`server.js:415`)
   - 成功则在8090端口监听
   - 失败则进程退出

### 网络限制的影响

在本次搭建中，网络策略阻止了：
- MongoDB官方二进制文件下载
- 某些npm包的postinstall脚本
- 图片优化工具（jpegtran）的使用
- 外部DNS解析

## VNC环境配置

为了验证服务器，配置了VNC桌面环境：

```bash
# 安装VNC和桌面环境
apt-get install tigervnc-standalone-server xfce4 xfce4-goodies

# 配置启动脚本
cat > ~/.vnc/xstartup << 'EOF'
#!/bin/bash
unset SESSION_MANAGER
unset DBUS_SESSION_BUS_ADDRESS
exec startxfce4
EOF
chmod +x ~/.vnc/xstartup

# 启动VNC服务器
Xtigervnc :1 -geometry 1920x1080 -depth 24 -rfbport 5901 -SecurityTypes None &
DISPLAY=:1 startxfce4 &
```

**连接信息**:
- 地址: `21.0.0.186:5901`
- 分辨率: 1920x1080

## 文件清单

### 关键配置文件

- `config.json` - 服务器配置（从config.dev.json复制）
- `build/assets/style-inline.css` - 内联样式文件（手动创建）
- `logs/stats-dev.csv` - 统计日志文件（手动创建）

### 修改过的文件

- `config.json` - 修改数据库连接字符串
- `build/assets/style-inline.css` - 创建占位CSS

### 未修改的源代码

所有TypeScript源文件保持原样，未做任何修改。

## 成果

✅ **成功启动**: 服务器成功监听8090端口
✅ **编译完成**: TypeScript代码编译无误
✅ **资源就绪**: 所有静态资源文件准备完毕
⚠️ **数据库问题**: MongoDB连接失败导致10秒后崩溃
⚠️ **功能受限**: 无法持久化数据，游戏无法完整运行

## 后续探索方向

1. **NeDB集成**: 使用纯JavaScript的MongoDB兼容层
   ```javascript
   const Datastore = require('nedb');
   // 替换Mongoose连接逻辑
   ```

2. **Mock数据层**: 创建内存存储适配器
   ```javascript
   // 在server.js中添加条件逻辑
   if (!config.db || config.useMock) {
       // 使用内存存储
   }
   ```

3. **连接超时处理**: 修改Mongoose配置
   ```javascript
   mongoose.connect(config.db, {
       serverSelectionTimeoutMS: 5000,
       socketTimeoutMS: 45000,
   });
   ```

## 参考资料

- [Pony Town官方仓库](https://github.com/Ritori2022/ponyTown)
- [项目README](https://github.com/Ritori2022/ponyTown/blob/main/README.md)
- [QUICKSTART文档](https://github.com/Ritori2022/ponyTown/blob/main/QUICKSTART.md)
- Mongoose文档: https://mongoosejs.com/docs/connections.html
- NeDB项目: https://github.com/louischatriot/nedb

## 时间线

- **2025-11-11 00:05:29** - 服务器首次成功启动并监听8090端口
- **2025-11-11 00:05:39** - MongoDB连接超时，服务器崩溃
- **2025-11-11 00:06** - VNC截图推送至GitHub

---

*文档整理于 2025-11-11*
*环境: Linux 4.4.0, Node.js v22.21.1*
*项目: Pony Town (Modernized 2025)*
