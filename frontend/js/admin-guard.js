/* ==========================================================================
   TRAVEL MATE — Admin Route Guard
   Included on every admin-*.html page. Redirects non-admins to login and
   wires up the shared logout / sidebar-toggle controls.
   ========================================================================== */

(function tmAdminGuard() {
  const session = tmGetSession();
  if (!session || session.role !== "ADMIN") {
    window.location.href = "login.html";
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const session = tmGetSession();
  if (session) {
    const nameEl = document.getElementById("adminName");
    const emailEl = document.getElementById("adminEmail");
    const avatarEl = document.getElementById("adminAvatar");
    if (nameEl) nameEl.textContent = session.fullName;
    if (emailEl) emailEl.textContent = session.email;
    if (avatarEl) avatarEl.textContent = session.fullName.charAt(0).toUpperCase();
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      tmClearSession();
      tmToast("Logged out", "info");
      setTimeout(() => { window.location.href = "login.html"; }, 400);
    });
  }

  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("adminSidebar");
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
  }
});
