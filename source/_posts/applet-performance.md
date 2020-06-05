---
title: applet-performance
date: 2020-06-05
tags:
- applet
---

# 小程序性能优化

## 提高加载性能

#### 1. 进入小程序后发生了什么

![applet-1](img\applet-performance\applet-1.webp)

<!--more-->

- 分为两个阶段

  - 运行环境预加载

    - 运行环境预加载是微信做的，微信会在用户打开小程序之前就已经准备好环境，用户点击小程序入口后，直接下载小程序的代码包

  - 下载代码包启动小程序

    ![applet-2](img\applet-performance\applet-2.webp)

#### 2. 控制包的大小

- 压缩代码,清除无用的代码
- 图片放在cdn
- 采用分包策略
  - 分包
  - 分包预加载
  - 独立分包

#### 3. 对异步请求的优化

- onLoad阶段就可以发起请求
- 特殊的请求结果放在缓存中，下次接着用
- 请求中可以先展示骨架图
- 先反馈，再请求

## 提高渲染性能

#### 1. 了解setData

![applet-3](img\applet-performance\applet-3.webp)

每次调用一次setData，都是逻辑层向渲染层的一次通讯，这个通讯不是直接传给webView，而是通过走native层。

在数据传输时，逻辑层会执行一次`JSON.stringify`来去除掉`setData`数据中不可传输的部分，之后将数据发送给视图层。同时，逻辑层还会将`setData`所设置的数据字段与`data`合并，使开发者可以用`this.data`读取到变更后的数据

#### 2. 减少setData的数据量

如果这个数据不会影响渲染层，则不用放在setData里面

#### 3. 合并setData的请求，减少通讯的次数

#### 4. 列表的局部更新

#### 5. 尽可能使用小程序组件

## 首屏渲染优化

#### 1. 提高首屏数据请求

- 数据预拉取

- 周期性更新

文献：

> https://developers.weixin.qq.com/miniprogram/dev/framework/performance/tips/start.html
>
> https://www.jianshu.com/p/d4fb22509eb9