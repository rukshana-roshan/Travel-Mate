package com.travelmate.travelmate.controller;

import com.travelmate.travelmate.dto.ApiResponse;
import com.travelmate.travelmate.dto.LoginRequest;
import com.travelmate.travelmate.dto.LoginResponse;
import com.travelmate.travelmate.dto.RegisterRequest;
import com.travelmate.travelmate.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping({"/register", "/auth/register"})
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success("Registration successful", userService.register(request));
    }

    @PostMapping({"/login", "/auth/login"})
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success("Login successful", userService.login(request));
    }
}
