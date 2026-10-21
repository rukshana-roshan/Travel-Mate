/* ==========================================================================
   TRAVEL MATE — Admin Dashboard Logic
   ========================================================================== */

async function tmRenderAdminDashboard() {
  try {
    const [stats, attractions, categories] = await Promise.all([
      TM_API.getAdminStats(),
      TM_API.getAttractions(),
      TM_API.getCategories(),
    ]);

    // Populate the 4 core summary statistics
    const totalDestinations = stats.totalDestinations || attractions.length;
    const totalCategories = stats.totalCategories || categories.length;
    const totalSaved = stats.totalSavedItineraries || 0;
    const totalMessages = stats.totalContactMessages || 0;
    const unreadMessages = stats.unreadContactMessages || 0;

    const elDest = document.getElementById("statDestinations");
    const elCat = document.getElementById("statCategories");
    const elSaved = document.getElementById("statSavedItineraries");
    const elMsg = document.getElementById("statContactMessages");

    if (elDest) elDest.textContent = totalDestinations;
    if (elCat) elCat.textContent = totalCategories;
    if (elSaved) elSaved.textContent = totalSaved;
    if (elMsg) elMsg.textContent = totalMessages;

    // Unread message badge in sidebar
    const unreadBadge = document.getElementById("sideUnreadBadge");
    if (unreadBadge) {
      if (unreadMessages > 0) {
        unreadBadge.textContent = unreadMessages;
        unreadBadge.style.display = "inline-block";
      } else {
        unreadBadge.style.display = "none";
      }
    }

    // Populate Recent Attractions Table
    const tableBody = document.getElementById("recentTableBody");
    if (tableBody) {
      if (!attractions.length) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No attractions found in database.</td></tr>`;
      } else {
        tableBody.innerHTML = attractions
          .slice(0, 8)
          .map(
            (a) => `
            <tr>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <img src="${a.imageUrl}" class="thumb rounded-2" alt="${a.name}" style="width:40px;height:40px;object-fit:cover;">
                  <span class="fw-bold text-dark">${a.name}</span>
                </div>
              </td>
              <td><span class="tm-badge-soft">${a.categoryName || "General"}</span></td>
              <td>${a.distanceKm || "--"} km</td>
              <td>${tmFormatDuration(a.visitDurationMinutes || a.durationMinutes || 60)}</td>
              <td><span class="fw-semibold text-teal">${tmFormatFee(a.entranceFee)}</span></td>
              <td><code class="small text-muted">${Number(a.latitude).toFixed(3)}, ${Number(a.longitude).toFixed(3)}</code></td>
            </tr>`
          )
          .join("");
      }
    }

    // Category breakdown
    const breakdownEl = document.getElementById("categoryBreakdown");
    if (breakdownEl) {
      const palette = ["#123B5D", "#13B8A6", "#F59E42", "#6366F1", "#10B981", "#EC4899"];
      breakdownEl.innerHTML = categories
        .map((c, i) => {
          const count = attractions.filter((a) => a.categoryId === c.id || a.categoryName === c.name).length;
          const pct = attractions.length ? Math.round((count / attractions.length) * 100) : 0;
          return `
          <div class="mb-3">
            <div class="d-flex justify-content-between small mb-1">
              <span><i class="bi ${c.icon || 'bi-pin-map'} text-muted me-1"></i> <strong>${c.name}</strong></span>
              <span class="text-muted">${count} spots (${pct}%)</span>
            </div>
            <div style="height:8px; border-radius:99px; background:var(--surface-2); overflow:hidden;">
              <div style="height:100%; width:${pct}%; background:${palette[i % palette.length]}; border-radius:99px; transition: width 600ms ease;"></div>
            </div>
          </div>`;
        })
        .join("");
    }
  } catch (err) {
    console.error("Error loading admin dashboard:", err);
  }
}

document.addEventListener("DOMContentLoaded", tmRenderAdminDashboard);
