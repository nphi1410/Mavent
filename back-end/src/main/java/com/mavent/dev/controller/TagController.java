package com.mavent.dev.controller;

import com.mavent.dev.entity.Tag;
import com.mavent.dev.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {
    @Autowired
    private TagService tagService;

    @GetMapping
    public ResponseEntity<List<Tag>> getAllTags(
            @RequestParam(required = false) Integer eventId
    ){
        if (eventId == null) {
            return ResponseEntity.ok(tagService.getAllTags());
        }

        return ResponseEntity.ok(tagService.getTagsByEventId(eventId));
    }

}
