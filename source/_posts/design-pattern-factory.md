---
title: 设计模式之工厂模式
date: 2018-06-29
tags:
 - javascript
---

工厂模式根据抽象程度的不同分为三种：简单工厂模式（Simple Factory Pattern），又称静态工厂方法（Static Factory Method）、工厂方法模式、以及抽象工厂模式。

<!-- more -->

在介绍工厂模式之前，我们需要先了解程序设计中的一个原则。叫做「开放封闭原则（Open-Closed Principle, OCP）」。

## 什么是「开放封闭原则」？

「开放封闭原则」是由两个概念组成的：
1. 面向扩展开放（Open For Extension）
2. 面向修改封闭（Closed For Modification）

>  在面向对象编程领域中，开闭原则规定“软件中的对象（类，模块，函数等等）应该对于扩展是开放的，但是对于修改是封闭的”，这意味着一个实体是允许在不改变它的源代码的前提下变更它的行为。该特性在产品化的环境中是特别有价值的，在这种环境中，改变源代码需要代码审查，单元测试以及诸如此类的用以确保产品使用质量的过程。遵循这种原则的代码在扩展时并不发生改变，因此无需上述的过程。

以上引用自维基百科


## 简单工厂模式

简单工厂模式，就是把对象的创建放到一个工厂类里面，通过参数来创建不同的对象。  
生产者不需要知道工厂生产一个产品需要做怎样的加工处理，只需要知道最终想生产出来的是什么产品就可以。  
工厂模式主要是通过将「对象创建」与「对象构造逻辑」解耦，做到更清晰的可维护性。

```javascript
class Gun {
  constructor(caliber) {
    this.name = '';
    this.caliber = caliber;
  }

  sayHi() {
    console.log(`Name: ${this.name}, caliber: ${this.caliber}mm`);
  }
}

class Ak47Gun extends Gun {
  constructor(caliber) {
    super(caliber);
    this.name = 'AK-47';
  }
}

class M4A1Gun extends Gun {
  constructor(caliber) {
    super(caliber);
    this.name = 'M4A1';
  }
}

class GunFactory {
  static createGun(type) {
    if (type === 1) {
      return new Ak47Gun('7.62');
    } else if (type === 2) {
      return new M4A1Gun('5.56');
    } else {
      return Error('工厂不生产这种枪');
    }
  }
}

// 在这里，我们不需要工厂制造出来的是什么枪，要怎么制造。只需要知道，制造出来的枪能不能射击。
// 换句话说，我们不用关心产品的实现过程，只需要知道产品有什么功能
const Ak47 = GunFactory.createGun(1);
const M4A1 = GunFactory.createGun(2);

Ak47.sayHi(); // Name: AK-47, caliber: 7.62mm
M4A1.sayHi(); // Name: M4A1, caliber: 5.56mm
```

在简单工厂模式中，如果我们要添加一个功能，就必须对工厂类进行修改。  
这并不符合「开闭原则」。所以，这就需要「工厂方法模式」。

## 工厂方法模式

工厂方法模式是在简单工厂的基础上，进一步的抽象而来。  
在工厂方法模式中，将产品的生产细分到每一个工厂，之后如果需要新增产品，只需要继承工厂类来实现一个新的产品工厂。可以做到不修改代码而增加功能。符合「开闭原则」。

```javascript
class GunFactory {
  static createGun() {};
}

class Ak47Factory extends GunFactory {
  constructor() {
    super();
  }

  static createGun() {
    return new Ak47Gun('7.62');
  }
}

class M4A1Factory extends GunFactory {
  constructor() {
    super();
  }

  static createGun() {
    return new M4A1Gun('5.56');
  }
}


const Ak47 = Ak47Factory.createGun();
const M4A1 = M4A1Factory.createGun();
```

假如后来我们需要生产 UMP9，只需要新增一个 UMP9 枪工厂，而不必修改原工厂的代码。

```javascript
class UMP9Gun extends Gun {
  constructor(caliber) {
    super(caliber);
    this.name = 'UMP9';
  }
}

class UMP9Factory extends GunFactory {
  constructor() {
    super();
  }

  static createGun() {
    return new UMP9Gun('9');
  }
}
```

## 抽象工厂模式

抽象工厂模式和工厂方法模式其实很像，两者的区别在于：  

工厂方法模式是一个工厂内，只生产一种类型的产品。也就是一个工厂类只创建一个产品类。

抽象工厂模式是一个工厂内，可以生产多种类型的产品，一般这些产品相互之间是有些联系的。也就是一个工厂类可以创建多个产品类。

以上面的例子来说。每种类型的枪对应不同口径的子弹。如果枪支和子弹分别用枪支工厂和子弹工厂来生产。那么有可能出现用户买了枪支之后，买错子弹的问题。  
这种情况，就适合使用「抽象工厂模式」来实现。

```javascript
class Gun {
  constructor() {
    this.name = '';
    this.caliber = '';
  }

  load(bullet) {
    if (bullet.caliber === this.caliber) {
      console.log('It\'s work.');
    } else {
      console.log('It\'s not work.');
    }
  }
}

class Ak47Gun extends Gun {
  constructor() {
    super();
    this.name = 'AK-47';
    this.caliber = '7.62';
  }
}

class Bullet {
  constructor() {
    this.caliber = '';
  }
}

class Bullet762 extends Bullet {
  constructor() {
    super();
    this.caliber = '7.62';
  }
}

class GunFactory {
  static createGun() {}
  static createBullet() {}
}

class Ak47Factory extends GunFactory {
  static createGun() {
    return new Ak47Gun();
  }

  static createBullet() {
    return new Bullet762();
  }
}

const ak47 = Ak47Factory.createGun();
const bullet762 = Ak47Factory.createBullet();

ak47.load(bullet762); // It's work.
```


## 参考资料

1. [开放封闭原则（Open Closed Principle）](http://www.cnblogs.com/gaochundong/p/open_closed_principle.html)
2. [简单工厂模式（Simple Factory Pattern）](http://design-patterns.readthedocs.io/zh_CN/latest/creational_patterns/simple_factory.html)
3. [DesignPattern | Ichennan](http://ichennan.com/2016/08/09/DesignPattern.html)
4. [工厂方法模式](http://wiki.jikexueyuan.com/project/java-design-pattern/factory-pattern.html)
5. [开放-封闭原则（OCP，Open - Closed Priciple）- 腾讯Web前端 IMWeb 团队社区](http://imweb.io/topic/5616652d5d6f37745e8f496f)
