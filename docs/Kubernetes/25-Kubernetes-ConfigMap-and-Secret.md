---
id: kubernetes-configmap-and-secret
title: Kubernetes系列文 - Volume、ConfigMap與Secret相關的抽象元件介紹 (五)
description: "聊聊Kubernetes Volume、ConfigMap與Secret相關的抽象元件等"
slug: "configmap-and-secret"
date: "2022-10-17T02:00:00.000+0800"
template: "post"
draft: false
category: "Kubernetes"
tags:
  - "Kubernetes"
  - "Volume"
  - "ConfigMap"
  - "Secret"
socialImage: ""
---

在這篇文章中我們會聊到

- Volume 基本介紹
- 為什麼需要 Configuration
- ConfigMap 基本介紹
- Secret 基本介紹
- emptyDir 基本介紹
- hostPath 基本介紹

## Volume 基本介紹

用過 Container 的大家應該都知道每次 Container 重啟後 Container 內部的資料都會消失，又或者說每次重啟後 Container 都會恢復到 Image 最乾淨的狀態。如果我們的 Container 需要依賴某些不太會更動的檔案的話，我們可以選擇在 Build Docker Image 的階段就把這些檔案 build 到 image 中。但倘若這些資料是會隨著情況而改變的話，我們就需要透過 Volume 來幫助我們解決這個問題。

Kubernetes 提供了 Volume 來解決 Container 中無法保存資料的問題，簡單來說透過 Volume 我們可以將一份資料以檔案或環境變數的方式 mount 到 Container 內，這種方式使 Pod 因為任何原因壞掉時，新的 Pod 都可以透過 Volume 繼續使用同一份資料，完全不需要擔心資料消失的問題。另外 Kubernetes 提供了多種的 Volume 類型來因應各種不同的需求。其中幾種最常見的是

- ConfigMap (動態配置)
- Secret (動態配置)
- emptyDir (非永久性儲存)
- hostPath (非永久性儲存)

## 為什麼需要 Configuration

介紹 ConfigMap 之前我們先聊聊為什麼需要 Configuration。

無論是寫任何程式語言，大家肯定都有設定環境變數的經驗。通常都是把環境變數設定好後，然後在主程式裡面把這些環境變數讀進來，再根據環境變數的數值決定主程式要執行的 Flow 或邏輯。而這樣的一大包環境變數，我們就會根據 module 或是功能把它們視為是一組 config。透過 config 我們可以使環境上的資料與程式本身更彈性與更 decouple。

我們可以想一下為什麼我們需要這個東西，假設沒有設定 config 的情況下，我們可以把這些數值 hordcode 在程式碼裡面，程式執行完的結果還是一樣。但今天如果 Replica Database 突然懷掉了，我們需要把 Database 改成連線到備用的 Database 時，我們只需要把環境變數的 Database Host/User/Password 更改一下並重新讀取環境變數就可以正常工作了，過程不會超過 5 分鐘。但如果我們沒有設定環境變數，我們就需要改完 code 後重新跑 CICD 然後才能上版，過程時間就會取決於各專案的狀態，但肯定的是一定都比前者還慢上很多。

另外我們寫的程式很多情況下是會被配置到完全不一樣的環境上，舉例來說如果是 2B 的產品，根據不同公司的需求這個產品在執行環境上都會有自己的伺服器與資料庫等，身為開發端我們不太可能根據不同的公司就切不同的 git branch，這樣非常的沒有效率。所以我們可以透過 Config 幫我們把程式動態的對應到不同環境上而不動到程式本身。

## ConfigMap 基本介紹

ConfigMap 是 Kubernetes 提供的 Key-Value 形式的元件，用於儲存 Cluster 中不同環境下的 config，而這些 config 可以透過 Kubernetes 本身的配置達到動態的插入到 Pod 中的環境變數等。

ConfigMap 可以做到

- 儲存 Key-Value 形式的 config 數據
- 儲存以 File 為單位的 Config (例如 redis config file 或 nginx config 等)
- 將 Key-Value 形式的 config 插入到 Pod 環境變數中
- 透過 volume 的方式將 configMap 以 file 的形式 mount 進 container 內

這邊提供一個 ConfigMap 的範例

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-env
data:
  API_NAME: api-server
  DATABASE_HOST: "127.0.0.1"
  DATABASE_PORT: "5432"
  DATABASE_NAME: exmaples
  REDIS_HOST: "127.0.0.1"
  REDIS_PORT: "6379"
