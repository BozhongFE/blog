---
title: Proxy
date: 2018-01-26
tags: javascript
---
### 概述
Proxy是程序开发中一种常见的设计模式。这种类型的代理和ES6 proxy要做的就很类似了，涉及到使用类(B)去包装类(A)并拦截/控制对(A)的访问。
当你想进行以下操作时proxy模式通常会很有用：
+ 拦截或控制对某个对象的访问
+ 通过隐藏事务或辅助逻辑来减小方法/类的复杂性
+ 防止在未经验证/准备的情况下执行重度依赖资源的操作
<!--more-->
Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程。

Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。

### ES6中的Proxy
Proxy构造器可以在全局对象上访问到。通过它，你可以有效的拦截针对对象的各种操作，收集访问的信息，并按你的意愿返回任何值。从这个角度来说，proxy和中间件有很多相似之处。

具体来说，proxy允许你拦截许多对象上常用的方法和属性，最常见的有get，set，ownKeys, has，apply。关于使用proxy可以拦截的方法的完整列表，请[参考规范](http://www.ecma-international.org/ecma-262/6.0/#sec-proxy-object-internal-methods-and-internal-slots)。Proxy还可以配置成随时停止接受请求，有效的取消所有针对被代理的目标对象的访问。

### Proxy的实现
```javascript
var target = {};
var handler = {};
var proxy = new Proxy(target, handler);

proxy.name = "proxy";
console.log(proxy.name);        // "proxy"
console.log(target.name);       // "proxy"

target.name = "target";
console.log(proxy.name);        // "target"
console.log(target.name);       // "target"
```
proxy将所有操作直接转发到目标。当"proxy"分配给proxy.name属性，target.name就创建了。代理本身并不存储此属性；它只是将操作转发到目标同样，proxy.name以及target.name是相同的，因为它们都是引用target.name。这也意味着设置target.name一个新的值，proxy.name将反映出相同的变化。
handler是一个空对象，没有任何拦截效果，访问proxy就等同于访问target。

### get方法
```javascript
//定义一个对象person
var person = {"name":"张飞"};
//创建一个代理对象proxy，代理person的读写操作
var proxy = new Proxy(person,{
  get:function(target,property){
    return "赵云"
  }
});

proxy.name;//赵云
```
先定义一个对象，含有name属性，值为“张飞”,创建一个代理对象proxy，对象person的操作都交给代理对象proxy，如果你要读取person对象的name属性，就要用proxy.name，而不是person的name。我们看到的结果是：“赵云”，而不是person对象重点张飞，因为代理过程中，get方法实现了拦截的作用，不管你读取什么属性，我都返回“赵云”。

### set方法
通过设置set“拦截器”，我们可以在设置值之前添加自定义验证。 如果该值不符合验证，我们可以抛出一个错误！
```javascript
//定义一个对象，含有RMB和dollar属性值
var cash = {"RMB":2000,"dollar":0};
//创建一个Proxy代理实例
var account = new Proxy(cash,{
  //编写get处理程序
  get:function(target, property){
    //判断余额是否大于0
    if(target[property] > 0){
      //有余额，就返回余额值
      return target[property];
    }else{
      //没钱了
      return "余额不足";
    }    
  },
  //编写set处理程序
  set:function(target,property,value){
    //存入的数额必须是一个数字类型
    if(!Number.isInteger(value)){
      return "请设置正确的数值";
    }
    //修改属性的值
    target[property] = value;
  }
});
account.RMB;
//结果：2000
account.dollar;
//结果：余额不足

//修改dollar属性的值，值是字符串类型
account.dollar = "五百";
account.dollar;
//结果：余额不足
//修改dollar属性的值，值是数字类型
account.dollar = 500;
account.dollar;
//结果：500

```
### ownKeys方法
ownKeys方法用来拦截对象自身属性的读取操作。具体来说，拦截以下操作。
```javascript
//定义一个对象serve，有三个属性
let serve = {"name":"抽血","price":400,"need":"空腹"};

//创建一个代理对象
let proxy = new Proxy(serve,{
  //ownKeys过滤对对象的属性遍历
  ownKeys:function(target){
    return ["name","price"]
  }
});

Object.keys(serve);
//结果：["name", "price","need"]

Object.keys(proxy);
//结果：["name", "price"]
```
### has方法
has方法用来拦截HasProperty操作，即判断对象是否具有某个属性时，这个方法会生效。
```javascript
var goods = {
  "name":"大米",
  "weight":30
};

var proxy = new Proxy(goods, {
  has: function(target, prop) {
    if(target[prop] === undefined){
      return false;
    }else{
      return true;
    }
  }
});

"name" in proxy;//结果：true
"height" in proxy;//结果：false

```
### apply()方法
除了对象类型的变量可以被代理，函数也可以被代理。如果被代理的变量是一个函数，那么还会支持一个拦截程序：apply调用。
apply方法拦截函数的调用、call和apply操作。
apply方法可以接受三个参数，分别是目标对象、目标对象的上下文对象（this）和目标对象的参数数组。
```javascript
//创建一个函数fn
let fn = function(){
  alert('这是在app');
};
//创建一个代理实例，代理函数fn
let proxy = new Proxy(fn,{
  apply:function(){
    alert('这是在微信');
  }
});
proxy();//结果：这是在微信
```

### 参考及应用
[ECMAScript 6 入门(第三版)-阮一峰](http://es6.ruanyifeng.com/)
[Understanding ECMAScript 6](https://leanpub.com/understandinges6/read#)
[Javascript Proxy对象 简介](http://www.zcfy.cc/article/an-intro-to-javascript-proxy-objects-camp-vanilla)
[探索两种优雅的表单验证——策略设计模式和ES6的Proxy代理模式](https://github.com/jawil/blog/issues/19)
[6种ES6 proxies的使用案例](http://www.zcfy.cc/article/6-compelling-use-cases-for-es6-proxies-888.html)