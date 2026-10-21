/* ==========================================================================
   TRAVEL MATE — Place Details Page Logic
   ========================================================================== */

function tmGetIdFromUrl() {
  return new URLSearchParams(window.location.search).get("id");
}

async function tmRenderDetails() {
  const id = tmGetIdFromUrl();
  const loading = document.getElementById("detailsLoading");
  const content = document.getElementById("detailsContent");

  if (!id) {
    window.location.href = "places.html";
    return;
  }

  let a;
  try {
    a = await TM_API.getAttractionById(id);
  } catch (err) {
    console.warn("Could not fetch attraction by ID from server:", err);
    a = null;
  }

  if (!a) {
    loading.innerHTML = `
      <div class="tm-empty py-5">
        <i class="bi bi-exclamation-triangle text-danger display-4 mb-3"></i>
        <h4>Attraction Not Found</h4>
        <p class="text-muted">The destination you are looking for may have been removed or is unavailable.</p>
        <a href="places.html" class="btn-tm btn-tm-primary px-4 mt-2">Browse All Destinations</a>
      </div>`;
    return;
  }

  document.title = `${a.name} — TravelMate`;

  // Hero section bindings
  const heroBanner = document.getElementById("dHeroBanner");
  if (heroBanner && a.imageUrl) {
    heroBanner.style.backgroundImage = `url('${a.imageUrl}')`;
  }
  document.getElementById("dCategoryBadge").textContent = a.categoryName || "Attraction";
  document.getElementById("dName").textContent = a.name;
  document.getElementById("dRating").innerHTML = tmStars(a.averageRating || 4.5);
  document.getElementById("dLocation").textContent = a.location || "Kalutara District";
  document.getElementById("dLocationText").textContent = a.location || "Kalutara District, Sri Lanka";
  document.getElementById("dDistance").textContent = a.distanceKm || "--";
  document.getElementById("dDistancePill").textContent = `${a.distanceKm || "--"} km`;
  document.getElementById("dDuration").textContent = tmFormatDuration(a.visitDurationMinutes || a.durationMinutes || 60);
  document.getElementById("dHours").textContent = a.openingHours || "Open Daily";
  
  const feeText = tmFormatFee(a.entranceFee);
  document.getElementById("dFee").textContent = feeText;
  document.getElementById("dFeeCard").textContent = feeText;
  document.getElementById("dDescription").textContent = a.description;
  document.getElementById("dCoords").textContent = `${a.latitude}, ${a.longitude}`;

  // Custom tips per category
  const tip1 = document.getElementById("dTravelTip1");
  const tip2 = document.getElementById("dTravelTip2");
  if (a.categoryName === "Religious Places" || a.categoryId === 3) {
    if (tip1) tip1.textContent = "Morning or late afternoon (around 4:30 PM - 6:00 PM) is ideal for peaceful meditation and avoids heated temple grounds.";
    if (tip2) tip2.textContent = "Wear white or modest attire covering shoulders and knees. Footwear and headwear must be removed before entering the shrine area.";
  } else if (a.categoryName === "Beaches" || a.categoryId === 1) {
    if (tip1) tip1.textContent = "Evenings around 5:00 PM - 6:30 PM offer gorgeous Indian Ocean sunsets and refreshing breezes.";
    if (tip2) tip2.textContent = "Swim only in designated safe sections. Respect local fishing communities and preserve coastal cleanlines.";
  } else if (a.categoryName === "Adventure" || a.categoryId === 5) {
    if (tip1) tip1.textContent = "Closed shoes with grip are mandatory for go-karting and outdoor sports. Arrive 15 minutes before booking.";
    if (tip2) tip2.textContent = "Follow safety briefings strictly and stay hydrated under Sri Lankan midday sun.";
  }

  // Google Maps setup
  const mapsUrl = a.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${a.latitude},${a.longitude}`;
  document.getElementById("dMapBtn").href = mapsUrl;
  document.getElementById("dMapsExternalLink").href = mapsUrl;

  const mapEmbed = document.getElementById("dMapEmbed");
  if (mapEmbed) {
    mapEmbed.src = `https://maps.google.com/maps?q=${a.latitude},${a.longitude}&hl=en&z=14&output=embed`;
  }

  // Favorites
  const favBtn = document.getElementById("dFavBtn");
  const favIcon = document.getElementById("dFavIcon");
  const syncFav = () => {
    const isFav = tmIsFavorite(a.id);
    if (favIcon) {
      favIcon.className = isFav ? "bi bi-heart-fill text-danger me-2" : "bi bi-heart me-2";
    }
  };
  syncFav();
  if (favBtn) {
    favBtn.addEventListener("click", () => {
      tmToggleFavorite(a.id);
      syncFav();
    });
  }

  // Add to Day Plan
  const addPlanBtn = document.getElementById("dAddPlanBtn");
  if (addPlanBtn) {
    addPlanBtn.addEventListener("click", () => {
      const added = tmAddDestinationToPlan(a);
      if (added) {
        addPlanBtn.innerHTML = `<i class="bi bi-check2-circle me-2"></i> Added to Trip!`;
        addPlanBtn.classList.add("btn-success");
        addPlanBtn.classList.remove("btn-tm-primary");
        setTimeout(() => {
          addPlanBtn.innerHTML = `<i class="bi bi-calendar-plus me-2"></i> Add to My Day Plan`;
          addPlanBtn.classList.remove("btn-success");
          addPlanBtn.classList.add("btn-tm-primary");
        }, 2000);
      }
    });
  }

  // Show page content
  loading.classList.add("d-none");
  content.classList.remove("d-none");

  // Reviews and Related
  tmRenderReviews(a.id);
  tmRenderRelated(a);

  // Review modal trigger
  const reviewModalEl = document.getElementById("reviewModal");
  let reviewModal;
  if (reviewModalEl) {
    reviewModal = new bootstrap.Modal(reviewModalEl);
    document.getElementById("dWriteReviewBtn").addEventListener("click", () => {
      const session = tmGetSession();
      if (!session) {
        tmToast("Please sign in or create an account to share a review", "info");
        setTimeout(() => { window.location.href = "login.html"; }, 1000);
        return;
      }
      document.getElementById("reviewName").value = session.fullName;
      reviewModal.show();
    });
  }

  // Review submission
  const reviewForm = document.getElementById("reviewForm");
  if (reviewForm) {
    reviewForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const session = tmGetSession();
      if (!session) {
        tmToast("Please sign in to submit a review", "error");
        return;
      }
      const dto = {
        userId: session.userId,
        userName: session.fullName,
        attractionId: a.id,
        rating: Number(document.getElementById("reviewRating").value),
        comment: document.getElementById("reviewComment").value.trim(),
      };
      try {
        await TM_API.addReview(dto);
        if (reviewModal) reviewModal.hide();
        reviewForm.reset();
        tmToast("Thank you! Your review has been recorded.", "success");
        tmRenderReviews(a.id);
        const refreshed = await TM_API.getAttractionById(a.id);
        if (refreshed) {
          document.getElementById("dRating").innerHTML = tmStars(refreshed.averageRating);
        }
      } catch (err) {
        tmToast(err.message || "Failed to submit review", "error");
      }
    });
  }
}

