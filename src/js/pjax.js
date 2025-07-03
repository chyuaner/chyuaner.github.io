import barba from '@barba/core';
import { defaultTransition } from './pageTransitions.js';

// 播放當前頁面專用動畫
function runPageScript(namespace) {
  import(`./pages/${namespace}.js`)
    .then(mod => {
      console.log(`載入 ${namespace} 頁面模組成功`);
      mod.initPage?.();
    })
    .catch(() => console.warn(`沒有找到 ${namespace} 頁面的 initPage`));
}

// 更新固定部份內容顯示
function updateNavbarActive(namespace) {
  const navLinks = document.querySelectorAll('nav ul.menu li a');

	// 1. 控制 active class
  navLinks.forEach(link => {
    // 取 href 的路徑尾端當作判斷（去除首尾斜線）
    const hrefPath = link.getAttribute('href').replace(/^\/|\/$/g, '');

    if (hrefPath === namespace) {
      link.classList.add('menu-active');
    } else {
      link.classList.remove('menu-active');
    }
  });

  // 預設首頁 namespace = '' 或 'home' 時，清除所有 active 或特別處理
  if (namespace === '' || namespace === 'index') {
    navLinks.forEach(link => link.classList.remove('menu-active'));
  }

	// 2. 控制首頁 vs 非首頁時的 site-title-dock 顯示
  // if (namespace === '' || namespace === 'index') {
  //   // 是首頁 → 隱藏
  //   siteTitleDock?.classList.remove('flex');
  //   siteTitleDock?.classList.add('hidden');
  // } else {
  //   // 不是首頁 → 顯示
  //   siteTitleDock?.classList.remove('hidden');
  //   siteTitleDock?.classList.add('flex');
  // }
}

export function initBarba() {
  barba.init({
    transitions: [
			{
				...defaultTransition, // 展開預設動畫設定
				once({ next }) {
					updateNavbarActive(next.namespace);
					runPageScript(next.namespace);
				},
				afterEnter(data) {
					updateNavbarActive(data.next.namespace);
					runPageScript(data.next.namespace);
				}
			}
		],
  });
}

initBarba();
