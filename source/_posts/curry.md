---
title: 什么是柯里化？
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
柯里化（英语：Currying），把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

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

### 

## 参考地址
https://zh.wikipedia.org/wiki/%E6%9F%AF%E9%87%8C%E5%8C%96

> 文章可随意转载，请保留此 [原文链接](https://www.unclay.com/2018/12/11/code-review/)
