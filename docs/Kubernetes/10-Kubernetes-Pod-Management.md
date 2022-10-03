---
id: kubernetes-pod-management
title: Kubernetes系列文 - Pod相關抽象元件介紹 (二)
description: "聊聊Kubernetes的抽象元件"
slug: "pod-management"
date: "2022-09-11T02:00:00.000+0800"
template: "post"
draft: false
category: "Kubernetes"
tags:
  - "Kubernetes"
socialImage: ""
---

在這篇文章中我們會聊到

- Container 基本介紹
- Pod 基本介紹
- 有 Container 為什麼需要 Pod
- 如何正確設計 Pod
- Replication Controller 基本介紹
- ReplicaSet 基本介紹
- Deployment 基本介紹
- Deployment 策略介紹

## Container 基本介紹

2022 的今天 Container 與 Docker 基本上已經是後端工程師基本必備的技能，無論是在開發的本地端或是產品端都會看到 Container
的身影。Container 的本質就是一個獨立環境的 Process，換句話說 Container 是一個擁有自己的網路與 File System 並且不受其他 Process 干擾的一個 Process，透過這些特性能使開發者在操作 Container 時感覺像在 VM 內操作一樣。

#### Docker 的底層怎麼做到這些事?

Docker 利用 Linux 的兩大核心技術完成 Conatiner 的實作。

![Docker Core](/images/pod-management/docker_core.png)

- Namespace: 用來阻隔 Process 的環境，不同 Namespace 下的 Process 不能互相讀取 Process 內的資源，且都可以有獨立的資源(如 User 或 Pid 等)。這邊可以理解成一個 Container 其實就是一個有自己 Namespace 的 Process。Linux 主要提供了六種 Namespace，User、Mint、Network、UTS、IPC、PID。
- Cgroup: 用來限制該 Namespace 下的所有 Process 總共可以使用多少 CPU、Memory 等。舉個例子，在 Docker 之前 Cgroup 最常用來限制某個 Process 可能只能跑到 90%的 CPU 資源，才不會導致一個 Process 搶了所有 CPU 資源而造成所有服務都無法正常使用的問題。

:::danger 危險發言

由於都是使用 Linux 核心技術，這也是為什麼 Windows 現在使用 WSL (Windows Subsystem for Linux) 才能有較完整的 Docker 支援的原因。

:::

## Pod 基本介紹

Pod 是 Kubernetes 環境中 Application 運行的最小單位，基本上 Pod 就是 Container 的集合，也就是說一個 Pod 應該最少包含一個或多個 Container。接著我們來看 Pod 有哪些特性。

- 一個 Pod 對應到的是一個 Application
- Pod 內的 Container 都一定會跑在同一個 Node 上 (Kubernetes 最小部署單位就是 Pod)
- Pod 內的 Container 可以直接使用 localhost 溝通 (共用同一組 Linux Namespace)
- 可以針對 Pod 內部的 Container 個別設定每個 Container 可使用的硬體資源 (CPM/Memory) (原理透過 Cgroup 實現)
- Pod 內的 Container 共用相同的網路與 Volume
- 不同的 Pod 之間都是獨立的運行環境
- 由於 Pod 允許多個 Container 所以非常適合 Sidecar Pattern

#### Multi Conatiners 的例子

這個例子 api-server 這個 Pod 內共有兩個 container (這是一個標準的 [Sidecar Pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/sidecar) 的例子)。這個 Pod 總共要求(request)了 0.5cpu 與 128Mib Memory，最多(limit)到 1 cpu 與 256 Mib Memory。

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: api-server
spec:
  containers:
    - name: api-sever
      image: image/api-server:v1
      resources:
        requests:
          memory: "64Mi"
          cpu: "250m"
        limits:
          memory: "128Mi"
          cpu: "500m"
    - name: log-aggregator
      image: image/log-aggregator:v2
      resources:
        requests:
          memory: "64Mi"
          cpu: "250m"
        limits:
          memory: "128Mi"
          cpu: "500m"
