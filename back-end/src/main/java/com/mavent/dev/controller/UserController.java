package com.mavent.dev.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    @GetMapping("/greeting")
    public ResponseEntity<String> greet() {
        return ResponseEntity.ok("Hello from Spring Boot!");
    }


}

