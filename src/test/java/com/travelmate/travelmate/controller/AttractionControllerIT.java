package com.travelmate.travelmate.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * End-to-end test hitting the real REST layer (controller -> service ->
 * repository -> H2) to confirm the whole stack is wired correctly — this is
 * the kind of test that would have caught wiring mistakes a pure unit test
 * can miss (wrong request mapping, wrong JSON field names, etc).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Sql("/sql/test-seed-data.sql")
class AttractionControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getAllAttractions_returnsSeededAttraction() throws Exception {
        mockMvc.perform(get("/api/attractions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", org.hamcrest.Matchers.hasSize(10)))
                .andExpect(jsonPath("$.data[0].name").value("Pearl Bay, Bandaragama"))
                .andExpect(jsonPath("$.data[0].categoryName").value("Recreation"));
    }

    @Test
    void getAttractionById_returns404_whenNotFound() throws Exception {
        mockMvc.perform(get("/api/attractions/999"))
                .andDo(org.springframework.test.web.servlet.result.MockMvcResultHandlers.print())
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void createAttraction_returns400_whenRequiredFieldsMissing() throws Exception {
        String invalidBody = "{\"name\":\"\"}"; // missing categoryId, distanceKm, latitude, longitude

        mockMvc.perform(post("/api/attractions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.fieldErrors").exists());
    }

    @Test
    void createAndDeleteAttraction_roundTripsThroughRealDatabase() throws Exception {
        String body = """
                {
                  "name": "Test Cove",
                  "categoryId": 1,
                  "description": "Created by an integration test",
                  "distanceKm": 3.2,
                  "durationMinutes": 45,
                  "openingHours": "08:00 - 17:00",
                  "entranceFee": 0,
                  "latitude": 6.6,
                  "longitude": 80.0,
                  "imageUrl": "https://example.com/test-cove.jpg"
                }
                """;

        String response = mockMvc.perform(post("/api/attractions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.name").value("Test Cove"))
                .andReturn().getResponse().getContentAsString();

        Object rawId = com.jayway.jsonpath.JsonPath.read(response, "$.data.id");
        Long id = ((Number) rawId).longValue();

        mockMvc.perform(delete("/api/attractions/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        mockMvc.perform(get("/api/attractions/" + id))
                .andExpect(status().isNotFound());
    }
}
