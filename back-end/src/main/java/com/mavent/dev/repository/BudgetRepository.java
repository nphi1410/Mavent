package com.mavent.dev.repository;

import com.mavent.dev.entity.Budgets;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BudgetRepository extends JpaRepository<Budgets, Integer> {
    Budgets findByEventId(int eventId);
}
