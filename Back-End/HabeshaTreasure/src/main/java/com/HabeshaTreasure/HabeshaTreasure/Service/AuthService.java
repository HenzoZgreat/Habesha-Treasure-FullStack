package com.HabeshaTreasure.HabeshaTreasure.Service;

import com.HabeshaTreasure.HabeshaTreasure.Entity.Role;
import com.HabeshaTreasure.HabeshaTreasure.Entity.User;
import com.HabeshaTreasure.HabeshaTreasure.Entity.UsersInfo;
import com.HabeshaTreasure.HabeshaTreasure.Repository.UserRepo;
import com.HabeshaTreasure.HabeshaTreasure.Repository.UsersInfoRepo;
import com.HabeshaTreasure.HabeshaTreasure.SecurityService.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {
    @Autowired
    private UserRepo userRepository;
    @Autowired
    private UsersInfoRepo usersInfoRepository;
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Map<String, String> registerUser(User givenUser) {
        // Encode the password
        givenUser.setPassword(passwordEncoder.encode(givenUser.getPassword()));

        // Set the bidirectional relationship between User and UsersInfo
        if (givenUser.getUsersInfo() != null) {
            givenUser.getUsersInfo().setUser(givenUser);
            LocalDateTime now = LocalDateTime.now();
            givenUser.getUsersInfo().setJoined(now);
            givenUser.getUsersInfo().setLastLogin(now); // Initialize with same timestamp
        }

        // Save the user to the database
        userRepository.save(givenUser);

        System.out.println("User saved to database successfully");

        // Generate a JWT token
        String token = jwtUtil.generateToken(new org.springframework.security.core.userdetails.User(
                givenUser.getEmail(),
                givenUser.getPassword(),
                givenUser.getAuthorities()
        ));

        // Return the token in a response map
        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("token", token);
        return response;
    }


    public Map<String, String> loginUser(String email, String password) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Update last login time
        UsersInfo info = user.getUsersInfo();
        info.setLastLogin(LocalDateTime.now());

        // Save update
        usersInfoRepository.save(info);

        String token = jwtUtil.generateToken(new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                user.getAuthorities()
        ));

        // Return the token in a map
        Map<String, String> response = new HashMap<>();
        response.put("message", "User logged in successfully");
        response.put("Role", user.getRole().toString());
        response.put("token", token); // Include the token in the response
        return response;
    }


    public String handleOAuth2User(String email, String firstName, String lastName) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode("oauth2-" + email));
            user.setRole(Role.USER);

            UsersInfo usersInfo = new UsersInfo();
            usersInfo.setFirstName(firstName != null ? firstName : "Unknown");
            usersInfo.setLastName(lastName != null ? lastName : "Unknown");
            usersInfo.setPhoneNumber("0000000000");
            usersInfo.setUser(user);
            user.setUsersInfo(usersInfo);

            userRepository.save(user);
        }

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                user.getAuthorities()
        );
        return jwtUtil.generateToken(userDetails);
    }

    public boolean validateToken(String jwtToken) {
        try {
            // Parse the JWT token to extract claims
            jwtUtil.extractAllClaims(jwtToken);
            return true; // If parsing is successful, the token is valid
        } catch (Exception e) {
            System.err.println("Token validation failed: " + e.getMessage());
            return false; // If an exception occurs, the token is invalid
        }
    }

    public Map<String, Object> extractClaims(String jwtToken) {
        try {
            // Extract claims from the JWT token
            return jwtUtil.extractAllClaims(jwtToken);
        } catch (Exception e) {
            System.err.println("Error extracting claims: " + e.getMessage());
            return new HashMap<>(); // Return an empty map if extraction fails
        }
    }


}
