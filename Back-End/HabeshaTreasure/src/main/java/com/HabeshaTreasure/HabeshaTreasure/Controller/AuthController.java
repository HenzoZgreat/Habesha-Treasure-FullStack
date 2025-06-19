package com.HabeshaTreasure.HabeshaTreasure.Controller;

import com.HabeshaTreasure.HabeshaTreasure.DTO.UserResponseDTO;
import com.HabeshaTreasure.HabeshaTreasure.Entity.User;
import com.HabeshaTreasure.HabeshaTreasure.Entity.UsersInfo;
import com.HabeshaTreasure.HabeshaTreasure.Repository.UserRepo;
import com.HabeshaTreasure.HabeshaTreasure.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    // This class will handle authentication-related endpoints
    // For example, login, register, etc.
    // You can add methods here to handle those requests

    @Autowired
    private AuthService service;

    @Autowired
    private UserRepo userRepo;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody User user) {
        Map<String, String> response = service.registerUser(user);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody User user) {
        Map<String, String> response = service.loginUser(user.getEmail(), user.getPassword());
        String token = response.get("token");
        return ResponseEntity.ok(response);
    }
    @GetMapping("/validate")
    public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
        String jwtToken = token.substring(7); // Remove "Bearer " prefix
        try {
            boolean isValid = service.validateToken(jwtToken);
            if (isValid) {
                return ResponseEntity.ok("Token is valid");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token has expired");
        } catch (io.jsonwebtoken.SignatureException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token signature");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "No Bearer token found"));
        }
        try {
            String jwtToken = token.substring(7); // Remove "Bearer " prefix
            Map<String, Object> claims = service.extractClaims(jwtToken); // Extract claims from the token
            String email = (String) claims.getOrDefault("sub", "Unknown");

            // Load user and info
            User user = userRepo.findByEmail(email);
            if (user == null || user.getUsersInfo() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
            }

            UsersInfo info = user.getUsersInfo();

            UserResponseDTO dto = new UserResponseDTO(
                    user.getId(),
                    user.getEmail(),
                    user.getRole(),
                    info.getFirstName(),
                    info.getLastName(),
                    info.getPhoneNumber() != null ? info.getPhoneNumber() : "",
                    info.getCity() != null ? info.getCity() : "",
                    info.getCountry() != null ? info.getCountry() : "",
                    info.getRegion() != null ? info.getRegion() : "",
                    info.isEnabled(),
                    info.getJoined(),
                    info.getLastLogin()
            );

            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
        }
    }

    @GetMapping("/me/id")
    public ResponseEntity<?> getCurrentUserId(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        return ResponseEntity.ok(Map.of("userId", user.getId()));
    }


}
