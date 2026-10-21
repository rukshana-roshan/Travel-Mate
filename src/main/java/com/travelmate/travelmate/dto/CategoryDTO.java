package com.travelmate.travelmate.dto;

import jakarta.validation.constraints.NotBlank;

public class CategoryDTO {
    private Long id;

    @NotBlank(message = "Category name is required")
    private String name;

    private String icon;
    private String description;
    private String imageUrl;
    private String color;
    private Boolean isFeatured;
    private Integer attractionCount;

    public CategoryDTO() {
    }

    public CategoryDTO(Long id, String name, String icon, String description, String imageUrl, String color, Boolean isFeatured, Integer attractionCount) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.description = description;
        this.imageUrl = imageUrl;
        this.color = color;
        this.isFeatured = isFeatured;
        this.attractionCount = attractionCount;
    }

    public CategoryDTO(Long id, String name, String icon, String description, Integer attractionCount) {
        this(id, name, icon, description, null, null, false, attractionCount);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }

    public Integer getAttractionCount() { return attractionCount; }
    public void setAttractionCount(Integer attractionCount) { this.attractionCount = attractionCount; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private String icon;
        private String description;
        private String imageUrl;
        private String color;
        private Boolean isFeatured = false;
        private Integer attractionCount;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder icon(String icon) { this.icon = icon; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder color(String color) { this.color = color; return this; }
        public Builder isFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; return this; }
        public Builder attractionCount(Integer attractionCount) { this.attractionCount = attractionCount; return this; }

        public CategoryDTO build() {
            return new CategoryDTO(id, name, icon, description, imageUrl, color, isFeatured, attractionCount);
        }
    }
}
