---
id: kubernetes-service
title: Kubernetes系列文 - Service相關抽象元件介紹 (三)
description: "聊聊Kubernetes Service相關的抽象元件"
slug: "service-component"
date: "2022-09-19T02:00:00.000+0800"
template: "post"
draft: false
category: "Kubernetes"
tags:
  - "Kubernetes"
  - "Network"
socialImage: ""
---

在這篇文章中我們會聊到

- Label 基本介紹
- Annotation 基本介紹
- Service 基本介紹
- Ingress 基本介紹

## Label 基本介紹

Label 是一種以 Key-Value 形式並貼在元件上的一種屬性，主要的目的是讓`開發者`與`Kubernetes`本身能夠依照 Label 來快速地尋找一群功能相近的元件。這些元件可以是 Pod 或 Node 等任何 Kubernetes 的抽象元件。簡單來說就是把 Pod 貼上相對應的標籤，之後讓 Service 或者 Deployment 能夠快速的找到這群一樣功能的 Pod，然後進行管理。

Label 的特性有

- Key Value 的形式
- Label 能夠清楚地把不同功能或不同種類的 Pod 做相對應的群組分類
- 每個元件 (Node/Pod)都可以擁有多個 Label
- 相同的元件的 Label 也不需要擁有相同的 Label
  - 例如同樣都是 api pod, 一個可以是`env: prod`, 另一個則可以是`env: QA`
- 透過 Label Selector 可以把指定 Label 的元件都一次找出來

假設我們今天啟動了 4 種不同的 Deployment 而且每個 Deployment 都有各自的 replica 數量的時候，我們來想像一下，從 Pod 角度的俯視圖會長怎樣。

:::tip Pod 的命名規則

Deployment 建立出來的 Pod 的命名方式為{DeploymentName}-{ReplicaSetHashId}-{UniqueId}。

舉例來說 frontend-65c6dc398-334b1

:::

![WithoutLabel](/images/service-component/withoutlabel.png)

如上圖，我們只能從 Pod 的名稱來辨別這個 Pod 是什麼服務，也完全沒有 Group 的概念，想像一下如果我們今天有幾百幾千個 Pod 的時候，無論是開發者還是 Kubernetes 都是難以對這些 Pod 進行管理。

接著我們看看當我們加上 Label 後的效果怎麼樣。

![Label](/images/service-component/label.png)

這邊我只是用功能當 Label 作為範例，依此來區分每個 Pod 的類型。透過這些 Label 我們可以把 Pod 快速地依照功能或特性分成不同的群組，接著能透過 Label Selector 的方式直接找到一群相對應的 Pod。在真實的產品環境中，常見的 Label 範例還有以下這些。

- app: api/user-api
- env: Prod/QA/Staging
- tier: frontend/backend

:::danger Label 使用提示

不要再 Label 中使用不是用於識別的數值，這些非結構化(json)的數值請使用 Annotation。例如: `PodBasicInfo: {"image": nginx, "imageVersion": "1.7.4", "appVersion": "0.0.1"}`

:::

:::tip Label 實戰小提示

Label 也常常用於產品環境的 Debug，假設今天 Prod 上有一個 api pod 壞了，我們又無法馬上修正的時候，我們可以直接幫他貼上 Bug Label，並把它從 Service 中拿掉，之後有時間再回來看這個 Pod 是出了什麼事。這樣可以避免重啟 Pod，當下 Bug 環境會消失的問題。

:::

#### Label Selector

Kuberentes 中的抽象元件如 Service 或是 Deployment 其實都是透過 Label Selector 在決定選擇哪一類型的 Pod。Label Selector 目前常見的有兩種下條件的方式。

