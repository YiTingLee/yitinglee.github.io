---
id: kubernetes-intro
title: Kubernetes系列文 - 基礎元件介紹 (一)
description: "聊聊Kubernetes的基礎元件"
slug: "kubernetes-intro"
date: "2022-09-04T02:00:00.000+0800"
template: "post"
draft: false
category: "Kubernetes"
tags:
  - "Kubernetes"
socialImage: ""
---

在這篇文章中我們會聊到

- Kubernetes 基本介紹
- Application 運行的歷史
- Worker Node 與 Master Node 介紹

## Kubernetes 基本介紹

Kubernetes 又稱 K8S (因為 K 與 S 之間有 8 個字母)，是 Google 於 2014 年首次公開發佈，並於 2015 年發布正式版的一套開源軟體。Kubernetes 是一套能夠進行自動化部署、擴展與容器管理等的系統。

簡單來說開發者只需要撰寫 yaml，Kubernetes 就會幫助我們把 Application 部署到不同的機器上，並根據機器狀態和 Pod 狀態隨時進行調節，讓工程師可以省去麻煩的人工部署與維運。

:::tip My tip

如果還不懂什麼是 Pod 的話，可以先把 Pod 想像成 Container 或是 Applicatoin

:::

#### Kubernetes 到底能幫忙什麼

- 把 Application 部署到任何機器上
- 將外部流量轉入到指定的 Pod 中
- 偵測 Pod 的健康狀態，隨時根據情況進行 Pod 重啟
- 偵測流量與資源負載(CPU/Memory Resource 等)變化，自動擴展 Pod/Node 數量

## Application 運行的歷史

在正式開始介紹 Kubernetes 的基礎元件之前，我們先來講古，聊聊怎麼從單體架構慢慢演變成目前的 Kubernetes 生態。

![Environment-History](/images/kubernetes-intro/environment_history.png)

#### Traditional Environment

這是一個沒有雲端的時代，所有 Server 都是實體伺服器。那個年代大部分的 Application 都是採取 JSP 的伺服器架構(SQL query 與 html 都黏在一起的可怕年代 XD)，搭配其他的 Service (Process)並透過下 CLI 或者 RPC 的方式進行溝通來完成服務。

可想而知，在一台機器上會跑非常多的 Application 並且都共享同一台機器的硬體資源，如果其中一個 App 的 loading 比較重的時候，該 App 就會佔比較多的硬體資源，其他的 App 就會因為搶不到資源而被影響。如果開多台實體伺服器把不同的 Application 放到不同 Server 上，也會遇到硬體資源浪費的問題，總之非常難做到妥善且有效率的分配硬體資源。

應該很多人都沒有經歷過這個時代(我也沒有，很幸運我只有經歷過 VM 時代)，但還是可以把這種部署機器的方式對比成自己本地的電腦，想像一下你再開發的時候，也是需要在你本地的電腦把所有的 Application 與相關的 library 都裝起來，差別只是之前的架構是跑 Production 的產品而已。

#### Virtualized Environment

為了解決硬體資源分配的問題，在實體機器上裝 VM 的方式就開始慢慢興起。VM 允許在同一台實體機器上安裝多台完整的虛擬機器，並且每一台虛擬機都是獨立的，都各自擁有自己的作業系統與 File System。如上圖所示，VM 的架構中會有一層 VM Hypervisor 負責分配硬體資源並分配給不同的虛擬機器，透過此方式解決傳統機器中搶奪硬體資源的問題。

每一台虛擬機器上都必須要安裝完整的作業系統，某種程度上也是一種硬體資源的浪費，所以後來出現了 Container。

#### Container Environment

為了解決 VM 內必須裝完整 OS 所造成資源浪費的問題，docker 就出現了！docker 共用了實體機器的 Linux 內核，使得跑在 docker engine 上的 container 不需要額外安裝 OS 就能擁有阻隔環境的效果，省掉了大量的硬體再處理 OS 的資源，並且也擁有自己的 file system，用起來的感覺就像在 VM 裡面使用一樣。除此之外，docker/container 還擁有更小的模組特性，快速啟動關閉的特性，相同硬體資源可以比 VM 的方式多 5 到 10 倍的容器數量。並且 container 的特性也非常適合 microservices 的設計方式。所以在 2014 年起 Docker 開始快速崛起！

#### Kubernetes Environment

在 docker 崛起後，馬上就開始面臨如何管理在不同機器上的 container 問題。docker swarm + docker-compose 就出現了，但由於是比較早期出的產品，對比 Kubernetes 來說還是有很大的局限性。例如沒有跨 Node 的數據儲存概念(可以對比 Kubernetes 的 etcd)等，接著就開啟了大 Kubernetes 的時代。

