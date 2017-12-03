---
title: 设计模式之单例模式
date: 2017-12-08
tags:
---

单例模式：保证一个类仅有一个实例，并提供一个访问它的全局访问点.
全局缓存、浏 览器中的 window 对象、登录弹窗
<!--more-->


## 单例模式

### 直接返回对象

唯一变量：重写构造函数，形成闭包变量

```js
var singleTon = function () {
  var instance = {
    name: 'Jack',
    getName: function () {
      console.log(instance.name);
    }
  };
  singleTon = function () {
    return instance;
  }
  return instance;
}
var singleton = singleTon();
var singleton2 = singleTon();
singleton.name = 'new Jack';
singleton2.getName(); // new Jack
console.log(singleton === singleton2); // true
```


### 隐式返回this

唯一变量：写入函数属性

```js
var SingleTon = function () {
  if (SingleTon.instance) {
    return SingleTon.instance;
  }
  this.name = 'Jack';
  this.getName = function () {
    console.log(this.name);
  }
  SingleTon.instance = this;
}
var singleton = new SingleTon();
var singleton2 = new SingleTon();
singleton.name = 'new Jack';
singleton2.getName(); // new Jack
console.log(singleton === singleton2); // true
```


### 重写构造函数

唯一变量：重写构造函数，形成闭包变量

```js
var SingleTon = function () {
  var instance = this;
  SingleTon = function () {
    return instance;
  }
  this.name = 'Jack';
  this.getName = function () {
    console.log(this.name);
  }
}
var singleton = new SingleTon();
var singleton2 = new SingleTon();
singleton.name = 'new Jack';
singleton2.getName(); // new Jack
console.log(singleton === singleton2); // true
```


### 闭包形式

唯一变量：匿名函数，形成闭包变量

```js
var SingleTon;
(function () {
  var instance;
  SingleTon = function () {
    if (instance) return instance;
    instance = this;
    this.name = 'Jack';
    this.getName = function () {
      console.log(this.name);
    }
  }
})();
var singleton = new SingleTon();
var singleton2 = new SingleTon();
singleton.name = 'new Jack';
singleton2.getName(); // new Jack
console.log(singleton === singleton2); // true
```

## 原理

形成唯一变量，实例最后都指向同一变量

## 方式

+ 使用匿名函数，形成闭包变量
+ 重写构造函数，形成闭包变量
+ 写入构造函数属性，形成函数属性变量

## 代理形式实现单例

Q：以上代码不能一目了然，可读性差，可维护性差，可扩展性差
A：分割业务代码和单例代码

+ 单例核心代码

```js
var obj;
if (obj) return obj
obj = xxx;
```

+ 业务代码

```js
var LoginBox = function () {
  this.init();
}
LoginBox.prototype = {
  init: function () {
    this.$box = document.getElementById('LoginBox');
  },
  show: function () {
    this.$box.style.display = 'block';
  }
}
```

+ 单例代码

```js
var proxyLoginBox = (function () {
  var instance;
  return function () {
    if (instance) return instance;
    instance = new LoginBox();
  }
})();
```

+ 调用代码

```js
var loginbox = new proxyLoginBox();
var loginbox2 = new proxyLoginBox();
```

## 参考

[JavaScript设计模式与开发实践](https://book.douban.com/subject/26382780/)