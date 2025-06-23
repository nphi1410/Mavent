package com.mavent.dev.repository;

import com.mavent.dev.entity.Proposal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    
}
