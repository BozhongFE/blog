---
title: js中常见的数组操作
date: 2017-12-15 13:06:31
tags:
- javascript
---
## 数组元素的添加
### push( )和unshift()
```
1. push() //在数组的最末尾添加元素;
2. unshift() //在数组的最前面添加一个元素;
```
<!--more-->
例：
```javascript
var arr = [1,2,3];
var aaa = arr.push("a");//在数组的最末尾添加一个元素;
console.log(arr);//元素被修改了
console.log(aaa);//返回值是数组的长度;


var _aaa = arr.unshift("b");//在数组的最前面添加一个元素;
console.log(arr);//元素被修改了
console.log(_aaa);//返回值是数组的长度;
```
## 数组元素的删除
### pop( )和shift( )
```
1. pop()  //不需要参数;在数组的最末尾删除一项;
1. shift() //不需要参数;在数组的最前面删除一项;
```
例：
```javascript
var arr = [1,2,3,4];
var aaa = arr.pop();//不需要参数;在数组的最末尾删除一项;
console.log(arr);//元素被修改了 [1,2,3]
console.log(aaa);//被删除的那一项 4

var _aaa = arr.shift();//不需要参数;在数组的最前面删除一项;
console.log(arr);//元素被修改了 [2,3]
console.log(_aaa);//被删除的那一项 1
```
## 数组元素排序
### sort( )
sort(),数组中元素排序;(默认：从小到大)
,默认按照首个字符的Unicode编码排序;如果第一个相同那么就比较第二个...
例：

```javascript        
var arr = [4,7,1,3,2,8,6,9,5];
var aaa =arr.sort();
console.log(aaa);          // [1, 2, 3, 4, 5, 6, 7, 8, 9]
console.log(aaa === arr);// true 原数组被排序了(冒泡排序)
```
 
sort(),数值大小排序方法,需要借助回调函数;
例：


```javascript
var arr = [4,5,1,13,2,7,6];//回调函数里面返回值如果是：参数1-参数2;升幂；参数2-参数1;降幂；
arr.sort(function (a,b) {
  return a-b; //升序
  //return b-a; //降序
  //return b.value-a.value; //按照元素value属性的大小排序;
});
console.log(arr); // [1, 2, 4, 5, 6, 7, 13]
```
## 数组的翻转
### reverse( )
例:
```javascript
var arr1 = [1,2,3,4,5];
var aaa = arr1.reverse(); // [5,4,3,2,1]
```

## 数组元素的连接 
### concat( )
数组1.concat(数组2); // 链接两个数组;
例 ：

```javascript
var arr1 = [1,2,3];
var arr2 = ["a","b","c"];
var arr3 = arr1.concat(arr2);
console.log(arr3)   //    [1, 2, 3, "a", "b", "c"]
```

## 数组元素的截取 
### slice( )
数组.slice(开始索引值，结束索引值);     //数组截取;
例 ：

```javascript
var arr = [1, 2, 3, "a", "b", "c"];
console.log(arr.slice(3)); //从索引值为3截取到最后;["a", "b", "c"]
console.log(arr.slice(0,3));//包左不包右;[1, 2, 3]
console.log(arr.slice(-2));//负数是后几个;["b", "c"]
console.log(arr.slice(3,0));//如果前面的比后面的大，那么就是[];[]
console.log(arr);//原数组不被修改;[1, 2, 3, "a", "b", "c"]
```
## splice()

splice(开始索引值，删除几个，替换内容1，替换内容2，...); // 替换和删除; 
改变原数组;返回值是被删除/替换的内容                                                   
例:

```javascript
var arr = [1,2,3,4,5,6,"a", "b", "c"]
arr.splice(5); //从索引值为5截取到最后;(删除)
console.log(arr); // [1, 2, 3, 4, 5]
arr.splice(1,2);//(删除指定个数)从索引为1的开始删除2个
console.log(arr);//[1, 4, 5]
//替换
var arr = [1,2,3,4,5,6,"a", "b", "c"];
console.log(arr.splice(3,3,"aaa","bbb","ccc"));//(删除指定数并替换)[4, 5, 6]
console.log(arr);// [1, 2, 3, "aaa", "bbb", "ccc", "a", "b", "c"]
// 添加
arr.splice(3,0,"aaa","bbb","ccc");//(删除指定个数)
console.log(arr);//截取或者替换之后的;[1, 2, 3, "aaa", "bbb", "ccc", "aaa", "bbb", "ccc", "a", "b", "c"]
```
## 数组的索引
### indexOf / lastIndexOf
数组.indexOf(元素);      // 给元素，查索引(从前往后)
数组.lastIndexOf(元素);  // 给元素，查索引(从后往前)
例：
```javascript
var arr = ["a","b","c","d","c","b","b"];
console.log(arr.indexOf("b"));        // 1 查到以后立刻返回
console.log(arr.lastIndexOf("b"));    // 6 找到以后立刻返回
console.log(arr.indexOf("xxx"));    // -1;  查不到就返回-1；
```

## 数组遍历
### filter()
对数组中每一项运行回调函数，该函数返回结果是true的项组成的新数组
新数组是有老数组中的元素组成的，return为ture的项;
例：
```javascript
var arr = [100,222,333,444,555];
var newArr = arr.filter(function (element, index, array) {
    //只要是偶数，就组成数组;(数组中辨别元素)
    if(element%2 === 0){
        return true;
    }else{
        return false;
    }
})
console.log(newArr); // [100，222, 444]
```
   
### every()

 every返回一个bool值，全部是true才是true；有一个是false，结果就是false
 例：
```javascript
var bool = arr.every(function (element, index, array) {
    //判断：我们定义所有元素都大于200;
    //if(element > 100){
    if(element > 200){
        return true;
    }else{
        return false;
    }
})
alert(bool); //false
```

### forEach()
和for循环一样；没有返回值;
例：

```javascript
var arr = [111,222,333,444,555];
var sum = 0;
var aaa = arr.forEach(function (element,index,array) {
    console.log(element); // 输出数组中的每一个元素
    console.log(index); // 数组元素对应的索引值
    console.log(array); // 数组本身 [111, 222, 333, 444, 555]
    sum += element; //数组中元素求和;
});
console.log(sum); // 数组元素加起来的和
console.log(aaa);//undefined；没有返回值 所以返回undefined
```
### map()

对数组中每一项运行回调函数，返回该函数的结果组成的新数组。 return什么新数组中就有什么，不return返回undefined，对数组二次加工。
例：
```javascript
var arr = [111,222,333,444,555];
var newArr = arr.map(function (element, index, array) {
    if(index == 3){
        return element; // 这里return了 所以下面返回的值是333
    }
    return element*100; // 返回的元素值都乘上100后的值
})
console.log(newArr); // [11100, 22200, 33300, 444, 55500]
```