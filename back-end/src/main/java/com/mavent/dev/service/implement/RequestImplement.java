package com.mavent.dev.service.implement;

import com.mavent.dev.dto.request.CreateRequestDTO;
import com.mavent.dev.dto.request.ProcessRequestDTO;
import com.mavent.dev.dto.request.RequestDTO;
import com.mavent.dev.dto.request.UpdateRequestDTO;
import com.mavent.dev.entity.Request;
import com.mavent.dev.entity.Task;
import com.mavent.dev.entity.TaskAttendee;
import com.mavent.dev.mapper.RequestMapper;
import com.mavent.dev.repository.RequestRepository;
import com.mavent.dev.repository.TaskAttendeeRepository;
import com.mavent.dev.repository.TaskRepository;
import com.mavent.dev.service.AccountService;
import com.mavent.dev.service.NotificationService;
import com.mavent.dev.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RequestImplement implements RequestService {
    @Autowired
    RequestRepository requestRepository;
    @Autowired
    @Lazy
    private AccountService accountService;
    @Autowired
    private TaskAttendeeRepository taskAttendeeRepository;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private NotificationService notificationService;
    @Override
    public List<RequestDTO> getRequestByAccountAndEventId(Integer accountId, Integer eventId) {
        return requestRepository.getRequests(
                null,
                eventId,
                accountId,
                null,
                null,
                null,
                Sort.by(Sort.Direction.DESC, "created_at"));
    }

    @Override
    public List<RequestDTO> getRequestsByEventId(Integer eventId) {
        return requestRepository.getRequests(
                null,
                eventId,
                null,
                null,
                null,
                null,
                Sort.by(Sort.Direction.DESC, "created_at"));
    }

    @Override
    public List<RequestDTO> getRequestByEventIdAndDepartmentId(Integer eventId, Integer departmentId) {
        return requestRepository.getRequests(
                null,
                eventId,
                null,
                null,
                departmentId,
                null,
                Sort.by(Sort.Direction.DESC, "created_at"));
    }


    @Override
    public Request getRequestByRequestId(Integer requestId) {
        return requestRepository.findByRequestId(requestId);
    }

    @Override
    public boolean addRequest(CreateRequestDTO requestDTO) {
        try {
            Request request = RequestMapper.toEntity(requestDTO);
            request.setCreatedAt(LocalDateTime.now());
            request.setStatus(Request.Status.PENDING);
            requestRepository.save(request);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean updateRequest(UpdateRequestDTO requestDTO, Integer requestId) {
        try {
            Request request = requestRepository.findByRequestId(requestId);
            if (request == null) {
                return false;
            }

            request.setStatus(Request.Status.valueOf(requestDTO.getStatus()));
            request.setResponseByAccountId(requestDTO.getResponseByAccountId());
            request.setResponseContent(requestDTO.getResponseContent());
            request.setUpdatedAt(LocalDateTime.now());
            requestRepository.save(request);

            // Xử lý logic cho Cancel Task request
            if (request.getRequestTypeId() == 4) {
                if ("REJECTED".equals(requestDTO.getStatus())) {
                    TaskAttendee attendee = taskAttendeeRepository
                            .findByTaskIdAndAccountId(request.getTaskId(), request.getRequestByAccountId())
                            .orElse(null);

                    if (attendee != null) {
                        attendee.setStatus(TaskAttendee.Status.INVITED);
                        taskAttendeeRepository.save(attendee);
                    }

                    Task task = taskRepository.findById(request.getTaskId()).orElse(null);
                    String taskTitle = task != null ? task.getTitle() : "Unknown Task";

                    notificationService.createNotification(
                            request.getRequestByAccountId(),
                            task.getEventId(),
                            request.getRequestId(),
                            task.getTaskId(),
                            "CANNOT REJECT TASK",
                            "Your cancel request for task '" + taskTitle + "' has been rejected. You are still assigned to the task."
                    );

                } else if ("APPROVED".equals(requestDTO.getStatus())) {
                    TaskAttendee attendee = taskAttendeeRepository
                            .findByTaskIdAndAccountId(request.getTaskId(), request.getRequestByAccountId())
                            .orElse(null);

                    if (attendee != null) {
                        attendee.setStatus(TaskAttendee.Status.DECLINED);
                        taskAttendeeRepository.save(attendee);
                    }

                    Task task = taskRepository.findById(request.getTaskId()).orElse(null);
                    String taskTitle = task != null ? task.getTitle() : "Unknown Task";

                    notificationService.createNotification(
                            request.getRequestByAccountId(),
                            task.getEventId(),
                            request.getRequestId(),
                            task.getTaskId(),
                            "TASK CANCEL APPROVED",
                            "Your cancel request for task '" + taskTitle + "' has been approved. You are no longer assigned to this task."
                    );
                }
            }

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    @Override
    @Transactional
    public boolean processRequest(Integer requestId, ProcessRequestDTO processRequestDTO) {
        try {
            Request request = requestRepository.findByRequestId(requestId);
            if (request == null || !request.getStatus().equals(Request.Status.PENDING)) {
                return false;
            }

            // Cập nhật request
            request.setStatus(Request.Status.valueOf(processRequestDTO.getStatus()));
            request.setResponseByAccountId(processRequestDTO.getResponseByAccountId());
            request.setResponseContent(processRequestDTO.getResponseContent());
            request.setUpdatedAt(LocalDateTime.now());
            requestRepository.save(request);

            // Nếu là cancel task request và được approve
            if (request.getRequestTypeId() == 4 && "APPROVED".equals(processRequestDTO.getStatus())) {
                // Cập nhật status của attendee thành DECLINED
                TaskAttendee attendee = taskAttendeeRepository
                        .findByTaskIdAndAccountId(request.getTaskId(), request.getRequestByAccountId())
                        .orElse(null);

                if (attendee != null) {
                    attendee.setStatus(TaskAttendee.Status.DECLINED);
                    taskAttendeeRepository.save(attendee);
                }
            } else if (request.getRequestTypeId() == 4 && "REJECTED".equals(processRequestDTO.getStatus())) {
                // Nếu request bị reject, đưa attendee về trạng thái INVITED
                TaskAttendee attendee = taskAttendeeRepository
                        .findByTaskIdAndAccountId(request.getTaskId(), request.getRequestByAccountId())
                        .orElse(null);

                if (attendee != null) {
                    attendee.setStatus(TaskAttendee.Status.INVITED);
                    taskAttendeeRepository.save(attendee);
                }
            }

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
