package com.mavent.dev.controller;

import com.mavent.dev.DTO.LoginDTO;
import com.mavent.dev.DTO.UserProfileDTO;
import com.mavent.dev.entity.Account;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.service.AccountService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

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
            // Here you can set the account in the session or perform any other logic needed after login
            // For example, you might want to store the account in the session
            session.setAttribute("account", acc);
            session.setAttribute("username", loginDTO.getUsername());
            session.setAttribute("isSuperAdmin", acc.getSystemRole() != null && !acc.getSystemRole().equals("USER"));

            String username = (String) session.getAttribute("username");
            System.out.println("Username from sessionaaa: " + username);
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

    @PutMapping("/user/profile/update")
    public ResponseEntity<Void> updateProfile(@RequestBody UserProfileDTO userProfileDTO, HttpSession session) {
        String username = (String) session.getAttribute("username");
        if (username == null) {
            return ResponseEntity.status(401).build();
        }
        accountService.updateProfile(username, userProfileDTO);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/accounts")
    public ResponseEntity<List<Account>> getAllAccounts() {
        List<Account> accounts = accountService.findAllAccount();
        return ResponseEntity.ok(accounts);
    }
}
