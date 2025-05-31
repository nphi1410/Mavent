package com.mavent.dev.service.implement;

import com.mavent.dev.DTO.DashboardDTO;
import com.mavent.dev.entity.Event;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.repository.EventRepository;
import com.mavent.dev.service.DashboardService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardImplement implements DashboardService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public DashboardDTO getDashboard() {
        long totalEvents = eventRepository.countByIsDeletedFalse();
        long totalAccounts = accountRepository.countByIsDeletedFalse();
        long totalUpcomingEvents = eventRepository.countByStatusAndIsDeletedFalse(Event.EventStatus.UPCOMING);
        long totalOngoingEvents = eventRepository.countByStatusAndIsDeletedFalse(Event.EventStatus.ONGOING);

        return new DashboardDTO(totalEvents, totalAccounts, totalUpcomingEvents, totalOngoingEvents);

    }


}
