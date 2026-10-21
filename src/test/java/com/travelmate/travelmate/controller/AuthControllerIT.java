package com.travelmate.travelmate.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Sql("/sql/test-seed-data.sql")
class AuthControllerIT {

    @Autowired
    private MockMvc mockMvc;

    /**
     * Regression test for the Phase 4 bug: the seed SQL originally shipped with a
     * placeholder password hash ($2a$10$replaceWithRealBCryptHash) instead of a
     * real BCrypt hash of "admin123", which made the documented admin login
     * fail on a freshly seeded database. This confirms the fix holds.
     */
    @Test
    void login_succeedsWithSeededAdminCredentials() throws Exception {
        String body = "{\"email\":\"admin@travelmate.lk\",\"password\":\"admin123\"}";

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.role").value("ADMIN"))
                .andExpect(jsonPath("$.data.email").value("admin@travelmate.lk"))
                .andExpect(jsonPath("$.data.token").isNotEmpty());
    }

    @Test
    void login_fails401_withWrongPassword() throws Exception {
        String body = "{\"email\":\"admin@travelmate.lk\",\"password\":\"wrong-password\"}";

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void register_thenLogin_roundTripsSuccessfully() throws Exception {
        String registerBody = """
                {"fullName":"New Tourist","email":"tourist@example.com","password":"pass1234"}
                """;

        mockMvc.perform(post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.role").value("TOURIST"));

        String loginBody = "{\"email\":\"tourist@example.com\",\"password\":\"pass1234\"}";

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.fullName").value("New Tourist"));
    }

    @Test
    void register_fails409_whenEmailAlreadyRegistered() throws Exception {
        String body = "{\"fullName\":\"Duplicate\",\"email\":\"admin@travelmate.lk\",\"password\":\"pass1234\"}";

        mockMvc.perform(post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false));
    }
}
