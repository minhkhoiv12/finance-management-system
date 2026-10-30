package com.financial.financialmanager.service;

import com.financial.financialmanager.dto.AuthDTO;
import com.financial.financialmanager.dto.ProfileDTO;
import com.financial.financialmanager.entity.ProfileEntity;
import com.financial.financialmanager.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.financial.financialmanager.security.JwtUtil;
import com.financial.financialmanager.util.PasswordValidator;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    public ProfileDTO registerProfile(ProfileDTO profileDTO) {
        String passwordError = PasswordValidator.validate(profileDTO.getPassword());
        if (passwordError != null) {
            throw new IllegalArgumentException(passwordError);
        }
        ProfileEntity newProfile = toEntity(profileDTO);
        newProfile.setIsActive(true);
        newProfile = profileRepository.save(newProfile);
        return toDTO(newProfile);
    }
    public ProfileEntity toEntity(ProfileDTO profileDTO) {
        return ProfileEntity.builder()
                .id(profileDTO.getId())
                .fullName(profileDTO.getFullName())
                .username(normalizeUsername(profileDTO.getUsername()))
                .password(passwordEncoder.encode(profileDTO.getPassword()))
                .profileImageUrl(profileDTO.getProfileImageUrl())
                .createdAt(profileDTO.getCreatedAt())
                .updateAt(profileDTO.getUpdateAt())
                .build();
    }

    public ProfileDTO toDTO(ProfileEntity profileEntity) {
        return ProfileDTO.builder()
                .id(profileEntity.getId())
                .fullName(profileEntity.getFullName())
                .username(profileEntity.getUsername())
                .profileImageUrl(profileEntity.getProfileImageUrl())
                .createdAt(profileEntity.getCreatedAt())
                .updateAt(profileEntity.getUpdateAt())
                .build();
    }

    public ProfileEntity getCurrentProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = normalizeUsername(authentication.getName());
        return profileRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy tài khoản: " + username));
    }

    public ProfileDTO getPublicProfile(String username) {
        ProfileEntity currentUser = username == null
                ? getCurrentProfile()
                : profileRepository.findByUsernameIgnoreCase(normalizeUsername(username))
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy tài khoản"));
        return toDTO(currentUser);
    }

    // Cập nhật hồ sơ của người dùng hiện tại: chỉ ghi đè các trường được cung cấp
    public ProfileDTO updateMyProfile(ProfileDTO profileDTO) {
        ProfileEntity current = getCurrentProfile();
        if (profileDTO.getFullName() != null && !profileDTO.getFullName().isBlank()) {
            current.setFullName(profileDTO.getFullName().trim());
        }
        if (profileDTO.getProfileImageUrl() != null) {
            String url = profileDTO.getProfileImageUrl().trim();
            current.setProfileImageUrl(url.isEmpty() ? null : url);
        }
        return toDTO(profileRepository.save(current));
    }

    private String normalizeUsername(String username) {
        return username == null ? "" : username.trim().toLowerCase();
    }

    public Map<String, Object> authenticateAndGenerateToken(AuthDTO authDTO) {
        try {
            String username = normalizeUsername(authDTO.getUsername());
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, authDTO.getPassword()));
            return Map.of("token", jwtUtil.generateToken(username), "user", getPublicProfile(username));
        } catch (Exception e) {
            throw new RuntimeException("Tên tài khoản hoặc mật khẩu không đúng");
        }
    }
}