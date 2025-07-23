package com.mavent.dev.mapper;

import com.mavent.dev.dto.event.ProposalDTO;
import com.mavent.dev.entity.Proposal;
import org.springframework.stereotype.Component;

@Component
public class ProposalMapper {
    public static ProposalDTO toDto(Proposal proposal) {
        return ProposalDTO.builder()
                .eventId(proposal.getEventId())
                .title(proposal.getTitle())
                .proposalLink(proposal.getProposalLink())
                .notes(proposal.getNotes())
                .defenseDate(proposal.getDefenseDate())
                .build();
    }
}
