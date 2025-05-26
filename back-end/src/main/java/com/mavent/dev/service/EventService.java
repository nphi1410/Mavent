package com.mavent.dev.service;

import com.mavent.dev.entity.Event;
import com.mavent.dev.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


public interface EventService {

    List<Event> getAllEvents();
}