package com.travelmate.travelmate.controller;

import com.travelmate.travelmate.dto.ApiResponse;
import com.travelmate.travelmate.dto.AttractionDTO;
import com.travelmate.travelmate.dto.FavoriteRequest;
import com.travelmate.travelmate.service.FavoriteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Void> add(@Valid @RequestBody FavoriteRequest request) {
        favoriteService.addFavorite(request);
        return ApiResponse.success("Added to favorites", null);
    }

    @DeleteMapping("/{userId}/{attractionId}")
    public ApiResponse<Void> remove(@PathVariable Long userId, @PathVariable Long attractionId) {
        favoriteService.removeFavorite(userId, attractionId);
        return ApiResponse.success("Removed from favorites", null);
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<AttractionDTO>> getByUser(@PathVariable Long userId) {
        return ApiResponse.success("Favorites fetched", favoriteService.getFavoritesByUser(userId));
    }
}
