package com.mavent.dev.repository;

import com.mavent.dev.entity.ExpenseCategories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseCategoryRepository extends JpaRepository<ExpenseCategories, Integer> {

    List<ExpenseCategories> findAll();


    Optional<ExpenseCategories> findByCategoryId(Integer integer);

    ExpenseCategories findExpenseCategoryByCategoryId(int categoryId);
}
