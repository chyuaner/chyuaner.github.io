import barba from '@barba/core';
import { defaultTransition } from './js/pageTransitions.js';

function runPageScript(namespace) {
  import(`./js/pages/${namespace}.js`)
    .then(mod => {
      // console.log(`載入 ${namespace} 頁面模組成功`);
      mod.initPage?.();
    })
    .catch(() => console.warn(`沒有找到 ${namespace} 頁面的 initPage`));
}

export function initBarba() {
  barba.init({
    transitions: [
			{
				...defaultTransition, // 展開預設動畫設定
				afterEnter(data) {
					runPageScript(data.next.namespace);
				}
			}
		],
  });
}

initBarba();
