2025 個人首頁新站
===

這是在2025年重新建立新的個人首頁 ，至於舊的首頁已經[移至另一個專案](https://github.com/chyuaner/chyuaner.github.io.old)封存。

## 本站檔案結構規劃
基本上以Astro為主，不過我還是有依照我的需求額外增加一些東西：
* `src/data/main.json`: 本站較複雜or常變動的靜態資料都集中在這邊。不複雜、固定的就直接寫死在網頁上。
* `public/imgs`: 所有靜態圖片都放在這邊。基本上放作品與網站截圖展示示意用。
* `src/layouts/Layout.astro`: 全站會用到的主版型
* `src/layouts/MdLayout.astro`: 繼承自`Layout.astro`，但有針對page型態為.md的markdown檔案做處理。
* `.github/workflows/deploy.yml`: 以[withastro整理的Deploy Astro to GitHub Pages](https://github.com/withastro/action)直接套用自動佈署腳本

至於其他Astro原始的檔案規劃就直接參考Astro官方說明

### Astro官方說明： 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).


## 🧞 Commands
沒有特別改動，直接貼Astro官方說明

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |


