package com.mavent.dev.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.mavent.dev.DTO.YourDataDTO;
import com.mavent.dev.DTO.UserProfileDTO;
import com.mavent.dev.config.CloudConfig;
import com.mavent.dev.entity.Item;
import com.mavent.dev.repository.ItemRepository;
import com.mavent.dev.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private AccountService accountService;

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

    @GetMapping("/user/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile() {
        String username = "khoind";
        UserProfileDTO profile = accountService.getUserProfile(username);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/user/profile/update")
    public ResponseEntity<Void> updateProfile(@RequestBody UserProfileDTO userProfileDTO) {
        String username = "testuser";
        accountService.updateProfile(username, userProfileDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/user/avatar")
    public ResponseEntity<String> uploadAvatar(@RequestParam("file") MultipartFile file) throws IOException {
        String username = "testuser";
        String avatarUrl = accountService.uploadAvatar(username, file.getBytes(), file.getOriginalFilename());
        return ResponseEntity.ok(avatarUrl);
    }
}