```

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: api-server
spec:
  containers:
    - image: api-server
      name: api-server
      envFrom: # 以環境變數的方式插入到container中
        - configMapRef:
          name: api-env
```

## Secret 基本介紹

Secret 是 Kubernetes 提供用來儲存敏感資料的元件，本身也是 Key-Value 的形式，但 Value 的部分會經過 base64 的編碼，常見的儲存數值可能是資料庫密碼或內部的 API Token 等。ConfigMap 與 Secret 在使用上並沒有太大差別，最大的差異就是前者儲存常見的 config，後者儲存較敏感的 config 而已。

:::danger Eric 的危險發言

很多人都會誤以為 Base64 是一種加密方式，這個認知是錯的。Base64 並非加密方式，只是一種在 linux 上常見的編碼方式而已，編碼的過程中也不會加入任何的 salt 等。也就是說任何人都可以把編碼後的 base64 碼進行解碼，所以設計時千萬不要使用 base64 來進行加密。

:::

這邊提供一個 secret 的範例

```yaml
---
apiVersion: v1
kind: Secret
type: Opaque
metadata:
  name: api-server-secret
data:
  DATABASE_PASSWORD: ZGF0YWJhc2UtcGFzc3dvcmQK
  API_TOKEN: YXBpLXRva2VuCg==
```

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: api-server
spec:
  containers:
    - image: api-server
      name: api-server
      volumeMounts: # 以volume的方式mount進container中
        - name: api-secret-volume
          mountPath: "/app/secret"
          readOnly: true
  volumes:
    - name: api-secret-volume
      secret:
        secretName: api-server-secret
```

## emptyDir 基本介紹

emptyDir 是一種暫時性的儲存空間，當 Pod 被建立在某個 Node 時，該 emptyDir 就會被建立起來並 mount 進該 Pod 裡面，而 Pod 內的 Container 可以盡情地對他進行讀寫。Pod 的運行期間該 emptyDir 都會一直存在，直到 Pod 被從 Node 上移除為止。也就是說 emptyDir 是有 lifecycle 的，這個 lifecycle 就相當於 Pod 的 lifecycle，在 Pod 沒有被移除之前，無論 Pod 內部的 Container 重啟幾次，Container 都會拿到這個 emptyDir 最新的資料。

emptyDir 可以達到的效果

- 提供一個在同個 Pod 中的多個 Container 的共用資料夾
- 提供一個給 Application 的暫時性空間(例如 api-server 的 cache 數據)

這邊提供一個 emptyDir 的範例

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: api-server
spec:
  containers:
    - image: api-server
      name: api-server
      volumeMounts:
        - mountPath: /cache # mount進這個位置
          name: cache-volume
  volumes:
    - name: cache-volume
      emptyDir: {}
```

## hostPath 基本介紹

hostPath 也是一種暫時性的儲存空間，顧名思義它是將 Node 上指定的 Path mount 進 Pod 的 Container 中。由於是 Node 上資料夾，可想而知 hostPath 的 lifecycle 就等於 Node 的 lifecycle，hostPath 這個 volume 只會隨著 Node 消失而消失。也就是說即便是該 Node 的 Pod 被刪除了或是重啟了，都不會影響到該 hostPath 內的所有資料。

這邊提供一個 hostPath 的範例。

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: api-server
spec:
  containers:
    - image: api-server
      name: api-server
      volumeMounts:
        - mountPath: /
          name: hostpath-volume
  volumes:
    - name: hostpath-volume
      hostPath:
        path: /data # 需指定Host上的Path
        type: Directory
```

## 結論

這邊文章主要聊到了 Kubernetes Volume 及一些常見的 Volume 的用法，即便是使用 Docker 時，Volume 都是一個相當常用的工具。相比 Docker Volume 與 Kubernetes Volume 他們的概念上是差不多的，只是 Docker 在 Volume 的管理上相對比較不嚴謹一點，然後種類上也沒有 Kubernetes 提供這麼多不同類型的 Volume。再來 ConfigMap 與 Secret 幾乎是最常使用的 Volume 之一，透過這些這兩個元件可以使我們的程式變得更加的彈性，安全性的部分也能透過 rbac 的方式阻擋所有開發者看到一些他們不該看到的敏感資訊。最後的最後我們這篇文章其實只提到了跟內部資料比較相關的類型，其實 Kubernetes 還提供了 NFS(Network FileSystem)和 Persistent Volumes 等的方式來支援外部的 storage，這些我們留到未來進階篇再來討論。
