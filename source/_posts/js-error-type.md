---
title: Error type
date: 2017-12-01
tags:
 - javascript
---

在我们实际开发过程中避免不了会遇到JS的错误，为此今天分享一下在我们开发出错时JS会抛出哪些错误信息让我们可以快速定位错误

<!-- more -->

开发中执行代码期间可能会发生的错误有多种类型.每种错误都有对应的错误类型，当代码解析或运行时发生错误，javascript引擎就会自动产生并抛出一个error对象的实例，然后整个程序就中断在发生错误的地方.


### Error 语法

```js
  new Error([meSSage[, fileName[,lineNumber]]])
```

### Error 参数

- message 可阅读的错误描述信息
- filename 创建Error对象的fileName属性的值.默认是包含异常代码的文件名
- lineNumbe r创建Error对象的lineNumber属性的值.默认是构造Error对象的行数

相关Error方法及属性可在下面的参考资料中查询

### Error 错误类型
Error对象是原始错误类型，在它的基础上，派生了以下6种标准错误

## SyntaxError  语法错误

当Javascript语言解析代码时,Javascript引擎发现了不符合语法规范的tokens或token顺序时抛出SyntaxError.可能是丢失运算符或者转义字符等

例如:

```js
  var a = [;] //Unexpected end of input
  var a = 1 + //Unexpected token;
  var a = 213132；//Uncaught SyntaxError: Invalid or unexpected token
  console.log("PI: " Math.PI); //Uncaught SyntaxError: missing ) after argument list
  var a='sd; //Uncaught SyntaxError: Invalid or unexpected token
```
Uncaught SyntaxError: missing ) after argument list
没有使用 ”+“ 操作符来连接字符串，JavaScript 认为 log 函数的参数的值只是 “PI: ”，在这种情况下，它应该用一个右括号作为结束.

Unexpected token;
意外符号

Unexpected end of input
意外的终止输入, 解板代码时，碰到不可预知的错误

Uncaught SyntaxError: Invalid or unexpected token
无效的意外符号

Uncaught SyntaxError: Invalid or unexpected token 
一个字符串字面量少了结尾的引号 

## ReferenceError 引用错误

当你尝试引用一个未被定义的变量时，将会抛出一个 ReferenceError引用错误 .

例如:

```js
  function doSomething(){};
  if(doSomething() = 'somevalue'){}; //Uncaught ReferenceError: Invalid left-hand side in assignment

  console.log(a);  //Uncaught ReferenceError: a is not defined
```
Uncaught ReferenceError: Invalid left-hand side in assignment
左手边包含不能赋值的东西 

Uncaught ReferenceError: a is not defined
a 未定义

## TypeError 类型错误

对象用来表示值的类型非预期类型时发生的错误，即执行特定于类型的操作时，变量的类型并不符合所预期的类型

例如:

```js
  var foo = undefined;
  foo();  //Uncaught TypeError: foo is not a function
  var x = document.getElementByID('foo'); //Uncaught TypeError: foo is not a function

  var a = { };
  var b = { a: a };
  a.b = b;
  JSON.stringify(a); //Uncaught TypeError: Converting circular structure to JSON
```
Uncaught TypeError: foo is not a function
当尝试调用一个像方法的值，这个值并不是一个方法

Uncaught TypeError: Converting circular structure to JSON
把循环引用的对象，传给 JSON.stringify 会引起错误.


## RangeError 范围错误

当传递一个不合法的length值作为Array 构造器的参数创建数组，或者传递错误值到数值计算方法（Number.toExponential()，Number.toFixed() ，Number.toPrecision()），会出现RangeError.

例如:

```js
  var items1 = new Array(-20); //Uncaught RangeError: Invalid array length

  (function a(){a();})() 
  //Uncaught RangeError: Maximum call stack size exceeded
  //InternalError: too much recursion
```
Uncaught RangeError: Invalid array length
当传递一个不合法的length值作为Array 构造器的参数创建数组 ，则会抛出错误 无效的数组长度

Uncaught RangeError: Maximum call stack size exceeded
函数的无限递归调用引起 ，则会抛出错误 超过最大调用堆栈大小

InternalError: too much recursion
内部错误：递归过深

*InternalError 对象表示出现在JavaScript引擎内部的错误,该特性是非标准的


## URIError 统一资源标识符函数错误

URIError是URI相关函数的参数不正确时抛出的错误，主要涉及encodeURI()、decodeURI()、encodeURIComponent()、decodeURIComponent()、escape()和unescape()这六个函数.

例如:

```js
  decodeURI('%')//URI格式不正确 //Uncaught URIError: URI malformed
```
Uncaught URIError: URI malformed
URI格式不正确

##  EvalError eval错误
使用 eval() 函数而发生异常时被抛出 ，该错误类型已经在ES5中不使用了，只是为了保证与以前代码兼容，才继续保留


## 如何捕捉错误的类型
使用try-catch语句来捕获错误

```js
try{
  t;
}catch(ex){
  console.log(ex.message);//t is not defined 
  console.log(ex.name);//ReferenceError
}
```
## 如何创建自定义错误

throw 语句允许我们创建自定义错误

```html 
  <h1>My First JavaScript</h1>
  <p>Please input a number between 5 and 10:</p>
  <input id="demo" type="text">
  <button type="button" onclick="myFunction()">Test Input</button>
  <p id="mess"></p>
```

```js
  function myFunction(){
    try{
      var x=document.getElementById("demo").value;
      if(x=="")    throw "empty";
      if(isNaN(x)) throw "not a number";
      if(x>10)     throw "too high";
      if(x<5)      throw "too low";
    }catch(err){
      var y=document.getElementById("mess");
      y.innerHTML="Error: " + err + ".";
    }
  }
```

## 参考资料及拓展阅读

[Error 对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error)
[JS常见异常类型以及捕获异常](http://blog.csdn.net/alex8046/article/details/46707833)
