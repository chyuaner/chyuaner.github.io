import Swup from 'swup';
import gsap from 'gsap';

// 定義轉場動畫
const transition = {
  leave: (data) => {
    return Promise.all([
      gsap.to(data.containers, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: 'power2.out'
      }),
      gsap.to('footer', {
        y: 0,
        opacity: 0.5,
        duration: 0.4,
        ease: 'power2.out'
      })
    ]);
  },
  enter: (data) => {
    // 這裡使用 fromTo，確保從 opacity: 0 (由 CSS 控制的初始狀態) 開始
    // 並且明確設定 visibility: visible 避免 CSS 造成的隱藏
    gsap.fromTo(data.containers, {
      opacity: 0,
      y: 20,
      visibility: 'hidden'
    }, {
      opacity: 1,
      y: 0,
      visibility: 'visible',
      duration: 0.4,
      ease: 'power2.out'
    });
    
    return gsap.fromTo('footer', {
      y: 0,
      opacity: 0.5
    }, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    });
  }
};

function initSwup() {
  const swup = new Swup({
    containers: ['#swup'],
    animationSelector: '[class*="transition-"]', // 即使我們手動控制，Swup 仍需要一個 selector 或 plugin
    // 我們將手動控制動畫，所以主要依賴 hooks
    linkSelector: 'a[href^="/"]:not([data-no-swup]), a[href^="' + window.location.origin + '"]:not([data-no-swup])',
    cache: true,
  });

  // ========== Page Script Loading Logic ==========
  const pageScripts = import.meta.glob('./pages/*.js');

  async function runPageScript(pathname) {
    // 簡單處理 pathname，例如 '/' -> 'index', '/works' -> 'works'
    let namespace = pathname.replace(/^\/|\/$/g, '') || 'index';
    
    // 對應到 ./pages/${namespace}.js
    const scriptPath = `./pages/${namespace}.js`;
    
    if (pageScripts[scriptPath]) {
      try {
        const mod = await pageScripts[scriptPath]();
        // console.log(`載入 ${namespace} 頁面模組成功`);
        mod.initPage?.();
      } catch (e) {
        console.error(`Error loading script for ${namespace}:`, e);
      }
    } else {
      // console.warn(`沒有找到 ${namespace} 頁面的 initPageScript`);
    }
  }

  // ========== Dock & Nav Logic (Ported from pjax.js) ==========
  let dockTimeline;

  function updateDockByNamespace(pathname) {
    let namespace = pathname.replace(/^\/|\/$/g, '') || 'index';

    const navLinks = document.querySelectorAll('nav ul.menu li a');

    // 1. 控制 active class
    navLinks.forEach(link => {
      const hrefPath = link.getAttribute('href').replace(/^\/|\/$/g, '');
      if (hrefPath === namespace) {
        link.classList.add('menu-active');
      } else {
        link.classList.remove('menu-active');
      }
    });

    if (namespace === 'index') {
      navLinks.forEach(link => link.classList.remove('menu-active'));
    }

    // 2. 控制 #site-title-dock
    const dock = document.querySelector('#site-title-dock');
    if (!dock) return;

    const siteTitle = dock.querySelector('#site-title');
    if (!siteTitle) return;

    const isHome = namespace === 'index';
    const isHidden = siteTitle.classList.contains('md:opacity-0');
    const isDesktop = window.innerWidth >= 768;

    if (dockTimeline && dockTimeline.isActive()) {
      dockTimeline.kill();
    }
    dockTimeline = gsap.timeline();

    if (isHome && !isHidden && isDesktop) {
      dockTimeline.to(siteTitle, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          siteTitle.classList.add('md:opacity-0');
          siteTitle.style.opacity = 0;
        }
      });
    } else if (!isHome && isHidden && isDesktop) {
      dockTimeline.fromTo(siteTitle, 
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
      if (isHome) {
        siteTitle.classList.add('md:opacity-0');
        siteTitle.style.opacity = '';
      } else {
        siteTitle.classList.remove('md:opacity-0');
        siteTitle.style.opacity = '';
      }
    }
  }

  // ========== Hooks ==========
  
  // 1. Initial Load
  // 由於 CSS 預設隱藏 (.js #swup)，這裡需要執行動畫顯示
  gsap.fromTo('#swup', {
    opacity: 0,
    y: 20,
    visibility: 'hidden'
  }, {
    opacity: 1,
    y: 0,
    visibility: 'visible',
    duration: 0.4,
    ease: 'power2.out'
  });

  runPageScript(window.location.pathname);
  updateDockByNamespace(window.location.pathname);

  // 2. Before Content Replaced (Leave Animation)
  swup.hooks.on('visit:start', async (visit) => {
    // 這裡可以做 Leave 動畫，但 swup 預設會等待 content:replace
    // 如果想要手動控制，可以暫停流程
    await transition.leave({ containers: document.querySelectorAll('#swup') });
  });

  // 3. Content Replaced (Enter Animation & Scripts)
  swup.hooks.on('content:replace', async (visit) => {
    const nextPath = visit.to.url;
    
    // 執行新頁面的 script
    await runPageScript(new URL(nextPath, window.location.origin).pathname);
    
    // 更新 Dock
    updateDockByNamespace(new URL(nextPath, window.location.origin).pathname);
    
    // 執行 Enter 動畫
    await transition.enter({ containers: document.querySelectorAll('#swup') });
    
    // Matomo Tracking
    if (window._paq) {
      window._paq.push(['setCustomUrl', window.location.href]);
      window._paq.push(['setDocumentTitle', document.title]);
      window._paq.push(['trackPageView']);
    }
  });
}

if (typeof window !== 'undefined') {
  initSwup();
}
