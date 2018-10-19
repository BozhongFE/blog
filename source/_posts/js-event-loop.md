---
title: Javascript执行机制-Event Loop（一）
date: 2018-09-26 14:37:06
tags:
 - javascript
---

> JavaScript 的一个非常有趣的特性是事件循环模型，与许多其他语言不同，它永不阻塞。

*注:本篇暂不研究 `node` 下的 `Event Loop`*

<!-- more -->

### 单线程的Javascript

  作为浏览器脚本语言，Javascript主要用途是与用户互动以及操作DOM，为了避免复杂的同步问题，从一诞生，JavaScript就是单线程，这已经成了这门语言的核心特征，将来也不会改变。

  为了利用多核CPU的计算能力，HTML5提出Web Worker标准，允许JavaScript在主线程上创建worker线程，但是子线程完全受主线程控制，且不得操作DOM。所以，这个新标准并没有改变JavaScript单线程的本质。


### 小测试

  思考下边的代码运行顺序：
  
  ```js
  console.log(1);

  setTimeout(() => {
    console.log(2);
  }, 0);

  Promise.resolve().then(() => {
    console.log(3);
  }).then(() => {
    console.log(4);
  })

  console.log(5);
  ```

  分析:
  * 排除异步代码，先执行同步代码
  * setTimeout和Promise是否有优先级？还是看执行顺序
  * Promise多级then是否会被插入setTimeout
  

  结果: <span style="padding: 10px; color:#fff">1 5 3 4 2</span>

### 事件循环(Event Loop)

  Javascript中却有着无处不在的**异步**概念，这的异步并非类似多线程的编程模式，而是依靠JS的运行核心-**事件循环(Event Loop)**来实现。

 `Event Loop`由HTML Standard定义的，定义了浏览器何时进行渲染更新，了解它有助于性能优化。

  > 为了协调事件，用户交互，脚本，渲染，网络等，用户代理必须使用本节所述的event loop。
  > --- HTML Standard


  ![eventloop](/img/js-event-loop/eventloop.png)

  **基础概念**：

  * 事件队列(queue)

    > 存储着待执行任务的队列，其中的任务严格按照时间先后顺序执行，排在队头的任务将会率先执行，而排在队尾的任务会最后执行。

  * 执行栈(stack)

    > 执行栈则是一个类似于函数调用栈的运行容器，当执行栈为空时，Javascript引擎便检查事件队列，如果不为空的话，事件队列便将第一个任务压入执行栈中运行。

  * 异步任务
  
    > 不同的API注册的异步任务会依次进入自身对应的队列中，然后等待Event Loop将它们依次压入执行栈中执行。

    * 宏任务(task/macroTask)

      > 一个event loop有一个或者多个Tasks队列。
      > 每一个task都来源于指定的任务源，比如可以为鼠标、键盘事件提供一个Tasks队列，其他事件又是一个单独的队列。

      * 整体代码
      * setTimeout
      * setInterval
      * setImmediate
      * I/O
      * UI rendering
      * ...

    * 微任务(microtask)

      > 一个event loop都有且仅有一个microTasks队列。

      * process.nextTick
      * promises
      * Object.observe
      * MutationObserver
      * ...


  **最基本的Event Loop流程：**
  
  * 开始 event-loop
  * 微任务(microtask) 队列开始清空，执行
  * 检查 宏任务(task) 是否清空，有则跳到下一步，无则跳到最后一步
  * 从 宏任务(task)队列 抽取一个任务，执行
  * 检查 微任务(microtask) 是否清空，若有则跳到第三步，无则跳到第四步
  * 结束 event-loop

  ![流程](https://user-gold-cdn.xitu.io/2017/11/21/15fdcea13361a1ec?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


### 待续...

### 参考资料

* [这一次，彻底弄懂 JavaScript 执行机制](https://juejin.im/post/59e85eebf265da430d571f89)
* [Event Loop的规范和实现](https://juejin.im/post/5a6155126fb9a01cb64edb45)
* [从event loop规范探究javaScript异步及浏览器更新渲染时机](https://github.com/aooy/blog/issues/5)
* [深入理解 JavaScript 事件循环（一）— event loop](https://www.cnblogs.com/dong-xu/p/7000163.html)
* [并发模型与事件循环](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop)
* [理解event loop（浏览器环境与nodejs环境）](https://juejin.im/post/5baf37835188255c6c624d38?utm_medium=hao.caibaojian.com&utm_source=hao.caibaojian.com)