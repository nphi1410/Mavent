package com.mavent.dev.controller;

import com.mavent.dev.DTO.LoginDTO;
import com.mavent.dev.entity.Account;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.service.AccountService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Handler;

@RestController
@RequestMapping("/login")
public class AccountController {

    @Autowired
    AccountService accountService;
    @Autowired
    private AccountRepository accountRepository;

    @GetMapping()
    public ResponseEntity<String> greet() {
        return ResponseEntity.ok("Hello from Login!");
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Account accountInfo){
        accountService.register(accountInfo);
        return ResponseEntity.ok("Register success");
    }

    @PostMapping()
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO, HttpSession session) {
        boolean success = accountService.checkLogin(loginDTO.getUsername(), loginDTO.getPassword());
        if (success) {
            Account acc = accountRepository.findByUsername(loginDTO.getUsername())
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            // Here you can set the account in the session or perform any other logic needed after login
            // For example, you might want to store the account in the session
            session.setAttribute("account", acc);
            session.setAttribute("username", loginDTO.getUsername());
            session.setAttribute("isSuperAdmin", acc.getSystemRole() != null && !acc.getSystemRole().equals("USER"));

            return ResponseEntity.ok("Login successful as " + acc.getSystemRole());
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }
}
