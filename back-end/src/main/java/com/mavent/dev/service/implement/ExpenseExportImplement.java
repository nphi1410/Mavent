package com.mavent.dev.service.implement;

import com.mavent.dev.dto.ExpenseByCategoryDTO;
import com.mavent.dev.dto.ExpenseByDepartmentDTO;
import com.mavent.dev.dto.ExpenseSummaryByStatusDTO;
import com.mavent.dev.dto.PaymentMethodSummaryDTO;
import com.mavent.dev.service.ExpenseExportService;
import com.mavent.dev.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseExportImplement implements ExpenseExportService {

    private final ExpenseService expenseService;

    @Override
    public ByteArrayInputStream exportExpensesToExcel(Integer eventId) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // Sheet 1: Total Expense by Event
            createTotalExpenseSheet(workbook, eventId);

            // Sheet 2: Expenses by Category
            createExpensesByCategorySheet(workbook, eventId);

            // Sheet 3: Expenses by Department
            createExpensesByDepartmentSheet(workbook, eventId);

            // Sheet 4: Payment Method Summaries
            createPaymentMethodSummarySheet(workbook, eventId);

            // Sheet 5: Expense Count by Status
            createExpenseCountByStatusSheet(workbook, eventId);

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    private void createTotalExpenseSheet(Workbook workbook, Integer eventId) {
        Sheet sheet = workbook.createSheet("Total Expense");
        String[] headers = {"Event ID", "Total Amount"};
        CellStyle headerCellStyle = createHeaderCellStyle(workbook);

        Row headerRow = sheet.createRow(0);
        for (int col = 0; col < headers.length; col++) {
            Cell cell = headerRow.createCell(col);
            cell.setCellValue(headers[col]);
            cell.setCellStyle(headerCellStyle);
        }

        Row dataRow = sheet.createRow(1);
        dataRow.createCell(0).setCellValue(expenseService.getTotalExpenseByEventId(eventId).getEventId());
        dataRow.createCell(1).setCellValue(expenseService.getTotalExpenseByEventId(eventId).getTotalAmount().doubleValue());

        autoSizeColumns(sheet, headers.length);
    }

    private void createExpensesByCategorySheet(Workbook workbook, Integer eventId) {
        Sheet sheet = workbook.createSheet("Expenses By Category");
        String[] headers = {"Category ID", "Category Name", "Total Amount"};
        CellStyle headerCellStyle = createHeaderCellStyle(workbook);

        Row headerRow = sheet.createRow(0);
        for (int col = 0; col < headers.length; col++) {
            Cell cell = headerRow.createCell(col);
            cell.setCellValue(headers[col]);
            cell.setCellStyle(headerCellStyle);
        }

        List<ExpenseByCategoryDTO> data = expenseService.getExpensesByCategoryForEvent(eventId);
        int rowNum = 1;
        for (ExpenseByCategoryDTO item : data) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(item.getCategoryId());
            row.createCell(1).setCellValue(item.getCategoryName());
            row.createCell(2).setCellValue(item.getTotalAmount().doubleValue());
        }
        autoSizeColumns(sheet, headers.length);
    }

    private void createExpensesByDepartmentSheet(Workbook workbook, Integer eventId) {
        Sheet sheet = workbook.createSheet("Expenses By Department");
        String[] headers = {"Department ID", "Department Name", "Total Amount"};
        CellStyle headerCellStyle = createHeaderCellStyle(workbook);

        Row headerRow = sheet.createRow(0);
        for (int col = 0; col < headers.length; col++) {
            Cell cell = headerRow.createCell(col);
            cell.setCellValue(headers[col]);
            cell.setCellStyle(headerCellStyle);
        }

        List<ExpenseByDepartmentDTO> data = expenseService.getExpensesByDepartmentForEvent(eventId);
        int rowNum = 1;
        for (ExpenseByDepartmentDTO item : data) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(item.getDepartmentId());
            row.createCell(1).setCellValue(item.getDepartmentName());
            row.createCell(2).setCellValue(item.getTotalAmount().doubleValue());
        }
        autoSizeColumns(sheet, headers.length);
    }

    private void createPaymentMethodSummarySheet(Workbook workbook, Integer eventId) {
        Sheet sheet = workbook.createSheet("Payment Method Summary");
        String[] headers = {"Payment Method", "Total Amount"};
        CellStyle headerCellStyle = createHeaderCellStyle(workbook);

        Row headerRow = sheet.createRow(0);
        for (int col = 0; col < headers.length; col++) {
            Cell cell = headerRow.createCell(col);
            cell.setCellValue(headers[col]);
            cell.setCellStyle(headerCellStyle);
        }

        List<PaymentMethodSummaryDTO> data = expenseService.getPaymentMethodSummariesByEventId(eventId);
        int rowNum = 1;
        for (PaymentMethodSummaryDTO item : data) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(item.getPaymentMethod());
            row.createCell(1).setCellValue(item.getTotalAmount().doubleValue());
        }
        autoSizeColumns(sheet, headers.length);
    }

    private void createExpenseCountByStatusSheet(Workbook workbook, Integer eventId) {
        Sheet sheet = workbook.createSheet("Expense Count by Status");
        String[] headers = {"Status", "Count"};
        CellStyle headerCellStyle = createHeaderCellStyle(workbook);

        Row headerRow = sheet.createRow(0);
        for (int col = 0; col < headers.length; col++) {
            Cell cell = headerRow.createCell(col);
            cell.setCellValue(headers[col]);
            cell.setCellStyle(headerCellStyle);
        }

        List<ExpenseSummaryByStatusDTO> data = expenseService.getExpenseCountByStatusForEvent(eventId);
        int rowNum = 1;
        for (ExpenseSummaryByStatusDTO item : data) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(item.getStatus().name());
            row.createCell(1).setCellValue(item.getCount());
        }
        autoSizeColumns(sheet, headers.length);
    }

    private CellStyle createHeaderCellStyle(Workbook workbook) {
        CellStyle headerCellStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerFont.setColor(IndexedColors.WHITE.getIndex());
        headerCellStyle.setFont(headerFont);
        headerCellStyle.setFillForegroundColor(IndexedColors.BLUE.getIndex());
        headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return headerCellStyle;
    }

    private void autoSizeColumns(Sheet sheet, int numColumns) {
        for (int i = 0; i < numColumns; i++) {
            sheet.autoSizeColumn(i);
        }
    }
}