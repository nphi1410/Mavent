package com.mavent.dev.service;

import com.mavent.dev.entity.Income;

import java.util.List;

public interface IncomeService {
    List<Income> getAll();

    Income getById(Integer id);

    Income save(Income income);

    void delete(Integer id);
}
