package com.travelmate.travelmate.service;

import com.travelmate.travelmate.dto.LoginRequest;
import com.travelmate.travelmate.dto.LoginResponse;
import com.travelmate.travelmate.dto.RegisterRequest;
import com.travelmate.travelmate.entity.Role;
import com.travelmate.travelmate.entity.User;
import com.travelmate.travelmate.exception.DuplicateResourceException;
import com.travelmate.travelmate.exception.InvalidCredentialsException;
import com.travelmate.travelmate.repository.UserRepository;
import com.travelmate.travelmate.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    // Real encoder (not mocked) so hashing/matching behaviour is genuinely exercised —
    // this is what would have caught the placeholder seed-hash bug from Phase 4.
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private UserServiceImpl userService;

    @BeforeEach
    void setUp() {
        // Constructed manually (not @InjectMocks) since passwordEncoder is a real
        // instance rather than a Mockito mock.
        userService = new UserServiceImpl(userRepository, passwordEncoder);
    }

    @Test
    void register_hashesPasswordAndDefaultsRoleToTourist() {
        RegisterRequest request = new RegisterRequest("Nadeesha Silva", "nadeesha@example.com", "pass1234");
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(1L);
            return u;
        });

        LoginResponse response = userService.register(request);

        assertThat(response.getUserId()).isEqualTo(1L);
        assertThat(response.getRole()).isEqualTo(Role.TOURIST.name());
        verify(userRepository).save(argThat(u ->
                !u.getPassword().equals("pass1234") && passwordEncoder.matches("pass1234", u.getPassword())
        ));
    }

    @Test
    void register_throwsDuplicateResourceException_whenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest("Someone", "taken@example.com", "pass1234");
        when(userRepository.existsByEmail("taken@example.com")).thenReturn(true);

        assertThatThrownBy(() -> userService.register(request))
                .isInstanceOf(DuplicateResourceException.class);

        verify(userRepository, never()).save(any());
    }

    @Test
    void login_succeeds_whenPasswordMatchesStoredHash() {
        User admin = User.builder()
                .id(1L).fullName("Site Administrator").email("admin@travelmate.lk")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .build();
        when(userRepository.findByEmail("admin@travelmate.lk")).thenReturn(Optional.of(admin));

        LoginResponse response = userService.login(new LoginRequest("admin@travelmate.lk", "admin123"));

        assertThat(response.getRole()).isEqualTo("ADMIN");
        assertThat(response.getEmail()).isEqualTo("admin@travelmate.lk");
    }

    @Test
    void login_throwsInvalidCredentials_whenPasswordIsWrong() {
        User user = User.builder()
                .id(2L).fullName("Tourist").email("tourist@example.com")
                .password(passwordEncoder.encode("correctPass"))
                .role(Role.TOURIST)
                .build();
        when(userRepository.findByEmail("tourist@example.com")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> userService.login(new LoginRequest("tourist@example.com", "wrongPass")))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void login_throwsInvalidCredentials_whenEmailNotFound() {
        when(userRepository.findByEmail("nobody@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.login(new LoginRequest("nobody@example.com", "whatever")))
                .isInstanceOf(InvalidCredentialsException.class);
    }
}