- 完全相等 (選擇 app 標籤為 api 的所有 Pod)

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  type: ClusterIP
  selector: # 選擇app標籤為api的所有Pod
    app: api
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8000
```

- Label 表達式 (選擇 app 標籤為 nginx 且 component 的 label 必須要是 frontend 的所有 pod)

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

## Annotation 基本介紹

Annotation 跟 Label 幾乎是一樣的東西，都是以 Key-Value 的形式在替元件貼標籤，但 Annotation 更像是給開發者看的。換句話說 Annotation 的目的是單純替元件留下一些紀錄如作者資訊或者維護的部門等。而 Label 與 Annotation 最大的差別就是 Kubernetes 並不會去讀 Annotation 相關的資料。

Annotation 的特性有

- 用來放一些非分類功能的資訊，例如 Author/Version/Pod restartAt 等
- 跟 Label 的最大差別就是 Annotation 真的就是放一些給開發者看的補充資訊而已
- 並沒有 Annotation Selector 這種東西

## Service 基本介紹

再講 Service 之前，我們先想像一下我們怎麼跟真正提供功能的 Pod 進行溝通。

![WithoutService](/images/service-component/withoutService.png)

:::danger Tip

外部的流量是沒辦法直接打入 Cluster 內部的 IP 或 Pod，不過這邊為了講解方便我們先假設可以直接打進去，或者想像成 Cluster 內部的流量。

:::

那這樣的溝通方式會產生哪些問題

- 我只是想打個 API，怎麼會有那麼多 Pod 的 IP 要記
- Pod 的 IP 並不是固定的，每次的 Pod 重啟後，IP 都會重新分配
- 沒有 Load Balance 的概念

那有了 Service 後我們怎麼跟 Pod 溝通。

![Service](/images/service-component/service.png)

:::danger Tip

再提醒一次外部的流量是沒辦法直接打入 Cluster 內部的 IP，等等會接著介紹 Service 怎麼把流量打進去。

:::

由於這些問題所以 Kubernetes 非常貼心的幫我們設計了 Service，簡單來說如果我們要跟某一種 Pod 溝通，我們只需要跟他的 Service 溝通就好，他會自己跟 Pod 們進行溝通，並提供了 Load Balance 的功能，也就是說我們不用煩惱 Service 會幫我們把流量轉發到哪個 Pod，他自己會處理。

更精確來說，一個 Service 就是提供一個服務，讓開發者不需要去考慮 Kubernetes 內部的網路或 Node 問題，我們也不需要去知道 Pod 的內部 IP 是哪一些，我們只需要跟 Service 溝通，Service 都會幫我們自動轉發到相對應的 Pod，所以這些服務本身是由一群相同功能的 Pod 所提供。

Service 提供三種不同的種類 ClusterIP/NodePort/LoadBalancer，這三種 Service 都很常使用且各自有適用的場景。

#### ClusterIP

ClusterIP 是 Service 預設的服務類別，啟動 ClusterIP 這個 Service 時，Kubernetes 會分配一組 VirtualIP 給這組 Service。Cluster 內部的 Pod 可以透過這組 Virtual IP 與服務直接進行溝通。

ClusterIP 的特性有

- 用於 Kubernetes 內部的網路溝通 (外部流量訪問不到 ClusterIP)
- 啟動時會被分配到一組固定的 VirtualIP
- 可以視為是一組功能相同的 Pod 的服務，省去與 Pod 個別溝通的困擾
- Kubernetes 會使用 service 名稱生成內部的 DNS (例如可以於內部網路呼叫 http://api-server)

![ClusterIP](/images/service-component/clusterip.png)

如上圖所示，API-Server Service 就是代表 api-server 的服務。User-Server Service 則代表 user-server 這組 Pod 的服務。假設我們今天要從 api-server B 打 request 到 user-server 去建立一個新 User。

- api-server B 打 request 到 http://user-server/create/user
- User-Server 收到 request 後會把 request 打到任一的 user-server 的 8080port (根據 yaml 設定)

這邊提供一個建立 ClusterIP 的範例。

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: api-server
spec:
  type: ClusterIP
  selector:
    app: api-server
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8000
```

#### NodePort

到目前為止，我們已經可以透過建立 Deployment 與 ClusterIP Service 來進行內部網路的溝通。但 ClusterIP 是無法讓外部流量進行訪問，NodePort 就是要解決這個問題。

NodePort 是透過打開每個 Node 上的指定 Port 來讓外部的流量直接打進 Cluster，舉例來說啟動 NodePort 服務後可以從 Cluster 外部打`<NodeIP>:<NodePort>`的方式直接與 Service 進行溝通，接著流量進入 Node 後，NodePort 會幫你把流量轉入指定的 ClusterIP。總之 NodePort 其實是會啟動兩層服務(啟動 NodePort 本身與啟動一組 ClusterIP)來達成 Node 流量轉發。

NodePort 的特性有

- 可以讓外部流量進行訪問
- 底層是透過 ClusterIP 來進行流量到 Pod 的轉發
- 需要打開 Worker Node 上的指定 Port (default: 30000-32767)，不指定的話 Kubernetes 會隨機分配一個 port 給你

