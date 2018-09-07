---
title: 探究 typeof null === object？
date: 2018.09.07
tags:
 - javascript
categories:
 - 前端
---

`typeof null` 理论上是 `null`，为什么会是 `object` 呢？
<!--more-->

# Typeof

## typeof null === object?

> [引用](https://yuchengkai.cn/docs/zh/frontend/#typeof)：为什么会出现这种情况呢？因为在 JS 的最初版本中，使用的是 32 位系统，为了性能考虑使用低位存储了变量的类型信息，`000` 开头代表是对象，然而 `null` 表示为全零，所以将它错误的判断为 `object` 。虽然现在的内部类型判断代码已经改变了，但是对于这个 Bug 却是一直流传下来。

查了下资料，在初版javascript中，值以32位为单位存储，由标记位（1-3位）和值来组成实际数据。

通过[初版源码: 类型](https://dxr.mozilla.org/classic/source/js/src/jsapi.h#32)，发现类型是这样定义的：
```c
/*
 * Type tags stored in the low bits of a jsval.
 */
#define JSVAL_OBJECT            0x0     /* untagged reference to object */
#define JSVAL_INT               0x1     /* tagged 31-bit integer value */
#define JSVAL_DOUBLE            0x2     /* tagged reference to double */
#define JSVAL_STRING            0x4     /* tagged reference to string */
#define JSVAL_BOOLEAN           0x6     /* tagged boolean value */

/* Type tag bitfield length and derived macros. */
#define JSVAL_TAGBITS           3

/*
 * Well-known JS values.  The extern'd variables are initialized when the
 * first JSContext is created by JS_NewContext (see below).
 */
#define JSVAL_VOID              INT_TO_JSVAL(0 - JSVAL_INT_POW2(30)) /* undefined */
#define JSVAL_NULL              OBJECT_TO_JSVAL(0)
#define OBJECT_TO_JSVAL(obj)    ((jsval)(obj))
```

转成16进制可得：

+ `0x0` -> `000`: 对象（`object`）
+ `0x1` -> `1`:   31位整数值（`number`）
+ `0x2` -> `010`: 浮点值（`double`）
+ `0x4` -> `100`: 字符串（`string`）
+ `0x6` -> `110`: 布尔值（`boolean`）

有两个特殊值：
+ `undefined`: 用 - (-2 ^ 30)表示
+ `null` 对应空指针的机器码，一般全零

接下来看看 [初版源码: typeof](https://dxr.mozilla.org/classic/source/js/src/jsapi.c#333)，先判断`undefined`，再判断`object`，紧接着`number`、`string`、`boolean`

```js
if (JSVAL_IS_VOID(v)) { // 是否undefined
	type = JSTYPE_VOID;
} else if (JSVAL_IS_OBJECT(v)) { // 是否object
  obj = JSVAL_TO_OBJECT(v);
  if (obj &&
      (ops = obj -> map -> ops,
      ops == &js_ObjectOps
      ? (clasp = OBJ_GET_CLASS(cx, obj),
      clasp->call || clasp == &js_FunctionClass)
      : ops->call != 0)) { // 是否function
    type = JSTYPE_FUNCTION; 
  } else {
    type = JSTYPE_OBJECT; 
  }
} else if (JSVAL_IS_NUMBER(v)) { // 是否number
  type = JSTYPE_NUMBER; 
} else if (JSVAL_IS_STRING(v)) { // 是否string
  type = JSTYPE_STRING;
} else if (JSVAL_IS_BOOLEAN(v)) { // 是否boolean
  type = JSTYPE_BOOLEAN;
}
```

不难看出，少了`null`逻辑，被判断成了一个`object`，所以 `typeof null` 是 `object`

PS: ECMAScript提出了一个修复（通过opt-in），但被拒绝。这将导致typeof null === 'object'。

## 参考文档
[javascript | 初版源码](https://dxr.mozilla.org/classic)

[javascript | typeof null](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof#null)

[2ality | The history of “typeof null”](http://2ality.com/2013/10/typeof-null.html)

[segmentfault | JavaScript中typeof原理探究？](https://segmentfault.com/q/1010000011846328)

