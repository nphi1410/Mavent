package com.mavent.dev.service;

import com.mavent.dev.entity.Tag;

import java.util.List;

public interface TagService {
    List<Tag> getAllTags();

    List<Tag> getTagsByEventId(Integer eventId);
}
