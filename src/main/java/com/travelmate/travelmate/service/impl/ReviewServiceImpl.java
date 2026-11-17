package com.travelmate.travelmate.service.impl;

import com.travelmate.travelmate.dto.ReviewDTO;
import com.travelmate.travelmate.entity.Attraction;
import com.travelmate.travelmate.entity.Review;
import com.travelmate.travelmate.entity.User;
import com.travelmate.travelmate.exception.ResourceNotFoundException;
import com.travelmate.travelmate.repository.AttractionRepository;
import com.travelmate.travelmate.repository.ReviewRepository;
import com.travelmate.travelmate.repository.UserRepository;
import com.travelmate.travelmate.service.ReviewService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final AttractionRepository attractionRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository,
                             UserRepository userRepository,
                             AttractionRepository attractionRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.attractionRepository = attractionRepository;
    }

    @Override
    @Transactional
    public ReviewDTO addReview(ReviewDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getUserId()));
        Attraction attraction = attractionRepository.findById(dto.getAttractionId())
                .orElseThrow(() -> new ResourceNotFoundException("Attraction not found with id: " + dto.getAttractionId()));

        String reviewerName = (dto.getUserName() != null && !dto.getUserName().trim().isEmpty())
                ? dto.getUserName().trim()
                : (user != null ? user.getFullName() : "Anonymous Traveler");

        Review review = Review.builder()
                .user(user)
                .userName(reviewerName)
                .attraction(attraction)
                .rating(dto.getRating())
                .comment(dto.getComment())
                .build();

        Review saved = reviewRepository.save(review);

        // Recalculate average rating for the attraction
        List<Review> allReviews = reviewRepository.findByAttractionIdOrderByCreatedAtDesc(attraction.getId());
        double avg = allReviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        attraction.setAverageRating(Math.round(avg * 10.0) / 10.0);
        attractionRepository.save(attraction);

        return toDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewDTO> getReviewsByAttraction(Long attractionId) {
        return reviewRepository.findByAttractionIdOrderByCreatedAtDesc(attractionId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewDTO> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
        reviewRepository.delete(review);
    }

    private ReviewDTO toDTO(Review r) {
        String reviewerName = (r.getUserName() != null && !r.getUserName().trim().isEmpty())
                ? r.getUserName()
                : (r.getUser() != null ? r.getUser().getFullName() : "Anonymous Traveler");

        return ReviewDTO.builder()
                .id(r.getId())
                .userId(r.getUser() != null ? r.getUser().getId() : null)
                .userName(reviewerName)
                .attractionId(r.getAttraction() != null ? r.getAttraction().getId() : null)
                .attractionName(r.getAttraction() != null ? r.getAttraction().getName() : null)
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
