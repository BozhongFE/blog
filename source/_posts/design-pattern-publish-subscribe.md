---
title: 设计模式之发布订阅模式
date: 2018-06-07
tags: javascript
---

发布订阅模式是最常用的一种观察者模式的实现，并且从解耦和重用角度来看，更优于典型的观察者模式;
常用场景：div绑定click事件（js和dom之前的实现）
<!--more-->

## 什么是观察者模式

定义对象间一种一对多的依赖关系，使得每当一个对象改变状态，则所有依赖于它的对象都会得到通知并被自动更新。
https://en.wikipedia.org/wiki/Observer_pattern
Subject: 目标对象（一般拥有三个功能：`新增观察者`，`删除观察者`，`通知观察者`）
Observer：观察者（用于接收通知并处理各自业务）
```
───────────  Fire Event    ────────────
│         │ ────────────>  │          │
│ Subject │                │ Observer │
│         │ <────────────  │          │
───────────   Subscribe    ────────────
```

## 什么是发布订阅模式

是一种消息传播模式（事件驱动模式），发布者和订阅者之间多了一个调度中心，用于接口发布者的发布事件，同时向订阅者发布事件；而订阅者需要从调度中心订阅事件

```
───────────            ──────────  Fire Event   ────────────
│         │  Publish   │        │ ────────────> │          │
│Publisher│ ─────────> │Dispatch│               │Subscriber│
│         │            │ Center │ <──────────── │          │
───────────            ──────────   Subscribe   ────────────
```

### 观察者模式实例

目标对象天气预报，观察者电视台，电视台从天气预报处订阅天气

```js
const weather = new WeatherSubject();

const tv1 = new TVObserver('广州电视台');
weather.subscribeTV(tv1);

const tv2 = new TVObserver('北京电视台');
weather.subscribeTV(tv2);

// 第一天
setTimeout(() => {
  weather.notify('广东台风来了，即将登陆珠海');
}, 1000);

// 第二天
setTimeout(() => {
  weather.notify('广东台风来了，即将登陆广州');
}, 3000);

/*
广州电视台 广东台风来了，即将登陆珠海
北京电视台 广东台风来了，即将登陆珠海

广州电视台 广东台风来了，即将登陆广州
北京电视台 广东台风来了，即将登陆广州
*/
```

##### 天气预报目标对象
```js
class WeatherSubject {
  constructor() {
    this.observerList = [];
  }
  subscribeTV(observer) {
    this.observerList.push(observer);
  }
  unsubscribeTV(observer) {
    // ...
  }
  // fire event
  notify(data) {
    for (const observer of this.observerList) {
      observer.watcher(data);
    }
  }
}
```

##### 电视台观察者

```js
class TVObserver {
  constructor(name) {
    this.name = name;
  }
  // subscribe
  watcher(weather) {
    console.log(this.name, weather);
  }
}
```

### 发布订阅模式实例

发布者天气预报，订阅者电视台，订阅者向调度中心订阅事件，发布者向调度中心发布事件并调度相关的订阅事件

```js
const weather = new WeatherPublish();

const dispatchCenter = new TVDispatchCenter();

dispatchCenter.subscribe('广州电视台', (name, weather) => {
  console.log(name, weather, '广州提醒');
});

dispatchCenter.subscribe('北京电视台', (name, weather) => {
  console.log(name, weather, '北京提醒');
});

// 第一天
setTimeout(() => {
  weather.notify('广东台风来了，即将登陆珠海', (weather) => {
    dispatchCenter.notify(weather);
  });
}, 1000);

// 第二天
setTimeout(() => {
  weather.notify('广东台风来了，即将登陆广州', (weather) => {
    dispatchCenter.notify(weather);
  });
}, 3000);

/*
广州电视台 广东台风来了，即将登陆珠海 广州提醒
北京电视台 广东台风来了，即将登陆珠海 北京提醒

广州电视台 广东台风来了，即将登陆广州 广州提醒
北京电视台 广东台风来了，即将登陆广州 北京提醒
*/
```

##### 天气预报发布者

```js
class WeatherPublish {
  // publish event
  notify(weather, dispatchHandler) {
    dispatchHandler(weather);
  }
}
```

##### 电视台调度中心

```js
class TVDispatchCenter {
  constructor() {
    this.tv = {};
  }
  subscribe(name, handler) {
    this.tv[name] = this.tv[name] || [];
    this.tv[name].push(handler);
  }
  // fire event
  notify(data) {
    for (const name in this.tv) {
      const handlers = this.tv[name];
      for (const handler of handlers) {
        handler(name, data);
      }
    }
  }
}
```

## 参考

[JavaScript设计模式与开发实践](https://book.douban.com/subject/26382780/)
[观察者模式和发布订阅模式有什么不同？](https://www.zhihu.com/question/23486749)
[观察者模式与发布/订阅模式区别](https://www.cnblogs.com/lovesong/p/5272752.html)
[观察者模式和“发布-订阅”模式有区别吗？](https://www.sohu.com/a/207062452_464084)
[23种设计模式总结](https://www.cnblogs.com/tongkey/p/7170826.html)