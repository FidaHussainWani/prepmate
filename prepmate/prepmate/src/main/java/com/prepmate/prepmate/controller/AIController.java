package com.prepmate.prepmate.controller;

import com.prepmate.prepmate.dto.ai.AIResponse;
import com.prepmate.prepmate.dto.ai.AISummaryRequest;
import com.prepmate.prepmate.service.AIService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    @PostMapping("/summarize")
    public AIResponse summarizeNote(
            @Valid @RequestBody AISummaryRequest request,
            Authentication authentication) {

        String result = aiService.summarizeNote(
                request.getNoteId(),
                authentication.getName()
        );

        return new AIResponse(result);
    }
}