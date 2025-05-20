package com.mavent.dev.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.mavent.dev.DTO.YourDataDTO;
import com.mavent.dev.entity.Item;
import com.mavent.dev.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private ItemRepository itemRepository;

    @GetMapping("/greeting")
    public ResponseEntity<String> greet() {
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
}

