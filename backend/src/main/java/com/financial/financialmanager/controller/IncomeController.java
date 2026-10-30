package com.financial.financialmanager.controller;

import com.financial.financialmanager.dto.ExpenseDTO;
import com.financial.financialmanager.dto.IncomeDTO;
import com.financial.financialmanager.service.IncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/incomes")
public class IncomeController {
    private final IncomeService incomeService;
    @PostMapping
    public ResponseEntity<IncomeDTO> addExpense(@RequestBody IncomeDTO dto){
        IncomeDTO saved = incomeService.addIncome(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    @GetMapping
    public ResponseEntity<List<IncomeDTO>> getExpenses(){
        List<IncomeDTO> expenses = incomeService.getCurrentMonthIncomesForCurrentUser();
        return ResponseEntity.ok(expenses);
    }

    // Bộ lọc giao dịch thu nhập: mọi tham số đều tùy chọn
    @GetMapping("/filter")
    public ResponseEntity<List<IncomeDTO>> filterIncomes(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "date") String sortField,
            @RequestParam(required = false, defaultValue = "desc") String sortOrder) {
        List<IncomeDTO> incomes = incomeService.filterIncomes(startDate, endDate, keyword, sortField, sortOrder);
        return ResponseEntity.ok(incomes);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncome(@PathVariable Long id) {
        incomeService.deleteIncome(id);
        return ResponseEntity.noContent().build();
    }

}
