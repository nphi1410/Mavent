package com.mavent.dev.service.implement;

import com.mavent.dev.entity.Budgets;
import com.mavent.dev.repository.BudgetRepository;
import com.mavent.dev.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;

@Service
public class BudgetImplement implements BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Override
    public Budgets findByEventId(int eventId) {
        return budgetRepository.findByEventId(eventId);
    }
    
    @Override
    public BigInteger getRemainingBudget(int eventId) {
        Budgets budget = budgetRepository.findByEventId(eventId);
        if (budget == null) {
            return BigInteger.ZERO;
        }
        
        BigInteger totalAmount = budget.getTotalAmount() != null ? budget.getTotalAmount() : BigInteger.ZERO;
        BigInteger spentAmount = budget.getSpentAmount() != null ? budget.getSpentAmount() : BigInteger.ZERO;
        
        return totalAmount.subtract(spentAmount);
    }
    
    @Override
    @Transactional
    public void updateSpentAmount(int eventId, BigInteger amount) {
        Budgets budget = budgetRepository.findByEventId(eventId);
        if (budget == null) {
            throw new RuntimeException("Budget not found for event ID: " + eventId);
        }
        
        BigInteger currentSpentAmount = budget.getSpentAmount() != null ? budget.getSpentAmount() : BigInteger.ZERO;
        budget.setSpentAmount(currentSpentAmount.add(amount));
        
        budgetRepository.save(budget);
    }
    
    @Override
    public boolean validateExpenseAmount(int eventId, BigInteger expenseAmount) {
        if (expenseAmount == null || expenseAmount.compareTo(BigInteger.ZERO) < 0) {
            return false;
        }
        
        // If expense is zero, it's valid
        if (expenseAmount.equals(BigInteger.ZERO)) {
            return true;
        }
        
        BigInteger remainingBudget = getRemainingBudget(eventId);
        
        // Check if the expense amount is less than or equal to the remaining budget
        return expenseAmount.compareTo(remainingBudget) <= 0;
    }
}
