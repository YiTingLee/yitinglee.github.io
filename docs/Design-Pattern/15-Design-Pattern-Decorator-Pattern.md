---
title: Decorator Pattern
date: "2020-11-07T23:15:00.000Z"
template: "post"
draft: false
slug: "design-pattern-decorator-pattern"
category: "Design Pattern"
tags:
  - "Design Pattern"
description: "簡單的飲料例子來解釋Decorator"
socialImage: ""
---

## 介紹

現在手搖飲料店開得越來越多，能夠點的手搖種類也相當多元，比方說綠茶珍珠、珍珠奶茶、椰果奶茶、仙草奶綠等等，每種配料都能隨意組合，所以 Post 機上的飲料管理肯定相當複雜，這種情況就非常適合使用裝飾者模式來處理。

若是直接硬幹的話，通常 Class 會長成 MilkTea、BubbleMilkTea 和 BubbleMilkGreenTea 等等，也就是說只要一種配料搭配一種茶類就必須多一個 Class。再來如果要兩倍珍珠的話，這設計方式只能在遇到需求的時候請程式設計師再加一個 Class，這種設計方式顯然是不好的。

簡單來說，裝飾者模式把上述配料當作裝飾者，而茶類的本體作為被裝飾者，可以想像成被裝飾者還是飲料的主體，而裝飾者只是在被裝飾者的身上加了某些效果及行為。

## 例子

- 我們模擬上面的例子
- 被裝飾者抽象類別: Beverage

```typescript
abstract class Beverage {
  description!: string;

  abstract getCost(): number;

  getDescription(): string {
    return this.description;
  }
}

```

- 各種飲料的實現

```typescript
class MilkTea extends Beverage {
  constructor() {
    super();
    this.description = "Milk Tea";
  }

  getCost() {
    return 50;
  }
}

class GreenTea extends Beverage {
  constructor() {
    super();
    this.description = "Green Tea";
  }

  getCost() {
    return 40;
  }
}
```

- 裝飾者抽象類別: CondimentDecorator

```typescript
abstract class CondimentDecorator extends Beverage {
  abstract getCost(): number;
  abstract getDescription(): string;
}
```

- 這邊我解釋一下為甚麼`getCost`和`getDescription`這兩個方法都必須被重新覆寫
  - 裝飾者的主要運作方式是在被裝飾者的前後增加某種行為或效果，由下方的 implement 可以看出覆寫後對`getCost`和`getDescription`增加的行為。

---

- 各種裝飾者的實現

```typescript
class Bubble extends CondimentDecorator {
  private beverage: Beverage;

  constructor(beverage: Beverage) {
    super();
    this.beverage = beverage;
  }

  getDescription() {
    return this.beverage.getDescription() + ', Bubble';
  }

  getCost() {
    return this.beverage.getCost() + 10;
  }
}

class Pudding extends CondimentDecorator {
  private beverage: Beverage;

  constructor(beverage: Beverage) {
    super();
    this.beverage = beverage;
  }

  getDescription() {
    return this.beverage.getDescription() + ', Pudding';
  }

  getCost() {
    return this.beverage.getCost() + 20;
  }
}
```

- 到目前為止我們主要實現了兩個 GreenTea, MilkTea 這兩個被裝飾者 Class, 和 Bubble, Pudding 兩個裝飾者的 Class。

---

- Main

```typescript
console.log("Start");
const beverage = new MilkTea();
console.log(beverage.getDescription());
console.log(beverage.getCost());

const bubbleMilkTea = new Bubble(new MilkTea());
console.log(bubbleMilkTea.getDescription());
console.log(bubbleMilkTea.getCost());

const powerTea = new Pudding(new Bubble(new Bubble(new MilkTea())));
console.log(powerTea.getDescription());
console.log(powerTea.getCost());
```

- Result

```typescript
TypeScript v3.3.3 Node.js v10 linux/amd64
Start
Milk Tea
50
Milk Tea, Bubble
60
Milk Tea, Bubble, Bubble, Pudding
90
```

- 可以由 Main 程式中看出裝飾者與被裝飾者如何合作
- 裝飾者做的事就是直接在被裝飾者身上加行為(不管裝飾者現在到底長怎樣)

## 優點

- 高彈性
- 達到物件與物件間鬆綁的效果
- 於程式執行期中使用合成來達到效果，而非編譯期達成。

## 缺點

- 裝飾者的小類別會非常多
- 初學者會認為相對複雜，容易迷失在物件與物件之間的關係。

## 結論

裝飾者模式的優缺點都相對明顯，若使用不當容易造成程式複雜且難以維護，但許多的程式 Library 中都能夠看到使用裝飾者模式的身影。

### Source Code

https://github.com/YiTingLee/Design-Pattern/blob/main/decorator-pattern/index.ts
