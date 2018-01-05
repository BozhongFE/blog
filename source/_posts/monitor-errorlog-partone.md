---
title: 前端监控--错误日志(一)
date: 2017-12-29 10:27:55
tags:
 -
---

  > 我们无法保证项目面对成千上万的用户，在各类浏览器下/遇到未知数据时不出问题。对一个拥有大量用户的互联网产品而言，采集到这些数据对所负责的页面进一步的观察监控就非常有必要了。

<!--more-->

---
## 页面常见异常

* HTML标签异常
* CSS展现异常
* 文件请求异常(如样式表/图片/脚本)
* 脚本异常
* 网络环境引起的异常(如网速很慢/运营商强行注入标签脚本)
* 数据请求异常
* ...

涉及用户自身网络环境的异常很难规避。展示上的异常不会影响用户使用。
** 涉及到交互逻辑/数据提交等脚本错误，会立刻终止用户的下一步操作，监控主要抓取的是此类异常。**

---
## 信息采集

设计原则：尽可能多提供错误信息及上下文/兼容多平台/多浏览器。

### 脚本错误

```js
window.onerror = function (message, url, lineNo, columnNo, error) {};
```

* `message {String}` 错误信息，直观的错误描述信息。
* `url {String}` 发生错误对应的脚本路径。
* `lineNo {Number}` 错误发生的行号。
* `columnNo {Number}` 错误发生的列号。
* `error {Object}` 具体的 error 对象，继承自 `window.Error` 的某一类，部分属性和前面几项有重叠，但是包含更加详细的错误调用堆栈信息，这对于定位错误非常有帮助。

* 注意事项
压缩混淆过的脚本错误想深入了解错误信息需使用sourcemap（位置信息文件）。
低版本浏览器只能提供部分信息。
跨域的JS资源需要往资源请求加`Access-Control-Allow-Origin`及标签加`crossorigin`属性才能获取准确信息。

### Ajax上下文

接口请求错误，可采集`XMLHttpRequest`对象的数据，接口返回的数据

### 操作上下文

交互错误，采集如点击类/输入类的信息，如标签/标签内属性/输入值 (类似统计)

### 浏览器数据

userAgent

### 资源加载

对img/link/script等资源的加载错误，给标签添加onerror回调函数，但因各类库有自己加载外部资源的方式，无法全局控制。

### 其他数据(设备信息/环境数据/开发者所需数据/...)

---
## 初试

> mongoose 数据库
接口 (vue模拟)
web页面

![flow-one](/img/monitor-errorlog/flow-one.png)

### 接口dev-server.js

* 连接数据库，写入数据模型

```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://192.168.80.40/test_fe');

// 错误数据模型
const ErrorSchema = new Schema({
  created_at: { type: Number, default: parseInt(new Date().getTime() * 0.001, 10) },
  content: String, // 错误信息
  headers: String, // 请求头部
});
mongoose.model('Error', ErrorSchema);
```

* 接口两个-获取/写入

```js
app.use(function (req, res, next) {
  // 跨域处理
  res.header('Access-Control-Allow-Origin', 'http://fe.office.bzdev.net');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  // 是否为空
  req.empty = (data, type) => {
    if (type === 'date') {
      return !new Date(data).getTime();
    } else if (type === 'timestamp') {
      return !new Date(data * 1000).getTime();
    } else if (type === 'array') {
      return Object.prototype.toString.call(data) !== '[object Array]' ? true :
          data.length === 0 ? true : false;
    } else if (type === 'object') {
      if (Object.prototype.toString.call(data) !== '[object Object]') {
        return true;
      }
      for(var key in data){
        return false;
      }
      return true;
    } else if (type === 'number') {
      return !parseInt(data, 10) || Object.prototype.toString.call(parseInt(data, 10)) !== '[object Number]';
    } else {
      return !data;
    }
  };
  next();
});
// 获取错误日志
app.get('/geterror', function(req, res, next) {

  const body = req.empty(req.body, 'object') ? req.query : req.body;
  // 分页
  const page = body.page ? Number(body.page) : 1;
  const pageSize = body.limit ? Number(body.limit) : 100;
  const start = (page - 1) * pageSize;

  co(function *() {
    const list = yield mongoose.model('Error')
      .find()
      .skip(start)
      .limit(pageSize)
      .sort({created_at: -1})
      .exec();

    res.json({
      error_code: 0,
      data: list,
    })
  }).catch(next)
})
// 写入错误日志
app.get('/seterror', function(req, res, next) {
  const body = req.empty(req.body, 'object') ? req.query : req.body;
  const headers = req.headers;

  const content = body;

  if (JSON.stringify(content) === '{}') return false;

  co(function *() {
    const json = {
      content: JSON.stringify(content),
      headers: JSON.stringify(headers),
      created_at: parseInt(new Date().getTime() * 0.001, 10),
    }

    yield mongoose.model('Error').create(json);

    return res.json({
      error_code: 0,
      data: {}
    })
  }).catch(next);
})

```

### web页面采集脚本

post存在跨域问题，重复请求会被浏览器忽略，可使用图片方式上报信息

```js
new Vue({
  ...
  methods: {
    ...
    postError: function(err) {
     if (!err) return false;

      var image = document.createElement('img');

      var items = [];
      for (var key in err) {
        if (err[key]) items.push(key + '=' + encodeURIComponent(JSON.stringify(err[key])));
      }

      // http://192.168.80.106:8081/seterror 数据采集接口
      image.src = 'http://192.168.80.106:8081/seterror?' + items.join('&');

      // 释放资源
      image.onload = image.onerror = function() {
        image = image.onload = image.onerror =  null;
      }
    }
    ...
  },
  ...
});
```

### 坑
* 数据量大增长快的情况下，不适合用数据库，应改用文本日志，并节流控制数据采样率
* 需考虑url长度限制问题，对上报内容进行筛选处理

### 待续..？
---

## 参考文档

[【第790期】构建可靠的前端异常监控服务-采集篇](https://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ==&mid=2651224516&idx=1&sn=077ef057e4efe325dc426ad0d315b4a7&chksm=bd49a0408a3e295676cff88c0dc304d0d181c3cf910e071ecc9a1868d480a3c473ff21bf7567&scene=21#wechat_redirect "【第790期】构建可靠的前端异常监控服务-采集篇")
[【第833期】如何设计一个前端监控系统](https://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ==&mid=2651225487&idx=1&sn=060f827234606cd3e9a3771d67af4d0f&chksm=bd49a40b8a3e2d1dc9ed064543e236312e99a63e50987ae143012967366a1f691eff67a8ae1b&scene=21#wechat_redirect "【第833期】如何设计一个前端监控系统")
