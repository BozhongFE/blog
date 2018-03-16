---
title: Puppeteer 入门
date: 2018-03-16
tags: 
 - javascript
---

某一天，我在一个微信群里看到有人在讨论如何自动填写第三方网站的表单。  
然后有人推荐用 Puppeteer。我没听说过这个东西，所以就去查了一下和大概看了下它的 API 并运行了一些 Demo。  
这里简单梳理一下 Puppeteer 的相关知识。

<!-- more -->

## Puppeteer 是什么？

> Puppeteer 是一个 Node.js 库。它通过浏览器的 DevTools 协议，提供一些高级的 API 去控制无界面（headless）的 Chrome 或者 Chromium 以实现各种功能。它也能被配置成一个完整的 Chrome 或 Chromium。

Puppeteer 的 Github 项目地址：https://github.com/GoogleChrome/puppeteer

## Puppeteer 能做什么？

- 生成页面截图或 PDF；
- 爬取 SPA （单页应用）的数据并生成预渲染页面；
- 自动提交表单、UI 自动化测试和模拟键盘输入等等；
- 创建一个最新的自动化测试环境。使用最新的 JavaScript 和浏览器特性，直接在最新版本的 Chrome 中运行测试。
- 捕捉你网站的数据加载过程，帮助诊断性能问题。

## 入门

### 安装

```shell
npm i --save puppeteer
# or "yarn add puppeteer"
```

需要注意的是，在安装 puppeteer 的时候，会下载一个最新版本的 Chromeium 以保证 API 的正常使用。最新的 Windows 版本大小在 120Mb 左右。  
不过也可以通过配置跳过 Chromium 下载这一步。具体看 [Environment variables](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#environment-variables)

### 使用

> 注意：使用 Puppeteer 最少需要 Node v6.4.0 版本。为了使用 async/await 特性，建议使用 Node v7.6.0 或更高版本。

**基本操作**

```javascript
const puppeteer = require('puppeteer');

(async () => {
  // 启动浏览器
  const browser = await puppeteer.launch({
    // 这里关闭 headless 模式，启动时会打开 Chromium。方便我们查看执行过程。
    headless: false,
  });
  // 打开一个新的空白页面
  const page = await browser.newPage();

  // 设置窗口大小，不设置的话，默认是 800x600
  await page.setViewport({
    width: 1920,
    height: 1080,
  });

  // 进行其他操作
  // ...

  // 关闭页面
  await browser.close();
})();
```

**打开某一个网站**

```javascript
await page.goto('https://www.jd.com', {
  // 配置项
  waitUntil: 'networkidle0', // 在网络空闲时，也就是没有正在请求的链接时，继续执行
});
```

**生成截图**

```javascript
await page.screenshot({
  path: 'jd.png', // 在根目录下生成一张截图
  fullPage: true // 默认只截取第一屏的页面，设置 fullPage 后可以截取整一个页面
});
```

**保存为 PDF**

```javascript
// 保存为 A4 纸张大小的 PDF 文件。
await page.pdf({
  path: 'jd.pdf',
  format: 'A4'
});
```

**执行脚本**

```javascript
// 获取页面窗口信息
const dimensions = await page.evaluate(() => {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    deviceScaleFactor: window.devicePixelRatio
  };
});

console.log('Dimensions:', dimensions);

// 获取 body 里面的 HTML 代码
// 查询 body 元素并创建 bodyHandle
const bodyHandle = await page.$('body');
// 把 bodyHandle 作为参数传入 evaluate
const html = await page.evaluate(body => body.innerHTML, bodyHandle);
// 销毁 bodyHandle
await bodyHandle.dispose();

console.log('HTML:', html);
```

这里的 `page.$` 类似于 `document.querySelector`，而 `page.$$` 对应 `document.querySelectorAll`。

**自动提交表单**

打开京东首页，输入搜索关键词，回车进行搜索

```javascript
// 地址栏输入网址
await page.goto('https://www.jd.com/', {
  waitUntil: 'networkidle0', // 等待网络状态为空闲的时候才继续执行
});

// 将输入焦点定位到搜索框，然后输入关键字
// await page.click('#key');
await page.focus('#key');
await page.keyword.type('Javascript高级程序设计', {
  delay: 100, // 控制每个字母输入的间隔时间
});

// 输入搜索关键字。
await page.type('#key', 'Javascript高级程序设计', {
  delay: 100, 
});
// 上面两种输入关键字的方法任选一种即可。

// 回车
await page.keyboard.press('Enter');
```

**模拟移动端设备**

```javascript
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];
puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.emulate(iPhone);
  await page.goto('https://m.jd.com');
  // other actions...
  await browser.close();
});
```

[DeviceDescriptors](https://github.com/GoogleChrome/puppeteer/blob/master/DeviceDescriptors.js) 是 puppeteer 自带的移动端设备配置，里面包含了常见的移动设备。

## 参考资料

1. [Puppeteer README.md](https://github.com/GoogleChrome/puppeteer)
2. [无头浏览器 Puppeteer 初探](https://github.com/ProtoTeam/blog/blob/master/201710/2.md)