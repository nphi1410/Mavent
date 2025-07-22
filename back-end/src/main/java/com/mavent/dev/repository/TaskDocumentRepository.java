package com.mavent.dev.repository;

import com.mavent.dev.entity.TaskDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskDocumentRepository extends JpaRepository<TaskDocument, Integer> {

    @Query("SELECT td FROM TaskDocument td WHERE td.taskId = :taskId")
    List<TaskDocument> findByTaskId(@Param("taskId") Integer taskId);

    @Query("SELECT td FROM TaskDocument td WHERE td.documentId = :documentId")
    List<TaskDocument> findByDocumentId(@Param("documentId") Integer documentId);

    void deleteByTaskIdAndDocumentId(Integer taskId, Integer documentId);
}