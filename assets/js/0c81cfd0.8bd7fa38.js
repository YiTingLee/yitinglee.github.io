"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[939],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>c});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var u=a.createContext({}),s=function(e){var t=a.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},d=function(e){var t=s(e.components);return a.createElement(u.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,u=e.parentName,d=i(e,["components","mdxType","originalType","parentName"]),p=s(n),c=r,b=p["".concat(u,".").concat(c)]||p[c]||m[c]||o;return n?a.createElement(b,l(l({ref:t},d),{},{components:n})):a.createElement(b,l({ref:t},d))}));function c(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,l=new Array(o);l[0]=p;var i={};for(var u in t)hasOwnProperty.call(t,u)&&(i[u]=t[u]);i.originalType=e,i.mdxType="string"==typeof e?e:r,l[1]=i;for(var s=2;s<o;s++)l[s]=n[s];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}p.displayName="MDXCreateElement"},619:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>l,default:()=>m,frontMatter:()=>o,metadata:()=>i,toc:()=>s});var a=n(7462),r=(n(7294),n(3905));const o={title:"Row-oriented vs Column-oriented Database",date:"2022-04-06T21:00:00.000+0800",template:"post",draft:!1,slug:"row-column-database-intro",category:"Database",tags:["Database","Optimization"],description:"\u804a\u804aRow-oriented\u8207Column-oriented\u7684\u4ecb\u7d39\u8207\u4f7f\u7528\u5834\u666f",socialImage:""},l=void 0,i={unversionedId:"Database/Row-oriented-vs-Column-oriented",id:"Database/Row-oriented-vs-Column-oriented",title:"Row-oriented vs Column-oriented Database",description:"\u804a\u804aRow-oriented\u8207Column-oriented\u7684\u4ecb\u7d39\u8207\u4f7f\u7528\u5834\u666f",source:"@site/docs/Database/10-Row-oriented-vs-Column-oriented.md",sourceDirName:"Database",slug:"/Database/row-column-database-intro",permalink:"/Database/row-column-database-intro",draft:!1,tags:[{label:"Database",permalink:"/tags/database"},{label:"Optimization",permalink:"/tags/optimization"}],version:"current",lastUpdatedAt:1662134863,formattedLastUpdatedAt:"Sep 2, 2022",sidebarPosition:10,frontMatter:{title:"Row-oriented vs Column-oriented Database",date:"2022-04-06T21:00:00.000+0800",template:"post",draft:!1,slug:"row-column-database-intro",category:"Database",tags:["Database","Optimization"],description:"\u804a\u804aRow-oriented\u8207Column-oriented\u7684\u4ecb\u7d39\u8207\u4f7f\u7528\u5834\u666f",socialImage:""},sidebar:"defaultSidebar",previous:{title:"Vertical Scaling Postgres with Zero-downtime",permalink:"/"},next:{title:"Database Index",permalink:"/Database/database-index"}},u={},s=[{value:"\u4ec0\u9ebc\u662f Row-oriented Database",id:"\u4ec0\u9ebc\u662f-row-oriented-database",level:2},{value:"\u4ec0\u9ebc\u662f Column-oriented Database",id:"\u4ec0\u9ebc\u662f-column-oriented-database",level:2},{value:"Row-oriented Database \u7684\u4f7f\u7528\u5834\u666f",id:"row-oriented-database-\u7684\u4f7f\u7528\u5834\u666f",level:2},{value:"Column-oriented Database \u7684\u4f7f\u7528\u5834\u666f",id:"column-oriented-database-\u7684\u4f7f\u7528\u5834\u666f",level:2},{value:"\u600e\u9ebc\u9019\u9ebc\u8907\u96dc\uff0c\u6709\u6c92\u6709\u5169\u7a2e\u7279\u6027\u5168\u90fd\u8981\u7684\u8cc7\u6599\u5eab",id:"\u600e\u9ebc\u9019\u9ebc\u8907\u96dc\u6709\u6c92\u6709\u5169\u7a2e\u7279\u6027\u5168\u90fd\u8981\u7684\u8cc7\u6599\u5eab",level:2},{value:"\u7d50\u8ad6",id:"\u7d50\u8ad6",level:2}],d={toc:s};function m(e){let{components:t,...o}=e;return(0,r.kt)("wrapper",(0,a.Z)({},d,o,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"\u5728\u9019\u7bc7\u6587\u7ae0\u4e2d\u6211\u5011\u6703\u804a\u5230"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\u4ec0\u9ebc\u662f Row-oriented Database"),(0,r.kt)("li",{parentName:"ul"},"\u4ec0\u9ebc\u662f Column-oriented Database"),(0,r.kt)("li",{parentName:"ul"},"Row-oriented Database \u7684\u4f7f\u7528\u5834\u666f"),(0,r.kt)("li",{parentName:"ul"},"Column-oriented Database \u7684\u4f7f\u7528\u5834\u666f"),(0,r.kt)("li",{parentName:"ul"},"Postgres \u5167\u4f7f\u7528 Columnar index")),(0,r.kt)("h2",{id:"\u4ec0\u9ebc\u662f-row-oriented-database"},"\u4ec0\u9ebc\u662f Row-oriented Database"),(0,r.kt)("p",null,"\u6211\u5011\u5e38\u4f7f\u7528\u7684 DBMS \u5982 MySQL/PostgreSQL/MSSQL \u90fd\u662f\u5c6c\u65bc Row-oriented DBMS\uff0c\u9867\u540d\u601d\u7fa9\u9019\u4e9b\u8cc7\u6599\u5eab\u5728\u5132\u5b58\u8cc7\u6599\u6642\u90fd\u662f\u628a\u8cc7\u6599\u4f9d Record(\u6240\u6709 column) \u8996\u70ba\u4e00\u7b46\u8cc7\u6599\uff0c\u4e26\u628a\u9019\u7b46\u8cc7\u6599\u4f9d\u7167\u9806\u5e8f\u5132\u5b58\u5728\u4e00\u8d77\u3002"),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Row-oriented",src:n(5128).Z,width:"560",height:"169"})),(0,r.kt)("p",null,"row-oriented \u5132\u5b58\u65b9\u5f0f\u7684\u512a\u9ede\u5305\u542b"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\u9069\u5408\u64c1\u6709\u5927\u91cf\u5beb\u5165\u9700\u6c42\u7684\u5834\u666f\uff1a\u60f3\u50cf\u4e00\u4e0b\u7576\u4eca\u5929\u6709\u4e00\u7b46\u6216\u591a\u7b46\u65b0\u7684\u8cc7\u6599\u8981\u5beb\u5165\u8cc7\u6599\u5eab\u6642\uff0c\u53ea\u8981\u627e\u5230 Table \u5132\u5b58\u8cc7\u6599\u7684\u4f4d\u7f6e\u4e26\u628a\u8cc7\u6599\u585e\u5728\u6700\u5f8c\u9762\u5373\u53ef\u3002"),(0,r.kt)("li",{parentName:"ul"},"\u9069\u5408\u53d6\u6574\u7b46\u8cc7\u6599\uff1a\u56e0\u70ba\u8cc7\u6599\u90fd\u662f\u4ee5\u4e00\u6574\u7b46\u4e00\u6574\u7b46\u7684\u65b9\u5f0f\u5132\u5b58\u518d\u4e00\u8d77\uff0c\u53d6\u5f97\u6642\u5019\u4e5f\u53ea\u8981\u53bb\u540c\u4e00\u500b\u5730\u65b9\u5c31\u53ef\u4ee5\u628a\u6574\u7b46\u8cc7\u6599\u62c9\u51fa\u4f86\u3002")),(0,r.kt)("p",null,"\u7f3a\u9ede\u4e26\u4e0d\u96e3\u60f3\u50cf\uff0c\u56e0\u70ba\u9019\u7a2e\u5132\u5b58\u65b9\u5f0f\uff0c\u7576\u8cc7\u6599\u5eab\u5728\u641c\u5c0b\u67d0\u7b46\u8cc7\u6599\u6216\u8a08\u7b97\u67d0\u500b\u6b04\u4f4d\u6642\uff0c\u8cc7\u6599\u5eab\u6703\u628a\u6240\u6709\u6b04\u4f4d\u90fd\u653e\u5230\u8a18\u61b6\u9ad4\u5167\uff0c\u56e0\u6b64\u9020\u6210\u4e86\u8a31\u591a\u4e0d\u5fc5\u8981\u7684\u8cc7\u6e90\u6d6a\u8cbb\u3002\u8209\u500b\u4f8b\uff0c\u4e0b\u9762\u5169\u500b Query \u5728 Row-oriented database \u662f\u6c92\u6709\u5dee\u5225\u7684\uff0c\u56e0\u70ba\u8cc7\u6599\u5eab\u5728\u8a08\u7b97\u6642\u90fd\u6703\u628a\u8a72\u7b46\u7684\u6240\u6709\u6b04\u4f4d\u90fd\u4e00\u4f75\u653e\u5230\u8a18\u61b6\u9ad4\u5167\u3002"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sql"},"SELECT id FROM users WHERE user_id = '...';\nvs\nSELECT * FROM users WHERE user_id = '...';\n")),(0,r.kt)("h2",{id:"\u4ec0\u9ebc\u662f-column-oriented-database"},"\u4ec0\u9ebc\u662f Column-oriented Database"),(0,r.kt)("p",null,"Column-oriented Database \u4e5f\u6709\u4eba\u7a31\u5b83\u70ba Columnar Database\uff0c\u5e38\u898b\u7684\u8cc7\u6599\u5eab\u6709 AWS \u7248\u7684 RedShift\uff0cGCP \u7248\u7684 BigQuery\uff0c\u4ee5\u53ca Open Source \u7248\u7684 ClickHouse \u7b49\u3002Column-oriented \u8cc7\u6599\u5eab\u4e5f\u5b8c\u5168\u652f\u63f4 SQL \u8a9e\u6cd5\uff0c\u5982\u679c\u6c92\u6709\u7814\u7a76\u4ed6\u5011\u7684\u5e95\u5c64\u5dee\u7570\uff0cQuery \u8cc7\u6599\u6642\u53ef\u80fd\u4e0d\u6703\u611f\u89ba\u5230\u6709\u4ec0\u9ebc\u4e0d\u540c\u3002"),(0,r.kt)("p",null,"Column-oriented \u8207 Row-oriented \u7684\u8cc7\u6599\u5eab\u4e4b\u9593\u6700\u5927\u5dee\u7570\u5c31\u662f\u5132\u5b58\u65b9\u5f0f\u5b8c\u5168\u76f8\u53cd\u3002\u5982\u4e0b\u5716\u6240\u793a\uff0cColumn-oriented DMBS \u5132\u5b58\u6642\u662f\u5c07\u6240\u6709\u7684 Column \u90fd\u5206\u958b\u4f86\u770b\uff0c\u4e26\u5206\u5225\u628a Column \u5132\u5b58\u5728\u6a94\u6848\u7cfb\u7d71\u5167\u4e0d\u540c\u7684\u5730\u65b9\u3002"),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Column-oriented",src:n(9348).Z,width:"559",height:"169"})),(0,r.kt)("p",null,"column-oriented \u5132\u5b58\u65b9\u5f0f\u512a\u9ede\u5305\u542b"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\u9069\u5408\u58d3\u7e2e(\u6a94\u6848\u8f03\u5c0f)\uff1a\u7531\u65bc\u5df2\u7d93\u6839\u64da Column \u628a\u4e0d\u540c\u8cc7\u6599\u578b\u614b\u7684\u8cc7\u6599\u90fd\u5206\u958b\u4f86\u5132\u5b58\u53ca\u8655\u7406\uff0c\u9019\u4ee3\u8868\u8457\u6bcf\u6b21\u5132\u5b58\u524d\u7684\u58d3\u7e2e\u90fd\u53ea\u9700\u8981\u8655\u7406\u76f8\u8fd1\u7684\u8cc7\u6599\u683c\u5f0f\uff0c\u9019\u7a2e\u7279\u6027\u5c0d\u65bc\u8cc7\u6599\u58d3\u7e2e\u662f\u975e\u5e38\u6709\u6548\u679c\u7684\u3002(\u8209\u500b\u4f8b\u5b50\uff0c\u5927\u591a\u7684\u58d3\u7e2e\u65b9\u5f0f\u5982 Huffman Coding \u5728\u7de8\u78bc\u524d\u90fd\u6703\u5148\u8a08\u7b97\u8a72\u6587\u5b57\u51fa\u73fe\u7684\u6b21\u6578\u4f86\u58d3\u7e2e\uff0c\u9019\u610f\u5473\u8457\u51fa\u73fe\u8d8a\u591a\u6b21\u7684\u8cc7\u6599\u53ef\u4ee5\u88ab\u58d3\u7e2e\u7684\u78bc\u6578\u66f4\u5c11\uff0c\u4e5f\u5c31\u662f\u8aaa\u8cc7\u6599\u8d8a\u5206\u6b67\u58d3\u7e2e\u6bd4\u5c31\u6703\u8d8a\u5dee\uff09"),(0,r.kt)("li",{parentName:"ul"},'\u9069\u5408\u5104\u7d1a\u8cc7\u6599\u8a08\u7b97\uff1a\u8a08\u7b97 sum/min/max \u6642 column-oriented DB \u53ea\u6703\u628a\u8a72 query \u5167\u7684\u689d\u4ef6 column \u62ff\u51fa\u4f86\u8a08\u7b97\uff0c\u9019\u807d\u8d77\u4f86\u5f88\u5408\u7406\uff0c\u4f46\u5982\u4e0a\u9762\u6240\u8aaa\uff0crow-oriented DB \u4e26\u4e0d\u662f\u9019\u6a23\u904b\u4f5c\uff0c\u5b83\u6703\u628a\u6240\u6709"COLUMN"\u90fd\u6383\u904e\u4e00\u904d\uff0c\u6240\u4ee5\u5927\u5927\u589e\u52a0\u4e86\u8a31\u591a\u7684 IO \u8ca0\u64d4\u3002\u9019\u6a23\u7684\u7279\u6027\u5728\u8cc7\u6599\u91cf\u8d8a\u5927\u7684\u6642\u5019\u611f\u53d7\u6703\u8d8a\u660e\u986f\u3002'),(0,r.kt)("li",{parentName:"ul"},"\u9069\u5408\u8cc7\u6599\u5340\u9593\u641c\u5c0b\uff1a\u4f8b\u5982\u641c\u5c0b\u67d0\u500b\u65e5\u671f\u6216\u67d0\u500b\u6708\u4efd\u7684\u6240\u6709\u8cc7\u6599\u3002")),(0,r.kt)("p",null,"\u76ee\u524d\u807d\u8d77\u4f86 Column-oriented Database \u597d\u50cf\u5f88\u53b2\u5bb3\uff0c\u53c8\u5feb\u8cc7\u6599\u91cf\u53c8\u5c0f\uff0c\u4f46 Column-oriented DB \u4e5f\u662f\u6709\u7f3a\u9ede\u7684\uff0c\u7f3a\u9ede\u5982\u4e0b"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\u4e0d\u9069\u5408\u5927\u91cf\u5beb\u5165\uff1a\u60f3\u4e0b\u4e00\u4e0b\uff0c\u6bcf\u6b21\u6709\u8cc7\u6599\u8981\u5beb\u5165\u6642\uff0c\u90fd\u8981\u53bb\u627e\u5230\u6240\u6709 column \u7684\u5132\u5b58\u4f4d\u7f6e\uff0c\u628a\u8cc7\u6599\u653e\u9032\u53bb\u4e26\u91cd\u65b0\u58d3\u7e2e\u518d\u5b58\u56de\u53bb\uff0c\u9060\u4f4e\u65bc row-oriented \u7684\u6548\u7387\u3002\u800c\u4e14\u5f88\u660e\u986f\u7684 table \u7684 column \u6578\u91cf\u6703\u5f71\u97ff\u5beb\u5165\u901f\u5ea6\u3002"),(0,r.kt)("li",{parentName:"ul"},"\u8cc7\u6599\u91cf\u5c0f\u7684\u6642\u5019\u4e0d\u6703\u6709\u660e\u986f\u7684\u6548\u80fd\u5dee\u7570")),(0,r.kt)("h2",{id:"row-oriented-database-\u7684\u4f7f\u7528\u5834\u666f"},"Row-oriented Database \u7684\u4f7f\u7528\u5834\u666f"),(0,r.kt)("p",null,"\u76ee\u524d\u7d55\u5927\u591a\u6578\u7684 App \u5834\u666f\u90fd\u662f\u6bd4\u8f03\u9069\u5408 Row-oriented Database \u7684\u3002\u4f8b\u5982\u6211\u5011\u53ef\u80fd\u9700\u8981\u5728 users \u7684 Table \u4e2d\u627e\u5230\u67d0\u4e00\u500b\u4f4d\u4f7f\u7528\u8005\u7684\u6240\u6709\u8cc7\u6599\u4f86\u7d44\u6210 user profile \u7684\u9801\u9762\u3002\u8a72\u5834\u666f\u5728\u642d\u914d Index \u7684\u4f7f\u7528\u5f8c\u6548\u80fd\u8868\u73fe\u662f\u975e\u5e38\u512a\u79c0\u7684\uff0c\u9019\u6a23\u7684\u5de5\u4f5c\u5c31\u4e0d\u592a\u9069\u5408\u4f7f\u7528 Column-oriented DB \u4f86\u8655\u7406\u3002"),(0,r.kt)("h2",{id:"column-oriented-database-\u7684\u4f7f\u7528\u5834\u666f"},"Column-oriented Database \u7684\u4f7f\u7528\u5834\u666f"),(0,r.kt)("p",null,"Column-oriented Database \u66f4\u9069\u5408\u7528\u65bc\u8655\u7406\u5927\u6578\u64da\u53ca BI \u7b49\u8cc7\u6599\u5206\u6790\u76f8\u95dc\u7684\u904b\u7b97\uff0c\u7531\u65bc\u9019\u4e9b\u5834\u666f\u6709\u4e00\u500b\u5171\u901a\u7684\u7279\u6027\u5c31\u662f\u8981\u91dd\u5c0d\u67d0\u500b\u6216\u67d0\u4e9b Column \u9032\u884c\u5927\u91cf\u7684\u5206\u6790\uff0c\u4e0d\u9700\u8981\u628a\u6240\u6709\u7684 Column \u90fd\u62c9\u51fa\u4f86\u8dd1\u904e\u4e00\u904d\u3002"),(0,r.kt)("p",null,"\u53e6\u5916\u4e5f\u53ef\u4ee5\u628a Row-oriented DB \u5167\u7684\u4e0d\u592a\u6703\u88ab\u66f4\u52d5\u7684\u975c\u614b\u6b77\u53f2\u8cc7\u6599\u642c\u5230 Column-oriented DB \u9032\u884c\u5132\u5b58\uff0c\u6703\u7701\u4e0b\u8a31\u591a\u7684\u8cc7\u6599\u7a7a\u9593\uff0c\u4e26\u4e14\u672a\u4f86\u4e5f\u5bb9\u6613\u62ff\u4f86\u9032\u884c\u8cc7\u6599\u7684\u5206\u6790\u3002"),(0,r.kt)("h2",{id:"\u600e\u9ebc\u9019\u9ebc\u8907\u96dc\u6709\u6c92\u6709\u5169\u7a2e\u7279\u6027\u5168\u90fd\u8981\u7684\u8cc7\u6599\u5eab"},"\u600e\u9ebc\u9019\u9ebc\u8907\u96dc\uff0c\u6709\u6c92\u6709\u5169\u7a2e\u7279\u6027\u5168\u90fd\u8981\u7684\u8cc7\u6599\u5eab"),(0,r.kt)("p",null,"\u6709\u7684\uff0cMSSQL \u65e9\u5728 2012 \u5e74\u5c31\u5c0e\u5165\u4e86 columnstore index\uff0c\u4e5f\u5c31\u662f\u8aaa\u5982\u679c\u5c0d\u8a72 Table \u4e0b\u4e86\u9019\u7a2e index \u7684\u8a71\uff0c\u9019\u500b Table \u5c31\u6703\u4ee5 column-oriented \u7684\u65b9\u5f0f\u53bb\u505a\u5132\u5b58\uff0c\u4f46\u6709\u4e00\u500b\u975e\u5e38\u4e0d\u4fbf\u7684\u7f3a\u9ede\u662f\u4e0b\u4e86\u8a72 index \u5f8c\u8cc7\u6599\u8868\u5c31\u6703\u8b8a\u6210 read-only, \u4e0d\u80fd\u9032\u884c\u66f4\u65b0\u6216\u522a\u9664\u8cc7\u6599\u7684\u52d5\u4f5c\u3002"),(0,r.kt)("p",null,"Postgres \u7684\u90e8\u5206\u4e5f\u6709\u8a31\u591a Open Source \u5728\u958b\u767c\u76f8\u95dc\u7684 Extension, \u5982",(0,r.kt)("a",{parentName:"p",href:"https://github.com/greenplum-db/postgres/tree/zedstore"},"Zedstore"),"\u53ca",(0,r.kt)("a",{parentName:"p",href:"https://github.com/citusdata/cstore_fdw"},"cstore_fdw"),"\u7b49\uff0c\u53e6\u5916 Swarm64 DA \u4e5f\u6709\u51fa\u4ed8\u8cbb\u7248\u7684 columnstore index\u3002"),(0,r.kt)("h2",{id:"\u7d50\u8ad6"},"\u7d50\u8ad6"),(0,r.kt)("p",null,"\u8cc7\u6599\u5eab\u7684\u9078\u64c7\u4e0a\u8207\u67b6\u69cb\u8a2d\u8a08\u606f\u606f\u76f8\u95dc\uff0c\u6cc1\u4e14\u8cc7\u6599\u5eab\u4e5f\u4e0d\u662f\u53ea\u6709\u9019\u5169\u7a2e\u985e\u578b\uff0c\u9084\u6709 In-memory DB\uff0ctime-series DB\uff0cNOSQL DB \u7b49\uff0c\u8207\u5176\u786c\u8981\u9078\u4e00\u500b\u4f86\u4f5c\u70ba\u8cc7\u6599\u5eab\u4f7f\u7528\u7684\u8a71\uff0c\u6211\u5011\u61c9\u8a72\u8981\u4e86\u89e3\u6bcf\u7a2e\u8cc7\u6599\u5eab\u7684\u4f7f\u7528\u5834\u666f\uff0c\u4e26\u4f9d\u7167\u4e0d\u540c\u7684\u60c5\u5883\u6df7\u5408\u4f7f\u7528\u3002"),(0,r.kt)("p",null,"\u5728\u4e00\u500b\u5927\u578b\u7cfb\u7d71\u4e2d Row-oriented DB \u9032\u884c OLTP \u7684\u76f8\u95dc\u64cd\u4f5c\uff0c\u800c Column-oriented DB \u5c31\u8ca0\u8cac OLAP \u7684\u76f8\u95dc\u64cd\u4f5c\uff0cIn-memory DB \u8ca0\u8cac\u8655\u7406 Cache \u76f8\u95dc\u7684\u64cd\u4f5c\u7b49\uff0c\u9019\u624d\u662f\u5e38\u898b\u7684\u67b6\u69cb\u8a2d\u8a08\u6a21\u5f0f\u3002\u5404\u81ea\u628a\u81ea\u5df1\u7684\u512a\u9ede\u767c\u63ee\u51fa\u4f86\uff0c\u624d\u80fd\u628a\u6548\u80fd\u6700\u5927\u5316\uff01"))}m.isMDXComponent=!0},9348:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/column-oriented-2482774436a40f042b0bf75a7ef9d15f.png"},5128:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/row-oriented-b8929e27d72102f4cf8446ca19f8bde8.png"}}]);