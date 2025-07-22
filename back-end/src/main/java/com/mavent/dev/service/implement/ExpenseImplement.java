package com.mavent.dev.service.implement;

import com.mavent.dev.dto.EventTotalExpenseDTO;
import com.mavent.dev.dto.ExpenseByCategoryDTO;
import com.mavent.dev.dto.ExpenseByDepartmentDTO;
import com.mavent.dev.dto.ExpenseSummaryByStatusDTO;
import com.mavent.dev.entity.Expense;
import com.mavent.dev.entity.ExpenseCategory;
import com.mavent.dev.entity.Department;
import com.mavent.dev.mapper.ExpenseMapper;
import com.mavent.dev.repository.DepartmentRepository;
import com.mavent.dev.repository.ExpenseCategoryRepository;
import com.mavent.dev.repository.ExpenseRepository;
import com.mavent.dev.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseImplement implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseCategoryRepository expenseCategoryRepository;
    private final DepartmentRepository departmentRepository;
    private final ExpenseMapper expenseMapper;

    /**
     * Retrieves the total expense for a specific event.
     * @param eventId The ID of the event.
     * @return EventTotalExpenseDTO containing the event ID and total amount.
     */
    @Override
    public EventTotalExpenseDTO getTotalExpenseByEventId(Integer eventId) {
        BigInteger totalAmount = expenseRepository.findTotalAmountByEventId(eventId);
        return new EventTotalExpenseDTO(eventId, totalAmount != null ? totalAmount : BigInteger.ZERO);
    }

    /**
     * Retrieves expenses categorized by category for a specific event.
     * @param eventId The ID of the event.
     * @return A list of ExpenseByCategoryDTO, each containing category details and total amount for that category.
     */
    @Override
    public List<ExpenseByCategoryDTO> getExpensesByCategoryForEvent(Integer eventId) {
        List<Object[]> results = expenseRepository.findTotalAmountByCategoryForEvent(eventId);
        return results.stream()
                .map(row -> {
                    Integer categoryId = (Integer) row[0];
                    BigInteger totalAmount = (BigInteger) row[1];
                    Optional<ExpenseCategory> category = expenseCategoryRepository.findByCategoryId(categoryId);
                    String categoryName = category.map(ExpenseCategory::getName).orElse("Unknown Category");
                    return new ExpenseByCategoryDTO(categoryId, categoryName, totalAmount);
                })
                .collect(Collectors.toList());
    }

    /**
     * Retrieves expenses categorized by department for a specific event.
     * @param eventId The ID of the event.
     * @return A list of ExpenseByDepartmentDTO, each containing department details and total amount for that department.
     */
    @Override
    public List<ExpenseByDepartmentDTO> getExpensesByDepartmentForEvent(Integer eventId) {
        List<Object[]> results = expenseRepository.findTotalAmountByDepartmentForEvent(eventId);
        return results.stream()
                .map(row -> {
                    Integer departmentId = (Integer) row[0];
                    BigInteger totalAmount = (BigInteger) row[1];
                    Department departmentEntity = departmentRepository.findByDepartmentId(departmentId);
                    Optional<Department> department = Optional.ofNullable(departmentEntity);
                    String departmentName = department.map(Department::getName).orElse("Unknown Department");
                    return new ExpenseByDepartmentDTO(departmentId, departmentName, totalAmount);
                })
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all distinct payment methods used in expenses.
     * @return A set of strings representing distinct payment methods.
     */
    @Override
    public Set<String> getDistinctPaymentMethodsByEventId(Integer eventId) { // <--- Đã sửa đổi tên phương thức
        return expenseRepository.findDistinctPaymentMethodsByEventId(eventId); // <--- Gọi phương thức repository mới
    }


    /**
     * Retrieves the count of expenses grouped by their status.
     * @return A list of ExpenseSummaryByStatusDTO, each containing a status and the count of expenses with that status.
     */
    @Override
    public List<ExpenseSummaryByStatusDTO> getExpenseCountByStatusForEvent(Integer eventId) { // <--- Đã sửa đổi tên phương thức
        List<Object[]> results = expenseRepository.countExpensesByStatusForEvent(eventId); // <--- Gọi phương thức repository mới
        return results.stream()
                .map(row -> new ExpenseSummaryByStatusDTO((Expense.Status) row[0], (Long) row[1]))
                .collect(Collectors.toList());
    }
}