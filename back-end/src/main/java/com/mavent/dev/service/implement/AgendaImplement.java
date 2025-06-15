package com.mavent.dev.service.implement;

import com.mavent.dev.dto.event.AgendaDTO;
import com.mavent.dev.entity.Agenda;
import com.mavent.dev.repository.AgendaRepository;
import com.mavent.dev.service.AgendaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AgendaImplement implements AgendaService {

    private final AgendaRepository agendaRepository;

    @Override
    public AgendaDTO createAgendaItem(Integer eventId, AgendaDTO dto) {
        Agenda agenda = Agenda.builder()
                .eventId(eventId)
                .agendaTitle(dto.getAgendaTitle())
                .agendaDescription(dto.getAgendaDescription())
                .agendaStartTime(dto.getAgendaStartTime())
                .agendaEndTime(dto.getAgendaEndTime())
                .build();

        Agenda saveAgenda = agendaRepository.save(agenda);

        return AgendaDTO.builder()
                .eventId(eventId)
                .agendaTitle(dto.getAgendaTitle())
                .agendaDescription(dto.getAgendaDescription())
                .agendaStartTime(dto.getAgendaStartTime())
                .agendaEndTime(dto.getAgendaEndTime())
                .build();
    }
}
