package com.travelmate.travelmate.dto;

import jakarta.validation.constraints.NotNull;

public class FavoriteRequest {

    @NotNull(message = "User id is required")
    private Long userId;

    @NotNull(message = "Attraction id is required")
    private Long attractionId;

    public FavoriteRequest() {
    }

    public FavoriteRequest(Long userId, Long attractionId) {
        this.userId = userId;
        this.attractionId = attractionId;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getAttractionId() { return attractionId; }
    public void setAttractionId(Long attractionId) { this.attractionId = attractionId; }
}
