# TravelMate — Project Overview Presentation
### Maximum 5 Slides (Excluding Title Slide)
**Course Module:** ITE2953 – Software Project (Final Submission, 60% Weightage)  
**Student:** Rukshana Roshan (Registration No: E2410132)  
**Institution:** University of Moratuwa, Sri Lanka  

---

## Slide 0: Title Slide (Cover)

### **TravelMate — Smart Tourist Day-Visit Planner**
**Subtitle:** An Enterprise Full-Stack Web Solution for Tailored Day-Trip Exploration and Optimized Itinerary Generation (25km Radius from Atulugama, Western Province, Sri Lanka)

- **Candidate Name:** Rukshana Roshan
- **Registration Number:** E2410132
- **Degree Programme:** B.Sc. (Hons) in Information Technology
- **Academic Institution:** University of Moratuwa, Sri Lanka
- **Course Module:** ITE2953 – Software Project
- **Technology Stack:** Java 17, Spring Boot 3.2, MySQL 8, Bootstrap 5, StarUML

> **Verbatim Speaker Defense Script:**  
> *"Good morning / afternoon, respected examiners and faculty members. My name is Rukshana Roshan, Registration Number E2410132. Today, I am proud to present my final software engineering project for course module ITE2953: TravelMate – Smart Tourist Day-Visit Planner. Over the next five slides, I will provide a quick, comprehensive overview of our problem domain, layered system architecture, nearest-neighbour optimization algorithm, database design, and automated testing results."*

---

## Slide 1: Problem Domain, Project Objectives & Stakeholders
*(Aligned with Rubric: Project Understanding & Problem Domain — 15 Points)*

### 1. Problem Domain & Background
- **Severe Information Fragmentation:** Travelers exploring Atulugama, Bandaragama, and Kalutara struggle with scattered, outdated opening hours, entrance fees, and contact details across unverified blogs and social media pages.
- **Unrealistic Day Trip Schedules:** Visitors often fail to pace day visits accurately. Generic GPS tools compute straight-line driving times but omit realistic on-site visit durations, meal breaks, and local road-winding factors.
- **Target Stakeholders:** Domestic day tourists, weekend families, nature enthusiasts, adventure sports seekers, and regional tourism administrators responsible for asset curation.

### 2. Specific Objectives & Scope
- **Curated 25km Spatial Radius:** Filter and present 10 verified, high-interest destinations across 6 categories centered at Atulugama coordinates (6.7022° N, 80.0528° E).
- **Algorithmic Day Planner:** Generate conflict-free, clock-timed itineraries calculating transit buffers, stay durations, and automated midday lunch break scheduling.
- **Administrative Governance:** Provide a secure, role-gated administrative suite for complete CRUD management of destinations, categories, and moderation of tourist inquiries.
- **Decoupled Multi-Platform Architecture:** Architect a stateless REST API (Spring Boot 3.2 on Docker/Render) coupled with a modern, responsive static web frontend (GitHub Pages).

> **Verbatim Speaker Defense Script:**  
> *"On Slide 1, we highlight the core problem domain and objectives. Travelers visiting the Atulugama and Kalutara region frequently suffer from fragmented information—incorrect entrance fees, unverified opening hours, and unrealistic day schedules that don't account for local traffic or stay durations. TravelMate resolves this by anchoring an accurate 25km geographic catalog around Atulugama, providing a deterministic nearest-neighbour itinerary planner that constructs a realistic, timed schedule, and offering local tourism administrators a dedicated portal to maintain verified data."*

---

## Slide 2: Layered Architecture, Technology Stack & API Contract
*(Aligned with Rubric: Technical Implementation Knowledge — 25 Points)*

### 1. Presentation Layer (Decoupled Client)
- **HTML5 & Bootstrap 5:** Mobile-first layout with custom CSS design tokens and responsive grid.
- **Vanilla ES6+ JavaScript:** High-performance client logic with zero bulky external framework runtime.
- **Unified API Client (`api.js`):** Centralized `TM_API` module wrapping fetch calls with unified error handling.
- **Interactive Navigation:** Direct multi-stop route integration with Google Maps.
- **Dedicated Print Stylesheet:** Seamless PDF export formatted for day tourists via `@media print`.

