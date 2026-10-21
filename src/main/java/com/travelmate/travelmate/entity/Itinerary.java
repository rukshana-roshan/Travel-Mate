package com.travelmate.travelmate.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * A one-day itinerary plan created by a tourist user or guest.
 */
@Entity
@Table(name = "itinerary")
public class Itinerary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @Column(name = "plan_name", length = 150)
    private String planName;

    @Column(name = "visit_date")
    private LocalDate visitDate;

    @Column(name = "start_time", length = 10)
    private String startTime;

    @Column(name = "end_time", length = 10)
    private String endTime;

    @Column(name = "travel_mode", length = 20)
    private String travelMode; // "car" or "motorcycle"

    @Column(name = "total_distance_km")
    private Double totalDistanceKm;

    @Column(name = "total_duration_minutes")
    private Integer totalDurationMinutes;

    @OneToMany(mappedBy = "itinerary", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItineraryItem> items = new ArrayList<>();

    @Column(updatable = false)
    private LocalDateTime createdAt;

    public Itinerary() {
    }

    public Itinerary(Long id, User user, String planName, LocalDate visitDate, String startTime,
                     String endTime, String travelMode, Double totalDistanceKm,
                     Integer totalDurationMinutes, List<ItineraryItem> items, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.planName = planName;
        this.visitDate = visitDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.travelMode = travelMode;
        this.totalDistanceKm = totalDistanceKm;
        this.totalDurationMinutes = totalDurationMinutes;
        if (items != null) {
            this.items = items;
        }
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }

    public LocalDate getVisitDate() { return visitDate; }
    public void setVisitDate(LocalDate visitDate) { this.visitDate = visitDate; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public String getTravelMode() { return travelMode; }
    public void setTravelMode(String travelMode) { this.travelMode = travelMode; }

    public Double getTotalDistanceKm() { return totalDistanceKm; }
    public void setTotalDistanceKm(Double totalDistanceKm) { this.totalDistanceKm = totalDistanceKm; }

    public Integer getTotalDurationMinutes() { return totalDurationMinutes; }
    public void setTotalDurationMinutes(Integer totalDurationMinutes) { this.totalDurationMinutes = totalDurationMinutes; }

    public List<ItineraryItem> getItems() { return items; }
    public void setItems(List<ItineraryItem> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private User user;
        private String planName;
        private LocalDate visitDate;
        private String startTime;
        private String endTime;
        private String travelMode;
        private Double totalDistanceKm;
        private Integer totalDurationMinutes;
        private List<ItineraryItem> items = new ArrayList<>();
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder planName(String planName) { this.planName = planName; return this; }
        public Builder visitDate(LocalDate visitDate) { this.visitDate = visitDate; return this; }
        public Builder startTime(String startTime) { this.startTime = startTime; return this; }
        public Builder endTime(String endTime) { this.endTime = endTime; return this; }
        public Builder travelMode(String travelMode) { this.travelMode = travelMode; return this; }
        public Builder totalDistanceKm(Double totalDistanceKm) { this.totalDistanceKm = totalDistanceKm; return this; }
        public Builder totalDurationMinutes(Integer totalDurationMinutes) { this.totalDurationMinutes = totalDurationMinutes; return this; }
        public Builder items(List<ItineraryItem> items) { this.items = items; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Itinerary build() {
            return new Itinerary(id, user, planName, visitDate, startTime, endTime, travelMode,
                    totalDistanceKm, totalDurationMinutes, items, createdAt);
        }
    }
}
