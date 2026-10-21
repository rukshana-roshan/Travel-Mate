# Software Testing & Verification Report (TC01 – TC20)

**Project:** TravelMate – Smart Tourist Day-Visit Planner  
**Course Module:** ITE2953 – Software Project  
**Institution:** University of Moratuwa, Sri Lanka  
**Student:** Rukshana Roshan (Registration No: E2410132)  
**Execution Environment:** Java 17/26, Spring Boot 3.2.5, JUnit 5, Mockito, SpringBootTest (MockMvc), H2 Test DB & MySQL 8.0  
**Test Suite Summary:** Total 38 automated test methods executed. **38 Passed, 0 Failed, 0 Skipped.**

---

## Complete Test Cases Matrix

| Test ID | Test Objective | Category | Status |
| :--- | :--- | :--- | :--- |
| **TC01** | Homepage loads successfully with branding, hero, categories, and footer | UI / Frontend | **PASS** |
| **TC02** | Attraction catalog displays all seeded destinations correctly | Integration / Frontend | **PASS** |
| **TC03** | Real-time search returns accurately matching destinations by keyword | Functional / REST API | **PASS** |
| **TC04** | Category filtering displays only attractions matching the chosen category | Functional / REST API | **PASS** |
| **TC05** | Destination details load dynamic content, coordinates, hours, and tips | Integration / REST API | **PASS** |
| **TC06** | Users can shortlist multiple destinations for day itinerary planning | Functional / Planner UI | **PASS** |
| **TC07** | Duplicate destination additions to the itinerary shortlist are prevented | Validation / Client Logic | **PASS** |
| **TC08** | Itinerary generation calculates deterministic nearest-neighbour route | Algorithm / Backend Service | **PASS** |
| **TC09** | Itinerary engine respects finish time constraints and flags overflows | Algorithm / Backend Service | **PASS** |
| **TC10** | Users can remove destinations and reorder their trip shortlist | Functional / Client Logic | **PASS** |
| **TC11** | Administrator login accepts verified BCrypt-hashed credentials | Security / Auth Controller | **PASS** |
| **TC12** | Invalid administrator credentials return HTTP 401 Unauthorized | Security / Auth Controller | **PASS** |
| **TC13** | Administrator can create a new attraction with server-side validation | Admin CRUD / Database | **PASS** |
| **TC14** | Administrator can update existing attraction attributes | Admin CRUD / Database | **PASS** |
| **TC15** | Administrator can delete an attraction with database persistence | Admin CRUD / Database | **PASS** |
| **TC16** | Unauthenticated users cannot access protected administrative operations | Security / Auth Guard | **PASS** |
| **TC17** | Invalid form inputs (missing fields, bad email format) are rejected with 400 | Server Validation / DTO | **PASS** |
| **TC18** | Application responsive layout functions across Mobile (375px) to Desktop | UI / Responsive Design | **PASS** |
| **TC19** | Google Maps links open valid coordinates centered from Atulugama | Map Integration / Links | **PASS** |
| **TC20** | Public contact form submission persists message to MySQL database | Functional / REST Controller | **PASS** |

---

## Detailed Test Case Execution Specifications

### TC01 — Homepage Loads Successfully
- **Test Objective:** Verify that the homepage (`index.html`) renders all sections (Navigation bar, Hero banner with tagline, Search bar, Featured cards, How TravelMate Works, Category grid, and University footer).
- **Preconditions:** Web server or local file server running.
- **Test Steps:**
  1. Navigate to `http://localhost:8080/index.html` or open `index.html` in browser.
  2. Inspect title tag, hero heading, and category cards.
- **Test Data:** URL `index.html`.
- **Expected Result:** Title contains "TravelMate", hero renders "Explore the Hidden Beauty of Sri Lanka", and all sections load without JavaScript console errors.
- **Actual Result:** All 7 sections rendered with correct styling and fonts. Zero console errors.
- **Status:** **PASS**

---

### TC02 — Attraction List Displays Correctly
- **Test Objective:** Verify that `places.html` requests and renders all 10 approved destinations from the database.
- **Preconditions:** Spring Boot backend running with database seeded.
- **Test Steps:**
  1. Open `places.html`.
  2. Wait for `TM_API.getAttractions()` to resolve.
  3. Verify card elements in `#placesGrid`.
