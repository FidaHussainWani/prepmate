package com.prepmate.prepmate.dto.note;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class NoteRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    private Long categoryId;

    private List<Long> tagIds;
}