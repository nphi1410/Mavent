package com.mavent.dev.service;

import com.mavent.dev.dto.event.ProposalDTO;

public interface ProposalService {
    ProposalDTO createProposalItem(Integer eventId, ProposalDTO dto);
}
