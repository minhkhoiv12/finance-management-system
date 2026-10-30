package com.financial.financialmanager.controller;

import com.financial.financialmanager.service.ExcelService;
import com.financial.financialmanager.service.ExpenseService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/excel")
@RequiredArgsConstructor
public class ExcelController {
    private  final ExcelService excelService;
    private final ExpenseService expenseService;
    @GetMapping("/download/expense")
    public void downloadExpenseExcel(HttpServletResponse response) throws  IOException {
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=bao_cao_chi_tieu.xlsx");
        excelService.writeExpenseToExcel(response.getOutputStream(),expenseService.getCurrentMonthExpenseForCurrentUser());
    }
}
