package com.mavent.dev.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mavent.dev.dto.EventCountDTO;
import com.mavent.dev.dto.EventRegisterDTO;
import com.mavent.dev.dto.FilterEventDTO;
import com.mavent.dev.dto.FilterRequestDTO;
import com.mavent.dev.dto.department.UserEventInfoDTO;
import com.mavent.dev.dto.event.EventAccountRoleDTO;
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

    // Tạo sự kiện kèm ảnh banner và poster (fix multipart + JSON)
    @PostMapping(value = "/create-event", consumes = "multipart/form-data")
    public ResponseEntity<?> createEvent(@RequestParam("event") String eventJson, @RequestPart("banner") MultipartFile banner, @RequestPart("poster") MultipartFile poster) {
        try {
            //Tạo ObjectMapper hỗ trợ LocalDateTime
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

            //Parse JSON thành EventDTO
            EventDTO eventDTO = mapper.readValue(eventJson, EventDTO.class);

            //Upload ảnh
            String bannerUrl = cloudService.uploadFile(banner, "event-banner");
            String posterUrl = cloudService.uploadFile(poster, "event-poster");

            eventDTO.setBannerUrl(bannerUrl);
            eventDTO.setPosterUrl(posterUrl);

            //Lưu event
            EventDTO createdEvent = eventService.createEvent(eventDTO);

            return ResponseEntity.ok(createdEvent);

        } catch (Exception e) {

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


    // Lấy tất cả sự kiện
    @Autowired
    private DepartmentService departmentService;

    @Autowired
    private JwtUtil jwt;

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
        eventAccountRole.setCreatedAt(LocalDateTime.now());
//        if(eventRegisterDto.getRole().equals(EventAccountRole.EventRole.PARTICIPANT)){
        return ResponseEntity.ok(eventAccountRoleService.addMemberToEvent(eventAccountRole).toString());
//        }

        // chua xu ly register as member
//        eventAccountRole.setDepartmentId(eventRegisterDto.getDepartmentId());

//        return ResponseEntity.ok(eventRegisterDto.toString());
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

            // Lấy thông tin phòng ban của người dùng trong sự kiện
            UserEventInfoDTO department = eventAccountRoleService.getUserEventInfo(eventId, account.getAccountId());
            if (department == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy phòng ban cho người dùng trong sự kiện này");
            }

            return ResponseEntity.ok(department);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi lấy thông tin phòng ban: " + e.getMessage());
        }
    }


}
