package com.mavent.dev.dto.document;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DocumentPreviewUrlDTO {
    private String sasUrl;
    private String contentType;
    private String fileName;
    private boolean isViewable;
}
