import UptimeFlareStatus from '../UptimeFlareStatus.js';

export function initPage() {
  const tl = gsap.timeline();

  // 1. Start fetching immediately
  const uf = new UptimeFlareStatus({
    apiUrl: "https://status.yuaner.tw/api/data",
    upOutput: `<span class="font-bold"><div class="inline-grid *:[grid-area:1/1]"><div class="status status-success animate-ping"></div><div class="status status-success"></div></div> Server is up</span>`,
    downOutput: `<span class="font-bold"><div class="status status-error animate-bounce"></div> Server is down</span>`
  });

  tl
  .from('h2', {
    opacity: 0,
    duration: 0.8
  }).call(async () => {
      uf.fetchAndRender();
    })
  .from('.main-card', {
    // scale: 0.8,
    x: 100,
    opacity: 0,
    duration: 0.5,
    stagger: {
      each: 0.1,
      amount: 0,
      start: 0 // 從第一個元素開始，不延遲整個動畫
    },
  });

  // // 2. Render after animation completes
  // tl.call(async () => {
    // uf.render();
  //   // await fetchPromise;
  // });
}
