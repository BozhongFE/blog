---
title: nodejs学习之路
date: 2017-12-22
tags:
 - javascript
 - node
 - express
---

nodejs可以用来做什么
<!--学习之前我们可以想一想nodejs可以用来做什么-->
<!--more-->

## 可以做什么
<!-- 其实我也不知道能做什么，只能把平时用过的东西拿出来分类一下 -->
+ 工具
> gulp
> webpack
> hexo
> docute

+ 服务
> 福利频道
> 专家在线
> OA系统 + 图书馆
> 么么哒相册后台
> 爬虫

+ 组件&库&框架
> bz-login
> bz-share
> vue
> react
> angular
> weui
> element ui

## 如何入门nodejs

<!--
一开始在想怎么跟大家说下nodejs，于是想了这个题目，但是觉得按照常规来说，感觉太啰嗦也太慢了，所以需要通过娶她方法来学
-->
如何快速入门nodejs（目的）
=> 如何快速使用nodejs做服务项目（方法）
<!--
然后又开始想其他，觉得你们跟你们讲nodejs你们可能没什么用，还不如直接跟你们说怎么做项目
-->

## 项目启动准备

### 框架

+ express（yield: co + thunkify）（入门建议）
+ koa1（yield）
+ koa2（async - await）
+ thinkjs（async - await）（php：mvc）

## 初始化

```js
const express = require('express');
const app = express();
app.use('/', function (req, res) {
  // req = reuest 请求进来的对象
  // res = response 响应请求的对象
  res.send('hello world');
});
app.listen(80);
```

## restful api

### GET

> http://127.0.0.1?a=1&b=2 GET

```js
app.get('/', function (req, res) {
  console.log(req.query); // { a: 1, b: 2}
  res.send('hello world');
});
```

### POST

> http://127.0.0.1 POST c=3, d=4

```js
app.post('/', function (req, res) {
  console.log(req.body); // { c: 3, d: 4}
  res.send('hello world');
});
```

## 中间件

顾名思义，就是中间处理事务的事件
也可以理解为预处理函数
http://www.expressjs.com.cn/guide/using-middleware.html#middleware.built-in

### 典型事例, 登录中间件

```js
url
 ┣ home -> login ? homePage : loginPage
 ┗ list -> login ? listPage : loginPage
```

```js
url
 ┣ login ? next() : loginPage
 ┣ home -> homePage
 ┗ list -> listPage
```

```js
app.use(function (req, res, next) {
  if (req.seesion.user) {
    return next();
  }
  return res.redirect('./login');
});
app.use('/home', function (req, res) {
  res.send('hello home');
});
app.use('/list', function (req, res) {
  res.send('hello list');
});
app.use('/login', function (req, res) {
  res.send('hello login');
});
```


### 静态资源中间件
```js
app.use(express.static(path.join(__dirname, 'public')));
app.use('/home', function (req, res) {
  res.send('hello home');
});
```

### 错误处理中间件
```js
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status);
  if (status === 404 || status === 500) {
    return res.render(`error/${status}`);
  }
  return res.render('error');
});
```


### 常见第三方中间件

+ body-parser

```js
const bodyParser = require('body-parser');

// parse application/json
app.use(bodyParser.json({ limit: '2mb' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));
```

+ cookie-parser

```js
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/', function () {
  app.get('/', function (req, res) {
    console.log('Cookies: ', req.cookies)
  });
});
```

+ serve-favicon

```js
const favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
```

## 常用nodejs模块

+ path

```js
const path = require('path');

// \img\test.gif
path.join('/', 'img', 'test.gif');

// E:\img\test.gif
path.resolve('/', 'img', 'test.gif');
```

+ fs

```js
const fs = require('fs');
fs.readFile
fs.readFileSync

fs.writeFile
fs.writeFileSync

fs.exists
fs.existsSync

fs.stat
fs.statSync
```

## 参考

+ http://www.expressjs.com.cn/resources/middleware.html