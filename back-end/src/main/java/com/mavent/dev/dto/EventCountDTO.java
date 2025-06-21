package com.mavent.dev.dto;

import java.time.YearMonth;

public interface EventCountDTO {
    String getYearMonth();             // From DATE_FORMAT(..., '%Y-%m')
    Integer getTotalEvent();
}
