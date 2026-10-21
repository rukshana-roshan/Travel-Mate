/* ==========================================================================
   TRAVEL MATE — Shared Front-End Utilities
   Loaded on every page. Handles theme, navbar, toasts, favorites/itinerary
   local state, and small formatting helpers used across pages.
   ========================================================================== */

/* ---------- Theme (Dark / Light mode) ---------- */
const TM = {
  THEME_KEY: "tm_theme",
  FAV_KEY: "tm_favorites",
  ITIN_KEY: "tm_itinerary_draft",
  SESSION_KEY: "tm_session",
};

function tmInitTheme() {
  const saved = localStorage.getItem(TM.THEME_KEY) ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", saved);
  tmUpdateThemeIcon(saved);
}

function tmToggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(TM.THEME_KEY, next);
  tmUpdateThemeIcon(next);
}

function tmUpdateThemeIcon(theme) {
  document.querySelectorAll("[data-theme-icon]").forEach((el) => {
    el.className = theme === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
  });
}

/* ---------- Toast notifications ---------- */
function tmToast(message, type = "info") {
  let stack = document.querySelector(".tm-toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "tm-toast-stack";
    document.body.appendChild(stack);
  }
  const icon = type === "success" ? "bi-check-circle-fill" : type === "error" ? "bi-x-circle-fill" : "bi-info-circle-fill";
  const el = document.createElement("div");
  el.className = `tm-toast ${type}`;
  el.innerHTML = `<i class="bi ${icon}"></i><span class="msg">${message}</span>`;
  stack.appendChild(el);
  setTimeout(() => {
    el.classList.add("out");
    setTimeout(() => el.remove(), 280);
  }, 3200);
}

/* ---------- Mobile nav ---------- */
function tmInitNav() {
  const toggle = document.querySelector(".tm-nav-toggle");
  const links = document.querySelector(".tm-nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.style.display === "flex";
      links.style.display = open ? "none" : "flex";
      links.style.cssText += open ? "" : `
        position:absolute; top:${document.querySelector(".tm-nav").offsetHeight}px; left:0; right:0;
        flex-direction:column; align-items:stretch; background:var(--surface);
        padding:14px; border-bottom:1px solid var(--border); gap:6px;`;
    });
  }
  // Active link highlighting
  const page = document.body.dataset.page;
  document.querySelectorAll(".tm-nav-links a[data-nav]").forEach((a) => {
    if (a.dataset.nav === page) a.classList.add("active");
  });

  // Navbar shrink/opacity on scroll (subtle)
  const nav = document.querySelector(".tm-nav");
  if (nav) {
    window.addEventListener("scroll", () => {
      nav.style.boxShadow = window.scrollY > 12 ? "0 4px 20px rgba(11,46,51,0.08)" : "none";
    });
  }
}

