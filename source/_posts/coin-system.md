---
title: 发币系统遇到的问题
date: 2018-08-23
tags:
 - javascript
---

基于 `thinkjs` 提供服务， 前端用 `vuejs`，后端用 `element-ui`
<!--more-->

## 背景

此处忽略10000个字。。。
没有独立的应用服务、没有前端界面、没有后台管理
> 有的只是算法逻辑，及其对应的脚本

## 发展

独立成发币系统

> 放弃express，选了<a href="https://thinkjs.org/" target="_blank">thinkjs</a>搭建服务
> 前端选了vuejs
> 后端选了element-ui

## 竞拍

### 需要考虑的

+ `thinkjs` 处理接口服务，`nginx` 处理静态文件（最好cdn）
+ `应用程序` 和 `数据库服务` 需要分离
+ 缓存服务 `redis` 加速接口请求，分担数据库压力
+ 前端控制重复请求，控制高频率请求、逻辑判断
+ （集群）

## 遇到的坑

### 更新代码后session失效，无限跳登录

用了 `session` 做登录信息处理，用户数据少，所以用了 `session-file` 

> 由于file是写入本地
> hg更新文件后改了文件的所属用户组，导致file写入失败
> 最后登录成功，session写入失败，进行无限跳转登录

解决方法：改成使用数据服务，这里使用 `session-redis` 解决

### 竞拍并发出现同一时间竞拍成功（高并发的数据安全）

同一时间参与竞拍，出现都竞拍成功，可能出现低价是最后出价。

+ 测试工具：window下一款测试接口并发的工具 `apache-jmeter`
+ 接口解决方法：悲观锁、FIFO队列、乐观锁（宽松锁）

##### 悲观锁

悲观锁，也就是在修改数据的时候，采用锁定状态，排斥外部请求的修改。遇到加锁的状态，就必须等待。
![auction1](/img/coin-system/auction1.png)

##### FIFO队列

我们直接将请求放入队列中的，采用FIFO（First Input First Output，先进先出），这样的话，我们就不会导致某些请求永远获取不到锁。
![auction1](/img/coin-system/auction2.png)

##### 乐观锁

乐观锁，是相对于“悲观锁”采用更为宽松的加锁机制，大都是采用带版本号（Version）更新。实现就是，这个数据所有请求都有资格去修改，但会获得一个该数据的版本号，只有版本号符合的才能更新成功，其他的返回失败。
![auction1](/img/coin-system/auction3.png)

### 推送、广播、结算不准时问题

thinkjs自带的定时任务是固定时间的定时任务，而竞拍时间是动态设置的，没法准时设置自己需要的时间
> 早期推送是每一分钟执行一次脚本跑推送
> 而结算是每十分钟执行一次脚本跑结算

解决方法：使用 <a href="https://github.com/node-schedule/node-schedule" target="_blank">node-schedule</a> 动态设置需要的定时任务

### websocket广播的消息出现重复

每当有人竞拍成功后，会发出一条广播，以便竞拍列表显示最新数据。
但有时候客户端的socket脚本回收到两条广播导致数据重复，自己需要过滤重复数据

```js
const schedule = require('node-schedule');
 
const job = schedule.scheduleJob(new Date(), () => {
  console.log('working');
});
// job.cancel();
```
## 参考地址
<a href="https://cnodejs.org/topic/5b58414b8d66b90b2b7384a7" target="_blank">node-schedule有坑？</a>
<a href="https://blog.csdn.net/u012515285/article/details/51395055" target="_blank">秒杀系统架构分析与实践</a>
