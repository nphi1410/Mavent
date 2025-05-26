package com.mavent.dev.controller;

import com.mavent.dev.entity.Account;
import com.mavent.dev.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
public class AccountController {

    @Autowired
    AccountService accountService;

    @GetMapping()
    public ResponseEntity<String> greet() {
        return ResponseEntity.ok("Hello from Login!");
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Account accountInfo){
        accountService.register(accountInfo);
        return ResponseEntity.ok("Register success");
    }
}
