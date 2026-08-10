package com.prepmate.prepmate.dto.note;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class NoteResponse {

    private Long id;
    private String title;
    private String content;
    private boolean favorite;

    private Long categoryId;
    private String categoryName;

     private List<Long> tagIds;
    private List<String> tagNames;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}