## Kubernetes Cluster

Kuberentes Cluster 是一群機器的集合，由一個 Master Node 與數個 Worker Node (GKE 的上限是 15000 個 Node per cluster)所組成的。通常一個 Cluster 就會包含整個產品或全部服務的環境(當然有 multi-cluster 的環境，但基礎篇我們先不談)。

![Master-vs-Worker-Node](/images/kubernetes-intro/master-vs-worker-node.png)

## Master Node

Master Node 就是整個 Kubernetes 的指揮中心，負責控制或管理所有的 Worker Node 與服務(其實就是掌管所有的事)。其中包含掌控所有 API 的 kube-apiserver，儲存所有 cluster config 與數據的 etcd，負責分配 Pod 到各個 WorkerNode 的 kube-scheduler，以及監控與執行所有 Controller 物件的 kube-controller-manager。

#### kube-apiserver

kube-apiserver 提供整個 Cluster 的 RESTful API，其中包含 Pod 或 Node 狀態變更等。我們從 kubectl 這個 CLI 下的命令也都是打到 kube-apiserver 來處理。主要功能有

- 提供整個 Cluster 的 API
- 提供 Worker Node 之間溝通的管道
- 僅能通過 kube-apiserver 修改或讀取 etcd 內的資料

#### etcd

[etcd](https://github.com/etcd-io/etcd)本身是個 open source，是一個同時兼具一致性與高可用性的 key-value `群集`資料庫。由於高可用性的緣故，Kubernetes 選用 etcd 來作為 Master Node 上儲存數據的資料庫。主要用來保存網路配置與物件狀態資訊等。這邊的物件幾乎包含所有抽象元件(pod / deployment / secret / role / service 等)。

#### kube-scheduler

kube-scheduler 的主要功能負責將一個新的 Pod 根據硬體資源的狀態分配到一個適合的 Node 中。但 scheduler 其實是可以聊到很深的，它能夠根據需求進行客製化的 scheduling 設定與調整，未來進階我們再來討論。

#### kube-controller-manager

kube-controller-manager 是負責執行所有的 controller 物件的主要處理者，常見的 Controller 物件有 NodeController、ReplicationController 與 ServiceController 等。舉例來說當今天 Node 因意外停機時，kube-controller-manager 就會要求該 Node 重啟，或者啟動一台新的 Node 來符合該 NodeController 所要求的硬體資源。ReplicationController 也同理。

## Worker Node

一個 Worker Node 對應到的就是一台實體的機器，這些實體的機器可以是不同等級的機器，舉例來說，一個 Worker Node 可以是一個小的 Raspberry Pi，也可以是非常強的 GPU 機器。Worker Node 也是在 Kubernetes 中真正負責運行 Pod 的機器，可以說是運行機器的最小單位。

Worker Node 上主要有三種元件 kubelet、kube-proxy、Container Runtime

#### kubelet

kubelet 是 Worker Node 上最重要的服務，主要的功能有

- 監控 Pod 與該 Node 的狀態，並通知給 kube-apiserver
- 定期的跟 kube-apiserver 要 Pod 的 Spec，並保證該 Node 的 Pod 都有照著 Spec 執行 (這些規則可能來自於 kubernetes 的 yaml)

#### kube-proxy

kube-proxy 是跑在 Worker Node 上的一個 Network Proxy，kube-proxy 會監控 kube-apiserver 中關於 service 與 node 的資源變化。並將外部流量打到指定的 Pod 中。

#### Container Runtime

真正運行 Container 的地方，目前 Kubernetes 已經不支援 docker runtime 了。目前支援的有 [CRI-O runtime](https://github.com/cri-o/cri-o) 與 [containerd](https://github.com/containerd/containerd)。

## 結論

這篇只有簡單介紹了 Application 運行在機器上的歷史與基本的 Kubernetes 元件。當初我剛開始在學習 Kubernetes 的時候也是從這些 Master Node 與 Worker Node 開始看起，但第一次讀的時候並沒有看懂，反而是後面章節教的抽象元件( Pod / ReplicaSet / Deployment / Service 等)比較容易理解。所以如果這篇基本元件看不懂的建議抽象元件搞懂後，再回來複習這篇，會有 `哦！原來底層是這樣跑的！`的感覺。

即便不了解這些基本元件的原理與功能，只要知道 Kuberentes 會有相關的元件幫你做這些事情(同步 Pod 狀態或確認 Pod 會照著 Spec 執行等)，對於後續學習高階的抽象元件不會有太大的阻礙。
