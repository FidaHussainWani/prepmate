package com.prepmate.prepmate.dto.ai;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AISummaryRequest {

    @NotNull
    private Long noteId;
}