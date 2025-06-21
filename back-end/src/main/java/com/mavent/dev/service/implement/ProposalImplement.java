package com.mavent.dev.service.implement;

import com.mavent.dev.dto.event.ProposalDTO;
import com.mavent.dev.entity.Proposal;
import com.mavent.dev.repository.ProposalRepository;
import com.mavent.dev.service.ProposalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ProposalImplement implements ProposalService {
    private final ProposalRepository proposalRepository;

    @Override
    public ProposalDTO createProposalItem(Integer eventId, ProposalDTO dto) {
        Proposal proposal = Proposal.builder()
                .eventId(eventId)
                .title(dto.getTitle())
                .proposalLink(dto.getProposalLink())
                .notes(dto.getNotes())
//                .createdByAccountId(dto.getCreatedByAccountId())
                .defenseDate(dto.getDefenseDate())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Proposal savedProposal = proposalRepository.save(proposal);

        return ProposalDTO.builder()
                .eventId(eventId)
                .title(dto.getTitle())
                .proposalLink(dto.getProposalLink())
                .notes(dto.getNotes())
//                .createdByAccountId(dto.getCreatedByAccountId())
                .defenseDate(dto.getDefenseDate())
                .build();
    }
}
