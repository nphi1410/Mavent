package com.mavent.dev.repository;

import com.mavent.dev.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document,Integer> {
    List<Document> findTop5ByOrderByCreatedAtDesc();
    List<Document> findByEventId(Integer eventId);
    List<Document> findByDepartmentId(Integer departmentId);
    List<Document> findByUploaderAccountId(Integer uploaderAccountId);
    List<Document> findByEventIdAndDepartmentId(Integer eventId, Integer departmentId);

}
