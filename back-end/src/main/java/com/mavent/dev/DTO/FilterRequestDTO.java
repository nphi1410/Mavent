package com.mavent.dev.DTO;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FilterRequestDTO {
    private String name;
    private String status;
    private List<Integer> tagIds;
    private String sortType = "START_DATE_ASC";
    private int page;
    private int size = 10;
    private String type;
    private boolean isTrending;
}
