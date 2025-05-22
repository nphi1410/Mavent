package com.mavent.dev.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
public class AccountController {
    @GetMapping()
    public ResponseEntity<String> greet() {
        return ResponseEntity.ok("Hello from Login!");
    }
}
