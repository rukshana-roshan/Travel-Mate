package com.travelmate.travelmate.repository;

import com.travelmate.travelmate.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByAttractionIdOrderByCreatedAtDesc(Long attractionId);
    List<Review> findByUserId(Long userId);
    List<Review> findAllByOrderByCreatedAtDesc();
}
