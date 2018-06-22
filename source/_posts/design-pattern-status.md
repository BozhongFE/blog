---
title: 设计模式之状态模式
date: 2018-06-22
tags: javascript
---

在我们开始使用VUEJ框架后，通过改变数据来显示页面信息或模块的不同状态，是我们现在开发中最常见的场景，如果项目中不用vuejs这类MVVM框架的情况下，又该如何来显示对应页面信息或模块的不同状态？

<!--more-->

比如一个下拉功能： 打开/关闭

使用if else 判断

```js
var state = 'close'; //关闭
if( state === 'close') {
	state = 'opne'; //打开
} else {
	state = 'close'; //关闭
}
```

比如一个红绿灯程序的执行，功能： 第1次红色，第2次绿色， 第3次黄色，


```js
var btn = docuemnt.getElementById('button');
var state = 'red';
btn.onClick = function() {   
    if(state === 'red') {
    	state = 'green';
      console.log(‘执行红灯时的行为’)
    } else if(state === 'green') {
    	state = 'yellow';
      console.log(‘执行绿灯时的行为’)
    } else if(state === 'yellow') {
    	state = 'red';
      console.log(‘执行黄灯时的行为’)
    }
}
```
当出现大量分支条件时，使用 if else 或 switch case 语句就会变得难以阅读和维护

## 状态模式

定义 ：允许一个对象在其内部状态改变时改变它的行为，对象看起来似乎修改了它的类。

本质 ：根据状态来分离和选择行为

角色：
+ Context： 环境，也称上下文，通常用来定义客户感兴趣的接口，同时维护一个具体处理当前状态的实例对象。

+ State:状态接口，用来封装与上下文的一个特定状态所对应的行为。

+ ConcreteState： 具体实现状态处理的类，每个类实现一个跟上下文相关的状态的具体处理。

    <img src="/img/design-pattern-status/design-pattern-status.jpg">

应用场景：

1.一个对象的行为取决于它的状态，并且它必须在运行时刻根据状态改变它的行为。
2.一个操作中含有庞大的分支结构，并且这些分支决定于对象的状态。

用设计模式实现的红绿灯程序

```js
var btn = document.getElementById('button');
var Light = function() {

    // 在Light类中为每个状态类都创建一个状态对象，这样就可以很明显的看到有多少个状态，并且这些状态对象都持有对象引用
    this.lightRed = new LightRed(this);  
    this.lightGreen = new LightGreen(this);
    this.lightYellow = new LightYellow(this);
}

Light.prototype.init = function(){
    var self = this;
    this.curState = this.lightRed; //默认红灯
    btn.onclick= function(){
        //通过setState将请求委托为当前的状态去执行
        self.curState.change();
    }
}
// 状态对象通过setState的方法来切换light对象的状态。 
Light.prototype.setState = function( newState ){
    this.curState = newState;
};
// 定义各种状态
var LightRed = function(light) {
    this.light = light;
}

LightRed.prototype.change = function(){
    console.log( '红灯' );
    this.light.setState(this.light.lightYellow);
}

var LightYellow= function(light) {
    this.light = light;
}

LightYellow.prototype.change = function(){
    console.log( '黄灯' );
    this.light.setState(this.light.lightGreen);
}

var LightGreen = function(light) {  
    this.light = light;
}

LightGreen.prototype.change = function(){
    console.log( '绿灯' );
    this.light.setState(this.light.lightRed);
}

var light = new Light();

light.init();

```

## 有限状态机

定义 ：有限状态自动机,简称状态机，是表示有限个状态以及在这些状态之间的转移和动作等行为的数学模型
 
特性：
+ 有限的state
+ 可以从一种state转移另一种state
+ 同一时间只能处于一种state

用有限状态机实现的红绿灯程序

```js
var btn = document.getElementById('button');
var Light = function(){};
Light.prototype.init = function(){
    var self = this;
    this.curState = FSM.lightRed; // 默认红灯
    btn.onclick = function(){
        self.curState.change.call( self ); // 把请求委托给 FSM 状态机
    }
};
var FSM = {
    lightRed: {
        change: function(){
            console.log( '红灯' );
            this.curState = FSM.lightYellow;
        }
    },
    lightYellow: {
        change: function(){
            console.log( '黄灯' );
            this.curState = FSM.lightGreen;
        }
    },
    lightGreen: {
        change: function(){
            console.log( '绿灯' );
            this.curState = FSM.lightRed;
        }
    }
};
var light = new Light();
light.init();
```

## 参考
[JavaScript设计模式与开发实践](https://book.douban.com/subject/26382780/)
[js之状态模式](https://blog.csdn.net/linhongyong/article/details/53435035)
[状态机](https://github.com/jakesgordon/javascript-state-machine)