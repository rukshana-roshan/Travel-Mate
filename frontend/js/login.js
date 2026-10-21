/* ==========================================================================
   TRAVEL MATE — Login / Register Logic
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const isSwitching = urlParams.get("switch") === "true" || urlParams.get("logout") === "true";

  if (isSwitching) {
    tmClearSession();
    tmToast("Signed out. You can now log in with another account.", "info");
  }

  // Check existing session
  const existing = tmGetSession();
  if (existing && !isSwitching) {
    const alertEl = document.getElementById("alreadyLoggedInAlert");
    if (alertEl) {
      alertEl.classList.remove("d-none");
      const nameEl = document.getElementById("sessionUserName");
      const roleEl = document.getElementById("sessionUserRole");
      const homeBtn = document.getElementById("sessionHomeBtn");
      if (nameEl) nameEl.textContent = existing.fullName || existing.email;
      if (roleEl) roleEl.textContent = existing.role || "User";
      if (homeBtn) {
        homeBtn.href = existing.role === "ADMIN" ? "admin-dashboard.html" : "index.html";
        homeBtn.textContent = existing.role === "ADMIN" ? "Go to Admin Dashboard" : "Go to Home";
      }
      const logoutBtn = document.getElementById("sessionLogoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          tmClearSession();
          alertEl.classList.add("d-none");
          tmToast("Signed out successfully", "info");
        });
      }
    }
  }

  // Auto-fill demo credentials button
  const btnFillAdmin = document.getElementById("btnFillAdmin");
  if (btnFillAdmin) {
    btnFillAdmin.addEventListener("click", () => {
      const emailInput = document.getElementById("loginEmail");
      const passInput = document.getElementById("loginPassword");
      if (emailInput && passInput) {
        emailInput.value = "admin@travelmate.lk";
        passInput.value = "admin123";
        tmToast("Demo admin credentials filled!", "info");
      }
    });
  }

  // Handle Login Form
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById("loginSubmitBtn");
    const originalText = submitBtn ? submitBtn.innerHTML : "Sign In";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Signing In...`;
    }

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    try {
      const user = await TM_API.login({ email, password });
      tmSetSession(user);
      await tmSyncFavoritesOnLogin(user.userId);
      const firstName = (user.fullName || "User").split(" ")[0];
      tmToast(`Welcome back, ${firstName}!`, "success");
      setTimeout(() => {
        window.location.href = user.role === "ADMIN" ? "admin-dashboard.html" : "index.html";
      }, 500);
    } catch (err) {
      tmToast(err.message || "Invalid email or password", "error");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });

  // Handle Registration Form
  document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById("regSubmitBtn");
    const originalText = submitBtn ? submitBtn.innerHTML : "Create Tourist Account";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Creating Account...`;
    }

    const dto = {
      fullName: document.getElementById("regName").value.trim(),
      email: document.getElementById("regEmail").value.trim(),
      password: document.getElementById("regPassword").value,
    };
    try {
      const user = await TM_API.register(dto);
      tmSetSession(user);
      await tmSyncFavoritesOnLogin(user.userId);
      const firstName = (user.fullName || "Tourist").split(" ")[0];
      tmToast(`Account created — welcome, ${firstName}!`, "success");
      setTimeout(() => { window.location.href = "index.html"; }, 500);
    } catch (err) {
      tmToast(err.message || "Could not create account", "error");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });
});
