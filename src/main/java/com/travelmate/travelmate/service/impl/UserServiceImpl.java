package com.travelmate.travelmate.service.impl;

import com.travelmate.travelmate.dto.LoginRequest;
import com.travelmate.travelmate.dto.LoginResponse;
import com.travelmate.travelmate.dto.RegisterRequest;
import com.travelmate.travelmate.entity.Role;
import com.travelmate.travelmate.entity.User;
import com.travelmate.travelmate.exception.DuplicateResourceException;
import com.travelmate.travelmate.exception.InvalidCredentialsException;
import com.travelmate.travelmate.repository.UserRepository;
import com.travelmate.travelmate.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("An account with this email already exists");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.TOURIST)
                .build();

        User saved = userRepository.save(user);
        return buildLoginResponse(saved);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return buildLoginResponse(user);
    }

    private LoginResponse buildLoginResponse(User user) {
        String token = UUID.randomUUID().toString();
        return LoginResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .token(token)
                .build();
    }
}
