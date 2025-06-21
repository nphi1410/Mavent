package com.mavent.dev.controller;

import com.mavent.dev.dto.*;
import com.mavent.dev.dto.superadmin.AccountDTO;
import com.mavent.dev.dto.superadmin.EventDTO;
import com.mavent.dev.config.MailConfig;
import com.mavent.dev.dto.task.*;
import com.mavent.dev.dto.userAuthentication.*;
import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.EventAccountRole;
import com.mavent.dev.mapper.AccountMapper;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.repository.EventAccountRoleRepository;
import com.mavent.dev.service.AccountService;
import com.mavent.dev.service.EventService;
import com.mavent.dev.service.JwtBlacklistService;
import com.mavent.dev.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
//import com.mavent.dev.config.CloudConfig;
import com.mavent.dev.service.globalservice.CloudService;

import javax.naming.AuthenticationException;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AccountController {
    @Autowired
    private AccountService accountService;
    @Autowired
    private EventService eventService;
    @Autowired
    AccountRepository accountRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EventAccountRoleRepository eventAccountRoleRepository;

    @Autowired
    private MailConfig mailConfig;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtBlacklistService jwtBlacklistService;

    @Autowired
    private CloudService cloudService;

    @GetMapping("/accounts")
    public ResponseEntity<List<AccountDTO>> getAllAccounts() {
        List<AccountDTO> accounts = accountService.getAllAccounts();
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/accounts/{id}")
    public ResponseEntity<?> getAccountById(@PathVariable Integer id) {
        try {
            Account account = accountService.getAccountById(id);
            AccountDTO accountDTO = AccountMapper.toDTO(account);
            return ResponseEntity.ok(accountDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Account not found with ID: " + id);
        }
    }

    @PostMapping("/public/login")
    public ResponseEntity<?> authenticate(@RequestBody AuthRequestDTO authRequestDTO) throws AuthenticationException {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequestDTO.getUsername(), authRequestDTO.getPassword())
        );

        Account account = accountService.getAccount(authRequestDTO.getUsername());
        String jwt = jwtUtil.generateToken(account);
        return ResponseEntity.ok(new AuthResponseDTO(jwt));
    }

    @PostMapping("/public/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            jwtBlacklistService.blacklistToken(token);
            System.out.println("Token blacklisted: " + token);
            return ResponseEntity.ok("Successfully logged out");
        }

        return ResponseEntity.badRequest().body("No token provided");
    }

    @PostMapping("/public/send-register-otp")
    public ResponseEntity<?> sendOtp(@RequestBody RegisterDTO request, HttpSession session) {
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
        session.setAttribute("register_password", passwordEncoder.encode(request.getPassword()));
//        System.out.println("Encoded Password: " + passwordEncoder.encode(request.getPassword()));
        session.setAttribute("register_otp", otp);
        session.setAttribute("register_time", System.currentTimeMillis());

        return ResponseEntity.ok("OTP was sent to email " + request.getEmail());
    }

    @PostMapping("/public/register")
    public ResponseEntity<?> registerWithOtp(@RequestBody OtpDTO request, HttpSession session) {
        String otpSession = (String) session.getAttribute("register_otp");
        String username = (String) session.getAttribute("register_username");
        String email = (String) session.getAttribute("register_email");
        String encodedPassword = (String) session.getAttribute("register_password");
//        System.out.println("Username from session: " + username);
//        System.out.println("Email from session: " + email);
//        System.out.println("Encoded Password from session: " + encodedPassword);
        Long time = (Long) session.getAttribute("register_time");
        if (accountService.isOtpTrue(otpSession, time, request.getOtp()) != null) {
            return ResponseEntity.badRequest().body(accountService.isOtpTrue(otpSession, time, request.getOtp()));
        }

        Account newAccount = new Account(username, email, encodedPassword);
        accountRepository.save(newAccount);

        session.invalidate();

        return ResponseEntity.ok("Registration successful! You can now log in with your new account.");
    }

    @PostMapping("/public/reset-password-request")
    public ResponseEntity<?> resetPasswordRequest(@RequestBody ResetPasswordDTO request, HttpSession session) {
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

    @PostMapping("/public/verify-reset-otp")
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
    public ResponseEntity<?> verifyPassword(@RequestBody ChangePasswordDTO changePasswordDTO, HttpServletRequest request) {
        // Lấy token từ header Authorization
        String username = jwtUtil.extractUsername(request.getHeader("Authorization").substring(7));

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
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDTO changePasswordDTO, HttpServletRequest request) {
        // Lấy token từ header Authorization
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You need to log in to change your password");
        }

        String token = authHeader.substring(7);
        String username;

        try {
            username = jwtUtil.extractUsername(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token không hợp lệ");
        }

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
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7); // Strip "Bearer "
        String username;

        try {
            username = jwtUtil.extractUsername(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Account account = accountService.getAccount(username);

        if (account == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        UserProfileDTO profile = accountService.getUserProfile(username);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/user/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserProfileDTO userProfileDTO, HttpServletRequest request) {
        // Lấy token từ header Authorization
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn cần đăng nhập để cập nhật hồ sơ");
        }

        String token = authHeader.substring(7);
        String username;

        try {
            username = jwtUtil.extractUsername(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token không hợp lệ");
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
    public ResponseEntity<?> updateAvatar(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        // Lấy token từ header Authorization
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn cần đăng nhập để cập nhật avatar");
        }

        String token = authHeader.substring(7);
        String username;

        try {
            username = jwtUtil.extractUsername(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token không hợp lệ");
        }

        try {
            String containerName = "maventcontainer";


            // Get the account to retrieve existing avatar URL if any
            Account account = accountService.getAccount(username);
            String oldAvatarUrl = account.getAvatarUrl();

            // Upload the new avatar to Azure Blob Storage
            String fileUrl = cloudService.uploadFile(file, containerName);

            // Extract blob name from the URL for future reference
            String blobName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            String avatarPath = cloudService.getFileUrl(blobName, containerName);

            // Save the new avatar URL to the account
            account.setAvatarUrl(avatarPath);
            accountService.save(account);

            // Delete old avatar if it exists
            if (oldAvatarUrl != null && !oldAvatarUrl.isEmpty()) {
                // Extract old blob name from the path
                String oldBlobName = oldAvatarUrl.substring(oldAvatarUrl.lastIndexOf("/") + 1);
                cloudService.deleteFile(oldBlobName, containerName);
            }

            return ResponseEntity.ok().body(Map.of(
                    "avatarUrl", avatarPath,
                    "message", "Avatar updated successfully"
            ));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading avatar: " + e.getMessage());
        }
    }

    @GetMapping("/user/tasks")
    public ResponseEntity<List<TaskDTO>> getUserTasks(
            HttpServletRequest request,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sortOrder,
            @RequestParam(required = false) String eventName) {

        // Lấy token từ header Authorization
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);
        String username;

        try {
            username = jwtUtil.extractUsername(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Account account = accountService.getAccount(username);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
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
                return ResponseEntity.badRequest().build();
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
    }

    @GetMapping("/user/tasks/{taskId}")
    public ResponseEntity<TaskDTO> getTaskDetails(
            @PathVariable Integer taskId,
            HttpServletRequest request) {

        // Lấy token từ header Authorization
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);
        String username;

        try {
            username = jwtUtil.extractUsername(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Account account = accountService.getAccount(username);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        try {
            TaskDTO taskDetails = accountService.getTaskDetails(account.getAccountId(), taskId);
            if (taskDetails == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(taskDetails);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/user/tasks/{taskId}/attendees")
    public ResponseEntity<?> getTaskAttendees(
            @PathVariable Integer taskId,
            HttpServletRequest request) {

        // Authenticate user
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);
        Account account = accountService.getAccount(username);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Check if the user has access to this task (creator or assignee)
        TaskDTO task = accountService.getTaskDetails(account.getAccountId(), taskId);
        if (task == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        // Get the task attendees
        try {
            List<TaskAttendeeDTO> attendees = accountService.getTaskAttendees(taskId);
            return ResponseEntity.ok(attendees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PatchMapping("/user/tasks/{taskId}/status")
    public ResponseEntity<?> updateTaskStatus(
            @PathVariable Integer taskId,
            @RequestBody TaskStatusUpdateDTO statusUpdateDTO,
            HttpServletRequest request) {

        // Lấy token từ header Authorization
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn cần đăng nhập để cập nhật trạng thái task");
        }

        String token = authHeader.substring(7);
        String username;

        try {
            username = jwtUtil.extractUsername(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token không hợp lệ");
        }

        Account account = accountService.getAccount(username);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tài khoản không tồn tại");
        }

        try {
            // Lấy thông tin task hiện tại qua AccountService
            TaskDTO currentTask = accountService.getTaskDetails(account.getAccountId(), taskId);
            if (currentTask == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Không tìm thấy task với ID: " + taskId);
            }

            String newStatus = statusUpdateDTO.getStatus();
            String currentStatus = currentTask.getStatus();

            // Kiểm tra luồng cập nhật trạng thái hợp lệ
            boolean isValidTransition = false;
            boolean needsCreatorPermission = false;

            if ("TODO".equals(currentStatus) && "DOING".equals(newStatus)) {
                isValidTransition = true;
            } else if ("DOING".equals(currentStatus) && "REVIEW".equals(newStatus)) {
                isValidTransition = true;
            } else if ("REVIEW".equals(currentStatus) && "DONE".equals(newStatus)) {
                isValidTransition = true;
                needsCreatorPermission = true;
            }

            if (!isValidTransition) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Không thể chuyển trạng thái từ " + currentStatus + " sang " + newStatus);
            }

            // Nếu cần quyền người giao task, kiểm tra thông qua AccountService (bằng DTO)
            if (needsCreatorPermission) {
                if (!account.getAccountId().equals(currentTask.getAssignedByAccountId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("Chỉ người giao task mới có thể chuyển trạng thái task này sang DONE");
                }
            }

            // Thực hiện cập nhật trạng thái qua AccountService
            TaskDTO updatedTask = accountService.updateTaskStatus(taskId, newStatus);
            return ResponseEntity.ok(updatedTask);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi cập nhật trạng thái task: " + e.getMessage());
        }
    }

    @PostMapping("/user/tasks")
    public ResponseEntity<Object> createTask(
            @RequestBody TaskCreateDTO taskCreateDTO,
            HttpServletRequest request) {

        // Lấy token từ header Authorization
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn cần đăng nhập để tạo task");
        }
        System.out.println("Creating task with DTO: " + taskCreateDTO);
        String token = authHeader.substring(7);
        String username;

        try {
            username = jwtUtil.extractUsername(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token không hợp lệ");
        }

        Account account = accountService.getAccount(username);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("You must be logged in to create tasks.");
        }

        boolean hasPermission = accountService.hasCreateTaskPermission(taskCreateDTO.getEventId(), account.getAccountId());

        if (!hasPermission) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You don't have permission to create tasks for this event.");
        }

        try {
            TaskDTO createdTask = accountService.createTask(taskCreateDTO, account);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating task: " + e.getMessage());
        }
    }

    @PutMapping("/user/tasks/{taskId}")
    public ResponseEntity<TaskDTO> updateTask(
            @PathVariable Integer taskId,
            @RequestBody TaskCreateDTO updateDto,
            HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);
        Account account = accountService.getAccount(username);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        TaskDTO current = accountService.getTaskDetails(account.getAccountId(), taskId);
        if (current == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        if (!account.getAccountId().equals(current.getAssignedByAccountId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        TaskDTO updated = accountService.updateTask(taskId, updateDto);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/user/tasks/{taskId}/feedback")
    public ResponseEntity<?> createTaskFeedback(
            @PathVariable Integer taskId,
            @RequestBody TaskFeedbackDTO feedbackDto,
            HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);
        Account account = accountService.getAccount(username);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        TaskFeedbackDTO created = accountService.createTaskFeedback(
            taskId,
            account.getAccountId(),
            feedbackDto.getComment()
        );

        if (created == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You don't have permission to create feedback for this task.");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/user/tasks/{taskId}/feedback")
    public ResponseEntity<List<TaskFeedbackDTO>> viewTaskFeedback(
            @PathVariable Integer taskId,
            HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);
        var account = accountService.getAccount(username);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            var feedbacks = accountService.getTaskFeedback(taskId, account.getAccountId());
            return ResponseEntity.ok(feedbacks);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Cần thêm endpoint này trong EventController trên backend
    @GetMapping("/events/{eventId}/members")
    public ResponseEntity<List<EventMemberDTO>> getEventMembers(@PathVariable Integer eventId, HttpServletRequest request) {
        // Lấy token từ header Authorization
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);
        String username;

        try {
            username = jwtUtil.extractUsername(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Account account = accountService.getAccount(username);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        // Kiểm tra quyền truy cập
        boolean hasAccess = eventService.checkEventAccess(eventId, account.getAccountId());
        if (!hasAccess) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<EventMemberDTO> members = eventService.getEventMembers(eventId);
        return ResponseEntity.ok(members);
    }

    @GetMapping("/user/events")
    public ResponseEntity<?> getUserEvents(HttpServletRequest request) {
        // Lấy token từ header Authorization
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn cần đăng nhập để xem sự kiện");
        }

        String token = authHeader.substring(7);
        String username;

        try {
            username = jwtUtil.extractUsername(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token không hợp lệ");
        }

        Account account = accountService.getAccount(username);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tài khoản không tồn tại");
        }

        List<UserEventDTO> events = accountService.getUserEvents(account.getAccountId());
        System.out.println("accid " + account.getAccountId());
        return ResponseEntity.ok(events);
    }

    /**
     * Get the current user's role in a specific event.
     * This endpoint is used by the frontend role-based permission system.
     *
     * @param eventId the event ID
     * @param request the HTTP request
     * @return the user's role in the event or 401 if not authenticated
     */
    @GetMapping("/user/role/{eventId}")
    public ResponseEntity<?> getUserRoleInEvent(@PathVariable Integer eventId, HttpServletRequest request) {
        // Lấy token từ header Authorization
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User must be logged in");
        }

        String token = authHeader.substring(7);
        String username;

        try {
            username = jwtUtil.extractUsername(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token không hợp lệ");
        }

        try {
            // Get account by username
            Account account = accountService.getAccount(username);
            if (account == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Account not found");
            }

            // Find user's role in the event
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

    @PutMapping("/user/tasks/{taskId}/attendees")
    public ResponseEntity<?> updateTaskAttendees(
            @PathVariable Integer taskId,
            @RequestBody Map<String, List<Integer>> request,
            HttpServletRequest httpRequest) {

        // Xác thực người dùng từ token
        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        System.out.println("Updating attendees for task ID: " + taskId);
        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);
        Account account = accountService.getAccount(username);
        
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        System.out.println("Account ID: " + account.getAccountId());
        // Kiểm tra xem người gọi API có phải là người được giao task không
        TaskDTO task = accountService.getTaskDetails(account.getAccountId(), taskId);
        System.out.println("Task details: " + task);
        if (task == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy task");
        }

        // Chỉ người được giao task hoặc người tạo task mới được phép cập nhật attendees
        if (!account.getAccountId().equals(task.getAssignedToAccountId()) && 
            !account.getAccountId().equals(task.getAssignedByAccountId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Bạn không có quyền cập nhật người tham gia task này");
        }
        System.out.println("Request to update attendees: " + request);
        List<Integer> attendees = request.get("attendees");
        if (attendees == null) {
            return ResponseEntity.badRequest().body("Danh sách người tham gia không hợp lệ");
        }
        System.out.println("Attendees to update: " + attendees);
        try {
            // Gọi service để cập nhật attendees
            accountService.updateTaskAttendees(taskId, task.getAssignedToAccountId(), attendees);
            return ResponseEntity.ok("Cập nhật người tham gia task thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Lỗi khi cập nhật người tham gia: " + e.getMessage());
        }
    }
}
