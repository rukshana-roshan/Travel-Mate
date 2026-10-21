package com.travelmate.travelmate.repository;

import com.travelmate.travelmate.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserId(Long userId);
    Optional<Favorite> findByUserIdAndAttractionId(Long userId, Long attractionId);
    boolean existsByUserIdAndAttractionId(Long userId, Long attractionId);
    void deleteByUserIdAndAttractionId(Long userId, Long attractionId);
}