async function tmRenderReviews(attractionId) {
  const wrap = document.getElementById("dReviews");
  const empty = document.getElementById("dReviewsEmpty");
  const countEl = document.getElementById("dReviewCount");
  if (!wrap) return;

  try {
    const reviews = await TM_API.getReviews(attractionId);
    if (countEl) countEl.textContent = reviews.length ? `(${reviews.length} traveler reviews)` : "No reviews yet";

    if (!reviews || !reviews.length) {
      wrap.innerHTML = "";
      if (empty) empty.classList.remove("d-none");
      return;
    }

    if (empty) empty.classList.add("d-none");
    wrap.innerHTML = reviews
      .map(
        (r) => `
        <div class="p-3 rounded-3 border bg-light">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="d-flex align-items-center gap-2">
              <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style="width:36px; height:36px; font-size:0.9rem;">
                ${(r.userName || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <strong class="d-block text-dark" style="font-size:0.9rem;">${r.userName || "Anonymous Visitor"}</strong>
                <small class="text-muted">${r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Recent visit"}</small>
              </div>
            </div>
            <span class="tm-rating">${tmStars(r.rating || 5)}</span>
          </div>
          <p class="text-muted mb-0 small" style="line-height:1.6;">${r.comment || ""}</p>
        </div>`
      )
      .join("");
  } catch (err) {
    console.error("Error loading reviews:", err);
  }
}

async function tmRenderRelated(current) {
  const grid = document.getElementById("dRelated");
  if (!grid) return;
  try {
    const all = await TM_API.getAttractions({ categoryId: current.categoryId });
    const related = all.filter((x) => x.id !== current.id).slice(0, 3);
    if (!related.length) {
      grid.innerHTML = `<div class="col-12 text-muted">No other attractions currently listed in this category.</div>`;
      return;
    }
    grid.innerHTML = related.map(tmAttractionCard).join("");
    tmBindFavoriteButtons(grid);
    if (typeof tmBindTripButtons === "function") {
      tmBindTripButtons(grid);
    }
  } catch (err) {
    console.error("Error loading related attractions:", err);
  }
}

document.addEventListener("DOMContentLoaded", tmRenderDetails);
