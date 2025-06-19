package com.mavent.dev.controller;

import com.mavent.dev.entity.Meeting;
import com.mavent.dev.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meetings")
public class MeetingController {

    @Autowired
    private MeetingService meetingService;

    @PostMapping
    public ResponseEntity<Meeting> createMeeting(@RequestBody Meeting meeting) {
        return ResponseEntity.ok(meetingService.createMeeting(meeting));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Meeting> updateMeeting(@PathVariable("id") Integer id, @RequestBody Meeting meeting) {
        return ResponseEntity.ok(meetingService.updateMeeting(id, meeting));
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
}
