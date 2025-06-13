package com.mavent.dev.service.implement;

import com.mavent.dev.dto.superadmin.EventDTO;
import com.mavent.dev.service.globalservice.ExcelExportService;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class EventExcelExportImplement implements ExcelExportService<EventDTO> {

    @Override
    public void exportToExcel(HttpServletResponse response, List<EventDTO> events) throws IOException {
        // Tạo một workbook Excel mới (tệp .xlsx)
        Workbook workbook = new XSSFWorkbook();
        // Tạo một sheet có tên "Events"
        Sheet sheet = workbook.createSheet("Events");
        // Định dạng ngày giờ cho các trường thời gian
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        // Định nghĩa các tiêu đề cột cho Excel
        String[] headers = {"Event ID", "Name", "Description", "Start Datetime", "End Datetime", "Location", "D-Day Info", "Max Members", "Max Participants", "Status", "Created By", "Is Deleted", "Created At", "Updated At"};

        // Tạo hàng tiêu đề (hàng đầu tiên)
        Row headerRow = sheet.createRow(0);
        // Điền các tiêu đề vào các ô
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
        }

        // Bắt đầu từ hàng thứ hai để ghi dữ liệu sự kiện
        int rowIdx = 1;
        for (EventDTO event : events) {
            Row row = sheet.createRow(rowIdx++); // Tạo hàng mới cho mỗi sự kiện

            // Ghi dữ liệu của từng trường vào các ô tương ứng
            row.createCell(0).setCellValue(event.getEventId());
            row.createCell(1).setCellValue(event.getName());
            row.createCell(2).setCellValue(event.getDescription());
            row.createCell(3).setCellValue(formatDateTime(event.getStartDatetime(), formatter));
            row.createCell(4).setCellValue(formatDateTime(event.getEndDatetime(), formatter));
            row.createCell(5).setCellValue(event.getLocation());
            row.createCell(6).setCellValue(event.getDdayInfo());
            row.createCell(7).setCellValue(event.getMaxMemberNumber());
            row.createCell(8).setCellValue(event.getMaxParticipantNumber());
            // Xử lý trường hợp Status có thể null
            row.createCell(9).setCellValue(event.getStatus() != null ? event.getStatus().name() : "");

            // SỬA LỖI: Kiểm tra null cho getCreatedBy()
            // Nếu getCreatedBy() trả về null, sẽ ghi một chuỗi rỗng vào ô
            // Nếu không null, sẽ chuyển đổi giá trị Integer thành String để ghi vào ô
            row.createCell(10).setCellValue(event.getCreatedBy() != null ? event.getCreatedBy().toString() : ""); // Dòng đã sửa

            // Xử lý trường hợp IsDeleted có thể null
            row.createCell(11).setCellValue(Boolean.TRUE.equals(event.getIsDeleted()) ? "Yes" : "No");
            row.createCell(12).setCellValue(formatDateTime(event.getCreatedAt(), formatter));
            row.createCell(13).setCellValue(formatDateTime(event.getUpdatedAt(), formatter));
        }

        // Thiết lập các header cho phản hồi HTTP để trình duyệt hiểu đây là một tệp Excel
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=events.xlsx");

        // Lấy output stream từ phản hồi và ghi workbook vào đó
        ServletOutputStream out = response.getOutputStream();
        workbook.write(out);
        // Đóng workbook và output stream để giải phóng tài nguyên
        workbook.close();
        out.close();
    }

    /**
     * Phương thức trợ giúp để định dạng LocalDateTime thành chuỗi.
     * Trả về chuỗi rỗng nếu dateTime là null.
     */
    private String formatDateTime(java.time.LocalDateTime dateTime, DateTimeFormatter formatter) {
        return dateTime != null ? dateTime.format(formatter) : "";
    }
}
