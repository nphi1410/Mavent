package com.mavent.dev.service.implement;

import com.mavent.dev.entity.Income;
import com.mavent.dev.repository.IncomeRepository;
import com.mavent.dev.service.IncomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncomeImplement implements IncomeService {

    @Autowired
    private IncomeRepository repository;

    @Override
    public List<Income> getAll() {
        return repository.findAll();
    }

    @Override
    public Income getById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Income save(Income income) {
        return repository.save(income);
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
