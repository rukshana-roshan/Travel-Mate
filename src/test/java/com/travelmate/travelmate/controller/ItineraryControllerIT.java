package com.travelmate.travelmate.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelmate.travelmate.dto.GenerateItineraryRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Sql(scripts = "/sql/test-seed-data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class ItineraryControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("TC08 - Itinerary generation produces sequenced timeline starting from Atulugama")
    void testGenerateItinerarySuccess() throws Exception {
        GenerateItineraryRequest request = new GenerateItineraryRequest();
        request.setAttractionIds(Arrays.asList(1L, 3L, 4L)); // Pearl Bay, Bolgoda Lake, Wadduwa Beach
        request.setStartTime("09:00 AM");
        request.setEndTime("06:00 PM");
        request.setTravelMode("car");
        request.setPlanName("Three Spot Tour");
        request.setVisitDate(LocalDate.now());

        mockMvc.perform(post("/api/itineraries/generate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.startLocation").value("Atulugama, Kalutara District"))
                .andExpect(jsonPath("$.data.items").isArray())
                .andExpect(jsonPath("$.data.totalDistanceKm").isNumber());
    }

    @Test
    @DisplayName("TC09 - Short schedule time window identifies overflow destinations")
    void testItineraryRespectsTimeConstraints() throws Exception {
        GenerateItineraryRequest request = new GenerateItineraryRequest();
        // Request 4 long attractions with only 1.5 hours total time window
        request.setAttractionIds(Arrays.asList(1L, 2L, 4L, 8L));
        request.setStartTime("09:00 AM");
        request.setEndTime("10:30 AM"); // Only 90 minutes available
        request.setTravelMode("car");
        request.setPlanName("Tight Schedule");

        mockMvc.perform(post("/api/itineraries/generate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.overflowAttractions").isArray());
    }

    @Test
    @DisplayName("TC17 - Itinerary generation with empty attraction list returns 400 Bad Request")
    void testGenerateItineraryEmptyList() throws Exception {
        GenerateItineraryRequest request = new GenerateItineraryRequest();
        request.setAttractionIds(new ArrayList<>()); // Invalid: Empty selection

        mockMvc.perform(post("/api/itineraries/generate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }
}
