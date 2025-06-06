package com.mavent.dev.controller;

import com.mavent.dev.DTO.superadmin.AccountDTO;
import com.mavent.dev.DTO.LoginDTO;
import com.mavent.dev.DTO.UserProfileDTO;
import com.mavent.dev.DTO.OtpDTO;
import com.mavent.dev.DTO.ChangePasswordDTO;
import com.mavent.dev.DTO.TaskDTO;
import com.mavent.dev.DTO.superadmin.EventDTO;
import com.mavent.dev.DTO.UserEventDTO;
import com.mavent.dev.config.MailConfig;

import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.EventAccountRole;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.repository.EventAccountRoleRepository;
import com.mavent.dev.service.AccountService;
import com.mavent.dev.service.EventService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import com.mavent.dev.config.CloudConfig;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AccountController {    @Autowired
    private AccountService accountService;
    @Autowired
    private EventService eventService;@Autowired
    AccountRepository accountRepository;

    @Autowired
    private EventAccountRoleRepository eventAccountRoleRepository;

    @Autowired
    private MailConfig mailConfig;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/accounts")
    public ResponseEntity<List<AccountDTO>> getAllAccounts() {
        List<AccountDTO> accounts = accountService.getAllAccounts();
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/accounts/{id}")
    public ResponseEntity<?> getAccountById(@PathVariable Integer id) {
        try {
            AccountDTO accountDTO = accountService.getAccountById(id);
            return ResponseEntity.ok(accountDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Account not found with ID: " + id);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO, HttpServletRequest request) {
        System.out.println("Login attempt with username/email: " + loginDTO.getUsername());
        System.out.println("Password: " + loginDTO.getPassword());
        HttpSession session = request.getSession();
        boolean success = accountService.checkLogin(loginDTO.getUsername(), loginDTO.getPassword());
        if (success) {
//            System.out.println("Login successful for username/email: " + loginDTO.getUsername());
            try {
                Account acc = null;
                if (accountService.getAccount(loginDTO.getUsername()) == null) {
                    acc = accountService.getAccountByEmail(loginDTO.getUsername());
                } else {
                    acc = accountService.getAccount(loginDTO.getUsername());
                }

//                if (acc == null) {
//                    System.out.println("Account not found by username, trying to find by email: " + loginDTO.getUsername());
//                    acc = accountByEmail;
//                }
//            if (acc == null) {
//                System.out.println("Invalid login attempt for username/email: " + loginDTO.getUsername());
//                return ResponseEntity.status(401).body("Invalid username or password");
//            } else {
//                System.out.println("Account found by email: " + acc.getEmail());
//            }
                session.setAttribute("email", acc.getEmail());
//            if (accByEmail != null) System.out.println("Account found by email: " + (accByEmail != null ? accByEmail.getUsername() : "null"));
                session.setAttribute("username", acc.getUsername());
                session.setAttribute("account", acc);
                session.setAttribute("isSuperAdmin", acc.getSystemRole() == Account.SystemRole.SUPER_ADMIN);

                String username = (String) session.getAttribute("username");
                System.out.println("Username from session: " + username);
                System.out.println("Session ID: " + session.getId());
                System.out.println("encoded password: " + acc.getPasswordHash());

                boolean isSuperAdmin = acc.getSystemRole() == Account.SystemRole.SUPER_ADMIN;
                String redirectUrl = isSuperAdmin ? "/superadmin" : "/profile";
                System.out.println("Redirect URL: " + redirectUrl);
                return ResponseEntity.ok(redirectUrl);
            } catch (Exception e) {
                System.out.println("Error during login: " + e.getMessage());
                return ResponseEntity.status(500).body("Internal server error");
            }
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    @PostMapping("/send-register-otp")
    public ResponseEntity<?> sendOtp(@RequestBody com.mavent.dev.DTO.RegisterDTO request, HttpSession session) {
        if (accountService.getAccount(request.getUsername()) != null) {
            return ResponseEntity.badRequest().body("Username already exists!");
        }
        // Check if email already exists
        if (accountService.getAccountByEmail(request.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Email already exists!");
        }

        String otp = accountService.getRandomOTP();
        mailConfig.sendMail(request.getEmail(), "Your OTP Code for Account Registration at Mavent", "Your OTP code for Account Registration at Mavent is: " + otp);

        // Lưu vào session
        session.setAttribute("register_username", request.getUsername());
        session.setAttribute("register_email", request.getEmail());
//        session.setAttribute("register_password", passwordEncoder.encode(request.getPassword()));
        session.setAttribute("register_password", passwordEncoder.encode(request.getPassword()));
        System.out.println("Encoded Password: " + passwordEncoder.encode(request.getPassword()));
        session.setAttribute("register_otp", otp);
        session.setAttribute("register_time", System.currentTimeMillis());

        return ResponseEntity.ok("OTP was sent to email " + request.getEmail());
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerWithOtp(@RequestBody com.mavent.dev.DTO.OtpDTO request, HttpSession session) {
        String otpSession = (String) session.getAttribute("register_otp");
        String username = (String) session.getAttribute("register_username");
        String email = (String) session.getAttribute("register_email");
        String encodedPassword = (String) session.getAttribute("register_password");
//        String email = request.getEmail();
//        String username = accountDTO.getUsername();
//        String encodedPassword = accountDTO.getPassword();
        System.out.println("Username from session: " + username);
        System.out.println("Email from session: " + email);
        System.out.println("Encoded Password from session: " + encodedPassword);
        Long time = (Long) session.getAttribute("register_time");
        if (accountService.isOtpTrue(otpSession, time, request.getOtp()) != null) {;
            return ResponseEntity.badRequest().body(accountService.isOtpTrue(otpSession, time, request.getOtp()));
        }

        Account newAccount = new Account(username, email, encodedPassword);
        accountRepository.save(newAccount);

        session.invalidate();

        return ResponseEntity.ok("Registration successful! You can now log in with your new account.");
    }

    @PostMapping("/reset-password-request")
    public ResponseEntity<?> resetPasswordRequest(@RequestBody com.mavent.dev.DTO.ResetPasswordDTO request, HttpSession session) {
        Account account = accountRepository.findByEmail(request.getEmail());
        if (account == null) {
            return ResponseEntity.badRequest().body("Email not found");
        }

        String otp = accountService.getRandomOTP();
        mailConfig.sendMail(request.getEmail(), "Your OTP Code for Reset Password at Mavent", "Your OTP code for Reset Password at Mavent is: " + otp);

        session.setAttribute("reset_email", request.getEmail());
        session.setAttribute("reset_otp", otp);
        session.setAttribute("reset_time", System.currentTimeMillis());

        return ResponseEntity.ok("OTP was sent to email " + request.getEmail());
    }

    @PostMapping("/verify-reset-otp")
    public ResponseEntity<?> verifyResetOtp(@RequestBody OtpDTO request, HttpSession session) {
        String otpSession = (String) session.getAttribute("reset_otp");
        String email = (String) session.getAttribute("reset_email");
        Long time = (Long) session.getAttribute("reset_time");

        if (accountService.isOtpTrue(otpSession, time, request.getOtp()) != null) {
            return ResponseEntity.badRequest().body(accountService.isOtpTrue(otpSession, time, request.getOtp()));
        }

        String newPassword = accountService.getRandomPassword(10);
        Account account = accountRepository.findByEmail(email);
        if (account == null) {
            return ResponseEntity.badRequest().body("Email not found");
        }
        account.setPasswordHash(passwordEncoder.encode(newPassword));
        accountRepository.save(account);
        mailConfig.sendMail(email, "Your New Password for Mavent", "Your new password is: " + newPassword);

        return ResponseEntity.ok("Account password is reset successfully. You can now reset your password.");
    }

    @PostMapping("/verify-password")
    public ResponseEntity<?> verifyPassword(@RequestBody ChangePasswordDTO changePasswordDTO, HttpSession session) {
        String username = (String) session.getAttribute("username");
        System.out.println("(AccountController.verifyPassword) Username from session: " + username);
        System.out.println("Session ID: " + session.getId());
        System.out.println("old password: " + changePasswordDTO.getOldPassword());
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User must be logged in");
        }

        Account account = accountService.getAccount(username);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Account not found");
        }

        if (!passwordEncoder.matches(changePasswordDTO.getOldPassword(), account.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Old password is incorrect");
        }

        return ResponseEntity.ok("Password is true, you can change your password now.");
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDTO changePasswordDTO, HttpSession session) {
        String username = (String) session.getAttribute("username");
        try {
            Account account = accountService.getAccount(username);
            account.setPasswordHash(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
            accountService.save(account);

            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            System.out.println("Error changing password: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error changing password: " + e.getMessage());
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

            Account account = accountService.getAccount(username);
            account.setAvatarUrl(keyName);
            accountService.save(account);

            return ResponseEntity.ok().body(Map.of(
                    "avatarUrl", keyName,
                    "message", "Avatar updated successfully"
            ));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading avatar: " + e.getMessage());
        }
    }

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
        EventDTO event = null;
        String evName = null;

        if (eventName != null && !eventName.isEmpty()) {
            try {
                event = eventService.getEventById(Integer.parseInt(eventName));
                if (event != null) {
                    evName = event.getName();
                    System.out.println("Event Name: " + evName);
                }
            } catch (NumberFormatException e) {
                System.err.println("Invalid event ID format: " + eventName);
                return ResponseEntity.badRequest().build(); // hoặc trả về danh sách rỗng
            }
        }
        List<TaskDTO> tasks = accountService.getUserTasks(
                account.getAccountId(),
                status,
                priority,
                keyword,
                sortOrder,
                evName);
        return ResponseEntity.ok(tasks);
    }    @GetMapping("/user/events")
    public ResponseEntity<?> getUserEvents(HttpSession session) {
        Account account = (Account) session.getAttribute("account");
        if (account == null) {
            return ResponseEntity.status(401).body("Bạn cần đăng nhập");
        }

        List<UserEventDTO> events = accountService.getUserEvents(account.getAccountId());
        System.out.println("accid" + account.getAccountId());
        return ResponseEntity.ok(events);
    }

    /**
     * Get the current user's role in a specific event.
     * This endpoint is used by the frontend role-based permission system.
     * 
     * @param eventId the event ID
     * @param session the HTTP session
     * @return the user's role in the event or 401 if not authenticated
     */
    @GetMapping("/user/role/{eventId}")
    public ResponseEntity<?> getUserRoleInEvent(@PathVariable Integer eventId, HttpSession session) {
        // Get current user from session
        String username = (String) session.getAttribute("username");
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User must be logged in");
        }

        try {
            // Get account by username
            Account account = accountService.getAccount(username);
            if (account == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Account not found");
            }            // Find user's role in the event
            Optional<EventAccountRole> userRole = eventAccountRoleRepository
                    .findByEventIdAndAccountId(eventId, account.getAccountId());

            if (userRole.isPresent() && userRole.get().getIsActive()) {
                // Return the role as a string
                Map<String, Object> response = new HashMap<>();
                response.put("role", userRole.get().getEventRole().name());
                response.put("eventId", eventId);
                response.put("accountId", account.getAccountId());
                response.put("isActive", userRole.get().getIsActive());
                return ResponseEntity.ok(response);
            } else {
                // User is not a member of this event or is inactive
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("User is not authorized to access this event");
            }
        } catch (Exception e) {
            System.err.println("Error getting user role in event: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user role: " + e.getMessage());
        }
    }

}



