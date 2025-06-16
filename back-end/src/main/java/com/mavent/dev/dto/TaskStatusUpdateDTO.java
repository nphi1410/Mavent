package com.mavent.dev.dto;

public class TaskStatusUpdateDTO {
    private String status;

    public TaskStatusUpdateDTO() {
    }

    public TaskStatusUpdateDTO(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "TaskStatusUpdateDTO{" +
                "status='" + status + '\'' +
                '}';
    }
}