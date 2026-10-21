package com.travelmate.travelmate.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class ReviewDTO {
    private Long id;

    @NotNull(message = "User id is required")
    private Long userId;

    private String userName;

    @NotNull(message = "Attraction id is required")
    private Long attractionId;

    private String attractionName;

    @Min(1) @Max(5)
    private Integer rating;

    private String comment;
    private LocalDateTime createdAt;

    public ReviewDTO() {
    }

    public ReviewDTO(Long id, Long userId, String userName, Long attractionId, String attractionName,
                     Integer rating, String comment, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.attractionId = attractionId;
        this.attractionName = attractionName;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public Long getAttractionId() { return attractionId; }
    public void setAttractionId(Long attractionId) { this.attractionId = attractionId; }

    public String getAttractionName() { return attractionName; }
    public void setAttractionName(String attractionName) { this.attractionName = attractionName; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long userId;
        private String userName;
        private Long attractionId;
        private String attractionName;
        private Integer rating;
        private String comment;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder userName(String userName) { this.userName = userName; return this; }
        public Builder attractionId(Long attractionId) { this.attractionId = attractionId; return this; }
        public Builder attractionName(String attractionName) { this.attractionName = attractionName; return this; }
        public Builder rating(Integer rating) { this.rating = rating; return this; }
        public Builder comment(String comment) { this.comment = comment; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ReviewDTO build() {
            return new ReviewDTO(id, userId, userName, attractionId, attractionName, rating, comment, createdAt);
        }
    }
}
