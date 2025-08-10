---
layout: ../layouts/MdLayout.astro
title: 關於本站
---

## 關於本站

<!-- <div role="alert" class="alert alert-warning">
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
  <span>本頁施工中</span>
</div> -->

本站是以Astro Framework，以傳統換頁式網頁為基礎，再額外加上Pjax動態局部換頁技術與GSAP動畫效果改良瀏覽體驗，再額外搭配Github Actions做程式碼上傳後自動化建置出靜態網頁部署上線。

### UI設計稿繪製
本站設計稿是用免費開源的Inkscape畫出來的
![](/imgs/uiux-inkscape.png)

### 本站架構Astro
其實一開始只想以傳統HTML/CSS/JavaScript的方式簡單做，不過在評估需求的時候發現即使是簡單的個人形象頁，還是有換頁與共用部份組件。但是內容其實是固定的，也沒動態到需要用到什麼CSR框架像是Vue, React之類的。最後在綜合評估之後決定採用Astro Framework。


### 前端Framework TailwindCSS
此網站同時也是我第一次親自從無到有嘗試TailwindCSS這套Framework（上次使用這套是在公司專案與同事合作的時候碰的）
和我習慣的Bootstrap、Foundation 這類傳統 CSS Framework不太一樣，傳統的CSS Framework本身就帶很多預設組件和全局樣式，開箱就能用，設計好的排版和按鈕樣式一鍵套用，對新手很友善。

但 Tailwind 是「原子化工具類 CSS」框架，重點是給你一堆低階工具（像 p-4、text-gray-700）去自由組合，彈性大但學習曲線自然陡峭，需要自己動手拼出想要的樣子。
後來因為還是有想快速使用現成組件的需求，所以有再搭配由Tailwind衍生的daisyUI。


### Pjax動態局部換頁技術
* 使用者點選連結時，不刷新整個頁面
* 僅更新主要內容區塊（例如 &lt;main&gt; 或 #pjax-container）
* 支援瀏覽器前進/後退
* 支援動畫效果（淡出舊頁 → 換內容 → 淡入新頁）
* 不破壞 SEO（仍能 Fallback 到原始 HTML）

### 動畫效果
在Pjax局部換頁技術搞定之後，再來再進一步導入Barba+GSAP實現站內動畫效果。
定義動畫效果相關檔案
```
 └── pages/  : 定義該頁面內容專用的動畫
 │  ├──── index.js  
 │  ├──── services.js  
 │  └──── works.js  
 ├── pageTransitions.js  : 定義更換頁面的動畫效果
 └── pjax.js : 定義Pjax局部換頁的區塊與基礎設定
 ```
