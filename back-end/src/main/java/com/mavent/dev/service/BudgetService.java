package com.mavent.dev.service;

import com.mavent.dev.entity.Budgets;

import java.math.BigInteger;

public interface BudgetService {
    /**
     * Find budget for an event by event ID
     * @param eventId ID of the event
     * @return Budget for the event
     */
    Budgets findByEventId(int eventId);
    
    /**
     * Get remaining budget for an event
     * @param eventId ID of the event
     * @return Remaining budget amount
     */
    BigInteger getRemainingBudget(int eventId);
    
    /**
     * Update spent amount for an event budget
     * @param eventId ID of the event
     * @param amount Amount to add to spent amount
     */
    void updateSpentAmount(int eventId, BigInteger amount);
    
    /**
     * Validate if an expense amount is within the remaining budget
     * @param eventId ID of the event
     * @param expenseAmount Amount of the expense to validate
     * @return true if expense is within budget, false otherwise
     */
    boolean validateExpenseAmount(int eventId, BigInteger expenseAmount);
}
