package com.travelmate.travelmate.repository;

import com.travelmate.travelmate.entity.Attraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttractionRepository extends JpaRepository<Attraction, Long> {

    List<Attraction> findByCategoryId(Long categoryId);

    List<Attraction> findByNameContainingIgnoreCase(String keyword);

    List<Attraction> findByDistanceKmLessThanEqual(Double maxDistanceKm);

    List<Attraction> findByCategoryIdAndNameContainingIgnoreCase(Long categoryId, String keyword);

    List<Attraction> findAllByOrderByNameAsc();

    List<Attraction> findAllByOrderByDistanceKmAsc();

    List<Attraction> findAllByOrderByDurationMinutesAsc();
}
