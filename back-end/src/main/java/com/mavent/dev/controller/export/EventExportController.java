package com.mavent.dev.controller.export;


import com.mavent.dev.DTO.superadmin.EventDTO;
import com.mavent.dev.service.EventService;
import com.mavent.dev.service.export.ExcelExportService;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventExportController {

    private final EventService eventService;
    private final ExcelExportService<EventDTO> excelExportService;

    @Autowired
    public EventExportController(EventService eventService, ExcelExportService<EventDTO> excelExportService) {
        this.eventService = eventService;
        this.excelExportService = excelExportService;
    }

    @GetMapping("/export")
    public void exportToExcel(HttpServletResponse response) throws IOException {
        List<EventDTO> events = eventService.getAllEvents();
        excelExportService.exportToExcel(response, events);
    }
}
