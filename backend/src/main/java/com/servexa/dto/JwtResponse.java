package com.servexa.dto;

import com.servexa.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JwtResponse {
    private String token;
    private Long id;
    private String fullName;
    private String email;
    private Role role;
}
