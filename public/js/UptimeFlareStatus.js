export default class UptimeFlareStatus {
  constructor(options) {
    this.apiUrl = options.apiUrl;
    // 使用反引號 `` 定義預設的 HTML 模板
    this.upOutput    = options.upOutput    || `<span style="color: green;">Up</span>`;
    this.downOutput  = options.downOutput  || `<span style="color: red;">Down</span>`;
    this.errorOutput = options.errorOutput || `<span style="color: gray;">Error</span>`;
    this.data = null; // 用於儲存抓取到的資料
  }

  /**
   * 僅抓取資料 (Fetch data only)
   */
  async fetch() {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.data = await response.json();
      console.log("UptimeFlare data fetched:", this.data);
      return this.data;
    } catch (error) {
      console.error('Error fetching UptimeFlare data:', error);
      this.data = null; // 清除舊資料或標記為錯誤狀態
      throw error; // 重新拋出錯誤以便外部捕獲
    }
  }

  /**
   * 渲染資料到 DOM (Render data to DOM)
   */
  render() {
    if (!this.data) {
      // 如果沒有資料，將所有區域設為錯誤狀態
      document.querySelectorAll('span[data-uptimeflare-id]').forEach(span => {
          span.innerHTML = this.errorOutput;
      });
      return;
    }

    for (const monitorId in this.data.monitors) {
      if (this.data.monitors.hasOwnProperty(monitorId)) {
        const monitorStatus = this.data.monitors[monitorId].up;
        const outputHTML = monitorStatus ? this.upOutput : this.downOutput;
        
        // console.log("UptimeFlare Render:", monitorStatus);
        const spanElement = document.querySelector(`[data-uptimeflare-id="${monitorId}"]`);

        if (spanElement) {
          // 使用 innerHTML 來插入您自定義的 HTML 結構
          spanElement.innerHTML = outputHTML;
        }
      }
    }
  }

  /**
   * 抓取並渲染資料 (Fetch and Render combined)
   */
  async fetchAndRender() {
    try {
      await this.fetch();
      this.render();
    } catch (error) {
      // 如果 fetch 失敗 (網路錯誤等)，render 會自動使用 errorOutput 處理
      this.render(); 
    }
  }
}
