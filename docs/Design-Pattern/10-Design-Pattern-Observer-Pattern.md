---
title: Observer Pattern
date: "2020-10-08T14:35:00.000Z"
template: "post"
draft: false
slug: "design-pattern-observer-pattern"
category: "Design Pattern"
tags:
  - "Design Pattern"
description: "Rxjs是什麼設計模式?"
socialImage: ""
---

## 前言

觀察者模式大家應該都不太陌生, 很多程式語言都已經有interface或是已經實踐observable的class了, 例如Java和javascript中的Rxjs等等。

## 介紹

我們用現在最流行的Youtube來解釋觀察者模式，Youtube上的訂閱方式如下
 - 觀眾對喜歡的youtuber按下訂閱按鈕
 - 當youtuber有新影片上架時，會主動通知有訂閱的觀眾
 - 一位youtuber可以同時被多位觀眾訂閱
 - 觀眾能隨時取消訂閱，也就不會收到youtuber的新影片通知

## 例子

 - 我們模擬上面的例子
 - Subject interface

```typescript
interface Subject {
  registerObserver(observer: Observer): void;
  removeObserver(observer: Observer):void;
  notifyObservers():void;
}

```

 - Observer

```typescript
interface Observer {
  update(newVideo: object): void;
}
```

 - Video: 這邊只是簡單寫個title

```typescript
interface Video {
  title: string
}
```

 - Youtuber

```typescript
class Youtuber implements Subject {
  observers: Array<Observer>;
  video: Video;

  constructor() {
    this.observers = [];
    this.video = { title: 'init' };
  }

  registerObserver(observer: Observer) {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer) {
    const index = this.observers.indexOf(observer);
    this.observers = this.observers.splice(index, 1);
  }

  notifyObservers() {
    this.observers.forEach(observer => {
      observer.update(this.video);
    });
  }

  setVideo() {
    this.video = { title: new Date().getTime().toString()};
    this.notifyObservers();
  }
}
```

 - User

```typescript
class User implements Observer {
  subject: Subject;
  constructor(subject: Subject) {
    this.subject = subject;
    this.subject.registerObserver(this);
  }

  update(video: Video) {
    this.display(video);
  }

  unsubscribe() {
    this.subject.removeObserver(this);
  }

  display(video: Video) {
    console.log('video:' + video.title);
  }
}
```

 - Main

```typescript
const youtuber = new Youtuber();
const user = new User(youtuber);
const user2 = new User(youtuber);
const user3 = new User(youtuber);
youtuber.setVideo();

user2.unsubscribe();
console.log('user2 unsubscribe');
user3.unsubscribe();
console.log('user3 unsubscribe');
youtuber.setVideo();
```

 - Result

```typescript
TypeScript v3.3.3 linux/amd64
video:1563710179580
video:1563710179580
video:1563710179580
user2 unsubscribe
user3 unsubscribe
video:1563710179581
```

 - 可以由結果看到一開始使用者都訂閱了youtuber, 所以當youtuber上架新影片時(`youtuber.setVideo()`), 三個user都收到了通知(`video:1563710179580`), 接著user2, user3退訂了之後, youtuber就只發通知給訂閱中(沒退訂)的user而已

## 優點

 - 完美的切割程式碼中會變動的部分，將固定與會變動的部分分開
 - 定義了通知的傳遞機制
 - 讓物件與物件間達到鬆散 (loose coupling)

## 結論
 
 - 我們這次介紹的是Push Model，另外還有Pull Model下次有時間再介紹，但基本上概念是相同的，差別僅在於Observer讀取的方式而已。

### Source Code
https://github.com/YiTingLee/Design-Pattern/blob/main/observer-pattern/index.ts