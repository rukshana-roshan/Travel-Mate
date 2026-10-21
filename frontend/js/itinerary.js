/* ==========================================================================
   TRAVEL MATE — Smart One-Day Trip Planner Logic
   ========================================================================== */

let tmCurrentTravelMode = "car";
let tmLastGeneratedPlan = null;

async function tmGetPlanAttractions() {
  const ids = tmGetItinerary();
  if (!ids || !ids.length) return [];
  const all = await TM_API.getAttractions();
  return ids.map((id) => all.find((a) => a.id === id)).filter(Boolean);
}

async function tmRenderStops() {
  const wrap = document.getElementById("stopsList");
  const empty = document.getElementById("stopsEmpty");
  const countEl = document.getElementById("stopCount");
  if (!wrap) return;

  const stops = await tmGetPlanAttractions();
  if (countEl) countEl.textContent = `(${stops.length})`;

  if (!stops.length) {
    wrap.innerHTML = "";
    if (empty) empty.classList.remove("d-none");
    const outSection = document.getElementById("itineraryOutputSection");
    if (outSection) outSection.classList.add("d-none");
    return;
  }

  if (empty) empty.classList.add("d-none");

  wrap.innerHTML = stops
    .map(
      (a, i) => `
      <div class="tm-stop-item">
        <div class="tm-stop-order">${i + 1}</div>
        <img src="${a.imageUrl}" alt="${a.name}">
        <div class="flex-grow-1">
          <div class="d-flex align-items-center gap-2 flex-wrap">
            <strong class="text-dark">${a.name}</strong>
            <span class="badge bg-light text-secondary border small">${a.categoryName || "Attraction"}</span>
          </div>
          <div class="small text-muted mt-1">
            <i class="bi bi-clock-history me-1"></i> ${tmFormatDuration(a.visitDurationMinutes || a.durationMinutes || 60)} visit
            &bull; <i class="bi bi-signpost-2 me-1"></i> ${a.distanceKm || "--"} km from Atulugama
            &bull; <span class="text-teal fw-semibold">${tmFormatFee(a.entranceFee)}</span>
          </div>
        </div>
        <div class="d-flex flex-column gap-1">
          <button class="btn btn-sm btn-light border py-0 px-2" data-move-up="${a.id}" title="Move up" ${i === 0 ? "disabled" : ""}>
            <i class="bi bi-chevron-up"></i>
          </button>
          <button class="btn btn-sm btn-light border py-0 px-2" data-move-down="${a.id}" title="Move down" ${i === stops.length - 1 ? "disabled" : ""}>
            <i class="bi bi-chevron-down"></i>
          </button>
        </div>
        <button class="btn btn-sm btn-outline-danger rounded-circle p-2" data-remove="${a.id}" title="Remove from plan">
          <i class="bi bi-trash"></i>
        </button>
      </div>`
    )
    .join("");

  wrap.querySelectorAll("[data-remove]").forEach((btn) =>
    btn.addEventListener("click", () => {
      tmRemoveFromItinerary(Number(btn.dataset.remove));
      tmToast("Removed from shortlist", "info");
      tmRenderStops();
      tmRenderAddStopPanel();
    })
  );

  wrap.querySelectorAll("[data-move-up]").forEach((btn) =>
    btn.addEventListener("click", () => tmReorderStop(Number(btn.dataset.moveUp), -1))
  );

  wrap.querySelectorAll("[data-move-down]").forEach((btn) =>
    btn.addEventListener("click", () => tmReorderStop(Number(btn.dataset.moveDown), 1))
  );
}

function tmReorderStop(id, direction) {
  const ids = tmGetItinerary();
  const idx = ids.indexOf(id);
  const newIdx = idx + direction;
  if (idx === -1 || newIdx < 0 || newIdx >= ids.length) return;
  [ids[idx], ids[newIdx]] = [ids[newIdx], ids[idx]];
  localStorage.setItem(TM.ITIN_KEY, JSON.stringify(ids));
  tmRenderStops();
}

