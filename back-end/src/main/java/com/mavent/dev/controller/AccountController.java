package com.mavent.dev.controller;

<<<<<<< Updated upstream
import com.mavent.dev.DTO.LoginDTO;
import com.mavent.dev.DTO.UserProfileDTO;
=======
import com.mavent.dev.DTO.*;
>>>>>>> Stashed changes
import com.mavent.dev.entity.Account;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.service.AccountService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import com.mavent.dev.config.CloudConfig;  // Adjust the package path based on your project structure
import java.io.IOException;
import java.util.Map;
import java.util.HashMap;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AccountController {
    @Value("${aws.bucket}")
    private String bucket;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AccountService accountService;

    // DTO for login request
    public static class LoginRequest {
        public String username;
        public String password;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO, HttpServletRequest request) {
        HttpSession session = request.getSession();
        boolean success = accountService.checkLogin(loginDTO.getUsername(), loginDTO.getPassword());
        if (success) {
            Account acc = accountRepository.findByUsername(loginDTO.getUsername())
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            session.setAttribute("account", acc);
            session.setAttribute("username", loginDTO.getUsername());
            session.setAttribute("isSuperAdmin", acc.getSystemRole() == Account.SystemRole.SUPER_ADMIN);

            String username = (String) session.getAttribute("username");
            System.out.println("Username from session: " + username);
            System.out.println("Session ID: " + session.getId());

            return ResponseEntity.ok("Login successful as " + acc.getSystemRole());
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    @GetMapping("/user/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile(HttpServletRequest request) {
        HttpSession session = request.getSession();
        String username = (String) session.getAttribute("username");
        System.out.println("Username from session: " + username);
        System.out.println("Session ID: " + session.getId());
        if (username == null) {
            return ResponseEntity.status(401).build();
        }
        UserProfileDTO profile = accountService.getUserProfile(username);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/user/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserProfileDTO userProfileDTO, HttpSession session) {
        String username = (String) session.getAttribute("username");
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User must be logged in");
        }

        try {
            UserProfileDTO updatedProfile = accountService.updateProfile(username, userProfileDTO);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating profile: " + e.getMessage());
        }
    }

    @PostMapping("/user/avatar")
    public ResponseEntity<?> updateAvatar(@RequestParam("file") MultipartFile file, HttpSession session) {
        String username = (String) session.getAttribute("username");
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User must be logged in");
        }

        try {
            CloudConfig cloudConfig = new CloudConfig();
            String folder = "avatars";
            String fileName = file.getOriginalFilename();
            String keyName = folder + "/" + fileName;

            cloudConfig.uploadMultipartFile(file, folder);

<<<<<<< Updated upstream
            String imageUrl = "https://s3.us-east-005.backblazeb2.com/Mavent/" + keyName;

            Account account = accountRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            account.setAvatarImg(imageUrl);
            accountRepository.save(account);
=======
            Account account = accountService.getAccount(username);
            account.setAvatarUrl(keyName);
            accountService.save(account);
>>>>>>> Stashed changes

            return ResponseEntity.ok().body(Map.of(
                    "avatarUrl", imageUrl,
                    "message", "Avatar updated successfully"
            ));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading avatar: " + e.getMessage());
        }
    }

<<<<<<< Updated upstream
=======
    @GetMapping("/user/tasks")
    public ResponseEntity<List<TaskDTO>> getUserTasks(
            HttpSession session,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sortOrder,
            @RequestParam(required = false) String eventName) {  // Add this line
        Account account = (Account) session.getAttribute("account");
        if (account == null) {
            return ResponseEntity.status(401).build();
        }

        List<TaskDTO> tasks = accountService.getUserTasks(
                account.getAccountId(),
                status,
                priority,
                keyword,
                sortOrder,
                eventName);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/user/events")
    public ResponseEntity<?> getUserEvents(HttpSession session) {
        Account account = (Account) session.getAttribute("account");
        if (account == null) {
            return ResponseEntity.status(401).body("Bạn cần đăng nhập");
        }

        List<UserEventDTO> events = accountService.getUserEvents(account.getAccountId());
        System.out.println("accid" + account.getAccountId());
        return ResponseEntity.ok(events);
    }


>>>>>>> Stashed changes
}


