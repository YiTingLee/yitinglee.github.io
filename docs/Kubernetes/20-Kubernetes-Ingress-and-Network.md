---
id: kubernetes-ingress-and-networks
title: Kubernetes系列文 - Ingress抽象元件與Networks介紹 (四)
description: "聊聊Kubernetes Ingress抽象元件與Networks"
slug: "ingress-and-networks"
date: "2022-10-03T02:00:00.000+0800"
template: "post"
draft: false
category: "Kubernetes"
tags:
  - "Kubernetes"
  - "Network"
  - "Ingress"
socialImage: ""
---

在這篇文章中我們會聊到

- Ingress 基本介紹
- Kubernetes Network 原理

## Ingress 基本介紹

上一篇我們介紹了三種常用的 Service，其中也包含了可以讓外部流量流進 Cluster 內部的 NodePort 與 LoadBalancer，我們可以想像一下無論是 LoadBalancer 還是 NodePort 都會面臨到一個問題是當 Service 越來越多的時候，Service 曝露出來的 Port 就會越來越多，我們也就需要針對每個 Service 的 Port 進行管理。可想而知我們需要一個元件來替我們解決這個複雜的問題。

我們來複習一下 Service 的架構圖。

![Service](/images/networks/service.png)

從圖中可以看出當 Service 越來越多的時候，我們就必須要管理 Port 的對應關係，這些 Port 的對應關係也都四散在各個 yaml 檔案內，而且 service entrypoint 也非常多。

:::danger 危險發言

除了內部的 microservice 以外，外部的 HTTP API 我真的沒有看過有人會打 `example.com:30001/api/users`。

:::

接著我們來看一下 Ingress 的架構圖。

![Ingress](/images/networks/ingress.png)

Ingress 的目的其實非常簡單，從圖中可以看得出來 Node 只需要一個統一的 Port 入口，就可以將流量傳遞到 Ingress 上，接著再根據 Url 的 Path 將流量傳遞到正確的 Service 上，直接解決掉了透過 Port 再決定要傳到哪個 Service 的問題。另外我覺得也可以直接把 Ingress 想像成是一台 nginx 在做 reverse-proxy，這樣理解上就會變得非常簡單。

這邊提供一個 Ingress 的 yaml 檔案

```yaml
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-exmaple
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/rewrite-target: /$1
spec:
  rules:
    - host: example.com
      http:
        paths:
          - path: /users/?(.*)
            backend:
              serviceName: users-server
              servicePort: 80
          - path: /auth/?(.*)
            backend:
              serviceName: auth-server
              servicePort: 80
          - path: /v2/users?(.*)
            backend:
              serviceName: users-v2-server
              servicePort: 80
```

:::tip Ingress-Controller

如果使用原生的 Kubernetes 的話需要自行安裝 Ingress Controller，簡單來說就是 Ingress 的 Implementation，最常見的就是[ingress-nginx](https://github.com/kubernetes/ingress-nginx)。如果是使用 EKS 或 GKE 的話都已經內建安裝好 Ingress Controller 了。

:::

## Kubernetes Network 原理

從上一篇到這篇都在討論 Kubernetes 網路怎麼運行，實際上為了理解方便我們省略掉了很多底層的機制，是時候來討論一下 Node 內部與 Node 間的網路底層是如何運作的。

### Pod 內部通訊

![NetworkingInPod](/images/networks/networkinginpods.png)

我們在前幾篇有提到 Pod 內部是共用同一個 Linux Network Namespace，所以在網路資源共通的情況下，我們是可以直接透過 localhost 加上 Port 的形式直接進行溝通，這些流量並不會流出去 Pod 以外的地方。

### Node 內部通訊

我們先解釋幾個名詞

- veth (Virtual Ethernet): 我們已經知道 Linux Network Namespace 可以把 Container 中的網路環境阻隔開來，但網路環境分開後又會面臨到無法直接通訊的問題，所以 Linux 就提供了 veth 讓兩個不同 namespace 的環境可以直接通訊。在 Kubernetes 中 veth 常用於 Node 與 Pod 之間的網路溝通。
- bridge: Linux bridge 是一個虛擬的網路橋接器，主要目的是讓不同網段的網路能夠直接通訊(例如 10.40.0.2 與 10.40.0.3)。cbr (custom bridge)是 Kubernetes 建立出來的 bridge。

![NetworkingInNode](/images/networks/networkingInNode.png)

假設 ContainerB 要與 ContainerC 溝通

- 流量從 ContainerB 透過 veth0 轉到 Node 上 (這邊的 ContainerB 與 Node 的 Network Namespace 不同，所以需要透過 veth0 進行溝通)
- 接著流量會被傳遞到 cbr0 中
- cbr0 會發現 10.40.0.3 是在同一個 subnetwork 底下，接著 cbr0 會將流量傳遞到 veth1
- veth1 再將流量傳遞到 ContainerC 的 Network Namespace 中

透過這些步驟，我們可以發現 Node 內的 Pod 之間在進行網路通訊時，流量是不會流出去 Node 外的。

### Node 間通訊 (Route Table)

接著我們要走出 Node 外的世界了，我們來解釋新名詞

- eth (Ethernet): 實體的網路接口，Node 是一台實體的機器，所有進出 Node 的流量都會通過這個 eth 來完成。
- Route Table: Route Table 實際上是長在 Router 上的一張表，該表紀錄著要前往某 IP 的話你的下一站是誰，流量只要 Router 根據 route table 規則轉發的話就會到達目的地。

![NetworkingBetweenNodes](/images/networks/networkingBetweenNodes.png)

假設 ContainerB 要與不同 Node 上的 ContainerC 溝通

- 流量從 ContainerB 透過 NodeA veth0 轉到 NodeA 上
- 接著流量會被傳遞到 NodeA cbr0 中
- NodeA cbr0 會發現 10.40.2.2 不是在同一個 subnetwork 底下，接著會將流量傳遞到 NodeA eth0
- 接著流量會根據 route table 的規則送到目標 NodeB 的 eth0
- 接著流量會被傳遞到 NodeB cbr0 上
- NodeB cbr0 在將流量傳遞到 NodeB veth0 上
- NodeB veth0 再將流量傳遞到 ContainerC 的 Network Namespace 中

:::tip My Tip

這邊講的是 Node 之間的通訊，但如果流量是從 ContainerB 送到外部網路其實也是一樣的原理，只是 Route Table 的 next hop 是指到外部的 Router 而已。

:::

## 結論

這篇主要延續上一篇的 Service，並介紹了更常與 Service 搭配使用的 Ingress，到目前為止 Kubernetes 網路相關的介紹應該已經告一段落了。基本上所有的流量包含內部通訊與外部通訊都介紹了一輪，再 Ingress 的加入後，API 的 Entrypoint 也會更符合真正產品的樣子。另外 Route Table 模式只是 Node 間通訊的其中一種方式，其他通訊方式還有包含 Flannel 和 Weave 等，之後進階篇我們再來一一介紹。
