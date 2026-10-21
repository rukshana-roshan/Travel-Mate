# University Examination Demonstration Script

**Project:** TravelMate – Smart Tourist Day-Visit Planner  
**Course Module:** ITE2953 – Software Project  
**Institution:** University of Moratuwa, Sri Lanka  
**Student:** Rukshana Roshan (Registration No: E2410132)  

---

## 1. Examiner Presentation Overview

### Opening Statement
> "Good morning / afternoon, respected examiners. My name is Rukshana Roshan (Registration Number E2410132). Today, I am proud to present my final software engineering project for module ITE2953: **TravelMate – Smart Tourist Day-Visit Planner**."
> 
> "TravelMate addresses a prevalent problem for domestic and foreign travelers in Sri Lanka: organizing a realistic, enjoyable one-day itinerary around Atulugama, Bandaragama, Kalutara, and surrounding coastal and inland attractions without information fragmentation or unrealistic travel timing."
> 
> "The solution is built using an enterprise layered architecture: Spring Boot 3, Spring Data JPA, Spring Security with BCrypt password hashing, and MySQL relational database on the backend, paired with modern HTML5, CSS3, JavaScript, and Bootstrap 5 on the frontend."

---

## 2. Step-by-Step Demonstration Walkthrough (14 Stages)

### Step 1: Beautiful Homepage Showcase
- **Action:** Open `index.html` in full screen.
- **Key Talking Points:**
  - Highlighting the curated color palette: Deep Ocean Blue (`#123B5D`), Tropical Teal (`#13B8A6`), Sunset Orange (`#F59E42`), and Dark Slate text (`#172B4D`).
  - Google Fonts: `Poppins` for bold headings and `Inter` for clean body typography.
  - Interactive hero section with search bar and quick category chips.
  - "How TravelMate Works" 3-step visual guide (Explore &rarr; Select &rarr; Plan).

### Step 2: Destination Browsing (`places.html`)
- **Action:** Click "Explore Destinations" in navbar.
- **Key Talking Points:**
  - Dynamic loading of all 10 verified destinations from the MySQL database within 25km of Atulugama.
  - Destination cards display approximate distance measured from Atulugama, estimated visit duration, category badge, and fee.

### Step 3: Real-Time Keyword Search
- **Action:** Type `"Richmond"` or `"Beach"` into the search box.
- **Key Talking Points:**
  - Debounced real-time filter instantly displays matching cards without requiring a full page refresh.
  - Clear empty-results message if no match is found, with a one-click "Reset All Filters" button.

### Step 4: Category Filtering & Sorting
- **Action:** Click the "Beaches" category chip; change sorting to "Visit Duration".
- **Key Talking Points:**
  - Demonstrates multi-criteria querying: Category taxonomy coupled with client/server sorting.
  - Shows Wadduwa Beach, Pothupitiya Beach, and Calido Beach ordered by visiting duration.

### Step 5: Destination Details Page (`place-details.html`)
- **Action:** Click "View Details" on "Kalutara Bodhiya".
- **Key Talking Points:**
  - Large destination photograph banner and verified coordinates (`6.5828, 79.9599`).
  - Practical travel tips tailored to destination categories (e.g., modest attire covering knees and shoulders for Buddhist shrines).
  - Embedded interactive Google Map and direct link for external navigation.

### Step 6: Shortlisting Destinations for Day Plan
- **Action:** Click "Add to Day Plan" on Kalutara Bodhiya, Richmond Castle, and Wadduwa Beach.
- **Key Talking Points:**
  - Duplicate prevention: attempting to add an already shortlisted attraction displays an informative toast notification.
  - Global trip counter in the navigation bar updates in real time.

