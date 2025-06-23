package com.mavent.dev.repository;

import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.RequestType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestTypeRepository extends JpaRepository<RequestType, Integer> {
    List<RequestType> findAllBy();
}
