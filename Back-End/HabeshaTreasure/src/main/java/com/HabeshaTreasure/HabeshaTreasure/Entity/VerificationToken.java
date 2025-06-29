package com.HabeshaTreasure.HabeshaTreasure.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class VerificationToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    public VerificationToken(String token, User givenUser, LocalDateTime localDateTime) {
        this.setToken(token);
        this.setUser(givenUser);
        this.setExpiryDate(localDateTime);
    }
}

