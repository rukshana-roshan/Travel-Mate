package com.travelmate.travelmate.controller;

import com.travelmate.travelmate.dto.ApiResponse;
import com.travelmate.travelmate.dto.GenerateItineraryRequest;
import com.travelmate.travelmate.dto.ItineraryDTO;
import com.travelmate.travelmate.service.ItineraryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/itineraries", "/api/itinerary"})
public class ItineraryController {

    private final ItineraryService itineraryService;

    public ItineraryController(ItineraryService itineraryService) {
        this.itineraryService = itineraryService;
    }

    /**
     * Smart Day-Visit Planner Algorithm Endpoint.
     * Generates a deterministic nearest-neighbour tour from Atulugama respecting user's available time.
     */
    @PostMapping("/generate")
    public ApiResponse<ItineraryDTO> generate(@Valid @RequestBody GenerateItineraryRequest request) {
        ItineraryDTO generated = itineraryService.generateItinerary(request);
        return ApiResponse.success("Smart itinerary generated successfully", generated);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ItineraryDTO> create(@Valid @RequestBody ItineraryDTO dto) {
        return ApiResponse.success("Itinerary saved successfully", itineraryService.createItinerary(dto));
    }

    @GetMapping
    public ApiResponse<List<ItineraryDTO>> getAll() {
        return ApiResponse.success("All itineraries fetched", itineraryService.getAllItineraries());
    }

    @GetMapping("/{id}")
    public ApiResponse<ItineraryDTO> getById(@PathVariable Long id) {
        return ApiResponse.success("Itinerary fetched successfully", itineraryService.getItineraryById(id));
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<ItineraryDTO>> getByUser(@PathVariable Long userId) {
        return ApiResponse.success("User itineraries fetched", itineraryService.getItinerariesByUser(userId));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        itineraryService.deleteItinerary(id);
        return ApiResponse.success("Itinerary deleted successfully", null);
    }
}
