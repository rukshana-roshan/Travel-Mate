package com.travelmate.travelmate.dto;

public class ItineraryItemDTO {
    private Long id;
    private Long attractionId;
    private String attractionName;
    private String categoryName;
    private String location;
    private String imageUrl;
    private String googleMapsUrl;
    private Integer visitOrder;
    private String plannedStartTime;
    private String plannedEndTime;
    private Integer durationMinutes;
    private Integer travelTimeMinutes;
    private Double distanceKm;

    public ItineraryItemDTO() {
    }

    public ItineraryItemDTO(Long id, Long attractionId, String attractionName, String categoryName,
                            String location, String imageUrl, String googleMapsUrl, Integer visitOrder,
                            String plannedStartTime, String plannedEndTime, Integer durationMinutes,
                            Integer travelTimeMinutes, Double distanceKm) {
        this.id = id;
        this.attractionId = attractionId;
        this.attractionName = attractionName;
        this.categoryName = categoryName;
        this.location = location;
        this.imageUrl = imageUrl;
        this.googleMapsUrl = googleMapsUrl;
        this.visitOrder = visitOrder;
        this.plannedStartTime = plannedStartTime;
        this.plannedEndTime = plannedEndTime;
        this.durationMinutes = durationMinutes;
        this.travelTimeMinutes = travelTimeMinutes;
        this.distanceKm = distanceKm;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAttractionId() { return attractionId; }
    public void setAttractionId(Long attractionId) { this.attractionId = attractionId; }

    public String getAttractionName() { return attractionName; }
    public void setAttractionName(String attractionName) { this.attractionName = attractionName; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getGoogleMapsUrl() { return googleMapsUrl; }
    public void setGoogleMapsUrl(String googleMapsUrl) { this.googleMapsUrl = googleMapsUrl; }

    public Integer getVisitOrder() { return visitOrder; }
    public void setVisitOrder(Integer visitOrder) { this.visitOrder = visitOrder; }

    public String getPlannedStartTime() { return plannedStartTime; }
    public void setPlannedStartTime(String plannedStartTime) { this.plannedStartTime = plannedStartTime; }

    public String getPlannedEndTime() { return plannedEndTime; }
    public void setPlannedEndTime(String plannedEndTime) { this.plannedEndTime = plannedEndTime; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public Integer getTravelTimeMinutes() { return travelTimeMinutes; }
    public void setTravelTimeMinutes(Integer travelTimeMinutes) { this.travelTimeMinutes = travelTimeMinutes; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long attractionId;
        private String attractionName;
        private String categoryName;
        private String location;
        private String imageUrl;
        private String googleMapsUrl;
        private Integer visitOrder;
        private String plannedStartTime;
        private String plannedEndTime;
        private Integer durationMinutes;
        private Integer travelTimeMinutes;
        private Double distanceKm;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder attractionId(Long attractionId) { this.attractionId = attractionId; return this; }
        public Builder attractionName(String attractionName) { this.attractionName = attractionName; return this; }
        public Builder categoryName(String categoryName) { this.categoryName = categoryName; return this; }
        public Builder location(String location) { this.location = location; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder googleMapsUrl(String googleMapsUrl) { this.googleMapsUrl = googleMapsUrl; return this; }
        public Builder visitOrder(Integer visitOrder) { this.visitOrder = visitOrder; return this; }
        public Builder plannedStartTime(String plannedStartTime) { this.plannedStartTime = plannedStartTime; return this; }
        public Builder plannedEndTime(String plannedEndTime) { this.plannedEndTime = plannedEndTime; return this; }
        public Builder durationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; return this; }
        public Builder travelTimeMinutes(Integer travelTimeMinutes) { this.travelTimeMinutes = travelTimeMinutes; return this; }
        public Builder distanceKm(Double distanceKm) { this.distanceKm = distanceKm; return this; }

        public ItineraryItemDTO build() {
            return new ItineraryItemDTO(id, attractionId, attractionName, categoryName, location,
                    imageUrl, googleMapsUrl, visitOrder, plannedStartTime, plannedEndTime,
                    durationMinutes, travelTimeMinutes, distanceKm);
        }
    }
}
