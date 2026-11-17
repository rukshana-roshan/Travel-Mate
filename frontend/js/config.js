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
    if (this.isLocal()) {
      // If served directly by Spring Boot on port 8080:
      if (window.location.port === "8080") {
        return `${window.location.origin}/api`;
      }
      // If served via Live Server (e.g. port 5500, 3000, 8000) or file://, direct requests to Spring Boot on port 8080
      const host = (window.location.hostname && window.location.hostname !== "") ? window.location.hostname : "localhost";
      const protocol = (window.location.protocol === "https:") ? "https:" : "http:";
      return `${protocol}//${host}:8080/api`;
    }
    // Production (e.g. GitHub Pages or Render)
    if (window.location.pathname.startsWith("/frontend/") && window.location.origin && !window.location.origin.includes("github.io")) {
      return `${window.location.origin}/api`;
    }
    return this.PROD_API_URL;
  },
};
