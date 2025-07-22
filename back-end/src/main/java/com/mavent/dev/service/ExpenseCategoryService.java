package com.mavent.dev.service;

import com.mavent.dev.entity.ExpenseCategories;

import java.util.List;

public interface ExpenseCategoryService {

    List<ExpenseCategories> getAllExpenseCategories();

    ExpenseCategories getCategoryById(int categoryId);
}
