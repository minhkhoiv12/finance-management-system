package com.financial.financialmanager.controller;

import com.financial.financialmanager.dto.AuthDTO;
import com.financial.financialmanager.dto.ProfileDTO;
import com.financial.financialmanager.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;
    @PostMapping("/register")
    public ResponseEntity<?> registerProfile(@RequestBody ProfileDTO profileDTO) {
        try {
            ProfileDTO registeredProfile = profileService.registerProfile(profileDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredProfile);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Đăng ký không thành công. Vui lòng thử lại."));
        }
    }
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AuthDTO authDTO) {
        try {
            Map<String, Object> response = profileService.authenticateAndGenerateToken(authDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Tên tài khoản hoặc mật khẩu không đúng"));
        }
    }
    @GetMapping("/profile")
    public ResponseEntity<ProfileDTO> getPublicProfile() {
        ProfileDTO profileDTO = profileService.getPublicProfile(null);
        return ResponseEntity.ok(profileDTO);
    }

    // Cập nhật hồ sơ người dùng hiện tại (họ tên, ảnh đại diện)
    @PutMapping("/profile")
    public ResponseEntity<?> updateMyProfile(@RequestBody ProfileDTO profileDTO) {
        try {
            ProfileDTO updated = profileService.updateMyProfile(profileDTO);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cập nhật hồ sơ không thành công. Vui lòng thử lại."));
        }
    }

}
