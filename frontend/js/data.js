/* ==========================================================================
   TRAVEL MATE — Core Dataset (Verified 25km radius from Atulugama, Sri Lanka)
   ========================================================================== */

const TM_CATEGORIES = [
  {
    id: 1,
    name: "Recreation",
    icon: "bi-controller",
    description: "Theme parks, water parks, and leisure family zones",
    imageUrl: "https://images.unsplash.com/photo-1582650625119-3a31f8418399?auto=format&fit=crop&w=900&q=80",
    color: "#f2542d",
    isFeatured: true
  },
  {
    id: 2,
    name: "Adventure",
    icon: "bi-speedometer2",
    description: "Motorsports, go-karting, and high-energy sports",
    imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=900&q=80",
    color: "#0f5c5c",
    isFeatured: true
  },
  {
    id: 3,
    name: "Nature",
    icon: "bi-tree",
    description: "Serene freshwater lakes, lush waterfalls, and nature trails",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
    color: "#10b981",
    isFeatured: true
  },
  {
    id: 4,
    name: "Beaches",
    icon: "bi-water",
    description: "Golden sandy coasts, sunset viewing, and ocean breezes",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    color: "#0284c7",
    isFeatured: true
  },
  {
    id: 5,
    name: "Religious Places",
    icon: "bi-bank",
    description: "Sacred Buddhist shrines, iconic stupas, and spiritual landmarks",
    imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80",
    color: "#e8a33d",
    isFeatured: true
  },
  {
    id: 6,
    name: "Historical Attractions",
    icon: "bi-compass",
    description: "Colonial heritage, Edwardian architecture, and historical mansions",
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80",
    color: "#8b5cf6",
    isFeatured: true
  },
];