```

## 有 Container 為什麼需要 Pod

不知道大家有沒有想過這個問題，Kubernetes 為什麼不使用 Container 做為 Application 的最小單位，而是用 Pod 在對 Container 進行一層封裝。在 Production 環境中我們同時都會運行許多的 Worker Node，常常會有關係很緊密的 Container 出現，而這些 Container 都會需要跑在同一台 Worker Node 上，如果沒有 Pod 的情況下，所以 Kubernetes 就必須要針對這些情況進行特別的調度。

舉例來說我們目前有兩個關係緊密的 ContainerA 與 ContainerB 需要被放到 NodeA 內執行。這兩個 Container 各需要 0.5 CPU (總共 1 CPU)的硬體資源，而 NodeA 只剩下 0.5 CPU 可用。

- 首先我們會把 ContainerB 設定成 ContainerA 的 Dependency，讓調度者可以知道 Container AB 需要跑在同一個 Node 上。
- ContainerA 會被調度到 NodeA 上去運行
- 接著會發現 NodeA 上已經沒有資源可以跑 ContainerB 了，但 ContainerB 又只能跑在 NodeA 上。

接著就會必須面臨尷尬的狀態了。你可能會想說那我就把有 Dependency 的 Container 看成是一體就可以解決這個問題了，對，所以 Kubernetes 就發明了 Pod！

## 如何正確設計 Pod

接著我們來討論如何正確的設計 Pod，再次提醒無論 Pod 是由一個還是多個 Container 組成，我們應該都要把 Pod 想像成是一個 Application 。設計 Pod 的時候，我們可以先考慮一下幾個層面。

- Pod 內部的 Container 是不是共生關係(是的話就必須設計成同一個 Pod)
  - 例如 log-aggregator 這種需要依靠其他 Process 的服務就不該自己存在
- 從 Scaling 的角度來看，會不會這兩個 Container 需要一起被 Scale(是的話就必須設計成同一個 Pod)
  - 例如 api-server 與 redis 就不該一起被 Scale
- 在不同的主機分別跑兩個 Container，透過網路溝通的方式能不能正常運作(不是的話就必須設計成同一個 Pod)

:::tip My Tip

這邊只是提供一些容易思考的方向，正確的設計還是必須由真實環境與邏輯去判斷。

:::

## Replication Controller 基本介紹

假設我們對 Kubernetes 要求建立一個 Pod 之後，Kubernetes 會幫我們把 Pod 跑在 Cluster 中的其中一個 Node，接著如果 Node 出現意外壞掉後，Pod 就會跟著被關閉，然後就沒有然後了。Pod 只是規範一個 Application 組成的元件，Pod 元件並沒有保證任何運行狀態，也沒辦法同時 Scale 多個相同的 Pod。

Replication Controller (簡稱 RC)是用來管理 Pod，RC 保證 Pod 運行的數量一定會與使用者定義的相同，也就是說當意外發生 Pod 突然被終止時，RC 會啟動一個 Pod 來保證數量相同，反之多出來的 Pod 則會被 RC 刪掉。由於這個特性，儘管需求只需要建立一個 Pod，我們都應該使用 RC 或 Deployment 代為管理，而不是直接啟動 Pod。

```yaml
---
apiVersion: v1
kind: ReplicationController
metadata:
  name: nginx
spec:
  replicas: 3 # RC保證的Pod數量
  selector:
    app: nginx
  template:
    metadata:
      name: nginx
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx
          ports:
            - containerPort: 80
```

:::danger Replication Controller 已被 Deployment 取代

雖然現在已經沒什麼人直接操作 RC，大部分都改成 Deployment 來管理，但 RC 還沒有被 Kubernetes 棄用，所以我們還是需要有一些基本的了解。

:::

## ReplicaSet 基本介紹

ReplicaSet 是新一代被 Kubernetes 設計出來的元件。與 RC 一樣是用來管理 Pod 運行的數量，基本上 ReplicaSet 與 RC 本質上就是一樣的東西，想解決的問題也相同，被開發出來的目的就是拿來取代 RC。最大的差異有以下兩點。

- 基本上不會手動建立，由 Deployment 代為建立
- 支援更彈性的 Label Selector (我們下一篇會詳細討論 Label)

#### ReplicaSet vs Replication Controller Label Selector

RC 僅支援

```yaml
---
....
selector:
  app: nginx
