---
title: require.js 的一些常见问题
date: 2017-09-22
tags:
 - javascript
---

# require.js 的一些常见问题

这篇文章，主要是写 `require.js` 在使用过程中的一些常见的问题。  
部分问题会结合源代码进行分析说明。

<!-- more -->

### require 和 requirejs 这两个全局函数是完全相同的

阅读 `require.js` 的源代码可以发现。

```javascript
// line 10
var requirejs, require, define;

// line 1864
req = requirejs = function (deps, callback, errback, optional) {
  // ...
}

// line 1821 - 1823
if (!require) {
    require = req;
}
```

加载完 `require.js` 之后，可以执行以下代码简单测试一下：
```javascript
console.log(require === requirejs); // 输出：true
```

### require.config 是可以添加或覆盖原有 config 的

```javascript
// code 1
requirejs.config({
  paths: {
    mod: './mod',
  }
});

// code 2
requirejs.config({
  paths: {
    mod2: './mod2',
  }
});

// code 3
requirejs.config({
  paths: {
    mod: './mod2',
  }
});
```

同时执行 code 1 和 code 2，那么 mod 和 mod2 都有效。  
同时执行 code 1 和 code 3 的话，那么最后一个 mod 有效。  

具体实现逻辑可以看下 `require.js` 的源代码 1282 行的 `configure` 函数。


### 符合某些规则的依赖模块名，会忽略 paths 和 baseUrl 的配置

```javascript
require.config({
  baseUrl: './js',
  paths: {
    mod: '../modules',
  },
});

require(['mod/main.js', 'http://example.com/test', 'mod/main?a=1', '/mod/main']);
```

上面四种模块名，会忽略配置。具体可以看下源代码：
```javascript
// line 1644 - 1649
if (req.jsExtRegExp.test(moduleName)) {
  //Just a plain path, not module name lookup, so just return it.
  //Add extension if it is included. This is a bit wonky, only non-.js things pass
  //an extension, this method probably needs to be reworked.
  url = moduleName + (ext || '');
}

// line 1828
req.jsExtRegExp = /^\/|:|\?|\.js$/;
```
上面正则匹配的是，以 `/` 开头，或中间有 `:` 或 `?`，或以 `.js` 结尾的字符串。  
匹配成功的话，则直接 url 等于你传入的模块名，如果没有后缀再加一个后缀。  
不会去处理其他设置（baseUrl 和 paths）的规则。


### 依赖模块的加载和执行顺序是不确定的

如下两个模块，代码执行的先后顺序是不确定的。
```javascript
// moduleA.js
define(function () {
  console.log('moduleA');
});

// moduleB.js
define(function () {
  console.log('moduleB');
});

// main.js
define(['moduleA.js', 'moduleB.js'], function () {
  console.log('main');
});
```
多刷新几次可以发现，moduleA 和 moduleB 的输出顺序是不确定的。


### 依赖模块什么情况下会重复加载

```javascript
// moduleA.js
define(function () {
  console.log('moduleA');
});

// moduleB.js
define(['moduleA'], function () {
  console.log('moduleB');
});

// main.js
define(['moduleA', 'moduleB'], function () {
  console.log('main');
});
```
这种写法，最后 `moduleA.js` 只会加载一次，**不会**重复加载。  
但是需要注意的是，依赖的模块名必须一样，有没有后缀必须统一。  
如下这种写法，一个有后缀，一个没有后缀。**会**导致重复加载。

```javascript
// moduleA.js
define(function () {
  console.log('moduleA');
});

// moduleB.js
define(['moduleA'], function () {
  console.log('moduleB');
});

// main.js
// 注意这里的后缀
define(['moduleA.js', 'moduleB'], function () {
  console.log('main');
});
``` 

### 模块内如何正确的使用 require 函数

```javascript
// 错误的加载方式
define(function () {
  // 没有注入 require 函数时，默认使用的是全局注册的 require 函数。
  // 这种带中括号的加载方式，不能正确返回模块对象。只能以回调的方式拿到模块对象。
  // require() 返回的是一个函数，具体可以看 require.js 源代码 1764 行到 1798 行。
  var wx = require(['https://res.wx.qq.com/open/js/jweixin-1.2.0.js']);
  var fn = require();

  console.log(wx === fn); // 输出：true
});

// 正确的加载方式
define(function () {
  require(['https://res.wx.qq.com/open/js/jweixin-1.2.0.js'], function (wx) {
    console.log(wx);
  });
});

// 更好的加载方式
define(function (require) {
  var wx = require('https://res.wx.qq.com/open/js/jweixin-1.2.0.js');
  console.log(wx);
});

// 或者
define(['https://res.wx.qq.com/open/js/jweixin-1.2.0.js'], function (wx) {
  console.log(wx);
});
```

但是需要注意的是，最后两种方式的写法不能混着用。也就是前置依赖和 `require` 不能混用。  
具体可以查看源代码 2080 行：

```javascript
// line 2080
if (!deps && isFunction(callback)) {
  deps = [];
  //Remove comments from the callback string,
  //look for require calls, and pull them into the dependencies,
  //but only if there are function args.
  if (callback.length) {
  // 后面省略...
```
使用 `require` 的前提是没有前置依赖，并且函数参数要大于 0。


### 依赖模块代码总是在其他代码之前加载

```javascript
// moduleA.js
define(function () {
  console.log('moduleA');
});

// moduleB.js
define(function () {
  console.log('moduleB');
});

// 依赖模块总是会被优先加载。
define(function (require) {
  console.log('main');
  var A = require('moduleA');
  var B = require('moduleB');
});

// 这部分代码等同于
define(function (require) {
  var A, B;
  var tempA = require('moduleA');
  var tempB = require('moduleB');
  console.log('main');
  A = tempA;
  B = tempB;
});

// 最后输出：（模块 A 和 B 的输出顺序不确定）
// moduleA
// moduleB
// main
```

---
相关链接：

require.js 源代码：https://github.com/requirejs/requirejs
