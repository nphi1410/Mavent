package com.mavent.dev.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;

public interface ExpenseExportService {
    ByteArrayInputStream exportExpensesToExcel(Integer eventId) throws IOException;
}