package com.mavent.dev.service.implement;

import com.mavent.dev.entity.Budgets;
import com.mavent.dev.repository.BudgetRepository;
import com.mavent.dev.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BudgetImplement implements BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Override
    public Budgets findByEventId(int eventId) {
        return budgetRepository.findByEventId(eventId);
    }
}