....
```

ReplicaSet 支援更彈性的 Label Selector，只要符合 matchExpressions 的 Pod 都會被 ReplicaSet 納入管理。

```yaml
---
....
selector:
  matchLabel:
    app: nigix
  matchExpressions:
    - key: component
      operator: In
      values:
        - frontend
....
```

:::tip My Tip

Kubernetes 官方建議使用 ReplicaSet 取代 Replication Controller。[Reference](https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller/#alternatives-to-replicationcontroller)

:::

## Deployment 基本介紹

我們現在有了 ReplicaSet 幫我們管理 Pod 的數量，但以產品等級的部署需求來說還是遠遠不夠。在 DevOps 部署議題中 Rollout 與 Rollback 一直都是非常熱門的問題，最頭痛的問題不外乎就是系統升級中會不會需要停機的問題。用了 Kubernetes 後這些問題都迎刃而解，Deployment 都幫你完成，而且也不需要什麼複雜的設定。

Deployment 是一個更高階的抽象元件，透過 ReplicaSet 提供 Pod Scaling 的功能，且額外提供部署相關的功能。我們來看 Deployment 到底幫忙做了哪些事。

- 提供 Pod 管理與 Pod Scaling 功能 (透過 ReplicaSet)
- 提供版本的歷史，以便快速回到先前版本
- 提供不同策略的部署方式的 rollout 與 rollback

## Deployment 策略介紹

Deployment 主要提供兩種常見的部署策略。

#### Rolling Update Strategy (Zero-downtime)

Rolling Update 是一個 Zero-downtime 的策略，策略上就是終止部分舊版本的 Pod 並同時啟動新的 Pod，並將流量慢慢切到新版本的 Pod 上，重複這個行為直到 rollout 完成。我們用兩個 Pod1 與 Pod2 要換到兩個新版本的 Pod3 與 Pod4 來舉例。

- 圖 1: Pod 1 與 Pod2 正常的運行在 Node 上
- 圖 2: 停止 Pod2 並同時啟動 Pod3 (流量只有打到 Pod1)
- 圖 3: Pod3 正常運作後將流量同時打入 Pod1 與 Pod3 (這時 Pod1 與 Pod3 是不同版本，這邊需要特別注意版本上是否向前相容問題)
- 圖 4: 停止 Pod 1 並同時啟動 Pod4 (流量只有打到 Pod3)
- 圖 5: Pod4 正常運作後就 rollout 完成！(流量同時打入 Pod3 與 Pod4)

![Rolling Update](/images/pod-management/rollingupdate.png)

附上一個簡單的 Rolling Update 的 yaml 範例

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  minReadySeconds: 5 # Pod ready後等待5秒鐘
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1 # 最多可以建出多少"額外"副本
      maxUnavailable: 1 # 最多可以同時停止多少Pod
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx
          ports:
            - containerPort: 80
```

#### Recreate

Recreate 是一個會有短暫 downtime 的策略，策略上就是把目前所有舊版本的 Pod 都關掉，並啟動新版本的 Pod，但啟動新版本 Pod 的時間就是該 rollout 的 downtime 時間。Recreate 的優點就是速度很快，不用像 RollingUpdate 這樣慢慢切換。

![Recreate](/images/pod-management/recreate.png)

附上一個簡單的 Recreate 的 yaml 範例

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx
          ports:
            - containerPort: 80
```

## 結論

基本上 Kubernetes 就是一個蘿菠一個坑，遇到不同需求的時候基本上 Kubernetes 都會有相對應的元件可以使用。我們慢慢可以看得出來 Kubernetes 想幫忙處理所有跟機器與部署上所有繁瑣的事，這篇文章中提到的 Deployment 就幫忙解決了大部分部署會遇到的問題。之後的文章會提到更多的抽象元件！
