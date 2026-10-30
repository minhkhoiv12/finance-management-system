package com.financial.financialmanager.service;

import com.financial.financialmanager.dto.ExpenseDTO;
import com.financial.financialmanager.entity.CategoryEntity;
import com.financial.financialmanager.entity.ExpenseEntity;
import com.financial.financialmanager.entity.ProfileEntity;
import com.financial.financialmanager.repository.CategoryRepository;
import com.financial.financialmanager.repository.ExpenseRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final CategoryRepository categoryRepository;
    private final ExpenseRepository expenseRepository;
    private final ProfileService profileService;
    public ExpenseDTO addExpense(ExpenseDTO dto) {
        ProfileEntity profile = profileService.getCurrentProfile();
        CategoryEntity category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        ExpenseEntity newExpense = toEntity(dto, profile, category);
        newExpense = expenseRepository.save(newExpense);
        return toDTO(newExpense);
    }

    public List<ExpenseDTO> getCurrentMonthExpenseForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<ExpenseEntity> list = expenseRepository.findByProfileIdOrderByDateDesc(profile.getId());
        return list.stream().map(this::toDTO).toList();
    }

    public void deleteExpense(Long expenseId) {
        ProfileEntity profile = profileService.getCurrentProfile();
        ExpenseEntity entity = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        if(!entity.getProfile().getId().equals(profile.getId())) {
            throw new RuntimeException("Unauthorized to delete this expense");
        }
        expenseRepository.delete(entity);

    }
    // get latest 5 expense for current user
    public List<ExpenseDTO> getLatest5ExpensesForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<ExpenseEntity> list = expenseRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId());
        return list.stream().map(this::toDTO).toList();
    }

    //get total expenses for current user
    public BigDecimal getTotalExpenseForCurrentUser(){
        ProfileEntity profile = profileService.getCurrentProfile();
        BigDecimal total = expenseRepository.findTotalExpenseByProfileId(profile.getId());
        return total !=null ? total: BigDecimal.ZERO;
    }

    // Bộ lọc giao dịch chi tiêu: mọi điều kiện tùy chọn, kết hợp theo AND.
    // Dùng Specification để chỉ build predicate cho điều kiện được cung cấp —
    // tránh mẫu "(:param IS NULL OR ...)" mà PostgreSQL không suy luận được kiểu tham số.
    public List<ExpenseDTO> filterExpenses(LocalDate startDate, LocalDate endDate, String keyword,
                                           String sortField, String sortOrder) {
        ProfileEntity profile = profileService.getCurrentProfile();
        String kw = keyword == null ? "" : keyword.trim();

        Specification<ExpenseEntity> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("profile").get("id"), profile.getId()));
            if (startDate != null) predicates.add(cb.greaterThanOrEqualTo(root.get("date"), startDate));
            if (endDate != null) predicates.add(cb.lessThanOrEqualTo(root.get("date"), endDate));
            if (!kw.isEmpty()) predicates.add(cb.like(cb.lower(root.get("name")), "%" + kw.toLowerCase() + "%"));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        List<ExpenseEntity> list = expenseRepository.findAll(spec);

        Comparator<ExpenseEntity> comparator = switch (sortField == null ? "date" : sortField.toLowerCase()) {
            case "amount" -> Comparator.comparing(ExpenseEntity::getAmount, Comparator.nullsFirst(Comparator.naturalOrder()));
            case "name"   -> Comparator.comparing(e -> e.getName() == null ? "" : e.getName().toLowerCase());
            default       -> Comparator.comparing(ExpenseEntity::getDate, Comparator.nullsFirst(Comparator.naturalOrder()));
        };
        comparator = comparator.thenComparing(ExpenseEntity::getId);
        if ("desc".equalsIgnoreCase(sortOrder)) comparator = comparator.reversed();

        return list.stream().sorted(comparator).map(this::toDTO).toList();
    }
    //Notications
    public List<ExpenseDTO> getExpensesForUserOnDate(Long profileId, LocalDate date) {
        List<ExpenseEntity> list = expenseRepository.findByProfileIdAndDate(profileId, date);
        return list.stream().map(this::toDTO).toList();
    }
    private ExpenseEntity toEntity(ExpenseDTO dto, ProfileEntity profile, CategoryEntity category) {
        return ExpenseEntity.builder()
                .name(dto.getName())
                .icon(dto.getIcon())
                .amount(dto.getAmount())
                .date(dto.getDate())
                .profile(profile)
                .category(category)
                .build();
    }
    private ExpenseDTO toDTO(ExpenseEntity entity) {
        return ExpenseDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .icon(entity.getIcon())
                .categoryId(entity.getCategory() != null ? entity.getCategory().getId(): null)
                .categoryName(entity.getCategory() !=null ? entity.getCategory().getName(): "N/A")
                .amount(entity.getAmount())
                .date(entity.getDate())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();

    }
}
