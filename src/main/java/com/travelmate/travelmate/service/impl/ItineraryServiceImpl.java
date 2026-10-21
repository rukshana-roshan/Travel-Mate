package com.travelmate.travelmate.service.impl;

import com.travelmate.travelmate.dto.AttractionDTO;
import com.travelmate.travelmate.dto.GenerateItineraryRequest;
import com.travelmate.travelmate.dto.ItineraryDTO;
import com.travelmate.travelmate.dto.ItineraryItemDTO;
import com.travelmate.travelmate.entity.Attraction;
import com.travelmate.travelmate.entity.Itinerary;
import com.travelmate.travelmate.entity.ItineraryItem;
import com.travelmate.travelmate.entity.User;
import com.travelmate.travelmate.exception.ResourceNotFoundException;
import com.travelmate.travelmate.repository.AttractionRepository;
import com.travelmate.travelmate.repository.ItineraryRepository;
import com.travelmate.travelmate.repository.UserRepository;
import com.travelmate.travelmate.service.ItineraryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ItineraryServiceImpl implements ItineraryService {

    // Default origin: Atulugama Junction, Kalutara District, Sri Lanka
    private static final double ATULUGAMA_LAT = 6.7022;
    private static final double ATULUGAMA_LON = 80.0528;
    private static final String START_LOCATION_NAME = "Atulugama, Kalutara District";

    // Sri Lanka coastal road winding factor (ratio of road distance to great-circle distance)
    private static final double ROAD_FACTOR = 1.25;

    // Average travel speeds
    private static final double CAR_SPEED_KMH = 35.0;
    private static final double MOTO_SPEED_KMH = 40.0;
    private static final int CAR_BUFFER_MINUTES = 5;
    private static final int MOTO_BUFFER_MINUTES = 3;

    private static final DateTimeFormatter TIME_FORMATTER_AMPM = DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH);

    private final ItineraryRepository itineraryRepository;
    private final UserRepository userRepository;
    private final AttractionRepository attractionRepository;

    public ItineraryServiceImpl(ItineraryRepository itineraryRepository,
                                UserRepository userRepository,
                                AttractionRepository attractionRepository) {
        this.itineraryRepository = itineraryRepository;
        this.userRepository = userRepository;
        this.attractionRepository = attractionRepository;
    }

    /**
     * Deterministic Nearest-Neighbour Itinerary Planning Algorithm:
     * 1. Loads selected destinations by ID.
     * 2. Sets origin as Atulugama (6.7022, 80.0528) and initial clock as requested startTime.
     * 3. Greedily selects the nearest unvisited attraction from current location.
     * 4. Calculates road distance (Haversine * 1.25) and travel time by vehicle mode.
     * 5. Checks if arrival + visit duration fits within user's endTime constraint.
     * 6. Appends scheduled stops or separates overflow stops.
     */
    @Override
    @Transactional(readOnly = true)
    public ItineraryDTO generateItinerary(GenerateItineraryRequest request) {
        List<Long> ids = request.getAttractionIds();
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("At least one destination must be selected");
        }

        List<Attraction> selected = attractionRepository.findAllById(ids);
        if (selected.isEmpty()) {
            throw new ResourceNotFoundException("No matching destinations found for the selected IDs");
        }

        // Parse start and end times
        LocalTime startTime = parseTimeString(request.getStartTime(), LocalTime.of(9, 0));
        LocalTime endTime = parseTimeString(request.getEndTime(), LocalTime.of(18, 0));

        boolean isMoto = "motorcycle".equalsIgnoreCase(request.getTravelMode());
        double speedKmh = isMoto ? MOTO_SPEED_KMH : CAR_SPEED_KMH;
        int bufferMinutes = isMoto ? MOTO_BUFFER_MINUTES : CAR_BUFFER_MINUTES;

        double currentLat = ATULUGAMA_LAT;
        double currentLon = ATULUGAMA_LON;
        LocalTime currentTime = startTime;

        List<Attraction> unvisited = new ArrayList<>(selected);
        List<ItineraryItemDTO> scheduledItems = new ArrayList<>();
        List<AttractionDTO> overflowAttractions = new ArrayList<>();

        double cumulativeDistance = 0.0;
        int order = 1;

        while (!unvisited.isEmpty()) {
            // Find closest unvisited attraction to current location
            Attraction nearest = null;
            double minDistance = Double.MAX_VALUE;

            for (Attraction a : unvisited) {
                double dist = calculateRoadDistance(currentLat, currentLon, a.getLatitude(), a.getLongitude());
                if (dist < minDistance) {
                    minDistance = dist;
                    nearest = a;
                }
            }

            if (nearest == null) break;

            // Travel time to nearest
            int travelMins = calculateTravelMinutes(minDistance, speedKmh, bufferMinutes);
            LocalTime arrivalTime = currentTime.plusMinutes(travelMins);

            int visitDuration = (nearest.getDurationMinutes() != null && nearest.getDurationMinutes() > 0)
                    ? nearest.getDurationMinutes()
                    : 60;

            LocalTime departureTime = arrivalTime.plusMinutes(visitDuration);

            // Time constraint check
            // If departure exceeds endTime or rolled past midnight
            if (departureTime.isAfter(endTime) || departureTime.isBefore(startTime)) {
                overflowAttractions.add(toAttractionDTO(nearest));
            } else {
                cumulativeDistance += minDistance;
                ItineraryItemDTO item = ItineraryItemDTO.builder()
                        .attractionId(nearest.getId())
                        .attractionName(nearest.getName())
                        .categoryName(nearest.getCategory() != null ? nearest.getCategory().getName() : "")
                        .location(nearest.getLocation())
                        .imageUrl(nearest.getImageUrl())
                        .googleMapsUrl(nearest.getGoogleMapsUrl())
                        .visitOrder(order++)
                        .plannedStartTime(arrivalTime.format(TIME_FORMATTER_AMPM))
                        .plannedEndTime(departureTime.format(TIME_FORMATTER_AMPM))
                        .durationMinutes(visitDuration)
                        .travelTimeMinutes(travelMins)
                        .distanceKm(Math.round(minDistance * 10.0) / 10.0)
                        .build();

                scheduledItems.add(item);
                currentLat = nearest.getLatitude();
                currentLon = nearest.getLongitude();
                currentTime = departureTime;
            }

            unvisited.remove(nearest);
        }

        int totalPlannedDuration = (int) java.time.Duration.between(startTime, currentTime).toMinutes();
        if (totalPlannedDuration < 0) totalPlannedDuration = 0;

        String planName = request.getPlanName();
        if (planName == null || planName.isBlank()) {
            planName = "One-Day Tour from Atulugama (" + scheduledItems.size() + " stops)";
        }

        LocalDate visitDate = request.getVisitDate() != null ? request.getVisitDate() : LocalDate.now().plusDays(1);

        return ItineraryDTO.builder()
                .userId(request.getUserId())
                .planName(planName)
                .visitDate(visitDate)
                .startTime(startTime.format(TIME_FORMATTER_AMPM))
                .endTime(endTime.format(TIME_FORMATTER_AMPM))
                .travelMode(isMoto ? "motorcycle" : "car")
                .totalDistanceKm(Math.round(cumulativeDistance * 10.0) / 10.0)
                .totalDurationMinutes(totalPlannedDuration)
                .attractionIds(ids)
                .items(scheduledItems)
                .overflowAttractions(overflowAttractions)
                .startLocation(START_LOCATION_NAME)
                .build();
    }

    @Override
    @Transactional
    public ItineraryDTO createItinerary(ItineraryDTO dto) {
        User user = null;
        if (dto.getUserId() != null) {
            user = userRepository.findById(dto.getUserId()).orElse(null);
        }

        Itinerary itinerary = Itinerary.builder()
                .user(user)
                .planName(dto.getPlanName() != null ? dto.getPlanName() : "One-Day Tour Plan")
                .visitDate(dto.getVisitDate() != null ? dto.getVisitDate() : LocalDate.now())
                .startTime(dto.getStartTime() != null ? dto.getStartTime() : "09:00 AM")
                .endTime(dto.getEndTime() != null ? dto.getEndTime() : "06:00 PM")
                .travelMode(dto.getTravelMode() != null ? dto.getTravelMode() : "car")
                .totalDistanceKm(dto.getTotalDistanceKm() != null ? dto.getTotalDistanceKm() : 0.0)
                .totalDurationMinutes(dto.getTotalDurationMinutes() != null ? dto.getTotalDurationMinutes() : 0)
                .items(new ArrayList<>())
                .build();

        if (dto.getItems() != null && !dto.getItems().isEmpty()) {
            int seq = 1;
            for (ItineraryItemDTO itemDTO : dto.getItems()) {
                Attraction attraction = attractionRepository.findById(itemDTO.getAttractionId())
                        .orElseThrow(() -> new ResourceNotFoundException("Attraction not found: " + itemDTO.getAttractionId()));

                ItineraryItem item = ItineraryItem.builder()
                        .itinerary(itinerary)
                        .attraction(attraction)
                        .visitOrder(itemDTO.getVisitOrder() != null ? itemDTO.getVisitOrder() : seq++)
                        .plannedStartTime(itemDTO.getPlannedStartTime())
                        .plannedEndTime(itemDTO.getPlannedEndTime())
                        .travelTimeMinutes(itemDTO.getTravelTimeMinutes())
                        .distanceKm(itemDTO.getDistanceKm())
                        .build();

                itinerary.getItems().add(item);
            }
        } else if (dto.getAttractionIds() != null) {
            int seq = 1;
            for (Long attractionId : dto.getAttractionIds()) {
                Attraction attraction = attractionRepository.findById(attractionId)
                        .orElseThrow(() -> new ResourceNotFoundException("Attraction not found: " + attractionId));

                ItineraryItem item = ItineraryItem.builder()
                        .itinerary(itinerary)
                        .attraction(attraction)
                        .visitOrder(seq++)
                        .plannedStartTime("10:00 AM")
                        .plannedEndTime("11:30 AM")
                        .travelTimeMinutes(20)
                        .distanceKm(attraction.getDistanceKm())
                        .build();

                itinerary.getItems().add(item);
            }
        }

        Itinerary saved = itineraryRepository.save(itinerary);
        return toDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ItineraryDTO getItineraryById(Long id) {
        return toDTO(findItineraryOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItineraryDTO> getItinerariesByUser(Long userId) {
        return itineraryRepository.findByUserId(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItineraryDTO> getAllItineraries() {
        return itineraryRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteItinerary(Long id) {
        Itinerary itinerary = findItineraryOrThrow(id);
        itineraryRepository.delete(itinerary);
    }

    private Itinerary findItineraryOrThrow(Long id) {
        return itineraryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found with id: " + id));
    }

    /**
     * Haversine great circle distance with road factor.
     */
    private double calculateRoadDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double straightDistance = 6371.0 * c;
        return straightDistance * ROAD_FACTOR;
    }

    private int calculateTravelMinutes(double distanceKm, double speedKmh, int bufferMinutes) {
        if (distanceKm <= 0.05) return 0;
        int mins = (int) Math.round((distanceKm / speedKmh) * 60.0);
        return mins + bufferMinutes;
    }

    private LocalTime parseTimeString(String timeStr, LocalTime fallback) {
        if (timeStr == null || timeStr.isBlank()) return fallback;
        String trimmed = timeStr.trim().toUpperCase();

        try {
            return LocalTime.parse(trimmed, DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH));
        } catch (DateTimeParseException ignored) {}

        try {
            return LocalTime.parse(trimmed, DateTimeFormatter.ofPattern("h:mm a", Locale.ENGLISH));
        } catch (DateTimeParseException ignored) {}

        try {
            return LocalTime.parse(trimmed, DateTimeFormatter.ofPattern("HH:mm"));
        } catch (DateTimeParseException ignored) {}

        try {
            return LocalTime.parse(trimmed, DateTimeFormatter.ofPattern("H:mm"));
        } catch (DateTimeParseException ignored) {}

        return fallback;
    }

    private AttractionDTO toAttractionDTO(Attraction a) {
        return AttractionDTO.builder()
                .id(a.getId())
                .name(a.getName())
                .categoryId(a.getCategory() != null ? a.getCategory().getId() : null)
                .categoryName(a.getCategory() != null ? a.getCategory().getName() : null)
                .description(a.getDescription())
                .location(a.getLocation())
                .distanceKm(a.getDistanceKm())
                .durationMinutes(a.getDurationMinutes())
                .openingHours(a.getOpeningHours())
                .entranceFee(a.getEntranceFee())
                .latitude(a.getLatitude())
                .longitude(a.getLongitude())
                .imageUrl(a.getImageUrl())
                .googleMapsUrl(a.getGoogleMapsUrl())
                .averageRating(a.getAverageRating())
                .build();
    }

    private ItineraryDTO toDTO(Itinerary itinerary) {
        List<ItineraryItemDTO> items = new ArrayList<>();
        if (itinerary.getItems() != null) {
            items = itinerary.getItems().stream()
                    .map(i -> ItineraryItemDTO.builder()
                            .id(i.getId())
                            .attractionId(i.getAttraction().getId())
                            .attractionName(i.getAttraction().getName())
                            .categoryName(i.getAttraction().getCategory() != null ? i.getAttraction().getCategory().getName() : "")
                            .location(i.getAttraction().getLocation())
                            .imageUrl(i.getAttraction().getImageUrl())
                            .googleMapsUrl(i.getAttraction().getGoogleMapsUrl())
                            .visitOrder(i.getVisitOrder())
                            .plannedStartTime(i.getPlannedStartTime())
                            .plannedEndTime(i.getPlannedEndTime())
                            .durationMinutes(i.getAttraction().getDurationMinutes())
                            .travelTimeMinutes(i.getTravelTimeMinutes())
                            .distanceKm(i.getDistanceKm())
                            .build())
                    .collect(Collectors.toList());
        }

        return ItineraryDTO.builder()
                .id(itinerary.getId())
                .userId(itinerary.getUser() != null ? itinerary.getUser().getId() : null)
                .planName(itinerary.getPlanName())
                .visitDate(itinerary.getVisitDate())
                .startTime(itinerary.getStartTime())
                .endTime(itinerary.getEndTime())
                .travelMode(itinerary.getTravelMode())
                .totalDistanceKm(itinerary.getTotalDistanceKm())
                .totalDurationMinutes(itinerary.getTotalDurationMinutes())
                .items(items)
                .startLocation(START_LOCATION_NAME)
                .createdAt(itinerary.getCreatedAt())
                .build();
    }
}
