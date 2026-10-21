/* ==========================================================================
   TRAVEL MATE — Favorites Page Logic
   ========================================================================== */

async function tmRenderFavorites() {
  const grid = document.getElementById("favGrid");
  const empty = document.getElementById("favEmpty");
  const countEl = document.getElementById("favCount");
  const addAllBtn = document.getElementById("favAddAllBtn");

  const favs = await tmGetFavoriteAttractions();
  countEl.textContent = `${favs.length} saved attraction${favs.length === 1 ? "" : "s"}`;

  if (!favs.length) {
    grid.innerHTML = "";
    empty.classList.remove("d-none");
    addAllBtn.classList.add("d-none");
    return;
  }
  empty.classList.add("d-none");
  addAllBtn.classList.remove("d-none");

  grid.innerHTML = favs.map(tmAttractionCard).join("");
  tmBindFavoriteButtons(grid);
  // Re-render list live when a heart is unclicked from within this page
  grid.querySelectorAll("[data-fav-id]").forEach((btn) => {
    btn.addEventListener("click", () => setTimeout(tmRenderFavorites, 260));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  tmRenderFavorites();

  document.getElementById("favAddAllBtn").addEventListener("click", async () => {
    const favs = await tmGetFavoriteAttractions();
    favs.forEach((a) => {
      const plan = tmGetItinerary();
      if (!plan.includes(a.id)) plan.push(a.id);
      localStorage.setItem(TM.ITIN_KEY, JSON.stringify(plan));
    });
    tmToast(`Added ${favs.length} attraction${favs.length === 1 ? "" : "s"} to your day plan`, "success");
  });
});
