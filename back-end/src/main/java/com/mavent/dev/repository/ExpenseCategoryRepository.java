package com.mavent.dev.repository;

import com.mavent.dev.entity.ExpenseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExpenseCategoryRepository extends JpaRepository<ExpenseCategory, Integer> { // ĐÃ SỬA: Chuyển từ Long sang Integer
    Optional<ExpenseCategory> findByCategoryId(Integer categoryId);
}