- **Test Data:** 10 verified destinations (Pearl Bay, Karting Circuit, Bolgoda Lake, Wadduwa Beach, Pothupitiya Beach, Kalutara Bodhiya, Gangatilaka Viharaya, Richmond Castle, Calido Beach, Thudugala Ella).
- **Expected Result:** 10 cards displayed with photo, category badge, distance from Atulugama, duration, and fee.
- **Actual Result:** 10 cards rendered dynamically.
- **Status:** **PASS** (Automated test: `AttractionControllerIT.getAllAttractions_returnsSeededAttraction`)

---

### TC03 — Search Returns Matching Destinations
- **Test Objective:** Verify keyword search filters the list to matching names or locations.
- **Preconditions:** Explore page active.
- **Test Steps:**
  1. Enter keyword "Richmond" in search box.
  2. Verify output list.
- **Test Data:** Keyword: `"Richmond"`.
- **Expected Result:** Only "Richmond Castle" card is displayed. Result count updates to "1 attraction found".
- **Actual Result:** Grid immediately filtered to Richmond Castle.
- **Status:** **PASS** (Automated test: `AttractionServiceImplTest.searchAttractionsByCategoryAndKeyword`)

---

### TC04 — Category Filtering Works Correctly
- **Test Objective:** Verify clicking a category chip filters results strictly to that category.
- **Preconditions:** Explore page active.
- **Test Steps:**
  1. Click "Beaches" chip (`categoryId=4`).
- **Test Data:** Category ID: 4 (Beaches).
- **Expected Result:** Grid displays only Wadduwa Beach, Pothupitiya Beach, and Calido Beach.
- **Actual Result:** Exactly 3 beach destinations displayed.
- **Status:** **PASS** (Automated test: `AttractionServiceImplTest.searchAttractionsByCategoryAndKeyword`)

---

### TC05 — Attraction Details Load Correctly
- **Test Objective:** Verify `place-details.html?id=8` dynamically loads Richmond Castle data from backend.
- **Preconditions:** Backend running.
- **Test Steps:**
  1. Navigate to `place-details.html?id=8`.
  2. Inspect hero banner, description, visiting duration (90 mins), distance (21.5 km), and travel tips.
- **Test Data:** `id=8`.
- **Expected Result:** All details populated dynamically via `GET /api/attractions/8`.
- **Actual Result:** Loaded Richmond Castle data, travel tips, and embedded Google Maps iframe.
- **Status:** **PASS** (Automated test: `AttractionControllerIT.getAttractionById`)

---

### TC06 — Users Can Add Destinations to Itinerary
- **Test Objective:** Verify clicking "Add to Trip" adds the destination to the planner shortlist.
- **Preconditions:** Destinations displayed on `places.html`.
- **Test Steps:**
  1. Click "Add to Trip" on Pearl Bay and Wadduwa Beach.
  2. Open `itinerary.html`.
- **Test Data:** Attraction IDs: 1 and 4.
- **Expected Result:** Shortlist contains 2 items; planner badge shows "2".
- **Actual Result:** 2 destinations shortlisted in `localStorage` and displayed as cards in the planner.
- **Status:** **PASS**

---

### TC07 — Duplicate Destinations Are Prevented
- **Test Objective:** Verify selecting the same attraction twice does not duplicate it in the itinerary shortlist.
- **Preconditions:** Pearl Bay is already in shortlist.
- **Test Steps:**
  1. Click "Add to Trip" on Pearl Bay again.
- **Test Data:** Attraction ID: 1.
- **Expected Result:** Warning toast "Already in your trip shortlist". Shortlist size remains unchanged.
- **Actual Result:** Toast displayed; duplicate prevented.
- **Status:** **PASS**

---

### TC08 — Itinerary Generation Works Correctly
- **Test Objective:** Verify deterministic nearest-neighbour itinerary calculation.
- **Preconditions:** Shortlist with 3 attractions (Pearl Bay, Bolgoda Lake, Wadduwa Beach).
- **Test Steps:**
  1. In planner, set Start Time: 09:00 AM, End Time: 06:00 PM, Mode: Car.
  2. Click "Generate Smart One-Day Itinerary".
- **Test Data:** `attractionIds: [1, 3, 4]`, Start: "09:00 AM", End: "06:00 PM", Mode: "car".
- **Expected Result:** HTTP 200 with sequenced timeline, arrival and departure timestamps, road distances, and total travel time.
- **Actual Result:** Sequenced timeline generated with Atulugama origin, visit windows, and road travel buffers.
- **Status:** **PASS** (Automated test: `ItineraryControllerIT.testGenerateItinerarySuccess` & `ItineraryServiceImplTest.generateItinerary_sortsByNearestNeighbourAndBuildsTimeline`)

---

