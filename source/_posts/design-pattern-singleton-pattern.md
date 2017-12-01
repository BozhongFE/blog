---
title: 设计模式之单例模式
date: 2017-12-08
tags:
---

单例模式，就是保证一个类只有一个实例, 并提供一个访问它的全局访问点。
<!--more-->

## 介绍

单例模式，保证一个类只有一个实例。
例如：登录弹窗

有时候只有一个对象也是单例模式。
例如：全局window对象


## 非单例模式

### 直接返回对象（私有成员和方法）

```js
var SingleTon = function () {
  // 私有变量和方法
  var _name = 'Tom';
  function _getRealName() {
    console.log(_name);
  }
  // 公有变量和方法（可以访问私有变量和方法）
  return {
    getRealName: function () {
      _getRealName();
    },
    setRealName: function (val) {
      _name = val;
    },
    name: 'Jack',
  };
};
var singleton = SingleTon();
var singleton1 = SingleTon();
singleton.getRealName(); // Tom
console.log(singleton.name); // Jack
console.log(singleton === singleton2); // false
```

### 链式模式

```js
var SingleTon = function () {
  this.name = 'Jack';
  this.age = 0;
  return this;
}
SingleTon.prototype = {
  setName: function (val) {
    this.name = val;
    return this;
  },
  setAge: function (val) {
    this.age = val;
    return this;
  },
  show: function () {
    console.log(this.name, this.age);
    return this;
  }
}
var singleton = new SingleTon();
var singleton2 = new SingleTon();
singleton.setName('new Jack1').setAge(1).show(); // new Jack1 1
singleton2.setName('new Jack2').setAge(2).show(); // new Jack2 2
console.log(singleton === singleton2); // false
```

## 单例模式

### 直接返回对象

唯一变量：重写构造函数，形成闭包变量

```js
var SingleTon = function () {
  var instance = {
    name: 'Jack',
    getName: function () {
      console.log(instance.name);
    }
  };
  SingleTon = function () {
    return instance;
  }
  return instance;
}
var singleton = SingleTon();
var singleton2 = SingleTon();
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


### 重写构造指针

唯一变量：重写构造函数，形成闭包变量

```js
var SingleTon = function () {
  var instance;
  SingleTon = function () {
    return instance;
  }
  SingleTon.prototype = this;
  instance = new SingleTon();
  instance.constructor = SingleTon;
  instance.name = 'Jack';
  instance.getName = function () {
    console.log(instance.name);
  }
  return instance;
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