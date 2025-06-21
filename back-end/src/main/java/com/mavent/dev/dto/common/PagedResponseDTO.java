package com.mavent.dev.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Generic dto for paginated responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PagedResponseDTO<T> {

    private List<T> content;
    private Integer page;
    private Integer size;
    private Long totalElements;
    private Integer totalPages;
    private Boolean first;
    private Boolean last;
    private Boolean empty;

    // Manual Builder implementation
    public static <T> Builder<T> builder() {
        return new Builder<>();
    }

    public static class Builder<T> {
        private final PagedResponseDTO<T> dto = new PagedResponseDTO<>();

        public Builder<T> content(List<T> content) {
            dto.content = content;
            return this;
        }

        public Builder<T> page(Integer page) {
            dto.page = page;
            return this;
        }

        public Builder<T> size(Integer size) {
            dto.size = size;
            return this;
        }

        public Builder<T> totalElements(Long totalElements) {
            dto.totalElements = totalElements;
            return this;
        }

        public Builder<T> totalPages(Integer totalPages) {
            dto.totalPages = totalPages;
            return this;
        }

        public Builder<T> first(Boolean first) {
            dto.first = first;
            return this;
        }

        public Builder<T> last(Boolean last) {
            dto.last = last;
            return this;
        }

        public Builder<T> empty(Boolean empty) {
            dto.empty = empty;
            return this;
        }

        public PagedResponseDTO<T> build() {
            return dto;
        }
    }
}
