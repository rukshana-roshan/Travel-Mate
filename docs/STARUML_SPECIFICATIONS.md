# StarUML System Design Specifications — TravelMate

**Project:** TravelMate – Smart Tourist Day-Visit Planner  
**Course Module:** ITE2953 – Software Project  
**Institution:** University of Moratuwa, Sri Lanka  
**Student:** Rukshana Roshan (Registration No: E2410132)  

---

## StarUML Authoring Guide

> [!NOTE]
> To create these diagrams in **StarUML** (v5.x / v6.x):
> 1. Launch StarUML and create a new project: `File` &rarr; `New From Template` &rarr; `UML Minimal`.
> 2. Right-click on the Model Explorer root and select `Add Diagram` &rarr; `<Diagram Type>` (Use Case, Activity, Sequence, Class, or ERD).
> 3. Use the toolbox elements detailed below to draw actors, classes, entities, lifelines, and messages.
> 4. Below each diagram specification, we provide standard **Mermaid diagram code** that renders natively in GitHub, markdown readers, and StarUML's markdown preview plugin.

---

## 1. Use Case Diagram

### StarUML Modeling Elements
- **System Boundary:** `TravelMate Smart Tourist Day-Visit Planner`
- **Primary Actors:**
  - `Tourist` (End-user planning day trips)
  - `Administrator` (Authorized site manager)
- **Use Cases:**
  - **Tourist:**
    - `Browse Attractions`
    - `Search Attractions`
    - `Filter Attractions by Category`
    - `View Attraction Details`
    - `Select Destinations` (Shortlist)
    - `Generate Day Itinerary` (Deterministic nearest-neighbour algorithm)
    - `Save Itinerary` (Requires Tourist Authentication, extends Generate Itinerary)
    - `View Google Maps Route / Directions`
    - `Submit Contact Inquiry`
  - **Administrator:**
    - `Authenticate / Admin Login`
    - `Manage Attractions` (`<<include>>` Add Attraction, Update Attraction, Delete Attraction)
    - `Manage Categories`
    - `Review Tourist Inquiries`

```mermaid
flowchart LR
  subgraph TravelMate System
    UC1((Browse Attractions))
    UC2((Search Attractions))
    UC3((Filter by Category))
    UC4((View Attraction Details))
    UC5((Select Destinations))
    UC6((Generate Day Itinerary))
    UC7((Save Itinerary))
    UC8((View Map Directions))
    UC9((Submit Contact Inquiry))
    
    UC10((Admin Login))
    UC11((Add Attraction))
    UC12((Update Attraction))
    UC13((Delete Attraction))
    UC14((Review Tourist Inquiries))
  end

  Tourist([fa:fa-user Tourist]) --> UC1
  Tourist --> UC2
  Tourist --> UC3
  Tourist --> UC4
  Tourist --> UC5
  Tourist --> UC6
  Tourist --> UC7
  Tourist --> UC8
  Tourist --> UC9

  Admin([fa:fa-user-shield Administrator]) --> UC10
  Admin --> UC11
  Admin --> UC12
  Admin --> UC13
  Admin --> UC14

  UC7 -.->|<<extend>>| UC6
  UC4 -.->|<<extend>>| UC1
```

---

## 2. Activity Diagram: One-Day Itinerary Planning Process

### StarUML Activity Nodes
1. **Initial Node:** Tourist opens Planner interface.
2. **Action 1:** Browse & Shortlist Attractions from Explore catalog.
3. **Decision 1:** Shortlist has at least 1 destination? If No &rarr; prompt user to select destinations.
4. **Action 2:** Input trip preferences (Start Time, Finish Time, Travel Mode: Car vs Motorcycle).
5. **Action 3:** Click "Generate One-Day Itinerary" button.
6. **Action 4:** Engine queries coordinates and visiting durations from repository.
7. **Action 5:** Calculate road distances via Haversine $\times$ 1.25 road-winding multiplier.
8. **Action 6:** Apply Nearest-Neighbour sequence starting from Atulugama (`6.7022, 80.0528`).
9. **Decision 2:** Cumulative arrival + visit fits within available finish time?
   - **Yes:** Schedule destination node on active timeline.
   - **No:** Append to overflow advisory list.
10. **Action 7:** Check if journey spans 12:30 PM - 1:30 PM; insert lunch break slot.
11. **Action 8:** Render clock-synchronized vertical timeline, summary metrics, and Google Maps route.
12. **Decision 3:** User wants to modify or save?
   - **Modify:** Reorder stops or change time preferences &rarr; re-generate.
   - **Save:** Authenticate and persist to MySQL database.
   - **Print:** Export PDF / Print schedule.
