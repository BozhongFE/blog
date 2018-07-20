---
title: 在JavaScript中模仿接口
date: 2018-07-20 
tags:
 - javascript
---

## 什么是接口

接口是面向对象 JavaScript 程序员的工具箱中最有用的工具之一。在 JavaScript 的世界中，没有内置的创建或实现接口的方法，也没有可以判断一个对象是否实现了与另一个对象相同的一套方法，这使得对象之间很难互换使用，好在 JavaScript 拥有出色的灵活性，这使得模拟传统面向对象的接口，添加这些特性并非难事。
接口提供了一种用以说明一个对象应该具有哪些方法的手段，尽管它可以表明这些方法的含义，但是却不包含具体实现。有了这个工具，就能按对象提供的特性对它们进行分组。

## JavaScript 中接口利弊

### JavaScript 中接口之利：

- 既定的一批接口具有自我描述性，并能促进代码的重用。
- 接口可以帮助对类的使用。
  接口有助于稳定不同的类之间的通信方式。

### JavaScript 中接口的弊端

- 接口在一定程度上强化类型的作用，从而降低的 JavaScript 弱类型的特性。
- JavaScript 用模仿的方式实现接口的特性，这有一定的风险。
- JavaScript 中，实现接口的方法都会对性能造成一定的影响，在某种程序上这是因为额外的方法调用的开销。
- JavaScript 中，无法强制程序员遵守你定义的接口。

## 在 JavaScript 中模仿接口

在 javascipt 中模仿接口有三种方法，注释法、属性检查法和鸭式辨型法

### 1.注释法

```js
/*

interface Composite {
    function add(child);
    function remove(child);
    function getChild(index);
}

interface FormItem {
    function save();
}

*/

var CompositeForm = function(id, method, action) { // implements Composite, FormItem
    ...
};

// Implement the Composite interface.

CompositeForm.prototype.add = function(child) {
    ...
};
CompositeForm.prototype.remove = function(child) {
    ...
};
CompositeForm.prototype.getChild = function(index) {
    ...
};

// Implement the FormItem interface.

CompositeForm.prototype.save = function() {
    ...
};

```

这种模仿不是很好，没有真正的实现了正确的方法集进行检查。尽管如此，它易于实现，不需要额外的类或函数。可以提高代码的重可性

### 2.属性检查法

```js
/*
interface Composite {
  function add(child);
  function remove(child);
  function getChild(index);
}

interface FormItem {
  function save();
}

*/

var CompositeForm = function(id, method, action) {
  this.implementsInterfaces = ['Composite', 'FormItem'];
   ...
};

...

function addForm(formInstance) {
  if(!implements(formInstance, 'Composite', 'FormItem')) {
    throw new Error("Object does not implement a required interface.");
  }
  ...
}


//检查接口是否实现
function implements(object) {
  for(var i = 1; i < arguments.length; i++) {
    var interfaceName = arguments[i];
    var interfaceFound = false;
    for(var j = 0; j < object.implementsInterfaces.length; j++) {
      if(object.implementsInterfaces[j] == interfaceName) {
        interfaceFound = true;
        break;
      }
    }
    if(!interfaceFound) {
      return false;
    }
  }
  return true;
}
```
CompositeForm实现了Composite和FormItem这两个接口， 做法是把这两个接口的名称加入一个名implementsInterfaces的数组，要求对其特定类型的函数的属性进行检查，在未声明的时候会抛出一个错误。
此方法的优点是对类实现的接口提供了文档说明，如果需要的接口未实现则会报错。缺点在于不能保证类是否真正实现了接口，只知道它是否说自己实现了接口，即使代码未将接口实现也能通过检查，这将在代码中留下隐患。

### 3.鸭辨法
把对象实现的方法的方法集作为判断它是不是某个类实现的唯一标准。如果对象具有与接口定义的同名的所有方法，那么就认为它实现了这个接口。
这是最常用的一种方法。

```js
// Interfaces.
var Composite = new Interface('Composite', ['add', 'remove', 'getChild']);
var FormItem = new Interface('FormItem', ['save']);

// CompositeForm class
var CompositeForm = function(id, method, action) {
  ...
};

...

function addForm(formInstance) {
  ensureImplements(formInstance, Composite, FormItem);
  //如果没有执行的方法将会抛出一个错误
  ...
}
```
ensureImplements函数至少接受两个参数，一个是需要检查的对象，其余为针对此对象需要检查是否实现的接口。具体检查方式则是检查对象是否实现了接口所声明的所有方法。

此方法的缺点是缺乏其他两种方法的自我描述性，需要一个辅助类Interface和一个辅助函数ensureImplements。并且它只关心方法名称而不检查参数名称、数目、类型等。


---
参考链接：

1.[Pro JavaScript Design Patterns](https://www.apress.com/cn/book/9781590599082)

2.[JavaScript使用接口](https://www.cnblogs.com/hlwyfeng/p/6099957.html)

3.[Javascript 设计模式读书笔记(一)——接口](https://segmentfault.com/a/1190000000480609)