package com.financial.financialmanager.service;

import com.financial.financialmanager.entity.ProfileEntity;
import com.financial.financialmanager.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AppUserDetailService implements UserDetailsService {
    private final ProfileRepository profileRepository;
    @Override
    public UserDetails loadUserByUsername(String username) {
        String normalizedUsername = username == null ? "" : username.trim().toLowerCase();
        ProfileEntity existingProfile = profileRepository.findByUsernameIgnoreCase(normalizedUsername)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy tài khoản: " + normalizedUsername));
        return User.builder()
                // JWT subjects use the normalized lowercase account name.
                // Returning the same value keeps token validation case-insensitive.
                .username(normalizedUsername)
                .password(existingProfile.getPassword())
                .authorities(Collections.emptyList())
                .build();

    }
}
