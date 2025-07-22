package com.mavent.dev.repository;

import com.mavent.dev.entity.Expenses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpensesRepository extends JpaRepository<Expenses, Integer> {
    List<Expenses> findByEventIdAndCreatedByAccountId(int eventId, int accountId);
    List<Expenses> findByEventId(int eventId);
    Expenses findByExpenseId(int expenseId);
}
