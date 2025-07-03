package com.mavent.dev.repository;

import com.mavent.dev.entity.Agenda;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AgendaRepository extends JpaRepository<Agenda,Long> {
    List<Agenda> findByEventId(Integer eventId);
}
