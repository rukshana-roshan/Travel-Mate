package com.travelmate.travelmate.repository;

import com.travelmate.travelmate.entity.ItineraryItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItineraryItemRepository extends JpaRepository<ItineraryItem, Long> {
    List<ItineraryItem> findByItineraryIdOrderByVisitOrderAsc(Long itineraryId);
}
