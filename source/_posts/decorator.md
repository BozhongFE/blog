---
title: Decorator装饰器
date: 2018-03-23
tags:
- javascript
---

### 什么是装饰器

Decorator就是一种动态地往一个类中添加新的行为的设计模式,它可以在类运行时,扩展一个类的功能.并且去修改类本身的属性和方法.使其可以在不同类之间更灵活的共用一些属性和方法.

装饰器可以说是解决了不同类之间共享方法的问题（可以看做是弥补继承的不足）。
<!--more-->
### ES2016(ES7)中的装饰器(Decorator)
 装饰器接收三个参数，这三个参数和 Object.defineProperty() 基本保持一致，分别表示：

* 需要定义属性的对象 —— 被装饰的类(target)
* 需定义或修改的属性的名字 —— 被装饰的属性名（name）
* 将被定义或修改的属性的描述符 —— 属性的描述对象（property descriptor）

### 关于 Object.defineProperty 
defineProperty 所做的事情就是，为一个对象增加新的属性，或者更改对象某个已存在的属性。调用方式是 Object.defineProperty(obj, prop, descriptor)，这 3 个参数分别代表：

* obj: 目标对象
* prop: 属性名
* descriptor: 针对该属性的描述符

descriptor 参数，它其实也是一个对象，其字段决定了 obj 的prop 属性的一些特性。比如 enumerable 的真假就能决定目标对象是否可枚举（能够在 for…in 循环中遍历到，或者出现在 Object.keys 方法的返回值中），writable 决定目标对象的属性是否可以更改，等等。[详细见这里](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Description)

### Decorator的兼容性
目前ES中Decorator还处于提案阶段,各大浏览器和node,均未公开支持这一特性.
Javascript里的装饰器目前处在建议征集的第二阶段，但在TypeScript里已做为一项实验性特性予以支持。

如果想要使用,则可以借用babel的一个插件babel-plugin-transform-decorators可以.
```bash
npm install babel-plugin-transform-decorators-legacy --save-dev 
```
.babelrc :
```bash
{
  "presets": ["env"],
  "plugins": ["transform-decorators-legacy"]
}
```
### 类的装饰
```js
@toDo
class Person {}

function toDo(target, key, descriptor) {
  console.log('运动');
  console.log(target);
  console.log(key);
  console.log(descriptor);
  target.action = '我要运动';
}
console.log(Person.action);
```
```bash
babel-node a.js
运动
[Function: Person]
undefined
undefined
我要运动
```
@toDo就是一个装饰器，它修改了Person这个类的行为，为它加上了静态属性action。toDo函数的参数target是Person类本身。
### 属性的装饰
```js
class Person {
  constructor() {}
  @anything
  toDo() {
    console.log('sleeping');
  }
}

function anything(target, key, descriptor) {
  console.log(target);
  console.log(key);
  console.log(descriptor);
}
const student = new Person();
student.toDo();
```
```bash
Person {}
toDo
{ value: [Function: toDo],
  writable: true,
  enumerable: false,
  configurable: true }
sleeping
```
### 工厂模式的装饰

```js
function toDo(list) {
  return function(target) {
    target.list = list;
  };
}
@toDo('跑步')
class Person {}
console.log(Person.list);
@toDo('购物')
class Human {}
console.log(Human.list);
//跑步
//购物
```


---
相关链接
1.[Typescript中的装饰器](https://www.tslang.cn/docs/handbook/decorators.html)
2.[[译]探秘ES2016中的Decorators](https://segmentfault.com/a/1190000004869226#articleHeader1)
3.[探寻 ECMAScript 中的装饰器 Decorator](https://github.com/rccoder/blog/issues/23)
4.[JavaScript中的装饰器--Decorator](https://juejin.im/post/5ab26c87f265da23866fc80d#heading-1)
5.[Yehuda's Decorator Proposal](https://github.com/wycats/javascript-decorators)
6[JS 装饰器（Decorator）场景实战](https://juejin.im/post/59f1c484f265da431c6f8940#heading-4)
7[ES7 Decorator 装饰者模式](http://taobaofed.org/blog/2015/11/16/es7-decorator/)
8[Using ES.later Decorators as Mixins](http://raganwald.com/2015/06/26/decorators-in-es7.html)