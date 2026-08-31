package com.servexa.config;

import com.servexa.model.Provider;
import com.servexa.model.Role;
import com.servexa.model.User;
import com.servexa.repository.ProviderRepository;
import com.servexa.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DummyProviderSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("dummy_appliance2@servexa.com")) {
            User user = User.builder()
                    .fullName("Appliance Master")
                    .email("dummy_appliance2@servexa.com")
                    .password(passwordEncoder.encode("password123"))
                    .phone("9999999999")
                    .address("Chennai")
                    .role(Role.PROVIDER)
                    .isBlocked(false)
                    .build();

            Provider provider = Provider.builder()
                    .user(user)
                    .serviceCategory("Appliance Repair")
                    .serviceArea("Chennai")
                    .startingPrice(450.0)
                    .averageRating(4.8)
                    .completedJobs(15)
                    .description("Expert in fixing ACs, Fridges, and Washing Machines.")
                    .isVerified(true)
                    .isApprovedByAdmin(true)
                    .build();
            providerRepository.save(provider);
            
            System.out.println("DUMMY APPLIANCE REPAIR PROVIDER CREATED!");
        }
    }
}
