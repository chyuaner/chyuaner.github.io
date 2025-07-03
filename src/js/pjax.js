import barba from '@barba/core';
import { defaultTransition } from './pageTransitions.js';

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
	// const dock = document.querySelector('#site-title-dock');
	const navTimeline = gsap.timeline({ paused: true });
  // if (!dock) return;

// if (namespace === 'index') {
  // navTimeline.clear();

//   navTimeline
//     .to(dock, {
//       opacity: 0,
//       duration: 0.3,
//       onComplete() {
//         dock.classList.remove('flex');
//         dock.classList.add('hidden');
//         dock.style.opacity = '';
//       }
//     })
//     .call(() => {
//       // navbar 動畫結束後執行頁面動畫
//       runPageScript(namespace);
//     });

//   navTimeline.play();
// } else {
  // navTimeline.clear();

  // navTimeline
  //   .set(dock, { opacity: 0, display: 'flex' })
  //   .to(dock, {
  //     opacity: 1,
  //     duration: 0.4,
  //     onStart() {
  //       dock.classList.remove('hidden');
  //       dock.classList.add('flex');
  //     }
  //   })
  //   .call(() => {
  //     // navbar 動畫結束後執行頁面動畫
  //     runPageScript(namespace);
  //   });

  // navTimeline.play();
// }
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

export function updateDockByNamespace(namespace) {
  // const dock = document.querySelector('#site-title-dock');
  // if (!dock) return;

  // // 每次建立一條新的 timeline（不保留全域變數）
  // const tl = gsap.timeline();

  // if (namespace === 'index') {
  //   tl.to(dock, {
  //     opacity: 0,
  //     duration: 0.3,
  //     onComplete() {
  //       dock.classList.remove('flex');
  //       dock.classList.add('hidden');
  //       dock.style.opacity = '';
  //     }
  //   });
  // } else {
  //   tl.set(dock, { opacity: 0, display: 'flex' });
  //   tl.to(dock, {
  //     opacity: 1,
  //     duration: 0.4,
  //     onStart() {
  //       dock.classList.remove('hidden');
  //       dock.classList.add('flex');
  //     },
  //     onComplete() {
  //       dock.style.opacity = '';
  //     }
  //   });
  // }

  // timeline 結束後觸發頁面腳本
  tl.call(() => {
    runPageScript(namespace);
  });
}


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
		
		const dock = document.querySelector('#site-title-dock');
		if (!dock) return;

		// // 每次建立一條新的 timeline（不保留全域變數）
		// const tl = gsap.timeline();

		if (namespace === 'index') {
		//   tl.to(dock, {
		//     opacity: 0,
		//     duration: 0.3,
		//     onComplete() {
		//       dock.classList.remove('flex');
		//       dock.classList.add('hidden');
		//       dock.style.opacity = '';
		//     }
		//   });
		} else {
		//   tl.set(dock, { opacity: 0, display: 'flex' });
		//   tl.to(dock, {
		//     opacity: 1,
		//     duration: 0.4,
		//     onStart() {
		//       dock.classList.remove('hidden');
		//       dock.classList.add('flex');
		//     },
		//     onComplete() {
		//       dock.style.opacity = '';
		//     }
		//   });
		}

		// // timeline 結束後觸發頁面腳本
		// tl.call(() => {
		// 	runPageScript(namespace);
		// });
	}

  barba.init({
    transitions: [
			{
				...defaultTransition, // 展開預設動畫設定
				async once(data) {
					await runPageScriptWithPromise(data.next.namespace);
					updateNavbarActive(data.next.namespace);
      	// 	runPageScript(next.namespace);
				},
				async afterEnter(data) {
      		// runPageScript(data.next.namespace);
					await runPageScriptWithPromise(data.next.namespace);
					updateDockByNamespace(data.next.namespace);
					// updateNavbarActive(data.next.namespace);
				}
				// afterEnter({ next }) {
				// 	updateDockByNamespace(next.namespace);
				// }
			}
		],
  });
}

initBarba();
