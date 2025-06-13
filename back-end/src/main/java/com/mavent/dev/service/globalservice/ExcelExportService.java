package com.mavent.dev.service.globalservice;

import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

public interface ExcelExportService<T> {
    void exportToExcel(HttpServletResponse response, List<T> data) throws IOException;
}
