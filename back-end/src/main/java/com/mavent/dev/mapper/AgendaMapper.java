package com.mavent.dev.mapper;

import com.mavent.dev.dto.event.AgendaDTO;
import com.mavent.dev.entity.Agenda;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AgendaMapper {
    public static AgendaDTO toAgendaDTOs(Agenda agenda) {
        if (agenda == null) {
            return null;
        }
        return AgendaDTO.builder()
                .eventId(agenda.getEventId())
                .agendaTitle(agenda.getAgendaTitle())
                .agendaDescription(agenda.getAgendaDescription())
                .agendaStartTime(agenda.getAgendaStartTime())
                .agendaEndTime(agenda.getAgendaEndTime())
                .build();
    }
    public static Agenda toAgenda(AgendaDTO agendaDTO) {
        if (agendaDTO == null) {
            return null;
        }
        return Agenda.builder()
                .eventId(agendaDTO.getEventId())
                .agendaTitle(agendaDTO.getAgendaTitle())
                .agendaDescription(agendaDTO.getAgendaDescription())
                .agendaStartTime(agendaDTO.getAgendaStartTime())
                .agendaEndTime(agendaDTO.getAgendaEndTime())
                .build();
    }

    public static List<AgendaDTO> toAgendaDTOs(List<Agenda> agendas) {
        if (agendas == null || agendas.isEmpty()) {
            return List.of();
        }
        return agendas.stream()
                .map(AgendaMapper::toAgendaDTOs)
                .toList();
    }
}
