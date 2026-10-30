package com.financial.financialmanager.service;

import com.financial.financialmanager.dto.ExpenseDTO;
import com.financial.financialmanager.dto.IncomeDTO;
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

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.stream.IntStream;

@Service
public class ExcelService {

    public void writeIncomesToExcel(OutputStream os, List<IncomeDTO> incomes) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()){
            Sheet sheet = workbook.createSheet("Incomes");
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("S.No");
            header.createCell(1).setCellValue("Name");
            header.createCell(2).setCellValue("Category");
            header.createCell(3).setCellValue("Amount");
            header.createCell(4).setCellValue("Date");
            IntStream.range(0, incomes.size())
                    .forEach(i -> {
                        IncomeDTO income = incomes.get(i);
                        Row row = sheet.createRow(i +1);
                        row.createCell(0).setCellValue(i+1);
                        row.createCell(1).setCellValue(income.getName() != null ? income.getName(): "N/A");
                        row.createCell(2).setCellValue(income.getCategoryId() != null ? income.getCategoryName(): "N/A");
                        row.createCell(3).setCellValue(income.getAmount() != null ? income.getAmount().doubleValue(): 0);
                        row.createCell(4).setCellValue(income.getDate() != null ? income.getDate().toString(): "N/A");
                    });
            workbook.write(os);
        }
    }


    public void writeExpenseToExcel(OutputStream os, List<ExpenseDTO> expenses) throws IOException {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Chi tiêu");
            sheet.createFreezePane(0, 2);
            String[] columns = {"STT", "Ngày", "Tên khoản chi", "Danh mục", "Số tiền (VNĐ)"};
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
            Cell titleCell = title.createCell(0); titleCell.setCellValue("BÁO CÁO CHI TIÊU THÁNG HIỆN TẠI"); titleCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new org.apache.poi.ss.util.CellRangeAddress(0, 0, 0, 4));
            Row header = sheet.createRow(1); header.setHeightInPoints(24);
            for (int i = 0; i < columns.length; i++) { Cell cell = header.createCell(i); cell.setCellValue(columns[i]); cell.setCellStyle(headerStyle); }

            java.math.BigDecimal total = java.math.BigDecimal.ZERO;
            for (int i = 0; i < expenses.size(); i++) {
                ExpenseDTO expense = expenses.get(i); Row row = sheet.createRow(i + 2);
                CellStyle rowStyle = i % 2 == 1 ? alternateStyle : dataStyle;
                cell(row, 0, i + 1, rowStyle);
                cell(row, 1, expense.getDate() == null ? "" : java.sql.Date.valueOf(expense.getDate()), dateStyle);
                cell(row, 2, expense.getName() == null ? "" : expense.getName(), rowStyle);
                cell(row, 3, expense.getCategoryName() == null ? "Chưa phân loại" : expense.getCategoryName(), rowStyle);
                cell(row, 4, expense.getAmount() == null ? 0 : expense.getAmount().doubleValue(), amountStyle);
                total = total.add(expense.getAmount() == null ? java.math.BigDecimal.ZERO : expense.getAmount());
            }

            CellStyle totalStyle = style(workbook, new XSSFColor(new byte[]{(byte) 254, (byte) 226, (byte) 226}, null), IndexedColors.DARK_RED.getIndex(), true, HorizontalAlignment.RIGHT);
            Row totalRow = sheet.createRow(expenses.size() + 2);
            cell(totalRow, 3, "TỔNG CHI TIÊU", totalStyle); cell(totalRow, 4, total.doubleValue(), totalStyle);
            sheet.setAutoFilter(new org.apache.poi.ss.util.CellRangeAddress(1, Math.max(1, expenses.size() + 1), 0, 4));
            int[] widths = {8, 16, 30, 24, 20}; for (int i = 0; i < widths.length; i++) sheet.setColumnWidth(i, widths[i] * 256);
            workbook.write(os);
        }
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
