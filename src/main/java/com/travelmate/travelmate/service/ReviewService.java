package com.travelmate.travelmate.service;

import com.travelmate.travelmate.dto.ReviewDTO;

import java.util.List;

public interface ReviewService {
    ReviewDTO addReview(ReviewDTO dto);
    List<ReviewDTO> getReviewsByAttraction(Long attractionId);
    List<ReviewDTO> getAllReviews();
    void deleteReview(Long id);
}
