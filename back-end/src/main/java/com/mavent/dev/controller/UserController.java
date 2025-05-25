package com.mavent.dev.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.mavent.dev.DTO.LoginDTO;
import com.mavent.dev.DTO.YourDataDTO;
import com.mavent.dev.DTO.UserProfileDTO;
import com.mavent.dev.config.CloudConfig;
import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.Item;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.repository.ItemRepository;
import com.mavent.dev.service.AccountService;
import jakarta.servlet.http.HttpServletRequest;
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

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping("/user/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile(HttpServletRequest request) {
        HttpSession session = request.getSession();
        String username = (String) session.getAttribute("username");
        System.out.println("Username from session: " + username);
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

    @GetMapping("/accounts")
    public ResponseEntity<List<Account>> getAllAccounts() {
        List<Account> accounts = accountService.findAllAccount();
        return ResponseEntity.ok(accounts);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO, HttpServletRequest request) {
        HttpSession session = request.getSession();
        boolean success = accountService.checkLogin(loginDTO.getUsername(), loginDTO.getPassword());
        if (success) {
            Account acc = accountRepository.findByUsername(loginDTO.getUsername())
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            // Set session attributes
            session.setAttribute("account", acc);
            session.setAttribute("username", loginDTO.getUsername());
            session.setAttribute("isSuperAdmin", acc.getSystemRole() != null && !acc.getSystemRole().equals("USER"));

//            test session attribute
            String usernameSession = (String) session.getAttribute("username");
            System.out.println("Username from session line 106: " + usernameSession);

            return ResponseEntity.ok("Login successful as " + acc.getUsername() + " with role of " + acc.getSystemRole());
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }
}