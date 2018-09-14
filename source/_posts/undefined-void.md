---
title: 探究 undefined 与 void
date: 2018.09.14
tags:
 - javascript
categories:
 - 前端
---

为什么使用 `void 0` 代替 `undefined`？
<!--more-->

# Typeof

[思考来源](https://yuchengkai.cn/docs/zh/frontend/#typeof)

## undefined 非保留关键字

undefined 非保留关键字，是可能被定义的。
```js
function hello() {
  var a;
  console.log(a === undefined); // true
  var undefined = 'hello world';
  console.log(a === undefined); // false
}
hello();
```
所以拿 `undefined` 来判断是不严谨的，一般都用 `void 0` 来判断，例如：

```js
var a;
console.log(a === void 0); // true
```

## void 是个什么东西

在了解 `void` 前，先简单测试下
```js
typeof void 0 // undefined
console.log(void 0) // undefined
Object.prototype.toString.call(void 0) // [object Undefined]
```

看起来没毛病，再试试这些呢？

```js
void 100
void hello()
void 'abc'
void true
```

以上全是 `undefined`，这样似乎也可以，但为啥就用了 `void 0`，`void` 到底是个什么东西？

### 看下规范怎么说
> [引用](http://www.ecma-international.org/ecma-262/5.1/#sec-11.4.2)：void 操作符
>
> void UnaryExpression，流程如下:
+ 执行 UnaryExpression.
+ 回调 getValue.
+ 返回 undefined.
>
> PS: 必须调用GetValue，即使它的值未被使用，因为它可能具有可观察到的副作用。

无论如何，最后结果都返回 `undefined`，所以 `void 0` 算是最简单的 `undefined`

### 其他作用

常见的还有填充 `<a>` 的 `href`, 类似论坛的`评论`、`点赞`都是a标签，
但不希望是刷新或跳转，而是自己定义事件。
```html
<a href="javascript:void(0)">点赞</a>
```
这样做可以确保点击执行一个无效的操作

### getValue副作用？

在取值的时候，有可能触发副作用（调用了Getter）

```js
var age = 20;
var mood = 10;
var person = {
  get age() {
    mood--;
    return age;
  },
  get mood() {
    return mood;
  }
};

console.log(person.age); // 20
console.log(person.mood); // 9

void person.age; // 调用getter
console.log(person.mood); // 8

delete person.age; // 没调用getter
console.log(person.mood); // 8
```

上述代码定义了一个人，每次被问年龄（`age`），心情（`mood`）就会减1。
从执行情况看，无论是访问 `person.age`，还是 `void person.age` 都会使 `mood--`。
而换成 `delete person.age`，则 `mood` 没有变化。
总结：void会回调Getter，而delete不会。


### 总结

void作用如下：
+ `void 0` 代替 `undefined` 更安全靠谱
+ 填充 `<a>` 的 `href` ，确保页面不会刷新或跳转
+ 强制函数返回值为 `undefined`

### 参考文档
[segmentfault | 谈谈Javascript中的void操作符](https://segmentfault.com/a/1190000000474941)