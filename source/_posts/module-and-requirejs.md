---
title: 模块 与 requirejs
date: 2017-09-14 17:43:17
tags:
  Javascript相关
---

### 模块

  模块是一种将系统分离成独立功能部分的方法，严格定义模块接口、模块间具有透明性,对外导出一些公用API，比如函数，类，属性，方法

<!--more-->

  ![module-and-requirejs](/img/module-and-requirejs/img.jpg)


## 模块的特性

  * 可维护性 灵活架构，焦点分离 方便模块间组合、分解 ，单个模块功能调试、升级 ，多人协作互不干扰 
  * 命名空间 通过命名空间，能极大缓解命名冲突，避免命名空间污染
  * 可复用性 更高效的满足更多的个性化需求

## 模块的模式

  模块模式一般用来模拟类的概念,把公有和私有方法还有变量存储在一个对象中,在公开调用API的同时，仍然在一个闭包范围内封装私有变量和方法。

  模块模式常见形式如下
    1. 匿名闭包函数
    2. 全局引入
    3. 模块出口
    4. 高级模式
    5. 扩充
    6. 松耦合扩充
    7. 紧耦合扩充
    8. 克隆和继承
    9. 跨文件私有状态
  现在，通行的Javascript模块规范主要有两种：CommonJS和AMD。

  * commonjs  是服务器端模块的规范，同步加载，因为在服务器读取模块都是在本地磁盘，加载速度很快，如果是在客户端（浏览器），同步加载模块的时候有可能会出现“假死”状况，NodeJS应用了这个规范

  * AMD 即 (Asynchronous Module Definition)，它采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行，requireJs应用了这个规范.

  ![module-and-requirejs](/img/module-and-requirejs/AMD.png)

 ### requireJs

  RequireJS是一个工具库，主要用于客户端的模块管理。它可以让客户端的代码分成一个个模块，实现异步或动态加载，按需、并行、延时载入js库，避免网页失去响应，从而提高代码的性能和可维护性。

 ## requireJs 配置
    * config
      常见配置
      -baseUrl 所有模块的查找根路径
      -paths 指定各个模块的加载路径
      -shim 为那些没有使用define()来声明依赖关系、设置模块的"浏览器全局变量注入"型脚本做依赖和导出配置。 兼容不符合AMD规范的模块加载  

      [查看更多配置项](https://segmentfault.com/a/1190000002403806);
   
 ## requireJs 引用

  data-main 属性是requireJS的入口文件路径

  ``` html
  <script data-main="js/main" src="./js/require.js" type="text/javascript"></script> 
  ```
 ## define 定义模块
  1.独立模块
    ``` javascript
      define(function () {
          return {
              method1: function() {},
              method2: function() {},
          };
      });
    ```
  2.非独立模块
    ``` javascript
      define(['module1', 'module2'], function(m1, m2) {
          return {
              method: function() {
                  m1.methodA();
                  m2.methodB();
              }
          };
      });

    ```
  ## require 模块加载及使用

    * 模块加载的相对路径的规则:
      1.没有指定data-main属性时，以该JS文件所在路径为根路径
      2.有指定 data-main 属性时，则以data-main属性引入的所在路径为根路径
      3.如有配置config中的baseUrl属性，则以baseUrl为根路径

    * 使用
    ``` javascript
      requirejs(['a','b'], function(a,b) {
       var module = {
         module1 : function(){

         },
         module2 : {

         }
       }
        return module;
      });

    ```
     ![module-and-requirejs](/img/module-and-requirejs/load.png)
**********************************************************
**** END ****


**********************************************************

### 参考文档

[模块模式](https://www.oschina.net/translate/javascript-module-pattern-in-depth);
[requirejs](http://requirejs.org/docs/api.html);
