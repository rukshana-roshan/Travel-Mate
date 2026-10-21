package com.travelmate.travelmate.controller;

import com.travelmate.travelmate.dto.ApiResponse;
import com.travelmate.travelmate.dto.ReviewDTO;
import com.travelmate.travelmate.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ReviewDTO> add(@Valid @RequestBody ReviewDTO dto) {
        return ApiResponse.success("Review added successfully", reviewService.addReview(dto));
    }

    @GetMapping
    public ApiResponse<List<ReviewDTO>> getAll() {
        return ApiResponse.success("Reviews fetched successfully", reviewService.getAllReviews());
    }

    @GetMapping("/attraction/{attractionId}")
    public ApiResponse<List<ReviewDTO>> getByAttraction(@PathVariable Long attractionId) {
        return ApiResponse.success("Reviews fetched successfully", reviewService.getReviewsByAttraction(attractionId));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ApiResponse.success("Review deleted successfully", null);
    }
}
