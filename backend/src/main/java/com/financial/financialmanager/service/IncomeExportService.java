package com.financial.financialmanager.service;

import com.financial.financialmanager.dto.IncomeDTO;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IncomeExportService {
    private final IncomeService incomeService;

    public byte[] exportCurrentUserIncomes() {
        List<IncomeDTO> incomes = incomeService.getCurrentMonthIncomesForCurrentUser();
        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Thu nhập");
            sheet.createFreezePane(0, 2);
            String[] columns = {"STT", "Ngày", "Tên khoản thu", "Danh mục", "Số tiền (VNĐ)"};
            XSSFColor purple = new XSSFColor(new byte[]{(byte) 91, (byte) 33, (byte) 182}, null);
            XSSFColor lightPurple = new XSSFColor(new byte[]{(byte) 245, (byte) 243, (byte) 255}, null);
            CellStyle titleStyle = style(workbook, purple, IndexedColors.WHITE.getIndex(), true, HorizontalAlignment.CENTER);
            CellStyle headerStyle = style(workbook, purple, IndexedColors.WHITE.getIndex(), true, HorizontalAlignment.CENTER);
            CellStyle dataStyle = style(workbook, null, IndexedColors.BLACK.getIndex(), false, HorizontalAlignment.LEFT);
            CellStyle alternateStyle = style(workbook, lightPurple, IndexedColors.BLACK.getIndex(), false, HorizontalAlignment.LEFT);
            CellStyle dateStyle = style(workbook, null, IndexedColors.BLACK.getIndex(), false, HorizontalAlignment.CENTER);
            dateStyle.setDataFormat(workbook.getCreationHelper().createDataFormat().getFormat("dd/mm/yyyy"));
            CellStyle amountStyle = style(workbook, null, IndexedColors.BLACK.getIndex(), false, HorizontalAlignment.RIGHT);
            amountStyle.setDataFormat(workbook.getCreationHelper().createDataFormat().getFormat("#,##0 \"₫\""));
            Row title = sheet.createRow(0); title.setHeightInPoints(28);
            Cell titleCell = title.createCell(0); titleCell.setCellValue("BÁO CÁO THU NHẬP THÁNG HIỆN TẠI"); titleCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new org.apache.poi.ss.util.CellRangeAddress(0, 0, 0, 4));
            Row header = sheet.createRow(1); header.setHeightInPoints(24);
            for (int i = 0; i < columns.length; i++) { Cell cell = header.createCell(i); cell.setCellValue(columns[i]); cell.setCellStyle(headerStyle); }
            BigDecimal total = BigDecimal.ZERO;
            for (int i = 0; i < incomes.size(); i++) {
                IncomeDTO income = incomes.get(i); Row row = sheet.createRow(i + 2);
                CellStyle rowStyle = i % 2 == 1 ? alternateStyle : dataStyle;
                cell(row, 0, i + 1, rowStyle); cell(row, 1, income.getDate() == null ? "" : java.sql.Date.valueOf(income.getDate()), dateStyle);
                cell(row, 2, income.getName() == null ? "" : income.getName(), rowStyle); cell(row, 3, income.getCategoryName() == null ? "Chưa phân loại" : income.getCategoryName(), rowStyle);
                cell(row, 4, income.getAmount() == null ? 0 : income.getAmount().doubleValue(), amountStyle);
                total = total.add(income.getAmount() == null ? BigDecimal.ZERO : income.getAmount());
            }
            CellStyle totalStyle = style(workbook, new XSSFColor(new byte[]{(byte) 220, (byte) 252, (byte) 231}, null), IndexedColors.DARK_GREEN.getIndex(), true, HorizontalAlignment.RIGHT);
            Row totalRow = sheet.createRow(incomes.size() + 2); cell(totalRow, 3, "TỔNG THU NHẬP", totalStyle); cell(totalRow, 4, total.doubleValue(), totalStyle);
            sheet.setAutoFilter(new org.apache.poi.ss.util.CellRangeAddress(1, Math.max(1, incomes.size() + 1), 0, 4));
            int[] widths = {8, 16, 30, 24, 20}; for (int i = 0; i < widths.length; i++) sheet.setColumnWidth(i, widths[i] * 256);
            workbook.write(outputStream); return outputStream.toByteArray();
        } catch (IOException e) { throw new RuntimeException("Không thể tạo tệp Excel thu nhập", e); }
    }

    private CellStyle style(Workbook workbook, XSSFColor background, short fontColor, boolean bold, HorizontalAlignment alignment) {
        CellStyle style = workbook.createCellStyle(); style.setAlignment(alignment); style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setBorderTop(BorderStyle.THIN); style.setBorderBottom(BorderStyle.THIN); style.setBorderLeft(BorderStyle.THIN); style.setBorderRight(BorderStyle.THIN);
        if (background != null) { ((XSSFCellStyle) style).setFillForegroundColor(background); style.setFillPattern(FillPatternType.SOLID_FOREGROUND); }
        Font font = workbook.createFont(); font.setBold(bold); font.setColor(fontColor); style.setFont(font); return style;
    }

    private void cell(Row row, int index, Object value, CellStyle style) {
        Cell cell = row.createCell(index); if (value instanceof Number number) cell.setCellValue(number.doubleValue()); else if (value instanceof java.sql.Date date) cell.setCellValue(date); else cell.setCellValue(String.valueOf(value)); cell.setCellStyle(style);
    }
}