### Step 7: Generating Smart One-Day Itinerary (`itinerary.html`)
- **Action:** Navigate to "Plan My Trip".
- **Key Talking Points:**
  - Step 1 displays shortlisted cards with order badges and distance from Atulugama.
  - Step 2 inputs travel preferences: Start Time (08:30 AM), Finish Time (06:30 PM), Travel Mode (Private Car: 35 km/h vs Motorcycle: 40 km/h).
  - Click "Generate Smart One-Day Itinerary". Explain the deterministic nearest-neighbour algorithm:
    1. Origin is anchored at Atulugama (`6.7022, 80.0528`).
    2. Haversine great-circle distance is adjusted with a $1.25\times$ Sri Lankan road-winding factor.
    3. Vehicle speeds determine realistic travel times between stops.
    4. Clock arrival and departure slots are calculated cumulatively.
    5. Midday lunch break is automatically scheduled when the trip spans midday.

### Step 8: Itinerary Actions (Save & Export PDF)
- **Action:** 
  - Click "Print / Export PDF" to trigger the print dialog. Show how the clean `@media print` CSS formats the document cleanly for physical travel or university documentation.
  - Click "Google Maps Route" to show the multi-stop circuit automatically loaded into Google Maps.
  - Click "Save to Account" (shows persistence to MySQL).

### Step 9: Administrator Login (`login.html`)
- **Action:** Click "Admin Login" in navbar.
- **Key Talking Points:**
  - Enter `admin@travelmate.lk` / `admin123`.
  - Explain that passwords are never stored in plaintext — verified via BCrypt hashing with salt rounds.
  - Automatic redirection to `admin-dashboard.html` upon role authorization.

### Step 10: Administrator Dashboard Overview
- **Action:** Show the 4 summary metrics cards:
  1. Total Destinations (`10`)
  2. Total Categories (`6`)
  3. Total Saved Itineraries
  4. Total Contact Messages (with unread badge)

### Step 11: Destination Management (CRUD)
- **Action:**
  - Navigate to `manage-attractions.html`.
  - Click "Add Destination", fill out the modal form (Title, Category, Coordinates, Distance, Duration, Fee, Google Maps URL), and save.
  - Show the newly added destination appearing immediately in the admin table and public explore page.
  - Click "Edit Destination" to modify a field.
  - Click "Delete Destination" — show the browser confirmation dialogue preventing accidental data deletion.

### Step 12: Contact Message Review (`manage-messages.html`)
- **Action:**
  - Switch to public `contact.html` and submit a test inquiry ("Can tourists visit during evening pooja hours?").
  - Switch to Admin "Contact Inquiries" — show the new inquiry appearing with an "Unread" yellow badge.
  - Open the message modal — show details and explain that it automatically transitions status to "Read".

### Step 13: Responsive Mobile Design Demonstration
- **Action:** Press `F12` in Chrome/Edge, toggle Device Toolbar, and switch to iPhone SE (375px) and iPad (768px).
- **Key Talking Points:**
  - Offcanvas hamburger navigation activates smoothly.
  - Grid cards collapse gracefully to a single column without horizontal overflow.
  - Itinerary timeline maintains vertical rhythm and readability on small touchscreens.

### Step 14: Automated Test Execution & Results
- **Action:** Open terminal and run `mvn test`.
- **Key Talking Points:**
  - Show 38 automated test cases executing across controllers and services.
  - Point to `docs/TEST_CASES_REPORT.md` validating all 20 university test cases (TC01 through TC20).
  - Zero failures, zero errors, zero skipped.

---

## 3. Key Technical Decisions & Architecture Justifications

| Technical Decision | Rationale for University Project |
| :--- | :--- |
| **Clean Layered Architecture** | Strict separation of concerns (Presentation &rarr; REST Controller &rarr; Service Layer &rarr; Repository &rarr; Database). |
| **Deterministic Nearest-Neighbour** | Day tourists require predictable, explainable itineraries. Rather than claiming opaque black-box AI routes, our algorithm transparently models distances, local speeds (35 km/h for cars), and road-winding factors ($1.25\times$). |
| **Standard Java POJOs (No Lombok)** | Guarantees seamless cross-platform build compatibility across Java 17, 21, and 26 without annotation processor crashes. |
| **BCrypt Hashing & Role-Based Access** | Industry standard security preventing plaintext credential leaks. Admin endpoints protected behind role authorization. |
| **Dual Storage (MySQL + Offline Cache)** | Production persistence in MySQL 8.0, with graceful client-side fallback ensuring examiners can test the application smoothly in any environment. |
