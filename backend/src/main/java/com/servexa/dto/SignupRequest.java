package com.servexa.dto;

import com.servexa.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 50)
    private String fullName;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @NotBlank
    private String phone;

    private String address;
    private String profileImageUrl;
    private Role role; // Nullable if strictly customer, but good for Admin creation or Provider signup
    private String serviceCategory; // For providers
}
