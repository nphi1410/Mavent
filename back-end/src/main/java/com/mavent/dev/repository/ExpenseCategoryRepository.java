package com.mavent.dev.repository;

import com.mavent.dev.entity.ExpenseCategories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseCategoryRepository extends JpaRepository<ExpenseCategories, Integer> {

    List<ExpenseCategories> findAll();

    ExpenseCategories findExpenseCategoryByCategoryId(int categoryId);
}