const TM_ATTRACTIONS = [
  {
    id: 1,
    name: "Pearl Bay, Bandaragama",
    categoryId: 1,
    categoryName: "Recreation",
    location: "Bandaragama, Kalutara District",
    description: "Sri Lanka's premier international-standard water theme park featuring thrilling multi-level waterslides, splash pads, wave zones, and family recreational attractions.",
    distanceKm: 8.5,
    durationMinutes: 180,
    openingHours: "09:30 AM - 05:30 PM (Wed-Sun)",
    entranceFee: 3500.00,
    latitude: 6.7135,
    longitude: 79.9897,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=6.7135,79.9897",
    imageUrl: "https://images.unsplash.com/photo-1582650625119-3a31f8418399?auto=format&fit=crop&w=900&q=80",
    averageRating: 4.8
  },
  {
    id: 2,
    name: "Sri Lanka Karting Circuit, Bandaragama",
    categoryId: 2,
    categoryName: "Adventure",
    location: "Bandaragama, Kalutara District",
    description: "The finest go-karting track in South Asia offering FIA-standard circuit racing, high-performance rental karts, floodlit evening sessions, and racing excitement.",
    distanceKm: 8.8,
    durationMinutes: 90,
    openingHours: "10:00 AM - 08:00 PM (Tue-Sun)",
    entranceFee: 2500.00,
    latitude: 6.7144,
    longitude: 79.9880,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=6.7144,79.9880",
    imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=900&q=80",
    averageRating: 4.7
  },
  {
    id: 3,
    name: "Bolgoda Lake",
    categoryId: 3,
    categoryName: "Nature",
    location: "Bolgoda, Bandaragama / Moratuwa Border",
    description: "Sri Lanka's largest natural freshwater lake complex, celebrated for scenic mangrove waterways, peaceful boat safaris, birdwatching, and angling.",
    distanceKm: 14.0,
    durationMinutes: 120,
    openingHours: "06:00 AM - 06:00 PM Daily",
    entranceFee: 500.00,
    latitude: 6.7458,
    longitude: 79.9325,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=6.7458,79.9325",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
    averageRating: 4.6
  },
  {
    id: 4,
    name: "Wadduwa Beach",
    categoryId: 4,
    categoryName: "Beaches",
    location: "Wadduwa, Kalutara District",
    description: "A picturesque golden coastline lined with coconut palms, offering warm sea breezes, traditional fishing catamarans, and breathtaking sunset panoramas.",
    distanceKm: 18.5,
    durationMinutes: 90,
    openingHours: "Open 24 Hours",
    entranceFee: 0.00,
    latitude: 6.6660,
    longitude: 79.9298,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=6.6660,79.9298",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    averageRating: 4.5
  },
  {
    id: 5,
    name: "Pothupitiya Beach",
    categoryId: 4,
    categoryName: "Beaches",
    location: "Pothupitiya, Wadduwa",
    description: "A calm, tranquil coastal sanctuary slightly south of Wadduwa, ideal for peaceful coastal walks, beach photography, and quiet seaside meditation.",
    distanceKm: 19.0,
    durationMinutes: 60,
    openingHours: "Open 24 Hours",
    entranceFee: 0.00,
    latitude: 6.6410,
    longitude: 79.9450,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=6.6410,79.9450",
    imageUrl: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=80",
    averageRating: 4.4
  },
  {
    id: 6,
    name: "Kalutara Bodhiya",
    categoryId: 5,
    categoryName: "Religious Places",
    location: "Kalutara North, Kalutara District",
    description: "One of the most sacred and venerated Buddhist shrines in Sri Lanka, situated near Kalu Ganga and marked by a sacred Bodhi tree with centuries of devotion.",
    distanceKm: 22.0,
    durationMinutes: 75,
    openingHours: "04:30 AM - 09:30 PM Daily",
    entranceFee: 0.00,
    latitude: 6.5828,
    longitude: 79.9599,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=6.5828,79.9599",
    imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80",
    averageRating: 4.9
  },
  {
    id: 7,
    name: "Gangatilaka Viharaya",
    categoryId: 5,
    categoryName: "Religious Places",
    location: "Kalutara South, Kalutara District",
    description: "The world-famous hollow Buddhist Chaitya (Stupa) rising proudly above the Kalutara Bridge, decorated with 74 intricate murals depicting the Jataka tales.",
    distanceKm: 22.1,
    durationMinutes: 60,
    openingHours: "05:00 AM - 09:00 PM Daily",
    entranceFee: 0.00,
    latitude: 6.5822,
    longitude: 79.9605,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=6.5822,79.9605",
    imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80",
    averageRating: 4.8
  },
  {
    id: 8,
    name: "Richmond Castle",
    categoryId: 6,
    categoryName: "Historical Attractions",
    location: "Palatota, Kalutara",
    description: "A magnificent Edwardian-era mansion completed in 1910 by Mudaliyar Don Arthur de Silva Wijesinghe, surrounded by sprawling orchards and Italian marble carvings.",
    distanceKm: 21.5,
    durationMinutes: 90,
    openingHours: "08:30 AM - 04:30 PM Daily",
    entranceFee: 300.00,
    latitude: 6.5750,
    longitude: 79.9820,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=6.5750,79.9820",
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80",
    averageRating: 4.6
  },
  {
    id: 9,
    name: "Calido Beach",
    categoryId: 4,
    categoryName: "Beaches",
    location: "Kalutara Town",
    description: "A narrow, natural peninsula of golden sand wedged between the roaring Indian Ocean and the tranquil estuary of the Kalu Ganga river.",
    distanceKm: 23.0,
    durationMinutes: 75,
    openingHours: "06:00 AM - 07:00 PM Daily",
    entranceFee: 0.00,
    latitude: 6.5785,
    longitude: 79.9545,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=6.5785,79.9545",
    imageUrl: "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?auto=format&fit=crop&w=900&q=80",
    averageRating: 4.5
  },
  {
    id: 10,
    name: "Thudugala Ella",
    categoryId: 3,
    categoryName: "Nature",
    location: "Thudugala, Dodangoda, Kalutara",
    description: "A stunning 8-meter natural cascade tucked inside rubber and rainforest canopies in Dodangoda, featuring soothing natural plunge pools for swimming.",
    distanceKm: 17.5,
    durationMinutes: 120,
    openingHours: "07:00 AM - 05:30 PM Daily",
    entranceFee: 100.00,
    latitude: 6.6028,
    longitude: 80.0410,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=6.6028,80.0410",
    imageUrl: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=900&q=80",
    averageRating: 4.7
  }
];

const TM_REVIEWS = [
  { id: 1, attractionId: 1, userName: "Amaya P.", rating: 5, comment: "Best water park experience in the region! Super clean and fun for the kids.", createdAt: "2026-06-12T17:30:00" },
  { id: 2, attractionId: 2, userName: "Dinesh K.", rating: 5, comment: "Karting track is world class. Adrenaline rush guaranteed!", createdAt: "2026-05-02T10:15:00" },
  { id: 3, attractionId: 3, userName: "Nadeesha W.", rating: 5, comment: "The boat ride at golden hour on Bolgoda was worth the whole day trip.", createdAt: "2026-04-20T08:00:00" },
  { id: 4, attractionId: 6, userName: "Ruwan S.", rating: 5, comment: "Walking inside the hollow stupa was deeply serene and spiritual.", createdAt: "2026-03-11T14:45:00" }
];

const TM_DEMO_ADMIN = { email: "admin@travelmate.lk", password: "admin123" };
