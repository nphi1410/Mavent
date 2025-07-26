package com.mavent.dev.controller;

import com.mavent.dev.dto.*;
import com.mavent.dev.dto.superadmin.AccountDTO;
import com.mavent.dev.dto.superadmin.EventDTO;
import com.mavent.dev.config.MailConfig;
import com.mavent.dev.dto.task.*;
import com.mavent.dev.dto.userAuthentication.*;
import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.Document;
import com.mavent.dev.entity.EventAccountRole;
import com.mavent.dev.mapper.AccountMapper;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.repository.EventAccountRoleRepository;
import com.mavent.dev.service.AccountService;
import com.mavent.dev.service.DepartmentService;
import com.mavent.dev.service.EventService;
import com.mavent.dev.service.JwtBlacklistService;
import com.mavent.dev.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
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
    @Qualifier("jwtBlacklistService")
    private JwtBlacklistService jwtBlacklistService;

    @Autowired
    private CloudService cloudService;
    @Autowired
    private DepartmentService departmentService;

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
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequestDTO.getUsername(),
                            authRequestDTO.getPassword()
                    )
            );

            Account account = accountService.getAccount(authRequestDTO.getUsername());
            String jwt = jwtUtil.generateToken(account);
            return ResponseEntity.ok(new AuthResponseDTO(jwt));
            // If successful, continue to generate JWT or login response
        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        } catch (UsernameNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Username not found");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Authentication failed: " + e.getMessage());
        }
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
        String mailContent = "Your OTP Code for Resetting password at MAVENT is: " + otp + ". Please remember that this OTP only last for 2 minutes.";
        mailConfig.sendMail(request.getEmail(), "Your OTP Code for Reset Password at Mavent", mailContent);

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
        Account account = getAuthenticatedAccount(request);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        UserProfileDTO profile = accountService.getUserProfile(account.getUsername());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/user/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserProfileDTO userProfileDTO, HttpServletRequest request) {
        Account account = getAuthenticatedAccount(request);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn cần đăng nhập để cập nhật hồ sơ");
        }

        try {
            UserProfileDTO updatedProfile = accountService.updateProfile(account.getUsername(), userProfileDTO);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating profile: " + e.getMessage());
        }
    }

    @PostMapping("/user/avatar")
    public ResponseEntity<?> updateAvatar(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        Account account = getAuthenticatedAccount(request);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn cần đăng nhập để cập nhật avatar");
        }

        try {
            String containerName = "maventcontainer";
            String oldAvatarUrl = account.getAvatarUrl();

            String fileUrl = cloudService.uploadFile(file, containerName);

            String blobName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            String avatarPath = cloudService.getFileUrl(blobName, containerName);

            account.setAvatarUrl(avatarPath);
            accountService.save(account);

            if (oldAvatarUrl != null && !oldAvatarUrl.isEmpty()) {
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

        Account account = getAuthenticatedAccount(request);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        EventDTO event = null;
        String evName = null;
        System.out.println("Event Name: " + eventName);
        System.out.println("Status: " + status);
//        if (eventName != null && !eventName.isEmpty()) {
//            try {
//                event = eventService.getEventById(Integer.parseInt(eventName));
//                if (event != null) {
//                    evName = event.getName();
//                    System.out.println("Event Name: " + evName);
//                }
//            } catch (NumberFormatException e) {
//                System.err.println("Invalid event ID format: " + eventName);
//                return ResponseEntity.badRequest().build();
//            }
//        }

        List<TaskDTO> tasks = accountService.getUserTasks(
                account.getAccountId(),
                status,
                priority,
                keyword,
                sortOrder,
                evName);
//        System.out.println("Tasks: " + tasks);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/user/tasks/{taskId}")
    public ResponseEntity<TaskDTO> getTaskDetails(
            @PathVariable Integer taskId,
            HttpServletRequest request) {

        Account account = getAuthenticatedAccount(request);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
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

        Account account = getAuthenticatedAccount(request);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        TaskDTO task = accountService.getTaskDetails(account.getAccountId(), taskId);
        if (task == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

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

        Account account = getAuthenticatedAccount(request);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You have to login to update task status");
        }

        try {
            TaskDTO currentTask = accountService.getTaskDetails(account.getAccountId(), taskId);
            if (currentTask == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Can not find task with this ID: " + taskId);
            }

            String newStatus = statusUpdateDTO.getStatus();
            String currentStatus = currentTask.getStatus();

            boolean isValidTransition = false;
            boolean needsCreatorPermission = false;

            if ("TODO".equals(currentStatus) && "DOING".equals(newStatus)) {
                isValidTransition = true;
            } else if ("DOING".equals(currentStatus) && "REVIEW".equals(newStatus)) {
                isValidTransition = true;
            } else if ("OVERDUE".equals(currentStatus) && "REVIEW".equals(newStatus)) {
                isValidTransition = true;
            } else if ("REVIEW".equals(currentStatus) && "DONE".equals(newStatus)) {
                isValidTransition = true;
                needsCreatorPermission = true;
            } else if ("CANCELLED".equals(newStatus)) {
                if (!List.of("DONE", "REJECTED", "CANCELLED").contains(currentStatus)) {
                    isValidTransition = true;
                    needsCreatorPermission = true;
                }
            }

            if (!isValidTransition) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Can not update task status from " + currentStatus + " to " + newStatus);
            }

            if (needsCreatorPermission) {
                if (!account.getAccountId().equals(currentTask.getAssignedByAccountId())) {
                    if ("CANCELLED".equals(newStatus)) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body("Just the creator of the task can change the status to " + newStatus);
                    } else {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body("Just the creator of the task can change the status to " + newStatus);
                    }
                }
            } else {
                if (!account.getAccountId().equals(currentTask.getAssignedToAccountId()) &&
                        !account.getAccountId().equals(currentTask.getAssignedByAccountId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("Just the assignee or creator of the task can change the status to " + newStatus);
                }
            }

            TaskDTO updatedTask = accountService.updateTaskStatus(taskId, newStatus);
            return ResponseEntity.ok(updatedTask);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/user/tasks")
    public ResponseEntity<Object> createTask(
            @RequestBody TaskCreateDTO taskCreateDTO,
            HttpServletRequest request) {

        Account account = getAuthenticatedAccount(request);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn cần đăng nhập để tạo task");
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

        Account account = getAuthenticatedAccount(request);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        TaskDTO current = accountService.getTaskDetails(account.getAccountId(), taskId);
        if (current == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
//        if (!account.getAccountId().equals(current.getAssignedByAccountId())) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//        }

        TaskDTO updated = accountService.updateTask(taskId, updateDto);
        System.out.println(updated);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/user/tasks/{taskId}/feedback")
    public ResponseEntity<?> createTaskFeedback(
            @PathVariable Integer taskId,
            @RequestBody TaskFeedbackDTO feedbackDto,
            HttpServletRequest request) {

        Account account = getAuthenticatedAccount(request);
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

        Account account = getAuthenticatedAccount(request);
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


    @GetMapping("/user/events")
    public ResponseEntity<?> getUserEvents(HttpServletRequest request) {
        Account account = getAuthenticatedAccount(request);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn cần đăng nhập để xem sự kiện");
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
        Account account = getAuthenticatedAccount(request);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User must be logged in");
        }

        try {
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

        Account account = getAuthenticatedAccount(httpRequest);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        TaskDTO task = accountService.getTaskDetails(account.getAccountId(), taskId);
        if (task == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy task");
        }

        if (!account.getAccountId().equals(task.getAssignedToAccountId()) && 
            !account.getAccountId().equals(task.getAssignedByAccountId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Bạn không có quyền cập nhật người tham gia task này");
        }

        List<Integer> attendees = request.get("attendees");
        if (attendees == null) {
            return ResponseEntity.badRequest().body("Danh sách người tham gia không hợp lệ");
        }

        try {
            accountService.updateTaskAttendees(taskId, task.getAssignedToAccountId(), attendees);
            return ResponseEntity.ok("Cập nhật người tham gia task thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Lỗi khi cập nhật người tham gia: " + e.getMessage());
        }
    }

    @GetMapping("/user/notifications")
    public ResponseEntity<List<NotificationDTO>> getUserNotifications(HttpServletRequest request) {
        Account account = getAuthenticatedAccount(request);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<NotificationDTO> notifications = accountService.getUserNotifications(account.getAccountId());
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/user/notifications/{notificationId}/read")
    public ResponseEntity<?> markNotificationAsRead(
            @PathVariable Integer notificationId,
            HttpServletRequest request) {
        Account account = getAuthenticatedAccount(request);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            accountService.markNotificationAsRead(notificationId, account.getAccountId());
            return ResponseEntity.ok("Notification marked as read");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/user/notifications/read-all")
    public ResponseEntity<?> markAllNotificationsAsRead(HttpServletRequest request) {
        Account account = getAuthenticatedAccount(request);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        accountService.markAllNotificationsAsRead(account.getAccountId());
        return ResponseEntity.ok("All notifications marked as read");
    }

    @GetMapping("/user/notifications/unread-count")
    public ResponseEntity<Long> getUnreadNotificationCount(HttpServletRequest request) {
        Account account = getAuthenticatedAccount(request);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long count = accountService.getUnreadNotificationCount(account.getAccountId());
        return ResponseEntity.ok(count);
    }

@GetMapping("/user/tasks/{taskId}/documents")
public ResponseEntity<List<Document>> getTaskDocuments(
        @PathVariable Integer taskId,
        HttpServletRequest request) {
    
    Account account = getAuthenticatedAccount(request);
    if (account == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    
    // Kiểm tra quyền truy cập task
    TaskDTO task = accountService.getTaskDetails(account.getAccountId(), taskId);
    if (task == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    
    try {
        List<Document> documents = accountService.getTaskDocuments(taskId);
        return ResponseEntity.ok(documents);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
}

@PutMapping("/user/tasks/{taskId}/documents")
public ResponseEntity<?> updateTaskDocuments(
        @PathVariable Integer taskId,
        @RequestBody Map<String, List<Integer>> request,
        HttpServletRequest httpRequest) {
    
    Account account = getAuthenticatedAccount(httpRequest);
    if (account == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    
    TaskDTO task = accountService.getTaskDetails(account.getAccountId(), taskId);
    if (task == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
    }

    if (!account.getAccountId().equals(task.getAssignedByAccountId()) &&
        !account.getAccountId().equals(task.getAssignedToAccountId())) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body("You don't have permission to modify this task");
    }
    
    List<Integer> documentIds = request.get("documentIds");
    
    try {
        accountService.updateTaskDocuments(taskId, documentIds);
        return ResponseEntity.ok("Task documents updated successfully");
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

    @PatchMapping("/user/tasks/{taskId}/attendees/{accountId}/status")
    public ResponseEntity<?> updateAttendeeStatus(
            @PathVariable Integer taskId,
            @PathVariable Integer accountId,
            @RequestBody Map<String, String> request,
            HttpServletRequest httpRequest) {
        
        Account account = getAuthenticatedAccount(httpRequest);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        // Chỉ cho phép user cập nhật status của chính mình
        if (!account.getAccountId().equals(accountId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Bạn chỉ có thể cập nhật trạng thái tham gia của chính mình");
        }
        
        String newStatus = request.get("status");
        if (!"ACCEPTED".equals(newStatus) && !"DECLINED".equals(newStatus)) {
            return ResponseEntity.badRequest()
                .body("Trạng thái không hợp lệ. Chỉ cho phép ACCEPTED hoặc DECLINED");
        }
        
        try {
            if ("DECLINED".equals(newStatus)) {
                // Tạo request cancel task
                String reason = request.get("reason");
                if (reason == null || reason.trim().isEmpty()) {
                    return ResponseEntity.badRequest()
                        .body("Vui lòng cung cấp lý do từ chối task");
                }
                
                accountService.createCancelTaskRequest(taskId, accountId, reason);
            } else {
                // Cập nhật status thành ACCEPTED
                accountService.updateAttendeeStatus(taskId, accountId, newStatus);
            }
            
            return ResponseEntity.ok("Cập nhật trạng thái thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Lỗi khi cập nhật trạng thái: " + e.getMessage());
        }
    }

    private Account getAuthenticatedAccount(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        String token = authHeader.substring(7);
        String username;

        try {
            username = jwtUtil.extractUsername(token);
            return accountService.getAccount(username);
        } catch (Exception e) {
            return null;
        }
    }
}
