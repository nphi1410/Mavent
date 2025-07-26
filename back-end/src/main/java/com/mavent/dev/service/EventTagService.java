package com.mavent.dev.service;

import com.mavent.dev.entity.EventTag;

import java.util.List;

public interface EventTagService {
    // Thêm method để lưu tags cho event
    void saveEventTags(Integer eventId, List<Integer> tagIds);

    // Thêm method để xóa tags của event (dùng khi update)
    void deleteEventTags(Integer eventId);

    // Thêm method để lấy tags của event (đã có trong TagService nhưng tạo thêm ở đây cho đồng bộ)
    List<Integer> getTagIdsByEventId(Integer eventId);
}