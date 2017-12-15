---
title: Vue脚手架模拟接口数据
date: 2017-12-15
tags:
 - javascript
 - vue
---

开发前期，接口未开发完，可以自己模拟数据或者接口代理
<!-- more -->

## 初始化项目

```bash
vue init webpack dev-server
```

## 脚手架自带静态服务器

http://localhost:8080/README.md
http://localhost:8080/package.json
http://localhost:8080/src/main.js

通过自带的静态服务器，我们可以自定义自己的json接口数据

例如：
http://localhost:8080/src/json/list.json
http://localhost:8080/src/json/home.json

## 插件式数据

```js
// build/webpack.dev.conf.js
{
  plugins: [
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'api/package.json',
      template: 'package.json',
      inject: false
    }),
  ]
}
```

## 自定义服务器

引入express，自定义带逻辑的接口数据

### 初始化服务器配置

```bash
npm install expresss --save-dev
```

创建服务器脚本文件
```js
// build/dev-server.js
const express = require('express');
const app = new express();

// 跨域处理
app.use(function (req, res, next) {
  req.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.get('/list.json', function (req, res, next) {
  const list = [
    {
      name: '章三',
      age: 11,
    }
  ];
  res.json({
    error_code: 0,
    data: {
      total: 30,
      list: list,
    },
  });
});

// api not found.
app.all('*', function (req, res) {
  res.json({
    error_code: 1000,
    error_message: 'api not found.',
  })
});

app.listen(8081, function () {
  console.log('listen to 8081');
});
```

访问http://localhost:8081/list.json得到

```js
{
  error_code: 0,
  data: {
    total: 30,
    list: [
      {
        name: '章三',
        age: 11,
      }
    ],
  }
}
```

访问未知的http://localhost:8081/abc.json得到

```js
{
  error_code: 1000,
  error_message: 'api not found.'
}
```

把原来的服务器地址代理到此新服务器

```js
// config/index.js
module.exports = {
  dev: {
    proxyTable: {
      '/proxy': {
        target: 'http://127.0.0.1:8081',
        pathRewrite: {
          '^/proxy' : '/'
        },
        secure: false,
      }
    },
  }
}
```

地址变成
http://localhost:8080/proxy/list.json
http://localhost:8080/proxy/abc.json

### 动态接口数据

首先定义个js文件，js处理逻辑数据后输出

```js
// build/data/list.js
module.exports = {
  get: function (options = {}) {
    const page = options.page || 1;
    const limit = options.limit || 1;
    return {
      error_code: 0,
      data: {
        total: 30,
        list: [
          {
            name: '章三',
            age: 31,
          }
        ]
      }
    }
  }
}
```

静态js的请求处理

```js
// build/dev-server.js
const filejsList = reuqire('./data/list.js');
app.get('/filejs/list.json', function (req, res, next) {
  res.json(filejsList.get());
});
```

动态js请求处理  
require后的数据存于内存中，无论怎么改js文件，获取的数据都是从内存中读取，需要动态更新内存中的js

```js
// 动态更新内存中的js
const load = function(path){
  if(require.resolve(path)){
    delete require.cache[require.resolve(path)];
    filejsList = require(path);
  }
};
let filejsList;
load('./data/list');
app.get('/filejs/list.json', function (req, res, next) {
  // 每次都重新读取js文件（热更新）
  load('./data/list');
  res.json(filejsList.get());
});
```

最后访问地址
http://localhost:8080/proxy/filejs/list.json

## 参考地址

+ Express
http://www.expressjs.com.cn/starter/hello-world.html
+ Demo
https://github.com/unclay/vue-demo/tree/master/dev-server
