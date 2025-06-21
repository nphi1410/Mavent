package com.mavent.dev.repository;

import com.mavent.dev.entity.Agenda;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgendaRepository extends JpaRepository<Agenda,Long> {
}
