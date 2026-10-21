/* ==========================================================================
   TRAVEL MATE — API Layer
   Connects to Spring Boot backend on http://localhost:8080/api.
   Includes client-side calculation fallback if the backend is offline.
   ========================================================================== */

const TM_API = {
  BASE_URL: (typeof TM_CONFIG !== "undefined") ? TM_CONFIG.apiBaseUrl() : "http://localhost:8080/api",
  LIVE: true,

  async _get(path) {
    try {
      const res = await fetch(`${this.BASE_URL}${path}`);
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(json.message || "Request failed");
      return json.data;
    } catch (err) {
      console.warn(`[TM_API] Fetch failed for ${path}, using mock fallback:`, err.message);
      throw err;
    }
  },

  async _send(path, method, body) {
    try {
      const res = await fetch(`${this.BASE_URL}${path}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(json.message || "Request failed");
      return json.data;
    } catch (err) {
      console.warn(`[TM_API] Request failed for ${method} ${path}:`, err.message);
      throw err;
    }
  },

  /* ---- Attractions ---- */
  async getAttractions({ categoryId, keyword } = {}) {
    if (this.LIVE) {
      try {
        const qs = new URLSearchParams();
        if (categoryId) qs.set("categoryId", categoryId);
        if (keyword) qs.set("keyword", keyword);
        return await this._get(`/attractions${qs.toString() ? "?" + qs : ""}`);
      } catch (e) {
        // Fallback to local data
      }
    }
    return tmMockFilterAttractions({ categoryId, keyword });
  },

  async getAttraction(id) {
    if (this.LIVE) {
      try {
        return await this._get(`/attractions/${id}`);
      } catch (e) {}
    }
    return tmMockGetAttraction(id);
  },

  async getAttractionById(id) {
    return this.getAttraction(id);
  },

  async createAttraction(dto) {
    if (this.LIVE) {
      try {
        return await this._send("/attractions", "POST", dto);
      } catch (e) {}
    }
    return tmMockCreateAttraction(dto);
  },

  async updateAttraction(id, dto) {
    if (this.LIVE) {
      try {
        return await this._send(`/attractions/${id}`, "PUT", dto);
      } catch (e) {}
    }
    return tmMockUpdateAttraction(id, dto);
  },

  async deleteAttraction(id) {
    if (this.LIVE) {
      try {
        return await this._send(`/attractions/${id}`, "DELETE");
      } catch (e) {}
    }
    return tmMockDeleteAttraction(id);
  },

  /* ---- Categories ---- */
  async getCategories() {
    if (this.LIVE) {
      try {
        return await this._get("/categories");
      } catch (e) {}
    }
    return tmMockGetCategories();
  },

  async getCategory(id) {
    if (this.LIVE) {
      try {
        return await this._get(`/categories/${id}`);
      } catch (e) {}
    }
    return tmMockGetCategories().find((c) => c.id === Number(id));
  },

  async createCategory(dto) {
    if (this.LIVE) {
      try {
        return await this._send("/categories", "POST", dto);
      } catch (e) {}
    }
    return tmMockCreateCategory(dto);
  },

  async updateCategory(id, dto) {
    if (this.LIVE) {
      try {
        return await this._send(`/categories/${id}`, "PUT", dto);
      } catch (e) {}
    }
    return tmMockUpdateCategory(id, dto);
  },

  async deleteCategory(id) {
    if (this.LIVE) {
      try {
        return await this._send(`/categories/${id}`, "DELETE");
      } catch (e) {}
    }
    return tmMockDeleteCategory(id);
  },

  /* ---- Itinerary Planning & Generation ---- */
  async generateItinerary(req) {
    if (this.LIVE) {
      try {
        return await this._send("/itineraries/generate", "POST", req);
      } catch (e) {}
    }
    return tmMockGenerateItinerary(req);
  },

  async createItinerary(dto) {
    if (this.LIVE) {
      try {
        return await this._send("/itineraries", "POST", dto);
      } catch (e) {}
    }
    return { ...dto, id: Date.now(), createdAt: new Date().toISOString() };
  },

  async getItinerary(id) {
    if (this.LIVE) {
      try {
        return await this._get(`/itineraries/${id}`);
      } catch (e) {}
    }
    return null;
  },

  async getAllItineraries() {
    if (this.LIVE) {
      try {
        return await this._get("/itineraries");
      } catch (e) {}
    }
    return [];
  },

  /* ---- Contact Messages ---- */
  async submitContact(dto) {
    if (this.LIVE) {
      try {
        return await this._send("/contact", "POST", dto);
      } catch (e) {}
    }
    return tmMockSubmitContact(dto);
  },

  async getContactMessages() {
    if (this.LIVE) {
      try {
        return await this._get("/contact/messages");
      } catch (e) {}
    }
    return tmMockGetContactMessages();
  },

  async markMessageRead(id) {
    if (this.LIVE) {
      try {
        return await this._send(`/contact/messages/${id}/read`, "PUT");
      } catch (e) {}
    }
    return true;
  },

  async deleteContactMessage(id) {
    if (this.LIVE) {
      try {
        return await this._send(`/contact/messages/${id}`, "DELETE");
      } catch (e) {}
    }
    return true;
  },

  /* ---- Admin Stats ---- */
  async getAdminStats() {
    if (this.LIVE) {
      try {
        return await this._get("/admin/stats");
      } catch (e) {}
    }
    return {
      totalDestinations: TM_ATTRACTIONS.length,
      totalCategories: TM_CATEGORIES.length,
      totalSavedItineraries: 3,
      totalContactMessages: 1,
      unreadContactMessages: 1,
      totalReviews: TM_REVIEWS.length,
    };
  },

  /* ---- Reviews ---- */
  async getReviews(attractionId) {
    if (this.LIVE) {
      try {
        return await this._get(`/reviews/attraction/${attractionId}`);
      } catch (e) {}
    }
    return TM_REVIEWS.filter((r) => r.attractionId === Number(attractionId));
  },

  async getAllReviews() {
    if (this.LIVE) {
      try {
        return await this._get("/reviews");
      } catch (e) {}
    }
    return TM_REVIEWS;
  },

  async addReview(dto) {
    if (this.LIVE) {
      try {
        return await this._send("/reviews", "POST", dto);
      } catch (e) {}
    }
    TM_REVIEWS.unshift({ ...dto, id: Date.now(), createdAt: new Date().toISOString() });
    return dto;
  },

  async deleteReview(id) {
    if (this.LIVE) {
      try {
        return await this._send(`/reviews/${id}`, "DELETE");
      } catch (e) {}
    }
    const idx = TM_REVIEWS.findIndex((r) => r.id === id);
    if (idx > -1) TM_REVIEWS.splice(idx, 1);
  },

  /* ---- Favorites ---- */
  async getFavorites(userId) {
    if (this.LIVE && userId) {
      try {
        return await this._get(`/favorites/user/${userId}`);
      } catch (e) {}
    }
    return TM_ATTRACTIONS.filter((a) => tmGetFavorites().includes(a.id));
  },

  async addFavorite(userId, attractionId) {
    if (this.LIVE && userId) {
      try {
        return await this._send("/favorites", "POST", { userId, attractionId });
      } catch (e) {}
    }
    return null;
  },

  async removeFavorite(userId, attractionId) {
    if (this.LIVE && userId) {
      try {
        return await this._send(`/favorites/${userId}/${attractionId}`, "DELETE");
      } catch (e) {}
    }
    return null;
  },

  /* ---- Auth ---- */
  async login({ email, password }) {
    if (this.LIVE) {
      try {
        return await this._send("/login", "POST", { email, password });
      } catch (e) {
        const isNetworkErr = !e.message || e.message === "Failed to fetch" || e.message.includes("NetworkError") || e.message.includes("fetch");
        if (isNetworkErr) {
          console.warn("[TM_API] Backend offline/unreachable. Falling back to demonstration authentication.");
          return tmMockLogin(email, password);
        }
        // Fallback for demonstration admin credentials if backend database is not seeded
        if (email === TM_DEMO_ADMIN.email && password === TM_DEMO_ADMIN.password) {
          console.warn("[TM_API] Backend rejected credentials; using demo admin fallback.");
          return tmMockLogin(email, password);
        }
        throw e;
      }
    }
    return tmMockLogin(email, password);
  },

  async register(dto) {
    if (this.LIVE) {
      try {
        return await this._send("/register", "POST", dto);
      } catch (e) {
        const isNetworkErr = !e.message || e.message === "Failed to fetch" || e.message.includes("NetworkError") || e.message.includes("fetch");
        if (isNetworkErr) {
          console.warn("[TM_API] Backend offline/unreachable. Falling back to demonstration registration.");
          return tmMockLogin(dto.email, dto.password, dto.fullName);
        }
        throw e;
      }
    }
    return tmMockLogin(dto.email, dto.password, dto.fullName);
  },
};

/* ---------- Mock & Algorithm Fallback Helpers ---------- */
const TM_SAVED_MESSAGES = [
  {
    id: 1,
    name: "David Miller",
    email: "david.miller@example.com",
    subject: "Inquiry regarding family trip to Pearl Bay",
    message: "Hello TravelMate team, I am planning a one-day trip from Atulugama with my family next Saturday. Can you confirm if Pearl Bay has food stalls inside?",
    isRead: false,
    createdAt: new Date().toISOString()
  }
];

function tmMockSubmitContact(dto) {
  const item = { ...dto, id: Date.now(), isRead: false, createdAt: new Date().toISOString() };
  TM_SAVED_MESSAGES.unshift(item);
  return item;
}

function tmMockGetContactMessages() {
  return [...TM_SAVED_MESSAGES];
}

function tmMockFilterAttractions({ categoryId, keyword } = {}) {
  let list = [...TM_ATTRACTIONS];
  if (categoryId) list = list.filter((a) => a.categoryId === Number(categoryId));
  if (keyword) {
    const k = keyword.toLowerCase();
    list = list.filter((a) => a.name.toLowerCase().includes(k) || (a.description && a.description.toLowerCase().includes(k)) || (a.location && a.location.toLowerCase().includes(k)));
  }
  return list;
}

function tmMockCreateAttraction(dto) {
  const id = Math.max(0, ...TM_ATTRACTIONS.map((a) => a.id)) + 1;
  const cat = TM_CATEGORIES.find((c) => c.id === Number(dto.categoryId));
  const record = {
    ...dto,
    id,
    categoryName: cat ? cat.name : "",
    averageRating: 0,
    googleMapsUrl: dto.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${dto.latitude},${dto.longitude}`
  };
  TM_ATTRACTIONS.unshift(record);
  return record;
}

function tmMockUpdateAttraction(id, dto) {
  const idx = TM_ATTRACTIONS.findIndex((a) => a.id === Number(id));
  const cat = TM_CATEGORIES.find((c) => c.id === Number(dto.categoryId));
  if (idx > -1) {
    TM_ATTRACTIONS[idx] = {
      ...TM_ATTRACTIONS[idx],
      ...dto,
      id: Number(id),
      categoryName: cat ? cat.name : TM_ATTRACTIONS[idx].categoryName
    };
    return TM_ATTRACTIONS[idx];
  }
  return dto;
}

function tmMockDeleteAttraction(id) {
  const idx = TM_ATTRACTIONS.findIndex((a) => a.id === Number(id));
  if (idx > -1) TM_ATTRACTIONS.splice(idx, 1);
}

function tmMockGetCategories() {
  return [...TM_CATEGORIES];
}

function tmMockCreateCategory(dto) {
  const id = Math.max(0, ...TM_CATEGORIES.map((c) => c.id)) + 1;
  const record = {
    ...dto,
    id,
    imageUrl: dto.imageUrl || "",
    color: dto.color || "#f2542d",
    isFeatured: dto.isFeatured !== undefined ? dto.isFeatured : true,
    attractionCount: 0
  };
  TM_CATEGORIES.push(record);
  return record;
}

function tmMockUpdateCategory(id, dto) {
  const idx = TM_CATEGORIES.findIndex((c) => c.id === Number(id));
  if (idx > -1) {
    TM_CATEGORIES[idx] = {
      ...TM_CATEGORIES[idx],
      ...dto,
      id: Number(id)
    };
    return TM_CATEGORIES[idx];
  }
  return dto;
}

function tmMockDeleteCategory(id) {
  const idx = TM_CATEGORIES.findIndex((c) => c.id === Number(id));
  if (idx > -1) {
    TM_CATEGORIES.splice(idx, 1);
  }
}

function tmMockLogin(email, password, fullName) {
  if (email === TM_DEMO_ADMIN.email && password === TM_DEMO_ADMIN.password) {
    return { userId: 1, fullName: "System Administrator", email, role: "ADMIN", token: "demo-admin-token" };
  }
  if (password && password.length >= 6) {
    return { userId: Date.now(), fullName: fullName || "Tour Tourist", email, role: "TOURIST", token: "demo-user-token" };
  }
  throw new Error("Invalid email or password");
}

/**
 * Client-Side Deterministic Nearest-Neighbour Planner Fallback
 */
function tmMockGenerateItinerary(req) {
  const originLat = 6.7022;
  const originLon = 80.0528;
  const ids = req.attractionIds || [];
  const selected = TM_ATTRACTIONS.filter((a) => ids.includes(a.id));

  const isMoto = req.travelMode === "motorcycle";
  const speedKmh = isMoto ? 40.0 : 35.0;
  const buffer = isMoto ? 3 : 5;

  let curLat = originLat;
  let curLon = originLon;
  let curTimeMinutes = 9 * 60; // default 9:00 AM in minutes
  if (req.startTime) {
    const parts = req.startTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (parts) {
      let h = parseInt(parts[1], 10);
      const m = parseInt(parts[2], 10);
      const ampm = (parts[3] || "").toUpperCase();
      if (ampm === "PM" && h < 12) h += 12;
      if (ampm === "AM" && h === 12) h = 0;
      curTimeMinutes = h * 60 + m;
    }
  }

  let endTimeMinutes = 18 * 60; // 6:00 PM
  if (req.endTime) {
    const parts = req.endTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (parts) {
      let h = parseInt(parts[1], 10);
      const m = parseInt(parts[2], 10);
      const ampm = (parts[3] || "").toUpperCase();
      if (ampm === "PM" && h < 12) h += 12;
      if (ampm === "AM" && h === 12) h = 0;
      endTimeMinutes = h * 60 + m;
    }
  }

  const unvisited = [...selected];
  const scheduled = [];
  const overflow = [];
  let totalDist = 0;
  let order = 1;

  while (unvisited.length > 0) {
    let nearest = null;
    let minDist = Infinity;

    for (const a of unvisited) {
      const d = haversineDistance(curLat, curLon, a.latitude, a.longitude) * 1.25;
      if (d < minDist) {
        minDist = d;
        nearest = a;
      }
    }

    if (!nearest) break;

    const travelMins = Math.round((minDist / speedKmh) * 60) + buffer;
    const arrivalMins = curTimeMinutes + travelMins;
    const durMins = nearest.durationMinutes || 60;
    const departureMins = arrivalMins + durMins;

    if (departureMins > endTimeMinutes) {
      overflow.push(nearest);
    } else {
      totalDist += minDist;
      scheduled.push({
        id: order,
        attractionId: nearest.id,
        attractionName: nearest.name,
        categoryName: nearest.categoryName,
        location: nearest.location,
        imageUrl: nearest.imageUrl,
        googleMapsUrl: nearest.googleMapsUrl,
        visitOrder: order++,
        plannedStartTime: formatMinutesToAmPm(arrivalMins),
        plannedEndTime: formatMinutesToAmPm(departureMins),
        durationMinutes: durMins,
        travelTimeMinutes: travelMins,
        distanceKm: Math.round(minDist * 10) / 10
      });
      curLat = nearest.latitude;
      curLon = nearest.longitude;
      curTimeMinutes = departureMins;
    }

    const idx = unvisited.indexOf(nearest);
    unvisited.splice(idx, 1);
  }

  return {
    planName: req.planName || `One-Day Tour (${scheduled.length} stops)`,
    visitDate: req.visitDate || new Date().toISOString().split("T")[0],
    startTime: req.startTime || "09:00 AM",
    endTime: req.endTime || "06:00 PM",
    travelMode: req.travelMode || "car",
    totalDistanceKm: Math.round(totalDist * 10) / 10,
    totalDurationMinutes: Math.max(0, curTimeMinutes - (9 * 60)),
    startLocation: "Atulugama, Kalutara District",
    items: scheduled,
    overflowAttractions: overflow
  };
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatMinutesToAmPm(totalMinutes) {
  let hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strM = minutes < 10 ? "0" + minutes : minutes;
  const strH = hours < 10 ? "0" + hours : hours;
  return `${strH}:${strM} ${ampm}`;
}
