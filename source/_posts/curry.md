---
title: 什么是函数柯里化？
date: 2019.03.21
tags:
 - javascript
categories:
 - 算法
---

实现这么一个函数，使之都能返回结果 10
```js
add(1)(2,3)(4);
add(1)(2)(3)(4);
add(1,2,3,4);
```
<!--more-->

## 什么是柯里化
柯里化（英语：Currying），把接受多个参数的函数变换成接受一个单一参数的函数。

## 柯里化过程

+ 正常版本
```js
function add(x, y, z) {
  return x + y + z;
}
add(1, 2, 3);
```

+ 柯里化版本1
```js
function add(x, y) {
  return function(z) {
    return x + y + z;
  }
}
add(1, 2)(3);
```


+ 柯里化版本2
```js
function add(x) {
  return function(y) {
    return function(z) {
      return x + y + z;
    }
  }
}
add(1)(2)(3);
```

+ ES6柯里化版
```js
const add = (x) => (y) => (z) => (x + y + z);
add(1)(2)(3);
```

## 应用场景

### 统计需求

例如基于百度统计，对网页进行百度点击统计

```js
_hmt.push(['_trackEvent', '网易云音乐', '主导航栏', '发现音乐', 1]);
_hmt.push(['_trackEvent', '网易云音乐', '主导航栏', '我的音乐', 1]);

_hmt.push(['_trackEvent', '网易云音乐', '推荐专区', '摇滚', 1]);
_hmt.push(['_trackEvent', '网易云音乐', '推荐专区', '流行', 1]);
```

柯里化统计过程
```js
const hmt = (x) => (y, z) => _hmt.push(['_trackEvent', x, y, z, 1]);
const hmtMusic163 = hmt('网易云音乐');

hmtMusic163('主导航栏', '发现音乐');
hmtMusic163('主导航栏', '我的音乐');

hmtMusic163('推荐专区', '摇滚');
hmtMusic163('推荐专区', '流行');

// hmt('网易云音乐')('主导航栏')('发现音乐');
```

### 接口请求

通过 GET/POST 方式向接口提交数据发起请求[代码](https://github.com/BozhongFE/bz-axios/blob/master/src/api/module/request.js)
```js
// from bz-axios/src/api/module/request.js
_axiosProxy(type = 'get', url, config = {}, axiosConfig = {}) {}
```

柯里化1：定制统一的接口请求类型，调用不同接口地址获取不同业务数据
```js
const axiosGet = _axiosProxy('get'); // GET方式
axiosGet(urlUser, configUser); // 获取用户信息
axiosGet(urlCommodity, configCommodity); // 获取商品信息
```

柯里化2：定制统一支付函数，调用不同参数支付不同类型东西
```js
const axiosPostPay = _axiosProxy('post', urlPay); // 统一支付
axiosPostPay(configWenda); // 支付问答
axiosPostPay(configCommodity); // 支付商品

for (...) {
  (function() {
    var upload_id = ....
    ....
  }());
}
```

## 实现一个加法函数

```js
add(1)(2,3)(4);
add(1)(2)(3)(4);
add(1,2,3,4);
add(1,2,3,4)();
```

### 分析

+ 每次执行完返回一个函数
+ 没有参数调用时，需要自定义隐式转换类型

### 柯里化
```js
function add(...args) {
  function handler(...handlerArgs) {
    if (arguments.length === 0) {
      return handler.valueOf();
    }
    args = args.concat(handlerArgs);
    return handler;
  }
  handler.valueOf = function () {
    return args.reduce((total, num) => total + num, 0);
  };
  return handler;
}
```

## 思考

### 高阶函数基于柯里化扩展

```js
[1, 2, 3, 4].reduce(add);
[1, 2, 3, 4].map(add);
```

### 实现一个柯里化初始化函数

```js
const add = () => {};
const divide = () => {};

const curry = () => {};

const curryAdd = curry(add);
const curryDivide = curry(divide);

curryAdd(1)(2)(3); // 6
curryDivide(20)(2)(5); // 2
```

## 常见作用

+ 参数复用
+ 延迟计算/运行
+ 提前返回

## 考虑的问题

+ 存取 arguments 通常比存取命名参数要慢一点
+ 大量嵌套作用域和闭包函数，会消耗内存和速度

## 参考地址

[维基百科 - 柯里化](https://zh.wikipedia.org/wiki/%E6%9F%AF%E9%87%8C%E5%8C%96)
[JS中的柯里化(currying)](https://www.zhangxinxu.com/wordpress/2013/02/js-currying/)  