/* ---------- Scroll reveal ---------- */
function tmInitScrollReveal() {
  const els = document.querySelectorAll(".fade-up");
  if (!("IntersectionObserver" in window) || !els.length) {
    els.forEach((e) => e.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
}

/* ---------- Favorites ----------
   Phase 4: localStorage stays the fast, synchronous cache that card
   rendering reads from (tmIsFavorite), so the UI never has to wait on a
   network round trip to draw a heart icon. When the person is signed in,
   every toggle is also pushed to the backend (POST/DELETE /api/favorites)
   in the background, and the cache is reconciled with the server's copy
   right after login. Guests keep working exactly as in Phase 3 — favorites
   just live in localStorage until they sign in. */
function tmGetFavorites() {
  try { return JSON.parse(localStorage.getItem(TM.FAV_KEY)) || []; } catch { return []; }
}
function tmIsFavorite(id) { return tmGetFavorites().includes(id); }
function tmToggleFavorite(id) {
  let favs = tmGetFavorites();
  const wasFav = favs.includes(id);
  favs = wasFav ? favs.filter((f) => f !== id) : [...favs, id];
  localStorage.setItem(TM.FAV_KEY, JSON.stringify(favs));
  tmToast(wasFav ? "Removed from favorites" : "Added to favorites", wasFav ? "info" : "success");

  const session = tmGetSession();
  if (session) {
    const call = wasFav
      ? TM_API.removeFavorite(session.userId, id)
      : TM_API.addFavorite(session.userId, id);
    // Fire-and-forget: roll back the local cache (silently) if the server rejects it,
    // e.g. a duplicate-favorite conflict on a stale cache.
    call.catch(() => {
      const current = tmGetFavorites();
      const reverted = wasFav ? [...current, id] : current.filter((f) => f !== id);
      localStorage.setItem(TM.FAV_KEY, JSON.stringify(reverted));
    });
  }
  return !wasFav;
}

/* Session-aware favorites list: pulls from the server for signed-in users,
   falls back to the local cache (looked up against the full attraction
   list) for guests. Used by pages that render the full favorites list. */
async function tmGetFavoriteAttractions() {
  const session = tmGetSession();
  if (session) {
    try { return await TM_API.getFavorites(session.userId); } catch { /* fall through to local cache */ }
  }
  const ids = tmGetFavorites();
  if (!ids.length) return [];
  const all = await TM_API.getAttractions();
  return ids.map((id) => all.find((a) => a.id === id)).filter(Boolean);
}

/* Called right after a successful login: merges any favorites saved while
   browsing as a guest up to the server, and pulls down whatever the account
   already had saved, so the local cache matches the server afterwards. */
async function tmSyncFavoritesOnLogin(userId) {
  try {
    const serverFavs = await TM_API.getFavorites(userId);
    const serverIds = serverFavs.map((a) => a.id);
    const localIds = tmGetFavorites();
    const toPush = localIds.filter((id) => !serverIds.includes(id));
    await Promise.all(toPush.map((id) => TM_API.addFavorite(userId, id).catch(() => null)));
    const merged = [...new Set([...serverIds, ...localIds])];
    localStorage.setItem(TM.FAV_KEY, JSON.stringify(merged));
  } catch {
    // Backend unreachable at login time — keep the local cache as-is.
  }
}

/* ---------- Itinerary draft (local persistence, posted to /api/itinerary in Phase 4) ---------- */
function tmGetItinerary() {
  try { return JSON.parse(localStorage.getItem(TM.ITIN_KEY)) || []; } catch { return []; }
}
function tmAddToItinerary(id) {
  let plan = tmGetItinerary();
  if (plan.includes(id)) { tmToast("Already in your day plan", "info"); return false; }
  plan.push(id);
  localStorage.setItem(TM.ITIN_KEY, JSON.stringify(plan));
  tmToast("Added to your day plan", "success");
  return true;
}
function tmRemoveFromItinerary(id) {
  const plan = tmGetItinerary().filter((p) => p !== id);
  localStorage.setItem(TM.ITIN_KEY, JSON.stringify(plan));
}

/* ---------- Session (demo auth persisted client-side until Phase 4 issues real tokens) ---------- */
function tmGetSession() {
  try { return JSON.parse(localStorage.getItem(TM.SESSION_KEY)) || null; } catch { return null; }
}
function tmSetSession(user) { localStorage.setItem(TM.SESSION_KEY, JSON.stringify(user)); }
function tmClearSession() { localStorage.removeItem(TM.SESSION_KEY); }

/* ---------- Formatting helpers ---------- */
function tmFormatFee(fee) {
  const n = Number(fee);
  return n === 0 ? "Free entry" : `Rs. ${n.toLocaleString("en-LK")}`;
}
function tmFormatDuration(mins) {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60), m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}
function tmStars(rating) {
  const r = Math.round(rating || 0);
  return `<i class="bi bi-star-fill"></i> ${rating ? rating.toFixed(1) : "New"}`;
}
function tmCategoryIcon(catId) {
  const cat = TM_CATEGORIES.find((c) => c.id === catId);
  return cat ? cat.icon : "bi-geo-alt";
}

/* ---------- Reusable attraction card + favorite & itinerary binding ---------- */
function tmAttractionCard(a) {
  const fav = tmIsFavorite(a.id);
  const mapUrl = a.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${a.latitude},${a.longitude}`;
  const shortDesc = a.description ? (a.description.length > 95 ? a.description.substring(0, 95) + "..." : a.description) : "";

  return `
  <div class="col-md-6 col-lg-4 fade-up in">
    <div class="tm-card h-100 d-flex flex-column shadow-sm rounded-4 overflow-hidden border">
      <div class="tm-card-media position-relative">
        <span class="tm-card-badge"><i class="bi ${tmCategoryIcon(a.categoryId)} me-1"></i>${a.categoryName}</span>
        <button class="tm-card-fav ${fav ? "active" : ""}" data-fav-id="${a.id}" title="Save to favorites">
          <i class="bi ${fav ? "bi-heart-fill" : "bi-heart"}"></i>
        </button>
        <img src="${a.imageUrl}" alt="${a.name}" loading="lazy" style="height: 210px; width: 100%; object-fit: cover;">
      </div>
      <div class="tm-card-body p-3 d-flex flex-column flex-grow-1">
        <h3 class="fs-5 fw-bold mb-1">
          <a href="place-details.html?id=${a.id}" class="text-decoration-none text-dark hover-primary">${a.name}</a>
        </h3>
        <p class="text-muted small mb-2"><i class="bi bi-geo-alt text-danger me-1"></i>${a.location || "Kalutara District"}</p>
        
        <p class="text-secondary small mb-3 flex-grow-1" style="font-size: 0.85rem; line-height: 1.45;">${shortDesc}</p>

        <div class="tm-card-meta mb-3 p-2 rounded-3 bg-light d-flex justify-content-between small text-secondary">
          <span><i class="bi bi-signpost-2 text-primary"></i> ~${a.distanceKm} km</span>
          <span><i class="bi bi-clock text-info"></i> ~${tmFormatDuration(a.durationMinutes)}</span>
          <span class="fw-semibold text-warning"><i class="bi bi-star-fill text-warning"></i> ${a.averageRating ? a.averageRating.toFixed(1) : "New"}</span>
        </div>

        <div class="d-flex gap-2 pt-2 border-top">
          <a href="place-details.html?id=${a.id}" class="btn btn-sm btn-outline-primary flex-fill fw-medium rounded-pill">
            <i class="bi bi-info-circle me-1"></i> Details
          </a>
          <button type="button" class="btn btn-sm btn-primary flex-fill fw-medium rounded-pill" data-add-trip-id="${a.id}">
            <i class="bi bi-plus-circle me-1"></i> Add to Trip
          </button>
          <a href="${mapUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-light border rounded-pill px-2" title="Open in Google Maps">
            <i class="bi bi-map text-success"></i>
          </a>
        </div>
      </div>
    </div>
  </div>`;
}

function tmBindTripButtons(scope = document) {
  scope.querySelectorAll("[data-add-trip-id]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = Number(btn.dataset.addTripId);
      tmAddToItinerary(id);
    });
  });
}

function tmBindFavoriteButtons(scope = document) {
  tmBindTripButtons(scope);
  scope.querySelectorAll("[data-fav-id]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = Number(btn.dataset.favId);
      const nowFav = tmToggleFavorite(id);
      btn.classList.toggle("active", nowFav);
      btn.querySelector("i").className = `bi ${nowFav ? "bi-heart-fill" : "bi-heart"}`;
    });
  });
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  tmInitTheme();
  tmInitNav();
  tmInitScrollReveal();

  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", tmToggleTheme);
  });

  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Reflect logged-in state in navbar (login link -> account)
  const session = tmGetSession();
  const authSlot = document.querySelector("[data-auth-slot]");
  if (session && authSlot) {
    authSlot.innerHTML = `
      <a href="${session.role === 'ADMIN' ? 'admin-dashboard.html' : 'favorites.html'}" class="btn-tm btn-tm-outline btn-tm-sm">
        <i class="bi bi-person-circle"></i> ${session.fullName.split(" ")[0]}
      </a>`;
    document.querySelectorAll("[data-auth-hide]").forEach((el) => el.classList.add("d-none"));
  }
});
