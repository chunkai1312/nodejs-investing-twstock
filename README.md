# 《Node.js量化投資全攻略：從資料收集到自動化交易系統建構實戰》範例程式碼

<a href="https://www.tenlong.com.tw/products/9786263336025">
  <img src="https://cf-assets2.tenlong.com.tw/products/images/000/194/990/original/9786263336070.jpg" height="50%" width="50%" alt="Node.js量化投資全攻略：從資料收集到自動化交易系統建構實戰">
</a>

* **購書實體書：**
[天瓏網路書店](https://www.tenlong.com.tw/products/9786263336070) |
[博客來網路書店](https://www.books.com.tw/products/0010970613) |
[誠品書店](https://www.eslite.com/product/10012011762682463156005) |
[蝦皮購物](https://shopee.tw/product/728783014/22357449944/) |
[momo購物網](https://www.momoshop.com.tw/goods/GoodsDetail.jsp?i_code=11954040)
* **購書電子書：**
[Readmoo 讀墨](https://readmoo.com/book/210305161000101) |
[Rakuten Kobo](https://www.kobo.com/tw/zh/ebook/node-js-ithome) |
[Google Play](https://play.google.com/store/books/details/%E7%8E%8B%E9%9B%8B%E5%87%B1_Node_js%E9%87%8F%E5%8C%96%E6%8A%95%E8%B3%87%E5%85%A8%E6%94%BB%E7%95%A5?id=nrPoEAAAQBAJ) |
[Pubu](https://www.pubu.com.tw/ebook/398315) |
[博客來電子書](https://www.books.com.tw/products/E050194168)

## 公告

### 2024-11-21

近期由於證交所與櫃買中心網站的調整與更新，部分資料抓取範例程式可能已無法正常運作。為協助讀者解決相關問題，作者特別整理並持續維護了一個 [node-twstock](https://github.com/chunkai1312/node-twstock) 套件，其中涵蓋了本書中使用的市場資料抓取範例，歡迎讀者參考使用。

### 2024-11-04

由於櫃買中心網站已於 2024 年 10 月 27 日進行改版，原先提供從櫃買中心網站抓取資料的範例程式可能無法正常運行。最新的程式碼請參閱 [appendix](https://github.com/chunkai1312/nodejs-investing-twstock/blob/main/appendix/apps/scraper/src/scraper/tpex-scraper.service.ts) 中的範例。

### 2024-11-06

根據 LINE Notify 的結束服務公告，LINE Notify 將於 2025 年 4 月停止運作。為確保通知服務的持續運作，替代方案請參閱 [附錄：LINE Notify 替代方案](https://github.com/chunkai1312/nodejs-investing-twstock/blob/main/appendix/README.md)。

## 書籍簡介

### 好評推薦

> 「本書有完整的架構，讓讀者不只能學習到實用的開發方法，複製可即刻使用的程式碼，更重要的是能為讀者建立起良好的量化投資觀念。」

─ 葉力維，富果共同創辦人暨執行長
 
> 「本書結合了正確且務實的投資觀念與作者的多年實務開發經驗，透過手把手的教學，協助讀者打造屬於自己的交易系統，並附上許多程式碼範例與交易策略的發想，相信對於許多想要踏入投資領域的工程師或對程式交易的有興趣的人，是非常好用的工具書。」

─ 邱翊雲，富果共同創辦人暨策略財務長

> 「市面上有許多量化交易的資源，這本書特別吸引我，一方面是它非常詳細地介紹了投資相關知識，甚至還附上了許多數據來源，另一方面是使用NestJS打造量化交易系統，身為NestJS推廣者，看見這樣的應用實在令我感到興奮。」

─ 謝浩哲，《NestJS基礎必學實務指南：使用強大且易擴展的Node.js框架打造網頁應用程式》作者

### 本書特色

第一本Node.js量化投資專書<br>
使用NestJS與JS生態圈工具打造投資利器<br>
網頁工程師掌握股市關鍵數據的量化投資指南<br>
資料收集 × 實例應用 × 程式交易，從零開始打造專屬你的投資系統！<br>

- **量化投資介紹**：投資知識深入淺出，股市小白輕鬆入門
- **資料收集範例**：獲取市場數據，建構股市資料庫
- **豐富實例應用**：實用範例開箱即用，打造股市小幫手
- **程式交易實戰**：自動化程式交易，成為紀律交易者

### 內容簡介

本書內容改編自第14屆iThome鐵人賽Software Development組的冠軍系列文章《從Node.js開發者到量化交易者：打造屬於自己的投資系統》。透過Node.js平台與NestJS框架，運用JavaScript生態圈工具，從資料收集、市場分析到程式交易，建立一套完整的投資系統。本書分為四大主題，循序漸進地帶領讀者掌握量化投資的關鍵要素：
 
- **PART 1 預備知識**：瞭解投資基本概念與交易規則，建立所需的開發環境。
- **PART 2 資料準備**：探索市場數據來源與分析方法，以拓展投資策略視野。
- **PART 3 實例應用**：打造各式股市幫手與工具應用，進一步提升投資效率。
- **PART 4 程式交易**：開發股票下單程式與交易系統，實現自動化程式交易。

### 目標讀者

- 想使用市場數據進行投資分析的台股投資者。
- 想使用程式取得市場開放資料的程式開發者。
- 想使用JS生態圈工具打造投資利器的Node.js開發者。
- 想建立穩定且可靠的自動化交易系統的量化投資者。

## 目錄（章節範例程式）

### PART 1 預備知識

- Chapter 01 為什麼要學習投資
- Chapter 02 量化投資初探
- Chapter 03 投資商品概觀
- Chapter 04 台股交易入門
- Chapter 05 開發環境準備

### PART 2 資料準備

- [Chapter 06 股市資料來源和取得方式](./ch06/)
- [Chapter 07 從大盤趨勢到個股挑選：由上而下投資策略](./ch07/)
- [Chapter 08 市場寬幅指標：上漲家數與下跌家數](./ch08/)
- [Chapter 09 主導台股的力量：三大法人買賣超](./ch09/)
- [Chapter 10 散戶指標：融資融券餘額](./ch10/)
- [Chapter 11 法人期貨動向：三大法人臺股期貨未平倉](./ch11/)
- [Chapter 12 法人動向再確認：三大法人臺指選擇權未平倉](./ch12/)
- [Chapter 13 散戶期貨指標：小台散戶多空比](./ch13/)
- [Chapter 14 大戶指標：大額交易人未沖銷部位](./ch14/)
- [Chapter 15 市場情緒指標：臺指選擇權Put/Call Ratio](./ch15/)
- [Chapter 16 台股同時指標：美元兌新台幣匯率](./ch16/)
- [Chapter 17 全球經濟火車頭：美國股市](./ch17/)
- [Chapter 18 景氣循環指標：美國公債殖利率](./ch18/)
- [Chapter 19 觀察產業輪動：產業分類股價指數](./ch19/)
- [Chapter 20 追蹤熱門族群：資金流向](./ch20/)
- [Chapter 21 技術分析基礎：股價Ｋ線](./ch21/)
- [Chapter 22 尋找法人認養股：三大法人買賣明細](./ch22/)
- [Chapter 23 尋找價值股：本益比、股價淨值比、殖利率](./ch23/)
- [Chapter 24 基本面關注點：每季 EPS、每月營收](./ch24/)
- [Chapter 25 跟著大戶走：集保戶股權分散表](./ch25/)

### PART 3 實例應用

- [Chapter 26 股市資料庫：MongoDB與任務排程應用](./ch26/)
- [Chapter 27 市場觀察表：ExcelJS與Nodemailer應用](./ch27/)
- [Chapter 28 選股機器人：LINE Notify應用](./ch28/)
- [Chapter 29 策略回測程式：富果行情API與回測工具應用 ](./ch29/)
- [Chapter 30 行情監控程式：富果行情API與LINE Notify應用](./ch30/)

### PART 4 程式交易

- [Chapter 31 股票下單程式：以富果交易API為例](./ch31/)
- [Chapter 32 自動化程式交易](./ch32/)
- [Chapter 33 定期定額投資系統](./ch33/)
- [Chapter 34 容器化應用程式部署](./ch34/)
- Chapter 35 結語：打造穩定可靠的程式交易系統

## 作者簡介

### 王雋凱
 
現任職於群馥科技（富果）資深後端工程師，國立臺灣科技大學資訊管理碩士，通過證券商高級業務員、投信投顧業務員、期貨商業務員等認證。
 
2011年開始接觸Node.js，熱衷於運用JavaScript生態圈工具嘗試各種可能，擁有豐富的網頁前後端開發經驗。目前專注於Software Development、DevOps及FinTech領域，同時積極貢獻社群，並負責維護多個開源專案。
 
**得獎紀錄**
- 2022年iThome〈第14屆iThome鐵人賽〉Software Development組冠軍
- 2014年經濟部技術處〈搶鮮大賽〉系統實作類佳作
- 2011年經濟部工業局〈第16屆資訊服務創新競賽〉IAP2資訊技術應用組第二名
- 2011年經濟部工業局〈第16屆資訊服務創新競賽〉IAP2智慧手持裝置應用主題獎
- 2011年經濟部工業局〈App Star高手爭霸戰市集應用軟體設計大賽〉入圍
