package com.mavent.dev.service;

import com.mavent.dev.entity.Budgets;

public interface BudgetService {
    Budgets findByEventId(int eventId);
}
