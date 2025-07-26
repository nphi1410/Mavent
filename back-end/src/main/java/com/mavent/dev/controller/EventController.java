package com.mavent.dev.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mavent.dev.config.MailConfig;
import com.mavent.dev.dto.EventCountDTO;
import com.mavent.dev.dto.EventRegisterDTO;
import com.mavent.dev.dto.FilterEventDTO;
import com.mavent.dev.dto.FilterRequestDTO;
import com.mavent.dev.dto.department.UserEventInfoDTO;
import com.mavent.dev.dto.event.EventAccountRoleDTO;
import com.mavent.dev.dto.event.PendingEventDTO;
import com.mavent.dev.dto.event.UpdatePendingEventDTO;
import com.mavent.dev.dto.superadmin.EventDTO;
import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.Event;
import com.mavent.dev.entity.EventAccountRole;
import com.mavent.dev.service.AccountService;
import com.mavent.dev.service.DepartmentService;
import com.mavent.dev.service.EventAccountRoleService;
import com.mavent.dev.service.EventService;
import com.mavent.dev.service.globalservice.CloudService;
import com.mavent.dev.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private EventAccountRoleService eventAccountRoleService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private CloudService cloudService;

    @Autowired
    private DepartmentService departmentService;

    @Autowired
    private JwtUtil jwt;

    @Autowired
    private MailConfig mailConfig;

    // XÓA DÒNG LỖI - UpdatePendingEventDTO không phải là component
    // @Autowired
    // private UpdatePendingEventDTO updatePendingEventDTO;

    // Cập nhật method tạo sự kiện kèm ảnh banner và poster + tags
    // Cập nhật method tạo sự kiện kèm ảnh banner và poster + tags
    @PostMapping(value = "/create-event", consumes = "multipart/form-data")
    public ResponseEntity<?> createEvent(
            @RequestParam("event") String eventJson,
            @RequestPart("banner") MultipartFile banner,
            @RequestPart("poster") MultipartFile poster,
            @RequestParam(value = "tags", required = false) String tagsJson) { // Thêm parameter cho tags
        try {
            System.out.println("=== DEBUG CREATE EVENT ===");
            System.out.println("Event JSON: " + eventJson);
            System.out.println("Tags JSON: " + tagsJson);
            System.out.println("Banner file: " + (banner != null ? banner.getOriginalFilename() : "null"));
            System.out.println("Poster file: " + (poster != null ? poster.getOriginalFilename() : "null"));

            //Tạo ObjectMapper hỗ trợ LocalDateTime
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
            mapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss"));

            //Parse JSON thành EventDTO
            EventDTO eventDTO = mapper.readValue(eventJson, EventDTO.class);

            // Parse tags JSON thành List<Integer> nếu có
            List<Integer> tagIds = null;
            if (tagsJson != null && !tagsJson.trim().isEmpty()) {
                tagIds = mapper.readValue(tagsJson, new TypeReference<List<Integer>>() {});
            }

            //Upload ảnh
            String bannerUrl = cloudService.uploadFile(banner, "event-banner");

            String posterUrl = cloudService.uploadFile(poster, "event-poster");

            eventDTO.setBannerUrl(bannerUrl);
            eventDTO.setPosterUrl(posterUrl);

            //Lưu event kèm tags
            EventDTO createdEvent = eventService.createEvent(eventDTO, tagIds);

            return ResponseEntity.ok(createdEvent);

        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity.status(500).body("Tạo sự kiện thất bại: " + e.getMessage());
        }
    }

    // Cập nhật sự kiện (hỗ trợ cập nhật / thay ảnh banner & poster)
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> updateEvent(@PathVariable("id") Integer eventId, @RequestParam("event") String eventJson,      // JSON của EventDTO
                                         @RequestPart(value = "banner", required = false) MultipartFile banner, @RequestPart(value = "poster", required = false) MultipartFile poster) {

        try {
            // 1. Parse JSON -> EventDTO
            ObjectMapper mapper = new ObjectMapper().registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

            EventDTO eventDTO = mapper.readValue(eventJson, EventDTO.class);

        /* 2. Nếu có file mới => upload & gán URL
              - Không gửi file => giữ nguyên URL cũ trong eventDTO
        */
            if (banner != null && !banner.isEmpty()) {
                String bannerUrl = cloudService.uploadFile(banner, "event-banner");
                eventDTO.setBannerUrl(bannerUrl);
            }

            if (poster != null && !poster.isEmpty()) {
                String posterUrl = cloudService.uploadFile(poster, "event-poster");
                eventDTO.setPosterUrl(posterUrl);
            }

            // 3. Gọi service cập nhật
            EventDTO updated = eventService.updateEvent(eventId, eventDTO);
            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Cập nhật sự kiện thất bại: " + e.getMessage());
        }
    }

    //Get All Event
    @GetMapping("")
    public List<EventDTO> getAllEvents() {
        return eventService.getAllEvents();
    }

    // Lọc sự kiện
    @PostMapping("/filter")
    public Page<FilterEventDTO> getFilterEvents(@RequestBody FilterRequestDTO request) {
        return eventService.getFilterEvents(request.getName(), request.getStatus(), request.getTagIds(), request.getSortType(), request.getPage(), request.getSize(), request.getType(), request.isTrending());
    }

    // Đăng ký sự kiện
    @PostMapping("/register")
    public ResponseEntity<String> registerEvent(@RequestBody EventRegisterDTO eventRegisterDto) {
        Integer accountId = eventRegisterDto.getAccountId();
        EventAccountRole eventAccountRole = new EventAccountRole();
        eventAccountRole.setEventId(eventRegisterDto.getEventId());
        eventAccountRole.setEventRole(eventRegisterDto.getRole());
        eventAccountRole.setAccountId(accountId);
        eventAccountRole.setDepartmentId(eventRegisterDto.getDepartmentId());
        eventAccountRole.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(eventAccountRoleService.addMemberToEvent(eventAccountRole).toString());
    }

    // Lấy các sự kiện đang tham gia
    @GetMapping("/attending/{accountId}")
    public ResponseEntity<Page<EventAccountRoleDTO>> getAttendingEvent(@PathVariable Integer accountId, @RequestParam(required = false) String searchTitle, @RequestParam(required = false) String role, Pageable pageable) {

        Page<EventAccountRoleDTO> eventAccountRolePage = eventAccountRoleService.getMembersByAccountIdWithPagination(accountId, searchTitle, role, pageable);

        return ResponseEntity.ok(eventAccountRolePage);
    }

    @GetMapping("/joining/{accountId}")
    public ResponseEntity<List<EventAccountRoleDTO>> getEventListByAccountId(@PathVariable Integer accountId) {
        return ResponseEntity.ok(eventAccountRoleService.getByAccountIdOnRole(accountId));
    }


    @GetMapping("/attending/summary/{accountId}")
    public ResponseEntity<List<EventCountDTO>> getAttendingMonthlySummary(@PathVariable Integer accountId, @RequestParam String eventRole) {
        return ResponseEntity.ok(eventAccountRoleService.getMonthlyStatistic(accountId, eventRole));
    }

    @GetMapping("/summary")
    public ResponseEntity<List<EventCountDTO>> getMonthlySummary(@RequestParam String status) {
        return ResponseEntity.ok(eventService.getMonthlyStatistic(status));
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> countAttendanceByAccountId(@RequestParam Integer accountId, @RequestParam(required = false) EventAccountRole.EventRole eventRole, @RequestParam boolean countCurrentMonth) {
        return ResponseEntity.ok(eventAccountRoleService.countAttendanceByAccountId(accountId, eventRole, countCurrentMonth));
    }

    @GetMapping("/account")
    public ResponseEntity<Page<EventAccountRole>> getByAccountId(@RequestParam Integer accountId, Pageable pageable) {
        return ResponseEntity.ok(eventAccountRoleService.getByAccountIdAndPage(accountId, pageable));
    }


    //Get Event By ID
    @GetMapping("/{id}")
    public Event getEventById(@PathVariable("id") Integer eventId) {
        return eventService.getEventEntityById(eventId);
    }

    @GetMapping("/{eventId}/user")
    public ResponseEntity<?> getUserInformationInEvent(@PathVariable Integer eventId, HttpServletRequest request) {
        try {
            // Kiểm tra quyền truy cập sự kiện
            Account account = accountService.getAccount(jwt.extractUsername(request.getHeader("Authorization").substring(7)));
//            System.out.println("Account ID: " + account.getAccountId());
//            boolean hasAccess = eventService.checkEventAccess(eventId, account.getAccountId());
//            if (!hasAccess) {
//                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền truy cập sự kiện này");
//            }

            UserEventInfoDTO info = eventAccountRoleService.getUserEventInfo(eventId, account.getAccountId());

            return ResponseEntity.ok(info);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching User Role In Event: " + e.getMessage());
        }
    }

    @GetMapping("pending/{id}")
    public ResponseEntity<?> getPendingEventById(@PathVariable("id") Integer eventId) {
        System.out.println("Fetching pending event with ID: " + eventId);
        try {
            PendingEventDTO pendingEventDTO = eventService.getPendingEventById(eventId);
            if (pendingEventDTO == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found with ID: " + eventId);
            }
            return ResponseEntity.ok(pendingEventDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi lấy sự kiện: " + e.getMessage());
        }
    }

    @PatchMapping("/pending/{id}")
    public ResponseEntity<?> updatePendingEvent(@PathVariable("id") Integer eventId, @RequestBody UpdatePendingEventDTO updatePendingEventDTO) {
        try {
            System.out.println("Updating pending event with ID: " + eventId + " to status: " + updatePendingEventDTO.getStatus());
            boolean updated = eventService.updatePendingEvent(eventId, updatePendingEventDTO.getStatus());
            String message = "Your request to Creat Event " + updatePendingEventDTO.getEventName() + " has been Updated with Status: " + updatePendingEventDTO.getStatus() + ".\n";
            if (updatePendingEventDTO.getAssignedByAccountName() != null)
                message += "This request was udpated by " + updatePendingEventDTO.getAssignedByAccountName() + ".\n";
            if (updatePendingEventDTO.getNote() != null)
                message += "Note: " + updatePendingEventDTO.getNote() + ".\n";
            message += "If you have any questions, please contact the admin.";

            if (updated) {
                Account account = accountService.getAccountById(updatePendingEventDTO.getAccountId());
                mailConfig.sendMail(
                        account.getEmail(),
                        "[MAVENT] Your Event-Creation Request has been Updated!",
                        message
                );
                return ResponseEntity.ok("Cập nhật sự kiện thành công với ID: " + eventId);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy sự kiện với ID: " + eventId);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi cập nhật sự kiện: " + e.getMessage());
        }
    }

    @GetMapping("/created/{eventId}")
    public ResponseEntity<?> getCreatedEventById(@PathVariable Integer eventId) {
        try {
            EventDTO eventDTO = eventService.getEventById(eventId);
            if (eventDTO == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy sự kiện với ID: " + eventId);
            }
            return ResponseEntity.ok(eventDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi lấy sự kiện: " + e.getMessage());
        }
    }

    @GetMapping("/created")
    public ResponseEntity<?> getCreatedEvents(HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            Integer accountId = jwt.extractAccountId(token);
            System.out.println("accountId: " + accountId);
            List<EventDTO> createdEvents = eventService.getEventByCreatorId(accountId);
            return ResponseEntity.ok(createdEvents);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi lấy danh sách sự kiện đã tạo: " + e.getMessage());
        }
    }
}