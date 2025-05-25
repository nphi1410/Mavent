package com.mavent.dev.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.mavent.dev.DTO.YourDataDTO;
import com.mavent.dev.DTO.UserProfileDTO;
import com.mavent.dev.config.CloudConfig;
import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.Item;
import com.mavent.dev.repository.ItemRepository;
import com.mavent.dev.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private AccountService accountService;

    // DTO for login request
    public static class LoginRequest {
        public String username;
        public String password;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        // Replace with real authentication logic
        if (accountService.checkLogin(loginRequest.username, loginRequest.password)) {
            session.setAttribute("username", loginRequest.username);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @GetMapping("/user/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile(HttpSession session) {
//        String username = (String) session.getAttribute("username");
        String username = "khoind"; // For testing purposes, replace with session attribute in production
        if (username == null) {
            return ResponseEntity.status(401).build();
        }
        UserProfileDTO profile = accountService.getUserProfile(username);
        return ResponseEntity.ok(profile);
    }
    
    @GetMapping("/greeting")
    public ResponseEntity<String> greet() {
        CloudConfig cloud = new CloudConfig();
        cloud.uploadFile();
        return ResponseEntity.ok("Hello from Spring Boot!");
    }

    @PostMapping("/submit")
    public ResponseEntity<String> submitData(@RequestBody YourDataDTO data) {
        // Process the data
        return ResponseEntity.ok("Received: " + data);
    }

    @GetMapping("/info")
    public ResponseEntity<Item> getItemDetails(@RequestParam String itemId) {
        return ResponseEntity.ok(itemRepository.findByItemId(itemId));
    }

    @GetMapping("/item")
    public ResponseEntity<List<Item>> getItems(){
        List<Item> items = itemRepository.findAll();

        System.out.println(items.get(0).toString());
        return  ResponseEntity.ok(items);
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

    @PostMapping("/user/avatar")
    public ResponseEntity<String> uploadAvatar(@RequestParam("file") MultipartFile file, HttpSession session) throws IOException {
        String username = (String) session.getAttribute("username");
        if (username == null) {
            return ResponseEntity.status(401).build();
        }
        String avatarUrl = accountService.uploadAvatar(username, file.getBytes(), file.getOriginalFilename());
        return ResponseEntity.ok(avatarUrl);
    }

    @GetMapping("/accounts")
    public ResponseEntity<List<Account>> getAllAccounts() {
        List<Account> accounts = accountService.findAllAccount();
        return ResponseEntity.ok(accounts);
    }
}
