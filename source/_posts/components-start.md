---
title: 组件从零开始
date: 2017-09-20
tags:
 - tutorial
 - components
---

## 思考需求

### 需求效果
+ 服务器端加载
+ 浏览器端加载（requirejs）

<!--more-->

### 加载方式
```js
// server
const bzLogin = require('bz-login');

// client-html
require(['mod/bz-login/0.1.0/bz-login'], function (bzLogin) {
}
  
// client-js
define(function (require, exports, module) {
  var bzLogin = require('mod/bz-login/0.1.0/bz-login');
  var bzShare = require('mod/bz-share/0.1.0/bz-share-debug');
});
```

### 从新开始

基础骨架搭建

#### 初始化配置

```bash
$ npm init
```

创建package配置包，同时定义打包脚本npm run build
```json
// package.json
{
  "name": "bz-login",
  "version": "0.1.0",
  "description": "播种网登录模块",
  "main": "index.js",
  "scripts": {
    "build": "node ./build/build.js"
  },
  "author": "Garwi",
  "license": "MIT"
}
```

#### 目录

创建构建脚本目录build，以及源文件目录src

```directory
﹀ project
  ﹥ build
      build.js
  ﹥ src
      index.js
     package.json
     README.md
```

#### 源码开发

实际的业务逻辑开发，这里不一一列举

```js
// src/index.js
function afterAppLogin () {
  // login
}
export default {
  afterAppLogin,
  afterAllLogin,
  isApp,
  isAndroidApp,
  isIosApp,
  getLink,
};
```

#### 代码检查

开发完通过攻击检查代码，安装eslint，同时配置npm run eslint脚本
```js
// package.json
{
  "name": "bz-login",
  "scripts": {
    "build": "node ./build/build.js",
    "lint": "eslint ./src/index.js"
  },
  "devDependencies": {
    "eslint": "^4.5.0",
    "eslint-config-airbnb-base": "^11.3.2",
    "eslint-plugin-import": "^2.7.0",
  }
}
```

```js
// .eslintrc
{
  "extends": "airbnb-base",
  "rules": {
    "no-console": 0,
    "no-alert": 0,
    "no-unused-expressions": [2, {
      "allowShortCircuit": true
    }],
    "no-underscore-dangle": 0
  },
  "globals": {
    "$": true,
    "window": true,
    "document": true
  }
}
```

#### 打包压缩

工具库选型，需要自己更加实际项目去寻找各个各样的工具库
+ rollup 打包（vue）
+ uglify-js 代码压缩
+ zlib 文件压缩

#### 简化入库步骤

打包完成后，需要手动复制打包完的文件到对应的版本库目录，繁琐无意义的操作。  
优化：打包时自动打包到版本库目录（前提需要指定版本库目录）

```bash
$ npm config set bz-mod 'D:\source'
$ npm run build
```

需要配置bz-mod目录才能执行打包命令
```js
// build/config.js
let modulePath = process.env.npm_config_bz_mod;
if (typeof modulePath === 'undefined') {
  console.log('请先配置模块所在目录');
  console.log('Example: npm config set bz-mod "D:\\source"');
  throw new Error('没有配置模块路径');
} else if (!exists(modulePath)) {
  throw new Error('模块目录不存在，请检查配置的模块目录是否正确');
} else {
  modulePath = path.join(modulePath, name);
  if (!exists(modulePath)) {
    fs.mkdirSync(modulePath);
  }
  
  modulePath = path.join(modulePath, version);
  if (!exists(modulePath)) {
    fs.mkdirSync(modulePath);
  }
}
```

实际打包代码
```js
// build/build.js

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const rollup = require('rollup');
const uglify = require('uglify-js');
const builds = require('./config').getAllBuilds();

build(builds);

function build (builds) {
  let built = 0;
  const total = builds.length;
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++;
      if (built < total) {
        next();
      }
    }).catch(logError);
  };
  next();
}

function buildEntry (config) {
  const isProd = !/debug\.js$/.test(config.output.file);
  return rollup.rollup(config)
    .then(bundle => bundle.generate(config.output))
    .then(({ code }) => {
      if (isProd) {
        var minified = uglify.minify(code).code;
        return write(config.output.file, minified, true);
      } else {
        return write(config.output.file, code);
      }
    });
}

// 输出文件并显示文件大小
function write (dest, code, zip) {
  fs.writeFile(dest, code, err => {
    zlib.gzip(code, (err, zipped) => {});
  });
}
```