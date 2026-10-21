package com.travelmate.travelmate.entity;

import jakarta.persistence.*;

/**
 * A single attraction stop within an itinerary, with its order and timeline schedule.
 */
@Entity
@Table(name = "itinerary_items")
public class ItineraryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "itinerary_id", nullable = false)
    private Itinerary itinerary;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attraction_id", nullable = false)
    private Attraction attraction;

    @Column(name = "visit_order")
    private Integer visitOrder; // sequence number within the day (1, 2, 3...)

    @Column(name = "planned_start_time", length = 20)
    private String plannedStartTime; // e.g. "09:30 AM"

    @Column(name = "planned_end_time", length = 20)
    private String plannedEndTime; // e.g. "11:00 AM"

    @Column(name = "travel_time_minutes")
    private Integer travelTimeMinutes;

    @Column(name = "distance_km")
    private Double distanceKm;

    public ItineraryItem() {
    }

    public ItineraryItem(Long id, Itinerary itinerary, Attraction attraction, Integer visitOrder,
                         String plannedStartTime, String plannedEndTime, Integer travelTimeMinutes, Double distanceKm) {
        this.id = id;
        this.itinerary = itinerary;
        this.attraction = attraction;
        this.visitOrder = visitOrder;
        this.plannedStartTime = plannedStartTime;
        this.plannedEndTime = plannedEndTime;
        this.travelTimeMinutes = travelTimeMinutes;
        this.distanceKm = distanceKm;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Itinerary getItinerary() { return itinerary; }
    public void setItinerary(Itinerary itinerary) { this.itinerary = itinerary; }

    public Attraction getAttraction() { return attraction; }
    public void setAttraction(Attraction attraction) { this.attraction = attraction; }

    public Integer getVisitOrder() { return visitOrder; }
    public void setVisitOrder(Integer visitOrder) { this.visitOrder = visitOrder; }

    public String getPlannedStartTime() { return plannedStartTime; }
    public void setPlannedStartTime(String plannedStartTime) { this.plannedStartTime = plannedStartTime; }

    public String getPlannedEndTime() { return plannedEndTime; }
    public void setPlannedEndTime(String plannedEndTime) { this.plannedEndTime = plannedEndTime; }

    public Integer getTravelTimeMinutes() { return travelTimeMinutes; }
    public void setTravelTimeMinutes(Integer travelTimeMinutes) { this.travelTimeMinutes = travelTimeMinutes; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Itinerary itinerary;
        private Attraction attraction;
        private Integer visitOrder;
        private String plannedStartTime;
        private String plannedEndTime;
        private Integer travelTimeMinutes;
        private Double distanceKm;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder itinerary(Itinerary itinerary) { this.itinerary = itinerary; return this; }
        public Builder attraction(Attraction attraction) { this.attraction = attraction; return this; }
        public Builder visitOrder(Integer visitOrder) { this.visitOrder = visitOrder; return this; }
        public Builder plannedStartTime(String plannedStartTime) { this.plannedStartTime = plannedStartTime; return this; }
        public Builder plannedEndTime(String plannedEndTime) { this.plannedEndTime = plannedEndTime; return this; }
        public Builder travelTimeMinutes(Integer travelTimeMinutes) { this.travelTimeMinutes = travelTimeMinutes; return this; }
        public Builder distanceKm(Double distanceKm) { this.distanceKm = distanceKm; return this; }

        public ItineraryItem build() {
            return new ItineraryItem(id, itinerary, attraction, visitOrder, plannedStartTime,
                    plannedEndTime, travelTimeMinutes, distanceKm);
        }
    }
}
