# TravelMate – Smart Tourist Day-Visit Planner

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/rukshanaroshan/travel-mate)
[![Tests Passed](https://img.shields.io/badge/tests-38%20passed-success.svg)](#13-testing-instructions)
[![Java Version](https://img.shields.io/badge/Java-17%20%7C%2021%20%7C%2026-orange.svg)](#5-technology-stack)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-green.svg)](#5-technology-stack)
[![Database](https://img.shields.io/badge/MySQL-8.0-blue.svg)](#7-database-setup)
[![License](https://img.shields.io/badge/License-Academic-lightgrey.svg)](#academic-project-credentials)

---

### Academic Project Credentials
- **Course Module:** ITE2953 – Software Project (Final Year Project – 60% Final Mark)
- **Academic Institution:** Faculty of Information Technology, University of Moratuwa, Sri Lanka
- **Student Name:** Rukshana Roshan
- **Registration Number:** E2410132
- **Academic Year:** 2026

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Project Objectives](#3-project-objectives)
4. [Key System Features](#4-key-system-features)
5. [Technology Stack](#5-technology-stack)
6. [System Architecture](#6-system-architecture)
7. [Database Setup & Schema](#7-database-setup--schema)
8. [Backend Installation](#8-backend-installation)
9. [Frontend Installation](#9-frontend-installation)
10. [Environment Configuration](#10-environment-configuration)
11. [Application Startup Instructions](#11-application-startup-instructions)
12. [REST API Documentation](#12-rest-api-documentation)
13. [Testing Instructions & Verification](#13-testing-instructions)
14. [UI Preview & Page Structure](#14-ui-preview--page-structure)
15. [Known Limitations & Scope Boundaries](#15-known-limitations--scope-boundaries)
16. [Future Improvements](#16-future-improvements)

---

## 1. Project Overview
**TravelMate** is a responsive, web-based tourist information and deterministic one-day itinerary planning system designed for tourists exploring **Atulugama, Bandaragama, Kalutara, and surrounding attractions within a 25 km radius** in Sri Lanka.

TravelMate bridges the gap between static tourist brochures and complex navigation apps by offering a curated catalog of verified regional attractions combined with an intelligent, deterministic day scheduler that sequences destinations, estimates realistic road travel times, accounts for visit durations, and respects user time budgets.

---

## 2. Problem Statement
Sri Lanka's Western Province—specifically Kalutara District and its inland neighbors like Atulugama and Bandaragama—contains exceptional cultural heritage, golden beaches, water sports, and tranquil lakes. However:
1. **Information Fragmentation:** Tourists must juggle disparate websites, blogs, and unstructured social media posts to find opening hours, entrance fees, and accurate geographic coordinates.
2. **Unrealistic Scheduling:** Travelers frequently underestimate local road conditions and overestimate how many destinations can comfortably fit in a single day, leading to rushed, stressful visits.
3. **Lack of Localized Planning Tools:** Existing global trip planners cater primarily to multi-day international vacations across major cities, ignoring localized micro-circuits within 25 km of regional hubs like Atulugama.

---

## 3. Project Objectives
- **Catalog Regional Treasures:** Consolidate comprehensive data for 10+ verified destinations within 25 km of Atulugama, including GPS coordinates, opening hours, estimated visiting durations, entrance fees, and travel tips.
- **Automate Day Itinerary Planning:** Develop a deterministic nearest-neighbour route ordering engine that sequences shortlisted stops, applies Sri Lankan road-winding factors ($1.25\times$), calculates cumulative timelines, and detects schedule overflows.
- **Deliver Layered Software Architecture:** Implement professional industry practices using Java Spring Boot 3 REST APIs, Spring Data JPA, BCrypt security hashing, and MySQL relational persistence.
- **Provide Administrative Governance:** Provide an authenticated dashboard allowing administrators to perform full CRUD operations on attractions, review user ratings, and manage tourist contact inquiries.
- **Ensure Responsive Accessibility:** Deliver a responsive interface operating smoothly from mobile viewports (375px) to ultra-wide displays (1920px).

---

## 4. Key System Features

### Public Tourist Portal
1. **Curated Destination Catalog:** 10 verified attractions across 6 categories (Recreation, Adventure, Nature, Beaches, Religious Places, Historical Sites).
2. **Real-Time Search & Multi-Criteria Filtering:** Instant keyword search and category chip filtering with visit-duration, distance, and name sorting.
3. **Rich Destination Details:** Hero photographs, verified GPS coordinates, suggested durations, entrance fees, custom cultural etiquette tips, and embedded Google Maps.
4. **Interactive Trip Shortlist:** One-click "Add to Trip" with client/server duplicate prevention, drag-and-drop / arrow reordering, and removal.
5. **Deterministic One-Day Itinerary Engine:**
   - Default origin: **Atulugama, Kalutara District (`6.7022° N, 80.0528° E`)**.
   - Select Start Time, Finish Time, and Travel Mode (Private Car: 35 km/h vs Motorcycle: 40 km/h).
   - Clock-synchronized vertical timeline with departure, arrival, visiting, and transfer windows.
   - Automatic midday lunch break slotting.
   - Overflow detection advisory when selections exceed the time budget.
6. **PDF & Print Ready Export:** Dedicated `@media print` stylesheet for formatted physical itineraries or university project submissions.
7. **Google Maps Multi-Stop Route:** Automatically constructs navigable multi-destination Google Maps URLs starting and ending at Atulugama.
8. **Tourist Contact Inquiries:** Validated inquiry form persisting tourist messages to MySQL.

### Secure Administrator Dashboard
1. **BCrypt Authentication:** Secure login (`admin@travelmate.lk` / `admin123`) with encrypted password storage.
2. **System Health Metrics:** Live counters for Total Destinations, Categories, Saved Itineraries, and Contact Inquiries.
3. **Full Attraction CRUD:** Create, read, update, and delete attractions with confirmation modal dialogues and server-side validation.
4. **Category Management:** Taxonomy governance with Bootstrap icons.
5. **Contact Message Inbox:** Read, reply via email link, mark as read, or delete inquiries.

---

## 5. Technology Stack

| Layer | Technologies Used | Description / Purpose |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+), Bootstrap 5.3, Bootstrap Icons | Responsive UI, component styling, client API client, offline cache |
| **Typography** | Google Fonts (`Poppins`, `Inter`) | Modern visual hierarchy and readability |
| **Backend** | Java 17 / 21 / 26, Spring Boot 3.2.5, Spring MVC, REST APIs | Core application server and controller layer |
| **Data Layer** | Spring Data JPA, Hibernate ORM | Relational entity mappings and repository operations |
| **Database** | MySQL 8.0 (Production) / H2 In-Memory (Automated Testing) | Normalized relational persistence |
| **Security** | Spring Security Crypto (BCryptPasswordEncoder), Admin Guard | Secure password hashing, credential protection, role authorization |
| **Testing** | JUnit 5, Mockito, SpringBootTest, MockMvc | Automated unit and integration test coverage |
| **Build & Tooling** | Apache Maven 3.9+, Git & GitHub, Postman | Dependency management and build automation |

---

## 6. System Architecture

TravelMate strictly adheres to the **Layered Architectural Pattern**:

```
[ Frontend Client ] (HTML5 / Bootstrap 5 / Vanilla JS / CSS3)
         │
         ▼  HTTP JSON / REST APIs (CORS Enabled)
[ REST Controller Layer ] (AttractionController, ItineraryController, AdminController, ContactController, AuthController)
         │
         ▼  DTO Data Transfer & Validation (@Valid, Bean Validation)
[ Service Layer ] (AttractionService, ItineraryService, UserService, ContactService, FavoriteService, ReviewService)
         │  * Implements Deterministic Nearest-Neighbour Scheduling
         ▼  Entities & Domain Models
[ Repository Layer ] (Spring Data JPA / Hibernate)
         │
         ▼  JDBC Driver (HikariCP)
[ MySQL 8.0 Database ] (Tables: users, categories, attractions, itinerary, itinerary_items, contact_messages, reviews, favorites)
```

---

## 7. Database Setup & Schema

### Database Details
- **Database Name:** `travel_mate_db`
- **Default Port:** `3306`
- **Character Set:** `utf8mb4`

### SQL Initialization
The database schema and sample records are located in:
[`src/main/resources/sql/schema_and_seed_data.sql`](src/main/resources/sql/schema_and_seed_data.sql)

To initialize manually via MySQL CLI or Workbench:
```sql
CREATE DATABASE IF NOT EXISTS travel_mate_db;
USE travel_mate_db;
SOURCE src/main/resources/sql/schema_and_seed_data.sql;
```

---

## 8. Backend Installation

### Prerequisites
- Java JDK 17, 21, or 26 installed (`java -version`)
- Apache Maven 3.8+ installed (`mvn -version`)
- MySQL Server 8.0 running on `localhost:3306`

### Build Steps
```bash
# Clone the repository
git clone https://github.com/rukshanaroshan/travel-mate.git
cd travel-mate

# Compile and package application
mvn clean package -DskipTests
```

---

## 9. Frontend Installation
The frontend consists of static web assets located in the `frontend/` directory. No compilation or Node.js runtime is strictly required.

To run via local HTTP server:
```bash
# Option A: Python 3 built-in HTTP server
cd frontend
python -m http.server 5500

# Option B: Node.js http-server
npx http-server frontend -p 5500

# Option C: VS Code "Live Server" extension on port 5500
```
Open `http://localhost:5500` in any modern web browser.

---

## 10. Environment Configuration
Copy the configuration template `.env.example` to `.env` or configure `src/main/resources/application.properties`:

```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/travel_mate_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

---

## 11. Application Startup Instructions

### 1. Launch MySQL Database
Ensure MySQL Server is running on port 3306:
```bash
net start MySQL80   # On Windows
```

### 2. Launch Spring Boot Backend
```bash
mvn spring-boot:run
```
The server will start at `http://localhost:8080`. Verify the health endpoint:
```
http://localhost:8080/api/attractions
```

### 3. Open Frontend Portal
Open `http://localhost:5500` or double-click `frontend/index.html`.

### 4. Default Demonstration Credentials
- **Admin Portal:** `http://localhost:5500/login.html`
- **Admin Email:** `admin@travelmate.lk`
- **Admin Password:** `admin123`

---

## 12. REST API Documentation

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/attractions` | Public | List all attractions (supports `?categoryId=` and `?keyword=`) |
| **GET** | `/api/attractions/{id}` | Public | Retrieve single attraction details by ID |
| **GET** | `/api/categories` | Public | List all 6 destination categories |
| **POST** | `/api/itineraries/generate` | Public | Generate deterministic day itinerary timeline |
| **POST** | `/api/itineraries` | User | Save generated itinerary to MySQL database |
| **GET** | `/api/itineraries/{id}` | User | Fetch saved itinerary by ID |
| **POST** | `/api/contact` | Public | Submit tourist inquiry message |
| **POST** | `/api/auth/login` | Public | Authenticate user or administrator via BCrypt |
| **POST** | `/api/auth/register` | Public | Register new tourist account |
| **GET** | `/api/admin/stats` | Admin | Retrieve system summary counters |
| **POST** | `/api/admin/attractions` | Admin | Add new tourist attraction |
| **PUT** | `/api/admin/attractions/{id}` | Admin | Update existing attraction |
| **DELETE**| `/api/admin/attractions/{id}` | Admin | Delete attraction from database |
| **GET** | `/api/admin/messages` | Admin | List all tourist contact messages |
| **DELETE**| `/api/admin/messages/{id}` | Admin | Delete contact message |

---

## 13. Testing Instructions

### Executing Automated Test Suite
The automated test suite runs in-memory using H2 database and covers 38 test methods across unit and integration levels:

```bash
# Execute full test suite
mvn test

# Execute specific integration test classes
mvn test -Dtest=AttractionControllerIT
mvn test -Dtest=AuthControllerIT
mvn test -Dtest=ContactControllerIT
mvn test -Dtest=ItineraryControllerIT
mvn test -Dtest=AdminControllerIT
```

### Verification Against University Test Cases (TC01 – TC20)
All 20 test cases specified in the project guidelines have been executed and documented in detail in:
[`docs/TEST_CASES_REPORT.md`](docs/TEST_CASES_REPORT.md)

---

## 14. UI Preview & Page Structure

```
frontend/
├── index.html              # Page 1: Hero, search, categories, How It Works, footer
├── places.html             # Page 2: Explore catalog, real-time search, sorting, reset filters
├── place-details.html      # Page 3: Hero photo, description, travel tips, embedded map
├── itinerary.html          # Page 4: 4-step smart planner, mode toggle, timeline, PDF print
├── about.html              # Page 5: Academic profile, problem statement, objectives, tech stack
├── contact.html            # Page 6: Public contact form with live client validation
├── login.html              # Secure login / register with BCrypt demo credentials
├── admin-dashboard.html    # Admin Overview: 4 core metric cards & category breakdown
├── manage-attractions.html # Admin CRUD: Add, edit, delete attractions modal
└── manage-messages.html    # Admin Inbox: Tourist inquiry review & status management
```

---

## 15. Known Limitations & Scope Boundaries
- **Project Scope Boundaries:** In strict accordance with the approved university project proposal for ITE2953, TravelMate is scoped as a **tourist discovery and day itinerary planning tool**. Hotel room booking, flight/train reservations, commercial transport booking, and credit card payment gateways are outside the approved academic scope.
- **Deterministic Road Speed Modeling:** Travel times are computed using practical Sri Lankan road network assumptions (35 km/h for cars, 40 km/h for motorcycles, $1.25\times$ winding factor). Real-time satellite traffic predictions are not simulated.

---

## 16. Future Improvements
1. **Interactive Leaflet / OpenStreetMap Route Polyline:** Drawing visual GPS road polylines directly on the timeline map container.
2. **Multi-Day Regional Circuit Extension:** Expanding beyond the 25km Atulugama radius to support 2-day and 3-day Southern Expressway circuits (Galle, Matara).
3. **Multilingual Localization:** Adding Sinhala and Tamil language translations for domestic day-trippers.

---

### Examiner Demonstration Script & StarUML Specifications
- **StarUML Diagram Specifications (5 Diagrams):** [`docs/STARUML_SPECIFICATIONS.md`](docs/STARUML_SPECIFICATIONS.md)
- **University Examination Walkthrough Script:** [`docs/DEMONSTRATION_SCRIPT.md`](docs/DEMONSTRATION_SCRIPT.md)
- **Formal Test Cases Execution Report:** [`docs/TEST_CASES_REPORT.md`](docs/TEST_CASES_REPORT.md)
