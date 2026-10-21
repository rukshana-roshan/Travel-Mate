package com.travelmate.travelmate.controller;

import com.travelmate.travelmate.dto.ApiResponse;
import com.travelmate.travelmate.dto.AttractionDTO;
import com.travelmate.travelmate.dto.ContactMessageDTO;
import com.travelmate.travelmate.repository.*;
import com.travelmate.travelmate.service.AttractionService;
import com.travelmate.travelmate.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AttractionRepository attractionRepository;
    private final CategoryRepository categoryRepository;
    private final ItineraryRepository itineraryRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final ReviewRepository reviewRepository;
    private final AttractionService attractionService;
    private final ContactService contactService;

    public AdminController(AttractionRepository attractionRepository,
                           CategoryRepository categoryRepository,
                           ItineraryRepository itineraryRepository,
                           ContactMessageRepository contactMessageRepository,
                           ReviewRepository reviewRepository,
                           AttractionService attractionService,
                           ContactService contactService) {
        this.attractionRepository = attractionRepository;
        this.categoryRepository = categoryRepository;
        this.itineraryRepository = itineraryRepository;
        this.contactMessageRepository = contactMessageRepository;
        this.reviewRepository = reviewRepository;
        this.attractionService = attractionService;
        this.contactService = contactService;
    }

    @GetMapping("/stats")
    public ApiResponse<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDestinations", attractionRepository.count());
        stats.put("totalCategories", categoryRepository.count());
        stats.put("totalSavedItineraries", itineraryRepository.count());
        stats.put("totalContactMessages", contactMessageRepository.count());
        stats.put("unreadContactMessages", contactMessageRepository.countByIsReadFalse());
        stats.put("totalReviews", reviewRepository.count());

        return ApiResponse.success("Dashboard statistics fetched", stats);
    }

    @PostMapping("/attractions")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AttractionDTO> createAttraction(@Valid @RequestBody AttractionDTO dto) {
        return ApiResponse.success("Attraction created by admin", attractionService.createAttraction(dto));
    }

    @PutMapping("/attractions/{id}")
    public ApiResponse<AttractionDTO> updateAttraction(@PathVariable Long id, @Valid @RequestBody AttractionDTO dto) {
        return ApiResponse.success("Attraction updated by admin", attractionService.updateAttraction(id, dto));
    }

    @DeleteMapping("/attractions/{id}")
    public ApiResponse<Void> deleteAttraction(@PathVariable Long id) {
        attractionService.deleteAttraction(id);
        return ApiResponse.success("Attraction deleted by admin", null);
    }

    @GetMapping("/messages")
    public ApiResponse<List<ContactMessageDTO>> getMessages() {
        return ApiResponse.success("Admin messages fetched", contactService.getAllMessages());
    }

    @DeleteMapping("/messages/{id}")
    public ApiResponse<Void> deleteMessage(@PathVariable Long id) {
        contactService.deleteMessage(id);
        return ApiResponse.success("Message deleted by admin", null);
    }
}
