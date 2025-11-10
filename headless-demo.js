#!/usr/bin/env node
/**
 * Pony Town - 无头浏览器截图脚本
 * 用于在无GUI环境中截取游戏界面
 */

const fs = require('fs');
const http = require('http');

console.log('🎮 Pony Town 无头截图工具');
console.log('=====================================');
console.log('');

// 检查服务器是否运行
function checkServer(port) {
    return new Promise((resolve) => {
        const req = http.get(`http://localhost:${port}/api/state`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({ running: res.statusCode === 200, data });
            });
        });
        req.on('error', () => resolve({ running: false }));
        req.setTimeout(2000, () => {
            req.destroy();
            resolve({ running: false });
        });
    });
}

// 创建简单的HTML截图页面
function createDemoPage() {
    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pony Town - 游戏预览</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
        }
        h1 {
            font-size: 48px;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        .logo {
            margin: 20px 0;
        }
        .status {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .feature {
            background: rgba(255,255,255,0.2);
            padding: 20px;
            border-radius: 10px;
        }
        .pony {
            width: 150px;
            height: 150px;
            margin: 20px auto;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 60px;
        }
        .note {
            margin-top: 30px;
            padding: 15px;
            background: rgba(0,0,0,0.3);
            border-radius: 5px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🐴 Pony Town Custom Server</h1>

        <div class="logo">
            <img src="/assets/images/logo.png" alt="Pony Town Logo" onerror="this.style.display='none'">
        </div>

        <div class="status">
            <h2>🎮 游戏服务器</h2>
            <p id="server-status">检查中...</p>
            <p id="server-info"></p>
        </div>

        <div class="pony">🦄</div>

        <div class="features">
            <div class="feature">
                <h3>🎨 自定义角色</h3>
                <p>创建你独特的小马外观</p>
            </div>
            <div class="feature">
                <h3>🗺️ 探索世界</h3>
                <p>多个地图等待探索</p>
            </div>
            <div class="feature">
                <h3>💬 社交互动</h3>
                <p>实时聊天和好友系统</p>
            </div>
            <div class="feature">
                <h3>🎭 表情动作</h3>
                <p>丰富的表情和动作</p>
            </div>
        </div>

        <div class="note">
            <strong>📝 开发模式启动说明：</strong><br>
            • 运行 <code>node pony-town.js --login --admin --game --local</code><br>
            • 访问 <a href="http://localhost:8090" style="color: #fff">http://localhost:8090</a><br>
            • 使用 /local?username=&lt;id&gt; 登录（开发模式）
        </div>
    </div>

    <script>
        // 检查服务器状态
        fetch('/api/state')
            .then(res => res.json())
            .then(data => {
                document.getElementById('server-status').innerHTML = '✅ 服务器运行中';
                document.getElementById('server-info').innerHTML =
                    \`在线玩家: \${data.online || 0} | 服务器: \${data.id || 'dev'}\`;
            })
            .catch(() => {
                document.getElementById('server-status').innerHTML = '❌ 服务器未运行';
                document.getElementById('server-info').innerHTML =
                    '请先启动服务器: node pony-town.js --login --admin --game --local';
            });
    </script>
</body>
</html>
    `;

    return html;
}

async function main() {
    console.log('📡 检查游戏服务器状态...');
    const status = await checkServer(8090);

    if (status.running) {
        console.log('✅ 游戏服务器正在运行！');
        console.log('📊 服务器信息:', status.data);
        console.log('');
        console.log('🌐 访问地址: http://localhost:8090');
    } else {
        console.log('❌ 游戏服务器未运行');
        console.log('');
        console.log('💡 启动命令:');
        console.log('   node pony-town.js --login --admin --game --local');
    }

    // 创建预览页面
    console.log('');
    console.log('📄 创建预览页面...');
    const html = createDemoPage();
    fs.writeFileSync('preview.html', html);
    console.log('✅ 预览页面已创建: preview.html');
    console.log('');
    console.log('🖼️  如需截图，请使用:');
    console.log('   • Puppeteer: 需要安装 chromium');
    console.log('   • Playwright: npm install -D @playwright/test');
    console.log('   • 或在浏览器中打开 preview.html');
}

main().catch(console.error);
