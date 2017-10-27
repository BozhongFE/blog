---
title: 相等运算符 == 和 ===  / 隐式类型转换
date: 2017-10-26 17:51:00
tags:
 - javascript
---
Q: 写一个对象来满足 `a == '1'`; `==` 和 `===` 的区别在哪。（取自百度面试题）

<!--more-->

---

## == 和 === 的区别


> `==` 允许在等价性比较中进行强制转换，而 `===` 不允许强制转换。

**严格相等运算符 `===` **
* 不同类型值相比较  `false`
* 同一类的原始类型值（数值、字符串、布尔值）比较，值相等  `true` / 值不相等  `false`
* 同一类的复合类型值（对象、数组、函数）比较，不比较它们的值，而是比较它们是否指向同一个对象
  ```js
  var a = { m: 1 };
  var b = { m: 1 };
  a === b; // false

  var a = { m: 1};
  var b = a;
  a === b; // true
  ```
* `undefined` 和 `null` 与自身相等
  ```js
  null === null // true
  undefined === undefined // true
  ```
* `NaN` 永远不等于它自己，`+0 / -0 / 0` 互相相等


**抽象相等运算符 `==` **

> 比较同类型数据时同 `===`；不同类型，先将数据进行类型转换，然后再用 `===` 比较。

* 不同原始类型值（数值、字符串、布尔值）转换成数值类型再比较，字符串和布尔值都会转换成数值。
```js
  '1' == true  // true 同 1 == true
  '2' == true  // false 同 2 == true
  'a' == true  // false 同 a == true

  '0' == false // true 同 0 == false
  '2' == false // false 同 2 == false
  'a' == false // false 同 a == false
```
* `undefined` 和 `null`
```js
  null == undefined // true
```
* 对象与原始类型值比较

  > 先将对象转换成原始类型值（隐式类型转换），再用 `===` 比较。调用了下面两个方法：
  定义在 `object.prototype` 上的：
  `valueOf` 方法：用来把对象转换成原始类型的值
  `toString` 方法：将对象表示成文本值或者期望的字符串

  ```js
    // 写一个对象来满足a == '1'
    const a = { toString: () => '1'};
    console.log(typeof a); // -->object
    console.log(a == '1'); // -->true

    // 或者
    const c = new String('1');
    console.log(typeof c); // -->object
    console.log(c == '1'); // -->true
  ```

## JavaScript 中应该用 `==` 还是 `===`？

> 摘自《你不懂JS》系列：
许多开发者认为 === 的行为更加容易预测，所以他们总是主张使用 === 而劝人们远离 ==，我认为这种看法是非常短视的。如果你花点时间来搞清楚它是如何工作的话，== 绝对是一个能够帮助你程序的强大工具。

> 来源知乎：
 绝大多数场合应该使用 === ，只有检测 null/undefined 的时候可以使用 x == null ，因为通常我们不区分 null 和 undefined ，即将 x == null 作为 x === null || x === undefined 的缩写。

**用 `==` 副作用**

* 覆写某个对象的 valueOf/toString
  > == 的隐式类型转换调用了这两个方法，如果在覆盖的方法里写了带有副作用的代码，会带来副作用。

  ```js
    // 出现异常
    var x = 1;
    var obj = {
      valueOf: function() {
        return {};
      },
      toString: function() {
        return {};
      },
    }
    console.log( obj == 0 );
    // Error: Cannot convert object to primitive value (不能将对象转换为原始值)



    // 刁钻的例子
    var i = 2;
    Number.prototype.valueOf = function() {
      return i++;
    };
    var a = new Number(42 );
    if (a == 2 && a == 3) {
      console.log( "Yep, this happened." );
    }
    // Yep, this happend.
  ```

