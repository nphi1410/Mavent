package com.mavent.dev.repository;

import com.mavent.dev.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Integer> {
    List<Request> findByRequestByAccountIdAndEventId(Integer requestByAccountId, Integer eventId);
    List<Request> findByEventId(Integer requestByEventId);
    Request findByRequestId(Integer requestId);
//    boolean updateRequestByRequestId(Integer requestId, String status, String responseContent, Integer responseByAccountId);
}
