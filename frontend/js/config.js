/* ==========================================================================
   TRAVEL MATE — Environment Config
   Loaded before api.js. Auto-detects whether the page is running locally
   (Live Server, file://, 127.0.0.1) or deployed (e.g. GitHub Pages), and
   points TM_API at the right backend without any manual editing per env.
   Update TM_CONFIG.PROD_API_URL once your Render backend is live.
   ========================================================================== */

const TM_CONFIG = {
  LOCAL_API_URL: "http://localhost:8080/api",
  PROD_API_URL: "https://travel-mate-api.onrender.com/api", // <-- replace with your real Render URL after deploying

  isLocal() {
    const host = window.location.hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "" || window.location.protocol === "file:";
  },

  apiBaseUrl() {
    return this.isLocal() ? this.LOCAL_API_URL : this.PROD_API_URL;
  },
};
