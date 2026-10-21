/* ==========================================================================
   TRAVEL MATE — Home Page Logic
   ========================================================================== */

async function tmRenderHomeCategories() {
  const grid = document.getElementById("homeCategoryGrid");
  const select = document.getElementById("heroCategory");
  if (!grid) return;

  grid.innerHTML = Array.from({ length: 4 })
    .map(() => `<div class="col-sm-6 col-lg-3"><div class="tm-skel tm-skel-card"></div></div>`)
    .join("");

  const [categories, attractions] = await Promise.all([TM_API.getCategories(), TM_API.getAttractions()]);

  const colors = ["#f2542d", "#0f5c5c", "#e8a33d", "#0b2e33", "#10b981", "#8b5cf6"];
  grid.innerHTML = categories
    .map((c, i) => {
      const count = attractions.filter((a) => a.categoryId === c.id || a.categoryName === c.name).length;
      const color = c.color || colors[i % colors.length];
      const hasImage = Boolean(c.imageUrl);

      if (hasImage) {
        return `
        <div class="col-sm-6 col-lg-4 fade-up in">
          <a href="places.html?category=${c.id}" class="tm-card d-block text-decoration-none h-100 overflow-hidden position-relative" style="border-radius:18px; border:1px solid var(--border);">
            <div style="height:150px; overflow:hidden; position:relative;">
              <img src="${c.imageUrl}" alt="${c.name}" style="width:100%; height:100%; object-fit:cover; transition:transform 0.4s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
              <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%);"></div>
              <span class="badge position-absolute top-0 end-0 m-3 px-2 py-1 shadow-sm" style="background:${color}; color:#fff; font-size:0.75rem;">
                <i class="bi ${c.icon || 'bi-tag'} me-1"></i> ${count} spot${count === 1 ? "" : "s"}
              </span>
            </div>
            <div class="p-3">
              <div class="d-flex align-items-center gap-2 mb-2">
                <div class="rounded-circle d-flex align-items-center justify-content-center" style="width:36px; height:36px; background:${color}1a; color:${color}; flex-shrink:0;">
                  <i class="bi ${c.icon || 'bi-tag'} fs-6"></i>
                </div>
                <h5 class="mb-0 fw-bold text-dark">${c.name}</h5>
              </div>
              <p class="text-muted-tm small mb-0" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${c.description}</p>
            </div>
          </a>
        </div>`;
      }

      return `
      <div class="col-sm-6 col-lg-4 fade-up in">
        <a href="places.html?category=${c.id}" class="tm-card d-block p-4 text-decoration-none h-100" style="border-radius:18px; border:1px solid var(--border);">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="d-flex align-items-center justify-content-center rounded-circle"
                 style="width:52px;height:52px;background:${color}1a;">
              <i class="bi ${c.icon}" style="font-size:1.4rem;color:${color}"></i>
            </div>
            <span class="tm-badge-soft">${count} spot${count === 1 ? "" : "s"}</span>
          </div>
          <h5 class="mb-1 text-dark fw-bold">${c.name}</h5>
          <p class="text-muted-tm small mb-0">${c.description}</p>
        </a>
      </div>`;
    })
    .join("");

  if (select && categories.length > 0) {
    select.innerHTML = `<option value="">All Categories</option>` + categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");
  }
}

async function tmRenderHomeFeatured() {
  const grid = document.getElementById("homeFeaturedGrid");
  if (!grid) return;

  grid.innerHTML = Array.from({ length: 3 })
    .map(() => `<div class="col-md-6 col-lg-4"><div class="tm-skel tm-skel-card"></div></div>`)
    .join("");

  const attractions = await TM_API.getAttractions();
  const top = [...attractions].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0)).slice(0, 3);

  grid.innerHTML = top.map(tmAttractionCard).join("");
  tmBindFavoriteButtons(grid);
}

document.addEventListener("DOMContentLoaded", () => {
  tmRenderHomeCategories();
  tmRenderHomeFeatured();

  const form = document.getElementById("heroSearchForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const keyword = document.getElementById("heroKeyword").value.trim();
      const category = document.getElementById("heroCategory").value;
      const params = new URLSearchParams();
      if (keyword) params.set("q", keyword);
      if (category) params.set("category", category);
      window.location.href = `places.html${params.toString() ? "?" + params : ""}`;
    });
  }
});