13. **Final Activity Node:** Day plan finalized.

```mermaid
stateDiagram-v2
  [*] --> BrowseCatalog
  BrowseCatalog --> SelectStops: Tourist selects destinations
  SelectStops --> ValidateSelection
  
  state ValidateSelection <<choice>>
  ValidateSelection --> SelectStops: Shortlist count == 0
  ValidateSelection --> EnterPreferences: Shortlist count >= 1

  EnterPreferences --> RequestGeneration: Choose Start/End Time & Car/Moto Mode
  RequestGeneration --> FetchGeoData: POST /api/itineraries/generate
  FetchGeoData --> ComputeMatrix: Haversine distance * 1.25 winding factor
  ComputeMatrix --> NearestNeighbour: Sort stops nearest to Atulugama

  state CheckSchedule <<choice>>
  NearestNeighbour --> CheckSchedule: Evaluate arrival + visit vs EndTime
  CheckSchedule --> AddToTimeline: Within EndTime
  CheckSchedule --> FlagOverflow: Exceeds EndTime

  AddToTimeline --> CheckLunchBreak: Spans 12:30 PM - 1:30 PM?
  FlagOverflow --> CheckLunchBreak
  CheckLunchBreak --> RenderTimeline: Display interactive schedule

  state UserDecision <<choice>>
  RenderTimeline --> UserDecision: Review generated itinerary
  UserDecision --> EnterPreferences: Modify settings & regenerate
  UserDecision --> SaveDatabase: Persist to account
  UserDecision --> PrintPDF: Export / Print plan
  
  SaveDatabase --> [*]
  PrintPDF --> [*]
```

---

## 3. Sequence Diagram: Day Itinerary Generation

### Participating Lifelines
1. `Tourist`: User interacting with the browser.
2. `Frontend (itinerary.js)`: Browser client UI.
3. `ItineraryController`: Spring Boot REST Controller endpoint (`POST /api/itineraries/generate`).
4. `ItineraryService`: Service layer implementing the deterministic nearest-neighbour algorithm.
5. `AttractionRepository`: Spring Data JPA data access layer.
6. `MySQL Database`: Persistent relational database.

```mermaid
sequenceDiagram
  autonumber
  actor Tourist
  participant UI as Frontend (itinerary.js)
  participant Controller as ItineraryController
  participant Service as ItineraryService
  participant Repo as AttractionRepository
  participant DB as MySQL Database

  Tourist->>UI: Selects 3 attractions & inputs preferences (Start: 08:30 AM, End: 06:30 PM, Mode: Car)
  Tourist->>UI: Clicks "Generate Smart One-Day Itinerary"
  UI->>Controller: POST /api/itineraries/generate (attractionIds, startTime, endTime, travelMode)
  Controller->>Service: generateItinerary(request)
  Service->>Repo: findAllById([1, 4, 8])
  Repo->>DB: SELECT * FROM attractions WHERE id IN (1, 4, 8)
  DB-->>Repo: List<Attraction> (Coordinates, Durations, Fees)
  Repo-->>Service: List<Attraction>
  
  Note over Service: 1. Set Origin = Atulugama (6.7022, 80.0528)<br/>2. Sort by nearest-neighbour distance<br/>3. Compute clock arrival & departure<br/>4. Validate against End Time limit<br/>5. Insert Lunch Break if spans midday
  
  Service-->>Controller: ItineraryDTO (items, metrics, overflowAttractions)
  Controller-->>UI: 200 OK (ApiResponse<ItineraryDTO>)
  UI-->>Tourist: Renders interactive vertical timeline, metrics, and Google Maps multi-stop link
```

---

## 4. Class Diagram

### Implemented Architectural Classes

