package com.travelmate.travelmate.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ItineraryDTO {
    private Long id;
    private Long userId;
    private String planName;
    private LocalDate visitDate;
    private String startTime;
    private String endTime;
    private String travelMode;
    private Double totalDistanceKm;
    private Integer totalDurationMinutes;
    private List<Long> attractionIds = new ArrayList<>();
    private List<ItineraryItemDTO> items = new ArrayList<>();
    private List<AttractionDTO> overflowAttractions = new ArrayList<>();
    private String startLocation = "Atulugama, Kalutara District";
    private LocalDateTime createdAt;

    public ItineraryDTO() {
    }

    public ItineraryDTO(Long id, Long userId, String planName, LocalDate visitDate, String startTime,
                        String endTime, String travelMode, Double totalDistanceKm, Integer totalDurationMinutes,
                        List<Long> attractionIds, List<ItineraryItemDTO> items,
                        List<AttractionDTO> overflowAttractions, String startLocation, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.planName = planName;
        this.visitDate = visitDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.travelMode = travelMode;
        this.totalDistanceKm = totalDistanceKm;
        this.totalDurationMinutes = totalDurationMinutes;
        if (attractionIds != null) this.attractionIds = attractionIds;
        if (items != null) this.items = items;
        if (overflowAttractions != null) this.overflowAttractions = overflowAttractions;
        if (startLocation != null) this.startLocation = startLocation;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

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

    public List<Long> getAttractionIds() { return attractionIds; }
    public void setAttractionIds(List<Long> attractionIds) { this.attractionIds = attractionIds; }

    public List<ItineraryItemDTO> getItems() { return items; }
    public void setItems(List<ItineraryItemDTO> items) { this.items = items; }

    public List<AttractionDTO> getOverflowAttractions() { return overflowAttractions; }
    public void setOverflowAttractions(List<AttractionDTO> overflowAttractions) { this.overflowAttractions = overflowAttractions; }

    public String getStartLocation() { return startLocation; }
    public void setStartLocation(String startLocation) { this.startLocation = startLocation; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long userId;
        private String planName;
        private LocalDate visitDate;
        private String startTime;
        private String endTime;
        private String travelMode;
        private Double totalDistanceKm;
        private Integer totalDurationMinutes;
        private List<Long> attractionIds = new ArrayList<>();
        private List<ItineraryItemDTO> items = new ArrayList<>();
        private List<AttractionDTO> overflowAttractions = new ArrayList<>();
        private String startLocation = "Atulugama, Kalutara District";
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder planName(String planName) { this.planName = planName; return this; }
        public Builder visitDate(LocalDate visitDate) { this.visitDate = visitDate; return this; }
        public Builder startTime(String startTime) { this.startTime = startTime; return this; }
        public Builder endTime(String endTime) { this.endTime = endTime; return this; }
        public Builder travelMode(String travelMode) { this.travelMode = travelMode; return this; }
        public Builder totalDistanceKm(Double totalDistanceKm) { this.totalDistanceKm = totalDistanceKm; return this; }
        public Builder totalDurationMinutes(Integer totalDurationMinutes) { this.totalDurationMinutes = totalDurationMinutes; return this; }
        public Builder attractionIds(List<Long> attractionIds) { this.attractionIds = attractionIds; return this; }
        public Builder items(List<ItineraryItemDTO> items) { this.items = items; return this; }
        public Builder overflowAttractions(List<AttractionDTO> overflowAttractions) { this.overflowAttractions = overflowAttractions; return this; }
        public Builder startLocation(String startLocation) { this.startLocation = startLocation; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ItineraryDTO build() {
            return new ItineraryDTO(id, userId, planName, visitDate, startTime, endTime, travelMode,
                    totalDistanceKm, totalDurationMinutes, attractionIds, items, overflowAttractions, startLocation, createdAt);
        }
    }
}
