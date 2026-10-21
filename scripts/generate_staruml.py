import json
import os
import uuid

def gen_id():
    # StarUML compatible 22-char base64-like ID
    return "AAAAAAF" + uuid.uuid4().hex[:15]

def create_staruml_project():
    proj_id = "AAAAAAFF+h6SjaM2Hec="
    model_id = "AAAAAAFF+qBWK6M3Z8Y="
    
    # 1. Actors
    actor_tourist_id = gen_id()
    actor_admin_id = gen_id()
    
    # 2. Use Cases
    uc_browse_id = gen_id()
    uc_search_id = gen_id()
    uc_filter_id = gen_id()
    uc_details_id = gen_id()
    uc_shortlist_id = gen_id()
    uc_generate_id = gen_id()
    uc_save_id = gen_id()
    uc_map_id = gen_id()
    uc_contact_id = gen_id()
    
    uc_login_id = gen_id()
    uc_crud_dest_id = gen_id()
    uc_crud_cat_id = gen_id()
    uc_review_inq_id = gen_id()

    # Build Elements
    owned_elements = [
        # Actor: Tourist
        {
            "_type": "UMLActor",
            "_id": actor_tourist_id,
            "_parent": { "$ref": model_id },
            "name": "Tourist"
        },
        # Actor: Administrator
        {
            "_type": "UMLActor",
            "_id": actor_admin_id,
            "_parent": { "$ref": model_id },
            "name": "Administrator"
        },
        # Tourist Use Cases
        { "_type": "UMLUseCase", "_id": uc_browse_id, "_parent": { "$ref": model_id }, "name": "Browse Attractions" },
        { "_type": "UMLUseCase", "_id": uc_search_id, "_parent": { "$ref": model_id }, "name": "Search Attractions by Keyword" },
        { "_type": "UMLUseCase", "_id": uc_filter_id, "_parent": { "$ref": model_id }, "name": "Filter by Category" },
        { "_type": "UMLUseCase", "_id": uc_details_id, "_parent": { "$ref": model_id }, "name": "View Destination Details & Tips" },
        { "_type": "UMLUseCase", "_id": uc_shortlist_id, "_parent": { "$ref": model_id }, "name": "Select Destinations (Shortlist)" },
        { "_type": "UMLUseCase", "_id": uc_generate_id, "_parent": { "$ref": model_id }, "name": "Generate Smart Day Itinerary" },
        { "_type": "UMLUseCase", "_id": uc_save_id, "_parent": { "$ref": model_id }, "name": "Save / Export Itinerary" },
        { "_type": "UMLUseCase", "_id": uc_map_id, "_parent": { "$ref": model_id }, "name": "View Google Maps Multi-Stop Route" },
        { "_type": "UMLUseCase", "_id": uc_contact_id, "_parent": { "$ref": model_id }, "name": "Submit Contact Inquiry" },
        
        # Admin Use Cases
        { "_type": "UMLUseCase", "_id": uc_login_id, "_parent": { "$ref": model_id }, "name": "Admin Authentication (BCrypt)" },
        { "_type": "UMLUseCase", "_id": uc_crud_dest_id, "_parent": { "$ref": model_id }, "name": "Manage Destinations (CRUD)" },
        { "_type": "UMLUseCase", "_id": uc_crud_cat_id, "_parent": { "$ref": model_id }, "name": "Manage Categories (CRUD)" },
        { "_type": "UMLUseCase", "_id": uc_review_inq_id, "_parent": { "$ref": model_id }, "name": "Review Tourist Inquiries" },

        # Use Case Diagram
        {
            "_type": "UMLUseCaseDiagram",
            "_id": gen_id(),
            "_parent": { "$ref": model_id },
            "name": "Use Case Diagram — TravelMate",
            "ownedViews": []
        },

        # Activity Diagram (One-Day Itinerary Planning Process)
        {
            "_type": "UMLActivity",
            "_id": gen_id(),
            "_parent": { "$ref": model_id },
            "name": "One-Day Itinerary Planning Activity",
            "nodes": [
                { "_type": "UMLInitialNode", "_id": gen_id(), "name": "Open Planner Interface" },
                { "_type": "UMLAction", "_id": gen_id(), "name": "Select Attractions from Catalog" },
                { "_type": "UMLDecisionNode", "_id": gen_id(), "name": "Validate Destination Count >= 1" },
                { "_type": "UMLAction", "_id": gen_id(), "name": "Input Trip Preferences (Start Time, Finish Time, Vehicle Mode)" },
                { "_type": "UMLAction", "_id": gen_id(), "name": "Trigger Nearest-Neighbour Calculation Engine" },
                { "_type": "UMLAction", "_id": gen_id(), "name": "Compute Road Distance Matrix (Haversine x 1.25 Winding Factor)" },
                { "_type": "UMLAction", "_id": gen_id(), "name": "Chronologically Sequence Stops & Travel Buffers" },
                { "_type": "UMLDecisionNode", "_id": gen_id(), "name": "Check Midday Lunch Break (12:30 - 13:30)" },
                { "_type": "UMLDecisionNode", "_id": gen_id(), "name": "Evaluate Available Finish Time Threshold" },
                { "_type": "UMLAction", "_id": gen_id(), "name": "Render Interactive Timeline & Google Maps Circuit" },
                { "_type": "UMLActivityFinalNode", "_id": gen_id(), "name": "Day Plan Finalized / Export PDF" }
            ],
            "ownedElements": [
                {
                    "_type": "UMLActivityDiagram",
                    "_id": gen_id(),
                    "name": "Activity Diagram — Itinerary Planning"
                }
            ]
        },

        # Sequence Diagram (POST /api/itineraries/generate)
        {
            "_type": "UMLCollaboration",
            "_id": gen_id(),
            "_parent": { "$ref": model_id },
            "name": "Itinerary Generation Collaboration",
            "ownedElements": [
                {
                    "_type": "UMLInteraction",
                    "_id": gen_id(),
                    "name": "Generate Itinerary Interaction",
                    "lifelines": [
                        { "_type": "UMLLifeline", "_id": gen_id(), "name": "Tourist: Actor" },
                        { "_type": "UMLLifeline", "_id": gen_id(), "name": "itinerary.js: Client UI" },
                        { "_type": "UMLLifeline", "_id": gen_id(), "name": "ItineraryController: REST API" },
                        { "_type": "UMLLifeline", "_id": gen_id(), "name": "ItineraryService: Nearest-Neighbour Engine" },
                        { "_type": "UMLLifeline", "_id": gen_id(), "name": "AttractionRepository: JPA Data Layer" },
                        { "_type": "UMLLifeline", "_id": gen_id(), "name": "MySQL: Relational DB" }
                    ],
                    "ownedElements": [
                        {
                            "_type": "UMLSequenceDiagram",
                            "_id": gen_id(),
                            "name": "Sequence Diagram — Itinerary Generation"
                        }
                    ]
                }
            ]
        },

        # Class Diagram (Core Entities, DTOs, Controllers)
        {
            "_type": "UMLClassDiagram",
            "_id": gen_id(),
            "_parent": { "$ref": model_id },
            "name": "Class Diagram — TravelMate System",
            "ownedViews": []
        },
        # UML Classes
        {
            "_type": "UMLClass",
            "_id": gen_id(),
            "_parent": { "$ref": model_id },
            "name": "User",
            "attributes": [
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "id", "type": "Long", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "fullName", "type": "String", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "email", "type": "String", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "password", "type": "String", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "role", "type": "Role", "visibility": "private" }
            ],
            "operations": [
                { "_type": "UMLOperation", "_id": gen_id(), "name": "getId", "visibility": "public" },
                { "_type": "UMLOperation", "_id": gen_id(), "name": "getEmail", "visibility": "public" }
            ]
        },
        {
            "_type": "UMLClass",
            "_id": gen_id(),
            "_parent": { "$ref": model_id },
            "name": "Category",
            "attributes": [
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "id", "type": "Long", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "name", "type": "String", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "icon", "type": "String", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "description", "type": "String", "visibility": "private" }
            ]
        },
        {
            "_type": "UMLClass",
            "_id": gen_id(),
            "_parent": { "$ref": model_id },
            "name": "Attraction",
            "attributes": [
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "id", "type": "Long", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "name", "type": "String", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "category", "type": "Category", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "location", "type": "String", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "distanceKm", "type": "Double", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "durationMinutes", "type": "Integer", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "openingHours", "type": "String", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "entranceFee", "type": "BigDecimal", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "latitude", "type": "Double", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "longitude", "type": "Double", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "averageRating", "type": "Double", "visibility": "private" }
            ]
        },
        {
            "_type": "UMLClass",
            "_id": gen_id(),
            "_parent": { "$ref": model_id },
            "name": "Itinerary",
            "attributes": [
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "id", "type": "Long", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "user", "type": "User", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "planName", "type": "String", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "visitDate", "type": "LocalDate", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "startTime", "type": "String", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "endTime", "type": "String", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "travelMode", "type": "String", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "totalDistanceKm", "type": "Double", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "items", "type": "List<ItineraryItem>", "visibility": "private" }
            ]
        },
        {
            "_type": "UMLClass",
            "_id": gen_id(),
            "_parent": { "$ref": model_id },
            "name": "ItineraryItem",
            "attributes": [
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "id", "type": "Long", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "itinerary", "type": "Itinerary", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "attraction", "type": "Attraction", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "visitOrder", "type": "Integer", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "arrivalTime", "type": "String", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "departureTime", "type": "String", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "isLunchBreak", "type": "Boolean", "visibility": "private" }
            ]
        },
        {
            "_type": "UMLClass",
            "_id": gen_id(),
            "_parent": { "$ref": model_id },
            "name": "ContactMessage",
            "attributes": [
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "id", "type": "Long", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "name", "type": "String", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "email", "type": "String", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "subject", "type": "String", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "message", "type": "String", "visibility": "private" },
                { "_type": "UMLAttribute", "_id": gen_id(), "name": "isRead", "type": "Boolean", "visibility": "private" }
            ]
        },

        # ER Data Model (ER/EER Diagram)
        {
            "_type": "ERDDataModel",
            "_id": gen_id(),
            "_parent": { "$ref": model_id },
            "name": "TravelMate Relational Data Model",
            "ownedElements": [
                {
                    "_type": "ERDDiagram",
                    "_id": gen_id(),
                    "name": "ER/EER Diagram — MySQL Schema",
                    "ownedViews": []
                },
                # Entities
                {
                    "_type": "ERDEntity",
                    "_id": gen_id(),
                    "name": "USERS",
                    "columns": [
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "id", "type": "BIGINT", "primaryKey": True },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "full_name", "type": "VARCHAR(100)" },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "email", "type": "VARCHAR(150)", "unique": True },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "password", "type": "VARCHAR(255)" },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "role", "type": "VARCHAR(20)" }
                    ]
                },
                {
                    "_type": "ERDEntity",
                    "_id": gen_id(),
                    "name": "CATEGORIES",
                    "columns": [
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "id", "type": "BIGINT", "primaryKey": True },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "name", "type": "VARCHAR(100)", "unique": True },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "icon", "type": "VARCHAR(50)" },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "description", "type": "TEXT" }
                    ]
                },
                {
                    "_type": "ERDEntity",
                    "_id": gen_id(),
                    "name": "ATTRACTIONS",
                    "columns": [
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "id", "type": "BIGINT", "primaryKey": True },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "name", "type": "VARCHAR(150)" },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "category_id", "type": "BIGINT", "foreignKey": True },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "distance_km", "type": "DOUBLE" },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "duration_minutes", "type": "INT" },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "entrance_fee", "type": "DECIMAL(10,2)" },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "latitude", "type": "DOUBLE" },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "longitude", "type": "DOUBLE" }
                    ]
                },
                {
                    "_type": "ERDEntity",
                    "_id": gen_id(),
                    "name": "ITINERARY",
                    "columns": [
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "id", "type": "BIGINT", "primaryKey": True },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "user_id", "type": "BIGINT", "foreignKey": True },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "plan_name", "type": "VARCHAR(150)" },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "visit_date", "type": "DATE" },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "start_time", "type": "VARCHAR(10)" },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "end_time", "type": "VARCHAR(10)" },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "travel_mode", "type": "VARCHAR(20)" }
                    ]
                },
                {
                    "_type": "ERDEntity",
                    "_id": gen_id(),
                    "name": "ITINERARY_ITEMS",
                    "columns": [
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "id", "type": "BIGINT", "primaryKey": True },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "itinerary_id", "type": "BIGINT", "foreignKey": True },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "attraction_id", "type": "BIGINT", "foreignKey": True },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "visit_order", "type": "INT" },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "arrival_time", "type": "VARCHAR(10)" },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "departure_time", "type": "VARCHAR(10)" },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "is_lunch_break", "type": "BOOLEAN" }
                    ]
                },
                {
                    "_type": "ERDEntity",
                    "_id": gen_id(),
                    "name": "CONTACT_MESSAGES",
                    "columns": [
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "id", "type": "BIGINT", "primaryKey": True },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "name", "type": "VARCHAR(100)" },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "email", "type": "VARCHAR(150)" },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "message", "type": "TEXT" },
                        { "_type": "ERDColumn", "_id": gen_id(), "name": "is_read", "type": "BOOLEAN" }
                    ]
                }
            ]
        }
    ]

    project = {
        "_type": "Project",
        "_id": proj_id,
        "name": "TravelMate",
        "ownedElements": [
            {
                "_type": "UMLModel",
                "_id": model_id,
                "_parent": { "$ref": proj_id },
                "name": "TravelMate System Architecture Models",
                "ownedElements": owned_elements
            }
        ]
    }

    out_file = os.path.abspath("docs/TravelMate_Design_Models.mdj")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(project, f, indent=2)
    print(f"StarUML project file created at: {out_file}")

if __name__ == "__main__":
    create_staruml_project()
