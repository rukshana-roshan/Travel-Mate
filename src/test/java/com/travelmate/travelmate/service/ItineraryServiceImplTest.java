package com.travelmate.travelmate.service;

import com.travelmate.travelmate.dto.GenerateItineraryRequest;
import com.travelmate.travelmate.dto.ItineraryDTO;
import com.travelmate.travelmate.entity.Attraction;
import com.travelmate.travelmate.entity.Category;
import com.travelmate.travelmate.repository.AttractionRepository;
import com.travelmate.travelmate.repository.ItineraryRepository;
import com.travelmate.travelmate.repository.UserRepository;
import com.travelmate.travelmate.service.impl.ItineraryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ItineraryServiceImplTest {

    @Mock
    private ItineraryRepository itineraryRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private AttractionRepository attractionRepository;

    private ItineraryServiceImpl itineraryService;

    private Attraction pearlBay;
    private Attraction kartingCircuit;
    private Attraction thudugalaElla;

    @BeforeEach
    void setUp() {
        itineraryService = new ItineraryServiceImpl(itineraryRepository, userRepository, attractionRepository);

        Category rec = Category.builder().id(1L).name("Recreation").build();
        Category adv = Category.builder().id(2L).name("Adventure").build();
        Category nat = Category.builder().id(3L).name("Nature").build();

        pearlBay = Attraction.builder()
                .id(1L)
                .name("Pearl Bay, Bandaragama")
                .category(rec)
                .latitude(6.7135)
                .longitude(79.9897)
                .distanceKm(8.5)
                .durationMinutes(120)
                .build();

        kartingCircuit = Attraction.builder()
                .id(2L)
                .name("Sri Lanka Karting Circuit")
                .category(adv)
                .latitude(6.7144)
                .longitude(79.9880)
                .distanceKm(8.8)
                .durationMinutes(90)
                .build();

        thudugalaElla = Attraction.builder()
                .id(10L)
                .name("Thudugala Ella")
                .category(nat)
                .latitude(6.6028)
                .longitude(80.0410)
                .distanceKm(17.5)
                .durationMinutes(120)
                .build();
    }

    @Test
    void generateItinerary_sortsByNearestNeighbourAndBuildsTimeline() {
        when(attractionRepository.findAllById(List.of(1L, 2L, 10L)))
                .thenReturn(List.of(thudugalaElla, pearlBay, kartingCircuit));

        GenerateItineraryRequest request = new GenerateItineraryRequest();
        request.setAttractionIds(List.of(1L, 2L, 10L));
        request.setStartTime("09:00 AM");
        request.setEndTime("06:00 PM");
        request.setTravelMode("car");

        ItineraryDTO plan = itineraryService.generateItinerary(request);

        assertThat(plan).isNotNull();
        assertThat(plan.getItems()).isNotEmpty();
        // The first stop from Atulugama should be the closest one (Pearl Bay or Karting Circuit in Bandaragama, approx 8.5km)
        assertThat(plan.getItems().get(0).getAttractionName()).contains("Bandaragama");
        assertThat(plan.getTotalDistanceKm()).isGreaterThan(0.0);
        assertThat(plan.getStartLocation()).contains("Atulugama");
    }

    @Test
    void generateItinerary_detectsOverflow_whenTimeWindowIsTooShort() {
        when(attractionRepository.findAllById(List.of(1L, 2L, 10L)))
                .thenReturn(List.of(pearlBay, kartingCircuit, thudugalaElla));

        GenerateItineraryRequest request = new GenerateItineraryRequest();
        request.setAttractionIds(List.of(1L, 2L, 10L));
        request.setStartTime("09:00 AM");
        request.setEndTime("11:30 AM"); // Only 2.5 hours window! Not all 3 can fit.
        request.setTravelMode("car");

        ItineraryDTO plan = itineraryService.generateItinerary(request);

        assertThat(plan).isNotNull();
        // At least one attraction must be flagged as overflow
        assertThat(plan.getOverflowAttractions()).isNotEmpty();
    }
}
