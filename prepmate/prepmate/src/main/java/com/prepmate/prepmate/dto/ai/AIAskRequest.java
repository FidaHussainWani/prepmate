package com.prepmate.prepmate.dto.ai;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AIAskRequest {

    @NotNull
    private Long noteId;

    @NotBlank
    private String question;
}