async function tmRenderAddStopPanel(filter = "") {
  const listEl = document.getElementById("addStopList");
  if (!listEl) return;
  const all = await TM_API.getAttractions({ keyword: filter || undefined });
  const currentIds = tmGetItinerary();
  const available = all.filter((a) => !currentIds.includes(a.id));

  if (!available.length) {
    listEl.innerHTML = `<div class="p-3 text-muted small text-center">All available attractions have already been added to your shortlist!</div>`;
    return;
  }

  listEl.innerHTML = available
    .map(
      (a) => `
      <div class="tm-add-row">
        <img src="${a.imageUrl}" alt="${a.name}">
        <div class="flex-grow-1">
          <div class="fw-bold small text-dark">${a.name}</div>
          <div class="text-muted small">${a.distanceKm} km from Atulugama &bull; ${tmFormatDuration(a.visitDurationMinutes || a.durationMinutes || 60)}</div>
        </div>
        <button class="btn btn-sm btn-outline-primary rounded-pill px-3" data-add-stop="${a.id}">
          <i class="bi bi-plus"></i> Add
        </button>
      </div>`
    )
    .join("");

  listEl.querySelectorAll("[data-add-stop]").forEach((btn) =>
    btn.addEventListener("click", () => {
      tmAddToItinerary(Number(btn.dataset.addStop));
      tmRenderStops();
      const searchBox = document.getElementById("addStopSearch");
      tmRenderAddStopPanel(searchBox ? searchBox.value.trim() : "");
    })
  );
}

function tmSetupTravelMode() {
  const carBtn = document.getElementById("modeCar");
  const motoBtn = document.getElementById("modeMoto");
  if (!carBtn || !motoBtn) return;

  carBtn.addEventListener("click", () => {
    tmCurrentTravelMode = "car";
    carBtn.classList.add("active");
    motoBtn.classList.remove("active");
  });

  motoBtn.addEventListener("click", () => {
    tmCurrentTravelMode = "motorcycle";
    motoBtn.classList.add("active");
    carBtn.classList.remove("active");
  });
}