### 2. Backend REST API Layer (Spring Boot 3.2.5 & Java 17)
- **Clean Layered Hierarchy:** `Controller` → `Service Interface` → `ServiceImpl` → `JPA Repository`.
- **DTO Wire Encapsulation:** Entity models never leave the service layer; validated via Bean Validation (`@Valid`).
- **`ApiResponse<T>` Envelope:** Uniform JSON format: `success`, `message`, `data`, `timestamp`.
- **Global Exception Handling:** `@ControllerAdvice` transforms exceptions into standard HTTP error responses.
- **BCrypt Hashing:** Passwords protected using Spring Security Crypto with salt rounds.

### 3. Data & DevOps Layer
- **MySQL 8.0 Relational Engine:** 7 normalized tables enforcing referential integrity and cascading deletes.
- **Spring Data JPA & Hibernate:** Efficient ORM mapping with HikariCP connection pooling.
- **In-Memory H2 DB:** Powers 38 automated test cases in CI/CD without local database dependency.
- **Docker Containerization:** Multi-stage build Dockerfile minimizing container size on Render.
- **Auto-Config Routing:** `config.js` automatically points to Local or Cloud API endpoints.

> **Verbatim Speaker Defense Script:**  
> *"Slide 2 showcases our technical implementation and architecture. The solution implements a clean four-tier layered architecture. Controllers are lightweight and map HTTP requests to services, wrapping responses in an ApiResponse envelope. DTOs completely isolate database entities so database schemas are never exposed across the network. Security is enforced through BCrypt password hashing. The persistence layer utilizes MySQL 8 in production and an in-memory H2 database for our automated test suite."*

---

## Slide 3: System Functionality & Nearest-Neighbour Itinerary Algorithm
*(Aligned with Rubric: System Demonstration & Functionality — 25 Points)*

### 1. Implemented System Capabilities
- **Multi-Criteria Catalog Discovery:** Category chip filtering, real-time debounced keyword search, and multi-field sorting (duration, distance, and ratings).
- **Rich Destination Profiles:** Verified GPS coordinates, entrance fees, operational hours, high-resolution photo galleries, and respectful local travel etiquette tips.
- **Day Trip Shortlisting:** Instant one-click selection with client-side duplicate prevention toasts and live trip counter badge.
- **Administrator Suite:** Secure dashboard with KPI metric cards, modal forms for adding/editing destinations, category editing, and tourist message reviews.

### 2. Nearest-Neighbour Itinerary Algorithm
1. **Anchor Origin:** Trip departure anchored at Atulugama central coordinates (6.7022° N, 80.0528° E).
2. **Road-Winding Haversine:** Computes great-circle distance × 1.25 empirical road-winding coefficient for Sri Lankan terrain.
3. **Realistic Travel Speeds:** Incorporates realistic vehicle speeds (Car: 35 km/h, Motorcycle: 40 km/h) to compute minute-level transit buffers.
4. **Greedy Sequence:** Iteratively sequences the closest unvisited stop, minimizing total transit fatigue.
5. **Lunch Break Insertion:** Automatically inserts a 60-minute lunch slot if trip spans 12:30 PM – 1:30 PM.
6. **Finish Time Enforcement:** Checks cumulative time against Finish Time threshold and tags excess stops into an advisory overflow section.

> **Verbatim Speaker Defense Script:**  
> *"Slide 3 details our system functionality and itinerary algorithm. Rather than relying on an opaque, non-deterministic black box, we designed a deterministic nearest-neighbour routing algorithm tailored to local conditions. The algorithm anchors the trip at Atulugama, applies a 1.25 road-winding factor to the Haversine distance, applies realistic vehicle speeds (35 km/h for cars), builds a minute-by-minute chronological timeline, inserts a lunch break between 12:30 and 1:30 PM, and flags any stops that exceed the requested finish time."*

---

## Slide 4: Relational Database Design & Engineering Decisions
*(Aligned with Rubric: Software Engineering & Design Decisions — 15 Points)*