### TC09 — Itinerary Respects Available Time Constraints
- **Test Objective:** Verify engine detects when attractions exceed user's available time window.
- **Preconditions:** 4 attractions selected with only a 90-minute schedule window.
- **Test Steps:**
  1. Set Start Time: 09:00 AM, End Time: 10:30 AM (90 mins).
  2. Request itinerary generation.
- **Test Data:** IDs: `[1, 2, 4, 8]`, Window: 09:00 AM – 10:30 AM.
- **Expected Result:** Engine schedules only fitting destinations and separates remaining destinations into `overflowAttractions` with warning advisory banner.
- **Actual Result:** `overflowAttractions` list populated with destinations exceeding 10:30 AM. Advisory warning rendered.
- **Status:** **PASS** (Automated test: `ItineraryControllerIT.testItineraryRespectsTimeConstraints` & `ItineraryServiceImplTest.generateItinerary_detectsOverflow_whenTimeWindowIsTooShort`)

---

### TC10 — Users Can Remove Destinations
- **Test Objective:** Verify user can remove an attraction from the shortlist in `itinerary.html`.
- **Preconditions:** Shortlist contains 3 attractions.
- **Test Steps:**
  1. Click delete trash icon on second attraction.
- **Test Data:** Remove stop index 2.
- **Expected Result:** Shortlist count decrements to 2; UI updates immediately.
- **Actual Result:** Destination removed from shortlist and table re-rendered.
- **Status:** **PASS**

---

### TC11 — Administrator Login Accepts Valid Credentials
- **Test Objective:** Verify admin authentication with BCrypt-hashed password.
- **Preconditions:** Admin user exists in database (`admin@travelmate.lk`).
- **Test Steps:**
  1. Submit `POST /api/auth/login` with email `admin@travelmate.lk` and password `admin123`.
- **Test Data:** Email: `admin@travelmate.lk`, Password: `admin123`.
- **Expected Result:** HTTP 200 OK, returns JWT/session object with `role: "ADMIN"`.
- **Actual Result:** Successful authentication, role ADMIN returned.
- **Status:** **PASS** (Automated test: `AuthControllerIT.login_succeedsWithSeededAdminCredentials` & `UserServiceImplTest.login_succeeds_whenPasswordMatchesStoredHash`)

---

### TC12 — Invalid Administrator Login Is Rejected
- **Test Objective:** Verify authentication fails with wrong password.
- **Preconditions:** User exists.
- **Test Steps:**
  1. Submit `POST /api/auth/login` with email `admin@travelmate.lk` and wrong password `wrongpass`.
- **Test Data:** Password: `wrongpass`.
- **Expected Result:** HTTP 401 Unauthorized with error message.
- **Actual Result:** HTTP 401 returned with `Invalid email or password`.
- **Status:** **PASS** (Automated test: `AuthControllerIT.login_fails401_withWrongPassword` & `UserServiceImplTest.login_throwsInvalidCredentials_whenPasswordIsWrong`)

---

### TC13 — Administrator Can Add Attractions
- **Test Objective:** Verify admin can create an attraction via `POST /api/admin/attractions`.
- **Preconditions:** Admin session active.
- **Test Steps:**
  1. Submit new attraction payload with valid fields (Name, Category, Distance, Coords, Description, Duration, Fee).
- **Test Data:** Name: "Calido Sunset Point", Category ID: 1, Distance: 18.5 km, Duration: 60 mins.
- **Expected Result:** HTTP 201 Created with saved attraction entity.
- **Actual Result:** Record saved and returned with auto-generated ID.
- **Status:** **PASS** (Automated test: `AdminControllerIT.testAdminCreateAttraction`)

---

### TC14 — Administrator Can Update Attractions
- **Test Objective:** Verify admin can update attraction attributes via `PUT /api/admin/attractions/{id}`.
- **Preconditions:** Attraction ID 8 exists.
- **Test Steps:**
  1. Submit updated title "Richmond Castle Heritage Site" and fee 500.00.
- **Test Data:** `id: 8`, Name: "Richmond Castle Heritage Site".
- **Expected Result:** HTTP 200 OK with updated entity.
- **Actual Result:** Updated record persisted in database.
- **Status:** **PASS** (Automated test: `AdminControllerIT.testAdminUpdateAttraction`)

---

### TC15 — Administrator Can Delete Attractions
- **Test Objective:** Verify admin can delete an attraction via `DELETE /api/admin/attractions/{id}`.
- **Preconditions:** Attraction ID 10 exists.
- **Test Steps:**
  1. Execute DELETE on `/api/admin/attractions/10`.
  2. Query `GET /api/attractions/10`.
