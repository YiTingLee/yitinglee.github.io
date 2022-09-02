---
title: Docker Image Minimization
date: "2021-07-17T17:00:00.000Z"
template: "post"
draft: false
slug: "docker-image-minimization"
category: "Docker"
tags:
  - "Docker"
  - "Optimization"
description: "Docker image減肥大作戰!!"
socialImage: ""
---

## 介紹

在上傳或下載 docker image 的時候，大家或多或少都應該有遇過 Timeout 或是上傳速度很慢等問題，更甚至有時候是把 docker image 拉到 IOT 裝置上面跑，先天條件上機器就無法容納沒減肥過的 docker image，而縮小 docker image 的大小是避免這些問題的方法之一，也是我們今天要做的主要實驗。

今天的實驗主要是使用 Nest 這個框架建立出來的 service 來做為我們縮小的主要對象。雖然是使用 Nest 作為範例，但這些方法和概念都可以適用在不同的專案上。

## 第一輪: 準備

用 Nest 建一個基本的專案吧

```shell
$ nest new nest-playground
```

我們會得到一個完整 Nest 的 App, 看起會像這樣
![Folder Structure](/images/docker-image-minimization/folder-structure.png)

接著用最基本的方法包成 docker image 吧

- nest-playground 的專案下建立 Dockerfile

```Dockerfile
FROM node:12

WORKDIR /app

COPY . .

RUN yarn install

EXPOSE 3000

CMD ["yarn", "start"]
```

- build docker image 指令如下

```shell
$ docker build -t nest-backend .
```

這樣 build 出來的 docker-image 總共使用了****1.6G****，比預想中大很多吧

#### 為什麼這麼大?

因為我們把整個 repo，node_modules，以及實際 build 出來的 js 都包在這包 image 內了

## 第二輪: 拿掉非必要檔案

#### 那怎麼辦?

這邊先把必要的程式留下來，其他非必要的檔案都拿掉，包含 source code，也就是說除了 build 出來的 dist 外其他檔案都不需要存在

- 把 Dockerfile 分成兩個 stage
  - stage1 負責 build code
  - stage2 則負責把 stage1 build 好的程式 copy 進去 stage2 內然後 run 起來

經過這些處理後，stage2(也就最後要 run 起的 image)內只會包含 dist 內容，任何 repo 內的資料都會被留在 stage1 裡面，並不會被放到 stage2 內，實作如下。

```Dockerfile
# STAGE 1

FROM node:12 AS build

WORKDIR /app

COPY . .

RUN yarn install

CMD ["yarn", "build:prod"]

# STAGE 2

FROM node:12

WORKDIR /app

COPY --from=build /app/package.json .
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["yarn", "start:prod"]
```

這邊為了將 node_modules 內沒使用到的東西拿掉，我們使用了 webpack 來處理，[Webpack Config](https://github.com/YiTingLee/NestAppMinimization/blob/master/webpack.config.js)在這邊。

這樣處理完的 docker image 剩下****919MB****

#### 感覺還是很大?

## 第三輪: 使用輕量化的 Node 版本 alpine

我們一般使用的 node image 是 Debian based 的，擁有完整的功能，大小約 650MB+，而 alpine 僅有維持運作最基礎的 OS 功能，甚至連 Python/gcc 都沒有，大小約 50MB+。使用輕量化的 node 並不是完全沒有後遺症，輕量化的 image 肯定就是拿掉了許多功能及 module，但在 image size 上是擁有很大的優勢。

```Dockerfile
# STAGE 1

FROM node:12-alpine AS build

WORKDIR /app

COPY . .

RUN yarn install

CMD ["yarn", "build:prod"]

# STAGE 2

FROM node:12-alpine

WORKDIR /app

COPY --from=build /app/package.json .
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["yarn", "start:prod"]
```

使用輕量版 Node build 完後的總大小是****90.5MB****

## 結論

這次的實驗大小的進度分別是 1.6GB -> 919MB -> 90.5MB，總共減少了 17X，當中除了 Dockerfile 在 Stage 上的操作外還有一些 webpack 的使用才能大幅度的減少 image 的大小。

這邊要再說一次，雖然今天的實驗主要是使用 Nest 這個框架做為我們的主要範例，但這些方法及概念都可以套用到不同的專案上，尤其是 frontend 的專案另外還可以使用 nginx 等輕量化的 web server 作為基底。

## Source Code

https://github.com/YiTingLee/NestAppMinimization
