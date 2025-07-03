import { defaultTransition } from './pageTransitions.js';

let barbaTimeline; // 全域 timeline 控制

function initBarba() {
	// 播放當前頁面專用動畫
	function runPageScript(namespace) {
		return import(`./pages/${namespace}.js`)
			.then(mod => {
				console.log(`載入 ${namespace} 頁面模組成功`);
				mod.initPage?.();
			})
			.catch(() => console.warn(`沒有找到 ${namespace} 頁面的 initPage`));
	}

	function updateDockByNamespace(namespace, tl) {
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

		const isHome = namespace === '' || namespace === 'index';
		const isDockVisible = dock.classList.contains('flex');

		if (isHome && isDockVisible) {
			// ⛔️ 當前為首頁，但 dock 是顯示狀態 → 淡出動畫
			tl.to(dock, {
				opacity: 0,
				duration: 0.4,
				ease: 'power2.in',
				onComplete: () => {
					dock.classList.remove('flex');
					dock.classList.add('hidden');
					dock.style.opacity = 0;
				}
			});
		} else if (!isHome && !isDockVisible) {
			// ⛔️ 當前不是首頁，但 dock 是隱藏狀態 → 淡入動畫
			tl.fromTo(dock,
				{ opacity: 0 },
				{
					opacity: 1,
					duration: 0.6,
					ease: 'power2.out',
					onStart: () => {
						dock.classList.add('flex');
						dock.classList.remove('hidden');
					},
					onComplete: () => {
						dock.style.opacity = 1;
					}
				}
			);
		} else {
			// ✅ 狀態沒變，不做任何動畫
			// console.log('dock 狀態未變，跳過動畫');
		}
	}

	barba.init({
		transitions: [
			{
				...defaultTransition, // 展開預設動畫設定
				async once(data) {
					await runPageScript(data.next.namespace);

					// 初始化 timeline
					if (barbaTimeline && barbaTimeline.isActive()) {
						barbaTimeline.kill();
					}
					barbaTimeline = gsap.timeline();
					updateDockByNamespace(data.next.namespace, barbaTimeline);
				},
				async afterEnter(data) {
					await runPageScript(data.next.namespace);

					// 如果前一段 timeline 還在跑，先停止
					if (barbaTimeline && barbaTimeline.isActive()) {
						barbaTimeline.kill();
					}

					// 建立新的 timeline
					barbaTimeline = gsap.timeline();
					updateDockByNamespace(data.next.namespace, barbaTimeline);

					// 你也可以繼續串入其他動畫，例如：
					// barbaTimeline.from('.page-title', { opacity: 0, y: 20, duration: 0.5 });
				}
			}
		],
	});
}

initBarba();
