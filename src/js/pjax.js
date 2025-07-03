import barba from '@barba/core';
import { defaultTransition } from './pageTransitions.js';

export function initBarba() {
	// 播放當前頁面專用動畫
	function runPageScript(namespace) {
		import(`./pages/${namespace}.js`)
			.then(mod => {
				console.log(`載入 ${namespace} 頁面模組成功`);
				mod.initPage?.();
			})
			.catch(() => console.warn(`沒有找到 ${namespace} 頁面的 initPage`));
	}

	function runPageScriptWithPromise(namespace) {
		return new Promise((resolve) => {
			runPageScript(namespace);
			// 假設執行完立即 resolve（若內部有動畫或延遲，可用 callback 或事件來觸發）
			resolve();
		});
	}

	function updateDockByNamespace(namespace) {
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
		const dock = document.querySelector('#site-title-dock');
		if (!dock) return;

		if (namespace === 'index') {
			// 不要呼叫 gsap.to，直接用 class 控制
			dock.classList.remove('flex');
			dock.classList.add('hidden');
			dock.style.opacity = 0; // 清除 inline style，避免殘留透明度
		} else {
			dock.classList.add('flex');
			dock.classList.remove('hidden');
			dock.style.opacity = 1;

			// gsap.to(dock, {
			// 	opacity: 1,
			// 	duration: 1,
			// 	overwrite: 'auto'
			// });
		}
	}

  barba.init({
    transitions: [
			{
				...defaultTransition, // 展開預設動畫設定
				async once(data) {
					await runPageScriptWithPromise(data.next.namespace);
					updateNavbarActive(data.next.namespace);
				},
				async afterEnter(data) {
					await runPageScriptWithPromise(data.next.namespace);
					updateDockByNamespace(data.next.namespace);
				}
			}
		],
  });
}

initBarba();
