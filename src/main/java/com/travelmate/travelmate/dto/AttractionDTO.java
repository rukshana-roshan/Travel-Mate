package com.travelmate.travelmate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class AttractionDTO {
    private Long id;

    @NotBlank(message = "Attraction name is required")
    private String name;

    @NotNull(message = "Category is required")
    private Long categoryId;

    private String categoryName;
    private String description;
    private String location;

    @NotNull(message = "Distance is required")
    private Double distanceKm;

    private Integer durationMinutes;
    private String openingHours;
    private BigDecimal entranceFee;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private String imageUrl;
    private String googleMapsUrl;
    private Double averageRating;

    public AttractionDTO() {
    }

    public AttractionDTO(Long id, String name, Long categoryId, String categoryName, String description,
                         String location, Double distanceKm, Integer durationMinutes, String openingHours,
                         BigDecimal entranceFee, Double latitude, Double longitude, String imageUrl,
                         String googleMapsUrl, Double averageRating) {
        this.id = id;
        this.name = name;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.description = description;
        this.location = location;
        this.distanceKm = distanceKm;
        this.durationMinutes = durationMinutes;
        this.openingHours = openingHours;
        this.entranceFee = entranceFee;
        this.latitude = latitude;
        this.longitude = longitude;
        this.imageUrl = imageUrl;
        this.googleMapsUrl = googleMapsUrl;
        this.averageRating = averageRating;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public Integer getVisitDurationMinutes() { return durationMinutes; }
    public void setVisitDurationMinutes(Integer visitDurationMinutes) { this.durationMinutes = visitDurationMinutes; }

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

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private Long categoryId;
        private String categoryName;
        private String description;
        private String location;
        private Double distanceKm;
        private Integer durationMinutes;
        private String openingHours;
        private BigDecimal entranceFee;
        private Double latitude;
        private Double longitude;
        private String imageUrl;
        private String googleMapsUrl;
        private Double averageRating;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder categoryId(Long categoryId) { this.categoryId = categoryId; return this; }
        public Builder categoryName(String categoryName) { this.categoryName = categoryName; return this; }
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

        public AttractionDTO build() {
            return new AttractionDTO(id, name, categoryId, categoryName, description, location,
                    distanceKm, durationMinutes, openingHours, entranceFee, latitude, longitude,
                    imageUrl, googleMapsUrl, averageRating);
        }
    }
}
