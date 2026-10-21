/* ==========================================================================
   TRAVEL MATE — Manage Attractions & Categories (Admin CRUD) Logic
   ========================================================================== */

let tmAttractionModal, tmCategoryModal;
let tmAttrSearchTerm = "";
let tmCatSearchTerm = "";

/* Curated Sri Lankan Travel Image Presets for 1-Click Category Setup */
const TM_CAT_PRESETS = [
  { name: "Recreation & Parks", icon: "bi-controller", url: "https://images.unsplash.com/photo-1582650625119-3a31f8418399?auto=format&fit=crop&w=900&q=80" },
  { name: "Adventure & Racing", icon: "bi-speedometer2", url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=900&q=80" },
  { name: "Nature & Lakes", icon: "bi-tree", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80" },
  { name: "Waterfalls & Forest", icon: "bi-tsunami", url: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=900&q=80" },
  { name: "Golden Beaches", icon: "bi-water", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80" },
  { name: "Sacred Stupas", icon: "bi-bank", url: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80" },
  { name: "Historical Mansions", icon: "bi-compass", url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80" },
  { name: "Scenic Highlands", icon: "bi-sunset", url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80" },
];

/* Popular Travel Icons Catalog */
const TM_TRAVEL_ICONS = [
  "bi-controller", "bi-speedometer2", "bi-tree", "bi-water", "bi-bank", "bi-bank2",
  "bi-compass", "bi-cup-hot", "bi-camera", "bi-bicycle", "bi-tsunami", "bi-signpost-split",
  "bi-stars", "bi-shop", "bi-sunset", "bi-building", "bi-geo-alt", "bi-flower1",
  "bi-binoculars", "bi-fire", "bi-heart", "bi-shield-check", "bi-flag", "bi-map"
];

/* ---------- Tab switching ---------- */
function tmShowTab(tab) {
  ["attractions", "categories", "reviews"].forEach((t) => {
    const el = document.getElementById(`tab${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (el) el.classList.toggle("d-none", t !== tab);
  });
  document.querySelectorAll("[data-tab-link]").forEach((a) => a.classList.toggle("active", a.dataset.tabLink === tab));
  const topTitle = document.getElementById("topbarTitle");
  if (topTitle) {
    topTitle.textContent =
      tab === "attractions" ? "Manage Attractions" : tab === "categories" ? "Manage Categories" : "Manage Reviews";
  }
  if (tab === "attractions") tmRenderAttractionsTable();
  if (tab === "categories") tmRenderCategoriesTable();
  if (tab === "reviews") tmRenderReviewsTable();
}

/* ---------- Attractions CRUD ---------- */
async function tmRenderAttractionsTable() {
  const body = document.getElementById("attractionsTableBody");
  if (!body) return;

  try {
    const attractions = await TM_API.getAttractions({ keyword: tmAttrSearchTerm || undefined });
    const countEl = document.getElementById("attrCount");
    if (countEl) countEl.textContent = `(${attractions.length})`;

    if (!attractions.length) {
      body.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No attractions match "${tmAttrSearchTerm}".</td></tr>`;
      return;
    }

    body.innerHTML = attractions
      .map(
        (a) => `
        <tr>
          <td>
            <div class="d-flex align-items-center gap-2">
              <img src="${a.imageUrl}" class="thumb rounded-2" alt="${a.name}" style="width:42px;height:42px;object-fit:cover;">
              <div>
                <span class="fw-bold text-dark d-block">${a.name}</span>
                <small class="text-muted"><i class="bi bi-geo-alt"></i> ${a.location || "Kalutara"}</small>
              </div>
            </div>
          </td>
          <td><span class="tm-badge-soft">${a.categoryName || "General"}</span></td>
          <td><small class="text-muted">${a.location || "Kalutara District"}</small></td>
          <td>${a.distanceKm || "--"} km</td>
          <td>${tmFormatDuration(a.visitDurationMinutes || a.durationMinutes || 60)}</td>
          <td><span class="fw-semibold text-teal">${tmFormatFee(a.entranceFee)}</span></td>
          <td class="text-end">
            <button class="tm-icon-action btn btn-sm btn-outline-secondary me-1" data-edit-attr="${a.id}" title="Edit destination">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="tm-icon-action danger btn btn-sm btn-outline-danger" data-del-attr="${a.id}" title="Delete destination">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>`
      )
      .join("");

    body.querySelectorAll("[data-edit-attr]").forEach((btn) =>
      btn.addEventListener("click", () => tmOpenAttractionModal(Number(btn.dataset.editAttr)))
    );

    body.querySelectorAll("[data-del-attr]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        if (!confirm("Are you sure you want to delete this attraction? This action is permanent and will remove the attraction from the database.")) {
          return;
        }
        try {
          await TM_API.deleteAttraction(Number(btn.dataset.delAttr));
          tmToast("Destination deleted successfully", "success");
          tmRenderAttractionsTable();
        } catch (err) {
          tmToast(err.message || "Failed to delete attraction", "error");
        }
      })
    );
  } catch (err) {
    console.error("Error loading attractions table:", err);
    body.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-danger">Error loading attractions from server.</td></tr>`;
  }
}

async function tmOpenAttractionModal(id) {
  const form = document.getElementById("attractionForm");
  form.reset();
  document.getElementById("attrId").value = "";
  document.getElementById("attractionModalTitle").textContent = id ? "Edit Destination" : "Add Destination";

  // Reset attraction image preview
  const imgPreviewContainer = document.getElementById("attrImagePreviewContainer");
  const imgPreview = document.getElementById("attrImagePreview");
  const clearImgBtn = document.getElementById("btnClearAttrImage");
  if (imgPreviewContainer) imgPreviewContainer.classList.add("d-none");
  if (clearImgBtn) clearImgBtn.style.display = "none";

  try {
    const categories = await TM_API.getCategories();
    document.getElementById("attrCategory").innerHTML = categories
      .map((c) => `<option value="${c.id}">${c.name}</option>`)
      .join("");

    if (id) {
      const a = await TM_API.getAttractionById(id);
      if (a) {
        document.getElementById("attrId").value = a.id;
        document.getElementById("attrName").value = a.name || "";
        document.getElementById("attrCategory").value = a.categoryId || (categories[0] ? categories[0].id : "");
        document.getElementById("attrLocation").value = a.location || "";
        document.getElementById("attrDescription").value = a.description || "";
        document.getElementById("attrDistance").value = a.distanceKm || "";
        document.getElementById("attrDuration").value = a.visitDurationMinutes || a.durationMinutes || 60;
        document.getElementById("attrFee").value = a.entranceFee !== undefined ? a.entranceFee : 0;
        document.getElementById("attrHours").value = a.openingHours || "08:00 AM - 05:00 PM";
        document.getElementById("attrLat").value = a.latitude || "";
        document.getElementById("attrLng").value = a.longitude || "";
        document.getElementById("attrImage").value = a.imageUrl || "";
        document.getElementById("attrGoogleMapsUrl").value = a.googleMapsUrl || "";

        if (a.imageUrl && imgPreview && imgPreviewContainer) {
          imgPreview.src = a.imageUrl;
          imgPreviewContainer.classList.remove("d-none");
          if (clearImgBtn) clearImgBtn.style.display = "inline-block";
        }
      }
    }
    tmAttractionModal.show();
  } catch (err) {
    console.error("Error opening attraction modal:", err);
    tmToast("Failed to load destination data", "error");
  }
}

async function tmSaveAttraction(e) {
  e.preventDefault();
  const id = document.getElementById("attrId").value;
  const saveBtn = document.getElementById("saveAttrSubmitBtn");
  const origBtnText = saveBtn ? saveBtn.innerHTML : "";
  if (saveBtn) {
    saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Saving...`;
    saveBtn.disabled = true;
  }

  const dto = {
    name: document.getElementById("attrName").value.trim(),
    categoryId: Number(document.getElementById("attrCategory").value),
    location: document.getElementById("attrLocation").value.trim(),
    description: document.getElementById("attrDescription").value.trim(),
    distanceKm: Number(document.getElementById("attrDistance").value),
    visitDurationMinutes: Number(document.getElementById("attrDuration").value),
    durationMinutes: Number(document.getElementById("attrDuration").value),
    entranceFee: Number(document.getElementById("attrFee").value),
    openingHours: document.getElementById("attrHours").value.trim(),
    latitude: Number(document.getElementById("attrLat").value),
    longitude: Number(document.getElementById("attrLng").value),
    imageUrl: document.getElementById("attrImage").value.trim(),
    googleMapsUrl: document.getElementById("attrGoogleMapsUrl").value.trim(),
  };

  try {
    if (id) {
      await TM_API.updateAttraction(id, dto);
      tmToast("Destination updated successfully", "success");
    } else {
      await TM_API.createAttraction(dto);
      tmToast("Destination added successfully to database", "success");
    }
    tmAttractionModal.hide();
    tmRenderAttractionsTable();
  } catch (err) {
    console.error("Error saving attraction:", err);
    tmToast(err.message || "Failed to save destination", "error");
  } finally {
    if (saveBtn) {
      saveBtn.innerHTML = origBtnText;
      saveBtn.disabled = false;
    }
  }
}

/* ==========================================================================
   CATEGORIES CRUD & IMAGE MANAGEMENT
   ========================================================================== */

/* Set category image URL and update UI preview state */
function tmSetCatImage(url) {
  const hiddenInput = document.getElementById("catImageUrl");
  const bannerBox = document.getElementById("catImageBannerBox");
  const emptyBox = document.getElementById("catImageEmptyBox");
  const previewImg = document.getElementById("catPreviewImg");
  const loadedBadge = document.getElementById("catImageLoadedBadge");
  const urlInput = document.getElementById("catImageUrlInput");

  const cleanUrl = (url || "").trim();
  if (hiddenInput) hiddenInput.value = cleanUrl;

  if (cleanUrl) {
    if (previewImg) previewImg.src = cleanUrl;
    if (bannerBox) bannerBox.classList.remove("d-none");
    if (emptyBox) emptyBox.classList.add("d-none");
    if (loadedBadge) loadedBadge.classList.remove("d-none");
    if (urlInput && !cleanUrl.startsWith("data:")) urlInput.value = cleanUrl;
  } else {
    if (previewImg) previewImg.src = "";
    if (bannerBox) bannerBox.classList.add("d-none");
    if (emptyBox) emptyBox.classList.remove("d-none");
    if (loadedBadge) loadedBadge.classList.add("d-none");
    if (urlInput) urlInput.value = "";
    const fileInput = document.getElementById("catImageFileInput");
    if (fileInput) fileInput.value = "";
  }
  tmUpdateCategoryMockup();
}

/* Delete / Remove Category Image */
function tmDeleteCatImage() {
  tmSetCatImage("");
  tmToast("Category cover image removed", "info");
}

/* Set category theme accent color */
function tmSetCatColor(color) {
  const c = color || "#f2542d";
  const hidden = document.getElementById("catColor");
  const picker = document.getElementById("catColorPicker");
  if (hidden) hidden.value = c;
  if (picker) picker.value = c;

  document.querySelectorAll(".cat-color-dot").forEach((dot) => {
    dot.classList.toggle("active", dot.dataset.color && dot.dataset.color.toLowerCase() === c.toLowerCase());
  });

  const preview = document.getElementById("catIconPreview");
  if (preview) preview.style.color = c;

  tmUpdateCategoryMockup();
}

/* Update Live Tourist Card Mockup */
function tmUpdateCategoryMockup() {
  const nameInput = document.getElementById("catName");
  const descInput = document.getElementById("catDescription");
  const iconInput = document.getElementById("catIcon");
  const colorInput = document.getElementById("catColor");

  const mockupTitle = document.getElementById("mockupTitle");
  const mockupDesc = document.getElementById("mockupDesc");
  const mockupIcon = document.getElementById("mockupIcon");
  const mockupIconBg = document.getElementById("mockupIconBg");

  const titleVal = nameInput && nameInput.value.trim() ? nameInput.value.trim() : "Category Name";
  const descVal = descInput && descInput.value.trim() ? descInput.value.trim() : "Brief explanation of attractions included...";
  const iconVal = iconInput && iconInput.value.trim() ? iconInput.value.trim() : "bi-controller";
  const colorVal = colorInput && colorInput.value ? colorInput.value : "#f2542d";

  if (mockupTitle) mockupTitle.textContent = titleVal;
  if (mockupDesc) mockupDesc.textContent = descVal;
  if (mockupIcon) {
    mockupIcon.className = `bi ${iconVal}`;
    mockupIcon.style.color = colorVal;
  }
  if (mockupIconBg) {
    mockupIconBg.style.background = `${colorVal}22`;
  }
}

/* Render Categories Table */
async function tmRenderCategoriesTable() {
  const body = document.getElementById("categoriesTableBody");
  if (!body) return;

  try {
    let [categories, attractions] = await Promise.all([TM_API.getCategories(), TM_API.getAttractions()]);

    if (tmCatSearchTerm) {
      const q = tmCatSearchTerm.toLowerCase();
      categories = categories.filter(
        (c) =>
          (c.name && c.name.toLowerCase().includes(q)) ||
          (c.description && c.description.toLowerCase().includes(q)) ||
          (c.icon && c.icon.toLowerCase().includes(q))
      );
    }

    const countEl = document.getElementById("catCount");
    if (countEl) countEl.textContent = `(${categories.length})`;

    if (!categories.length) {
      body.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No categories match "${tmCatSearchTerm}".</td></tr>`;
      return;
    }

    body.innerHTML = categories
      .map((c) => {
        const count = attractions.filter((a) => a.categoryId === c.id || a.categoryName === c.name).length;
        const color = c.color || "#f2542d";
        const isFeatured = c.isFeatured !== false;

        const thumbHtml = c.imageUrl
          ? `<img src="${c.imageUrl}" class="cat-thumb" alt="${c.name}" onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\\'cat-icon-avatar\\' style=\\'background:${color}22;color:${color};\\'><i class=\\'bi ${c.icon || 'bi-tag'}\\'></i></div>';">`
          : `<div class="cat-icon-avatar" style="background:${color}22;color:${color};"><i class="bi ${c.icon || 'bi-tag'}"></i></div>`;

        return `
        <tr>
          <td>${thumbHtml}</td>
          <td>
            <div class="d-flex align-items-center gap-2">
              <span class="cat-color-dot" style="width:12px;height:12px;background:${color};"></span>
              <span class="fw-bold text-dark">${c.name}</span>
            </div>
          </td>
          <td>
            <span class="badge rounded-pill text-dark border bg-light">
              <i class="bi ${c.icon || 'bi-tag'} me-1" style="color:${color};"></i> ${c.icon || 'bi-tag'}
            </span>
          </td>
          <td class="text-muted small" style="max-width:260px;">${c.description || "—"}</td>
          <td>
            <button class="btn btn-sm btn-light border py-0 px-2 rounded-pill small" data-filter-cat="${c.id}" data-cat-name="${c.name}" title="Filter attractions under ${c.name}">
              <i class="bi bi-geo-alt me-1 text-primary"></i> ${count} spot${count === 1 ? "" : "s"}
            </button>
          </td>
          <td>
            ${
              isFeatured
                ? '<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle"><i class="bi bi-star-fill me-1"></i> Featured</span>'
                : '<span class="badge bg-light text-muted border">Standard</span>'
            }
          </td>
          <td class="text-end">
            <button class="tm-icon-action btn btn-sm btn-outline-secondary me-1" data-edit-cat="${c.id}" title="Edit category branding & image">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="tm-icon-action btn btn-sm btn-outline-secondary me-1" data-dup-cat="${c.id}" title="Duplicate this category as template">
              <i class="bi bi-copy"></i>
            </button>
            <button class="tm-icon-action danger btn btn-sm btn-outline-danger" data-del-cat="${c.id}" data-cat-name="${c.name}" data-count="${count}" title="Delete category">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>`;
      })
      .join("");

    body.querySelectorAll("[data-edit-cat]").forEach((btn) =>
      btn.addEventListener("click", () => tmOpenCategoryModal(Number(btn.dataset.editCat)))
    );

    body.querySelectorAll("[data-dup-cat]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        const id = Number(btn.dataset.dupCat);
        const cats = await TM_API.getCategories();
        const orig = cats.find((x) => x.id === id);
        if (orig) {
          await tmOpenCategoryModal(null);
          document.getElementById("catName").value = `${orig.name} (Copy)`;
          document.getElementById("catIcon").value = orig.icon || "bi-tag";
          document.getElementById("catDescription").value = orig.description || "";
          tmSetCatColor(orig.color || "#f2542d");
          tmSetCatImage(orig.imageUrl || "");
          tmToast("Category duplicated into form. Review and click Save.", "info");
        }
      })
    );

    body.querySelectorAll("[data-filter-cat]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const catName = btn.dataset.catName;
        tmShowTab("attractions");
        const searchInput = document.getElementById("attrSearch");
        if (searchInput) {
          searchInput.value = catName;
          tmAttrSearchTerm = catName;
          tmRenderAttractionsTable();
        }
      })
    );

    body.querySelectorAll("[data-del-cat]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        const catId = Number(btn.dataset.delCat);
        const catName = btn.dataset.catName || "this category";
        const count = Number(btn.dataset.count || 0);

        const warningMsg =
          count > 0
            ? `WARNING: Category "${catName}" is currently linked to ${count} destination(s).\nDeleting this category will affect those attractions.\n\nAre you sure you want to permanently delete it?`
            : `Are you sure you want to delete category "${catName}"? This action cannot be undone.`;

        if (!confirm(warningMsg)) return;

        try {
          await TM_API.deleteCategory(catId);
          tmToast(`Category "${catName}" deleted successfully`, "success");
          tmRenderCategoriesTable();
        } catch (err) {
          tmToast(err.message || "Failed to delete category", "error");
        }
      })
    );
  } catch (err) {
    console.error("Error loading categories:", err);
    body.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-danger">Error loading categories from server.</td></tr>`;
  }
}

