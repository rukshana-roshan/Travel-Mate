package com.travelmate.travelmate.controller;

import com.travelmate.travelmate.dto.ApiResponse;
import com.travelmate.travelmate.dto.AttractionDTO;
import com.travelmate.travelmate.service.AttractionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attractions")
public class AttractionController {

    private final AttractionService attractionService;

    public AttractionController(AttractionService attractionService) {
        this.attractionService = attractionService;
    }

    @GetMapping
    public ApiResponse<List<AttractionDTO>> getAll(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword) {

        List<AttractionDTO> result;
        boolean hasCategory = categoryId != null;
        boolean hasKeyword = keyword != null && !keyword.isBlank();

        if (hasCategory && hasKeyword) {
            result = attractionService.searchAttractionsByCategoryAndKeyword(categoryId, keyword);
        } else if (hasCategory) {
            result = attractionService.getAttractionsByCategory(categoryId);
        } else if (hasKeyword) {
            result = attractionService.searchAttractions(keyword);
        } else {
            result = attractionService.getAllAttractions();
        }
        return ApiResponse.success("Attractions fetched successfully", result);
    }

    @GetMapping("/search")
    public ApiResponse<List<AttractionDTO>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long categoryId) {

        String term = (keyword != null && !keyword.isBlank()) ? keyword : query;
        if (term == null) term = "";

        List<AttractionDTO> result;
        if (categoryId != null && !term.isBlank()) {
            result = attractionService.searchAttractionsByCategoryAndKeyword(categoryId, term);
        } else if (categoryId != null) {
            result = attractionService.getAttractionsByCategory(categoryId);
        } else if (!term.isBlank()) {
            result = attractionService.searchAttractions(term);
        } else {
            result = attractionService.getAllAttractions();
        }
        return ApiResponse.success("Search completed", result);
    }

    @GetMapping("/{id}")
    public ApiResponse<AttractionDTO> getById(@PathVariable Long id) {
        return ApiResponse.success("Attraction details fetched", attractionService.getAttractionById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AttractionDTO> create(@Valid @RequestBody AttractionDTO dto) {
        return ApiResponse.success("Attraction created successfully", attractionService.createAttraction(dto));
    }

    @PutMapping("/{id}")
    public ApiResponse<AttractionDTO> update(@PathVariable Long id, @Valid @RequestBody AttractionDTO dto) {
        return ApiResponse.success("Attraction updated successfully", attractionService.updateAttraction(id, dto));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        attractionService.deleteAttraction(id);
        return ApiResponse.success("Attraction deleted successfully", null);
    }
}
