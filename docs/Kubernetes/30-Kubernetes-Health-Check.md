---
id: kubernetes-health-check
title: Kubernetes系列文 - HealthCheck相關的抽象元件介紹 (六)
description: "聊聊Kubernetes HealthCheck相關的抽象元件"
slug: "healthcheck"
date: "2022-10-24T02:00:00.000+0800"
template: "post"
draft: false
category: "Kubernetes"
tags:
  - "Kubernetes"
  - "HealthCheck"
  - "Liveness Probes"
  - "Readiness Probes"
socialImage: ""
---

在這篇文章中我們會聊到

- HealthCheck 基本介紹
- Liveness Probes 基本介紹
- Readiness Probes 基本介紹
- Startup Probes 基本介紹

## HealthCheck 基本介紹

HealthCheck 顧名思義是透過檢查 Pod 或者 Container 的狀態，讓 Docker 或 Kubernetes 能夠即時的掌握 Container 的狀態，藉此達到即時的重新啟動 Container 或把 Pod 暫時從 Service 中移除，避免不健康或無法正常運作的 Pod 留在服務中而影響到系統服務。

舉個例子，雖然現在的 Container 都講求的是 stateless 的狀態，但實際情況上不免會有不小心儲存了一些資料以致於會有 memeory leak 的情況發生，又或者 application 本身使用到的 library 有一些 bug，導致放越久的 Container 記憶體會越來越大，接著這個 Container 的回應速度就越來越慢，最後就乾脆不回應了，最慘的就是 Container 不回應然後又不噴 stderr，這種情況 Kubernetes 或 Docker 並不會自動重啟 Container，因為根本無法得知這個 Container 是不是還在正常運作。所以我們需要透過 HealthCheck 讓 Kubernetes 明確的知道這個 Container 目前已經壞了，請幫我重啟它！

Kubernetes 提供了三種 probes 來處理不同情況的 Container 狀態

- Liveness Probes
- Readiness Probes
- Startup Probes

## Liveness Probes 基本介紹

Liveness Probes 是用來讓 Kubernetes 知道這個 Container 是不是還活著，如果死了的話 Kubernetes 會幫忙重啟 Container。活著的定義是這個 Container 是不是還能正確回傳資料，如果 Container 正常運行但沒辦法正常回傳資料，就會被判定為死了，並重新啟動。我們以 HTTP Server 來做舉例，Kubernetes 會定期的對 Container 發送一個 HTTP Request，然後根據回傳的結果判定 Container 的狀態。

還有一種情況是 Pod 內有兩個 Container，但其中一個活著一個死了，這種情況下 Kubernetes 會判定這個 Pod 目前無法工作，並重啟裡面的 Container 直到 Pod 可以正常運作。

:::tip Probes

所有的 Probes 都提供了 CLI, HTTP, TCP 與 gRPC 等方式，以下範例都是隨機提供，但其實 Probes 設定的方式都大同小異，歡迎到[官方文件](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)去找需要的 yaml 範例。

:::

這邊提供一個 Liveness 的範例

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
  labels:
    app: api-server
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-server
    spec:
      containers:
        - name: api-server
          image: api-server-image
          ports:
            - containerPort: 8000
          livenessProbe:
            httpGet:
              path: /healthz # 要檢查的HTTP Get Path
              port: 8000
            initialDelaySeconds: 30 # 設定Continaer啟動時，要隔多久再開始打做health check
            periodSeconds: 15 # 設定health check的頻率 (15秒打一次request)
            timeoutSeconds: 30 # timeout的時間
            successThreshold: 1 # 成功幾次才算Container活著
            failureThreshold: 3 # 失敗幾次才算Container死了
```

## Readiness Probes 基本介紹

Readiness Probes 是讓 Kubernetes 知道這個 Container 已經 Ready 可以開始接收流量了。舉個例子，有些時候 Container 可能暫時無法接收流量了，我們需要把他從 Service 的 load balancer 中移出，原因可能是他需要同步一些資料或還有 request 需要消化，等消化完後才可以繼續接收流量。這種情況下我們就可以透過 Readiness Probes 讓這個 Pod/Container 暫時不會被 Request 請求。

這邊提供一個 Readiness 的範例

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
  labels:
    app: api-server
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-server
    spec:
      containers:
        - name: api-server
          image: api-server-image
          ports:
            - containerPort: 8000
          readinessProbe:
            exec:
              command:
                - cat
                - /tmp/healthy
            initialDelaySeconds: 5 # 設定Continaer啟動時，要隔多久再開始打做health check
            periodSeconds: 5 # 設定health check的頻率 (5秒打一次request)
```

## Startup Probes 基本介紹

Startup Probes 是讓 Kubernetes 知道這個 Container 已經正常啟動了。Startup Probes 其實跟 Liveness Probes 中的 initialDelaySeconds 有點像，最大的用法差別是 Startup Probes 通常用於保護啟動時間比較長的 Container。

值得一提的是，如果有設定 Startup Probes 的話，Liveness 和 readiness Probes 會在 Startup Probes 成功後開始檢測。如果沒有設定 Startup Probes 的話，Liveness Probes 和 readiness 會在 initialDelaySeconds 後開始檢測。

:::danger Startup Probes

Startup Probes 在設定上一定要特別小心，有些 Container 本身可能比較大包，啟動需要比較久的時間，就需要根據實際情況設定比較多次的 failureThreshold。假設如果設定次數太少的話，可能會造成 Container 都一直無限的被判定為沒正常啟動，然後被殺掉，這樣就永遠都啟動不了這個 Pod。

:::

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
  labels:
    app: api-server
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-server
    spec:
      containers:
        - name: api-server
          image: api-server-image
          ports:
            - containerPort: 8000
          startupProbe:
            httpGet:
              path: /healthz
              port: liveness-port
            failureThreshold: 30 # 設定錯誤多少次會被判定為Container沒有正常啟動
            periodSeconds: 5 # 設定health check的頻率 (5秒打一次request)
```

## 結論

今天主要介紹了 HealthCheck 常用的三種 Probes，這三種 Probes 使用上都非常類似，但要達到的目的都不相同。因為很重要所以要再講一次 Probes 的使用會直接與 Kubernetes 的 Pod 生命週期與是否要轉入流量都有直接的關係，所以使用上一定要非常小心，設定錯了就會直接導致系統無法正常運作。雖然所有的抽象元件都是設定錯誤就會導致系統無法運行，但 Probes 更多情況是設定數值不準確而導致只有在上了 Production 或是高流量的時候才出現問題。
