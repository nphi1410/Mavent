package com.mavent.dev.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "task_documents")
public class TaskDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "task_id")
    private Integer taskId;

    @Column(name = "document_id")
    private Integer documentId;

    public TaskDocument() {}

    public TaskDocument(Integer taskId, Integer documentId) {
        this.taskId = taskId;
        this.documentId = documentId;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getTaskId() { return taskId; }
    public void setTaskId(Integer taskId) { this.taskId = taskId; }

    public Integer getDocumentId() { return documentId; }
    public void setDocumentId(Integer documentId) { this.documentId = documentId; }
}