async function tmGeneratePlan() {
  const stopIds = tmGetItinerary();
  if (!stopIds || !stopIds.length) {
    tmToast("Please select at least one attraction before generating a schedule", "error");
    return;
  }

  const generateBtn = document.getElementById("generateBtn");
  const originalText = generateBtn.innerHTML;
  generateBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Calculating Optimal Visiting Sequence...`;
  generateBtn.disabled = true;

  const planName = document.getElementById("planName").value.trim() || "My Kalutara Day Trip";
  const visitDate = document.getElementById("planDate").value || new Date().toISOString().split("T")[0];
  const startTime = document.getElementById("planStart").value || "08:30";
  const endTime = document.getElementById("planEnd").value || "18:30";

  const session = tmGetSession();
  const req = {
    attractionIds: stopIds,
    planName,
    visitDate,
    startTime,
    endTime,
    travelMode: tmCurrentTravelMode,
    userId: session ? session.userId : null,
  };

  try {
    const itinerary = await TM_API.generateItinerary(req);
    tmLastGeneratedPlan = itinerary;
    tmDisplayGeneratedItinerary(itinerary);
    tmToast("One-day schedule successfully generated!", "success");
  } catch (err) {
    console.error("Itinerary generation error:", err);
    tmToast("Failed to generate schedule. Please check input parameters.", "error");
  } finally {
    generateBtn.innerHTML = originalText;
    generateBtn.disabled = false;
  }
}

function tmDisplayGeneratedItinerary(itinerary) {
  const outSection = document.getElementById("itineraryOutputSection");
  if (!outSection) return;
  outSection.classList.remove("d-none");

  // Title and metadata
  document.getElementById("displayPlanTitle").textContent = itinerary.planName || "My Kalutara Day Trip";
  document.getElementById("displayPlanSubtitle").textContent = `Start Point: ${
    itinerary.startLocation || "Atulugama"
  } &bull; Mode: ${(itinerary.travelMode || "Car").toUpperCase()} &bull; Date: ${itinerary.visitDate || "Today"}`;

  // Print header sync
  const printTs = document.getElementById("printTimestamp");
  if (printTs) printTs.textContent = new Date().toLocaleString();
  const printMeta = document.getElementById("printMeta");
  if (printMeta) {
    printMeta.innerHTML = `<strong>Plan:</strong> ${itinerary.planName} &bull; <strong>Origin:</strong> ${
      itinerary.startLocation || "Atulugama"
    } &bull; <strong>Time Window:</strong> ${itinerary.startTime} - ${itinerary.endTime} &bull; <strong>Travel Mode:</strong> ${
      itinerary.travelMode || "Car"
    }`;
  }

  // Summary Metrics
  const items = itinerary.items || [];
  const scheduledStops = items.filter((item) => !item.isLunchBreak);

  document.getElementById("sumStops").textContent = scheduledStops.length;
  document.getElementById("sumDuration").textContent = tmFormatDuration(itinerary.totalVisitingMinutes || 0);
  document.getElementById("sumTravelTime").textContent = tmFormatDuration(itinerary.totalTravelMinutes || 0);
  document.getElementById("sumDistance").textContent = `${Number(itinerary.totalDistanceKm || 0).toFixed(1)} km`;
  
  const cost = Number(itinerary.totalEstimatedCost || 0);
  document.getElementById("sumFee").textContent = cost === 0 ? "Free" : `Rs. ${cost.toLocaleString("en-LK")}`;
  document.getElementById("sumOverallTime").textContent = tmFormatDuration(itinerary.totalDurationMinutes || 0);

  // Overflow warning
  const overflowAlert = document.getElementById("overflowAlert");
  const overflowMsg = document.getElementById("overflowAlertMsg");
  const overflowList = itinerary.overflowAttractions || [];

  if (overflowList.length > 0) {
    overflowAlert.classList.remove("d-none");
    const names = overflowList.map((x) => x.name).join(", ");
    overflowMsg.innerHTML = `<strong>${overflowList.length} destination(s)</strong> could not fit before your scheduled finish time (${itinerary.endTime}): <em>${names}</em>. Consider extending your end time or removing a stop.`;
  } else {
    overflowAlert.classList.add("d-none");
  }

  // Timeline rendering
  const timelineList = document.getElementById("timelineList");
  let timelineHtml = `
    <!-- Origin Departure Item -->
    <div class="tm-tl-item">
      <div class="tm-tl-dot start-dot"><i class="bi bi-geo-alt-fill"></i></div>
      <div class="card border p-3 rounded-4 bg-light">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <strong class="text-primary fs-6"><i class="bi bi-flag-fill text-success me-1"></i> Departure from Atulugama</strong>
            <div class="small text-muted">Journey begins from base location (6.7022° N, 80.0528° E)</div>
          </div>
          <span class="badge bg-primary px-3 py-2 fs-6">${itinerary.startTime || "08:30 AM"}</span>
        </div>
      </div>
    </div>
  `;

  items.forEach((item, idx) => {
    if (item.isLunchBreak) {
      timelineHtml += `
        <div class="tm-tl-item">
          <div class="tm-tl-dot lunch-dot"><i class="bi bi-cup-hot-fill"></i></div>
          <div class="card border-0 p-3 rounded-4" style="background: rgba(245, 158, 66, 0.12); border-left: 4px solid var(--accent) !important;">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <strong style="color: var(--accent);"><i class="bi bi-cup-hot me-1"></i> Midday Lunch &amp; Refreshment Break</strong>
                <div class="small text-muted">Recommended rest stop at a local restaurant or cafe along the route.</div>
              </div>
              <span class="badge bg-warning text-dark px-3 py-2 fw-bold">${item.arrivalTime} – ${item.departureTime}</span>
            </div>
          </div>
        </div>
      `;
      return;
    }

    const itemMapsUrl = item.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`;

    timelineHtml += `
      <div class="tm-tl-item">
        <div class="tm-tl-dot">${item.visitOrder || idx + 1}</div>
        <div class="card border rounded-4 p-3 shadow-sm bg-surface">
          <div class="d-flex gap-3 align-items-start flex-wrap flex-md-nowrap">
            <img src="${item.imageUrl}" alt="${item.attractionName}" style="width:84px; height:84px; border-radius:14px; object-fit:cover; flex-shrink:0;">
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div>
                  <h5 class="fw-bold mb-1 text-dark">${item.attractionName}</h5>
                  <span class="badge bg-light text-secondary border small">${item.categoryName || "Attraction"}</span>
                </div>
                <div class="text-md-end">
                  <span class="badge bg-primary px-3 py-2 fw-semibold fs-6">${item.arrivalTime} – ${item.departureTime}</span>
                  <div class="small text-muted mt-1"><i class="bi bi-clock me-1"></i> Duration: ${tmFormatDuration(item.visitDurationMinutes)}</div>
                </div>
              </div>

              ${
                item.travelTimeToNextMinutes && item.travelTimeToNextMinutes > 0
                  ? `<div class="mt-3 pt-2 border-top d-flex justify-content-between align-items-center flex-wrap small text-muted">
                      <span>
                        <i class="bi bi-arrow-right-circle text-primary me-1"></i>
                        Travel to next destination: <strong>~${item.travelTimeToNextMinutes} mins</strong> (${Number(item.distanceToNextKm || 0).toFixed(1)} km via ${itinerary.travelMode || 'road'})
                      </span>
                      <a href="${itemMapsUrl}" target="_blank" rel="noopener" class="btn btn-sm btn-outline-secondary rounded-pill py-0 px-2 mt-1 mt-sm-0">
                        <i class="bi bi-geo-alt"></i> View on Map
                      </a>
                    </div>`
                  : `<div class="mt-2 pt-2 border-top text-end">
                      <a href="${itemMapsUrl}" target="_blank" rel="noopener" class="btn btn-sm btn-outline-secondary rounded-pill py-0 px-2">
                        <i class="bi bi-geo-alt"></i> View on Map
                      </a>
                    </div>`
              }
            </div>
          </div>
        </div>
      </div>
    `;
  });

  // End of Trip Node
  timelineHtml += `
    <div class="tm-tl-item">
      <div class="tm-tl-dot end-dot"><i class="bi bi-check-lg"></i></div>
      <div class="card border p-3 rounded-4 bg-light">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <strong class="text-primary fs-6"><i class="bi bi-house-door-fill text-indigo me-1"></i> Day Tour Concluded</strong>
            <div class="small text-muted">Estimated return to base / conclude day visit before sunset.</div>
          </div>
          <span class="badge bg-dark px-3 py-2 fs-6">${itinerary.endTime || "End of Schedule"}</span>
        </div>
      </div>
    </div>
  `;

  timelineList.innerHTML = timelineHtml;

  // Build Multi-Stop Google Maps Route URL
  const stopsCoords = items
    .filter((x) => !x.isLunchBreak && x.latitude && x.longitude)
    .map((x) => `${x.latitude},${x.longitude}`);
  
  if (stopsCoords.length > 0) {
    const routeUrl = `https://www.google.com/maps/dir/6.7022,80.0528/${stopsCoords.join("/")}/6.7022,80.0528`;
    const openRouteBtn = document.getElementById("openFullRouteBtn");
    if (openRouteBtn) openRouteBtn.href = routeUrl;
  }

  outSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function tmSaveItinerary() {
  if (!tmLastGeneratedPlan) {
    tmToast("Please generate an itinerary first", "error");
    return;
  }
  const session = tmGetSession();
  if (!session) {
    tmToast("Please sign in to save your itinerary to your account", "info");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1200);
    return;
  }

  try {
    const dto = {
      userId: session.userId,
      planName: tmLastGeneratedPlan.planName,
      visitDate: tmLastGeneratedPlan.visitDate,
      startTime: tmLastGeneratedPlan.startTime,
      endTime: tmLastGeneratedPlan.endTime,
      travelMode: tmLastGeneratedPlan.travelMode,
      totalDurationMinutes: tmLastGeneratedPlan.totalDurationMinutes,
      totalDistanceKm: tmLastGeneratedPlan.totalDistanceKm,
      totalEstimatedCost: tmLastGeneratedPlan.totalEstimatedCost,
      attractionIds: (tmLastGeneratedPlan.items || []).filter((x) => !x.isLunchBreak).map((x) => x.attractionId),
    };
    await TM_API.createItinerary(dto);
    tmToast("Itinerary successfully saved to your database account!", "success");
  } catch (err) {
    console.error("Save itinerary error:", err);
    tmToast("Failed to save itinerary to server", "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("planDate");
  if (dateInput) dateInput.value = new Date().toISOString().split("T")[0];

  tmSetupTravelMode();
  tmRenderStops();
  tmRenderAddStopPanel();

  let searchTimer;
  const searchInput = document.getElementById("addStopSearch");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => tmRenderAddStopPanel(e.target.value.trim()), 200);
    });
  }

  const genBtn = document.getElementById("generateBtn");
  if (genBtn) genBtn.addEventListener("click", tmGeneratePlan);

  const clearBtn = document.getElementById("clearPlanBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear your selected destinations?")) {
        localStorage.setItem(TM.ITIN_KEY, JSON.stringify([]));
        const outSection = document.getElementById("itineraryOutputSection");
        if (outSection) outSection.classList.add("d-none");
        tmToast("Selected destinations cleared", "info");
        tmRenderStops();
        tmRenderAddStopPanel();
      }
    });
  }

  const saveBtn = document.getElementById("saveItineraryBtn");
  if (saveBtn) saveBtn.addEventListener("click", tmSaveItinerary);

  const printBtn = document.getElementById("printItineraryBtn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }
});
