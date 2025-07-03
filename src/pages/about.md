---
layout: ../layouts/MdLayout.astro
title: 關於本站
---

## 關於本站

<div role="alert" class="alert alert-warning">
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
  <span>本頁施工中</span>
</div>

本站是

### UI設計稿繪製

### 本站架構Astro
其實一開始只想以傳統HTML/CSS/JavaScript的方式簡單做，不過在評估需求的時候發現即使是簡單的個人形象頁，還是有換頁與共用部份組件。但是內容其實是固定的，也沒動態到需要用到什麼CSR框架像是Vue, React之類的。
而且用了CSR架構就是變成


#### Components設計仍在習慣中


### 前端Framework TailwindCSS
和我習慣的Bootstrap很不一樣

Bootstrap、Foundation 這類傳統 CSS Framework，本身就帶很多預設組件和全局樣式，開箱就能用，設計好的排版和按鈕樣式一鍵套用，對新手很友善。

但 Tailwind 是「原子化工具類 CSS」框架，重點是給你一堆低階工具（像 p-4、text-gray-700）去自由組合，你需要自己動手拼出想要的樣子，彈性大但學習曲線自然陡峭。


### Pjax動態局部換頁技術
* 使用者點選連結時，不刷新整個頁面
* 僅更新主要內容區塊（例如 &lt;main&gt; 或 #pjax-container）
* 支援瀏覽器前進/後退
* 支援動畫效果（淡出舊頁 → 換內容 → 淡入新頁）
* 不破壞 SEO（仍能 Fallback 到原始 HTML）

### 動畫效果