/* Open Category Add/Edit Modal */
async function tmOpenCategoryModal(id) {
  const form = document.getElementById("categoryForm");
  form.reset();
  document.getElementById("catId").value = "";
  document.getElementById("categoryModalTitle").textContent = id ? "Edit Category" : "Add Category";
  document.getElementById("categoryModalSubtitle").textContent = id
    ? "Update category branding, cover photo, icons, and theme colors"
    : "Create a new classification category with custom images and branding";

  const usageAlert = document.getElementById("catUsageAlert");
  const usageText = document.getElementById("catUsageText");

  if (id) {
    const [categories, attractions] = await Promise.all([TM_API.getCategories(), TM_API.getAttractions()]);
    const c = categories.find((x) => x.id === id);
    if (c) {
      document.getElementById("catId").value = c.id;
      document.getElementById("catName").value = c.name || "";
      document.getElementById("catIcon").value = c.icon || "bi-tag";
      document.getElementById("catDescription").value = c.description || "";

      const isFeatured = c.isFeatured !== false;
      const isActive = c.isActive !== false;
      const featEl = document.getElementById("catIsFeatured");
      const actEl = document.getElementById("catIsActive");
      if (featEl) featEl.checked = isFeatured;
      if (actEl) actEl.checked = isActive;

      tmSetCatColor(c.color || "#f2542d");
      tmSetCatImage(c.imageUrl || "");

      // Associated attractions count & filter shortcut
      const linked = attractions.filter((a) => a.categoryId === c.id || a.categoryName === c.name);
      if (usageAlert && usageText) {
        usageAlert.classList.remove("d-none");
        const sampleNames = linked.slice(0, 2).map((a) => a.name).join(", ");
        usageText.innerHTML = `Associated with <strong>${linked.length} destination${linked.length === 1 ? "" : "s"}</strong>${
          sampleNames ? ` (${sampleNames}${linked.length > 2 ? "..." : ""})` : ""
        }`;

        const filterBtn = document.getElementById("catFilterDestinationsBtn");
        if (filterBtn) {
          filterBtn.onclick = () => {
            tmCategoryModal.hide();
            tmShowTab("attractions");
            const searchInput = document.getElementById("attrSearch");
            if (searchInput) {
              searchInput.value = c.name;
              tmAttrSearchTerm = c.name;
              tmRenderAttractionsTable();
            }
          };
        }
      }
    }
  } else {
    if (usageAlert) usageAlert.classList.add("d-none");
    tmSetCatColor("#f2542d");
    tmSetCatImage("");
    const featEl = document.getElementById("catIsFeatured");
    const actEl = document.getElementById("catIsActive");
    if (featEl) featEl.checked = true;
    if (actEl) actEl.checked = true;
    document.getElementById("catIcon").value = "bi-tag";
  }

  // Update live preview & character counter
  tmUpdateCategoryMockup();
  const descEl = document.getElementById("catDescription");
  const countEl = document.getElementById("catDescCount");
  if (descEl && countEl) {
    countEl.textContent = `${descEl.value.length} / 500`;
  }

  // Update icon badge preview
  const iconInput = document.getElementById("catIcon");
  const iconPreview = document.getElementById("catIconPreview");
  if (iconInput && iconPreview) {
    iconPreview.className = `bi ${iconInput.value.trim() || "bi-tag"} fs-5`;
  }

  tmCategoryModal.show();
}

