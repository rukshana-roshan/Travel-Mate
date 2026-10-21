# Travel Mate — Smart Tourist Day-Visit Planner
### Final Project Report

---

## 1. Introduction

Travel Mate is a full-stack web application that helps a tourist discover attractions within 25km of Atulugama, Sri Lanka, and assemble them into a timed one-day visiting plan. The system has two user roles — **Tourist** (browse, favorite, review, and plan) and **Administrator** (manage the attraction/category catalog and moderate reviews).

## 2. Objectives

- Let a visitor search and filter attractions by category, distance, fee, and keyword.
- Surface the practical details a day-trip actually needs: distance, visiting duration, opening hours, entrance fee, and a map link.
- Let a signed-in user save favorites and build a day plan with an auto-generated timeline (arrival/departure times per stop, accounting for travel buffer between stops).
- Give an administrator full CRUD control over attractions and categories, plus review moderation, without touching the database directly.
- Ship as a decoupled REST API + static frontend, deployable independently (API on Render, frontend on GitHub Pages).

## 3. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript, Bootstrap 5, Bootstrap Icons |
| Backend | Java 17, Spring Boot 3.2 (Web, Data JPA, Validation) |
| Database | MySQL 8 (H2 in-memory for the automated test suite) |
| Auth | BCrypt password hashing (Spring Security Crypto) |
| Build / CI | Maven, GitHub Actions |
| Deployment | Docker + Render (backend), GitHub Pages (frontend) |

## 4. System Architecture

The backend follows a standard layered architecture:

```
Controller  →  Service (interface)  →  ServiceImpl  →  Repository (Spring Data JPA)  →  MySQL
     ↑                                                                    ↓
   DTOs  ←──────────────────  entities never leave the service layer  ───┘
```

- **Controllers** are thin — they translate HTTP requests into service calls and wrap results in a consistent `ApiResponse<T>` envelope (`success`, `message`, `data`, `timestamp`).
- **DTOs** decouple the wire format from the JPA entities, so entity relationships (e.g. `Attraction.category`) never get serialized directly.
- **GlobalExceptionHandler** turns domain exceptions (`ResourceNotFoundException`, `DuplicateResourceException`, `InvalidCredentialsException`, validation failures) into predictable JSON error responses with the correct HTTP status.
- The frontend talks to this API through a single `js/api.js` abstraction (`TM_API`), so every page calls the same handful of methods regardless of which HTML page it's on.

## 5. Database Design

Seven tables, defined in `src/main/resources/sql/schema_and_seed_data.sql`:

| Table | Purpose | Key relationships |
|---|---|---|
| `users` | Tourist & admin accounts | — |
| `categories` | Attraction categories (Beach, Historical, Adventure, Nature) | — |
| `attractions` | The 10 seeded points of interest | `category_id → categories.id` |
| `itinerary` | A saved day plan | `user_id → users.id` |
| `itinerary_items` | Ordered stops within a plan | `itinerary_id → itinerary.id`, `attraction_id → attractions.id` |
| `favorites` | A user's saved attractions | `user_id → users.id`, `attraction_id → attractions.id`, unique per pair |
| `reviews` | Star rating + comment per attraction | `user_id → users.id`, `attraction_id → attractions.id` |

All foreign keys cascade on delete where appropriate (e.g. deleting a category deletes its attractions; deleting a user deletes their favorites/reviews/itineraries), keeping the data consistent without extra application-level cleanup code.

## 6. Key Features Delivered

**Tourist-facing:** landing page with hero search, category browsing, keyword + category + sort filtering, attraction detail pages with an image gallery and Google Maps link, favorites (synced to the account once signed in), a drag-free reorderable itinerary builder that generates a timed schedule, dark/light theme, toast notifications, and skeleton loaders while data streams in.

**Admin-facing:** a login-gated dashboard with attraction/category counts and a category breakdown chart, full CRUD for attractions and categories, and a review moderation table.

## 7. API Summary

All endpoints are under `/api`. Full table in `README.md`; highlights:

- `GET/POST/PUT/DELETE /api/attractions[/{id}]`
- `GET/POST/PUT/DELETE /api/categories[/{id}]`
- `POST /api/login`, `POST /api/register`
- `POST /api/favorites`, `DELETE /api/favorites/{userId}/{attractionId}`, `GET /api/favorites/user/{userId}`
- `POST /api/itinerary`, `GET /api/itinerary/{id}`, `GET /api/itinerary/user/{userId}`
- `POST /api/reviews`, `GET /api/reviews`, `GET /api/reviews/attraction/{id}`, `DELETE /api/reviews/{id}`

## 8. Testing Summary (Phase 5)

Two layers of automated tests, run with `mvn test` (or `mvn verify`, which also runs in CI):

- **Unit tests** (`AttractionServiceImplTest`, `UserServiceImplTest`) — mock the repository layer with Mockito, so they run in milliseconds and verify business logic in isolation: DTO↔entity mapping, not-found handling, password hashing, and login/register edge cases.
- **Integration tests** (`AttractionControllerIT`, `AuthControllerIT`) — boot the full Spring context against an in-memory H2 database and drive real HTTP requests through MockMvc, catching wiring issues a unit test can't see (wrong route, wrong JSON shape, validation not actually firing).

One integration test is a direct **regression test** for a real bug found and fixed during Phase 4: the seed SQL originally shipped with a placeholder BCrypt hash (`$2a$10$replaceWithRealBCryptHash`) instead of a real hash of `admin123`, which meant the documented admin login would fail on any freshly seeded database. `AuthControllerIT.login_succeedsWithSeededAdminCredentials` now protects against that regressing.

### Manual QA pass (Phase 5)
- Verified favorites toggle from a guest session, then confirmed they merge into the account on login.
- Verified a guest can generate and view a full itinerary timeline without an account; verified it persists once signed in.
- Verified the "Write a review" flow redirects a signed-out visitor to `login.html` rather than submitting a request the backend would reject.
- Verified admin CRUD (create/edit/delete attraction and category) reflects immediately in the Tourist-facing pages.

## 9. Deployment

- **Backend**: containerized with the included `Dockerfile`, deployable to Render via `render.yaml` (or any Docker host). Configuration is entirely environment-variable driven in `application-prod.properties` — no secrets in source control.
- **Frontend**: static files in `frontend/`, published via the `frontend-deploy.yml` GitHub Actions workflow to GitHub Pages. `frontend/js/config.js` auto-detects whether it's running locally or deployed and points at the right API base URL accordingly.

Full step-by-step instructions are in the repository `README.md`.

## 10. Known Limitations & Future Enhancements

- Auth issues a placeholder UUID token rather than a signed JWT with expiry — acceptable for a coursework demo, not production-grade.
- No image upload; attraction photos are entered as URLs.
- Favorites/itinerary sync is last-write-wins with no conflict resolution across multiple open tabs or devices.
- Future work: JWT-based auth with refresh tokens, image upload to object storage, pagination on the attractions list, and a proper distance calculation (currently a static seeded value rather than computed from live coordinates).

## 11. Conclusion

Travel Mate was built and delivered in five reviewable phases — schema/scaffolding, backend REST API, frontend UI, frontend↔backend integration, and finally testing/deployment — with each phase runnable and checkable before moving to the next. The result is a working, testable, deployable full-stack application that satisfies the original project brief.
