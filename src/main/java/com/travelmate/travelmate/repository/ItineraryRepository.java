package com.travelmate.travelmate.repository;

import com.travelmate.travelmate.entity.Itinerary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItineraryRepository extends JpaRepository<Itinerary, Long> {
    List<Itinerary> findByUserId(Long userId);
    List<Itinerary> findAllByOrderByCreatedAtDesc();
}
