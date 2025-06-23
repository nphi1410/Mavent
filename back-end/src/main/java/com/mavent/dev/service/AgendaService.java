package com.mavent.dev.service;

import com.mavent.dev.dto.event.AgendaDTO;

public interface AgendaService {
    AgendaDTO createAgendaItem(Integer eventId, AgendaDTO dto);
}