* 没有类型限制，类型转换的后果将是不可预料的

  > 如果比较的任意一边可能出现 true 或者 false 值，那么就永远，永远不要使用 ==。
  如果比较的任意一边可能出现 []，""，或 0 这些值，那么认真地考虑不使用 ==。

  ```js
    "" == 0; // true
    123 == "123"; // true
    false == " \t "; // true
    0 == []; // true
    "" == []; // true
    [] == ![]; // true
  ```
* 是否对后续代码造成意外的影响
  > 维护他人/自己的代码。当看到 == 时，需要去判断代码意图是需要这么写/随手写的/不应该转型写错了，而且逻辑/语义不清晰，也容易隐藏错误。

  > 例子：if (x == 10) x += 5
  如果传入的x是字符串'10'，x的结果会变成'105'。在后续运算中字符串'105'又可能被转型，从而引入隐蔽的错误。

** 适合使用的情况 **

* 判断一个字符串看起来是不是空白的（由空白字符组成）
```js
  var str = "  ";
  if (typeof str === "string" && str == false) {
    console.log("由空白字符组成");
  }
  // 由空白字符组成
```

* 检测 `null/undefined`
```js
  a == null;
  //等同于
  a === null || a === undefined;
```

## 隐式类型转换

> 隐式类型转换（自动类型转换）：不需要书写代码，由系统自动完成的类型转换。

** 运算中存在的隐式类型转换 **

* `+` 运算符
  > 当运算符 `+` 两边一个是数字类型，一个是字符串类型时，js引擎规定进行字符串连接运算而非算术加运算。

  ```js
    var a = 11;
    a = a + '';
    console.log(typeof a)  // --> string
  ```

* `-` 运算符: 取负 / 减法运算
  > 与 `+` 相反，会把字符串隐式的转换成数字再进行算术减法运算。

  ```js
    var a = 11; b = '5';
    var c = a - b;
    console.log(typeof c); // -->number

    var a = '11';
    a = a - '';
    console.log(typeof a); // -->number
  ```

** 语句中存在的隐式类型转换 **

* `if/while`

  > 括号内的判断条件转换成 `Boolean` 类型;

  ```js
    if (a) {
      // do something
    }
    while (a) {
      // do something
    }
  ```

* `for in`

  > 属性名/键值/索引转换成 `String` 类型。

  ```js
    var a = { 1: 222, 'a': 333};
    for (var k in a) {
      console.log( k, ':', typeof k)
    }
    /*
    * 1: string
    * a: string
    */

    // 数组的索引也是字符串类型。

    var arr = [1, 3, 5, 7];
    for (var i in arr) {
      console.log( i, ':', typeof i);
    }
    /*
    * 0: string
    * 1: string
    * 2: string
    * 3: string
    */
  ```

* `alert`

  > 给String原型上添加了个 `fn` 方法，该方法返回 `this` ，即当前类的实例对象。
    既然是对象那么 `typeof a.fn()` 自然返回是object了。
    关键是最后的 `alert(a.fn())`，`a.fn()`返回的是对象，但 `alert` 却隐式转换成了字符串 `hello` 显示。同样的情况发生在数字类型上。

  ```js
    String.prototype.fn = function() {
      return this;
    };

    var a = 'hello';

    alert(typeof a.fn()); // --> object
    alert(a.fn()); // -->hello
    console.log(a.fn()); // --> String {0: "h", 1: "e", 2: "l", 3: "l", 4: "o", length: 5, [[PrimitiveValue]]: "hello"}
  ```


## 参考文档

[Javascript 中 == 和 === 区别是什么？](https://www.zhihu.com/question/31442029 "Javascript 中 == 和 === 区别是什么？")
[js隐式转换](http://www.jianshu.com/p/0f1e3ff14537 "js隐式转换")
[《你不懂JS：类型与文法》-- 第四章：强制转换](https://github.com/getify/You-Dont-Know-JS/blob/1ed-zh-CN/types%20%26%20grammar/ch4.md"《你不懂JS：类型与文法》-- 第四章：强制转换")