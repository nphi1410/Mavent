package com.mavent.dev.service;

import com.mavent.dev.dto.event.AgendaDTO;

import java.util.List;

public interface AgendaService {
    AgendaDTO createAgendaItem(Integer eventId, AgendaDTO dto);
    List<AgendaDTO> getAgendaItemsByEventId(Integer eventId);

}
