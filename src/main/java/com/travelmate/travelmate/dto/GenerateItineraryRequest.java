package com.travelmate.travelmate.dto;

import jakarta.validation.constraints.NotEmpty;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class GenerateItineraryRequest {

    @NotEmpty(message = "Please select at least one attraction")
    private List<Long> attractionIds = new ArrayList<>();

    private String startTime = "09:00 AM";
    private String endTime = "06:00 PM";
    private String travelMode = "car"; // "car" or "motorcycle"
    private LocalDate visitDate;
    private String planName;
    private Long userId;

    public GenerateItineraryRequest() {
    }

    public GenerateItineraryRequest(List<Long> attractionIds, String startTime, String endTime,
                                    String travelMode, LocalDate visitDate, String planName, Long userId) {
        if (attractionIds != null) this.attractionIds = attractionIds;
        if (startTime != null) this.startTime = startTime;
        if (endTime != null) this.endTime = endTime;
        if (travelMode != null) this.travelMode = travelMode;
        this.visitDate = visitDate;
        this.planName = planName;
        this.userId = userId;
    }

    public List<Long> getAttractionIds() { return attractionIds; }
    public void setAttractionIds(List<Long> attractionIds) { this.attractionIds = attractionIds; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public String getTravelMode() { return travelMode; }
    public void setTravelMode(String travelMode) { this.travelMode = travelMode; }

    public LocalDate getVisitDate() { return visitDate; }
    public void setVisitDate(LocalDate visitDate) { this.visitDate = visitDate; }

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
