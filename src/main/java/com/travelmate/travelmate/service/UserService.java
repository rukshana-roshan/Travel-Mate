package com.travelmate.travelmate.service;

import com.travelmate.travelmate.dto.LoginRequest;
import com.travelmate.travelmate.dto.LoginResponse;
import com.travelmate.travelmate.dto.RegisterRequest;

public interface UserService {
    LoginResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
}
