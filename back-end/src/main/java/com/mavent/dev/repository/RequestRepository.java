package com.mavent.dev.repository;

import com.mavent.dev.dto.request.RequestDTO;
import com.mavent.dev.entity.Request;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Integer> {
    List<Request> findByRequestByAccountIdAndEventId(Integer requestByAccountId, Integer eventId, Sort sort);

    @Query(value = """
    SELECT 
        r.*,
        rt.name AS requestType,
        d.name AS department,
        t.title AS task,
        reqa.full_name AS requestByUsername,
        resa.full_name AS responseByUsername,
        CAST(r.created_at AS CHAR) AS createdAt,
        CAST(r.updated_at AS CHAR) AS updatedAt
    FROM requests r
    LEFT JOIN request_types rt ON r.request_type_id = rt.request_type_id
    LEFT JOIN accounts reqa ON r.request_by_account_id = reqa.account_id
    LEFT JOIN accounts resa ON r.response_by_account_id = resa.account_id
    LEFT JOIN tasks t ON r.task_id = t.task_id
    LEFT JOIN departments d ON r.department_id = d.department_id
    WHERE (:requestId IS NULL OR r.request_id = :requestId)
      AND (:eventId IS NULL OR r.event_id = :eventId)
      AND (:requestByAccountId IS NULL OR r.request_by_account_id = :requestByAccountId)
      AND (:responseByAccountId IS NULL OR r.response_by_account_id = :responseByAccountId)
      AND (:departmentId IS NULL OR r.department_id = :departmentId)
      AND (:requestTypeId IS NULL OR r.request_type_id = :requestTypeId)
""", nativeQuery = true)
    List<RequestDTO> getRequests(
            @Param("requestId") Integer requestId,
            @Param("eventId") Integer eventId,
            @Param("requestByAccountId") Integer requestByAccountId,
            @Param("responseByAccountId") Integer responseByAccountId,
            @Param("departmentId") Integer departmentId,
            @Param("requestTypeId") Integer requestTypeId,
            Sort sort
    );

    List<Request> findByEventIdAndDepartmentId(Integer eventId, Integer departmentId, Sort sort);
    Request findByRequestId(Integer requestId);
//    boolean updateRequestByRequestId(Integer requestId, String status, String responseContent, Integer responseByAccountId);
}
