package com.travelmate.travelmate.service.impl;

import com.travelmate.travelmate.dto.AttractionDTO;
import com.travelmate.travelmate.dto.FavoriteRequest;
import com.travelmate.travelmate.entity.Attraction;
import com.travelmate.travelmate.entity.Favorite;
import com.travelmate.travelmate.entity.User;
import com.travelmate.travelmate.exception.DuplicateResourceException;
import com.travelmate.travelmate.exception.ResourceNotFoundException;
import com.travelmate.travelmate.repository.AttractionRepository;
import com.travelmate.travelmate.repository.FavoriteRepository;
import com.travelmate.travelmate.repository.UserRepository;
import com.travelmate.travelmate.service.FavoriteService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final AttractionRepository attractionRepository;

    public FavoriteServiceImpl(FavoriteRepository favoriteRepository,
                               UserRepository userRepository,
                               AttractionRepository attractionRepository) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.attractionRepository = attractionRepository;
    }

    @Override
    @Transactional
    public void addFavorite(FavoriteRequest request) {
        if (favoriteRepository.existsByUserIdAndAttractionId(request.getUserId(), request.getAttractionId())) {
            throw new DuplicateResourceException("Attraction is already in favorites");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));
        Attraction attraction = attractionRepository.findById(request.getAttractionId())
                .orElseThrow(() -> new ResourceNotFoundException("Attraction not found with id: " + request.getAttractionId()));

        Favorite favorite = Favorite.builder()
                .user(user)
                .attraction(attraction)
                .build();

        favoriteRepository.save(favorite);
    }

    @Override
    @Transactional
    public void removeFavorite(Long userId, Long attractionId) {
        favoriteRepository.deleteByUserIdAndAttractionId(userId, attractionId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttractionDTO> getFavoritesByUser(Long userId) {
        return favoriteRepository.findByUserId(userId).stream()
                .map(Favorite::getAttraction)
                .map(a -> AttractionDTO.builder()
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
                        .build())
                .collect(Collectors.toList());
    }
}
