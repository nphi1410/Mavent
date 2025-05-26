package com.mavent.dev.service.implement;

import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.Event;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.repository.EventRepository;
import com.mavent.dev.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventImplement implements EventService {
    @Autowired
    private EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
}