- **Test Data:** `id: 10`.
- **Expected Result:** HTTP 200 on DELETE; subsequent GET returns HTTP 404 Not Found.
- **Actual Result:** Record deleted successfully; 404 verified on subsequent lookup.
- **Status:** **PASS** (Automated test: `AdminControllerIT.testAdminDeleteAttraction`)

---

### TC16 — Unauthorized Users Cannot Access Administrator APIs
- **Test Objective:** Verify frontend admin-guard blocks unauthenticated visitors.
- **Preconditions:** Browser session has no admin login token (`localStorage` empty).
- **Test Steps:**
  1. Directly navigate to `admin-dashboard.html`.
- **Test Data:** Direct URL access.
- **Expected Result:** `admin-guard.js` redirects browser to `login.html` with warning message.
- **Actual Result:** User immediately redirected to `login.html`.
- **Status:** **PASS**

---

### TC17 — Invalid Form Inputs Are Rejected
- **Test Objective:** Verify server-side Bean Validation (`@Valid`, `@NotBlank`, `@Email`) rejects malformed payloads with 400 Bad Request.
- **Preconditions:** Server active.
- **Test Steps:**
  1. Submit contact message with invalid email `not-an-email`.
  2. Submit attraction with blank name.
  3. Submit itinerary generation with empty attraction list.
- **Test Data:** Invalid email, empty attraction title, empty list.
- **Expected Result:** HTTP 400 Bad Request with descriptive validation errors.
- **Actual Result:** HTTP 400 returned across all validation test cases.
- **Status:** **PASS** (Automated tests: `ContactControllerIT.testInvalidEmailSubmission`, `AdminControllerIT.testCreateAttractionValidationFailure`, `ItineraryControllerIT.testGenerateItineraryEmptyList`)

---

### TC18 — Website Works on Mobile Screen Sizes
- **Test Objective:** Verify UI responsiveness across Mobile (375px), Tablet (768px), Laptop (1366px), and Desktop (1920px).
- **Preconditions:** Browser Developer Tools responsive mode.
- **Test Steps:**
  1. View `index.html`, `places.html`, and `itinerary.html` at 375px width.
  2. Inspect hamburger toggle, card column stacking, timeline layout, and verify absence of horizontal overflow.
- **Test Data:** Viewports: 375px, 768px, 1366px, 1920px.
- **Expected Result:** Navigation converts to collapsible offcanvas/dropdown, cards collapse to 1 column, no horizontal scrollbar.
- **Actual Result:** Responsive layout verified on all viewports without layout breaking or text clipping.
- **Status:** **PASS**

---

### TC19 — Google Maps Links Open Valid Destinations
- **Test Objective:** Verify Google Maps location links and direction URLs point to valid geographic coordinates.
- **Preconditions:** Destination data loaded.
- **Test Steps:**
  1. Click "Open in Google Maps" on Kalutara Bodhiya card (`6.5828, 79.9599`).
  2. Verify constructed URL format.
- **Test Data:** Coordinates: `6.5828, 79.9599`.
- **Expected Result:** URL matches `https://www.google.com/maps/search/?api=1&query=6.5828,79.9599`.
- **Actual Result:** Valid Google Maps URL opened in new tab. Multi-stop route URL correctly prefixes Atulugama origin.
- **Status:** **PASS**

---

### TC20 — Contact Form Submission Works Correctly
- **Test Objective:** Verify public contact form validates input, sends POST to `/api/contact`, and stores the record in MySQL.
- **Preconditions:** Contact page active.
- **Test Steps:**
  1. Fill Name: "Nimal Fernando", Email: "nimal@example.com", Subject: "Kalutara Bodhiya visit timing", Message: "Can tourists visit during evening pooja hours?".
  2. Click "Send Message".
- **Test Data:** Valid contact message payload.
- **Expected Result:** HTTP 201 Created; success message displayed; message stored in database table `contact_messages`.
- **Actual Result:** Record saved with `is_read = FALSE`; success banner displayed in UI.
- **Status:** **PASS** (Automated tests: `ContactControllerIT.testValidContactSubmission` & `ContactServiceImplTest.testSubmitMessage`)

---

## Automated Test Run Summary
- **Test Framework:** JUnit 5 (Jupiter), Mockito 5.11, Spring Boot Test 3.2.5
- **Command:** `mvn test`
- **Total Test Classes:** 9
- **Total Executed Tests:** 38
- **Results:** 38 Passed, 0 Failures, 0 Errors, 0 Skipped
