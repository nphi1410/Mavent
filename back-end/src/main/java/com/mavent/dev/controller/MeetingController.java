package com.mavent.dev.controller;

import com.mavent.dev.dto.MeetingAttendeeDTO;
import com.mavent.dev.dto.MeetingDTO;
import com.mavent.dev.dto.MeetingRequest;
import com.mavent.dev.entity.Meeting;
import com.mavent.dev.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/meetings")
public class MeetingController {

    @Autowired
    private MeetingService meetingService;

    @PostMapping
    public ResponseEntity<Meeting> createMeeting(@RequestBody MeetingRequest meeting) {
        List<Integer> attendeeIds = meeting.getAttendees();
        return ResponseEntity.ok(meetingService.createMeeting(meeting,attendeeIds));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Meeting> updateMeeting(@PathVariable("id") Integer id, @RequestBody Meeting meeting) {
        return ResponseEntity.ok(meetingService.updateMeeting(meeting));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeeting(@PathVariable("id") Integer id) {
        meetingService.deleteMeeting(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Meeting> getMeetingById(@PathVariable("id") Integer id) {
        return meetingService.getMeetingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Meeting>> getAllMeetings() {
        return ResponseEntity.ok(meetingService.getAllMeetings());
    }

    @GetMapping("/organizer/{accountId}")
    public ResponseEntity<List<Meeting>> getByOrganizer(@PathVariable("accountId") Integer accountId) {
        return ResponseEntity.ok(meetingService.getMeetingsByOrganizerAccountId(accountId));
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<Page<MeetingDTO>> getByAccount(
            @PathVariable("accountId") Integer accountId,
            @RequestParam(required = false) String searchTitle,
            @RequestParam(required = false) Integer eventId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(meetingService.getMeetingByAccountId(accountId, searchTitle, eventId, pageable));
    }



    @GetMapping("/department/{deptId}")
    public ResponseEntity<List<Meeting>> getByDepartment(@PathVariable("deptId") Integer deptId) {
        return ResponseEntity.ok(meetingService.getMeetingsByDepartmentId(deptId));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Meeting>> getByEvent(@PathVariable("eventId") Integer eventId) {
        return ResponseEntity.ok(meetingService.getMeetingsByEventId(eventId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Meeting>> getByStatus(@PathVariable("status") Meeting.Status status) {
        return ResponseEntity.ok(meetingService.getMeetingsByStatus(status));
    }

    @GetMapping("/attendee/{meetingId}")
    public ResponseEntity<List<MeetingAttendeeDTO>> getMeetingAttendees(@PathVariable Integer meetingId){
        return ResponseEntity.ok(meetingService.getMeetingAttendees(meetingId));
    }
}
