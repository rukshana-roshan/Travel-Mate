package com.travelmate.travelmate.service.impl;

import com.travelmate.travelmate.dto.AttractionDTO;
import com.travelmate.travelmate.entity.Attraction;
import com.travelmate.travelmate.entity.Category;
import com.travelmate.travelmate.exception.ResourceNotFoundException;
import com.travelmate.travelmate.repository.AttractionRepository;
import com.travelmate.travelmate.repository.CategoryRepository;
import com.travelmate.travelmate.service.AttractionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttractionServiceImpl implements AttractionService {

    private final AttractionRepository attractionRepository;
    private final CategoryRepository categoryRepository;

    public AttractionServiceImpl(AttractionRepository attractionRepository, CategoryRepository categoryRepository) {
        this.attractionRepository = attractionRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttractionDTO> getAllAttractions() {
        return attractionRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AttractionDTO getAttractionById(Long id) {
        return toDTO(findAttractionOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttractionDTO> getAttractionsByCategory(Long categoryId) {
        return attractionRepository.findByCategoryId(categoryId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttractionDTO> searchAttractions(String keyword) {
        return attractionRepository.findByNameContainingIgnoreCase(keyword).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttractionDTO> searchAttractionsByCategoryAndKeyword(Long categoryId, String keyword) {
        return attractionRepository.findByCategoryIdAndNameContainingIgnoreCase(categoryId, keyword).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AttractionDTO createAttraction(AttractionDTO dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        String mapsUrl = dto.getGoogleMapsUrl();
        if (mapsUrl == null || mapsUrl.isBlank()) {
            mapsUrl = "https://www.google.com/maps/search/?api=1&query=" + dto.getLatitude() + "," + dto.getLongitude();
        }

        Attraction attraction = Attraction.builder()
                .name(dto.getName())
                .category(category)
                .description(dto.getDescription())
                .location(dto.getLocation() != null ? dto.getLocation() : "Kalutara District")
                .distanceKm(dto.getDistanceKm())
                .durationMinutes(dto.getDurationMinutes())
                .openingHours(dto.getOpeningHours())
                .entranceFee(dto.getEntranceFee())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .imageUrl(dto.getImageUrl())
                .googleMapsUrl(mapsUrl)
                .averageRating(dto.getAverageRating() != null ? dto.getAverageRating() : 0.0)
                .build();

        return toDTO(attractionRepository.save(attraction));
    }

    @Override
    @Transactional
    public AttractionDTO updateAttraction(Long id, AttractionDTO dto) {
        Attraction attraction = findAttractionOrThrow(id);

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));
            attraction.setCategory(category);
        }

        attraction.setName(dto.getName());
        attraction.setDescription(dto.getDescription());
        if (dto.getLocation() != null) {
            attraction.setLocation(dto.getLocation());
        }
        attraction.setDistanceKm(dto.getDistanceKm());
        attraction.setDurationMinutes(dto.getDurationMinutes());
        attraction.setOpeningHours(dto.getOpeningHours());
        attraction.setEntranceFee(dto.getEntranceFee());
        attraction.setLatitude(dto.getLatitude());
        attraction.setLongitude(dto.getLongitude());
        attraction.setImageUrl(dto.getImageUrl());
        if (dto.getGoogleMapsUrl() != null && !dto.getGoogleMapsUrl().isBlank()) {
            attraction.setGoogleMapsUrl(dto.getGoogleMapsUrl());
        } else {
            attraction.setGoogleMapsUrl("https://www.google.com/maps/search/?api=1&query=" + dto.getLatitude() + "," + dto.getLongitude());
        }

        return toDTO(attractionRepository.save(attraction));
    }

    @Override
    @Transactional
    public void deleteAttraction(Long id) {
        Attraction attraction = findAttractionOrThrow(id);
        attractionRepository.delete(attraction);
    }

    private Attraction findAttractionOrThrow(Long id) {
        return attractionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attraction not found with id: " + id));
    }

    private AttractionDTO toDTO(Attraction a) {
        return AttractionDTO.builder()
                .id(a.getId())
                .name(a.getName())
                .categoryId(a.getCategory() != null ? a.getCategory().getId() : null)
                .categoryName(a.getCategory() != null ? a.getCategory().getName() : null)
                .description(a.getDescription())
                .location(a.getLocation())
                .distanceKm(a.getDistanceKm())
                .durationMinutes(a.getDurationMinutes())
                .openingHours(a.getOpeningHours())
                .entranceFee(a.getEntranceFee())
                .latitude(a.getLatitude())
                .longitude(a.getLongitude())
                .imageUrl(a.getImageUrl())
                .googleMapsUrl(a.getGoogleMapsUrl())
                .averageRating(a.getAverageRating())
                .build();
    }
}