/* Save Category (Add or Update) */
async function tmSaveCategory(e) {
  e.preventDefault();
  const id = document.getElementById("catId").value;
  const saveBtn = document.getElementById("saveCatSubmitBtn");
  const origBtnText = saveBtn ? saveBtn.innerHTML : "";
  if (saveBtn) {
    saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Saving...`;
    saveBtn.disabled = true;
  }

  const dto = {
    name: document.getElementById("catName").value.trim(),
    icon: document.getElementById("catIcon").value.trim() || "bi-tag",
    description: document.getElementById("catDescription").value.trim(),
    imageUrl: (document.getElementById("catImageUrl").value || "").trim(),
    color: document.getElementById("catColor").value || "#f2542d",
    isFeatured: document.getElementById("catIsFeatured") ? document.getElementById("catIsFeatured").checked : true,
    isActive: document.getElementById("catIsActive") ? document.getElementById("catIsActive").checked : true,
  };

  try {
    if (id) {
      await TM_API.updateCategory(id, dto);
      tmToast("Category updated successfully", "success");
    } else {
      await TM_API.createCategory(dto);
      tmToast("Category created successfully", "success");
    }
    tmCategoryModal.hide();
    tmRenderCategoriesTable();
  } catch (err) {
    console.error("Error saving category:", err);
    tmToast(err.message || "Failed to save category", "error");
  } finally {
    if (saveBtn) {
      saveBtn.innerHTML = origBtnText;
      saveBtn.disabled = false;
    }
  }
}

/* ---------- Reviews ---------- */
async function tmRenderReviewsTable() {
  const body = document.getElementById("reviewsTableBody");
  if (!body) return;
  try {
    const reviews = await TM_API.getAllReviews();
    if (!reviews.length) {
      body.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No reviews found.</td></tr>`;
      return;
    }
    body.innerHTML = reviews
      .map(
        (r) => `
        <tr>
          <td class="fw-bold text-dark">${r.attractionName || `Destination #${r.attractionId}`}</td>
          <td>${r.userName || "Traveler"}</td>
          <td><span class="tm-rating">${tmStars(r.rating || 5)}</span></td>
          <td class="text-muted small" style="max-width:300px;">${r.comment || ""}</td>
          <td class="small text-muted">${r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Recent"}</td>
          <td class="text-end">
            <button class="tm-icon-action danger btn btn-sm btn-outline-danger" data-del-review="${r.id}" title="Remove review"><i class="bi bi-trash"></i></button>
          </td>
        </tr>`
      )
      .join("");

    body.querySelectorAll("[data-del-review]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        if (!confirm("Delete this review? This action cannot be undone.")) return;
        try {
          await TM_API.deleteReview(Number(btn.dataset.delReview));
          tmToast("Review removed", "success");
          tmRenderReviewsTable();
        } catch (err) {
          tmToast(err.message || "Failed to delete review", "error");
        }
      })
    );
  } catch (err) {
    console.error("Error loading reviews:", err);
  }
}

/* ==========================================================================
   INITIALIZATION & EVENT BINDINGS
   ========================================================================== */
function tmInitCategoryControls() {
  // Populate Presets Grid
  const presetsContainer = document.getElementById("catPresetsContainer");
  if (presetsContainer) {
    presetsContainer.innerHTML = TM_CAT_PRESETS.map(
      (p) => `
      <div class="col-6 col-sm-3">
        <div class="cat-preset-item" data-preset-url="${p.url}" data-preset-icon="${p.icon}">
          <img src="${p.url}" alt="${p.name}">
          <span><i class="bi ${p.icon} me-1"></i> ${p.name}</span>
        </div>
      </div>`
    ).join("");

    presetsContainer.querySelectorAll(".cat-preset-item").forEach((item) => {
      item.addEventListener("click", () => {
        const url = item.dataset.presetUrl;
        const icon = item.dataset.presetIcon;
        tmSetCatImage(url);
        if (icon && !document.getElementById("catIcon").value) {
          document.getElementById("catIcon").value = icon;
          const iconPreview = document.getElementById("catIconPreview");
          if (iconPreview) iconPreview.className = `bi ${icon} fs-5`;
        }
        tmToast(`Applied "${item.querySelector("span").textContent.trim()}" preset`, "info");
      });
    });
  }

  // Populate Icon Palette Grid
  const iconGrid = document.getElementById("catIconGrid");
  if (iconGrid) {
    iconGrid.innerHTML = TM_TRAVEL_ICONS.map(
      (icon) => `
      <div class="cat-icon-chip" data-icon="${icon}">
        <i class="bi ${icon}"></i>
        <span>${icon.replace("bi-", "")}</span>
      </div>`
    ).join("");

    iconGrid.querySelectorAll(".cat-icon-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const icon = chip.dataset.icon;
        document.getElementById("catIcon").value = icon;
        const iconPreview = document.getElementById("catIconPreview");
        if (iconPreview) iconPreview.className = `bi ${icon} fs-5`;
        tmUpdateCategoryMockup();
        const palette = document.getElementById("catIconPalette");
        if (palette) palette.classList.add("d-none");
      });
    });
  }

  // Toggle icon palette
  const toggleIconBtn = document.getElementById("btnToggleIconPalette");
  const closeIconBtn = document.getElementById("btnCloseIconPalette");
  const iconPalette = document.getElementById("catIconPalette");
  if (toggleIconBtn && iconPalette) {
    toggleIconBtn.addEventListener("click", () => {
      iconPalette.classList.toggle("d-none");
    });
  }
  if (closeIconBtn && iconPalette) {
    closeIconBtn.addEventListener("click", () => {
      iconPalette.classList.add("d-none");
    });
  }

  // Live icon input change
  const catIconInput = document.getElementById("catIcon");
  if (catIconInput) {
    catIconInput.addEventListener("input", (e) => {
      const icon = e.target.value.trim() || "bi-tag";
      const iconPreview = document.getElementById("catIconPreview");
      if (iconPreview) iconPreview.className = `bi ${icon} fs-5`;
      tmUpdateCategoryMockup();
    });
  }

  // Theme color dots
  document.querySelectorAll(".cat-color-dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      tmSetCatColor(dot.dataset.color);
    });
  });

  // Custom color picker
  const colorPicker = document.getElementById("catColorPicker");
  if (colorPicker) {
    colorPicker.addEventListener("input", (e) => {
      tmSetCatColor(e.target.value);
    });
  }

  // Image URL Apply button
  const applyUrlBtn = document.getElementById("btnApplyCatUrl");
  const catUrlInput = document.getElementById("catImageUrlInput");
  if (applyUrlBtn && catUrlInput) {
    applyUrlBtn.addEventListener("click", () => {
      const url = catUrlInput.value.trim();
      if (!url) {
        tmToast("Please enter a valid image URL", "warning");
        return;
      }
      tmSetCatImage(url);
      tmToast("Image URL applied", "success");
    });
  }

  // Image File Upload input (FileReader)
  const fileInput = document.getElementById("catImageFileInput");
  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        tmToast("Image file size must be less than 5MB", "error");
        fileInput.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUrl = loadEvent.target.result;
        tmSetCatImage(dataUrl);
        tmToast("Local image uploaded successfully", "success");
      };
      reader.readAsDataURL(file);
    });
  }

  // Clear file input button
  const clearFileBtn = document.getElementById("btnClearCatFileInput");
  if (clearFileBtn && fileInput) {
    clearFileBtn.addEventListener("click", () => {
      fileInput.value = "";
    });
  }

  // Remove / Delete Category Image button
  const delImgBtn = document.getElementById("btnDeleteCatImage");
  if (delImgBtn) {
    delImgBtn.addEventListener("click", tmDeleteCatImage);
  }

  // Clicking empty dropzone activates the file tab or opens file chooser
  const emptyBox = document.getElementById("catImageEmptyBox");
  if (emptyBox && fileInput) {
    emptyBox.addEventListener("click", () => {
      const uploadTabBtn = document.getElementById("cat-tab-file");
      if (uploadTabBtn) uploadTabBtn.click();
      fileInput.click();
    });
  }

  // Real-time description counter & mockup updates
  const descEl = document.getElementById("catDescription");
  const countEl = document.getElementById("catDescCount");
  if (descEl && countEl) {
    descEl.addEventListener("input", (e) => {
      countEl.textContent = `${e.target.value.length} / 500`;
      tmUpdateCategoryMockup();
    });
  }

  const nameEl = document.getElementById("catName");
  if (nameEl) {
    nameEl.addEventListener("input", tmUpdateCategoryMockup);
  }

  // Destination Image upload and quick preview bindings
  const attrImgInput = document.getElementById("attrImage");
  const attrFileInput = document.getElementById("attrImageFileInput");
  const attrImgPreview = document.getElementById("attrImagePreview");
  const attrImgPreviewCont = document.getElementById("attrImagePreviewContainer");
  const clearAttrImgBtn = document.getElementById("btnClearAttrImage");
  const quickRemoveAttrBtn = document.getElementById("btnQuickRemoveAttrImage");

  function updateAttrPreview() {
    const val = attrImgInput ? attrImgInput.value.trim() : "";
    if (val && attrImgPreview && attrImgPreviewCont) {
      attrImgPreview.src = val;
      attrImgPreviewCont.classList.remove("d-none");
      if (clearAttrImgBtn) clearAttrImgBtn.style.display = "inline-block";
    } else if (attrImgPreviewCont) {
      attrImgPreviewCont.classList.add("d-none");
      if (clearAttrImgBtn) clearAttrImgBtn.style.display = "none";
    }
  }

  if (attrImgInput) {
    attrImgInput.addEventListener("input", updateAttrPreview);
  }

  if (attrFileInput && attrImgInput) {
    attrFileInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        tmToast("Destination image must be under 5MB", "error");
        attrFileInput.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        attrImgInput.value = loadEvent.target.result;
        updateAttrPreview();
        tmToast("Destination photo loaded", "success");
      };
      reader.readAsDataURL(file);
    });
  }

  function clearAttrImage() {
    if (attrImgInput) attrImgInput.value = "";
    if (attrFileInput) attrFileInput.value = "";
    updateAttrPreview();
  }

  if (clearAttrImgBtn) clearAttrImgBtn.addEventListener("click", clearAttrImage);
  if (quickRemoveAttrBtn) quickRemoveAttrBtn.addEventListener("click", clearAttrImage);
}

document.addEventListener("DOMContentLoaded", () => {
  const attrModalEl = document.getElementById("attractionModal");
  const catModalEl = document.getElementById("categoryModal");
  if (attrModalEl) tmAttractionModal = new bootstrap.Modal(attrModalEl);
  if (catModalEl) tmCategoryModal = new bootstrap.Modal(catModalEl);

  const initialTab = window.location.hash ? window.location.hash.replace("#", "") : "attractions";
  tmShowTab(["attractions", "categories", "reviews"].includes(initialTab) ? initialTab : "attractions");

  document.querySelectorAll("[data-tab-link]").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      tmShowTab(a.dataset.tabLink);
      history.replaceState(null, "", `#${a.dataset.tabLink}`);
    })
  );

  const addAttrBtn = document.getElementById("openAddAttraction");
  if (addAttrBtn) addAttrBtn.addEventListener("click", () => tmOpenAttractionModal(null));

  const addCatBtn = document.getElementById("openAddCategory");
  if (addCatBtn) addCatBtn.addEventListener("click", () => tmOpenCategoryModal(null));

  const attrForm = document.getElementById("attractionForm");
  if (attrForm) attrForm.addEventListener("submit", tmSaveAttraction);

  const catForm = document.getElementById("categoryForm");
  if (catForm) catForm.addEventListener("submit", tmSaveCategory);

  // Attractions Search Debounce
  let searchTimer;
  const searchInput = document.getElementById("attrSearch");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        tmAttrSearchTerm = e.target.value.trim();
        tmRenderAttractionsTable();
      }, 250);
    });
  }

  // Categories Search Debounce
  let catSearchTimer;
  const catSearchInput = document.getElementById("catSearch");
  if (catSearchInput) {
    catSearchInput.addEventListener("input", (e) => {
      clearTimeout(catSearchTimer);
      catSearchTimer = setTimeout(() => {
        tmCatSearchTerm = e.target.value.trim();
        tmRenderCategoriesTable();
      }, 250);
    });
  }

  // Initialize Category and Image Controls
  tmInitCategoryControls();
});
