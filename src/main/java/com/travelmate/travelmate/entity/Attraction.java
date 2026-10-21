package com.travelmate.travelmate.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * A tourist attraction within 25km of Atulugama.
 */
@Entity
@Table(name = "attractions")
public class Attraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(length = 2000)
    private String description;

    @Column(length = 200)
    private String location;

    @NotNull
    @PositiveOrZero
    @Column(name = "distance_km", nullable = false)
    private Double distanceKm; // approximate distance from Atulugama in km

    @Column(name = "duration_minutes")
    private Integer durationMinutes; // recommended visiting duration

    @Column(name = "opening_hours", length = 100)
    private String openingHours;

    @Column(name = "entrance_fee")
    private BigDecimal entranceFee = BigDecimal.ZERO;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "google_maps_url", length = 500)
    private String googleMapsUrl;

    @Column(name = "average_rating")
    private Double averageRating = 0.0;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Attraction() {
    }

    public Attraction(Long id, String name, Category category, String description, String location,
                      Double distanceKm, Integer durationMinutes, String openingHours, BigDecimal entranceFee,
                      Double latitude, Double longitude, String imageUrl, String googleMapsUrl,
                      Double averageRating, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.location = location;
        this.distanceKm = distanceKm;
        this.durationMinutes = durationMinutes;
        this.openingHours = openingHours;
        this.entranceFee = (entranceFee != null) ? entranceFee : BigDecimal.ZERO;
        this.latitude = latitude;
        this.longitude = longitude;
        this.imageUrl = imageUrl;
        this.googleMapsUrl = googleMapsUrl;
        this.averageRating = (averageRating != null) ? averageRating : 0.0;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.googleMapsUrl == null || this.googleMapsUrl.isBlank()) {
            this.googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=" + this.latitude + "," + this.longitude;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getOpeningHours() { return openingHours; }
    public void setOpeningHours(String openingHours) { this.openingHours = openingHours; }

    public BigDecimal getEntranceFee() { return entranceFee; }
    public void setEntranceFee(BigDecimal entranceFee) { this.entranceFee = entranceFee; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getGoogleMapsUrl() { return googleMapsUrl; }
    public void setGoogleMapsUrl(String googleMapsUrl) { this.googleMapsUrl = googleMapsUrl; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private Category category;
        private String description;
        private String location;
        private Double distanceKm;
        private Integer durationMinutes;
        private String openingHours;
        private BigDecimal entranceFee = BigDecimal.ZERO;
        private Double latitude;
        private Double longitude;
        private String imageUrl;
        private String googleMapsUrl;
        private Double averageRating = 0.0;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder category(Category category) { this.category = category; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder location(String location) { this.location = location; return this; }
        public Builder distanceKm(Double distanceKm) { this.distanceKm = distanceKm; return this; }
        public Builder durationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; return this; }
        public Builder openingHours(String openingHours) { this.openingHours = openingHours; return this; }
        public Builder entranceFee(BigDecimal entranceFee) { this.entranceFee = entranceFee; return this; }
        public Builder latitude(Double latitude) { this.latitude = latitude; return this; }
        public Builder longitude(Double longitude) { this.longitude = longitude; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder googleMapsUrl(String googleMapsUrl) { this.googleMapsUrl = googleMapsUrl; return this; }
        public Builder averageRating(Double averageRating) { this.averageRating = averageRating; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Attraction build() {
            return new Attraction(id, name, category, description, location, distanceKm, durationMinutes,
                    openingHours, entranceFee, latitude, longitude, imageUrl, googleMapsUrl, averageRating,
                    createdAt, updatedAt);
        }
    }
}
