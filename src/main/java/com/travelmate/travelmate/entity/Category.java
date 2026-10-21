package com.travelmate.travelmate.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

/**
 * Category of a tourist attraction, e.g. Beach, Historical, Adventure, Nature, Religious Places, Recreation.
 */
@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 255)
    private String icon; // bootstrap-icons class name, e.g. "bi-water"

    @Column(length = 500)
    private String description;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(length = 30)
    private String color;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Attraction> attractions = new ArrayList<>();

    public Category() {
    }

    public Category(Long id, String name, String icon, String description, String imageUrl, String color, Boolean isFeatured, List<Attraction> attractions) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.description = description;
        this.imageUrl = imageUrl;
        this.color = color;
        this.isFeatured = isFeatured != null ? isFeatured : false;
        if (attractions != null) {
            this.attractions = attractions;
        }
    }

    public Category(Long id, String name, String icon, String description, List<Attraction> attractions) {
        this(id, name, icon, description, null, null, false, attractions);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Boolean getIsFeatured() {
        return isFeatured;
    }

    public void setIsFeatured(Boolean isFeatured) {
        this.isFeatured = isFeatured;
    }

    public List<Attraction> getAttractions() {
        return attractions;
    }

    public void setAttractions(List<Attraction> attractions) {
        this.attractions = attractions;
    }

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
        private List<Attraction> attractions = new ArrayList<>();

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder icon(String icon) {
            this.icon = icon;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public Builder color(String color) {
            this.color = color;
            return this;
        }

        public Builder isFeatured(Boolean isFeatured) {
            this.isFeatured = isFeatured;
            return this;
        }

        public Builder attractions(List<Attraction> attractions) {
            this.attractions = attractions;
            return this;
        }

        public Category build() {
            return new Category(id, name, icon, description, imageUrl, color, isFeatured, attractions);
        }
    }
}
