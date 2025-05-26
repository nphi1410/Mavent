package com.mavent.dev.repository;

import com.mavent.dev.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document,Integer> {
    List<Document> findTop5ByOrderByCreatedAtDesc();
}
