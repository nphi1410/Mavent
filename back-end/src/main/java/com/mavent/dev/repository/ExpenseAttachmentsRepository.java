package com.mavent.dev.repository;

import com.mavent.dev.entity.ExpenseAttachments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseAttachmentsRepository extends JpaRepository<ExpenseAttachments, Integer> {

    List<ExpenseAttachments> findAllByExpenseId(int expenseId);
}
