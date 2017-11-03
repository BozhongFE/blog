---
title: Closure
date: 2017-11-03
tags:
 - javascript
---


javascript 闭包是一个抽象的词,但在我们实际项目却是经常用到的。因此，今天就来了解一下什么是闭包吧~

<!-- more -->

### 释义
 
  函数对象可以通过作用域链相互关联起来，函数体内部变量都可以保存在函数作用域内

  简单的说就是内部函数可以访问它们所在的外部函数中声明的所有局部变量、参数和声明的其他内部函数。
  当其中一个这样的内部函数在包含它们的外部函数之外被调用时，就会形成闭包。

  <img src="/img/closure/closure.gif" alt="closure" />
  <center>(闭包关联到函数和变量)</center>


  实现闭包需要满足以下3个条件

  1. 访问所在作用域;
  2. 函数嵌套;
  3. 在所在作用域外被调用;


### 简单的展现形式 
  

  ```js

    var fn1 = function(){

      var max = 10;

      function fn2(n){
        if (n > max) {
          console.log(n++)
        }
      }
      
      return fn2
    }
   
    var fn = fn1();
    fn(15)

  ```

### 特性

  + 作为函数变量的一个引用。当函数返回时，其处于激活状态。
  + 闭包就是当一个函数返回时，并没有释放资源的栈区。

### 优点

  + 逻辑连续，当闭包作为另一个函数调用参数时，避免脱离当前逻辑而单独编写额外逻辑。
  + 方便调用上下文的局部变量
  + 加强封装性，是第2点的延伸，可以达到对变量的保护作用。

### 缺点
  + 由于闭包会使得函数中的变量都被保存在内存中，内存消耗很大，所以不能滥用闭包，否则会造成网页的性能问题，在IE中可能导致内存泄露。解决方法是，在退出函数之前，将不使用的局部变量全部删除。
  + 闭包会在父函数外部，改变父函数内部变量的值。所以，如果你把父函数当作对象（object）使用，把闭包当作它的公用方法（Public Method），把内部变量当作它的私有属性（private value），这时一定要小心，不要随便改变父函数内部变量的值。

### 用途

  1. 匿名自执行函数

  ```js
    var data= {    
        table : [],    
        tree : {}    
    };    
         
    (function(dm){    
        for(var i = 0; i < dm.table.rows; i++){    
           var row = dm.table.rows[i];    
           for(var j = 0; j < row.cells; i++){    
               drawCell(i, j);    
           }    
        }    
           
    })(data);
  ```
  2. 结果缓存

  ```js
    var CachedSearchBox = (function(){    
        var cache = {},    
           count = [];    
        return {    
           attachSearchBox : function(dsid){    
               if(dsid in cache){//如果结果在缓存中    
                  return cache[dsid];//直接返回缓存中的对象    
               }    
               var fsb = new uikit.webctrl.SearchBox(dsid);//新建    
               cache[dsid] = fsb;//更新缓存    
               if(count.length > 100){//保正缓存的大小<=100    
                  delete cache[count.shift()];    
               }    
               return fsb;          
           },    
         
           clearSearchBox : function(dsid){    
               if(dsid in cache){    
                  cache[dsid].clearSelection();      
               }    
           }    
        };    
    })();    
        
    CachedSearchBox.attachSearchBox("input"); 
  ```

  3. 封装

   ```js
    var person = function(){    
      //变量作用域为函数内部，外部无法访问    
      var name = "default";       
         
      return {    
         getName : function(){    
             return name;    
         },    
         setName : function(newName){    
             name = newName;    
         }    
      }    
    }();   

    console.log(person.name);//直接访问，结果为undefined    
    console.log(person.getName());    
    person.setName("abruzzi");    
    console.log(person.getName()); 
  ```

  4. 实现类和继承  

   ```js
    function Person(){    
      var name = "default";       
         
      return {    
         getName : function(){    
             return name;    
         },    
         setName : function(newName){    
             name = newName;    
         }    
      }    
    };
    var p = new Person();
    p.setName("Tom");
    console.log(p.getName());
    var Jack = function(){};
    //继承自Person
    Jack.prototype = new Person();
    //添加私有方法
    Jack.prototype.Say = function(){
        console.log("Hello,my name is Jack");
    };
    var j = new Jack();
    j.setName("Jack");
    j.Say();
    console.log(j.getName()); 
  ```



## 参考资料及拓展阅读

  深入理解javascript原型和闭包 http://www.cnblogs.com/wangfupeng1988/p/3994065.html
  Javascript闭包的几种用法 http://www.cnblogs.com/wyaocn/p/5807032.html