![NodePort](/images/service-component/nodeport.png)

我們一樣沿用剛剛的例子，當今天外部流量要打入 Cluster 內時，我們可以打任一台 Node。NodePort 會根據被 call 的 port 來決定把流量轉發到哪個 ClusterIP 上。(舉例: 30000 對應到 API-Server Service，30001 對應到 User-Server Service)。實際流程如下。

- 呼叫`http://<NodeIP>:30000/cars`
- Worker Node 會把這個流量轉發到 API-Server 的 Service 上
- API-Service 會把這個流量轉發到 api-server 上(可能是 api-server A 也可能是 api-server B)
- Pod 收到 Request 後處理完再進行返回

這邊提供一個 NodePort 的範例。

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: user-server
spec:
  type: NodePort
  selector:
    app: user-server
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8000
      nodePort: 30001
```

#### LoadBalancer (Cloud Provider)

開始之前我們一樣先想一下只用 NodePort 會有什麼問題。

- Client 要記一堆 NodeIP 與 NodePort
- Node 層級沒有做 Load Balance (如果大家都只固定打同一台 Worker Node，容易被打掛)

LoadBalancer 只有在使用 Cloud Provider(如 GKE 或 EKS)才可以使用，我們啟用 LoadBalancer 時，LoadBalancer 會幫我們把流量分配到每個 Node 上，藉此來達到 Node 層級的分散流量與減少一堆 IP entrypoint 的問題。LoadBalancer Service 底層其實啟動了三層服務(LoadBalancer + NodePort + ClusterIP)。

LoadBalancer 的特性有

- 由於是 Cloud Provider 提供，比較不容易被打掛，但也會產生額外付費
- Client 只需要記一個 LoadBalancer 提供的 IP
- 把外部流量轉發到`<NodeIP>:<NodePort>`上
- 提供 Node 層級的 Load Balance

![LoadBalancer](/images/service-component/loadbalancer.png)

我們一樣沿用剛剛的例子，當今天外部流量要打入 Cluster 內時，我們可以打 LoadBalancer。LoadBalancer 會自動把外部流量平均分配給每個 Node，接著會根據被 call 的 port 來決定把流量轉發到哪個 ClusterIP 上。(舉例: 30000 對應到 API-Server Service，30001 對應到 User-Server Service)。實際流程如下。

- 呼叫`http://<LoadBalancerIP>/cars` (唯一的 entrypoint)
- LoadBalancer 會把這個流量分配到隨機的 Worker Node 與指定的 NodePort 上
- Worker Node 會把這個流量轉發到 API-Server 的 Service 上
- API-Service 會把這個流量轉發到 api-server 上(可能是 api-server A 也可能是 api-server B)
- Pod 收到 Request 後處理完再進行返回

這邊提供一個 LoadBalancer 的範例。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-server
spec:
  type: LoadBalancer
  selector:
    name: api-server
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8000
      nodePort: 30000 # 不指定的話Kubernetes會隨機分配
```

:::danger 危險發言

Service 內的 LoadBalancer 真的是取的很爛的名字。由於是使用 Cloud Provider 提供的 LoadBalancer 來達成這項服務，所以取名叫 LoadBalancer。但實際上 ClusterIP 就提供 Service 與 Pod 之間的 Load Balance 功能。個人認為取名叫 LoadBalancer 會讓初學者誤會是不是只有 LoadBalancer 的 Service 才有 Load Balance 的功能。

:::

## 結論

這篇主要介紹了 Label 與 Service 相關的抽象元件，到目前為止我們總共介紹了部署 Pod 的 Deployment，網路相關的 Service 等。基本上這些已經涵蓋了最常用的 70%元件了。大家已經可以透過這些元件部署出一個完整的環境了。舉例來說我們要部署一個 blog，我們可以透過 deployment 建立前端的 nginx webserver 與後端的 api server，透過 Service (LoadBalancer 或 NodePort)來串連 client 端 nginx 與 api server 的網路流量 (Database 的部分我們先跳過 XD，後續文章會接著介紹到)。雖然我的文章大部分都在講解觀念，但學習的過程中還是建議多多透過 minikube 或 kind 等 local 的 kubernetes 環境來練習，實際確認網路的流量怎麼流對學習會很有幫助。
