package com.mavent.dev.service.implement;

import com.mavent.dev.entity.Tag;
import com.mavent.dev.repository.EventTagRepository;
import com.mavent.dev.repository.TagRepository;
import com.mavent.dev.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagImplement implements TagService {
    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private EventTagRepository eventTagRepository;


    @Override
    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    @Override
    public List<Tag> getTagsByEventId(Integer eventId) {
        return eventTagRepository.findByEventId(eventId);
    }
}

