package com.travelmate.travelmate.service;

import com.travelmate.travelmate.dto.AttractionDTO;
import com.travelmate.travelmate.dto.FavoriteRequest;

import java.util.List;

public interface FavoriteService {
    void addFavorite(FavoriteRequest request);
    void removeFavorite(Long userId, Long attractionId);
    List<AttractionDTO> getFavoritesByUser(Long userId);
}
