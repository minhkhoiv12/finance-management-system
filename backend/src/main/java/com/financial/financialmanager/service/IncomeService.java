package com.financial.financialmanager.service;

import com.financial.financialmanager.dto.IncomeDTO;
import com.financial.financialmanager.entity.CategoryEntity;
import com.financial.financialmanager.entity.IncomeEntity;
import com.financial.financialmanager.entity.ProfileEntity;
import com.financial.financialmanager.repository.CategoryRepository;
import com.financial.financialmanager.repository.IncomeRepository;
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
public class IncomeService {
    private final CategoryRepository categoryRepository;
    private final IncomeRepository incomeRepository;
    private final ProfileService profileService;
    public IncomeDTO addIncome(IncomeDTO dto) {
        ProfileEntity profile = profileService.getCurrentProfile();
        CategoryEntity category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        IncomeEntity newIncome = toEntity(dto, profile, category);
        newIncome = incomeRepository.save(newIncome);
        return toDTO(newIncome);
    }
    public List<IncomeDTO> getCurrentMonthIncomesForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<IncomeEntity> list = incomeRepository.findByProfileIdOrderByDateDesc(profile.getId());
        return list.stream().map(this::toDTO).toList();
    }
    public void deleteIncome(Long incomeId) {
        ProfileEntity profile = profileService.getCurrentProfile();
        IncomeEntity entity = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        if(!entity.getProfile().getId().equals(profile.getId())) {
            throw new RuntimeException("Unauthorized to delete this expense");
        }
        incomeRepository.delete(entity);

    }
    // get latest 5 incomes for current user
    public List<IncomeDTO> getLatest5IncomesForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<IncomeEntity> list = incomeRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId());
        return list.stream().map(this::toDTO).toList();
    }

    //get total incomes for current user
    public BigDecimal getTotalIncomeForCurrentUser(){
        ProfileEntity profile = profileService.getCurrentProfile();
        BigDecimal total = incomeRepository.findTotalIncomeByProfileId(profile.getId());
        return total !=null ? total: BigDecimal.ZERO;
    }

    // Bộ lọc giao dịch thu nhập: mọi điều kiện tùy chọn, kết hợp theo AND.
    // Dùng Specification để chỉ build predicate cho điều kiện được cung cấp —
    // tránh mẫu "(:param IS NULL OR ...)" mà PostgreSQL không suy luận được kiểu tham số.
    public List<IncomeDTO> filterIncomes(LocalDate startDate, LocalDate endDate, String keyword,
                                         String sortField, String sortOrder) {
        ProfileEntity profile = profileService.getCurrentProfile();
        String kw = keyword == null ? "" : keyword.trim();

        Specification<IncomeEntity> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("profile").get("id"), profile.getId()));
            if (startDate != null) predicates.add(cb.greaterThanOrEqualTo(root.get("date"), startDate));
            if (endDate != null) predicates.add(cb.lessThanOrEqualTo(root.get("date"), endDate));
            if (!kw.isEmpty()) predicates.add(cb.like(cb.lower(root.get("name")), "%" + kw.toLowerCase() + "%"));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        List<IncomeEntity> list = incomeRepository.findAll(spec);

        Comparator<IncomeEntity> comparator = switch (sortField == null ? "date" : sortField.toLowerCase()) {
            case "amount" -> Comparator.comparing(IncomeEntity::getAmount, Comparator.nullsFirst(Comparator.naturalOrder()));
            case "name"   -> Comparator.comparing(e -> e.getName() == null ? "" : e.getName().toLowerCase());
            default       -> Comparator.comparing(IncomeEntity::getDate, Comparator.nullsFirst(Comparator.naturalOrder()));
        };
        comparator = comparator.thenComparing(IncomeEntity::getId);
        if ("desc".equalsIgnoreCase(sortOrder)) comparator = comparator.reversed();

        return list.stream().sorted(comparator).map(this::toDTO).toList();
    }
    private IncomeEntity toEntity(IncomeDTO dto, ProfileEntity profile, CategoryEntity category) {
        return IncomeEntity.builder()
                .name(dto.getName())
                .icon(dto.getIcon())
                .amount(dto.getAmount())
                .date(dto.getDate())
                .profile(profile)
                .category(category)
                .build();
    }
    private IncomeDTO toDTO(IncomeEntity entity) {
        return IncomeDTO.builder()
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
