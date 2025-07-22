package com.mavent.dev.service.implement;

import com.mavent.dev.entity.ExpenseCategories;
import com.mavent.dev.repository.ExpenseCategoryRepository;
import com.mavent.dev.service.ExpenseCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseCategoryServiceImplement implements ExpenseCategoryService {

    @Autowired
    private ExpenseCategoryRepository categoryRepository;
    
    @Override
    public List<ExpenseCategories> getAllExpenseCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public ExpenseCategories getCategoryById(int categoryId) {
        return categoryRepository.findExpenseCategoryByCategoryId(categoryId);
    }
}
