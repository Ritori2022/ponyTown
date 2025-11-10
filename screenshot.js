#!/usr/bin/env node
/**
 * 使用Playwright截取游戏预览页面
 */

const fs = require('fs');
const path = require('path');

console.log('📸 Pony Town 截图工具');
console.log('=====================================\n');

async function takeScreenshot() {
    try {
        // 尝试使用playwright
        console.log('📦 加载 Playwright...');
        const { chromium } = require('playwright-core');

        console.log('🚀 启动无头浏览器...');
        const browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        page.setViewportSize({ width: 1280, height: 800 });

        console.log('📄 加载预览页面...');
        const htmlPath = 'file://' + path.resolve('preview.html');
        await page.goto(htmlPath, { waitUntil: 'networkidle' });

        // 等待页面渲染
        await page.waitForTimeout(1000);

        console.log('📸 截取页面截图...');
        await page.screenshot({
            path: 'ponytown-preview.png',
            fullPage: true
        });

        await browser.close();

        console.log('✅ 截图成功！');
        console.log('📁 保存位置: ponytown-preview.png');

        return true;
    } catch (error) {
        console.error('❌ 截图失败:', error.message);
        console.log('');
        console.log('💡 备用方案:');
        console.log('   1. 安装依赖: npm install -D playwright');
        console.log('   2. 安装浏览器: npx playwright install chromium');
        console.log('   3. 重新运行: node screenshot.js');
        return false;
    }
}

takeScreenshot();
