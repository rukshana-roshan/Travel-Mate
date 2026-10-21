package com.travelmate.travelmate.service;

import com.travelmate.travelmate.dto.GenerateItineraryRequest;
import com.travelmate.travelmate.dto.ItineraryDTO;
import java.util.List;

public interface ItineraryService {
    ItineraryDTO generateItinerary(GenerateItineraryRequest request);
    ItineraryDTO createItinerary(ItineraryDTO dto);
    ItineraryDTO getItineraryById(Long id);
    List<ItineraryDTO> getItinerariesByUser(Long userId);
    List<ItineraryDTO> getAllItineraries();
    void deleteItinerary(Long id);
}
