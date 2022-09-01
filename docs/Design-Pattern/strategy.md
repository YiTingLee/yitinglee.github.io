---
id: strategy-pattern
title: Strategy Pattern
description: "使用javascript學習Design Pattern的第一篇 - Strategy Pattern"
slug: "/design-pattern-strategy-pattern"
date: "2020-10-01T21:11:00.000Z"
template: "post"
draft: false
category: "Design Pattern"
tags:
  - "Design Pattern"
socialImage: ""
---

## 前言

這是 Design Pattern 這系列的第一篇文章。

## 介紹

簡單來說策略模式就是把程式行為中，針對 "實踐" 行為(大部分的情況是相同目的的演算法)加以封裝，讓不同的行為各自繼承並實現，讓使用此行為的物件能夠自由切換。

## 優點

- 無論修改演算法或主程式，都不會互相造成影響
- 可以靈活的切換不同的演算法
- 良好水平擴充性
- 能夠單純進行演算法的測試

## 缺點

- 大量的行為類別

## 例子

- 設計跑車、腳踏車、玩具車的加速行為

### 未使用策略模式

```javascript
    class Car {
        private mode;
        accelerate() {
            if (mode === 'SportCar') {
                console.log('引擎驅動'); // 可能會包成function
            } else if (mode === 'bicycle') {
                console.log('人力驅動');
            } else if (mode === 'toy car') {
                concole.log('電池驅動');
            }
        }
    }

```

### 策略模式

- 把加速行為封裝成介面

```javascript
    interface AccelerateBehavior {
        accelerate();
    }
```

- 實現各行為

```javascript
class AccelerateWithEngine implements AccelerateBehavior {
  accelerate() {
    console.log("引擎驅動");
  }
}

class AccelerateWithPerson implements AccelerateBehavior {
  accelerate() {
    console.log("人力驅動");
  }
}

class AccelerateWithBattery implements AccelerateBehavior {
  accelerate() {
    console.log("電池驅動");
  }
}
```

- 完成最後的 Car 及使用範例

```javascript
class Car {
  accelerateBehavior: AccelerateBehavior;

  constructor(accelerateBehavior) {
    this.setAccelerateBehavior(accelerateBehavior);
  }

  setAccelerateBehavior(accelerateBehavior) {
    this.accelerateBehavior = accelerateBehavior;
  }

  accelerate() {
    this.accelerateBehavior.accelerate();
  }
}
```

```javascript
const car = new Car(new AccelerateWithEngine());
car.accelerate(); // 引擎驅動
car.setAccelerateBehavior(new AccelerateWithBattery());
car.accelerate(); // 電池驅動
```

## 結論

由策略模式設計出的物件擁有動態切換加速方式的靈活性，在測試方面也能直接對於加速演算法進行測試，可以避免因為 if else 造成同一個 method 越來越大包的問題。假設今天要加入不同的加速方式，只需要擴充加速的 Class 即可，並不會對原有程式造成任何影響。

### Source Code

https://github.com/YiTingLee/Design-Pattern/blob/main/strategy-pattern/index.ts
