import { defaultTransition } from './pageTransitions.js';

let barbaTimeline; // 全域 timeline 控制

function initBarba() {
	// 播放當前頁面專用動畫
	function runPageScript(namespace) {
		return import(`./pages/${namespace}.js`)
			.then(mod => {
				// console.log(`載入 ${namespace} 頁面模組成功`);
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

    // 取得包在 dock 內的 #site-title 元素
    const siteTitle = dock.querySelector('#site-title');
    if (!siteTitle) return;   // 若找不到直接跳過

		const isHome = namespace === '' || namespace === 'index';
    const isHidden = siteTitle.classList.contains('md:opacity-0');

    const isDesktop = window.innerWidth >= 768; // Tailwind 的 md 斷點預設為 768px

    if (isHome && !isHidden && isDesktop) {
      // ⛔️ 首頁 → 隱藏 site‑title（僅在桌面版執行淡出動畫）
      tl.to(siteTitle, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          siteTitle.classList.add('md:opacity-0');
          siteTitle.style.opacity = 0; // 只在桌面版會被看到
        }
      });
    } else if (!isHome && isHidden && isDesktop) {
      // ⛔️ 非首頁 → 顯示 site‑title（僅在桌面版執行淡入動畫）
      tl.fromTo(
        siteTitle,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          onStart: () => {
            siteTitle.classList.remove('md:opacity-0');
          },
          onComplete: () => {
            siteTitle.style.opacity = 1;
          }
        }
      );
    } else {
      // ✅ 其他情況（如行動版）直接確保 class 正確、避免不必要的 inline opacity
      if (isHome) {
        siteTitle.classList.add('md:opacity-0');
        siteTitle.style.opacity = ''; // 移除行動版可能殘留的 inline style
      } else {
        siteTitle.classList.remove('md:opacity-0');
        siteTitle.style.opacity = '';
      }
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


	barba.hooks.after((data) => {
		// const path = data.next.url.path;
		
		// 處理Matomo追蹤更新
		_paq.push(['setCustomUrl', window.location.href]);
		_paq.push(['setDocumentTitle', document.title]);
		_paq.push(['trackPageView']);
	});
}

initBarba();
