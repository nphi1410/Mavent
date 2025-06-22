package com.mavent.dev.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mavent.dev.dto.EventRegisterDTO;
import com.mavent.dev.dto.FilterEventDTO;
import com.mavent.dev.dto.FilterRequestDTO;
import com.mavent.dev.dto.event.EventAccountRoleDTO;
import com.mavent.dev.dto.superadmin.EventDTO;
import com.mavent.dev.entity.Event;
import com.mavent.dev.entity.EventAccountRole;
import com.mavent.dev.service.AccountService;
import com.mavent.dev.service.EventAccountRoleService;
import com.mavent.dev.service.EventService;
import com.mavent.dev.service.globalservice.CloudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    // ✅ Tạo sự kiện kèm ảnh banner và poster (fix multipart + JSON)
    @PostMapping(value = "/create-event", consumes = "multipart/form-data")
    public ResponseEntity<?> createEvent(
            @RequestParam("event") String eventJson,
            @RequestPart("banner") MultipartFile banner,
            @RequestPart("poster") MultipartFile poster
    ) {
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

    // Lấy tất cả sự kiện
    @GetMapping("")
    public List<EventDTO> getAllEvents() {
        return eventService.getAllEvents();
    }

    // Lọc sự kiện
    @PostMapping("/filter")
    public Page<FilterEventDTO> getFilterEvents(@RequestBody FilterRequestDTO request) {
        return eventService.getFilterEvents(
                request.getName(),
                request.getStatus(),
                request.getTagIds(),
                request.getSortType(),
                request.getPage(),
                request.getSize(),
                request.getType(),
                request.isTrending()
        );
    }

    // Đăng ký sự kiện
    @PostMapping("/register")
    public ResponseEntity<String> registerEvent(@RequestBody EventRegisterDTO eventRegisterDto) {
        Integer accountId = accountService.getAccount(eventRegisterDto.getUsername()).getAccountId();
        EventAccountRole eventAccountRole = new EventAccountRole();
        eventAccountRole.setEventId(eventRegisterDto.getEventId());
        eventAccountRole.setEventRole(eventRegisterDto.getRole());
        eventAccountRole.setAccountId(accountId);
        eventAccountRole.setCreatedAt(LocalDateTime.now());

        if (eventRegisterDto.getRole().equals(EventAccountRole.EventRole.PARTICIPANT)) {
            return ResponseEntity.ok(eventAccountRoleService.addMemberToEvent(eventAccountRole).toString());
        }

        eventAccountRole.setDepartmentId(eventRegisterDto.getDepartmentId());
        return ResponseEntity.ok(eventRegisterDto.toString());
    }

    // Lấy các sự kiện đang tham gia
    @GetMapping("/attending/{accountId}")
    public ResponseEntity<Page<EventAccountRoleDTO>> getAttendingEvent(
            @PathVariable Integer accountId, Pageable pageable) {
        Page<EventAccountRoleDTO> page = eventAccountRoleService.getMembersByAccountIdWithPagination(accountId, pageable);
        return ResponseEntity.ok(page);
    }

    // Lấy sự kiện theo ID
    @GetMapping("/{id}")
    public Event getEventById(@PathVariable("id") Integer eventId) {
        return eventService.getEventEntityById(eventId);
    }

    // Cập nhật sự kiện
    @PutMapping("/{id}")
    public ResponseEntity<EventDTO> updateEvent(@PathVariable("id") Integer eventId,
                                                @RequestBody EventDTO eventDTO) {
        EventDTO updated = eventService.updateEvent(eventId, eventDTO);
        return ResponseEntity.ok(updated);
    }
}