### 1. Normalized Relational Schema (3NF)
- **`users`:** Authentication credentials, BCrypt hashes, and role-based permissions (`ROLE_ADMIN`, `ROLE_TOURIST`).
- **`categories` & `attractions`:** One-to-Many taxonomy relationship with ON DELETE CASCADE foreign key constraints.
- **`itinerary` & `itinerary_items`:** Master-detail composite structure capturing chronological arrival, departure, transit, and lunch stops.
- **`favorites` & `reviews`:** User engagement bookmarks and star ratings with cascade cleanup on user deletion.
- **`contact_messages`:** Public inquiries with read/unread administrative workflow tracking.

### 2. Justified Engineering Decisions
- **Deterministic vs Black-Box:** Guarantees explainable, reproducible itineraries without unpredictable hallucinations or expensive third-party API dependencies.
- **Standard Java POJOs (No Lombok):** Avoids Lombok annotation-processor incompatibilities across differing JDK versions (Java 17, 21, and 26), ensuring 100% build reproducibility for examiners.
- **Dual-Layer Data Resilience:** Client-side offline dataset (`data.js`) coupled with live REST synchronization ensures smooth evaluation even in offline grading environments.
- **Strict DTO Encapsulation:** Protects against JPA serialization recursion and over-posting vulnerabilities.
- **Cascading Integrity:** Enforces relational integrity across MySQL constraints rather than brittle application-level manual cleanup.

> **Verbatim Speaker Defense Script:**  
> *"On Slide 4, we examine our software engineering and architectural choices. Our database schema consists of seven normalized tables designed in 3rd Normal Form with cascading foreign key integrity. Key engineering choices include using a deterministic algorithm for predictable tour plans, choosing standard Java POJOs over Lombok to ensure seamless cross-platform compilation on examiners' machines, implementing strict DTO encapsulation to avoid security over-posting, and dual-layer data resilience so the application remains robust."*

---

## Slide 5: Software Testing Strategy, Automated Results & Deliverables
*(Aligned with Rubric: Communication & Professionalism / Testing Rigor — 10 Points)*

### 1. Automated Test Suite Metrics
- **38 / 38 Automated Tests Passed:** 100% pass rate under `mvn test` / `mvn verify`.
- **20 / 20 Test Cases:** Comprehensive verification across university specifications (TC01 to TC20).
- **0 Failures / 0 Regressions:** Verified BCrypt seeding bugfix regression test (`AuthControllerIT`).

### 2. Testing Strategies Implemented
- **Unit Testing (JUnit 5 + Mockito):** 18 unit tests isolating service logic, DTO mapping, and edge case boundaries.
- **Integration Testing (MockMvc + H2):** 20 integration tests verifying full HTTP request-response lifecycles and validation annotations.
- **Security Regression Testing:** Protected BCrypt login authentication and verified 401 Unauthorized handling for unauthenticated requests.
- **Cross-Device UI Testing:** Validated responsive design across mobile (375px), tablet, and desktop breakpoints.

### 3. Packaged Submission Deliverables
- **Developed System:** Full Maven backend (Spring Boot 3.2) + frontend client + MySQL schemas.
- **StarUML Design Project (`.mdj`):** Complete models for Use Case, Activity, Sequence, Class, and ERD.
- **5-Slide Presentation Deck:** Available in native PowerPoint (`.pptx`), interactive HTML, and Markdown.
- **Video Demonstration Script:** 14-stage timed walkthrough script covering all major features.
- **Testing Report:** Complete TC01–TC20 traceability matrix for Report Chapter 5.
- **Single Zipped Submission Folder:** Packaged ready for upload to the course submission portal.

> **Verbatim Speaker Defense Script:**  
> *"In conclusion, on Slide 5, we present our testing verification and deliverables. All 38 automated test cases in our test suite execute with zero errors and zero failures, covering all 20 university test cases. The project is fully realized and packaged into our submission folder, complete with the developed system, StarUML design models, presentation slides, demonstration script, and test report. Thank you for your time, and I welcome any questions regarding the implementation."*
