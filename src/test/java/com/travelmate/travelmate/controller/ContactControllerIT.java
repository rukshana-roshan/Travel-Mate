package com.travelmate.travelmate.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelmate.travelmate.dto.ContactMessageDTO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ContactControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("TC20 - Valid contact message submission returns 201 Created and success status")
    void testValidContactSubmission() throws Exception {
        ContactMessageDTO dto = new ContactMessageDTO();
        dto.setName("Nimal Fernando");
        dto.setEmail("nimal@example.com");
        dto.setSubject("Kalutara Bodhiya visit timing");
        dto.setMessage("Can tourists visit during evening pooja hours?");

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Nimal Fernando"))
                .andExpect(jsonPath("$.data.email").value("nimal@example.com"));
    }

    @Test
    @DisplayName("TC17 - Contact submission with invalid email format returns 400 Bad Request")
    void testInvalidEmailSubmission() throws Exception {
        ContactMessageDTO dto = new ContactMessageDTO();
        dto.setName("Nimal Fernando");
        dto.setEmail("not-a-valid-email");
        dto.setSubject("Valid Subject");
        dto.setMessage("This is a message with sufficient characters.");

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("TC17 - Contact submission with empty message returns 400 Bad Request")
    void testEmptyMessageSubmission() throws Exception {
        ContactMessageDTO dto = new ContactMessageDTO();
        dto.setName("Nimal Fernando");
        dto.setEmail("nimal@example.com");
        dto.setSubject("Short");
        dto.setMessage("");

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("TC20 - Admin retrieval of contact messages returns 200 OK")
    void testGetAllMessages() throws Exception {
        mockMvc.perform(get("/api/contact/messages"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }
}
