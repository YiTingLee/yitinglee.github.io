---
title: Row-oriented vs Column-oriented Database
date: "2022-04-06T21:00:00.000+0800"
template: "post"
draft: false
slug: "row-column-database-intro"
category: "Database"
tags:
  - "Database"
  - "Optimization"
description: "聊聊Row-oriented與Column-oriented的介紹與使用場景"
socialImage: ""
---

在這篇文章中我們會聊到

- 什麼是 Row-oriented Database
- 什麼是 Column-oriented Database
- Row-oriented Database 的使用場景
- Column-oriented Database 的使用場景
- Postgres 內使用 Columnar index

## 什麼是 Row-oriented Database

我們常使用的 DBMS 如 MySQL/PostgreSQL/MSSQL 都是屬於 Row-oriented DBMS，顧名思義這些資料庫在儲存資料時都是把資料依 Record(所有 column) 視為一筆資料，並把這筆資料依照順序儲存在一起。

![Row-oriented](/images/row-column-database/row-oriented.png)

row-oriented 儲存方式的優點包含

- 適合擁有大量寫入需求的場景：想像一下當今天有一筆或多筆新的資料要寫入資料庫時，只要找到 Table 儲存資料的位置並把資料塞在最後面即可。
- 適合取整筆資料：因為資料都是以一整筆一整筆的方式儲存再一起，取得時候也只要去同一個地方就可以把整筆資料拉出來。

缺點並不難想像，因為這種儲存方式，當資料庫在搜尋某筆資料或計算某個欄位時，資料庫會把所有欄位都放到記憶體內，因此造成了許多不必要的資源浪費。舉個例，下面兩個 Query 在 Row-oriented database 是沒有差別的，因為資料庫在計算時都會把該筆的所有欄位都一併放到記憶體內。

```sql
SELECT id FROM users WHERE user_id = '...';
vs
SELECT * FROM users WHERE user_id = '...';
```

## 什麼是 Column-oriented Database

Column-oriented Database 也有人稱它為 Columnar Database，常見的資料庫有 AWS 版的 RedShift，GCP 版的 BigQuery，以及 Open Source 版的 ClickHouse 等。Column-oriented 資料庫也完全支援 SQL 語法，如果沒有研究他們的底層差異，Query 資料時可能不會感覺到有什麼不同。

Column-oriented 與 Row-oriented 的資料庫之間最大差異就是儲存方式完全相反。如下圖所示，Column-oriented DMBS 儲存時是將所有的 Column 都分開來看，並分別把 Column 儲存在檔案系統內不同的地方。

![Column-oriented](/images/row-column-database/column-oriented.png)

column-oriented 儲存方式優點包含

- 適合壓縮(檔案較小)：由於已經根據 Column 把不同資料型態的資料都分開來儲存及處理，這代表著每次儲存前的壓縮都只需要處理相近的資料格式，這種特性對於資料壓縮是非常有效果的。(舉個例子，大多的壓縮方式如 Huffman Coding 在編碼前都會先計算該文字出現的次數來壓縮，這意味著出現越多次的資料可以被壓縮的碼數更少，也就是說資料越分歧壓縮比就會越差）
- 適合億級資料計算：計算 sum/min/max 時 column-oriented DB 只會把該 query 內的條件 column 拿出來計算，這聽起來很合理，但如上面所說，row-oriented DB 並不是這樣運作，它會把所有"COLUMN"都掃過一遍，所以大大增加了許多的 IO 負擔。這樣的特性在資料量越大的時候感受會越明顯。
- 適合資料區間搜尋：例如搜尋某個日期或某個月份的所有資料。

目前聽起來 Column-oriented Database 好像很厲害，又快資料量又小，但 Column-oriented DB 也是有缺點的，缺點如下

- 不適合大量寫入：想下一下，每次有資料要寫入時，都要去找到所有 column 的儲存位置，把資料放進去並重新壓縮再存回去，遠低於 row-oriented 的效率。而且很明顯的 table 的 column 數量會影響寫入速度。
- 資料量小的時候不會有明顯的效能差異

## Row-oriented Database 的使用場景

目前絕大多數的 App 場景都是比較適合 Row-oriented Database 的。例如我們可能需要在 users 的 Table 中找到某一個位使用者的所有資料來組成 user profile 的頁面。該場景在搭配 Index 的使用後效能表現是非常優秀的，這樣的工作就不太適合使用 Column-oriented DB 來處理。

## Column-oriented Database 的使用場景

Column-oriented Database 更適合用於處理大數據及 BI 等資料分析相關的運算，由於這些場景有一個共通的特性就是要針對某個或某些 Column 進行大量的分析，不需要把所有的 Column 都拉出來跑過一遍。

另外也可以把 Row-oriented DB 內的不太會被更動的靜態歷史資料搬到 Column-oriented DB 進行儲存，會省下許多的資料空間，並且未來也容易拿來進行資料的分析。

## 怎麼這麼複雜，有沒有兩種特性全都要的資料庫

有的，MSSQL 早在 2012 年就導入了 columnstore index，也就是說如果對該 Table 下了這種 index 的話，這個 Table 就會以 column-oriented 的方式去做儲存，但有一個非常不便的缺點是下了該 index 後資料表就會變成 read-only, 不能進行更新或刪除資料的動作。

Postgres 的部分也有許多 Open Source 在開發相關的 Extension, 如[Zedstore](https://github.com/greenplum-db/postgres/tree/zedstore)及[cstore_fdw](https://github.com/citusdata/cstore_fdw)等，另外 Swarm64 DA 也有出付費版的 columnstore index。

## 結論

資料庫的選擇上與架構設計息息相關，況且資料庫也不是只有這兩種類型，還有 In-memory DB，time-series DB，NOSQL DB 等，與其硬要選一個來作為資料庫使用的話，我們應該要了解每種資料庫的使用場景，並依照不同的情境混合使用。

在一個大型系統中 Row-oriented DB 進行 OLTP 的相關操作，而 Column-oriented DB 就負責 OLAP 的相關操作，In-memory DB 負責處理 Cache 相關的操作等，這才是常見的架構設計模式。各自把自己的優點發揮出來，才能把效能最大化！
