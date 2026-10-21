package com.travelmate.travelmate.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelmate.travelmate.dto.AttractionDTO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Sql(scripts = "/sql/test-seed-data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class AdminControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("TC11 & TC13 - Administrator can view system stats")
    void testGetDashboardStats() throws Exception {
        mockMvc.perform(get("/api/admin/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalDestinations").isNumber())
                .andExpect(jsonPath("$.data.totalCategories").isNumber());
    }

    @Test
    @DisplayName("TC13 - Administrator can add a new attraction with valid details")
    void testAdminCreateAttraction() throws Exception {
        AttractionDTO dto = new AttractionDTO();
        dto.setName("Calido Sunset Point");
        dto.setCategoryId(1L);
        dto.setLocation("Calido Beach Road, Kalutara");
        dto.setDescription("Scenic coastal peninsula where the Kalu Ganga river meets the Indian Ocean.");
        dto.setLatitude(6.5821);
        dto.setLongitude(79.9572);
        dto.setDistanceKm(18.5);
        dto.setDurationMinutes(60);
        dto.setEntranceFee(BigDecimal.ZERO);
        dto.setOpeningHours("Open 24 Hours");
        dto.setImageUrl("https://images.unsplash.com/photo-calido");
        dto.setGoogleMapsUrl("https://maps.google.com/?q=6.5821,79.9572");

        mockMvc.perform(post("/api/admin/attractions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Calido Sunset Point"));
    }

    @Test
    @DisplayName("TC14 - Administrator can update existing attraction")
    void testAdminUpdateAttraction() throws Exception {
        AttractionDTO dto = new AttractionDTO();
        dto.setName("Richmond Castle Heritage Site");
        dto.setCategoryId(4L);
        dto.setLocation("Palatota, Kalutara");
        dto.setDescription("Updated description for university test case TC14.");
        dto.setLatitude(6.5833);
        dto.setLongitude(79.9667);
        dto.setDistanceKm(19.5);
        dto.setDurationMinutes(90);
        dto.setEntranceFee(new BigDecimal("500.00"));
        dto.setOpeningHours("08:00 AM - 05:00 PM");
        dto.setImageUrl("https://images.unsplash.com/photo-richmond");

        mockMvc.perform(put("/api/admin/attractions/8")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Richmond Castle Heritage Site"));
    }

    @Test
    @DisplayName("TC15 - Administrator can delete an attraction")
    void testAdminDeleteAttraction() throws Exception {
        mockMvc.perform(delete("/api/admin/attractions/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // Verify attraction no longer exists
        mockMvc.perform(get("/api/attractions/10"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("TC17 - Adding attraction with missing name returns 400 Bad Request")
    void testCreateAttractionValidationFailure() throws Exception {
        AttractionDTO dto = new AttractionDTO();
        dto.setName(""); // Invalid: Empty name
        dto.setCategoryId(1L);
        dto.setDescription("Some description");
        dto.setLatitude(6.58);
        dto.setLongitude(79.95);

        mockMvc.perform(post("/api/admin/attractions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }
}
