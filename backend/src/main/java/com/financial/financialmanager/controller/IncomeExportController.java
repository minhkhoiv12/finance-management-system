package com.financial.financialmanager.controller;

import com.financial.financialmanager.service.IncomeExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;

@RestController
@RequiredArgsConstructor
public class IncomeExportController {
    private static final String FILE_NAME = "bao_cao_thu_nhap.xlsx";
    private static final MediaType EXCEL_MEDIA_TYPE = MediaType.parseMediaType(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    private final IncomeExportService incomeExportService;

    @GetMapping("/excel/download/income")
    public ResponseEntity<byte[]> downloadIncomeExcel() {
        byte[] file = incomeExportService.exportCurrentUserIncomes();
        return ResponseEntity.ok()
                .contentType(EXCEL_MEDIA_TYPE)
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment()
                        .filename(FILE_NAME, StandardCharsets.UTF_8)
                        .build()
                        .toString())
                .body(file);
    }
}
