package com.mavent.dev.service.implement;

import com.mavent.dev.entity.EventTag;
import com.mavent.dev.repository.EventTagRepository;
import com.mavent.dev.service.EventTagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventTagImplement implements EventTagService {

    @Autowired
    private EventTagRepository eventTagRepository;

    @Override
    @Transactional
    public void saveEventTags(Integer eventId, List<Integer> tagIds) {
        try {
            System.out.println("=== EventTagImplement.saveEventTags ===");
            System.out.println("EventId: " + eventId);
            System.out.println("TagIds: " + tagIds);

            // Xóa tags cũ trước khi lưu tags mới (để tránh duplicate)
            System.out.println("Deleting old tags...");
            deleteEventTags(eventId);

            // Lưu từng tag mới
            if (tagIds != null && !tagIds.isEmpty()) {
                System.out.println("Saving " + tagIds.size() + " new tags...");
                for (Integer tagId : tagIds) {
                    System.out.println("Saving tag: " + tagId);
                    EventTag eventTag = new EventTag();
                    eventTag.setEventId(eventId);
                    eventTag.setTagId(tagId);
                    eventTagRepository.save(eventTag);
                }
                System.out.println("All tags saved successfully");
            }
        } catch (Exception e) {
            System.err.println("=== ERROR IN saveEventTags ===");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            System.err.println("==============================");
            throw e;
        }
    }

    @Override
    @Transactional
    public void deleteEventTags(Integer eventId) {
        try {
            System.out.println("=== EventTagImplement.deleteEventTags ===");
            System.out.println("Deleting tags for eventId: " + eventId);

            // SỬA: Sử dụng method deleteByEventId từ repository thay vì deleteAll
            eventTagRepository.deleteByEventId(eventId);
            System.out.println("Tags deleted successfully");
        } catch (Exception e) {
            System.err.println("=== ERROR IN deleteEventTags ===");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            System.err.println("================================");
            throw e;
        }
    }

    @Override
    public List<Integer> getTagIdsByEventId(Integer eventId) {
        List<EventTag> eventTags = eventTagRepository.findByEventIdOnly(eventId);
        return eventTags.stream()
                .map(EventTag::getTagId)
                .collect(Collectors.toList());
    }
}