/* ==========================================================================
   TRAVEL MATE — Places (Explore Destinations) Page Logic
   ========================================================================== */

let tmPlacesState = { category: "", keyword: "", sort: "distance" };

async function tmInitPlacesChips() {
  const chipRow = document.getElementById("placesCategoryChips");
  if (!chipRow) return;
  
  const categories = await TM_API.getCategories();
  const chipsHtml = categories
    .map((c) => `<span class="tm-chip" data-cat="${c.id}"><i class="bi ${c.icon || 'bi-pin-map'}" style="${c.color ? `color:${c.color};` : ''}"></i> ${c.name}</span>`)
    .join("");
  chipRow.insertAdjacentHTML("beforeend", chipsHtml);

  chipRow.querySelectorAll(".tm-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      chipRow.querySelectorAll(".tm-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      tmPlacesState.category = chip.dataset.cat;
      tmRenderPlaces();
    });
  });

  // Preselect from URL (?category= or ?q=)
  const params = new URLSearchParams(window.location.search);
  const cat = params.get("category");
  const q = params.get("q");
  if (cat) {
    tmPlacesState.category = cat;
    const target = chipRow.querySelector(`[data-cat="${cat}"]`);
    if (target) {
      chipRow.querySelectorAll(".tm-chip").forEach((c) => c.classList.remove("active"));
      target.classList.add("active");
    }
  }
  if (q) {
    tmPlacesState.keyword = q;
    const searchInput = document.getElementById("placesSearch");
    if (searchInput) searchInput.value = q;
  }
}

function tmSortAttractions(list, sort) {
  const arr = [...list];
  switch (sort) {
    case "distance":
      return arr.sort((a, b) => (Number(a.distanceKm) || 0) - (Number(b.distanceKm) || 0));
    case "duration":
      return arr.sort((a, b) => (Number(a.visitDurationMinutes) || 60) - (Number(b.visitDurationMinutes) || 60));
    case "name":
      return arr.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    case "rating":
      return arr.sort((a, b) => (Number(b.averageRating) || 0) - (Number(a.averageRating) || 0));
    default:
      return arr.sort((a, b) => (Number(a.distanceKm) || 0) - (Number(b.distanceKm) || 0));
  }
}

async function tmRenderPlaces() {
  const grid = document.getElementById("placesGrid");
  const empty = document.getElementById("placesEmpty");
  const countEl = document.getElementById("placesResultCount");
  if (!grid) return;

  grid.innerHTML = Array.from({ length: 6 })
    .map(() => `<div class="col-md-6 col-lg-4"><div class="tm-skel tm-skel-card" style="height:380px;border-radius:18px;"></div></div>`)
    .join("");
  if (empty) empty.classList.add("d-none");

  try {
    let list = await TM_API.getAttractions({
      categoryId: tmPlacesState.category || undefined,
      keyword: tmPlacesState.keyword || undefined,
    });
    list = tmSortAttractions(list, tmPlacesState.sort);

    if (countEl) {
      countEl.innerHTML = `Showing <strong>${list.length}</strong> attraction${list.length === 1 ? "" : "s"}${
        tmPlacesState.category ? " in selected category" : ""
      }${tmPlacesState.keyword ? ` matching "<em>${tmPlacesState.keyword}</em>"` : ""}`;
    }

    if (!list.length) {
      grid.innerHTML = "";
      if (empty) empty.classList.remove("d-none");
      return;
    }

    grid.innerHTML = list.map(tmAttractionCard).join("");
    tmBindFavoriteButtons(grid);
    tmBindTripButtons(grid);
  } catch (err) {
    console.error("Failed to load attractions:", err);
    if (countEl) countEl.textContent = "Error loading attractions from server.";
  }
}

function tmBindTripButtons(container) {
  if (!container) return;
  container.querySelectorAll("[data-add-trip-id]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const id = btn.getAttribute("data-add-trip-id");
      try {
        const item = await TM_API.getAttractionById(id);
        if (item) {
          const added = tmAddDestinationToPlan(item);
          if (added) {
            btn.innerHTML = `<i class="bi bi-check2"></i> Added`;
            btn.classList.add("btn-success");
            btn.classList.remove("btn-outline-primary");
            setTimeout(() => {
              btn.innerHTML = `<i class="bi bi-plus-circle"></i> Add to Trip`;
              btn.classList.remove("btn-success");
              btn.classList.add("btn-outline-primary");
            }, 1800);
          }
        }
      } catch (err) {
        console.error("Add to plan error:", err);
      }
    });
  });
}

function tmResetFilters() {
  tmPlacesState.category = "";
  tmPlacesState.keyword = "";
  tmPlacesState.sort = "distance";
  
  const searchInput = document.getElementById("placesSearch");
  if (searchInput) searchInput.value = "";
  
  const sortSelect = document.getElementById("placesSort");
  if (sortSelect) sortSelect.value = "distance";

  const chipRow = document.getElementById("placesCategoryChips");
  if (chipRow) {
    chipRow.querySelectorAll(".tm-chip").forEach((c) => c.classList.remove("active"));
    const allChip = chipRow.querySelector('[data-cat=""]');
    if (allChip) allChip.classList.add("active");
  }

  tmRenderPlaces();
}

document.addEventListener("DOMContentLoaded", async () => {
  await tmInitPlacesChips();
  tmRenderPlaces();

  let searchTimer;
  const searchInput = document.getElementById("placesSearch");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        tmPlacesState.keyword = e.target.value.trim();
        tmRenderPlaces();
      }, 250);
    });
  }

  const sortSelect = document.getElementById("placesSort");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      tmPlacesState.sort = e.target.value;
      tmRenderPlaces();
    });
  }

  const clearBtn = document.getElementById("placesClearFilters");
  if (clearBtn) {
    clearBtn.addEventListener("click", tmResetFilters);
  }

  const emptyResetBtn = document.getElementById("placesEmptyResetBtn");
  if (emptyResetBtn) {
    emptyResetBtn.addEventListener("click", tmResetFilters);
  }
});
