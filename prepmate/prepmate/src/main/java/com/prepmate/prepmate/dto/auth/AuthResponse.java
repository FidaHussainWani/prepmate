package com.prepmate.prepmate.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private String message;
    private Long userId;
    private String name;
    private String email;
    private String token;
}