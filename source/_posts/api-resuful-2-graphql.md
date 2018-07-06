---
title: 为什么要用Graphql
date: 2018-07-02
tags:
 - javascript
---

GraphQL是什么？

GraphQL 是专门给API设计的一种查询语言，它并不是一个数据库查询语言，而是你可以用任何其他语言实现的一个用于查询的数据层语言。
<!--more-->

## 前言

API的由来？
什么是RESTFUL API?
<!--说Graphql之前，我们必须先聊聊RESTful API-->

### API的由来？

随着前端（含APP端）的发展，出现前后端分离，API就是为了解决这一问题而生。
由服务端统一提供API接口，哪个平台想使用就各自调用API即可。

好处：安全、分工明确、可复用<!--安全：数据库连接都在服务器端完成--><!--分工明确：后端专注写API、前端专注数据展示--><!--可复用：支持多端使用-->

### RESTFUL API又是什么？

随着用的人越来越多，出现了各种不同的规范，都是API，但却是千差万别，维护难。

+ GET、POST不分
+ url不统一
```
/user/getUser?id=1
/?m=user&a=getUser?id=1
/api/user/getUser?id=1
/?m=api&c=user&a=getUser&id=1
```

所以最后出现了一个行业标准来规范和约束这些东西，所以诞生了RESTFUL API（非强制协议，只是一种规范）

### 名词解析

SOA（Service-Oriented Architecture）面向服务的体系架构，可以定义接口进行通信
ROA（Resource-Oriented Architecture）面向资源的体系架构
API（Application Programming Interface）应用程序接口
REST（Representational State Transfer）表述性状态转移（人话是：URL定位资源，用HTTP动词（GET,POST,DELETE,PUT）描述操作）
RESTFUL 遵守REST规则的web服务

SOA => API => RESTFUL API => ROA

### 问题

#### 越来越臃肿

随着API的发展，返回的字段越来越多，增加网络传输量

#### 一个需求可能需要多次API请求

复杂的业务需求，一个首页可能包含广告、动态导航、列表、推荐、消息流等多个模块数据，需要多次请求数据

#### 数据类型不对

返回的某个字段Array，结果却返回Object

## 为什么要用GraphQL

能解决上面的问题。。

## Graphql简介
Facebook推出的查询语言，12年时已投入使用，在15年开源了。

### GraphQL特性

+ 无冗余数据：自定义自己需要的数据
+ 强类型：确保数据类型格式正确
+ 数据层面语言：不依赖于服务器语言、数据库等（可接入第三方API）

## 核心

+ Query：查询功能（GET）
+ Mutation: 变更功能（POST、PUT、DELETE）
+ Schemas：数据结构模型

## 例子

### js定义Schemas
```javascript
type Query {
  member: User
  users(page: Int, limit: Int): [User]!
}
type User {
  _id: String
  name: String
  card_id: Int
  email: String
  avatar: String
  nickname: String
}
```

### 查询脚本
```javascript
query {
  member {
    _id
    name
  }
  users(limit: 2) {
    name
  }
}
```

### 查询结果
```json
{
  "data": {
    "member": {
      "id": 1,
      "name": "test1"
    },
    "users": [
      {
        "name": "test1"
      },
      {
        "name": "test2"
      }
    ]
  }
}
```

## 对比 REST

GraphQL 简单来说就是：取哪些数据是由client来决定

REST 中，给哪些数据是server决定的，client只能从中挑选
GraphQL 中，client 直接对 server说想要什么数据，server负责精确的返回目标数据

GraphQL自带web调试，含文档，而REST却需要自己定义

## 在线实操

https://developer.github.com/v4/explorer/

## 参考

http://graphql.cn/
https://mp.weixin.qq.com/s/E4eXE_ItG_48jCWU6ibrDg
https://segmentfault.com/a/1190000011263214
http://graphql.cn/learn/best-practices/
http://chuansong.me/n/976771751956

https://blog.csdn.net/redy2/article/details/75040762