```mermaid
classDiagram
  direction TB

  class User {
    -Long id
    -String fullName
    -String email
    -String password
    -Role role
    +getId() Long
    +getEmail() String
    +getRole() Role
  }

  class Category {
    -Long id
    -String name
    -String icon
    -String description
    +getId() Long
    +getName() String
  }

  class Attraction {
    -Long id
    -String name
    -Category category
    -String description
    -String location
    -Double distanceKm
    -Integer durationMinutes
    -String openingHours
    -BigDecimal entranceFee
    -Double latitude
    -Double longitude
    -String imageUrl
    -String googleMapsUrl
    -Double averageRating
    +getId() Long
    +getDurationMinutes() Integer
    +getCategory() Category
  }

  class Itinerary {
    -Long id
    -User user
    -String planName
    -LocalDate visitDate
    -String startTime
    -String endTime
    -String travelMode
    -Double totalDistanceKm
    -Integer totalDurationMinutes
    -List~ItineraryItem~ items
    +getId() Long
    +getItems() List
  }

  class ItineraryItem {
    -Long id
    -Itinerary itinerary
    -Attraction attraction
    -Integer visitOrder
    -String arrivalTime
    -String departureTime
    -Integer visitDurationMinutes
    -Integer travelTimeToNextMinutes
    -Double distanceToNextKm
    -Boolean isLunchBreak
  }

  class ContactMessage {
    -Long id
    -String name
    -String email
    -String subject
    -String message
    -Boolean isRead
    -LocalDateTime createdAt
    +isRead() boolean
    +setIsRead(Boolean) void
  }

  class AttractionController {
    -AttractionService attractionService
    +getAll(Long, String) ApiResponse
    +getById(Long) ApiResponse
  }

  class ItineraryController {
    -ItineraryService itineraryService
    +generate(GenerateItineraryRequest) ApiResponse
    +save(ItineraryDTO) ApiResponse
    +getById(Long) ApiResponse
  }

  class ContactController {
    -ContactService contactService
    +submit(ContactMessageDTO) ApiResponse
    +getAll() ApiResponse
    +markAsRead(Long) ApiResponse
    +delete(Long) ApiResponse
  }

  class AdminController {
    -AttractionService attractionService
    -ContactService contactService
    +getDashboardStats() ApiResponse
    +createAttraction(AttractionDTO) ApiResponse
    +updateAttraction(Long, AttractionDTO) ApiResponse
    +deleteAttraction(Long) ApiResponse
  }

  User "1" --> "*" Itinerary : owns
  Category "1" --> "*" Attraction : classifies
  Itinerary "1" *-- "*" ItineraryItem : contains
  Attraction "1" <-- "*" ItineraryItem : references
  AttractionController ..> Attraction : manages
  ItineraryController ..> Itinerary : generates & persists
  ContactController ..> ContactMessage : processes
  AdminController ..> Attraction : CRUD
```

---

## 5. ER / EER Diagram (Entity Relationship Diagram)

### MySQL Relational Schema
Represents the normalized database schema created in `src/main/resources/sql/schema_and_seed_data.sql`.

```mermaid
erDiagram
    USERS ||--o{ ITINERARY : "creates"
    USERS ||--o{ FAVORITES : "bookmarks"
    USERS ||--o{ REVIEWS : "authors"
    
    CATEGORIES ||--|{ ATTRACTIONS : "classifies"
    
    ATTRACTIONS ||--o{ ITINERARY_ITEMS : "included_in"
    ATTRACTIONS ||--o{ FAVORITES : "favored_by"
    ATTRACTIONS ||--o{ REVIEWS : "receives"
    
    ITINERARY ||--|{ ITINERARY_ITEMS : "contains"

    USERS {
        bigint id PK
        varchar full_name
        varchar email UK
        varchar password
        varchar role
        datetime created_at
    }

    CATEGORIES {
        bigint id PK
        varchar name UK
        varchar icon
        varchar description
    }

    ATTRACTIONS {
        bigint id PK
        varchar name
        bigint category_id FK
        varchar description
        varchar location
        double distance_km
        int duration_minutes
        varchar opening_hours
        decimal entrance_fee
        double latitude
        double longitude
        varchar image_url
        varchar google_maps_url
        double average_rating
        datetime created_at
        datetime updated_at
    }

    ITINERARY {
        bigint id PK
        bigint user_id FK
        varchar plan_name
        date visit_date
        varchar start_time
        varchar end_time
        varchar travel_mode
        double total_distance_km
        int total_duration_minutes
        datetime created_at
    }

    ITINERARY_ITEMS {
        bigint id PK
        bigint itinerary_id FK
        bigint attraction_id FK
        int visit_order
        varchar arrival_time
        varchar departure_time
        int visit_duration_minutes
        int travel_time_to_next_minutes
        double distance_to_next_km
        boolean is_lunch_break
    }

    FAVORITES {
        bigint id PK
        bigint user_id FK
        bigint attraction_id FK
        datetime created_at
    }

    REVIEWS {
        bigint id PK
        bigint user_id FK
        bigint attraction_id FK
        int rating
        varchar comment
        datetime created_at
    }

    CONTACT_MESSAGES {
        bigint id PK
        varchar name
        varchar email
        varchar subject
        varchar message
        boolean is_read
        datetime created_at
    }
```
